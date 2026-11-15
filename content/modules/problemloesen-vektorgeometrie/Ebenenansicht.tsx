import { abstandZuM, inEbene, umlaufAb } from '@/lib/permutation';
import type { Punkt3 } from '@/lib/schraegbild';
import { BLAU, ORANGE, ROSA, SCHWARZ } from './daten';

const R = 100;
const BESCHRIFTUNG = 1.26;
const FARBEN = [ORANGE, BLAU, ROSA];

/** Lage der Eckpunkte und ihrer Beschriftungen in der Zeichnung (Einheiten: Kreisradius 100), berechnet, nicht von Hand gewählt. */
export function ebenenansichtLagen(p: Punkt3) {
  const u = umlaufAb(p);
  const r = abstandZuM(p);
  const punkte = u.map((q) => {
    const [x, y] = inEbene(q);
    return { x: (x / r) * R, y: (-y / r) * R };
  });
  return { punkte, text: punkte.map((q) => ({ x: q.x * BESCHRIFTUNG, y: q.y * BESCHRIFTUNG })), n: u.length, radius: R };
}

/**
 * Das Sechseck von oben auf die Ebene x₁ + x₂ + x₃ = s gesehen, längentreu: Kreis um M, die Ecken P₁ bis P₆, die Seiten.
 * Die Beschriftungen stehen von M aus gesehen außerhalb des Kreises, also nie auf einer Seite oder dem Kreis.
 */
export function Ebenenansicht({ p, gegenseiten = false, radien = false, text }: { p: Punkt3; gegenseiten?: boolean; radien?: boolean; text: string }) {
  const { punkte, text: t, n } = ebenenansichtLagen(p);
  return (
    <svg className="ebenenansicht" viewBox="-150 -150 300 300" role="img" aria-label={text} style={{ width: '100%', maxWidth: '22rem', display: 'block', margin: '0.5rem auto' }}>
      <circle cx="0" cy="0" r={R} fill="none" stroke="#8A8A8A" strokeWidth="1.2" strokeDasharray="4 3" />
      {radien && punkte.map((q, i) => <line key={`r${i}`} x1="0" y1="0" x2={q.x} y2={q.y} stroke={SCHWARZ} strokeWidth="1" strokeDasharray="3 3" />)}
      {punkte.map((q, i) => {
        const z = punkte[(i + 1) % n]!;
        return <line key={`s${i}`} x1={q.x} y1={q.y} x2={z.x} y2={z.y} stroke={gegenseiten && n === 6 ? FARBEN[i % 3] : SCHWARZ} strokeWidth={gegenseiten && n === 6 ? 3.2 : 2.2} />;
      })}
      <circle cx="0" cy="0" r="2.6" fill={SCHWARZ} />
      {punkte.map((q, i) => <circle key={`p${i}`} cx={q.x} cy={q.y} r="3.4" fill={SCHWARZ} />)}
      {t.map((q, i) => (
        <text key={`t${i}`} x={q.x} y={q.y} fontSize="15" textAnchor="middle" dominantBaseline="central" fill="#111">{`P${i + 1}`}</text>
      ))}
      {radien && <text x="9" y="-6" fontSize="15" textAnchor="start" dominantBaseline="central" fill="#111">M</text>}
    </svg>
  );
}
