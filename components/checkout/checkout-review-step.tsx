'use client';

import { Dialog, Transition } from '@headlessui/react';
import { CheckoutStep } from 'app/checkout/steps';
import { getCart, initializeHostedCheckout } from 'components/cart-actions';
import { CartContext } from 'components/cart-context';
import LoadingDots from 'components/loading-dots';
import Price from 'components/price';
import { DEFAULT_OPTION } from 'lib/constants';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import CheckoutStepForm from './checkout-step-form';

export default function CheckoutReviewStep({
  steps,
  currentStep,
  nextStep,
  mode
}: {
  steps: CheckoutStep[];
  currentStep: CheckoutStep;
  nextStep?: CheckoutStep;
  mode?: string;
}) {
  const { currentCart, setCurrentCart } = useContext(CartContext);

  const [checkoutUrl, setCheckoutUrl] = useState<string>();
  const [paymentWindowOpen, setPaymentWindowOpen] = useState(false);

  const router = useRouter();

  const handleSubmit = () => {
    if (!currentCart) return;
    if (mode == 'Inline') {
      // Inline payment so just move to the next pay step
      router.push(`/checkout/${nextStep?.slug}`);
    } else {
      // Clear any checkout URL
      setCheckoutUrl(undefined);

      // Show payment window with loading anim?
      setPaymentWindowOpen(true);

      // Initialize the checkout
      initializeHostedCheckout().then((data) => {
        const tokenPayload = data as { token: string; payUrl: string };
        if (tokenPayload) {
          // Framed mode so launch the pay url in an iframe and monitor
          // for the payment status changes
          if (mode == 'Framed') {
            const messageHandler = (evt: MessageEvent<any>) => {
              // Messages are returned in the format UC:{orderId}:{token}:{status}
              // so we parse the sections and confirm they are for our order
              // and then proceed to handle the status
              var match = evt.data.match(/^UC:([^:]+):([^:]+):([^:]+)$/i);
              if (match && currentCart!.id == match[1] && tokenPayload.token == match[2]) {
                // Remove handler
                window.removeEventListener('message', messageHandler);

                // Close payment window
                setCheckoutUrl(undefined);

                // Refetch the updated cart from the server
                getCart(currentCart!.id, true).then((cart) => {
                  // Update the cart context (this should move the order to previousCart and clear the cartId cookie)
                  setCurrentCart(cart);

                  // Close the payment window
                  setPaymentWindowOpen(false);

                  // Redirect either to a specific step, or the first step with a querystring
                  // to be handled
                  const statusStep = steps.find((step) => step.status === match[3].toLowerCase());
                  if (statusStep) {
                    router.push(`/checkout/${statusStep.slug}`);
                  } else {
                    router.push(`/checkout/${steps[0]!.slug}?status=${match[3].toLowerCase()}`);
                  }
                });
              }
            };

            window.addEventListener('message', messageHandler);

            setCheckoutUrl(tokenPayload.payUrl);
          } else {
            // Redirect mode so just launch the URL directly
            window.location.href = tokenPayload.payUrl;
          }
        } else {
          alert(data);
        }
      });
    }
  };

  return (
    <>
      {currentCart && (
        <CheckoutStepForm
          steps={steps}
          currentStep={currentStep}
          heading="One last check"
          buttonContent={<>Make Payment</>}
          beforeButton={
            <label className="-mt-2 mb-6 flex items-center justify-center">
              <input
                type="checkbox"
                name="agreeToTerms"
                className="mr-2 rounded border-gray-300 outline-umb-blue"
                value={'1'}
                required
              />
              <span className="font-bold">I agree and accept the sites terms of service</span>
            </label>
          }
          onSubmit={handleSubmit}
        >
          <div className="relative mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 ">
            <fieldset className="mt-10">
              <legend className="mb-8 block text-xl font-bold text-gray-500">
                Billing Address
              </legend>
              <div
                className="rounded bg-white p-4 text-black lg:p-8"
                dangerouslySetInnerHTML={{
                  __html: [
                    `${currentCart.properties['firstName']} ${currentCart.properties['lastName']}`,
                    currentCart.properties['billingAddressLine1'],
                    currentCart.properties['billingAddressLine2'],
                    currentCart.properties['billingCity'],
                    `${currentCart.properties['billingZipCode']}, ${
                      currentCart.billingCountry!.code
                    }`
                  ]
                    .filter((x) => !!x)
                    .join('<br />')
                }}
              ></div>
            </fieldset>

            <fieldset className="mt-10">
              <legend className="mb-8 block text-xl font-bold text-gray-500">
                Shipping Address
              </legend>
              <div
                className="rounded bg-white p-4 text-black lg:p-8"
                dangerouslySetInnerHTML={{
                  __html: [
                    `${currentCart.properties['shippingFirstName']} ${currentCart.properties['shippingLastName']}`,
                    currentCart.properties['shippingAddressLine1'],
                    currentCart.properties['shippingAddressLine2'],
                    currentCart.properties['shippingCity'],
                    `${currentCart.properties['shippingZipCode']}, ${
                      currentCart.shippingCountry!.code
                    }`
                  ]
                    .filter((x) => !!x)
                    .join('<br />')
                }}
              ></div>
            </fieldset>

            <fieldset className="mt-10 lg:col-span-2">
              <legend className="mb-8 block text-xl font-bold text-gray-500">Your Order</legend>
              {currentCart.lines.map((item) => (
                <div
                  key={item.id}
                  className="relative flex items-center justify-start gap-4 rounded bg-white p-4 lg:p-8"
                >
                  <div className="flex-1">
                    <h5 className="text-lg font-bold lg:text-xl">
                      {item.merchandise.product.title}
                    </h5>
                    {item.merchandise.title !== DEFAULT_OPTION ? (
                      <p className="mt-1">{item.merchandise.title}</p>
                    ) : null}
                  </div>
                  <div className="min-w-[80px] text-right">
                    <Price
                      className="whitespace-nowrap text-lg font-bold lg:text-xl"
                      amount={item.cost.totalAmount.amount}
                      currencyCode={item.cost.totalAmount.currencyCode}
                    />
                  </div>
                </div>
              ))}
              <div className="mt-4 rounded bg-white ">
                <div className="flex justify-between border-b border-umb-gray p-4 text-lg lg:p-8 lg:text-xl">
                  <div className="font-bold">Subtotal</div>
                  <div>
                    <Price
                      amount={currentCart.cost.subtotalAmount.amount}
                      currencyCode={currentCart.cost.subtotalAmount.currencyCode}
                    />
                  </div>
                </div>
                <div className="flex justify-between border-b border-umb-gray p-4 lg:p-8">
                  <div className="flex-1">
                    <div className="text-lg font-bold lg:text-xl">Shipping Fee</div>
                    <p className="mt-1">
                      {currentCart.shippingMethod!.name}
                      {currentCart.shippingOption ? ` - ${currentCart.shippingOption.name}` : ''}
                    </p>
                  </div>
                  <div>
                    <Price
                      amount={currentCart.cost.shippingFeeAmount!.amount}
                      currencyCode={currentCart.cost.shippingFeeAmount!.currencyCode}
                    />
                  </div>
                </div>
                <div className="flex justify-between border-b border-umb-gray p-4 lg:p-8">
                  <div className="flex-1">
                    <div className="text-lg font-bold lg:text-xl">Payment Fee</div>
                    <p className="mt-1">{currentCart.paymentMethod!.name}</p>
                  </div>
                  <div>
                    <Price
                      amount={currentCart.cost.paymentFeeAmount!.amount}
                      currencyCode={currentCart.cost.paymentFeeAmount!.currencyCode}
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
            </fieldset>

            {currentCart.properties && currentCart.properties['comments'] && (
              <fieldset className="mt-10 lg:col-span-2">
                <legend className="mb-8 block text-xl font-bold text-gray-500">Comments</legend>
                <div className="rounded bg-white p-4 text-black lg:p-8">
                  {currentCart.properties['comments']}
                </div>
              </fieldset>
            )}
          </div>

          {mode !== 'Inline' && (
            <Transition
              show={paymentWindowOpen}
              enter="transition-all ease-in-out duration-300"
              enterFrom="opacity-0 backdrop-blur-none"
              enterTo="opacity-100 backdrop-blur-[.5px]"
              leave="transition-all ease-in-out duration-200"
              leaveFrom="opacity-100 backdrop-blur-[.5px]"
              leaveTo="opacity-0 backdrop-blur-none"
            >
              <Dialog onClose={() => {}} className="relative z-50">
                <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
                <Dialog.Panel className="fixed inset-4 flex items-center justify-center">
                  <span className="scale-[500%]">
                    <LoadingDots className="bg-white" />
                  </span>
                  {checkoutUrl && (
                    <iframe
                      src={checkoutUrl}
                      className="absolute left-0 top-0 h-full w-full"
                    ></iframe>
                  )}
                </Dialog.Panel>
              </Dialog>
            </Transition>
          )}
        </CheckoutStepForm>
      )}
    </>
  );
}
