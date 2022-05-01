import { DragoniteCommand } from '#lib/extensions/DragoniteCommand';
import { SelectMenuCustomIds } from '#utils/constants';
import { flavorResponseBuilder } from '#utils/responseBuilders/flavorResponseBuilder';
import { fuzzyPokemonToSelectOption, PokemonSpriteTypes } from '#utils/responseBuilders/pokemonResponseBuilder';
import { compressPokemonCustomIdMetadata, getGuildIds } from '#utils/utils';
import type { PokemonEnum } from '@favware/graphql-pokemon';
import { ApplyOptions } from '@sapphire/decorators';
import type { ChatInputCommand } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { MessageActionRow, MessageSelectMenu, type MessageSelectOptionData } from 'discord.js';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Gets PokéDex entries for the chosen Pokémon.'
})
export class SlashCommand extends DragoniteCommand {
  readonly #spriteChoices: [name: string, value: PokemonSpriteTypes][] = [
    ['Regular Sprite', 'sprite'],
    ['Regular Back Sprite', 'backSprite'],
    ['Shiny Sprite', 'shinySprite'],
    ['Shiny Back Sprite', 'shinyBackSprite']
  ];

  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder //
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((option) =>
            option //
              .setName('pokemon')
              .setDescription('The name of the Pokémon for which you want to get PokéDex entries.')
              .setRequired(true)
              .setAutocomplete(true)
          )
          .addStringOption((option) =>
            option //
              .setName('sprite')
              .setDescription('The sprite that you want the result to show.')
              .setChoices(this.#spriteChoices)
          ),
      { guildIds: getGuildIds(), idHints: ['970121158953414706', '942137488883978251'] }
    );
  }

  public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
    await interaction.deferReply();

    const pokemon = interaction.options.getString('pokemon', true);
    const spriteToGet: PokemonSpriteTypes = (interaction.options.getString('sprite') as PokemonSpriteTypes | null) ?? 'sprite';

    const pokemonDetails = await this.container.gqlClient.getFlavors(pokemon as PokemonEnum);

    if (isNullish(pokemonDetails)) {
      const fuzzyPokemon = await this.container.gqlClient.fuzzilySearchPokemon(pokemon, 25);
      const options = fuzzyPokemon.map<MessageSelectOptionData>((fuzzyEntry) => fuzzyPokemonToSelectOption(fuzzyEntry, 'label'));

      const metadata = compressPokemonCustomIdMetadata({
        type: 'flavor',
        spriteToGet
      });

      const customIdStringified = `${SelectMenuCustomIds.Pokemon}|${metadata}`;

      const messageActionRow = new MessageActionRow() //
        .setComponents(
          new MessageSelectMenu() //
            .setCustomId(customIdStringified)
            .setPlaceholder('Choose the Pokémon you want to get information about.')
            .setOptions(options)
        );

      await interaction.deleteReply();
      return interaction.followUp({
        content: 'I am sorry, but that query failed. Maybe you meant one of these?',
        components: [messageActionRow],
        ephemeral: true
      });
    }

    const paginatedMessage = flavorResponseBuilder(pokemonDetails, spriteToGet);

    return paginatedMessage.run(interaction);
  }
}
