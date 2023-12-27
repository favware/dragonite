import { DragoniteCommand } from '#lib/extensions/DragoniteCommand';
import { SelectMenuCustomIds } from '#utils/constants';
import { abilityResponseBuilder } from '#utils/responseBuilders/abilityResponseBuilder';
import type { AbilitiesEnum } from '@favware/graphql-pokemon';
import { ApplyOptions } from '@sapphire/decorators';
import type { ChatInputCommand } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { ActionRowBuilder, StringSelectMenuBuilder, type APISelectMenuOption } from 'discord.js';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Gets data for the chosen Pokémon ability.'
})
export class SlashCommand extends DragoniteCommand {
  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder //
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option //
            .setName('ability')
            .setDescription('The name of the ability about which you want to get information.')
            .setRequired(true)
            .setAutocomplete(true)
        )
    );
  }

  public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
    await interaction.deferReply();

    const ability = interaction.options.getString('ability', true);

    const abilityDetails = await this.container.gqlClient.getAbility(ability as AbilitiesEnum);

    if (isNullish(abilityDetails)) {
      const fuzzyAbilities = await this.container.gqlClient.fuzzilySearchAbilities(ability, 25);
      const options = fuzzyAbilities.map<APISelectMenuOption>((fuzzyMatch) => ({ label: fuzzyMatch.name, value: fuzzyMatch.key }));

      const messageActionRow = new ActionRowBuilder<StringSelectMenuBuilder>() //
        .setComponents(
          new StringSelectMenuBuilder() //
            .setCustomId(SelectMenuCustomIds.Ability)
            .setPlaceholder('Choose the ability you want to get information about.')
            .setOptions(options)
        );

      await interaction.deleteReply();
      return interaction.followUp({
        content: 'I am sorry, but that query failed. Maybe you meant one of these?',
        components: [messageActionRow],
        ephemeral: true
      });
    }

    return interaction.editReply(abilityResponseBuilder(abilityDetails));
  }
}
