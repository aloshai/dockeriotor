import { createConversation } from "@grammyjs/conversations";
import { DockeriotorContext, DockeriotorConversation } from "..";
import { deleteWorker } from "../services/api";

export async function removeWorkerConversationHandle(
  conversation: DockeriotorConversation,
  ctx: DockeriotorContext
) {
  const worker = ctx.session.worker;

  if (!worker) {
    await ctx.reply("❌ Worker not found.");
    return;
  }

  await ctx.reply("❓ Are you sure you want to remove the worker? (yes/no)");

  const { message } = await conversation.wait();

  if (!message || !message.text) {
    await ctx.reply("❌ Invalid command.");
    return;
  }

  const text = message.text.toLowerCase();

  if (text === "yes") {
    try {
      const apiResponse = await deleteWorker(ctx.from!.id, worker.tag);
      const apiData = apiResponse.data;

      if (apiData.status == false) {
        await ctx.reply("❌ Worker removal failed.");
        return;
      }

      await ctx.reply("❌ Worker removed. 🎉");
    } catch (error: any) {
      await ctx.reply("❌ " + error.response.data.message);
    }
  } else {
    await ctx.reply("❌ Worker removal canceled.");
  }
}

export const removeWorkerConversation = createConversation(
  removeWorkerConversationHandle,
  "remove-worker"
);
