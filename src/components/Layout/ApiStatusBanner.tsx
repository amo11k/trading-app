import { useMarketStore } from '../../store/useMarketStore'

export function ApiStatusBanner() {
  const dataSource = useMarketStore(s => s.dataSource)

  if (dataSource === 'live') return null

  const isMock = dataSource === 'mock'

  return (
    <div className={`px-4 py-1.5 text-xs text-center font-medium ${
      isMock ? 'bg-yellow-900/40 text-yellow-400 border-b border-yellow-700/40' : 'bg-red-900/40 text-red-400 border-b border-red-700/40'
    }`}>
      {isMock ? (
        <>
          <span className="inline-flex items-center gap-1.5">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.23 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Showing mock data — set <code className="px-1 py-0.5 rounded bg-yellow-900/60">VITE_FINNHUB_API_KEY</code> and{' '}
            <code className="px-1 py-0.5 rounded bg-yellow-900/60">VITE_USE_MOCK_DATA=false</code> in .env for live data
          </span>
        </>
      ) : (
        <>
          <span className="inline-flex items-center gap-1.5">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            API rate limit reached or request failed — showing fallback mock data. Data will auto-retry on next refresh.
          </span>
        </>
      )}
    </div>
  )
}
