
import {
  Cart,
  CartItem,
  Country,
  Image,
  Menu,
  Money,
  Page,
  PaymentMethod,
  Product,
  ProductOption,
  ProductVariant,
  ShippingMethod,
  UmbracoCommerceAmount,
  UmbracoCommerceCheckoutConfirmResponse,
  UmbracoCommerceCheckoutToken,
  UmbracoCommerceCountry,
  UmbracoCommerceInlineCheckout,
  UmbracoCommerceInlineCheckoutConfirmation,
  UmbracoCommerceOrder,
  UmbracoCommerceOrderLine,
  UmbracoCommerceOrderUpdate,
  UmbracoCommercePaymentMethod,
  UmbracoCommercePrice,
  UmbracoCommerceShippingMethod,
  UmbracoCommerceVariantPropertyValue,
  UmbracoFormsResponse,
  UmbracoLink,
  UmbracoMedia,
  UmbracoNode,
  UmbracoPagedResult
} from './types';

import {
  DEFAULT_OPTION,
  UMBRACO_COMMERCE_API_ENDPOINT,
  UMBRACO_CONTENT_API_ENDPOINT,
  UMBRACO_FORMS_API_ENDPOINT,
  VALIDATION_TAGS
} from 'lib/constants';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;
const umbracoBaseUrl = process.env.UMBRACO_BASE_URL!;
const store_alias = process.env.UMBRACO_COMMERCE_STORE_ALIAS!;
const cartExpands =
  '$prices,paymentInfo[country,paymentMethod],shippingInfo[country,shippingMethod]';

const apis: { [key: string]: any } = {
  content: {
    endpoint: `${umbracoBaseUrl}${UMBRACO_CONTENT_API_ENDPOINT}`,
    api_key: process.env.UMBRACO_CONTENT_API_KEY!
  },
  commerce: {
    endpoint: `${umbracoBaseUrl}${UMBRACO_COMMERCE_API_ENDPOINT}`,
    api_key: process.env.UMBRACO_COMMERCE_API_KEY!
  },
  forms: {
    endpoint: `${umbracoBaseUrl}${UMBRACO_FORMS_API_ENDPOINT}`,
    api_key: process.env.UMBRACO_FORMS_API_KEY!
  }
};

