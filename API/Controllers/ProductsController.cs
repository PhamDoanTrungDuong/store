using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Extensions;
using API.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
     public class ProductsController : BaseController
     {
          private readonly StoreContext _context;
          public ProductsController(StoreContext context)
          {
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

          [HttpGet("{id}")]
          public async Task<ActionResult<Product>> GetProductById(int id){
            var product = await _context.Products.FindAsync(id);

            if(product == null) return NotFound();

            return product;
          }


          [HttpGet("filters")]
          public async Task<IActionResult> GetFilters()
          {
            var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
            var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

            return Ok(new {brands, types});
          }
     }
}