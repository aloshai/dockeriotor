import { createConversation } from "@grammyjs/conversations";
import { DockeriotorContext, DockeriotorConversation } from "..";
import { authCheck } from "../middlewares/auth-check.middleware";
import { createWorker } from "../services/api";

export async function createWorkerConversationHandle(
  conversation: DockeriotorConversation,
  ctx: DockeriotorContext
) {
  await conversation.run(authCheck);
  await ctx.reply("✍️ Enter the tag for the worker.");

  const { message } = await conversation.wait();

  if (!message || !message.text) {
    await ctx.reply("❌ Invalid command.");
    return;
  }

  const tag = message.text;

  await ctx.reply("✍️ Enter the command for the worker.");

  const { message: commandMessage } = await conversation.wait();

  if (!commandMessage || !commandMessage.text) {
    await ctx.reply("❌ Invalid command.");
    return;
  }

  const command = commandMessage.text;

  try {
    const apiResponse = await createWorker(ctx.from!.id, tag, command);

    const apiData = apiResponse.data;

    if (apiData.status == false) {
      await ctx.reply("❌ Worker creation failed.");
    }

    const commandText = `dockeriotor --user-id ${(ctx as any).user.id} --tag ${tag}`;

    await ctx.reply(
      `Worker successfully created. 🎉\n\n Command:\n${commandText}`
    );
  } catch (error: any) {
    await ctx.reply("❌ " + error.response.data.message);
  }
}

export const createWorkerConversation = createConversation(
  createWorkerConversationHandle,
  "create-worker"
);
