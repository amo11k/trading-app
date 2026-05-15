import { useRef, useMemo, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useMarketStore } from '../../store/useMarketStore'
import { StockRow } from './StockRow'
import { StockFilters } from './StockFilters'
import { SkeletonTableRow } from '../ui/Skeleton'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { exportStocksToCSV } from '../../utils/csvExport'
import type { SortKey } from '../../utils/types'

const COLUMNS: { key: SortKey; label: string; hide?: string }[] = [
  { key: 'symbol', label: 'Symbol' },
  { key: 'price', label: 'Price' },
  { key: 'changePercent', label: 'Change' },
  { key: 'changePercent', label: 'Change %' },
  { key: 'marketCap', label: 'Market Cap', hide: 'sm' },
  { key: 'volume', label: 'Volume', hide: 'md' },
  { key: 'peRatio', label: 'P/E', hide: 'lg' },
  { key: 'eps', label: 'EPS', hide: 'lg' },
  { key: 'symbol', label: 'Chart', hide: 'xl' },
]

export function StockTable() {
  const parentRef = useRef<HTMLDivElement>(null)
  const { filteredStocks, filter, setSortBy, loading, stocks, fetchStocks, lastUpdated } = useMarketStore()

  const data = useMemo(() => filteredStocks, [filteredStocks])

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 44,
    overscan: 15,
  })

  const handleExport = useCallback(() => {
    exportStocksToCSV(data, `sp500-${new Date().toISOString().split('T')[0]}.csv`)
  }, [data])

  if (loading && !stocks.length) {
    return (
      <Card>
        <div className="space-y-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonTableRow key={i} cols={9} />
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-0 overflow-hidden">
      <StockFilters onExport={handleExport} />

      <div className="px-3 py-2 flex items-center justify-between text-xs text-gray-500 border-b border-market-border">
        <span>{data.length} of {stocks.length} stocks</span>
        {lastUpdated && (
          <span>Updated {new Date(lastUpdated).toLocaleTimeString()}</span>
        )}
      </div>

      <div className="overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr_1.5fr_1fr_1fr_1fr_1.5fr] gap-2 px-3 border-b border-market-border bg-market-surface/50">
          {COLUMNS.map(col => (
            <button
              key={`${col.key}-${col.label}`}
              onClick={() => setSortBy(col.key)}
              className={`table-header flex items-center gap-1 ${col.hide ? `hidden ${col.hide}:flex` : ''}`}
            >
              {col.label}
              {filter.sortBy === col.key && (
                <svg className={`w-3 h-3 transition-transform ${filter.sortOrder === 'asc' ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              )}
            </button>
          ))}
        </div>

        <div ref={parentRef} className="overflow-auto" style={{ height: 'calc(100vh - 380px)', minHeight: 400 }}>
          <div style={{ height: `${virtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
            {virtualizer.getVirtualItems().map(virtualItem => (
              <div
                key={virtualItem.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <StockRow stock={data[virtualItem.index]} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
