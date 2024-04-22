import { createUpdateWorkerModal } from "@/modals/update-worker.modal";
import { Command } from "@/models/command.model";
import { getWorkers, sendAction, updateWorker } from "@/services/api";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CacheType,
  CommandInteraction,
  ComponentType,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";

export enum WorkerActionType {
  Start,
  Stop,
  Restart,
  Pause,
  Resume,
}

// TODO: The data will be modified by editingReply via a single message

export class WorkersCommand extends Command {
  constructor() {
    super();

    this.command.setName("workers").setDescription("Check if the bot is alive");
  }

  private createWorkerButtons(worker) {
    const restartButton = new ButtonBuilder()
      .setCustomId("restart")
      .setLabel("Restart")
      .setDisabled(!worker.isActive)
      .setStyle(ButtonStyle.Primary);

    const stopButton = new ButtonBuilder()
      .setCustomId("stop")
      .setLabel("Stop")
      .setDisabled(!worker.isActive)
      .setStyle(ButtonStyle.Danger);

    const startButton = new ButtonBuilder()
      .setCustomId("start")
      .setLabel("Start")
      .setDisabled(!worker.isActive)
      .setStyle(ButtonStyle.Success);

    const pauseButton = new ButtonBuilder()
      .setCustomId("pause")
      .setLabel("Pause")
      .setDisabled(!worker.isActive)
      .setStyle(ButtonStyle.Secondary);

    const resumeButton = new ButtonBuilder()
      .setCustomId("resume")
      .setLabel("Resume")
      .setDisabled(!worker.isActive)
      .setStyle(ButtonStyle.Secondary);

    const changeCommandButton = new ButtonBuilder()
      .setCustomId("change-command")
      .setLabel("Change Command")
      .setStyle(ButtonStyle.Secondary);

    const firstActionRow = new ActionRowBuilder().addComponents(
      startButton,
      restartButton,
      stopButton,
      pauseButton,
      resumeButton,
    );

    const secondActionRow = new ActionRowBuilder().addComponents(
      changeCommandButton,
    );

    return [firstActionRow, secondActionRow];
  }

  private createWorkerEmbed(worker) {
    // define general state variable and check all stats give one value of active, partial, or inactive

    const generalState = !worker.isActive
      ? "disconnected"
      : worker.stats?.every((stat) => stat.state == "running")
        ? "active"
        : worker.stats?.some((stat) => stat.state == "running")
          ? "partial"
          : worker.stats?.every(
                (stat) => stat.state == "exited" || stat.state == "dead",
              )
            ? "inactive"
            : "unknown";

    const generalPrefix =
      "\\" +
      (generalState == "active"
        ? "🟢"
        : generalState == "inactive" || generalState == "disconnected"
          ? "🔴"
          : generalState == "partial"
            ? "🟡"
            : "🟣");

    const embed = new EmbedBuilder()
      .setTitle(
        generalPrefix +
          " #" +
          worker.tag +
          " (" +
          generalState.toUpperCase() +
          ")",
      )
      .setDescription(
        !worker.isActive
          ? "Worker is disconnected from the Cloud. You must run dockeriotor manually."
          : "Worker is connected to the Cloud. You can perform actions on the worker.",
      )
      .setFooter({
        text: "Dockeriotor is not an official product of IO.net",
      })
      .setColor("#0099ff")
      .setTimestamp()
      .setFields(
        {
          name: "State",
          value: generalPrefix + " " + generalState.toUpperCase(),
          inline: true,
        },
        {
          name: "Tag",
          value: worker.tag,
          inline: true,
        },
        {
          name: "Automation",
          value:
            "Automation Type: " +
            `**${worker.automation.type.toUpperCase()}**` +
            (worker.automation.period
              ? " every " + worker.automation.period + " seconds"
              : ""),
          inline: true,
        },
      );

    if (worker.stats) {
      const fields = worker.stats.map((stat) => {
        let prefix =
          "\\" +
          (stat.state == "running"
            ? "🟢"
            : stat.state == "exited"
              ? "🔴"
              : "🟡");

        return {
          name: prefix + " " + stat.image,
          value: `CPU: ${stat.cpu_usage.toFixed(2)}%\nMemory: ${(
            stat.memory_usage /
            1024 /
            1024
          ).toFixed(2)}MB`,
        };
      });

      embed.addFields(...fields);
    }

    return embed;
  }

