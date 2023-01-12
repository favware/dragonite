import { ShardListener } from '#lib/structures/ShardListener';
import type { Events } from '@sapphire/framework';
import { red } from 'colorette';

export class UserShardEvent extends ShardListener<typeof Events.ShardError> {
  protected readonly title = red('Error');

  public run(error: Error, id: number) {
    this.container.client.logger.error(`${this.header(id)}: ${error.stack ?? error.message}`);
  }
}
