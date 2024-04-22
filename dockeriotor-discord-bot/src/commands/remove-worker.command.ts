import { Command } from "@/models/command.model";
import { getWorkers } from "@/services/api";
import { ModalBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  CacheType,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ComponentType,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

export class RemoveWorkerCommand extends Command {
  public readonly modals: ModalBuilder[] = [];

  constructor() {
    super();
    this.command.setName("remove-worker").setDescription("Remove a worker");
  }

  async onCommand(interaction: CommandInteraction<CacheType>, user: any) {
    const workersResponse = await getWorkers(interaction.user.id);

    if (workersResponse.data.length === 0) {
      return interaction.reply({
        content: "You don't have any workers.",
      });
    }

    const workers = workersResponse.data.data;

    const select = new StringSelectMenuBuilder()
      .setCustomId("worker")
      .setPlaceholder("Select a worker to remove")
      .addOptions(
        workers.map((worker) => {
          return new StringSelectMenuOptionBuilder()
            .setLabel(worker.tag)
            .setValue(worker.tag)
            .setDescription(worker.isActive ? "Active" : "Inactive");
        }),
      );

    const actionRow = new ActionRowBuilder().addComponents(select);

    const embed = new EmbedBuilder()
      .setTitle("Workers (" + workers.length + ")")
      .setDescription(
        "Below are all the workers registered in the Dockeriotor Cloud. Inactive Workers are not connected to the Dockeriotor Cloud. You need to activate the dockeriotor service to reconnect them.\n\nTo perform an operation on a Worker, please select the worker.",
      )
      .setColor("#0099ff")
      .setTimestamp()
      .setFooter({
        text: "Dockeriotor is not an official product of IO.net",
        iconURL: interaction.user.avatarURL(),
      });

    workers.forEach((worker) => {
      embed.addFields({
        name: "#" + worker.tag,
        value: worker.isActive
          ? "🟢 Connected Dockeriotor Cloud"
          : "🔴 Not Connected Dockeriotor Cloud",
      });
    });

    embed.addFields(
      {
        name: "🟢 Active",
        value: workers.filter((worker) => worker.isActive).length + " workers",
        inline: true,
      },
      {
        name: "🔴 Inactive",
        value: workers.filter((worker) => !worker.isActive).length + " workers",
        inline: true,
      },
    );

    const interactionReply = await interaction.reply({
      embeds: [embed],
      components: [actionRow as any],
    });

    try {
      const workerSelectionCollector =
        await interactionReply.awaitMessageComponent({
          filter: (i) => i.user.id === interaction.user.id,
          componentType: ComponentType.StringSelect,
          time: 60000,
        });

      const selectedWorker = workers.find(
        (worker) => worker.tag === workerSelectionCollector.values[0],
      );

      if (!selectedWorker) {
        return interactionReply.edit({
          content: "Worker not found",
          embeds: [],
        });
      }

      const confirmButton = new ButtonBuilder()
        .setCustomId("confirm")
        .setLabel("Confirm")
        .setStyle(ButtonStyle.Success);

      const cancelButton = new ButtonBuilder()
        .setCustomId("cancel")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Danger);

      const actionRow = new ActionRowBuilder()
        .addComponents(confirmButton)
        .addComponents(cancelButton);

      const embed = new EmbedBuilder()
        .setTitle("Remove Worker")
        .setDescription(
          "Are you sure you want to remove the worker with the tag `" +
            selectedWorker.tag +
            "`?",
        )
        .setColor("#0099ff")
        .setTimestamp()
        .setFooter({
          text: "Dockeriotor is not an official product of IO.net",
          iconURL: interaction.user.avatarURL(),
        });

      const interactionConfirmation = await workerSelectionCollector.update({
        embeds: [embed],
        components: [actionRow as any],
        fetchReply: true,
      });

      const confirmationCollector =
        await interactionConfirmation.awaitMessageComponent({
          filter: (i) => i.user.id === interaction.user.id,
          time: 60000,
          componentType: ComponentType.Button,
        });

      if (confirmationCollector.customId === "confirm") {
        await interactionConfirmation.edit({
          content: "Worker removed",
          embeds: [],
          components: [],
        });
      } else {
        await interactionConfirmation.edit({
          content: "Worker not removed",
          embeds: [],
          components: [],
        });
      }
    } catch (err) {
      console.error(RemoveWorkerCommand.name, err);
    }
  }
}
