import { DockeriotorContext } from "..";
import { getUser } from "../services/api";

export async function authCheck(ctx: DockeriotorContext, next: any) {
  if (!ctx.from) {
    throw new Error("User not found.");
  }

  const userResponse = await getUser(ctx.from.id);
  const responseData = userResponse.data;

  if (!responseData.data) {
    await ctx.reply(
      "You are not registered. Please register first. Use /register command."
    );

    throw new Error("User not registered.");
  }

  ctx.user = responseData.data;

  await next();
}
