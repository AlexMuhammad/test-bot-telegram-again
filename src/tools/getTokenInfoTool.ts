import { DynamicTool } from "@langchain/core/tools";
import { fetchTokenDataBySymbol } from "../api/coingecko";

export const getTokenInfoTool = new DynamicTool({
  name: "getCoinGeckoTokenData",
  description: `Get detailed CoinGecko token information. Use this tool when the user asks for detailed information from CoinGecko specifically, or when other data sources don't return results.`,
  func: async (token: string) => {
    const info = await fetchTokenDataBySymbol(token);
    return `CoinGecko Token Info: ${info}`;
  },
});
