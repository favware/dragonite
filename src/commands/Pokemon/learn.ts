import { DragoniteCommand } from '#lib/extensions/DragoniteCommand';
import { SelectMenuCustomIds } from '#utils/constants';
import { learnsetResponseBuilder } from '#utils/responseBuilders/learnsetResponseBuilder';
import { fuzzyPokemonToSelectOption, PokemonSpriteTypes } from '#utils/responseBuilders/pokemonResponseBuilder';
import { compressPokemonCustomIdMetadata, getGuildIds } from '#utils/utils';
import type { MovesEnum, PokemonEnum } from '@favware/graphql-pokemon';
import { ApplyOptions } from '@sapphire/decorators';
import type { ChatInputCommand } from '@sapphire/framework';
import { filterNullish, isNullish } from '@sapphire/utilities';
import { MessageActionRow, MessageSelectMenu, type MessageSelectOptionData } from 'discord.js';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Tells you whether the chosen Pokémon can learn the chosen move or moves.'
})
export class SlashCommand extends DragoniteCommand {
  readonly #spriteChoices: [name: string, value: PokemonSpriteTypes][] = [
    ['Regular Sprite', 'sprite'],
    ['Regular Back Sprite', 'backSprite'],
    ['Shiny Sprite', 'shinySprite'],
    ['Shiny Back Sprite', 'shinyBackSprite']
  ];

  readonly #generationChoices: [name: string, value: number][] = [
    ['Generation 1', 1],
    ['Generation 2', 2],
    ['Generation 3', 3],
    ['Generation 4', 4],
    ['Generation 5', 5],
    ['Generation 6', 6],
    ['Generation 7', 7],
    ['Generation 8', 8]
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
              .setDescription('The name of the Pokémon for whom you want to check if they learn a move.')
              .setRequired(true)
              .setAutocomplete(true)
          )
          .addStringOption((option) =>
            option //
              .setName('move-1')
              .setDescription('The name of the move that you want to check if the Pokémon learns.')
              .setRequired(true)
              .setAutocomplete(true)
          )
          .addStringOption((option) =>
            option //
              .setName('move-2')
              .setDescription('An optional second move name that you want to check if the Pokémon learns.')
              .setAutocomplete(true)
          )
          .addStringOption((option) =>
            option //
              .setName('move-3')
              .setDescription('An optional third move name that you want to check if the Pokémon learns.')
              .setAutocomplete(true)
          )
          .addIntegerOption((option) =>
            option //
              .setName('generation')
              .setDescription('The Pokémon generation that you want to check in if the Pokémon learns the move.')
              .setChoices(this.#generationChoices)
          )
          .addStringOption((option) =>
            option //
              .setName('sprite')
              .setDescription('The sprite that you want the result to show.')
              .setChoices(this.#spriteChoices)
          ),
      { guildIds: getGuildIds(), idHints: ['936023594109108265', '942137402686857248'] }
    );
  }

  public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
    await interaction.deferReply();

    const pokemon = interaction.options.getString('pokemon', true);
    const move1 = interaction.options.getString('move-1', true);
    const move2 = interaction.options.getString('move-2');
    const move3 = interaction.options.getString('move-3');
    const generation = interaction.options.getInteger('generation') ?? 8;
    const spriteToGet: PokemonSpriteTypes = (interaction.options.getString('sprite') as PokemonSpriteTypes | null) ?? 'sprite';

    const actuallyChosenMoves = [move1 as MovesEnum, move2 as MovesEnum, move3 as MovesEnum].filter(filterNullish);

    const learnsetDetails = await this.container.gqlClient.getLearnset(pokemon as PokemonEnum, actuallyChosenMoves, generation);

    if (isNullish(learnsetDetails)) {
      const fuzzyPokemon = await this.container.gqlClient.fuzzilySearchPokemon(pokemon, 25, false);
      const options = fuzzyPokemon.map<MessageSelectOptionData>((fuzzyEntry) => fuzzyPokemonToSelectOption(fuzzyEntry, 'label'));

      const metadata = compressPokemonCustomIdMetadata(
        {
          type: 'learn',
          spriteToGet,
          generation,
          moves: actuallyChosenMoves
        },
        'Please try with fewer, or different moves. '
      );

      const customIdStringified = `${SelectMenuCustomIds.Pokemon}|${metadata}`;

      const messageActionRow = new MessageActionRow() //
        .setComponents(
          new MessageSelectMenu() //
            .setCustomId(customIdStringified)
            .setPlaceholder('Choose the Pokémon you want to check these moves for.')
            .setOptions(options)
        );

      await interaction.deleteReply();
      return interaction.followUp({
        content: 'I am sorry, but that query failed. Maybe you want to try those moves for any of these Pokémon?',
        components: [messageActionRow],
        ephemeral: true
      });
    }

    const paginatedMessage = learnsetResponseBuilder(learnsetDetails, actuallyChosenMoves, generation, spriteToGet);

    return paginatedMessage.run(interaction);
  }
}
