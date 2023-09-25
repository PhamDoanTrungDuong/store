using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class ReceiptDetails
    {
        public int Id { get; set; }
        public int ReceiptId { get; set; }
        public Receipt Receipt { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int Quantity { get; set; }
        public string Size { get; set; }
        public string Color { get; set; }
        public long Price { get; set; }
        public long AfterPrice { get; set; }
        public string ChildrenId { get; set; }
    }
}