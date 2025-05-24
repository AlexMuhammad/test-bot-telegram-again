import { Context } from "grammy";
import { askAi } from "../ai";
import { getCachedData, getCacheKeys, setCachedData } from "../cache";
import { logQuery } from "../db";

export const handleMessage = async (ctx: Context) => {
  const input = ctx.message?.text;
  const chatId = String(ctx.chat?.id);
  const userId = ctx.from?.id;

  console.log("ctx message", ctx);

  const cacheKey = `${chatId}-${input}`;

  if (!input) return;

  try {
    const response = await askAi(input, chatId);
    const cachedResponse = getCachedData<string>(cacheKey);
    if (cachedResponse) {
      return await ctx.reply(cachedResponse!, { parse_mode: "Markdown" });
    }
    setCachedData(cacheKey, response, 300);
    await logQuery(Number(chatId), Number(userId), input, response);
    return await ctx.reply(response, { parse_mode: "Markdown" });
  } catch (err) {
    console.log("error", err);
    return await ctx.reply("⚠️ Sorry, something went wrong. Please try again.");
  }
};
