import { ModalCustomIds } from '#utils/constants';
import { seconds } from '#utils/functions/time';
import { clean } from '#utils/Sanitizer/clean';
import { ApplyOptions } from '@sapphire/decorators';
import { canSendMessages } from '@sapphire/discord.js-utilities';
import { fetch, FetchMethods, FetchResultTypes } from '@sapphire/fetch';
import { Stopwatch } from '@sapphire/stopwatch';
import { Type } from '@sapphire/type';
import { codeBlock, filterNullAndUndefinedAndEmpty, isNullish, isThenable } from '@sapphire/utilities';
import { bold, hideLinkEmbed, type APIMessage, type Message, type ModalSubmitInteraction } from 'discord.js';
import { setTimeout as sleep } from 'node:timers/promises';
import { inspect } from 'node:util';

import { decompressEvalCustomIdMetadata, type EvalModalData } from '#utils/evalCustomIdCompression';
import { InteractionHandler, InteractionHandlerTypes, UserError } from '@sapphire/framework';

@ApplyOptions<InteractionHandler.Options>({
  interactionHandlerType: InteractionHandlerTypes.ModalSubmit
})
export class ModalHandler extends InteractionHandler {
  public override async run(interaction: ModalSubmitInteraction, evalParameters: InteractionHandler.ParseResult<this>) {
    if (isNullish(evalParameters.code)) {
      throw new UserError({
        identifier: 'EvalFail',
        message: 'I am sorry, but you did not provide any code to evaluate.'
      });
    }

    const { success, result, time, type } = await this.timedEval(interaction, evalParameters);

    if (evalParameters.silent) {
      if (!success && result && (result as unknown as Error).stack) this.container.logger.fatal((result as unknown as Error).stack);
      return null;
    }

    const footer = codeBlock('ts', type as string);

    return this.handleReply(interaction, {
      hastebinUnavailable: false,
      replyUnavailable: false,
      fileUnavailable: false,
      consoleUnavailable: true,
      code: evalParameters.code,
      url: null,
      success,
      result,
      time,
      footer,
      language: evalParameters.language,
      outputTo: evalParameters.outputTo as 'reply' | 'file' | 'hastebin' | 'console' | 'none'
    });
  }

  public override async parse(interaction: ModalSubmitInteraction) {
    if (!interaction.customId.startsWith(ModalCustomIds.Eval)) return this.none();

    const message = await interaction.deferReply({ ephemeral: true, fetchReply: true });

    const code = interaction.fields.getTextInputValue('code-input');

    const splitCustomId = interaction.customId.split('|');
    const data = decompressEvalCustomIdMetadata(splitCustomId.slice(1).join('|'), {
      interaction,
      handler: this
    });

    return this.some({ code, message, ...data });
  }

  private async timedEval(interaction: ModalSubmitInteraction, evalParameters: InteractionHandler.ParseResult<this>) {
    if (evalParameters.timeout === Infinity || evalParameters.timeout === 0) return this.eval(interaction, evalParameters);

    return Promise.race([
      sleep(evalParameters.timeout).then(() => ({
        result: `TIMEOUT: Took longer than ${seconds.fromMilliseconds(evalParameters.timeout)} seconds.`,
        success: false,
        time: '⏱ ...',
        type: 'EvalTimeoutError'
      })),
      this.eval(interaction, evalParameters)
    ]);
  }

  private async eval(_interaction: ModalSubmitInteraction, evalParameters: InteractionHandler.ParseResult<this>) {
    const stopwatch = new Stopwatch();
    let success: boolean;
    let syncTime = '';
    let asyncTime = '';
    let result: unknown;
    let thenable = false;
    let type: Type;

    try {
      if (evalParameters.async) {
        const indentedCode = evalParameters.code
          .split('\n')
          .map((codeLine) => `  ${codeLine}`)
          .join('\n');

        evalParameters.code = `(async () => {\n${indentedCode}\n})();`;
      }

      // @ts-expect-error value is never read, this is so `msg` is possible as an alias when sending the eval.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const msg = evalParameters.message;

      // @ts-expect-error value is never read, this is so `msg` is possible as an alias when sending the eval.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const interaction = _interaction;

      // eslint-disable-next-line no-eval
      result = eval(evalParameters.code);
      syncTime = stopwatch.toString();
      type = new Type(result);
      if (isThenable(result)) {
        thenable = true;
        stopwatch.restart();
        result = await result;
        asyncTime = stopwatch.toString();
      }

      success = true;
    } catch (error) {
      if (!syncTime.length) syncTime = stopwatch.toString();
      if (thenable && !asyncTime.length) asyncTime = stopwatch.toString();
      if (!type!) type = new Type(error);
      result = error;
      success = false;
    }

    stopwatch.stop();
    if (typeof result !== 'string') {
      result =
        result instanceof Error
          ? result.stack
          : inspect(result, {
              depth: evalParameters.depth,
              showHidden: evalParameters.showHidden
            });
    }
    return {
      success,
      type: type!,
      time: this.formatTime(syncTime, asyncTime ?? ''),
      result: clean(result as string)
    };
  }

