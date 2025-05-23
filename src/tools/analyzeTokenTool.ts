import { DynamicTool } from "@langchain/core/tools";
import { fetchTokenDataBySymbol } from "../api/coingecko";
import {
  fetchDexscreenerData,
  fetchDexscreenerDataByAddress,
} from "../api/dexscanner";
import { TokenData } from "../types";
import { analyzeToken } from "../ai";

export const analyzeTokenTool = new DynamicTool({
  name: "analyzeToken",
  description: `🎯 UNIVERSAL TOKEN ANALYZER - Use this tool for ANY message containing token names or crypto references:

**TRIGGER PATTERNS (ALWAYS USE THIS TOOL FOR):**
📝 **Direct Token Mentions:**
- Any token name: bitcoin, btc, ethereum, eth, pepe, shib, doge, popcat, bonk, floki, sol, bnb, ada, matic, usdc, usdt, cake, uni, link, dot, avax, near, mana, sand, axs, etc.
- Token symbols: $PEPE, $BTC, $ETH, $SHIB, $DOGE, $POPCAT, $BONK, etc.
- Contract addresses: 0x followed by 40 hex characters

🤔 **Investment Questions:**
- "is [TOKEN] worth it to buy?"
- "should I invest in [TOKEN]?"
- "[TOKEN] good investment?" 
- "what about [TOKEN]?"
- "[TOKEN] worth buying?"
- "buy [TOKEN] or not?"
- "[TOKEN] safe to invest?"

💰 **Value/Price Inquiries:**
- "[TOKEN] price"
- "how much is [TOKEN]?"
- "[TOKEN] value"
- "[TOKEN] cost"
- "price of [TOKEN]"

🔍 **Information Requests:**
- "what is [TOKEN]?"
- "tell me about [TOKEN]"
- "[TOKEN] info"
- "[TOKEN] analysis"
- "explain [TOKEN]"
- "[TOKEN] details"

📍 **Contract/Address Questions:**
- "contract address of [TOKEN]"
- "[TOKEN] address"
- "where to find [TOKEN]"
- "[TOKEN] contract"

🎲 **Casual Mentions:**
- "thinking about [TOKEN]"
- "heard about [TOKEN]"
- "[TOKEN] looks interesting"
- "someone mentioned [TOKEN]"

⚡ **RULE: If ANY recognizable token name appears in the message, USE THIS TOOL!**

Input: token name, symbol, or contract address (extract from user message)`,
  func: async (input: string) => {
    try {
      let dexData: TokenData | null, info: any;

      dexData = await fetchDexscreenerData(input);
      info = await fetchTokenDataBySymbol(input);

      const formatData = (data: any) => {
        return `Name: ${data.name}
Chain: ${data.chain}
Price: $${data.price}
Liquidity: $${data.liquidity.toLocaleString()}
24h Volume: $${data.volume.toLocaleString()}
FDV: $${data.fdv.toLocaleString()}
Address: ${data.address}
Symbol: ${data.symbol}
Market Cap: $${data.marketCap.toLocaleString()}
High 24h: $${data.high24h}
Low 24h: $${data.low24h}
Transactions 24h: ${data.transactions24h}
Fully Diluted Valuation: $${data.fdv.toLocaleString()}
`;
      };

      const combined = {
        name: dexData?.name || info?.name || "Unknown Token",
        chain: dexData?.chain || "Unknown Chain",
        price: dexData?.price || info?.price || "N/A",
        liquidity: dexData?.liquidity || "N/A",
        volume: dexData?.volume24h || info?.volume24h || "N/A",
        fdv: dexData?.fdv || "N/A",
        address: dexData?.address || "N/A",
        symbol: dexData?.symbol || info?.symbol || "N/A",
        marketCap: info?.marketCap || "N/A",
        high24h: info?.high24h || "N/A",
        low24h: info?.low24h || "N/A",
        transactions24h: info?.transactions24h || "N/A",
      };

      const formattedData = formatData(combined);
      const { insight, score } = await analyzeToken(combined);

      return {
        data: formattedData,
        insight,
        score,
      };
    } catch (err) {
      return "⚠️ Unable to analyze this token. Please check the name or contract address.";
    }
  },
});
