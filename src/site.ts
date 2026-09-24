import type { Language } from './content';

/**
 * Language for every page: `?lang=es|en` wins, then the choice saved by the
 * toggle (shared by all pages through localStorage), then the browser.
 */
export function getInitialLanguage(): Language {
  const requestedLanguage = new URLSearchParams(window.location.search).get('lang');

  if (requestedLanguage === 'es' || requestedLanguage === 'en') {
    return requestedLanguage;
  }

  const savedLanguage = window.localStorage.getItem('vt-language');

  if (savedLanguage === 'es' || savedLanguage === 'en') {
    return savedLanguage;
  }

  return window.navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function setMetaContent(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content);
}
