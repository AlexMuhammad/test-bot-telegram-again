import { DynamicTool } from "@langchain/core/tools";
import { fetchDexscreenerDataByAddress } from "../api/dexscanner";
import { TokenData } from "../types";

export const getDexScannerTool = new DynamicTool({
  name: "getDexTokenFullData",
  description: `Get comprehensive DexScreener data by contract address. Use this tool when the user provides a contract address (0x...) and wants detailed on-chain metrics.`,
  func: async (address: string) => {
    const data: TokenData | any = await fetchDexscreenerDataByAddress(address);
    return `Token: ${data.name}\nChain: ${data.chain}\nPrice: $${data.price}\nLiquidity: $${data.liquidity}\nVolume 24h: ${data.volume24h}\nFDV: ${data.fdv}`;
  },
});
