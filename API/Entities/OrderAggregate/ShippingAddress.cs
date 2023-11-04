using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate
{
    [Owned]
    public class ShippingAddress : Address 
    {
        public string PhoneNumber { get; set; }
    }
}