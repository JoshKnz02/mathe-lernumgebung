import type { ReactNode } from 'react';
import { Link, type Route } from '@/app/router';

interface KachelProps {
  /** Ziel der Kachel. Die ganze Fläche ist klickbar, der Link steckt im Titel. */
  zu: Route;
  titel: string;
  text?: ReactNode;
  /** Kleine Zeile unten, z. B. "6 Module". */
  meta?: ReactNode;
  symbol?: ReactNode;
  /** Zusätzliche Inhalte wie Abzeichen, zwischen Text und Fußzeile. */
  children?: ReactNode;
  hervorgehoben?: boolean;
}

/** Klickbare Kachel für Themenbereiche, Kurse und Module: Symbol, Titel, Text, Fußzeile mit Pfeil. */
export function Kachel({ zu, titel, text, meta, symbol, children, hervorgehoben = false }: KachelProps) {
  return (
    <div className={`kachel${hervorgehoben ? ' kachel-hervorgehoben' : ''}`}>
      {symbol && <div className="kachel-symbol">{symbol}</div>}
      <h3 className="kachel-titel">
        <Link className="kachel-link" zu={zu}>
          {titel}
        </Link>
      </h3>
      {text && <p className="kachel-text">{text}</p>}
      {children}
      <p className="kachel-fuss">
        <span className="kachel-meta">{meta}</span>
        <span className="kachel-pfeil" aria-hidden="true">
          →
        </span>
      </p>
    </div>
  );
}
