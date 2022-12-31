import { Command } from '@sapphire/framework';
import { PermissionFlagsBits, PermissionsBitField } from 'discord.js';

export abstract class DragoniteCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    const resolvedPermissions = new PermissionsBitField(options.requiredClientPermissions).add(PermissionFlagsBits.EmbedLinks);

    super(context, {
      requiredClientPermissions: resolvedPermissions,
      ...options
    });
  }
}
