import { handleChatInputOrContextMenuCommandDenied } from '#utils/functions/deniedHelper';
import { Events, Listener, UserError, type ChatInputCommandDeniedPayload } from '@sapphire/framework';

export class ChatInputCommandDenied extends Listener<typeof Events.ChatInputCommandDenied> {
  public run(error: UserError, payload: ChatInputCommandDeniedPayload) {
    return handleChatInputOrContextMenuCommandDenied(error, payload);
  }
}
