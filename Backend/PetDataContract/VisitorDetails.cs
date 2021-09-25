using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetDataContract
{
    public class VisitorDetails
    {
        public long Enquiry { get; set; }
        public string OwnerName { get; set; }
        public string OwnerAddress { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public bool IsMICRTag { get; set; }
    }
}
