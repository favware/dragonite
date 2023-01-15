import { handleChatInputOrContextMenuCommandSuccess } from '#utils/functions/successHelper';
import { Events, Listener, LogLevel, type ContextMenuCommandSuccessPayload } from '@sapphire/framework';
import type { Logger } from '@sapphire/plugin-logger';

export class ContextMenuCommandSuccess extends Listener<typeof Events.ContextMenuCommandSuccess> {
  public override run(payload: ContextMenuCommandSuccessPayload) {
    return handleChatInputOrContextMenuCommandSuccess(payload);
  }

  public override onLoad() {
    this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
    return super.onLoad();
  }
}
