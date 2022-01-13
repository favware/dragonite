import { envParseString } from '#lib/env';
import { hideLinkEmbed } from '@discordjs/builders';
import type {
  Query,
  QueryGetAbilityArgs,
  QueryGetItemArgs,
  QueryGetLearnsetArgs,
  QueryGetMoveArgs,
  QueryGetPokemonArgs,
  QueryGetTypeMatchupArgs
} from '@favware/graphql-pokemon';
import { fetch, FetchMethods, FetchResultTypes } from '@sapphire/fetch';
import { fromAsync, isErr, UserError } from '@sapphire/framework';
import os from 'node:os';

export class DragoniteGqlClient {
  #uri = envParseString('POKEMON_API_URL');

  #userAgent = `Favware Dragonite/1.0.0 (apollo-client) ${os.platform()}/${os.release()}`;

  /**
   * Parses a Bulbapedia-like URL to be properly embeddable on Discord
   * @param url URL to parse
   */
  public parseBulbapediaURL = (url: string) => url.replace(/[ ]/g, '_').replace(/\(/g, '%28').replace(/\)/g, '%29');

  /** Parses PokéDex colours to Discord MessageEmbed colours */
  public resolveColour = (col: string) => {
    switch (col) {
      case 'Black':
        return 0x323232;
      case 'Blue':
        return 0x257cff;
      case 'Brown':
        return 0xa3501a;
      case 'Gray':
        return 0x969696;
      case 'Green':
        return 0x3eff4e;
      case 'Pink':
        return 0xff65a5;
      case 'Purple':
        return 0xa63de8;
      case 'Red':
        return 0xff3232;
      case 'White':
        return 0xe1e1e1;
      case 'Yellow':
        return 0xfff359;
      default:
        return 0xff0000;
    }
  };

  public async fetchGraphQLPokemon<R extends PokemonQueryReturnTypes>(
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

type PokemonQueryReturnTypes = keyof Pick<Query, 'getAbility' | 'getItem' | 'getMove' | 'getPokemon' | 'getLearnset' | 'getTypeMatchup'>;

type PokemonQueryVariables<R extends PokemonQueryReturnTypes> = R extends 'getAbility'
  ? QueryGetAbilityArgs
  : R extends 'getItem'
  ? QueryGetItemArgs
  : R extends 'getMove'
  ? QueryGetMoveArgs
  : R extends 'getPokemon'
  ? QueryGetPokemonArgs
  : R extends 'getLearnset'
  ? QueryGetLearnsetArgs
  : R extends 'getTypeMatchup'
  ? QueryGetTypeMatchupArgs
  : never;
