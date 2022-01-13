import { envParseString } from '#lib/env';
import { DragoniteEvents } from '#lib/types/Enums';
import type { PieceContext } from '@sapphire/framework';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { filterNullish } from '@sapphire/utilities';
import { blueBright } from 'colorette';
import { Constants } from 'discord.js';

const header = blueBright('[POST STATS   ]');

// enum Lists {
//   BotListSpace = 'botlist.space',
//   Discords = 'discords.com',
//   DiscordBotList = 'discordbotlist.com',
//   TopGG = 'top.gg',
//   DiscordBotsGG = 'discord.bots.gg',
//   BotsOnDiscord = 'bots.ondiscord.xyz'
// }

export class CronTask extends ScheduledTask {
  public constructor(context: PieceContext) {
    super(context, {
      cron: '*/10 * * * *'
    });
  }

  public run() {
    const { client, logger } = this.container;

    // If the websocket isn't ready, skip for now
    if (client.ws.status !== Constants.Status.READY) {
      return null;
    }

    const rawGuilds = client.guilds.cache.size;
    const rawUsers = client.guilds.cache.reduce((acc, val) => acc + (val.memberCount ?? 0), 0);

    this.processAnalytics(rawGuilds, rawUsers);

    // If in development mode then stop here
    if (envParseString('NODE_ENV') === 'development') return null;

    const guilds = rawGuilds.toString();
    const users = rawUsers.toString();

    // TODO: Post stats to botlists
    const results: (string | null)[] = [].filter(filterNullish);

    if (results.length) logger.trace(`${header} [ ${guilds} [G] ] [ ${users} [U] ] | ${results.join(' | ')}`);
    return null;
  }

  private processAnalytics(guilds: number, users: number) {
    this.container.client.emit(DragoniteEvents.AnalyticsSync, guilds, users);
  }
}
