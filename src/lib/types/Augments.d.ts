import type { GqlClient } from '#gql/GqlClient';
import type { RedisCacheClient } from '#lib/redis-cache/RedisCacheClient';
import type { AnalyticsData } from '#lib/structures/AnalyticsData';
import type { EnGbHandler } from '#utils/Intl/EnGbHandler';
import type { Nullish } from '@sapphire/utilities';
import type { WebhookClient } from 'discord.js';

declare module '@sapphire/pieces' {
  interface Container {
    /** The Intl handler for EN-GB. */
    i18n: EnGbHandler;
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
