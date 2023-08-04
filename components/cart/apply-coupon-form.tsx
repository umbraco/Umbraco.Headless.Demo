'use client';

import clsx from 'clsx';
import { applyCouponCode } from 'components/cart-actions';
import { CartContext } from 'components/cart-context';
import LoadingDots from 'components/loading-dots';
import { Cart } from 'lib/umbraco/types';
import { useRouter } from 'next/navigation';
import { useContext, useState, useTransition } from 'react';

export default function ApplyCouponForm({ className }: { className?: string }) {
  const { setCurrentCart } = useContext(CartContext);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [couponCode, setCouponCode] = useState('');

  return (
    <div className="flex w-full gap-4">
      <input
        type="text"
        className="text-md form-input flex-1 rounded-md border-gray-200 px-4 py-3 outline-umb-blue md:text-xl"
        placeholder="Enter your coupon code..."
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
      ></input>
      <button
        type="button"
        className={clsx('btn btn-lg px-8 ', {
          'bg-umb-blue text-white hover:bg-umb-blue-active': couponCode,
          'cursor-not-allowed bg-stb-5 text-gray-400': !couponCode,
          'cursor-not-allowed': isPending
        })}
        disabled={!couponCode}
        onClick={() => {
          startTransition(async () => {
            const res = await applyCouponCode(couponCode);
            const cart = res as Cart;
            if (cart) {
              setCurrentCart(cart);
            } else {
              alert(res as Error);
              return;
            }
            setCouponCode('');
            // router.refresh();
          });
        }}
      >
        {isPending ? <LoadingDots className="bg-white" /> : <span>Apply</span>}
      </button>
    </div>
  );
}
