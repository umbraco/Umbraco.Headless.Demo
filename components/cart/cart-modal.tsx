'use client';

import { Dialog, Transition } from '@headlessui/react';
import { ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { CartContext } from 'components/cart-context';
import LogoIcon from 'components/icons/logo';
import Price from 'components/price';
import { DEFAULT_OPTION } from 'lib/constants';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import DeleteItemButton from './delete-item-button';
import EditItemQuantityInput from './edit-item-quantity-input';

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const { currentCart } = useContext(CartContext);

  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(currentCart?.totalQuantity);

  useEffect(() => {
    // Open cart modal when when quantity changes.
    if (currentCart?.totalQuantity !== quantityRef.current) {
      // But only if it's not already open (quantity also changes when editing items in cart).
      if (!isOpen) {
        setIsOpen(true);
      }
      // Always update the quantity reference
      quantityRef.current = currentCart?.totalQuantity;
    }
  }, [isOpen, currentCart?.totalQuantity, quantityRef]);

  return (
    <>
      <button
        className="fixed bottom-4 right-4 z-20 flex h-20 w-20 items-center justify-center rounded-full bg-umb-green transition-colors hover:bg-umb-green-active lg:bottom-8 lg:right-8 lg:h-24 lg:w-24 "
        aria-label="Open cart"
        onClick={() => setIsOpen(true)}
      >
        <LogoIcon className="h-10 w-10 fill-white lg:h-12 lg:w-12" />
        {quantityRef.current ? (
          <span className="absolute right-0 top-0 aspect-square h-7 rounded-full bg-umb-blue-dark text-center text-sm font-bold leading-7 text-white lg:h-8 lg:leading-8">
            {quantityRef.current}
          </span>
        ) : null}
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-screen w-full flex-col bg-umb-gray text-black md:w-4/5 lg:w-3/5 xl:w-1/2">
              <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4 md:p-8">
                <Dialog.Title className="text-2xl font-bold md:text-3xl">My Cart</Dialog.Title>
                <button
                  aria-label="Close cart"
                  onClick={() => setIsOpen(false)}
                  className="text-black transition-opacity hover:opacity-50"
                >
                  <XMarkIcon className="h-10 stroke-2 md:h-12" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {!currentCart?.lines || currentCart.lines.length === 0 ? (
                  <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden text-gray-300">
                    <ShoppingBagIcon className="h-16" />
                    <p className="mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
                  </div>
                ) : (
                  <>
                    {currentCart.lines.map((item, i) => {
                      const merchandiseSearchParams = {} as MerchandiseSearchParams;

                      item.merchandise.selectedOptions.forEach(({ name, value }) => {
                        if (value !== DEFAULT_OPTION) {
                          merchandiseSearchParams[name.toLowerCase()] = value;
                        }
                      });

                      const merchandiseUrl = createUrl(
                        `/product/${item.merchandise.product.handle}`,
                        new URLSearchParams(merchandiseSearchParams)
                      );

                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-start border-b border-gray-200"
                        >
                          <div
                            className={clsx(
                              'relative aspect-square w-1/4 max-w-[200px] md:w-1/3',
                              `bg-umb-${item.merchandise.product.bgColor || 'pink'}`
                            )}
                          >
                            <Image
                              className="h-full w-full object-contain"
                              width="260"
                              height="260"
                              alt={
                                item.merchandise.product.featuredImage.altText ||
                                item.merchandise.product.title
                              }
                              src={item.merchandise.product.featuredImage.url}
                            />
                            <DeleteItemButton
                              item={item}
                              className="absolute right-2 top-2 md:right-4 md:top-4"
                            />
                          </div>
                          <div className="flex-1 px-4 md:px-8">
                            <h3 className="text-xl font-bold capitalize md:text-2xl ">
                              {item.merchandise.product.title}
                            </h3>
                            <div className="mt-2 flex w-full items-center justify-between gap-2 md:mt-4 md:gap-4">
                              <div>
                                {item.merchandise.title !== DEFAULT_OPTION ? (
                                  <div className="md:mb-1 md:text-lg">
                                    <span>{item.merchandise.title}</span>
                                  </div>
                                ) : null}
                                <Price
                                  className="text-lg font-bold text-umb-blue md:text-xl"
                                  amount={item.cost.totalAmount.amount}
                                  currencyCode={item.cost.totalAmount.currencyCode}
                                />
                              </div>
                              <div>
                                <EditItemQuantityInput item={item} />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>

              <div className="sticky bottom-0 left-0 right-0 -mt-1 border-t border-gray-200 bg-white p-4 md:p-8">
                {currentCart && currentCart.totalQuantity > 0 ? (
                  <>
                    <div className="mb-4 flex w-full flex-col gap-2 lg:mb-8 lg:text-lg">
                      <div className="flex items-center justify-between">
                        <div>Taxes</div>
                        <Price
                          amount={currentCart.cost.subtotalTaxAmount.amount}
                          currencyCode={currentCart.cost.subtotalTaxAmount.currencyCode}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>Shipping</div>
                        <div>Calculated at checkout</div>
                      </div>
                      <div className="flex items-center justify-between text-lg font-bold text-umb-blue lg:text-xl">
                        <div>Total</div>
                        <Price
                          amount={currentCart.cost.subtotalAmount.amount}
                          currencyCode={currentCart.cost.subtotalAmount.currencyCode}
                        />
                      </div>
                    </div>
                    <Link
                      href={'/checkout/order'}
                      className="btn btn-lg block w-full bg-umb-green text-white outline-umb-blue hover:bg-umb-green-active"
                    >
                      Continue to checkout
                    </Link>
                  </>
                ) : (
                  <span className="btn btn-lg block w-full cursor-not-allowed bg-umb-gray-active text-gray-400">
                    Continue to checkout
                  </span>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
