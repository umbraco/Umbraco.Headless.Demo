import clsx from 'clsx';
import Price from 'components/price';
import { Money } from 'lib/umbraco/types';

export default function CheckoutRadioOption({
  title,
  price,
  checked,
  placeholder
}: {
  title?: string;
  price?: Money;
  checked?: boolean;
  placeholder?: boolean;
}) {
  return (
    <div
      className={clsx(
        'relative flex cursor-pointer items-center justify-start gap-4 rounded border-2 bg-white p-4 lg:p-8',
        {
          'border-umb-blue': checked && !placeholder,
          'border-white': !checked && !placeholder,
          'animate-pulse border-gray-300': placeholder
        }
      )}
    >
      <span
        className={clsx(
          'flex h-6 w-6 items-center justify-center rounded-full border-2',
          checked ? 'border-umb-blue' : 'border-gray-300',
          placeholder ? 'bg-gray-300' : ''
        )}
      >
        <span
          className={clsx('block h-3 w-3 rounded-full ', checked ? 'bg-umb-blue' : 'transparent')}
        ></span>
      </span>
      <span className={'flex-1 text-lg font-bold lg:text-xl'}>
        <span className={clsx(placeholder ? 'bg-gray-300 text-gray-300' : '')}>
          {title || 'Content loading...'}
        </span>
      </span>
      <span>
        {price ? (
          <Price
            className="whitespace-nowrap text-lg font-bold lg:text-xl"
            amount={price.amount}
            currencyCode={price.currencyCode}
          />
        ) : (
          <span className={clsx(placeholder ? 'bg-gray-300 text-gray-300' : '')}>0.0000</span>
        )}
      </span>
    </div>
  );
}
