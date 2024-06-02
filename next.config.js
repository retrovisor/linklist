/** @type {import('next').NextConfig} */
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
 i18n: {
    locales: ['en', 'ko'],
    defaultLocale: 'en',
  },
  async rewrites() {
    return [
      {
        source: '/:locale/:path*',
        destination: '/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
