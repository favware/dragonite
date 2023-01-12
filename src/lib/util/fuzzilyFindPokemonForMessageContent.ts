import { container } from '@sapphire/framework';
import { isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import { jaroWinkler } from '@skyra/jaro-winkler';

export async function fuzzilyFindPokemonForMessageContent(messageContent: string): Promise<string | null> {
  const allPokemon = await container.gqlClient.getAllSpecies();

  if (isNullish(allPokemon)) {
    return null;
  }

  const threshold = 0.9 as const;
  const almostExactsThreshold = 0.95 as const;

  let current: string;
  let lowerCaseWord: string;
  let similarity: number;
  let almostExacts = 0;

  const messageContentSplitBySpaces = messageContent.split(' ');

  const possibles: PokemonSimilarityEntry[] = [];

  // Loop over all the Pokémon
  for (const pokemon of allPokemon) {
    // Store the current species in lower case form
    current = pokemon.species.toLowerCase();

    // Loop over all words in the message
    for (const word of messageContentSplitBySpaces) {
      // Store the current word in lower case form
      lowerCaseWord = word.toLowerCase();

      // Check if there is an exact match, if so set similarity to 1
      if (current === lowerCaseWord) {
        similarity = 1;
      } else {
        // Otherwise calculate the similarity
        similarity = jaroWinkler(current, lowerCaseWord);
      }

      // If the similarity is bigger than the threshold, skip
      if (similarity < threshold) continue;

      // Push the results
      possibles.push({ species: pokemon.species, similarity });

      // If the similarity is bigger than the almost exact threshold, increment the almost exact counter
      if (similarity >= almostExactsThreshold) {
        almostExacts++;
      }

      // If we have reached an almost exact threshold of 10, break the loop, we have plenty of matches
      if (almostExacts === 10) break;
    }
  }

  if (isNullishOrEmpty(possibles)) {
    return null;
  }

  // Sort all possible matches by their similarity score and get the top result
  const sortedBestMatchedEntry = possibles.sort((a, b) => b.similarity - a.similarity).at(0);

  if (isNullish(sortedBestMatchedEntry)) {
    return null;
  }

  // Return the species of the best match
  return sortedBestMatchedEntry.species;
}

interface PokemonSimilarityEntry {
  species: string;
  similarity: number;
}
