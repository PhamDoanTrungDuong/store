using System;

namespace API.DTOs
{
    public class LikeDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int LikedProductId { get; set; }
        public bool isLike { get; set; }
        public DateTime LikeAt { get; set; }
        public string PictureUrl { get; set; }
        public string productName { get; set; }
        public string Username { get; set; }
    }
}