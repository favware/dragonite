import { SelectMenuCustomIds } from '#utils/constants';
import { itemResponseBuilder } from '#utils/functions/responseBuilders';
import type { ItemsEnum } from '@favware/graphql-pokemon';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes, UserError } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import type { SelectMenuInteraction } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
  interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class ItemSelectMenu extends InteractionHandler {
  public override async run(interaction: SelectMenuInteraction, result: InteractionHandler.ParseResult<this>) {
    if (isNullish(result.itemDetails)) {
      throw new UserError({
        identifier: 'ItemQueryFail',
        message: `I am sorry, but that query failed. Are you sure ${result.item} is actually an item in Pokémon?`
      });
    }

    return interaction.editReply({ embeds: itemResponseBuilder(result.itemDetails) });
  }

  public override async parse(interaction: SelectMenuInteraction) {
    if (interaction.customId !== SelectMenuCustomIds.Item) return this.none();

    const item = interaction.values[0];

    await interaction.deferReply();

    const itemDetails = await this.container.gqlClient.getItem(item as ItemsEnum);

    return this.some({ itemDetails, item });
  }
}
