using System;

namespace API.Entities
{
    public class DiscountBanner
    {
        public int Id { get; set; }
        public string Picture { get; set; }
        public string Title { get; set; }
        public string Caption { get; set; }
        public DateTime CreateAt { get; set; }
    }
}