'use client';

import clsx from 'clsx';
import { addItem } from 'components/cart-actions';
import { CartContext } from 'components/cart-context';
import LoadingDots from 'components/loading-dots';
import { Cart, ProductVariant } from 'lib/umbraco/types';
import { useRouter } from 'next/navigation';
import { useContext, useTransition } from 'react';

export function AddToCartButton({
  variant,
  className
}: {
  variant?: ProductVariant;
  className?: string;
}) {
  const { currentCart, setCurrentCart } = useContext(CartContext);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      aria-label="Add item to cart"
      disabled={isPending}
      onClick={() => {
        if (!variant?.availableForSale) return;
        startTransition(async () => {
          const res = await addItem(variant.id);
          const cart = res as Cart;
          if (cart) {
            setCurrentCart(cart);
          } else {
            alert(res as Error);
            return;
          }
          //router.refresh();
        });
      }}
      className={clsx(
        'btn btn-lg outline-umb-blue',
        {
          'bg-umb-blue text-white hover:bg-umb-green': variant?.availableForSale,
          'cursor-not-allowed bg-stb-15 text-gray-400 line-through':
            !variant?.availableForSale,
          'cursor-not-allowed': isPending
        },
        className
      )}
    >
      <span>{variant?.availableForSale === false ? 'Sold Out' : 'Add To Cart'}</span>
      {isPending ? <LoadingDots className="bg-white" /> : null}
    </button>
  );
}
