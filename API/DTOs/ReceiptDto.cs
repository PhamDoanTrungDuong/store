using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class ReceiptDto
    {
        public int Id { get; set; }
        public long Total { get; set; }
        public DateTime DateCreate { get; set; }
        public int Status { get; set; }
        public int PartnerId { get; set; }
        public ICollection<ReceiptDetailsDto> ReceiptDetails { get; set; }
    }
}