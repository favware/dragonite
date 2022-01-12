import { URL } from 'node:url';

export const rootFolder = new URL('../../../', import.meta.url);
export const srcFolder = new URL('src/', rootFolder);

export const enum Emojis {
  Loading = '<a:_:730555789730775042>',
  GreenTick = '<:_:637706251253317669>',
  RedCross = '<:_:637706251257511973>'
}

export const enum BrandingColors {
  Primary = 0x355270,
  Secondary = 0xc85864
}
