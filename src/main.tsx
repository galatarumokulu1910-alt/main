import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'

// Automatically reload once if a new Vercel deployment invalidates lazy-loaded chunk hashes
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()
  const key = 'galata_chunk_reload'
  const lastReload = Number(sessionStorage.getItem(key) || '0')
  if (Date.now() - lastReload > 10000) {
    sessionStorage.setItem(key, String(Date.now()))
    window.location.reload()
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
