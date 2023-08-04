[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fcommerce&project-name=commerce&repo-name=commerce&demo-title=Next.js%20Commerce&demo-url=https%3A%2F%2Fdemo.vercel.store&demo-image=https%3A%2F%2Fbigcommerce-demo-asset-ksvtgfvnd.vercel.app%2Fbigcommerce.png&env=SHOPIFY_REVALIDATION_SECRET,SHOPIFY_STOREFRONT_ACCESS_TOKEN,SHOPIFY_STORE_DOMAIN,SITE_NAME,TWITTER_CREATOR,TWITTER_SITE)

# Umbraco Headless Demo Store

The Umbraco Headless Demo Store is a Next.js 13 and App Router-ready ecommerce demo, built to showcase real world example usage of all of Umbraco's headless capabilities, featuring:

- Next.js App Router
- Optimized for SEO using Next.js's Metadata
- React Server Components (RSCs) and Suspense
- Server Actions for mutations
- Edge Runtime
- New fetching and caching paradigms
- Dynamic OG images
- Styling with Tailwind CSS
- Checkout and payments via Umbraco Commerce Storefront API
- Product data via Umbraco Delivery API

## Getting started

This demo store is in two parts, the Umbraco back end and this, the Next.js front end. You will need both parts in order to be run this demo.

## Setting up Umbraco

View the README in the Umbraco back end project for details on setting up Umbraco.

## Setting up Next.js

You will need to use the environment variables [defined in `.env.example`](.env.example) to run this project. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control your store.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

## Running Next.js locally

```bash
npm install
npm dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).
