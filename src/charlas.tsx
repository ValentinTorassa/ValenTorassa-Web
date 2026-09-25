import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './charlas.css'
import CharlasPage from './CharlasPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CharlasPage />
  </StrictMode>,
)
