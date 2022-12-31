import { CdnUrls } from '#utils/constants';
import { pokemonEnumToSpecies, resolveColour } from '#utils/functions/pokemonParsers';
import type { PokemonSpriteTypes } from '#utils/responseBuilders/pokemonResponseBuilder';
import type { Learnset, LearnsetLevelUpMove, Maybe } from '@favware/graphql-pokemon';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { container } from '@sapphire/framework';
import { isNullish, toTitleCase } from '@sapphire/utilities';
import { bold, EmbedBuilder, underscore } from 'discord.js';

export function learnsetResponseBuilder(
  learnsetData: Omit<Learnset, '__typename'>,
  moves: string[],
  generation: number,
  spriteToGet: PokemonSpriteTypes
) {
  const display = new PaginatedMessage({
    template: new EmbedBuilder()
      .setColor(resolveColour(learnsetData.color))
      .setAuthor({ name: `#${learnsetData.num} - ${pokemonEnumToSpecies(learnsetData.pokemonKey)}`, iconURL: CdnUrls.Pokedex })
      .setTitle(`Learnset data for ${pokemonEnumToSpecies(learnsetData.pokemonKey)} in generation ${generation}`)
      .setThumbnail(learnsetData[spriteToGet])
  });

  const learnableMethods = Object.entries(learnsetData).filter(
    ([key, value]) => key.endsWith('Moves') && (value as LearnsetLevelUpMove[]).length
  ) as [keyof LearnMethodTypesReturn, LearnsetLevelUpMove[]][];

  display.setSelectMenuOptions((pageIndex) => ({
    label: learnableMethods.map(([method]) => toTitleCase(method.slice(0, method.length - 5)))[pageIndex - 1]
  }));

  if (learnableMethods.length === 0) {
    return display.addPageEmbed((embed) =>
      embed.setDescription(`Looks like ${pokemonEnumToSpecies(learnsetData.pokemonKey)} cannot learn ${container.i18n.listOr.format(moves)}`)
    );
  }

  for (const [methodName, methodData] of learnableMethods) {
    const methods = methodData.map((moveData) => {
      const methodTypes = learnMethodTypes(moveData.level);
      return `In generation ${generation} ${pokemonEnumToSpecies(learnsetData.pokemonKey)} ${underscore(bold('can'))} learn ${bold(
        moveData.move.name!
      )} ${methodTypes[methodName]}`;
    });

    display.addPageEmbed((embed) => embed.setDescription(methods.join('\n')));
  }

  return display;
}

function learnMethodTypes(level: Maybe<number> | undefined): LearnMethodTypesReturn {
  return {
    levelUpMoves: `by level up${isNullish(level) ? '' : ` at level ${level}`}`,
    eventMoves: 'through an event',
    tutorMoves: 'from a move tutor',
    eggMoves: 'as an egg move',
    virtualTransferMoves: 'by transferring from virtual console games',
    tmMoves: 'by using a technical machine or technical record',
    dreamworldMoves: 'through a Dream World capture'
  };
}

interface LearnMethodTypesReturn {
  dreamworldMoves: string;

  eggMoves: string;

  eventMoves: string;

  levelUpMoves: string;

  tmMoves: string;

  tutorMoves: string;

  virtualTransferMoves: string;
}
