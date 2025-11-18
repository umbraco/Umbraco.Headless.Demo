using Microsoft.AspNetCore.Mvc;
using System.Reflection;
using Umbraco.Commerce.Core.Models;

namespace Umbraco.Headless.Demo.Web.Controllers
{
    [ApiController]
    [Route("umbraco/api/[controller]/[action]")]
    public class CommerceVersionApiController : ControllerBase
    {
        [HttpGet]
        public string GetVersion()
        {
            // Use a known Umbraco Commerce type to get the assembly
            var asm = typeof(Order).Assembly;
            var infoVer = asm.GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion;
            return infoVer ?? asm.GetName().Version?.ToString() ?? "unknown";
        }
    }
}
