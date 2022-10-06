using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace API.Services
{
   public class PaymentService
   {
      private readonly IConfiguration _config;
      private readonly StoreContext _context;
      public PaymentService(StoreContext context, IConfiguration config)
      {
         _context = context;
         _config = config;
      }

      public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket)
      {
         StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];

         var service = new PaymentIntentService();

         var intent = new PaymentIntent();

         var subtotal = basket.Items.Sum(item => item.Quantity * item.Product.Price);
         var deliveryFee = subtotal > 10000 ? 0 : 500;

         if (string.IsNullOrEmpty(basket.PaymentIntentId))
         {
            var options = new PaymentIntentCreateOptions
            {
               Amount = subtotal + deliveryFee,
               Currency = "usd",
               PaymentMethodTypes = new List<string> { "card" }
            };
            intent = await service.CreateAsync(options);
         }
         else
         {
            var options = new PaymentIntentUpdateOptions
            {
               Amount = subtotal + deliveryFee
            };
            await service.UpdateAsync(basket.PaymentIntentId, options);
         }

         return intent;
      }

      public async Task<Refund> RefundIntent(int id)
      {
         StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];

        var order = await _context.Orders.FindAsync(id);

         var options = new RefundCreateOptions { PaymentIntent = order.PaymentIntentId };
         var service = new RefundService();
         var result = service.Create(options);
         return result;
      }

   }
}