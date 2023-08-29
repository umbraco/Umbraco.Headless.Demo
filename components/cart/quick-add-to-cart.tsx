'use client';

import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { CartContext } from 'components/cart-context';
import Price from 'components/price';
import Carousel from 'components/product/carousel';
import StockNotificationForm from 'components/product/stock-notification-form';
import { useMediaQuery } from 'hooks/use-media-query';
import { Product, ProductVariant } from 'lib/umbraco/types';
import { useContext, useEffect, useState } from 'react';
import ProductVariantsPicker from '../product/product-variants-picker';
import { AddToCartButton } from './add-to-cart-button';

export default function QuickAddToCart({ product }: { product: Product }) {
  const { currentCart } = useContext(CartContext);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>();

  const isMobile = useMediaQuery('only screen and (max-width : 1024px)');

  const variants = product.variants;
  const isMultiVariant = variants.length > 1;
  const availableForSale = isMultiVariant
    ? variants.some((x) => x.availableForSale)
    : product.availableForSale;

  useEffect(() => {
    setIsOpen(false);
  }, [currentCart?.totalQuantity]);

  return (
    <>
      {!isMultiVariant ? (
        <AddToCartButton className="z-10 col-span-2" variant={variants[0]} />
      ) : (
        <>
          <button
            type="button"
            className={clsx('btn btn-lg relative z-10 col-span-2 outline-umb-blue', {
              'bg-umb-blue text-white hover:bg-umb-green': availableForSale,
              'cursor-not-allowed bg-stb-15 text-gray-700 line-through': !availableForSale
            })}
            onClick={() => setIsOpen(true)}
          >
            <span>{availableForSale ? 'Add To Cart' : 'Sold Out'}</span>
          </button>

          <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-20">
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
            <Dialog.Panel className="fixed left-1/2 top-1/2 flex h-[450px] w-[90vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2 flex-col bg-white text-black">
              <button
                aria-label="Close quick buy modal"
                onClick={() => setIsOpen(false)}
                className="absolute right-0 top-0 z-20 -mr-5 -mt-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-umb-gray text-black transition-colors hover:bg-umb-gray-active"
              >
                <XMarkIcon className="h-7 stroke-2" />
              </button>
              <div className="flex h-full w-full">
                {!isMobile && (
                  <div className="relative h-full w-[350px]">
                    <Carousel className="bg-umb-pink" images={product.images}></Carousel>
                  </div>
                )}
                <div className="relative h-full w-full flex-1">
                  <div className="relative flex h-full w-full flex-col">
                    <div className="w-full px-8 pb-4 pt-8">
                      <Dialog.Title className="table w-full table-fixed text-3xl font-bold capitalize text-black">
                        <span className="table-cell overflow-hidden text-ellipsis whitespace-nowrap">
                          {product.title}
                        </span>
                      </Dialog.Title>
                      {selectedVariant && (
                        <Price
                          className="mt-2 text-xl font-bold text-umb-blue"
                          amount={selectedVariant.price.amount}
                          currencyCode={selectedVariant.price.currencyCode}
                        ></Price>
                      )}
                    </div>
                    <div className="flex-1 overflow-y-auto px-8">
                      <ProductVariantsPicker
                        size="small"
                        options={product.options}
                        variants={product.variants}
                        onSelect={setSelectedVariant}
                      />
                    </div>
                    <div className="p-8">
                      {(!selectedVariant || selectedVariant.availableForSale) && (<AddToCartButton className="w-full" variant={selectedVariant} />)}
                      {(selectedVariant && !selectedVariant.availableForSale) && (<StockNotificationForm  className="w-full" variant={selectedVariant} />)}
                    </div>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Dialog>
        </>
      )}
    </>
  );
}
