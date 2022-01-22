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
    idHints: ['933451566957088848', '934269977379369011'],
    defaultPermission: false
  }
})
export class SlashCommand extends DragoniteCommand {
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand['chatInputRun']>) {
    await interaction.deferReply({ ephemeral: true });

    await this.container.gqlRedisCache.clearPokemonKeys();

    return interaction.editReply({ content: 'Successfully cleared all PokéDex redis keys' });
  }
}
