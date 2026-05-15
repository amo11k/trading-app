import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStockDetailStore } from '../store/useStockDetailStore'
import { CompanyHeader } from '../components/stock/CompanyHeader'
import { StockChart } from '../components/stock/StockChart'
import { StockMetrics } from '../components/stock/StockMetrics'
import { StockNews } from '../components/stock/StockNews'
import { TechnicalIndicators } from '../components/stock/TechnicalIndicators'
import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { Button } from '../components/ui/Button'

export function StockDetail() {
  const { symbol } = useParams<{ symbol: string }>()
  const navigate = useNavigate()
  const { stock, candles, news, loading, error, fetchDetail, reset, newsLoading } = useStockDetailStore()

  useEffect(() => {
    if (symbol) {
      fetchDetail(symbol.toUpperCase())
    }
    return () => reset()
  }, [symbol, fetchDetail, reset])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-gray-500">Loading {symbol} data...</p>
        </div>
      </div>
    )
  }

  if (error || !stock) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Stock not found'}</p>
          <Button variant="primary" onClick={() => navigate('/')}>Back to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Button>

      <CompanyHeader stock={stock} />
      <StockChart />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <StockMetrics stock={stock} />
          <TechnicalIndicators candles={candles} />
        </div>
        <div className="space-y-6">
          <StockNews news={news} loading={newsLoading} />
        </div>
      </div>
    </div>
  )
}
