import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { StockData } from '../../utils/types'
import { formatPrice, formatChange, formatChangePercent, formatVolume, formatMarketCap, formatRatio, formatNumber } from '../../utils/formatters'
import { SparklineChart } from '../charts/SparklineChart'
import { Badge } from '../ui/Badge'
import { useWatchlistStore } from '../../store/useWatchlistStore'

interface StockRowProps {
  stock: StockData
}

export const StockRow = memo(function StockRow({ stock }: StockRowProps) {
  const navigate = useNavigate()
  const isWatched = useWatchlistStore(s => s.symbols.includes(stock.symbol))
  const toggleSymbol = useWatchlistStore(s => s.toggleSymbol)

  const isPositive = stock.change >= 0
  const changeColor = isPositive ? 'text-market-up' : 'text-market-down'
  const bgClass = stock.changePercent > 3 ? 'bg-green-900/5' : stock.changePercent < -3 ? 'bg-red-900/5' : ''

  return (
    <div
      className={`grid grid-cols-[2fr_1fr_1fr_1.5fr_1.5fr_1fr_1fr_1fr_1.5fr] gap-2 px-3 py-2.5 items-center ${bgClass} hover:bg-market-hover transition-colors cursor-pointer border-b border-market-border/50 group`}
      onClick={() => navigate(`/stock/${stock.symbol}`)}
    >
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={e => { e.stopPropagation(); toggleSymbol(stock.symbol) }}
          className="shrink-0 text-gray-500 hover:text-yellow-400 transition-colors"
        >
          {isWatched ? (
            <svg className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
        </button>
        <div>
          <span className="text-sm font-semibold text-white font-mono">{stock.symbol}</span>
          <span className="text-xs text-gray-500 ml-2 hidden md:inline truncate">{stock.name}</span>
        </div>
      </div>

      <span className={`text-sm font-mono text-right ${changeColor} font-medium`}>
        {formatPrice(stock.price)}
      </span>

      <div className="text-right">
        <span className={`text-xs font-mono ${changeColor}`}>{formatChange(stock.change)}</span>
      </div>

      <div className="text-right">
        <Badge variant={isPositive ? 'positive' : 'negative'}>
          {formatChangePercent(stock.changePercent)}
        </Badge>
      </div>

      <span className="text-xs text-gray-300 font-mono text-right hidden sm:block">
        {formatMarketCap(stock.marketCap)}
      </span>

      <span className="text-xs text-gray-300 font-mono text-right hidden md:block">
        {formatVolume(stock.volume)}
      </span>

      <span className="text-xs text-gray-300 font-mono text-right hidden lg:block">
        {stock.peRatio > 0 ? formatRatio(stock.peRatio) : '—'}
      </span>

      <span className="text-xs text-gray-300 font-mono text-right hidden lg:block">
        {stock.eps > 0 ? formatNumber(stock.eps) : '—'}
      </span>

      <div className="flex justify-end hidden xl:block">
        <SparklineChart
          data={stock.sparkline}
          positive={isPositive}
          width={72}
          height={28}
        />
      </div>
    </div>
  )
})
