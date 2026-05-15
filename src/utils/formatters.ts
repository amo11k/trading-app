export function formatPrice(price: number): string {
  if (price == null || isNaN(price)) return '—'
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (price >= 1) return price.toFixed(2)
  if (price >= 0.01) return price.toFixed(4)
  return price.toFixed(6)
}

export function formatChange(change: number): string {
  if (change == null || isNaN(change)) return '—'
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(2)}`
}

export function formatChangePercent(percent: number): string {
  if (percent == null || isNaN(percent)) return '—'
  const sign = percent >= 0 ? '+' : ''
  return `${sign}${percent.toFixed(2)}%`
}

export function formatVolume(volume: number): string {
  if (volume == null || isNaN(volume)) return '—'
  if (volume >= 1_000_000_000) return `${(volume / 1_000_000_000).toFixed(2)}B`
  if (volume >= 1_000_000) return `${(volume / 1_000_000).toFixed(2)}M`
  if (volume >= 1_000) return `${(volume / 1_000).toFixed(1)}K`
  return volume.toString()
}

export function formatMarketCap(marketCap: number): string {
  if (marketCap == null || isNaN(marketCap)) return '—'
  if (marketCap >= 1_000_000_000_000) return `$${(marketCap / 1_000_000_000_000).toFixed(2)}T`
  if (marketCap >= 1_000_000_000) return `$${(marketCap / 1_000_000_000).toFixed(2)}B`
  if (marketCap >= 1_000_000) return `$${(marketCap / 1_000_000).toFixed(2)}M`
  return `$${marketCap.toLocaleString()}`
}

export function formatLargeNumber(num: number): string {
  if (num == null || isNaN(num)) return '—'
  if (num >= 1_000_000_000_000) return `${(num / 1_000_000_000_000).toFixed(2)}T`
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toFixed(2)
}

export function formatRatio(ratio: number): string {
  if (ratio == null || isNaN(ratio)) return '—'
  return ratio.toFixed(2)
}

export function formatPercent(percent: number): string {
  if (percent == null || isNaN(percent)) return '—'
  return `${percent.toFixed(2)}%`
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatDateTime(timestamp: number): string {
  if (!timestamp) return '—'
  const date = new Date(timestamp * 1000)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatTime(timestamp: number): string {
  if (!timestamp) return '—'
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export function formatNumber(num: number, decimals = 2): string {
  if (num == null || isNaN(num)) return '—'
  return num.toFixed(decimals)
}

export function getChangeClass(change: number): string {
  if (change > 0) return 'text-market-up'
  if (change < 0) return 'text-market-down'
  return 'text-market-neutral'
}

export function getChangeSign(change: number): string {
  if (change > 0) return '+'
  if (change < 0) return ''
  return ''
}
