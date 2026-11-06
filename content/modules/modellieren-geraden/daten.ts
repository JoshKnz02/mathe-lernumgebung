import type { Bewegung } from '@/lib/bewegung';
import type { Punkt3 } from '@/lib/schraegbild';

/** Farben im Modul: Bahn g, Gegenstand schwarz, Bahn h und Lichtstrahlen orange, Schatten und Abstände rosa, alle Linien durchgezogen. */
export const SCHWARZ = '#222222';
export const ORANGE = '#D55E00';
export const ROSA = '#CC79A7';

/* ---------- Bewegung ---------- */

/**
 * Hubschrauber H (Erklären, Entdecken, Labor): Start P(−1 | 0 | 1), Richtung u = (2 | −1 | 2), |u| = 3, Tempo 60 km/h, Geschwindigkeitsvektor v = 20 · u = (40 | −20 | 40) km/h.
 * Nach 3 Minuten (0,05 h) ist er im Punkt S(1 | −1 | 3) (eine Strecke u weiter, 3 km zurückgelegt). Eine Längeneinheit ist 1 km.
 */
export const HUBSCHRAUBER: Bewegung = { start: [-1, 0, 1], richtung: [2, -1, 2], tempo: 60 };
export const S_BEWEGUNG: Punkt3 = [1, -1, 3];
/**
 * Rettungshubschrauber R (Labor): Start (−1 | −3 | 4), Richtung (2 | 2 | −1), |u| = 3, Tempo einstellbar (30 bis 150 km/h in Schritten von 30, Standard 90 km/h, dann v = 30 · u = (60 | 60 | −30)). Seine Bahn schneidet die von H in S, der Weg dorthin ist 3 km:
 * Er erreicht S nach 3/Tempo Stunden, bei 90 km/h nach 1/30 h = 2 min = 120 s (H nach 3 min, also 60 s später). Bei 60 km/h erreichen beide S zur selben Zeit (Kollision).
 */
export const RETTUNG_START = { start: [-1, -3, 4], richtung: [2, 2, -1] };
export const BEWEGUNGSLABOR = { H: HUBSCHRAUBER, R: RETTUNG_START, tempoStart: 90, tempoMin: 30, tempoMax: 150, tempoSchritt: 30, tempoKollision: 60, tMaxMin: 4, tStartMin: 1, S: S_BEWEGUNG };

/** Aufgabe 2 (Wetterballon, mit Bild): Start (−2 | 3 | 0), Richtung (1 | −2 | 2), Tempo 36 km/h, v = 12 · u = (12 | −24 | 24), nach 5 Minuten (1/12 h) im Punkt (−1 | 1 | 2). */
export const A_WETTER = { b: { start: [-2, 3, 0], richtung: [1, -2, 2], tempo: 36 } as Bewegung, v: [12, -24, 24], minuten: 5, Q: [-1, 1, 2] as Punkt3 };
/**
 * Aufgabe 3 (Auswahl): Die Bahnen zweier Objekte schneiden sich in S. Objekt 1 erreicht S nach 12 Minuten, Objekt 2 nach 9 Minuten: keine Kollision, Objekt 2 ist 3 Minuten früher da.
 */
export const A_ZEITEN_AUSWAHL = { t1: 12, t2: 9 };
/**
 * Aufgabe 4 (Kollision, mit Bild): Hubschrauber (60 km/h) Start (3 | 2 | 0), Richtung (−2 | −2 | 1), v₁ = 20 · u = (−40 | −40 | 20); Heißluftballon (30 km/h) Start (−3 | −1 | 0), Richtung (2 | −1 | 2),
 * v₂ = 10 · u = (20 | −10 | 20). Beide sind nach 0,1 h = 6 min in S(−1 | −2 | 2).
 */
