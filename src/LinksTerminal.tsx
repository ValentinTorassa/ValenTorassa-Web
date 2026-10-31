import type { CSSProperties, ReactNode } from 'react';

/** One line of the neofetch: a label and its value, which can be a link. */
export type TermFact = { key: string; value: string; href?: string; external?: boolean };

const tux = String.raw`    .--.
   |o_o |
   |:_/ |
  //   \ \
 (|     | )
/'\_   _/'\
\___)=(___/`;

/** A line that fades in after the ones before it (--i sets its turn). */
function Line({ i, className = '', children }: { i: number; className?: string; children: ReactNode }) {
  return (
    <span className={`term-line ${className}`} style={{ '--i': i } as CSSProperties}>
      {children}
    </span>
  );
}

/** The hero: a terminal that runs neofetch, with Tux and the facts beside it. */
function LinksTerminal({ title, facts }: { title: string; facts: TermFact[] }) {
  return (
    <div className="win hero-terminal">
      <span className="win-bar" aria-hidden="true">
        <span>{title}</span>
        <span className="win-bar-dots">▪▪▪</span>
      </span>
      <span className="win-body">
        <span className="term">
          <Line i={0}>
            <b>$</b> neofetch
          </Line>
          <Line i={1} className="neofetch">
            <pre className="neofetch-art" aria-hidden="true">
              {tux}
            </pre>
            <span className="neofetch-info">
              <span className="neofetch-head">valen@vt</span>
              <span className="neofetch-rule" aria-hidden="true">
                --------
              </span>
              {facts.map((fact) => (
                <span key={fact.key}>
                  <b>{fact.key}:</b>{' '}
                  {fact.href ? (
                    <a href={fact.href} {...(fact.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                      {fact.value}
                    </a>
                  ) : (
                    fact.value
                  )}
                </span>
              ))}
              <span className="neofetch-swatches" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
            </span>
          </Line>
          <Line i={2}>
            <b>$</b> <i className="term-cursor">▌</i>
          </Line>
        </span>
      </span>
    </div>
  );
}

export default LinksTerminal;
