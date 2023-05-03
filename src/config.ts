import { LogLevel } from '@sapphire/framework';
import { ScheduledTaskRedisStrategy } from '@sapphire/plugin-scheduled-tasks/register-redis';
import { cast } from '@sapphire/utilities';
import { envParseInteger, envParseString } from '@skyra/env-utilities';
import type { RedisOptions } from 'bullmq';
import { ActivityType, GatewayIntentBits, Partials, type ActivitiesOptions, type ClientOptions, type WebhookClientData } from 'discord.js';

export const OWNERS = ['268792781713965056'];

function parsePresenceActivity(): ActivitiesOptions[] {
  const { CLIENT_PRESENCE_NAME } = process.env;
  if (!CLIENT_PRESENCE_NAME) return [];

  return [
    {
      name: CLIENT_PRESENCE_NAME,
      type: cast<Exclude<ActivityType, ActivityType.Custom>>(envParseString('CLIENT_PRESENCE_TYPE', 'WATCHING'))
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
  loadDefaultErrorListeners: false,
  logger: { level: envParseString('NODE_ENV') === 'production' ? LogLevel.Info : LogLevel.Debug },
  partials: [Partials.Channel],
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
