using System;

namespace API.DTOs
{
    public class CommentDto
    {
        public int Id { get; set; }
        public int userId { get; set; }
        public string Username { get; set; }
        public int productId { get; set; }
        public string productName { get; set; }
        public string Content { get; set; }
        public int Rate { get; set; }
        public DateTime CommentSent { get; set; }
        public string PictureUrl { get; set; }
        public bool isAccept { get; set; }
        public bool isNoftify { get; set; }

    }
}