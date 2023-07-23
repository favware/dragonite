import sapphirePrettierConfig from '@sapphire/prettier-config';

export default {
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
