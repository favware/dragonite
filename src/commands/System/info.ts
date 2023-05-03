import { BrandingColors } from '#utils/constants';
import { secondsFromMilliseconds } from '#utils/functions/time';
import { getGuildIds } from '#utils/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Command, version as sapphireVersion, type ChatInputCommand } from '@sapphire/framework';
import { roundNumber } from '@sapphire/utilities';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  OAuth2Scopes,
  PermissionFlagsBits,
  PermissionsBitField,
  TimestampStyles,
  hideLinkEmbed,
  hyperlink,
  time,
  version
} from 'discord.js';
import { cpus, uptime, type CpuInfo } from 'node:os';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Provides information about Dragonite, and links for adding the bot and joining the support server'
})
export class UserCommand extends Command {
  readonly #sapphireNextVersionRegex = /-next\.[a-z0-9]+\.\d{1,}/i;

  readonly #descriptionContent = [
    `Dragonite is a Pokémon information Discord bot built around Discord Interactions.`,
    `This bot uses the ${hyperlink('Sapphire Framework', hideLinkEmbed('https://sapphirejs.dev'))} build on top of ${hyperlink(
      'discord.js',
      hideLinkEmbed('https://discord.js.org')
    )}.`
  ].join('\n');

  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder //
          .setName(this.name)
          .setDescription(this.description),
      { guildIds: getGuildIds() }
    );
  }

  public override chatInputRun(interaction: ChatInputCommand.Interaction) {
    return interaction.reply({
      //
      embeds: [this.embed],
      components: this.components,
      ephemeral: true
    });
  }

  private get components(): ActionRowBuilder<ButtonBuilder>[] {
    return [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder() //
          .setStyle(ButtonStyle.Link)
          .setURL(this.inviteLink)
          .setLabel('Add me to your server!')
          .setEmoji({
            name: '🎉'
          }),
        new ButtonBuilder() //
          .setStyle(ButtonStyle.Link)
          .setURL('https://discord.gg/sguypX8')
          .setLabel('Support server')
          .setEmoji({
            name: '🆘'
          })
      ),
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder() //
          .setStyle(ButtonStyle.Link)
          .setURL('https://github.com/favware/dragonite')
          .setLabel('GitHub Repository')
          .setEmoji({
            id: '950888087188283422',
            name: 'github2'
          }),
        new ButtonBuilder() //
          .setStyle(ButtonStyle.Link)
          .setURL('https://github.com/sponsors/favna')
          .setLabel('Donate')
          .setEmoji({
            name: '🧡'
          })
      )
    ];
  }

  private get inviteLink() {
    return this.container.client.generateInvite({
      scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
      permissions: new PermissionsBitField([
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.EmbedLinks
      ])
    });
  }

  private get embed(): EmbedBuilder {
    const titles = {
      stats: 'Statistics',
      uptime: 'Uptime',
      serverUsage: 'Server Usage'
    };
    const stats = this.generalStatistics;
    const uptime = this.uptimeStatistics;
    const usage = this.usageStatistics;

    const fields = {
      stats: [
        //
        `• **Users**: ${stats.users}`,
        `• **Guilds**: ${stats.guilds}`,
        `• **Channels**: ${stats.channels}`,
        `• **Node.js**: ${stats.nodeJs}`,
        `• **Discord.js**: ${stats.version}`,
        `• **Sapphire Framework**: ${stats.sapphireVersion}`
      ].join('\n'),
      uptime: [
        //
        `• **Host**: ${uptime.host}`,
        `• **Total**: ${uptime.total}`,
        `• **Client**: ${uptime.client}`
      ].join('\n'),
      serverUsage: [
        //
        `• **CPU Load**: ${usage.cpuLoad}`,
        `• **Heap**: ${usage.ramUsed}MB (Total: ${usage.ramTotal}MB)`
      ].join('\n')
    };

    return new EmbedBuilder() //
      .setColor(BrandingColors.Primary)
      .setDescription(this.#descriptionContent)
      .setFields(
        {
          name: titles.stats,
          value: fields.stats,
          inline: true
        },
        {
          name: titles.uptime,
          value: fields.uptime
        },
        {
          name: titles.serverUsage,
          value: fields.serverUsage
        }
      );
  }

  private get generalStatistics(): StatsGeneral {
    const { client } = this.container;
    return {
      channels: client.channels.cache.size,
      guilds: client.guilds.cache.size,
      nodeJs: process.version,
      users: client.guilds.cache.reduce((acc, val) => acc + (val.memberCount ?? 0), 0),
      version: `v${version}`,
      sapphireVersion: `v${sapphireVersion.replace(this.#sapphireNextVersionRegex, '')}`
    };
  }

  private get uptimeStatistics(): StatsUptime {
    const now = Date.now();
    const nowSeconds = roundNumber(now / 1000);
    return {
      client: time(secondsFromMilliseconds(now - this.container.client.uptime!), TimestampStyles.RelativeTime),
      host: time(roundNumber(nowSeconds - uptime()), TimestampStyles.RelativeTime),
      total: time(roundNumber(nowSeconds - process.uptime()), TimestampStyles.RelativeTime)
    };
  }

  private get usageStatistics(): StatsUsage {
    const usage = process.memoryUsage();
    return {
      cpuLoad: cpus().slice(0, 2).map(UserCommand.formatCpuInfo.bind(null)).join(' | '),
      ramTotal: this.container.i18n.number.format(usage.heapTotal / 1048576),
      ramUsed: this.container.i18n.number.format(usage.heapUsed / 1048576)
    };
  }

  private static formatCpuInfo({ times }: CpuInfo) {
    return `${roundNumber(((times.user + times.nice + times.sys + times.irq) / times.idle) * 10000) / 100}%`;
  }
}

interface StatsGeneral {
  channels: number;
  guilds: number;
  nodeJs: string;
  users: number;
  version: string;
  sapphireVersion: string;
}

interface StatsUptime {
  client: string;
  host: string;
  total: string;
}

interface StatsUsage {
  cpuLoad: string;
  ramTotal: string;
  ramUsed: string;
}
