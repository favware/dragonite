import { Events, Listener, LogLevel, type Logger } from '@sapphire/framework';

export class UserListener extends Listener<typeof Events.Error> {
  public override run(error: Error) {
    this.container.client.logger.error(error.message);
  }

  public override async onLoad() {
    if ((this.container.client.logger as Logger).level > LogLevel.Error) await this.unload();
    return super.onLoad();
  }
}
