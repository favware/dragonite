import { handleChatInputOrContextMenuCommandError } from '#utils/functions/errorHelpers';
import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, type ChatInputCommandErrorPayload, type ContextMenuCommandErrorPayload } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({
  event: Events.ContextMenuCommandError
})
export class ContextMenuCommandError extends Listener<typeof Events.ContextMenuCommandError> {
  public run(error: Error, payload: ContextMenuCommandErrorPayload) {
    return handleChatInputOrContextMenuCommandError(error, payload);
  }
}

@ApplyOptions<Listener.Options>({
  event: Events.ChatInputCommandError
})
export class ChatInputCommandError extends Listener<typeof Events.ChatInputCommandError> {
  public run(error: Error, payload: ChatInputCommandErrorPayload) {
    return handleChatInputOrContextMenuCommandError(error, payload);
  }
}
