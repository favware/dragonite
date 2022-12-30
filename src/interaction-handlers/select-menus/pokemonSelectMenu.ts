import { SelectMenuCustomIds } from '#utils/constants';
import { decompressPokemonCustomIdMetadata } from '#utils/pokemonCustomIdCompression';
import { flavorResponseBuilder } from '#utils/responseBuilders/flavorResponseBuilder';
import { learnsetResponseBuilder } from '#utils/responseBuilders/learnsetResponseBuilder';
import { pokemonResponseBuilder } from '#utils/responseBuilders/pokemonResponseBuilder';
import { spriteResponseBuilder } from '#utils/responseBuilders/spriteResponseBuilder';
import type { Learnset, Pokemon, PokemonEnum } from '@favware/graphql-pokemon';
import { ApplyOptions } from '@sapphire/decorators';
import type { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { InteractionHandler, InteractionHandlerTypes, UserError } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import type { SelectMenuInteraction } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
  interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class SelectMenuHandler extends InteractionHandler {
  public override run(interaction: SelectMenuInteraction, result: InteractionHandler.ParseResult<this>) {
    if (isNullish(result.pokemonDetails)) {
      throw new UserError({
        identifier: 'PokemonQueryFail',
        message: `I am sorry, but that query failed. Are you sure ${result.pokemon} is actually a Pokémon?`
      });
    }

    let paginatedMessage: PaginatedMessage;

    switch (result.responseToGenerate) {
      case 'pokemon': {
        paginatedMessage = pokemonResponseBuilder(result.pokemonDetails as Omit<Pokemon, '__typename'>, result.spriteToGet);
        break;
      }
      case 'flavor': {
        paginatedMessage = flavorResponseBuilder(result.pokemonDetails as Omit<Pokemon, '__typename'>, result.spriteToGet);
        break;
      }
      case 'sprite': {
        paginatedMessage = spriteResponseBuilder(result.pokemonDetails as Omit<Pokemon, '__typename'>);
        break;
      }
      case 'learn': {
        paginatedMessage = learnsetResponseBuilder(
          result.pokemonDetails as Omit<Learnset, '__typename'>,
          result.moves,
          result.generation,
          result.spriteToGet
        );
      }
    }

    return paginatedMessage.run(interaction, interaction.user);
  }

  public override async parse(interaction: SelectMenuInteraction) {
    if (!interaction.customId.startsWith(SelectMenuCustomIds.Pokemon)) return this.none();

    await interaction.deferReply();

    const pokemon = interaction.values[0];
    const splitCustomId = interaction.customId.split('|');
    const data = decompressPokemonCustomIdMetadata(splitCustomId.slice(1).join('|'), {
      interaction,
      handler: this
    });

    const responseToGenerate = data.type;
    const spriteToGet = data.spriteToGet ?? 'sprite';
    const generation = data.generation ?? 9;
    const moves = data.moves ?? [];

    let pokemonDetails: Omit<Pokemon, '__typename'> | Omit<Learnset, '__typename'> | undefined;

    switch (responseToGenerate) {
      case 'pokemon': {
        pokemonDetails = await this.container.gqlClient.getPokemon(pokemon as PokemonEnum);
        break;
      }
      case 'flavor': {
        pokemonDetails = await this.container.gqlClient.getFlavors(pokemon as PokemonEnum);
        break;
      }
      case 'sprite': {
        pokemonDetails = await this.container.gqlClient.getSprites(pokemon as PokemonEnum);
        break;
      }
      case 'learn': {
        pokemonDetails = await this.container.gqlClient.getLearnset(pokemon as PokemonEnum, moves, generation);
      }
    }

    if (isNullish(pokemonDetails)) {
      return this.none();
    }

    return this.some({ pokemonDetails, pokemon, responseToGenerate, spriteToGet, generation, moves });
  }
}
