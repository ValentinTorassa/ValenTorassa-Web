import { Clock3 } from 'lucide-react';
import { eventsPageByLanguage, talkLabelsByLanguage } from './eventsContent';
import { talks } from './events';
import { splitTalks } from './eventSchedule';
import { counterpartPath, localePath, useToday } from './site';
import { siteChromeByLanguage, type Language } from './siteContent';
import { SiteFooter, SiteHeader } from './siteChrome';
import { TalkList } from './talkComponents';

function EventosPage({ language }: { language: Language }) {
  const copy = eventsPageByLanguage[language];
  const siteContent = siteChromeByLanguage[language];
  const labels = talkLabelsByLanguage[language];
  const today = useToday();
  const path = localePath(language, '/eventos');
  const { upcoming, past } = splitTalks(talks, today);

  return (
    <div className="site-shell">
      <SiteHeader
        language={language}
        languageHref={counterpartPath(path)}
        labels={siteContent.header}
        navItems={copy.navItems}
        brandHref={localePath(language, '/')}
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
          <div className="events-hero-links">
            <a className="events-archive-link" href={localePath(language, '/charlas')}>{copy.archiveLabel} <span aria-hidden="true">↗</span></a>
            <a className="events-archive-link" href={localePath(language, '/speaker-kit')}>{copy.speakerKitLabel} <span aria-hidden="true">↗</span></a>
          </div>
        </header>

        <section className="events-section" id="proximas" aria-labelledby="proximas-title">
          <div className="events-section-head">
            <h2 id="proximas-title">{copy.upcomingTitle}</h2>
            <span className="events-count">{upcoming.length}</span>
          </div>
          {upcoming.length > 0 ? (
            <TalkList talks={upcoming} language={language} labels={labels} today={today} isPast={false} />
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
            <TalkList talks={past} language={language} labels={labels} today={today} isPast />
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
