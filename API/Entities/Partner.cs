using System;

namespace API.Entities
{
    public class Partner
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Picture { get; set; }
        public DateTime CreateAt { get; set; }
    }
}