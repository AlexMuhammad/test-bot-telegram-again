import { DynamicTool } from "@langchain/core/tools";
import { fetchTokenDataBySymbol } from "../api/coingecko";

export const getTokenInfoTool = new DynamicTool({
  name: "getCoinGeckoTokenData",
  description: "Get detailed CoinGecko token info by token name.",
  func: async (token: string) => {
    const info = await fetchTokenDataBySymbol(token);
    return `CoinGecko Token Info: ${info}`;
  },
});
