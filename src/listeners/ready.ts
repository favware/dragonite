import { DragoniteEvents } from '#lib/types/Enums';
import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, type Store } from '@sapphire/framework';
import { envParseBoolean, envParseString } from '@skyra/env-utilities';
import { createBanner } from '@skyra/start-banner';
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette';
import figlet from 'figlet';
import { pastel } from 'gradient-string';

@ApplyOptions<Listener.Options>({ once: true })
export class UserListener extends Listener<typeof Events.ClientReady> {
  private readonly style = this.isDev ? yellow : blue;

  public run() {
    try {
      this.initAnalytics();
    } catch (error) {
      this.container.logger.fatal(error);
    }

    this.printBanner();
    this.printStoreDebugInformation();
  }

  private get isDev() {
    return envParseString('NODE_ENV') === 'development';
  }

  private printBanner() {
    const success = green('+');

    const llc = this.isDev ? magentaBright : white;
    const blc = this.isDev ? magenta : blue;

    console.log(
      createBanner({
        name: [pastel.multiline(figlet.textSync('Dragonite'))],
        extra: [
          blc(envParseString('CLIENT_VERSION')), //
          `[${success}] Gateway`,
          this.isDev ? ` ${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''
        ]
      })
    );
  }

  private printStoreDebugInformation() {
    const { client, logger } = this.container;
    const stores = [...client.stores.values()];
    const last = stores.pop()!;

    for (const store of stores) logger.info(this.styleStore(store, false));
    logger.info(this.styleStore(last, true));
  }

  private styleStore(store: Store<any>, last: boolean) {
    return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
  }

  private initAnalytics() {
    if (envParseBoolean('INFLUX_ENABLED')) {
      const { client } = this.container;

      client.emit(
        DragoniteEvents.AnalyticsSync,
        client.guilds.cache.size,
        client.guilds.cache.reduce((acc, val) => acc + (val.memberCount ?? 0), 0)
      );
    }
  }
}
