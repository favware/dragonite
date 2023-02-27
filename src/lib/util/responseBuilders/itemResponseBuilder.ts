import { BrandingColors, CdnUrls } from '#utils/constants';
import { parseBulbapediaURL } from '#utils/functions/pokemonParsers';
import type { Item } from '@favware/graphql-pokemon';
import { container } from '@sapphire/framework';
import { filterNullish, toTitleCase } from '@sapphire/utilities';
import { EmbedBuilder, hyperlink } from 'discord.js';

export function itemResponseBuilder(item: Omit<Item, '__typename'>) {
  const externalResources = [
    hyperlink('Bulbapedia', parseBulbapediaURL(item.bulbapediaPage)),
    hyperlink('Serebii', item.serebiiPage),
    item.smogonPage ? `[Smogon](${item.smogonPage})` : undefined
  ]
    .filter(filterNullish)
    .join(' | ');

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
