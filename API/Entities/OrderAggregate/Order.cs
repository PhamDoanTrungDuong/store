using System;
using System.Collections.Generic;

namespace API.Entities.OrderAggregate
{
    public class Order
    {
        public int Id { get; set; }

        public string BuyerId { get; set; }

        public ShippingAddress ShippingAddress { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.Now;

        public List<OrderItem> OrderItems { get; set; }

        public long Subtotal { get; set; }

        public long DeliveryFee { get; set; }

        public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;
        public DeliveryStatus DeliveryStatus { get; set; } = DeliveryStatus.PendingConfirm;

        public string PaymentIntentId { get; set; }
        #nullable enable
        public string? orderId { get; set; }
        public string? requestId { get; set; }
        public string? transId { get; set; }
        public bool isRefund { get; set; }

        public long GetTotal()
        {
            return Subtotal + DeliveryFee;
        }
    }
}