using Microsoft.Practices.EnterpriseLibrary.Data;
using PetDataContract;
using System;
using PetDAL;
using System.Data;
using System.Data.Common;
using System.Web.Http;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace BytesOfBeta.Controllers
{
    public class PetController : ApiController
    {
        
        public PetsDAL PetData;
        public PetController()
        {
            PetData = new PetsDAL();
        }
        [HttpGet]
        public List<string> GetBreeds(int PetID)
        {
            List<string> lstbreeds = new List<string>();
            DataSet ds = new DataSet();
            try
            {
                ds = PetData.GetBreeds(PetID); // Get Breed For DropDown 
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                   lstbreeds.Add(Convert.ToString(dr["PetBreed"]));                   
                }
            }
            catch (Exception Ex)
            {
                PetData.InsertErrorLogs(1, Ex.Message, "GetQuotes");
            }
            return lstbreeds;
        }
        [HttpPost]
        public long InsertPreQuoteDetails(PreQuote input)
        {
            long enquiry = 0;
            try
            {
                Random rnd = new Random(); // Can be auto Incremental from DataBase
                enquiry = rnd.Next(1234, 12345678);
                if (String.IsNullOrEmpty(input.SI))
                    input.SI = "2";// By default Show Quotes on IDV 5 Lakhs
                PetData.InsertPetDetails(input, enquiry); // Insert Basic Pet Details in DB Using Enquriyid
                InsertQuotes(input, enquiry);
            }
            catch(Exception Ex)
            {
                PetData.InsertErrorLogs(enquiry, Ex.Message, "InsertPreQuoteDetails- Enquiry Not Generated");
            }
            return enquiry;
        }
        [HttpGet]
        public PreQuote GetPetDetails(long EnquiryID)
        {
            PreQuote Petdata = new PreQuote();
            try
            {
                Petdata = PetData.GetPetDetails(EnquiryID); // Fetch Pet Details to display on Quote Page Strip
            }
            catch (Exception ex)
            {
                PetData.InsertErrorLogs(EnquiryID, ex.Message, "GetPetDetails");
            }

            return Petdata;
        }

        [HttpPost]
        public void InsertPetName(Petname PetName)
        {
            
            try
            {
                PetData.InsertPetName(PetName.Name, PetName.Enquiry); // Insert Pet Name From Prequote Popup
            }
            catch (Exception Ex)
            {
                PetData.InsertErrorLogs(PetName.Enquiry, Ex.Message, "InsertPetName");
            }
            
        }
        
        public void InsertQuotes(PreQuote input , long Enquiry) // Insert Sample Quotes (Asyncronous Method)
        {
            decimal Rate = 0;
            List<BreakupDetails> lstbreakup = null;
            DataSet ds = new DataSet();
            try
            {
                if (String.IsNullOrEmpty(input.SI))
                    input.SI = "2";// By default Show Quotes on IDV 5 Lakhs
                ds = PetData.GetRate(input,Enquiry);
                if (ds != null && ds.Tables.Count > 0)
                {
                    lstbreakup = GetQuoteBreakup(ds.Tables[0], Enquiry,input.SI);
                    if (lstbreakup.Count > 0 && lstbreakup != null)
                    {
                        foreach (BreakupDetails breakupDetails in lstbreakup)
                        {
                            PetData.InsertQuoteBreakup(breakupDetails);
                        }
                    }
                }
            }
            catch(Exception Ex)
            {
                PetData.InsertErrorLogs(Enquiry, Ex.Message, "InsertQuotes");
            }
        }
        
        public List<BreakupDetails> GetQuoteBreakup(DataTable dt,long Enquiry ,string SI) // Get Breakup To Display Quotes On Quotes Page
        {
            List<BreakupDetails> lstbreakup = new List<BreakupDetails>();
            decimal PackagePremium = 0M;
            decimal TotalAddonPremium = 0M;

            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataTable dt1 = new DataTable();                
                dt1 = PetData.GetPetPlans(Enquiry).Tables[0];

                foreach (DataRow dr in dt1.Rows)
                {
                    int PlanId = 0;                  
                    string[] addons = Convert.ToString(dr["PlanAddOns"]).Split(',');
                    PlanId = Convert.ToInt32(dr["Planid"]);
                    BreakupDetails breakup = new BreakupDetails();
                    TotalAddonPremium = GetTotalAddondPremium(breakup, addons, dr, dt.Rows[i]);
                    breakup.Enquiry = Enquiry;
                    breakup.BasicPremium = Convert.ToDecimal(dt.Rows[i][0]);
                    breakup.SI = SI;
                    breakup.SupplierId = Convert.ToInt32(dt.Rows[i]["SupplierID"]);
                    breakup.PlanID = PlanId;

                    PackagePremium = breakup.BasicPremium.GetValueOrDefault() + TotalAddonPremium;
                    breakup.GST = PackagePremium * 0.18M;
                    breakup.FinalPremium = PackagePremium + breakup.GST;
                    if (breakup.FinalPremium > 0)
                        lstbreakup.Add(breakup);
                }
            }
            
            return lstbreakup;
        }
        
        private decimal GetTotalAddondPremium(BreakupDetails breakup , string[] addonList ,DataRow dr,DataRow drPremium) // Get Premium of addons accorsing to the plan table
        {
            decimal TotalAddonPremium = 0;
            //OPDExpense,ThirdParty,Mortality,Theft
            decimal BasicPremium = Convert.ToDecimal(drPremium[0]);
            if (addonList != null && addonList.Length > 0)
            {
                for (int i = 0; i < addonList.Length; i++)
                {
                    string addonName = addonList[i].Trim();
                    switch (addonName)
                    {
                        case "OPDExpense":
                            breakup.OPDExpense = BasicPremium*Convert.ToDecimal(drPremium["OPDExpense"]);
                            break;
                        case "ThirdParty":
                            breakup.ThirdParty = BasicPremium * Convert.ToDecimal(drPremium["ThirdParty"]);
                            break;
                        case "Mortality":
                            breakup.Mortality = BasicPremium * Convert.ToDecimal(drPremium["Mortality"]);
                            break;
                        case "Theft":
                            breakup.TheftPremium = BasicPremium * Convert.ToDecimal(drPremium["TheftPremium"]);
                            break;
                        case "TerminalIllness":
                            breakup.TerminalIllness = BasicPremium * Convert.ToDecimal(drPremium["TerminalIllness"]);
                            break;
                    }
                }

                TotalAddonPremium = Math.Round(breakup.TheftPremium.GetValueOrDefault() 
                                    + breakup.ThirdParty.GetValueOrDefault() 
                                    + breakup.Mortality.GetValueOrDefault() 
                                    + breakup.OPDExpense.GetValueOrDefault() 
                                    + breakup.TerminalIllness.GetValueOrDefault() 
                                    + breakup.LongTermCare.GetValueOrDefault(),0);

            }
            return TotalAddonPremium;

        }


        [HttpGet]
        public List<BreakupDetails> GetQuotes(long Enquiry) // getQuotes from DB
        {           
            List<BreakupDetails> lstbreakup = new List<BreakupDetails>();
            try
            {
                lstbreakup = PetData.GetQuotes(Enquiry); // Get Calculated Quotes From DB                
                //response = JsonConvert.SerializeObject(ds.Tables[0]);

            }
            catch (Exception Ex)
            {
                PetData.InsertErrorLogs(Enquiry, Ex.Message, "GetQuotes");
            }
            return lstbreakup;
        }      
    }
}

 