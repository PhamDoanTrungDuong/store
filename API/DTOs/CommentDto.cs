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
        public DateTime CommentSent { get; set; }
    }
}