import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStore {
  isDark: boolean
  toggle: () => void
  setDark: (dark: boolean) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      isDark: true,

      toggle: () => {
        const newDark = !get().isDark
        document.documentElement.classList.toggle('dark', newDark)
        document.documentElement.classList.toggle('light', !newDark)
        set({ isDark: newDark })
      },

      setDark: (dark: boolean) => {
        document.documentElement.classList.toggle('dark', dark)
        document.documentElement.classList.toggle('light', !dark)
        set({ isDark: dark })
      },
    }),
    {
      name: 'theme-storage',
    },
  ),
)
