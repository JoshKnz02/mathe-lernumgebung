import type { GeometryElement } from 'jsxgraph';
import type { ReactNode } from 'react';
import { AufKlick } from './AufKlick';
import { Zeichenbrett } from './Zeichenbrett';

export const ORANGE = '#D55E00';
export const BLAU = '#0072B2';
export const GRUEN = '#009E73';
export const SCHWARZ = '#222222';

export interface MessKurve {
  f: (x: number) => number;
  farbe?: string;
  gestrichelt?: boolean;
  breite?: number;
  von?: number;
  bis?: number;
}
export type Lage = 'oben' | 'unten' | 'links' | 'rechts' | 'oben-links' | 'oben-rechts' | 'unten-links' | 'unten-rechts';
export interface MessPunkt {
  x: number;
  y: number;
  farbe?: string;
  /** Offener Punkt (zum Beispiel eine Lücke im Schaubild). */
  offen?: boolean;
  text?: string;
  lage?: Lage;
}
export interface MessStrecke {
  von: [number, number];
  bis: [number, number];
  farbe?: string;
  gestrichelt?: boolean;
  text?: string;
  lage?: Lage;
}

/** Pfeil von `von` nach `bis` (zum Beispiel ein Vektor), die Spitze liegt bei `bis`. */
export interface MessPfeil {
  von: [number, number];
  bis: [number, number];
  farbe?: string;
  gestrichelt?: boolean;
  breite?: number;
  text?: string;
  lage?: Lage;
}

export interface MessbildDaten {
  kurven: MessKurve[];
  punkte?: MessPunkt[];
  strecken?: MessStrecke[];
  pfeile?: MessPfeil[];
  bereich: [number, number, number, number];
  teilung?: number;
  yTeilung?: number;
  beschreibung: string;
  /** Achsentitel direkt an den Achsen, kurz (zum Beispiel "f(x)" und "x"). */
  xTitel?: string;
  yTitel?: string;
  className?: string;
  /** pi: Beschriftung der x-Achse als Vielfaches von π (dann teilung = π/2 o. Ä.), zahl: Dezimalzahlen (Standard). */
  xBeschriftung?: 'pi' | 'zahl';
}

const ANKER: Record<Lage, ['left' | 'middle' | 'right', 'top' | 'middle' | 'bottom']> = {
  oben: ['middle', 'bottom'],
  unten: ['middle', 'top'],
  links: ['right', 'middle'],
  rechts: ['left', 'middle'],
  'oben-links': ['right', 'bottom'],
  'oben-rechts': ['left', 'bottom'],
  'unten-links': ['right', 'top'],
  'unten-rechts': ['left', 'top'],
};

/**
 * Statisches Schaubild mit Kurven, Punkten und Strecken, zum Beispiel Sekante, Tangente und Steigungsdreieck.
 * Texte im Bild sind kurz (P, Q, Δx, Δy), Zahlenwerte stehen in der Bildunterschrift.
 */
export function Messbild({ kurven, punkte = [], strecken = [], pfeile = [], bereich, teilung = 1, yTeilung, beschreibung, className = 'brett-3zu2', xBeschriftung = 'zahl', xTitel, yTitel }: MessbildDaten) {
  const [xmin, xmax, ymin, ymax] = bereich;
  const dx = (xmax - xmin) * 0.015;
  const dy = (ymax - ymin) * 0.025;
  const versatz = (lage: Lage): [number, number] => [
    lage.includes('links') ? -dx : lage.includes('rechts') ? dx : 0,
    lage.includes('oben') ? dy : lage.includes('unten') ? -dy : 0,
  ];
  return (
    <Zeichenbrett
      bereich={bereich}
      xTeilung={teilung}
      yTeilung={yTeilung ?? teilung}
      xBeschriftung={xBeschriftung}
      className={className}
      xTitel={xTitel}
      yTitel={yTitel}
      beschreibung={beschreibung}
      zustand={null}
      aufbau={(b) => {
        const stil = { highlight: false, fixed: true };
        const text = (x: number, y: number, s: string, farbe: string, lage: Lage) => {
          const [vx, vy] = versatz(lage);
          const [ax, ay] = ANKER[lage];
          return b.create('text', [x + vx, y + vy, s], { ...stil, strokeColor: farbe, anchorX: ax, anchorY: ay, fontSize: 14, cssClass: 'bild-text', highlightCssClass: 'bild-text' }) as GeometryElement;
        };
        for (const k of kurven) {
          b.create('functiongraph', [k.f, k.von ?? xmin, k.bis ?? xmax], {
            ...stil,
            strokeColor: k.farbe ?? ORANGE,
            strokeWidth: k.breite ?? (k.gestrichelt ? 2 : 3.5),
            dash: k.gestrichelt ? 3 : 0,
          });
        }
        for (const s of strecken) {
          b.create('segment', [s.von, s.bis], { ...stil, strokeColor: s.farbe ?? BLAU, strokeWidth: 2, dash: s.gestrichelt ? 2 : 0 });
          if (s.text) text((s.von[0] + s.bis[0]) / 2, (s.von[1] + s.bis[1]) / 2, s.text, s.farbe ?? BLAU, s.lage ?? 'oben');
        }
        for (const a of pfeile) {
          b.create('segment', [a.von, a.bis], { ...stil, strokeColor: a.farbe ?? ORANGE, strokeWidth: a.breite ?? 2.5, dash: a.gestrichelt ? 2 : 0, lastArrow: { type: 2, size: 6 } });
          if (a.text) text((a.von[0] + a.bis[0]) / 2, (a.von[1] + a.bis[1]) / 2, a.text, a.farbe ?? ORANGE, a.lage ?? 'oben');
        }
        for (const p of punkte) {
          b.create('point', [p.x, p.y], { ...stil, withLabel: false, face: 'o', size: 5, strokeColor: p.farbe ?? ORANGE, fillColor: p.offen ? '#ffffff' : (p.farbe ?? ORANGE), strokeWidth: p.offen ? 2 : 1 });
          if (p.text) text(p.x, p.y, p.text, p.farbe ?? ORANGE, p.lage ?? 'oben-links');
        }
      }}
    />
  );
}

/** Gerade durch (x₀ | y₀) mit der Steigung m als Kurve für Messbild. */
export const gerade = (x0: number, y0: number, m: number, farbe = BLAU, gestrichelt = false, breite?: number): MessKurve => ({ f: (x) => y0 + m * (x - x0), farbe, gestrichelt, breite });

/** Schaubild mit Bildunterschrift. */
export function Bild({ daten, unter }: { daten: MessbildDaten; unter: ReactNode }) {
  return (
    <figure className="bild">
      <Messbild {...daten} />
      <figcaption>{unter}</figcaption>
    </figure>
  );
}

/** Aufklappbares Kontrollschaubild zu einer Aufgabe. */
export const Kontrollschaubild = ({ children }: { children: ReactNode }) => (
  <AufKlick einblenden="Schaubild zur Kontrolle einblenden" ausblenden="Schaubild ausblenden">
    {children}
  </AufKlick>
);
