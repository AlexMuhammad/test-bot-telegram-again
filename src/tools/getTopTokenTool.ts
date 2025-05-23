import { DynamicTool } from "@langchain/core/tools";
import { fethcTop5TokenData } from "../api/coingecko";

export const getTopTokenTool = new DynamicTool({
  name: "getTopTokens",
  description: `🚀 TOP TOKENS FINDER - Use this for market overview queries:

**TRIGGER PATTERNS:**
🔥 **Top/Trending Requests:**
- "top tokens"
- "best tokens"
- "top 5 tokens"
- "trending tokens"
- "popular tokens"
- "hot tokens"

📊 **Market Queries:**
- "market leaders"
- "biggest tokens"
- "top crypto"
- "top cryptocurrencies"
- "leading tokens"

🎯 **Investment Discovery:**
- "what's trending?"
- "what's popular now?"
- "what should I buy?"
- "good tokens to invest"
- "recommended tokens"

📈 **General Market:**
- "show me the market"
- "top performers"
- "market overview"
- "crypto market leaders"

⚡ **USE THIS when user asks about general market or wants token recommendations without specifying names**`,
  func: async () => {
    try {
      const tokens = await fethcTop5TokenData();
      return `📈 Top 5 Tokens by Market Cap:\n${tokens}`;
    } catch (err) {
      return "⚠️ Unable to fetch top tokens data.";
    }
  },
});
