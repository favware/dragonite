import { DragoniteCommand } from '#lib/extensions/DragoniteCommand';
import { SelectMenuCustomIds } from '#utils/constants';
import { fuzzilyFindPokemonForMessageContent } from '#utils/fuzzilyFindPokemonForMessageContent';
import { compressPokemonCustomIdMetadata } from '#utils/pokemonCustomIdCompression';
import { fuzzyPokemonToSelectOption, pokemonResponseBuilder, PokemonSpriteTypes } from '#utils/responseBuilders/pokemonResponseBuilder';
import { getGuildIds } from '#utils/utils';
import type { PokemonEnum } from '@favware/graphql-pokemon';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, ContextMenuCommand, UserError } from '@sapphire/framework';
import { isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import {
  ActionRowBuilder,
  ApplicationCommandType,
  MessageContextMenuCommandInteraction,
  StringSelectMenuBuilder,
  type APIApplicationCommandOptionChoice,
  type APISelectMenuOption
} from 'discord.js';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Gets data for the chosen Pokémon.'
})
export class SlashCommand extends DragoniteCommand {
  readonly #spriteChoices: APIApplicationCommandOptionChoice<PokemonSpriteTypes>[] = [
    { name: 'Regular Sprite', value: 'sprite' },
    { name: 'Regular Back Sprite', value: 'backSprite' },
    { name: 'Shiny Sprite', value: 'shinySprite' },
    { name: 'Shiny Back Sprite', value: 'shinyBackSprite' }
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
              .setDescription('The name of the Pokémon about which you want to get information.')
              .setRequired(true)
              .setAutocomplete(true)
          )
          .addStringOption((option) =>
            option //
              .setName('sprite')
              .setDescription('The sprite that you want the result to show.')
              .setChoices(...this.#spriteChoices)
          ),
      { guildIds: getGuildIds() }
    );

    registry.registerContextMenuCommand(
      (builder) =>
        builder //
          .setName('Find Pokémon')
          .setType(ApplicationCommandType.Message),
      { guildIds: getGuildIds() }
    );
  }

  public override async contextMenuRun(interaction: ContextMenuCommand.Interaction) {
    if (interaction.isMessageContextMenuCommand()) {
      await interaction.deferReply();

      const messageContent = interaction.targetMessage.cleanContent;

      const pokemon = await fuzzilyFindPokemonForMessageContent(messageContent);

      if (isNullishOrEmpty(pokemon)) {
        throw new UserError({
          identifier: 'NoPokemonFoundInMessage',
          message: 'Looks like I was unable to find any Pokémon in your message. Are you sure you used the name of one?'
        });
      }

      return this.sendReply(pokemon, 'sprite', interaction);
    }

    throw new UserError({
      identifier: 'FindPokemonTriggeredOnUserContextMenu',
      message: 'Woaw, you somehow triggered this action from a User context menu, that should not be possible.'
    });
  }

  public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
    await interaction.deferReply();

    const pokemon = interaction.options.getString('pokemon', true);
    const spriteToGet: PokemonSpriteTypes = (interaction.options.getString('sprite') as PokemonSpriteTypes | null) ?? 'sprite';

    return this.sendReply(pokemon, spriteToGet, interaction);
  }

  private async sendReply(
    pokemon: string,
    spriteToGet: PokemonSpriteTypes,
    interaction: ChatInputCommand.Interaction | MessageContextMenuCommandInteraction
  ) {
    const pokemonDetails = await this.container.gqlClient.getPokemon(pokemon as PokemonEnum);

    if (isNullish(pokemonDetails)) {
      const fuzzyPokemon = await this.container.gqlClient.fuzzilySearchPokemon(pokemon, 25);
      const options = fuzzyPokemon.map<APISelectMenuOption>((fuzzyEntry) => fuzzyPokemonToSelectOption(fuzzyEntry, 'label'));

      const metadata = compressPokemonCustomIdMetadata({
        type: 'pokemon',
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

    const paginatedMessage = pokemonResponseBuilder(pokemonDetails, spriteToGet);

    return paginatedMessage.run(interaction);
  }
}
