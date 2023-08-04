'use client';

import { CheckoutStep } from 'app/checkout/steps';
import { CartContext } from 'components/cart-context';
import DeleteItemButton from 'components/cart/delete-item-button';
import EditItemQuantityInput from 'components/cart/edit-item-quantity-input';
import RemoveCouponButton from 'components/cart/remove-coupon-button';
import Price from 'components/price';
import { DEFAULT_OPTION } from 'lib/constants';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import ApplyCouponForm from '../cart/apply-coupon-form';
import CheckoutStepForm from './checkout-step-form';

export default function CheckoutOrderStep({
  steps,
  currentStep,
  nextStep
}: {
  steps: CheckoutStep[];
  currentStep: CheckoutStep;
  nextStep?: CheckoutStep;
}) {
  const { currentCart } = useContext(CartContext);

  const router = useRouter();

  useEffect(() => {
    if (!currentCart) {
      router.replace('/');
    }
  }, [currentCart]);

  const handleSubmit = () => {
    if (!currentCart) return;
    router.push(`/checkout/${nextStep?.slug}`);
  };

  return (
    currentCart && (
      <CheckoutStepForm
        steps={steps}
        currentStep={currentStep}
        heading="Hi, this is your swag"
        buttonContent={<>Continue to {nextStep?.title.toLowerCase()}</>}
        onSubmit={handleSubmit}
      >
        <>
          <div className="mt-8 flex flex-col gap-4 lg:mt-14">
            {currentCart.lines.map((item) => (
              <div
                key={item.id}
                className="relative flex items-center justify-start gap-4 rounded bg-white p-4 lg:p-8"
              >
                <div className="flex-1">
                  <h5 className="text-lg font-bold lg:text-xl">{item.merchandise.product.title}</h5>
                  {item.merchandise.title !== DEFAULT_OPTION ? (
                    <p className="mt-1">{item.merchandise.title}</p>
                  ) : null}
                </div>
                <div>
                  <EditItemQuantityInput item={item} />
                </div>
                <div className="min-w-[80px] text-right">
                  <Price
                    className="whitespace-nowrap text-lg font-bold lg:text-xl"
                    amount={item.cost.totalAmount.amount}
                    currencyCode={item.cost.totalAmount.currencyCode}
                  />
                </div>
                <DeleteItemButton
                  item={item}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
                />
              </div>
            ))}

            <div className="rounded bg-white ">
              <div className="flex justify-between border-b border-umb-gray p-4 text-lg lg:p-8 lg:text-xl">
                <div className="font-bold">Subtotal</div>
                <div>
                  <Price
                    amount={currentCart.cost.subtotalAmount.amount}
                    currencyCode={currentCart.cost.subtotalAmount.currencyCode}
                  />
                </div>
              </div>
              {currentCart.cost.discountAmount &&
                parseFloat(currentCart.cost.discountAmount.amount) !== 0 && (
                  <div className="border-b border-umb-gray p-4 text-lg lg:p-8 lg:text-xl">
                    <div className="flex justify-between">
                      <div className="font-bold">Discount</div>
                      <div>
                        <Price
                          amount={currentCart.cost.discountAmount.amount}
                          currencyCode={currentCart.cost.discountAmount.currencyCode}
                        />
                      </div>
                    </div>
                    {currentCart.codes.length > 0 && (
                      <div className="relative mt-4 flex flex-wrap items-center justify-start gap-4">
                        {currentCart.codes.map((code) => (
                          <span
                            key={code}
                            className="flex items-center gap-2 rounded bg-umb-pink p-2 text-base text-black"
                          >
                            <span>{code}</span> <RemoveCouponButton code={code} />
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              <div className="flex justify-between border-b border-umb-gray p-4 text-lg lg:p-8 lg:text-xl">
                <div className="font-bold">Taxes</div>
                <div>
                  <Price
                    amount={currentCart.cost.totalTaxAmount.amount}
                    currencyCode={currentCart.cost.totalTaxAmount.currencyCode}
                  />
                </div>
              </div>
              <div className="flex justify-between p-4 text-lg text-umb-blue lg:p-8 lg:text-xl">
                <div className="font-bold">Total</div>
                <div className="font-bold">
                  <Price
                    amount={currentCart.cost.totalAmount.amount}
                    currencyCode={currentCart.cost.totalAmount.currencyCode}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="mb-2 text-lg font-bold">I have a coupon code</h2>
            <ApplyCouponForm />
          </div>
        </>
      </CheckoutStepForm>
    )
  );
}
