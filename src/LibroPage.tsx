import { useEffect, useState } from 'react';
import { track } from '@vercel/analytics';
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
import { book, libroByLanguage, samplePdfUrl, sourceTalkHref, waitlistUrl, youtubeChannelUrl } from './libroContent';
import { counterpartPath, localePath } from './site';
import { siteChromeByLanguage, type Language } from './siteContent';
import { SiteFooter, SiteHeader } from './siteChrome';

const coverAvif = `${coverAvif360} 360w, ${coverAvif540} 540w, ${coverAvif720} 720w`;
const coverWebp = `${coverWebp360} 360w, ${coverWebp540} 540w, ${coverWebp720} 720w`;
const coverSizes = '(min-width: 900px) 340px, 200px';

function LibroPage({ language }: { language: Language }) {
  const page = libroByLanguage[language];
  const siteContent = siteChromeByLanguage[language];
  const { contents, sample, waitlist, author } = page;
  // Keep the server render stable, then carry the campaign tag to the external form.
  const [referral, setReferral] = useState<string | null>(null);
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get('ref');
    if (ref && /^[a-zA-Z0-9_-]{1,80}$/.test(ref)) setReferral(ref);
  }, []);
  const formUrl = referral ? `https://vtsecurity.com.ar/libro?ref=${encodeURIComponent(referral)}` : waitlistUrl;
  const languagePath = counterpartPath(localePath(language, '/libro'));
  const languageHref = referral ? `${languagePath}?ref=${encodeURIComponent(referral)}` : languagePath;
  const recordClick = (event: 'book_sample_click' | 'book_waitlist_click', placement: string) => {
    track(event, { ref: referral ?? 'web-libro', language, placement });
  };

  return (
    <div className="site-shell">
      <SiteHeader
        language={language}
        languageHref={languageHref}
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
              <a className="btn btn-primary" href={samplePdfUrl} target="_blank" rel="noopener noreferrer" onClick={() => recordClick('book_sample_click', 'hero')}>
                <BookOpenText aria-hidden="true" />
                {sample.cta}
              </a>
              <a className="btn btn-secondary" href="#lista">
                <Mail aria-hidden="true" />
                {page.waitlistCta}
              </a>
              <a className="btn btn-secondary" href="#indice">
                <BookOpenText aria-hidden="true" />
                {page.contentsCta}
              </a>
            </div>
            <p className="book-sample-meta">{sample.meta}</p>
          </div>

          <figure className="book-cover">
            <picture>
              <source type="image/avif" srcSet={coverAvif} sizes={coverSizes} />
              <source type="image/webp" srcSet={coverWebp} sizes={coverSizes} />
              <img src={coverFallback} alt={page.coverAlt} width={540} height={714} decoding="async" fetchPriority="high" />
            </picture>
          </figure>
        </header>

        <section className="book-section" id="muestra" aria-labelledby="muestra-title">
          <div className="book-card book-sample">
            <a className="book-sample-preview" href={samplePdfUrl} target="_blank" rel="noopener noreferrer" onClick={() => recordClick('book_sample_click', 'preview')} aria-label={sample.previewAlt}>
              <img src="/libro/muestra/page-02.png" alt={sample.previewAlt} width={1440} height={2032} loading="lazy" decoding="async" />
            </a>
            <div className="book-sample-text">
              <span className="eyebrow">{sample.eyebrow}</span>
              <h2 id="muestra-title">{sample.title}</h2>
              <p>{sample.text}</p>
              <a className="btn btn-primary" href={samplePdfUrl} target="_blank" rel="noopener noreferrer" onClick={() => recordClick('book_sample_click', 'sample')}>
                <BookOpenText aria-hidden="true" />
                {sample.cta}
                <ArrowUpRight aria-hidden="true" />
              </a>
              <p className="book-sample-meta">{sample.meta}</p>
              <p className="book-sample-optional">{sample.optional}</p>
            </div>
          </div>
        </section>

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
            <div className="book-waitlist-action">
              {/* The form itself is on vtsecurity.com.ar, with its anti-bot check and per-ref counts. */}
              <a className="btn btn-primary" href={formUrl} target="_blank" rel="noopener noreferrer" onClick={() => recordClick('book_waitlist_click', 'waitlist')}>
                <Mail aria-hidden="true" />
                {waitlist.cta}
                <ArrowUpRight aria-hidden="true" />
              </a>
              <p className="book-waitlist-note">{waitlist.privacy}</p>
            </div>
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
