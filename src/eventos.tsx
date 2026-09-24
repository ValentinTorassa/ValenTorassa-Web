import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import EventosPage from './EventosPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EventosPage />
  </StrictMode>,
)
