using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.ViewModel
{
    public class MessageParams
    {
        public string Username { get; set; }
        public string Container { get; set; } = "Unread";
    }
}