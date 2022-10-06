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
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
      public class AdminController : BaseController
      {
            private readonly UserManager<User> _userManager;
            private readonly StoreContext _context;
            private List<long> monthStatistic = new List<long>();
            private List<int> OrderMonthStatistic = new List<int>();

            public AdminController(UserManager<User> userManager, StoreContext context)
            {
                  _context = context;
                  _userManager = userManager;
            }

            [Authorize(Policy = "RequireAdminRole")]
            [HttpGet("user-with-roles")]
            public async Task<ActionResult> GetUserWithRoles()
            {
                  var users = await _userManager.Users
                        .Include(r => r.UserRoles)
                        .ThenInclude(r => r.Role)
                        .OrderBy(u => u.UserName)
                        .Select(u => new
                        {
                              u.Id,
                              Username = u.UserName,
                              PictureUrl = u.PictureUrl,
                              Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
                        }).ToListAsync();

                  return Ok(users);
            }

            [Authorize(Policy = "RequireAdminRole")]
            [HttpPost("edit-roles/{username}")]
            public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles)
            {
                  if (roles == null)
                  {
                        return BadRequest(new ProblemDetails { Title = "You can't delete all role" });
                  }
                  var selectedRoles = roles.Split(",").ToArray();

                  var user = await _userManager.FindByNameAsync(username);

                  if (user == null) return NotFound("Could not find user");

                  var userRoles = await _userManager.GetRolesAsync(user);

                  var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

                  if (!result.Succeeded) return BadRequest(new ProblemDetails { Title = "Failed to add to roles" });

                  result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

                  if (!result.Succeeded) return BadRequest(new ProblemDetails { Title = "Failed to remove to roles" });

                  return Ok(await _userManager.GetRolesAsync(user));
            }

            [Authorize(Policy = "RequireAdminRole")]
            [HttpGet("admin-get-orders")]
            public async Task<ActionResult<List<OrderDto>>> GetOrders([FromQuery] OrderVm orderVm)
            {
                  return await _context.Orders
                        .Search(orderVm.SearchTerm)
                        .OrderByDescending(x => x.Id)
                        .ProjectOrderToOrderDto()
                        .ToListAsync();
            }

            // Money statistic by dddd/MM/YYYY
            [HttpGet("statistic-current-day")] //[x]
            public async Task<long> StatisticCurrentDay()
            {
                var subtotal = await _context.Orders
                    .Where(x => x.OrderDate.Day == DateTime.Today.Day)
                    .Select(x => x.GetTotal())
                    .ToListAsync();

                return subtotal.Sum();
            }

            [HttpGet("statistic-selected-year")] // [x]
            public async Task<List<long>> StatisticYearToMonth(int year)
            {
                for (int i = 1; i < 13; i++)
                {
                    var subtotal = await _context.Orders
                        .Where(x => x.OrderDate.Month == i && x.OrderDate.Year == year)
                        .Select(x => x.GetTotal())
                        .ToListAsync();
                    monthStatistic.Add(subtotal.Sum());
                }
                return monthStatistic;
            }

            [HttpGet("statistic-dmy")] // [x]
            public async Task<long> Statistic(int d,int m, int y)
            {
                var subtotal = await _context.Orders
                    .Where(x => x.OrderDate.Day == d && x.OrderDate.Month == m && x.OrderDate.Year == y)
                    .Select(x => x.GetTotal())
                    .ToListAsync();

                return subtotal.Sum();
            }

            // Product statistic
            [HttpGet("best-saler")]
            public async Task<Dictionary<int, int>> BestSaler()
            {
                  var orders = (await _context.OrderItems.ToListAsync())
                        .GroupBy(x => x.ItemOrdered.ProductId)
                        .OrderBy(x => x.Key)
                        .ToDictionary(x => x.Key, x => x.Select(y => y.Quantity).Count());

                  return orders;
            }

            // [HttpGet("best-saler-categories")]
            // public async Task<ActionResult> BestSalerCategories()
            // {
            //       var categories = from io in _context.OrderItems
            //                   join pr in _context.Products
            //                   on io.ItemOrdered.ProductId equals pr.Id
            //                   select new
            //                         {
            //                               pr.Id,
            //                               pr.Category,
            //                               pr.Brand
            //                         };

            //       var result = (await categories.ToListAsync()).GroupBy(x => x.Id)
            //                   .OrderBy(x => x.Key)
            //                   .ToDictionary(x => x.Key, x => x.Select(y => new {
            //                         y.Id, y.Brand,
            //                         y.Category.Name,
            //                   }));

            //       return Ok(result);
            // }

            [HttpGet("best-saler-category/{CateId}")]
            public async Task<ActionResult> BestSalerCategory(int CateId)
            {
                  var categories = from io in _context.OrderItems
                              join pr in _context.Products
                              on io.ItemOrdered.ProductId equals pr.Id
                              select new
                                    {
                                          pr.Id,
                                          pr.Category,
                                          pr.Brand
                                    };

                  var result = (await categories
                                    .Where(x => x.Category.CateId == CateId)
                                    .ToListAsync()).Count();

                  return Ok(result);
            }

            // Evaluate Statistic
            [HttpGet("most-comment")]
            public async Task<Dictionary<int, int>> MostComment()
            {
                   var product = (await _context.Comments.ToListAsync())
                        .GroupBy(x => x.productId)
                        .OrderBy(x => x.Key)
                        .ToDictionary(x => x.Key, x => x.Select(y => y.Content).Count());

                  return product;
            }

            [HttpGet("most-rate")]
            public async Task<ActionResult> MostRate()
            {
                   var product = (await _context.Comments.ToListAsync())
                        .GroupBy(x => x.Rate)
                        .OrderBy(x => x.Key)
                        .ToDictionary(x => x.Key, x => x.Select(y => new {
                              y.productId,
                              y.productName
                        }).Distinct());

                  return Ok(product);
            }

            [HttpGet("most-like")]
            public async Task<Dictionary<int, int>> MostLike()
            {
                  var liked = (await _context.Likes.ToListAsync())
                        .GroupBy(x => x.LikedProductId)
                        .OrderBy(x => x.Key)
                        .ToDictionary(x => x.Key, x => x.Select(y => y.UserId).Count());

                  return liked;
            }

            // Order Statistic
            [HttpGet("order-delivery-state")]
            public async Task<ActionResult> DeliveryState()
            {
                  var orderCount = (await _context.Orders
                                    .ToListAsync()).Count();
                  var pending = (await _context.Orders
                                    .Where(x => x.DeliveryStatus == DeliveryStatus.PendingConfirm && x.isRefund != true)
                                    .ToListAsync()).Count();
                  var onway = (await _context.Orders
                                    .Where(x => x.DeliveryStatus == DeliveryStatus.OnTheWay)
                                    .ToListAsync()).Count();
                  var delivered = (await _context.Orders
                                    .Where(x => x.DeliveryStatus == DeliveryStatus.ProductDelivered)
                                    .ToListAsync()).Count();
                  var refunded = (await _context.Orders
                                    .Where(x => x.isRefund == true)
                                    .ToListAsync()).Count();

                  var result = new
                  {
                        order = orderCount,
                        pending = pending,
                        ontheway = onway,
                        delivered = delivered,
                        refund = refunded
                  };

                  return Ok(result);
            }

            [HttpGet("order-per-month")]
            public async Task<List<int>> OrderPerMonth()
            {
                for (int i = 1; i < 13; i++)
                {
                    var subtotal = (await _context.Orders
                        .Where(x => x.OrderDate.Month == i)
                        .ToListAsync()).Count();
                    OrderMonthStatistic.Add(subtotal);
                }

                return OrderMonthStatistic;
            }
      }
}