import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './analytics'
import './index.css'
import './speakerKit.css'
import SpeakerKitPage from './SpeakerKitPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SpeakerKitPage />
  </StrictMode>,
)
