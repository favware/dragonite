import { getFuzzyAbility, getFuzzyItem, getFuzzyMove, getFuzzyPokemon } from '#gql/fuzzyQueries';
import { envParseString } from '#lib/env';
import { getAbility, getFlavorTexts, getItem, getLearnset, getMove, getPokemon, getPokemonSprites, getTypeMatchup } from '#lib/gql/queries';
import { RedisKeys } from '#lib/redis-cache/RedisCacheClient';
import { FavouredAbilities, FavouredItems, FavouredMoves, FavouredPokemon } from '#utils/favouredEntries';
import { hideLinkEmbed } from '@discordjs/builders';
import type {
  AbilitiesEnum,
  ItemsEnum,
  MovesEnum,
  PokemonEnum,
  Query,
  QueryGetAbilityArgs,
  QueryGetFuzzyAbilityArgs,
  QueryGetFuzzyItemArgs,
  QueryGetFuzzyMoveArgs,
  QueryGetFuzzyPokemonArgs,
  QueryGetItemArgs,
  QueryGetLearnsetArgs,
  QueryGetMoveArgs,
  QueryGetPokemonArgs,
  QueryGetTypeMatchupArgs,
  TypesEnum
} from '@favware/graphql-pokemon';
import { fetch, FetchMethods, FetchResultTypes } from '@sapphire/fetch';
import { container, fromAsync, isErr, UserError } from '@sapphire/framework';
import os from 'node:os';

export class GqlClient {
  #uri = envParseString('POKEMON_API_URL');

  #userAgent = `Favware Dragonite/1.0.0 (apollo-client) ${os.platform()}/${os.release()}`;

  public async getAbility(ability: AbilitiesEnum) {
    const result = await fromAsync(async () => {
      const abilityFromCache = await container.gqlRedisCache.fetch<RedisKeys.GetAbility>(RedisKeys.GetAbility, ability);
      if (abilityFromCache) return abilityFromCache;

      const apiResult = await this.fetchGraphQLPokemon<'getAbility'>(getAbility, { ability });
      return apiResult.data.getAbility;
    });

    if (isErr(result)) return;

    await container.gqlRedisCache.insert<RedisKeys.GetAbility>(
      RedisKeys.GetAbility, //
      ability,
      result.value
    );

    return result.value;
  }

  public async getItem(item: ItemsEnum) {
    const result = await fromAsync(async () => {
      const itemFromCache = await container.gqlRedisCache.fetch<RedisKeys.GetItem>(RedisKeys.GetItem, item);
      if (itemFromCache) return itemFromCache;

      const apiResult = await this.fetchGraphQLPokemon<'getItem'>(getItem, { item });
      return apiResult.data.getItem;
    });

    if (isErr(result)) return;

    await container.gqlRedisCache.insert<RedisKeys.GetItem>(
      RedisKeys.GetItem, //
      item,
      result.value
    );

    return result.value;
  }

  public async getMove(move: MovesEnum) {
    const result = await fromAsync(async () => {
      const moveFromCache = await container.gqlRedisCache.fetch<RedisKeys.GetMove>(RedisKeys.GetMove, move);
      if (moveFromCache) return moveFromCache;

      const apiResult = await this.fetchGraphQLPokemon<'getMove'>(getMove, { move });
      return apiResult.data.getMove;
    });

    if (isErr(result)) return;

    await container.gqlRedisCache.insert<RedisKeys.GetMove>(
      RedisKeys.GetMove, //
      move,
      result.value
    );

    return result.value;
  }

  public async getFlavors(pokemon: PokemonEnum) {
    const result = await fromAsync(async () => {
      const pokemonFromCache = await container.gqlRedisCache.fetch<RedisKeys.GetFlavors>(RedisKeys.GetFlavors, pokemon);
      if (pokemonFromCache) return pokemonFromCache;

      const apiResult = await this.fetchGraphQLPokemon<'getPokemon'>(getFlavorTexts, { pokemon });
      return apiResult.data.getPokemon;
    });

    if (isErr(result)) return;

    await container.gqlRedisCache.insert<RedisKeys.GetFlavors>(
      RedisKeys.GetFlavors, //
      pokemon,
      result.value
    );

    return result.value;
  }

