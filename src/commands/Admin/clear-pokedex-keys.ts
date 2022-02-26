import { DragoniteCommand } from '#lib/extensions/DragoniteCommand';
import { getGuildIds } from '#utils/utils';
import { ApplyOptions } from '@sapphire/decorators';
import type { ChatInputCommand } from '@sapphire/framework';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Clears the PokéDex cache from Redis. Can only be used by the bot owner.',
  preconditions: ['OwnerOnly'],
  chatInputCommand: {
    register: true,
    guildIds: getGuildIds(),
    idHints: ['936023507060531270', '942137573831221290'],
    defaultPermission: false
  }
})
export class SlashCommand extends DragoniteCommand {
  public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
    await interaction.deferReply({ ephemeral: true });

    await this.container.gqlRedisCache.clearPokemonKeys();

    return interaction.editReply({ content: 'Successfully cleared all PokéDex redis keys' });
  }
}
