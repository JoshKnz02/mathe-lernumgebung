import { useId, useMemo, type ReactNode } from 'react';
import { BLAU, GRUEN, ORANGE, REGIONEN, merkmaleVon, regionVon, type Merkmale, type Region } from './daten';

interface Kreis {
  schluessel: keyof Merkmale;
  kurz: string;
  cx: number;
  cy: number;
  farbe: string;
  strich: string | undefined;
}

const R = 70;
const BREITE = 300;
const HOEHE = 275;

/** Drei Kreise: U (umkehrbar, blau, durchgezogen), S (symmetrisch, orange, gestrichelt), V (verkettet, grün, gepunktet). */
export const KREISE: Kreis[] = [
  { schluessel: 'umkehrbar', kurz: 'U', cx: 115, cy: 100, farbe: BLAU, strich: undefined },
  { schluessel: 'symmetrisch', kurz: 'S', cx: 185, cy: 100, farbe: ORANGE, strich: '9 5' },
  { schluessel: 'verkettet', kurz: 'V', cx: 150, cy: 160, farbe: GRUEN, strich: '2 5' },
];

const innen = (k: Kreis, x: number, y: number) => (x - k.cx) ** 2 + (y - k.cy) ** 2 < R * R;
const randAbstand = (k: Kreis, x: number, y: number) => Math.abs(Math.hypot(x - k.cx, y - k.cy) - R);

/**
 * Orte für die Buchstaben: In jeder Region der Punkt, der am weitesten von allen Kreisrändern entfernt liegt.
 * Die Region H außerhalb steht fest unten rechts.
 */
export function regionsOrte(): Record<Region, { x: number; y: number }> {
  const bester = new Map<Region, { x: number; y: number; d: number }>();
  for (let x = 4; x < BREITE; x += 3) {
    for (let y = 4; y < HOEHE; y += 3) {
      const m: Merkmale = { umkehrbar: false, symmetrisch: false, verkettet: false };
      for (const k of KREISE) m[k.schluessel] = innen(k, x, y);
      const r = regionVon(m);
      if (r === 'H') continue;
      const d = Math.min(...KREISE.map((k) => randAbstand(k, x, y)));
      const alt = bester.get(r);
      if (!alt || d > alt.d) bester.set(r, { x, y, d });
    }
  }
  const orte = {} as Record<Region, { x: number; y: number }>;
  for (const r of REGIONEN) {
    const b = bester.get(r);
    orte[r] = r === 'H' || !b ? { x: 262, y: 245 } : { x: b.x, y: b.y };
  }
  return orte;
}

interface VennBildProps {
  /** Hervorgehobene Region. */
  markiert?: Region | null;
  /** Textalternative, ergänzt um die markierte Region. */
  beschreibung?: string;
}

/** Venn-Diagramm mit den Regionen A bis H. Gezeichnet in SVG, ohne Zeichenbrett. */
export function VennBild({ markiert = null, beschreibung }: VennBildProps) {
  const basis = useId().replace(/[^a-zA-Z0-9]/g, '');
  const orte = useMemo(regionsOrte, []);
  const m = markiert ? merkmaleVon(markiert) : null;
  const alt = `Venn-Diagramm mit drei Kreisen. Der blaue durchgezogene Kreis U steht für umkehrbar, der orange gestrichelte Kreis S für achsensymmetrisch und der grüne gepunktete Kreis V für verkettet. Die Regionen A bis H: A nur U, B nur S, C nur V, D U und S, E S und V, F U und V, G alle drei, H außerhalb aller Kreise.${markiert ? ` Markiert ist die Region ${markiert}.` : ''}`;
  return (
    <svg className="venn" viewBox={`0 0 ${BREITE} ${HOEHE}`} role="img" aria-label={beschreibung ?? alt}>
      <defs>
        {KREISE.map((k) => (
          <clipPath id={`${basis}c${k.kurz}`} key={k.kurz}>
            <circle cx={k.cx} cy={k.cy} r={R} />
          </clipPath>
        ))}
        <mask id={`${basis}m`}>
          <rect width={BREITE} height={HOEHE} fill="#fff" />
          {m && KREISE.filter((k) => !m[k.schluessel]).map((k) => <circle key={k.kurz} cx={k.cx} cy={k.cy} r={R} fill="#000" />)}
        </mask>
      </defs>
      {m && (
        <g mask={`url(#${basis}m)`}>
          {KREISE.filter((k) => m[k.schluessel]).reduceRight<ReactNode>(
            (inneres, k) => <g clipPath={`url(#${basis}c${k.kurz})`}>{inneres}</g>,
            <rect width={BREITE} height={HOEHE} fill="#9ec9ec" />,
          )}
        </g>
      )}
      <rect x="1" y="1" width={BREITE - 2} height={HOEHE - 2} fill="none" stroke="#94a3b8" strokeWidth="1" rx="6" />
      {KREISE.map((k) => (
        <circle key={k.kurz} cx={k.cx} cy={k.cy} r={R} fill="none" stroke={k.farbe} strokeWidth="3" strokeDasharray={k.strich} strokeLinecap="round" />
      ))}
      <text className="bild-text" x="42" y="38" fill={BLAU} fontSize="15">U</text>
      <text className="bild-text" x="250" y="38" fill={ORANGE} fontSize="15">S</text>
      <text className="bild-text" x="150" y="262" fill={GRUEN} fontSize="15" textAnchor="middle">V</text>
      {REGIONEN.map((r) => (
        <text key={r} className="bild-text" x={orte[r].x} y={orte[r].y} textAnchor="middle" dominantBaseline="central" fontSize="17" fill="#111" fontWeight={r === markiert ? 800 : 600}>
          {r}
        </text>
      ))}
    </svg>
  );
}
