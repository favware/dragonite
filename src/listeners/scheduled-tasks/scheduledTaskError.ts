import { getErrorLine, getMethodLine, getStatusLine } from '#utils/functions/errorHelpers';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, LogLevel } from '@sapphire/framework';
import type { Logger } from '@sapphire/plugin-logger';
import { ScheduledTaskEvents } from '@sapphire/plugin-scheduled-tasks';
import { isNullish } from '@sapphire/utilities';
import { DiscordAPIError, EmbedBuilder, HTTPError } from 'discord.js';

@ApplyOptions<Listener.Options>({ event: ScheduledTaskEvents.ScheduledTaskError })
export class UserListener extends Listener<typeof ScheduledTaskEvents.ScheduledTaskError> {
  public override async run(error: Error, task: string) {
    this.container.logger.error(`[Scheduled-Task Plugin]: task: ${task} threw an error`, error);

    // Send a detailed message:
    await this.sendErrorChannel(task, error);
  }

  public override onLoad() {
    this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
    return super.onLoad();
  }

  private async sendErrorChannel(task: string, error: Error) {
    const webhook = this.container.webhookError;
    if (isNullish(webhook)) return;

    const lines = [this.getTaskLine(task), getErrorLine(error)];

    // If it's a DiscordAPIError or a HTTPError, add the HTTP path and code lines after the second one.
    if (error instanceof DiscordAPIError || error instanceof HTTPError) {
      lines.splice(2, 0, getMethodLine(error), getStatusLine(error));
    }

    const embed = new EmbedBuilder() //
      .setDescription(lines.join('\n'))
      .setColor('Red')
      .setTimestamp();

    try {
      await webhook.send({ embeds: [embed] });
    } catch (err) {
      // noop
    }
  }

  /**
   * Formats a task line.
   * @param task The task to format.
   */
  private getTaskLine(task: string): string {
    return `**Task**: ${task}`;
  }
}
