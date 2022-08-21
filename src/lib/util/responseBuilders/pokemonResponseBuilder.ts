import { CdnUrls, Emojis } from '#utils/constants';
import type { FavouredEntry } from '#utils/favouredEntries';
import { parseBulbapediaURL, pokemonEnumToSpecies, resolveColour } from '#utils/functions/pokemonParsers';
import type { KeysContaining } from '#utils/utils';
import { bold, inlineCode, italic } from '@discordjs/builders';
import type { Abilities, EvYields, Gender, Pokemon, PokemonEnum, Stats } from '@favware/graphql-pokemon';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { container } from '@sapphire/framework';
import { filterNullish, isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import { ApplicationCommandOptionChoiceData, MessageEmbed, MessageSelectOptionData } from 'discord.js';

enum StatsEnum {
  hp = 'HP',
  attack = 'ATK',
  defense = 'DEF',
  specialattack = 'SPA',
  specialdefense = 'SPD',
  speed = 'SPE'
}

const PageLabels = ['General', 'Growth Information', 'Competitive Battling Information', 'PokéDex Entries', 'Forme information'];

export function fuzzyPokemonToSelectOption<L extends 'name' | 'label'>(
  fuzzyMatch: Pokemon | FavouredEntry<PokemonEnum>,
  labelLikeKey: L
): L extends 'name' ? ApplicationCommandOptionChoiceData : MessageSelectOptionData {
  const label = isFavouredEntry(fuzzyMatch) ? fuzzyMatch.name : pokemonEnumToSpecies(fuzzyMatch.key);

  // @ts-expect-error TS is not able to infer that `labelLikeKey` is 'name' | 'label'
  return { [labelLikeKey]: label, value: fuzzyMatch.key };
}

export function pokemonResponseBuilder(pokeDetails: Omit<Pokemon, '__typename'>, spriteToGet: PokemonSpriteTypes) {
  const abilities = getAbilities(pokeDetails.abilities);
  const baseStats = getBaseStats(pokeDetails.baseStats);
  const evYields = getEvYields(pokeDetails.evYields);
  const evoChain = getEvoChain(pokeDetails);

  return parsePokemon({ pokeDetails, abilities, baseStats, evYields, evoChain, spriteToGet });
}

function isFavouredEntry(fuzzyMatch: Pokemon | FavouredEntry<PokemonEnum>): fuzzyMatch is FavouredEntry<PokemonEnum> {
  return (fuzzyMatch as FavouredEntry<PokemonEnum>).name !== undefined;
}

function parsePokemon({ pokeDetails, abilities, baseStats, evYields, evoChain, spriteToGet }: PokemonToDisplayArgs): PaginatedMessage {
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
      .setColor(resolveColour(pokeDetails.color))
      .setAuthor({ name: `#${pokeDetails.num} - ${pokemonEnumToSpecies(pokeDetails.key)}`, iconURL: CdnUrls.Pokedex })
      .setThumbnail(pokeDetails[spriteToGet])
  })
    .setSelectMenuOptions((pageIndex) => ({ label: PageLabels[pageIndex - 1] }))
    .addPageEmbed((embed) => {
      embed.addFields(
        {
          name: 'Type(s)',
          value: pokeDetails.types.map((type) => type.name).join(', '),
          inline: true
        },
        {
          name: 'Abilities',
          value: container.i18n.listAnd.format(abilities),
          inline: true
        },
        {
          name: 'Gender Ratio',
          value: parseGenderRatio(pokeDetails.gender),
          inline: true
        },
        {
          name: 'Evolutionary line',
          value: evoChain
        },
        {
          name: 'Base Stats',
          value: `${baseStats.join(', ')} (${italic('BST')}: ${bold(pokeDetails.baseStatsTotal.toString())})`
        }
      );

      if (!isCapPokemon(pokeDetails)) {
        embed.addFields({ name: externalResources, value: externalResourceData });
      }

      return embed;
    })
    .addPageEmbed((embed) => {
      embed.addFields(
        {
          name: 'Height',
          value: `${container.i18n.number.format(pokeDetails.height)}m`,
          inline: true
        },
        {
          name: 'Weight',
          value: `${container.i18n.number.format(pokeDetails.weight)}kg`,
          inline: true
        }
      );

      if (isRegularPokemon(pokeDetails)) {
        if (pokeDetails.levellingRate) {
          embed.addFields({
            name: 'Levelling rate',
            value: pokeDetails.levellingRate,
            inline: true
          });
        }
      }

      if (!isMissingno(pokeDetails)) {
        embed.addFields({
          name: 'Egg group(s)',
          value: pokeDetails.eggGroups?.join(', ') || '',
          inline: true
        });
      }

      if (isRegularPokemon(pokeDetails)) {
        embed.addFields({
          name: 'Egg can be obtained',
          value: pokeDetails.isEggObtainable ? 'Yes' : 'No',
          inline: true
        });

        if (!isNullish(pokeDetails.minimumHatchTime) && !isNullish(pokeDetails.maximumHatchTime)) {
          embed.addFields(
            {
              name: 'Minimum hatching time',
              value: container.i18n.number.format(pokeDetails.minimumHatchTime),
              inline: true
            },
            {
              name: 'Maximum hatching time',
              value: container.i18n.number.format(pokeDetails.maximumHatchTime),
              inline: true
            }
          );
        }

        embed.addFields({ name: externalResources, value: externalResourceData });
      }

      return embed;
    });

  if (!isMissingno(pokeDetails)) {
    display.addPageEmbed((embed) => {
      embed //
        .addFields(
          {
            name: 'Smogon Tier',
            value: pokeDetails.smogonTier === 'Undiscovered' ? 'Unknown / Alt form' : pokeDetails.smogonTier
          },
          {
            name: 'EV Yields',
            value: `${evYields.join(', ')}`
          }
        );

      if (isRegularPokemon(pokeDetails)) {
        embed.addFields({ name: externalResources, value: externalResourceData });
      }

      return embed;
    });
  }

  if (!isCapPokemon(pokeDetails)) {
    if (pokeDetails.flavorTexts.length) {
      display.addPageEmbed((embed) => {
        for (const flavor of pokeDetails.flavorTexts) {
          embed.addFields({ name: 'Pokédex entry', value: `(${inlineCode(flavor.game)}) ${flavor.flavor}` });
        }

        return embed.addFields({ name: externalResources, value: externalResourceData });
      });
    }
  }

  if (!isMissingno(pokeDetails)) {
    // If there are any cosmetic formes or other formes then add a page for them
    // If the pokémon doesn't have the formes then the API will default them to `null`
    if (!isNullishOrEmpty(pokeDetails.otherFormes) || !isNullishOrEmpty(pokeDetails.cosmeticFormes)) {
      display.addPageEmbed((embed) => {
        // If the pokémon has other formes
        if (!isNullishOrEmpty(pokeDetails.otherFormes)) {
          const formes = pokeDetails.otherFormes.map((forme) => inlineCode(pokemonEnumToSpecies(forme as PokemonEnum)));
          embed.addFields({ name: 'Other forme(s)', value: container.i18n.listAnd.format(formes) });
        }

        // If the pokémon has cosmetic formes
        if (!isNullishOrEmpty(pokeDetails.cosmeticFormes)) {
          const formes = pokeDetails.cosmeticFormes.map((forme) => inlineCode(pokemonEnumToSpecies(forme as PokemonEnum)));
          embed.addFields({ name: 'Cosmetic Formes', value: container.i18n.listAnd.format(formes) });
        }

        // Add the external resource field
        embed.addFields({ name: externalResources, value: externalResourceData });

        return embed;
      });
    }
  }

  return display;
}

