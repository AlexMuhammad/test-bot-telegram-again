import { Context } from "grammy";
import { askAi } from "../ai";

export const handleMessage = async (ctx: Context) => {
  const input = ctx.message?.text;
  const userId = String(ctx.chat?.id);

  if (!input) return;

  try {
    const response = await askAi(input, userId);
    await ctx.reply(response, { parse_mode: "Markdown" });
  } catch (err) {
    console.error(err);
    await ctx.reply("⚠️ Sorry, something went wrong. Please try again.");
  }
};
