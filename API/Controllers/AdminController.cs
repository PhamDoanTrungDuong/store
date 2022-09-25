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

            // [HttpGet("statistic-current-day")]
            // public async Task<long> StatisticCurrentDay()
            // {
            //     var subtotal = await _context.Orders
            //         .Where(x => x.OrderDate.Day == DateTime.Today.Day)
            //         .Select(x => x.GetTotal())
            //         .ToListAsync();

            //     return subtotal.Sum();
            // }
            // [HttpGet("statistic-current-month")]
            // public async Task<long> StatisticCurrentMonth()
            // {
            //     var subtotal = await _context.Orders
            //         .Where(x => x.OrderDate.Month == DateTime.Today.Month)
            //         .Select(x => x.GetTotal())
            //         .ToListAsync();

            //     return subtotal.Sum();
            // }
            // [HttpGet("statistic-current-year")]
            // public async Task<long> StatisticCurrentYear()
            // {
            //     var subtotal = await _context.Orders
            //         .Where(x => x.OrderDate.Year == DateTime.Today.Year)
            //         .Select(x => x.GetTotal())
            //         .ToListAsync();

            //     return subtotal.Sum();
            // }

            [HttpGet("statistic-month")]
            public async Task<List<long>> StatisticMonth()
            {
                for (int i = 1; i < 13; i++)
                {
                    var subtotal = await _context.Orders
                        .Where(x => x.OrderDate.Month == i)
                        .Select(x => x.GetTotal())
                        .ToListAsync();
                    monthStatistic.Add(subtotal.Sum());
                }
                return monthStatistic;
            }

            [HttpGet("statistic-year-to-month")]
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

            [HttpGet("statistic-dmy")]
            public async Task<long> Statistic(int d,int m, int y)
            {
                var subtotal = await _context.Orders
                    .Where(x => x.OrderDate.Day == d && x.OrderDate.Month == m && x.OrderDate.Year == y)
                    .Select(x => x.GetTotal())
                    .ToListAsync();

                return subtotal.Sum();
            }

            // [HttpGet("best-saler")]
            // public async Task<List<IGrouping<int, OrderItem>>> BestSaler()
            // {
            //     return await _context.OrderItems
            //             .GroupBy(p => p.ItemOrdered.ProductId)
            //             .ToListAsync();
            // }
      }
}