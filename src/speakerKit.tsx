import './analytics'
import './index.css'
import './speakerKit.css'
import SpeakerKitPage from './SpeakerKitPage.tsx'
import { mount } from './mount.tsx'
import { languageFromPath } from './site'

mount(<SpeakerKitPage language={languageFromPath(window.location.pathname)} />)
