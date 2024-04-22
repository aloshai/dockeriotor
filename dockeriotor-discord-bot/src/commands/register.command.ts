import { Command } from "@/models/command.model";
import { registerDiscordUser } from "@/services/api";
import {
  CacheType,
  CommandInteraction,
  Interaction,
  SlashCommandBuilder,
} from "discord.js";

export class RegisterCommand extends Command {
  constructor() {
    super();

    this.authRequired = false;
    this.command
      .setName("register")
      .setDescription(
        "In order to use Dockeriotor, an account will be created with your Discord ID in DockeriotorCloud.",
      );
  }

  async onCommand(interaction: CommandInteraction<CacheType>) {
    try {
      const response = await registerDiscordUser(interaction.user.id);

      interaction.reply({
        content:
          "You have successfully registered to DockeriotorCloud. You can now start using Dockeriotor. More information: https://dockeriotor.com",
        ephemeral: true,
      });
    } catch (error) {
      interaction.reply({
        content: "Error: " + error.response.data.message,
        ephemeral: true,
      });
    }
  }

  public async onModalInteractionCreate(interaction: Interaction<CacheType>) {}
}