  public async getPokemon(pokemon: PokemonEnum) {
    const result = await fromAsync(async () => {
      const pokemonFromCache = await container.gqlRedisCache.fetch<RedisKeys.GetPokemon>(RedisKeys.GetPokemon, pokemon);
      if (pokemonFromCache) return pokemonFromCache;

      const apiResult = await this.fetchGraphQLPokemon<'getPokemon'>(getPokemon, { pokemon });
      return apiResult.data.getPokemon;
    });

    if (isErr(result)) return;

    await container.gqlRedisCache.insert<RedisKeys.GetPokemon>(
      RedisKeys.GetPokemon, //
      pokemon,
      result.value
    );

    return result.value;
  }

  public async getSprites(pokemon: PokemonEnum) {
    const result = await fromAsync(async () => {
      const pokemonFromCache = await container.gqlRedisCache.fetch<RedisKeys.GetSprites>(RedisKeys.GetSprites, pokemon);
      if (pokemonFromCache) return pokemonFromCache;

      const apiResult = await this.fetchGraphQLPokemon<'getPokemon'>(getPokemonSprites, { pokemon });
      return apiResult.data.getPokemon;
    });

    if (isErr(result)) return;

    await container.gqlRedisCache.insert<RedisKeys.GetSprites>(
      RedisKeys.GetSprites, //
      pokemon,
      result.value
    );

    return result.value;
  }

  public async getLearnset(pokemon: PokemonEnum, moves: MovesEnum[], generation = 8) {
    const result = await fromAsync(async () => {
      const learnsetFromCache = await container.gqlRedisCache.fetch<RedisKeys.GetLearnset>(
        RedisKeys.GetLearnset,
        `${pokemon}|${generation}|${moves.join(',')}`
      );
      if (learnsetFromCache) return learnsetFromCache;

      const apiResult = await this.fetchGraphQLPokemon<'getLearnset'>(getLearnset, { pokemon, moves, generation });
      return apiResult.data.getLearnset;
    });

    if (isErr(result)) return;

    await container.gqlRedisCache.insert<RedisKeys.GetLearnset>(
      RedisKeys.GetLearnset, //
      `${pokemon}|${generation}|${moves.join(',')}`,
      result.value
    );

    return result.value;
  }

  public async getTypeMatchup(types: TypesEnum[]) {
    const result = await fromAsync(async () => {
      const typeMatchupFromCache = await container.gqlRedisCache.fetch<RedisKeys.GetTypeMatchup>(
        RedisKeys.GetTypeMatchup,
        types.length === 1 ? types[0] : `${types[0]},${types[1]}`
      );
      if (typeMatchupFromCache) return typeMatchupFromCache;

      const apiResult = await this.fetchGraphQLPokemon<'getTypeMatchup'>(getTypeMatchup, { types });

      return apiResult.data.getTypeMatchup;
    });

    if (isErr(result)) return;

    await container.gqlRedisCache.insert<RedisKeys.GetTypeMatchup>(
      RedisKeys.GetTypeMatchup, //
      types.length === 1 ? types[0] : `${types[0]},${types[1]}`,
      result.value
    );

    return result.value;
  }

  public async fuzzilySearchAbilities(ability: string, take = 20) {
    const result = await fromAsync(async () => {
      const apiResult = await this.fetchGraphQLPokemon<'getFuzzyAbility'>(getFuzzyAbility, { ability, take });
      return apiResult.data.getFuzzyAbility;
    });

    if (isErr(result)) {
      return FavouredAbilities;
    }

    return result.value;
  }

