import { useEffect, useRef, useState } from 'react';
import { ArrowUp, ChevronRight, Menu, X } from 'lucide-react';
import vtMarkAvif96 from './assets/vt-mark-96.avif';
import vtMarkAvif160 from './assets/vt-mark-160.avif';
import vtMarkWebp96 from './assets/vt-mark-96.webp';
import vtMarkWebp160 from './assets/vt-mark-160.webp';
import vtMarkFallback from './assets/vt-mark-160.png';
import { headerSocialLinks, socialLinks, type HeaderLabels, type Language, type NavItem, type SocialLink } from './content';

/** Every network, for the phone menu: the bar only has room for three. */
const panelSocialLinks = socialLinks.filter((link) => link.name !== 'Email');

const vtMarkAvifSrcSet = `${vtMarkAvif96} 96w, ${vtMarkAvif160} 160w`;
const vtMarkWebpSrcSet = `${vtMarkWebp96} 96w, ${vtMarkWebp160} 160w`;

type MarkImageProps = {
  className?: string;
  width: number;
  height: number;
  sizes: string;
  loading?: 'eager' | 'lazy';
};

export function MarkImage({ className, width, height, sizes, loading = 'lazy' }: MarkImageProps) {
  return (
    <picture>
      <source type="image/avif" srcSet={vtMarkAvifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={vtMarkWebpSrcSet} sizes={sizes} />
      <img
        className={className}
        src={vtMarkFallback}
        alt=""
        width={width}
        height={height}
        loading={loading}
        decoding="async"
      />
    </picture>
  );
}

export function SocialIcon({ link }: { link: SocialLink }) {
  const Icon = link.icon;
  return <Icon aria-hidden="true" />;
}

type SiteHeaderProps = {
  language: Language;
  onToggleLanguage: () => void;
  labels: HeaderLabels;
  navItems: NavItem[];
  /** Where the brand mark points: `#top` on the home page, `/` elsewhere. */
  brandHref: string;
  /** Id of the section in view; only `#hash` nav items can be active. */
  activeSection?: string;
  /** 0-1 page scroll, drawn under the bar when set. */
  scrollProgress?: number;
  meta: { location: string; tagline: string };
  /** `inline` sits in the page flow (the /charlas hub) instead of floating over it. */
  variant?: 'fixed' | 'inline';
};

export function SiteHeader({
  language,
  onToggleLanguage,
  labels,
  navItems,
  brandHref,
  activeSection = '',
  scrollProgress,
  meta,
  variant = 'fixed',
}: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const isSection = (item: NavItem) => {
    const section = item.section ?? (item.href.startsWith('#') ? item.href.slice(1) : '');
    return section !== '' && activeSection === section;
  };
  const isActive = (item: NavItem) => Boolean(item.current) || isSection(item);
  const current = (item: NavItem) => (item.current ? 'page' : isSection(item) ? 'location' : undefined);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    const closeOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMobileMenuOpen(false);
    };
    const closeOnDesktop = () => {
      if (window.matchMedia('(min-width: 720px)').matches) setMobileMenuOpen(false);
    };

    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOutside);
    window.addEventListener('resize', closeOnDesktop);

    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOutside);
      window.removeEventListener('resize', closeOnDesktop);
    };
  }, [mobileMenuOpen]);

  return (
    <header className={variant === 'inline' ? 'topbar is-inline' : 'topbar'} ref={headerRef}>
      <a className="brand" href={brandHref} aria-label={`valentorassa - ${labels.homeLabel}`}>
        <MarkImage width={34} height={34} sizes="34px" loading="eager" />
        <span>valentorassa</span>
      </a>

      <nav className="nav-links" aria-label={labels.navLabel}>
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={isActive(item) ? 'is-active' : undefined}
            aria-current={current(item)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <div className="social-actions">
          {headerSocialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              title={link.name}
            >
              <SocialIcon link={link} />
            </a>
          ))}
        </div>

        <button
          type="button"
          className="language-toggle"
          onClick={() => {
            onToggleLanguage();
            setMobileMenuOpen(false);
          }}
          aria-label={`${labels.languageLabel}: ${
            language === 'es' ? labels.englishLabel : labels.spanishLabel
          }`}
          title={language === 'es' ? labels.englishLabel : labels.spanishLabel}
        >
          <span className={language === 'es' ? 'is-on' : undefined}>ES</span>
          <span className={language === 'en' ? 'is-on' : undefined}>EN</span>
        </button>

        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen((current) => !current)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileMenuOpen ? labels.closeMenuLabel : labels.menuLabel}
        >
          {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {mobileMenuOpen ? (
        <div className="mobile-nav-panel" id="mobile-navigation">
          <nav aria-label={labels.navLabel}>
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className={isActive(item) ? 'is-active' : undefined}
                aria-current={current(item)}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item.label}</strong>
                <ChevronRight aria-hidden="true" />
              </a>
            ))}
          </nav>
          <div className="mobile-nav-social">
            {panelSocialLinks.map((link) => (
              <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name} title={link.name}>
                <SocialIcon link={link} />
              </a>
            ))}
          </div>
          <div className="mobile-nav-meta">
            <span><i aria-hidden="true" />{meta.location}</span>
            <span>{meta.tagline}</span>
          </div>
        </div>
      ) : null}

      {scrollProgress === undefined ? null : (
        <span className="scroll-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${scrollProgress})` }} />
        </span>
      )}
    </header>
  );
}

export function SiteFooter({ backToTopLabel }: { backToTopLabel: string }) {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Valentin Torassa Colombero</span>
          <a href="#top">
            {backToTopLabel}
            <ArrowUp aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
