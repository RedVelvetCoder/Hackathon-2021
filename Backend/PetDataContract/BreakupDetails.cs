using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetDataContract
{
    public class BreakupDetails
    {
        public long Enquiry { get; set; }
        public decimal? BasicPremium { get; set; }        
        public decimal GST { get; set; }
        public decimal FinalPremium { get; set; }
        public decimal? TheftPremium { get; set; }
        public decimal? ThirdParty { get; set; }
        public decimal? Mortality { get; set; }
        public decimal? OPDExpense { get; set; }
        public decimal? TerminalIllness { get; set; }
        public decimal? LongTermCare { get; set; }
        public int SupplierId { get; set; }

        public int PlanID{ get; set; }
        public decimal Image { get; set; }
        public string SI { get; set; }
    }
}
