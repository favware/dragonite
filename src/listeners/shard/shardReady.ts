import { ShardListener } from '#lib/structures/ShardListener';
import type { Events } from '@sapphire/framework';
import { green } from 'colorette';

export class UserShardEvent extends ShardListener<typeof Events.ShardReady> {
  protected readonly title = green('Ready');

  public run(id: number, unavailableGuilds: Set<string> | undefined) {
    this.container.client.logger.info(`${this.header(id)}: ${unavailableGuilds?.size ?? 'Unknown or no unavailable'} guilds`);
  }
}
