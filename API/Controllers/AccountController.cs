using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using API.ViewModel;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
      public class AccountController : BaseController
      {
            private readonly UserManager<User> _userManager;
            private readonly TokenService _tokenService;
            private readonly StoreContext _context;
            private readonly IMapper _mapper;
            private readonly ImageService _imageService;
            public AccountController(UserManager<User> userManager, TokenService tokenService, StoreContext context, IMapper mapper, ImageService imageService)
            {
                  _imageService = imageService;
                  _mapper = mapper;
                  _context = context;
                  _tokenService = tokenService;
                  _userManager = userManager;
            }

            [HttpPost("login")]
            public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
            {
                  var user = await _userManager.FindByNameAsync(loginDto.UserName);

                  var lockedUser = await _userManager.IsLockedOutAsync(user);

                  if(lockedUser) return BadRequest(new ProblemDetails{ Title = "User are Locked for some resons"});

                  if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
                        return Unauthorized(new ProblemDetails { Title = "Username or Password incorrect" });

                  var userBasket = await RetrieveBasket(loginDto.UserName);
                  var anonBasket = await RetrieveBasket(Request.Cookies["buyerId"]);

                  if (anonBasket != null)
                  {
                        if (userBasket != null) _context.Baskets.Remove(userBasket);
                        anonBasket.BuyerId = user.UserName;
                        Response.Cookies.Delete("buyerId");
                        await _context.SaveChangesAsync();
                  }
                  return new UserDto
                  {
                        Email = user.Email,
                        Token = await _tokenService.GenerateToken(user),
                        Username = user.UserName,
                        Phone = user.PhoneNumber,
                        PictureUrl = user.PictureUrl,
                        Basket = anonBasket != null ? anonBasket.MapBasketToDto() : userBasket?.MapBasketToDto()
                  };
            }

            [HttpPost("register")]
            public async Task<ActionResult> Register(RegisterDto registerDto)
            {
                  var user = new User { UserName = registerDto.UserName, Email = registerDto.Email };

                  var result = await _userManager.CreateAsync(user, registerDto.Password);
                  var adminMemberNotify = await _context.Notifies.FindAsync(1);

                  if (!result.Succeeded)
                  {
                        foreach (var error in result.Errors)
                        {
                              ModelState.AddModelError(error.Code, error.Description);
                        }

                        return ValidationProblem();
                  }

                  adminMemberNotify.MemberNotify = true;

                  await _userManager.AddToRoleAsync(user, "Member");

                  return StatusCode(201);
            }

            [Authorize]
            [HttpPost("change-password")]
            public async Task<ActionResult> ChangePassword(ChangeUserPasswordViewModel model)
            {
                  if (ModelState.IsValid) {
                        var user = await _userManager.FindByNameAsync(User.Identity.Name);

                        if (user != null)
                        {
                              IdentityResult result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);

                              if (!result.Succeeded)
                              {
                                    foreach (var error in result.Errors)
                                    {
                                          ModelState.AddModelError(error.Code, error.Description);
                                    }

                                    return ValidationProblem();
                              }

                              return Ok(user);
                        }
                  }
                  return BadRequest(new ProblemDetails{Title = "Something wrong with password or confirm password"});
            }

            [Authorize(Roles = "Admin")]
            [HttpPost("lock-user/{id}")]
            public async Task<ActionResult> LockUser(string id)
            {
                  var userId = await _userManager.FindByIdAsync(id);
                  var isUserLocked = await _userManager.IsLockedOutAsync(userId);

                  if(!(userId.LockoutEnabled && userId.LockoutEnd != null))
                  {
                        var result = await _userManager.SetLockoutEnabledAsync(userId, true);
                        if(result.Succeeded)
                        {
                              await _userManager.SetLockoutEndDateAsync(userId, DateTimeOffset.MaxValue);
                              return Ok();
                        }
                  }else
                  {
                        var result = await _userManager.SetLockoutEnabledAsync(userId, false);
                        if(result.Succeeded)
                        {
                              await _userManager.SetLockoutEndDateAsync(userId, null);
                              return Ok();
                        }
                  }

                  return BadRequest(new ProblemDetails{Title = "Somethings wrong with locked User"});
            }

            [Authorize]
            [HttpGet("currentUser")]
            public async Task<ActionResult<UserDto>> GetCurrentUser()
            {
                  var user = await _userManager.FindByNameAsync(User.Identity.Name);
                  var address = await _userManager.Users
                        .Where(x => x.UserName == User.Identity.Name)
                        .Select(u => u.Address)
                        .FirstOrDefaultAsync();

                  var userBasket = await RetrieveBasket(User.Identity.Name);

                  return new UserDto
                  {
                        Email = user.Email,
                        Username = user.UserName,
                        Phone = user.PhoneNumber,
                        PictureUrl = user.PictureUrl,
                        Token = await _tokenService.GenerateToken(user),
                        Basket = userBasket?.MapBasketToDto(),
                        Address = address?.MapAddressToDto()
                  };
            }

            [Authorize]
            [HttpGet("savedAddress")]
            public async Task<ActionResult<UserAddress>> GetSaveAddress()
            {
                  var address = await _userManager.Users
                        .Where(x => x.UserName == User.Identity.Name)
                        .Select(u => u.Address)
                        .FirstOrDefaultAsync();

                  return address;
            }

            [HttpPut]
            public async Task<ActionResult> EditProfile([FromForm] MemberUpdateDto memberUpdateDto, [FromForm] MemberUpdateInfoDto memberUpdateInfoDto)
            {
                  var user = await _context.Users
                        .Include(a => a.Address)
                        .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
                  // var user = await _userManager.Users
                  //       .Where(x => x.UserName == User.Identity.Name)
                  //       .FirstOrDefaultAsync();

                  // var userAddress = await _userManager.Users
                  //       .Where(x => x.UserName == User.Identity.Name)
                  //       .Select(u => u.Address)
                  //       .FirstOrDefaultAsync();

                  // if (userAddress == null && user == null) return NotFound();

                  if (memberUpdateInfoDto.File != null)
                  {
                        var imageResult = await _imageService.AddImageAsync(memberUpdateInfoDto.File);

                        if (imageResult.Error != null)
                              return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

                        user.PictureUrl = imageResult.SecureUrl.ToString();
                        user.PublicId = imageResult.PublicId;
                  }

                  user.PhoneNumber = memberUpdateInfoDto.Phone;
                  user.Email = memberUpdateInfoDto.Email;

                  var re = await _userManager.UpdateAsync(user);

                  var updateAddress = new UserAddress {
                        FullName = memberUpdateDto.FullName,
                        Address1 = memberUpdateDto.Address1,
                        Address2 = memberUpdateDto.Address2,
                        City = memberUpdateDto.City,
                        Zip = memberUpdateDto.Zip,
                        State = memberUpdateDto.State,
                        Country = memberUpdateDto.City,
                        PhoneNumber = memberUpdateInfoDto.Phone,
                  };

                  user.Address = updateAddress;
                  // _mapper.Map(updateAddress, userAddress);

                  var result = await _context.SaveChangesAsync() > 0;

                  if (re != null || result) return Ok(re);

                  return BadRequest(new ProblemDetails { Title = "Problem updating user" });
            }

            [Authorize]
            [HttpGet("get-addresses")]
            public async Task<ActionResult<List<SelectedAddressDto>>> GetAddresses()
            {
                  var user = await _userManager.FindByNameAsync(User.Identity.Name);
                  var addresses = await _context.SelectedAddresses
                              .Where(x => x.UserId == user.Id)
                              .ToListAsync();
                  if(addresses == null) return BadRequest(new ProblemDetails { Title = "Problem load addresses" });
                  var addressDefault = await _userManager.Users
                        .Where(x => x.UserName == User.Identity.Name)
                        .Select(u => u.Address)
                        .FirstOrDefaultAsync();
                  var items = new List<SelectedAddressDto>();

                  if(addressDefault != null)
                  {
                        var addrDefaul = new SelectedAddressDto
                        {
                              Id = 0,
                              FullName = addressDefault.FullName,
                              Address1 = addressDefault.Address1,
                              Address2 = addressDefault.Address2,
                              Country = addressDefault.Country,
                              City = addressDefault.City,
                              State = addressDefault.State,
                              Zip = addressDefault.Zip,
                              PhoneNumber = addressDefault.PhoneNumber,
                              UserId = user.Id,
                        };
                        items.Add(addrDefaul);
                  }


                  foreach(var address in addresses)
                  {
                        var addr = new SelectedAddressDto
                        {
                              Id = address.Id,
                              FullName = address.FullName,
                              Address1 = address.Address1,
                              Address2 = address.Address2,
                              Country = address.Country,
                              City = address.City,
                              State = address.State,
                              Zip = address.Zip,
                              UserId = address.User.Id,
                              PhoneNumber = address.PhoneNumber,
                        };
                        items.Add(addr);
                  }
                  return items;
            }

            [HttpPost("new-address")]
            public async Task<ActionResult> AddAddress(MemberUpdateDto newAddressVm)
            {
                  var user = await _context.Users
                        .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);

                  if(newAddressVm == null) return BadRequest();

                  var newAddress = new SelectedAddress {
                        FullName = newAddressVm.FullName,
                        PhoneNumber = newAddressVm.PhoneNumber,
                        Address1 = newAddressVm.Address1,
                        Address2 = newAddressVm.Address2,
                        City = newAddressVm.City,
                        Zip = newAddressVm.Zip,
                        State = newAddressVm.State,
                        Country = newAddressVm.City,
                        UserId = user.Id
                  };

                  await _context.SelectedAddresses.AddAsync(newAddress);

                  var result = await _context.SaveChangesAsync() > 0;

                  if (result) return Ok(result);

                  return BadRequest(new ProblemDetails { Title = "Problem add new address" });
            }
            [HttpPost("update-address")]
            public async Task<ActionResult> UpdateAddress(AddressUpdate updateAddressVm)
            {
                  var address = await _context.SelectedAddresses
                        .FindAsync(updateAddressVm.Id);
                  var user = await _context.Users
                        .Include(a => a.Address)
                        .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);

                  if(updateAddressVm.Id == 0) {
                        var updateAddress = new UserAddress {
                              FullName = updateAddressVm.FullName,
                              Address1 = updateAddressVm.Address1,
                              Address2 = updateAddressVm.Address2,
                              City = updateAddressVm.City,
                              Zip = updateAddressVm.Zip,
                              State = updateAddressVm.State,
                              Country = updateAddressVm.City,
                              PhoneNumber = updateAddressVm.PhoneNumber,
                        };

                        user.Address = updateAddress;
                  } else {
                        if(address == null) return BadRequest();

                        address.FullName = updateAddressVm.FullName;
                        address.PhoneNumber = updateAddressVm.PhoneNumber;
                        address.Address1 = updateAddressVm.Address1;
                        address.Address2 = updateAddressVm.Address2;
                        address.City = updateAddressVm.City;
                        address.Zip = updateAddressVm.Zip;
                        address.State = updateAddressVm.State;
                        address.Country = updateAddressVm.City;
                        address.UserId = user.Id;
                  }
                  // _context.SelectedAddresses.Update(newAddress);

                  var result = await _context.SaveChangesAsync() > 0;

                  if (result) return Ok(result);

                  return BadRequest(new ProblemDetails { Title = "Problem update address" });
            }

            [HttpDelete("delete-address/{id}")]
            public async Task<ActionResult> DeleteAddress(int id)
            {
                  var address = await _context.SelectedAddresses.FindAsync(id);

                  if(address == null) return BadRequest();

                  _context.SelectedAddresses.Remove(address);

                  var result = await _context.SaveChangesAsync() > 0;

                  if (result) return Ok(result);

                  return BadRequest(new ProblemDetails { Title = "Problem delete address" });
            }

            // [Authorize(Roles = "Admin")]
            [HttpGet("all-members")]
            public async Task<ActionResult<PagedList<User>>> GetMembers([FromQuery] MemberDto memberDto)
            {
                  var query = _context.Users
                        .Search(memberDto.SearchTerm)
                        .Include(x => x.Address)
                        .OrderBy(x => x.Id)
                        .AsQueryable();

                  var members = await PagedList<User>.ToPagedList(query, memberDto.PageNumber, memberDto.PageSize);

                  Response.AddPaginationHeader(members.PaginationDto);

                  return members;
            }

            [Authorize(Roles = "Admin")]
            [HttpDelete("delete-member/{id}")]
            public async Task<ActionResult> memberDelete(string id)
            {
                  var user = await _userManager.FindByIdAsync(id);

                  if (user != null)
                  {
                        var result = await _userManager.DeleteAsync(user);
                        if (result.Succeeded)
                        {
                              return Ok(true);
                        }
                        else
                        {
                              return BadRequest(new ProblemDetails { Title = "Failed to delete user" });
                        }
                  }
                  else
                        return NotFound("User Not Found");
            }

            [Authorize(Roles = "Admin")]
            [HttpGet("get-member-count")]
            public async Task<int> GetMemberCount()
            {
                  var subtotal = await _context.Users
                      .ToListAsync();

                  return subtotal.Count();
            }

            private async Task<Basket> RetrieveBasket(string buyerId)
            {
                  if (string.IsNullOrEmpty(buyerId))
                  {
                        Response.Cookies.Delete("buyerId");
                        return null;
                  }
                  return await _context.Baskets
                                          .Include(i => i.Items)
                                          .ThenInclude(p => p.Product)
                                          .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
            }
      }
}