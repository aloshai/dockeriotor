import { CacheType, Interaction } from "discord.js";
import { Bot } from "../bot";
import { getUser } from "@/services/api";

export class OnInteractionCreateEvent {
  public name = "interactionCreate";

  async checkAuth(discordId: string) {
    const userResponse = await getUser(discordId);

    return {
      ok: !!userResponse.data,
      user: userResponse.data,
    };
  }

  public async run(interaction: Interaction<CacheType>, bot: Bot) {
    let user;

    if (interaction.isModalSubmit()) {
      const command = bot.commands.find(
        (command) =>
          command.modals &&
          command.modals.some(
            (modal) => modal.data.custom_id === interaction.customId
          )
      );

      if (!command) {
        return;
      }

      if (command.authRequired) {
        const { ok, user: userData } = await this.checkAuth(
          interaction.user.id
        );

        if (!ok) {
          return;
        }

        user = userData;
      }

      try {
        command.onModalInteractionCreate(interaction, user);
      } catch (error) {
        console.error(error);
      }
      return;
    }

    if (!interaction.isCommand()) {
      return;
    }

    const command = bot.commands.find(
      (command) => command.command.name === interaction.commandName
    );

    if (!command) {
      return;
    }

    if (command.authRequired) {
      const { ok, user: userData } = await this.checkAuth(interaction.user.id);

      if (!ok) {
        interaction.reply({
          content:
            "You need to register to DockeriotorCloud in order to use this command. More information: https://dockeriotor.com",
        });

        return;
      }

      user = userData;
    }

    try {
      command.onCommand(interaction, user);
    } catch (error) {
      console.error(error);
    }
  }
}
