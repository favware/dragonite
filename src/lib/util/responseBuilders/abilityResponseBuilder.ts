import { BrandingColors, CdnUrls } from '#utils/constants';
import { parseBulbapediaURL } from '#utils/functions/pokemonParsers';
import type { Ability } from '@favware/graphql-pokemon';
import { toTitleCase } from '@sapphire/utilities';
import { EmbedBuilder } from 'discord.js';

export function abilityResponseBuilder(ability: Omit<Ability, '__typename'>) {
  const externalResources = [
    `[Bulbapedia](${parseBulbapediaURL(ability.bulbapediaPage)} )`,
    `[Serebii](${ability.serebiiPage})`,
    `[Smogon](${ability.smogonPage})`
  ].join(' | ');

  const embed = new EmbedBuilder()
    .setColor(BrandingColors.Primary)
    .setAuthor({ name: `Ability - ${toTitleCase(ability.name)}`, iconURL: CdnUrls.Pokedex })
    .setDescription(ability.desc || ability.shortDesc)
    .addFields({ name: 'External Resources', value: externalResources });

  if (ability.isFieldAbility) {
    embed.spliceFields(0, 0, { name: 'Effect outside of battle', value: ability.isFieldAbility, inline: false });
  }

  return [embed];
}
