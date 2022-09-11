namespace API.Entities
{
    public class ProductColour
    {
        public int ColourId { get; set; }
        public Colour Colour { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
    }
}