import { AnalyticsListener } from '#lib/structures/AnalyticsListener';
import { Actions, Points, Tags } from '#lib/types/AnalyticsSchema';
import { Point } from '@influxdata/influxdb-client';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommandSuccessPayload, Events } from '@sapphire/framework';

@ApplyOptions<AnalyticsListener.Options>({ event: Events.ChatInputCommandSuccess })
export class UserAnalyticsEvent extends AnalyticsListener {
  public run(payload: ChatInputCommandSuccessPayload) {
    const command = new Point(Points.Commands)
      .tag(Tags.Action, Actions.Addition)
      .tag('category', payload.command.category!)
      .intField(payload.command.name.replace(/^time$/, 'case-time'), 1);

    return this.writePoint(command);
  }
}
