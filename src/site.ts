import { useEffect, useState } from 'react';
import type { Language } from './siteContent';
import { todayInArgentina } from './eventSchedule';

export const SITE_ORIGIN = 'https://valentorassa.com';

/**
 * Spanish lives at the root and English under /en/, with the same slugs. The
 * path alone decides the language: no ?lang, saved choice or browser setting
 * changes the content, so every URL has one version for people and crawlers.
 */
export function languageFromPath(pathname: string): Language {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es';
}

/**
 * A site path in the given language: `/charlas` -> `/en/charlas`, `/` -> `/en/`,
 * `/#profile` -> `/en/#profile`. Anchors, files under /charlas/<id>/ (the
 * Spanish decks), external URLs and mailto: links stay as they are.
 */
export function localePath(language: Language, path: string): string {
  if (language === 'es' || !path.startsWith('/') || path.startsWith('//')) return path;
  if (/^\/charlas\/[^/]+\/./.test(path) || /\.[a-z0-9]+$/i.test(path.split(/[?#]/)[0])) return path;
  return `/en${path}`;
}

/** The same page in the other language, without the /en prefix or with it. */
export function counterpartPath(pathname: string): string {
  if (languageFromPath(pathname) === 'en') {
    const rest = pathname.slice('/en'.length);
    return rest === '' ? '/' : rest;
  }
  return pathname === '/' ? '/en/' : `/en${pathname}`;
}

/** Absolute URL of a site path in a language, as used by canonical, hreflang and the sitemap. */
export const absoluteUrl = (language: Language, path: string) => `${SITE_ORIGIN}${localePath(language, path)}`;

export function setMetaContent(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content);
}

/**
 * The day the static HTML was rendered on (Argentina time). The build writes it
 * on <html data-rendered-on>, so the first client render shows the same talks as
 * the HTML and hydrates cleanly; the real date takes over right after.
 */
let serverRenderDate: string | undefined;

export function setServerRenderDate(date: string) {
  serverRenderDate = date;
}

function renderDate(): string {
  if (typeof document === 'undefined') return serverRenderDate ?? todayInArgentina();
  return document.documentElement.dataset.renderedOn || todayInArgentina();
}

/** Today in Argentina, starting from the render date until the page is live. */
export function useToday(): string {
  const [today, setToday] = useState(renderDate);
  useEffect(() => {
    setToday(todayInArgentina());
  }, []);
  return today;
}
