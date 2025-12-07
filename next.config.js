/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Turbopack is now the default in Next.js 16
  turbopack: {},
  webpack: (config, { isServer }) => {
    // Ignore punycode warning
    config.ignoreWarnings = [
      { module: /node_modules\/punycode/ },
    ]
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jjilijsqunjqmyrzlkhs.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

module.exports = nextConfig