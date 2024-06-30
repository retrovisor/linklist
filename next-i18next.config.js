const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'kr'],
    localeDetection: false,
  },
  localePath: typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/locales',
};
