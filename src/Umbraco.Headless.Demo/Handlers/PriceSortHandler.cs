using System.Text.Json;
using System.Text.Json.Nodes;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.DeliveryApi;
using Umbraco.Cms.Core.Models;

namespace Umbraco.Headless.Demo.Handlers
{
    // Whilst this works for this demo, it has a couple of issues that might need resolving but
    // they don't seem resolvable with the current delivery API implementation
    // 1. We have had to assume that the store is only a sindle currency and so we index the first price we find
    // 2. We don't run the product adapter so we assume there are no dynamic price values in play
    public class PriceSortHandler : ISortHandler, IContentIndexHandler
    {
        private const string SortOptionSpecifier = "price:";
        private const string FieldName = "sortPrice";

        public bool CanHandle(string query)
            => query.StartsWith(SortOptionSpecifier, StringComparison.OrdinalIgnoreCase);

        public SortOption BuildSortOption(string sort)
        {
            var sortDirection = sort.EndsWith(":asc", StringComparison.OrdinalIgnoreCase)
                ? Direction.Ascending
                : Direction.Descending;

            return new SortOption
            {
                FieldName = FieldName,
                Direction = sortDirection
            };
        }

        public IEnumerable<IndexFieldValue> GetFieldValues(IContent content, string? culture)
        {
            var price = ParsePricePropertyValue(content.GetValue<string>("price"));

            if (content.HasProperty("variants"))
            {
                var variantsJson = content.GetValue<string>("variants");
                if (variantsJson != null)
                {
                    var variants = JsonSerializer.Deserialize<JsonObject>(variantsJson);
                    if (variants != null)
                    {
                        var data = variants["contentData"] as JsonArray;
                        if (data != null && data.Count > 0)
                        {
                            var maxPrice = data.Cast<JsonObject>()
                                .Max(x => ParsePricePropertyValue(x["price"]?.ToString()));

                            if (maxPrice > 0)
                            {
                                price = maxPrice;
                            }
                        }
                    }
                }
            }

            if (price > 0)
            {
                price = price * 100;
            }

            return new[]
            {
                new IndexFieldValue
                {
                    FieldName = FieldName,
                    Values = new object[] { price.ToString("0000000000") }
                }
            };
        }

        private decimal ParsePricePropertyValue(string? rawValue)
        {
            var price = 0m;

            if (rawValue != null)
            {
                var priceDict = JsonSerializer.Deserialize<Dictionary<Guid, decimal>>(rawValue);
                if (priceDict != null && priceDict.Count > 0)
                {
                    price = priceDict.First().Value;
                }
            }

            return price;
        }

        public IEnumerable<IndexField> GetFields()
         => new[]
         {
            new IndexField
            {
                FieldName = FieldName,
                FieldType = FieldType.StringSortable,
                VariesByCulture = false
            }
        };
    }
}
