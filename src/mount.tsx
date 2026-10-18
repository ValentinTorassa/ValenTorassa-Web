import { StrictMode, type ReactNode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

/**
 * Starts a page: hydrates the HTML the build rendered (dist/), or renders from
 * scratch when there is none (`vite dev`).
 */
export function mount(page: ReactNode) {
  dropLanguageParam();
  const root = document.getElementById('root')!;
  const tree = <StrictMode>{page}</StrictMode>;
  if (root.firstElementChild) hydrateRoot(root, tree);
  else createRoot(root).render(tree);
}

/**
 * Old links carry ?lang=es|en. The path decides the language now (Vercel sends
 * ?lang=en to /en/...), so the address drops the parameter instead of keeping a
 * second URL for the same page.
 */
function dropLanguageParam() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has('lang')) return;
  url.searchParams.delete('lang');
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
}
