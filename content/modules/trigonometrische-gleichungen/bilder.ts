import type { Grundfunktion } from '@/lib/gleichungen';

const PI = Math.PI;

/** Farben der beiden Lösungsarten und der Abstandsstrecken. */
export const GRUEN = '#15803d';
export const ORANGE = '#c2410c';
export const GRAU = '#475569';

export interface BildPunkt {
  x: number;
  y: number;
  /** 1: Typ 1 (Kreis, grün), 2: Typ 2 (Quadrat, orange) */
  art: 1 | 2;
  text?: string;
  /** Punkt liegt außerhalb des Intervalls und wird blass gezeigt. */
  blass?: boolean;
  /** Beschriftung links vom Punkt statt darüber bzw. darunter. */
  textLinks?: boolean;
  /** Beschriftung rechts vom Punkt. */
  textRechts?: boolean;
}

/** Waagerechte Strecke mit Beschriftung, z. B. für einen Abstand auf der x-Achse. */
export interface BildKlammer {
  von: number;
  bis: number;
  y: number;
  farbe: string;
  text: string;
  /** Beschriftung unter statt über der Strecke (Standard: unter). */
  textOben?: boolean;
}

export interface BildDaten {
  funktion: Grundfunktion;
  r: number;
  /** [xmin, xmax, ymin, ymax] */
  bereich: [number, number, number, number];
  xTeilung: number;
  punkte: BildPunkt[];
  klammern: BildKlammer[];
  /** Intervall, in dem gesucht wird (wird auf der x-Achse hervorgehoben). */
  intervall?: [number, number];
  /** Nur dieser Abschnitt der Kurve wird kräftig gezeichnet, der Rest grau. */
  hervorgehoben?: [number, number];
  beschreibung: string;
}

const Y_UNTEN = -0.32;

/** Zweite Lösung beim Sinus: Der Abstand von x₂ zu π ist so groß wie der Abstand von x₁ zu 0. */
export function bildSinusZweite(r = 0.75): BildDaten {
  const x1 = Math.asin(r);
  const x2 = PI - x1;
  return {
    funktion: 'sin',
    r,
    bereich: [-0.7, PI + 0.7, -0.75, 1.3],
    xTeilung: PI / 2,
    punkte: [
      { x: x1, y: r, art: 1, text: 'x₁' },
      { x: x2, y: r, art: 2, text: 'x₂' },
    ],
    klammern: [
      { von: 0, bis: x1, y: Y_UNTEN, farbe: GRUEN, text: 'x₁' },
      { von: x2, bis: PI, y: Y_UNTEN, farbe: GRUEN, text: 'x₁' },
    ],
    beschreibung: `Schaubild von sinus x mit der Geraden y gleich ${String(r).replace('.', ',')}. Die erste Lösung x1 liegt rechts von 0, die zweite Lösung x2 links von π. Beide Strecken, von 0 bis x1 und von x2 bis π, sind gleich lang.`,
  };
}

/** Sinus mit negativem r: x₁ liegt links von 0, x₂ rechts von π, wieder mit gleichem Abstand. */
export function bildSinusNegativ(r = -0.5): BildDaten {
  const x1 = Math.asin(r);
  const x2 = PI - x1;
  return {
    funktion: 'sin',
    r,
    bereich: [-1.2, 2 * PI + 0.5, -1.45, 1.1],
    xTeilung: PI / 2,
    intervall: [0, 2 * PI],
    punkte: [
      { x: x1, y: r, art: 1, text: 'x₁', blass: true },
      { x: x2, y: r, art: 2, text: 'x₂' },
      { x: x1 + 2 * PI, y: r, art: 1, text: 'x₁ + 2π' },
    ],
    klammern: [
      { von: x1, bis: 0, y: 0.3, farbe: GRUEN, text: 'gleich lang', textOben: true },
      { von: PI, bis: x2, y: 0.3, farbe: GRUEN, text: 'gleich lang', textOben: true },
    ],
    beschreibung: `Schaubild von sinus x mit der Geraden y gleich minus 0,5 im Intervall von 0 bis 2π. Der Taschenrechnerwert x1 liegt links von 0 und damit außerhalb des Intervalls. Die zweite Lösung x2 liegt rechts von π, im gleichen Abstand wie x1 von 0. Die dritte Lösung entsteht aus x1 durch Addieren von 2π.`,
  };
}

