import { loeseGleichung, loesungen, periodeGleichung, rechteSeite, type Gleichung, type Grundfunktion, type Loesung } from '@/lib/gleichungen';

const PI = Math.PI;

export type { Gleichung, Grundfunktion };

/** Startwerte und Reglerbereiche der Labore. In diesem Modul ist b > 0. */
export const LABOR_START = { funktion: 'sin' as Grundfunktion, s: 0.5, b: 1, c: 0, intervall: 0 };
export const REGLER = {
  s: { min: -1.5, max: 1.5, step: 0.05 },
  b: { min: 0.5, max: 4, step: 0.5 },
  c: { min: -PI, max: PI, step: PI / 4 },
} as const;

/** Intervalle, zwischen denen die Labore wählen lassen (TeX für die Anzeige). */
export const INTERVALLE: { von: number; bis: number; tex: string; text: string }[] = [
  { von: 0, bis: 2 * PI, tex: String.raw`[0;\,2\pi]`, text: '[0; 2π]' },
  { von: -2 * PI, bis: 2 * PI, tex: String.raw`[-2\pi;\,2\pi]`, text: '[−2π; 2π]' },
  { von: 0, bis: 4 * PI, tex: String.raw`[0;\,4\pi]`, text: '[0; 4π]' },
];

/** Schnellwahl für die rechte Seite s: die exakten Werte der Tabelle (TeX für die Anzeige). */
export const SCHNELLWAHL: { s: number; tex: string; text: string }[] = [
  { s: -1, tex: '-1', text: '−1' },
  { s: -Math.sqrt(3) / 2, tex: String.raw`-\tfrac{1}{2}\sqrt{3}`, text: '−1/2 √3' },
  { s: -Math.SQRT1_2, tex: String.raw`-\tfrac{1}{2}\sqrt{2}`, text: '−1/2 √2' },
  { s: -0.5, tex: String.raw`-\tfrac{1}{2}`, text: '−1/2' },
  { s: 0, tex: '0', text: '0' },
  { s: 0.5, tex: String.raw`\tfrac{1}{2}`, text: '1/2' },
  { s: Math.SQRT1_2, tex: String.raw`\tfrac{1}{2}\sqrt{2}`, text: '1/2 √2' },
  { s: Math.sqrt(3) / 2, tex: String.raw`\tfrac{1}{2}\sqrt{3}`, text: '1/2 √3' },
  { s: 1, tex: '1', text: '1' },
];

/** Gleichung der Aufgaben ausrechnen: rechte Seite der Hilfsgleichung, Periode und alle Lösungen im Intervall. */
const loese = (g: Gleichung) => ({ g, s: rechteSeite(g), p: periodeGleichung(g), loesungen: loeseGleichung(g) });
const xs = (l: Loesung[]) => l.map((q) => q.x);

const S3 = Math.sqrt(3);

/** Aufgabe 1: sin(x) = 1/2 in [0; 2π]. */
export const G1: Gleichung = { funktion: 'sin', a: 1, b: 1, c: 0, d: 0, e: 0.5, intervall: [0, 2 * PI] };
/** Aufgabe 2: cos(x) = −1/2 in [0; 2π]. */
export const G2: Gleichung = { funktion: 'cos', a: 1, b: 1, c: 0, d: 0, e: -0.5, intervall: [0, 2 * PI] };
/** Aufgabe 3: sin(x) = −0,8 in [0; 2π], Taschenrechner. */
export const G3: Gleichung = { funktion: 'sin', a: 1, b: 1, c: 0, d: 0, e: -0.8, intervall: [0, 2 * PI] };
/** Aufgabe 5: −√3 + 2 sin(x) = 0 in [0; 4π] (Beispiel 1 des Arbeitsblatts, mit Intervall). */
export const G5: Gleichung = { funktion: 'sin', a: 2, b: 1, c: 0, d: -S3, e: 0, intervall: [0, 4 * PI] };
/** Aufgabe 6: 3 cos(x) + 2 = 1 in [−π; π], Taschenrechner. */
export const G6: Gleichung = { funktion: 'cos', a: 3, b: 1, c: 0, d: 2, e: 1, intervall: [-PI, PI] };
/** Aufgabe 7: 5 cos(4x) + 10 = 12,5 in [0; π] (Beispiel 2 des Arbeitsblatts, mit Intervall). */
export const G7: Gleichung = { funktion: 'cos', a: 5, b: 4, c: 0, d: 10, e: 12.5, intervall: [0, PI] };
/** Aufgabe 8: 2 sin(2(x − π/4)) + 1 = 2 in [0; 2π]. */
export const G8: Gleichung = { funktion: 'sin', a: 2, b: 2, c: PI / 4, d: 1, e: 2, intervall: [0, 2 * PI] };
/** Aufgabe 9: 1,5 cos(0,5(x − 1)) + 2 = 3 in [0; 4π], Taschenrechner. */
export const G9: Gleichung = { funktion: 'cos', a: 1.5, b: 0.5, c: 1, d: 2, e: 3, intervall: [0, 4 * PI] };
/** Aufgabe 10: Wasserstand h(t) = 1,5 sin(π/6 · (t − 2)) + 4 an einem Tag, h(t) = 4,75. */
export const G10: Gleichung = { funktion: 'sin', a: 1.5, b: PI / 6, c: 2, d: 4, e: 4.75, intervall: [0, 24] };

