import CartContextProvider from 'components/cart-context';
import { Lato } from 'next/font/google';
import { ReactNode, Suspense } from 'react';

import './globals.css';

const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME } = process.env;

export const metadata = {
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  },
  ...(TWITTER_CREATOR &&
    TWITTER_SITE && {
      twitter: {
        card: 'summary_large_image',
        creator: TWITTER_CREATOR,
        site: TWITTER_SITE
      }
    })
};

const lato = Lato({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-lato'
});

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={lato.variable}>
      <body>
        <CartContextProvider>
          <Suspense>{children}</Suspense>
        </CartContextProvider>
      </body>
    </html>
  );
}
