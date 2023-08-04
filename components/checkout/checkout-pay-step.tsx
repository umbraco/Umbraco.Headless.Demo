'use client';

import { CheckoutStep } from 'app/checkout/steps';
import { initializeInlineCheckout } from 'components/cart-actions';
import { CartContext } from 'components/cart-context';
import LoadingDots from 'components/loading-dots';
import { UmbracoCommerceInlineCheckout } from 'lib/umbraco/types';
import { useContext, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import InvoicingPaymentForm from './invoicing-payment-form';
import StripePaymentForm from './stripe-payment-form';

export type CheckoutPaymentForm = {
  paymentProviderAlias: string;
  component: any;
};

export const paymentForms: CheckoutPaymentForm[] = [
  { paymentProviderAlias: 'invoicing', component: InvoicingPaymentForm },
  { paymentProviderAlias: 'stripe-checkout', component: StripePaymentForm }
];

export default function CheckoutPayStep({
  steps,
  currentStep,
  nextStep
}: {
  steps: CheckoutStep[];
  currentStep: CheckoutStep;
  nextStep?: CheckoutStep;
}) {
  const { currentCart } = useContext(CartContext);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethodSettings, setPaymentMethodSettings] = useState<any>();

  const router = useRouter();

  const paymentProvider = currentCart?.paymentMethod?.paymentProviderAlias;
  const paymentForm = paymentProvider
    ? paymentForms.find((f) => f.paymentProviderAlias === paymentProvider)
    : undefined;

  const PaymentFormComponent = paymentForm?.component;
  const paymentFormProps: any = {
    paymentMethod: currentCart?.paymentMethod,
    paymentMethodSettings: paymentMethodSettings,
    steps: steps
  };

  // NOTE: You should only hit this step for `Inline` payment types

  // As every inline payment will need initializing, we do it here
  // and then render the relevant payment form based upon the selected
  // payment methods payment provider. In this example, it does assume
  // you know explicitly what payment methods you support as we have to
  // map all supported methods to a relevant payment form component.
  // There is likely a smarter way of doing this though, potentially
  // dynamically loading components based on the payment provider alias?
  useEffect(() => {
    if (isLoading) {
      if (currentCart) {
        initializeInlineCheckout().then((data) => {
          const checkoutPayload = data as UmbracoCommerceInlineCheckout;
          if (checkoutPayload) {
            setPaymentMethodSettings(checkoutPayload.paymentMethod);
          } else {
            alert(data);
          }
          setIsLoading(false);
        });
      } else {
        router.replace('/');
      }
    }
  }, [currentCart]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      {isLoading ? (
        <span className="scale-[500%]">
          <LoadingDots className="bg-umb-blue" />
        </span>
      ) : (
        <>{PaymentFormComponent && <PaymentFormComponent {...paymentFormProps} />}</>
      )}
    </div>
  );
}
