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
    if (interaction.commandName !== 'move' && interaction.commandName !== 'learn') return this.none();

    const focusedOption = interaction.options.getFocused(true);

    switch (focusedOption.name) {
      case 'move':
      case 'move-1':
      case 'move-2':
      case 'move-3': {
        const fuzzyMoves = await this.container.gqlClient.fuzzilySearchMoves(focusedOption.value as string);

        return this.some(fuzzyMoves.map((fuzzyMatch) => ({ name: fuzzyMatch.name, value: fuzzyMatch.key })));
      }
      default:
        return this.none();
    }
  }
}
