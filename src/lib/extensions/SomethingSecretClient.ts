import { CLIENT_OPTIONS } from '#root/config';
import { SapphireClient } from '@sapphire/framework';

export class SomethingSecretClient extends SapphireClient {
  public constructor() {
    super(CLIENT_OPTIONS);
  }
}
