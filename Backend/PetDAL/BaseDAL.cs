using Microsoft.Practices.EnterpriseLibrary.Data;

namespace PetDAL
{
    public class BaseDAL
    {
        public Database _policyDb;
        public BaseDAL()
        {
            _policyDb = DatabaseFactory.CreateDatabase("DbConn");

        }
    }
}
