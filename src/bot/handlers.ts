import { Context } from "grammy";
import { askAi } from "../ai";
import { getCachedData, getCacheKeys, setCachedData } from "../cache";

export const handleMessage = async (ctx: Context) => {
  const input = ctx.message?.text;
  const userId = String(ctx.chat?.id);

  const cacheKey = `${userId}-${input}`;

  if (!input) return;

  try {
    const response = await askAi(input, userId);
    const cachedResponse = getCachedData<string>(cacheKey);
    if (cachedResponse) {
      return await ctx.reply(cachedResponse!, { parse_mode: "Markdown" });
    }
    setCachedData(cacheKey, response, 300);
    return await ctx.reply(response, { parse_mode: "Markdown" });
  } catch (err) {
    return await ctx.reply("⚠️ Sorry, something went wrong. Please try again.");
  }
};
