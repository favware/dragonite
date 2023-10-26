import { DragoniteEvents } from '#lib/types/Enums';
import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { Status } from 'discord.js';

@ApplyOptions<ScheduledTask.Options>({
  pattern: '*/10 * * * *',
  customJobOptions: {
    removeOnComplete: true
  }
})
export class PostStatsTask extends ScheduledTask {
  public override run() {
    // If the websocket isn't ready, skip for now
    if (this.container.client.ws.status !== Status.Ready) {
      return;
    }

    const rawGuilds = this.container.client.guilds.cache.size;
    const rawUsers = this.container.client.guilds.cache.reduce((acc, val) => acc + (val.memberCount ?? 0), 0);

    this.processAnalytics(rawGuilds, rawUsers);
  }

  private processAnalytics(guilds: number, users: number) {
    this.container.client.emit(DragoniteEvents.AnalyticsSync, guilds, users);
  }
}
