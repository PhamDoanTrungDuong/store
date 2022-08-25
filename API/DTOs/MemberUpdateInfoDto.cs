using Microsoft.AspNetCore.Http;

namespace API.DTOs
{
    public class MemberUpdateInfoDto
    {
        public string Phone { get; set; }
        public string Email { get; set; }
        public IFormFile File { get; set; }

    }
}