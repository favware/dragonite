import { getGuildIds } from '#utils/utils';
import { hideLinkEmbed, hyperlink } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { Command, type ChatInputCommand } from '@sapphire/framework';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Provides some information about dragonite.',
  chatInputCommand: {
    register: true,
    guildIds: getGuildIds(),
    idHints: ['936023680704741426', '934269802426564638']
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
      `Dragonite is a Pokémon information Discord bot built around Discord Interactions.`,
      `This bot uses the ${hyperlink('Sapphire Framework', hideLinkEmbed('https://sapphirejs.dev'))} build on top of ${hyperlink(
        'discord.js',
        hideLinkEmbed('https://discord.js.org')
      )}.`,
      '',
      "Dragonite's features:",
      '• Getting information on Pokémon.',
      '• Getting information on Pokémon abilities.',
      '• Getting information on Pokémon items.',
      '• Getting information on Pokémon learnsets.',
      '• Getting information on Pokémon moves.',
      '• Getting information on Pokémon types.',
      '• Getting information on Pokémon flavor texts.',
      '• Getting Pokémon sprites.',
      '',
      'Want to join the Dragonite community? You can join through <https://join.favware.tech>'
    ].join('\n');
  }
}
