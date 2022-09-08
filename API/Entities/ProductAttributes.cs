namespace API.Entities
{
    public class ProductAttributes
    {
        public int ProductId { get; set; }
        public Product Product { get; set; }

        public int SizeId { get; set; }
        public Size Size { get; set; }

        public int ColourId { get; set; }
        public Colour Colour { get; set; }
    }
}