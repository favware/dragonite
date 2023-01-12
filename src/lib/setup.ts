// Config must be the first to be loaded, as it sets the env:
import '#root/config';
import '#utils/Sanitizer/initClean';
import '@sapphire/plugin-logger/register';

import { ApplicationCommandRegistries, RegisterBehavior } from '@sapphire/framework';
import * as colorette from 'colorette';
import { inspect } from 'util';

inspect.defaultOptions.depth = 1;
colorette.createColors({ useColor: true });
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);
