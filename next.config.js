/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
        serverComponentsExternalPackages: ['@prisma/client', 'bcrypt', 'node-cache'],
    },
    images: {
        domains: ['localhost', 'storage.googleapis.com', 'www.googleapis.com', 'via.placeholder.com'],
    },
}

module.exports = nextConfig
