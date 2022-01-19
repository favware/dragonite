import { Command } from '@sapphire/framework';
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
}
