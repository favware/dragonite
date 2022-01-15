import { getGuildIds } from '#utils/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Command, type ChatInputCommand } from '@sapphire/framework';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Provides some information about dragonite.',
  chatInputCommand: {
    register: true,
    guildIds: getGuildIds(),
    idHints: ['931727500638322718']
  }
})
export class UserCommand extends Command {
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand['chatInputRun']>) {
    return interaction.reply({
      content: this.content,
      ephemeral: true
    });
  }

  private get content() {
    return [
      `dragonite is a Pokémon information Discord bot built around Discord Interactions.`,
      'This bot uses the Sapphire Framework build on top of discord.js.',
      '',
      "Dragonite's features:",
      '• Getting information on Pokémon.',
      '• Getting information on Pokémon abilities.',
      '• Getting information on Pokémon items.',
      '• Getting information on Pokémon learnsets.',
      '• Getting information on Pokémon moves.',
      '• Getting information on Pokémon types.',
      '• Getting information on Pokémon flavor texts.',
      '• Getting Pokémon sprites.'
    ].join('\n');
  }
}
