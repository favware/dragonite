import { BrandingColors, CdnUrls, Emojis } from '#utils/constants';
import type { Move } from '@favware/graphql-pokemon';
import { parseBulbapediaURL } from '@favware/graphql-pokemon/utilities';
import { PaginatedMessage, type PaginatedMessageAction } from '@sapphire/discord.js-utilities';
import { container } from '@sapphire/framework';
import { toTitleCase } from '@sapphire/utilities';
import { ButtonBuilder, ButtonStyle, EmbedBuilder, type APIButtonComponentWithURL } from 'discord.js';

const PageLabels = ['General', 'Categories', 'Boosted Power Information', 'Availability'];

export function moveResponseBuilder(move: Omit<Move, '__typename'>): PaginatedMessage {
  const paginatedMessage = new PaginatedMessage({
    template: new EmbedBuilder()
      .setColor(BrandingColors.Primary)
      .setAuthor({ name: `Move - ${toTitleCase(move.name)}`, iconURL: CdnUrls.Pokedex })
      .setDescription(move.desc || move.shortDesc)
  })
    .addActions(parseExternalResources(move))
    .setSelectMenuOptions((pageIndex) => ({ label: PageLabels[pageIndex - 1] }))
    .addPageEmbed((embed) => {
      if (move.isFieldMove) {
        embed.addFields({ name: 'Effect outside of battle', value: move.isFieldMove });
      }

      return embed.addFields(
        { name: 'Type', value: move.type, inline: true },
        { name: 'Base Power', value: move.basePower, inline: true },
        { name: 'PP', value: container.i18n.number.format(move.pp), inline: true },
        { name: 'Accuracy', value: `${move.accuracy}%`, inline: true }
      );
    })
    .addPageEmbed((embed) =>
      embed.addFields(
        { name: 'Category', value: move.category, inline: true },
        { name: 'Priority', value: container.i18n.number.format(move.priority), inline: true },
        { name: 'Category', value: move.category, inline: true },
        { name: 'Priority', value: container.i18n.number.format(move.priority), inline: true },
        { name: 'Target', value: move.target, inline: true },
        { name: 'Contest Condition', value: move.contestType ?? 'None', inline: true }
      )
    );

  // If the move has zMovePower or maxMovePower then squeeze it in between as a page
  if (move.zMovePower || move.maxMovePower) {
    paginatedMessage.addPageEmbed((embed) => {
      if (move.maxMovePower) {
        embed.addFields({ name: 'Base power as MAX move (Dynamax)', value: container.i18n.number.format(move.maxMovePower) });
      }

      if (move.zMovePower) {
        embed.addFields({ name: 'Base power as Z-Move (Z-Crystal)', value: container.i18n.number.format(move.zMovePower) });
      }

      return embed;
    });
  }

  return paginatedMessage.addPageEmbed((embed) =>
    embed.addFields(
      { name: 'Z-Crystal', value: move.isZ ?? 'None', inline: true },
      { name: 'G-MAX Pokémon', value: move.isGMax ?? 'None', inline: true },
      { name: 'Available in Generation 9', value: move.isNonstandard ? 'No' : 'Yes', inline: true }
    )
  );
}

function parseExternalResources(move: Omit<Move, '__typename'>): PaginatedMessageAction[] {
  return [
    new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel('Bulbapedia')
      .setEmoji({ id: Emojis.Bulbapedia })
      .setURL(parseBulbapediaURL(move.bulbapediaPage))
      .toJSON() as APIButtonComponentWithURL,
    new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel('Serebii')
      .setEmoji({ id: Emojis.Serebii })
      .setURL(move.serebiiPage)
      .toJSON() as APIButtonComponentWithURL,
    new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel('Smogon')
      .setEmoji({ id: Emojis.Smogon })
      .setURL(move.smogonPage)
      .toJSON() as APIButtonComponentWithURL
  ];
}
