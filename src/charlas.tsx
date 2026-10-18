import './analytics'
import './index.css'
import './charlas.css'
import CharlasPage from './CharlasPage.tsx'
import { mount } from './mount.tsx'
import { languageFromPath } from './site'

// /charlas/<id> and /en/charlas/<id> are the same page with that talk selected.
const talkPath = /^(?:\/en)?\/charlas\/([^/]+)\/?$/.exec(window.location.pathname)

mount(
  <CharlasPage
    language={languageFromPath(window.location.pathname)}
    talkId={talkPath ? decodeURIComponent(talkPath[1]) : undefined}
  />,
)
