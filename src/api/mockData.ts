import type { StockData, CandleData, NewsItem } from '../utils/types'
import { SP500_LIST } from '../constants/sp500'

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function getSeed(symbol: string): number {
  let hash = 0
  for (let i = 0; i < symbol.length; i++) {
    hash = ((hash << 5) - hash) + symbol.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash + 1)
}

const BASE_PRICES: Record<string, number> = {
  AAPL: 225, MSFT: 445, NVDA: 880, GOOGL: 175, META: 510, AMZN: 200,
  TSLA: 245, JPM: 205, V: 285, MA: 470, HD: 370, PG: 170, KO: 65, PEP: 180,
  UNH: 570, JNJ: 160, WMT: 170, COST: 730, XOM: 115, CVX: 155,
  LIN: 450, NEE: 65, ABBV: 180, MRK: 125, TMO: 570, AVGO: 800,
  CRM: 280, ORCL: 135, ACN: 350, ADBE: 530, CSCO: 50, INTC: 42, AMD: 155,
  QCOM: 170, TXN: 185, DIS: 110, NFLX: 650, CMCSA: 42, BA: 200,
  CAT: 340, GE: 165, HON: 210, UPS: 155, RTX: 105, LMT: 450,
}

function getBasePrice(symbol: string): number {
  if (BASE_PRICES[symbol]) return BASE_PRICES[symbol]
  const rand = seededRandom(getSeed(symbol))
  return 30 + rand() * 400
}

export function generateMockStockData(symbol: string): StockData {
  const info = SP500_LIST.find(c => c.symbol === symbol)
  const seed = getSeed(symbol)
  const rand = seededRandom(seed)
  const todayRand = seededRandom(Math.floor(Date.now() / 60000) + seed)

  const basePrice = getBasePrice(symbol)
  const volatility = 0.005 + rand() * 0.025
  const changePercent = (todayRand() - 0.5) * 2 * volatility * 100
  const change = basePrice * (changePercent / 100)
  const price = basePrice + change

  const marketCapBase = 1_000_000_000 + rand() * 3_000_000_000_000
  const marketCap = marketCapBase + change * 100_000_000

  const peRatio = 10 + rand() * 40
  const eps = price / peRatio
  const volume = 500_000 + rand() * 50_000_000
  const avgVolume = volume * (0.7 + rand() * 0.6)

  const dayRange = price * 0.02 * todayRand()

  const yearHigh = basePrice * (1.05 + rand() * 0.25)
  const yearLow = basePrice * (0.75 + rand() * 0.2)

  const sparkline: number[] = []
  let sparkPrice = price * (1 - volatility)
  for (let i = 0; i < 24; i++) {
    sparkPrice *= 1 + (todayRand() - 0.5) * volatility * 2
    sparkline.push(sparkPrice)
  }

  return {
    symbol,
    name: info?.name || symbol,
    sector: info?.sector || 'N/A',
    industry: info?.industry || 'N/A',
    price,
    change,
    changePercent,
    marketCap,
    volume,
    avgVolume,
    peRatio: Math.max(0, peRatio),
    eps,
    dayHigh: price + dayRange / 2,
    dayLow: price - dayRange / 2,
    open: price - change * 0.3,
    previousClose: price - change,
    yearHigh,
    yearLow,
    dividendYield: rand() * 0.04,
    dividendPerShare: eps * (0.2 + rand() * 0.5),
    beta: 0.5 + rand() * 1.5,
    sharesOutstanding: marketCap / price,
    sparkline,
    timestamp: Math.floor(Date.now() / 1000),
  }
}

export function generateMockCandles(
  symbol: string,
  from: number,
  to: number,
  _resolution: string,
): CandleData[] {
  const seed = getSeed(symbol)
  const rand = seededRandom(seed)
  const candles: CandleData[] = []

  const basePrice = getBasePrice(symbol)
  const volatility = 0.005 + rand() * 0.015
  const intervalSeconds = 86400
  let currentTime = from
  let price = basePrice * (0.9 + rand() * 0.2)

  while (currentTime <= to) {
    const change = (rand() - 0.5) * volatility * price
    const open = price
    const close = price + change
    const high = Math.max(open, close) * (1 + rand() * volatility)
    const low = Math.min(open, close) * (1 - rand() * volatility)
    const volume = Math.floor(500000 + rand() * 10000000)

    candles.push({
      time: currentTime,
      open,
      high,
      low,
      close,
      volume,
    })

    price = close
    currentTime += intervalSeconds
  }

  return candles
}

