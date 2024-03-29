using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class ProductReceiptDto
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string PictureUrl { get; set; }
        public int Quantity { get; set; }

        public ICollection<ProductReceiptDetailsDto> ProductDetails { get; set; }
    
    }
}