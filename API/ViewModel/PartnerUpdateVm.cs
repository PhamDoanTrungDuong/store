using System;
using Microsoft.AspNetCore.Http;

namespace API.ViewModel
{
    public class PartnerUpdateVm
    {
        public int Id { get; set; }
        public IFormFile File { get; set; }
        public string Name { get; set; }
    }
}