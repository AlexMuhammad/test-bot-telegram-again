import { DynamicTool } from "@langchain/core/tools";
import { fethcTop5TokenData } from "../api/coingecko";

export const cryptoAdviceTool = new DynamicTool({
  name: "cryptoAdvice",
  description: `Provide crypto investment guidance. Use this for general crypto questions:
  - Investment advice: "what should I invest in?", "good crypto to buy?", "investment recommendations"
  - Market guidance: "what's a good buy?", "which crypto is promising?", "investment tips"
  - Risk assessment: "what's safe to invest?", "low risk crypto", "beginner friendly tokens"
  - General crypto: "crypto advice", "help me invest", "what do you recommend?"
  Input: user's investment question or criteria`,
  func: async (query: string) => {
    try {
      // Get top tokens for reference
      const topTokens = await fethcTop5TokenData();

      return `🚀 Crypto Investment Guidance:

Based on current market data:
${topTokens}

💡 General Investment Tips:
- Always do your own research (DYOR)
- Only invest what you can afford to lose
- Diversify your portfolio
- Consider market cap, liquidity, and volume
- Check token fundamentals and use cases

⚠️ Important: This is not financial advice. Cryptocurrency investments are high-risk and volatile. Consider consulting with a financial advisor.

Would you like me to analyze any specific tokens for you?`;
    } catch (err) {
      return "⚠️ Unable to provide investment guidance at this time.";
    }
  },
});
