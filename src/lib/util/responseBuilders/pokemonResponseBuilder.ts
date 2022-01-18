import { BrandingColors, CdnUrls, Emojis } from '#utils/constants';
import type { FavouredEntry } from '#utils/favouredEntries';
import { parseBulbapediaURL, pokemonEnumToSpecies } from '#utils/functions/pokemonParsers';
import type { KeysContaining } from '#utils/utils';
import type { Abilities, EvYields, Gender, Pokemon, PokemonEnum, Stats } from '@favware/graphql-pokemon';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { container } from '@sapphire/framework';
import { filterNullish, isNullish, toTitleCase } from '@sapphire/utilities';
import { ApplicationCommandOptionChoice, MessageEmbed, MessageSelectOptionData } from 'discord.js';

enum StatsEnum {
  hp = 'HP',
  attack = 'ATK',
  defense = 'DEF',
  specialattack = 'SPA',
  specialdefense = 'SPD',
  speed = 'SPE'
}

const PageLabels = ['General', 'Growth Information', 'Competitive Battling Information', 'PokéDex Entries'];

export function fuzzyPokemonToSelectOption<L extends 'name' | 'label'>(
  fuzzyMatch: Pokemon | FavouredEntry<PokemonEnum>,
  labelLikeKey: L
): L extends 'name' ? ApplicationCommandOptionChoice : MessageSelectOptionData {
  const label = isFavouredEntry(fuzzyMatch) ? fuzzyMatch.name : pokemonEnumToSpecies(fuzzyMatch.key);

  // @ts-expect-error TS is not able to infer that `labelLikeKey` is 'name' | 'label'
  return { [labelLikeKey]: label, value: fuzzyMatch.key };
}

export function pokemonResponseBuilder(pokeDetails: Omit<Pokemon, '__typename'>, spriteToGet: PokemonSpriteTypes) {
  const abilities = getAbilities(pokeDetails.abilities);
  const baseStats = getBaseStats(pokeDetails.baseStats);
  const evYields = getEvYields(pokeDetails.evYields);
  const evoChain = getEvoChain(pokeDetails);

  const embedTranslations: PokedexEmbedTitles = {
    types: 'Type(s)',
    abilities: 'Abilities',
    genderRatio: 'Gender Ratio',
    smogonTier: 'Smogon Tier',
    unknownSmogonTier: 'Unknown / Alt form',
    height: 'Height',
    weight: 'Weight',
    eggGroups: 'Egg group(s)',
    evolutionaryLine: 'Evolutionary line',
    baseStats: 'Base stats',
    baseStatsTotal: 'BST',
    evYields: 'EV Yields',
    flavourText: 'Pokédex entry',
    otherFormesTitle: 'Other forme(s)',
    cosmeticFormesTitle: 'Cosmetic Formes',
    otherFormesList: container.i18n.listAnd.format(pokeDetails.otherFormes ?? []),
    cosmeticFormesList: container.i18n.listAnd.format(pokeDetails.cosmeticFormes ?? []),
    levellingRate: 'Levelling rate',
    isEggObtainable: 'Egg can be obtained',
    minimumHatchingTime: 'Minimum hatching time',
    maximumHatchTime: 'Maximum hatching time'
  };

  return parsePokemon({ pokeDetails, abilities, baseStats, evYields, evoChain, embedTranslations, spriteToGet });
}

function isFavouredEntry(fuzzyMatch: Pokemon | FavouredEntry<PokemonEnum>): fuzzyMatch is FavouredEntry<PokemonEnum> {
  return (fuzzyMatch as FavouredEntry<PokemonEnum>).name !== undefined;
}

