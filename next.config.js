const { i18n } = require('./next-i18next.config');
const withTM = require('next-transpile-modules')(['sharp', 'canvas']);

const nextConfig = {
  images: {
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
};

module.exports = withTM({
  ...nextConfig,
  i18n,
});
