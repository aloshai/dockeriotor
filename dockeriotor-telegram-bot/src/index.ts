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
import {
  createWorker,
  deleteWorker,
  getUser,
  getWorkers,
  registerTelegramUser,
  updateWorker,
} from "./services/api";
import { escapeMarkdown } from "./lib/utils";
import {
  Conversation,
  ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";

interface SessionData {
  workers: any[];
  worker: any;
}

type MyContext = Context & SessionFlavor<SessionData> & ConversationFlavor;
type MyConversation = Conversation<MyContext>;

const bot = new Bot<MyContext>(process.env.TELEGRAM_BOT_TOKEN!);
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

async function authCheck(ctx: any, next: any) {
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

pm.command("register", async (ctx) => {
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
});

pm.use(conversations());

async function updateWorkerCommand(
  conversation: MyConversation,
  ctx: MyContext
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

const workerUpdateConversation = createConversation(
  updateWorkerCommand,
  "update-worker"
);

pm.use(workerUpdateConversation);

pm.command("start", async (ctx) => {
  ctx.reply(
    "👋 Welcome to Dockeriotor. You can learn about Dockeriotor with the commands below."
  );
});

async function _createWorkerAction(
  conversation: MyConversation,
  ctx: MyContext
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

const createWorkerConversation = createConversation(
  _createWorkerAction,
  "create-worker"
);

pm.use(createWorkerConversation);

pm.command("create", async (ctx) => {
  await ctx.conversation.enter("create-worker");
});

pm.command("workers", authCheck, async (ctx) => {
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
});

pm.callbackQuery("update-worker", async (ctx: any) => {
  await ctx.conversation.enter("update-worker");
});

async function removeWorker(conversation: MyConversation, ctx: MyContext) {
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

const removeWorkerConversation = createConversation(
  removeWorker,
  "remove-worker"
);

pm.use(removeWorkerConversation);

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
