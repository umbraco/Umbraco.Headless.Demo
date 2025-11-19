import { getPages, getProducts } from 'lib/umbraco';
import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Root route
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date().toISOString()
    }
  ];

  // Products
  const products = await getProducts({});
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/product/${product.handle}`,
    lastModified:
      typeof product.updatedAt === 'string'
        ? product.updatedAt
        : new Date(product.updatedAt).toISOString()
  }));

  // Pages
  const pages = await getPages();
  const pageRoutes = pages.map((page) => ({
    url: `${baseUrl}/${page.handle}`,
    lastModified:
      typeof page.updatedAt === 'string' ? page.updatedAt : new Date(page.updatedAt).toISOString()
  }));

  return [...staticRoutes, ...productRoutes, ...pageRoutes];
}
