import { OWNERS } from '#root/config';
import { AllFlowsPrecondition } from '@sapphire/framework';
import type { ChatInputCommandInteraction, ContextMenuCommandInteraction, Message, Snowflake } from 'discord.js';

export class UserPrecondition extends AllFlowsPrecondition {
  #message = 'This command can only be used by the owner.';

  public override chatInputRun(interaction: ChatInputCommandInteraction) {
    return this.doOwnerCheck(interaction.user.id);
  }

  public override contextMenuRun(interaction: ContextMenuCommandInteraction) {
    return this.doOwnerCheck(interaction.user.id);
  }

  public override messageRun(message: Message) {
    return this.doOwnerCheck(message.author.id);
  }

  private doOwnerCheck(userId: Snowflake) {
    return OWNERS.includes(userId) ? this.ok() : this.error({ message: this.#message });
  }
}
