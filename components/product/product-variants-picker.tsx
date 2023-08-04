'use client';

import clsx from 'clsx';

import TagButton from 'components/tag-button';
import { ProductOption, ProductVariant } from 'lib/umbraco/types';
import { createUrl } from 'lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type ParamsMap = {
  [key: string]: string;
};

type OptimizedVariant = {
  id: string;
  availableForSale: boolean;
  params: URLSearchParams;
  isDefault: boolean;
};

export default function ProductVariantsPicker({
  size = 'small',
  options,
  variants,
  onSelect,
  syncQuerystring,
  className
}: {
  size: 'small' | 'large';
  options: ProductOption[];
  variants: ProductVariant[];
  onSelect?: (selected: ProductVariant) => void;
  syncQuerystring?: boolean;
  className?: string;
}) {
  const pathname = usePathname();
  const currentParams = useSearchParams();
  const router = useRouter();

  const isSmall = size === 'small';

  // Return early if there is only one available purchaseable option
  const hasNoOptionsOrJustOneOption =
    !options.length || (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  // Discard any unexpected options or values from url and create params map.
  const paramsMap: ParamsMap = Object.fromEntries(
    Array.from(currentParams.entries()).filter(([key, value]) =>
      options.find(
        (option) => option.name.toLowerCase() === key && option.values.find((x) => x.alias == value)
      )
    )
  );

  // Create an optimized collection of variants for easier lookups
  const optimizedVariants: OptimizedVariant[] = variants.map((variant) => {
    const optimized: OptimizedVariant = {
      id: variant.id,
      availableForSale: variant.availableForSale,
      params: new URLSearchParams(),
      isDefault: variant.isDefault
    };

    variant.selectedOptions.forEach((selectedOption) => {
      const alias = selectedOption.alias.toLowerCase();
      const value = selectedOption.value;
      optimized.params.set(alias, value);
    });

    return optimized;
  });

  // Locate the initial variant to display, either a variant with the `isDefault` property set
  // or the first item that is available for sale. If we are syncing with the querystring then
  // override the value with whatever is in the querystring
  let initVariant =
    optimizedVariants.find((variant) => variant.isDefault && variant.availableForSale) ||
    optimizedVariants.find((variant) => variant.availableForSale);

  if (syncQuerystring) {
    initVariant =
      optimizedVariants.find(
        (variant) =>
          variant.availableForSale &&
          Object.entries(paramsMap).every(([key, value]) => variant.params.get(key) === value)
      ) || initVariant;
  }

  const [selectedVariantParams, setSelectedVariantParams] = useState(
    new URLSearchParams(initVariant?.params)
  );

  // If we are syncing the querystring then sync to the initially selected value
  if (syncQuerystring) {
    const currentUrl = createUrl(pathname, currentParams);
    const selectedVariantUrl = createUrl(pathname, selectedVariantParams);

    if (currentUrl !== selectedVariantUrl) {
      router.replace(selectedVariantUrl);
    }
  }

  // Watch for changes in the selected variant params and update accordingly
  useEffect(() => {
    // If we have a callback, locate the selected variant and return it
    if (onSelect) {
      const variant = variants.find((variant: ProductVariant) =>
        variant.selectedOptions.every(
          (option) => option.value === selectedVariantParams.get(option.alias)
        )
      );
      if (variant) {
        onSelect(variant);
      }
    }

    // If we are syncing to the querystring then just update the route path
    if (syncQuerystring) {
      if (onSelect) {
        router.replace(createUrl(pathname, selectedVariantParams));
      } else {
        router.push(createUrl(pathname, selectedVariantParams));
      }
    }
  }, [selectedVariantParams, variants]);

  return (
    <div className={className}>
      {options.map((option) => (
        <div key={option.alias} className={clsx('text-base first:mt-0', isSmall ? 'mt-4' : 'mt-8')}>
          <h5 className={clsx('mb-2 font-bold', isSmall ? 'text-md' : 'text-lg')}>{option.name}</h5>
          <div className="flex w-full flex-wrap items-center gap-4">
            {option.values.map((value) => {
              // Base option params on selected variant params.
              const optionParams = new URLSearchParams(selectedVariantParams);

              // Update the params using the current option to reflect how the url would change.
              optionParams.set(option.alias, value.alias);

              // The option is active if it in the url params.
              const isActive = selectedVariantParams.get(option.alias) === value.alias;

              // The option is available for sale if it fully matches the variant in the option's url params.
              // It's super important to note that this is the options params, *not* the selected variant's params.
              // This is the "magic" that will cross check possible future variant combinations and preemptively
              // disable combinations that are not possible.
              const isAvailableForSale = optimizedVariants.find((a) =>
                Array.from(optionParams.entries()).every(
                  ([key, value]) => a.params.get(key) === value
                )
              )?.availableForSale;

              return (
                <TagButton
                  key={`${option.alias}_${value.alias}`}
                  size={size}
                  selected={isActive && isAvailableForSale}
                  disabled={!isAvailableForSale}
                  onClick={() =>
                    !isActive && isAvailableForSale && setSelectedVariantParams(optionParams)
                  }
                >
                  <span>{value.name}</span>
                </TagButton>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
