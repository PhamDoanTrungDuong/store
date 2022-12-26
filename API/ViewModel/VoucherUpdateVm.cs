using System;
using Microsoft.AspNetCore.Http;

namespace API.ViewModel
{
    public class VoucherUpdateVm
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public double Value { get; set; }
        public string Feature { get; set; }

    }
}