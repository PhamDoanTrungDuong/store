using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
      public class OrdersController : BaseController
      {
            private readonly StoreContext _context;
            public OrdersController(StoreContext context)
            {
                  _context = context;
            }

            [HttpGet]
            public async Task<ActionResult<List<OrderDto>>> GetOrders()
            {
                return await _context.Orders
                    .OrderByDescending(x => x.OrderDate)
                    .ProjectOrderToOrderDto()
                    .Where(x => x.BuyerId == User.Identity.Name)
                    .ToListAsync();
            }


            [Authorize]
            [HttpGet("get-total-order")]
            public async Task<long> GetTotalOrder()
            {
                var subtotal = await _context.Orders
                    .Where(x => x.BuyerId == User.Identity.Name)
                    .Select(x => x.GetTotal())
                    .ToListAsync();

                return subtotal.Sum();
            }

            [Authorize(Roles = "Admin")]
            [HttpGet("getAll-total-order")]
            public async Task<long> GetAllTotalOrder()
            {
                var subtotal = await _context.Orders
                    .Select(x => x.GetTotal())
                    .ToListAsync();

                return subtotal.Sum();
            }

            [HttpGet("{id}", Name = "GetOrder")]
            public async Task<ActionResult<OrderDto>> GetOrder(int id)
            {
                return await _context.Orders
                    .ProjectOrderToOrderDto()
                    .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
                    .FirstOrDefaultAsync();
            }

            [Authorize(Roles = "Admin")]
            [HttpPost("delivery-status")]
            public async Task<ActionResult> ChangeDeliveryStatus(DeliveryDto deliveryDto)
            {
                    var order = await _context.Orders.FirstOrDefaultAsync(x =>
                              x.Id == deliveryDto.Id);

                    if(deliveryDto.DeliveryStatus == "OrderPlaced") order.DeliveryStatus = DeliveryStatus.OrderPlaced;

                    if(deliveryDto.DeliveryStatus == "OnTheWay") order.DeliveryStatus = DeliveryStatus.OnTheWay;

                    if(deliveryDto.DeliveryStatus == "ProductDelivered") order.DeliveryStatus = DeliveryStatus.ProductDelivered;

                    await _context.SaveChangesAsync();

                    return new EmptyResult();
            }

            [HttpPost]
            public async Task<ActionResult<int>> CreateOrder(CreateOrderDto orderDto)
            {
                var basket = await _context.Baskets
                        .RetrieveBasketWithItems(User.Identity.Name)
                        .FirstOrDefaultAsync();

                if(basket == null) return BadRequest(new ProblemDetails{Title = "Could not locate basket"});

                var items = new List<OrderItem>();

                foreach (var item in basket.Items)
                {
                    var productItem = await _context.Products.FindAsync(item.ProductId);
                    if(productItem == null) return NotFound();
                    if(productItem.QuantityInStock < 1) return BadRequest(new ProblemDetails{Title = $"Product {productItem.Name} is out of stock"});
                    var itemOrdered = new ProductItemOrdered
                    {
                        ProductId = productItem.Id,
                        Name = productItem.Name,
                        PictureUrl = productItem.PictureUrl,
                        Color = item.Color,
                        Size = item.Size
                    };

                    var orderItem = new OrderItem
                    {
                        ItemOrdered = itemOrdered,
                        Price = productItem.Price,
                        Quantity = item.Quantity
                    };

                    items.Add(orderItem);
                    productItem.QuantityInStock -= item.Quantity;
                }

                var subtotal = items.Sum(item => item.Price * item.Quantity);
                var deliveryFee = subtotal > 10000 ? 0 : 500;

                var order = new Order
                {
                    OrderItems = items,
                    BuyerId = User.Identity.Name,
                    ShippingAddress = orderDto.ShippingAddress,
                    Subtotal = subtotal,
                    DeliveryFee = deliveryFee,
                    PaymentIntentId = basket.PaymentIntentId
                };

                _context.Orders.Add(order);
                _context.Baskets.Remove(basket);

                if(orderDto.SaveAddress)
                {
                    var user = await _context.Users
                        .Include(a => a.Address)
                        .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
                    var address = new UserAddress
                    {
                        FullName = orderDto.ShippingAddress.FullName,
                        Address1 = orderDto.ShippingAddress.Address1,
                        Address2 = orderDto.ShippingAddress.Address2,
                        City = orderDto.ShippingAddress.City,
                        State = orderDto.ShippingAddress.State,
                        Zip = orderDto.ShippingAddress.Zip,
                        Country = orderDto.ShippingAddress.Country
                    };

                    user.Address = address;
                }

                var result = await _context.SaveChangesAsync() > 0;

                if(result) return CreatedAtRoute("GetOrder", new {id = order.Id}, order.Id);

                return BadRequest("Problem creating order");
            }

            [HttpGet("momo-order")]
            public async Task<ActionResult<int>> CreateMoMoOrder()
            {
                var basket = await _context.Baskets
                        .RetrieveBasketWithItems(User.Identity.Name)
                        .FirstOrDefaultAsync();

                var userShippingAddres = await _context.Users
                        .Where(x => x.UserName == User.Identity.Name)
                        .Include(x => x.Address)
                        .FirstOrDefaultAsync();

                if(basket == null) return NoContent();

                var items = new List<OrderItem>();

                foreach (var item in basket.Items)
                {
                    var productItem = await _context.Products.FindAsync(item.ProductId);
                    if(productItem == null) return NotFound();
                    if(productItem.QuantityInStock < 1) return BadRequest(new ProblemDetails{Title = $"Product {productItem.Name} is out of stock"});
                    var itemOrdered = new ProductItemOrdered
                    {
                        ProductId = productItem.Id,
                        Name = productItem.Name,
                        PictureUrl = productItem.PictureUrl,
                        Color = item.Color,
                        Size = item.Size
                    };

                    var orderItem = new OrderItem
                    {
                        ItemOrdered = itemOrdered,
                        Price = productItem.Price,
                        Quantity = item.Quantity
                    };

                    items.Add(orderItem);
                    productItem.QuantityInStock -= item.Quantity;
                }

                var subtotal = items.Sum(item => item.Price * item.Quantity);
                var deliveryFee = subtotal > 10000 ? 0 : 500;

                if(userShippingAddres.Address == null)
                {
                    return BadRequest(new ProblemDetails{Title = "Please check your information from your profile"});
                }

                var shipadr = new ShippingAddress {
                    FullName = userShippingAddres.Address.FullName,
                    Address1 = userShippingAddres.Address.Address1,
                    Address2 = userShippingAddres.Address.Address2,
                    City = userShippingAddres.Address.City,
                    Zip = userShippingAddres.Address.Zip,
                    State = userShippingAddres.Address.State,
                    Country = userShippingAddres.Address.City,
                };

                var order = new Order
                {
                    OrderItems = items,
                    BuyerId = User.Identity.Name,
                    ShippingAddress = shipadr,
                    Subtotal = subtotal,
                    DeliveryFee = deliveryFee,
                };

                _context.Orders.Add(order);
                _context.Baskets.Remove(basket);

                var result = await _context.SaveChangesAsync() > 0;

                if(result) return CreatedAtRoute("GetOrder", new {id = order.Id}, order.Id);

                return BadRequest("Problem creating order");
            }
      }
}