import { gql } from '#lib/gql/utils';

export const getFuzzyAbility = gql`
  query getFuzzyAbility($ability: String!, $take: Int!) {
    getFuzzyAbility(ability: $ability, take: $take) {
      key
      name
    }
  }
`;

export const getFuzzyItem = gql`
  query getFuzzyItem($item: String!, $take: Int!) {
    getFuzzyItem(item: $item, take: $take) {
      key
      name
    }
  }
`;

export const getFuzzyMove = gql`
  query getFuzzyMove($move: String!, $take: Int!) {
    getFuzzyMove(move: $move, take: $take) {
      key
      name
    }
  }
`;

export const getFuzzyPokemon = gql`
  query getFuzzyPokemon($pokemon: String!, $take: Int!) {
    getFuzzyPokemon(pokemon: $pokemon, take: $take) {
      key
      species
      num
      forme
      formeLetter
    }
  }
`;
