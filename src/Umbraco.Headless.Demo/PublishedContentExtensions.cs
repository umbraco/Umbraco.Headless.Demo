using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Commerce.Core.Models;
using Umbraco.Extensions;

namespace Umbraco.Headless.Demo
{
    public static class PublishedContentExtensions
    {
        public static StoreReadOnly GetStore(this IPublishedContent content)
        {
            return content.Value<StoreReadOnly>("store", fallback: Fallback.ToAncestors);
        }

        public static IPublishedContent GetCheckoutPage(this IPublishedContent content)
        {
            return content.AncestorOrSelf("CheckoutPage");
        }

        public static IPublishedContent GetPreviousPage(this IPublishedContent content)
        {
            return content.Parent.Children.TakeWhile(x => !x.Id.Equals(content.Id)).LastOrDefault();
        }

        public static IPublishedContent GetNextPage(this IPublishedContent content)
        {
            return content.Parent.Children.SkipWhile(x => !x.Id.Equals(content.Id)).Skip(1).FirstOrDefault();
        }
    }
}
