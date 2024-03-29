/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {

    return [

      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
        },
        {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
        },
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  },
  crossOrigin: 'anonymous',
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt', 'node-cache', 'fluent-ffmpeg', 'fs', 'path'],
  },
  images: {
    domains: ['localhost', 'storage.googleapis.com', 'www.googleapis.com', 'via.placeholder.com', "maxter-media.s3.us-central-1.wasabisys.com"],
  },
}

module.exports = nextConfig
