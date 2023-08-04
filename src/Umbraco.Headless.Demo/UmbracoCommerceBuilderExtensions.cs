using Umbraco.Commerce.Core;
using Umbraco.Commerce.Core.Events.Notification;
using Umbraco.Commerce.Extensions;
using Umbraco.Headless.Demo.EventHandlers;

namespace Umbraco.Headless.Demo
{
    public static class UmbracoCommerceBuilderExtensions
    {
        public static IUmbracoCommerceBuilder AddHeadlessDemoStore(this IUmbracoCommerceBuilder builder)
        {
            builder.WithNotificationEvent<OrderLineChangingNotification>()
                .RegisterHandler<ChangeOrderLineMetaDataNotificationHandler>();

            builder.WithNotificationEvent<OrderLineAddingNotification>()
                .RegisterHandler<AddOrderLineMetaDataNotificationHandler>();

            return builder;
        }
    }
}