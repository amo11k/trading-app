import type { StockData } from './types'

export function exportStocksToCSV(stocks: StockData[], filename = 'sp500-data.csv'): void {
  if (!stocks.length) return

  const headers = [
    'Symbol',
    'Name',
    'Price',
    'Change',
    'Change %',
    'Market Cap',
    'Volume',
    'P/E Ratio',
    'EPS',
    'Day High',
    'Day Low',
    '52W High',
    '52W Low',
    'Sector',
    'Industry',
    'Dividend Yield',
  ]

  const rows = stocks.map(stock => [
    stock.symbol,
    `"${stock.name.replace(/"/g, '""')}"`,
    stock.price,
    stock.change,
    stock.changePercent,
    stock.marketCap,
    stock.volume,
    stock.peRatio,
    stock.eps,
    stock.dayHigh,
    stock.dayLow,
    stock.yearHigh,
    stock.yearLow,
    `"${stock.sector}"`,
    `"${stock.industry}"`,
    stock.dividendYield,
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n')

  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
