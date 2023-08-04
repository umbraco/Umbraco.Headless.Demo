import Link from 'next/link';

import FacebookIcon from 'components/icons/facebook';
import InstagramIcon from 'components/icons/instagram';
import TwitterIcon from 'components/icons/twitter';
import UmbracoLogo from 'components/umbraco-logo-vertical';
import { Menu } from 'lib/umbraco/types';
import FooterNav from './footer-nav';

export default async function Footer({ menu }: { menu?: Menu[] }) {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');

  return (
    <footer className="bg-umb-gray px-8 py-14 lg:py-32">
      <div className="flex w-full flex-col gap-8 transition-colors duration-150 lg:flex-row lg:gap-14">
        <div className="flex-1 text-center">
          <Link href="https:umbraco.com" target="_blank">
            <UmbracoLogo className="mb-14 inline-block h-36 max-w-full fill-umb-blue lg:mb-0" />
          </Link>
        </div>

        <div className="text-center lg:w-[40vw] lg:text-left">
          <h3 className="mb-8 text-4xl font-bold text-umb-blue-dark">{process.env.SITE_NAME} 🦄</h3>
          <p className="prose max-w-full text-lg">
            The Umbraco Headless Demo store is designed to showcase the capabilities of Umbraco's
            various headless products in a real world scenario. By showing them in as close to a
            real world example as possible we see just how well they work together and how you might
            go about using the API's in your own projects.
          </p>
        </div>

        <div className="flex-1 text-center">
          <FooterNav menu={menu} />
        </div>
      </div>

      <div className="mt-24 text-center text-lg md:flex-row">
        <div className="mb-8 inline-flex gap-4">
          <a href="https://instagram.com/umbraco" target="_blank" className="c-footer__social">
            <InstagramIcon className="h-10 w-10" />
          </a>
          <a href="https://facebook.com/umbraco" target="_blank" className="c-footer__social">
            <FacebookIcon className="h-10 w-10" />
          </a>
          <a href="https://twitter.com/umbraco" target="_blank" className="c-footer__social">
            <TwitterIcon className="h-10 w-10" />
          </a>
        </div>

        <p>
          &copy; {copyrightDate} Umbraco. All rights reserved. Site design by{' '}
          <a href="https://www.perplex.nl/" target="_blank" className="hover:underline">
            Perplex
          </a>
        </p>
      </div>
    </footer>
  );
}
