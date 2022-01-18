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
    if (interaction.commandName !== 'move') return this.none();

    const move = interaction.options.getString('move', true);

    const fuzzyMoves = await this.container.gqlClient.fuzzilySearchMoves(move);

    return this.some(fuzzyMoves.map((fuzzyMatch) => ({ name: fuzzyMatch.name, value: fuzzyMatch.key })));
  }
}
