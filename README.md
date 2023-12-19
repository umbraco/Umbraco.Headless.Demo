# Umbraco Headless Demo - Backend

This branch represents the backend of the [Umbraco Headless Demo](https://github.com/umbraco/Umbraco.Headless.Demo) and consists of an Umbraco v13 application fully configured with following features:

- Umbraco v13 + Umbraco Content Delivery API v1
- Umbraco Commerce v13 + Umbraco Commerce Storefront API v1
- Content Delivery API ready Value Converters for Umbraco Commerce property editors
- Custom Umbraco Content Delivery API filters / sort criteria
- Stripe Payment Provider integration (Inline and Redirects)
- Populated product catalog
- Dynamic Menu system
- Content manageable pages

## System Requirements

See [Umbraco v13 system requirements](https://docs.umbraco.com/umbraco-cms/fundamentals/setup/requirements).

## Configuration

See the Umbraco docs for [configuring the Content Delivery API](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api) and [configuring the Umbraco Commerce Storefront API](https://docs.umbraco.com/umbraco-commerce/reference/storefront-api). These have already been configured in this solution however, but you'll likely want to change the API Keys for both entries.

An addition, there is a custom `Vercel` section in `appsettings.json` file where you'll want to set the `SiteUrl` to the public URL of the frontend project, and a `RevalidationSecret` which should be updated both here and in the frontend project.

## Getting Started

Clone or download this branch locally (it includes all the files you will need including a fully configured SQLlite database)

````
git clone --branch backend/main https://github.com/umbraco/Umbraco.Headless.Demo.git backend
````

Once you have all the files downloaded you can open the `Umbraco.Headless.Demo.sln` solution file in the root of the repository in Visual Studio. Make sure the `Umbraco.Headless.Demo.Web` project is the startup project by right clicking the project in the Solution Explorer and choosing `Set as StartUp Project`, and then press `Ctrl + F5` to launch the site.

To login to the back office you can do so using the credentails:

* **Email** admin@example.com
* **Password** password1234

## Deploying

This project can be deployed just like a regular Umbraco install. The process will be completely dependent on the infrastructure you wish to deploy to. See the [Umbraco docs](https://docs.umbraco.com/umbraco-cms/fundamentals/setup/server-setup) for some common approaches.

## License

Copyright © 2023 Umbraco A/S

This demo store is [licensed under MIT](LICENSE.md). The core Umbraco products are licensed under Umbraco's commercial license.

