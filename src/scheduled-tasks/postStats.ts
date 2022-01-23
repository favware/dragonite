import { envParseString } from '#lib/env';
import { DragoniteEvents } from '#lib/types/Enums';
import { fetch, FetchResultTypes, type QueryError } from '@sapphire/fetch';
import { fromAsync, isErr, PieceContext } from '@sapphire/framework';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { filterNullish, isNullishOrEmpty } from '@sapphire/utilities';
import { blueBright, green, red } from 'colorette';
import { Constants } from 'discord.js';

const header = blueBright('[POST STATS   ]');

enum Lists {
  BotListSpace = 'botlist.space',
  Discords = 'discords.com',
  DiscordBotList = 'discordbotlist.com',
  TopGG = 'top.gg',
  DiscordBotsGG = 'discord.bots.gg',
  BladelistGG = 'bladelist.gg'
}

export class PostStatsTask extends ScheduledTask {
  public constructor(context: PieceContext) {
    super(context, {
      cron: '*/10 * * * *',
      bullJobOptions: {
        removeOnComplete: true,
        removeOnFail: true
      }
    });
  }

  public override async run() {
    // If the websocket isn't ready, skip for now
    if (this.container.client.ws.status !== Constants.Status.READY) {
      return;
    }

    const rawGuilds = this.container.client.guilds.cache.size;
    const rawUsers = this.container.client.guilds.cache.reduce((acc, val) => acc + (val.memberCount ?? 0), 0);

    this.processAnalytics(rawGuilds, rawUsers);

    // If in production then post stats to bot lists
    if (envParseString('NODE_ENV') === 'production') {
      await this.processBotListStats(rawGuilds, rawUsers);
    }
  }

  private processAnalytics(guilds: number, users: number) {
    this.container.client.emit(DragoniteEvents.AnalyticsSync, guilds, users);
  }

  private async processBotListStats(rawGuilds: number, rawUsers: number) {
    const guilds = rawGuilds.toString();
    const users = rawUsers.toString();

    // TODO: Post stats to other bot lists after approvals
    const results: (string | null)[] = (
      await Promise.all([
        // this.query(
        //   `https://top.gg/api/bots/${envParseString('CLIENT_ID')}/stats`,
        //   JSON.stringify({ server_count: guilds }),
        //   envParseString('TOP_GG_TOKEN'),
        //   Lists.TopGG
        // ),
        // this.query(
        //   `https://discord.bots.gg/api/v1/bots/${envParseString('CLIENT_ID')}/stats`,
        //   JSON.stringify({ guildCount: guilds }),
        //   envParseString('DISCORD_BOTS_GG_TOKEN'),
        //   Lists.DiscordBotsGG
        // ),
        this.query(
          `https://discords.com/bots/api/bot/${envParseString('CLIENT_ID')}`,
          JSON.stringify({ server_count: guilds }),
          envParseString('DISCORDS_TOKEN'),
          Lists.Discords
        ),
        // this.query(
        //   `https://bots.discordlabs.org/v2/bot/${envParseString('CLIENT_ID')}/stats,
        //   JSON.stringify({ server_count: guilds }),
        //   envParseString('DISCORDLABS_TOKEN'),
        //   Lists.Discords
        // ),
        // this.query(
        //   `https://api.bladelist.gg/bots/${envParseString('CLIENT_ID')}`,
        //   JSON.stringify({ server_count: guilds }),
        //   envParseString('BLADELIST_GG_TOKEN'),
        //   Lists.BladelistGG
        // ),
        this.query(
          `https://discordbotlist.com/api/v1/bots/${envParseString('CLIENT_ID')}/stats`,
          JSON.stringify({ guilds, users }),
          `Bot ${envParseString('DISCORD_BOT_LIST_TOKEN')}`,
          Lists.DiscordBotList
        )
        // this.query(
        //   `https://api.discordlist.space/v1/bots/${envParseString('CLIENT_ID')}`,
        //   JSON.stringify({ server_count: guilds }),
        //   envParseString('DISCORDLIST_SPACE_TOKEN'),
        //   Lists.BotListSpace
        // )
      ])
    ).filter(filterNullish);

    if (results.length) {
      this.container.logger.info(`${header} [ ${guilds} [G] ] [ ${users} [U] ] | ${results.join(' | ')}`);
    }
  }

  private async query(url: string, body: string, token: string | null, list: Lists) {
    if (isNullishOrEmpty(token)) {
      return null;
    }

    const result = await fromAsync(async () => {
      await fetch(
        url,
        {
          body,
          headers: { 'content-type': 'application/json', authorization: token },
          method: 'POST'
        },
        FetchResultTypes.Result
      );

      return green(list);
    });

    if (isErr(result)) {
      return `${red(list)} [${red((result.error as QueryError).code.toString())}]`;
    }

    return result.value;
  }
}
