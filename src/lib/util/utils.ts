import { envParseArray } from '#lib/env';
import type { APIMessage } from 'discord-api-types/v9';
import { Message, type CommandInteraction } from 'discord.js';

export function getGuildIds(): string[] {
  return envParseArray('COMMAND_GUILD_IDS', []);
}

export function isMessageInstance(message: APIMessage | CommandInteraction | Message): message is Message<true> {
  return message instanceof Message;
}

export type KeysContaining<O, Str extends string, Keys extends keyof O = keyof O> = Keys extends string
  ? Lowercase<Keys> extends `${string}${Lowercase<Str>}${string}`
    ? Keys
    : never
  : never;
