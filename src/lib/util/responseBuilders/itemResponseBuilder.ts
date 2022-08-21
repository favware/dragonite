import { BrandingColors, CdnUrls } from '#utils/constants';
import { parseBulbapediaURL } from '#utils/functions/pokemonParsers';
import type { Item } from '@favware/graphql-pokemon';
import { container } from '@sapphire/framework';
import { filterNullish, toTitleCase } from '@sapphire/utilities';
import { MessageEmbed } from 'discord.js';

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
    .addFields(
      {
        name: 'Generation introduced',
        value: container.i18n.number.format(item.generationIntroduced),
        inline: true
      },
      {
        name: 'Available in generation 8',
        value: item.isNonstandard === 'Past' ? 'No' : 'Yes',
        inline: true
      },
      {
        name: 'External Resources',
        value: externalResources
      }
    );

  return [embed];
}
