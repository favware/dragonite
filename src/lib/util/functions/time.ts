import { Time } from '@sapphire/duration';
import { roundNumber } from '@sapphire/utilities';

/**
 * Converts a number of milliseconds to seconds.
 * @param milliseconds The amount of milliseconds
 * @returns The amount of seconds `milliseconds` equals to.
 */
export function secondsFromMilliseconds(milliseconds: number): number {
  return roundNumber(milliseconds / Time.Second);
}
