import { ShardListener } from '#lib/structures/ShardListener';
import { red } from 'colorette';

export class UserShardEvent extends ShardListener {
  protected readonly title = red('Error');

  public run(error: Error, id: number) {
    this.container.client.logger.error(`${this.header(id)}: ${error.stack ?? error.message}`);
  }
}
