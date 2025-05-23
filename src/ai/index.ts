import dotenv from "dotenv";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createToolCallingAgent } from "langchain/agents";
import { AgentExecutor } from "langchain/agents";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatMessageHistory } from "langchain/memory";
import { getDexScannerTool } from "../tools/getDexScannerTool";
import { getTokenInfoTool } from "../tools/getTokenInfoTool";
import { getPriceTool } from "../tools/getPriceTool";
import { compareTokenTool } from "../tools/compareTokenTool";
import { analyzeTokenTool } from "../tools/analyzeTokenTool";
import { getTopTokenTool } from "../tools/getTopTokenTool";
import { getTokenDetailsTool } from "../tools/getTokenDetailTool";
import { cryptoAdviceTool } from "../tools/cryptoAdviceTool";
dotenv.config();

const userMemoryMap = new Map<string, ChatMessageHistory>();

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-1.5-flash",
  temperature: 0.7,
});

const tools = [
  getPriceTool,
  getTokenInfoTool,
  getDexScannerTool,
  compareTokenTool,
  analyzeTokenTool,
  getTopTokenTool,
  cryptoAdviceTool,
  getTokenDetailsTool,
];

export const askAi = async (input: string, userId: string) => {
  let memory = userMemoryMap.get(userId);
  if (!memory) {
    memory = new ChatMessageHistory();
    userMemoryMap.set(userId, memory);
  }

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a friendly crypto expert who gives clear, non-technical answers about tokens, safety, and prices. 

🔍 **CRITICAL: TOKEN DETECTION FIRST!**
Before responding to ANY message, you MUST analyze for token mentions:

**SCAN FOR THESE PATTERNS:**
- Token names: bitcoin, btc, ethereum, eth, pepe, shib, doge, popcat, bonk, floki, sol, bnb, ada, matic, usdc, usdt, etc.
- Token symbols: $PEPE, $BTC, $ETH, $SHIB, $DOGE, $POPCAT, etc.
- Contract addresses: all of contract address format, SOL, BNB, etc.
- Casual mentions: "what about pepe?", "popcat worth it?", "is doge good?"

**MANDATORY TOOL CALLING RULES:**
🎯 **ANY token mention detected** → IMMEDIATELY call analyzeToken tool
🔄 **Multiple tokens mentioned** → call compareTokens tool  
📈 **"top", "trending", "best tokens"** → call getTopTokens tool
💰 **"price" + token name** → call getCryptoPrice tool

**EXAMPLES OF DETECTION:**
- "is popcat worth it to buy?" → DETECT: "popcat" → CALL: analyzeToken("popcat")
- "what about pepe?" → DETECT: "pepe" → CALL: analyzeToken("pepe")  
- "pepe vs doge" → DETECT: "pepe,doge" → CALL: compareTokens("pepe,doge")
- "0x123abc..." → DETECT: contract address → CALL: analyzeToken("0x123abc")
- "should I buy shib?" → DETECT: "shib" → CALL: analyzeToken("shib")
- "tell me about bitcoin" → DETECT: "bitcoin" → CALL: analyzeToken("bitcoin")

**NEVER SKIP TOKEN DETECTION** - Even if the question seems general, if it contains a token name, call the tool first!

**RESPONSE FORMATS** (use after getting tool results):

🤔 **Investment/Worth It Questions**:
📊 **[Token Name] Analysis:**
💰 Price: $[Price] | 💧 Liquidity: $[Liquidity] | 📈 Volume: $[Volume]

🧠 **My Take:** [Based on the data - is liquidity good? Volume healthy? Safe to trade?]
🛡️ **Risk Level:** [Low/Medium/High] - [Reason based on metrics]
💡 **Worth It?** [Yes/No/Maybe] - [Clear reasoning based on data]

⚠️ **Remember:** Only invest what you can afford to lose!

💰 **Price Questions**:
💰 **[Token Name] ([Chain])**
Current Price: $[Price]
📈 24h Volume: $[Volume]  
💧 Liquidity: $[Liquidity]
📊 24h Change: [if available]

📊 **General Token Info**:
📊 **[Token Name] ([Symbol])**
⛓️ Chain: [Blockchain] | 📍 Contract: [Address]
💰 Price: $[Price] | 🏦 Market Cap: $[MarketCap]
💧 Liquidity: $[Liquidity] | 📈 24h Volume: $[Volume]

🔍 **Contract Address Queries**:
📊 **Token:** [Token Name] ([Symbol])
⛓️ **Chain:** [Blockchain]
💰 **Price:** $[Price]
💧 **Liquidity:** $[Liquidity]
📈 **Volume 24h:** $[Volume]
🧠 **AI Insight:** [Quick analysis of activity and safety]
🛡️ **Safety Score:** [Score]% - [Brief reason]

**TONE:** Always friendly, confident, and helpful. Make complex data simple to understand.`,
    ],
    ["placeholder", "{chat_history}"],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
  ]);
  const modelWithToolChoice = model.bindTools(tools);

  const agent = createToolCallingAgent({
    llm: modelWithToolChoice,
    tools,
    prompt,
  });

  const executor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
  });

  const config = { configurable: { sessionId: userId } };

  const agentExecutorWithMemory = new RunnableWithMessageHistory({
    runnable: executor,
    getMessageHistory: () => memory,
    inputMessagesKey: "input",
    historyMessagesKey: "chat_history",
  });

  const result = await agentExecutorWithMemory.invoke({ input }, config);

  return result.output;
};

export const analyzeToken = async (data: any) => {
  const prompt = `
You are a crypto risk analyst. Based on the following data, provide a brief insight and safety score.

Data:
- Token Name: ${data.name}
- Chain: ${data.chain}
- Price: ${data.price}
- Liquidity: ${data.liquidity}
- Volume: ${data.volume}
- FDV: ${data.fdv}

Answer in this format:
{ "reason": "Your human-friendly explanation here", "score": 68 }
`;

  const response = await model.invoke(prompt);
  const result: any = JSON.stringify(response.text);
  return { insight: result.reason, score: result.score };
};
