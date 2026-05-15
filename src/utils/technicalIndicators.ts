export type Candle = { time: number; open: number; high: number; low: number; close: number; volume: number }

export function calcSMA(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = new Array(data.length).fill(null)
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0
    for (let j = 0; j < period; j++) sum += data[i - j]
    result[i] = sum / period
  }
  return result
}

export function calcEMA(data: number[], period: number): number[] {
  const result: number[] = new Array(data.length).fill(0)
  const multiplier = 2 / (period + 1)
  result[0] = data[0]
  for (let i = 1; i < data.length; i++) {
    result[i] = (data[i] - result[i - 1]) * multiplier + result[i - 1]
  }
  return result
}

export function calcRSI(data: number[], period = 14): (number | null)[] {
  const result: (number | null)[] = new Array(data.length).fill(null)
  if (data.length < period + 1) return result

  let gains = 0
  let losses = 0
  for (let i = 1; i <= period; i++) {
    const diff = data[i] - data[i - 1]
    if (diff >= 0) gains += diff
    else losses -= diff
  }

  let avgGain = gains / period
  let avgLoss = losses / period
  result[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss)

  for (let i = period + 1; i < data.length; i++) {
    const diff = data[i] - data[i - 1]
    const gain = diff >= 0 ? diff : 0
    const loss = diff < 0 ? -diff : 0
    avgGain = (avgGain * (period - 1) + gain) / period
    avgLoss = (avgLoss * (period - 1) + loss) / period
    result[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss)
  }

  return result
}

export function calcMACD(data: number[]): { macd: number[]; signal: number[]; histogram: number[] } {
  const ema12 = calcEMA(data, 12)
  const ema26 = calcEMA(data, 26)
  const macd = ema12.map((v, i) => v - ema26[i])
  const signal = calcEMA(macd, 9)
  const histogram = macd.map((v, i) => v - signal[i])
  return { macd, signal, histogram }
}

export function calcBollingerBands(data: number[], period = 20, multiplier = 2) {
  const sma = calcSMA(data, period)
  const upper: (number | null)[] = new Array(data.length).fill(null)
  const lower: (number | null)[] = new Array(data.length).fill(null)

  for (let i = period - 1; i < data.length; i++) {
    const mean = sma[i]!
    let sumSqDiff = 0
    for (let j = 0; j < period; j++) sumSqDiff += (data[i - j] - mean) ** 2
    const stdDev = Math.sqrt(sumSqDiff / period)
    upper[i] = mean + multiplier * stdDev
    lower[i] = mean - multiplier * stdDev
  }

  return { middle: sma, upper, lower }
}

export function getRSISignal(rsi: number | null): 'overbought' | 'oversold' | 'neutral' {
  if (rsi == null) return 'neutral'
  if (rsi >= 70) return 'overbought'
  if (rsi <= 30) return 'oversold'
  return 'neutral'
}
