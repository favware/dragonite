import '#lib/setup';
import { SomethingSecretClient } from '#lib/extensions/SomethingSecretClient';
import { green } from 'colorette';

const client = new SomethingSecretClient();

try {
  await client.login();
  client.logger.info(`${green('WS     ')} - Successfully logged in.`);
} catch (error) {
  client.logger.error(error);
  client.destroy();
  process.exit(1);
}
