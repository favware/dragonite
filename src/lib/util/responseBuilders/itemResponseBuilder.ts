import { BrandingColors, CdnUrls, Emojis } from '#utils/constants';
import { parseBulbapediaURL } from '#utils/functions/pokemonParsers';
import type { Item } from '@favware/graphql-pokemon';
import { container } from '@sapphire/framework';
import { toTitleCase } from '@sapphire/utilities';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, type InteractionEditReplyOptions } from 'discord.js';

export function itemResponseBuilder(item: Omit<Item, '__typename'>): InteractionEditReplyOptions {
  const embed = new EmbedBuilder()
    .setColor(BrandingColors.Primary)
    .setAuthor({ name: `Item - ${toTitleCase(item.name)}`, iconURL: CdnUrls.Pokedex })
    .setThumbnail(item.sprite)
    .setDescription(item.desc)
    .addFields(
      {
        name: 'Generation introduced',
        value: container.i18n.number.format(item.generationIntroduced),
        inline: true
      },
      {
        name: 'Available in generation 9',
        value: item.isNonstandard ? 'No' : 'Yes',
        inline: true
      }
    );

  return { embeds: [embed], components: parseExternalResources(item) };
}

function parseExternalResources(item: Omit<Item, '__typename'>): ActionRowBuilder<ButtonBuilder>[] {
  const actionRowBuilder = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel('Bulbapedia')
      .setEmoji({ id: Emojis.Bulbapedia })
      .setURL(parseBulbapediaURL(item.bulbapediaPage)),
    new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Serebii').setEmoji({ id: Emojis.Serebii }).setURL(item.serebiiPage)
  );

  if (item.smogonPage) {
    actionRowBuilder.addComponents(
      new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Smogon').setEmoji({ id: Emojis.Smogon }).setURL(item.smogonPage)
    );
  }

  return [actionRowBuilder];
}
