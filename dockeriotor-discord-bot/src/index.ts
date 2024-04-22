import { Bot } from "./bot";

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

const bot = new Bot();
bot.init();
