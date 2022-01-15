import { envParseBoolean, envParseString } from '#lib/env';
import { DragoniteEvents } from '#lib/types/Enums';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, type Store } from '@sapphire/framework';
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette';

@ApplyOptions<Listener.Options>({ once: true })
export class UserListener extends Listener {
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

    const line01 = llc('');
    const line02 = llc('');
    const line03 = llc('');
    const line04 = llc('');
    const line05 = llc('');
    const line06 = llc('');
    const line07 = llc('');
    const line08 = llc('');
    const line09 = llc('');
    const line10 = llc('');

    // Offset Pad
    const pad = ' '.repeat(7);

    console.log(
      String.raw`
${line01}  _____                              _ _       
${line02} |  __ \\                            (_) |      
${line03} | |  | |_ __ __ _  __ _  ___  _ __  _| |_ ___ 
${line04} | |  | | '__/ _\` |/ _\` |/ _ \\| \'_ \\| | __/ _ \\
${line05} | |__| | | | (_| | (_| | (_) | | | | | ||  __/
${line05} |_____/|_|  \\__,_|\\__, |\\___/|_| |_|_|\\__\\___|
${line06}                    __/ |                      
${line07}                   |___/                       
${line08} ${blc(envParseString('CLIENT_VERSION').padStart(55, ' '))}
${line09} ${pad}[${success}] Gateway
${line10}${this.isDev ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}
		`.trim()
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
