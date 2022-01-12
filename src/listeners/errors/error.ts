import { Listener, Logger, LogLevel } from '@sapphire/framework';

export class UserListener extends Listener {
  public override run(message: string) {
    this.container.client.logger.error(message);
  }

  public override async onLoad() {
    if ((this.container.client.logger as Logger).level > LogLevel.Error) await this.unload();
    return super.onLoad();
  }
}
