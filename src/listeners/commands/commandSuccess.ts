import { handleChatInputOrContextMenuCommandSuccess } from '#utils/functions/successHelper';
import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, LogLevel, type ChatInputCommandSuccessPayload, type ContextMenuCommandSuccessPayload } from '@sapphire/framework';
import type { Logger } from '@sapphire/plugin-logger';

@ApplyOptions<Listener.Options>({
  event: Events.ChatInputCommandSuccess
})
export class ChatInputCommandSuccess extends Listener<typeof Events.ChatInputCommandSuccess> {
  public override run(payload: ChatInputCommandSuccessPayload) {
    return handleChatInputOrContextMenuCommandSuccess(payload);
  }

  public override onLoad() {
    this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
    return super.onLoad();
  }
}

@ApplyOptions<Listener.Options>({
  event: Events.ContextMenuCommandSuccess
})
export class ContextMenuCommandSuccess extends Listener<typeof Events.ContextMenuCommandSuccess> {
  public override run(payload: ContextMenuCommandSuccessPayload) {
    return handleChatInputOrContextMenuCommandSuccess(payload);
  }

  public override onLoad() {
    this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
    return super.onLoad();
  }
}
