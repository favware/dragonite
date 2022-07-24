import { DragoniteCommand } from '#lib/extensions/DragoniteCommand';
import { getGuildIds } from '#utils/utils';
import { ApplyOptions } from '@sapphire/decorators';
import type { ChatInputCommand } from '@sapphire/framework';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Clears the PokéDex cache from Redis. Can only be used by the bot owner.',
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
      { guildIds: getGuildIds(), idHints: ['970121155451166762', '942137573831221290'] }
    );
  }

  public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
    await interaction.deferReply({ ephemeral: true });

    await this.container.gqlRedisCache.clearPokemonKeys();

    return interaction.editReply({ content: 'Successfully cleared all PokéDex redis keys' });
  }
}
