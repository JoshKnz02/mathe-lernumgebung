import { ebeneImWuerfel, type Ebene } from '@/lib/ebene';
import { vieleckBild } from '@/lib/ebenenhilfen';
import { geradeImWuerfel } from '@/lib/gerade';
import { linienNamen, punkt } from '@/lib/geradenbild';
import { geradeLinie } from '@/lib/geradenhilfen';
import { wortKoordinaten } from '@/lib/laborhilfen';
import type { Punkt3, RaumBildSpec, RaumLinie, RaumPunkt } from '@/lib/schraegbild';
import { A_DREI_PUNKTE, A_ZEICHNEN, BLAU, ERKLAEREN, GLEICHUNG, GRAU, GRAU_RAND, KOLLINEAR, ORANGE, PARAMETER, PUNKTPROBE, ROSA, SCHWARZ } from './daten';

export const O: Punkt3 = [0, 0, 0];
export { punkt };
export const pfeil = (von: Punkt3, bis: Punkt3, farbe: string, breite?: number): RaumLinie => ({ von, bis, farbe, pfeil: true, ...(breite ? { breite } : {}) });
const plus = (a: number[], b: number[]): Punkt3 => a.map((x, i) => x + b[i]!) as Punkt3;
const sp = (v: number[]) => wortKoordinaten(v);

/** Der Teil der Ebene im Koordinatensystem als graue durchsichtige Fläche mit Rand (leer, wenn die Ebene das Koordinatensystem nicht trifft). */
export function ebenenFlaeche(e: Ebene): { flaechen: NonNullable<RaumBildSpec['flaechen']>; linien: RaumLinie[] } {
  return vieleckBild(ebeneImWuerfel(e), GRAU, GRAU_RAND);
}

/** Alle Bilder des Moduls schalten die feine Darstellung ein und zeigen die Koordinatenebenen nicht (sie würden die graue Ebene überdecken). */
const bild = (o: { sprech: string; punkte: RaumPunkt[]; linien: RaumLinie[]; flaechen?: RaumBildSpec['flaechen'] }): RaumBildSpec => ({ ...o, ebenenNamen: false, fein: true });

/** Stützvektor (orange, vom Ursprung zu P), Spannvektoren u (blau) und v (rosa) in P; breiter gezeichnet, damit sie unter dem Weg zu sehen sind. */
export function vektorPfeile(e: Ebene): RaumLinie[] {
  const P = e.p as Punkt3;
  return [pfeil(O, P, ORANGE), pfeil(P, plus(P, e.u), BLAU, 4.5), pfeil(P, plus(P, e.v), ROSA, 4.5)];
}

/* ---------- Erklären ---------- */

/** Ebene durch A, B und C: Stützvektor orange (vom Ursprung zu A), Spannvektor AB blau, Spannvektor AC rosa. */
const E = ERKLAEREN;
export const RAUM_ERKLAEREN: RaumBildSpec = (() => {
  const e: Ebene = { p: E.A, u: E.u, v: E.v };
  const f = ebenenFlaeche(e);
  return bild({
    sprech: `Schrägbild. Die graue Fläche ist ein Ausschnitt der Ebene durch den Punkt A bei ${sp(E.A)}, den Punkt B bei ${sp(E.B)} und den Punkt C bei ${sp(E.C)}. Der orange Pfeil vom Ursprung zu A ist der Stützvektor, der blaue Pfeil von A nach B der erste Spannvektor, der rosa Pfeil von A nach C der zweite Spannvektor.`,
    punkte: [{ name: 'O', p: O, ohneText: true }, punkt('A', E.A), punkt('B', E.B), punkt('C', E.C)],
    linien: [...f.linien, pfeil(O, E.A, ORANGE), pfeil(E.A, E.B, BLAU, 4.5), pfeil(E.A, E.C, ROSA, 4.5)],
    flaechen: f.flaechen,
  });
})();

/* ---------- Entdecken ---------- */

/**
 * Vermutung 1: Ebene mit den Punkten P (r = 0, s = 0), A (1 | 0), B (0 | 1), C (1 | 1) und D (−1 | 0). Der Weg von P über A nach C und über B nach C ist schwarz gestrichelt
 * (das Parallelogramm aus u und v).
 */
