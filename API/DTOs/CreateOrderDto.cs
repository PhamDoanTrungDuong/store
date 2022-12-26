using API.Entities.OrderAggregate;

namespace API.DTOs
{
    public class CreateOrderDto
    {
        public bool SaveAddress { get; set; }

        public ShippingAddress ShippingAddress { get; set; }
        public double Discount { get; set; }
    }
}