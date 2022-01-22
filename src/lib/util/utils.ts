import { envParseArray } from '#lib/env';
import type { MovesEnum } from '@favware/graphql-pokemon';
import { deserialize, serialize } from 'binarytf';
import type { APIMessage } from 'discord-api-types/v9';
import { Message, type CommandInteraction } from 'discord.js';
import type { PokemonSpriteTypes } from './responseBuilders/pokemonResponseBuilder';

export function getGuildIds(): string[] {
  return envParseArray('COMMAND_GUILD_IDS', []);
}

export function isMessageInstance(message: APIMessage | CommandInteraction | Message): message is Message<true> {
  return message instanceof Message;
}

/**
 * Compresses customId metadata using a combination of {@link serialize}
 * from `binarytf` and then compressing it with {@link brotliCompressSync} from `node:zlib`.
 * @param __namedParameter The data to serialize and compress
 * @returns A stringified version of the data using `binary` encoding
 */
export function compressPokemonCustomIdMetadata({ type, generation, moves, spriteToGet }: PokemonSelectMenuData): string {
  return Buffer.from(
    serialize<PokemonSelectMenuData>({
      type,
      spriteToGet,
      generation,
      moves
    })
  ).toString('binary');
}

export function decompressPokemonCustomIdMetadata(content: string): PokemonSelectMenuData {
  return deserialize<PokemonSelectMenuData>(Buffer.from(content, 'binary'));
}

export interface PokemonSelectMenuData {
  type: ResponseToGenerate;
  spriteToGet?: PokemonSpriteTypes;
  generation?: number;
  moves?: MovesEnum[];
}

type ResponseToGenerate = 'pokemon' | 'flavor' | 'learn' | 'sprite' | 'move' | 'item' | 'ability';

export type KeysContaining<O, Str extends string, Keys extends keyof O = keyof O> = Keys extends string
  ? Lowercase<Keys> extends `${string}${Lowercase<Str>}${string}`
    ? Keys
    : never
  : never;
