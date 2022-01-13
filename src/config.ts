// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

import { envParseBoolean, envParseInteger, envParseString } from '#lib/env';
import { srcFolder } from '#utils/constants';
import { LogLevel } from '@sapphire/framework';
import { ScheduledTaskRedisStrategy } from '@sapphire/plugin-scheduled-tasks/register-redis';
import type { ActivitiesOptions, ClientOptions, ExcludeEnum, WebhookClientData } from 'discord.js';
import type { ActivityTypes } from 'discord.js/typings/enums';
import { config } from 'dotenv-cra';
import { join } from 'path';
import { fileURLToPath } from 'url';

// Read config:
config({
  debug: process.env.DOTENV_DEBUG_ENABLED ? envParseBoolean('DOTENV_DEBUG_ENABLED') : undefined,
  path: join(fileURLToPath(srcFolder), '.env')
});

export const OWNERS = ['268792781713965056'];

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

function parseWebhookError(): WebhookClientData | null {
  const { WEBHOOK_ERROR_TOKEN } = process.env;
  if (!WEBHOOK_ERROR_TOKEN) return null;

  return {
    id: envParseString('WEBHOOK_ERROR_ID'),
    token: WEBHOOK_ERROR_TOKEN
  };
}

export function parseRedisOption() {
  return {
    port: envParseInteger('REDIS_PORT'),
    password: envParseString('REDIS_PASSWORD'),
    host: envParseString('REDIS_HOST')
  };
}

export const WEBHOOK_ERROR = parseWebhookError();

export const CLIENT_OPTIONS: ClientOptions = {
  intents: ['GUILDS'],
  allowedMentions: { users: [], roles: [] },
  presence: { activities: parsePresenceActivity() },
  logger: { level: envParseString('NODE_ENV') === 'production' ? LogLevel.Info : LogLevel.Debug },
  tasks: {
    strategy: new ScheduledTaskRedisStrategy({
      bull: {
        redis: {
          ...parseRedisOption(),
          db: envParseInteger('REDIS_TASK_DB')
        }
      }
    })
  }
};
