import type { NewsItem } from '../../utils/types'
import { Card, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Spinner } from '../ui/Spinner'
import { formatDateTime } from '../../utils/formatters'

interface StockNewsProps {
  news: NewsItem[]
  loading?: boolean
}

const sentimentVariant = {
  positive: 'positive' as const,
  negative: 'negative' as const,
  neutral: 'neutral' as const,
}

export function StockNews({ news, loading }: StockNewsProps) {
  if (loading) {
    return (
      <Card>
        <CardTitle>Latest News</CardTitle>
        <Spinner className="py-8" />
      </Card>
    )
  }

  if (!news.length) {
    return (
      <Card>
        <CardTitle>Latest News</CardTitle>
        <p className="text-sm text-gray-500 py-4">No news available</p>
      </Card>
    )
  }

  return (
    <Card>
      <CardTitle>Latest News</CardTitle>
      <div className="space-y-1 mt-2">
        {news.map(item => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-3 rounded-lg hover:bg-market-hover transition-colors group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white group-hover:text-market-accent transition-colors line-clamp-2">
                  {item.headline}
                </p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.summary}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">{item.source}</span>
                  <span className="text-xs text-gray-600">·</span>
                  <span className="text-xs text-gray-500">{formatDateTime(item.datetime)}</span>
                </div>
              </div>
              <Badge variant={sentimentVariant[item.sentiment]}>
                {item.sentiment}
              </Badge>
            </div>
          </a>
        ))}
      </div>
    </Card>
  )
}
