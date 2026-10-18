import './analytics'
import './index.css'
import './libro.css'
import LibroPage from './LibroPage.tsx'
import { mount } from './mount.tsx'
import { languageFromPath } from './site'

mount(<LibroPage language={languageFromPath(window.location.pathname)} />)