export const A_KOLLISION = { h: { start: [3, 2, 0], richtung: [-2, -2, 1], tempo: 60 } as Bewegung, ballon: { start: [-3, -1, 0], richtung: [2, -1, 2], tempo: 30 } as Bewegung, t: 0.1, S: [-1, -2, 2] as Punkt3 };
/**
 * Aufgabe 5 (Bahnen schneiden sich, keine Kollision, mit Bild): Objekt 1 (60 km/h) Start (−3 | −3 | 4), Richtung (2 | 2 | −1), v = (40 | 40 | −20), Objekt 2 (60 km/h) Start (−1 | 2 | 0), Richtung (2 | −1 | 2),
 v = (40 | −20 | 40). Beide Bahnen gehen durch S(1 | 1 | 2), Objekt 1 erreicht S nach 0,1 h = 6 min, Objekt 2 nach 0,05 h = 3 min, Unterschied 180 s.
 */
export const A_ZEITEN = { a: { start: [-3, -3, 4], richtung: [2, 2, -1], tempo: 60 } as Bewegung, b: { start: [-1, 2, 0], richtung: [2, -1, 2], tempo: 60 } as Bewegung, S: [1, 1, 2] as Punkt3, minutenA: 6, minutenB: 3, differenzSekunden: 180 };
/**
 * Aufgabe 6 (kleinster Abstand, mit Bild): Hubschrauber (60 km/h) Start (−2 | 2 | 1), Richtung (2 | −1 | 2), v₁ = 20 · u = (40 | −20 | 40); Heißluftballon (30 km/h) Start (2 | −2 | 3), Richtung (−2 | −2 | 1),
 * v₂ = 10 · u = (−20 | −20 | 10). Δp = (4 | −4 | 2), Δv = (−60 | 0 | −30), d(t)² = 4500 t² − 600 t + 36, Scheitel t = 1/15 h = 4 min, d = 4 km (Hubschrauber (2/3 | 2/3 | 11/3), Ballon (2/3 | −10/3 | 11/3)).
 */
export const A_ABSTAND = { h: { start: [-2, 2, 1], richtung: [2, -1, 2], tempo: 60 } as Bewegung, ballon: { start: [2, -2, 3], richtung: [-2, -2, 1], tempo: 30 } as Bewegung, koeff: { a: 4500, b: -600, c: 36 }, minuten: 4, d: 4 };
/**
 * Aufgabe 7 (Auswahl): Ballon (40 km/h) Start (0 | 0 | 0), Richtung (1 | 0 | 0) und Hubschrauber (60 km/h) Start (3 | 1 | 1), Richtung (1 | 0 | 0). d(t)² = (3 + 20 t)² + 2, Scheitel bei t = −0,15 h (9 Minuten vor Beobachtungsbeginn),
 d(−0,15) = √2 km ≈ 1,41 km, für t ≥ 0 am kleinsten bei t = 0: d(0) = √11 km ≈ 3,32 km.
 */
export const A_NEGATIV = { b1: { start: [0, 0, 0], richtung: [1, 0, 0], tempo: 40 } as Bewegung, b2: { start: [3, 1, 1], richtung: [1, 0, 0], tempo: 60 } as Bewegung, scheitel: -0.15 };

/* ---------- Schatten ---------- */

/**
 * Beispiel Schatten (Erklären, Entdecken, Labor, Zusammenfassung): dreieckige Werbetafel P(0 | 2 | 3), Q(1 | 1 | 2), R(−3 | 1 | 2) vor der Wand x₂ = 0 (x₁x₃-Ebene).
 * Parallel: v = (1 | −1 | 0): P′(2 | 0 | 3) bei t = 2, Q′(2 | 0 | 2) bei t = 1, R′(−2 | 0 | 2) bei t = 1.
 * Punktförmig: L(−3 | 4 | 3): P″(3 | 0 | 3) bei s = 2, Q″(7/3 | 0 | 5/3) bei s = 4/3, R″(−3 | 0 | 5/3) bei s = 4/3.
 */
