import { DragoniteCommand } from '#lib/extensions/DragoniteCommand';
import { getGuildIds } from '#utils/utils';
import { ApplyOptions } from '@sapphire/decorators';
import type { ChatInputCommand } from '@sapphire/framework';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Clears the learnset cache from Redis. Can only be used by the bot owner.',
  preconditions: ['OwnerOnly']
})
export class SlashCommand extends DragoniteCommand {
  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder //
          .setName(this.name)
          .setDefaultPermission(false)
          .setDMPermission(false)
          .setDefaultMemberPermissions('0')
          .setDescription(this.description),
      { guildIds: getGuildIds(), idHints: ['970121154452930601', '942137573348884500'] }
    );
  }

  public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
    await interaction.deferReply({ ephemeral: true });

    await this.container.gqlRedisCache.clearLearnsetKeys();

    return interaction.editReply({ content: 'Successfully cleared all learnset redis keys' });
  }
}
