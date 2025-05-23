import { DynamicTool } from "@langchain/core/tools";
import { fethcTop5TokenData } from "../api/coingecko";

export const getTopTokenTool = new DynamicTool({
  name: "getTop5Token",
  description: `Get the top 5 tokens by market cap. Use this tool when the user asks about top/trending/popular tokens or market leaders.`,
  func: async () => {
    const tokens = await fethcTop5TokenData();
    return `Top 5 Tokens: ${tokens}`;
  },
});
