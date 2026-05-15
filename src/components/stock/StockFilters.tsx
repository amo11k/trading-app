import { useCallback } from 'react'
import { useMarketStore } from '../../store/useMarketStore'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { SECTORS } from '../../constants/config'

interface StockFiltersProps {
  onExport: () => void
}

export function StockFilters({ onExport }: StockFiltersProps) {
  const { filter, setSector, setPerformance, setPageSize, fetchStocks } = useMarketStore()

  const handleRefresh = useCallback(() => {
    fetchStocks()
  }, [fetchStocks])

  const sectorOptions = [
    { value: 'all', label: 'All Sectors' },
    ...SECTORS.map(s => ({ value: s, label: s })),
  ]

  const performanceOptions = [
    { value: 'all', label: 'All' },
    { value: 'gainers', label: 'Gainers' },
    { value: 'losers', label: 'Losers' },
  ]

  const pageSizeOptions = [
    { value: '25', label: '25' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
    { value: '250', label: '250' },
  ]

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-market-border">
      <div className="w-40">
        <Select
          options={sectorOptions}
          value={filter.sector}
          onChange={e => setSector(e.target.value)}
        />
      </div>

      <div className="w-28">
        <Select
          options={performanceOptions}
          value={filter.performance}
          onChange={e => setPerformance(e.target.value as 'all' | 'gainers' | 'losers')}
        />
      </div>

      <div className="w-20">
        <Select
          options={pageSizeOptions}
          value={String(filter.pageSize)}
          onChange={e => setPageSize(Number(e.target.value))}
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" size="sm" onClick={handleRefresh}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </Button>
        <Button variant="ghost" size="sm" onClick={onExport}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </Button>
      </div>
    </div>
  )
}
