import { container, Events, InteractionHandler, UserError, Result } from '@sapphire/framework';
import { envParseArray } from '@skyra/env-utilities';
import { deserialize, serialize } from 'binarytf';
import type { Interaction } from 'discord.js';
import { brotliCompressSync, brotliDecompressSync } from 'node:zlib';

export function getGuildIds(): string[] {
  return envParseArray('COMMAND_GUILD_IDS', []);
}

/**
 * Compresses customId metadata using a combination of {@link serialize}
 * from `binarytf` and then compressing it with {@link brotliCompressSync} from `node:zlib`.
 * @param __namedParameter The data to serialize and compress
 * @returns A stringified version of the data using `binary` encoding
 */

export function compressCustomIdMetadata<T>(params: T, customMessagePart?: string): string {
  const serializedId = brotliCompressSync(serialize<T>(params)).toString('binary');

  if (serializedId.length > 80) {
    const resolvedCustomMessagePart = customMessagePart ?? '';
    throw new UserError({
      identifier: 'QueryCausedTooLongCustomId',
      message: `Due to Discord API limitations I was unable to resolve that request. ${resolvedCustomMessagePart}This issue will be fixed in the future.`
    });
  }

  return serializedId;
}

export function decompressCustomIdMetadata<T>(
  content: string,
  { handler, interaction }: { interaction: Interaction; handler: InteractionHandler }
): T {
  const result = Result.from<T, Error>(() =>
    //
    deserialize<T>(brotliDecompressSync(Buffer.from(content, 'binary')))
  );

  return result.match({
    ok: (data) => data,
    err: (error) => {
      // Emit the error
      container.client.emit(Events.InteractionHandlerParseError, error, { interaction, handler });

      throw new UserError({
        identifier: 'CustomIdFailedToDeserialize',
        message:
          'I am sorry, but that query failed. Please try again. If the problem persists, then please join the support server (use the /info command)'
      });
    }
  });
}

export type KeysContaining<O, Str extends string, Keys extends keyof O = keyof O> = Keys extends string
  ? Lowercase<Keys> extends `${string}${Lowercase<Str>}${string}`
    ? Keys
    : never
  : never;
