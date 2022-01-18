import { DragoniteCommand } from '#lib/extensions/DragoniteCommand';
import { SelectMenuCustomIds } from '#utils/constants';
import { itemResponseBuilder } from '#utils/functions/responseBuilders';
import { getGuildIds } from '#utils/utils';
import type { ItemsEnum } from '@favware/graphql-pokemon';
import { ApplyOptions } from '@sapphire/decorators';
import type { ChatInputCommand } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { MessageActionRow, MessageSelectMenu, type MessageSelectOptionData } from 'discord.js';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Gets data for the chosen Pokémon item.'
})
export class ItemCommand extends DragoniteCommand {
  public override registerApplicationCommands(...[registry]: Parameters<ChatInputCommand['registerApplicationCommands']>) {
    registry.registerChatInputCommand(
      (builder) =>
        builder //
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((option) =>
            option //
              .setName('item')
              .setDescription('The name of the item about which you want to get information.')
              .setRequired(true)
              .setAutocomplete(true)
          ),
      { guildIds: getGuildIds(), idHints: ['933083701787652107'] }
    );
  }

  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand['chatInputRun']>) {
    await interaction.deferReply();

    const item = interaction.options.getString('item', true);

    const itemDetails = await this.container.gqlClient.getItem(item as ItemsEnum);

    if (isNullish(itemDetails)) {
      const fuzzyItems = await this.container.gqlClient.fuzzilySearchItems(item, 25);
      const options = fuzzyItems.map<MessageSelectOptionData>((fuzzyMatch) => ({ label: fuzzyMatch.name, value: fuzzyMatch.key }));

      const messageActionRow = new MessageActionRow() //
        .setComponents(
          new MessageSelectMenu() //
            .setCustomId(SelectMenuCustomIds.Item)
            .setPlaceholder('Choose the item you want to get information about.')
            .setOptions(options)
        );

      await interaction.deleteReply();
      return interaction.followUp({
        content: 'I am sorry, but that query failed. Maybe you meant one of these?',
        components: [messageActionRow],
        ephemeral: true
      });
    }

    return interaction.editReply({ embeds: itemResponseBuilder(itemDetails) });
  }
}