export async function umbracoFetch<T>(opts: {
  method: string;
  path: string;
  query?: Record<string, string | string[]>;
  headers?: HeadersInit;
  cache?: RequestCache;
  tags?: string[];
  payload?: any | undefined;
}): Promise<{ status: number; body: T } | never> {
  try {
    const options: RequestInit = {
      method: opts.method,
      headers: {
        'Content-Type': 'application/json',
        ...opts.headers
      },
      cache: opts.cache,
      ...(opts.tags && { next: { tags: opts.tags } })
    };

    if (opts.payload) {
      options.body = JSON.stringify(opts.payload);
    }

    let url = opts.path;

    if (opts.query) {
      const searchParams = new URLSearchParams();

      Object.entries(opts.query).forEach(([key, values]) => {
        if (Array.isArray(values)) {
          values.forEach((value) => {
            searchParams.append(key, value);
          });
        } else {
          searchParams.append(key, values);
        }
      });

      url += url.indexOf('?') >= 0 ? '&' : '?';
      url += searchParams.toString();
    }

    const result = await fetch(url, options);

    // console.log(url);
    // console.log(options.body);

    // const txt = await result.text();
    // console.log(url)
    // console.log(txt)
    // const body = JSON.parse(txt)

    const body = await result.json();

    if (body && body.errors) {
      console.log(body.errors);
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    // if (isUmbracoError(e)) {
    //   throw {
    //     status: e.status || 500,
    //     message: e.message
    //   };
    // }

    throw {
      error: e
    };
  }
}

export async function umbracoContentFetch<T>(opts: {
  method: string;
  path: string;
  query?: Record<string, string | string[]>;
  headers?: HeadersInit;
  cache?: RequestCache;
  tags?: string[];
  payload?: any | undefined;
}): Promise<{ status: number; body: T } | never> {
  opts.headers = {
    'Api-Key': apis['content'].api_key,
    ...opts.headers
  };
  opts.path = apis['content'].endpoint + opts.path;
  return await umbracoFetch<T>(opts);
}

export async function umbracoCommerceFetch<T>(opts: {
  method: string;
  path: string;
  query?: Record<string, string | string[]>;
  headers?: HeadersInit;
  cache?: RequestCache;
  tags?: string[];
  payload?: any | undefined;
}): Promise<{ status: number; body: T } | never> {
  opts.headers = {
    'Api-Key': apis['commerce'].api_key,
    Store: store_alias,
    ...opts.headers
  };
  opts.path = apis['commerce'].endpoint + opts.path;
  return await umbracoFetch<T>(opts);
}

export async function umbracoFormsFetch<T>(opts: {
  method: string;
  path: string;
  query?: Record<string, string | string[]>;
  headers?: HeadersInit;
  cache?: RequestCache;
  tags?: string[];
  payload?: any | undefined;
}): Promise<{ status: number; body: T } | never> {
  opts.headers = {
    'Api-Key': apis['forms'].api_key,
    ...opts.headers
  };
  opts.path = apis['forms'].endpoint + opts.path;
  return await umbracoFetch<T>(opts);
}

const reshapeImage = (img: UmbracoMedia): Image => {
  return {
    url: img.url.indexOf('http') == 0 ? img.url : `${umbracoBaseUrl}${img.url}`,
    altText: img.properties['altText'] || img.name,
    width: img.width,
    height: img.height
  };
};

const reshapePrice = (price: UmbracoCommercePrice): Money => {
  return {
    amount: price.withTax.toString(),
    currencyCode: price.currency.code
  };
};

const reshapeAmount = (amount: UmbracoCommerceAmount): Money => {
  return {
    amount: amount.value.toString(),
    currencyCode: amount.currency.code
  };
};

const reshapeOrder = (order: UmbracoCommerceOrder): Cart => {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    totalQuantity: order.totalQuantity,
    cost: {
      subtotalAmount: reshapePrice(order.subtotalPrice.withoutAdjustments),
      subtotalTaxAmount: {
        amount: order.subtotalPrice.withoutAdjustments.tax.toString(),
        currencyCode: order.subtotalPrice.withoutAdjustments.currency.code
      },
      shippingFeeAmount: order.shippingInfo?.totalPrice
        ? reshapePrice(order.shippingInfo?.totalPrice?.withoutAdjustments)
        : undefined,
      paymentFeeAmount: order.paymentInfo?.totalPrice
        ? reshapePrice(order.paymentInfo?.totalPrice?.withoutAdjustments)
        : undefined,
      discountAmount: order.totalPrice.totalAdjustment
        ? reshapePrice(order.totalPrice.totalAdjustment)
        : undefined,
      totalAmount: reshapePrice(order.totalPrice.value),
      totalTaxAmount: {
        amount: order.totalPrice.value.tax.toString(),
        currencyCode: order.totalPrice.value.currency.code
      }
    },
    lines: order?.orderLines?.map((item) => reshapeOrderLine(item)) || [],
    codes: order?.discountCodes?.map((item) => item.code) || [],
    properties: order?.properties || {},
    billingCountry: order?.paymentInfo?.country
      ? {
          code: order.paymentInfo.country.code,
          name: order.paymentInfo.country.name
        }
      : undefined,
    paymentMethod: order?.paymentInfo?.paymentMethod
      ? reshapePaymentMethod(order.paymentInfo.paymentMethod!)
      : undefined,
    shippingCountry: order?.shippingInfo?.country
      ? {
          code: order.shippingInfo.country.code,
          name: order.shippingInfo.country.name
        }
      : undefined,
    shippingMethod: order?.shippingInfo?.shippingMethod
      ? reshapeShippingMethod(order.shippingInfo.shippingMethod)
      : undefined,
    isComplete: order?.isFinalized || false
  };
};

