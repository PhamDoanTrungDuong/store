using Microsoft.AspNetCore.Http;

namespace API.DTOs
{
    public class ProductDto
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public long Price { get; set; }

        public IFormFile File { get; set; }

        public string Type { get; set; }

        public string Brand { get; set; }

        public string CurrentCateId { get; set; }

        public int QuantityInStock { get; set; }
    }
}