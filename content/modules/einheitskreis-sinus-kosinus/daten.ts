import { bogenZuGrad, gradZuBogen } from '@/lib/winkel';

const PI = Math.PI;

/** Schnellwahl im Einheitskreis-Labor (Winkel in Grad, alle ganzzahlige Vielfache von 15°). */
export const SCHNELLWAHL_GRAD = [0, 30, 45, 60, 90, 120, 135, 150, 180, 270, 360] as const;

/** Reglerschritt: 15° bzw. π/12. */
export const SCHRITT_GRAD = 15;
/** Reglerbereich in Schritten: −180° bis 540°, entspricht dem Zeichenbereich −π bis 3π. */
export const K_MIN = -12;
export const K_MAX = 36;

/** Aufgabe 1: Umrechnen zwischen Grad- und Bogenmaß. */
export const A1 = {
  grad60: gradZuBogen(60),
  grad135: gradZuBogen(135),
  bogen5pi6: bogenZuGrad((5 * PI) / 6),
  bogen2: bogenZuGrad(2),
};

/** Aufgabe 2: Werte an den Achsenpunkten des Einheitskreises. */
export const A2 = [
  { id: 'sin-pi', x: PI, funktion: 'sin' as const },
  { id: 'cos-pi', x: PI, funktion: 'cos' as const },
  { id: 'sin-3pi2', x: (3 * PI) / 2, funktion: 'sin' as const },
  { id: 'cos-3pi2', x: (3 * PI) / 2, funktion: 'cos' as const },
  { id: 'sin-mpi2', x: -PI / 2, funktion: 'sin' as const },
  { id: 'cos-2pi', x: 2 * PI, funktion: 'cos' as const },
].map((e) => ({ ...e, erwartet: (e.funktion === 'sin' ? Math.sin : Math.cos)(e.x) }));

/** Aufgabe 3: Taschenrechner. */
export const A3 = {
  sinRad1: Math.sin(1),
  cosRad2: Math.cos(2),
  cosDeg75: Math.cos(gradZuBogen(75)),
  /** sin(30) im falschen Modus (RAD statt DEG). */
  sin30Rad: Math.sin(30),
};

/** Aufgabe 4: Wertetabelle zum Zeichnen. */
export const A4 = [
  { id: 'sin-pi6', x: PI / 6, funktion: 'sin' as const },
  { id: 'sin-pi4', x: PI / 4, funktion: 'sin' as const },
  { id: 'sin-pi3', x: PI / 3, funktion: 'sin' as const },
  { id: 'sin-3pi4', x: (3 * PI) / 4, funktion: 'sin' as const },
  { id: 'cos-pi6', x: PI / 6, funktion: 'cos' as const },
  { id: 'cos-pi4', x: PI / 4, funktion: 'cos' as const },
  { id: 'cos-pi3', x: PI / 3, funktion: 'cos' as const },
  { id: 'cos-3pi4', x: (3 * PI) / 4, funktion: 'cos' as const },
].map((e) => ({ ...e, erwartet: (e.funktion === 'sin' ? Math.sin : Math.cos)(e.x) }));

/** Aufgabe 6a: kleinste nichtnegative Stellen der Extrempunkte. */
export const A6 = {
  sinHoch: PI / 2,
  sinTief: (3 * PI) / 2,
  cosHoch: 0,
  cosTief: PI,
};
