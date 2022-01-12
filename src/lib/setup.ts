// Config must be the first to be loaded, as it sets the env:
import '#root/config';

import { EnGbHandler } from '#utils/Intl/EnGbHandler';
import { container } from '@sapphire/framework';

// Import everything else:
import '@sapphire/plugin-logger/register';

import * as colorette from 'colorette';
import { inspect } from 'util';

container.i18n = new EnGbHandler();

inspect.defaultOptions.depth = 1;
colorette.createColors({ useColor: true });
