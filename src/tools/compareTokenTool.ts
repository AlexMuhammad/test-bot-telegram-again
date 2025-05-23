import { DynamicTool } from "@langchain/core/tools";
import { fetchDexscreenerData } from "../api/dexscanner";
import { TokenData } from "../types";

const formatData = (data: TokenData) => {
  return `📊 ${data.name} (${data.chain})
💰 Price: $${data.price}
💧 Liquidity: $${data.liquidity}
📈 Volume (24h): $${data.volume24h}
🏷 FDV: $${data.fdv}`;
};

export const compareTokenTool = new DynamicTool({
  name: "compareTokens",
  description: `Compare two crypto tokens side by side. Use this tool when the user explicitly asks to compare tokens (e.g., "compare pepe and doge"). Input format must be two tokens separated by comma: "token1,token2"`,
  func: async (input: string) => {
    const [tokenA, tokenB] = input.split(",").map((t) => t.trim());

    if (!tokenA || !tokenB) {
      return "❌ Please provide two token names or addresses, separated by a comma.";
    }

    try {
      const [dataA, dataB] = await Promise.all([
        fetchDexscreenerData(tokenA),
        fetchDexscreenerData(tokenB),
      ]);

      const summaryA = formatData(dataA);
      const summaryB = formatData(dataB);

      return `🔍 Token Comparison:\n\n${summaryA}\n\nvs.\n\n${summaryB}`;
    } catch (err) {
      console.log(err);
      return "❌ An error occurred while fetching token data. Please try again later.";
    }
  },
});
