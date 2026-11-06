/**
 * Gemeinsame Hilfen für Raumbilder mit Geraden (Module des Unterbereichs Geraden): beschriftete Punkte und die Namen der Geraden (g, h) als kleiner Text dicht an der Linie.
 */
import { geradeImWuerfel, type Gerade } from './gerade';
import { bildpunkt, type Punkt3, type RaumPunkt } from './schraegbild';

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

