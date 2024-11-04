import { DragoniteCommand } from '#lib/extensions/DragoniteCommand';
import { SelectMenuCustomIds } from '#utils/constants';
import { compressPokemonCustomIdMetadata } from '#utils/pokemonCustomIdCompression';
import { fuzzyPokemonToSelectOption } from '#utils/responseBuilders/pokemonResponseBuilder';
import { spriteResponseBuilder } from '#utils/responseBuilders/spriteResponseBuilder';
import type { PokemonEnum } from '@favware/graphql-pokemon';
import { ApplyOptions } from '@sapphire/decorators';
import type { ChatInputCommand } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { ActionRowBuilder, ApplicationIntegrationType, InteractionContextType, StringSelectMenuBuilder, type APISelectMenuOption } from 'discord.js';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Gets sprites for the chosen Pokémon.'
})
export class SlashCommand extends DragoniteCommand {
  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder //
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option //
            .setName('pokemon')
            .setDescription('The name of the Pokémon for which you want to get the sprites.')
            .setRequired(true)
            .setAutocomplete(true)
        )
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall)
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
    );
  }

  public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
    await interaction.deferReply();

    const pokemon = interaction.options.getString('pokemon', true);

    const pokemonDetails = await this.container.gqlClient.getSprites(pokemon as PokemonEnum);

    if (isNullish(pokemonDetails)) {
      const fuzzyPokemon = await this.container.gqlClient.fuzzilySearchPokemon(pokemon, 25);
      const options = fuzzyPokemon.map<APISelectMenuOption>((fuzzyEntry) => fuzzyPokemonToSelectOption(fuzzyEntry, 'label'));

      const metadata = compressPokemonCustomIdMetadata({
        type: 'sprite'
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

    const paginatedMessage = spriteResponseBuilder(pokemonDetails);

    return paginatedMessage.run(interaction);
  }
}
