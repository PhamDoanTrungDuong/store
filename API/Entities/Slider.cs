using System;

namespace API.Entities
{
    public class Slider 
    {
        public int Id { get; set; }
        public string Picture { get; set; }
        public string Caption { get; set; }
        public string Description { get; set; }
        public DateTime CreateAt { get; set; }
    }
}