const reshapeOrderLine = (orderLine: UmbracoCommerceOrderLine): CartItem => {
  var imgUrl = orderLine.properties ? orderLine.properties['imageUrl'] : undefined;
  var bgColor = orderLine.properties ? orderLine.properties['bgColor'] : undefined;

  var title = orderLine.attributes
    ? orderLine.attributes.map((attr) => `${attr.name.name}: ${attr.value.name}`).join(' | ')
    : DEFAULT_OPTION;

  return {
    id: orderLine.id, // [Required]
    merchandise: {
      id: orderLine.productReference, // [Required]
      title: title,
      selectedOptions:
        orderLine.attributes?.map((attr) => ({
          // [Required]
          name: attr.name.alias,
          value: attr.value.alias
        })) || [],
      product: {
        id: orderLine.productReference,
        handle: orderLine.productReference, // [Required]
        availableForSale: true,
        title: orderLine.name, // [Required]
        description: '',
        descriptionHtml: '',
        bgColor: bgColor,
        options: [],
        priceRange: {
          maxVariantPrice: {
            amount: orderLine.totalPrice.withoutAdjustments.withTax.toString(),
            currencyCode: orderLine.totalPrice.withoutAdjustments.currency.code
          },
          minVariantPrice: {
            amount: orderLine.totalPrice.withoutAdjustments.withTax.toString(),
            currencyCode: orderLine.totalPrice.withoutAdjustments.currency.code
          }
        },
        featuredImage: {
          // [Required]
          url: imgUrl ? (imgUrl.indexOf('http') == 0 ? imgUrl : `${umbracoBaseUrl}${imgUrl}`) : '',
          altText: orderLine.name,
          width: 0,
          height: 0
        },
        seo: {
          title: '',
          description: ''
        },
        tags: [],
        updatedAt: new Date().toISOString(),
        variants: [],
        images: []
      }
    },
    quantity: orderLine.quantity, // [Required]
    cost: {
      // [Required]
      totalAmount: reshapePrice(orderLine.totalPrice.withoutAdjustments)
    },
    properties: orderLine.properties || {}
  };
};

