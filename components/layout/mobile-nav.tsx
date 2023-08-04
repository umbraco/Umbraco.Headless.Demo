'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Menu } from 'lib/umbraco/types';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';

export default function MobileNav({ menu }: { menu?: Menu[] }) {
  if (!menu) return null;

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const openNav = () => setIsOpen(true);
  const closeNav = () => setIsOpen(false);

  // If window get resized beyond sm breakpoint then reset `isOpen`
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 640) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // If the path or querystring changes then reset `isOpen`
  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      <button
        className="absolute right-8 top-8 z-30 m-0 block h-12 w-12 p-0 sm:hidden"
        onClick={() => openNav()}
        aria-label="Open mobile menu"
      >
        <Bars3Icon className="h-12 stroke-2 text-white" />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeNav} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-screen w-full flex-col flex-wrap items-start justify-center bg-umb-blue p-8 text-black">
              <button
                className="absolute right-8 top-8 m-0 block h-12 w-12 p-0"
                onClick={() => closeNav()}
                aria-label="Close mobile menu"
              >
                <XMarkIcon className="h-12 stroke-2 text-white" />
              </button>
              <nav className="flex flex-col">
                {menu.map((itm, i) => (
                  <Link
                    key={i}
                    href={itm.path}
                    className="py-3 text-4xl font-bold text-white no-underline"
                  >
                    {itm.title}
                  </Link>
                ))}
              </nav>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
