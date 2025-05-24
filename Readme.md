# Telegram Token AI Assistant

A Telegram bot that provides cryptocurrency token information, price data, and AI-powered safety analysis.

## Features

- 🔍 **Token Lookup**: Get detailed information about any cryptocurrency token by symbol or contract address
- 💰 **Price Tracking**: Check current prices, market cap, and 24h volume
- 🧠 **AI Analysis**: Get AI-powered safety analysis and risk assessment for tokens
- 🔄 **Natural Language Processing**: Simply chat with the bot in natural language
- 📊 **Data Caching**: Efficient caching system to reduce API calls and improve response times
- 📝 **Query Logging**: All queries are logged for analysis and improvement

## Tech Stack

- **Backend**: Node.js with TypeScript
- **Framework**: Fastify
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Google's Gemini 1.5 Flash via LangChain
- **Bot Framework**: grammY
- **APIs**: DexScreener, CoinGecko
- **Caching**: Node-Cache

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Telegram Bot Token (from BotFather)
- Google Gemini API Key

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AlexMuhammad/test-bot-telegram-again.git
   cd telegram-token-assistant
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

4. Fill in the required environment variables in `.env`:

   ```
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   GEMINI_API_KEY=your_gemini_api_key
   DATABASE_URL=postgresql://username:password@localhost:5432/dbname
   PORT=3000
   ```

5. Set up the database:

   ```bash
   npx prisma migrate dev --name init
   ```

6. Build the project:
   ```bash
   npm run build
   ```

## Running the Bot

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

## Bot Commands

- `/start` - Start the bot and get a welcome message
- `/help` - Get help and list of available commands

## API Endpoints

- `GET /` - Get list Data
- `GET /?input=whatisdefi` - Get data by input column
- `GET /?chatId=123123` - Get data by chatId column

## LangChain Prompt Structure

The bot uses LangChain with Google's Gemini model for AI-powered features:

```typescript
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
```

## Database Schema

### QueryLog Table

Stores all user queries and bot responses.

```prisma
model QueryLog {
  id        Int      @id @default(autoincrement())
  chatId    Int
  input     String
  response  String
  createdAt DateTime @default(now())
}
```

## Caching Strategy

The bot uses a two-level caching strategy:

1. **In-memory cache**: Fast access for frequently requested tokens
2. **Database cache**: Persistent storage for historical queries

## Docker Deployment

This project can be easily deployed using Docker and Docker Compose.

### Prerequisites

- Docker and Docker Compose installed on your system
- Telegram Bot Token (from BotFather)
- Google Gemini API Key

### Deployment Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/AlexMuhammad/test-bot-telegram-again.git
   cd telegram-token-ai-assistant
   ```

2. Create a `.env` file with your environment variables:

   ```
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   GEMINI_API_KEY=your_gemini_api_key
   DATABASE_URL = postgresql://postgres:postgres@postgres:5432/telegram_bot
   PORT=3000
   ```

3. Build and start the containers:

   ```bash
   docker compose up -d
   ```

4. The application will be available at http://localhost:3000
   - The PostgreSQL database will be available at localhost:5432
   - pgAdmin will be available at http://localhost:5050

### Docker Compose Services

The Docker Compose configuration includes the following services:

1. **app**: The main application container running the Telegram bot
2. **postgres**: PostgreSQL database for storing bot data

### Container Management

- **View logs**:

  ```bash
  docker compose logs -f app
  ```

- **Restart the application**:

  ```bash
  docker compose restart app
  ```

- **Stop all services**:

  ```bash
  docker compose down
  ```

- **Stop and remove volumes (will delete all data)**:
  ```bash
  docker compose down -v
  ```