const reshapeProduct = (
  node: UmbracoNode,
  filterHiddenProducts: boolean = true
): Product | undefined => {
  if (
    !node ||
    (filterHiddenProducts &&
      node.properties['umbracoNaviHide'] &&
      node.properties['umbracoNaviHide'] === true)
  ) {
    return undefined;
  }

  let nodeAlias = node.route.path
    .replace(/^\/+|\/+$/g, '')
    .split('/')
    .pop();
  let nodeHandle = nodeAlias || node.id;

  let currency = 'EUR';
  let minPrice = 0;
  let maxPrice = 0;

  let metaTitle = node.properties['metaTitle']?.toString() || node.name;
  let metaDescription = node.properties['metaDescription']?.toString();

  let product = <Product>{
    id: node.id,
    handle: nodeHandle,
    title: node.name,
    description: node.properties['shortDescription'],
    descriptionHtml: node.properties['longDescription']?.markup,
    bgColor: node.properties['bgColor']?.label.toLowerCase(),
    availableForSale: (node.properties['stock'] as number) > 0,
    seo: {
      title: metaTitle,
      description: metaDescription
    },
    options: <ProductOption[]>[],
    variants: <ProductVariant[]>[],
    tags: node.properties['tags'] || [],
    updatedAt: node.updateDate,
    isHidden: node.properties['umbracoNaviHide'] && node.properties['umbracoNaviHide'] === true
  };

  var productPrice = node.properties['price'] as UmbracoCommercePrice;
  if (productPrice) {
    currency = productPrice.currency.code;
    minPrice = productPrice.withTax;
    maxPrice = productPrice.withTax;

    product.variants = [
      {
        id: node.id,
        title: node.name,
        availableForSale: (node.properties['stock'] as number) > 0,
        selectedOptions: [],
        price: reshapePrice(productPrice),
        isDefault: true
      }
    ];
  }

  let variants = node.properties['variants'] as UmbracoCommerceVariantPropertyValue;
  if (variants) {
    product.options = variants.attributes.map((attr) => ({
      alias: attr.alias,
      name: attr.name,
      values: attr.values.map((v) => ({ alias: v.alias, name: v.name }))
    }));

    let productVariants = <ProductVariant[]>[];

    variants.items.forEach((itm) => {
      if (itm.content) {
        var variantPrice = itm.content.properties['price'] as UmbracoCommercePrice;
        if (!variantPrice) {
          // If there is no variant price, assume it's the base product price
          variantPrice = productPrice;
        }

        var variantAvailable = (itm.content.properties['stock'] as number) > 0;

        minPrice = minPrice == 0 ? variantPrice.withTax : Math.min(minPrice, variantPrice.withTax);
        maxPrice = maxPrice == 0 ? variantPrice.withTax : Math.max(minPrice, variantPrice.withTax);
        currency = variantPrice.currency.code;

        product.availableForSale = variantAvailable || product.availableForSale;

        productVariants.push(<ProductVariant>{
          id: node.id + ':' + itm.content.id,
          title: node.name + ' ' + itm.content.properties['sku'],
          availableForSale: variantAvailable,
          selectedOptions: Object.entries(itm.attributes).map(([k, v]) => ({
            alias: k,
            value: v
          })),
          price: reshapePrice(variantPrice),
          isDefault: itm.isDefault
        });
      }
    });

    if (productVariants.length > 0) {
      product.variants = productVariants;
    }
  }

  let media = (node.properties['images'] || node.properties['image']) as UmbracoMedia[];
  if (media.length > 0) {
    var images = media.map((m) => reshapeImage(m));
    product.featuredImage = images[0]!;
    product.images = images;
  }

  product.priceRange = {
    minVariantPrice: { amount: minPrice.toString(), currencyCode: currency },
    maxVariantPrice: { amount: maxPrice.toString(), currencyCode: currency }
  };

  return product;
};

const reshapeProducts = (nodes: UmbracoNode[]): Product[] => {
  return <Product[]>(nodes || []).map((n) => reshapeProduct(n)).filter((n) => !!n);
};

const reshapePage = (node: UmbracoNode): Page => {
  let nodeAlias = node.route.path
    .replace(/^\/+|\/+$/g, '')
    .split('/')
    .pop();
  let nodeHandle = nodeAlias || node.id;

  let metaTitle = node.properties['metaTitle']?.toString() || node.name;
  let metaDescription = node.properties['metaDescription']?.toString();

  let sidebarTitle = node.properties['sidebarTitle']?.toString() || node.name;
  let sidebarDescription =
    node.properties['sidebarDescription']?.toString() || node.properties['summary']?.toString();

  return {
    id: node.id,
    handle: nodeHandle,
    title: node.name,
    body: node.properties['bodyText']?.markup,
    bodySummary: node.properties['summary'],
    sidebar: {
      title: sidebarTitle,
      description: sidebarDescription
    },
    seo: {
      title: metaTitle,
      description: metaDescription
    },
    createdAt: node.createDate,
    updatedAt: node.updateDate,
    isHidden: node.properties['umbracoNaviHide'] && node.properties['umbracoNaviHide'] === true
  };
};

const reshapePages = (nodes: UmbracoNode[]): Page[] => {
  return <Page[]>(nodes || []).map((n) => reshapePage(n)).filter((n) => !!n);
};

