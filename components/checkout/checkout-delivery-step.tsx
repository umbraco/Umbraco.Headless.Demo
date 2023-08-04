'use client';

import { RadioGroup } from '@headlessui/react';
import { CheckoutStep } from 'app/checkout/steps';
import {
  setShippingMethod as doSetShippingMethod,
  getShippingMethods
} from 'components/cart-actions';
import { CartContext } from 'components/cart-context';
import LoadingDots from 'components/loading-dots';
import { Cart, ShippingMethod } from 'lib/umbraco/types';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState, useTransition } from 'react';
import CheckoutRadioOption from './checkout-radio-option';
import CheckoutStepForm from './checkout-step-form';

export default function CheckoutDeliveryStep({
  steps,
  currentStep,
  nextStep
}: {
  steps: CheckoutStep[];
  currentStep: CheckoutStep;
  nextStep?: CheckoutStep;
}) {
  const { currentCart, setCurrentCart } = useContext(CartContext);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[] | undefined>(undefined);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setLoading] = useState(true);

  const handleSubmit = () => {
    if (!currentCart || !selectedShippingMethod) return;
    startTransition(async () => {
      const res = await doSetShippingMethod(selectedShippingMethod!);
      const cart = res as Cart;
      if (cart) {
        setCurrentCart(cart);
      } else {
        alert(res as Error);
        return;
      }
      router.push(`/checkout/${nextStep?.slug}`);
    });
  };

  useEffect(() => {
    if (currentCart) {
      getShippingMethods().then((data) => {
        const items = data as ShippingMethod[];
        if (items) {
          setShippingMethods(items);
          setSelectedShippingMethod(currentCart.shippingMethod?.alias || items[0]!.alias);
        } else {
          alert(data);
        }
        setLoading(false);
      });
    } else {
      router.replace('/');
    }
  }, [currentCart]);

  return (
    currentCart && (
      <CheckoutStepForm
        steps={steps}
        currentStep={currentStep}
        heading="How should we ship your items?"
        buttonContent={
          <>
            Continue to {nextStep?.title.toLowerCase()}
            {isPending && <LoadingDots className="bg-white" />}
          </>
        }
        onSubmit={handleSubmit}
      >
        <div className="mt-8 lg:mt-14">
          {isLoading && <CheckoutRadioOption placeholder={true} />}
          {!isLoading && shippingMethods && shippingMethods.length > 0 && currentCart && (
            <RadioGroup
              value={selectedShippingMethod}
              onChange={setSelectedShippingMethod}
              className="flex flex-col gap-4"
            >
              {shippingMethods.map((item) => (
                <RadioGroup.Option key={item.id} value={item.alias}>
                  {({ checked }) => (
                    <CheckoutRadioOption title={item.name} price={item.price} checked={checked} />
                  )}
                </RadioGroup.Option>
              ))}
            </RadioGroup>
          )}
        </div>
      </CheckoutStepForm>
    )
  );
}
