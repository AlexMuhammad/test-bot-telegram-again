import { DynamicTool } from "@langchain/core/tools";
import { fetchTokenDataBySymbol } from "../api/coingecko";
import { fetchDexscreenerData } from "../api/dexscanner";

const formatData = (dexData: any, geckoData: any) => {
  return `Name: ${dexData.name}
Chain: ${dexData.chain}
Price: $${dexData.price}
Liquidity: $${dexData.liquidity.toLocaleString()}
24h Volume: $${dexData.volume24h.toLocaleString()}
FDV: $${dexData.fdv.toLocaleString()}
Address: ${dexData.address}
Symbol: ${dexData.symbol}
Market Cap: $${geckoData.marketCap.toLocaleString()}
High 24h: $${geckoData.high24h}
Low 24h: $${geckoData.low24h}
Transactions 24h: ${geckoData.transactions24h}
Fully Diluted Valuation: $${geckoData.fdv.toLocaleString()}`;
};

export const getTokenInfoTool = new DynamicTool({
  name: "getTokenInfo",
  description: `Fetch comprehensive information about any crypto token. Use this tool when the user asks about anything related to a token, such as: contract address, price, liquidity, market data, or simply mentions a token by name (e.g., "tell me about PEPE", "what's SHIB", "show PEPE data"). Input is a token name or symbol (e.g., "pepe", "shib", "doge").`,
  func: async (token: string) => {
    const dexData = await fetchDexscreenerData(token);
    const geckoData = await fetchDexscreenerData(dexData.symbol!);
    const formattedData = formatData(dexData, geckoData);
    return formattedData;
  },
});
