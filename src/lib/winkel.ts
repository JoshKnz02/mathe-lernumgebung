/** Umrechnung nach der Verhältnisgleichung α / 360° = x / (2π). */
export const gradZuBogen = (grad: number) => (grad * Math.PI) / 180;
export const bogenZuGrad = (x: number) => (x * 180) / Math.PI;

/** Punkt auf dem Einheitskreis zum Bogenmaß x (Drehung gegen den Uhrzeigersinn, bei negativem x im Uhrzeigersinn). */
export const punktAmEinheitskreis = (x: number) => ({ x: Math.cos(x), y: Math.sin(x) });

/** Gradzahl als Text, z. B. "30°", "−45°", "114,59°". */
export function gradText(grad: number): string {
  const r = Math.round(grad * 100) / 100;
  return `${String(Object.is(r, -0) ? 0 : r).replace('.', ',').replace('-', '−')}°`;
}

/** Auswertung einer Auswahlfrage mit genau einer richtigen Antwort. */
export type AuswahlUrteil = 'richtig' | 'falsch' | 'offen';
export function bewerteAuswahl(optionen: { id: string; richtig: boolean }[], gewaehlt: string | null): AuswahlUrteil {
  if (gewaehlt === null) return 'offen';
  return optionen.find((o) => o.id === gewaehlt)?.richtig ? 'richtig' : 'falsch';
}
