import { DragoniteCommand } from '#lib/extensions/DragoniteCommand';
import type { PokemonSelectMenuHandlerCustomIdStructure } from '#root/interaction-handlers/select-menus/pokemonSelectMenu';
import { SelectMenuCustomIds, ZeroWidthSpace } from '#utils/constants';
import { fuzzyPokemonToSelectOption } from '#utils/responseBuilders/pokemonResponseBuilder';
import { spriteResponseBuilder } from '#utils/responseBuilders/spriteResponseBuilder';
import { getGuildIds } from '#utils/utils';
import type { PokemonEnum } from '@favware/graphql-pokemon';
import { ApplyOptions } from '@sapphire/decorators';
import type { ChatInputCommand } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { MessageActionRow, MessageSelectMenu, type MessageSelectOptionData } from 'discord.js';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Gets sprites for the chosen Pokémon.'
})
export class SlashCommand extends DragoniteCommand {
  public override registerApplicationCommands(...[registry]: Parameters<ChatInputCommand['registerApplicationCommands']>) {
    registry.registerChatInputCommand(
      (builder) =>
        builder //
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((option) =>
            option //
              .setName('pokemon')
              .setDescription('The name of the Pokémon for which you want to get the sprites.')
              .setRequired(true)
              .setAutocomplete(true)
          ),
      { guildIds: getGuildIds(), idHints: ['933135650629222420'] }
    );
  }

  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand['chatInputRun']>) {
    await interaction.deferReply();

    const pokemon = interaction.options.getString('pokemon', true);

    const pokemonDetails = await this.container.gqlClient.getFlavors(pokemon as PokemonEnum);

    if (isNullish(pokemonDetails)) {
      const fuzzyPokemon = await this.container.gqlClient.fuzzilySearchPokemon(pokemon, 25);
      const options = fuzzyPokemon.map<MessageSelectOptionData>((fuzzyEntry) => fuzzyPokemonToSelectOption(fuzzyEntry, 'label'));

      const messageActionRow = new MessageActionRow() //
        .setComponents(
          new MessageSelectMenu() //
            .setCustomId(`${SelectMenuCustomIds.Pokemon}|sprite` as PokemonSelectMenuHandlerCustomIdStructure)
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

    await interaction.deleteReply();

    const message = await interaction.channel!.send({ content: ZeroWidthSpace });
    await paginatedMessage.run(message, interaction.user);
    return message;
  }
}
