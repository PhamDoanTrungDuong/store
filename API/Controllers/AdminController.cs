using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using API.Services;
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
            private readonly ImageService _imageService;
            private List<long> monthStatistic = new List<long>();
            private List<int> OrderMonthStatistic = new List<int>();

            public AdminController(UserManager<User> userManager, StoreContext context, ImageService imageService)
            {
                  _imageService = imageService;
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

            // [Authorize(Policy = "RequireAdminRole")]
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
            [HttpGet("best-seller")]
            public async Task<ActionResult> BestSeller()
            {
                  var orders = (await _context.OrderItems.ToListAsync())
                        .GroupBy(x => x.ItemOrdered.ProductId)
                        .ToDictionary(x => x.Select(y => new { y.ItemOrdered.ProductId, y.ItemOrdered.PictureUrl, y.ItemOrdered.Name}).Distinct(), x => x.Select(y => y.Quantity).Count())
                        .OrderByDescending(x => x.Value);
                  return Ok(orders);
            }

            [HttpGet("less-interaction")]
            public async Task<ActionResult> LessInteraction()
            {
                  var productLessInteract = await _context.Products
                              .OrderBy(x => x.ViewCount)
                              .Take(5)
                              .Select(x => new {
                                    x.Id,
                                    x.Name,
                                    x.PictureUrl,
                                    x.ViewCount
                              })
                              .ToListAsync();
                  return Ok(productLessInteract);
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
            [HttpGet("order-delivery-state")] // [x]
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

            // Sliders
            [HttpGet("get-sliders")]
            public async Task<List<Slider>> GetSliders() {
                  return await _context.Sliders.ToListAsync();
            }

            [HttpPost("add-slider")]
            public async Task<ActionResult> AddSlider([FromForm] SliderVm sliderVm)
            {
                  if (sliderVm.File != null)
                  {
                        var imageResult = await _imageService.AddImageAsync(sliderVm.File);

                        if (imageResult.Error != null)
                              return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

                        var slider = new Slider {
                              Picture = imageResult.SecureUrl.ToString(),
                              Caption = sliderVm.Caption,
                              Description = sliderVm.Description,
                              CreateAt = DateTime.Now
                        };

                        _context.Sliders.Add(slider);
                  }

                  var result = await _context.SaveChangesAsync() > 0;

                  if (result) return Ok(result);

                  return BadRequest(new ProblemDetails { Title = "Problem adding slider" });
            }

            [HttpPut("update-slider")]
            public async Task<ActionResult> UpdateSlider([FromForm] SliderUpdateVm sliderUpdateVm)
            {
                  var sliderUpdate = await _context.Sliders.FindAsync(sliderUpdateVm.Id);

                  if (sliderUpdateVm.File != null)
                  {
                        var imageResult = await _imageService.AddImageAsync(sliderUpdateVm.File);

                        if (imageResult.Error != null)
                              return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

                        sliderUpdate.Picture = imageResult.SecureUrl.ToString();
                  }
                  sliderUpdate.Caption = sliderUpdateVm.Caption;
                  sliderUpdate.Description = sliderUpdateVm.Description;

                  var result = await _context.SaveChangesAsync() > 0;

                  if (result) return Ok(result);

                  return BadRequest(new ProblemDetails { Title = "Problem updating slider" });
            }

            [HttpDelete("delete-slider/{id}")]
            public async Task<ActionResult> DeleteSlider(int id) {
                  var slider = await _context.Sliders.FindAsync(id);

                  if(slider == null) return BadRequest(new ProblemDetails{ Title = "Can't delete slider"});

                  _context.Sliders.Remove(slider);

                  var result = await _context.SaveChangesAsync() > 0;

                  if(result) return Ok();

                  return BadRequest(new ProblemDetails{ Title = "Something went wrong"});
            }

            //Partners
            [HttpGet("get-partners")]
            public async Task<List<Partner>> GetPartners() {
                  return await _context.Partners.ToListAsync();
            }

            [HttpPost("add-partner")]
            public async Task<ActionResult> AddPartner([FromForm] PartnerVm partnerVm)
            {
                  if (partnerVm.File != null)
                  {
                        var imageResult = await _imageService.AddImageAsync(partnerVm.File);

                        if (imageResult.Error != null)
                              return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

                        var partner = new Partner {
                              Picture = imageResult.SecureUrl.ToString(),
                              Name = partnerVm.Name,
                              CreateAt = DateTime.Now
                        };

                        _context.Partners.Add(partner);
                  }

                  var result = await _context.SaveChangesAsync() > 0;

                  if (result) return Ok(result);

                  return BadRequest(new ProblemDetails { Title = "Problem adding partner" });
            }

            [HttpPut("update-partner")]
            public async Task<ActionResult> UpdatePartner([FromForm] PartnerUpdateVm partnerUpdateVm)
            {
                  var partUpdate = await _context.Partners.FindAsync(partnerUpdateVm.Id);

                  if (partnerUpdateVm.File != null)
                  {
                        var imageResult = await _imageService.AddImageAsync(partnerUpdateVm.File);

                        if (imageResult.Error != null)
                              return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

                        partUpdate.Picture = imageResult.SecureUrl.ToString();
                  }
                  partUpdate.Name = partnerUpdateVm.Name;

                  var result = await _context.SaveChangesAsync() > 0;

                  if (result) return Ok(result);

                  return BadRequest(new ProblemDetails { Title = "Problem updating slider" });
            }

            [HttpDelete("delete-partner/{id}")]
            public async Task<ActionResult> DeletePartner(int id) {
                  var partner = await _context.Partners.FindAsync(id);

                  if(partner == null) return BadRequest(new ProblemDetails{ Title = "Can't delete partner"});

                  _context.Partners.Remove(partner);

                  var result = await _context.SaveChangesAsync() > 0;

                  if(result) return Ok();

                  return BadRequest(new ProblemDetails{ Title = "Something went wrong"});
            }

            // DiscountBanners
            [HttpGet("get-discountBanners")]
            public async Task<List<DiscountBanner>> GetDiscountBanners() {
                  return await _context.DiscountBanners.ToListAsync();
            }

            [HttpPost("add-discountBanner")]
            public async Task<ActionResult> AddDiscountBanner([FromForm] DiscountBannerVm discountVm)
            {
                  if (discountVm.File != null)
                  {
                        var imageResult = await _imageService.AddImageAsync(discountVm.File);

                        if (imageResult.Error != null)
                              return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

                        var discountBanner = new DiscountBanner {
                              Picture = imageResult.SecureUrl.ToString(),
                              Caption = discountVm.Caption,
                              Title = discountVm.Title,
                              CreateAt = DateTime.Now
                        };

                        _context.DiscountBanners.Add(discountBanner);
                  }

                  var result = await _context.SaveChangesAsync() > 0;

                  if (result) return Ok(result);

                  return BadRequest(new ProblemDetails { Title = "Problem adding Discount Banner" });
            }

            [HttpPut("update-discountBanner")]
            public async Task<ActionResult> UpdateDiscountBanner([FromForm] DiscountBannerUpdateVm discountBannerUpdateVm)
            {
                  var sliderUpdate = await _context.DiscountBanners.FindAsync(discountBannerUpdateVm.Id);

                  if (discountBannerUpdateVm.File != null)
                  {
                        var imageResult = await _imageService.AddImageAsync(discountBannerUpdateVm.File);

                        if (imageResult.Error != null)
                              return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

                        sliderUpdate.Picture = imageResult.SecureUrl.ToString();
                  }
                  sliderUpdate.Caption = discountBannerUpdateVm.Caption;
                  sliderUpdate.Title = discountBannerUpdateVm.Title;

                  var result = await _context.SaveChangesAsync() > 0;

                  if (result) return Ok(result);

                  return BadRequest(new ProblemDetails { Title = "Problem updating discount banner" });
            }

            [HttpDelete("delete-discountBanner/{id}")]
            public async Task<ActionResult> DeleteDiscountBanner(int id) {
                  var discountBanner = await _context.DiscountBanners.FindAsync(id);

                  if(discountBanner == null) return BadRequest(new ProblemDetails{ Title = "Can't delete discount banner"});

                  _context.DiscountBanners.Remove(discountBanner);

                  var result = await _context.SaveChangesAsync() > 0;

                  if(result) return Ok();

                  return BadRequest(new ProblemDetails{ Title = "Something went wrong"});
            }

            // Voucher
            [HttpGet("get-vouchers")]
            public async Task<List<Voucher>> GetVoucher() {
                  return await _context.Vouchers.ToListAsync();
            }

            [HttpPost("add-voucher")]
            public async Task<ActionResult> AddVoucher([FromForm] VoucherVm voucherVm)
            {
                  var voucher = new Voucher {
                        Name = voucherVm.Name,
                        Code = voucherVm.Code,
                        Value = voucherVm.Value,
                        CreateAt = DateTime.Now,
                        Exspire = DateTime.Now.AddDays(7),
                  };

                  if(voucherVm.Feature == "Percent"){
                        voucher.Feature = VoucherFeature.Percent;
                  } else if (voucherVm.Feature == "FreeShip") {
                        voucher.Feature = VoucherFeature.FreeShip;
                  } else {
                        voucher.Feature = VoucherFeature.Money;
                  }

                  _context.Vouchers.Add(voucher);

                  var result = await _context.SaveChangesAsync() > 0;

                  if (result) return Ok(result);

                  return BadRequest(new ProblemDetails { Title = "Problem adding voucher" });
            }

            [HttpPut("update-voucher")]
            public async Task<ActionResult> UpdateVoucher([FromForm] VoucherUpdateVm voucherUpdateVm)
            {
                  var voucherUpdate = await _context.Vouchers.FindAsync(voucherUpdateVm.Id);

                  voucherUpdate.Name = voucherUpdateVm.Name;
                  voucherUpdate.Code = voucherUpdateVm.Code;
                  voucherUpdate.Value = voucherUpdateVm.Value;

                  if(voucherUpdateVm.Feature == "Percent"){
                        voucherUpdate.Feature = VoucherFeature.Percent;
                  } else if (voucherUpdateVm.Feature == "FreeShip") {
                        voucherUpdate.Feature = VoucherFeature.FreeShip;
                  } else {
                        voucherUpdate.Feature = VoucherFeature.Money;
                  }

                  var result = await _context.SaveChangesAsync() > 0;

                  if (result) return Ok(result);

                  return BadRequest(new ProblemDetails { Title = "Problem updating voucher" });
            }

            [HttpDelete("delete-voucher/{id}")]
            public async Task<ActionResult> DeleteVoucher(int id) {
                  var voucher = await _context.Vouchers.FindAsync(id);

                  if(voucher == null) return BadRequest(new ProblemDetails{ Title = "Can't delete voucher"});

                  _context.Vouchers.Remove(voucher);

                  var result = await _context.SaveChangesAsync() > 0;

                  if(result) return Ok();

                  return BadRequest(new ProblemDetails{ Title = "Something went wrong"});
            }

            [HttpGet("admin-notifies")]
            public async Task<ActionResult<List<Notify>>> GetAdminNotifies() {
                  return await _context.Notifies.ToListAsync();
            }

            [HttpPost("admin-check-notify/{notifyString}")]
            public async Task<ActionResult> AdminCheckNotify(string notifyString) {
                  var notify = await _context.Notifies.FindAsync(1);
                  if(notifyString == "Order") {
                        notify.OrderNotify = false;
                  } else if (notifyString == "Comment") {
                        notify.CommentNotify = false;
                  } else if (notifyString == "Member") {
                        notify.MemberNotify = false;
                  } else if (notifyString == "Messenger") {
                        notify.MessengerNotify = false;
                  }

                  var result = await _context.SaveChangesAsync() > 0;

                  if(result) return Ok();
                  return Ok();

            }

            [HttpGet("return-purchase-rate")]
            public ActionResult GetPurchaseRate() {
                  double firstTimeCustomers = GetFirstTimeCustomers();
                  double repeatCustomers = GetRepeatCustomers();
                  // double repeatRate = (double)repeatCustomers / (double)firstTimeCustomers;
                  
                  double repeatRate = (double)firstTimeCustomers / (double)repeatCustomers;
                  if(double.IsPositiveInfinity(repeatRate) || double.IsNegativeInfinity(repeatRate) || double.IsNaN(repeatRate)){
                        return Ok(0);
                  }
                  return Ok(repeatRate);
            }

            private int GetFirstTimeCustomers()
            {
                  var customerIds = new HashSet<string>();
                  int firstTimeCustomers = 0;
                  var purchases = _context.Orders
                                    .ToArray();
                  
                  if(purchases == null) return firstTimeCustomers = 0;

                  foreach (Order purchase in purchases)
                  {
                        if (!customerIds.Contains(purchase.BuyerId))
                        {
                              customerIds.Add(purchase.BuyerId);
                              firstTimeCustomers++;
                        }
                  }

                  return firstTimeCustomers;
            }
            
            private int GetRepeatCustomers()
            {
                  var customerIds = new HashSet<string>();
                  int repeatCustomers = 0;
                  var purchases = _context.Orders
                                    .ToArray();

                  if(purchases == null) return repeatCustomers = 1;

                  foreach (var purchase in purchases)
                  {
                        if (customerIds.Contains(purchase.BuyerId))
                        {
                              repeatCustomers++;
                        }
                        else
                        {
                              customerIds.Add(purchase.BuyerId);
                        }
                  }

                  return repeatCustomers;
            }

            [HttpPost("add-color")]
            public async Task<ActionResult> AddColor([FromForm] ColorVm colorVm)
            {
                  if(colorVm.Colour_value == null || colorVm.Colour_code == null) return BadRequest(new ProblemDetails{ Title = "Value can't be null"});

                  var newColor = new Colour {
                        Colour_value = colorVm.Colour_value,
                        Colour_code = colorVm.Colour_code,
                  };

                  _context.Colours.Add(newColor);

                  var result = await _context.SaveChangesAsync() > 0;

                  if (result) return Ok(result);

                  return BadRequest(new ProblemDetails { Title = "Problem adding new color" });
            }

            [HttpPut("update-color")]
            public async Task<ActionResult> UpdateColor([FromForm] ColorUpdateVm colorUpdateVm)
            {
                  var updateColor = await _context.Colours.FindAsync(colorUpdateVm.Id);

                  updateColor.Colour_value = colorUpdateVm.Colour_value;
                  updateColor.Colour_code = colorUpdateVm.Colour_code;

                  var result = await _context.SaveChangesAsync() > 0;

                  if (result) return Ok(result);

                  return BadRequest(new ProblemDetails { Title = "Problem update color" });
            }

            [HttpDelete("delete-color/{id}")]
            public async Task<ActionResult> DeleteColor(int id)
            {
                  var color = await _context.Colours.FindAsync(id);

                  if(color == null) return BadRequest(new ProblemDetails{ Title = "Can't found color"});

                  _context.Colours.Remove(color);

                  var result = await _context.SaveChangesAsync() > 0;

                  if (result) return Ok(result);

                  return BadRequest(new ProblemDetails { Title = "Can't delete color" });
            }

            [HttpPost("add-size")]
            public async Task<ActionResult> AddSize([FromForm] string Size_value)
            {
                  if(Size_value == null) return BadRequest(new ProblemDetails{ Title = "Value can't be null"});

                  var newSize = new Size {
                        Size_value = Size_value,
                  };

                  _context.Sizes.Add(newSize);

                  var result = await _context.SaveChangesAsync() > 0;

                  if (result) return Ok(result);

                  return BadRequest(new ProblemDetails { Title = "Problem adding new size" });
            }

            [HttpPut("update-size")]
            public async Task<ActionResult> UpdateSize([FromForm] SizeUpdateVm sizeUpdateVm)
            {
                  var updateSize = await _context.Sizes.FindAsync(sizeUpdateVm.Id);

                  updateSize.Size_value = sizeUpdateVm.Size_value;

                  var result = await _context.SaveChangesAsync() > 0;

                  if (result) return Ok(result);

                  return BadRequest(new ProblemDetails { Title = "Problem update size" });
            }

            [HttpDelete("delete-size/{id}")]
            public async Task<ActionResult> DeleteSize(int id)
            {
                  var size = await _context.Sizes.FindAsync(id);

                  if(size == null) return BadRequest(new ProblemDetails{ Title = "Can't found size"});

                  _context.Sizes.Remove(size);

                  var result = await _context.SaveChangesAsync() > 0;

                  if (result) return Ok(result);

                  return BadRequest(new ProblemDetails { Title = "Can't delete size" });
            }

            [HttpGet("get-shipper/{id}")]
            public async Task<Shipper> GetShipper(int id) {
                  return await _context.Shippers.FindAsync(id);
            }

            [HttpGet("get-product-with-details")]
            public async Task<ActionResult<List<ProductReceiptDto>>> GetProductWithDetails() {
                  return await _context.Products
                        .OrderByDescending(x => x.Id)
                        .ProjectOrderToOrderDto()
                        .ToListAsync();
            }

            [HttpGet("get-receipts")]
            public async Task<ActionResult<List<ReceiptDto>>> GetReceipt() {
                  return await _context.Receipts
                        .OrderByDescending(x => x.DateCreate)
                        .ProjectReceiptToReceiptDto()
                        .ToListAsync();
            }

            [HttpPost("new-receipt")]
            public async Task<ActionResult<CreateReceiptVm>> CreateReceipt(CreateReceiptVm receiptVm)
            {
                  try
                  {
                        // Parse the incoming JSON request
                        var partnerName = receiptVm.Partner;
                        var updateItems = receiptVm.Update;

                        // Find the partner by name (you should have a Partner repository/service)
                        var partner = await _context.Partners.FirstOrDefaultAsync(p => p.Name == partnerName);

                        if (partner == null)
                        {
                              return NotFound("Partner not found");
                        }

                        // Create a new receipt
                        var newReceipt = new Receipt
                        {
                              Total = 0, // Calculate the total based on receipt details
                              DateCreate = DateTime.Now,
                              Status = 0, // Set the initial status as needed
                              PartnerId = partner.Id,
                              Partner = partner,
                              ReceiptDetails = new List<ReceiptDetails>()
                        };

                        foreach (var updateItem in updateItems)
                        {
                              var receiptDetail = new ReceiptDetails
                              {
                                    Receipt = newReceipt,
                                    ProductId = updateItem.ProductId,
                                    Quantity = updateItem.Quantity,
                                    Size = updateItem.Size,
                                    Color = updateItem.Color,
                                    Price = updateItem.Price,
                                    AfterPrice = updateItem.Price,
                                    ChildrenId = updateItem.ChildrenId
                              };

                              // Check if there is a childrenId, update ProductDetails
                              if (!string.IsNullOrEmpty(updateItem.ChildrenId))
                              {
                                    int childrenId = int.Parse(updateItem.ChildrenId);
                                    var productDetail = _context.ProductDetails.FirstOrDefault(pd => pd.Id == childrenId);
                                    var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == updateItem.ProductId);

                                    if (productDetail != null && product != null)
                                    {
                                          productDetail.Quantity += updateItem.Quantity;
                                          product.QuantityInStock += updateItem.Quantity;
                                    }
                                    else
                                    {
                                          return NotFound("Can't update Product Quantity");
                                    }
                              }
                              else
                              {
                                    // Update QuantityInStock in Product
                                    var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == updateItem.ProductId);
                                    if (product != null)
                                    {
                                          product.QuantityInStock += updateItem.Quantity;
                                    }
                                    else
                                    {
                                          return NotFound("Can't update Quantity in stock");
                                    }
                              }

                              newReceipt.ReceiptDetails.Add(receiptDetail);
                        }

                        // Calculate the total for the receipt based on receipt details
                        newReceipt.Total = newReceipt.ReceiptDetails.Sum(rd => rd.Price * rd.Quantity);

                        // Save the receipt to the database
                        _context.Receipts.Add(newReceipt);
                        await _context.SaveChangesAsync();

                        return Ok("Receipt created successfully");
                  }
                  catch (Exception ex)
                  {
                        return BadRequest($"Error: {ex.Message}");
                  }
            }
      }
}