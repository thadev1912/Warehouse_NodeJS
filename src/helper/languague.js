const i18n = require('i18n');

i18n.configure({
    locales: ['en', 'vi'], 
    directory: __dirname + '/language', 
    defaultLocale: 'vi',
    objectNotation: true, 
});
module.exports = i18n;
