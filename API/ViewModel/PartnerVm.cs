using System;
using Microsoft.AspNetCore.Http;

namespace API.ViewModel
{
    public class PartnerVm
    {
        public IFormFile File { get; set; }
        public string Name { get; set; }
    }
}