/**
 * Constructs a link in the evolution chain
 * @param key Enum key of the pokemon that the evolution goes to
 * @param level Level the evolution happens
 * @param evoChain The current evolution chain
 * @param isEvo Whether this is an evolution or pre-evolution
 */
function constructEvoLink(key: Pokemon['key'], level: Pokemon['evolutionLevel'], evoChain: string, isEvo = true) {
  if (isEvo) {
    return `${evoChain} → ${inlineCode(pokemonEnumToSpecies(key))} ${level ? `(${level})` : ''}`;
  }
  return `${inlineCode(pokemonEnumToSpecies(key))} ${level ? `(${level})` : ''} → ${evoChain}`;
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
    abilities.push(type === 'hidden' ? `${italic(ability.name)}` : ability.name);
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
    baseStats.push(`${StatsEnum[stat as keyof Omit<Stats, '__typename'>]}: ${bold(value.toString())}`);
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
    evYields.push(`${StatsEnum[stat as keyof Omit<EvYields, '__typename'>]}: ${bold(value.toString())}`);
  }

  return evYields;
}

/**
 * Parses the evolution chain to an embeddable format
 * @returns The evolution chain for the Pokémon
 */
function getEvoChain(pokeDetails: Pokemon): string {
  // Set evochain if there are no evolutions
  let evoChain = bold(`${pokemonEnumToSpecies(pokeDetails.key)} ${pokeDetails.evolutionLevel ? `(${pokeDetails.evolutionLevel})` : ''}`) as string;
  if (!pokeDetails.evolutions?.length && !pokeDetails.preevolutions?.length) {
    evoChain += ' (No Evolutions)';
  }

  // Parse pre-evolutions and add to evochain
  if (pokeDetails.preevolutions?.length) {
    const { evolutionLevel } = pokeDetails.preevolutions[0];
    evoChain = constructEvoLink(pokeDetails.preevolutions[0].key, evolutionLevel, evoChain, false);

    // If the direct pre-evolution has another pre-evolution (charizard -> charmeleon -> charmander)
    if (pokeDetails.preevolutions[0].preevolutions?.length) {
      evoChain = constructEvoLink(pokeDetails.preevolutions[0].preevolutions[0].key, null, evoChain, false);
    }
  }

  // Parse evolution chain and add to evochain
  if (pokeDetails.evolutions?.length) {
    evoChain = constructEvoLink(pokeDetails.evolutions[0].key, pokeDetails.evolutions[0].evolutionLevel, evoChain);

    // In case there are multiple evolutionary paths
    const otherFormeEvos = pokeDetails.evolutions.slice(1);
    if (otherFormeEvos.length) {
      evoChain = `${evoChain}, ${otherFormeEvos.map((oevo) => `${inlineCode(oevo.species)} (${oevo.evolutionLevel})`).join(', ')}`;
    }

    // If the direct evolution has another evolution (charmander -> charmeleon -> charizard)
    if (pokeDetails.evolutions[0].evolutions?.length) {
      evoChain = constructEvoLink(
        pokeDetails.evolutions[0].evolutions[0].key, //
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

  evoChain: string;

  evYields: string[];

  pokeDetails: Pokemon;

  spriteToGet: PokemonSpriteTypes;
}
