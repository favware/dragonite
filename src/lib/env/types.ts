export type BooleanString = 'true' | 'false';
export type IntegerString = `${bigint}`;

export type DragoniteEnvAny = keyof DragoniteEnv;
export type DragoniteEnvString = {
  [K in DragoniteEnvAny]: DragoniteEnv[K] extends BooleanString | IntegerString ? never : K;
}[DragoniteEnvAny];
export type DragoniteEnvBoolean = {
  [K in DragoniteEnvAny]: DragoniteEnv[K] extends BooleanString ? K : never;
}[DragoniteEnvAny];
export type DragoniteEnvInteger = {
  [K in DragoniteEnvAny]: DragoniteEnv[K] extends IntegerString ? K : never;
}[DragoniteEnvAny];

export interface DragoniteEnv {
  NODE_ENV: 'test' | 'development' | 'production';
  DOTENV_DEBUG_ENABLED: BooleanString;

  CLIENT_ID: string;
  CLIENT_VERSION: string;
  CLIENT_PRESENCE_NAME: string;
  CLIENT_PRESENCE_TYPE: string;

  POKEMON_API_URL: string;

  COMMAND_GUILD_IDS: string;

  DISCORD_TOKEN: string;
  DISCORD_BOT_LIST_TOKEN: string;
  DISCORDLIST_SPACE_TOKEN: string;
  BLADELIST_GG_TOKEN: string;
  TOP_GG_TOKEN: never;
  DISCORD_BOTS_GG_TOKEN: never;
  DISCORDS_TOKEN: string;
  DISCORDLABS_TOKEN: never;

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
