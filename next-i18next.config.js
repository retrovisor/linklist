const path = require('path'); // Import the path module

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'kr'],
    localeDetection: false,
  },
  localePath: path.resolve('./public/locales'), // Use path module here
};