export const SCHATTEN = { ecken: [[0, 2, 3], [1, 1, 2], [-3, 1, 2]] as Punkt3[], v: [1, -1, 0], L: [-3, 4, 3] as Punkt3 };
/** Labor Schatten: das Dreieck des Beispiels, v = (a | v₂ | c) und L einstellbar. */
export const SCHATTENLABOR = { ecken: SCHATTEN.ecken, startV: [1, -1, 0], startL: [-3, 4, 3] };
/** Begrenzte Wand im Entdecken: nur für −2 ≤ x₁ ≤ 1 (und x₃ ≥ 0). Von den Schattenpunkten des Beispiels liegt nur R′(−2 | 0 | 2) darauf. */
export const WAND_BEREICH = { x1Min: -2, x1Max: 1 };

/**
 * Aufgabe 8 (Parallelprojektion, mit Bild): Dreieck P(−3 | 3 | 1), Q(0 | 1 | 3), R(−3 | 1 | 3), Sonnenlicht v = (2 | −1 | 0), Wand x₂ = 0:
 * P′(3 | 0 | 1) bei t = 3, Q′(2 | 0 | 3) bei t = 1, R′(−1 | 0 | 3) bei t = 1.
 */
export const A_PARALLEL = { ecken: [[-3, 3, 1], [0, 1, 3], [-3, 1, 3]] as Punkt3[], v: [2, -1, 0], schatten: [[3, 0, 1], [2, 0, 3], [-1, 0, 3]] as Punkt3[] };
/**
 * Aufgabe 9 (Zentralprojektion, mit Bild): Dreieck P(−3 | 1 | 2), Q(−1 | 1 | 3), R(0 | 3 | 1), Lichtquelle L(−1 | 4 | 1): P″(−11/3 | 0 | 7/3) bei s = 4/3, Q″(−1 | 0 | 11/3) bei s = 4/3, R″(3 | 0 | 1) bei s = 4.
 */
export const A_ZENTRAL = { ecken: [[-3, 1, 2], [-1, 1, 3], [0, 3, 1]] as Punkt3[], L: [-1, 4, 1] as Punkt3 };
/** Aufgabe 10 (Auswahl): Lichtquelle L(0 | 6 | 2), Punkt X(1 | 2 | 3), Wand x₂ = 0: s = 3/2, Schattenpunkt (3/2 | 0 | 7/2). */
export const A_PARAMETER = { L: [0, 6, 2] as Punkt3, X: [1, 2, 3] as Punkt3 };
/**
 * Aufgabe 11 (Tetraeder, mit Bild): A(−2 | 2 | 0), B(2 | 2 | 0), C(2 | 3 | 0), Spitze S(1 | 1 | 4), Licht w = (1 | −1 | −2), Boden x₃ = 0 mit x₂ ≥ 0, Wand x₂ = 0 mit x₃ ≥ 0.
 * Höhe des rechnerischen Wandpunkts z = x₃ − 2 x₂: A −4, B −4, C −6, S 2. Nur der Strahl durch S trifft die Wand, in S′(2 | 0 | 2) bei t = 1, die Ecken A, B, C liegen auf dem Boden.
 */
export const A_TETRAEDER = { A: [-2, 2, 0] as Punkt3, B: [2, 2, 0] as Punkt3, C: [2, 3, 0] as Punkt3, S: [1, 1, 4] as Punkt3, w: [1, -1, -2], hoehen: [-4, -4, -6, 2], S1: [2, 0, 2] as Punkt3 };
/** Aufgabe 12 (Mast, Zeichnen): Fußpunkt F(1 | 1 | 0), Spitze T(1 | 1 | 2), Licht w = (−1 | 1 | −1), Boden x₃ = 0: T′(−1 | 3 | 0) bei t = 2. */
export const A_MAST = { F: [1, 1, 0] as Punkt3, T: [1, 1, 2] as Punkt3, w: [-1, 1, -1], T0: [-1, 3, 0] as Punkt3 };

/** Arbeitsblätter der Lehrkraft: Diese Zahlen kommen im Modul nicht vor (öffentliches Repository). */
export const VERBOTEN_SPALTEN = ['3,7,8', '3,4,0', '480,640,0', '4,11,7.6', '480,480,24', '1,4,2', '6,1,4', '3,2,0', '-2,-3,0', '2,9,0', '2,-10,-8', '0,4,0', '4,4,0', '4,8,0', '2,6,4'];
