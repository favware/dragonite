import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { ScheduledTaskEvents } from '@sapphire/plugin-scheduled-tasks';

@ApplyOptions<Listener.Options>({ event: ScheduledTaskEvents.ScheduledTaskSuccess })
export class UserListener extends Listener {
  public override run(task: string, duration: number, _payload: unknown) {
    this.container.logger.info(`[Scheduled-Task Plugin]: finished running task: ${task} in ${duration}ms`);
  }
}
