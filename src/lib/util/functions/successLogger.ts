import type { ChatInputCommandSuccessPayload, Command } from '@sapphire/framework';
import { cyan } from 'colorette';
import type { APIUser } from 'discord-api-types/v10';
import type { Guild, User } from 'discord.js';

function getShardInfo(id: number) {
  return `[${cyan(id.toString())}]`;
}

function getCommandInfo(command: Command) {
  return cyan(command.name);
}

function getAuthorInfo(author: User | APIUser) {
  return `${author.username}[${cyan(author.id)}]`;
}

function getGuildInfo(guild: Guild) {
  return `${guild.name}[${cyan(guild.id)}]`;
}

function getDuration(duration: number) {
  if (duration >= 1000) return `${(duration / 1000).toFixed(2)}s`;
  if (duration >= 1) return `${duration.toFixed(2)}ms`;
  return `${(duration * 1000).toFixed(2)}μs`;
}

export function getSuccessLoggerData({ interaction, command, duration }: ChatInputCommandSuccessPayload) {
  const shard = getShardInfo(interaction.guild?.shardId ?? 0);
  const commandName = getCommandInfo(command);
  const author = getAuthorInfo(interaction.user);
  const sentAt = interaction.guild ? getGuildInfo(interaction.guild) : '';
  const runtime = getDuration(duration);

  return { shard, commandName, author, sentAt, runtime };
}
