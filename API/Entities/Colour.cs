using System.Collections.Generic;

namespace API.Entities
{
    public class Colour
    {
        public int Id { get; set; }
        public string Colour_value { get; set; }
        public ICollection<ProductAttributes> ProductAttributes { get; set; }
    }
}