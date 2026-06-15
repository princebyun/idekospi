# Real-Time Stock API Design Spec

## Objective
Provide real-time, accurate, and free stock information for both US and Korean markets in the `idekospi` project without requiring complex API key management.

## Architecture & Data Flow

We will implement a hybrid data fetching strategy in the Express server (`server/index.ts`).

### 1. Routing Logic
The system will dynamically route requests based on the stock symbol suffix:
- **Korean Stocks (ends with `.KS` or `.KQ`)**: Route to the Naver Finance Mobile API.
- **US / Other Stocks**: Route to the existing `yahoo-finance2` API.

### 2. Endpoints Modified
- `GET /api/stocks`: Modifies the loop over `symbols` to check each symbol and fetch from the appropriate source.
- `GET /api/stock/details`: Modifies the detail fetching logic to branch between Naver and Yahoo.

### 3. Naver Finance API Integration
- **Endpoint**: `GET https://m.stock.naver.com/api/stock/{code}/basic`
- **Data Extracted**:
  - `closePrice`: Current price (needs string comma removal and float parsing).
  - `fluctuationsRatio`: Daily change percentage.
  - `openPrice`, `highPrice`, `lowPrice`, `accumulatedTradingVolume`, `marketSum` (market cap).

### 4. Data Normalization
The Naver API response will be mapped to strictly match the existing frontend expectations.
- The `marketState` for Korean stocks will be hardcoded to `REGULAR` or `CLOSED` based on standard KST hours (09:00 - 15:30) if easily computable, otherwise default to `REGULAR`.
- Historical returns (1W, 1M, 1Y, 5Y) will continue to use Yahoo Finance `historical` data for historical closing prices. However, the calculation will use the **real-time Naver price** as the `currentPrice` base to calculate the exact return rate.

### 5. Error Handling (Resilience)
- **Fallback Mechanism**: All Naver API calls will be wrapped in a `try-catch`. If the fetch fails, parsing fails, or the endpoint structure changes, the system will catch the error, log a warning, and automatically fallback to using `yahoo-finance2`. This guarantees the app remains functional (with a 15-minute delay) rather than breaking.

## Future Considerations
- If Naver changes their API, the fallback will trigger, and the developer will need to inspect the logs to update the `naverRes.json()` parsing logic.
