namespace API.Entities
{
    public class UserLike
    {
        public User User {get; set;}
        public int UserId { get; set; }
        public Product LikedProduct { get; set; }
        public int LikedProductId { get; set; }

    }
}