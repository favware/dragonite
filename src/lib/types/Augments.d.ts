import type { DragoniteApolloClient } from '#gql/ApolloClient';
import type { AnalyticsData } from '#lib/structures/AnalyticsData';
import type { EnGbHandler } from '#utils/Intl/EnGbHandler';
import type { Nullish } from '@sapphire/utilities';
import type { WebhookClient } from 'discord.js';
import type { GuildCommandInteraction, GuildContextMenuInteraction } from './Discord';

declare module '@sapphire/pieces' {
  interface Container {
    /** The Intl handler for EN-GB. */
    i18n: EnGbHandler;
    /** The InfluxDB Analytics controller. */
    analytics: AnalyticsData | Nullish;
    /** The webhook to use for the error event. */
    webhookError: WebhookClient | Nullish;
    /** The GraphQL client to interact with the Pokémon API */
    gqlClient: DragoniteApolloClient;
  }
}

declare module '@sapphire/framework' {
  interface ScheduledTasks {
    postStats: never;
  }

  interface ChatInputCommandSuccessPayload {
    readonly interaction: GuildCommandInteraction;
  }

  interface ChatInputCommandDeniedPayload {
    readonly interaction: GuildCommandInteraction;
  }

  interface ContextMenuCommandSuccessPayload {
    readonly interaction: GuildContextMenuInteraction;
  }

  interface ContextMenuCommandDeniedPayload {
    readonly interaction: GuildContextMenuInteraction;
  }
}
