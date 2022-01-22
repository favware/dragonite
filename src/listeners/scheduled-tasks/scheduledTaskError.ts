import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { ScheduledTaskEvents } from '@sapphire/plugin-scheduled-tasks';

@ApplyOptions<Listener.Options>({ event: ScheduledTaskEvents.ScheduledTaskError })
export class UserListener extends Listener {
  public override run(error: Error, task: string, _payload: unknown) {
    this.container.logger.info(`[Scheduled-Task Plugin]: task: ${task} threw an error`);
    this.container.logger.fatal(error);
  }
}
