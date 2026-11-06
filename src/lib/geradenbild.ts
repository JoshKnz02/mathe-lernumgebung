/**
 * Gemeinsame Hilfen für Raumbilder mit Geraden (Module des Unterbereichs Geraden): beschriftete Punkte und die Namen der Geraden (g, h) als kleiner Text dicht an der Linie.
 */
import { geradeImWuerfel, imWuerfel, type Gerade } from './gerade';
import { bildpunkt, x1ZahlMitte, type Punkt3, type RaumLinie, type RaumPunkt } from './schraegbild';
import { skalarprodukt } from './vektor';

const nullpunkt = (p: number[]) => p.every((c) => c === 0);
/** Beschrifteter Punkt, im Ursprung ohne Buchstaben (dort laufen die Achsen zusammen). */
export const punkt = (name: string, p: number[]): RaumPunkt => (nullpunkt(p) ? { name, p: p as Punkt3, ohneText: true } : { name, p: p as Punkt3 });


export interface BenannteLinie {
  /** Die Gerade (der Teil im Koordinatensystem von −4 bis 4 wird benannt). */
  g?: Gerade;
  /** Oder eine Strecke (zum Beispiel das Lot), dann steht der Name an ihr. */
  strecke?: [Punkt3, Punkt3];
  name: string;
  farbe: string;
}
const teil = (l: BenannteLinie): [Punkt3, Punkt3] | null => l.strecke ?? (l.g ? geradeImWuerfel(l.g) : null);
type P2 = [number, number];
const abstandPunktStrecke = (p: P2, a: P2, b: P2): number => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l2 = dx * dx + dy * dy;
  const u = l2 === 0 ? 0 : Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2));
  return Math.hypot(p[0] - (a[0] + u * dx), p[1] - (a[1] + u * dy));
};
const ACHSEN_BILD: [P2, P2][] = ([[1, 0, 0], [0, 1, 0], [0, 0, 1]] as Punkt3[]).map((e) => [bildpunkt(e.map((c) => -4 * c) as Punkt3), bildpunkt(e.map((c) => 4 * c) as Punkt3)]);
const ANTEILE = Array.from({ length: 21 }, (_, i) => 0.06 + i * 0.044);
/** Abstand des Namens von der Geraden im Bild (Einheiten des Koordinatensystems). */
const NAMEN_ABSTAND = 0.32;

/**
 * Setzt den Namen jeder Geraden (g, h) als farbigen Text neben die Gerade: nahe an einem Ende des Teils im Koordinatensystem, seitlich versetzt, mit möglichst großem
 * Abstand zu allen Geraden, den Achsen, den Namen davor und den Punkten. Der Text wird als `nurText` gezeichnet.
 */
export function linienNamen(linien: BenannteLinie[], punkte: RaumPunkt[] = []): RaumPunkt[] {
  const segmente: [P2, P2][] = [];
  for (const l of linien) {
    const s = teil(l);
    if (s) segmente.push([bildpunkt(s[0]), bildpunkt(s[1])]);
  }
  const andere: P2[] = punkte.filter((p) => !p.nurText).map((p) => bildpunkt(p.p));
  const text: RaumPunkt[] = [];
  for (const l of linien) {
    const s = teil(l);
    if (!s) continue;
    const [a, b] = [bildpunkt(s[0]), bildpunkt(s[1])];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const n: P2 = [-(b[1] - a[1]) / len, (b[0] - a[0]) / len];
    let beste: { p: Punkt3; score: number } | null = null;
    for (const f of ANTEILE) {
      const basis = s[0].map((c, i) => c + f * (s[1][i]! - c));
      for (const seite of [1, -1]) {
        // Eine Verschiebung in x₂ und x₃ verschiebt das Schrägbild genau um dieselben Beträge
        const c = [basis[0]!, basis[1]! + seite * n[0] * NAMEN_ABSTAND, basis[2]! + seite * n[1] * NAMEN_ABSTAND] as Punkt3;
        const bc = bildpunkt(c);
        if (Math.abs(bc[0]) > 6 || Math.abs(bc[1]) > 6) continue;
        const zu = (q: P2) => Math.hypot(q[0] - bc[0], q[1] - bc[1]);
        // Abstand zu den anderen Linien (die eigene Linie ist immer NAMEN_ABSTAND entfernt), den Achsen, den Punkten und den Namen davor
        const fremd = segmente.filter(([a1, b1]) => !(a1[0] === a[0] && a1[1] === a[1] && b1[0] === b[0] && b1[1] === b[1])).map(([a1, b1]) => abstandPunktStrecke(bc, a1, b1));
        const score = Math.min(1.6, ...fremd, ...ACHSEN_BILD.map(([a1, b1]) => abstandPunktStrecke(bc, a1, b1)), ...andere.map(zu), ...text.map((t) => zu(bildpunkt(t.p))));
        if (!beste || score > beste.score) beste = { p: c, score };
      }
    }
    if (beste) text.push({ name: l.name, p: beste.p.map((x) => Math.round(x * 1e6) / 1e6) as Punkt3, nurText: true, farbe: l.farbe });
  }
  return text;
}

