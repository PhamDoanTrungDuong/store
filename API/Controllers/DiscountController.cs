using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
      public class DiscountController : BaseController
      {
            private readonly StoreContext _context;
            private readonly IMapper _mapper;
            public DiscountController(StoreContext context, IMapper mapper)
            {
                  _mapper = mapper;
                  _context = context;
            }

            [HttpGet]
            public async Task<List<ProductDiscount>> GetDiscount()
            {
                return await _context.ProductDiscounts
                        .OrderByDescending(x => x.DateCreate)
                        .ToListAsync();
            }

            [Authorize(Roles = "Admin")]
            [HttpPost]
            public async Task<ActionResult<DiscountDto>> CreateDiscount(int productId, int discount)
            {
                var product = await _context.Products.FindAsync(productId);
                if(product == null) return NotFound();

                var existProduct = await _context.ProductDiscounts.AnyAsync(x => x.productId == productId);
                if(existProduct) return BadRequest(new ProblemDetails{Title = "this product have a discount"});

                var discountProduct = new ProductDiscount
                {
                    DiscountValue = discount,
                    Product = product,
                    productName = product.Name,
                    PictureUrl = product.PictureUrl,
                    Price = product.Price,
                    Type = product.Type,
                    Brand = product.Brand,
                    QuantityInStock = product.QuantityInStock
                };

                _context.ProductDiscounts.Add(discountProduct);

                if(await _context.SaveChangesAsync() > 0) return Ok(_mapper.Map<DiscountDto>(discountProduct));

                return BadRequest(new ProblemDetails{Title = "Failed to create discount for product"});

            }

            [Authorize(Roles = "Admin")]
            [HttpDelete("{id}")]
            public async Task<ActionResult> DeleteDisCount(int id)
            {
                  var dícount = await _context.ProductDiscounts.FindAsync(id);

                  if(dícount != null) {
                        _context.ProductDiscounts.Remove(dícount);
                  }

                  if(await _context.SaveChangesAsync() > 0) return Ok();

                  return BadRequest(new ProblemDetails{Title = "Problem deleting the discount"});

            }
      }
}