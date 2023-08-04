using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Commerce.Cms.Web.Api.Storefront;
using Umbraco.Commerce.Extensions;
using Umbraco.Headless.Demo.EventHandlers;

namespace Umbraco.Headless.Demo
{
    public static class UmbracoBuilderExtensions
    {
        public static IUmbracoBuilder AddHeadlessDemoSite(this IUmbracoBuilder builder)
        {
            builder.AddNotificationAsyncHandler<ContentPublishedNotification, RevalidateOnPublishNotificationHandler>();

            builder.AddUmbracoCommerce(builder =>
            {
                builder.AddSQLite();
                builder.AddStorefrontApi();
                builder.AddHeadlessDemoStore();
            });

            return builder;
        }
    }
}
