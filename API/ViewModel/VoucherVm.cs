using System;
using Microsoft.AspNetCore.Http;

namespace API.ViewModel
{
    public class VoucherVm
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public string Feature { get; set; }
        public double Value { get; set; }
    }
}