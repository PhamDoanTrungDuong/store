using System;
using Microsoft.AspNetCore.Http;

namespace API.ViewModel
{
    public class SliderUpdateVm
    {
        public int Id { get; set; }
        public IFormFile File { get; set; }
        public string Caption { get; set; }
        public string Description { get; set; }
    }
}