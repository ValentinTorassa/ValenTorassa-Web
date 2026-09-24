import { useEffect, useState } from 'react';
import { Clock3 } from 'lucide-react';
import { contentByLanguage, eventsPageByLanguage, talkLabelsByLanguage, type Language } from './content';
import { talks } from './events';
import { splitTalks, todayInArgentina } from './eventSchedule';
import { getInitialLanguage, setMetaContent } from './site';
import { SiteFooter, SiteHeader } from './siteChrome';
import { TalkList } from './talkComponents';

function EventosPage() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const copy = eventsPageByLanguage[language];
  const siteContent = contentByLanguage[language];
  const labels = talkLabelsByLanguage[language];
  const today = todayInArgentina();
  const currentYear = today.slice(0, 4);
  const { upcoming, past } = splitTalks(talks, today);

  useEffect(() => {
    // The canonical stays https://valentorassa.com/eventos in both languages.
    document.documentElement.lang = language;
    document.title = copy.documentTitle;
    window.localStorage.setItem('vt-language', language);
    setMetaContent('meta[name="description"]', copy.seo.description);
    setMetaContent('meta[property="og:title"]', copy.documentTitle);
    setMetaContent('meta[property="og:description"]', copy.seo.description);
    setMetaContent('meta[property="og:locale"]', copy.seo.locale);
    setMetaContent('meta[name="twitter:title"]', copy.documentTitle);
    setMetaContent('meta[name="twitter:description"]', copy.seo.description);
  }, [copy.documentTitle, copy.seo.description, copy.seo.locale, language]);

  return (
    <div className="site-shell">
      <SiteHeader
        language={language}
        onToggleLanguage={() => setLanguage((current) => current === 'es' ? 'en' : 'es')}
        labels={siteContent.header}
        navItems={copy.navItems}
        brandHref="/"
        meta={siteContent.footer}
      />

      <main className="events-page">
        <header className="events-hero" id="top">
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
          <p className="events-timezone">
            <Clock3 aria-hidden="true" />
            {copy.timezoneNote}
          </p>
        </header>

        <section className="events-section" id="proximas" aria-labelledby="proximas-title">
          <div className="events-section-head">
            <h2 id="proximas-title">{copy.upcomingTitle}</h2>
            <span className="events-count">{upcoming.length}</span>
          </div>
          {upcoming.length > 0 ? (
            <TalkList talks={upcoming} language={language} labels={labels} currentYear={currentYear} isPast={false} />
          ) : (
            <p className="events-empty">{copy.emptyUpcoming}</p>
          )}
        </section>

        <section className="events-section is-past" id="pasadas" aria-labelledby="pasadas-title">
          <div className="events-section-head">
            <h2 id="pasadas-title">{copy.pastTitle}</h2>
            <span className="events-count">{past.length}</span>
          </div>
          {past.length > 0 ? (
            <TalkList talks={past} language={language} labels={labels} currentYear={currentYear} isPast />
          ) : (
            <p className="events-empty">{copy.emptyPast}</p>
          )}
        </section>
      </main>

      <SiteFooter backToTopLabel={siteContent.footer.backToTopLabel} />
    </div>
  );
}

export default EventosPage;