const P1 = PARAMETER;
export const RAUM_PARAMETER: RaumBildSpec = (() => {
  const f = ebenenFlaeche(P1.e);
  return bild({
    sprech: `Schrägbild. Die graue Fläche ist ein Ausschnitt der Ebene E. Markiert sind fünf Punkte: P bei ${sp(P1.P)} (für r und s gleich 0), A bei ${sp(P1.A)} (r gleich 1, s gleich 0), B bei ${sp(P1.B)} (r gleich 0, s gleich 1), C bei ${sp(P1.C)} (r gleich 1, s gleich 1) und D bei ${sp(P1.D)} (r gleich minus 1, s gleich 0). Der orange Pfeil vom Ursprung zu P ist der Stützvektor, der blaue Pfeil in P der erste Spannvektor, der rosa Pfeil in P der zweite. Gestrichelt ist der Weg von P über A und über B nach C.`,
    punkte: [{ name: 'O', p: O, ohneText: true }, punkt('P', P1.P), punkt('A', P1.A), punkt('B', P1.B), punkt('C', P1.C), punkt('D', P1.D)],
    linien: [...f.linien, ...vektorPfeile(P1.e), { von: P1.A, bis: P1.C, farbe: SCHWARZ, gestrichelt: true, breite: 1.6 }, { von: P1.B, bis: P1.C, farbe: SCHWARZ, gestrichelt: true, breite: 1.6 }],
    flaechen: f.flaechen,
  });
})();

/** Vermutung 2: kollineare Spannvektoren: Die Gerade g durch P (schwarz, durchgezogen) mit den beiden Pfeilen u (blau) und v = −2u (rosa) in P. */
export function kollinearBild(K: typeof KOLLINEAR): RaumBildSpec {
  const g = { p: K.e.p, u: K.e.u };
  const punkte: RaumPunkt[] = [{ name: 'O', p: O, ohneText: true }, punkt('P', K.P)];
  const namen = linienNamen([{ g, name: 'g', farbe: SCHWARZ }], punkte);
  return bild({
    sprech: `Schrägbild. Von P bei ${sp(K.P)} gehen zwei Pfeile aus: der blaue Pfeil ist der erste Spannvektor u, der rosa Pfeil der zweite Spannvektor v, der genau entgegengesetzt zu u und doppelt so lang ist. Beide liegen auf der schwarzen Geraden g durch P. Es gibt keine Fläche: Die beiden Richtungen führen nur auf dieser Geraden entlang.`,
    punkte: [...punkte, ...namen],
    linien: [...geradeLinie(g, SCHWARZ, 2, false), pfeil(O, K.P, ORANGE), pfeil(K.P, plus(K.P, K.e.u), BLAU, 4.5), pfeil(K.P, plus(K.P, K.e.v), ROSA, 4.5)],
  });
}
export const RAUM_KOLLINEAR: RaumBildSpec = kollinearBild(KOLLINEAR);

/** Vermutung 3: die Ebene mit dem Stützpunkt P, Q liegt in der Ebene, R knapp darüber nicht. */
export function punktprobeBeispiel(Q: typeof PUNKTPROBE): RaumBildSpec {
  const f = ebenenFlaeche(Q.e);
  return bild({
    sprech: `Schrägbild. Die graue Fläche ist ein Ausschnitt der Ebene E mit dem Stützpunkt P bei ${sp(Q.P)}. Markiert sind außerdem der Punkt Q bei ${sp(Q.Q)} und der Punkt R bei ${sp(Q.R)}. R liegt eine Einheit über Q und dicht an der Ebene, im Bild lässt sich nicht sicher erkennen, ob ein Punkt in der Ebene liegt.`,
    punkte: [punkt('P', Q.P), punkt('Q', Q.Q), punkt('R', Q.R)],
    linien: f.linien,
    flaechen: f.flaechen,
  });
}
export const RAUM_PUNKTPROBE: RaumBildSpec = punktprobeBeispiel(PUNKTPROBE);

/**
 * Bild zu zwei Gleichungen derselben Ebene (oder auch nicht): E grau mit u (blau) und v (rosa) in P, E′ als orange Rand mit u′ (schwarz) und v′ (orange) in P′.
 * Liegt P′ außerhalb des Koordinatensystems, werden P′ und die Pfeile nicht gezeichnet (`aussen`).
 */
