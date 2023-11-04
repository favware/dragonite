import { DragoniteCommand } from '#lib/extensions/DragoniteCommand';
import { SelectMenuCustomIds } from '#utils/constants';
import { moveResponseBuilder } from '#utils/responseBuilders/moveResponseBuilder';
import type { MovesEnum } from '@favware/graphql-pokemon';
import { ApplyOptions } from '@sapphire/decorators';
import type { ChatInputCommand } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { ActionRowBuilder, StringSelectMenuBuilder, type APISelectMenuOption } from 'discord.js';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Gets data for the chosen Pokémon move.'
})
export class SlashCommand extends DragoniteCommand {
  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder //
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option //
            .setName('move')
            .setDescription('The name of the move about which you want to get information.')
            .setRequired(true)
            .setAutocomplete(true)
        )
    );
  }

  public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
    await interaction.deferReply();

    const move = interaction.options.getString('move', true);

    const moveDetails = await this.container.gqlClient.getMove(move as MovesEnum);

    if (isNullish(moveDetails)) {
      const fuzzyMoves = await this.container.gqlClient.fuzzilySearchMoves(move, 25);
      const options = fuzzyMoves.map<APISelectMenuOption>((fuzzyMatch) => ({ label: fuzzyMatch.name, value: fuzzyMatch.key }));

      const messageActionRow = new ActionRowBuilder<StringSelectMenuBuilder>() //
        .setComponents(
          new StringSelectMenuBuilder() //
            .setCustomId(SelectMenuCustomIds.Move)
            .setPlaceholder('Choose the move you want to get information about.')
            .setOptions(options)
        );

      await interaction.deleteReply();
      return interaction.followUp({
        content: 'I am sorry, but that query failed. Maybe you meant one of these?',
        components: [messageActionRow],
        ephemeral: true
      });
    }

    const paginatedMessage = moveResponseBuilder(moveDetails);

    return paginatedMessage.run(interaction);
  }
}
