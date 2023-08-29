import { getPages, getProducts } from 'lib/umbraco';
import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

export default async function sitemap(): Promise<Promise<Promise<MetadataRoute.Sitemap>>> {
  const routesMap = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString()
  }));

  const productsPromise = getProducts({}).then((products) =>
    products.map((product) => ({
      url: `${baseUrl}/product/${product.handle}`,
      lastModified: product.updatedAt
    }))
  );

  const pagesPromise = getPages().then((pages) =>
    pages.map((page) => ({
      url: `${baseUrl}/${page.handle}`,
      lastModified: page.updatedAt
    }))
  );

  const fetchedRoutes = (await Promise.all([productsPromise, pagesPromise])).flat();

  return [...routesMap, ...fetchedRoutes];
}