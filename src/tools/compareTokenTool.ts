import { DynamicTool } from "@langchain/core/tools";
import { fetchDexscreenerData } from "../api/dexscanner";
import { TokenData } from "../types";

const formatData = (data: TokenData) => {
  return {
    name: data.name,
    chain: data.chain,
    price: data.price,
    liquidity: data.liquidity,
    volume24h: data.volume24h,
    fdv: data.fdv,
  };
};

export const compareTokenTool = new DynamicTool({
  name: "compareTokens",
  description: `Compare multiple crypto tokens side by side. Use this tool when the user explicitly asks to compare tokens (e.g., "compare pepe, doge and shib"). Input format must be tokens separated by comma: "token1,token2,token3,..."`,
  func: async (input: string) => {
    const tokens = input.split(",").map((t) => t.trim());

    if (tokens.length < 2) {
      return "❌ Please provide at least two token names or addresses, separated by commas.";
    }

    try {
      const tokenDataPromises = tokens.map((token) =>
        fetchDexscreenerData(token)
      );
      const tokenDataResults = await Promise.all(tokenDataPromises);

      const summaries = tokenDataResults.map((data) => formatData(data));

      return {
        summaries,
        count: summaries.length,
      };
    } catch (err) {
      console.log(err);
      return "❌ An error occurred while fetching token data. Please try again later.";
    }
  },
});
