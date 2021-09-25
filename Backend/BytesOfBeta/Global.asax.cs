using System.Web.Http;
using System.Web.Mvc;

namespace BytesOfBeta
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            //RouteConfig.RegisterRoutes(RouteTable.Routes);
            //BundleConfig.RegisterBundles(BundleTable.Bundles);
            System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls | (System.Net.SecurityProtocolType)768 | (System.Net.SecurityProtocolType)3072;
        }
    }
}
