import { fuzzyPokemonToSelectOption } from '#utils/responseBuilders/pokemonResponseBuilder';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { AutocompleteInteraction } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
  interactionHandlerType: InteractionHandlerTypes.Autocomplete
})
export class AutocompleteHandler extends InteractionHandler {
  public override async run(interaction: AutocompleteInteraction, result: InteractionHandler.ParseResult<this>) {
    return interaction.respond(result);
  }

  public override async parse(interaction: AutocompleteInteraction) {
    if (
      interaction.commandName !== 'pokemon' &&
      interaction.commandName !== 'flavor' &&
      interaction.commandName !== 'sprite' &&
      interaction.commandName !== 'learn'
    ) {
      return this.none();
    }

    if (interaction.commandName === 'learn') {
      const focusedOption = interaction.options.getFocused(true);
      if (focusedOption.name !== 'pokemon') return this.none();
    }

    const pokemon = interaction.options.getString('pokemon', true);

    const fuzzyPokemon = await this.container.gqlClient.fuzzilySearchPokemon(pokemon);

    return this.some(fuzzyPokemon.map((fuzzyEntry) => fuzzyPokemonToSelectOption(fuzzyEntry, 'name')));
  }
}
