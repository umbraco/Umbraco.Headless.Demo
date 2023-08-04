import clsx from 'clsx';
import { updateItemQuantity } from 'components/cart-actions';
import { CartContext } from 'components/cart-context';
import LoadingDots from 'components/loading-dots';
import { useDebounce } from 'hooks/use-debounce';
import { Cart, CartItem } from 'lib/umbraco/types';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState, useTransition } from 'react';

export default function EditItemQuantityInput({ item, stock }: { item: CartItem; stock?: number }) {
  const { setCurrentCart } = useContext(CartContext);

  const router = useRouter();

  const [quantity, setQuantity] = useState(item.quantity);
  const [isPending, startTransition] = useTransition();

  const debouncedQuantity = useDebounce(quantity, 1000);

  useEffect(() => {
    // Don't trigger if the quantity is the same
    if (debouncedQuantity == item.quantity) {
      return;
    }

    // Update quantity
    startTransition(async () => {
      const res = await updateItemQuantity({
        lineId: item.id,
        variantId: item.merchandise.id,
        quantity: debouncedQuantity
      });
      const cart = res as Cart;
      if (cart) {
        setCurrentCart(cart);
      } else {
        alert(res as Error);
        return;
      }
      //router.refresh();
    });
  }, [debouncedQuantity]);

  return (
    <>
      <div className="relative">
        <input
          type="number"
          className={clsx(
            'text-md form-input w-20 rounded-md border-gray-200 px-4 py-3 outline-umb-blue md:w-32 md:text-xl',
            {
              'cursor-not-allowed': isPending
            }
          )}
          min={1}
          max={stock || 100}
          step={1}
          disabled={isPending}
          value={quantity}
          onChange={(e) => {
            setQuantity(parseInt(e.target.value));
          }}
        ></input>
        {isPending && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2">
            <LoadingDots className="bg-black" />
          </span>
        )}
      </div>
    </>
  );
}
