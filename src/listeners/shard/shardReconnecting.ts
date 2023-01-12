import { ShardListener } from '#lib/structures/ShardListener';
import type { Events } from '@sapphire/framework';
import { yellow } from 'colorette';

export class UserShardEvent extends ShardListener<typeof Events.ShardReconnecting> {
  protected readonly title = yellow('Reconnecting');

  public run(id: number) {
    this.container.client.logger.error(`${this.header(id)}: ${this.title}`);
  }
}
