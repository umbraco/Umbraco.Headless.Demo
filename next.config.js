/** @type {import('next').NextConfig} */
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
        protocol: 'https',
        hostname: 'localhost',
        port: '44381',
        pathname: '/media/**'
      },
      {
        protocol: 'https',
        hostname: 'umbraco-headless-demo.azurewebsites.net',
        port: '',
        pathname: '/media/**'
      }
    ]
  }
};
