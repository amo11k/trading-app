import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMarketStore } from '../store/useMarketStore'
import { Card, CardTitle } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { formatPrice, formatChangePercent, formatMarketCap, formatVolume, formatRatio } from '../utils/formatters'
import { SECTORS } from '../constants/config'
import type { StockData } from '../utils/types'

export function Screener() {
  const navigate = useNavigate()
  const { stocks, fetchStocks } = useMarketStore()
  const initialized = useRef(false)

  const [filters, setFilters] = useState({
    sector: 'all',
    minPrice: '',
    maxPrice: '',
    minPE: '',
    maxPE: '',
    minMarketCap: '',
    maxMarketCap: '',
    minDividend: '',
    minEPS: '',
  })

  useEffect(() => {
    if (!initialized.current && !stocks.length) {
      initialized.current = true
      fetchStocks()
    }
  }, [fetchStocks, stocks.length])

  const handleChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      sector: 'all',
      minPrice: '',
      maxPrice: '',
      minPE: '',
      maxPE: '',
      minMarketCap: '',
      maxMarketCap: '',
      minDividend: '',
      minEPS: '',
    })
  }

  const results = useMemo(() => {
    let filtered = [...stocks]

    if (filters.sector !== 'all') filtered = filtered.filter(s => s.sector === filters.sector)
    if (filters.minPrice) filtered = filtered.filter(s => s.price >= Number(filters.minPrice))
    if (filters.maxPrice) filtered = filtered.filter(s => s.price <= Number(filters.maxPrice))
    if (filters.minPE) filtered = filtered.filter(s => s.peRatio > 0 && s.peRatio >= Number(filters.minPE))
    if (filters.maxPE) filtered = filtered.filter(s => s.peRatio > 0 && s.peRatio <= Number(filters.maxPE))
    if (filters.minMarketCap) filtered = filtered.filter(s => s.marketCap >= Number(filters.minMarketCap) * 1_000_000_000)
    if (filters.maxMarketCap) filtered = filtered.filter(s => s.marketCap <= Number(filters.maxMarketCap) * 1_000_000_000)
    if (filters.minDividend) filtered = filtered.filter(s => s.dividendYield >= Number(filters.minDividend) / 100)
    if (filters.minEPS) filtered = filtered.filter(s => s.eps >= Number(filters.minEPS))

    return filtered.sort((a, b) => b.marketCap - a.marketCap)
  }, [stocks, filters])

  const sectorOptions = [
    { value: 'all', label: 'All Sectors' },
    ...SECTORS.map(s => ({ value: s, label: s })),
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-bold text-white">Stock Screener</h1>
        <p className="text-xs text-gray-500 mt-1">Filter S&P 500 stocks by custom criteria</p>
      </div>

      <Card>
        <CardTitle>Filter Criteria</CardTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-3">
          <Select
            label="Sector"
            options={sectorOptions}
            value={filters.sector}
            onChange={e => handleChange('sector', e.target.value)}
          />
          <Input label="Min Price" type="number" placeholder="0" value={filters.minPrice} onChange={e => handleChange('minPrice', e.target.value)} />
          <Input label="Max Price" type="number" placeholder="1000" value={filters.maxPrice} onChange={e => handleChange('maxPrice', e.target.value)} />
          <Input label="Min P/E" type="number" placeholder="0" value={filters.minPE} onChange={e => handleChange('minPE', e.target.value)} />
          <Input label="Max P/E" type="number" placeholder="100" value={filters.maxPE} onChange={e => handleChange('maxPE', e.target.value)} />
          <Input label="Min Mkt Cap ($B)" type="number" placeholder="0" value={filters.minMarketCap} onChange={e => handleChange('minMarketCap', e.target.value)} />
          <Input label="Max Mkt Cap ($B)" type="number" placeholder="3000" value={filters.maxMarketCap} onChange={e => handleChange('maxMarketCap', e.target.value)} />
          <Input label="Min Div Yield (%)" type="number" placeholder="0" value={filters.minDividend} onChange={e => handleChange('minDividend', e.target.value)} />
          <Input label="Min EPS" type="number" placeholder="0" value={filters.minEPS} onChange={e => handleChange('minEPS', e.target.value)} />
          <div className="flex items-end">
            <Button variant="ghost" onClick={clearFilters}>Clear Filters</Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Results ({results.length} stocks)</CardTitle>
        </div>

        {results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-market-border">
                  <th className="table-header">Symbol</th>
                  <th className="table-header">Name</th>
                  <th className="table-header text-right">Price</th>
                  <th className="table-header text-right">Change</th>
                  <th className="table-header text-right">Market Cap</th>
                  <th className="table-header text-right hidden md:table-cell">P/E</th>
                  <th className="table-header text-right hidden md:table-cell">EPS</th>
                  <th className="table-header text-right hidden lg:table-cell">Div Yield</th>
                  <th className="table-header hidden lg:table-cell">Sector</th>
                </tr>
              </thead>
              <tbody>
                {results.slice(0, 100).map(stock => (
                  <tr
                    key={stock.symbol}
                    className="border-b border-market-border/50 hover:bg-market-hover cursor-pointer transition-colors"
                    onClick={() => navigate(`/stock/${stock.symbol}`)}
                  >
                    <td className="table-cell font-mono font-semibold text-white">{stock.symbol}</td>
                    <td className="table-cell text-gray-300">{stock.name}</td>
                    <td className={`table-cell text-right font-mono ${stock.change >= 0 ? 'text-market-up' : 'text-market-down'}`}>
                      {formatPrice(stock.price)}
                    </td>
                    <td className="table-cell text-right">
                      <Badge variant={stock.change >= 0 ? 'positive' : 'negative'}>
                        {formatChangePercent(stock.changePercent)}
                      </Badge>
                    </td>
                    <td className="table-cell text-right font-mono text-gray-300">{formatMarketCap(stock.marketCap)}</td>
                    <td className="table-cell text-right font-mono text-gray-300 hidden md:table-cell">{stock.peRatio > 0 ? formatRatio(stock.peRatio) : '—'}</td>
                    <td className="table-cell text-right font-mono text-gray-300 hidden md:table-cell">{stock.eps > 0 ? stock.eps.toFixed(2) : '—'}</td>
                    <td className="table-cell text-right font-mono text-gray-300 hidden lg:table-cell">{stock.dividendYield > 0 ? `${(stock.dividendYield * 100).toFixed(2)}%` : '—'}</td>
                    <td className="table-cell hidden lg:table-cell text-gray-400">{stock.sector.split(' ').slice(0, 2).join(' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {results.length > 100 && (
              <p className="text-center text-xs text-gray-500 py-4">Showing top 100 of {results.length} results</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 py-8 text-center">No stocks match your criteria. Try adjusting the filters.</p>
        )}
      </Card>
    </div>
  )
}
