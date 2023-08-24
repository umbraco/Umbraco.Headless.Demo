import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Grid from 'components/grid';
import Headline from 'components/layout/headline';
import PageLayout from 'components/layout/page-layout';
import FilterModal from 'components/product/filter-modal';
import ProductGridTile from 'components/product/product-grid-tile';

import { defaultSort, sorting } from 'lib/constants';
import { getProductTags, getProducts } from 'lib/umbraco';
import { Product } from 'lib/umbraco/types';

export const runtime = 'edge';

export const metadata = {
  title: process.env.SITE_NAME,
  description:
    "A high-performance ecommerce store built to showcase Umbraco's headless capabilities.",
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: searchTerm, tag: tags } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({
    sortKey,
    reverse,
    query: searchTerm,
    tags: tags?.split(',') || []
  });
  const productTags = await getProductTags();

  return (
    <PageLayout
      asideStyle={'NARROW'}
      aside={
        <Headline
          title="Umbraco Headless Demo"
          description="With this demo store you are sure to loose your head over all the umbmazing headless features we have on offer 😉"
        />
      }
    >
      {products.length > 0 ? (
        <Grid>
          {products.map((product: Product) => (
            <Grid.Item key={product.id}>
              <ProductGridTile product={product} />
            </Grid.Item>
          ))}
        </Grid>
      ) : (
        <div className="flex h-full min-h-[300px] w-full items-center justify-center lg:-mt-20 ">
          <div>
            <MagnifyingGlassIcon className="mx-auto mb-4 h-20 stroke-2 text-gray-300" />
            <h1 className="text-4xl font-bold text-gray-300">No results found</h1>
            <p className="text-xl text-gray-300">Try changing your filter criteria</p>
          </div>
        </div>
      )}
      <FilterModal tags={productTags} />
    </PageLayout>
  );
}
