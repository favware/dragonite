import { AbilitiesEnum } from '@favware/graphql-pokemon';
import { URL } from 'node:url';

export const rootFolder = new URL('../../../', import.meta.url);
export const srcFolder = new URL('src/', rootFolder);

export const ZeroWidthSpace = '\u200B';

export const enum SelectMenuCustomIds {
  Ability = 'ability-select-menu'
}

export const enum CdnUrls {
  Pokedex = 'https://cdn.favware.tech/img/pokedex.png'
}

export const enum Emojis {
  Loading = '<a:_:730555789730775042>',
  GreenTick = '<:_:637706251253317669>',
  RedCross = '<:_:637706251257511973>'
}

export const enum BrandingColors {
  Primary = 0x355270,
  Secondary = 0xc85864
}

export const FavouredAbilities: { key: AbilitiesEnum; name: `⭐ ${string}` }[] = [
  {
    key: AbilitiesEnum.Multiscale,
    name: '⭐ Multiscale'
  },
  {
    key: AbilitiesEnum.Battlebond,
    name: '⭐ Battle Bond'
  },
  {
    key: AbilitiesEnum.Victorystar,
    name: '⭐ Victory Star'
  },
  {
    key: AbilitiesEnum.Primordialsea,
    name: '⭐ Primordial Sea'
  },
  {
    key: AbilitiesEnum.Colorchange,
    name: '⭐ Color Change'
  },
  {
    key: AbilitiesEnum.Pixilate,
    name: '⭐ Pixilate'
  }
];
