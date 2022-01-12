import { ShardListener } from '#lib/structures/ShardListener';
import { yellow } from 'colorette';

export class UserShardEvent extends ShardListener {
  protected readonly title = yellow('Reconnecting');

  public run(id: number) {
    this.container.client.logger.error(`${this.header(id)}: ${this.title}`);
  }
}
