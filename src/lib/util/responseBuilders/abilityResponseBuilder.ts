import { BrandingColors, CdnUrls, Emojis } from '#utils/constants';
import { parseBulbapediaURL } from '#utils/functions/pokemonParsers';
import type { Ability } from '@favware/graphql-pokemon';
import { toTitleCase } from '@sapphire/utilities';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, type InteractionEditReplyOptions } from 'discord.js';

export function abilityResponseBuilder(ability: Omit<Ability, '__typename'>): InteractionEditReplyOptions {
  const embed = new EmbedBuilder()
    .setColor(BrandingColors.Primary)
    .setAuthor({ name: `Ability - ${toTitleCase(ability.name)}`, iconURL: CdnUrls.Pokedex })
    .setDescription(ability.desc || ability.shortDesc)
    .addFields({ name: 'Available in generation 9', value: ability.isNonstandard ? 'No' : 'Yes' });

  if (ability.isFieldAbility) {
    embed.addFields({ name: 'Effect outside of battle', value: ability.isFieldAbility, inline: false });
  }

  return { embeds: [embed], components: parseExternalResources(ability) };
}

function parseExternalResources(ability: Omit<Ability, '__typename'>): ActionRowBuilder<ButtonBuilder>[] {
  return [
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel('Bulbapedia')
        .setEmoji({ id: Emojis.Bulbapedia })
        .setURL(parseBulbapediaURL(ability.bulbapediaPage)),
      new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Serebii').setEmoji({ id: Emojis.Serebii }).setURL(ability.serebiiPage),
      new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Smogon').setEmoji({ id: Emojis.Smogon }).setURL(ability.smogonPage)
    )
  ];
}
