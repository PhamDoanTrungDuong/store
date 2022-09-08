using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    public class BasketController : BaseController
    {
        private readonly StoreContext _context;
        public BasketController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket(GetBuyerId());

            if (basket == null) return NoContent();

            return basket.MapBasketToDto();
        }

        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemBasket(int productId, int quantity)
        {
            var basket = await RetrieveBasket(GetBuyerId());
            if(basket == null) basket = CreateBasket();

            var productItem = await _context.Products.FindAsync(productId);
            if(productItem == null) return NotFound();
            if(productItem.QuantityInStock < 1)
            {
                return BadRequest(new ProblemDetails{Title = $"{productItem.Name} is out of stock"});
            }
            else
            {
                var product = await _context.Products.FindAsync(productId);
                if(product == null) return BadRequest(new ProblemDetails{Title = "Product not found"});

                basket.AddItem(product, quantity);

                var result = await _context.SaveChangesAsync() > 0;
                if(result) return CreatedAtRoute("GetBasket", basket.MapBasketToDto());

                return BadRequest(new ProblemDetails{Title = "Problem saving item to basket"});
            }
        }


        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            var basket = await RetrieveBasket(GetBuyerId());

            if(basket == null) return NotFound();

            basket.RemoveItem(productId, quantity);

            var result = await _context.SaveChangesAsync() > 0;

            if(result) return Ok();

            return BadRequest(new ProblemDetails{Title = "Can't delete product"});
        }


        //========================================================================================
        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            if(string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }
            return await _context.Baskets
                                    .Include(i => i.Items)
                                    .ThenInclude(p => p.Product)
                                    .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }

        private string GetBuyerId()
        {
            return User.Identity?.Name ?? Request.Cookies["buyerId"];
        }

        private Basket CreateBasket()
        {
           var buyerId = User.Identity?.Name;
           if(string.IsNullOrEmpty(buyerId))
           {
                buyerId = Guid.NewGuid().ToString();
                var cookieOptions = new CookieOptions{IsEssential = true, Expires = DateTime.Now.AddDays(30)};
                Response.Cookies.Append("buyerId", buyerId, cookieOptions);
           }
           var basket = new Basket{BuyerId = buyerId};
           _context.Baskets.Add(basket);
           return basket;
        }
    }
}