  private async handleReply(interaction: ModalSubmitInteraction, evalParameters: EvalReplyParameters): Promise<APIMessage | Message<boolean> | null> {
    const typeFooter = `${bold('Type')}:${evalParameters.footer}`;
    const timeTaken = evalParameters.time;

    switch (evalParameters.outputTo) {
      case 'file': {
        if (canSendMessages(interaction.channel)) {
          const output = 'Sent the result as a file.';
          const content = [output, typeFooter, timeTaken] //
            .filter(filterNullAndUndefinedAndEmpty)
            .join('\n');

          const attachment = Buffer.from(evalParameters.result);
          const name = `output.${evalParameters.language}`;

          return interaction.editReply({ content, files: [{ attachment, name }] });
        }

        evalParameters.fileUnavailable = true;
        this.getOtherTypeOutput(evalParameters);

        return this.handleReply(interaction, evalParameters);
      }
      case 'hastebin': {
        if (!evalParameters.url) {
          evalParameters.url = await this.getHaste(evalParameters.result, evalParameters.language ?? 'md').catch(() => null);
        }

        if (evalParameters.url) {
          const hastebinUrl = `Sent the result to hastebin: ${hideLinkEmbed(evalParameters.url)}`;

          const content = [hastebinUrl, typeFooter, timeTaken] //
            .filter(filterNullAndUndefinedAndEmpty)
            .join('\n');

          return interaction.editReply({ content });
        }

        evalParameters.hastebinUnavailable = true;

        this.getOtherTypeOutput(evalParameters);

        return this.handleReply(interaction, evalParameters);
      }
      case 'console': {
        this.container.logger.info(evalParameters.result);
        const output = 'Sent the result to console.';

        const content = [output, typeFooter, timeTaken] //
          .filter(filterNullAndUndefinedAndEmpty)
          .join('\n');

        return interaction.editReply({ content });
      }
      case 'none': {
        return interaction.editReply({ content: 'Aborted!' });
      }
      case 'reply':
      default: {
        if (evalParameters.result.length > 1950) {
          evalParameters.replyUnavailable = true;
          this.getOtherTypeOutput(evalParameters);

          return this.handleReply(interaction, evalParameters);
        }

        if (evalParameters.success) {
          const parsedInput = `${bold('Input')}:${codeBlock(evalParameters.language, evalParameters.code)}`;
          const parsedOutput = `${bold('Output')}:${codeBlock(evalParameters.language, evalParameters.result)}`;

          const content = [parsedInput, parsedOutput, typeFooter, timeTaken].filter(Boolean).join('\n');
          return interaction.editReply({ content });
        }

        const output = codeBlock(evalParameters.language ?? 'ts', evalParameters.result!);
        const content = `${bold('Error')}:${output}\n${bold('Type')}:${evalParameters.footer}\n${evalParameters.time}`;
        return interaction.editReply({ content });
      }
    }
  }

  private getOtherTypeOutput(evalParameters: EvalReplyParameters) {
    if (!evalParameters.replyUnavailable) {
      evalParameters.outputTo = 'reply';
      return;
    }

    if (!evalParameters.hastebinUnavailable) {
      evalParameters.outputTo = 'hastebin';
      return;
    }

    if (!evalParameters.fileUnavailable) {
      evalParameters.outputTo = 'file';
      return;
    }

    if (!evalParameters.consoleUnavailable) {
      evalParameters.outputTo = 'console';
      return;
    }

    evalParameters.outputTo = 'none';
  }

  private formatTime(syncTime: string, asyncTime?: string) {
    return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
  }

  private async getHaste(result: string, language = 'js') {
    const { key } = await fetch<HastebinResponse>(
      `https://hastebin.skyra.pw/documents`,
      {
        method: FetchMethods.Post,
        body: result
      },
      FetchResultTypes.JSON
    );
    return `https://hastebin.skyra.pw/${key}.${language}`;
  }
}

interface HastebinResponse {
  key: string;
}

interface EvalReplyParameters extends Pick<EvalModalData, 'language'> {
  hastebinUnavailable: boolean;
  replyUnavailable: boolean;
  consoleUnavailable: boolean;
  fileUnavailable: boolean;
  url: string | null;
  code: string;
  success: boolean;
  result: string;
  time: string;
  footer: string;
  outputTo: 'reply' | 'file' | 'hastebin' | 'console' | 'none';
}
