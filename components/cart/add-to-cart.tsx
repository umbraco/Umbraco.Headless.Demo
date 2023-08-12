'use client';

import Price from 'components/price';
import ProductVariantsPicker from 'components/product/product-variants-picker';
import StockNotificationForm from 'components/product/stock-notification-form';
import { Product, ProductVariant } from 'lib/umbraco/types';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AddToCartButton } from './add-to-cart-button';

export default function AddToCart({ product }: { product: Product }) {
  const isMultiVariant = product.variants.length > 1;
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    !isMultiVariant ? product.variants[0] : undefined
  );
  const [priceElement, setPriceElement] = useState<HTMLElement>();

  useEffect(() => {
    if (selectedVariant && !priceElement) {
      const el = document.getElementById('product-price')!;
      el.innerHTML = '';
      setPriceElement(el);
    }
  }, [selectedVariant]);

  return (
    <>
      <ProductVariantsPicker
        size="large"
        options={product.options}
        variants={product.variants}
        onSelect={setSelectedVariant}
      />
      {(!selectedVariant || selectedVariant.availableForSale) && (<AddToCartButton className="mt-8 w-full" variant={selectedVariant} />)}
      {(selectedVariant && !selectedVariant.availableForSale) && (<StockNotificationForm  className="mt-8 w-full" variant={selectedVariant} />)}
      {priceElement &&
        selectedVariant &&
        createPortal(
          <Price
            className="mb-8 text-3xl font-bold text-umb-blue"
            amount={selectedVariant.price.amount}
            currencyCode={selectedVariant.price.currencyCode}
          ></Price>,
          priceElement
        )}
    </>
  );
}
