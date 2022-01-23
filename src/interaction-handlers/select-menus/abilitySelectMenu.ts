import { abilityResponseBuilder } from '#utils/responseBuilders/abilityResponseBuilder';
import { decompressPokemonCustomIdMetadata } from '#utils/utils';
import type { AbilitiesEnum } from '@favware/graphql-pokemon';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes, UserError } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import type { SelectMenuInteraction } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
  interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class SelectMenuHandler extends InteractionHandler {
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
    const data = decompressPokemonCustomIdMetadata(interaction.customId, { interaction, handler: this });

    if (data.type !== 'ability') return this.none();

    await interaction.deferReply();

    const ability = interaction.values[0];

    const abilityDetails = await this.container.gqlClient.getAbility(ability as AbilitiesEnum);

    return this.some({ abilityDetails, ability });
  }
}
