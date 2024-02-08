'use client';

import { RadioGroup } from '@headlessui/react';
import { CheckoutStep } from 'app/checkout/steps';
import { calculatePaymentMethodFees, setPaymentMethod as doSetPaymentMethod } from 'components/cart-actions';
import { CartContext } from 'components/cart-context';
import LoadingDots from 'components/loading-dots';
import { Cart, PaymentMethodWithFee } from 'lib/umbraco/types';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState, useTransition } from 'react';
import CheckoutRadioOption from './checkout-radio-option';
import CheckoutStepForm from './checkout-step-form';

export default function CheckoutPaymentStep({
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

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodWithFee[] | undefined>(undefined);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>(undefined);
  const [isLoading, setLoading] = useState(true);

  const handleSubmit = () => {
    if (!currentCart || !selectedPaymentMethod) return;
    startTransition(async () => {
      const res = await doSetPaymentMethod(selectedPaymentMethod!);
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
      calculatePaymentMethodFees().then((data) => {
        const items = data as PaymentMethodWithFee[];
        if (items) {
          setPaymentMethods(items);
          setSelectedPaymentMethod(currentCart.paymentMethod?.alias || items[0]!.alias);
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
        heading="How would you like to pay?"
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
          {!isLoading && paymentMethods && paymentMethods.length > 0 && currentCart && (
            <RadioGroup
              value={selectedPaymentMethod}
              onChange={setSelectedPaymentMethod}
              className="flex flex-col gap-4"
            >
              {paymentMethods.map((item) => (
                <RadioGroup.Option key={item.id} value={item.alias}>
                  {({ checked }) => (
                    <CheckoutRadioOption title={item.name} price={item.fee} checked={checked} />
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
