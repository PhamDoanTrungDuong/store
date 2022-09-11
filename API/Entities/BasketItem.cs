using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("BasketItems")]
    public class BasketItem
    {

        public int Id { get; set; }
        public int Quantity { get; set; }
        public string Color { get; set; }
        public string Size { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }

        public int BasketId { get; set; }
        public Basket Basket { get; set; }

    }
}