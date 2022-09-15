using System.Collections.Generic;
using System.Linq;

namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }

        public string BuyerId { get; set; }

        public List<BasketItem> Items { get; set; } = new();

        public string PaymentIntentId { get; set; }

        public string ClientSecret { get; set; }

        public void AddItem(Product product, int quantity, string color, string size, long salesPrice)
        {
            // if(Items.All(item => item.ProductId != product.Id))
            // {
            //     Items.Add(new BasketItem{Product = product, Quantity = quantity, Color = color, Size = size});
            // }

            var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id && item.Color == color && item.Size == size);
            if(existingItem != null)
            {
                existingItem.Quantity += quantity;
            }else{
                Items.Add(new BasketItem{Product = product, Quantity = quantity, Color = color, Size = size, SalePrice = salesPrice});
            }
        }

        public void RemoveItem(int productId, int quantity)
        {
            var item = Items.FirstOrDefault(item => item.ProductId == productId);
            if(item == null) return;
            item.Quantity -= quantity;
            if(item.Quantity <= 0) Items.Remove(item);
        }

    }
}