using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.ViewModel
{
    public class CreateReceiptVm
    {
        [Required]
        public string Partner { get; set; }

        [Required]
        public IList<ReceiptDetails> Update { get; set; }
    }
}