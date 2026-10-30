import { useId, useMemo, type ReactNode } from 'react';
import { mitgliedVon, regionVon, REGIONEN, regionText, type Mitglied, type Region } from '@/lib/venn';
import { BLAU, GRUEN, ORANGE } from './Messbild';

export interface VennMenge {
  /** Kurzer Buchstabe oder Name im Bild. */
  kurz: string;
  /** Name der Eigenschaft für die Textalternative. */
  name: string;
}

interface Kreis {
  cx: number;
  cy: number;
  farbe: string;
  strich: string | undefined;
  /** Farbe und Strichart in Worten. */
  wort: string;
  /** Ort der Beschriftung des Kreises. */
  label: { x: number; y: number; anker?: 'middle' };
}

const R = 70;
const BREITE = 300;
const HOEHE = 275;

/** Drei Kreise: 1 blau durchgezogen, 2 orange gestrichelt, 3 grün gepunktet. Die Unterscheidung steht auch in der Strichart. */
export const KREISE: Kreis[] = [
  { cx: 115, cy: 100, farbe: BLAU, strich: undefined, wort: 'blaue durchgezogene', label: { x: 42, y: 38 } },
  { cx: 185, cy: 100, farbe: ORANGE, strich: '9 5', wort: 'orange gestrichelte', label: { x: 250, y: 38 } },
  { cx: 150, cy: 160, farbe: GRUEN, strich: '2 5', wort: 'grüne gepunktete', label: { x: 150, y: 262, anker: 'middle' } },
];

const innen = (k: Kreis, x: number, y: number) => (x - k.cx) ** 2 + (y - k.cy) ** 2 < R * R;
const randAbstand = (k: Kreis, x: number, y: number) => Math.abs(Math.hypot(x - k.cx, y - k.cy) - R);

/** Orte der Buchstaben: in jeder Region der Punkt mit dem größten Abstand zu allen Kreisrändern, H steht unten rechts. */
export function regionsOrte(): Record<Region, { x: number; y: number }> {
  const bester = new Map<Region, { x: number; y: number; d: number }>();
  for (let x = 4; x < BREITE; x += 3) {
    for (let y = 4; y < HOEHE; y += 3) {
      const m = KREISE.map((k) => innen(k, x, y)) as Mitglied;
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

interface Props {
  mengen: [VennMenge, VennMenge, VennMenge];
  /** Hervorgehobene Region. */
  markiert?: Region | null;
  /** Regionen, in denen es keine Funktion gibt, zur Textalternative. */
  leer?: Region[];
}

/** Venn-Diagramm mit den Regionen A bis H, gezeichnet in SVG. */
export function VennDiagramm({ mengen, markiert = null, leer = [] }: Props) {
  const basis = useId().replace(/[^a-zA-Z0-9]/g, '');
  const orte = useMemo(regionsOrte, []);
  const m = markiert ? mitgliedVon(markiert) : null;
  const namen = mengen.map((x) => x.name) as [string, string, string];
  const alt = `Venn-Diagramm mit drei Kreisen. ${KREISE.map((k, i) => `Der ${k.wort} Kreis ${mengen[i]!.kurz} steht für ${mengen[i]!.name}`).join('. ')}. Die Regionen: ${REGIONEN.map((r) => `${r} ${regionText(r, namen)}`).join(', ')}.${leer.length ? ` In den Regionen ${leer.join(' und ')} gibt es keine Funktion.` : ''}${markiert ? ` Markiert ist die Region ${markiert}.` : ''}`;
  return (
    <svg className="venn" viewBox={`0 0 ${BREITE} ${HOEHE}`} role="img" aria-label={alt}>
      <defs>
        {KREISE.map((k, i) => (
          <clipPath id={`${basis}c${i}`} key={i}>
            <circle cx={k.cx} cy={k.cy} r={R} />
          </clipPath>
        ))}
        <mask id={`${basis}m`}>
          <rect width={BREITE} height={HOEHE} fill="#fff" />
          {m && KREISE.filter((_, i) => !m[i]).map((k) => <circle key={k.cx + k.cy} cx={k.cx} cy={k.cy} r={R} fill="#000" />)}
        </mask>
      </defs>
      {m && (
        <g mask={`url(#${basis}m)`}>
          {KREISE.map((_, i) => i).filter((i) => m[i]).reduceRight<ReactNode>(
            (inneres, i) => <g clipPath={`url(#${basis}c${i})`}>{inneres}</g>,
            <rect width={BREITE} height={HOEHE} fill="#9ec9ec" />,
          )}
        </g>
      )}
      <rect x="1" y="1" width={BREITE - 2} height={HOEHE - 2} fill="none" stroke="#94a3b8" strokeWidth="1" rx="6" />
      {KREISE.map((k, i) => (
        <circle key={i} cx={k.cx} cy={k.cy} r={R} fill="none" stroke={k.farbe} strokeWidth="3" strokeDasharray={k.strich} strokeLinecap="round" />
      ))}
      {KREISE.map((k, i) => (
        <text key={i} className="bild-text" x={k.label.x} y={k.label.y} fill={k.farbe} fontSize="15" textAnchor={k.label.anker}>
          {mengen[i]!.kurz}
        </text>
      ))}
      {REGIONEN.map((r) => (
        <text key={r} className="bild-text" x={orte[r].x} y={orte[r].y} textAnchor="middle" dominantBaseline="central" fontSize="17" fill="#111" fontWeight={r === markiert ? 800 : 600}>
          {r}
        </text>
      ))}
    </svg>
  );
}
