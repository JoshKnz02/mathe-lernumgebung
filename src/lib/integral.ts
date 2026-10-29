/**
 * Numerische Berechnung bestimmter Integrale für die Labore (Simpson-Regel mit vielen Streifen). Der Wert ist orientiert:
 * Vertauscht man die Grenzen, ändert sich das Vorzeichen. Für die glatten Funktionen der Module liegt der Fehler weit unter 1e-9.
 * Die Tests vergleichen die Werte mit den von Hand bestimmten Integralen.
 */
export function integral(f: (x: number) => number, a: number, b: number, n = 2000): number {
  if (a === b) return 0;
  const m = n % 2 === 0 ? n : n + 1;
  const h = (b - a) / m;
  let s = f(a) + f(b);
  for (let i = 1; i < m; i++) s += f(a + i * h) * (i % 2 === 0 ? 2 : 4);
  const wert = (s * h) / 3;
  return Object.is(wert, -0) ? 0 : wert;
}

/** Wert auf drei Nachkommastellen gerundet, sehr kleine Werte als 0 (kein „−0“). */
export const rundeIntegral = (x: number): number => {
  const r = Math.round(x * 1000) / 1000;
  return Math.abs(r) < 5e-4 ? 0 : r;
};
