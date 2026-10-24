import { loesungen, unterschied, type Gleichung } from './gleichungen.ts';
import type { SinusParameter } from './sinus.ts';

const ZWEI_PI = 2 * Math.PI;

/** Angaben aus einer Sachsituation: größter und kleinster Wert, Periode und die Stelle eines Hochpunkts. */
export interface Extremdaten {
  ymax: number;
  ymin: number;
  periode: number;
  xHoch: number;
}

/** Kosinusmodell f(x) = a · cos(b(x − c)) + d mit Hochpunkt bei x = c (a > 0, b > 0). */
export function kosinusModell({ ymax, ymin, periode, xHoch }: Extremdaten): SinusParameter {
  return { a: (ymax - ymin) / 2, b: ZWEI_PI / periode, c: xHoch, d: (ymax + ymin) / 2 };
}

/** Sinusmodell f(x) = a · sin(b(x − c)) + d, c ist der aufsteigende Wendepunkt eine Viertelperiode vor dem Hochpunkt. */
export function sinusModell({ ymax, ymin, periode, xHoch }: Extremdaten): SinusParameter {
  return { a: (ymax - ymin) / 2, b: ZWEI_PI / periode, c: xHoch - periode / 4, d: (ymax + ymin) / 2 };
}

export interface Bereich {
  von: number;
  bis: number;
}

/**
 * Zusammenhängende Bereiche im Intervall der Gleichung, in denen die linke Seite a · f(b(x − c)) + d größer (ueber) bzw. kleiner (unter)
 * als e ist. Die Grenzen sind die Lösungen der Gleichung (Randwerte des Intervalls eingeschlossen). Berührstellen ergeben keinen Bereich.
 */
export function bereiche(g: Gleichung, art: 'ueber' | 'unter'): Bereich[] {
  const [von, bis] = g.intervall;
  const s = (g.e - g.d) / g.a;
  const nullstellen = loesungen(g.funktion, s, g.b, g.c, von, bis).map((l) => l.x);
  const grenzen = [von, ...nullstellen.filter((x) => x > von + 1e-12 && x < bis - 1e-12), bis];
  const ergebnis: Bereich[] = [];
  for (let i = 0; i + 1 < grenzen.length; i++) {
    const l = grenzen[i]!;
    const r = grenzen[i + 1]!;
    if (r - l < 1e-12) continue;
    const mitte = unterschied(g, (l + r) / 2);
    if ((art === 'ueber' && mitte > 0) || (art === 'unter' && mitte < 0)) {
      const letzter = ergebnis[ergebnis.length - 1];
      if (letzter && Math.abs(letzter.bis - l) < 1e-12) letzter.bis = r;
      else ergebnis.push({ von: l, bis: r });
    }
  }
  return ergebnis;
}

/** Dezimalstunden als Uhrzeit h:mm. runden: "auf" und "ab" für Grenzen, die sicher innerhalb des Zeitraums liegen sollen. */
export function uhrzeit(stunden: number, runden: 'nah' | 'auf' | 'ab' = 'nah'): string {
  const exakt = stunden * 60;
  const m = runden === 'auf' ? Math.ceil(exakt - 1e-9) : runden === 'ab' ? Math.floor(exakt + 1e-9) : Math.round(exakt);
  const h = Math.floor(m / 60);
  return `${h}:${String(m - 60 * h).padStart(2, '0')}`;
}

/** Minuten nach Mitternacht, gerundet wie bei uhrzeit. */
export function minuten(stunden: number, runden: 'nah' | 'auf' | 'ab' = 'nah'): number {
  const exakt = stunden * 60;
  return runden === 'auf' ? Math.ceil(exakt - 1e-9) : runden === 'ab' ? Math.floor(exakt + 1e-9) : Math.round(exakt);
}

/** Datum bei Monaten mit je 30 Tagen: t = 1 ist der 1. Januar. */
export function datum30(t: number): { tag: number; monat: number } {
  const monat = Math.ceil(t / 30);
  return { tag: t - 30 * (monat - 1), monat };
}
