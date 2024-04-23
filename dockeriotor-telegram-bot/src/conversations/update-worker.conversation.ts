import { createConversation } from "@grammyjs/conversations";
import { DockeriotorContext, DockeriotorConversation } from "..";
import { updateWorker } from "../services/api";

export async function updateWorkerConversationHandle(
  conversation: DockeriotorConversation,
  ctx: DockeriotorContext
) {
  const worker = ctx.session.worker;

  if (!worker) {
    await ctx.reply("❌ Worker not found.");
    return;
  }

  await ctx.reply("✍️ Enter the new command for the worker.");

  const { message } = await conversation.wait();

  if (!message) {
    await ctx.reply("Invalid command.");
    return;
  }

  const command = message.text;

  try {
    const apiResponse = await updateWorker(ctx.from!.id, worker.tag, command!);

    const apiData = apiResponse.data;

    if (apiData.status == false) {
      await ctx.reply("❌ Worker command update failed.");
    }

    await ctx.reply("Worker command updated. 🎉");
  } catch (error: any) {
    await ctx.reply("❌ " + error.response.data.message);
  }
}
export const workerUpdateConversation = createConversation(
  updateWorkerConversationHandle,
  "update-worker"
);
