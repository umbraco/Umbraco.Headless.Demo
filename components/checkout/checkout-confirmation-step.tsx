'use client';

import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { CheckoutStep } from 'app/checkout/steps';
import { CartContext } from 'components/cart-context';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useContext, useEffect } from 'react';
import Confetti from './confetti';

export default function CheckoutConfirmationStep({
  steps,
  currentStep
}: {
  steps: CheckoutStep[];
  currentStep: CheckoutStep;
}) {
  const { previousCart, setCurrentCart } = useContext(CartContext);
  const searchParams = useSearchParams();
  const orderNumber = previousCart?.orderNumber || searchParams.get('ordernumber');

  useEffect(() => {
    setCurrentCart(undefined);
  }, []);

  return (
    <>
      <Confetti />
      <div className="flex h-full w-full items-center justify-center">
        <div className="max-w-xl p-8">
          <CheckCircleIcon className="mx-auto mb-4 h-40 w-40 text-umb-green" />
          <h1 className="mb-4 text-4xl font-bold">Thank you for your order</h1>
          {orderNumber && <h2 className="mb-4 text-2xl font-bold">#{orderNumber}</h2>}
          <p className="mb-8">
            A confirmation email has been sent to the email address you supplied during checkout.
            <br />
            <br /> We'll get on with packing your order as soon as possible and let you know when a
            shipment has been sent.
          </p>
          <Link
            href={'/'}
            className="btn btn-lg block bg-umb-blue text-white hover:bg-umb-blue-active"
          >
            Return to home
          </Link>
        </div>
      </div>
    </>
  );
}
