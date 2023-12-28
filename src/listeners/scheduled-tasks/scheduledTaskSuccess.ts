import { ApplyOptions } from '@sapphire/decorators';
import { Listener, Logger, LogLevel } from '@sapphire/framework';
import { ScheduledTask, ScheduledTaskEvents } from '@sapphire/plugin-scheduled-tasks';

@ApplyOptions<Listener.Options>({ event: ScheduledTaskEvents.ScheduledTaskSuccess })
export class UserListener extends Listener<typeof ScheduledTaskEvents.ScheduledTaskSuccess> {
  public override run(task: ScheduledTask, _payload: unknown, _taskRunResult: unknown, duration: number) {
    this.container.logger.debug(`[Scheduled-Task Plugin]: successfully ran task: ${task.name} in ${this.formatDuration(duration)}`);
  }

  public override onLoad() {
    this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
    return super.onLoad();
  }

  private formatDuration(duration: number) {
    if (duration >= 1000) return `${(duration / 1000).toFixed(2)}s`;
    if (duration >= 1) return `${duration.toFixed(2)}ms`;
    return `${(duration * 1000).toFixed(2)}μs`;
  }
}
