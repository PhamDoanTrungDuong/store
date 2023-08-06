using System.Linq;
using API.DTOs;
using API.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class OrderExtensions
    {
        public static IQueryable<OrderDto> ProjectOrderToOrderDto(this IQueryable<Order> query)
        {
            return query
                .Select(order => new OrderDto
                {
                    Id = order.Id,
                    BuyerId = order.BuyerId,
                    OrderDate = order.OrderDate,
                    DeliveryFee = order.DeliveryFee,
                    ShippingAddress = order.ShippingAddress,
                    Subtotal = order.Subtotal,
                    OrderStatus = order.OrderStatus.ToString(),
                    DeliveryStatus = order.DeliveryStatus.ToString(),
                    Total = order.GetTotal(),
                    isRefund = order.isRefund,
                    isUserNotifi = order.isUserNotifi,
                    isVnPay = order.isVnPay,
                    orderId = order.orderId,
                    paymentIntentId = order.PaymentIntentId,
                    Discount = order.Discount,
                    CurrentShipperId = order.CurrentShipperId,
                    OrderItems = order.OrderItems.Select(item => new OrderItemDto
                    {
                        ProductId = item.ItemOrdered.ProductId,
                        Name = item.ItemOrdered.Name,
                        PictureUrl = item.ItemOrdered.PictureUrl,
                        Price = item.Price,
                        Quantity = item.Quantity,
                        Color = item.ItemOrdered.Color,
                        Size = item.ItemOrdered.Size
                    }).ToList()
                }).AsNoTracking();
        }

        public static IQueryable<Order> Search(this IQueryable<Order> query, string searchTerm)
        {
            if(string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(p => p.ShippingAddress.FullName.ToLower().Contains(lowerCaseSearchTerm));
        }
    }
}