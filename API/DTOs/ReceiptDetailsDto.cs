using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class ReceiptDetailsDto
    {
         public int Id { get; set; }
        public int ReceiptId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public long Price { get; set; }
        public long AfterPrice { get; set; }
    }
}