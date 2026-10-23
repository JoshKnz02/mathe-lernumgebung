/**
 * Wertet Zahleneingaben von Lernenden aus. Erlaubt sind Dezimalzahlen mit Komma oder Punkt, Brüche und Vielfache von π:
 * 2, -1,5, 1/2, pi, 2pi, 3π/4, π/4, 3/4 π. Gibt null zurück, wenn die Eingabe nicht gelesen werden kann.
 */
export function parseZahl(eingabe: string): number | null {
  const text = eingabe.trim().replace(/[−–]/g, '-').replace(/\s+/g, '');
  const zahl = '\\d+(?:[.,]\\d+)?';
  const muster = new RegExp(`^([+-])?(${zahl})?(?:\\*?(π|pi))?(?:/(${zahl}))?(?:\\*?(π|pi))?$`, 'i');
  const m = muster.exec(text);
  if (!m) return null;
  const [, vorzeichen, zaehlerText, pi1, nennerText, pi2] = m;
  const hatPi = Boolean(pi1 ?? pi2);
  if (zaehlerText === undefined && !hatPi) return null;
  if (pi1 && pi2) return null;
  const lies = (t: string) => Number(t.replace(',', '.'));
  let wert = zaehlerText === undefined ? 1 : lies(zaehlerText);
  if (nennerText !== undefined) {
    const n = lies(nennerText);
    if (n === 0) return null;
    wert /= n;
  }
  if (hatPi) wert *= Math.PI;
  return vorzeichen === '-' ? -wert : wert;
}

/** Vergleicht eine Eingabe mit dem erwarteten Wert. toleranz ist absolut (Standard: nur Rundungsfehler). */
export function istRichtig(eingabe: string, erwartet: number, toleranz = 1e-9): boolean {
  const x = parseZahl(eingabe);
  return x !== null && Math.abs(x - erwartet) <= toleranz;
}

export type Urteil = 'richtig' | 'falsch' | 'ungueltig';

export interface Erwartung {
  id: string;
  erwartet: number;
  /** Absolute Toleranz, z. B. 0.01 für gerundete Dezimalwerte. */
  toleranz?: number;
}

/** Bewertet alle Eingaben einer Aufgabe. Leere oder nicht lesbare Eingaben gelten als "ungueltig". */
export function bewerte(erwartungen: Erwartung[], eingaben: Record<string, string>): Record<string, Urteil> {
  const ergebnis: Record<string, Urteil> = {};
  for (const e of erwartungen) {
    const text = eingaben[e.id] ?? '';
    ergebnis[e.id] = parseZahl(text) === null ? 'ungueltig' : istRichtig(text, e.erwartet, e.toleranz) ? 'richtig' : 'falsch';
  }
  return ergebnis;
}
