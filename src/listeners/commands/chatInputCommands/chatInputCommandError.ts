import { OWNERS } from '#root/config';
import { Emojis, rootFolder, ZeroWidthSpace } from '#utils/constants';
import { getCodeLine, getErrorLine, getPathLine } from '#utils/functions/errorHelpers';
import { bold, hideLinkEmbed, hyperlink, userMention } from '@discordjs/builders';
import { isMessageInstance } from '@sapphire/discord.js-utilities';
import { ArgumentError, Events, Listener, UserError, type ChatInputCommandErrorPayload, type Command } from '@sapphire/framework';
import { codeBlock, isNullish } from '@sapphire/utilities';
import { RESTJSONErrorCodes, type APIMessage } from 'discord-api-types/v9';
import { DiscordAPIError, HTTPError, MessageEmbed, type CommandInteraction, type Message } from 'discord.js';
import { fileURLToPath } from 'node:url';

const ignoredCodes = [RESTJSONErrorCodes.UnknownChannel, RESTJSONErrorCodes.UnknownMessage];

export class UserListener extends Listener<typeof Events.ChatInputCommandError> {
  public async run(error: Error, { command, interaction }: ChatInputCommandErrorPayload) {
    // If the error was a string or an UserError, send it to the user:
    if (typeof error === 'string') return this.stringError(interaction, error);
    if (error instanceof ArgumentError) return this.argumentError(interaction, error);
    if (error instanceof UserError) return this.userError(interaction, error);

    const { client, logger } = this.container;
    // If the error was an AbortError or an Internal Server Error, tell the user to re-try:
    if (error.name === 'AbortError' || error.message === 'Internal Server Error') {
      logger.warn(`${this.getWarnError(interaction)} (${interaction.user.id}) | ${error.constructor.name}`);
      return this.alert(interaction, 'I had a small network error when messaging Discord. Please run this command again!');
    }

    // Extract useful information about the DiscordAPIError
    if (error instanceof DiscordAPIError || error instanceof HTTPError) {
      if (ignoredCodes.includes(error.code)) {
        return;
      }

      client.emit(Events.Error, error);
    } else {
      logger.warn(`${this.getWarnError(interaction)} (${interaction.user.id}) | ${error.constructor.name}`);
    }

    // Send a detailed message:
    await this.sendErrorChannel(interaction, command, error);

    // Emit where the error was emitted
    logger.fatal(`[COMMAND] ${command.location.full}\n${error.stack || error.message}`);
    try {
      await this.alert(interaction, this.generateUnexpectedErrorMessage(interaction, error));
    } catch (err) {
      client.emit(Events.Error, err as Error);
    }

    return undefined;
  }

  private generateUnexpectedErrorMessage(interaction: CommandInteraction, error: Error) {
    if (OWNERS.includes(interaction.user.id)) return codeBlock('js', error.stack!);
    return `${Emojis.RedCross} I found an unexpected error, please report the steps you have taken to my developers!`;
  }

  private stringError(interaction: CommandInteraction, error: string) {
    return this.alert(interaction, `${Emojis.RedCross} Dear ${userMention(interaction.user.id)}, ${error}`);
  }

  private argumentError(interaction: CommandInteraction, error: ArgumentError<unknown>) {
    return this.alert(
      interaction,
      error.message ||
        `An error occurred that I was not able to identify. Please try again. If the issue keeps showing up, you can get in touch with the developers by joining my support server through ${hideLinkEmbed(
          'https://join.favware.tech'
        )}`
    );
  }

  private userError(interaction: CommandInteraction, error: UserError) {
    if (Reflect.get(Object(error.context), 'silent')) return;

    return this.alert(
      interaction,
      error.message ||
        `An error occurred that I was not able to identify. Please try again. If the issue keeps showing up, you can get in touch with the developers by joining my support server through ${hideLinkEmbed(
          'https://join.favware.tech'
        )}`
    );
  }

  private alert(interaction: CommandInteraction, content: string) {
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

  private async sendErrorChannel(interaction: CommandInteraction, command: Command, error: Error) {
    const webhook = this.container.webhookError;
    if (isNullish(webhook)) return;

    const interactionReply = await interaction.fetchReply();

    const lines = [
      this.getLinkLine(interactionReply), //
      this.getCommandLine(command),
      this.getOptionsLine(interaction.options),
      getErrorLine(error)
    ];

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
      this.container.client.emit(Events.Error, err as Error);
    }
  }

  /**
   * Formats a message url line.
   * @param url The url to format.
   */
  private getLinkLine(message: APIMessage | Message): string {
    if (isMessageInstance(message)) {
      return bold(hyperlink('Jump to Message!', hideLinkEmbed(message.url)));
    }

    return '';
  }

  /**
   * Formats a command line.
   * @param command The command to format.
   */
  private getCommandLine(command: Command): string {
    return `**Command**: ${command.location.full.slice(fileURLToPath(rootFolder).length)}`;
  }

  /**
   * Formats an options line.
   * @param options The options the user used when running the command.
   */
  private getOptionsLine(options: CommandInteraction['options']): string {
    if (options.data.length === 0) return '**Options**: Not Supplied';

    const mappedOptions = [];

    for (const option of options.data) {
      let { value } = option;
      if (typeof value === 'string') value = value.trim().replaceAll('`', '῾');

      mappedOptions.push(`[${option.name} ⫸ ${value || ZeroWidthSpace}]`);
    }

    if (mappedOptions.length === 0) return '**Options**: Not Supplied';

    return `**Options**: ${mappedOptions.join('\n')}`;
  }

  private getWarnError(interaction: CommandInteraction) {
    return `ERROR: /${interaction.guildId}/${interaction.channelId}/${interaction.id}`;
  }
}
