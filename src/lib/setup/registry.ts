import { ApplicationCommandRegistries, RegisterBehavior } from '@sapphire/framework';
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);
