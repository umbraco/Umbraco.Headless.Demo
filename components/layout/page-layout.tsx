import { ReactNode } from 'react';
import MainNav from './main-nav';

import CartModal from 'components/cart/cart-modal';
import Footer from 'components/layout/footer';
import MobileNav from 'components/layout/mobile-nav';
import { getMenu } from 'lib/umbraco';
import BaseLayout from './base-layout';

export default async function PageLayout({
  children,
  asideStyle = 'NARROW',
  aside
}: {
  children?: ReactNode;
  asideStyle: 'NARROW' | 'WIDE';
  aside?: ReactNode;
}) {
  const headerMenu = await getMenu('header');
  const footerMenu = await getMenu('footer');

  return (
    <BaseLayout
      asideStyle={asideStyle}
      aside={aside}
      foot={
        <>
          <CartModal />
          <Footer menu={footerMenu} />
          <MobileNav menu={headerMenu} />
        </>
      }
    >
      <div className="p-8 lg:p-14">
        <MainNav menu={headerMenu} />
        {children}
      </div>
    </BaseLayout>
  );
}