/* ---------- Winkel in Raumbildern (Module schnittwinkel-geraden und die späteren der Ebenen) ---------- */
const plus = (a: number[], b: number[]) => a.map((x, i) => x + b[i]!);
const mal = (k: number, v: number[]) => v.map((x) => x * k);
const einheit = (v: number[]) => mal(1 / Math.hypot(...v), v);
const rund = (v: number[]) => v.map((x) => Math.round(x * 1e6) / 1e6 + 0) as Punkt3;

/** Winkelbogen um S zwischen den Richtungen a und b (Halbkreisbogen auf der Kugel mit dem Radius r), als Linienzug aus kurzen Strecken. */
export function winkelBogen(S: number[], a: number[], b: number[], farbe: string, r = 1, n = 12): RaumLinie[] {
  const ea = einheit(a);
  const eb = einheit(b);
  const w = Math.acos(Math.max(-1, Math.min(1, skalarprodukt(ea, eb))));
  if (w < 1e-6) return [];
  const punktBei = (s: number) => plus(S, mal(r / Math.sin(w), plus(mal(Math.sin((1 - s) * w), ea), mal(Math.sin(s * w), eb))));
  return Array.from({ length: n }, (_, i) => ({ von: rund(punktBei(i / n)), bis: rund(punktBei((i + 1) / n)), farbe, breite: 1.6 }));
}

/** Mittelpunkte der Zahlen an den drei Achsen (x₂: unter der Achse, x₃: links der Achse, x₁: rechts unterhalb der schrägen Achse). */
const ACHSENZAHLEN: P2[] = [-4, -3, -2, -1, 1, 2, 3, 4].flatMap((k): P2[] => [[k, -0.42], [-0.42, k], x1ZahlMitte(k)]);

/**
 * Setzt den Namen des Winkels (α) als Text in den Winkel, auf der Halbierenden zwischen den Richtungen a und b, mit möglichst großem Abstand zu allen Linien, Achsen, Punkten
 * und den anderen Namen. Der Text ist ein `nurText`-Punkt mit der Farbe des Bogens.
 */
export function winkelName(name: string, S: number[], a: number[], b: number[], farbe: string, linien: RaumLinie[], punkte: RaumPunkt[], rBogen = 1): RaumPunkt | null {
  const ea = einheit(a);
  const eb = einheit(b);
  const w = Math.acos(Math.max(-1, Math.min(1, skalarprodukt(ea, eb))));
  const segmente: [P2, P2][] = linien.map((l) => [bildpunkt(l.von), bildpunkt(l.bis)]);
  const feste = punkte.map((p) => bildpunkt(p.p));
  const mitteBogen = bildpunkt(rund(plus(S, mal(rBogen, einheit(plus(ea, eb))))));
  const kandidaten: { p: Punkt3; score: number; dBogen: number }[] = [];
  // Stellen in der Ebene des Winkels, im Winkel und knapp daneben, mit ihrem Abstand zu allen langen Linien, Achsen und Punkten und zum Bogen
  for (let r = rBogen + 0.25; r <= 3.2; r += 0.1) {
    for (let f = -0.5; f <= 1.5001; f += 0.1) {
      const richtung = einheit(plus(mal(Math.sin((1 - f) * w), ea), mal(Math.sin(f * w), eb)));
      const c = rund(plus(S, mal(r, richtung)));
      if (!imWuerfel(c, 3.8)) continue;
      const bc = bildpunkt(c);
      // Die kurzen Strecken des Bogens zählen nicht (der Text steht außerhalb des Bogens), die langen Linien schon
      const score = Math.min(1.6, ...segmente.filter(([p, q]) => Math.hypot(q[0] - p[0], q[1] - p[1]) > 0.8).map(([p, q]) => abstandPunktStrecke(bc, p, q)), ...ACHSEN_BILD.map(([p, q]) => abstandPunktStrecke(bc, p, q)), ...ACHSENZAHLEN.map((z) => Math.hypot(z[0] - bc[0], z[1] - bc[1])), ...feste.map((fp) => 0.62 * Math.hypot(fp[0] - bc[0], fp[1] - bc[1])));
      kandidaten.push({ p: c, score, dBogen: Math.hypot(bc[0] - mitteBogen[0], bc[1] - mitteBogen[1]) });
    }
  }
  // Erst mit viel Abstand (0,34), dann mit weniger (0,28 und 0,24): jeweils die Stelle, die dem Bogen am nächsten liegt, sonst die mit dem größten Abstand
  for (const genug of [0.34, 0.28, 0.24]) {
    const gut = kandidaten.filter((k) => k.score >= genug).sort((x, y) => x.dBogen - y.dBogen)[0];
    if (gut) return { name, p: gut.p, nurText: true, farbe };
  }
  const beste = [...kandidaten].sort((x, y) => y.score - x.score)[0];
  return beste ? { name, p: beste.p, nurText: true, farbe } : null;
}

/** Größter Radius des Winkelbogens (bis 1,5), bei dem der ganze Bogen im Koordinatensystem liegt, mindestens 0,6. */
export function bogenRadius(S: number[], a: number[], b: number[]): number {
  for (const r of [1.5, 1.2, 1, 0.8]) if (winkelBogen(S, a, b, '#000', r).every((l) => imWuerfel([...l.von]) && imWuerfel([...l.bis]))) return r;
  return 0.6;
}

