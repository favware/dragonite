import { AnalyticsListener } from '#lib/structures/AnalyticsListener';
import { Actions, Points, Tags } from '#lib/types/AnalyticsSchema';
import { Point } from '@influxdata/influxdb-client';
import { ApplyOptions } from '@sapphire/decorators';
import { Events } from '@sapphire/framework';
import type { Guild } from 'discord.js';

@ApplyOptions<AnalyticsListener.Options>({ event: Events.GuildCreate })
export class UserAnalyticsEvent extends AnalyticsListener {
  public run(guild: Guild) {
    const guilds = new Point(Points.Guilds)
      .tag(Tags.Shard, guild.shardId.toString())
      .tag(Tags.Action, Actions.Addition)
      .intField('value', guild.client.guilds.cache.size);

    const users = new Point(Points.Users)
      .tag(Tags.Shard, guild.shardId.toString())
      .tag(Tags.Action, Actions.Addition)
      .intField(
        'value',
        guild.client.guilds.cache.reduce((acc, val) => acc + (val.memberCount ?? 0), 0)
      );

    return this.writePoints([guilds, users]);
  }
}
