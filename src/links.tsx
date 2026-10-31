import './analytics'
import './links.css'
import LinksPage from './LinksPage.tsx'
import { mount } from './mount.tsx'
import { languageFromPath } from './site'

mount(<LinksPage language={languageFromPath(window.location.pathname)} />)
