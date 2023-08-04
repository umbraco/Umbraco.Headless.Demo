import clsx from 'clsx';
import QuickAddToCart from 'components/cart/quick-add-to-cart';
import Price from 'components/price';
import { Product } from 'lib/umbraco/types';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductGridTile({
  product,
  labels,
  ...props
}: {
  product: Product,
  labels?: {
    title: string;
    amount: string;
    currencyCode: string;
    isSmall?: boolean;
  };
} & React.ComponentProps<'article'>) {
  return (
    <article className='relative w-full h-full group flex flex-col'>
        <div className={clsx('block relative rounded-lg',
          `bg-umb-${product.bgColor || 'pink'}`)}>
            {product.featuredImage && 
              <picture className="block relative aspect-square pointer-events-none overflow-hidden">
                <Image className="w-full h-full object-cover transition-transform scale-100 group-hover:scale-110" 
                  src={product.featuredImage?.url}
                  alt={product.title}
                  width="800"
                  height="800" /> 
              </picture>
            }
        </div>
        <div className='mt-8 flex-1'>
            <h2 className="text-umb-blue font-bold text-4xl capitalize">
                <Link href={`/product/${product.handle}`} className='block whitespace-nowrap overflow-hidden text-ellipsis before:absolute before:inset-0'>{product.title}</Link>
            </h2>	
            <div className="mt-4">
                <Price className='text-umb-blue font-bold text-2xl' 
                  amount={product.priceRange.minVariantPrice.amount} 
                  currencyCode={product.priceRange.minVariantPrice.currencyCode}
                  prefix={product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount ? 'From' : ''}></Price>
            </div>		
            {product.description && <p className="mt-4 text-lg">{product.description}</p>}
        </div>
        <div className="mt-8 grid grid-cols-3 gap-4">
            <QuickAddToCart product={product} />
            <span className="btn btn-lg btn-outline text-umb-blue border-umb-blue">More</span>
        </div>
    </article>
  );
}
