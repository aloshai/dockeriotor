import { DockeriotorContext } from "..";
import { getUser, registerTelegramUser } from "../services/api";

export async function registerCommand(ctx: DockeriotorContext) {
  if (!ctx.from) return;

  const userResponse = await getUser(ctx.from.id);
  const responseData = userResponse.data;

  if (responseData.data) {
    ctx.reply("☑️ You are already registered.");
    return;
  }

  const registerResponse = await registerTelegramUser(ctx.from.id);
  const registerData = registerResponse.data;

  if (!registerData.status) {
    ctx.reply("❌ An error occurred while registering.");
    return;
  }

  ctx.reply("✅ You are now registered.");
}