function parsePokemon({
  pokeDetails,
  abilities,
  baseStats,
  evYields,
  evoChain,
  embedTranslations,
  spriteToGet
}: PokemonToDisplayArgs): PaginatedMessage {
  const externalResources = 'External Resources';

  const externalResourceData = [
    isMissingno(pokeDetails)
      ? '[Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/MissingNo.)'
      : `[Bulbapedia](${parseBulbapediaURL(pokeDetails.bulbapediaPage)} )`,
    isMissingno(pokeDetails) ? '[Serebii](https://www.serebii.net/pokedex/000.shtml)' : `[Serebii](${pokeDetails.serebiiPage})`,
    isMissingno(pokeDetails) ? undefined : `[Smogon](${pokeDetails.smogonPage})`
  ]
    .filter(filterNullish)
    .join(' | ');

  const display = new PaginatedMessage({
    template: new MessageEmbed()
      .setColor(BrandingColors.Primary)
      .setAuthor({ name: `#${pokeDetails.num} - ${toTitleCase(pokeDetails.species)}`, iconURL: CdnUrls.Pokedex })
      .setThumbnail(pokeDetails[spriteToGet])
  })
    .setSelectMenuOptions((pageIndex) => ({ label: PageLabels[pageIndex - 1] }))
    .addPageEmbed((embed) => {
      embed
        .addField(embedTranslations.types, pokeDetails.types.join(', '), true)
        .addField(embedTranslations.abilities, container.i18n.listAnd.format(abilities), true)
        .addField(embedTranslations.genderRatio, parseGenderRatio(pokeDetails.gender), true)
        .addField(embedTranslations.evolutionaryLine, evoChain)
        .addField(embedTranslations.baseStats, `${baseStats.join(', ')} (*${embedTranslations.baseStatsTotal}*: **${pokeDetails.baseStatsTotal}**)`);

      if (!isCapPokemon(pokeDetails)) {
        embed.addField(externalResources, externalResourceData);
      }

      return embed;
    })
    .addPageEmbed((embed) => {
      embed
        .addField(embedTranslations.height, `${container.i18n.number.format(pokeDetails.height)}m`, true)
        .addField(embedTranslations.weight, `${container.i18n.number.format(pokeDetails.weight)}kg`, true);

      if (isRegularPokemon(pokeDetails)) {
        if (pokeDetails.levellingRate) {
          embed.addField(embedTranslations.levellingRate, pokeDetails.levellingRate, true);
        }
      }

      if (!isMissingno(pokeDetails)) {
        embed.addField(embedTranslations.eggGroups, pokeDetails.eggGroups?.join(', ') || '', true);
      }

      if (isRegularPokemon(pokeDetails)) {
        embed.addField(embedTranslations.isEggObtainable, pokeDetails.isEggObtainable ? 'Yes' : 'No', true);

        if (!isNullish(pokeDetails.minimumHatchTime) && !isNullish(pokeDetails.maximumHatchTime)) {
          embed
            .addField(embedTranslations.minimumHatchingTime, container.i18n.number.format(pokeDetails.minimumHatchTime), true)
            .addField(embedTranslations.maximumHatchTime, container.i18n.number.format(pokeDetails.maximumHatchTime), true);
        }

        embed.addField(externalResources, externalResourceData);
      }

      return embed;
    });

  if (!isMissingno(pokeDetails)) {
    display.addPageEmbed((embed) => {
      embed //
        .addField(embedTranslations.smogonTier, pokeDetails.smogonTier)
        .addField(embedTranslations.evYields, `${evYields.join(', ')}`);

      if (isRegularPokemon(pokeDetails)) {
        embed.addField(externalResources, externalResourceData);
      }

      return embed;
    });
  }

  if (!isCapPokemon(pokeDetails)) {
    if (pokeDetails.flavorTexts.length) {
      display.addPageEmbed((embed) => {
        for (const flavor of pokeDetails.flavorTexts) {
          embed.addField(embedTranslations.flavourText, `\`(${flavor.game})\` ${flavor.flavor}`);
        }

        return embed.addField(externalResources, externalResourceData);
      });
    }
  }

  if (!isMissingno(pokeDetails)) {
    // If there are any cosmetic formes or other formes then add a page for them
    // If the pokémon doesn't have the formes then the API will default them to `null`
    if (pokeDetails.cosmeticFormes || pokeDetails.otherFormes) {
      display.addPageEmbed((embed) => {
        // If the pokémon has other formes
        if (pokeDetails.otherFormes) {
          embed.addField(embedTranslations.otherFormesTitle, embedTranslations.otherFormesList);
        }

        // If the pokémon has cosmetic formes
        if (pokeDetails.cosmeticFormes) {
          embed.addField(embedTranslations.cosmeticFormesTitle, embedTranslations.cosmeticFormesList);
        }

        // Add the external resource field
        embed.addField(externalResources, externalResourceData);

        return embed;
      });
    }
  }

  return display;
}

/**
 * Constructs a link in the evolution chain
 * @param species Name of the pokemon that the evolution goes to
 * @param level Level the evolution happens
 * @param evoChain The current evolution chain
 * @param isEvo Whether this is an evolution or pre-evolution
 */
function constructEvoLink(species: Pokemon['species'], level: Pokemon['evolutionLevel'], evoChain: string, isEvo = true) {
  if (isEvo) {
    return `${evoChain} → \`${toTitleCase(species)}\` ${level ? `(${level})` : ''}`;
  }
  return `\`${toTitleCase(species)}\` ${level ? `(${level})` : ''} → ${evoChain}`;
}

/**
 * Parse the gender ratios to an embeddable format
 */
function parseGenderRatio(genderRatio: Gender) {
  if (genderRatio.male === '0%' && genderRatio.female === '0%') {
    return 'Genderless';
  }

  return `${genderRatio.male} ${Emojis.MaleSignEmoji} | ${genderRatio.female} ${Emojis.FemaleSignEmoji}`;
}

