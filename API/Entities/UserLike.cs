using System;

namespace API.Entities
{
    public class UserLike
    {
        public int Id { get; set; }
        public User User {get; set;}
        public int UserId { get; set; }
        public Product LikedProduct { get; set; }
        public int LikedProductId { get; set; }
        public bool isLike { get; set; }
        public DateTime LikeAt { get; set; } = DateTime.Now;
        public string PictureUrl { get; set; }
        public string productName { get; set; }
        public string Username { get; set; }
    }
}