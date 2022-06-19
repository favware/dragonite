import type { PokemonSpriteTypes } from '#utils/responseBuilders/pokemonResponseBuilder';
import { compressCustomIdMetadata, decompressCustomIdMetadata } from '#utils/utils';
import type { MovesEnum } from '@favware/graphql-pokemon';

export const compressPokemonCustomIdMetadata = compressCustomIdMetadata<PokemonSelectMenuData>;

export const decompressPokemonCustomIdMetadata = decompressCustomIdMetadata<PokemonSelectMenuData>;

export interface PokemonSelectMenuData {
  type: ResponseToGenerate;
  spriteToGet?: PokemonSpriteTypes;
  generation?: number;
  moves?: MovesEnum[];
}

type ResponseToGenerate = 'pokemon' | 'flavor' | 'learn' | 'sprite';
