using System;
using System.Collections.Generic;
using API.Entities.OrderAggregate;

namespace API.DTOs
{
    public class OrderDto
    {
        public int Id { get; set; }

        public string BuyerId { get; set; }

        public ShippingAddress ShippingAddress { get; set; }

        public DateTime OrderDate { get; set; }

        public List<OrderItemDto> OrderItems { get; set; }

        public long Subtotal { get; set; }

        public long DeliveryFee { get; set; }

        public string OrderStatus { get; set; }
        public string DeliveryStatus { get; set; }
        public long Total { get; set; }

        public bool isRefund { get; set; }
        public bool isUserNotifi { get; set; }
        public bool? isVnPay { get; set; }
        public string orderId { get; set; }
        public string paymentIntentId { get; set; }

    }
}