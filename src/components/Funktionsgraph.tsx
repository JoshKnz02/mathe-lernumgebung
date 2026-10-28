interface Punkt {
  x: number;
  y: number;
  beschriftung?: string;
  /** hervorgehoben = bewegter Punkt, sonst fester Marker (z. B. Optimum). */
  hervorgehoben?: boolean;
}

interface FunktionsgraphProps {
  f: (x: number) => number;
  /** Definitionsbereich der Zielfunktion; nur dort wird der Graph gezeichnet. */
  von: number;
  bis: number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  xSchritt: number;
  ySchritt: number;
  xName?: string;
  yName?: string;
  punkte?: Punkt[];
  /** Textalternative für Screenreader. */
  beschreibung: string;
}

const B = 480;
const H = 300;
const R = { l: 56, r: 16, o: 16, u: 40 };

function ticks(min: number, max: number, schritt: number): number[] {
  const t: number[] = [];
  for (let v = Math.ceil(min / schritt) * schritt; v <= max + 1e-9; v += schritt) t.push(Math.round(v / schritt) * schritt);
  return t;
}

/** Einfacher, abhängigkeitsfreier Funktionsgraph (SVG) mit Achsen, Gitter und markierten Punkten. */
export function Funktionsgraph(p: FunktionsgraphProps) {
  const sx = (x: number) => R.l + ((x - p.xMin) / (p.xMax - p.xMin)) * (B - R.l - R.r);
  const sy = (y: number) => H - R.u - ((y - p.yMin) / (p.yMax - p.yMin)) * (H - R.u - R.o);
  const n = 240;
  const pfad = Array.from({ length: n + 1 }, (_, i) => {
    const x = p.von + ((p.bis - p.von) * i) / n;
    return `${i === 0 ? 'M' : 'L'}${sx(x).toFixed(1)},${sy(p.f(x)).toFixed(1)}`;
  }).join(' ');
  const x0 = Math.min(Math.max(sx(0), R.l), B - R.r);
  const y0 = Math.min(Math.max(sy(0), R.o), H - R.u);
  return (
    <svg className="graph" viewBox={`0 0 ${B} ${H}`} role="img" aria-label={p.beschreibung}>
      {ticks(p.xMin, p.xMax, p.xSchritt).map((t) => (
        <g key={`x${t}`}>
          <line className="graph-gitter" x1={sx(t)} x2={sx(t)} y1={R.o} y2={H - R.u} />
          <text className="graph-text" x={sx(t)} y={H - R.u + 16} textAnchor="middle">{String(t).replace('.', ',')}</text>
        </g>
      ))}
      {ticks(p.yMin, p.yMax, p.ySchritt).map((t) => (
        <g key={`y${t}`}>
          <line className="graph-gitter" x1={R.l} x2={B - R.r} y1={sy(t)} y2={sy(t)} />
          <text className="graph-text" x={R.l - 6} y={sy(t) + 4} textAnchor="end">{String(t).replace('.', ',')}</text>
        </g>
      ))}
      <line className="graph-achse" x1={R.l} x2={B - R.r} y1={y0} y2={y0} />
      <line className="graph-achse" x1={x0} x2={x0} y1={R.o} y2={H - R.u} />
      <text className="graph-text" x={B - R.r} y={H - 6} textAnchor="end">{p.xName ?? 'x'}</text>
      <text className="graph-text" x={R.l + 4} y={R.o + 10}>{p.yName ?? 'y'}</text>
      <path className="graph-kurve" d={pfad} fill="none" />
      {(p.punkte ?? []).map((q, i) => (
        <g key={i}>
          <circle className={q.hervorgehoben ? 'graph-punkt graph-punkt-aktiv' : 'graph-punkt'} cx={sx(q.x)} cy={sy(q.y)} r={5} />
          {q.beschriftung && <text className="graph-text graph-text-punkt" x={sx(q.x) + 8} y={sy(q.y) - 8}>{q.beschriftung}</text>}
        </g>
      ))}
    </svg>
  );
}
