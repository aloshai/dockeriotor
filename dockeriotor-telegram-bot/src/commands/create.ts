import { DockeriotorContext } from "..";

export async function createWorkerCommand(ctx: DockeriotorContext) {
  await ctx.conversation.enter("create-worker");
}
