import type { PaginatedMessage } from '#lib/PaginatedMessages/PaginatedMessage';
import { SelectMenuCustomIds } from '#utils/constants';
import { flavorResponseBuilder } from '#utils/responseBuilders/flavorResponseBuilder';
import { learnsetResponseBuilder } from '#utils/responseBuilders/learnsetResponseBuilder';
import { pokemonResponseBuilder, PokemonSpriteTypes } from '#utils/responseBuilders/pokemonResponseBuilder';
import { spriteResponseBuilder } from '#utils/responseBuilders/spriteResponseBuilder';
import type { Learnset, MovesEnum, Pokemon, PokemonEnum } from '@favware/graphql-pokemon';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes, UserError } from '@sapphire/framework';
import { isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import type { SelectMenuInteraction } from 'discord.js';

type ResponseToGenerate = 'pokemon' | 'flavor' | 'learn' | 'sprite';

export type PokemonSelectMenuHandlerCustomIdStructure =
  `${SelectMenuCustomIds.Pokemon}|${ResponseToGenerate}|${PokemonSpriteTypes}|${number}|${string}`;

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
    const customIdDecrypted = interaction.customId.split('|');
    const responseToGenerate = customIdDecrypted?.[1] as ResponseToGenerate;
    const spriteToGet = (customIdDecrypted?.[2] as PokemonSpriteTypes) ?? 'sprite';
    const generation = parseInt(customIdDecrypted?.[3], 10);
    const stringifiedMoves = customIdDecrypted?.[4];
    let moves: MovesEnum[] = [];

    if (!isNullishOrEmpty(stringifiedMoves)) {
      moves.push(...(stringifiedMoves.split(',') as MovesEnum[]));
    }

    if (!isNullishOrEmpty(moves)) {
      moves = moves.filter((move) => (move as string) !== 'undefined' && (move as string) !== 'null');
    }

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
