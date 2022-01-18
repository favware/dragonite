import { SelectMenuCustomIds, ZeroWidthSpace } from '#utils/constants';
import { pokemonResponseBuilder, PokemonSpriteTypes } from '#utils/responseBuilders/pokemonResponseBuilder';
import type { PokemonEnum } from '@favware/graphql-pokemon';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes, UserError } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import type { SelectMenuInteraction } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
  interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class SelectMenuHandler extends InteractionHandler {
  public override async run(interaction: SelectMenuInteraction, result: InteractionHandler.ParseResult<this>) {
    if (isNullish(result.pokemonDetails)) {
      throw new UserError({
        identifier: 'PokemonQueryFail',
        message: `I am sorry, but that query failed. Are you sure ${result.pokemon} is actually a Pokémon?`
      });
    }

    const paginatedMessage = pokemonResponseBuilder(result.pokemonDetails, result.spriteToGet);

    await interaction.deleteReply();

    const message = await interaction.channel!.send({ content: ZeroWidthSpace });
    await paginatedMessage.run(message, interaction.user);
    return message;
  }

  public override async parse(interaction: SelectMenuInteraction) {
    if (!interaction.customId.startsWith(SelectMenuCustomIds.Pokemon)) return this.none();

    const pokemon = interaction.values[0];
    const spriteToGet: PokemonSpriteTypes = (interaction.customId.split('|')?.[1] as PokemonSpriteTypes | null) ?? 'sprite';

    await interaction.deferReply();

    const pokemonDetails = await this.container.gqlClient.getPokemon(pokemon as PokemonEnum);

    return this.some({ pokemonDetails, pokemon, spriteToGet });
  }
}
