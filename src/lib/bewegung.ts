/**
 * Bewegungsabläufe im Punktmodell (Modul modellieren-geraden): Ein Objekt startet im Punkt p, fliegt in Richtung u mit dem Tempo w (Längeneinheiten je Stunde)
 * und hat den Geschwindigkeitsvektor v = w · u / |u|. Zur Zeit t ≥ 0 (in Stunden ab Beobachtungsbeginn) ist es im Punkt p + t · v.
 * Die Bibliothek rechnet mit Zahlenlisten (siehe `vektor.ts`). Die Bahn ist die Gerade x = p + t · v, die Bewegung nur der Teil mit t ≥ 0.
 */
import { lageZweier, type GeradenLage } from './gerade';
import { betrag, skalarprodukt, vielfaches, zielpunkt, type Vek } from './vektor';

export interface Bewegung {
  /** Startpunkt zur Zeit t = 0. */
  start: Vek;
  /** Richtung der Bewegung (nicht der Nullvektor), nur die Richtung zählt. */
  richtung: Vek;
  /** Tempo in Längeneinheiten je Stunde (Betrag des Geschwindigkeitsvektors). */
  tempo: number;
}

const EPS = 1e-9;
const sauber = (x: number) => Math.round(x * 1e9) / 1e9 + 0;
const saubereListe = (v: Vek): Vek => v.map(sauber);

/** Geschwindigkeitsvektor v = Tempo mal Einheitsvektor der Richtung. Seine Länge ist das Tempo. */
export function geschwindigkeit(b: Bewegung): Vek {
  const n = betrag(b.richtung);
  if (n <= EPS) throw new Error('Der Richtungsvektor darf nicht der Nullvektor sein.');
  return saubereListe(vielfaches(b.tempo / n, b.richtung));
}

/** Ort zur Zeit t (in Stunden): p + t · v. */
export const ort = (b: Bewegung, t: number): Vek => saubereListe(zielpunkt(b.start, vielfaches(t, geschwindigkeit(b))));

/** Die Bahn als Gerade x = p + t · v mit der Zeit t als Parameter. */
export const bahn = (b: Bewegung): { p: Vek; u: Vek } => ({ p: b.start, u: geschwindigkeit(b) });

/** Zurückgelegte Strecke bis zur Zeit t: Tempo mal t. */
export const strecke = (b: Bewegung, t: number): number => b.tempo * t;

/** Zeit, zu der das Objekt den Punkt x auf seiner Bahn erreicht (kann negativ sein, dann war es dort vor dem Beobachtungsbeginn), oder null, wenn x nicht auf der Bahn liegt. */
export function zeitAmPunkt(b: Bewegung, x: Vek): number | null {
  const v = geschwindigkeit(b);
  const i = v.findIndex((c) => Math.abs(c) > EPS);
  if (i < 0) return null;
  const t = (x[i]! - b.start[i]!) / v[i]!;
  const p = ort(b, t);
  return p.every((c, j) => Math.abs(c - x[j]!) <= 1e-7) ? sauber(t) : null;
}

/** Stunden in ganze Minuten und Sekunden (Sekunden mit Nachkommastellen). */
export function minutenSekunden(t: number): { minuten: number; sekunden: number } {
  const s = t * 3600;
  const minuten = Math.floor(s / 60 + 1e-5);
  return { minuten, sekunden: Math.round((s - minuten * 60) * 1e4) / 1e4 + 0 };
}

/** Quadrat des Abstands zur selben Zeit als Polynom a t² + b t + c: |x₂(t) − x₁(t)|² mit Δp = p₂ − p₁ und Δv = v₂ − v₁. */
export function abstandsquadrat(b1: Bewegung, b2: Bewegung): { a: number; b: number; c: number } {
  const dp = b2.start.map((c, i) => c - b1.start[i]!);
  const dv = geschwindigkeit(b2).map((c, i) => c - geschwindigkeit(b1)[i]!);
  return { a: sauber(skalarprodukt(dv, dv)), b: sauber(2 * skalarprodukt(dp, dv)), c: sauber(skalarprodukt(dp, dp)) };
}

