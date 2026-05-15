import { useEffect, useRef } from 'react'
import { useMarketStore } from '../store/useMarketStore'
import { StockComparison } from '../components/stock/StockComparison'

export function Comparison() {
  const { fetchStocks, stocks } = useMarketStore()
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current && !stocks.length) {
      initialized.current = true
      fetchStocks()
    }
  }, [fetchStocks, stocks.length])

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-bold text-white">Stock Comparison</h1>
        <p className="text-xs text-gray-500 mt-1">Compare performance and metrics between two stocks</p>
      </div>
      <StockComparison />
    </div>
  )
}
