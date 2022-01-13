import type { DragoniteEnv, DragoniteEnvAny, DragoniteEnvBoolean, DragoniteEnvInteger, DragoniteEnvString } from '#lib/env/types';
import { isNullishOrEmpty } from '@sapphire/utilities';

export function envParseInteger(key: DragoniteEnvInteger, defaultValue?: number): number {
  const value = process.env[key];
  if (isNullishOrEmpty(value)) {
    if (defaultValue === undefined) throw new Error(`[ENV] ${key} - The key must be an integer, but is empty or undefined.`);
    return defaultValue;
  }

  const integer = Number(value);
  if (Number.isInteger(integer)) return integer;
  throw new Error(`[ENV] ${key} - The key must be an integer, but received '${value}'.`);
}

export function envParseBoolean(key: DragoniteEnvBoolean, defaultValue?: boolean): boolean {
  const value = process.env[key];
  if (isNullishOrEmpty(value)) {
    if (defaultValue === undefined) throw new Error(`[ENV] ${key} - The key must be a boolean, but is empty or undefined.`);
    return defaultValue;
  }

  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(`[ENV] ${key} - The key must be a boolean, but received '${value}'.`);
}

export function envParseString<K extends DragoniteEnvString>(key: K, defaultValue?: DragoniteEnv[K]): DragoniteEnv[K] {
  const value = process.env[key];
  if (isNullishOrEmpty(value)) {
    if (defaultValue === undefined) throw new Error(`[ENV] ${key} - The key must be a string, but is empty or undefined.`);
    return defaultValue;
  }

  return value;
}

export function envParseArray(key: DragoniteEnvString, defaultValue?: string[]): string[] {
  const value = process.env[key];
  if (isNullishOrEmpty(value)) {
    if (defaultValue === undefined) throw new Error(`[ENV] ${key} - The key must be an array, but is empty or undefined.`);
    return defaultValue;
  }

  return value.split(' ');
}

export function envIsDefined(...keys: readonly DragoniteEnvAny[]): boolean {
  return keys.every((key) => !isNullishOrEmpty(process.env[key]));
}
