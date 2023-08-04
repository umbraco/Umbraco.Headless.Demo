'use client';

import { Cart } from 'lib/umbraco/types';
import { ReactNode, createContext, useEffect, useState } from 'react';
import {
  getCurrentCart as doGetCurrentCart,
  setCurrentCart as doSetCurrentCart
} from './cart-actions';

export const CartContext = createContext<{
  currentCart?: Cart;
  previousCart?: Cart;
  setCurrentCart: (cart: Cart | undefined) => void;
}>({
  setCurrentCart: (c) => {}
});

export default function CartContextProvider({ children }: { children?: ReactNode }) {
  const [currentCart, setCurrentCart] = useState<Cart | undefined>();
  const [previousCart, setPreviousCart] = useState<Cart | undefined>();
  const [isLoaded, setIsLoaded] = useState(false);

  const setCurrentCartHandler = (cart: Cart | undefined) => {
    // console.log(cart);
    if ((!cart && currentCart) || (cart && !currentCart?.isComplete && cart.isComplete)) {
      // console.log('Clearing current cart and updating previous');
      // If we are clearing the cart, or the current cart has become complete
      // move the current cart to the previous cart slot and then clear the current cart state
      setPreviousCart(cart || currentCart);
      setCurrentCart(undefined);
    } else if (cart) {
      // console.log('Updating current cart and clearing previous');
      // If we are just updating the cart in some way then update the current cart
      // and clear our the previous cart
      setCurrentCart(cart);
      setPreviousCart(undefined);
    }
  };

  // Load the current cart from cookie on page load
  useEffect(() => {
    doGetCurrentCart().then((cart) => {
      setCurrentCart(cart);
      setIsLoaded(true);
    });
  }, []);

  // Watch for changes in the current cart ID and sync them
  // to the cart cookie
  useEffect(() => {
    if (isLoaded) {
      doSetCurrentCart(currentCart).then((cart) => {
        console.log(`Cart cookie updated: ${cart?.id || 'empty'}`);
      });
    }
  }, [isLoaded, currentCart?.id]);

  return (
    <CartContext.Provider
      value={{ currentCart, previousCart, setCurrentCart: setCurrentCartHandler }}
    >
      {children}
    </CartContext.Provider>
  );
}
