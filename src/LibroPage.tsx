import { ArrowRight, ArrowUpRight, BookOpenText, Mail } from 'lucide-react';
import coverFallback from './assets/libro-cover-540.jpg';
import coverAvif360 from './assets/libro-cover-360.avif';
import coverAvif540 from './assets/libro-cover-540.avif';
import coverAvif720 from './assets/libro-cover-720.avif';
import coverWebp360 from './assets/libro-cover-360.webp';
import coverWebp540 from './assets/libro-cover-540.webp';
import coverWebp720 from './assets/libro-cover-720.webp';
// Same photo as Wikimedia Commons "Valentin Torassa Colombero.jpg" (CC0), cropped to the face.
import portraitFallback from './assets/author-commons-264.jpg';
import portraitAvif176 from './assets/author-commons-176.avif';
import portraitAvif264 from './assets/author-commons-264.avif';
import portraitWebp176 from './assets/author-commons-176.webp';
import portraitWebp264 from './assets/author-commons-264.webp';
import { book, libroByLanguage, sourceTalkHref, waitlistForm, youtubeChannelUrl } from './libroContent';
import { counterpartPath, localePath } from './site';
import { siteChromeByLanguage, type Language } from './siteContent';
import { SiteFooter, SiteHeader } from './siteChrome';

const coverAvif = `${coverAvif360} 360w, ${coverAvif540} 540w, ${coverAvif720} 720w`;
const coverWebp = `${coverWebp360} 360w, ${coverWebp540} 540w, ${coverWebp720} 720w`;
const coverSizes = '(min-width: 900px) 340px, 200px';

function LibroPage({ language }: { language: Language }) {
  const page = libroByLanguage[language];
  const siteContent = siteChromeByLanguage[language];
  const { contents, waitlist, author } = page;

  return (
    <div className="site-shell">
      <SiteHeader
        language={language}
        languageHref={counterpartPath(localePath(language, '/libro'))}
        labels={siteContent.header}
        navItems={page.navItems}
        brandHref={localePath(language, '/')}
        meta={siteContent.footer}
      />

      <main className="book-page">
        <header className="book-hero" id="top">
          <div className="book-hero-text">
            <span className="eyebrow">{page.eyebrow}</span>
            <h1 lang="es">{book.title}</h1>
            <p className="book-subtitle" lang="es">{book.subtitle}</p>
            {page.languageNote ? <p className="book-language-note">{page.languageNote}</p> : null}
            <div className="book-lead">
              {page.lead.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="book-hero-actions">
              <a className="btn btn-primary" href="#lista">
                <Mail aria-hidden="true" />
                {page.waitlistCta}
              </a>
              <a className="btn btn-secondary" href="#indice">
                <BookOpenText aria-hidden="true" />
                {page.contentsCta}
              </a>
            </div>
          </div>

          <figure className="book-cover">
            <picture>
              <source type="image/avif" srcSet={coverAvif} sizes={coverSizes} />
              <source type="image/webp" srcSet={coverWebp} sizes={coverSizes} />
              <img src={coverFallback} alt={page.coverAlt} width={540} height={714} decoding="async" fetchPriority="high" />
            </picture>
          </figure>
        </header>

        <section className="book-section" id="contenido" aria-labelledby="contenido-title">
          <h2 id="contenido-title">{page.features.title}</h2>
          <ol className="book-features">
            {page.features.items.map((item, index) => (
              <li key={item} className="book-card">
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="book-section" id="indice" aria-labelledby="indice-title">
          <div className="book-section-head">
            <h2 id="indice-title">{contents.title}</h2>
            <span className="book-badge">{contents.badge}</span>
          </div>
          {contents.note ? <p className="book-section-note">{contents.note}</p> : null}
          <div className="book-card book-toc">
            <p className="book-toc-edge">
              <span>{contents.prologue.label}</span>
              {contents.prologue.title}
            </p>
            <div className="book-toc-parts">
              {contents.parts.map((part) => (
                <div key={part.label} className="book-toc-part">
                  <h3>{part.label}</h3>
                  <ol>
                    {part.chapters.map((chapter) => (
                      <li key={chapter.number} value={chapter.number}>
                        <span aria-hidden="true">{chapter.number}</span>
                        {chapter.title}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
            <p className="book-toc-edge">
              <span>{contents.epilogue.label}</span>
              {contents.epilogue.title}
            </p>
          </div>
        </section>

        <section className="book-section book-audience" id="para-quien" aria-labelledby="para-quien-title">
          <h2 id="para-quien-title">{page.audience.title}</h2>
          <p>{page.audience.text}</p>
        </section>

        <section className="book-section" id="lista" aria-labelledby="lista-title">
          <div className="book-card book-waitlist">
            <div className="book-waitlist-text">
              <h2 id="lista-title">{waitlist.title}</h2>
              <p>{waitlist.text}</p>
            </div>
            <form className="book-form" method="post" action={waitlistForm.action} aria-labelledby="lista-title">
              {/* listmonk's embed form: an empty honeypot and the list UUID. */}
              <input type="hidden" name="nonce" />
              <input type="hidden" name="l" value={waitlistForm.listUuid} />
              <label className="book-field">
                <span>{waitlist.email}</span>
                <input type="email" name="email" required autoComplete="email" inputMode="email" spellCheck={false} />
              </label>
              <label className="book-field">
                <span>{waitlist.name}</span>
                <input type="text" name="name" autoComplete="name" />
              </label>
              <button type="submit" className="btn btn-primary">
                <Mail aria-hidden="true" />
                {waitlist.submit}
              </button>
              <p className="book-form-note">{waitlist.privacy}</p>
            </form>
          </div>
        </section>

        <section className="book-section" id="autor" aria-labelledby="autor-title">
          <div className="book-card book-author">
            <picture>
              <source type="image/avif" srcSet={`${portraitAvif176} 2x, ${portraitAvif264} 3x`} />
              <source type="image/webp" srcSet={`${portraitWebp176} 2x, ${portraitWebp264} 3x`} />
              <img src={portraitFallback} alt="" width={88} height={88} loading="lazy" decoding="async" />
            </picture>
            <h2 id="autor-title">{author.title}</h2>
            <div className="book-author-body">
              <p>{author.text}</p>
              <div className="book-author-links">
                <a href={localePath(language, sourceTalkHref)}>
                  {author.talkLink}
                  <ArrowRight aria-hidden="true" />
                </a>
                <a href={youtubeChannelUrl} target="_blank" rel="noopener noreferrer">
                  {author.channelLink}
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter backToTopLabel={siteContent.footer.backToTopLabel} />
    </div>
  );
}

export default LibroPage;
