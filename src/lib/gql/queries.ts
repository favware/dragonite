import { gql } from './utils';

export const getPokemon = gql`
  fragment flavors on Flavor {
    game
    flavor
  }

  fragment abilities on Abilities {
    first
    second
    hidden
    special
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
    num
    species
    types
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

  query getPokemon($pokemon: PokemonEnum!) {
    getPokemon(pokemon: $pokemon, takeFlavorTexts: 2) {
      ...pokemon
      ...evolutions
    }
  }
`;

export const getFlavorTexts = gql`
  query getFlavorTexts($pokemon: PokemonEnum!) {
    getPokemon(pokemon: $pokemon, takeFlavorTexts: 25) {
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

export const getLearnset = gql`
  fragment learnsetLevelupMove on LearnsetLevelUpMove {
    name
    generation
    level
  }

  fragment learnsetMove on LearnsetMove {
    name
    generation
  }

  fragment learnset on Learnset {
    num
    species
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
  fragment type on Type {
    doubleEffectiveTypes
    effectiveTypes
    normalTypes
    resistedTypes
    doubleResistedTypes
    effectlessTypes
  }

  query getTypeMatchups($types: [TypesEnum!]!) {
    getTypeMatchup(types: $types) {
      attacking {
        ...type
      }
      defending {
        ...type
      }
    }
  }
`;

export const getPokemonSprite = gql`
  query getPokemonSprite($pokemon: PokemonEnum!) {
    getPokemon(pokemon: $pokemon) {
      sprite
      shinySprite
      backSprite
      shinyBackSprite
    }
  }
`;
