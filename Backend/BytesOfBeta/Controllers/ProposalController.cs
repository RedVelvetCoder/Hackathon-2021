using PetDAL;
using PetDataContract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace BytesOfBeta.Controllers
{
    public class ProposalController : ApiController
    {
        public PetsDAL PetData;
        public ProposalController()
        {
            PetData = new PetsDAL();
        }
        public void BuyPlan(BuyPlan plan) // Save Customer Selected Plan on Quotes Page Click
        {
            try
            {
                string ProposalNo = "PB" + plan.Planid + "PG" + plan.Enquiry;
                PetData.SavePlan(plan , ProposalNo);
            }
            catch(Exception ex)
            {
                PetData.InsertErrorLogs(plan.Enquiry, ex.Message, "SavePlans");
            }

        }

        public void SaveVisitorDetails(VisitorDetails visitorDetails) // Save visitor Details After Customer Selects the Plan
        {
            try
            {
                PetData.SaveProposalDetails(visitorDetails);
            }
            catch (Exception ex)
            {
                PetData.InsertErrorLogs(visitorDetails.Enquiry, ex.Message, "SavePlans");
            }

        }

        public ProposalDetails GetProposalData(long Enquiry) // Save Customer Selected Plan on Quotes Page Click
        {
            ProposalDetails proposalDetails = new ProposalDetails();
            try
            {
                proposalDetails = PetData.GetProposalData(Enquiry);
            }
            catch (Exception ex)
            {
                PetData.InsertErrorLogs(Enquiry, ex.Message, "GetProposalData");
            }
            return proposalDetails;
        }

    }
}
