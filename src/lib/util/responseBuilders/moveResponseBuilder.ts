import { PaginatedMessage } from '#lib/PaginatedMessages/PaginatedMessage';
import { BrandingColors, CdnUrls } from '#utils/constants';
import { parseBulbapediaURL } from '#utils/functions/pokemonParsers';
import type { Move } from '@favware/graphql-pokemon';
import { container } from '@sapphire/framework';
import { toTitleCase } from '@sapphire/utilities';
import { MessageEmbed } from 'discord.js';

const PageLabels = ['General', 'Categories', 'Boosted Power Information', 'Availability'];

export function moveResponseBuilder(move: Omit<Move, '__typename'>) {
  const externalSources = [
    `[Bulbapedia](${parseBulbapediaURL(move.bulbapediaPage)} )`,
    `[Serebii](${move.serebiiPage})`,
    `[Smogon](${move.smogonPage})`
  ].join(' | ');

  const paginatedMessage = new PaginatedMessage({
    template: new MessageEmbed()
      .setColor(BrandingColors.Primary)
      .setAuthor({ name: `Move - ${toTitleCase(move.name)}`, iconURL: CdnUrls.Pokedex })
      .setDescription(move.desc || move.shortDesc)
  })
    .setSelectMenuOptions((pageIndex) => ({ label: PageLabels[pageIndex - 1] }))
    .addPageEmbed((embed) => {
      if (move.isFieldMove) {
        embed.addField('Effect outside of battle', move.isFieldMove, false);
      }

      return embed
        .addField('Type', move.type, true)
        .addField('Base Power', move.basePower, true)
        .addField('PP', container.i18n.number.format(move.pp), true)
        .addField('Accuracy', `${move.accuracy}%`, true)
        .addField('External Resources', externalSources);
    })
    .addPageEmbed((embed) =>
      embed
        .addField('Category', move.category, true)
        .addField('Priority', container.i18n.number.format(move.priority), true)
        .addField('Target', move.target, true)
        .addField('Contest Condition', move.contestType ?? 'None', true)
        .addField('External Resources', externalSources)
    );

  // If the move has zMovePower or maxMovePower then squeeze it in between as a page
  if (move.zMovePower || move.maxMovePower) {
    paginatedMessage.addPageEmbed((embed) => {
      if (move.maxMovePower) {
        embed.addField('Base power as MAX move (Dynamax)', container.i18n.number.format(move.maxMovePower));
      }
      if (move.zMovePower) {
        embed.addField('Base power as Z-Move (Z-Crystal)', container.i18n.number.format(move.zMovePower));
      }

      embed.addField('External Resources', externalSources);
      return embed;
    });
  }

  return paginatedMessage.addPageEmbed((embed) =>
    embed
      .addField('Z-Crystal', move.isZ ?? 'None', true)
      .addField('G-MAX Pokémon', move.isGMax ?? 'None', true)
      .addField('Available in Generation 8', move.isNonstandard === 'Past' ? 'No' : 'Yes', true)
      .addField('External Resources', externalSources)
  );
}
