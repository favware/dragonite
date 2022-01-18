import { SelectMenuCustomIds, ZeroWidthSpace } from '#utils/constants';
import { flavorResponseBuilder } from '#utils/responseBuilders/flavorResponseBuilder';
import { pokemonResponseBuilder, PokemonSpriteTypes } from '#utils/responseBuilders/pokemonResponseBuilder';
import { spriteResponseBuilder } from '#utils/responseBuilders/spriteResponseBuilder';
import type { PokemonEnum } from '@favware/graphql-pokemon';
import { ApplyOptions } from '@sapphire/decorators';
import type { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { InteractionHandler, InteractionHandlerTypes, UserError } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import type { SelectMenuInteraction } from 'discord.js';

type ResponseToGenerate = 'pokemon' | 'flavor' | 'sprite';

export type PokemonSelectMenuHandlerCustomIdStructure =
  | `${SelectMenuCustomIds.Pokemon}|${ResponseToGenerate}`
  | `${SelectMenuCustomIds.Pokemon}|${ResponseToGenerate}|${PokemonSpriteTypes}`;

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

    let paginatedMessage: PaginatedMessage;

    switch (result.responseToGenerate) {
      case 'pokemon': {
        paginatedMessage = pokemonResponseBuilder(result.pokemonDetails, result.spriteToGet);
        break;
      }
      case 'flavor': {
        paginatedMessage = flavorResponseBuilder(result.pokemonDetails, result.spriteToGet);
        break;
      }
      case 'sprite': {
        paginatedMessage = spriteResponseBuilder(result.pokemonDetails);
        break;
      }
    }

    await interaction.deleteReply();

    const message = await interaction.channel!.send({ content: ZeroWidthSpace });
    await paginatedMessage.run(message, interaction.user);
    return message;
  }

  public override async parse(interaction: SelectMenuInteraction) {
    if (!interaction.customId.startsWith(SelectMenuCustomIds.Pokemon)) return this.none();

    const pokemon = interaction.values[0];
    const customIdDecrypted = interaction.customId.split('|');
    const responseToGenerate = customIdDecrypted?.[1] as ResponseToGenerate;
    const spriteToGet = (customIdDecrypted?.[2] as PokemonSpriteTypes) ?? 'sprite';

    await interaction.deferReply();

    const pokemonDetails = await this.container.gqlClient.getPokemon(pokemon as PokemonEnum);

    return this.some({ pokemonDetails, pokemon, responseToGenerate, spriteToGet });
  }
}
