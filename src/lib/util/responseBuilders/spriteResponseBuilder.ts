import { PaginatedMessage } from '#lib/PaginatedMessages/PaginatedMessage';
import type { Pokemon } from '@favware/graphql-pokemon';

const PageLabels = ['Regular Sprite', 'Regular Back Sprite', 'Shiny Sprite', 'Shiny Back Sprite'];

export function spriteResponseBuilder(pokemonData: Omit<Pokemon, '__typename'>) {
  return new PaginatedMessage() //
    .setSelectMenuOptions((pageIndex) => ({ label: PageLabels[pageIndex - 1] }))
    .addPageContent(pokemonData.sprite)
    .addPageContent(pokemonData.backSprite)
    .addPageContent(pokemonData.shinySprite)
    .addPageContent(pokemonData.shinyBackSprite);
}
