import type { ReactNode } from 'react';
import { ORANGE, BLAU } from './daten';

/** Farben der drei Kreuze (1., 2., 3. Koordinate) und der durchgestrichenen Zeilen. */
export const SCHEMA_FARBEN = [BLAU, '#009E73', ORANGE];
const DURCHSTRICH = '#CC79A7';

export interface SchemaLinie {
  /** Zeile (0 bis 5) und Spalte der Spitze links bzw. rechts. */
  vonZeile: number;
  bisZeile: number;
  /** Plus (links oben nach rechts unten) oder minus (links unten nach rechts oben). */
  vorzeichen: '+' | '-';
  /** Welche Koordinate des Ergebnisses (0, 1, 2). */
  koordinate: number;
}

/**
 * Die sechs Linien des Schemas. Die Zeilen sind a₁, a₂, a₃, a₁, a₂, a₃ (links) und b₁, b₂, b₃, b₁, b₂, b₃ (rechts).
 * Die erste und die letzte Zeile werden durchgestrichen, die Koordinate k entsteht aus den Zeilen k + 1 und k + 2 (von 0 an gezählt).
 */
export function schemaLinien(): SchemaLinie[] {
  const r: SchemaLinie[] = [];
  for (let k = 0; k < 3; k++) {
    r.push({ vonZeile: k + 1, bisZeile: k + 2, vorzeichen: '+', koordinate: k });
    r.push({ vonZeile: k + 2, bisZeile: k + 1, vorzeichen: '-', koordinate: k });
  }
  return r;
}

const Y0 = 62;
const DY = 54;
const XA = 80;
const XB = 220;
const zeileY = (i: number) => Y0 + i * DY;

/**
 * Rechenschema für das Vektorprodukt: die Koordinaten von a und b untereinander, noch einmal darunter wiederholt, erste und letzte Zeile durchgestrichen,
 * dazwischen drei farbige Kreuze. Links oben nach rechts unten wird multipliziert und addiert, links unten nach rechts oben multipliziert und subtrahiert.
 * `a` und `b` sind die drei Beschriftungen (Namen oder Zahlen).
 */
export function Rechenschema({ a, b, unter, beschreibung }: { a: string[]; b: string[]; unter: ReactNode; beschreibung: string }) {
  const ra = [...a, ...a];
  const rb = [...b, ...b];
  return (
    <figure className="bild">
      <svg viewBox="0 0 300 380" role="img" aria-label={beschreibung} style={{ width: '100%', maxWidth: 320, display: 'block', margin: '0 auto' }}>
        <text x={XA} y={26} textAnchor="middle" fontSize="24" fontStyle="italic" fill="#374151">a</text>
        <text x={XB} y={26} textAnchor="middle" fontSize="24" fontStyle="italic" fill="#374151">b</text>
        {ra.map((s, i) => (
          <g key={i} fontSize="30" fill="#111827" textAnchor="middle">
            <text x={XA} y={zeileY(i)}>{s}</text>
            <text x={XB} y={zeileY(i)}>{rb[i]}</text>
          </g>
        ))}
        {schemaLinien().map((l, i) => (
          <line key={i} x1={XA + 34} y1={zeileY(l.vonZeile) - 8} x2={XB - 34} y2={zeileY(l.bisZeile) - 8} stroke={SCHEMA_FARBEN[l.koordinate]} strokeWidth="4.5" strokeLinecap="round" />
        ))}
        {[0, 5].map((i) => (
          <line key={i} x1={14} y1={zeileY(i) - 8} x2={286} y2={zeileY(i) - 8} stroke={DURCHSTRICH} strokeWidth="4.5" strokeLinecap="round" />
        ))}
      </svg>
      <figcaption>{unter}</figcaption>
    </figure>
  );
}
