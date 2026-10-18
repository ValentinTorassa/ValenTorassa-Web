import './analytics'
import './index.css'
import App from './App.tsx'
import { mount } from './mount.tsx'
import { languageFromPath } from './site'

mount(<App language={languageFromPath(window.location.pathname)} />)
