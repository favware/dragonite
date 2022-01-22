import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { ScheduledTaskEvents } from '@sapphire/plugin-scheduled-tasks';

@ApplyOptions<Listener.Options>({ event: ScheduledTaskEvents.ScheduledTaskRun })
export class UserListener extends Listener {
  public override run(task: string, _payload: unknown) {
    this.container.logger.info(`[Scheduled-Task Plugin]: running task: ${task}`);
  }
}
