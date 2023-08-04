import clsx from 'clsx';
import Link from 'next/link';

export default function CheckoutStepLink({
  title,
  href,
  state,
  className
}: {
  title: string;
  href: string;
  state: 'incomplete' | 'active' | 'complete';
  className?: string;
}) {
  const countCss =
    'before:hidden md:before:flex before:items-center before:justify-center before:text-xs before:w-5 before:h-5 before:rounded-full before:mr-2 before:transition-colors md:before:w-7 md:before:h-7 md:before:text-sm lg:before:text-base';
  const slashCss =
    "after:text-gray-300 after:content-['>'] after:mx-2 last:after:hidden md:after:hidden";
  const sharedCss =
    'checkout-step-count text-lg font-bold flex items-center justify-start transition-colors';

  return state === 'complete' ? (
    <Link
      href={href}
      className={clsx(
        countCss,
        slashCss,
        sharedCss,
        'text-umb-green before:bg-umb-green before:text-white hover:text-umb-green-active hover:before:bg-umb-green-active',
        className
      )}
    >
      {title}
    </Link>
  ) : (
    <span
      className={clsx(
        countCss,
        slashCss,
        sharedCss,
        {
          'text-gray-500 before:bg-white before:text-gray-500': state === 'incomplete',
          'before:bg-umb-blue before:text-white': state === 'active'
        },
        className
      )}
    >
      {title}
    </span>
  );
}
