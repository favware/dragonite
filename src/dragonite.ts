import '#lib/setup';
import { DragoniteClient } from '#lib/extensions/DragoniteClient';
import { green } from 'colorette';

const client = new DragoniteClient();

try {
  await client.login();
  client.logger.info(`${green('WS     ')} - Successfully logged in.`);
} catch (error) {
  client.logger.error(error);
  client.destroy();
  process.exit(1);
}
