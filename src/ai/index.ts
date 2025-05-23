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

const userMemoryMap = new Map<string, ChatMessageHistory>();

const model = new ChatGoogleGenerativeAI({
  apiKey: "AIzaSyDE1oH4fOzS0znbw78nmoFc31iuwF3a9l0",
  model: "gemini-1.5-flash",
  temperature: 0.7,
});

const tools = [
  getPriceTool,
  getTokenInfoTool,
  getDexScannerTool,
  compareTokenTool,
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
      "You are a friendly crypto expert who gives clear, non-technical answers about tokens, safety, and prices.",
    ],
    ["placeholder", "{chat_history}"],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
  ]);

  const agent = createToolCallingAgent({
    llm: model,
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
