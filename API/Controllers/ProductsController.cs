using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using API.ViewModel;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
      public class ProductsController : BaseController
      {
            private readonly StoreContext _context;
            private readonly IMapper _mapper;
            private readonly ImageService _imageService;
            public ProductsController(StoreContext context, IMapper mapper, ImageService imageService)
            {
                  _imageService = imageService;
                  _mapper = mapper;
                  _context = context;
            }

            [HttpGet]
            public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery] ProductVm productVm)
            {
                  var query = _context.Products
                                .Sort(productVm.OrderBy)
                                .Search(productVm.SearchTerm)
                                .Filter(productVm.Brands, productVm.Types)
                                .AsQueryable();

                  var products = await PagedList<Product>.ToPagedList(query, productVm.PageNumber, productVm.PageSize);

                  Response.AddPaginationHeader(products.PaginationDto);

                  return products;
            }
            [HttpGet("get-select-product")]
            public async Task<ActionResult<List<Product>>> GetSelectProduct()
            {
                  return await _context.Products.ToListAsync();
            }

            [HttpGet("get-product-count")]
            public async Task<int> GetCounterProduct()
            {
                  return await _context.Products.CountAsync();
            }

            [HttpGet("get-colors")]
            public async Task<List<Colour>> GetColors()
            {
                  return await _context.Colours.ToListAsync();
            }
            [HttpGet("get-sizes")]
            public async Task<List<Size>> GetSizes()
            {
                  return await _context.Sizes.ToListAsync();
            }

            [HttpGet("{id}", Name = "GetProduct")]
            public async Task<ActionResult<Product>> GetProductById(int id)
            {
                  var product = await _context.Products.FindAsync(id);

                  if (product == null) return NotFound();

                  return product;
            }


            [HttpGet("filters")]
            public async Task<IActionResult> GetFilters()
            {
                  var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
                  var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

                  return Ok(new { brands, types });
            }

            [Authorize(Roles = "Admin")]
            [HttpPost]
            public async Task<ActionResult<CreateProductDto>> CreateProduct([FromForm]CreateProductDto productDto)
            {
                  var product = _mapper.Map<Product>(productDto);

                  if(productDto.File != null)
                  {
                        var imageResult = await _imageService.AddImageAsync(productDto.File);

                        if(imageResult.Error != null)
                              return BadRequest(new ProblemDetails{ Title = imageResult.Error.Message });

                        product.PictureUrl = imageResult.SecureUrl.ToString();
                        product.PublicId = imageResult.PublicId;
                  }

                  _context.Products.Add(product);

                  var result = await _context.SaveChangesAsync() > 0;

                  if (result) return CreatedAtRoute("GetProduct", new { Id = product.Id }, product);

                  return BadRequest(new ProblemDetails { Title = "Problem creating new product" });
            }

            [Authorize(Roles = "Admin")]
            [HttpPut]
            public async Task<ActionResult> UpdateProduct([FromForm] UpdateProductDto productDto)
            {
                  var product = await _context.Products.FindAsync(productDto.Id);

                  if (product == null) return NotFound();

                  _mapper.Map(productDto, product);

                  if(productDto.File != null)
                  {
                        var imageResult = await _imageService.AddImageAsync(productDto.File);

                        if(imageResult.Error != null)
                              return BadRequest(new ProblemDetails{ Title = imageResult.Error.Message });

                        if(!string.IsNullOrEmpty(product.PublicId))
                              await _imageService.DeleteImageAsync(product.PublicId);

                        product.PictureUrl = imageResult.SecureUrl.ToString();
                        product.PublicId = imageResult.PublicId;
                  }

                  var result = await _context.SaveChangesAsync() > 0;

                  if (result) return Ok(product);

                  return BadRequest(new ProblemDetails { Title = "Problem updating product" });
            }

            [Authorize(Roles = "Admin")]
            [HttpDelete("{id}")]
            public async Task<ActionResult> DeleteProduct(int id)
            {
                  var product = await _context.Products.FindAsync(id);

                  if (product == null) return NotFound();

                  if(!string.IsNullOrEmpty(product.PublicId))
                        await _imageService.DeleteImageAsync(product.PublicId);

                  _context.Products.Remove(product);

                  var result = await _context.SaveChangesAsync() > 0;

                  if (result) return Ok();

                  return BadRequest(new ProblemDetails { Title = "Problem deleting product" });
            }
      }
}

