import { ChatInputCommandSuccessPayload, Command, container, ContextMenuCommandSuccessPayload } from '@sapphire/framework';
import { cyan } from 'colorette';
import type { APIUser, Guild, User } from 'discord.js';

export function handleChatInputOrContextMenuCommandSuccess(payload: ChatInputCommandSuccessPayload | ContextMenuCommandSuccessPayload) {
  const { author, commandName, sentAt, shard, runtime } = getSuccessLoggerData(payload);
  return container.logger.debug(`${shard} - ${commandName} ${author} ${sentAt} (${runtime})`);
}

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

function getSuccessLoggerData({ interaction, command, duration }: ChatInputCommandSuccessPayload | ContextMenuCommandSuccessPayload) {
  const shard = getShardInfo(interaction.guild?.shardId ?? 0);
  const commandName = getCommandInfo(command);
  const author = getAuthorInfo(interaction.user);
  const sentAt = interaction.guild ? getGuildInfo(interaction.guild) : '';
  const runtime = getDuration(duration);

  return { shard, commandName, author, sentAt, runtime };
}
