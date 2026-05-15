import { useEffect, useRef } from 'react'
import { API_CONFIG } from '../constants/config'

export function useAutoRefresh(callback: () => void, intervalSeconds = API_CONFIG.REFRESH_INTERVAL, enabled = true) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (!enabled) return

    const interval = setInterval(() => {
      savedCallback.current()
    }, intervalSeconds * 1000)

    return () => clearInterval(interval)
  }, [intervalSeconds, enabled])
}
