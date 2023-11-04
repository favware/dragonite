import { ApplicationCommandRegistries, RegisterBehavior } from '@sapphire/framework';
import { envParseArray } from '@skyra/env-utilities';

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);
ApplicationCommandRegistries.setDefaultGuildIds(envParseArray('COMMAND_GUILD_IDS', []));
