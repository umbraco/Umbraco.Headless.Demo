using Umbraco.Cms.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace Umbraco.Headless.Demo.Web.Controllers
{
    [ApiController]
    [Route("umbraco/api/[controller]/[action]")]
    public class TagsApiController : ControllerBase
    {
        private readonly ITagService _tagService;

        public TagsApiController(ITagService tagService)
        {
            _tagService = tagService;
        }

        [HttpGet]
        public string[] GetTags(string group)
        {
            return _tagService.GetAllTags(group).Where(x => x.NodeCount > 0).Select(x => x.Text).ToArray();
        }
    }
}
