using Umbraco.Cms.Core.DeliveryApi;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Strings;
using Umbraco.Extensions;

namespace Umbraco.Headless.Demo.Handlers
{
    public class SlugFilterHandler : IFilterHandler, IContentIndexHandler
    {
        private const string CollectionSpecifier = "slug:";
        private const string FieldName = "slug";

        private readonly IShortStringHelper _shortStringHelper;
        private readonly UrlSegmentProviderCollection _urlSegmentProviderCollection;

        public SlugFilterHandler(IShortStringHelper shortStringHelper,
            UrlSegmentProviderCollection urlSegmentProviderCollection)
        {
            _shortStringHelper = shortStringHelper;
            _urlSegmentProviderCollection = urlSegmentProviderCollection;
        }

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
            return new[] {
                new IndexFieldValue
                {
                    FieldName = FieldName,
                    Values = new []{ content.GetUrlSegment(_shortStringHelper, _urlSegmentProviderCollection) }
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
