using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Routing;
using Umbraco.Cms.Core.Web;
using Umbraco.Commerce.Common.Events;
using Umbraco.Commerce.Core.Events.Notification;
using Umbraco.Commerce.Core.Models;
using Umbraco.Extensions;
using static Umbraco.Cms.Core.PropertyEditors.ValueConverters.ColorPickerValueConverter;

namespace Umbraco.Headless.Demo.EventHandlers
{
    internal static class OrderLineMetaDataNotificationHandlerHelper
    {
        internal static void DoSetMetaData(
            Order order,
            OrderLineReadOnly orderLine,
            IUmbracoContextFactory umbracoContextFactory,
            IPublishedValueFallback valueFallback,
            IPublishedUrlProvider urlProvider)
        {
            if (Guid.TryParse(orderLine.ProductReference, out var productReference))
            {
                using (var ctx = umbracoContextFactory.EnsureUmbracoContext())
                {
                    if (ctx.UmbracoContext.Content != null)
                    {
                        var node = ctx.UmbracoContext.Content.GetById(productReference);
                        if (node != null)
                        {
                            if (!orderLine.Properties.ContainsKey("imageUrl"))
                            {
                                var image = node.Value<IEnumerable<IPublishedContent>>(valueFallback, "images")?.FirstOrDefault();
                                if (image != null)
                                {
                                    order.WithOrderLine(orderLine.Id)
                                        .SetProperty("imageUrl", image.Url(urlProvider));
                                }
                            }

                            if (!orderLine.Properties.ContainsKey("bgColor"))
                            {
                                var bgColor = node.Value<PickedColor>(valueFallback, "bgColor")?.Label.ToLower();
                                if (bgColor != null)
                                {
                                    order.WithOrderLine(orderLine.Id)
                                        .SetProperty("bgColor", bgColor);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public class ChangeOrderLineMetaDataNotificationHandler : NotificationEventHandlerBase<OrderLineChangingNotification>
    {
        private readonly IUmbracoContextFactory _umbracoContextFactory;
        private readonly IPublishedValueFallback _valueFallback;
        private readonly IPublishedUrlProvider _urlProvider;

        public ChangeOrderLineMetaDataNotificationHandler(IUmbracoContextFactory umbracoContextFactory,
            IPublishedValueFallback valueFallback,
            IPublishedUrlProvider urlProvider)
        {
            _umbracoContextFactory = umbracoContextFactory;
            _valueFallback = valueFallback;
            _urlProvider = urlProvider;
        }

        public override void Handle(OrderLineChangingNotification evt)
        {
            OrderLineMetaDataNotificationHandlerHelper.DoSetMetaData(evt.Order, evt.OrderLine, _umbracoContextFactory, _valueFallback, _urlProvider);
        }
    }

    public class AddOrderLineMetaDataNotificationHandler : NotificationEventHandlerBase<OrderLineAddingNotification>
    {
        private readonly IUmbracoContextFactory _umbracoContextFactory;
        private readonly IPublishedValueFallback _valueFallback;
        private readonly IPublishedUrlProvider _urlProvider;

        public AddOrderLineMetaDataNotificationHandler(IUmbracoContextFactory umbracoContextFactory,
            IPublishedValueFallback valueFallback,
            IPublishedUrlProvider urlProvider)
        {
            _umbracoContextFactory = umbracoContextFactory;
            _valueFallback = valueFallback;
            _urlProvider = urlProvider;
        }

        public override void Handle(OrderLineAddingNotification evt)
        {
            OrderLineMetaDataNotificationHandlerHelper.DoSetMetaData(evt.Order, evt.OrderLine, _umbracoContextFactory, _valueFallback, _urlProvider);
        }
    }
}
