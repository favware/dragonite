import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { AutocompleteInteraction } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
  interactionHandlerType: InteractionHandlerTypes.Autocomplete
})
export class ItemAutocomplete extends InteractionHandler {
  public override async run(interaction: AutocompleteInteraction, result: InteractionHandler.ParseResult<this>) {
    return interaction.respond(result);
  }

  public override async parse(interaction: AutocompleteInteraction) {
    if (interaction.commandName !== 'item') return this.none();

    const item = interaction.options.getString('item', true);

    const fuzzyItems = await this.container.gqlClient.fuzzilySearchItems(item);

    return this.some(fuzzyItems.map((fuzzyMatch) => ({ name: fuzzyMatch.name, value: fuzzyMatch.key })));
  }
}
