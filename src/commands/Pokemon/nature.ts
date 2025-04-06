import { DragoniteCommand } from '#lib/extensions/DragoniteCommand';
import { natureResponseBuilder } from '#lib/util/responseBuilders/natureResponseBuilder';
import type { NaturesEnum } from '@favware/graphql-pokemon';
import { ApplyOptions } from '@sapphire/decorators';
import type { ChatInputCommand } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { ApplicationIntegrationType, InteractionContextType } from 'discord.js';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Gets data for the chosen Pokémon nature.'
})
export class SlashCommand extends DragoniteCommand {
  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder //
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option //
            .setName('nature')
            .setDescription('The name of the nature about which you want to get information.')
            .setRequired(true)
            .setChoices(
              { name: 'Adamant', value: 'adamant' },
              { name: 'Bashful', value: 'bashful' },
              { name: 'Bold', value: 'bold' },
              { name: 'Brave', value: 'brave' },
              { name: 'Calm', value: 'calm' },
              { name: 'Careful', value: 'careful' },
              { name: 'Docile', value: 'docile' },
              { name: 'Gentle', value: 'gentle' },
              { name: 'Hardy', value: 'hardy' },
              { name: 'Hasty', value: 'hasty' },
              { name: 'Impish', value: 'impish' },
              { name: 'Jolly', value: 'jolly' },
              { name: 'Lax', value: 'lax' },
              { name: 'Lonely', value: 'lonely' },
              { name: 'Mild', value: 'mild' },
              { name: 'Modest', value: 'modest' },
              { name: 'Naive', value: 'naive' },
              { name: 'Naughty', value: 'naughty' },
              { name: 'Quiet', value: 'quiet' },
              { name: 'Quirky', value: 'quirky' },
              { name: 'Rash', value: 'rash' },
              { name: 'Relaxed', value: 'relaxed' },
              { name: 'Sassy', value: 'sassy' },
              { name: 'Serious', value: 'serious' },
              { name: 'Timid', value: 'timid' }
            )
        )
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall)
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
    );
  }

  public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
    await interaction.deferReply();

    const nature = interaction.options.getString('nature', true);

    const natureDetails = await this.container.gqlClient.getNature(nature as NaturesEnum);

    if (isNullish(natureDetails)) {
      await interaction.deleteReply();
      return interaction.followUp({
        content: 'I am sorry, but that query failed. Are you sure you selected a nature?',
        ephemeral: true
      });
    }

    return interaction.editReply(natureResponseBuilder(natureDetails));
  }
}
