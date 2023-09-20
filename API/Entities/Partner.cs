using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    public class Partner
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Picture { get; set; }
        public DateTime CreateAt { get; set; }

        // [ForeignKey("CurrentPartnerId")]
        public ICollection<Receipt> Receipts { get; set; }
    }
}