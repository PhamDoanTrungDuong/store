using System;
using Microsoft.AspNetCore.Http;

namespace API.ViewModel
{
    public class DiscountBannerVm
    {
        public IFormFile File { get; set; }
        public string Caption { get; set; }
        public string Title { get; set; }
    }
}