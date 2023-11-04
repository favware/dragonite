import { DragoniteCommand } from '#lib/extensions/DragoniteCommand';
import { SelectMenuCustomIds } from '#utils/constants';
import { compressPokemonCustomIdMetadata } from '#utils/pokemonCustomIdCompression';
import { flavorResponseBuilder } from '#utils/responseBuilders/flavorResponseBuilder';
import { fuzzyPokemonToSelectOption, type PokemonSpriteTypes } from '#utils/responseBuilders/pokemonResponseBuilder';
import type { PokemonEnum } from '@favware/graphql-pokemon';
import { ApplyOptions } from '@sapphire/decorators';
import type { ChatInputCommand } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { ActionRowBuilder, StringSelectMenuBuilder, type APIApplicationCommandOptionChoice, type APISelectMenuOption } from 'discord.js';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Gets PokéDex entries for the chosen Pokémon.'
})
export class SlashCommand extends DragoniteCommand {
  private readonly spriteChoices: APIApplicationCommandOptionChoice<PokemonSpriteTypes>[] = [
    { name: 'Regular Sprite', value: 'sprite' },
    { name: 'Regular Back Sprite', value: 'backSprite' },
    { name: 'Shiny Sprite', value: 'shinySprite' },
    { name: 'Shiny Back Sprite', value: 'shinyBackSprite' }
  ];

  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
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
            .setChoices(...this.spriteChoices)
        )
    );
  }

  public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
    await interaction.deferReply();

    const pokemon = interaction.options.getString('pokemon', true);
    const spriteToGet: PokemonSpriteTypes = (interaction.options.getString('sprite') as PokemonSpriteTypes | null) ?? 'sprite';

    const pokemonDetails = await this.container.gqlClient.getFlavors(pokemon as PokemonEnum);

    if (isNullish(pokemonDetails)) {
      const fuzzyPokemon = await this.container.gqlClient.fuzzilySearchPokemon(pokemon, 25);
      const options = fuzzyPokemon.map<APISelectMenuOption>((fuzzyEntry) => fuzzyPokemonToSelectOption(fuzzyEntry, 'label'));

      const metadata = compressPokemonCustomIdMetadata({
        type: 'flavor',
        spriteToGet
      });

      const customIdStringified = `${SelectMenuCustomIds.Pokemon}|${metadata}`;

      const messageActionRow = new ActionRowBuilder<StringSelectMenuBuilder>() //
        .setComponents(
          new StringSelectMenuBuilder() //
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
