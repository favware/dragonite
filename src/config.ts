// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

import { srcFolder } from '#utils/constants';
import { minutes } from '#utils/functions/time';
import { LogLevel } from '@sapphire/framework';
import { ScheduledTaskRedisStrategy } from '@sapphire/plugin-scheduled-tasks/register-redis';
import { envParseInteger, envParseString, setup } from '@skyra/env-utilities';
import type { RedisOptions } from 'bullmq';
import { GatewayIntentBits } from 'discord-api-types/v9';
import { ActivitiesOptions, ClientOptions, ExcludeEnum, Options, WebhookClientData } from 'discord.js';
import type { ActivityTypes } from 'discord.js/typings/enums';

setup(new URL('.env', srcFolder));

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

export function parseRedisOption(): Pick<RedisOptions, 'port' | 'password' | 'host'> {
  return {
    port: envParseInteger('REDIS_PORT'),
    password: envParseString('REDIS_PASSWORD'),
    host: envParseString('REDIS_HOST')
  };
}

export const WEBHOOK_ERROR = parseWebhookError();

export const CLIENT_OPTIONS: ClientOptions = {
  intents: [GatewayIntentBits.Guilds],
  allowedMentions: { users: [], roles: [] },
  presence: { activities: parsePresenceActivity() },
  logger: { level: envParseString('NODE_ENV') === 'production' ? LogLevel.Info : LogLevel.Debug },
  preventFailedToFetchLogForGuilds: [
    // Discord Bots
    '110373943822540800',
    // Discords.com: Bots For Discord
    '374071874222686211',
    // Discord Labs
    '608711879858192479'
  ],
  partials: ['CHANNEL'],
  sweepers: {
    ...Options.defaultSweeperSettings,
    messages: {
      interval: minutes.toSeconds(3),
      lifetime: minutes.toSeconds(15)
    }
  },
  tasks: {
    strategy: new ScheduledTaskRedisStrategy({
      bull: {
        connection: {
          ...parseRedisOption(),
          db: envParseInteger('REDIS_TASK_DB')
        }
      }
    })
  }
};
