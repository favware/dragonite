import type { Pokemon } from '@favware/graphql-pokemon';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';

const PageLabels = ['Regular Sprite', 'Regular Back Sprite', 'Shiny Sprite', 'Shiny Back Sprite'];

export function spriteResponseBuilder(pokemonData: Omit<Pokemon, '__typename'>) {
  return new PaginatedMessage() //
    .setSelectMenuOptions((pageIndex) => ({ label: PageLabels[pageIndex - 1] }))
    .addPageContent(pokemonData.sprite)
    .addPageContent(pokemonData.backSprite)
    .addPageContent(pokemonData.shinySprite)
    .addPageContent(pokemonData.shinyBackSprite);
}
