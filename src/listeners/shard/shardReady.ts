import { ShardListener } from '#lib/structures/ShardListener';
import { green } from 'colorette';

export class UserShardEvent extends ShardListener {
  protected readonly title = green('Ready');

  public run(id: number, unavailableGuilds: Set<string> | null) {
    this.container.client.logger.info(`${this.header(id)}: ${unavailableGuilds?.size ?? 'Unknown or no unavailable'} guilds`);
  }
}
