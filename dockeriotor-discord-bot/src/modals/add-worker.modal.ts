import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { ModalId } from "../enums/modal-id.enum";
import { AddWorkerFields } from "@/enums/add-worker-fields.enum";

const workerNameInput = new TextInputBuilder()
  .setCustomId(AddWorkerFields.WorkerName)
  .setLabel("Worker Name")
  .setStyle(TextInputStyle.Short)
  .setPlaceholder("Enter worker name")
  .setRequired(true);

const workerCommandInput = new TextInputBuilder()
  .setCustomId(AddWorkerFields.WorkerCommand)
  .setLabel("IO.NET Worker Command")
  .setStyle(TextInputStyle.Short)
  .setPlaceholder("Enter worker command")
  .setRequired(true);

const workerNameActionRow = new ActionRowBuilder().addComponents(
  workerNameInput,
);

const workerCommandActionRow = new ActionRowBuilder().addComponents(
  workerCommandInput,
);

const addWorkerModal = new ModalBuilder()
  .setCustomId(ModalId.AddWorkerCommand)
  .setTitle("Add Worker");

addWorkerModal.addComponents(
  workerNameActionRow as any,
  workerCommandActionRow as any,
);

export { addWorkerModal };
