import { URL } from 'node:url';

export const rootFolder = new URL('../../../', import.meta.url);
export const srcFolder = new URL('src/', rootFolder);

export const ZeroWidthSpace = '\u200B';

export const enum CdnUrls {
  Pokedex = 'https://cdn.favware.tech/img/pokedex.png'
}

export const enum Emojis {
  Loading = '<a:_:730555789730775042>',
  GreenTick = '<:_:637706251253317669>',
  RedCross = '<:_:637706251257511973>',
  /** This is the default Twemoji, uploaded as a custom emoji because iOS and Android do not render the emoji properly */
  MaleSignEmoji = '<:2642:845772713770614874>',
  /** This is the default Twemoji, uploaded as a custom emoji because iOS and Android do not render the emoji properly */
  FemaleSignEmoji = '<:2640:845772713729720320>',
  /** The logo of https://serebii.net */
  Serebii = '1189631608773410837',
  /** The logo of https://bulbapedia.bulbagarden.net */
  Bulbapedia = '1189631610170130522',
  /** The logo of https://www.smogon.com */
  Smogon = '1189631606214905966'
}

export const enum BrandingColors {
  Primary = 0x355270,
  Secondary = 0xc85864
}

export const enum SelectMenuCustomIds {
  Ability = 'ability-select-menu',
  Item = 'item-select-menu',
  Move = 'move-select-menu',
  Pokemon = 'pokemon-select-menu'
}
