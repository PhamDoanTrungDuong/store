using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
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
                              Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
                        }).ToListAsync();

                  return Ok(users);
            }

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

            [HttpGet("admin-get-orders")]
            public async Task<ActionResult<List<OrderDto>>> GetOrders()
            {
                  return await _context.Orders
                      .ProjectOrderToOrderDto()
                      .ToListAsync();
            }
      }
}