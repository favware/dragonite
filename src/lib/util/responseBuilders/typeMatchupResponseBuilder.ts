import { BrandingColors, Emojis } from '#utils/constants';
import { parseBulbapediaURL } from '#utils/functions/pokemonParsers';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import type { TypeEffectiveness, TypeMatchup, TypesEnum } from '@favware/graphql-pokemon';
import { container } from '@sapphire/framework';
import { toTitleCase } from '@sapphire/utilities';
import { ButtonStyle, EmbedBuilder, HeadingLevel, heading, hideLinkEmbed, hyperlink, type InteractionReplyOptions } from 'discord.js';

export function typeMatchupResponseBuilder(types: TypesEnum[], typeMatchups: TypeMatchup): InteractionReplyOptions {
  const i18nFormattedTypes = container.i18n.listAnd.format(parseTypesForMessageContent(types));

  const offensiveTypeMatchupEmbed = new EmbedBuilder()
    .setColor(BrandingColors.Primary) //
    .addFields({
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
    });

  const defensiveTypeMatchupEmbed = new EmbedBuilder()
    .setColor(BrandingColors.Primary) //
    .addFields({
      name: 'Defensive',
      value: [
        `Vulnerable to: ${parseEffectiveMatchup(typeMatchups.defending.doubleEffectiveTypes, typeMatchups.defending.effectiveTypes)}`,
        '',
        `Takes normal damage from: ${parseRegularMatchup(typeMatchups.defending.normalTypes)}`,
        '',
        `Resists: ${parseResistedMatchup(typeMatchups.defending.doubleResistedTypes, typeMatchups.defending.resistedTypes)}`,
        '',
        `${typeMatchups.defending.effectlessTypes.length ? `Not affected by: ${parseRegularMatchup(typeMatchups.defending.effectlessTypes)}` : ''}`
      ].join('\n')
    });

  return {
    content: heading(`Type effectiveness for ${i18nFormattedTypes}`, HeadingLevel.One),
    embeds: [offensiveTypeMatchupEmbed, defensiveTypeMatchupEmbed],
    components: parseExternalResources(types)
  };
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

function parseTypeForMessageContent(type: TypesEnum) {
  return hyperlink(toTitleCase(type), hideLinkEmbed(`https://bulbapedia.bulbagarden.net/wiki/${type}_(type)`));
}

function parseTypesForMessageContent(types: TypesEnum[]) {
  return types.map(parseTypeForMessageContent);
}

function parseExternalResources(types: TypesEnum[]): ActionRowBuilder<ButtonBuilder>[] {
  const typeOne = toTitleCase(types.at(0)!);
  const typeTwo = types.at(1);

  const actionRowForTypeOne = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel(typeOne)
      .setEmoji({ id: Emojis.Bulbapedia })
      .setURL(parseBulbapediaURL(`https://bulbapedia.bulbagarden.net/wiki/${typeOne}_(type)`)),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel(typeOne)
      .setEmoji({ id: Emojis.Serebii })
      .setURL(`https://www.serebii.net/pokedex-sv/${typeOne.toLowerCase()}.shtml`),
    new ButtonBuilder() //
      .setStyle(ButtonStyle.Link)
      .setLabel(typeOne)
      .setEmoji({ id: Emojis.Smogon })
      .setURL(`https://www.smogon.com/dex/sv/types/${typeOne}`)
  );

  if (typeTwo) {
    const titleCasedTypeTwo = toTitleCase(typeTwo);
    const actionRowForTypeTwo = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel(titleCasedTypeTwo)
        .setEmoji({ id: Emojis.Bulbapedia })
        .setURL(parseBulbapediaURL(`https://bulbapedia.bulbagarden.net/wiki/${typeTwo}_(type)`)),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel(titleCasedTypeTwo)
        .setEmoji({ id: Emojis.Serebii })
        .setURL(`https://www.serebii.net/pokedex-sv/${typeTwo.toLowerCase()}.shtml`),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel(titleCasedTypeTwo)
        .setEmoji({ id: Emojis.Smogon })
        .setURL(`https://www.smogon.com/dex/sv/types/${typeTwo}`)
    );

    return [actionRowForTypeOne, actionRowForTypeTwo];
  }

  return [actionRowForTypeOne];
}
