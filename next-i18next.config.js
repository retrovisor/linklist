const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'kr'],
    localeDetection: false,
  },
  localePath: path.resolve('./public/locales'),
};
