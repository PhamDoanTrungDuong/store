using System;
using Microsoft.AspNetCore.Http;

namespace API.ViewModel
{
    public class SliderVm
    {
        public IFormFile File { get; set; }
        public string Caption { get; set; }
        public string Description { get; set; }
    }
}