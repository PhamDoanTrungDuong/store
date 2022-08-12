using System;

namespace API.Entities
{
    public class Comment
    {
        public int Id { get; set; }
        public int userId { get; set; }
        public string Username { get; set; }
        public User User { get; set; }
        public int productId { get; set; }
        public string productName { get; set; }
        public Product Product { get; set; }
        public string Content { get; set; }
        public int Rate { get; set; }
        public DateTime CommentSent { get; set; } = DateTime.Now;
        public bool userDeleted { get; set; }

    }
}