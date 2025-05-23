import { DynamicTool } from "@langchain/core/tools";
import {
  fetchDexscreenerData,
  fetchDexscreenerDataByAddress,
} from "../api/dexscanner";
import { TokenData } from "../types";

export const compareTokenTool = new DynamicTool({
  name: "compareTokens",
  description: `⚖️ TOKEN COMPARISON TOOL - Use this for ANY comparison-related queries:

**TRIGGER PATTERNS:**
🔄 **Direct Comparisons:**
- "[TOKEN1] vs [TOKEN2]"
- "[TOKEN1] versus [TOKEN2]"
- "compare [TOKEN1] and [TOKEN2]"
- "[TOKEN1] or [TOKEN2]"

🤔 **Decision Questions:**
- "which is better [TOKEN1] or [TOKEN2]?"
- "should I buy [TOKEN1] or [TOKEN2]?"
- "[TOKEN1] or [TOKEN2] which is worth it?"
- "choose between [TOKEN1] and [TOKEN2]"

📊 **Analysis Requests:**
- "difference between [TOKEN1] and [TOKEN2]"
- "[TOKEN1] [TOKEN2] analysis"
- "pros and cons [TOKEN1] vs [TOKEN2]"

🎯 **Multiple Token Mentions:**
- Any message mentioning 2+ different tokens
- "what about [TOKEN1], [TOKEN2], and [TOKEN3]?"
- "analyze [TOKEN1] [TOKEN2] [TOKEN3]"

Input format: comma-separated tokens (e.g., "pepe,doge,shib")`,
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

      const formatData = (data: TokenData) => {
        return `Name: ${data.name}
Chain: ${data.chain}
Price: $${data.price}
Liquidity: $${data.liquidity.toLocaleString()}
24h Volume: $${data.volume24h.toLocaleString()}
FDV: $${data.fdv.toLocaleString()}
Address: ${data.address}`;
      };

      const summaries = tokenDataResults
        .map((data: any) => formatData(data))
        .join("\n\n");

      return summaries;
    } catch (err) {
      console.log(err);
      return "❌ An error occurred while fetching token data. Please try again later.";
    }
  },
});
