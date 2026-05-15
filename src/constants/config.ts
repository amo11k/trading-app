export const API_CONFIG = {
  FINNHUB_BASE_URL: 'https://finnhub.io/api/v1',
  API_KEY: import.meta.env.VITE_FINNHUB_API_KEY || '',
  USE_MOCK: import.meta.env.VITE_USE_MOCK_DATA === 'true' || !import.meta.env.VITE_FINNHUB_API_KEY,
  REFRESH_INTERVAL: Number(import.meta.env.VITE_REFRESH_INTERVAL) || 30,
  CACHE_TTL: 60_000,
} as const

export const MARKET_CONFIG = {
  DEFAULT_PAGE_SIZE: 50,
  DEBOUNCE_MS: 300,
  CACHE_TTL: 60_000,
  SPARKLINE_PERIODS: 24,
}

export const CHART_TIMEFRAMES = [
  { label: '1D', days: 1, resolution: '5' },
  { label: '1W', days: 7, resolution: '30' },
  { label: '1M', days: 30, resolution: '60' },
  { label: '3M', days: 90, resolution: 'D' },
  { label: '1Y', days: 365, resolution: 'D' },
  { label: '5Y', days: 1825, resolution: 'W' },
] as const

export const SECTORS = [
  'Information Technology',
  'Health Care',
  'Financials',
  'Consumer Discretionary',
  'Communication Services',
  'Industrials',
  'Consumer Staples',
  'Energy',
  'Utilities',
  'Real Estate',
  'Materials',
] as const
