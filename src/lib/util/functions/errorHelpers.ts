import { isMessageInstance } from '@sapphire/discord.js-utilities';
import { codeBlock } from '@sapphire/utilities';
import { bold, hideLinkEmbed, hyperlink, type APIMessage, type DiscordAPIError, type HTTPError, type Interaction, type Message } from 'discord.js';

/**
 * Formats a message url line.
 * @param url The url to format.
 */
export function getLinkLine(message: APIMessage | Message): string {
  if (isMessageInstance(message)) {
    return bold(hyperlink('Jump to Message!', hideLinkEmbed(message.url)));
  }

  return '';
}

/**
 * Formats an error method line.
 * @param error The error to format.
 */
export function getMethodLine(error: DiscordAPIError | HTTPError): string {
  return `**Path**: ${error.method.toUpperCase()}`;
}

/**
 * Formats an error status line.
 * @param error The error to format.
 */
export function getStatusLine(error: DiscordAPIError | HTTPError): string {
  return `**Status**: ${error.status}`;
}

/**
 * Formats an error codeblock.
 * @param error The error to format.
 */
export function getErrorLine(error: Error): string {
  return `**Error**: ${codeBlock('js', error.stack || error)}`;
}

export function getWarnError(interaction: Interaction) {
  return `ERROR: /${interaction.guildId}/${interaction.channelId}/${interaction.id}`;
}
