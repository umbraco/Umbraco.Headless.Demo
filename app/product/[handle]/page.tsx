import AddToCart from 'components/cart/add-to-cart';
import DeliveryIcon from 'components/icons/delivery';
import PaymentIcon from 'components/icons/payment';
import ShippingIcon from 'components/icons/shipping';
import PageLayout from 'components/layout/page-layout';
import Price from 'components/price';
import Carousel from 'components/product/carousel';
import Prose from 'components/prose';
import Link from 'next/link';

import { getProduct } from 'lib/umbraco';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export const runtime = 'edge';

export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: !product.isHidden,
      follow: !product.isHidden,
      googleBot: {
        index: !product.isHidden,
        follow: !product.isHidden
      }
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt
            }
          ]
        }
      : null
  };
}

export default async function ProductPage({ 
  params 
}: { 
  params: { handle: string } 
}) {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount
    }
  };

  return (
    <PageLayout asideStyle={'WIDE'} aside={
      <Carousel className={`bg-umb-${product.bgColor || 'pink'}`} images={product.images}></Carousel>
    }>
      <div>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(productJsonLd)
            }}
        />
        <div>
            <Link href='/' className='inline-block opacity-60 text-lg underline mb-2'>Back to products</Link>
            <h1 className="mb-2 text-5xl font-bold">{product.title}</h1>
            <div id="product-price">
              <Price className='mb-8 text-3xl font-bold text-umb-blue' 
                    amount={product.priceRange.minVariantPrice.amount} 
                    currencyCode={product.priceRange.minVariantPrice.currencyCode}
                    prefix={product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount ? 'From' : ''}></Price>
            </div>
        </div>

        <Prose className="mb-8 max-w-full" html={product.descriptionHtml} />

        <AddToCart product={product} />

        <div className="mt-14 grid grid-cols-3 gap-8 text-center">
            <div className="c-product__usp l-item">
                <DeliveryIcon className='w-14 h-14 mx-auto' />
                <div className="text-sm mt-4 lg:text-base">Free shipping from 75 euros</div>
            </div>
            <div className="c-product__usp l-item">
                <PaymentIcon  className='w-14 h-14 mx-auto' />
                <div className="text-sm mt-4 lg:text-base">Pay with credit card or PayPal</div>
            </div>
            <div className="">
                <ShippingIcon  className='w-14 h-14 mx-auto' />
                <div className="text-sm mt-4 lg:text-base">Delivered within 3-5 working days</div>
            </div>
        </div>

      </div>
    </PageLayout>
  );
}
