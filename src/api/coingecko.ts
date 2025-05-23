import axios from "axios";

export const fetchTokenDataBySymbol = async (symbol: string) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets`,
      {
        params: { vs_currency: "usd", symbol: symbol.toLowerCase() },
      }
    );
    const coin = response.data[0];

    return {
      name: coin.name,
      price: coin.current_price || 0,
      volume24h: coin.total_volume || 0,
      fdv: coin.fully_diluted_valuation || 0,
      transactions24h: coin.high_24h + coin.low_24h || 0,
      symbol: coin.symbol,
    };
  } catch (error) {
    console.log("Error fetching token");
  }
};

export const fethcTop5TokenData = async () => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets`,
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 5,
          page: 1,
        },
      }
    );
    return response.data.map((coin: any) => ({
      name: coin.name,
      price: coin.current_price || 0,
      volume24h: coin.total_volume || 0,
      fdv: coin.fully_diluted_valuation || 0,
      transactions24h: coin.high_24h + coin.low_24h || 0,
      symbol: coin.symbol,
    }));
  } catch (error) {
    console.log("Error fetching top tokens from CoinGecko");
  }
};
