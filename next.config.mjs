/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  // Turbopack configuration for development
  turbopack: {
    resolveAlias: {
      '@': './src',
    },
  },
  webpack: (config, { isServer }) => {
    // Ignore node-cron during build to prevent bundling issues
    config.ignoreWarnings = config.ignoreWarnings || [];
    config.ignoreWarnings.push({
      module: /node-cron/,
    });

    if (isServer) {
      // Mark node-cron and other Node.js modules as external
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : [config.externals || {}]),
        {
          'node-cron': 'node-cron',
          'uuid': 'uuid',
          'events': 'events',
          'path': 'path',
          'child_process': 'child_process',
        },
      ];
    }
    return config;
  },
  /* config options here */
};

export default nextConfig;
