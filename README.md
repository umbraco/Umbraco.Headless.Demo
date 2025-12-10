# Umbraco Headless Demo - Backend
This branch represents the backend of the [Umbraco Headless Demo](https://github.com/umbraco/Umbraco.Headless.Demo) and consists of an Umbraco v14 application fully configured with following features:
- Umbraco v14 + Umbraco Content Delivery API
- Umbraco Commerce v14 + Umbraco Commerce Storefront API
- Content Delivery API ready Value Converters for Umbraco Commerce property editors
- Custom Umbraco Content Delivery API filters / sort criteria
- Stripe Payment Provider integration (Inline and Redirects)
- Populated product catalog
- Dynamic Menu system
- Content manageable pages

**Demo site**: https://admin.headless-demo.umbraco.com/

## System Requirements

See [Umbraco v14 system requirements](https://docs.umbraco.com/umbraco-cms/fundamentals/setup/requirements).

## Configuration

See the Umbraco docs for [configuring the Content Delivery API](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api) and [configuring the Umbraco Commerce Storefront API](https://docs.umbraco.com/umbraco-commerce/reference/storefront-api). These have already been configured in this solution however, but you'll likely want to change the API Keys for both entries.

An addition, there is a custom `Vercel` section in `appsettings.json` file where you'll want to set the `SiteUrl` to the public URL of the frontend project, and a `RevalidationSecret` which should be updated both here and in the frontend project.

## Getting Started Locally

Clone or download this branch locally (it includes all the files you will need including a fully configured SQLlite database and a SQL Server database .bacpac file)

````
git clone --branch backend/main https://github.com/umbraco/Umbraco.Headless.Demo.git backend
````

Once you have all the files downloaded you can open the `Umbraco.Headless.Demo.sln` solution file in the root of the repository in Visual Studio. Make sure the `Umbraco.Headless.Demo.Web` project is the startup project by right clicking the project in the Solution Explorer and choosing `Set as StartUp Project`, and then press `Ctrl + F5` to launch the site **using SQLite database**. If you want to use SQL Server, see next section.

To login to the back office you can do so using the credentails:

* **Email** admin@example.com
* **Password** password1234

### Using SQL Server database backup
If you want to try out the sql server database, you can find the db file at `/src/Umbraco.Headless.Demo.Web/umbraco/Data/HeadlessDemoStore_v14.0.0.bacpac`.

After import that database file, go to `/src/Umbraco.Headless.Demo.Web/appsettings.json` to update `ConnectionStrings` section like this:
```json
{
    "ConnectionStrings": {
        "umbracoDbDSN": "YOUR_CONNECTION_STRING",
        "umbracoDbDSN_ProviderName": "Microsoft.Data.SqlClient" // tell the server to use Sql Server client
    }
}
```

## Deploying

This project can be deployed just like a regular Umbraco install. The process will be completely dependent on the infrastructure you wish to deploy to. See the [Umbraco docs](https://docs.umbraco.com/umbraco-cms/fundamentals/setup/server-setup) for some common approaches.

## License

Copyright © 2023 Umbraco A/S

This demo store is [licensed under MIT](LICENSE.md). The core Umbraco products are licensed under Umbraco's commercial license.

