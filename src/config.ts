// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

import { envParseBoolean, envParseString } from '#lib/env';
import { srcFolder } from '#utils/constants';
import { LogLevel } from '@sapphire/framework';
import type { ActivitiesOptions, ClientOptions, ExcludeEnum } from 'discord.js';
import type { ActivityTypes } from 'discord.js/typings/enums';
import { config } from 'dotenv-cra';
import { join } from 'path';
import { fileURLToPath } from 'url';

// Read config:
config({
  debug: process.env.DOTENV_DEBUG_ENABLED ? envParseBoolean('DOTENV_DEBUG_ENABLED') : undefined,
  path: join(fileURLToPath(srcFolder), '.env')
});

function parsePresenceActivity(): ActivitiesOptions[] {
  const { CLIENT_PRESENCE_NAME } = process.env;
  if (!CLIENT_PRESENCE_NAME) return [];

  return [
    {
      name: CLIENT_PRESENCE_NAME,
      type: envParseString('CLIENT_PRESENCE_TYPE', 'WATCHING') as ExcludeEnum<typeof ActivityTypes, 'CUSTOM'>
    }
  ];
}

export const CLIENT_OPTIONS: ClientOptions = {
  intents: ['GUILDS'],
  allowedMentions: { users: [], roles: [] },
  presence: { activities: parsePresenceActivity() },
  logger: { level: envParseString('NODE_ENV') === 'production' ? LogLevel.Info : LogLevel.Debug }
};
