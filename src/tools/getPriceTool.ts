import { DynamicTool } from "@langchain/core/tools";
import { fetchDexscreenerData } from "../api/dexscanner";

export const getPriceTool = new DynamicTool({
  name: "getCryptoPrice",
  description:
    'Get current price of a crypto token. Input is token name like "pepe"',
  func: async (token: string) => {
    const price = await fetchDexscreenerData(token);
    return `The price of ${token.toUpperCase()} is $${price}`;
  },
});
