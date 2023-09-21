using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class ProductReceiptDetailsDto
    {
         public int ColourId { get; set; }
        public string ColorsValue { get; set; }
        public int SizeId { get; set; }
        public string SizesValue { get; set; }
        public int Quantity { get; set; }
    }
}