import { gql } from '#lib/gql/utils';

export const getPokemon = gql`
  fragment flavors on Flavor {
    game
    flavor
  }

  fragment ability on Ability {
    name
  }

  fragment abilities on Abilities {
    first {
      ...ability
    }
    second {
      ...ability
    }
    hidden {
      ...ability
    }
    special {
      ...ability
    }
  }

  fragment stats on Stats {
    hp
    attack
    defense
    specialattack
    specialdefense
    speed
  }

  fragment evYields on EvYields {
    hp
    attack
    defense
    specialattack
    specialdefense
    speed
  }

  fragment genders on Gender {
    male
    female
  }

  fragment pokemon on Pokemon {
    key
    num
    species
    types {
      name
    }
    evYields {
      ...evYields
    }
    abilities {
      ...abilities
    }
    baseStats {
      ...stats
    }
    gender {
      ...genders
    }
    baseStatsTotal
    color
    eggGroups
    evolutionLevel
    height
    weight
    otherFormes
    cosmeticFormes
    sprite
    shinySprite
    backSprite
    shinyBackSprite
    smogonTier
    bulbapediaPage
    serebiiPage
    smogonPage
    isEggObtainable
    minimumHatchTime
    maximumHatchTime
    levellingRate
    catchRate {
      base
      percentageWithOrdinaryPokeballAtFullHealth
    }
    flavorTexts {
      ...flavors
    }
  }

  fragment evolutionsData on Pokemon {
    key
    species
    evolutionLevel
  }

  fragment evolutions on Pokemon {
    evolutions {
      ...evolutionsData
      evolutions {
        ...evolutionsData
      }
    }
    preevolutions {
      ...evolutionsData
      preevolutions {
        ...evolutionsData
      }
    }
  }

  query GetPokemon($pokemon: PokemonEnum!) {
    getPokemon(pokemon: $pokemon, takeFlavorTexts: 2) {
      ...pokemon
      ...evolutions
    }
  }
`;

export const getFlavorTexts = gql`
  query getFlavorTexts($pokemon: PokemonEnum!) {
    getPokemon(pokemon: $pokemon, takeFlavorTexts: 25) {
      key
      sprite
      shinySprite
      backSprite
      shinyBackSprite
      num
      species
      color
      flavorTexts {
        game
        flavor
      }
    }
  }
`;

export const getAbility = gql`
  query getAbility($ability: AbilitiesEnum!) {
    getAbility(ability: $ability) {
      key
      desc
      shortDesc
      name
      isFieldAbility
      bulbapediaPage
      serebiiPage
      smogonPage
    }
  }
`;

export const getItem = gql`
  query getItem($item: ItemsEnum!) {
    getItem(item: $item) {
      key
      desc
      name
      bulbapediaPage
      serebiiPage
      smogonPage
      sprite
      isNonstandard
      generationIntroduced
    }
  }
`;

export const getNature = gql`
  query getNature($nature: NaturesEnum!) {
    getNature(nature: $nature) {
      key
      name
      increasedStat
      decreasedStat
      preferredFlavor
      dislikedFlavor
    }
  }
`;

export const getLearnset = gql`
  fragment learnsetLevelupMove on LearnsetLevelUpMove {
    move {
      name
    }
    generation
    level
  }

  fragment learnsetMove on LearnsetMove {
    move {
      name
    }
    generation
  }

  fragment learnset on Learnset {
    num
    species
    pokemonKey
    sprite
    shinySprite
    backSprite
    shinyBackSprite
    color
    levelUpMoves {
      ...learnsetLevelupMove
    }
    virtualTransferMoves {
      ...learnsetMove
    }
    tutorMoves {
      ...learnsetMove
    }
    tmMoves {
      ...learnsetMove
    }
    eggMoves {
      ...learnsetMove
    }
    eventMoves {
      ...learnsetMove
    }
    dreamworldMoves {
      ...learnsetMove
    }
  }

  query getLearnset($pokemon: PokemonEnum!, $moves: [MovesEnum!]!, $generation: Int) {
    getLearnset(pokemon: $pokemon, moves: $moves, generation: $generation) {
      ...learnset
    }
  }
`;

export const getMove = gql`
  query getMove($move: MovesEnum!) {
    getMove(move: $move) {
      key
      name
      shortDesc
      type
      basePower
      pp
      category
      accuracy
      priority
      target
      contestType
      bulbapediaPage
      serebiiPage
      smogonPage
      isNonstandard
      isZ
      isGMax
      desc
      maxMovePower
      zMovePower
      isFieldMove
    }
  }
`;

export const getTypeMatchup = gql`
  fragment type on TypeEffectiveness {
    doubleEffectiveTypes
    effectiveTypes
    normalTypes
    resistedTypes
    doubleResistedTypes
    effectlessTypes
  }

  query GetTypeMatchup($primaryType: TypesEnum!, $secondaryType: TypesEnum) {
    getTypeMatchup(primaryType: $primaryType, secondaryType: $secondaryType) {
      attacking {
        ...type
      }
      defending {
        ...type
      }
    }
  }
`;

export const getPokemonSprites = gql`
  query getPokemonSprite($pokemon: PokemonEnum!) {
    getPokemon(pokemon: $pokemon) {
      key
      sprite
      shinySprite
      backSprite
      shinyBackSprite
    }
  }
`;

export const getAllPokemonSpecies = gql`
  query GetAllPokemon($offset: Int) {
    getAllPokemon(offset: $offset) {
      species
    }
  }
`;
