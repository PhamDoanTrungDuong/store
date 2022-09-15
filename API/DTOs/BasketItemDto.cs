namespace API.DTOs
{
    public class BasketItemDto
    {
        public int ProductId { get; set; }

        public string Name { get; set; }

        public long Price { get; set; }

        public string PictureUrl { get; set; }

        public string Brand { get; set; }

        public string Type { get; set; }

        public int Quantity { get; set; }

        public string Color { get; set; }

        public string Size { get; set; }

        public long? SalePrice { get; set; }

    }
}