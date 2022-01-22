import { ApplyOptions } from '@sapphire/decorators';
import { Listener, Logger, LogLevel } from '@sapphire/framework';
import { ScheduledTaskEvents } from '@sapphire/plugin-scheduled-tasks';

@ApplyOptions<Listener.Options>({ event: ScheduledTaskEvents.ScheduledTaskSuccess })
export class UserListener extends Listener {
  public override run(task: string, _payload: unknown, taskRunResult: unknown, duration: number) {
    this.container.logger.debug(`[Scheduled-Task Plugin]: successfully ran task: ${task} in ${duration}ms with result: ${taskRunResult}`);
  }

  public override onLoad() {
    this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
    return super.onLoad();
  }
}
