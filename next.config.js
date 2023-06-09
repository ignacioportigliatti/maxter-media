/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
        serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
    },
    images: {
        domains: ['localhost', 'storage.googleapis.com', 'www.googleapis.com'],
    },
}

module.exports = nextConfig
