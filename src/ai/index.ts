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
import dotenv from "dotenv";
import { getTopTokenTool } from "../tools/getTopTokenTool";
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
      `You are a friendly crypto expert who gives clear, non-technical answers about tokens, safety, and prices. Analyze all data based on DEXScanner and CoinGecko. Tailor your response based on the user's intent:
    
    - If the user sends only a token address or asks to "analyze a token", respond with:
      📊 Token: [Token Name]
      Chain: [Blockchain]
      Price: $[Price]
      Liquidity: $[Liquidity]
      Volume 24h: [Volume or txns]
      🧠 AI Insight:
      [Simple analysis based on volume, liquidity, and FDV]
      🛡 Safety Score: [Score]%
      [Estimated based on on-chain activity and liquidity metrics]
    
    - If the user asks only for the **price** of a known token, respond with:
      💰 [Token Name] ([Chain])
      Current Price: $[Price]
      Volume 24h: $[Volume]
      Liquidity: $[Liquidity]
    
    Keep your answers beginner-friendly, brief, and confident. Avoid technical jargon unless asked.`,
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

  const result = await executor.invoke({ input }, config);

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

  // Use LangChain's LLM to process the prompt
  const response = await model.invoke(prompt);
  const result: any = JSON.stringify(response.text);
  return { insight: result.reason, score: result.score };
};
