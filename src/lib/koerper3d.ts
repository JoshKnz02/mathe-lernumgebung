import type { Streifen } from './flaeche';

/**
 * Dreidimensionale Ansicht von Rotationskörpern um die x-Achse. Der Körper wird als geschlossenes Netz aus ebenen Vielecken aufgebaut
 * (Mantel, Deckflächen, bei Hohlkörpern die Innenfläche). Jedes Vieleck hat eine nach außen zeigende Normale (aus Sicht des Materials).
 * Die Ansicht ist eine Parallelprojektion, gezeichnet wird nach Tiefe sortiert (Maler-Algorithmus), abgewandte Flächen entfallen.
 */

export type Punkt3 = [number, number, number];
export interface Flaeche3 {
  p: Punkt3[];
  /** Einheitsvektor, nach außen aus dem Material. */
  n: Punkt3;
}

const sub = (a: Punkt3, b: Punkt3): Punkt3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const kreuz = (a: Punkt3, b: Punkt3): Punkt3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const skalar = (a: Punkt3, b: Punkt3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (a: Punkt3): Punkt3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

/** Vieleck, dessen Normale (aus den ersten drei Punkten) in Richtung `hinweis` zeigt: Punkte werden bei Bedarf umgekehrt. */
function vieleck(p: Punkt3[], hinweis: Punkt3): Flaeche3 {
  let n = kreuz(sub(p[1]!, p[0]!), sub(p[2]!, p[0]!));
  // bei degenerierten ersten Ecken (zwei gleiche Punkte) die Normale aus allen Ecken bilden (Newell)
  if (Math.hypot(...n) < 1e-12) {
    n = [0, 0, 0];
    for (let i = 0; i < p.length; i++) {
      const a = p[i]!;
      const b = p[(i + 1) % p.length]!;
      n = [n[0] + (a[1] - b[1]) * (a[2] + b[2]), n[1] + (a[2] - b[2]) * (a[0] + b[0]), n[2] + (a[0] - b[0]) * (a[1] + b[1])];
    }
  }
  if (skalar(n, hinweis) < 0) return { p: p.slice().reverse(), n: norm([-n[0], -n[1], -n[2]]) };
  return { p, n: norm(n) };
}

const punktAuf = (x: number, r: number, t: number): Punkt3 => [x, r * Math.cos(t), r * Math.sin(t)];

/** Mantelstreifen von x0 (Radius r0) bis x1 (Radius r1); `innen` kehrt die Normale um (Innenfläche eines Hohlraums). */
function mantel(x0: number, r0: number, x1: number, r1: number, nt: number, innen = false): Flaeche3[] {
  const aus: Flaeche3[] = [];
  for (let j = 0; j < nt; j++) {
    const t0 = (2 * Math.PI * j) / nt;
    const t1 = (2 * Math.PI * (j + 1)) / nt;
    const m = (t0 + t1) / 2;
    const radial: Punkt3 = [0, Math.cos(m), Math.sin(m)];
    const hinweis: Punkt3 = innen ? [0, -radial[1], -radial[2]] : radial;
    // bei einer Spitze (Radius 0) entsteht ein Dreieck statt eines Vierecks
    const pts: Punkt3[] = [punktAuf(x0, r0, t0), punktAuf(x1, r1, t0), punktAuf(x1, r1, t1), punktAuf(x0, r0, t1)];
    const eindeutig = pts.filter((q, i) => i === 0 || Math.hypot(...sub(q, pts[i - 1]!)) > 1e-12);
    if (eindeutig.length >= 3 && Math.hypot(...sub(eindeutig[0]!, eindeutig[eindeutig.length - 1]!)) < 1e-12) eindeutig.pop();
    if (eindeutig.length >= 3) aus.push(vieleck(eindeutig, hinweis));
  }
  return aus;
}

/** Kreisscheibe (rInnen = 0) oder Kreisring an der Stelle x, Normale in Richtung `richtung` (+1 oder −1 entlang der x-Achse). */
function scheibe(x: number, rInnen: number, rAussen: number, nt: number, richtung: 1 | -1): Flaeche3[] {
  const h: Punkt3 = [richtung, 0, 0];
  if (rAussen - rInnen < 1e-12) return [];
  if (rInnen < 1e-12) return [vieleck(Array.from({ length: nt }, (_, j) => punktAuf(x, rAussen, (2 * Math.PI * j) / nt)), h)];
  const aus: Flaeche3[] = [];
  for (let j = 0; j < nt; j++) {
    const t0 = (2 * Math.PI * j) / nt;
    const t1 = (2 * Math.PI * (j + 1)) / nt;
    aus.push(vieleck([punktAuf(x, rInnen, t0), punktAuf(x, rAussen, t0), punktAuf(x, rAussen, t1), punktAuf(x, rInnen, t1)], h));
  }
  return aus;
}

/** Glatter Körper zu f auf [a; b] mit n Streifen im Mantel. Der Radius ist |f(x)|. */
export function koerperGlatt(f: (x: number) => number, a: number, b: number, n = 40, nt = 36): Flaeche3[] {
  const aus: Flaeche3[] = [];
  const x = (i: number) => a + ((b - a) * i) / n;
  for (let i = 0; i < n; i++) aus.push(...mantel(x(i), Math.abs(f(x(i))), x(i + 1), Math.abs(f(x(i + 1))), nt));
  aus.push(...scheibe(a, 0, Math.abs(f(a)), nt, -1), ...scheibe(b, 0, Math.abs(f(b)), nt, 1));
  return aus;
}

/** Körper aus Zylinderscheiben: Radius je Streifen aus `radius`, Trennflächen als Kreisringe dort, wo sich die Radien unterscheiden. */
export function koerperScheiben(z: Streifen[], radius: (s: Streifen) => number, nt = 36): Flaeche3[] {
  const aus: Flaeche3[] = [];
  z.forEach((s, i) => {
    const r = radius(s);
    aus.push(...mantel(s.x0, r, s.x1, r, nt));
    if (i === 0) aus.push(...scheibe(s.x0, 0, r, nt, -1));
    else {
      const l = radius(z[i - 1]!);
      if (r > l) aus.push(...scheibe(s.x0, l, r, nt, -1));
      else if (l > r) aus.push(...scheibe(s.x0, r, l, nt, 1));
    }
    if (i === z.length - 1) aus.push(...scheibe(s.x1, 0, r, nt, 1));
  });
  return aus;
}

/**
 * Hohlkörper: außen f auf [a; b], innen die Aussparung g auf [c; b] mit a ≤ c < b. Bei c = a ist die Aussparung durchgehend offen (Hülse),
 * sonst bleibt am Anfang ein Boden. Es gilt f ≥ g ≥ 0.
 */
export function koerperHohl(f: (x: number) => number, g: (x: number) => number, a: number, b: number, c: number, n = 40, nt = 36): Flaeche3[] {
  const aus: Flaeche3[] = [];
  const x = (i: number) => a + ((b - a) * i) / n;
  for (let i = 0; i < n; i++) aus.push(...mantel(x(i), Math.abs(f(x(i))), x(i + 1), Math.abs(f(x(i + 1))), nt));
  const m = Math.max(2, Math.round((n * (b - c)) / (b - a)));
  const y = (i: number) => c + ((b - c) * i) / m;
  for (let i = 0; i < m; i++) aus.push(...mantel(y(i), Math.abs(g(y(i))), y(i + 1), Math.abs(g(y(i + 1))), nt, true));
  const rc = Math.abs(g(c));
  if (c - a < 1e-12) aus.push(...scheibe(a, rc, Math.abs(f(a)), nt, -1));
  else aus.push(...scheibe(a, 0, Math.abs(f(a)), nt, -1), ...scheibe(c, 0, rc, nt, 1));
  aus.push(...scheibe(b, Math.abs(g(b)), Math.abs(f(b)), nt, 1));
  return aus;
}

/** Rauminhalt des Netzes über den Divergenzsatz (Summe über Dreiecke der Fächer), nur für Tests und Prüfungen. */
export function netzVolumen(netz: Flaeche3[]): number {
  let v = 0;
  for (const q of netz) {
    for (let i = 1; i + 1 < q.p.length; i++) v += skalar(q.p[0]!, kreuz(q.p[i]!, q.p[i + 1]!)) / 6;
  }
  return Math.abs(v);
}

export interface Ansicht {
  /** Drehung um die senkrechte Achse in Grad. */
  az: number;
  /** Neigung der Blickrichtung nach oben in Grad (0 = von der Seite, 90 = von oben). */
  el: number;
}

const GRAD = Math.PI / 180;

/** Projektion eines Raumpunkts: Bildkoordinaten (rechts, oben) und Tiefe (größer = weiter weg). Die x-Achse zeigt bei az = 0 nach rechts. */
export function projiziere(p: Punkt3, v: Ansicht): [number, number, number] {
  const ca = Math.cos(v.az * GRAD);
  const sa = Math.sin(v.az * GRAD);
  const ce = Math.cos(v.el * GRAD);
  const se = Math.sin(v.el * GRAD);
  // y zeigt bei az = 0 vom Betrachter weg, z nach oben
  const X = p[0] * ca + p[1] * sa;
  const Y = -p[0] * sa + p[1] * ca;
  return [X, p[2] * ce + Y * se, Y * ce - p[2] * se];
}

/** Dieselbe Drehung für Richtungen (Normalen). */
export const dreheRichtung = projiziere;

export interface Zeichenstueck {
  punkte: [number, number][];
  /** Helligkeit 0 bis 1 (Licht von links oben vorne). */
  hell: number;
  tiefe: number;
}

const LICHT = norm([-0.35, 0.6, -0.7]);

/** Sichtbare Vielecke, von hinten nach vorn sortiert. */
export function zeichenstuecke(netz: Flaeche3[], v: Ansicht): Zeichenstueck[] {
  const aus: Zeichenstueck[] = [];
  for (const q of netz) {
    const n = dreheRichtung(q.n, v);
    // n[2] ist die Tiefenkomponente: negativ heißt, die Fläche schaut zum Betrachter
    if (n[2] > 1e-9) continue;
    const pr = q.p.map((p) => projiziere(p, v));
    const tiefe = pr.reduce((s, p) => s + p[2], 0) / pr.length;
    aus.push({ punkte: pr.map((p) => [p[0], p[1]]), hell: Math.min(1, Math.max(0, skalar(n, LICHT))), tiefe });
  }
  return aus.sort((a, b) => b.tiefe - a.tiefe);
}

/** Halbe Breite und Höhe des Bildes für alle Drehungen um die senkrechte Achse bei der Neigung `el`, damit der Maßstab beim Drehen gleich bleibt. */
export function ausdehnung(netz: Flaeche3[], el: number): { ex: number; ey: number; mitte: Punkt3 } {
  let mn: Punkt3 = [Infinity, Infinity, Infinity];
  let mx: Punkt3 = [-Infinity, -Infinity, -Infinity];
  for (const q of netz) for (const p of q.p) for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k]!, p[k]!); mx[k] = Math.max(mx[k]!, p[k]!); }
  const mitte: Punkt3 = [(mn[0] + mx[0]) / 2, 0, 0];
  let ex = 0;
  let ey = 0;
  const ecken: Punkt3[] = [];
  for (const x of [mn[0] - mitte[0], mx[0] - mitte[0]]) for (const y of [mn[1], mx[1]]) for (const z of [mn[2], mx[2]]) ecken.push([x, y, z]);
  for (let az = 0; az < 360; az += 10) {
    for (const e of ecken) {
      const [px, py] = projiziere(e, { az, el });
      ex = Math.max(ex, Math.abs(px));
      ey = Math.max(ey, Math.abs(py));
    }
  }
  return { ex, ey, mitte };
}
