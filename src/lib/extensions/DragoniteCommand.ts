import { Command } from '@sapphire/framework';
import { PermissionFlagsBits } from 'discord-api-types/v9';

export abstract class DragoniteCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      requiredClientPermissions: [options.requiredClientPermissions ?? [], PermissionFlagsBits.EmbedLinks],
      ...options
    });
  }
}
