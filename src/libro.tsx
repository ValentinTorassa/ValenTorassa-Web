import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './analytics'
import './index.css'
import './libro.css'
import LibroPage from './LibroPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LibroPage />
  </StrictMode>,
)
