/** @type {import('next').NextConfig} */

const umbracoBaseUrl = new URL(process.env.UMBRACO_BASE_URL);

module.exports = {
  eslint: {
    // Disabling on production builds because we're running checks on PRs via GitHub Actions.
    ignoreDuringBuilds: true
  },
  experimental: {
    serverActions: true
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: umbracoBaseUrl.protocol.replace(':', ''),
        hostname: umbracoBaseUrl.hostname,
        port: umbracoBaseUrl.port,
        pathname: '/media/**'
      }
    ]
  }
};
