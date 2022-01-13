const sapphirePrettierConfig = require('@sapphire/prettier-config');

module.exports = {
  ...sapphirePrettierConfig,
  tabWidth: 2,
  useTabs: false,
  overrides: [
    ...sapphirePrettierConfig.overrides,
    {
      files: ['*.md'],
      options: {
        printWidth: 120,
        proseWrap: 'always'
      }
    }
  ]
};
