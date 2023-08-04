export type Maybe<T> = T | null;

export type Cart = {
  id: string;
  orderNumber?: string;
  cost: {
    subtotalAmount: Money;
    subtotalTaxAmount: Money;
    shippingFeeAmount?: Money;
    paymentFeeAmount?: Money;
    discountAmount?: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  totalQuantity: number;
  lines: CartItem[];
  codes: string[];
  properties: { [id: string]: string };
  billingCountry?: CodeRef;
  shippingCountry?: CodeRef;
  shippingMethod?: ShippingMethod;
  paymentMethod?: PaymentMethod;
  isComplete: boolean;
};

export type CartItem = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: Product;
  };
  properties: { [id: string]: string };
};

export type Image = {
  url: string;
  width: number;
  height: number;
  altText: string;
};

export type Menu = {
  title: string;
  path: string;
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  sidebar: Sidebar;
  seo: SEO;
  createdAt: string;
  updatedAt: string;
  isHidden?: boolean;
};

export type Product = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  featuredImage: Image;
  bgColor?: string;
  seo: SEO;
  tags: string[];
  updatedAt: string;
  variants: ProductVariant[];
  images: Image[];
  isHidden?: boolean;
};

export type ProductOption = {
  alias: string;
  name: string;
  values: { alias: string; name: string }[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    alias: string;
    value: string;
  }[];
  price: Money;
  isDefault: boolean;
};

export type Sidebar = {
  title: string;
  description: string;
};

export type SEO = {
  title: string;
  description: string;
};

export type CodeRef = {
  code: string;
  name: string;
};

export type AliasRef = {
  alias: string;
  name: string;
};

export type Country = {} & CodeRef;

// export type PaymentMethodRef = {
//   paymentProviderAlias: string
// } & AliasRef;

export type ShippingMethod = Omit<UmbracoCommerceShippingMethod, 'price'> & {
  price?: Money;
};

export type PaymentMethod = Omit<UmbracoCommercePaymentMethod, 'price'> & {
  price?: Money;
};

export type CartUpdate = {} & UmbracoCommerceOrderUpdate;

// ======================================
// Umbraco
// ======================================

export type UmbracoElement = {
  id: string;
  contentType: string;
  properties: { [id: string]: any };
};

export type UmbracoNode = UmbracoElement & {
  name: string;
  route: UmbracoRoute;
  createDate: string;
  updateDate: string;
};

export type UmbracoMedia = {
  id: string;
  name: string;
  mediaType: string;
  url: string;
  extension: string;
  width: number;
  height: number;
  bytes: null;
  properties: { [id: string]: any };
};

export type UmbracoRoute = {
  path: string;
  startItem: UmbracoStartItem;
};

export type UmbracoStartItem = {
  id: string;
  path: string;
};

export type UmbracoCommerceVariantPropertyValue = {
  attributes: UmbracoCommerceInUseAttribute[];
  items: UmbracoCommerceVariantItem[];
};

export type UmbracoCommerceVariantItem = {
  content?: UmbracoElement;
  attributes: { [id: string]: string };
  isDefault: boolean;
};

export type UmbracoCommerceInUseAttribute = UmbracoCommerceAliasNamePair & {
  values: UmbracoCommerceAliasNamePair[];
};

export type UmbracoCommerceAliasEntityRef = {
  id: string;
  alias: string;
};

export type UmbracoCommerceAliasEntity = {
  name: string;
} & UmbracoCommerceAliasEntityRef;

export type UmbracoCommerceCodeEntityRef = {
  id: string;
  code: string;
};

export type UmbracoCommerceCodeEntity = {
  name: string;
} & UmbracoCommerceCodeEntityRef;

export type UmbracoCommerceOrder = {
  id: string;
  orderNumber?: string;
  currency: UmbracoCommerceCodeEntityRef;
  orderLines: UmbracoCommerceOrderLine[];
  totalQuantity: number;
  subtotalPrice: UmbracoCommerceAdjustedPrice;
  totalPrice: UmbracoCommerceTotalAdjustedPrice;
  properties: { [id: string]: string };
  discountCodes: UmbracoCommerceAppliedDiscountCode[];
  paymentInfo?: UmbracoCommercePaymentInfo;
  shippingInfo?: UmbracoCommerceShippingInfo;
  isFinalized: boolean;
};

export type UmbracoCommercePaymentInfo = {
  country?: UmbracoCommerceCodeEntity;
  paymentMethod?: UmbracoCommercePaymentMethod;
  totalPrice?: UmbracoCommerceAdjustedPrice;
};

