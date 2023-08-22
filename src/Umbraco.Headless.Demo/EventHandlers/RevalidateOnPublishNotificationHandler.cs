using Microsoft.Extensions.Configuration;
using System.Net;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Extensions;

namespace Umbraco.Headless.Demo.EventHandlers
{
    public class RevalidateOnPublishNotificationHandler : INotificationAsyncHandler<ContentPublishedNotification>
    {
        private const string PRODUCT_CHANGE_EVENT = "products/update";
        private const string PAGE_CHANGE_EVENT = "pages/update";

        private static readonly HttpClient _client = new HttpClient();

        private readonly IConfiguration _configuration;

        public RevalidateOnPublishNotificationHandler(IConfiguration config)
        {
            _configuration = config;
        }

        public async Task HandleAsync(ContentPublishedNotification notification, CancellationToken cancellationToken)
        {
            var toRevalidate = new HashSet<string>();

            // Check to see if any of the published entities are of interest
            foreach (var item in notification.PublishedEntities)
            {
                if (item.ContentType.Alias.InvariantContains("settings") || item.ContentType.Alias.InvariantContains("product"))
                {
                    toRevalidate.Add(PRODUCT_CHANGE_EVENT);
                }

                if (item.ContentType.Alias.InvariantContains("settings") || item.ContentType.Alias.InvariantContains("page"))
                {
                    toRevalidate.Add(PAGE_CHANGE_EVENT);
                }
            }

            // Fire revalidations
            if (toRevalidate.Count > 0)
            {
                try
                {
                    await Task.WhenAll(toRevalidate.Select(async evt =>
                    {
                        var msg = new HttpRequestMessage(HttpMethod.Post, $"{_configuration["Vercel:SiteUrl"]}/api/revalidate?secret={_configuration["Vercel:RevalidationSecret"]}");
                        msg.Headers.Add("x-topic", evt);
                        var resp = await _client.SendAsync(msg, cancellationToken).ConfigureAwait(false);
                        if (resp.StatusCode != HttpStatusCode.OK)
                        {
                            // Log error
                        }
                    }));
                }
                catch { }
            }
        }
    }
}