const reshapeCountry = (entity: UmbracoCommerceCountry): Country | undefined => {
  if (!entity) {
    return undefined;
  }
  return {
    code: entity.code,
    name: entity.name
  };
};

const reshapeCountries = (entities: UmbracoCommerceCountry[]): Country[] => {
  return <Country[]>(entities || []).map((e) => reshapeCountry(e)).filter((e) => !!e);
};

const reshapeShippingMethod = (
  entity: UmbracoCommerceShippingMethod
): ShippingMethod | undefined => {
  if (!entity) {
    return undefined;
  }
  return {
    id: entity.id,
    alias: entity.alias,
    name: entity.name,
    price: entity.price ? reshapePrice(entity.price) : undefined
  };
};

const reshapeShippingMethods = (entities: UmbracoCommerceShippingMethod[]): ShippingMethod[] => {
  return <ShippingMethod[]>(entities || []).map((e) => reshapeShippingMethod(e)).filter((e) => !!e);
};

const reshapePaymentMethod = (entity: UmbracoCommercePaymentMethod): PaymentMethod | undefined => {
  if (!entity) {
    return undefined;
  }
  return {
    id: entity.id,
    alias: entity.alias,
    name: entity.name,
    paymentProviderAlias: entity.paymentProviderAlias,
    price: entity.price ? reshapePrice(entity.price) : undefined
  };
};

const reshapePaymentMethods = (entities: UmbracoCommercePaymentMethod[]): PaymentMethod[] => {
  return <PaymentMethod[]>(entities || []).map((e) => reshapePaymentMethod(e)).filter((e) => !!e);
};

export async function createCart(): Promise<Cart> {
  const res = await umbracoCommerceFetch<UmbracoCommerceOrder>({
    method: 'POST',
    path: '/orders',
    query: {
      expand: cartExpands
    },
    cache: 'no-store',
    payload: {
      currency: 'EUR'
    }
  });
  return reshapeOrder(res.body);
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  // We assume there is only one item to be added at a time
  // which looking at the code is the case. May need to keep
  // track to see if it ever gets implemented that multiple
  // items can be added at once.
  var line = lines[0];
  var idParts = line!.merchandiseId.split(':');

  const res = await umbracoCommerceFetch<UmbracoCommerceOrder>({
    method: 'POST',
    path: `/order/${cartId}`,
    query: {
      expand: cartExpands
    },
    cache: 'no-store',
    payload: {
      productReference: idParts[0],
      productVariantReference: idParts.length == 2 ? idParts[1] : null,
      quantity: 1
    }
  });

  return reshapeOrder(res.body);
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  // We assume there is only one item to be removed at a time
  // which looking at the code is the case. May need to keep
  // track to see if it ever gets implemented that multiple
  // items can be removed at once.
  var lineId = lineIds[0];

  const res = await umbracoCommerceFetch<UmbracoCommerceOrder>({
    method: 'DELETE',
    path: `/order/${cartId}/item/${lineId}`,
    query: {
      expand: cartExpands
    },
    cache: 'no-store'
  });

  return reshapeOrder(res.body);
}

export async function updateCartItems(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const res = await umbracoCommerceFetch<UmbracoCommerceOrder>({
    method: 'PATCH',
    path: `/order/${cartId}/items`,
    query: {
      expand: cartExpands
    },
    cache: 'no-store',
    payload: lines.map((line) => ({
      id: line.id,
      quantity: line.quantity
    }))
  });

  return reshapeOrder(res.body);
}

export async function updateCart(cartId: string, data: UmbracoCommerceOrderUpdate): Promise<Cart> {
  const res = await umbracoCommerceFetch<UmbracoCommerceOrder>({
    method: 'PATCH',
    path: `/order/${cartId}`,
    query: {
      expand: cartExpands
    },
    cache: 'no-store',
    payload: data
  });

  return reshapeOrder(res.body);
}

