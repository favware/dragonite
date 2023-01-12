import { handleChatInputOrContextMenuCommandDenied } from '#utils/functions/deniedHelper';
import { ApplyOptions } from '@sapphire/decorators';
import { ContextMenuCommandDeniedPayload, Events, Listener, UserError, type ChatInputCommandDeniedPayload } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({
  event: Events.ContextMenuCommandDenied
})
export class ContextMenuCommandDenied extends Listener<typeof Events.ContextMenuCommandDenied> {
  public run(error: UserError, payload: ContextMenuCommandDeniedPayload) {
    return handleChatInputOrContextMenuCommandDenied(error, payload);
  }
}

@ApplyOptions<Listener.Options>({
  event: Events.ChatInputCommandDenied
})
export class ChatInputCommandDenied extends Listener<typeof Events.ChatInputCommandDenied> {
  public run(error: UserError, payload: ChatInputCommandDeniedPayload) {
    return handleChatInputOrContextMenuCommandDenied(error, payload);
  }
}
