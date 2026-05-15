import { useMemo } from 'react'
import type { CandleData } from '../../utils/types'
import { Card, CardTitle } from '../ui/Card'
import { calcSMA, calcRSI, calcMACD, calcBollingerBands, getRSISignal } from '../../utils/technicalIndicators'
import { Badge } from '../ui/Badge'

interface TechnicalIndicatorsProps {
  candles: CandleData[]
}

export function TechnicalIndicators({ candles }: TechnicalIndicatorsProps) {
  const indicators = useMemo(() => {
    if (candles.length < 30) return null

    const closes = candles.map(c => c.close)
    const currentPrice = closes[closes.length - 1]
    const sma20 = calcSMA(closes, 20)
    const sma50 = calcSMA(closes, 50)
    const rsi = calcRSI(closes, 14)
    const macd = calcMACD(closes)
    const bb = calcBollingerBands(closes)

    const currentSMA20 = sma20[sma20.length - 1]
    const currentSMA50 = sma50[sma50.length - 1]
    const currentRSI = rsi[rsi.length - 1]
    const currentBBUpper = bb.upper[bb.upper.length - 1]
    const currentBBLower = bb.lower[bb.lower.length - 1]
    const currentMACD = macd.macd[macd.macd.length - 1]
    const currentSignal = macd.signal[macd.signal.length - 1]

    return {
      sma20: currentSMA20,
      sma50: currentSMA50,
      rsi: currentRSI,
      bbUpper: currentBBUpper,
      bbLower: currentBBLower,
      macd: currentMACD,
      signal: currentSignal,
      macdSignal: currentMACD != null && currentSignal != null
        ? (currentMACD > currentSignal ? 'Bullish' : 'Bearish')
        : 'N/A',
      priceVsSMA20: currentSMA20 != null
        ? (currentPrice >= currentSMA20 ? 'Above' : 'Below')
        : 'N/A',
      rsiSignal: getRSISignal(currentRSI),
    }
  }, [candles])

  if (!indicators) {
    return (
      <Card>
        <CardTitle>Technical Indicators</CardTitle>
        <p className="text-sm text-gray-500 py-4">Insufficient data for analysis</p>
      </Card>
    )
  }

  const signalBadge = (signal: string) => {
    switch (signal) {
      case 'Bullish': return <Badge variant="positive">{signal}</Badge>
      case 'Bearish': return <Badge variant="negative">{signal}</Badge>
      case 'overbought': return <Badge variant="warning">Overbought</Badge>
      case 'oversold': return <Badge variant="positive">Oversold</Badge>
      default: return <Badge variant="neutral">{signal}</Badge>
    }
  }

  return (
    <Card>
      <CardTitle>Technical Indicators</CardTitle>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
        <div>
          <span className="text-xs text-gray-500">RSI (14)</span>
          <p className="text-sm font-mono text-white mt-0.5">{indicators.rsi?.toFixed(1) ?? '—'}</p>
          {signalBadge(indicators.rsiSignal)}
        </div>
        <div>
          <span className="text-xs text-gray-500">SMA (20)</span>
          <p className="text-sm font-mono text-white mt-0.5">{indicators.sma20?.toFixed(2) ?? '—'}</p>
          <Badge variant={indicators.priceVsSMA20 === 'Above' ? 'positive' : 'negative'}>{indicators.priceVsSMA20}</Badge>
        </div>
        <div>
          <span className="text-xs text-gray-500">SMA (50)</span>
          <p className="text-sm font-mono text-white mt-0.5">{indicators.sma50?.toFixed(2) ?? '—'}</p>
        </div>
        <div>
          <span className="text-xs text-gray-500">BB Upper</span>
          <p className="text-sm font-mono text-white mt-0.5">{indicators.bbUpper?.toFixed(2) ?? '—'}</p>
        </div>
        <div>
          <span className="text-xs text-gray-500">BB Lower</span>
          <p className="text-sm font-mono text-white mt-0.5">{indicators.bbLower?.toFixed(2) ?? '—'}</p>
        </div>
        <div>
          <span className="text-xs text-gray-500">MACD Signal</span>
          <p className="text-sm font-mono text-white mt-0.5">{indicators.macdSignal}</p>
          {signalBadge(indicators.macdSignal)}
        </div>
      </div>
    </Card>
  )
}
