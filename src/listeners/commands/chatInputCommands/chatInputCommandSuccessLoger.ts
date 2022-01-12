import { getSuccessLoggerData } from '#utils/functions/successLogger';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommandSuccessPayload, Events, Listener, LogLevel } from '@sapphire/framework';
import type { Logger } from '@sapphire/plugin-logger';

@ApplyOptions<Listener.Options>({ event: Events.ChatInputCommandSuccess })
export class UserListener extends Listener {
  public override run(payload: ChatInputCommandSuccessPayload) {
    const { author, commandName, sentAt, shard } = getSuccessLoggerData(payload);
    this.container.logger.debug(`${shard} - ${commandName} ${author} ${sentAt}`);
  }

  public override onLoad() {
    this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
    return super.onLoad();
  }
}
