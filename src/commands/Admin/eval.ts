import { DragoniteCommand } from '#lib/extensions/DragoniteCommand';
import { ModalCustomIds } from '#utils/constants';
import { compressEvalCustomIdMetadata } from '#utils/evalCustomIdCompression';
import { ApplyOptions } from '@sapphire/decorators';
import { Time } from '@sapphire/duration';
import type { ChatInputCommand } from '@sapphire/framework';
import {
  ActionRowBuilder,
  ModalBuilder,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle,
  type APIApplicationCommandOptionChoice
} from 'discord.js';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Evaluates any JavaScript code. Can only be used by the bot owner.',
  preconditions: ['OwnerOnly']
})
export class SlashCommand extends DragoniteCommand {
  private readonly timeout = Time.Minute;

  private readonly languageChoices: APIApplicationCommandOptionChoice<string>[] = [
    { name: 'JavaScript', value: 'js' },
    { name: 'TypeScript', value: 'ts' },
    { name: 'JSON', value: 'json' },
    { name: 'Raw text', value: 'txt' }
  ];

  private readonly outputChoices: APIApplicationCommandOptionChoice<string>[] = [
    { name: 'Reply', value: 'reply' },
    { name: 'File', value: 'file' },
    { name: 'Hastebin', value: 'hastebin' },
    { name: 'Console', value: 'console' },
    { name: 'Abort', value: 'none' }
  ];

  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder //
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption((option) =>
          option //
            .setName('depth')
            .setDescription('The inspection depth to apply.')
        )
        .addStringOption((builder) =>
          builder //
            .setName('language')
            .setDescription('The language of the output codeblock.')
            .setChoices(...this.languageChoices)
        )
        .addStringOption((builder) =>
          builder //
            .setName('output-to')
            .setDescription('The location to send the output to.')
            .setChoices(...this.outputChoices)
        )
        .addBooleanOption((builder) =>
          builder //
            .setName('async')
            .setDescription('Whether this code should be evaluated asynchronously.')
        )
        .addBooleanOption((builder) =>
          builder //
            .setName('no-timeout')
            .setDescription('Whether there should be no timeout for evaluating this code.')
        )
        .addBooleanOption((builder) =>
          builder //
            .setName('silent')
            .setDescription('Whether the bot should not give a reply on the evaluation.')
        )
        .addBooleanOption((builder) =>
          builder //
            .setName('show-hidden')
            .setDescription('Whether to show hidden JSON properties when stringifying.')
        )
    );
  }

  public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
    const depth = interaction.options.getInteger('depth') ?? 0;
    const language = interaction.options.getString('language') ?? 'ts';
    const outputTo = interaction.options.getString('output-to') ?? 'reply';
    const async = interaction.options.getBoolean('async') ?? false;
    const noTimeout = interaction.options.getBoolean('no-timeout') ?? false;
    const silent = interaction.options.getBoolean('silent') ?? false;
    const showHidden = interaction.options.getBoolean('show-hidden') ?? false;

    const timeout = noTimeout ? Time.Minute * 10 : this.timeout;

    const metadata = compressEvalCustomIdMetadata({
      depth,
      async,
      language,
      outputTo,
      silent,
      showHidden,
      timeout
    });

    const customIdStringified = `${ModalCustomIds.Eval}|${metadata}`;

    const modal = new ModalBuilder() //
      .setCustomId(customIdStringified)
      .setTitle('Code to evaluate')
      .setComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder() //
            .setCustomId('code-input')
            .setLabel("What's the code to evaluate")
            .setStyle(TextInputStyle.Paragraph)
        )
      );

    await interaction.showModal(modal);

    return interaction.reply({
      content: 'Code evaluation modal opened.',
      ephemeral: true
    });
  }
}
