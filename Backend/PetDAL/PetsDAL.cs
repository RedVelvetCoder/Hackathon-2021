using PetDataContract;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetDAL
{
    public class PetsDAL: BaseDAL
    {
        #region Insert In Databse 
        public void InsertPetDetails(PreQuote input, long enquiry)
        {
            try
            {
                using (DbCommand dbCommand = _policyDb.GetStoredProcCommand("InsertPetDetails"))
                {
                    _policyDb.AddInParameter(dbCommand, "@Enquiry", DbType.Int64, enquiry);
                    _policyDb.AddInParameter(dbCommand, "@Age", DbType.Int32, input.Age);
                    _policyDb.AddInParameter(dbCommand, "@Breed", DbType.String, input.Breed);
                    _policyDb.AddInParameter(dbCommand, "@TypeOfPet", DbType.String, input.TypeOfPet);
                    _policyDb.AddInParameter(dbCommand, "@Color", DbType.String, input.Color);
                    _policyDb.AddInParameter(dbCommand, "@PetName", DbType.String, input.PetName);
                    _policyDb.AddInParameter(dbCommand, "@OwnerName", DbType.String, input.OwnerName);
                    _policyDb.AddInParameter(dbCommand, "@MobileNumber", DbType.String, input.MobileNumber);
                    _policyDb.AddInParameter(dbCommand, "@Email", DbType.String, input.Email);
                    _policyDb.AddInParameter(dbCommand, "@Address", DbType.String, input.Address);
                    _policyDb.AddInParameter(dbCommand, "@Category", DbType.String, input.Category);
                    _policyDb.AddInParameter(dbCommand, "@Gender", DbType.String, input.Gender);
                    _policyDb.AddInParameter(dbCommand, "@SI", DbType.Int32, input.SI);
                    _policyDb.AddInParameter(dbCommand, "@IsVaccinated", DbType.Int32, input.IsVaccinated);
                    _policyDb.ExecuteNonQuery(dbCommand);
                }
            }
            catch (Exception Ex)
            {
                InsertErrorLogs(enquiry, Ex.Message, "InsertPetDetails");
            }
        }
        public void InsertPetName(string Name, long enquiry)
        {
            try
            {
                using (DbCommand dbCommand = _policyDb.GetStoredProcCommand("InsertPetName"))
                {
                    _policyDb.AddInParameter(dbCommand, "@Enquiry", DbType.Int64, enquiry);                    
                    _policyDb.AddInParameter(dbCommand, "@PetName", DbType.String, Name);
                   
                    _policyDb.ExecuteNonQuery(dbCommand);
                }
            }
            catch (Exception Ex)
            {
                InsertErrorLogs(enquiry, Ex.Message, "InsertPetDetails");
            }
        }
        public void InsertQuoteBreakup(BreakupDetails breakup)
        {
            try
            {
                using (DbCommand dbCommand = _policyDb.GetStoredProcCommand("InsertQuoteDetails"))
                {
                    _policyDb.AddInParameter(dbCommand, "@Enquiry", DbType.Int64, breakup.Enquiry);
                    _policyDb.AddInParameter(dbCommand, "@BasicPremium", DbType.Decimal, breakup.BasicPremium);                   
                    _policyDb.AddInParameter(dbCommand, "@GST", DbType.Decimal, breakup.GST);
                    _policyDb.AddInParameter(dbCommand, "@FinalPremium", DbType.Decimal, breakup.FinalPremium);
                    _policyDb.AddInParameter(dbCommand, "@TheftPremium", DbType.Decimal, breakup.TheftPremium);
                    _policyDb.AddInParameter(dbCommand, "@ThirdParty", DbType.Decimal, breakup.ThirdParty);
                    _policyDb.AddInParameter(dbCommand, "@Mortality", DbType.Decimal, breakup.Mortality);
                    _policyDb.AddInParameter(dbCommand, "@OPDExpense", DbType.Decimal, breakup.OPDExpense);
                    _policyDb.AddInParameter(dbCommand, "@TerminalIllness", DbType.Decimal, breakup.TerminalIllness);
                    _policyDb.AddInParameter(dbCommand, "@LongTermCare", DbType.Decimal, breakup.LongTermCare);
                    _policyDb.AddInParameter(dbCommand, "@PlanID", DbType.Int16, breakup.PlanID);
                    _policyDb.AddInParameter(dbCommand, "@SupplierID", DbType.Int16, breakup.SupplierId);

                    _policyDb.ExecuteNonQuery(dbCommand);
                }
            }
            catch (Exception Ex)
            {
                InsertErrorLogs(breakup.Enquiry, Ex.Message, "InsertQuoteBreakup");
            }
        }

        public List<BreakupDetails> GetQuotes(long Enquiry)
        {
            List<BreakupDetails> lstbreakup = new List<BreakupDetails>();
            BreakupDetails breakup = new BreakupDetails();
            try
            {
                using (DbCommand dbCommand = _policyDb.GetStoredProcCommand("GetQuotes"))
                {
                    _policyDb.AddInParameter(dbCommand, "@Enquiry", DbType.Int64, Enquiry);
                    using (IDataReader dataReader = _policyDb.ExecuteReader(dbCommand))
                    {
                        while (dataReader.Read())
                        {
                            breakup = ReadViewQuotes(dataReader);
                            lstbreakup.Add(breakup);
                        }
                    }
                   
                }
            }
            catch (Exception Ex)
            {
                InsertErrorLogs(Enquiry, Ex.Message, "GetQuotes");
            }
            return lstbreakup;
        }


        private BreakupDetails ReadViewQuotes(IDataReader row)
        {
            BreakupDetails breakup = new BreakupDetails();
            breakup.Enquiry = Convert.ToInt32(row["Enquiry"]);
            breakup.BasicPremium = Convert.ToInt16(row["BasicPremium"]);
            breakup.GST = Convert.ToInt16(row["GST"]);
            breakup.FinalPremium = Convert.ToDecimal(row["FinalPremium"]);
            breakup.TheftPremium = row["TheftPremium"] != DBNull.Value ? Convert.ToDecimal(row["TheftPremium"]) : (decimal?)null;
            breakup.ThirdParty = row["ThirdParty"] != DBNull.Value ? Convert.ToDecimal(row["ThirdParty"]) : (decimal?)null; 
            breakup.Mortality = row["Mortality"] != DBNull.Value ? Convert.ToDecimal(row["Mortality"]) : (decimal?)null; 
            breakup.OPDExpense = row["OPDExpense"] != DBNull.Value ? Convert.ToDecimal(row["OPDExpense"]) : (decimal?)null; 

            breakup.TerminalIllness = row["TerminalIllness"] != DBNull.Value ? Convert.ToDecimal(row["TerminalIllness"]) : (decimal?)null; 
            breakup.LongTermCare = row["LongTermCare"] != DBNull.Value ? Convert.ToDecimal(row["LongTermCare"]) : (decimal?)null;
            breakup.PlanID = Convert.ToInt32(row["Planid"]);
            breakup.SupplierId = Convert.ToInt32(row["SupplierId"]);

            return breakup;
        }
        public DataSet GetBreeds(int PetId)
        {
            DataSet ds = new DataSet();
            try
            {
                using (DbCommand dbCommand = _policyDb.GetStoredProcCommand("GetBreeds"))
                {
                    _policyDb.AddInParameter(dbCommand, "@PetID", DbType.Int64, PetId);
                    ds = _policyDb.ExecuteDataSet(dbCommand);
                }
            }
            catch (Exception Ex)
            {
                InsertErrorLogs(1, Ex.Message, "GetBreeds");
            }
            return ds;
        }

        public PreQuote GetPetDetails(long enquiry)
        {
            //DataSet ds = new DataSet();
            PreQuote petdata = new PreQuote();
            try
            {
                using (DbCommand dbCommand = _policyDb.GetStoredProcCommand("GetPetDetails"))
                {
                    _policyDb.AddInParameter(dbCommand, "@Enquiry", DbType.Int64, enquiry);
                    using (IDataReader dataReader = _policyDb.ExecuteReader(dbCommand))
                    {
                        while (dataReader.Read())
                        {
                            petdata = ReadViewPetData(dataReader);
                            
                        }
                    }
                    
                }
            }
            catch (Exception Ex)
            {
                InsertErrorLogs(1, Ex.Message, "GetBreeds");
            }
            return petdata;
        }

        private PreQuote ReadViewPetData(IDataReader row)
        {
            PreQuote PetData = new PreQuote();

            PetData.PetName= Convert.ToString(row["PetName"]);
            PetData.Gender = Convert.ToString(row["Gender"]);
            PetData.Age = Convert.ToString(row["Age"]);
            PetData.Breed= Convert.ToString(row["Breed"]);
            PetData.IsVaccinated = Convert.ToBoolean(row["Vaccinated"]);
            return PetData;
        }

        public DataSet GetPetPlans(long EnquiryID)
        {
            DataSet ds = new DataSet();
            try
            {
                using (DbCommand dbCommand = _policyDb.GetStoredProcCommand("GetPetPlans"))
                {
                    ds = _policyDb.ExecuteDataSet(dbCommand);
                }
            }
            catch (Exception Ex)
            {
                InsertErrorLogs(EnquiryID, Ex.Message, "GetPetPlans");
            }
            return ds;
        }
        public DataSet GetRate(PreQuote input,long Enquiry)
        {
            DataSet ds = new DataSet();
            try
            {
                using (DbCommand dbCommand = _policyDb.GetStoredProcCommand("GetRates"))
                {
                    _policyDb.AddInParameter(dbCommand, "@PetID", DbType.Int64, Convert.ToInt32(input.TypeOfPet));
                    _policyDb.AddInParameter(dbCommand, "@Breed", DbType.String, input.Breed);
                    _policyDb.AddInParameter(dbCommand, "@Gender", DbType.String, input.Gender);
                    _policyDb.AddInParameter(dbCommand, "@SI", DbType.Int32, input.SI);
                    _policyDb.AddInParameter(dbCommand, "@AgeSlab", DbType.Int32, input.Age);
                    ds = _policyDb.ExecuteDataSet(dbCommand);
                }
            }
            catch (Exception Ex)
            {
                InsertErrorLogs(Enquiry, Ex.Message, "GetQuotes");
            }
            return ds;
        }
        public void InsertErrorLogs(long enquiry, string ErrorText, string Type)
        {
            try
            {
                using (DbCommand dbCommand = _policyDb.GetStoredProcCommand("InsertErrorLogs"))
                {
                    _policyDb.AddInParameter(dbCommand, "@Enquiry", DbType.Int64, enquiry);
                    _policyDb.AddInParameter(dbCommand, "@ErrorText", DbType.String, ErrorText);
                    _policyDb.AddInParameter(dbCommand, "@Type", DbType.String, Type);
                    _policyDb.ExecuteNonQuery(dbCommand);
                }
            }
            catch (Exception Ex)
            {

            }
        }
        public void SavePlan(BuyPlan SavePlan, string ProposalNo)
        {
            try
            {
                using (DbCommand dbCommand = _policyDb.GetStoredProcCommand("SavePlan"))
                {
                    _policyDb.AddInParameter(dbCommand, "@Enquiry", DbType.Int64, SavePlan.Enquiry);
                    _policyDb.AddInParameter(dbCommand, "@PlanId", DbType.Int32, SavePlan.Planid);
                    _policyDb.AddInParameter(dbCommand, "@SupplierId", DbType.Int32, SavePlan.SupplierId);
                    _policyDb.AddInParameter(dbCommand, "@ProposalNo", DbType.String, ProposalNo);

                    _policyDb.ExecuteNonQuery(dbCommand);
                }
            }
            catch (Exception Ex)
            {
                InsertErrorLogs(SavePlan.Enquiry, Ex.Message, "SavePlan");
            }
        }

        public void SaveProposalDetails(VisitorDetails visitorDetails)
        {
            try
            {
                using (DbCommand dbCommand = _policyDb.GetStoredProcCommand("InsertVisitorDetails"))
                {
                    _policyDb.AddInParameter(dbCommand, "@Enquiry", DbType.Int64, visitorDetails.Enquiry);
                    _policyDb.AddInParameter(dbCommand, "@OwnerName", DbType.String, visitorDetails.OwnerName);
                    _policyDb.AddInParameter(dbCommand, "@OwnerAddress", DbType.String, visitorDetails.OwnerAddress);
                    _policyDb.AddInParameter(dbCommand, "@Email", DbType.String, visitorDetails.Email);
                    _policyDb.AddInParameter(dbCommand, "@Mobile", DbType.String, visitorDetails.Mobile);
                    _policyDb.AddInParameter(dbCommand, "@IsMicrTag", DbType.Boolean, visitorDetails.IsMICRTag);
                    _policyDb.ExecuteNonQuery(dbCommand);
                }
            }
            catch (Exception Ex)
            {
                InsertErrorLogs(visitorDetails.Enquiry, Ex.Message, "SavePlan");
            }
        }
        public ProposalDetails GetProposalData(long Enquiry)
        {
            ProposalDetails proposalDetails = new ProposalDetails();            
            try
            {
                using (DbCommand dbCommand = _policyDb.GetStoredProcCommand("GetProposalData"))
                {
                    _policyDb.AddInParameter(dbCommand, "@Enquiry", DbType.Int64, Enquiry);
                    using (IDataReader dataReader = _policyDb.ExecuteReader(dbCommand))
                    {
                        while (dataReader.Read())
                        {
                            proposalDetails = ReadViewProposalData(dataReader);

                        }
                    }                    
                }
            }
            catch (Exception Ex)
            {
                InsertErrorLogs(Enquiry, Ex.Message, "GetProposalData");
            }
            return proposalDetails;
        }

        private ProposalDetails ReadViewProposalData(IDataReader row)
        {
            ProposalDetails proposalDetails = new ProposalDetails();
            proposalDetails.FinalPremium = Convert.ToDecimal(row["FinalPremium"]);
            proposalDetails.ProposalNo = Convert.ToString(row["ProposalNo"]);
            proposalDetails.PlanAddons = Convert.ToString(row["PlanAddons"]);
            proposalDetails.SupplierID = Convert.ToInt32(row["SupplierID"]);
            return proposalDetails;
        }

        #endregion
    }
}
