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

    const focusedOption = interaction.options.getFocused(true);

    switch (focusedOption.name) {
      case 'pokemon': {
        const fuzzyPokemon = await this.container.gqlClient.fuzzilySearchPokemon(
          focusedOption.value as string,
          20,
          interaction.commandName !== 'learn'
        );

        return this.some(fuzzyPokemon.map((fuzzyEntry) => fuzzyPokemonToSelectOption(fuzzyEntry, 'name')));
      }
      default:
        return this.none();
    }
  }
}
