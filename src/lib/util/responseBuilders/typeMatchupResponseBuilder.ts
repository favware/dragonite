import { PaginatedMessage } from '#lib/PaginatedMessages/PaginatedMessage';
import { BrandingColors, CdnUrls } from '#utils/constants';
import { parseBulbapediaURL } from '#utils/functions/pokemonParsers';
import type { Type, TypeMatchup, TypesEnum } from '@favware/graphql-pokemon';
import { container } from '@sapphire/framework';
import { MessageEmbed } from 'discord.js';

export function typeMatchupResponseBuilder(types: TypesEnum[], typeMatchups: TypeMatchup) {
  const externalResources = 'External Resources';

  const externalSources = [
    `[Bulbapedia](${parseBulbapediaURL(`https://bulbapedia.bulbagarden.net/wiki/${types[0]}_(type)`)} )`,
    `[Serebii](https://www.serebii.net/pokedex-sm/${types[0].toLowerCase()}.shtml)`,
    `[Smogon](http://www.smogon.com/dex/sm/types/${types[0]})`
  ].join(' | ');

  return new PaginatedMessage({
    template: new MessageEmbed()
      .setColor(BrandingColors.Primary) //
      .setAuthor({ name: `Type effectiveness for ${container.i18n.listAnd.format(types)}`, iconURL: CdnUrls.Pokedex }) //
  })
    .setSelectMenuOptions((pageIndex) => ({ label: ['Offensive', 'Defensive'][pageIndex - 1] }))
    .addPageEmbed((embed) =>
      embed
        .addField(
          'Offensive',
          [
            `Super effective against: ${parseEffectiveMatchup(typeMatchups.attacking.doubleEffectiveTypes, typeMatchups.attacking.effectiveTypes)}`,
            '',
            `Deals normal damage to: ${parseRegularMatchup(typeMatchups.attacking.normalTypes)}`,
            '',
            `Not very effective against: ${parseResistedMatchup(typeMatchups.attacking.doubleResistedTypes, typeMatchups.attacking.resistedTypes)}`,
            '',
            `${typeMatchups.attacking.effectlessTypes.length ? `Doesn't affect: ${parseRegularMatchup(typeMatchups.attacking.effectlessTypes)}` : ''}`
          ].join('\n')
        )
        .addField(externalResources, externalSources)
    )
    .addPageEmbed((embed) =>
      embed
        .addField(
          'Defensive',
          [
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
        )
        .addField(externalResources, externalSources)
    );
}

function parseEffectiveMatchup(doubleEffectiveTypes: Type['doubleEffectiveTypes'], effectiveTypes: Type['effectiveTypes']) {
  return doubleEffectiveTypes
    .map((type): string => `${type} (x4)`)
    .concat(effectiveTypes.map((type) => `${type} (x2)`))
    .map((type) => `\`${type}\``)
    .join(', ');
}

function parseResistedMatchup(doubleResistedTypes: Type['doubleResistedTypes'], resistedTypes: Type['resistedTypes']) {
  return doubleResistedTypes
    .map((type): string => `${type} (x0.25)`)
    .concat(resistedTypes.map((type) => `${type} (x0.5)`))
    .map((type) => `\`${type}\``)
    .join(', ');
}

function parseRegularMatchup(regularMatchup: Type['normalTypes'] | Type['effectlessTypes']) {
  return regularMatchup.map((type) => `\`${type}\``).join(', ');
}
