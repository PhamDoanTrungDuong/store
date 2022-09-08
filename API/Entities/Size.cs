using System.Collections.Generic;

namespace API.Entities
{
    public class Size
    {
        public int Id { get; set; }
        public string Size_value { get; set; }
        public ICollection<ProductAttributes> ProductAttributes { get; set; }
    }
}