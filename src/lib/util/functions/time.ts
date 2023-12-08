import { roundNumber } from '@sapphire/utilities';

const OneSecond = 1_000;

/**
 * Converts a number of milliseconds to seconds.
 * @param milliseconds The amount of milliseconds
 * @returns The amount of seconds `milliseconds` equals to.
 */
export function secondsFromMilliseconds(milliseconds: number): number {
  return roundNumber(milliseconds / OneSecond);
}
