using System;
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

                  // _mapper.Map(product, productDto);

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

            // [Authorize(Roles = "Admin")]
            [HttpPost]
            public async Task<ActionResult<CreateProductDto>> CreateProduct(
                  [FromForm]CreateProductDto productDto,
                   [FromForm] ProductDetailsDto productDetailsDto)
            {
                  var product = _mapper.Map<Product>(productDto);

                  var arrayColors = new List<Colour>();
                  var arraySizes = new List<Size>();
                  var arrayQuantity = new List<int>();
                  var variantsQuantity = 0;

                  if(productDetailsDto.Colors != null || productDetailsDto.Size != null || productDetailsDto.Quantity != null) {
                        var colors = productDetailsDto.Colors.Split(", ");
                        var sizes = productDetailsDto.Size.Split(", ");
                        var Quantities = productDetailsDto.Quantity.Split(", ");

                        var productDetail = new List<ProductDetails>();
                        for (var i = 0; i < colors.Length; i++)
                        {
                              var color = await _context.Colours.FirstOrDefaultAsync(x => x.Colour_value == colors[i]);
                              arrayColors.Add(color);
                        }
                        for (var i = 0; i < sizes.Length; i++)
                        {
                              var size = await _context.Sizes.FirstOrDefaultAsync(x => x.Size_value == sizes[i]);
                              arraySizes.Add(size);
                        }
                        foreach (var qty in Quantities)
                        {
                              arrayQuantity.Add(Int32.Parse(qty));
                              variantsQuantity += Int32.Parse(qty); 
                        }

                        if(productDto.QuantityInStock != variantsQuantity) return BadRequest(new ProblemDetails{ Title = "Quantity in stock must equal quantity variants"});
                  }

                  // Product
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
                  // Details
                  if(productDetailsDto.Colors != null || productDetailsDto.Size != null || productDetailsDto.Quantity != null) {

                        if((arrayColors.Count() != arrayQuantity.Count()) || (arrayColors.Count() != arraySizes.Count()) || (arraySizes.Count() != arrayQuantity.Count())) {
                              return BadRequest(new ProblemDetails{ Title = "Size, Quantity, Color fieald must equal" });
                        } else {
                              for (var i = 0; i < arrayColors.Count(); i++)
                              {
                                    for (int j = 0; j < arraySizes.Count(); j++) {
                                          var detail = new ProductDetails {
                                                ProductId = product.Id,
                                                ColourId = arrayColors[i].Id,
                                                ColourValue = arrayColors[i].Colour_value,
                                                SizeId = arraySizes[j].Id,
                                                SizeValue = arraySizes[j].Size_value,
                                                Quantity = arrayQuantity[i]
                                          };
                                          _context.ProductDetails.Add(detail);
                                    }
                              }
                        }
                  }
                  var resultDetails = await _context.SaveChangesAsync() > 0;

                  // if (result || resultDetails) return CreatedAtRoute("GetProduct", new { Id = product.Id }, product);
                  if (result || resultDetails) return Ok();
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

            [HttpPost("product-viewcount/{id}")]
            public async Task<ActionResult> ProductViewCount(int id)
            {
                  var product = await _context.Products.FindAsync(id);
                  if(product == null) return BadRequest(new ProblemDetails{Title = "Can't find product"});
                  product.ViewCount = product.ViewCount + 1;

                  var result = await _context.SaveChangesAsync() > 0;

                  if(result) return Ok(result);
                  return BadRequest(new ProblemDetails{Title = "Something went wrong"});
            }

            [HttpGet("product-variants/{id}")]
            public async Task<ActionResult> ProductVariants(int id)
            {
                  var productDetails = await _context.ProductDetails.Where(x => x.ProductId == id).ToListAsync();
                  if(productDetails == null) return BadRequest(new ProblemDetails{Title = "Can't find product"});
                  return Ok(productDetails);
            }
      }
}

