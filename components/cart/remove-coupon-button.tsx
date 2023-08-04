import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { removeCouponCode } from 'components/cart-actions';
import { CartContext } from 'components/cart-context';
import LoadingDots from 'components/loading-dots';
import { Cart } from 'lib/umbraco/types';
import { useRouter } from 'next/navigation';
import { useContext, useTransition } from 'react';

export default function RemoveCouponButton({
  code,
  className
}: {
  code: string;
  className?: string;
}) {
  const { setCurrentCart } = useContext(CartContext);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      aria-label="Remove item"
      onClick={() => {
        startTransition(async () => {
          const res = await removeCouponCode(code);
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
      disabled={isPending}
      className={clsx(
        'flex h-6 w-6 items-center justify-center rounded-full bg-white text-black outline-umb-blue transition-colors hover:bg-umb-blue hover:text-white md:h-7 md:w-7',
        {
          'cursor-not-allowed px-0': isPending
        },
        className
      )}
    >
      {isPending ? <LoadingDots className="bg-black" /> : <XMarkIcon className="h-5 stroke-2" />}
    </button>
  );
}