export async function getCart(
  cartId: string,
  fetchIfFinalized: boolean = false
): Promise<Cart | undefined> {
  const res = await umbracoCommerceFetch<UmbracoCommerceOrder>({
    method: 'GET',
    path: `/order/${cartId}`,
    query: {
      expand: cartExpands
    },
    cache: 'no-store'
  });

  if (!res.body || (!fetchIfFinalized && res.body.isFinalized)) {
    return undefined;
  }

  return reshapeOrder(res.body);
}

export async function getMenu(handle: string): Promise<Menu[]> {
  // We assume there is a mntp on the pages root that defines the menu

  const res = await umbracoContentFetch<UmbracoNode>({
    method: 'GET',
    path: `/content/item/root`,
    tags: [VALIDATION_TAGS.collections, VALIDATION_TAGS.products, VALIDATION_TAGS.pages]
  });

  let menu = res.body?.properties[`${handle}Menu`] as UmbracoLink[];

  return (
    menu?.map((itm) => {
      const path = itm.linkType == 'External' ? itm.url : itm.route?.path;

      const nodeAlias = path!
        .replace(/^\/+|\/+$/g, '')
        .split('/')
        .pop();

      const isCollection = itm.linkType == 'Content' && /collection$/i.test(itm.destinationType!);

      return {
        title: itm.title,
        path: `${isCollection ? '/search/' : '/'}${nodeAlias}`
      };
    }) || []
  );
}

