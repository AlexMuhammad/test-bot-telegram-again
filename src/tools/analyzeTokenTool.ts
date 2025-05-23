import { DynamicTool } from "@langchain/core/tools";
import { fetchDexscreenerDataByAddress } from "../api/dexscanner";
import { fetchTokenDataBySymbol } from "../api/coingecko";
import { analyzeToken } from "../ai";
import { TokenData } from "../types";

export const analyzeTokenTool = new DynamicTool({
  name: "analyzeToken",
  description: `Analyze a token by name or contract address. Use this tool when the user inputs ONLY a token name (like 'pepe', 'doge') or contract address (like '0x123...'). Returns comprehensive token data including price, liquidity, volume, and safety metrics.`,
  func: async (input: string) => {
    try {
      let dexData: TokenData | null, info: TokenData;

      dexData = await fetchDexscreenerDataByAddress(input);

      info = await fetchTokenDataBySymbol(input);

      const combined = {
        name: dexData?.name || info?.name || "Unknown Token",
        chain: dexData?.chain || "Unknown Chain",
        price: dexData?.price || info?.price || "N/A",
        liquidity: dexData?.liquidity || "N/A",
        volume: dexData?.volume24h || info?.volume24h || "N/A",
        fdv: dexData?.fdv || "N/A",
      };

      return combined;
    } catch (err) {
      return "⚠️ Unable to analyze this token. Please check the name or contract address.";
    }
  },
});
