using System.Collections.Generic;

namespace API.DTOs
{
    public class BasketDto
    {
        public int Id { get; set; }

        public string BuyerId { get; set; }

        public IEnumerable<BasketItemDto> Items { get; set; }

    }
}