  async onCommand(interaction: CommandInteraction<CacheType>) {
    const response = await getWorkers(interaction.user.id);

    const workers = response.data.data;

    if (workers.length === 0) {
      //await interaction.reply("No workers found");
      return;
    }

    const select = new StringSelectMenuBuilder()
      .setCustomId("worker")
      .setPlaceholder("Select a worker")
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

    const interactionReply = await interaction.reply({
      embeds: [embed],
      components: [actionRow as any],
      ephemeral: true,
    });

    const selectActionCollector = await interactionReply.awaitMessageComponent({
      filter: (i) => {
        return i.user.id == interaction.user.id;
      },
      time: 60000,
      componentType: ComponentType.StringSelect,
    });

    const selectedWorker = workers.find(
      (worker) => worker.tag == selectActionCollector.values[0],
    );

    if (!selectedWorker) {
      await interactionReply
        .edit({
          content: "Worker not found",
        })
        .catch(console.error);
      return;
    }

    const workerEmbed = this.createWorkerEmbed(selectedWorker);
    const workerActionRows = this.createWorkerButtons(selectedWorker);

    const selectInteraction = await interactionReply.edit({
      content: "Select an action to perform on the worker",
      embeds: [workerEmbed],
      components: workerActionRows as any,
    });

    await selectActionCollector.deferUpdate();

    try {
      const buttonAction = await selectInteraction.awaitMessageComponent({
        filter: (i) => {
          return i.user.id == interaction.user.id;
        },
        componentType: ComponentType.Button,
        time: 60000,
      });

      if (buttonAction.customId == "change-command") {
        await buttonAction.showModal(
          createUpdateWorkerModal({
            workerCommand: selectedWorker.command,
          }),
        );

        try {
          const submitted = await buttonAction.awaitModalSubmit({
            filter: (i) => i.user.id == interaction.user.id,
            time: 120000,
          });

          submitted.deferUpdate();

          const workerCommand =
            submitted.fields.getTextInputValue("workerCommand");

          if (!workerCommand) {
            await interactionReply.edit({
              content: "Command cannot be empty",
            });
            return;
          }

          if (!submitted) {
            await interactionReply.edit({
              content: "Command update cancelled",
            });

            return;
          }

          const apiResponse = await updateWorker(
            interaction.user.id,
            selectedWorker.tag,
            workerCommand,
          );

          if (apiResponse.data.status == true) {
            await buttonAction.editReply({
              content: "Command updated successfully",
            });
          } else {
            await buttonAction.editReply({
              content: "Command update failed: " + apiResponse.data.message,
            });
          }
        } catch (error) {
          console.error(error);
        }

        return;
      }

      let action: WorkerActionType = WorkerActionType.Restart;

      switch (buttonAction.customId) {
        case "restart":
          action = WorkerActionType.Restart;
          break;
        case "stop":
          action = WorkerActionType.Stop;
          break;
        case "start":
          action = WorkerActionType.Start;
          break;
        case "pause":
          action = WorkerActionType.Pause;
          break;
        case "resume":
          action = WorkerActionType.Resume;
          break;
        default:
          return;
      }

      const apiResponse = await sendAction(
        interaction.user.id,
        selectedWorker.tag,
        action,
      );

      if (apiResponse.data.status == true) {
        await interaction.editReply({
          content: "Action completed successfully",
        });
      } else {
        await interaction.editReply({
          content: "Action failed: " + apiResponse.data.message,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
}
