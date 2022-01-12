import type { SomethingSecretEnv } from './types';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends SomethingSecretEnv {}
  }
}
