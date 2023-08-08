'use client';

import { CheckoutStep } from 'app/checkout/steps';
import { CartContext } from 'components/cart-context';
import { PaymentMethod, UmbracoCommerceInlineCheckoutPaymentMethod } from 'lib/umbraco/types';
import { useContext, useEffect, useMemo, useState } from 'react';

import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { fetchJson } from 'components/cart-actions';
import LoadingDots from 'components/loading-dots';
import Price from 'components/price';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

export default function StripePaymentForm({
  paymentMethod,
  paymentMethodSettings,
  steps
}: {
  paymentMethod: PaymentMethod;
  paymentMethodSettings: UmbracoCommerceInlineCheckoutPaymentMethod;
  steps: CheckoutStep[];
}) {
  const { currentCart } = useContext(CartContext);
  const [stripeOptions, setStripeOptions] = useState<any>();

  const stripePublicKey = paymentMethodSettings?.settings?.testPublicKey;
  const stripePromise = useMemo(
    () => loadStripe(stripePublicKey!),
    [currentCart?.id, paymentMethodSettings?.settings?.testPublicKey]
  );

  // We utilize the payment provider's callback to communicate back to the payment provider
  // and have it create a payment intent and return the relevant client secret.
  // This is very much dependant on the payment provider implementation as to whether
  // such an API is exposed. I've had to update the Stripe payment provider to support this
  // so it's likely we'd need to do the same for others.
  // Failing that, you could implement your own API controller and handle initialization
  // yourself, but I just thought it would be nicer to come from the payment provider.
  useEffect(() => {
    fetchJson(`${paymentMethodSettings.urls.callback}?create=paymentIntent`).then((json) =>
      setStripeOptions(json)
    );
  }, [currentCart?.id, paymentMethodSettings?.settings?.testPublicKey]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      {stripeOptions ? (
        <Elements stripe={stripePromise} options={stripeOptions}>
          <InnerStripePaymentForm />
        </Elements>
      ) : (
        <span className="scale-[500%]">
          <LoadingDots className="bg-umb-blue" />
        </span>
      )}
    </div>
  );
}

// We have to create an inner component because the Elements tag and
// the useStripe/useElements don't seem to be able to be used within
// the same component so we just split them in two.
export function InnerStripePaymentForm() {
  const { currentCart } = useContext(CartContext);

  const stripe = useStripe();
  const elements = useElements();

  const [isReady, setIsReady] = useState(false);

  // Hide custom UI elements until the Stripe payment element has loaded
  useEffect(() => {
    elements?.getElement('payment')?.on('ready', () => {
      setIsReady(true);
    });
  }, [elements]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: `${baseUrl}/checkout/confirmation`
      }
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl p-8">
      <PaymentElement />
      {stripe && isReady && (
        <button className="btn btn-lg mt-8 w-full bg-umb-blue text-white hover:bg-umb-blue-active">
          Pay
          <Price
            className="inline"
            amount={currentCart!.cost.totalAmount.amount}
            currencyCode={currentCart!.cost.totalAmount.currencyCode}
          ></Price>
        </button>
      )}
    </form>
  );
}
