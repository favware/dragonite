import { getGuildIds } from '#utils/utils';
import { ContextMenuCommandBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandRegistryRegisterOptions, ChatInputCommand, Command } from '@sapphire/framework';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { Permissions } from 'discord.js';

export abstract class DragoniteCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    const resolvedPermissions = new Permissions(options.requiredClientPermissions).add(PermissionFlagsBits.EmbedLinks);

    super(context, {
      requiredClientPermissions: resolvedPermissions,
      ...options
    });
  }

  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    if (this.registerChatInput) {
      const { builder: chatInputCommandBuilder, options: chatInputCommandOptions } = this.registerChatInput(new SlashCommandBuilder());
      registry.registerChatInputCommand(chatInputCommandBuilder, { guildIds: getGuildIds(), ...chatInputCommandOptions });
    }

    if (this.registerContextMenu) {
      const { builder: contextMenuCommandBuilder, options: contextMenuCommandOptions } = this.registerContextMenu(new ContextMenuCommandBuilder());
      registry.registerContextMenuCommand(contextMenuCommandBuilder, { guildIds: getGuildIds(), ...contextMenuCommandOptions });
    }
  }

  public registerChatInput?(builder: SlashCommandBuilder): RegisterChatInputReturnType;
  public registerContextMenu?(builder: ContextMenuCommandBuilder): RegisterContextMenuReturnType;
}

export interface RegisterChatInputReturnType {
  builder: SlashCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  options?: ApplicationCommandRegistryRegisterOptions;
}

export interface RegisterContextMenuReturnType {
  builder: ContextMenuCommandBuilder;
  options?: ApplicationCommandRegistryRegisterOptions;
}

export namespace DragoniteCommand {
  // DragoniteCommand unique types
  export type RegisterChatInput = RegisterChatInputReturnType;

  // Duplicates from Command, here for short-cutting on imports
  export type Options = Command.Options;
  export type JSON = Command.JSON;
  export type Context = Command.Context;
  export type RunInTypes = Command.RunInTypes;
  export type ChatInputInteraction<Cached extends import('discord.js').CacheType = import('discord.js').CacheType> =
    import('discord.js').CommandInteraction<Cached>;
  export type ContextMenuInteraction<Cached extends import('discord.js').CacheType = import('discord.js').CacheType> =
    import('discord.js').ContextMenuInteraction<Cached>;
  export type AutocompleteInteraction<Cached extends import('discord.js').CacheType = import('discord.js').CacheType> =
    import('discord.js').AutocompleteInteraction<Cached>;
  export type Registry = Command.Registry;
}
