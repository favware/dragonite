import { CdnUrls } from '#utils/constants';
import type { PokemonSpriteTypes } from '#utils/responseBuilders/pokemonResponseBuilder';
import type { Pokemon } from '@favware/graphql-pokemon';
import { pokemonEnumToSpecies, resolveColor } from '@favware/graphql-pokemon/utilities';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { EmbedBuilder } from 'discord.js';

export function flavorResponseBuilder(pokemonData: Omit<Pokemon, '__typename'>, spriteToGet: PokemonSpriteTypes) {
  const display = new PaginatedMessage({
    template: new EmbedBuilder()
      .setColor(resolveColor(pokemonData.color))
      .setAuthor({ name: `#${pokemonData.num} - ${pokemonEnumToSpecies(pokemonData.key)}`, iconURL: CdnUrls.Pokedex })
      .setThumbnail(pokemonData[spriteToGet])
  }) //
    .setSelectMenuOptions((pageIndex) => ({ label: pokemonData.flavorTexts[pageIndex - 1].game }));

  for (const { game, flavor } of pokemonData.flavorTexts) {
    display.addPageEmbed((embed) => embed.setDescription([`**${game}**`, flavor].join('\n')));
  }

  return display;
}
