export type BooleanString = 'true' | 'false';
export type IntegerString = `${bigint}`;

export type SomethingSecretEnvAny = keyof SomethingSecretEnv;
export type SomethingSecretEnvString = {
  [K in SomethingSecretEnvAny]: SomethingSecretEnv[K] extends BooleanString | IntegerString ? never : K;
}[SomethingSecretEnvAny];
export type SomethingSecretEnvBoolean = {
  [K in SomethingSecretEnvAny]: SomethingSecretEnv[K] extends BooleanString ? K : never;
}[SomethingSecretEnvAny];
export type SomethingSecretEnvInteger = {
  [K in SomethingSecretEnvAny]: SomethingSecretEnv[K] extends IntegerString ? K : never;
}[SomethingSecretEnvAny];

export interface SomethingSecretEnv {
  NODE_ENV: 'test' | 'development' | 'production';
  DOTENV_DEBUG_ENABLED: BooleanString;

  CLIENT_VERSION: string;

  CLIENT_PRESENCE_NAME: string;
  CLIENT_PRESENCE_TYPE: string;

  COMMAND_GUILD_IDS: string;

  DISCORD_TOKEN: string;
}
