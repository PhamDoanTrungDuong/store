using API.Entities;

namespace API.DTOs
{
    public class UserDto
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public string Username { get; set; }
        public string Phone { get; set; }
        public BasketDto Basket { get; set; }
        public AddressDto Address { get; set; }
    }
}