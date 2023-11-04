using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    public class Category
    {
        [Key]
        public int CateId { get; set; } 
        public string Name { get; set; }

        [ForeignKey("CurrentCateId")]
        public ICollection<Product> Products { get; set; }
    }
}