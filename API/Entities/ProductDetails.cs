namespace API.Entities
{
    public class ProductDetails
    {
        public int Id { get; set; }
        public int ColourId { get; set; }
        public string ColourValue { get; set; }
        public string Colour_code { get; set; }
        public Colour Colour { get; set; }
        public int SizeId { get; set; }
        public string SizeValue { get; set; }
        public Size Size { get; set; }
        public int Quantity { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
    }
}