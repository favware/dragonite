import { SelectMenuCustomIds } from '#utils/constants';
import { moveResponseBuilder } from '#utils/responseBuilders/moveResponseBuilder';
import type { MovesEnum } from '@favware/graphql-pokemon';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes, UserError } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import type { StringSelectMenuInteraction } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
  interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class SelectMenuHandler extends InteractionHandler {
  public override run(interaction: StringSelectMenuInteraction, result: InteractionHandler.ParseResult<this>) {
    if (isNullish(result.moveDetails)) {
      throw new UserError({
        identifier: 'MoveQueryFail',
        message: `I am sorry, but that query failed. Are you sure ${result.move} is actually a move in Pokémon?`
      });
    }

    const paginatedMessage = moveResponseBuilder(result.moveDetails);

    return paginatedMessage.run(interaction, interaction.user);
  }

  public override async parse(interaction: StringSelectMenuInteraction) {
    if (interaction.customId !== SelectMenuCustomIds.Move) return this.none();

    await interaction.deferReply();

    const move = interaction.values[0];

    const moveDetails = await this.container.gqlClient.getMove(move as MovesEnum);

    return this.some({ moveDetails, move });
  }
}
