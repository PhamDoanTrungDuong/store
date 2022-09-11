using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    public class Size
    {
        public int Id { get; set; }
        public string Size_value { get; set; }
        public ICollection<ProductSize> ProductSizes { get; set; }
    }
}