/** Zweite Lösung beim Kosinus: x₂ = −x₁ (gleicher Abstand zur y-Achse), im Intervall [0; 2π] dann 2π − x₁. */
export function bildKosinusZweite(r = 0.5): BildDaten {
  const x1 = Math.acos(r);
  return {
    funktion: 'cos',
    r,
    bereich: [-1.9, 2 * PI + 0.6, -0.85, 1.8],
    xTeilung: PI / 2,
    intervall: [0, 2 * PI],
    punkte: [
      { x: x1, y: r, art: 1, text: 'x₁' },
      { x: -x1, y: r, art: 2, text: '−x₁', blass: true },
      { x: 2 * PI - x1, y: r, art: 2, text: '2π − x₁' },
    ],
    klammern: [
      { von: -x1, bis: 0, y: Y_UNTEN, farbe: GRUEN, text: 'x₁' },
      { von: 0, bis: x1, y: Y_UNTEN, farbe: GRUEN, text: 'x₁' },
      { von: 2 * PI - x1, bis: 2 * PI, y: Y_UNTEN, farbe: GRUEN, text: 'x₁' },
      { von: -x1, bis: 2 * PI - x1, y: 1.3, farbe: GRAU, text: '+ 2π', textOben: true },
    ],
    beschreibung: `Schaubild von kosinus x mit der Geraden y gleich ${String(r).replace('.', ',')} im Intervall von 0 bis 2π. Die Lösung x1 liegt rechts von 0, die Lösung minus x1 im gleichen Abstand links von 0, also außerhalb des Intervalls. Wird eine Periode 2π addiert, entsteht die Lösung 2π minus x1, die im gleichen Abstand links von 2π liegt.`,
  };
}

/** Alle Lösungen: x₁ + k · 2π (grün) und x₂ + k · 2π (orange) für k = −1, 0, 1. */
export function bildAlleLoesungen(r = 0.75): BildDaten {
  const x1 = Math.asin(r);
  const x2 = PI - x1;
  const ks = [-1, 0, 1];
  return {
    funktion: 'sin',
    r,
    bereich: [-2 * PI - 0.5, 4 * PI + 0.5, -1.1, 2.0],
    xTeilung: PI,
    punkte: ks.flatMap((k) => [
      { x: x1 + k * 2 * PI, y: r, art: 1 as const },
      { x: x2 + k * 2 * PI, y: r, art: 2 as const },
    ]),
    klammern: [
      ...[-1, 0].map((k) => ({ von: x1 + k * 2 * PI, bis: x1 + (k + 1) * 2 * PI, y: 1.25, farbe: GRUEN, text: '2π', textOben: true })),
      ...[-1, 0].map((k) => ({ von: x2 + k * 2 * PI, bis: x2 + (k + 1) * 2 * PI, y: 1.6, farbe: ORANGE, text: '2π', textOben: true })),
      ...ks.map((k) => ({ von: x1 + k * 2 * PI, bis: x1 + k * 2 * PI, y: Y_UNTEN, farbe: GRUEN, text: `k = ${k < 0 ? '−1' : k}` })),
    ],
    beschreibung: `Schaubild von sinus x mit der Geraden y gleich 0,75 im Bereich von minus 2π bis 4π. Die grünen Lösungen x1 plus k mal 2π und die orangen Lösungen x2 plus k mal 2π folgen jeweils im Abstand 2π aufeinander.`,
  };
}

/**
 * Erklären: Die Gerade schneidet das Schaubild auf dem hervorgehobenen Abschnitt genau einmal, das ist die Lösung des Taschenrechners.
 * Sinus: Abschnitt von −π/2 bis π/2 (Arkussinus). Kosinus: Abschnitt von 0 bis π (Arkuskosinus).
 */
export function bildArkus(funktion: Grundfunktion = 'sin', r = 0.75): BildDaten {
  const abschnitt: [number, number] = funktion === 'sin' ? [-PI / 2, PI / 2] : [0, PI];
  const x1 = funktion === 'sin' ? Math.asin(r) : Math.acos(r);
  const name = funktion === 'sin' ? 'arcsin' : 'arccos';
  const text = funktion === 'sin' ? 'Abschnitt von −π/2 bis π/2' : 'Abschnitt von 0 bis π';
  const wort = funktion === 'sin' ? 'sinus' : 'kosinus';
  const arkus = funktion === 'sin' ? 'Arkussinus' : 'Arkuskosinus';
  const zahl = String(r).replace('.', ',');
  return {
    funktion,
    r,
    bereich: [-2 * PI + 0.7, 2 * PI - 0.7, -2.1, 1.5],
    xTeilung: PI / 2,
    hervorgehoben: abschnitt,
    punkte: [{ x: x1, y: r, art: 1, text: `x₁ = ${name}(${zahl})`, textLinks: funktion === 'sin', textRechts: funktion === 'cos' }],
    klammern: [{ von: abschnitt[0], bis: abschnitt[1], y: -1.4, farbe: GRAU, text }],
    beschreibung: `Schaubild von ${wort} x mit der Geraden y gleich ${zahl}. Der Abschnitt von ${funktion === 'sin' ? 'minus π halbe bis π halbe' : '0 bis π'} ist kräftig gezeichnet. Auf diesem Abschnitt schneidet die Gerade das Schaubild genau einmal, im Punkt x1, den der Taschenrechner als ${arkus} liefert.`,
  };
}

/** Bisheriger Name für den Sinus-Fall. */
export const bildArkussinus = (r = 0.75): BildDaten => bildArkus('sin', r);
