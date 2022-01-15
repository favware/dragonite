import type { DragoniteEnv } from '#lib/env/types';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends DragoniteEnv {}
  }
}
