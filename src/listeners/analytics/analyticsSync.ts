import { AnalyticsListener } from '#lib/structures/AnalyticsListener';
import { Actions, Points, Tags } from '#lib/types/AnalyticsSchema';
import { DragoniteEvents } from '#lib/types/Enums';
import { Point } from '@influxdata/influxdb-client';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<AnalyticsListener.Options>({ event: DragoniteEvents.AnalyticsSync })
export class UserAnalyticsEvent extends AnalyticsListener {
  public run(guilds: number, users: number) {
    this.writePoints([this.syncGuilds(guilds), this.syncUsers(users)]);

    return this.container.analytics!.writeApi.flush();
  }

  private syncGuilds(value: number) {
    return new Point(Points.Guilds) //
      .tag(Tags.Action, Actions.Sync)
      .intField('value', value);
  }

  private syncUsers(value: number) {
    return new Point(Points.Users) //
      .tag(Tags.Action, Actions.Sync)
      .intField('value', value);
  }
}
