using System;

namespace API.DTOs
{
    public class DiscountDto
    {
        public int DiscountValue { get; set; }
        public DateTime DateCreate { get; set; }
        public int productId { get; set; }
        public string productName { get; set; }
        public string PictureUrl { get; set; }
        public long Price { get; set; }
        public string Type { get; set; }
        public string Brand { get; set; }
        public int QuantityInStock { get; set; }

    }
}