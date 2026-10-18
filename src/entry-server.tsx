import { StrictMode, type ReactElement } from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import App from './App';
import CharlasPage from './CharlasPage';
import EventosPage from './EventosPage';
import LibroPage from './LibroPage';
import NotFoundPage from './NotFoundPage';
import SpeakerKitPage from './SpeakerKitPage';
import { todayInArgentina } from './eventSchedule';
import { headHtml, pageHead, routes, routeUrl, type PageKey, type Route } from './seo';
import { localePath, setServerRenderDate } from './site';
import { llmsTxt, sitemapXml } from './siteFiles';
import { socialImages } from './socialImages';
import { talkPages } from './talkSeo';

/**
 * Build-time renderer (vite.config.ts runs it after the client build): the HTML
 * of every page in both languages, plus the 404 page, sitemap and llms.txt.
 */
export { llmsTxt, routes, sitemapXml, socialImages, talkPages, todayInArgentina };
export type { PageKey, Route };

/** The client build's HTML entry each page is rendered into. */
const templates: Record<PageKey, string> = {
  home: 'index.html',
  charlas: 'charlas.html',
  talk: 'charlas.html',
  eventos: 'eventos.html',
  libro: 'libro.html',
  'speaker-kit': 'speaker-kit.html',
};

function page(route: Route): ReactElement {
  const { language } = route;
  switch (route.page) {
    case 'home':
      return <App language={language} />;
    case 'charlas':
    case 'talk':
      return <CharlasPage language={language} talkId={route.talkId} />;
    case 'eventos':
      return <EventosPage language={language} />;
    case 'libro':
      return <LibroPage language={language} />;
    case 'speaker-kit':
      return <SpeakerKitPage language={language} />;
  }
}

/** `/` -> index.html, `/en/` -> en/index.html, `/en/charlas` -> en/charlas.html (cleanUrls serves it at /en/charlas). */
export function outputFile(route: Route) {
  const path = localePath(route.language, route.path).slice(1);
  return path === '' || path.endsWith('/') ? `${path}index.html` : `${path}.html`;
}

export function renderRoute(route: Route, today: string) {
  setServerRenderDate(today);
  return {
    url: routeUrl(route),
    file: outputFile(route),
    template: templates[route.page],
    lang: route.language,
    head: headHtml(pageHead(route, today)),
    html: renderToString(<StrictMode>{page(route)}</StrictMode>),
  };
}

export function renderNotFound() {
  return renderToStaticMarkup(<NotFoundPage />);
}
