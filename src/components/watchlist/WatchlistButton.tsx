import { useWatchlistStore } from '../../store/useWatchlistStore'

interface WatchlistButtonProps {
  symbol: string
  size?: 'sm' | 'md'
  showLabel?: boolean
}

export function WatchlistButton({ symbol, size = 'md', showLabel = false }: WatchlistButtonProps) {
  const isWatched = useWatchlistStore(s => s.symbols.includes(symbol))
  const toggleSymbol = useWatchlistStore(s => s.toggleSymbol)

  const sizeClasses = size === 'sm' ? 'p-1' : 'p-1.5'

  return (
    <button
      onClick={e => { e.stopPropagation(); toggleSymbol(symbol) }}
      className={`${sizeClasses} rounded-md transition-colors ${isWatched ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`}
      title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {isWatched ? (
        <svg className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ) : (
        <svg className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )}
      {showLabel && <span className="ml-1 text-xs">{isWatched ? 'Watched' : 'Watch'}</span>}
    </button>
  )
}
