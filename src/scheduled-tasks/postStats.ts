import { DragoniteEvents } from '#lib/types/Enums';
import { ApplyOptions } from '@sapphire/decorators';
import { fetch, FetchResultTypes, QueryError } from '@sapphire/fetch';
import { Result } from '@sapphire/framework';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { filterNullish, isNullishOrEmpty } from '@sapphire/utilities';
import { envParseString } from '@skyra/env-utilities';
import { blueBright, green, red } from 'colorette';
import { Constants } from 'discord.js';

const header = blueBright('[POST STATS   ]');

enum Lists {
  Discords = 'discords.com',
  TopGG = 'top.gg',
  BladelistGG = 'bladelist.gg',
  BotListMe = 'botlist.me'
}

@ApplyOptions<ScheduledTask.Options>({
  pattern: '*/10 * * * *',
  bullJobsOptions: {
    removeOnComplete: true
  }
})
export class PostStatsTask extends ScheduledTask {
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

    const results: (string | null)[] = (
      await Promise.all([
        this.query(
          `https://top.gg/api/bots/${envParseString('CLIENT_ID')}/stats`,
          JSON.stringify({ server_count: guilds, shard_count: 1 }),
          envParseString('TOP_GG_TOKEN'),
          Lists.TopGG
        ),
        this.query(
          `https://discords.com/bots/api/bot/${envParseString('CLIENT_ID')}`,
          JSON.stringify({ server_count: guilds }),
          envParseString('DISCORDS_TOKEN'),
          Lists.Discords
        ),
        this.query(
          `https://api.bladelist.gg/bots/${envParseString('CLIENT_ID')}`,
          JSON.stringify({ server_count: guilds, shard_count: 1 }),
          `Token ${envParseString('BLADELIST_GG_TOKEN')}`,
          Lists.BladelistGG
        ),
        this.query(
          `https://api.botlist.me/api/v1/bots/${envParseString('CLIENT_ID')}/stats`,
          JSON.stringify({ server_count: guilds, shard_count: 1 }),
          `Bot ${envParseString('BOTLIST_ME_TOKEN')}`,
          Lists.BotListMe
        )
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

    const result = await Result.fromAsync(async () => {
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

    return result.match({
      ok: (data) => data,
      err: (error) => {
        const errorMessage =
          error instanceof QueryError
            ? JSON.stringify({
                body: error.body,
                code: error.code,
                response: error.response,
                url: error.url,
                cause: error.cause,
                message: error.message
              })
            : error instanceof Error
            ? JSON.stringify({
                message: error.message,
                stack: error.stack,
                cause: error.cause,
                name: error.name
              }) //
            : 'Unknown error occurred!!';

        return `${red(list)} [${red(errorMessage)}]`;
      }
    });
  }
}
