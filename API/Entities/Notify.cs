namespace API.Entities
{
    public class Notify
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public bool CommentNotify { get; set; }
        public bool OrderNotify { get; set; }
        public bool MemberNotify { get; set; }
        public bool MessengerNotify { get; set; }
    }
}