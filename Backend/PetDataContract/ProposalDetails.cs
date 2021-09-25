using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetDataContract
{
    public class ProposalDetails
    {
        public decimal FinalPremium { get; set; }
        public string ProposalNo { get; set; }
        public int SupplierID { get; set; }
        public string PlanAddons { get; set; }
    }
}
