import { BrandingColors, CdnUrls } from '#utils/constants';
import { parseBulbapediaURL } from '#utils/functions/pokemonParsers';
import type { TypeEffectiveness, TypeMatchup, TypesEnum } from '@favware/graphql-pokemon';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { container } from '@sapphire/framework';
import { EmbedBuilder, hyperlink } from 'discord.js';

export function typeMatchupResponseBuilder(types: TypesEnum[], typeMatchups: TypeMatchup) {
  const externalResources = 'External Resources';

  const externalSources = [
    hyperlink('Bulbapedia', parseBulbapediaURL(`https://bulbapedia.bulbagarden.net/wiki/${types[0]}_(type)`)),
    hyperlink('Serebii', `https://www.serebii.net/pokedex-sv/${types[0].toLowerCase()}.shtml`),
    hyperlink('Smogon', `http://www.smogon.com/dex/sv/types/${types[0]}`)
  ].join(' | ');

  return new PaginatedMessage({
    template: new EmbedBuilder()
      .setColor(BrandingColors.Primary) //
      .setAuthor({ name: `Type effectiveness for ${container.i18n.listAnd.format(types)}`, iconURL: CdnUrls.Pokedex }) //
  })
    .setSelectMenuOptions((pageIndex) => ({ label: ['Offensive', 'Defensive'][pageIndex - 1] }))
    .addPageEmbed((embed) =>
      embed.addFields(
        {
          name: 'Offensive',
          value: [
            `Super effective against: ${parseEffectiveMatchup(typeMatchups.attacking.doubleEffectiveTypes, typeMatchups.attacking.effectiveTypes)}`,
            '',
            `Deals normal damage to: ${parseRegularMatchup(typeMatchups.attacking.normalTypes)}`,
            '',
            `Not very effective against: ${parseResistedMatchup(typeMatchups.attacking.doubleResistedTypes, typeMatchups.attacking.resistedTypes)}`,
            '',
            `${typeMatchups.attacking.effectlessTypes.length ? `Doesn't affect: ${parseRegularMatchup(typeMatchups.attacking.effectlessTypes)}` : ''}`
          ].join('\n')
        },
        {
          name: externalResources,
          value: externalSources
        }
      )
    )
    .addPageEmbed((embed) =>
      embed.addFields(
        {
          name: 'Defensive',
          value: [
            `Vulnerable to: ${parseEffectiveMatchup(typeMatchups.defending.doubleEffectiveTypes, typeMatchups.defending.effectiveTypes)}`,
            '',
            `Takes normal damage from: ${parseRegularMatchup(typeMatchups.defending.normalTypes)}`,
            '',
            `Resists: ${parseResistedMatchup(typeMatchups.defending.doubleResistedTypes, typeMatchups.defending.resistedTypes)}`,
            '',
            `${
              typeMatchups.defending.effectlessTypes.length ? `Not affected by: ${parseRegularMatchup(typeMatchups.defending.effectlessTypes)}` : ''
            }`
          ].join('\n')
        },
        {
          name: externalResources,
          value: externalSources
        }
      )
    );
}

function parseEffectiveMatchup(doubleEffectiveTypes: TypeEffectiveness['doubleEffectiveTypes'], effectiveTypes: TypeEffectiveness['effectiveTypes']) {
  return doubleEffectiveTypes
    .map((type): string => `${type} (x4)`)
    .concat(effectiveTypes.map((type) => `${type} (x2)`))
    .map((type) => `\`${type}\``)
    .join(', ');
}

function parseResistedMatchup(doubleResistedTypes: TypeEffectiveness['doubleResistedTypes'], resistedTypes: TypeEffectiveness['resistedTypes']) {
  return doubleResistedTypes
    .map((type): string => `${type} (x0.25)`)
    .concat(resistedTypes.map((type) => `${type} (x0.5)`))
    .map((type) => `\`${type}\``)
    .join(', ');
}

function parseRegularMatchup(regularMatchup: TypeEffectiveness['normalTypes'] | TypeEffectiveness['effectlessTypes']) {
  return regularMatchup.map((type) => `\`${type}\``).join(', ');
}
