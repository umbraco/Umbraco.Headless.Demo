'use client';

import { CheckoutStep } from 'app/checkout/steps';
import { confirmInlineCheckout } from 'components/cart-actions';
import { CartContext } from 'components/cart-context';
import LoadingDots from 'components/loading-dots';
import { Cart, PaymentMethod, UmbracoCommerceInlineCheckoutPaymentMethod } from 'lib/umbraco/types';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

export default function InvoicingPaymentForm({
  paymentMethod,
  paymentMethodSettings,
  steps
}: {
  paymentMethod: PaymentMethod;
  paymentMethodSettings: UmbracoCommerceInlineCheckoutPaymentMethod;
  steps: CheckoutStep[];
}) {
  const { currentCart, setCurrentCart } = useContext(CartContext);

  const router = useRouter();

  // Invoicing doesn't need to do anything so we just mark the payment
  // as captured and redirect to the confirmation step
  useEffect(() => {
    confirmInlineCheckout({
      amount: parseFloat(currentCart!.cost.totalAmount.amount),
      transactionId: `INV-${new Date().getTime()}`,
      paymentStatus: 'Captured'
    }).then((data) => {
      const order = data as Cart;
      if (order) {
        setCurrentCart(order);
        setTimeout(() => {
          // Seem to need to give a little time to update current order
          // so we execute the redirect in a timeout in a few ticks time
          const statusStep = steps.find((step) => step.status === 'completed');
          if (statusStep) {
            router.push(`/checkout/${statusStep.slug}`);
          } else {
            router.push(`/`);
          }
        }, 10);
      } else {
        alert(data);
      }
    });
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <span className="scale-[500%]">
        <LoadingDots className="bg-umb-blue" />
      </span>
    </div>
  );
}
