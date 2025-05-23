import { DynamicTool } from "@langchain/core/tools";
import { fetchDexscreenerData } from "../api/dexscanner";
import { TokenData } from "../types";

export const getPriceTool = new DynamicTool({
  name: "getCryptoPrice",
  description: `💰 PRICE CHECKER - Use this for price-specific queries:

**TRIGGER PATTERNS:**
💰 **Direct Price Questions:**
- "what's the price of [TOKEN]?"
- "[TOKEN] price"
- "how much is [TOKEN]?"
- "[TOKEN] current price"
- "price of [TOKEN]"

📊 **Value Questions:**
- "how much does [TOKEN] cost?"
- "[TOKEN] value"
- "[TOKEN] worth"
- "[TOKEN] price now"
- "[TOKEN] current value"

📈 **Market Queries:**
- "[TOKEN] price today"
- "[TOKEN] market price"
- "[TOKEN] trading price"

⚡ **Quick Price Checks:**
- Just token name + "price" in any combination
- Single word: "[TOKEN]?" (when context suggests price check)

Input: token name or symbol`,
  func: async (token: string) => {
    try {
      const data: TokenData = await fetchDexscreenerData(token);
      return `Name: ${data.name}
Chain: ${data.chain}
Price: $${data.price}
Liquidity: $${data.liquidity.toLocaleString()}
24h Volume: $${data.volume24h.toLocaleString()}
FDV: $${data.fdv.toLocaleString()}
Address: ${data.address}
Symbol: ${data.symbol}
Market Cap: $${data.marketCap.toLocaleString()}
Transactions 24h: ${data.transactions24h}
Fully Diluted Valuation: $${data.fdv.toLocaleString()}`;
    } catch (err) {
      return "⚠️ Unable to fetch price data for this token.";
    }
  },
});
