import { useEffect, useRef, useCallback, useState } from 'react'
import { API_CONFIG } from '../constants/config'

export interface TradeData {
  symbol: string
  price: number
  volume: number
  timestamp: number
}

let wsInstance: WebSocket | null = null
let wsSubscriptions = new Set<string>()
let wsCallback: ((trade: TradeData) => void) | null = null
let wsReconnectTimer: ReturnType<typeof setTimeout> | null = null
let wsConnected = false
let wsError: string | null = null
const listeners = new Set<() => void>()

function notifyListeners() {
  listeners.forEach(fn => fn())
}

function connect() {
  if (!API_CONFIG.API_KEY || API_CONFIG.USE_MOCK) return

  const url = `wss://ws.finnhub.io?token=${API_CONFIG.API_KEY}`

  try {
    const ws = new WebSocket(url)

    ws.onopen = () => {
      wsConnected = true
      wsError = null
      wsSubscriptions.forEach(sym => {
        ws.send(JSON.stringify({ type: 'subscribe', symbol: sym }))
      })
      notifyListeners()
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.type === 'trade' && msg.data && wsCallback) {
          for (const trade of msg.data) {
            wsCallback({
              symbol: trade.s,
              price: trade.p,
              volume: trade.v,
              timestamp: Math.floor(Date.now() / 1000),
            })
          }
        }
      } catch { }
    }

    ws.onerror = () => {
      wsError = 'WebSocket connection error'
      notifyListeners()
    }

    ws.onclose = () => {
      wsConnected = false
      wsInstance = null
      notifyListeners()
      scheduleReconnect()
    }

    wsInstance = ws
  } catch {
    wsError = 'Failed to create WebSocket'
    notifyListeners()
    scheduleReconnect()
  }
}

function scheduleReconnect() {
  if (wsReconnectTimer) return
  wsReconnectTimer = setTimeout(() => {
    wsReconnectTimer = null
    if (wsSubscriptions.size > 0) {
      connect()
    }
  }, 5000)
}

function subscribe(symbols: string[]) {
  const added = symbols.filter(s => !wsSubscriptions.has(s))
  for (const sym of added) {
    wsSubscriptions.add(sym)
  }

  if (wsInstance && wsInstance.readyState === WebSocket.OPEN && added.length > 0) {
    for (const sym of added) {
      wsInstance.send(JSON.stringify({ type: 'subscribe', symbol: sym }))
    }
  }

  if (wsSubscriptions.size > 0 && !wsInstance) {
    connect()
  }
}

function unsubscribe(symbols: string[]) {
  for (const sym of symbols) {
    wsSubscriptions.delete(sym)
  }

  if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
    for (const sym of symbols) {
      wsInstance.send(JSON.stringify({ type: 'unsubscribe', symbol: sym }))
    }
  }

  if (wsSubscriptions.size === 0 && wsInstance) {
    wsInstance.close()
    wsInstance = null
    wsConnected = false
    notifyListeners()
  }
}

export function useWebSocket(onTrade: (trade: TradeData) => void): {
  connected: boolean
  error: string | null
  subscribe: (symbols: string[]) => void
  unsubscribe: (symbols: string[]) => void
} {
  const [state, setState] = useState({ connected: wsConnected, error: wsError })

  useEffect(() => {
    wsCallback = onTrade
    const listener = () => setState({ connected: wsConnected, error: wsError })
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
      wsCallback = null
    }
  }, [onTrade])

  return {
    connected: state.connected,
    error: state.error,
    subscribe,
    unsubscribe,
  }
}
