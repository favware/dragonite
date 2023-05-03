import { container } from '@sapphire/framework';

container.i18n = {
  number: new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2 }),
  listAnd: new Intl.ListFormat('en-GB', { type: 'conjunction' }),
  listOr: new Intl.ListFormat('en-GB', { type: 'disjunction' })
};
