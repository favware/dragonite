import { OWNERS } from '#root/config';
import { Emojis, rootFolder } from '#utils/constants';
import { bold, hideLinkEmbed, hyperlink, userMention } from '@discordjs/builders';
import { isMessageInstance } from '@sapphire/discord.js-utilities';
import {
  ArgumentError,
  container,
  Events,
  UserError,
  type InteractionHandler,
  type InteractionHandlerError,
  type InteractionHandlerParseError
} from '@sapphire/framework';
import { codeBlock, isNullish } from '@sapphire/utilities';
import { RESTJSONErrorCodes, type APIMessage } from 'discord-api-types/v9';
import { DiscordAPIError, HTTPError, Interaction, MessageEmbed, type Message } from 'discord.js';
import { fileURLToPath } from 'url';

const ignoredCodes = [RESTJSONErrorCodes.UnknownChannel, RESTJSONErrorCodes.UnknownMessage];

export async function handleInteractionError(error: Error, { handler, interaction }: InteractionHandlerError | InteractionHandlerParseError) {
  // If the error was a string or an UserError, send it to the user:
  if (typeof error === 'string') return stringError(interaction, error);
  if (error instanceof ArgumentError) return argumentError(interaction, error);
  if (error instanceof UserError) return userError(interaction, error);

  const { client, logger } = container;
  // If the error was an AbortError or an Internal Server Error, tell the user to re-try:
  if (error.name === 'AbortError' || error.message === 'Internal Server Error') {
    logger.warn(`${getWarnError(interaction)} (${interaction.user.id}) | ${error.constructor.name}`);
    return alert(interaction, 'I had a small network error when messaging Discord. Please run this command again!');
  }

  // Extract useful information about the DiscordAPIError
  if (error instanceof DiscordAPIError || error instanceof HTTPError) {
    if (ignoredCodes.includes(error.code)) {
      return;
    }

    client.emit(Events.Error, error);
  } else {
    logger.warn(`${getWarnError(interaction)} (${interaction.user.id}) | ${error.constructor.name}`);
  }

  // Send a detailed message:
  await sendErrorChannel(interaction, handler, error);

  // Emit where the error was emitted
  logger.fatal(`[COMMAND] ${handler.location.full}\n${error.stack || error.message}`);
  try {
    await alert(interaction, generateUnexpectedErrorMessage(interaction, error));
  } catch (err) {
    client.emit(Events.Error, err as Error);
  }

  return undefined;
}

function generateUnexpectedErrorMessage(interaction: Interaction, error: Error) {
  if (OWNERS.includes(interaction.user.id)) return codeBlock('js', error.stack!);
  return `${Emojis.RedCross} I found an unexpected error, please report the steps you have taken to my developers!`;
}

function stringError(interaction: Interaction, error: string) {
  return alert(interaction, `${Emojis.RedCross} Dear ${userMention(interaction.user.id)}, ${error}`);
}

function argumentError(interaction: Interaction, error: ArgumentError<unknown>) {
  return alert(
    interaction,
    error.message ??
      `An error occurred that I was not able to identify. Please try again. If the issue keeps showing up, you can get in touch with the developers by joining my support server through ${hideLinkEmbed(
        'https://join.favware.tech'
      )}`
  );
}

function userError(interaction: Interaction, error: UserError) {
  if (Reflect.get(Object(error.context), 'silent')) return;

  return alert(
    interaction,
    error.message ??
      `An error occurred that I was not able to identify. Please try again. If the issue keeps showing up, you can get in touch with the developers by joining my support server through ${hideLinkEmbed(
        'https://join.favware.tech'
      )}`
  );
}

function alert(interaction: Interaction, content: string) {
  if (!interaction.isSelectMenu() && !interaction.isButton()) return;

  if (interaction.replied || interaction.deferred) {
    return interaction.editReply({
      content,
      allowedMentions: { users: [interaction.user.id], roles: [] }
    });
  }

  return interaction.reply({
    content,
    allowedMentions: { users: [interaction.user.id], roles: [] },
    ephemeral: true
  });
}

async function sendErrorChannel(interaction: Interaction, handler: InteractionHandler, error: Error) {
  const webhook = container.webhookError;
  if (isNullish(webhook) || (!interaction.isSelectMenu() && !interaction.isButton())) return;

  const interactionReply = await interaction.fetchReply();

  const lines = [getLinkLine(interactionReply), getHandlerLine(handler), getErrorLine(error)];

  // If it's a DiscordAPIError or a HTTPError, add the HTTP path and code lines after the second one.
  if (error instanceof DiscordAPIError || error instanceof HTTPError) {
    lines.splice(2, 0, getPathLine(error), getCodeLine(error));
  }

  const embed = new MessageEmbed() //
    .setDescription(lines.join('\n'))
    .setColor('RED')
    .setTimestamp();

  try {
    await webhook.send({ embeds: [embed] });
  } catch (err) {
    container.client.emit(Events.Error, err as Error);
  }
}

/**
 * Formats a message url line.
 * @param url The url to format.
 */
function getLinkLine(message: APIMessage | Message): string {
  if (isMessageInstance(message)) {
    return bold(hyperlink('Jump to Message!', hideLinkEmbed(message.url)));
  }

  return '';
}

/**
 * Formats a handler line.
 * @param handler The handler to format.
 */
function getHandlerLine(handler: InteractionHandler): string {
  return `**Handler**: ${handler.location.full.slice(fileURLToPath(rootFolder).length)}`;
}

/**
 * Formats an error path line.
 * @param error The error to format.
 */
function getPathLine(error: DiscordAPIError | HTTPError): string {
  return `**Path**: ${error.method.toUpperCase()} ${error.path}`;
}

/**
 * Formats an error code line.
 * @param error The error to format.
 */
function getCodeLine(error: DiscordAPIError | HTTPError): string {
  return `**Code**: ${error.code}`;
}

/**
 * Formats an error codeblock.
 * @param error The error to format.
 */
function getErrorLine(error: Error): string {
  return `**Error**: ${codeBlock('js', error.stack || error)}`;
}

function getWarnError(interaction: Interaction) {
  return `ERROR: /${interaction.guild!.id}/${interaction.channel!.id}/${interaction.id}`;
}
