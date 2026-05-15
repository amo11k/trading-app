import axios from 'axios'
import { API_CONFIG } from '../constants/config'

const apiClient = axios.create({
  baseURL: API_CONFIG.FINNHUB_BASE_URL,
  timeout: 10000,
  params: {
    token: API_CONFIG.API_KEY,
  },
})

const cache = new Map<string, { data: unknown; timestamp: number }>()

export async function fetchWithCache<T>(
  url: string,
  params: Record<string, string | number> = {},
  ttl = API_CONFIG.CACHE_TTL,
): Promise<T> {
  const cacheKey = `${url}?${JSON.stringify(params)}`
  const cached = cache.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data as T
  }

  const response = await apiClient.get<T>(url, { params })
  const result = response.data

  cache.set(cacheKey, { data: result, timestamp: Date.now() })
  return result
}

export function clearCache() {
  cache.clear()
}

export function getCacheSize(): number {
  return cache.size
}

export default apiClient
