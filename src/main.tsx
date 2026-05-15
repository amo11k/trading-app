import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useThemeStore } from './store/useThemeStore'
import App from './App'
import './index.css'

const root = document.getElementById('root')!

useThemeStore.getState().setDark(true)

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
