import type { ArrayString, BooleanString, IntegerString } from '@skyra/env-utilities';

export default undefined;

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
