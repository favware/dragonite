import { Listener } from '@sapphire/framework';
import { bold, magenta } from 'colorette';
import type { ClientEvents } from 'discord.js';

export abstract class ShardListener<E extends keyof ClientEvents | symbol = ''> extends Listener<E> {
  protected abstract readonly title: string;

  protected header(shardID: number): string {
    return `${bold(magenta(`[SHARD ${shardID}]`))} ${this.title}`;
  }
}
