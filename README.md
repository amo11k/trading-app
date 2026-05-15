# S&P 500 Market Dashboard

A production-grade React application for visualizing S&P 500 stock market data. Built with modern web technologies and featuring a premium dark-themed financial terminal UI.

## Features

### Dashboard
- Complete S&P 500 table with virtualized rendering (500+ rows)
- Instant search by symbol, name, or sector
- Filters by sector, performance (gainers/losers), page size
- Sort by any column (ascending/descending)
- Sparkline charts for each stock
- CSV export of visible data
- Auto-refresh every 30 seconds

### Stock Detail
- Complete company information
- Interactive price charts with 6 timeframes (1D, 1W, 1M, 3M, 1Y, 5Y)
- Key financial metrics (P/E, EPS, market cap, volume, 52W range, etc.)
- Technical indicators (SMA, RSI, MACD, Bollinger Bands)
- Related news feed with sentiment analysis

### Market Overview
- Advance/decline ratio
- Market sentiment indicator
- Top gainers, losers, and most active stocks
- Sector performance heatmap
- Sector market cap distribution chart

### Extra Tools
- **Watchlist** — Save favorites with localStorage persistence
- **Stock Screener** — Filter by price, P/E, market cap, dividend yield, EPS, sector
- **Stock Comparison** — Side-by-side metrics and price chart comparison

### UI/UX
- Dark theme by default (light/dark toggle)
- Glass-morphism header with sticky navigation
- Skeleton loaders for all loading states
- Smooth animations and transitions
- Fully responsive (mobile, tablet, desktop)
- Financial terminal aesthetic inspired by Bloomberg/TradingView

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 8** | Build tool |
| **TypeScript** | Type safety |
| **TailwindCSS 3** | Styling |
| **Zustand** | State management (with localStorage persistence) |
| **React Router 7** | Client-side routing |
| **Recharts** | Charts and sparklines |
| **Axios** | HTTP client |
| **@tanstack/react-virtual** | Table virtualization |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`.

### Build for Production

```bash
npm run build
npm run preview
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Finnhub API Key (free at https://finnhub.io/register)
VITE_FINNHUB_API_KEY=your_api_key_here

# Use mock data when API is unavailable
VITE_USE_MOCK_DATA=true

# Data refresh interval in seconds
VITE_REFRESH_INTERVAL=30
```

> **Note:** The app works fully with mock data out of the box. No API key required to explore all features.

## API

The app uses [Finnhub](https://finnhub.io/) as the primary data source:

- **Quote** — Real-time stock prices
- **Company Profile** — Company information and metrics
- **Candles** — Historical price data
- **News** — Company-specific news

When `VITE_USE_MOCK_DATA=true` or the API is rate-limited, the app seamlessly falls back to realistic generated data.

## Project Structure

```
src/
├── api/              # API services (Finnhub, mock data)
├── components/
│   ├── charts/       # Recharts wrappers
│   ├── dashboard/    # Market overview widgets
│   ├── Layout/       # Header and layout shell
│   ├── stock/        # Stock table, detail, comparison
│   ├── ui/           # Reusable UI primitives
│   └── watchlist/    # Watchlist components
├── constants/        # S&P 500 list, config
├── hooks/            # Custom React hooks
├── pages/            # Route page components
├── store/            # Zustand stores
├── utils/            # Formatters, CSV export, technical indicators
├── App.tsx           # Router setup
├── main.tsx          # Entry point
└── index.css         # Tailwind + global styles
```

## License

MIT
