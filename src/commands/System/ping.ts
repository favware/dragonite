import { Emojis } from '#utils/constants';
import { getGuildIds } from '#utils/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Command, type ChatInputCommand } from '@sapphire/framework';
import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APIMessage } from 'discord-api-types';
import type { CommandInteraction, Message } from 'discord.js';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Runs a connection test to Discord.',
  chatInputCommand: {
    register: true,
    guildIds: getGuildIds(),
    idHints: ['936023681396789359', '934269803085054032']
  }
})
export class UserCommand extends Command {
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand['chatInputRun']>) {
    const msg = await interaction.reply({ content: `${Emojis.Loading} Ping?`, ephemeral: true, fetchReply: true });

    const { diff, ping } = this.getPing(msg, interaction);

    return interaction.editReply(`Pong 🏓! (Roundtrip took: ${diff}ms. Heartbeat: ${ping}ms.)`);
  }

  private getPing(message: APIMessage | Message, interaction: CommandInteraction) {
    const msgTimestamp = DiscordSnowflake.timestampFrom(message.id);
    const diff = msgTimestamp - interaction.createdTimestamp;
    const ping = Math.round(this.container.client.ws.ping);

    return { diff, ping };
  }
}
