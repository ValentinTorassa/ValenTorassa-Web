import { MarkImage } from './siteChrome';

/**
 * dist/404.html: Vercel serves it, with status 404, for any URL that has no
 * page. Spanish first with one line in English; plain HTML and CSS, no script.
 */
function NotFoundPage() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="valentorassa - Ir al inicio">
          <MarkImage width={34} height={34} sizes="34px" loading="eager" />
          <span>valentorassa</span>
        </a>
      </header>
      <main className="not-found">
        <span className="eyebrow">// 404</span>
        <h1>Esta página no existe</h1>
        <p>Puede que el enlace tenga un error o que la página se haya movido. Estas sí existen:</p>
        <nav className="not-found-links" aria-label="Páginas del sitio">
          <a className="btn btn-primary" href="/">Inicio</a>
          <a className="btn btn-secondary" href="/charlas">Charlas</a>
          <a className="btn btn-secondary" href="/eventos">Agenda</a>
          <a className="btn btn-secondary" href="/libro">Libro</a>
        </nav>
        <p className="not-found-en" lang="en">
          This page does not exist. <a href="/en/">Go to the English version of the site</a>.
        </p>
      </main>
    </div>
  );
}

export default NotFoundPage;
