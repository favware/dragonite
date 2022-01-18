import { SelectMenuCustomIds } from '#utils/constants';
import { abilityResponseBuilder } from '#utils/functions/responseBuilders';
import type { AbilitiesEnum } from '@favware/graphql-pokemon';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes, UserError } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import type { SelectMenuInteraction } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
  interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class AbilitySelectMenu extends InteractionHandler {
  public override async run(interaction: SelectMenuInteraction, result: InteractionHandler.ParseResult<this>) {
    if (isNullish(result.abilityDetails)) {
      throw new UserError({
        identifier: 'AbilityQueryFail',
        message: `I am sorry, but that query failed. Are you sure ${result.ability} is actually an ability in Pokémon?`
      });
    }

    return interaction.editReply({ embeds: abilityResponseBuilder(result.abilityDetails) });
  }

  public override async parse(interaction: SelectMenuInteraction) {
    if (interaction.customId !== SelectMenuCustomIds.Ability) return this.none();

    const ability = interaction.values[0];

    await interaction.deferReply();

    const abilityDetails = await this.container.gqlClient.getAbility(ability as AbilitiesEnum);

    return this.some({ abilityDetails, ability });
  }
}
