import { ShardListener } from '#lib/structures/ShardListener';
import type { Events } from '@sapphire/framework';
import { red } from 'colorette';
import type { CloseEvent } from 'discord.js';

export class UserShardEvent extends ShardListener<typeof Events.ShardDisconnect> {
  protected readonly title = red('Disconnected');

  public run(event: CloseEvent, id: number) {
    this.container.client.logger.error(`${this.header(id)}:\n\tCode: ${event.code}\n\tReason: ${event.reason}`);
  }
}
