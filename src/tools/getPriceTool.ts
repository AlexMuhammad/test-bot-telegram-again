import { DynamicTool } from "@langchain/core/tools";
import { fetchDexscreenerData } from "../api/dexscanner";
import { TokenData } from "../types";

export const getPriceTool = new DynamicTool({
  name: "getCryptoPrice",
  description: `Get the current price of a crypto token. Use this tool when the user specifically asks for a price (e.g., "What's the price of pepe?" or "pepe price"). Input is token name.`,
  func: async (token: string) => {
    const data: TokenData = await fetchDexscreenerData(token);
    return data;
  },
});
