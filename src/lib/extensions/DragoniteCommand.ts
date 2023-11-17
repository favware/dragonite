import { Command } from '@sapphire/framework';
import { PermissionFlagsBits } from 'discord.js';

export abstract class DragoniteCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      requiredClientPermissions: PermissionFlagsBits.EmbedLinks,
      ...options
    });
  }
}
