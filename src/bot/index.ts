import { Bot } from "grammy";
import { handleMessage } from "./handlers";
import dotenv from "dotenv";

export const startBot = () => {
  const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
  bot.on("message:text", handleMessage);
  bot.command("start", (ctx) =>
    ctx.reply("🤖 I can analyze tokens and answer crypto questions!")
  );
  bot.command("help", (ctx) =>
    ctx.reply(
      "Send a token address, like 0x... or ask about $TOKEN price/safety."
    )
  );
  bot.start();
};
