/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['undici']
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /node_modules.*\.m?js$/,
      resolve: {
        fullySpecified: false,
      }
    });
    return config;
  }
}

module.exports = nextConfig
