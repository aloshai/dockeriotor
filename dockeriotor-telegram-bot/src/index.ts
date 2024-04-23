import {
  Bot,
  Context,
  InlineKeyboard,
  SessionFlavor,
  session,
  MemorySessionStorage,
  GrammyError,
  HttpError,
} from "grammy";
import { escapeMarkdown } from "./lib/utils";
import {
  Conversation,
  ConversationFlavor,
  conversations,
} from "@grammyjs/conversations";
import {
  createWorkerCommand,
  registerCommand,
  startCommand,
  workersCommand,
} from "./commands";
import {
  createWorkerConversation,
  removeWorkerConversation,
  workerUpdateConversation,
} from "./conversations";
import { authCheck } from "./middlewares/auth-check.middleware";

interface SessionData {
  workers: any[];
  worker: any;
}

export type DockeriotorContext = Context &
  SessionFlavor<SessionData> &
  ConversationFlavor & { user: any };
export type DockeriotorConversation = Conversation<DockeriotorContext>;

const bot = new Bot<DockeriotorContext>(process.env.TELEGRAM_BOT_TOKEN!);
const pm = bot.chatType("private");

const initial = () => ({
  workers: [],
  worker: null,
});

pm.use(
  session({
    storage: new MemorySessionStorage<SessionData>(),
    initial,
  })
);

pm.use(conversations());

pm.use(workerUpdateConversation);
pm.use(createWorkerConversation);
pm.use(removeWorkerConversation);

pm.command("register", registerCommand);
pm.command("start", startCommand);
pm.command("create", createWorkerCommand);
pm.command("workers", authCheck, workersCommand);

pm.callbackQuery("update-worker", async (ctx: any) => {
  await ctx.conversation.enter("update-worker");
});

pm.callbackQuery("remove-worker", async (ctx: any) => {
  await ctx.conversation.enter("remove-worker");
});

pm.on("callback_query:data", async (ctx: any) => {
  const data = ctx.callbackQuery.data;

  if (!data.startsWith("worker-")) {
    return;
  }

  const tag = data.replace("worker-", "");

  const worker = ctx.session.workers.find((worker: any) => worker.tag === tag);

  if (!worker) {
    ctx.reply("❌ Worker not found.");
    return;
  }

  await ctx.answerCallbackQuery();

  ctx.session.worker = worker;

  let message = `👷 Worker\n\n  🏷️ Tag: ${escapeMarkdown(worker.tag)}\n  🔧 Command:\n||${escapeMarkdown(worker.command)}||`;

  const cloudConnectionStatus = worker.isActive
    ? "🟢 Connected Dockeriotor"
    : "🔴 Disconnected Dockeriotor";

  message += `\n\n${cloudConnectionStatus}`;

  if (worker.stats) {
    worker.stats.forEach((stat: any) => {
      message += `\n\n📊 ${escapeMarkdown(stat.image)}`;
      message += `\n    📈 CPU\: ${escapeMarkdown(stat.cpu_usage.toFixed(2))}\%`;
      message += `\n    📊 Memory\: ${escapeMarkdown((stat.memory_usage / 1024 / 1024).toFixed(2))}MB`;
    });
  }

  const inlineKeyboard = new InlineKeyboard();

  // Start, stop, restart, pause, resume
  if (worker.isActive) {
    inlineKeyboard.text("🟢 Start", "start-worker");
    inlineKeyboard.text("🔴 Stop", "stop-worker");
    inlineKeyboard.text("🔃 Restart", "restart-worker");
    inlineKeyboard.text("⏹️ Pause", "pause-worker");
    inlineKeyboard.text("▶️ Resume", "resume-worker").row();
  }

  inlineKeyboard.text("🖲️ Update Command", "update-worker");
  inlineKeyboard.text("❌ Remove Worker", "remove-worker");

  await ctx.reply(message, {
    reply_markup: inlineKeyboard,
    parse_mode: "MarkdownV2",
  });
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.start();
