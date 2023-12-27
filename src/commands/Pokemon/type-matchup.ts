import { DragoniteCommand } from '#lib/extensions/DragoniteCommand';
import { typeMatchupResponseBuilder } from '#utils/responseBuilders/typeMatchupResponseBuilder';
import { TypesEnum } from '@favware/graphql-pokemon';
import { ApplyOptions } from '@sapphire/decorators';
import { UserError, type ChatInputCommand } from '@sapphire/framework';
import { filterNullish, isNullish, objectEntries } from '@sapphire/utilities';
import type { APIApplicationCommandOptionChoice } from 'discord.js';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Gets data for the chosen type matchup.'
})
export class SlashCommand extends DragoniteCommand {
  private readonly choices = objectEntries(TypesEnum).map<APIApplicationCommandOptionChoice<string>>(([key, type]) => ({
    name: key,
    value: type
  }));

  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder //
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option //
            .setName('first-type')
            .setDescription('The first type to include in the type matchup.')
            .setRequired(true)
            .setChoices(...this.choices)
        )
        .addStringOption((option) =>
          option //
            .setName('second-type')
            .setDescription('The second type to include in the type matchup.')
            .setChoices(...this.choices)
        )
    );
  }

  public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
    await interaction.deferReply();

    const firstType = interaction.options.getString('first-type', true) as TypesEnum;
    const secondtype = interaction.options.getString('second-type', false) as TypesEnum | null;
    const types = [firstType, secondtype].filter(filterNullish);

    const typeMatchup = await this.container.gqlClient.getTypeMatchup(firstType, secondtype ?? undefined);

    if (isNullish(typeMatchup)) {
      throw new UserError({
        identifier: 'TypeMatchupQueryFail',
        message: `I am sorry, but that query failed. Are you sure ${this.container.i18n.listAnd.format(types)} are actually types in Pokémon?`
      });
    }

    return interaction.editReply(typeMatchupResponseBuilder(types, typeMatchup));
  }
}
