using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Web.Common.Controllers;

namespace Umbraco.Headless.Demo.Web.Controllers
{
    public class TagsApiController : UmbracoApiController
    {
        private readonly ITagService _tagService;

        public TagsApiController(ITagService tagService)
        {
            _tagService = tagService;
        }

        public string[] GetTags(string group)
        {
            return _tagService.GetAllTags(group).Where(x => x.NodeCount > 0).Select(x => x.Text).ToArray();
        }
    }
}
