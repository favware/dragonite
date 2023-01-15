import { handleChatInputOrContextMenuCommandError } from '#utils/functions/errorHelpers';
import { Events, Listener, type ContextMenuCommandErrorPayload } from '@sapphire/framework';

export class ContextMenuCommandError extends Listener<typeof Events.ContextMenuCommandError> {
  public run(error: Error, payload: ContextMenuCommandErrorPayload) {
    return handleChatInputOrContextMenuCommandError(error, payload);
  }
}
