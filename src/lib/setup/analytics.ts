import { AnalyticsData } from '#lib/structures/AnalyticsData';
import { container } from '@sapphire/framework';
import { envParseBoolean } from '@skyra/env-utilities';

container.analytics = envParseBoolean('INFLUX_ENABLED') ? new AnalyticsData() : null;