/** Abstand der beiden Objekte zur Zeit t. */
export const abstandZurZeit = (b1: Bewegung, b2: Bewegung, t: number): number => {
  const { a, b, c } = abstandsquadrat(b1, b2);
  return Math.sqrt(Math.max(0, a * t * t + b * t + c));
};

export interface KleinsterAbstand {
  /** Zeit des kleinsten Abstands (für t ≥ tMin). */
  t: number;
  d: number;
  d2: number;
  /** Der Scheitel liegt vor tMin, der kleinste Wert steht deshalb am Rand t = tMin. */
  amRand: boolean;
  /** Zeit des Scheitels von d(t)² (kann negativ sein), null, wenn die Abstandsfunktion konstant ist. */
  scheitel: number | null;
}

/**
 * Kleinster Abstand der beiden Objekte zur selben Zeit für t ≥ tMin (Standard 0). Die Abstandsfunktion d(t)² = a t² + b t + c hat bei a > 0 den Scheitel bei −b/(2a),
 * liegt er vor tMin, steht das Minimum am Rand. Bei a = 0 (gleiche Geschwindigkeit) ist der Abstand konstant.
 */
export function kleinsterAbstand(b1: Bewegung, b2: Bewegung, tMin = 0): KleinsterAbstand {
  const { a, b, c } = abstandsquadrat(b1, b2);
  if (a <= EPS) return { t: tMin, d: Math.sqrt(Math.max(0, b * tMin + c)), d2: sauber(b * tMin + c), amRand: false, scheitel: null };
  const scheitel = -b / (2 * a);
  const t = Math.max(tMin, scheitel);
  const d2 = a * t * t + b * t + c;
  return { t: sauber(t), d: Math.sqrt(Math.max(0, d2)), d2: sauber(d2), amRand: scheitel < tMin - EPS, scheitel: sauber(scheitel) };
}

export interface Begegnung {
  /** Beide Objekte sind zu derselben Zeit t ≥ 0 am selben Ort. */
  kollision: { t: number; punkt: Vek } | null;
  /** Lage der beiden Bahnen (mit den Zeiten t₁ und t₂ als Parametern, wenn sie sich schneiden). */
  bahnen: GeradenLage;
  /** Zeiten, zu denen die Objekte den Schnittpunkt der Bahnen erreichen (bei schneidenden Bahnen), sonst null. */
  zeiten: { t1: number; t2: number } | null;
}

/**
 * Begegnung zweier Objekte: Eine Kollision im Punktmodell braucht denselben Ort **zur selben Zeit t ≥ 0** (Δp + t · Δv = 0). Der Schnittpunkt der Bahnen genügt nicht,
 * dort kommen die Objekte im Allgemeinen zu verschiedenen Zeiten an.
 */
export function begegnung(b1: Bewegung, b2: Bewegung): Begegnung {
  const g1 = bahn(b1);
  const g2 = bahn(b2);
  const lage = lageZweier(g1, g2);
  const dp = b2.start.map((c, i) => c - b1.start[i]!);
  const dv = geschwindigkeit(b2).map((c, i) => c - geschwindigkeit(b1)[i]!);
  let kollision: Begegnung['kollision'] = null;
  const aa = skalarprodukt(dv, dv);
  if (aa <= EPS) {
    if (dp.every((c) => Math.abs(c) <= 1e-7)) kollision = { t: 0, punkt: ort(b1, 0) };
  } else {
    const t = -skalarprodukt(dp, dv) / aa;
    const rest = dp.map((c, i) => c + t * dv[i]!);
    if (t >= -EPS && rest.every((c) => Math.abs(c) <= 1e-7)) kollision = { t: sauber(Math.max(0, t)), punkt: ort(b1, Math.max(0, t)) };
  }
  return { kollision, bahnen: lage, zeiten: lage.art === 'schneidend' && lage.t !== null && lage.s !== null ? { t1: sauber(lage.t), t2: sauber(lage.s) } : null };
}
