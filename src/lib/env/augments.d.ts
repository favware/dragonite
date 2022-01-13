import type { DragoniteEnv } from './types';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends DragoniteEnv {}
  }
}
