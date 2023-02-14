using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    public class Colour
    {
        public int Id { get; set; }
        public string Colour_value { get; set; }
        public string Colour_code { get; set; }
        public ICollection<ProductDetails> ProductDetails { get; set; }
    }
}