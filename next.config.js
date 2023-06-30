/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
    images: {
        domains: ['localhost', 'storage.googleapis.com', 'www.googleapis.com'],
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
          config.resolve.fallback = {
            // Soluciona el problema de resolución para el módulo 'request'
            request: require.resolve('retry-request'),
          };
        }
        return config;
      },
}

module.exports = nextConfig
