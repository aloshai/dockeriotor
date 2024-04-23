import { Command } from "@/models/command.model";
import {
  CacheType,
  CommandInteraction,
  EmbedBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
} from "discord.js";
import { addWorkerModal } from "../modals";
import { AddWorkerFields } from "@/enums/add-worker-fields.enum";
import { createWorker } from "@/services/api";

export class AddWorkerCommand extends Command {
  public readonly modals: ModalBuilder[] = [addWorkerModal];

  constructor() {
    super();
    this.command.setName("add-worker").setDescription("Add a worker");
  }

  onCommand(interaction: CommandInteraction<CacheType>): void {
    interaction.showModal(addWorkerModal);
  }

  public async onModalInteractionCreate(
    interaction: ModalSubmitInteraction<CacheType>,
    user: any
  ) {
    const workerName = interaction.fields.getTextInputValue(
      AddWorkerFields.WorkerName
    );

    const workerCommand = interaction.fields.getTextInputValue(
      AddWorkerFields.WorkerCommand
    );

    const formattedWorkerName = workerName.replace(/\s/g, "-").toLowerCase();

    try {
      const apiResponse = await createWorker(
        interaction.user.id,
        formattedWorkerName,
        workerCommand
      );

      const worker = apiResponse.data.data;

      const command = `python main.py --user-id ${user.id} --tag ${worker.tag}`;

      const embed = new EmbedBuilder()
        .setTitle("Worker Added")
        .setDescription(
          `Worker ${worker.tag} added. Run the following command to start the worker:\n\n \`\`\`${command}\`\`\``
        )
        .setColor("#00ff00")
        .setFields([
          {
            name: "Worker Name",
            value: worker.tag,
          },
        ])
        .setFooter({
          text: "Dockeriotor is not an official product of IO.net",
        });

      interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: "Error: " + err.response.data.message,
        ephemeral: true,
      });

      return;
    }
  }
}