/**
 * Parses abilities to an embeddable format
 * @remark required to distinguish hidden abilities from regular abilities
 * @returns an array of abilities
 */
function getAbilities(abilitiesData: Abilities): string[] {
  const abilities: string[] = [];
  for (const [type, ability] of Object.entries(abilitiesData)) {
    if (!ability) continue;
    abilities.push(type === 'hidden' ? `*${ability}*` : ability);
  }

  return abilities;
}

/**
 * Parses base stats to an embeddable format
 * @returns an array of stats with their keys and values
 */
function getBaseStats(statsData: Stats): string[] {
  const baseStats: string[] = [];
  for (const [stat, value] of Object.entries(statsData)) {
    baseStats.push(`${StatsEnum[stat as keyof Omit<Stats, '__typename'>]}: **${value}**`);
  }

  return baseStats;
}

/**
 * Parses EV yields to an embeddable format
 * @returns an array of ev yields with their keys and values
 */
function getEvYields(evYieldsData: EvYields): string[] {
  const evYields: string[] = [];
  for (const [stat, value] of Object.entries(evYieldsData)) {
    evYields.push(`${StatsEnum[stat as keyof Omit<EvYields, '__typename'>]}: **${value}**`);
  }

  return evYields;
}

/**
 * Parses the evolution chain to an embeddable format
 * @returns The evolution chain for the Pokémon
 */
function getEvoChain(pokeDetails: Pokemon): string {
  // Set evochain if there are no evolutions
  let evoChain = `**${toTitleCase(pokeDetails.species)} ${pokeDetails.evolutionLevel ? `(${pokeDetails.evolutionLevel})` : ''}**` as string;
  if (!pokeDetails.evolutions?.length && !pokeDetails.preevolutions?.length) {
    evoChain += ' (No Evolutions)';
  }

  // Parse pre-evolutions and add to evochain
  if (pokeDetails.preevolutions?.length) {
    const { evolutionLevel } = pokeDetails.preevolutions[0];
    evoChain = constructEvoLink(pokeDetails.preevolutions[0].species, evolutionLevel, evoChain, false);

    // If the direct pre-evolution has another pre-evolution (charizard -> charmeleon -> charmander)
    if (pokeDetails.preevolutions[0].preevolutions?.length) {
      evoChain = constructEvoLink(pokeDetails.preevolutions[0].preevolutions[0].species, null, evoChain, false);
    }
  }

  // Parse evolution chain and add to evochain
  if (pokeDetails.evolutions?.length) {
    evoChain = constructEvoLink(pokeDetails.evolutions[0].species, pokeDetails.evolutions[0].evolutionLevel, evoChain);

    // In case there are multiple evolutionary paths
    const otherFormeEvos = pokeDetails.evolutions.slice(1);
    if (otherFormeEvos.length) {
      evoChain = `${evoChain}, ${otherFormeEvos.map((oevo) => `\`${oevo.species}\` (${oevo.evolutionLevel})`).join(', ')}`;
    }

    // If the direct evolution has another evolution (charmander -> charmeleon -> charizard)
    if (pokeDetails.evolutions[0].evolutions?.length) {
      evoChain = constructEvoLink(
        pokeDetails.evolutions[0].evolutions[0].species, //
        pokeDetails.evolutions[0].evolutions[0].evolutionLevel,
        evoChain
      );
    }
  }

  return evoChain;
}

function isCapPokemon(pokeDetails: Pokemon) {
  return pokeDetails.num < 0;
}

function isRegularPokemon(pokeDetails: Pokemon) {
  return pokeDetails.num > 0;
}

function isMissingno(pokeDetails: Pokemon) {
  return pokeDetails.num === 0;
}

export type PokemonSpriteTypes = keyof Pick<Pokemon, KeysContaining<Pokemon, 'sprite'>>;

export interface PokemonToDisplayArgs {
  abilities: string[];

  baseStats: string[];

  embedTranslations: PokedexEmbedTitles;

  evoChain: string;

  evYields: string[];

  pokeDetails: Pokemon;

  spriteToGet: PokemonSpriteTypes;
}

export interface PokedexEmbedTitles {
  abilities: string;

  baseStats: string;

  baseStatsTotal: string;

  cosmeticFormesList: string;

  cosmeticFormesTitle: string;

  eggGroups: string;

  evolutionaryLine: string;

  evYields: string;

  flavourText: string;

  genderRatio: string;

  height: string;

  isEggObtainable: string;

  levellingRate: string;

  maximumHatchTime: string;

  minimumHatchingTime: string;

  otherFormesList: string;

  otherFormesTitle: string;

  smogonTier: string;

  types: string;

  unknownSmogonTier: string;

  weight: string;
}
