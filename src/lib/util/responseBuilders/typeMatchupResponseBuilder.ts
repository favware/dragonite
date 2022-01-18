import { BrandingColors, CdnUrls } from '#utils/constants';
import { parseBulbapediaURL } from '#utils/functions/pokemonParsers';
import type { Type, TypeMatchup, TypesEnum } from '@favware/graphql-pokemon';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { container } from '@sapphire/framework';
import { MessageEmbed } from 'discord.js';

export function typeMatchupResponseBuilder(types: TypesEnum[], typeMatchups: TypeMatchup) {
  const embedTranslations: TypeMatchupEmbedTitles = {
    offensive: 'Offensive',
    defensive: 'Defensive',
    superEffectiveAgainst: 'Super effective against',
    dealsNormalDamageTo: 'Deals normal damage to',
    doesNotAffect: "Doesn't affect",
    notVeryEffectiveAgainst: 'Not very effective against',
    vulnerableTo: 'Vulnerable to',
    takesNormalDamageFrom: 'Takes normal damage from',
    resists: 'Resists',
    notAffectedBy: 'Not affected by',
    typeEffectivenessFor: `Type effectiveness for ${container.i18n.listAnd.format(types)}`
  };

  const externalResources = 'External Resources';

  const externalSources = [
    `[Bulbapedia](${parseBulbapediaURL(`https://bulbapedia.bulbagarden.net/wiki/${types[0]}_(type)`)} )`,
    `[Serebii](https://www.serebii.net/pokedex-sm/${types[0].toLowerCase()}.shtml)`,
    `[Smogon](http://www.smogon.com/dex/sm/types/${types[0]})`
  ].join(' | ');

  return new PaginatedMessage({
    template: new MessageEmbed()
      .setColor(BrandingColors.Primary) //
      .setAuthor({ name: `${embedTranslations.typeEffectivenessFor}`, iconURL: CdnUrls.Pokedex }) //
  })
    .setSelectMenuOptions((pageIndex) => ({ label: [embedTranslations.offensive, embedTranslations.defensive][pageIndex - 1] }))
    .addPageEmbed((embed) =>
      embed
        .addField(
          embedTranslations.offensive,
          [
            `${embedTranslations.superEffectiveAgainst}: ${parseEffectiveMatchup(
              typeMatchups.attacking.doubleEffectiveTypes,
              typeMatchups.attacking.effectiveTypes
            )}`,
            '',
            `${embedTranslations.dealsNormalDamageTo}: ${parseRegularMatchup(typeMatchups.attacking.normalTypes)}`,
            '',
            `${embedTranslations.notVeryEffectiveAgainst}: ${parseResistedMatchup(
              typeMatchups.attacking.doubleResistedTypes,
              typeMatchups.attacking.resistedTypes
            )}`,
            '',
            `${
              typeMatchups.attacking.effectlessTypes.length
                ? `${embedTranslations.doesNotAffect}: ${parseRegularMatchup(typeMatchups.attacking.effectlessTypes)}`
                : ''
            }`
          ].join('\n')
        )
        .addField(externalResources, externalSources)
    )
    .addPageEmbed((embed) =>
      embed
        .addField(
          embedTranslations.defensive,
          [
            `${embedTranslations.vulnerableTo}: ${parseEffectiveMatchup(
              typeMatchups.defending.doubleEffectiveTypes,
              typeMatchups.defending.effectiveTypes
            )}`,
            '',
            `${embedTranslations.takesNormalDamageFrom}: ${parseRegularMatchup(typeMatchups.defending.normalTypes)}`,
            '',
            `${embedTranslations.resists}: ${parseResistedMatchup(typeMatchups.defending.doubleResistedTypes, typeMatchups.defending.resistedTypes)}`,
            '',
            `${
              typeMatchups.defending.effectlessTypes.length
                ? `${embedTranslations.notAffectedBy}: ${parseRegularMatchup(typeMatchups.defending.effectlessTypes)}`
                : ''
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

interface TypeMatchupEmbedTitles {
  offensive: string;
  defensive: string;
  superEffectiveAgainst: string;
  dealsNormalDamageTo: string;
  doesNotAffect: string;
  notVeryEffectiveAgainst: string;
  vulnerableTo: string;
  takesNormalDamageFrom: string;
  resists: string;
  notAffectedBy: string;
  typeEffectivenessFor: string;
}
