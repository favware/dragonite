import { DragoniteCommand } from '#lib/extensions/DragoniteCommand';
import { SelectMenuCustomIds, ZeroWidthSpace } from '#utils/constants';
import { moveResponseBuilder } from '#utils/responseBuilders/moveResponseBuilder';
import { getGuildIds } from '#utils/utils';
import type { MovesEnum } from '@favware/graphql-pokemon';
import { ApplyOptions } from '@sapphire/decorators';
import type { ChatInputCommand } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { MessageActionRow, MessageSelectMenu, type MessageSelectOptionData } from 'discord.js';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Gets data for the chosen Pokémon move.'
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
              .setName('move')
              .setDescription('The name of the move about which you want to get information.')
              .setRequired(true)
              .setAutocomplete(true)
          ),
      { guildIds: getGuildIds(), idHints: ['933109617364447252'] }
    );
  }

  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand['chatInputRun']>) {
    await interaction.deferReply();

    const move = interaction.options.getString('move', true);

    const moveDetails = await this.container.gqlClient.getMove(move as MovesEnum);

    if (isNullish(moveDetails)) {
      const fuzzyMoves = await this.container.gqlClient.fuzzilySearchMoves(move, 25);
      const options = fuzzyMoves.map<MessageSelectOptionData>((fuzzyMatch) => ({ label: fuzzyMatch.name, value: fuzzyMatch.key }));

      const messageActionRow = new MessageActionRow() //
        .setComponents(
          new MessageSelectMenu() //
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

    await interaction.deleteReply();

    const message = await interaction.channel!.send({ content: ZeroWidthSpace });
    await paginatedMessage.run(message, interaction.user);
    return message;
  }
}
