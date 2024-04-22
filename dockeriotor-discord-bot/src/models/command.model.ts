import {
  ButtonBuilder,
  CacheType,
  CommandInteraction,
  Interaction,
  ModalBuilder,
  ModalSubmitInteraction,
  SlashCommandBuilder,
} from "discord.js";

export abstract class Command<T = any> {
  command: SlashCommandBuilder;
  modals?: ModalBuilder[] = [];
  buttons?: ButtonBuilder[] = [];
  authRequired: boolean = true;

  constructor() {
    this.authRequired = true;
    this.command = new SlashCommandBuilder();
  }

  onCommand(interaction: CommandInteraction<CacheType>, user: any) {
    throw new Error("Method not implemented.");
  }

  onInteractionCreate(interaction: Interaction<CacheType>, user: any) {
    throw new Error("Method not implemented.");
  }

  onModalInteractionCreate(
    interaction: ModalSubmitInteraction<CacheType>,
    user: any,
  ) {
    throw new Error("Method not implemented.");
  }
}
