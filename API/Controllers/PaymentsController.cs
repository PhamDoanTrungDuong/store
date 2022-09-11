using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using API.Data;
using API.DTOs;
using API.Entities.OrderAggregate;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Stripe;

namespace API.Controllers
{
      public class PaymentsController : BaseController
      {
            private readonly PaymentService _paymentService;
            private readonly StoreContext _context;
            private readonly IConfiguration _config;
            public PaymentsController(PaymentService paymentService, StoreContext context, IConfiguration config)
            {
                  _config = config;
                  _context = context;
                  _paymentService = paymentService;
            }

            [Authorize]
            [HttpPost]
            public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
            {
                  var basket = await _context.Baskets
                      .RetrieveBasketWithItems(User.Identity.Name)
                      .FirstOrDefaultAsync();

                  if (basket == null) return NotFound();

                  // foreach (var item in basket.Items)
                  // {
                  //       var productItem = await _context.Products.FindAsync(item.ProductId);
                  //       if(productItem == null) return NotFound();
                  //       if(productItem.QuantityInStock < 1) return BadRequest(new ProblemDetails{Title = $"Product {productItem.Name} is out of stock"});
                  // }

                  var intent = await _paymentService.CreateOrUpdatePaymentIntent(basket);

                  if (intent == null) return BadRequest(new ProblemDetails { Title = " Problem creating payment intent" });

                  basket.PaymentIntentId = basket.PaymentIntentId ?? intent.Id;
                  basket.ClientSecret = basket.ClientSecret ?? intent.ClientSecret;

                  _context.Update(basket);

                  var result = await _context.SaveChangesAsync() > 0;

                  if (!result) return BadRequest(new ProblemDetails { Title = "Problem updating basket with intent" });

                  return basket.MapBasketToDto();
            }

            //stripe listen -f http://localhost:5000/api/payments/webhook -e charge.succeeded
            [HttpPost("webhook")]
            public async Task<ActionResult> StripeWebhook()
            {
                  var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
                  try
                  {
                        var stripeEvent = EventUtility.ConstructEvent(json,
                              Request.Headers["Stripe-Signature"], _config["StripeSettings:WhSecret"]);

                        // Handle the event
                        var charge =(Charge)stripeEvent.Data.Object;

                        var order = await _context.Orders.FirstOrDefaultAsync(x =>
                              x.PaymentIntentId == charge.PaymentIntentId);

                        if(charge.Status == "succeeded") order.OrderStatus = OrderStatus.PaymentReceived;

                        await _context.SaveChangesAsync();

                        return new EmptyResult();
                  }
                  catch (StripeException e)
                  {
                        return BadRequest(new ProblemDetails{Title = e.ToString()});
                  }
            }

            [Authorize]
            [HttpPost("Momo-payment")]
            public async Task<ActionResult> MoMoPayment()
            {
                  var basket = await _context.Baskets
                      .RetrieveBasketWithItems(User.Identity.Name)
                      .FirstOrDefaultAsync();

                  var userShippingAddres = await _context.Users
                        .Where(x => x.UserName == User.Identity.Name)
                        .Include(x => x.Address)
                        .FirstOrDefaultAsync();

                  if (basket == null) return NotFound();

                  if(userShippingAddres.Address == null)
                  {
                        return BadRequest(new ProblemDetails{Title = "Please check your information from your profile"});
                  }

                  var items = new List<Entities.OrderAggregate.OrderItem>();

                  foreach (var item in basket.Items)
                  {
                        var productItem = await _context.Products.FindAsync(item.ProductId);
                        if(productItem == null) return NotFound();
                        // if(productItem.QuantityInStock < 1) return BadRequest(new ProblemDetails{Title = $"Product {productItem.Name} is out of stock"});
                        var itemOrdered = new ProductItemOrdered
                        {
                              ProductId = productItem.Id,
                              Name = productItem.Name,
                              PictureUrl = productItem.PictureUrl,
                              Color = item.Color,
                              Size = item.Size
                        };

                        var orderItem = new Entities.OrderAggregate.OrderItem
                        {
                              ItemOrdered = itemOrdered,
                              Price = productItem.Price,
                              Quantity = item.Quantity
                        };

                        items.Add(orderItem);
                  }

                  var subtotal = items.Sum(item => item.Price * item.Quantity);

                  var data = Base64EncodeObject(items);

                  //request params need to request to MoMo system
                  string endpoint = _config["MoMoSettings:endpoint"].ToString() == "" ? "https://test-payment.momo.vn/v2/gateway/api/create" : _config["MoMoSettings:endpoint"].ToString();
                  string partnerCode = _config["MoMoSettings:partnerCode"].ToString();
                  string accessKey = _config["MoMoSettings:accessKey"].ToString();
                  string serectkey = _config["MoMoSettings:serectKey"].ToString();
                  string orderInfo = "DH"+DateTime.Now.ToString("yyyyMMddHHmmss");
                  string redirectUrl = _config["MoMoSettings:returnUrl"].ToString();
                  string ipnUrl = _config["MoMoSettings:notifyUrl"].ToString();
                  string requestType = "captureWallet";

                  string amount = (subtotal).ToString();
                  // string amount = (subtotal * 234.180).ToString();
                  string orderId = Guid.NewGuid().ToString();
                  string requestId = Guid.NewGuid().ToString();
                  string extraData = data;

                  //Before sign HMAC SHA256 signature
                  string rawHash = "accessKey=" + accessKey +
                        "&amount=" + amount +
                        "&extraData=" + extraData +
                        "&ipnUrl=" + ipnUrl +
                        "&orderId=" + orderId +
                        "&orderInfo=" + orderInfo +
                        "&partnerCode=" + partnerCode +
                        "&redirectUrl=" + redirectUrl +
                        "&requestId=" + requestId +
                        "&requestType=" + requestType
                        ;


                  MoMoSecurity crypto = new MoMoSecurity();
                  //sign signature SHA256
                  string signature = crypto.signSHA256(rawHash, serectkey);

                  //build body json request
                  JObject message = new JObject
                  {
                        { "partnerCode", partnerCode },
                        { "partnerName", "Test" },
                        { "storeId", "MomoTestStore" },
                        { "requestId", requestId },
                        { "amount", amount },
                        { "orderId", orderId },
                        { "orderInfo", orderInfo },
                        { "redirectUrl", redirectUrl },
                        { "ipnUrl", ipnUrl },
                        { "lang", "en" },
                        { "extraData", extraData },
                        { "requestType", requestType },
                        { "signature", signature }
                  };

                  string responseFromMomo = MoMoPaymentRequest.sendPaymentRequest(endpoint, message.ToString());

                  if(responseFromMomo == null)
                  {
                        return BadRequest(new ProblemDetails { Title = "Problem payment with MoMo" });
                  }

                  //Update basket
                  _context.Update(basket);
                  var result = await _context.SaveChangesAsync() > 0;
                  if (!result) return BadRequest(new ProblemDetails { Title = "Problem updating basket with momo" });

                  //Return payURL
                  JObject jmessage = JObject.Parse(responseFromMomo);
                  var obj  = new {
                        payUrl = jmessage.GetValue("payUrl").ToString(),
                        signature = signature,
                  };
                  return Ok(obj);
            }

            public static string Base64EncodeObject(object obj)
            {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(obj));
            return System.Convert.ToBase64String(plainTextBytes);
            }
      }
}