export function gleichungBild(e: Ebene, f2: Ebene): { spec: RaumBildSpec; aussen: boolean } {
  const fl = ebenenFlaeche(e);
  const rand2 = vieleckBild(ebeneImWuerfel(f2), GRAU, ORANGE, 0.18);
  const P2 = f2.p as Punkt3;
  const aussen = P2.some((c) => Math.abs(c) > 4 + 1e-9);
  const istEbene2 = rand2.flaechen.length > 0;
  const gerade = !istEbene2 ? (f2.u.some((c) => c !== 0) ? { p: f2.p, u: f2.u } : f2.v.some((c) => c !== 0) ? { p: f2.p, u: f2.v } : null) : null;
  const linien: RaumLinie[] = [...fl.linien, ...rand2.linien];
  if (gerade && !aussen) {
    const s = geradeImWuerfel(gerade);
    if (s) linien.push({ von: s[0], bis: s[1], farbe: SCHWARZ, breite: 2 });
  }
  linien.push(pfeil(O, e.p as Punkt3, ORANGE), pfeil(e.p as Punkt3, plus(e.p, e.u), BLAU, 4.5), pfeil(e.p as Punkt3, plus(e.p, e.v), ROSA, 4.5));
  const punkte: RaumPunkt[] = [{ name: 'O', p: O, ohneText: true }, punkt('P', e.p)];
  if (!aussen) {
    punkte.push(punkt('P′', P2));
    const kurz = (v: number[]) => {
      const ziel = plus(P2, v);
      return ziel.every((c) => Math.abs(c) <= 4 + 1e-9) ? ziel : null;
    };
    const a = kurz(f2.u);
    const b = kurz(f2.v);
    if (a && f2.u.some((c) => c !== 0)) linien.push(pfeil(P2, a, SCHWARZ));
    if (b && f2.v.some((c) => c !== 0)) linien.push(pfeil(P2, b, ORANGE));
  }
  const art = istEbene2 ? 'Die orange berandete Fläche gehört zur zweiten Gleichung E′.' : 'Die zweite Gleichung beschreibt keine Ebene.';
  return {
    aussen,
    spec: bild({
      sprech: `Schrägbild. Die graue Fläche ist ein Ausschnitt der Ebene E mit dem Stützpunkt P bei ${sp(e.p)}. Der blaue und der rosa Pfeil in P sind ihre Spannvektoren. ${aussen ? 'Der Stützpunkt P′ der zweiten Gleichung liegt außerhalb des gezeichneten Koordinatensystems.' : `Der Stützpunkt P′ der zweiten Gleichung liegt bei ${sp(f2.p)}, ihre Spannvektoren sind der schwarze und der orange Pfeil. ${art}`}`,
      punkte,
      linien,
      flaechen: [...fl.flaechen, ...rand2.flaechen],
    }),
  };
}
const G = GLEICHUNG;
export const RAUM_GLEICHUNG: RaumBildSpec = gleichungBild(G.e, { p: G.P2, u: G.u2, v: G.v2 }).spec;

/* ---------- Aufgaben ---------- */

/** Aufgabe 2: Ebene durch A, B, C, Spannvektoren AB (blau) und AC (rosa) in A. */
const D3 = A_DREI_PUNKTE;
export const aufgDreiPunkte: RaumBildSpec = (() => {
  const f = ebenenFlaeche({ p: D3.A, u: D3.u, v: D3.v });
  return bild({
    sprech: `Schrägbild. Die graue Fläche ist ein Ausschnitt der Ebene durch den Punkt A bei ${sp(D3.A)}, den Punkt B bei ${sp(D3.B)} und den Punkt C bei ${sp(D3.C)}. Der blaue Pfeil von A nach B und der rosa Pfeil von A nach C sind die Spannvektoren.`,
    punkte: [punkt('A', D3.A), punkt('B', D3.B), punkt('C', D3.C)],
    linien: [...f.linien, pfeil(D3.A, D3.B, BLAU, 4.5), pfeil(D3.A, D3.C, ROSA, 4.5)],
    flaechen: f.flaechen,
  });
})();

/** Aufgabe 10: Das Parallelogramm ABDC mit D = A + AB + AC (grau gefüllt), Spannvektoren in A. */
const Z = A_ZEICHNEN;
export const aufgZeichnen: RaumBildSpec = (() => {
  const f = vieleckBild([Z.A, Z.B, Z.D, Z.C], GRAU, GRAU_RAND, 0.35);
  return bild({
    sprech: `Schrägbild. Die graue Fläche ist das Parallelogramm mit den Ecken A bei ${sp(Z.A)}, B bei ${sp(Z.B)}, D bei ${sp(Z.D)} und C bei ${sp(Z.C)}. Der blaue Pfeil von A nach B und der rosa Pfeil von A nach C sind die beiden Spannvektoren, D ist der vierte Eckpunkt.`,
    punkte: [punkt('A', Z.A), punkt('B', Z.B), punkt('C', Z.C), punkt('D', Z.D)],
    linien: [...f.linien, pfeil(Z.A, Z.B, BLAU, 4.5), pfeil(Z.A, Z.C, ROSA, 4.5)],
    flaechen: f.flaechen,
  });
})();

