import { loeseGleichung, type Gleichung } from '@/lib/gleichungen';
import { bereiche, datum30, kosinusModell, minuten, sinusModell } from '@/lib/modell';

const PI = Math.PI;

/** Hilfsfunktion: Gleichung mit den Parametern des Modells und dem Schwellenwert e im Intervall. */
const gleichung = (funktion: 'sin' | 'cos', p: { a: number; b: number; c: number; d: number }, e: number, intervall: [number, number]): Gleichung => ({ funktion, ...p, e, intervall });

/* ---------- Aufgabe 1: Wasserstand im Hafen (Einstiegsproblem) ---------- */
export const HAFEN_DATEN = { ymax: 11.6, ymin: 5.4, periode: 12, xHoch: 2 };
export const HAFEN = kosinusModell(HAFEN_DATEN); // a = 3,1, b = π/6, c = 2, d = 8,5
export const HAFEN_G = gleichung('cos', HAFEN, 11, [0, 24]);
export const HAFEN_E = (() => {
  const b = bereiche(HAFEN_G, 'ueber');
  return {
    bereiche: b,
    // Beginn wird nach oben, Ende nach unten auf die Minute gerundet, damit die Wassertiefe im ganzen Zeitraum reicht.
    min: [minuten(b[0]!.von, 'auf'), minuten(b[0]!.bis, 'ab'), minuten(b[1]!.von, 'auf'), minuten(b[1]!.bis, 'ab')] as const,
  };
})();

/* ---------- Aufgabe 2: Luftvolumen in der Lunge ---------- */
export const LUNGE_DATEN = { ymax: 4.5, ymin: 1.5, periode: 5 };
/** Tiefpunkt bei x = 0: f(x) = −1,5 · cos(2π/5 · x) + 3. */
export const LUNGE = { a: -1.5, b: (2 * PI) / 5, c: 0, d: 3 };
export const LUNGE_G = gleichung('cos', LUNGE, 2.25, [0, 13]);
export const LUNGE_E = (() => {
  const x = loeseGleichung(gleichung('cos', LUNGE, 2.25, [0, 10])).map((l) => l.x);
  return { min: LUNGE_DATEN.ymin, periode: LUNGE_DATEN.periode, halbesMaximum: LUNGE_DATEN.ymax / 2, alle: x, drei: [x[0]!, x[1]!, x[2]!] as const };
})();

/* ---------- Aufgabe 3: Preisentwicklung ---------- */
export const PREIS = { a: 50, b: PI / 180, c: 0, d: 200 };
export const PREIS_G = gleichung('cos', PREIS, 175, [0, 360]);
export const PREIS_E = (() => {
  const unter = bereiche(PREIS_G, 'unter');
  const g = unter[0]!;
  const tMin = 180;
  // Monate, in denen an allen Tagen der Preis unter 175 € liegt (30-Tage-Monate, Grenztage gehören nicht dazu).
  const monate: number[] = [];
  for (let m = 1; m <= 12; m++) {
    const ersterTag = 30 * (m - 1) + 1;
    const letzterTag = 30 * m;
    if (ersterTag > g.von + 1e-9 && letzterTag < g.bis - 1e-9) monate.push(m);
  }
  return { ymax: 250, ymin: 150, tMin, datumMin: datum30(tMin), von: g.von, bis: g.bis, monate };
})();

