using System.Text.Json;
using Umbraco.Cms.Core.DeliveryApi;
using Umbraco.Cms.Core.Models;
using Umbraco.Commerce.Extensions;
using Umbraco.Extensions;

namespace Umbraco.Headless.Demo.Handlers
{
    public class TagFilterHandler : IFilterHandler, IContentIndexHandler
    {
        private const string CollectionSpecifier = "tag:";
        private const string FieldName = "tag";

        public bool CanHandle(string query)
            => query.StartsWith(CollectionSpecifier, StringComparison.OrdinalIgnoreCase);

        public FilterOption BuildFilterOption(string filter)
        {
            var fieldValue = filter.Substring(CollectionSpecifier.Length);

            // There might be several values for the filter
            var values = fieldValue.Split(',');

            return new FilterOption
            {
                FieldName = FieldName,
                Values = values,
                Operator = FilterOperation.Is
            };
        }

        public IEnumerable<IndexFieldValue> GetFieldValues(IContent content, string? culture)
        {
            if (content.ContentType.Alias.InvariantEquals("product") == false)
            {
                return Enumerable.Empty<IndexFieldValue>();
            }

            var tags = Array.Empty<string>();

            if (content.HasProperty("tags"))
            {
                var value = content.GetValue<string>("tags");
                if (value != null) {
                    tags = value.IsJson()
                        ? JsonSerializer.Deserialize<string[]>(value)
                        : value.Split(',', StringSplitOptions.RemoveEmptyEntries);
                }
            }

            return new[] { 
                new IndexFieldValue
                {
                    FieldName = FieldName,
                    Values = tags
                }
            };
        }

        public IEnumerable<IndexField> GetFields()
            => new[]
            {
                new IndexField
                {
                    FieldName = FieldName,
                    FieldType = FieldType.StringRaw,
                    VariesByCulture = false
                }
            };
    }
}