export type UmbracoCommerceShippingInfo = {
  country?: UmbracoCommerceCodeEntity;
  shippingMethod?: UmbracoCommerceShippingMethod;
  totalPrice?: UmbracoCommerceAdjustedPrice;
};

export type UmbracoCommerceOrderLine = {
  id: string;
  productReference: string;
  productVariantReference: string;
  sku: string;
  name: string;
  quantity: number;
  totalPrice: UmbracoCommerceAdjustedPrice;
  properties: { [id: string]: string };
  attributes: UmbracoCommerceAttributeCombination[];
};

export type UmbracoCommerceAppliedDiscountCode = {
  code: string;
  isFulfilled: boolean;
};

export type UmbracoCommerceCurrency = {
  name: string;
} & UmbracoCommerceCodeEntityRef;

export type UmbracoCommerceCountry = {
  name: string;
} & UmbracoCommerceCodeEntityRef;

export type UmbracoCommerceTotalAdjustedPrice = {
  totalAdjustment: UmbracoCommercePrice;
} & UmbracoCommerceAdjustedPrice;

export type UmbracoCommerceAdjustedPrice = {
  withoutAdjustments: UmbracoCommercePrice;
  value: UmbracoCommercePrice;
};

export type UmbracoCommercePrice = {
  currency: UmbracoCommerceCodeEntityRef;
  withoutTax: number;
  tax: number;
  withTax: number;
};

export type UmbracoCommerceAmount = {
  currency: UmbracoCommerceCodeEntityRef;
  value: number;
};

export type UmbracoCommerceAttributeCombination = {
  name: UmbracoCommerceAliasNamePair;
  value: UmbracoCommerceAliasNamePair;
};

export type UmbracoCommerceAliasNamePair = {
  alias: string;
  name: string;
};

export type UmbracoPagedResult<T> = {
  total: number;
  items: T[];
};

export type UmbracoLink = {
  url: string;
  title: string;
  target?: string;
  destinationId?: string;
  destinationType?: string;
  route?: UmbracoRoute;
  linkType: string;
};

export type UmbracoCommerceOrderUpdate = {
  language?: string;
  currency?: string;
  taxClass?: string;
  customerReference?: string;
  customer?: {
    firstName?: string;
    lastName?: string;
    company?: string;
    email?: string;
    telephone?: string;
    mobile?: string;
    taxCode?: string;
  };
  billingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    zipCode?: string;
    country?: string;
    region?: string;
  };
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    zipCode?: string;
    country?: string;
    region?: string;
    contact?: {
      firstName?: string;
      lastName?: string;
      company?: string;
      email?: string;
      telephone?: string;
      mobile?: string;
    };
    sameAsBilling?: boolean;
  };
  shippingMethod?: string;
  paymentMethod?: string;
  redeem?: string;
  unredeem?: string;
  properties?: { [id: string]: string };
  tags?: string[];
};

export type UmbracoCommerceShippingMethod = {
  id: string;
  alias: string;
  name: string;
  price?: UmbracoCommercePrice;
};

export type UmbracoCommercePaymentMethod = {
  id: string;
  alias: string;
  name: string;
  paymentProviderAlias: string;
  price?: UmbracoCommercePrice;
};

export type UmbracoCommerceCheckoutToken = {
  token: string;
  orderNumber: string;
  payUrl: string;
};

export type UmbracoCommerceInlineCheckout = {
  orderNumber: string;
  paymentMethod: UmbracoCommerceInlineCheckoutPaymentMethod;
};

export type UmbracoCommerceInlineCheckoutPaymentMethod = {
  settings?: { [id: string]: string };
  metaDataDefinitions?: { [id: string]: string };
  urls: UmbracoCommercePaymentMethodUrls;
};

export type UmbracoCommercePaymentMethodUrls = {
  continue: string;
  cancel: string;
  error: string;
  callback: string;
};

export type UmbracoCommerceInlineCheckoutConfirmation = {
  amount: number;
  fee?: number;
  transactionId: string;
  paymentStatus:
    | 'Initialized'
    | 'Authorized'
    | 'Captured'
    | 'Cancelled'
    | 'Refunded'
    | 'PendingExternalSystem'
    | 'Error';
  metaData?: { [id: string]: string };
};

export type UmbracoCommerceCheckoutConfirmResponse = {
  orderNumber: string;
  transactionInfo: UmbracoCommerceTransactionInfo;
};

export type UmbracoCommerceTransactionInfo = {
  transactionId: string;
  // TODO: other properties
};
