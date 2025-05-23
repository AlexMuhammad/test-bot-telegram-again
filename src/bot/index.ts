import { Bot } from "grammy";
import { handleMessage } from "./handlers";

export const startBot = () => {
  const bot = new Bot("7407905687:AAF928REVNffUsplaeUau2b496QzQX1-D18");
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
