const { i18n } = require('./next-i18next.config');

const nextConfig = {
  images: {
     domains: [
      'googleusercontent.com',
      'linklist-files.s3.amazonaws.com',
      'momofriends.com',
      'fizz.link',
      '9057fd132931df3b08aa7529889a637f.r2.cloudflarestorage.com',
      'k.kakaocdn.net',
    ],
    remotePatterns: [
      {
        hostname: '*.googleusercontent.com',
      },
      {
        hostname: 'linklist-files.s3.amazonaws.com',
      },
      {
        hostname: '*.momofriends.com',
      },
      {
        hostname: '*.fizz.link',
      },
      {
        hostname: '9057fd132931df3b08aa7529889a637f.r2.cloudflarestorage.com',
      },
      {
        hostname: 'k.kakaocdn.net',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: require.resolve('browserify-fs'),
        path: require.resolve('path-browserify'),
        crypto: require.resolve('crypto-browserify'),
      };
    }
    return config;
  },
};

module.exports = {
  ...nextConfig,
  i18n,
};
