import { parseRedisOption } from '#root/config';
import { secondsFromMilliseconds } from '#utils/functions/time';
import type {
  AbilitiesEnum,
  Ability,
  Item,
  ItemsEnum,
  Learnset,
  Move,
  MovesEnum,
  Nature,
  NaturesEnum,
  Pokemon,
  PokemonEnum,
  TypeMatchup,
  TypesEnum
} from '@favware/graphql-pokemon';
import { Result } from '@sapphire/framework';
import { Time } from '@sapphire/timestamp';
import { isNullish } from '@sapphire/utilities';
import { envParseInteger } from '@skyra/env-utilities';
import { Redis } from 'ioredis';

export const enum RedisKeys {
  GetAbility = 'getAbility',
  GetItem = 'getItem',
  GetNature = 'getNature',
  GetMove = 'getMove',
  GetFlavors = 'getFlavors',
  GetPokemon = 'getPokemon',
  GetSprites = 'getSprites',
  GetLearnset = 'getLearnset',
  GetTypeMatchup = 'getTypeMatchup',
  GetAllSpecies = 'getAllSpecies'
}

export class RedisCacheClient extends Redis {
  public constructor() {
    super({
      ...parseRedisOption(),
      db: envParseInteger('REDIS_CACHE_DB')
    });
  }

  public async fetch<K extends RedisKeys>(key: K, query: RedisKeyQuery<K>) {
    const result = await Result.fromAsync(async () => {
      const raw = await this.get(`${key}:${query}`);

      if (isNullish(raw)) return raw;

      return JSON.parse(raw) as RedisData<K>;
    });

    return result.match({
      ok: (data) => data,
      err: () => null
    });
  }

  public insert<K extends RedisKeys>(key: K, query: RedisKeyQuery<K>, data: RedisData<K>) {
    return this.setex(`${key}:${query}`, secondsFromMilliseconds(Time.Minute * 5), JSON.stringify(data));
  }
}

type RedisKeyQuery<K extends RedisKeys> = K extends 'getAbility'
  ? AbilitiesEnum
  : K extends 'getItem'
    ? ItemsEnum
    : K extends 'getMove'
      ? MovesEnum
      : K extends 'getNature'
        ? NaturesEnum
        : K extends 'getFlavors'
          ? PokemonEnum
          : K extends 'getPokemon'
            ? PokemonEnum
            : K extends 'getSprites'
              ? PokemonEnum
              : K extends 'getLearnset'
                ? `${PokemonEnum}|${number}|${string}`
                : K extends 'getTypeMatchup'
                  ? `${TypesEnum}` | `${TypesEnum},${TypesEnum}`
                  : K extends 'getAllSpecies'
                    ? null
                    : never;

type RedisData<K extends RedisKeys> = K extends 'getAbility'
  ? Ability
  : K extends 'getItem'
    ? Item
    : K extends 'getMove'
      ? Move
      : K extends 'getNature'
        ? Nature
        : K extends 'getFlavors'
          ? Pokemon
          : K extends 'getPokemon'
            ? Pokemon
            : K extends 'getSprites'
              ? Pokemon
              : K extends 'getLearnset'
                ? Learnset
                : K extends 'getTypeMatchup'
                  ? TypeMatchup
                  : K extends 'getAllSpecies'
                    ? Omit<readonly Pokemon[], '__typename'>
                    : never;
