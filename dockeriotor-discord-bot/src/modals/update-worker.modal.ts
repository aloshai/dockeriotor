import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export function createUpdateWorkerModal(defaults: { workerCommand?: string }) {
  const workerCommandInput = new TextInputBuilder()
    .setCustomId("workerCommand")
    .setLabel("IO.NET Worker Command")
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder("Enter worker command")
    .setMinLength(1)
    .setRequired(true);

  if (defaults.workerCommand) {
    workerCommandInput.setValue(defaults.workerCommand);
  }

  const workerCommandActionRow = new ActionRowBuilder().addComponents(
    workerCommandInput,
  );

  const updateWorkerModal = new ModalBuilder()
    .setCustomId("updateWorkerModal")
    .setTitle("Update Worker");

  updateWorkerModal.addComponents(workerCommandActionRow as any);

  return updateWorkerModal;
}
