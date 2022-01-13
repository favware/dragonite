import { envParseBoolean } from '#lib/env';
import { AnalyticsData } from '#lib/structures/AnalyticsData';
import { CLIENT_OPTIONS, WEBHOOK_ERROR } from '#root/config';
import { container, SapphireClient } from '@sapphire/framework';
import { WebhookClient } from 'discord.js';

export class DragoniteClient extends SapphireClient {
  public constructor() {
    super(CLIENT_OPTIONS);

    container.analytics = envParseBoolean('INFLUX_ENABLED') ? new AnalyticsData() : null;
    container.webhookError = WEBHOOK_ERROR ? new WebhookClient(WEBHOOK_ERROR) : null;
  }
}
