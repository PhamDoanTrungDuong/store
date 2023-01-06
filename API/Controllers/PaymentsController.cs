using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using API.Data;
using API.DTOs;
using API.Entities;
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
            [HttpPost("Normal-payment")]
            public async Task<ActionResult<BasketDto>> CreatePayment()
            {
                  var basket = await _context.Baskets
                      .RetrieveBasketWithItems(User.Identity.Name)
                      .FirstOrDefaultAsync();

                  if (basket == null) return NotFound();

                  basket.PaymentIntentId = "0";
                  basket.ClientSecret = "0";

                  _context.Update(basket);

                  var result = await _context.SaveChangesAsync() > 0;

                  if (!result) return BadRequest(new ProblemDetails { Title = "Problem updating basket with intent" });

                  return basket.MapBasketToDto();
            }

            [Authorize]
            [HttpPost]
            public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
            {
                  var basket = await _context.Baskets
                      .RetrieveBasketWithItems(User.Identity.Name)
                      .FirstOrDefaultAsync();

                  if (basket == null) return NotFound();

                  var intent = await _paymentService.CreateOrUpdatePaymentIntent(basket);

                  if (intent == null) return BadRequest(new ProblemDetails { Title = " Problem creating payment intent" });

                  basket.PaymentIntentId = basket.PaymentIntentId ?? intent.Id;
                  basket.ClientSecret = basket.ClientSecret ?? intent.ClientSecret;

                  _context.Update(basket);

                  var result = await _context.SaveChangesAsync() > 0;

                  if (!result) return BadRequest(new ProblemDetails { Title = "Problem updating basket with intent" });

                  return basket.MapBasketToDto();
            }
            [Authorize]
            [HttpPost("refund-intent/{id}")]
            public async Task<ActionResult> RefundIntent(int id)
            {
                  var order = await _context.Orders.FindAsync(id);
                  Refund intent = await _paymentService.RefundIntent(id);

                  if (intent == null) return BadRequest(new ProblemDetails { Title = " Problem creating payment intent" });

                  if(intent.Status == "succeeded")
                  {
                        order.isRefund = true;
                  }

                  var result = await _context.SaveChangesAsync() > 0;

                  if(result) return Ok(intent);

                  return BadRequest();
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
            public async Task<ActionResult> MoMoPayment(double discount)
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

                  double subtotal = 0;
                  double discountValue = discount / 100;
                  var subtotal2 = items.Sum(item => item.Price * item.Quantity) * 23.400;

                  if(discount != 0) {
                        subtotal = subtotal2 - (subtotal2 * discountValue);
                  } else {
                        subtotal = subtotal2;
                  }

                  var data = Base64EncodeObject(discount);

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

                  string orderId = Guid.NewGuid().ToString("N");
                  string requestId = Guid.NewGuid().ToString("N");
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


            [Authorize]
            [HttpPost("Momo-query")]
            public async Task<ActionResult> MoMoQuery(int Id)
            {
                  var order = await _context.Orders.FindAsync(Id);
                  //request params need to request to MoMo system
                  string endpoint = _config["MoMoSettings:endpointQuery"].ToString() == "" ? "https://test-payment.momo.vn/v2/gateway/api/query" : _config["MoMoSettings:endpointQuery"].ToString();
                  string partnerCode = _config["MoMoSettings:partnerCode"].ToString();
                  string accessKey = _config["MoMoSettings:accessKey"].ToString();
                  string serectkey = _config["MoMoSettings:serectKey"].ToString();
                  string requestId = order.requestId;
                  string orderId = order.orderId;

                  //Before sign HMAC SHA256 signature
                  string rawHash = "accessKey=" + accessKey +
                        "&orderId=" + orderId +
                        "&partnerCode=" + partnerCode +
                        "&requestId=" + requestId
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
                        { "orderId", orderId },
                        { "lang", "en" },
                        { "signature", signature }
                  };

                  string responseFromMomo = MoMoPaymentRequest.sendPaymentRequest(endpoint, message.ToString());

                  if(responseFromMomo == null)
                  {
                        return BadRequest(new ProblemDetails { Title = "Problem query with MoMo" });
                  }
                  return Ok(responseFromMomo);
            }

            [Authorize]
            [HttpPost("Momo-refund")]
            public async Task<ActionResult> MoMoRefund(int Id)
            {
                  var order = await _context.Orders.FindAsync(Id);
                  if(order.DeliveryStatus == DeliveryStatus.OnTheWay)
                  {
                        return BadRequest(new ProblemDetails{Title = "Order has been confirm can't refund"});
                  }
                  //request params need to request to MoMo system
                  string endpoint = _config["MoMoSettings:endpointRefund"].ToString() == "" ? "https://test-payment.momo.vn/v2/gateway/api/refund" : _config["MoMoSettings:endpointRefund"].ToString();
                  string partnerCode = _config["MoMoSettings:partnerCode"].ToString();
                  string accessKey = _config["MoMoSettings:accessKey"].ToString();
                  string serectkey = _config["MoMoSettings:serectKey"].ToString();

                  string description = "";
                  var transId = long.Parse(order.transId);
                  var amount = order.Subtotal + order.DeliveryFee;
                  string orderId = Guid.NewGuid().ToString("N");
                  string requestId = Guid.NewGuid().ToString("N");


                  //Before sign HMAC SHA256 signature
                  string rawHash = "accessKey=" + accessKey +
                        "&amount=" + amount +
                        "&description=" + description +
                        "&orderId=" + orderId +
                        "&partnerCode=" + partnerCode +
                        "&requestId=" + requestId +
                        "&transId=" + transId
                        ;


                  MoMoSecurity crypto = new MoMoSecurity();
                  //sign signature SHA256
                  string signature = crypto.signSHA256(rawHash, serectkey);

                  //build body json request
                  JObject message = new JObject
                  {
                        { "partnerCode", partnerCode },
                        { "orderId", orderId },
                        { "requestId", requestId },
                        { "amount", amount },
                        { "transId", transId },
                        { "lang", "en" },
                        { "description", description },
                        { "signature", signature }
                  };

                  string responseFromMomo = MoMoPaymentRequest.sendPaymentRequest(endpoint, message.ToString());

                  if(responseFromMomo == null)
                  {
                        return BadRequest(new ProblemDetails { Title = "Problem refund with MoMo" });
                  }

                  order.isRefund = true;
                  await _context.SaveChangesAsync();

                  return Ok(responseFromMomo);
            }

            [Authorize]
            [HttpPost("vnpay-payment")]
            public async Task<ActionResult> VnPayPayment(double discount)
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

                  // var subtotal = (items.Sum(item => item.Price * item.Quantity)) * 234.000;
                  double subtotal = 0;
                  double discountValue = discount / 100;
                  var subtotal2 = items.Sum(item => item.Price * item.Quantity) * 234.000;

                  if(discount != 0) {
                        subtotal = subtotal2 - (subtotal2 * discountValue);
                  } else {
                        subtotal = subtotal2;
                  }

                  //Get Config Info
                  string vnp_Returnurl = _config["VnPaySettings:vnp_Returnurl"].ToString(); //URL nhan ket qua tra ve
                  string vnp_Url = _config["VnPaySettings:vnp_Url"].ToString(); //URL thanh toan cua VNPAY
                  string vnp_TmnCode = _config["VnPaySettings:vnp_TmnCode"].ToString(); //Ma website
                  string vnp_HashSecret = _config["VnPaySettings:vnp_HashSecret"].ToString(); //Chuoi bi mat
                  VnPayService pay = new VnPayService();

                  pay.AddRequestData("vnp_Version", "2.1.0"); //Phiên bản api mà merchant kết nối. Phiên bản hiện tại là 2.1.0
                  pay.AddRequestData("vnp_Command", "pay"); //Mã API sử dụng, mã cho giao dịch thanh toán là 'pay'
                  pay.AddRequestData("vnp_TmnCode", vnp_TmnCode); //Mã website của merchant trên hệ thống của VNPAY (khi đăng ký tài khoản sẽ có trong mail VNPAY gửi về)
                  pay.AddRequestData("vnp_Amount", subtotal.ToString()); //số tiền cần thanh toán, công thức: số tiền * 100 - ví dụ 10.000 (mười nghìn đồng) --> 1000000
                  pay.AddRequestData("vnp_BankCode", ""); //Mã Ngân hàng thanh toán (tham khảo: https://sandbox.vnpayment.vn/apis/danh-sach-ngan-hang/), có thể để trống, người dùng có thể chọn trên cổng thanh toán VNPAY
                  pay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss")); //ngày thanh toán theo định dạng yyyyMMddHHmmss
                  pay.AddRequestData("vnp_CurrCode", "VND"); //Đơn vị tiền tệ sử dụng thanh toán. Hiện tại chỉ hỗ trợ VND
                  pay.AddRequestData("vnp_IpAddr", Utils.GetIpAddress()); //Địa chỉ IP của khách hàng thực hiện giao dịch
                  pay.AddRequestData("vnp_Locale", "vn"); //Ngôn ngữ giao diện hiển thị - Tiếng Việt (vn), Tiếng Anh (en)
                  pay.AddRequestData("vnp_OrderInfo", discount.ToString()); //Thông tin mô tả nội dung thanh toán
                  pay.AddRequestData("vnp_OrderType", "other"); //topup: Nạp tiền điện thoại - billpayment: Thanh toán hóa đơn - fashion: Thời trang - other: Thanh toán trực tuyến
                  pay.AddRequestData("vnp_ReturnUrl", vnp_Returnurl); //URL thông báo kết quả giao dịch khi Khách hàng kết thúc thanh toán
                  pay.AddRequestData("vnp_TxnRef", DateTime.Now.Ticks.ToString()); //mã hóa đơn
                  // pay.AddRequestData("vnp_Discount", discount.ToString()); //discount

                  string paymentUrl = pay.CreateRequestUrl(vnp_Url, vnp_HashSecret);

                  return Ok(paymentUrl);

                  // //Update basket
                  // _context.Update(basket);
                  // var result = await _context.SaveChangesAsync() > 0;
                  // if (!result) return BadRequest(new ProblemDetails { Title = "Problem updating basket with momo" });

                  // return Ok();
            }
            // [Authorize]
            // [HttpPost("paypal-payment")]
            // public async Task<ActionResult> PayPalPayment()
            // {
            //       var basket = await _context.Baskets
            //           .RetrieveBasketWithItems(User.Identity.Name)
            //           .FirstOrDefaultAsync();

            //       var userShippingAddres = await _context.Users
            //             .Where(x => x.UserName == User.Identity.Name)
            //             .Include(x => x.Address)
            //             .FirstOrDefaultAsync();

            //       if (basket == null) return NotFound();

            //       if(userShippingAddres.Address == null)
            //       {
            //             return BadRequest(new ProblemDetails{Title = "Please check your information from your profile"});
            //       }

            //       var items = new List<Entities.OrderAggregate.OrderItem>();

            //       foreach (var item in basket.Items)
            //       {
            //             var productItem = await _context.Products.FindAsync(item.ProductId);
            //             if(productItem == null) return NotFound();
            //             // if(productItem.QuantityInStock < 1) return BadRequest(new ProblemDetails{Title = $"Product {productItem.Name} is out of stock"});
            //             var itemOrdered = new ProductItemOrdered
            //             {
            //                   ProductId = productItem.Id,
            //                   Name = productItem.Name,
            //                   PictureUrl = productItem.PictureUrl,
            //                   Color = item.Color,
            //                   Size = item.Size
            //             };

            //             var orderItem = new Entities.OrderAggregate.OrderItem
            //             {
            //                   ItemOrdered = itemOrdered,
            //                   Price = productItem.Price,
            //                   Quantity = item.Quantity
            //             };

            //             items.Add(orderItem);
            //       }

            //       // var subtotal = (items.Sum(item => item.Price * item.Quantity)) * 234.000;
            //       var subtotal = items.Sum(item => item.Price * item.Quantity);

            //       //Get Config Info
            //       string clientId = _config["PayPalSettings:clientId"].ToString();
            //       string secretKet = _config["PayPalSettings:secretKey"].ToString();



            //       return Ok();
            // }


            [HttpPost("confirm-hashsecret/{vnp_SecureHash}")]
            public bool HashSecretConfirm(string vnp_SecureHash) {
                  string hashSecret = _config["VnPaySettings:vnp_HashSecret"].ToString(); //Chuoi bi mat
                  VnPayService pay = new VnPayService();

                   bool checkSignature = pay.ValidateSignature(vnp_SecureHash, hashSecret);

                   if(checkSignature){
                        return true;
                   }else{
                        return false;
                   }
            }

            public static string Base64EncodeObject(object obj)
            {
                  var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(obj));
                  return System.Convert.ToBase64String(plainTextBytes);
            }

      }
}

// "partnerCode": "MOMO5RGX20191128",
// "accessKey": "M8brj9K6E22vXoDB",
// "serectKey": "nqQiVSgDMy809JoPF6OzP5OdBUB550Y4",