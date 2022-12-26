using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using API.Entities.OrderAggregate;

namespace API.Entities
{
    public class Shipper
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime DayBirth { get; set; }
        public string LicensePlates { get; set; }
        public string Sex { get; set; }
        public string Address { get; set; }
        public string Status { get; set; }
        public string Role { get; set; }

        [ForeignKey("CurrentShipperId")]
        public ICollection<Order> Orders { get; set; }
    }
}