const NEWS_TEMPLATES = [
  { headline: '{symbol} Reports Strong Q{quarter} Earnings, Beats Estimates', sentiment: 'positive' as const },
  { headline: '{symbol} Announces New {product} Launch, Shares Rise', sentiment: 'positive' as const },
  { headline: '{symbol} Faces Regulatory Scrutiny Over {issue}', sentiment: 'negative' as const },
  { headline: 'Analysts Upgrade {symbol} on Growth Prospects', sentiment: 'positive' as const },
  { headline: '{symbol} Stock Drops on {concern} Concerns', sentiment: 'negative' as const },
  { headline: '{symbol} Announces Strategic Partnership with {partner}', sentiment: 'positive' as const },
  { headline: '{symbol} to Acquire {target} in ${value}B Deal', sentiment: 'neutral' as const },
  { headline: '{symbol} Dividend Yield Attracts Income Investors', sentiment: 'positive' as const },
  { headline: '{symbol} CEO Discusses Growth Strategy at Conference', sentiment: 'neutral' as const },
  { headline: '{symbol} Shares volatile amid {industry} Industry Shifts', sentiment: 'neutral' as const },
]

const PRODUCTS = ['AI Platform', 'Cloud Service', 'Next-Gen Chip', 'EV Line', 'Software Suite', 'IoT Solutions']
const ISSUES = ['Data Privacy', 'Antitrust', 'Supply Chain', 'Labor', 'Tariff', 'Compliance']
const PARTNERS = ['Microsoft', 'Google', 'Amazon', 'Meta', 'Tesla', 'Salesforce', 'Oracle', 'IBM']
const TARGETS = ['Startup AI', 'Data Analytics Firm', 'Cloud Company', 'Health Tech', 'Fintech']
const INDUSTRIES = ['Tech', 'Healthcare', 'Energy', 'Financial', 'Consumer', 'Industrial']

const PRODUCTS_FOR_SECTOR: Record<string, string[]> = {
  'Information Technology': ['AI Platform', 'Cloud Service', 'Next-Gen Chip', 'Software Suite', 'Cybersecurity Tool'],
  'Health Care': ['Drug Candidate', 'Medical Device', 'Diagnostic Tool', 'Gene Therapy', 'Vaccine'],
  'Financials': ['Digital Banking Platform', 'Payment App', 'Trading Platform', 'Wealth Management Tool'],
  'Consumer Discretionary': ['Retail Platform', 'EV Model', 'Restaurant Chain', 'Fashion Line', 'Subscription Service'],
  'Communication Services': ['Streaming Service', 'Social Platform', 'Gaming Title', 'Ad Platform', 'Content Studio'],
  'Industrials': ['Factory Automation', 'Logistics Network', 'Sustainable Product', 'Aviation Tech'],
  'Energy': ['Renewable Project', 'Drilling Tech', 'Carbon Capture', 'Hydrogen Fuel'],
  'Consumer Staples': ['Sustainable Packaging', 'Organic Line', 'Beverage Innovation', 'Smart Home Product'],
  'Utilities': ['Solar Farm', 'Grid Modernization', 'Smart Meter', 'Storage Solution'],
  'Real Estate': ['Smart Building Platform', 'PropTech Tool', 'REIT Restructuring', 'Sustainable Development'],
  'Materials': ['Recycled Material', 'Sustainable Chemical', 'Lightweight Alloy', 'Green Packaging'],
}

export function generateMockNews(symbol: string): NewsItem[] {
  const seed = getSeed(symbol)
  const rand = seededRandom(seed)
  const company = SP500_LIST.find(c => c.symbol === symbol)
  const sector = company?.sector || 'Technology'
  const products = PRODUCTS_FOR_SECTOR[sector] || PRODUCTS

  const items: NewsItem[] = []
  const now = Date.now()
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4']

  for (let i = 0; i < 8; i++) {
    const template = NEWS_TEMPLATES[Math.floor(rand() * NEWS_TEMPLATES.length)]
    const hoursAgo = i * (4 + rand() * 12)

    const headline = template.headline
      .replace('{symbol}', symbol)
      .replace('{quarter}', quarters[Math.floor(rand() * 4)])
      .replace('{product}', products[Math.floor(rand() * products.length)])
      .replace('{issue}', ISSUES[Math.floor(rand() * ISSUES.length)])
      .replace('{partner}', PARTNERS[Math.floor(rand() * PARTNERS.length)])
      .replace('{target}', TARGETS[Math.floor(rand() * TARGETS.length)])
      .replace('{value}', (rand() * 10 + 1).toFixed(1))
      .replace('{industry}', INDUSTRIES[Math.floor(rand() * INDUSTRIES.length)])
      .replace('{concern}', ISSUES[Math.floor(rand() * ISSUES.length)])

    items.push({
      id: seed * 100 + i,
      headline,
      summary: `${symbol} continues to make strategic moves in the ${sector.toLowerCase()} sector. Market analysts are closely watching developments as the company executes its growth strategy. Investors remain focused on key financial metrics and guidance.`,
      source: ['Bloomberg', 'Reuters', 'CNBC', 'Financial Times', 'MarketWatch'][Math.floor(rand() * 5)],
      url: '#',
      datetime: Math.floor((now - hoursAgo * 3600000) / 1000),
      image: '',
      sentiment: template.sentiment,
      related: symbol,
    })
  }

  return items
}

export function generateRandomizedQuote(symbol: string): StockData {
  return generateMockStockData(symbol)
}
