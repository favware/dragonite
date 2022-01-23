import { moveResponseBuilder } from '#utils/responseBuilders/moveResponseBuilder';
import { decompressPokemonCustomIdMetadata } from '#utils/utils';
import type { MovesEnum } from '@favware/graphql-pokemon';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes, UserError } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import type { SelectMenuInteraction } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
  interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class SelectMenuHandler extends InteractionHandler {
  public override run(interaction: SelectMenuInteraction, result: InteractionHandler.ParseResult<this>) {
    if (isNullish(result.moveDetails)) {
      throw new UserError({
        identifier: 'MoveQueryFail',
        message: `I am sorry, but that query failed. Are you sure ${result.move} is actually a move in Pokémon?`
      });
    }

    const paginatedMessage = moveResponseBuilder(result.moveDetails);

    return paginatedMessage.run(interaction, interaction.user);
  }

  public override async parse(interaction: SelectMenuInteraction) {
    const data = decompressPokemonCustomIdMetadata(interaction.customId, { interaction, handler: this });

    if (data.type !== 'move') return this.none();

    await interaction.deferReply();

    const move = interaction.values[0];

    const moveDetails = await this.container.gqlClient.getMove(move as MovesEnum);

    return this.some({ moveDetails, move });
  }
}
