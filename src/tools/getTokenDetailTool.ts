import { DynamicTool } from "@langchain/core/tools";
import { fetchTokenDataBySymbol } from "../api/coingecko";
import { fetchDexscreenerDataByAddress } from "../api/dexscanner";

export const getTokenDetailsTool = new DynamicTool({
  name: "getTokenDetails",
  description: `Get comprehensive token information. Use this for detailed token queries:
  - Contract info: "contract address of X", "X address", "X contract"
  - Token details: "X token info", "details about X", "X statistics"
  - Technical data: "X liquidity", "X volume", "X market cap", "X metrics"
  - Chain info: "what chain is X on?", "X blockchain", "where is X traded?"
  Input: token name, symbol, or contract address`,
  func: async (token: string) => {
    try {
      const dexData = await fetchDexscreenerDataByAddress(token);
      const geckoData = await fetchTokenDataBySymbol(dexData?.symbol || token);

      const formatData = (dexData: any, geckoData: any) => {
        return `📊 ${dexData.name} (${dexData.symbol})
🔗 Contract: ${dexData.address}
⛓️ Chain: ${dexData.chain}
💰 Price: $${dexData.price}
💧 Liquidity: $${dexData.liquidity.toLocaleString()}
📈 24h Volume: $${dexData.volume24h.toLocaleString()}
🏦 Market Cap: $${geckoData?.marketCap?.toLocaleString() || "N/A"}
💎 FDV: $${dexData.fdv.toLocaleString()}
📊 24h High: $${geckoData?.high24h || "N/A"}
📉 24h Low: $${geckoData?.low24h || "N/A"}
🔄 24h Transactions: ${geckoData?.transactions24h || "N/A"}`;
      };

      return formatData(dexData, geckoData);
    } catch (err) {
      return "⚠️ Unable to fetch detailed token information.";
    }
  },
});