  public async fuzzilySearchItems(item: string, take = 20) {
    const result = await fromAsync(async () => {
      const apiResult = await this.fetchGraphQLPokemon<'getFuzzyItem'>(getFuzzyItem, { item, take });
      return apiResult.data.getFuzzyItem;
    });

    if (isErr(result)) {
      return FavouredItems;
    }

    return result.value;
  }

  public async fuzzilySearchMoves(move: string, take = 20) {
    const result = await fromAsync(async () => {
      const apiResult = await this.fetchGraphQLPokemon<'getFuzzyMove'>(getFuzzyMove, { move, take });
      return apiResult.data.getFuzzyMove;
    });

    if (isErr(result)) {
      return FavouredMoves;
    }

    return result.value;
  }

  public async fuzzilySearchPokemon(pokemon: string, take = 20, includeSpecialPokemon = true) {
    const result = await fromAsync(async () => {
      const apiResult = await this.fetchGraphQLPokemon<'getFuzzyPokemon'>(getFuzzyPokemon, { pokemon, take });
      return apiResult.data.getFuzzyPokemon;
    });

    if (isErr(result)) {
      return FavouredPokemon;
    }

    if (!includeSpecialPokemon) {
      const filteredPokemon = result.value.filter((pokemon) => !pokemon.forme && pokemon.num >= 0);

      if (!filteredPokemon.length) return FavouredPokemon;
      return filteredPokemon;
    }

    return result.value;
  }

  private async fetchGraphQLPokemon<R extends PokemonQueryReturnTypes>(
    query: string,
    variables: PokemonQueryVariables<R>
  ): Promise<PokemonResponse<R>> {
    const result = await fromAsync(async () =>
      fetch<PokemonResponse<R>>(
        this.#uri,
        {
          method: FetchMethods.Post,
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': this.#userAgent
          },
          body: JSON.stringify({
            query,
            variables
          })
        },
        FetchResultTypes.JSON
      )
    );

    if (isErr(result)) {
      throw new UserError({
        identifier: 'QueryFail',
        message: `Oh dear, I failed to get data about that query. Please try again. If the issue keeps showing up, you can get in touch with the developers by joining my support server through ${hideLinkEmbed(
          'https://join.favware.tech'
        )}`
      });
    }

    return result.value;
  }
}

export namespace DragoniteGqlClient {
  export type Response<K extends keyof Omit<Query, '__typename'>> = PokemonResponse<K>;
  export type QueryReturnTypes = PokemonQueryReturnTypes;
}

interface PokemonResponse<K extends keyof Omit<Query, '__typename'>> {
  data: Record<K, Omit<Query[K], '__typename'>>;
}

type PokemonQueryReturnTypes = keyof Pick<
  Query,
  | 'getAbility'
  | 'getFuzzyAbility'
  | 'getItem'
  | 'getMove'
  | 'getPokemon'
  | 'getLearnset'
  | 'getTypeMatchup'
  | 'getFuzzyItem'
  | 'getFuzzyMove'
  | 'getFuzzyPokemon'
>;

type PokemonQueryVariables<R extends PokemonQueryReturnTypes> = R extends 'getAbility'
  ? QueryGetAbilityArgs
  : R extends 'getFuzzyAbility'
  ? QueryGetFuzzyAbilityArgs
  : R extends 'getItem'
  ? QueryGetItemArgs
  : R extends 'getFuzzyItem'
  ? QueryGetFuzzyItemArgs
  : R extends 'getMove'
  ? QueryGetMoveArgs
  : R extends 'getFuzzyMove'
  ? QueryGetFuzzyMoveArgs
  : R extends 'getPokemon'
  ? QueryGetPokemonArgs
  : R extends 'getFuzzyPokemon'
  ? QueryGetFuzzyPokemonArgs
  : R extends 'getLearnset'
  ? QueryGetLearnsetArgs
  : R extends 'getTypeMatchup'
  ? QueryGetTypeMatchupArgs
  : never;
