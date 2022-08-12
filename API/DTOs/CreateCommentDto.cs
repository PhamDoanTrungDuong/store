namespace API.DTOs
{
    public class CreateCommentDto
    {
        public int ProductId { get; set; }
        public string Content { get; set; }
        public int Rate { get; set; }

    }
}