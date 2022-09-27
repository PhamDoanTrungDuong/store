namespace API.Entities
{
    public class SelectedAddress : Address
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}