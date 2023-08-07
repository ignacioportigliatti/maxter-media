/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
        // Agrega tus configuraciones personalizadas de webpack aquí
        config.plugins.push(
          new webpack.DefinePlugin({
            'process.env.FLUENTFFMPEG_COV': false
          })
        );
    
        // Devuelve la configuración modificada
        return config;
      },
    experimental: {
        serverActions: true,
        serverComponentsExternalPackages: ['@prisma/client', 'bcrypt', 'node-cache'],
    },
    images: {
        domains: ['localhost', 'storage.googleapis.com', 'www.googleapis.com', 'via.placeholder.com', "maxter-media.s3.us-central-1.wasabisys.com"],
    },
}

module.exports = nextConfig
