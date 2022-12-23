using System;

namespace API.Entities
{
    public class Coupon
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Number { get; set; }
        public string Feature { get; set; }
        public string Value { get; set; }
        public DateTime Expire { get; set; }
        public DateTime CreateAt { get; set; }
    }
}