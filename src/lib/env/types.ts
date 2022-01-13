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

  CLIENT_VERSION: string;

  CLIENT_PRESENCE_NAME: string;
  CLIENT_PRESENCE_TYPE: string;

  COMMAND_GUILD_IDS: string;

  DISCORD_TOKEN: string;
}