export const E1 = loese(G1);
export const E2 = loese(G2);
export const E3 = (() => {
  const r = loese(G3);
  return { ...r, x1: Math.asin(r.s), links: xs(r.loesungen)[0]!, rechts: xs(r.loesungen)[1]! };
})();
export const E5 = loese(G5);
export const E6 = (() => {
  const r = loese(G6);
  return { ...r, x1: Math.acos(r.s), links: xs(r.loesungen)[0]!, rechts: xs(r.loesungen)[1]! };
})();
export const E7 = (() => {
  const r = loese(G7);
  return { ...r, z1: Math.acos(r.s) };
})();
export const E8 = (() => {
  const r = loese(G8);
  return { ...r, z1: Math.asin(r.s) };
})();
export const E9 = (() => {
  const r = loese(G9);
  return { ...r, links: xs(r.loesungen)[0]!, rechts: xs(r.loesungen)[1]! };
})();
export const E10 = loese(G10);

/** Aufgabe 4a: sin(x) = 0,3, Taschenrechner x1 und die zweite Lösung in [0; 2π]. */
export const F4A = { s: 0.3, x1: Math.asin(0.3), zweite: PI - Math.asin(0.3) };
/** Aufgabe 4b: cos(x) = 0,2 in [−π; π]. */
export const F4B = { s: 0.2, x1: Math.acos(0.2), zweite: -Math.acos(0.2) };

/** Parameteraufgabe nach dem Bildungsplan: 0 = t · sin(x) + 3 im Intervall [0; 2π]. */
export const PARAMETER = { d: 3, intervall: [0, 2 * PI] as [number, number], regler: { min: -6, max: 6, step: 0.5 }, start: 4 };
/** Lösungen von 0 = t · sin(x) + 3 in [0; 2π]. Für t = 0 ist die Gleichung 0 = 3 und hat keine Lösung. */
export const parameterLoesungen = (t: number): Loesung[] =>
  t === 0 ? [] : loesungen('sin', -PARAMETER.d / t, 1, 0, PARAMETER.intervall[0], PARAMETER.intervall[1]);
/** Aufgabe 11: Anzahl der Lösungen für t = 2, 3, 5 und die Lösung für t = −3. */
export const E11 = { t2: parameterLoesungen(2).length, t3: parameterLoesungen(3).length, t5: parameterLoesungen(5).length, xMinus3: parameterLoesungen(-3)[0]?.x ?? NaN, anzahlMinus3: parameterLoesungen(-3).length };

/** Beispiel aus dem Labor und der Zusammenfassung: sin(x) = 0,75 (Arbeitsblatt 4 der Lehrkraft). */
export const BEISPIEL075 = (() => {
  const x1 = Math.asin(0.75);
  return {
    x1,
    x2: PI - x1,
    imBereichA: loesungen('sin', 0.75, 1, 0, 0, 4 * PI).map((l) => l.x),
    imBereichB: loesungen('sin', 0.75, 1, 0, -2 * PI, 2 * PI).map((l) => l.x),
  };
})();

/** Aufgabe 7: alle Lösungen von sin(x) = 0,63 für x aus R. */
export const E7ALLE = (() => {
  const x1 = Math.asin(0.63);
  const x2 = PI - x1;
  return { r: 0.63, x1, x2, ersteMitKMinus1: x1 - 2 * PI, zweiteMitK2: x2 + 4 * PI };
})();

/** Aufgabe 8: cos(x) = −0,55 im Intervall [−π; 4π], Lösungen über x = ±x1 + k · 2π. */
export const G8K: Gleichung = { funktion: 'cos', a: 1, b: 1, c: 0, d: 0, e: -0.55, intervall: [-PI, 4 * PI] };
export const E8K = (() => {
  const l = loeseGleichung(G8K).map((q) => q.x);
  return { x1: Math.acos(-0.55), x2: -Math.acos(-0.55), loesungen: l, anzahl: l.length, kleinste: l[0]!, groesste: l[l.length - 1]! };
})();
