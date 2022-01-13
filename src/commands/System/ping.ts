import { Emojis } from '#utils/constants';
import { getGuildIds, isMessageInstance } from '#utils/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Runs a connection test to Discord.',
  chatInputCommand: {
    register: true,
    guildIds: getGuildIds(),
    idHints: []
  }
})
export class UserCommand extends Command {
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand['chatInputRun']>) {
    const msg = await interaction.reply({ content: `${Emojis.Loading} Ping?`, ephemeral: true, fetchReply: true });

    if (isMessageInstance(msg)) {
      const { diff, ping } = this.getPing(msg, interaction);

      return interaction.editReply(`Pong 🏓! (Roundtrip took: ${diff}ms. Heartbeat: ${ping}ms.)`);
    }

    return interaction.editReply('Failed to retrieve ping :(');
  }

  private getPing(message: Message, interaction: CommandInteraction) {
    const diff = (message.editedTimestamp || message.createdTimestamp) - interaction.createdTimestamp;
    const ping = Math.round(this.container.client.ws.ping);

    return { diff, ping };
  }
}
