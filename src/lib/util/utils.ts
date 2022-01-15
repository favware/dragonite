import { envParseArray } from '#lib/env';
import type { APIMessage } from 'discord-api-types';
import { Message, type CommandInteraction } from 'discord.js';

export function getGuildIds(): string[] {
  return envParseArray('COMMAND_GUILD_IDS', []);
}

export function isMessageInstance(message: APIMessage | CommandInteraction | Message): message is Message<true> {
  return message instanceof Message;
}
