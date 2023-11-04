using System;

namespace API.Entities
{
    public class Voucher
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public double? Value { get; set; } 
        public VoucherFeature Feature { get; set; } = VoucherFeature.Percent;
        public DateTime Exspire { get; set; }
        public DateTime CreateAt { get; set; }
    }
}