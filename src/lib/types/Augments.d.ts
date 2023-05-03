import type { GqlClient } from '#gql/GqlClient';
import type { RedisCacheClient } from '#lib/redis-cache/RedisCacheClient';
import type { AnalyticsData } from '#lib/structures/AnalyticsData';
import type { Nullish } from '@sapphire/utilities';
import type { ArrayString, BooleanString, IntegerString } from '@skyra/env-utilities';
import type { WebhookClient } from 'discord.js';

declare module '@sapphire/pieces' {
  interface Container {
    /** The Intl handler for EN-GB. */
    i18n: {
      number: Intl.NumberFormat;
      listAnd: Intl.ListFormat;
      listOr: Intl.ListFormat;
    };
    /** The InfluxDB Analytics controller. */
    analytics: AnalyticsData | Nullish;
    /** The webhook to use for the error event. */
    webhookError: WebhookClient | Nullish;
    /** The GraphQL client to interact with the Pokémon API */
    gqlClient: GqlClient;
    /** The Redis Cache connection for GraphQL queries */
    gqlRedisCache: RedisCacheClient;
  }
}

declare module '@sapphire/framework' {
  interface ScheduledTasks {
    postStats: never;
  }

  interface Preconditions {
    OwnerOnly: never;
  }
}

declare module '@skyra/env-utilities' {
  interface Env {
    NODE_ENV: 'test' | 'development' | 'production';

    CLIENT_ID: string;
    CLIENT_VERSION: string;
    CLIENT_PRESENCE_NAME: string;
    CLIENT_PRESENCE_TYPE: string;

    POKEMON_API_URL: string;

    COMMAND_GUILD_IDS: ArrayString;

    DISCORD_TOKEN: string;
    DISCORD_BOT_LIST_TOKEN: string;
    TOP_GG_TOKEN: string;
    DISCORD_BOTS_GG_TOKEN: never;
    DISCORDS_TOKEN: string;
    DISCORDLABS_TOKEN: string;
    BOTLIST_ME_TOKEN: string;

    REDIS_PORT: IntegerString;
    REDIS_PASSWORD: string;
    REDIS_HOST: string;
    REDIS_CACHE_DB: IntegerString;
    REDIS_TASK_DB: IntegerString;

    WEBHOOK_ERROR_ENABLED: BooleanString;
    WEBHOOK_ERROR_ID: string;
    WEBHOOK_ERROR_TOKEN: string;

    INFLUX_ENABLED: BooleanString;
    INFLUX_URL: string;
    INFLUX_TOKEN: string;
    INFLUX_ORG: string;
    INFLUX_ORG_ANALYTICS_BUCKET: string;
  }
}
