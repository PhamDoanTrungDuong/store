using API.Entities;

namespace API.DTOs
{
    public class SelectedAddressDto : Address
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string PhoneNumber { get; set; }
    }
}