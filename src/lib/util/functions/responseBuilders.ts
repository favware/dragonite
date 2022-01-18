import { BrandingColors, CdnUrls } from '#utils/constants';
import { parseBulbapediaURL } from '#utils/functions/pokemonParsers';
import type { Ability, Item } from '@favware/graphql-pokemon';
import { container } from '@sapphire/framework';
import { filterNullish, toTitleCase } from '@sapphire/utilities';
import { MessageEmbed } from 'discord.js';

export function abilityResponseBuilder(ability: Omit<Ability, '__typename'>) {
  const externalResources = [
    `[Bulbapedia](${parseBulbapediaURL(ability.bulbapediaPage)} )`,
    `[Serebii](${ability.serebiiPage})`,
    `[Smogon](${ability.smogonPage})`
  ].join(' | ');

  const embed = new MessageEmbed()
    .setColor(BrandingColors.Primary)
    .setAuthor({ name: `Ability - ${toTitleCase(ability.name)}`, iconURL: CdnUrls.Pokedex })
    .setDescription(ability.desc || ability.shortDesc)
    .addField('External Resources', externalResources);

  if (ability.isFieldAbility) {
    embed.spliceFields(0, 0, { name: 'Effect outside of battle', value: ability.isFieldAbility, inline: false });
  }

  return [embed];
}

export function itemResponseBuilder(item: Omit<Item, '__typename'>) {
  const externalResources = [
    `[Bulbapedia](${parseBulbapediaURL(item.bulbapediaPage)} )`,
    `[Serebii](${item.serebiiPage})`,
    item.smogonPage ? `[Smogon](${item.smogonPage})` : undefined
  ]
    .filter(filterNullish)
    .join(' | ');

  const embed = new MessageEmbed()
    .setColor(BrandingColors.Primary)
    .setAuthor({ name: `Item - ${toTitleCase(item.name)}`, iconURL: CdnUrls.Pokedex })
    .setThumbnail(item.sprite)
    .setDescription(item.desc)
    .addField('Generation introduced', container.i18n.number.format(item.generationIntroduced), true)
    .addField('Available in generation 8', item.isNonstandard === 'Past' ? 'No' : 'Yes', true)
    .addField('External Resources', externalResources);

  return [embed];
}
