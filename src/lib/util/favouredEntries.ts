import { AbilitiesEnum, ItemsEnum, MovesEnum, PokemonEnum } from '@favware/graphql-pokemon';

export const FavouredAbilities: FavouredEntry<AbilitiesEnum>[] = [
  {
    key: AbilitiesEnum.Multiscale,
    name: '⭐ Multiscale'
  },
  {
    key: AbilitiesEnum.Battlebond,
    name: '⭐ Battle Bond'
  },
  {
    key: AbilitiesEnum.Victorystar,
    name: '⭐ Victory Star'
  },
  {
    key: AbilitiesEnum.Primordialsea,
    name: '⭐ Primordial Sea'
  },
  {
    key: AbilitiesEnum.Powerconstruct,
    name: '⭐ Power Construct'
  },
  {
    key: AbilitiesEnum.Pixilate,
    name: '⭐ Pixilate'
  }
];

export const FavouredItems: FavouredEntry<ItemsEnum>[] = [
  {
    key: ItemsEnum.Lifeorb,
    name: '⭐ Life Orb'
  },
  {
    key: ItemsEnum.Choiceband,
    name: '⭐ Choice Band'
  },
  {
    key: ItemsEnum.Leftovers,
    name: '⭐ Leftovers'
  },
  {
    key: ItemsEnum.Ejectbutton,
    name: '⭐ Eject Button'
  },
  {
    key: ItemsEnum.Nevermeltice,
    name: '⭐ Never-Melt Ice'
  }
];

export const FavouredMoves: FavouredEntry<MovesEnum>[] = [
  {
    key: MovesEnum.Earthquake,
    name: '⭐ Earthquake'
  },
  {
    key: MovesEnum.Coreenforcer,
    name: '⭐ Core Enforcer'
  },
  {
    key: MovesEnum.Vcreate,
    name: '⭐ V-create'
  },
  {
    key: MovesEnum.Dragonascent,
    name: '⭐ Dragon Ascent'
  },
  {
    key: MovesEnum.Sparklingaria,
    name: '⭐ Sparkling Aria'
  },
  {
    key: MovesEnum.Pulverizingpancake,
    name: '⭐ Pulverizing Pancake (🥞)'
  }
];

export const FavouredPokemon: FavouredEntry<PokemonEnum>[] = [
  {
    key: PokemonEnum.Dragonite,
    name: '⭐ Dragonite'
  },
  {
    key: PokemonEnum.Victini,
    name: '⭐ Victini'
  },
  {
    key: PokemonEnum.Greninjaash,
    name: '⭐ Ash Greninja'
  },
  {
    key: PokemonEnum.Mewtwo,
    name: '⭐ Mewtwo'
  },
  {
    key: PokemonEnum.Rayquaza,
    name: '⭐ Rayquaza'
  },
  {
    key: PokemonEnum.Arceus,
    name: '⭐ Arceus'
  },
  {
    key: PokemonEnum.Bidoof,
    name: '⭐ Bidoof (Peanut Butter)'
  }
];

export interface FavouredEntry<T> {
  key: T;
  name: `⭐ ${string}`;
}
