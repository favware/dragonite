import { DragoniteCommand } from '#lib/extensions/DragoniteCommand';
import { SelectMenuCustomIds } from '#utils/constants';
import { itemResponseBuilder } from '#utils/responseBuilders/itemResponseBuilder';
import { getGuildIds } from '#utils/utils';
import type { ItemsEnum } from '@favware/graphql-pokemon';
import { ApplyOptions } from '@sapphire/decorators';
import type { ChatInputCommand } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { ActionRowBuilder, StringSelectMenuBuilder, type APISelectMenuOption } from 'discord.js';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Gets data for the chosen Pokémon item.'
})
export class SlashCommand extends DragoniteCommand {
  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
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
      { guildIds: getGuildIds(), idHints: ['970121241795121202', '942137572665196574'] }
    );
  }

  public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
    await interaction.deferReply();

    const item = interaction.options.getString('item', true);

    const itemDetails = await this.container.gqlClient.getItem(item as ItemsEnum);

    if (isNullish(itemDetails)) {
      const fuzzyItems = await this.container.gqlClient.fuzzilySearchItems(item, 25);
      const options = fuzzyItems.map<APISelectMenuOption>((fuzzyMatch) => ({ label: fuzzyMatch.name, value: fuzzyMatch.key }));

      const messageActionRow = new ActionRowBuilder<StringSelectMenuBuilder>() //
        .setComponents(
          new StringSelectMenuBuilder() //
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
