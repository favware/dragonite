import type { EnGbHandler } from '#utils/Intl/EnGbHandler';
import type { GuildCommandInteraction, GuildContextMenuInteraction } from './Discord';

declare module '@sapphire/pieces' {
  interface Container {
    i18n: EnGbHandler;
  }
}

declare module '@sapphire/framework' {
  interface ChatInputCommandSuccessPayload {
    readonly interaction: GuildCommandInteraction;
  }

  interface ChatInputCommandDeniedPayload {
    readonly interaction: GuildCommandInteraction;
  }

  interface ContextMenuCommandSuccessPayload {
    readonly interaction: GuildContextMenuInteraction;
  }

  interface ContextMenuCommandDeniedPayload {
    readonly interaction: GuildContextMenuInteraction;
  }
}
