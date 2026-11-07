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
 * Haus (Erklären, Entdecken, Labor, Zusammenfassung): Quader mit Satteldach über dem Boden x₃ = 0, vordere untere Ecke bei (x₁ | x₂), Breite in x₁-Richtung, Länge in x₂-Richtung,
 * Traufhöhe und Firsthöhe. Der First liegt über der Mitte der Breite und läuft in x₂-Richtung (parallel zum Boden). Eine Längeneinheit sind 3 Meter.
 */
export interface Haus {
  x1: number;
  x2: number;
  breite: number;
  laenge: number;
  traufe: number;
  first: number;
}
export const HAUS: Haus = { x1: -2, x2: -2, breite: 2, laenge: 3, traufe: 1, first: 2 };
/** Ecken und Kanten des Hauses: Grundecken, Traufecken (R ist die vordere linke Traufecke), First P (vorn) und Q (hinten). */
export function hausPunkte(h: Haus) {
  const a = h.x1;
  const b = h.x1 + h.breite;
  const m = h.x1 + h.breite / 2;
  const y1 = h.x2;
  const y2 = h.x2 + h.laenge;
  const grund: Punkt3[] = [[a, y1, 0], [a, y2, 0], [b, y2, 0], [b, y1, 0]];
  const traufe: Punkt3[] = grund.map(([x, y]) => [x, y, h.traufe] as Punkt3);
  const P: Punkt3 = [m, y1, h.first];
  const Q: Punkt3 = [m, y2, h.first];
  const R = traufe[0]!;
  const kanten: [Punkt3, Punkt3][] = [];
  for (let i = 0; i < 4; i++) {
    kanten.push([grund[i]!, grund[(i + 1) % 4]!], [traufe[i]!, traufe[(i + 1) % 4]!], [grund[i]!, traufe[i]!]);
  }
  kanten.push([P, Q], [P, traufe[0]!], [P, traufe[3]!], [Q, traufe[1]!], [Q, traufe[2]!]);
  return { grund, traufe, P, Q, R, kanten, hoch: [...traufe, P, Q] as Punkt3[] };
}
/**
 * Beispiel Schatten: Verfolgt werden die vordere Dachspitze P(−1 | −2 | 2), die hintere Dachspitze Q(−1 | 1 | 2) und die Traufecke R(−2 | −2 | 1).
 * Parallel (Sonne): v = (1 | 0 | −1), t = x₃: P′(1 | −2 | 0) und Q′(1 | 1 | 0) bei t = 2, R′(−1 | −2 | 0) bei t = 1.
 * Punktförmig (Straßenlaterne) L(−3 | 0 | 4): P″(1 | −4 | 0) und Q″(1 | 2 | 0) bei s = 2, R″(−5/3 | −8/3 | 0) bei s = 4/3.
 */
export const SCHATTEN = { haus: HAUS, ecken: [hausPunkte(HAUS).P, hausPunkte(HAUS).Q, hausPunkte(HAUS).R] as Punkt3[], v: [1, 0, -1], L: [-3, 0, 4] as Punkt3 };
/** Labor Schatten: das Haus, v = (v₁ | v₂ | v₃) und L einstellbar. */
export const SCHATTENLABOR = { haus: HAUS, ecken: SCHATTEN.ecken, startV: [1, 0, -1], startL: [-3, 0, 4] };

/**
 * Aufgabe 8 (Parallelprojektion, mit Bild): Dreieck P(0 | 1 | 3), Q(−2 | 2 | 1), R(2 | −3 | 2), Sonnenlicht v = (1 | 1 | −2), Boden x₃ = 0, t = x₃/2:
 * P′(3/2 | 5/2 | 0) bei t = 3/2, Q′(−3/2 | 5/2 | 0) bei t = 1/2, R′(3 | −2 | 0) bei t = 1.
 */
export const A_PARALLEL = { ecken: [[0, 1, 3], [-2, 2, 1], [2, -3, 2]] as Punkt3[], v: [1, 1, -2], schatten: [[1.5, 2.5, 0], [-1.5, 2.5, 0], [3, -2, 0]] as Punkt3[] };
/**
 * Aufgabe 9 (Zentralprojektion, mit Bild): Dreieck P(−2 | 0 | 1), Q(0 | −2 | 2), R(−2 | −3 | 2), Lichtquelle L(−3 | −3 | 4): P″(−5/3 | 1 | 0) bei s = 4/3, Q″(3 | −1 | 0) bei s = 2, R″(−1 | −3 | 0) bei s = 2.
 */
export const A_ZENTRAL = { ecken: [[-2, 0, 1], [0, -2, 2], [-2, -3, 2]] as Punkt3[], L: [-3, -3, 4] as Punkt3 };
/** Aufgabe 10 (Auswahl): Lichtquelle L(1 | 2 | 6), Punkt X(3 | 0 | 2), Boden x₃ = 0: s = 3/2, Schattenpunkt (4 | −1 | 0). */
export const A_PARAMETER = { L: [1, 2, 6] as Punkt3, X: [3, 0, 2] as Punkt3 };
/**
 * Aufgabe 11 (Tetraeder, mit Bild): A(−3 | −3 | 0), B(3 | −2 | 0), C(−3 | 2 | 0) liegen auf dem Boden, Spitze S(0 | 1 | 2), Licht w = (1 | 1 | −1): S′(2 | 3 | 0) bei t = 2.
 * A, B, C sind ihr eigener Schatten, der Schatten des Tetraeders ist die Hülle von A, B, C, S′, ein Viereck mit 4 Ecken (S′ liegt außerhalb des Dreiecks ABC und keine Ecke liegt im Dreieck der übrigen).
 */
export const A_TETRAEDER = { A: [-3, -3, 0] as Punkt3, B: [3, -2, 0] as Punkt3, C: [-3, 2, 0] as Punkt3, S: [0, 1, 2] as Punkt3, w: [1, 1, -1], t: 2, S1: [2, 3, 0] as Punkt3, ecken: 4 };
/** Aufgabe 12 (Mast, Zeichnen): Fußpunkt F(1 | 1 | 0), Spitze T(1 | 1 | 2), Licht w = (−1 | 1 | −1), Boden x₃ = 0: T′(−1 | 3 | 0) bei t = 2. */
export const A_MAST = { F: [1, 1, 0] as Punkt3, T: [1, 1, 2] as Punkt3, w: [-1, 1, -1], T0: [-1, 3, 0] as Punkt3 };

/** Arbeitsblätter der Lehrkraft: Diese Zahlen kommen im Modul nicht vor (öffentliches Repository). */
export const VERBOTEN_SPALTEN = ['3,7,8', '3,4,0', '480,640,0', '4,11,7.6', '480,480,24', '1,4,2', '6,1,4', '3,2,0', '-2,-3,0', '2,9,0', '2,-10,-8', '0,4,0', '4,4,0', '4,8,0', '2,6,4'];
