import { BrandingColors, CdnUrls, Emojis } from '#utils/constants';
import type { Nature } from '@favware/graphql-pokemon';
import { toTitleCase } from '@sapphire/utilities';
import { ActionRowBuilder, bold, ButtonBuilder, ButtonStyle, EmbedBuilder, type InteractionEditReplyOptions } from 'discord.js';

export function natureResponseBuilder(nature: Omit<Nature, '__typename'>): InteractionEditReplyOptions {
  const embed = new EmbedBuilder()
    .setColor(BrandingColors.Primary)
    .setAuthor({ name: `Nature - ${toTitleCase(nature.name)}`, iconURL: CdnUrls.Pokedex })
    .setDescription(
      [
        `${bold('Increased stat')}: ${nature.increasedStat ?? 'None'}`,
        `${bold('Decreased stat')}: ${nature.decreasedStat ?? 'None'}`,
        `${bold('Preferred flavor')}: ${nature.preferredFlavor ?? 'None'}`,
        `${bold('Disliked flavor')}: ${nature.dislikedFlavor ?? 'None'}`
      ].join('\n')
    );

  const actionRowBuilder = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel('Bulbapedia')
      .setEmoji({ id: Emojis.Bulbapedia })
      .setURL('https://bulbapedia.bulbagarden.net/wiki/Nature'),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel('Serebii')
      .setEmoji({ id: Emojis.Serebii })
      .setURL('https://www.serebii.net/games/natures.shtml')
  );

  return { embeds: [embed], components: [actionRowBuilder] };
}
