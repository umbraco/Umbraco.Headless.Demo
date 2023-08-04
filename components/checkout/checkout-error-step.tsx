'use client';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { CheckoutStep } from 'app/checkout/steps';
import { CartContext } from 'components/cart-context';
import Link from 'next/link';
import { useContext, useEffect } from 'react';

export default function CheckoutErrorStep({
  steps,
  currentStep
}: {
  steps: CheckoutStep[];
  currentStep: CheckoutStep;
}) {
  const { setCurrentCart } = useContext(CartContext);

  useEffect(() => {
    setCurrentCart(undefined);
  }, []);

  return (
    <>
      <div className="flex h-full w-full items-center justify-center">
        <div className="max-w-xl p-8">
          <ExclamationTriangleIcon className="mx-auto mb-4 h-40 w-40 text-umb-yellow" />
          <h1 className="mb-4 text-4xl font-bold">There was an error processing your order</h1>
          <p className="mb-8">
            We were unable to complete the purchase of your order. Please contact us to discuss what
            went wrong and what we can do to resolve this.
          </p>
          <a
            href={'mailto:help@mydomain.com'}
            className="btn btn-lg block bg-umb-blue text-white hover:bg-umb-blue-active"
          >
            Contact Support
          </a>
          <Link
            href={'/'}
            className="btn btn-lg btn-outline mt-4 block border-umb-blue text-umb-blue hover:border-umb-blue-active hover:text-umb-blue-active"
          >
            Return to home
          </Link>
        </div>
      </div>
    </>
  );
}
