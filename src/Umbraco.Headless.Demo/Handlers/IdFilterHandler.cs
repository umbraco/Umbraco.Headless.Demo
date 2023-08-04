using Umbraco.Cms.Core.DeliveryApi;

namespace Umbraco.Headless.Demo.Handlers
{
    public class IdFilter : IFilterHandler
    {
        private const string CollectionSpecifier = "id:";

        public bool CanHandle(string query)
            => query.StartsWith(CollectionSpecifier, StringComparison.OrdinalIgnoreCase);

        public FilterOption BuildFilterOption(string filter)
        {
            var fieldValue = filter.Substring(CollectionSpecifier.Length);

            // There might be several values for the filter
            var values = fieldValue.Split(',');

            return new FilterOption
            {
                FieldName = "itemId",
                Values = values,
                Operator = FilterOperation.Is
            };
        }
    }
}
