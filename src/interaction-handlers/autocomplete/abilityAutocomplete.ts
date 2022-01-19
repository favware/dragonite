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
    if (interaction.commandName !== 'ability') return this.none();

    const focusedOption = interaction.options.getFocused(true);

    switch (focusedOption.name) {
      case 'ability': {
        const fuzzyAbilities = await this.container.gqlClient.fuzzilySearchAbilities(focusedOption.value as string);

        return this.some(fuzzyAbilities.map((fuzzyMatch) => ({ name: fuzzyMatch.name, value: fuzzyMatch.key })));
      }
      default:
        return this.none();
    }
  }
}
