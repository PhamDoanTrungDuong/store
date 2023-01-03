using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public long Price { get; set; }
        public string PictureUrl { get; set; }
        public string Type { get; set; }
        public string Brand { get; set; }
        public int QuantityInStock { get; set; }
        public string PublicId { get; set; }
        public int ViewCount { get; set; } = default;
        public ICollection<Comment> CommentReceived { get; set; }
        public ICollection<UserLike> LikedByUsers { get; set; }

        public ICollection<ProductDetails> ProductDetails { get; set; }
        public ICollection<ProductDiscount> ProductDiscounts { get; set; }

        public int CurrentCateId { get; set; }
        public Category Category { get; set; }
    }
}