'use client';

import clsx from 'clsx';
import { ReactNode } from 'react';
import Aside from './aside';

export default async function BaseLayout({
  children,
  asideStyle = 'NARROW',
  aside,
  foot,
  className
}: {
  children?: ReactNode;
  asideStyle: 'NARROW' | 'WIDE';
  aside?: ReactNode;
  foot?: ReactNode;
  className?: string;
}) {
  return (
    <>
      <div
        className={clsx(
          'flex min-h-screen flex-col flex-wrap items-stretch justify-start lg:grid lg:grid-rows-1 lg:gap-x-0 ',
          asideStyle === 'WIDE' ? 'lg:grid-cols-2' : 'lg:grid-cols-3 2xl:grid-cols-4',
          className
        )}
      >
        <Aside className={clsx(asideStyle === 'WIDE' && 'min-h-[50vh]')}>{aside}</Aside>
        <main
          className={clsx(
            'flex w-full flex-1 flex-col',
            asideStyle !== 'WIDE' && 'sm:col-span-2 2xl:col-span-3'
          )}
        >
          {children}
        </main>
      </div>
      {foot}
    </>
  );
}
