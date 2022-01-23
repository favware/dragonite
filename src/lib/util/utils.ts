import { envParseArray } from '#lib/env';
import type { MovesEnum } from '@favware/graphql-pokemon';
import { container, Events, from, InteractionHandler, isErr, UserError } from '@sapphire/framework';
import { deserialize, serialize } from 'binarytf';
import type { APIMessage } from 'discord-api-types/v9';
import { Interaction, Message, type CommandInteraction } from 'discord.js';
import { brotliCompressSync, brotliDecompressSync } from 'node:zlib';
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
export function compressPokemonCustomIdMetadata({ type, generation, moves, spriteToGet }: PokemonSelectMenuData, customMessagePart?: string): string {
  const serializedId = brotliCompressSync(
    serialize<PokemonSelectMenuData>({
      type,
      spriteToGet,
      generation,
      moves
    })
  ).toString('binary');

  if (serializedId.length > 80) {
    throw new UserError({
      identifier: 'QueryCausedTooLongCustomId',
      message: `Due to Discord API limitations I was unable to resolve that request. ${customMessagePart}This issue will be fixed in the future.`
    });
  }

  return serializedId;
}

export function decompressPokemonCustomIdMetadata(
  content: string,
  { handler, interaction }: { interaction: Interaction; handler: InteractionHandler }
): PokemonSelectMenuData {
  const result = from(() =>
    //
    deserialize<PokemonSelectMenuData>(brotliDecompressSync(Buffer.from(content, 'binary')))
  );

  if (isErr(result)) {
    // Emit the error
    container.client.emit(Events.InteractionHandlerParseError, result.error as Error, { interaction, handler });

    throw new UserError({
      identifier: 'CustomIdFailedToDeserialize',
      message:
        'I am sorry, but that query failed. Please try again. If the problem persists, then please join the support server (use the /info command)'
    });
  }

  return result.value;
}

interface PokemonSelectMenuData {
  type: ResponseToGenerate;
  spriteToGet?: PokemonSpriteTypes;
  generation?: number;
  moves?: MovesEnum[];
}

type ResponseToGenerate = 'pokemon' | 'flavor' | 'learn' | 'sprite';

export type KeysContaining<O, Str extends string, Keys extends keyof O = keyof O> = Keys extends string
  ? Lowercase<Keys> extends `${string}${Lowercase<Str>}${string}`
    ? Keys
    : never
  : never;
