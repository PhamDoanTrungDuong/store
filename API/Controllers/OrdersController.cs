using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using API.ViewModel;
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

            [Authorize(Roles = "Admin, Moderator")]
            [HttpGet("getAll-total-order")]
            public async Task<long> GetAllTotalOrder()
            {
                var subtotal = await _context.Orders
                    .Select(x => x.GetTotal())
                    .ToListAsync();

                return subtotal.Sum();
            }

            [HttpGet("calculateProfitMonth")]
            public async Task<IActionResult> CalculateProfitForMonthAsync(int year, int month)
            {
                // Calculate the start and end of the specified month
                DateTime startDate = new DateTime(year, month, 1);
                DateTime endDate = startDate.AddMonths(1).AddDays(-1);

                // Calculate Total Sales for the specified month asynchronously
                var ordersInMonth = await _context.Orders
                    .Where(order => order.OrderDate >= startDate && order.OrderDate <= endDate)
                    .ToListAsync();

                decimal totalSales = ordersInMonth.Sum(order => order.GetTotal());

                // Calculate COGS for the specified month asynchronously
                var receiptDetailsInMonth = await _context.ReceiptDetails
                    .Where(rd => rd.Receipt.DateCreate >= startDate && rd.Receipt.DateCreate <= endDate)
                    .ToListAsync();

                decimal cogs = receiptDetailsInMonth.Sum(rd => rd.Price); // Assuming Price represents the cost of the product

                // Calculate Revenue
                decimal revenue = totalSales;

                // Calculate Profit
                decimal profit = revenue - cogs;

                return Ok(new { Revenue = revenue, Profit = profit });
            }

            [HttpGet("calculateProfitDate")]
            public async Task<IActionResult> CalculateProfitAndRevenueForDateRangeAsync(DateTime startDate, DateTime endDate)
            {
                // Calculate Total Sales for the specified date range asynchronously
                var ordersInRange = await _context.Orders
                    .Where(order => order.OrderDate >= startDate && order.OrderDate <= endDate)
                    .ToListAsync();

                decimal totalSales = ordersInRange.Sum(order => order.GetTotal());

                // Calculate COGS for the specified date range asynchronously
                var receiptDetailsInRange = await _context.ReceiptDetails
                    .Where(rd => rd.Receipt.DateCreate >= startDate && rd.Receipt.DateCreate <= endDate)
                    .ToListAsync();

                decimal cogs = receiptDetailsInRange.Sum(rd => rd.Price); // Assuming Price represents the cost of the product

                // Calculate Revenue for the date range
                decimal revenue = totalSales;

                // Calculate Profit for the date range
                decimal profit = revenue - cogs;

                return Ok(new { Revenue = revenue, Profit = profit });
            }



            // [HttpGet("getOrder/{id}")]
            // public async Task<System.Collections.Generic.List<OrderItemDto>> GetOrder(int id)
            // {
            //     var order = await _context.Orders
            //         .Include(x => x.OrderItems)
            //         .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
            //         .FirstOrDefaultAsync();
            //     if(order != null) {
            //         var OrderItems = order.OrderItems.Select(item => new OrderItemDto
            //             {
            //                 ProductId = item.ItemOrdered.ProductId,
            //                 Name = item.ItemOrdered.Name,
            //                 PictureUrl = item.ItemOrdered.PictureUrl,
            //                 Price = item.Price,
            //                 Quantity = item.Quantity,
            //                 Color = item.ItemOrdered.Color,
            //                 Size = item.ItemOrdered.Size
            //             }).ToList();
            //             return OrderItems;
            //     }
            //     return null;
            // }
            
            [AllowAnonymous]
            [HttpGet("getOrderComment")]
            public async Task<List<List<OrderItem>>> GetOrderComment()
            {
                var order = await _context.Orders
                        // .Include(x => x.OrderItems)
                        .Where(x => x.BuyerId == User.Identity.Name)
                        .Select(x => x.OrderItems)
                        .ToListAsync();
                return order;
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

                    if(deliveryDto.DeliveryStatus == "OnTheWay") {
                        order.isUserNotifi = true;
                        order.DeliveryStatus = DeliveryStatus.OnTheWay;
                    };

                    if(deliveryDto.DeliveryStatus == "ProductDelivered") {
                        order.isUserNotifi = true;
                        order.DeliveryStatus = DeliveryStatus.ProductDelivered;
                    }

                    if(deliveryDto.DeliveryStatus == "CancelOrder") {
                        order.isUserNotifi = true;
                        order.DeliveryStatus = DeliveryStatus.CancelOrder;
                    };

                    await _context.SaveChangesAsync();

                    return new EmptyResult();
            }

            [HttpPost("userNotify/{id}")]
            public async Task<ActionResult> UserNotify(int id)
            {
                    var order = await _context.Orders.FindAsync(id);

                    if(order != null)  order.isUserNotifi = false;

                    var result = await _context.SaveChangesAsync() > 0;
                    if(result) return Ok();

                    return BadRequest(new ProblemDetails{Title = "Problem apply the order"});

            }

            [HttpPost]
            public async Task<ActionResult<int>> CreateOrder(CreateOrderDto orderDto)
            {
                var basket = await _context.Baskets
                        .RetrieveBasketWithItems(User.Identity.Name)
                        .FirstOrDefaultAsync();
                var adminOrderNotify = await _context.Notifies.FindAsync(1);

                if(basket == null) return BadRequest(new ProblemDetails{Title = "Could not locate basket"});

                var items = new List<OrderItem>();

                foreach (var item in basket.Items)
                {
                    var productItem = await _context.Products.FindAsync(item.ProductId);
                    var productVariants = await _context.ProductDetails.FirstOrDefaultAsync(x => x.ProductId == item.ProductId && x.SizeValue == item.Size && x.ColourValue == item.Color);

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
                        Price = item.SalePrice,
                        Quantity = item.Quantity
                    };

                    items.Add(orderItem);
                    productItem.QuantityInStock -= item.Quantity;
                    if(productVariants != null) {
                        if(productVariants.ProductId == item.ProductId && productVariants.SizeValue == item.Size && productVariants.ColourValue == item.Color){
                            if (productVariants.Quantity < item.Quantity) {
                                return BadRequest(new ProblemDetails { Title = $"Not enough stock for product variant" });
                            }
                            productVariants.Quantity -= item.Quantity;
                        }
                    }
                }
                double subtotal = 0;
                double discount = orderDto.Discount / 100;
                var subtotal2 = items.Sum(item => item.Price * item.Quantity);

                if(orderDto.Discount != 0) {
                    subtotal = subtotal2 - (subtotal2 * discount);
                } else {
                    subtotal = subtotal2;
                }
                var deliveryFee = subtotal > 10000 ? 0 : 500;

                var order = new Order
                {
                    OrderItems = items,
                    BuyerId = User.Identity.Name,
                    ShippingAddress = orderDto.ShippingAddress,
                    Subtotal = (long)subtotal,
                    DeliveryFee = deliveryFee,
                    PaymentIntentId = basket.PaymentIntentId,
                    isRefund = false,
                    CurrentShipperId = 1,
                    Discount = orderDto.Discount,
                };

                adminOrderNotify.OrderNotify = true;

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
            public async Task<ActionResult<int>> CreateMoMoOrder([FromQuery] ParamsTrans paramsTrans)
            {
                var basket = await _context.Baskets
                        .RetrieveBasketWithItems(User.Identity.Name)
                        .FirstOrDefaultAsync();
                var adminOrderNotify = await _context.Notifies.FindAsync(1);

                var userShippingAddres = await _context.Users
                        .Where(x => x.UserName == User.Identity.Name)
                        .Include(x => x.Address)
                        .FirstOrDefaultAsync();

                if(basket == null) return NoContent();

                var items = new List<OrderItem>();

                foreach (var item in basket.Items)
                {
                    var productItem = await _context.Products.FindAsync(item.ProductId);
                    var productVariants = await _context.ProductDetails.FirstOrDefaultAsync(x => x.ProductId == item.ProductId && x.SizeValue == item.Size && x.ColourValue == item.Color);

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
                    if(productVariants != null) {
                        if(productVariants.ProductId == item.ProductId && productVariants.SizeValue == item.Size && productVariants.ColourValue == item.Color){
                            if (productVariants.Quantity < item.Quantity) {
                                return BadRequest(new ProblemDetails { Title = $"Not enough stock for product variant" });
                            }
                            productVariants.Quantity -= item.Quantity;
                        }
                    }
                }

                double subtotal = 0;
                double discountValue = paramsTrans.discount / 100;
                var subtotal2 = items.Sum(item => item.Price * item.Quantity);

                if(paramsTrans.discount != 0) {
                    subtotal = subtotal2 - (subtotal2 * discountValue);
                } else {
                    subtotal = subtotal2;
                }
                var deliveryFee = subtotal > 10000 ? 0 : 500;

                if(userShippingAddres.Address == null)
                {
                    return BadRequest(new ProblemDetails{Title = "Please check your information from your profile"});
                }

                var shipadr = new ShippingAddress {
                    FullName = userShippingAddres.Address.FullName,
                    PhoneNumber = userShippingAddres.PhoneNumber,
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
                    Subtotal = (long)subtotal,
                    DeliveryFee = deliveryFee,
                    orderId = paramsTrans.orderId,
                    requestId = paramsTrans.requestId,
                    transId = paramsTrans.transId,
                    isRefund = false,
                    CurrentShipperId = 1,
                    Discount = paramsTrans.discount,
                };

                adminOrderNotify.OrderNotify = true;

                _context.Orders.Add(order);
                _context.Baskets.Remove(basket);

                var result = await _context.SaveChangesAsync() > 0;

                if(result) return CreatedAtRoute("GetOrder", new {id = order.Id}, order.Id);

                return BadRequest("Problem creating order");
            }
            [HttpGet("vnpay-order")]
            public async Task<ActionResult<int>> CreateVNPayOrder(double discount)
            {
                var basket = await _context.Baskets
                        .RetrieveBasketWithItems(User.Identity.Name)
                        .FirstOrDefaultAsync();
                var adminOrderNotify = await _context.Notifies.FindAsync(1);

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
                    var productVariants = await _context.ProductDetails.FirstOrDefaultAsync(x => x.ProductId == item.ProductId && x.SizeValue == item.Size && x.ColourValue == item.Color);

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
                    if(productVariants != null) {
                        if(productVariants.ProductId == item.ProductId && productVariants.SizeValue == item.Size && productVariants.ColourValue == item.Color){
                            if (productVariants.Quantity < item.Quantity) {
                                return BadRequest(new ProblemDetails { Title = $"Not enough stock for product variant" });
                            }
                            productVariants.Quantity -= item.Quantity;
                        }
                    }
                }

                // var subtotal = items.Sum(item => item.Price * item.Quantity);
                double subtotal = 0;
                double discountValue = discount / 100;
                var subtotal2 = items.Sum(item => item.Price * item.Quantity);

                if(discount != 0) {
                    subtotal = subtotal2 - (subtotal2 * discountValue);
                } else {
                    subtotal = subtotal2;
                }
                var deliveryFee = subtotal > 10000 ? 0 : 500;

                if(userShippingAddres.Address == null)
                {
                    return BadRequest(new ProblemDetails{Title = "Please check your information from your profile"});
                }

                var shipadr = new ShippingAddress {
                    FullName = userShippingAddres.Address.FullName,
                    PhoneNumber = userShippingAddres.PhoneNumber,
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
                    Subtotal = (long)subtotal,
                    DeliveryFee = deliveryFee,
                    isRefund = false,
                    isVnPay = true,
                    CurrentShipperId = 1,
                    Discount = discount,
                };

                adminOrderNotify.OrderNotify = true;

                _context.Orders.Add(order);
                _context.Baskets.Remove(basket);

                var result = await _context.SaveChangesAsync() > 0;

                if(result) return CreatedAtRoute("GetOrder", new {id = order.Id}, order.Id);

                return BadRequest("Problem creating order");
            }
      }
}