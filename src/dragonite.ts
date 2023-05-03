import '#lib/setup/all';
import { CLIENT_OPTIONS } from '#root/config';
import { SapphireClient } from '@sapphire/framework';

import { green } from 'colorette';

const client = new SapphireClient(CLIENT_OPTIONS);

try {
  await client.login();
  client.logger.info(`${green('WS     ')} - Successfully logged in.`);
} catch (error) {
  client.logger.error(error);
  client.destroy();
  process.exit(1);
}
