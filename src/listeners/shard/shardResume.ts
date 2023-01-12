import { ShardListener } from '#lib/structures/ShardListener';
import type { Events } from '@sapphire/framework';
import { yellow } from 'colorette';

export class UserShardEvent extends ShardListener<typeof Events.ShardResume> {
  protected readonly title = yellow('Resumed');

  public run(id: number, replayedEvents: number) {
    this.container.client.logger.error(`${this.header(id)}: ${replayedEvents} events replayed.`);
  }
}
