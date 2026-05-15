import { useMarketStore } from '../../store/useMarketStore'

export function ApiStatusBanner() {
  const dataSource = useMarketStore(s => s.dataSource)
  const liveCount = useMarketStore(s => s.liveCount)
  const totalStocks = useMarketStore(s => s.stocks.length)
  const apiConfigured = !!import.meta.env.VITE_FINNHUB_API_KEY && import.meta.env.VITE_USE_MOCK_DATA !== 'true'

  if (dataSource === 'live' && liveCount === totalStocks && totalStocks > 0) return null

  const pct = totalStocks > 0 ? Math.round((liveCount / totalStocks) * 100) : 0

  if (!apiConfigured) {
    return (
      <div className="px-4 py-1.5 text-xs text-center font-medium bg-yellow-900/40 text-yellow-400 border-b border-yellow-700/40">
        <span className="inline-flex items-center gap-1.5">
          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.23 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Showing mock data — set <code className="px-1 py-0.5 rounded bg-yellow-900/60">VITE_FINNHUB_API_KEY</code> and{' '}
          <code className="px-1 py-0.5 rounded bg-yellow-900/60">VITE_USE_MOCK_DATA=false</code> in .env for live data
        </span>
      </div>
    )
  }

  if (liveCount < totalStocks) {
    return (
      <div className="px-4 py-1.5 text-xs text-center font-medium bg-blue-900/40 text-blue-400 border-b border-blue-700/40">
        <span className="inline-flex items-center gap-1.5">
          <svg className="w-3 h-3 shrink-0 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Loading live data... {liveCount} / {totalStocks} stocks updated ({pct}%)
          <span className="text-blue-500"> · 55 req/min to stay under Finnhub free tier limit</span>
        </span>
      </div>
    )
  }

  return null
}
