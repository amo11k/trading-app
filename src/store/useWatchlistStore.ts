import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT_SYMBOLS = ['AAPL', 'MSFT', 'JNJ', 'KO', 'JPM']

interface WatchlistStore {
  symbols: string[]
  addSymbol: (symbol: string) => void
  removeSymbol: (symbol: string) => void
  toggleSymbol: (symbol: string) => void
  isWatched: (symbol: string) => boolean
  clearAll: () => void
  hasBeenInitialized: boolean
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      symbols: DEFAULT_SYMBOLS,
      hasBeenInitialized: true,

      addSymbol: (symbol: string) => {
        set(state => ({
          symbols: state.symbols.includes(symbol) ? state.symbols : [...state.symbols, symbol],
        }))
      },

      removeSymbol: (symbol: string) => {
        set(state => ({
          symbols: state.symbols.filter(s => s !== symbol),
        }))
      },

      toggleSymbol: (symbol: string) => {
        const { symbols } = get()
        if (symbols.includes(symbol)) {
          set({ symbols: symbols.filter(s => s !== symbol) })
        } else {
          set({ symbols: [...symbols, symbol] })
        }
      },

      isWatched: (symbol: string) => {
        return get().symbols.includes(symbol)
      },

      clearAll: () => {
        set({ symbols: [] })
      },
    }),
    {
      name: 'watchlist-storage',
    },
  ),
)
