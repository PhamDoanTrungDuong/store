using System;

namespace API.Entities
{
    public class ProductDiscount
    {
        public int Id { get; set; }
        public double DiscountValue { get; set; }
        public DateTime DateCreate { get; set; } = DateTime.Now;
        public int productId { get; set; }
        public Product Product { get; set; }
        public string productName { get; set; }
        public string PictureUrl { get; set; }
        public long Price { get; set; }
        public string Type { get; set; }
        public string Brand { get; set; }
        public int QuantityInStock { get; set; }
    }
}