/* ---------- Aufgabe 4: Temperaturverlauf ---------- */
export const STUTTGART_TABELLE = [-2.1, -0.9, 3.3, 8, 12.5, 15.8, 17.5, 16.6, 13.4, 7.9, 3.0, -0.7] as const;
export const MONATE = ['Jan', 'Feb', 'März', 'April', 'Mai', 'Juni', 'Juli', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'] as const;
/** Jan = 0,5 bis Dez = 11,5. */
export const STUTTGART_PUNKTE = STUTTGART_TABELLE.map((y, i) => ({ x: i + 0.5, y }));
/** Sinus: größter Wert im Juli (x = 6,5), kleinster im Januar (x = 0,5), Periode 12 Monate. */
export const STUTTGART = sinusModell({ ymax: 17.5, ymin: -2.1, periode: 12, xHoch: 6.5 }); // a = 9,8, b = π/6, c = 3,5, d = 7,7
export const FREIBURG = { a: 9.7, b: PI / 12, c: 9.4, d: 14.8 };
export const FREIBURG_G = gleichung('sin', FREIBURG, 20, [0, 24]);
export const FREIBURG_E = (() => {
  const b = bereiche(FREIBURG_G, 'ueber');
  return { min: FREIBURG.d - FREIBURG.a, max: FREIBURG.d + FREIBURG.a, von: b[0]!.von, bis: b[0]!.bis, dauer: b[0]!.bis - b[0]!.von };
})();

/** Größte Abweichung der Modellwerte von den Tabellenwerten, in °C. */
export const grossteAbweichung = (p: { a: number; b: number; c: number; d: number }) =>
  Math.max(...STUTTGART_PUNKTE.map((q) => Math.abs(p.a * Math.sin(p.b * (q.x - p.c)) + p.d - q.y)));

/* ---------- Gemischte Aufgaben ---------- */
/** Gemischt 1: g(x) = 2 · [sin(π/2 · x − π/2) + 1/2] = 2 · sin(π/2 · (x − 1)) + 1. */
export const G1 = { a: 2, b: PI / 2, c: 1, d: 1 };
export const G1_E = { periode: 4, w1: { x: 1, y: 1 }, w2: { x: 3, y: 1 } };

/** Gemischt 2: Sonnenscheindauer in Stunden, t in Tagen ab 1. Januar (365 Tage). Längster Tag 21.6. (Tag 172), kürzester 21.12. (Tag 355). */
export const SONNE_DATEN = { ymax: 16.5, ymin: 8, periode: 365, xHoch: 172 };
export const SONNE = kosinusModell(SONNE_DATEN); // a = 4,25, b = 2π/365, c = 172, d = 12,25
export const SONNE_G = gleichung('cos', SONNE, 14, [0, 365]);
export const SONNE_E = (() => {
  const b = bereiche(SONNE_G, 'ueber')[0]!;
  return { von: b.von, bis: b.bis, tage: b.bis - b.von };
})();

/** Gemischt 3: x · sin(x) = x für x aus [−1; 2], Julian teilt durch x. */
export const JULIAN = { intervall: [-1, 2] as [number, number], loesungen: [0, PI / 2] as const };

/** Gemischt 6: g_a(x) = a + a · cos(x) auf [−2π; 2π], vier Abbildungen. */
export const GA_ABBILDUNGEN = [
  { nr: 1, term: '2+2\\cos(x)', f: (x: number) => 2 + 2 * Math.cos(x), gehoert: true, a: 2 },
  { nr: 2, term: '-1{,}5-1{,}5\\cos(x)', f: (x: number) => -1.5 - 1.5 * Math.cos(x), gehoert: true, a: -1.5 },
  { nr: 3, term: '1{,}5-1{,}5\\cos(x)', f: (x: number) => 1.5 - 1.5 * Math.cos(x), gehoert: false, a: NaN },
  { nr: 4, term: '3+3\\cos(\\tfrac{x}{2})', f: (x: number) => 3 + 3 * Math.cos(x / 2), gehoert: false, a: NaN },
] as const;
export const ga = (a: number, x: number) => a + a * Math.cos(x);

/** Gemischt 7: f_a(x) = 1/a − a · sin(x) für 0 < x < 2π. Der kleinste Wert ist 1/a − a (bei x = π/2). */
export const fa = (a: number, x: number) => 1 / a - a * Math.sin(x);
export const fKleinsterWert = (a: number) => 1 / a - a;
export const FA_GRENZE = 1;
