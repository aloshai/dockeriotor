import { InlineKeyboard } from "grammy";
import { DockeriotorContext } from "..";
import { getWorkers } from "../services/api";

export async function workersCommand(ctx: DockeriotorContext) {
  const workersResponse = await getWorkers(ctx.from!.id);
  const workersData = workersResponse.data;

  if (!workersData.data.length) {
    ctx.reply("❌ You don't have any workers.");
    return;
  }

  const workers = workersData.data;

  ctx.session.workers = workers;

  const activeWorkersCount = workers.filter(
    (worker: any) => worker.isActive
  ).length;
  const inactiveWorkersCount = workers.length - activeWorkersCount;

  const keyboard = new InlineKeyboard();

  workers.forEach(async (worker: any) => {
    const prefix = worker.isActive ? "🟢" : "🔴";

    keyboard.text(`${prefix} #${worker.tag}`, `worker-${worker.tag}`);
  });

  await ctx.reply(
    `👷 Workers\n\n🟢 Active Workers: ${activeWorkersCount}\n🔴 Inactive Workers: ${inactiveWorkersCount}`,
    {
      reply_markup: keyboard,
    }
  );
}
