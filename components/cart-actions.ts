'use server';

import {
  addToCart,
  createCart,
  confirmInlineCheckout as doConfirmInlineCheckout,
  getCart as doGetCart,
  getPaymentMethods as doGetPaymentMethods,
  getShippingMethods as doGetShippingMethods,
  initializeHostedCheckout as doInitializeHostedCheckout,
  initializeInlineCheckout as doInitializeInlineCheckout,
  updateCart as doUpdateCart,
  removeFromCart,
  updateCartItems
} from 'lib/umbraco';
import {
  Cart,
  CartUpdate,
  PaymentMethod,
  ShippingMethod,
  UmbracoCommerceCheckoutToken,
  UmbracoCommerceInlineCheckout,
  UmbracoCommerceInlineCheckoutConfirmation
} from 'lib/umbraco/types';
import { cookies } from 'next/headers';

export const setCurrentCart = async (cart: Cart | undefined): Promise<Cart | undefined> => {
  let cartId = cookies().get('cartId')?.value;
  if (cart && cart.id !== cartId) {
    cookies().set('cartId', cart.id);
  } else if (!cart && cartId) {
    cookies().delete('cartId');
  }
  return cart;
};

export const getCart = async (
  cartId: string,
  fetchIfCompleted: boolean = false
): Promise<Cart | undefined> => {
  return await doGetCart(cartId, fetchIfCompleted);
};

export const getCurrentCart = async (): Promise<Cart | undefined> => {
  let cartId = cookies().get('cartId')?.value;
  let cart;
  if (cartId) {
    cart = await getCart(cartId, true);
  }
  return cart;
};

export const ensureCurrentCart = async (): Promise<Cart> => {
  let cart = await getCurrentCart();
  if (!cart) {
    cart = await createCart();
    await setCurrentCart(cart);
  }
  return cart;
};

export const addItem = async (variantId: string): Promise<Error | Cart> => {
  const cart = await ensureCurrentCart();
  try {
    return await addToCart(cart.id, [{ merchandiseId: variantId, quantity: 1 }]);
  } catch (e) {
    return new Error('Error adding item', { cause: e });
  }
};

export const removeItem = async (lineId: string): Promise<Error | Cart> => {
  const cart = await ensureCurrentCart();
  try {
    return await removeFromCart(cart.id, [lineId]);
  } catch (e) {
    return new Error('Error removing item', { cause: e });
  }
};

export const updateItemQuantity = async ({
  lineId,
  variantId,
  quantity
}: {
  lineId: string;
  variantId: string;
  quantity: number;
}): Promise<Error | Cart> => {
  const cart = await ensureCurrentCart();
  try {
    return await updateCartItems(cart.id, [
      {
        id: lineId,
        merchandiseId: variantId,
        quantity
      }
    ]);
  } catch (e) {
    return new Error('Error updating item quantity', { cause: e });
  }
};

export const updateCart = async (data: CartUpdate): Promise<Error | Cart> => {
  const cart = await ensureCurrentCart();
  try {
    return await doUpdateCart(cart.id, data);
  } catch (e) {
    return new Error('Error updating details', { cause: e });
  }
};

export const applyCouponCode = async (code: string): Promise<Error | Cart> => {
  const cart = await ensureCurrentCart();
  try {
    return await doUpdateCart(cart.id, { redeem: code });
  } catch (e) {
    return new Error('Error redeeming coupon code', { cause: e });
  }
};

export const removeCouponCode = async (code: string): Promise<Error | Cart> => {
  const cart = await ensureCurrentCart();
  try {
    return await doUpdateCart(cart.id, { unredeem: code });
  } catch (e) {
    return new Error('Error unredeeming coupon code', { cause: e });
  }
};

export const getShippingMethods = async (): Promise<Error | ShippingMethod[]> => {
  const cart = await ensureCurrentCart();
  try {
    return await doGetShippingMethods(cart.shippingCountry!.code);
  } catch (e) {
    return new Error('Error fetching shipping methods', { cause: e });
  }
};

export const setShippingMethod = async (alias: string): Promise<Error | Cart> => {
  const cart = await ensureCurrentCart();
  try {
    return await doUpdateCart(cart.id, { shippingMethod: alias });
  } catch (e) {
    return new Error('Error updating shipping method', { cause: e });
  }
};

export const getPaymentMethods = async (): Promise<Error | PaymentMethod[]> => {
  const cart = await ensureCurrentCart();
  try {
    return await doGetPaymentMethods(cart.billingCountry!.code);
  } catch (e) {
    return new Error('Error fetching payment methods', { cause: e });
  }
};

export const setPaymentMethod = async (alias: string): Promise<Error | Cart> => {
  const cart = await ensureCurrentCart();
  try {
    return await doUpdateCart(cart.id, { paymentMethod: alias });
  } catch (e) {
    return new Error('Error updating payment method', { cause: e });
  }
};

export const initializeHostedCheckout = async (): Promise<Error | UmbracoCommerceCheckoutToken> => {
  const cart = await ensureCurrentCart();
  try {
    return await doInitializeHostedCheckout(cart.id);
  } catch (e) {
    return new Error('Error intializing checkout', { cause: e });
  }
};

export const initializeInlineCheckout = async (): Promise<
  Error | UmbracoCommerceInlineCheckout
> => {
  const cart = await ensureCurrentCart();
  try {
    return await doInitializeInlineCheckout(cart.id);
  } catch (e) {
    return new Error('Error intializing checkout', { cause: e });
  }
};

export const confirmInlineCheckout = async (
  data: UmbracoCommerceInlineCheckoutConfirmation
): Promise<Error | Cart> => {
  const cart = await ensureCurrentCart();
  try {
    await doConfirmInlineCheckout(cart.id, data);
    const order = await doGetCart(cart.id, true);
    if (order) {
      return order;
    } else {
      return new Error('Unable to get updated cart');
    }
  } catch (e) {
    return new Error('Error confirming checkout', { cause: e });
  }
};

// This acts as a proxy to allow us to get around CORS issues
export const fetchJson = async (url: string): Promise<any> => {
  return fetch(url).then((data) => data.json());
};
