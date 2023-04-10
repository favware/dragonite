import { GqlClient } from '#gql/GqlClient';
import { RedisCacheClient } from '#lib/redis-cache/RedisCacheClient';
import { AnalyticsData } from '#lib/structures/AnalyticsData';
import { CLIENT_OPTIONS, WEBHOOK_ERROR } from '#root/config';
import { EnGbHandler } from '#utils/Intl/EnGbHandler';
import { SapphireClient, container } from '@sapphire/framework';
import { envParseBoolean } from '@skyra/env-utilities';
import { WebhookClient } from 'discord.js';

export class DragoniteClient extends SapphireClient {
  public constructor() {
    super(CLIENT_OPTIONS);

    container.i18n = new EnGbHandler();
    container.analytics = envParseBoolean('INFLUX_ENABLED') ? new AnalyticsData() : null;
    container.webhookError = WEBHOOK_ERROR ? new WebhookClient(WEBHOOK_ERROR) : null;
    container.gqlClient = new GqlClient();
    container.gqlRedisCache = new RedisCacheClient();
  }
}
