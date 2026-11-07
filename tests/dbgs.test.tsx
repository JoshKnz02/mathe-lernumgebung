import { writeFileSync } from 'node:fs';
import { it } from 'vitest';
import * as B from '../content/modules/modellieren-geraden/Bilder';
import { RAUM_BEREICH, RAUM_GRENZE, bildpunkt, normiert, raumLagen, sperrlinienRaum, x1ZahlMitte, type RaumBildSpec } from '../src/lib/schraegbild';
import { lageAbstand } from '../src/lib/vektorbild';

const D = '/tmp/claude-0/-home-user-mathe-lernumgebung/76c40dbc-1518-5ca0-a8ca-7cda2d810a20/scratchpad/';
const zahlenX1 = Array.from({ length: 2 * RAUM_GRENZE + 1 }, (_, i) => i - RAUM_GRENZE).filter((k) => k !== 0).map((k) => normiert(x1ZahlMitte(k)));
const titel = [[5.9, 0.37], [0.42, 6.1], [-2.76, -3.09]];
function regel(s: RaumBildSpec): boolean {
  const sichtbar = s.punkte!.filter((p) => !p.ohneText && !p.nurText);
  const bp = sichtbar.map((p) => bildpunkt(p.p));
  for (const [i, p] of sichtbar.entries()) {
    for (const x of p.p) if (Math.abs(x) > RAUM_GRENZE) return false;
    const [x, y] = bp[i]!;
    if (x === 0 || y === 0 || x === y) return false;
  }
  if (new Set(bp.map(String)).size !== bp.length) return false;
  for (const p of s.punkte!) for (const t of titel) { const b = bildpunkt(p.p); if (Math.hypot(b[0] - t[0]!, b[1] - t[1]!) <= 1.2) return false; }
  for (const l of s.linien!) for (const c of [...l.von, ...l.bis]) if (Math.abs(c) > RAUM_GRENZE) return false;
  return true;
}
function abstand(s: RaumBildSpec): number {
  const lagen = raumLagen(s);
  let m = 9;
  for (const l of lagen) {
    const pt = s.punkte!.find((p) => p.name === l.name)!;
    const andere = [...zahlenX1, ...lagen.filter((x) => x !== l).map((x) => normiert(x.mitte))];
    m = Math.min(m, lageAbstand(l.lage, bildpunkt(pt.p), { bereich: RAUM_BEREICH, teilung: 1, linien: sperrlinienRaum(s.linien), belegt: andere }));
  }
  return m;
}
it('szene', () => {
  const par: unknown[] = [];
  const zen: unknown[] = [];
  const t0 = Date.now();
  for (let x1 = -2; x1 <= 0; x1++) for (let x2 = -3; x2 <= -1; x2++) {
    const h = { x1, x2, breite: 2, laenge: 2, traufe: 2, first: 3 };
    for (let a = -2; a <= 2; a++) for (let b = -4; b <= -1; b++) for (const c of [-1, 0]) {
      const r = B.szene(h, 'parallel', [a, b, c], [0, 2, 4], true, true);
      if (!r.ok || r.ausserhalb.length || r.spec.punkte!.length !== 4 || !regel(r.spec)) continue;
      const d = abstand(r.spec);
      if (d >= 0.016) par.push([d, h, [a, b, c]]);
    }
    for (let j1 = -3; j1 <= 3; j1++) for (let j2 = 0; j2 <= 4; j2++) for (const j3 of [3, 4]) {
      const r = B.szene(h, 'zentral', [1, -2, -1], [j1, j2, j3], true, true);
      if (!r.ok || r.ausserhalb.length || r.spec.punkte!.length !== 5 || !regel(r.spec)) continue;
      const d = abstand(r.spec);
      if (d >= 0.016) zen.push([d, h, [j1, j2, j3]]);
    }
    if (Date.now() - t0 > 100000) break;
  }
  const sort = (l: unknown[]) => l.sort((p, q) => (q as number[])[0]! - (p as number[])[0]!);
  writeFileSync(D + 'szene.json', JSON.stringify({ par: [par.length, sort(par).slice(0, 40)], zen: [zen.length, sort(zen).slice(0, 40)] }));
}, 115000);
