using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate
{
    [Owned]
    public class ProductItemOrdered
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string PictureUrl { get; set; }
        public string Color { get; set; }
        public string Size { get; set; }

    }
}