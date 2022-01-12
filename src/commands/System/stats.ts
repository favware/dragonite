import { BrandingColors } from '#utils/constants';
import { getGuildIds } from '#utils/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, version as sapphireVersion } from '@sapphire/framework';
import { roundNumber } from '@sapphire/utilities';
import { MessageEmbed, version } from 'discord.js';
import { cpus, uptime, type CpuInfo } from 'node:os';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Provides some details about the bot and stats.',
  requiredClientPermissions: ['EMBED_LINKS'],
  chatInputCommand: {
    register: true,
    guildIds: getGuildIds(),
    idHints: []
  }
})
export class UserCommand extends Command {
  public override chatInputRun(...[interaction]: Parameters<ChatInputCommand['chatInputRun']>) {
    return interaction.reply({ embeds: [this.buildEmbed()], ephemeral: true });
  }

  private buildEmbed() {
    const titles = {
      stats: 'Statistics',
      uptime: 'Uptime',
      serverUsage: 'Server Usage'
    };
    const stats = this.generalStatistics;
    const uptime = this.uptimeStatistics;
    const usage = this.usageStatistics;

    const fields = {
      stats: `• **Users**: ${stats.users}\n• **Guilds**: ${stats.guilds}\n• **Channels**: ${stats.channels}\n• **Discord.js**: ${stats.version}\n• **Node.js**: ${stats.nodeJs}\n• **Sapphire Framework**: ${stats.sapphireVersion}`,
      uptime: `• **Host**: ${uptime.host}\n• **Total**: ${uptime.total}\n• **Client**: ${uptime.client}`,
      serverUsage: `• **CPU Load**: ${usage.cpuLoad}\n• **Heap**: ${usage.ramUsed}MB (Total: ${usage.ramTotal}}MB)`
    };

    return new MessageEmbed()
      .setColor(BrandingColors.Primary)
      .addField(titles.stats, fields.stats)
      .addField(titles.uptime, fields.uptime)
      .addField(titles.serverUsage, fields.serverUsage);
  }

  private get generalStatistics(): StatsGeneral {
    const { client } = this.container;
    return {
      channels: client.channels.cache.size,
      guilds: client.guilds.cache.size,
      nodeJs: process.version,
      users: client.guilds.cache.reduce((acc, val) => acc + (val.memberCount ?? 0), 0),
      version: `v${version}`,
      sapphireVersion: `v${sapphireVersion}`
    };
  }

  private get uptimeStatistics(): StatsUptime {
    return {
      client: this.container.i18n.duration.format(this.container.client.uptime!),
      host: this.container.i18n.duration.format(uptime() * 1000),
      total: this.container.i18n.duration.format(process.uptime() * 1000)
    };
  }

  private get usageStatistics(): StatsUsage {
    const usage = process.memoryUsage();
    return {
      cpuLoad: cpus().map(UserCommand.formatCpuInfo.bind(null)).join(' | '),
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