export async function getProducts({
  query,
  tags,
  reverse,
  sortKey
}: {
  query?: string;
  tags?: string[];
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  var queryParams = <Record<string, string | string[]>>{
    fetch: `children:products`,
    expand: 'property:variants',
    take: '100'
  };

  const filters: string[] = [];

  if (query) {
    filters.push(`name:${query}`);
  } else if (sortKey == 'relevance') {
    sortKey = 'sortOrder';
  }

  if (sortKey && sortKey != 'relevance') {
    queryParams.sort = `${sortKey}:${reverse ? 'desc' : 'asc'}`;
  }

  if (tags && tags.length > 0) {
    filters.push(`tag:${tags.join(',')}`);
  }

  if (filters.length > 0) {
    queryParams.filter = filters;
  }

  const res = await umbracoContentFetch<UmbracoPagedResult<UmbracoNode>>({
    method: 'GET',
    path: `/content`,
    query: queryParams,
    tags: [VALIDATION_TAGS.products]
  });

  return reshapeProducts(res.body?.items);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const res = await umbracoContentFetch<UmbracoNode>({
    method: 'GET',
    path: `/content/item/${handle}`,
    headers: {
      'Start-Item': 'products'
    },
    query: {
      expand: 'property:variants'
    },
    tags: [VALIDATION_TAGS.products]
  });

  return reshapeProduct(res.body);
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  // Get the product
  const res = await umbracoContentFetch<UmbracoNode>({
    method: 'GET',
    path: `/content/item/${productId}`,
    headers: {
      'Start-Item': 'products'
    },
    tags: [VALIDATION_TAGS.products]
  });

  // Get the product tags (if it has any)
  const tags = <string[]>(res.body.properties['tags'] || []);
  if (tags.length == 0) {
    return [];
  }

  // Get other products with tags
  const res2 = await umbracoContentFetch<UmbracoPagedResult<UmbracoNode>>({
    method: 'GET',
    path: `/content`,
    query: {
      fetch: `children:products`,
      filter: `tag:${tags.join(',')}`
    },
    tags: [VALIDATION_TAGS.products]
  });

  // Return products filtering out current product
  return reshapeProducts(res2.body?.items.filter((x) => x.id != productId));
}

export async function getPage(handle: string): Promise<Page> {
  const res = await umbracoContentFetch<UmbracoNode>({
    method: 'GET',
    path: `/content/item/${handle}`,
    headers: {
      'Start-Item': 'pages'
    },
    tags: [VALIDATION_TAGS.pages]
  });

  return reshapePage(res.body);
}

export async function getPages(): Promise<Page[]> {
  const res = await umbracoContentFetch<UmbracoPagedResult<UmbracoNode>>({
    method: 'GET',
    path: `/content`,
    query: {
      fetch: `children:pages`
    },
    tags: [VALIDATION_TAGS.pages]
  });

  return reshapePages(
    res.body?.items.filter(
      (node) => !node.properties['umbracoNaviHide'] || node.properties['umbracoNaviHide'] === false
    )
  );
}

export async function getProductTags(): Promise<string[]> {
  const res = await umbracoFetch<string[]>({
    method: 'GET',
    path: `${umbracoBaseUrl}/umbraco/api/tagsapi/gettags`,
    query: {
      group: `products`
    },
    tags: [VALIDATION_TAGS.products]
  });
  return res?.body || [];
}

export async function getCountries(): Promise<Country[]> {
  const res = await umbracoCommerceFetch<UmbracoCommerceCountry[]>({
    method: 'GET',
    path: `/countries`
  });

  if (!res.body) {
    return [];
  }

  return reshapeCountries(res.body);
}

export async function getShippingMethods(countryCode: string): Promise<ShippingMethod[]> {
  const res = await umbracoCommerceFetch<UmbracoCommerceShippingMethod[]>({
    method: 'GET',
    path: `/country/${countryCode}/shippingmethods`
  });

  if (!res.body) {
    return [];
  }

  return reshapeShippingMethods(res.body);
}

export async function getPaymentMethods(countryCode: string): Promise<PaymentMethod[]> {
  const res = await umbracoCommerceFetch<UmbracoCommercePaymentMethod[]>({
    method: 'GET',
    path: `/country/${countryCode}/paymentmethods`
  });

  if (!res.body) {
    return [];
  }

  return reshapePaymentMethods(
    res.body.filter((item) => {
      return item.alias !== 'zeroValue';
    })
  );
}

export async function initializeHostedCheckout(
  orderId: string
): Promise<UmbracoCommerceCheckoutToken> {
  const res = await umbracoCommerceFetch<UmbracoCommerceCheckoutToken>({
    method: 'GET',
    path: `/checkout/${orderId}/token`,
    headers: {
      Origin: baseUrl,
      Mode: process.env.UMBRACO_COMMERCE_CHECKOUT_MODE!
    }
  });
  return res.body;
}

export async function initializeInlineCheckout(
  orderId: string
): Promise<UmbracoCommerceInlineCheckout> {
  const res = await umbracoCommerceFetch<UmbracoCommerceInlineCheckout>({
    method: 'GET',
    path: `/checkout/${orderId}/initialize`,
    cache: 'no-store'
  });
  return res.body;
}

export async function confirmInlineCheckout(
  orderId: string,
  data: UmbracoCommerceInlineCheckoutConfirmation
): Promise<UmbracoCommerceCheckoutConfirmResponse> {
  const res = await umbracoCommerceFetch<UmbracoCommerceCheckoutConfirmResponse>({
    method: 'POST',
    path: `/checkout/${orderId}/confirm`,
    payload: data,
    query: {
      expand: cartExpands
    },
    cache: 'no-store'
  });

  return res.body;
}

export async function submitStockNotificationForm(
  email: string,
  productReference: string
): Promise<UmbracoFormsResponse> {

  const idParts = productReference.split(':')

  const res = await umbracoFormsFetch<UmbracoFormsResponse>({
    method: 'POST',
    path: `/entries/${process.env.UMBRACO_FORMS_STOCK_NOTIFICATION_FORM_ID!}`,
    payload: {
      values: {
        productReference: idParts[0],
        productVariantReference: idParts.length > 1 ? idParts[1] : undefined,
        email: email
      }
    },
    cache: 'no-store'
  });

  return res.body;

}