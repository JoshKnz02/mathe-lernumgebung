import type { GeometryElement } from 'jsxgraph';
import type { ReactNode } from 'react';
import { BLAU, ORANGE, SCHWARZ, type MessKurve } from './Messbild';
import { Zeichenbrett } from './Zeichenbrett';

/** Farben der Flächen: positiv blau oder gelb (abwechselnd, auch bei Farbenblindheit gut zu unterscheiden), negativ rosa. */
export const FLAECHE_BLAU = BLAU;
export const FLAECHE_GELB = '#F0E442';
export const FLAECHE_ROSA = '#CC79A7';

/** Ein gefülltes Vieleck (zum Beispiel ein Rechteck oder ein Trapez unter dem Schaubild), optional mit Beschriftung innen. */
export interface Flaeche {
  punkte: [number, number][];
  farbe: string;
  /** Kurzer Text im Inneren, zum Beispiel A₁. */
  text?: string;
  /** Ort des Texts. Ohne Angabe der Schwerpunkt der Eckpunkte. */
  textPos?: [number, number];
  /** Nur Umrandung (gestrichelt, schwarz), keine Füllung. */
  umriss?: boolean;
}

/** Polygonzug, Unterbrechungen durch [NaN, NaN]. */
export interface Linie {
  punkte: [number, number][];
  farbe?: string;
  breite?: number;
  gestrichelt?: boolean;
}

export interface FlaechenbildDaten {
  bereich: [number, number, number, number];
  teilung: number;
  yTeilung: number;
  beschreibung: string;
  className?: string;
  flaechen?: Flaeche[];
  linien?: Linie[];
  kurven?: MessKurve[];
  /** Achsentitel, kurz (zum Beispiel "t in min"). Sie stehen als Zeile über dem Schaubild, nicht im Schaubild, damit sie nichts überdecken. */
  xTitel?: string;
  yTitel?: string;
}

/** Schwerpunkt der Eckpunkte (Mittelwert), für die Beschriftung innerhalb einer Fläche. */
export function schwerpunkt(p: [number, number][]): [number, number] {
  const n = p.length;
  return [p.reduce((s, q) => s + q[0], 0) / n, p.reduce((s, q) => s + q[1], 0) / n];
}

const STIL = { highlight: false, fixed: true };

/**
 * Statisches Schaubild mit gefüllten Flächen (Rechtecke, Trapeze, Streifen), Linien und Kurven. Texte im Bild sind kurz,
 * Zahlenwerte stehen in der Bildunterschrift.
 */
export function Flaechenbild({ bereich, teilung, yTeilung, beschreibung, className = 'brett-3zu2', flaechen = [], linien = [], kurven = [] }: FlaechenbildDaten) {
  const [xmin, xmax] = bereich;
  return (
    <Zeichenbrett
      bereich={bereich}
      xTeilung={teilung}
      yTeilung={yTeilung}
      xBeschriftung="zahl"
      className={className}
      beschreibung={beschreibung}
      zustand={null}
      aufbau={(b) => {
        const text = (x: number, y: number, s: string, farbe: string, ax: 'left' | 'middle' | 'right', ay: 'top' | 'middle' | 'bottom') =>
          b.create('text', [x, y, s], { ...STIL, strokeColor: farbe, anchorX: ax, anchorY: ay, fontSize: 14, cssClass: 'bild-text', highlightCssClass: 'bild-text' }) as GeometryElement;
        for (const f of flaechen) {
          if (f.umriss) {
            const [x0, ...rest] = f.punkte;
            b.create('curve', [[x0![0], ...rest.map((p) => p[0]), x0![0]], [x0![1], ...rest.map((p) => p[1]), x0![1]]], { ...STIL, strokeColor: SCHWARZ, strokeWidth: 2, dash: 3 });
            continue;
          }
          b.create('polygon', f.punkte, {
            ...STIL,
            vertices: { visible: false, fixed: true, highlight: false },
            borders: { strokeColor: '#ffffff', strokeWidth: 1.5, highlight: false, fixed: true },
            fillColor: f.farbe,
            fillOpacity: f.farbe === FLAECHE_GELB ? 0.6 : 0.32,
            hasInnerPoints: false,
          });
        }
        for (const k of kurven) {
          b.create('functiongraph', [k.f, k.von ?? xmin, k.bis ?? xmax], { ...STIL, strokeColor: k.farbe ?? ORANGE, strokeWidth: k.breite ?? (k.gestrichelt ? 2 : 3.5), dash: k.gestrichelt ? 3 : 0 });
        }
        for (const l of linien) {
          b.create('curve', [l.punkte.map((p) => p[0]), l.punkte.map((p) => p[1])], { ...STIL, strokeColor: l.farbe ?? ORANGE, strokeWidth: l.breite ?? 3.5, dash: l.gestrichelt ? 3 : 0 });
        }
        for (const f of flaechen) {
          if (!f.text) continue;
          const [x, y] = f.textPos ?? schwerpunkt(f.punkte);
          text(x, y, f.text, '#1b2433', 'middle', 'middle');
        }
      }}
    />
  );
}

/** Schaubild mit Bildunterschrift. */
export function FlaechenFigur({ daten, unter }: { daten: FlaechenbildDaten; unter: ReactNode }) {
  return (
    <figure className="bild">
      {(daten.yTitel || daten.xTitel) && (
        <p className="achsentitel">
          {daten.yTitel} (senkrecht), {daten.xTitel} (waagerecht)
        </p>
      )}
      <Flaechenbild {...daten} />
      <figcaption>{unter}</figcaption>
    </figure>
  );
}

/** Fläche zwischen zwei Höhen über [x0, x1]: Rechteck oder Trapez (Höhe h0 links, h1 rechts, Untergrenze u). */
export const trapez = (x0: number, x1: number, h0: number, h1 = h0, u = 0): [number, number][] =>
  ([[x0, u], [x0, h0], [x1, h1], [x1, u]] as [number, number][]).filter((p, i, a) => i === 0 || p[0] !== a[i - 1]![0] || p[1] !== a[i - 1]![1]);
