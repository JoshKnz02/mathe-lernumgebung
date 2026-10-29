/**
 * Rechenlogik der Integralrechnung für die Hinführung: stückweise lineare Änderungsraten (Bestand und orientierte Fläche)
 * und Streifensummen (Unter- und Obersumme). Die Werte werden im Test gegen unabhängige Rechnungen geprüft.
 */

/** Ein Abschnitt einer stückweise linearen Änderungsrate: von t0 bis t1, linear von r0 nach r1. Die Abschnitte schließen lückenlos aneinander an. */
export interface Stueck {
  t0: number;
  t1: number;
  r0: number;
  r1: number;
}

/** Wert der Rate im Abschnitt p an der Stelle t (t liegt im Abschnitt). */
const imStueck = (p: Stueck, t: number) => p.r0 + ((p.r1 - p.r0) * (t - p.t0)) / (p.t1 - p.t0);

/** Rate an der Stelle t. An Sprungstellen gilt der Wert des rechten Abschnitts, am Ende der Wert des letzten Abschnitts. */
export function rateBei(s: Stueck[], t: number): number {
  const letzt = s[s.length - 1]!;
  if (t >= letzt.t1) return letzt.r1;
  const p = s.find((x) => t >= x.t0 && t < x.t1) ?? s[0]!;
  return imStueck(p, t);
}

/** Orientierte Fläche zwischen dem Schaubild der Rate und der Zeitachse von a bis b (oberhalb positiv, unterhalb negativ). */
export function bilanz(s: Stueck[], a: number, b: number): number {
  let summe = 0;
  for (const p of s) {
    const lo = Math.max(a, p.t0);
    const hi = Math.min(b, p.t1);
    if (hi > lo) summe += ((imStueck(p, lo) + imStueck(p, hi)) / 2) * (hi - lo);
  }
  return summe;
}

/** Bestand zur Zeit t bei Anfangsbestand b0 (Zeit beginnt beim ersten Abschnitt). */
export const bestand = (s: Stueck[], b0: number, t: number) => b0 + bilanz(s, s[0]!.t0, t);

/** Stellen im Inneren, an denen die Rate springt. */
export const sprungstellen = (s: Stueck[]): number[] => s.slice(1).filter((p, i) => Math.abs(p.r0 - s[i]!.r1) > 1e-12).map((p) => p.t0);

/** Eckpunkte des Schaubilds der Rate. An Sprungstellen steht [NaN, NaN] als Unterbrechung (kein senkrechter Strich). */
export function ratePunkte(s: Stueck[]): [number, number][] {
  const punkte: [number, number][] = [];
  s.forEach((p, i) => {
    punkte.push([p.t0, p.r0], [p.t1, p.r1]);
    const n = s[i + 1];
    if (n && Math.abs(n.r0 - p.r1) > 1e-12) punkte.push([NaN, NaN]);
  });
  return punkte;
}

/** Fläche zwischen dem Schaubild der Rate und der Zeitachse von a bis t als Eckpunkte eines Vielecks (für die Darstellung). */
export function flaechenPunkte(s: Stueck[], a: number, t: number): [number, number][] {
  const rand: [number, number][] = [[a, 0]];
  for (const p of s) {
    const lo = Math.max(a, p.t0);
    const hi = Math.min(t, p.t1);
    if (hi > lo) rand.push([lo, imStueck(p, lo)], [hi, imStueck(p, hi)]);
  }
  rand.push([t, 0]);
  return rand;
}

/** Teil eines Abschnitts oberhalb (pos) und unterhalb (neg) der Zeitachse von lo bis hi, jeweils als Vieleck mit vier Ecken (Dreiecke mit doppelter Ecke). */
export function formen(p: Stueck, lo: number, hi: number): { pos: [number, number][] | null; neg: [number, number][] | null } {
  if (hi <= lo) return { pos: null, neg: null };
  const a = imStueck(p, lo);
  const b = imStueck(p, hi);
  const vieleck = (x0: number, h0: number, x1: number, h1: number): [number, number][] => [[x0, 0], [x0, h0], [x1, h1], [x1, 0]];
  if (a >= 0 && b >= 0) return { pos: vieleck(lo, a, hi, b), neg: null };
  if (a <= 0 && b <= 0) return { pos: null, neg: vieleck(lo, a, hi, b) };
  const tz = lo + (a / (a - b)) * (hi - lo);
  return a > 0 ? { pos: vieleck(lo, a, tz, 0), neg: vieleck(tz, 0, hi, b) } : { pos: vieleck(tz, 0, hi, b), neg: vieleck(lo, a, tz, 0) };
}

/** Rechteck der Ersatzrate: Höhe = Gesamtänderung geteilt durch die Dauer. */
export const ersatzrate = (s: Stueck[]) => bilanz(s, s[0]!.t0, s[s.length - 1]!.t1) / (s[s.length - 1]!.t1 - s[0]!.t0);

/** Ein Streifen der Breite x1 − x0 mit dem kleinsten und größten Funktionswert darin. */
export interface Streifen {
  x0: number;
  x1: number;
  unten: number;
  oben: number;
}

/** Kleinster und größter Funktionswert auf [a, b], aus 2001 gleichmäßig verteilten Werten (die Stetigkeit der Funktionen im Modul genügt). */
export function minMax(f: (x: number) => number, a: number, b: number): [number, number] {
  let lo = Infinity;
  let hi = -Infinity;
  for (let i = 0; i <= 2000; i++) {
    const y = f(a + ((b - a) * i) / 2000);
    if (y < lo) lo = y;
    if (y > hi) hi = y;
  }
  return [lo, hi];
}

/** Zerlegung von [a, b] in n gleich breite Streifen. */
export function streifen(f: (x: number) => number, a: number, b: number, n: number): Streifen[] {
  return Array.from({ length: n }, (_, i) => {
    const x0 = a + ((b - a) * i) / n;
    const x1 = a + ((b - a) * (i + 1)) / n;
    const [unten, oben] = minMax(f, x0, x1);
    return { x0, x1, unten, oben };
  });
}

export const untersumme = (z: Streifen[]) => z.reduce((s, p) => s + (p.x1 - p.x0) * p.unten, 0);
export const obersumme = (z: Streifen[]) => z.reduce((s, p) => s + (p.x1 - p.x0) * p.oben, 0);

/** Trapezsumme für Messwerte im gleichen Abstand h. */
export function trapezsumme(werte: number[], h: number): number {
  return werte.slice(1).reduce((s, w, i) => s + ((werte[i]! + w) / 2) * h, 0);
}

/** Zahl mit deutschem Komma und höchstens n Nachkommastellen, ohne überflüssige Nullen, für Fließtext. */
export const zahl = (x: number, n = 1) => String(Math.round(x * 10 ** n) / 10 ** n).replace('.', ',').replace('-', '−');
/** Zahl als TeX mit Komma in geschweiften Klammern. */
export const zahlTeX = (x: number, n = 1) => String(Math.round(x * 10 ** n) / 10 ** n).replace('.', '{,}').replace('-', '-');
