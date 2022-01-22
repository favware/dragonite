import { codeBlock } from '@sapphire/utilities';
import type { DiscordAPIError, HTTPError } from 'discord.js';

/**
 * Formats an error path line.
 * @param error The error to format.
 */
export function getPathLine(error: DiscordAPIError | HTTPError): string {
  return `**Path**: ${error.method.toUpperCase()} ${error.path}`;
}

/**
 * Formats an error code line.
 * @param error The error to format.
 */
export function getCodeLine(error: DiscordAPIError | HTTPError): string {
  return `**Code**: ${error.code}`;
}

/**
 * Formats an error codeblock.
 * @param error The error to format.
 */
export function getErrorLine(error: Error): string {
  return `**Error**: ${codeBlock('js', error.stack || error)}`;
}
