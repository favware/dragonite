import { ShardListener } from '#lib/structures/ShardListener';
import { yellow } from 'colorette';

export class UserShardEvent extends ShardListener {
  protected readonly title = yellow('Resumed');

  public run(id: number, replayedEvents: number) {
    this.container.client.logger.error(`${this.header(id)}: ${replayedEvents} events replayed.`);
  }
}
