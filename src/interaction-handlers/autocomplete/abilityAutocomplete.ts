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

    const ability = interaction.options.getString('ability', true);

    const fuzzyAbilities = await this.container.gqlClient.fuzzilySearchAbilities(ability);

    return this.some(fuzzyAbilities.map((fuzzyMatch) => ({ name: fuzzyMatch.name, value: fuzzyMatch.key })));
  }
}
