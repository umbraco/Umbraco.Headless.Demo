export type SortFilterItem = {
  title: string;
  slug: string | undefined;
  sortKey: 'relevance' | 'createDate' | 'price';
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: 'Relevance',
  slug: undefined,
  sortKey: 'relevance',
  reverse: false
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  { title: 'Latest arrivals', slug: 'latest-desc', sortKey: 'createDate', reverse: true },
  { title: 'Price: Low to high', slug: 'price-asc', sortKey: 'price', reverse: false },
  { title: 'Price: High to low', slug: 'price-desc', sortKey: 'price', reverse: true }
];

export const VALIDATION_TAGS = {
  collections: 'collections',
  products: 'products',
  pages: 'pages'
};

export const DEFAULT_OPTION = 'Default';
export const HIDDEN_PRODUCT_TAG = 'hidden'; // Required
export const UMBRACO_CONTENT_API_ENDPOINT = '/umbraco/delivery/api/v1';
export const UMBRACO_COMMERCE_API_ENDPOINT = '/umbraco/commerce/storefront/api/v1';
export const UMBRACO_FORMS_API_ENDPOINT = '/umbraco/forms/api/v1';
