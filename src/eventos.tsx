import './analytics'
import './index.css'
import EventosPage from './EventosPage.tsx'
import { mount } from './mount.tsx'
import { languageFromPath } from './site'

mount(<EventosPage language={languageFromPath(window.location.pathname)} />)
