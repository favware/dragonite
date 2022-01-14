import { OWNERS } from '#root/config';
import { AllFlowsPrecondition } from '@sapphire/framework';
import type { Snowflake } from 'discord-api-types/v9';

export class UserPrecondition extends AllFlowsPrecondition {
  #message = 'This command can only be used by the owner.';

  public override chatInputRun(...[interaction]: Parameters<AllFlowsPrecondition['chatInputRun']>) {
    return this.doOwnerCheck(interaction.user.id);
  }

  public override contextMenuRun(...[interaction]: Parameters<AllFlowsPrecondition['contextMenuRun']>) {
    return this.doOwnerCheck(interaction.user.id);
  }

  public override messageRun(...[message]: Parameters<AllFlowsPrecondition['messageRun']>) {
    return this.doOwnerCheck(message.author.id);
  }

  private doOwnerCheck(userId: Snowflake) {
    return OWNERS.includes(userId) ? this.ok() : this.error({ message: this.#message });
  }
}
