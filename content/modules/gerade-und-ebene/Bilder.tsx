import { ebenenFlaeche, FARBE } from '@/lib/ebenenbild';
import { type Koordinatenform } from '@/lib/ebene';
import { imWuerfel, type Gerade } from '@/lib/gerade';
import { linienNamen, punkt, type BenannteLinie } from '@/lib/geradenbild';
import { geradeLinie } from '@/lib/geradenhilfen';
import { geradenprobe } from '@/lib/geradeebene';
import { wortKoordinaten } from '@/lib/laborhilfen';
import type { Punkt3, RaumBildSpec, RaumPunkt } from '@/lib/schraegbild';
import { ebeneAusKoordinatenform, formWort } from '@/lib/spurhilfen';
import { A1, A3, A7, A8, A9, E, FAELLE, SENKRECHT } from './daten';

export { punkt };
export const SCHWARZ = '#222222';
export const ORANGE = FARBE.orange;
export const ROSA = FARBE.rosa;
const FARBEN = [SCHWARZ, ORANGE, ROSA];
const sp = (v: number[]) => wortKoordinaten(v);

export interface Linie {
  g: Gerade;
  name: string;
}

/**
 * Raumbild einer Ebene (graue Fläche) mit Geraden: durchgezogene Linien, die erste schwarz, die zweite orange, die dritte rosa, jede mit ihrem Namen dicht an der Linie,
 * dazu beschriftete Punkte. Feine Darstellung.
 */
export function ebeneMitGeraden(k: Koordinatenform, linien: Linie[], punkte: RaumPunkt[], sprech: string): RaumBildSpec {
  const f = ebenenFlaeche(ebeneAusKoordinatenform(k));
  const benannt: BenannteLinie[] = linien.map((l, i) => ({ g: l.g, name: l.name, farbe: FARBEN[i]! }));
  return {
    sprech: `Schrägbild. Die graue Fläche ist ein Ausschnitt der Ebene E: ${formWort(k)}. ${sprech}`,
    punkte: [...punkte, ...linienNamen(benannt, punkte)],
    linien: [...f.linien, ...linien.flatMap((l, i) => geradeLinie(l.g, FARBEN[i]!, 2, false))],
    flaechen: f.flaechen,
    ebenenNamen: false,
    fein: true,
  };
}

const F = FAELLE;
/** Die drei Fälle: g (schwarz) schneidet E im Durchstoßpunkt S, h (orange) ist echt parallel, k (rosa) liegt in E. */
export const RAUM_FAELLE: RaumBildSpec = ebeneMitGeraden(
  E,
  [{ g: F.g, name: 'g' }, { g: F.h, name: 'h' }, { g: F.k, name: 'k' }],
  [punkt('S', F.S)],
  `Die schwarze Gerade g durchstößt die Ebene im Punkt S bei ${sp(F.S)}. Die orange Gerade h verläuft in einigem Abstand über oder neben der Ebene, ohne sie zu berühren. Die rosa Gerade k liegt ganz in der Ebene.`,
);
/** Erklären: g durch P, Durchstoßpunkt S. */
export const RAUM_G: RaumBildSpec = ebeneMitGeraden(E, [{ g: F.g, name: 'g' }], [punkt('P', F.g.p), punkt('S', F.S)], `Die schwarze Gerade g geht durch den Punkt P bei ${sp(F.g.p)} und durchstößt die Ebene im Punkt S bei ${sp(F.S)}.`);
/** Vermutung 2: h (echt parallel, orange) und k (in E, rosa) mit ihren Stützpunkten. */
export const RAUM_PARALLEL_IN: RaumBildSpec = ebeneMitGeraden(
  E,
  [{ g: F.h, name: 'h' }, { g: F.k, name: 'k' }],
  [punkt('P', F.h.p), punkt('Q', F.k.p)],
  `Die schwarze Gerade h geht durch den Punkt P bei ${sp(F.h.p)} und ist echt parallel zur Ebene. Die orange Gerade k geht durch den Punkt Q bei ${sp(F.k.p)} und liegt in der Ebene.`,
);
/** Vermutung 4: g durch P senkrecht zu E, Durchstoßpunkt S. */
export const RAUM_SENKRECHT: RaumBildSpec = ebeneMitGeraden(
  E,
  [{ g: SENKRECHT.g, name: 'g' }],
  [punkt('P', SENKRECHT.P), punkt('S', SENKRECHT.S)],
  `Die Gerade g geht durch den Punkt P bei ${sp(SENKRECHT.P)} und steht senkrecht auf der Ebene. Sie durchstößt die Ebene im Punkt S bei ${sp(SENKRECHT.S)}.`,
);

/** Bild des Geradenlabors: E, die eingestellte Gerade g durch P und, falls vorhanden und im Koordinatensystem, der Durchstoßpunkt S. */
export function laborBild(p: number[], u: number[]): { spec: RaumBildSpec; art: string | null; aussen: boolean } {
  const kein = u.every((c) => c === 0);
  if (kein) return { spec: ebeneMitGeraden(E, [], [punkt('P', p)], `Der Punkt P liegt bei ${sp(p)}. Der Richtungsvektor ist der Nullvektor, damit gibt es keine Gerade.`), art: null, aussen: false };
  const g: Gerade = { p, u };
  const r = geradenprobe(g, E);
  const aussen = r.art === 'schneidet' && !imWuerfel(r.punkt!);
  const punkte = [punkt('P', p)];
  if (r.art === 'schneidet' && !aussen && !p.every((c, i) => c === r.punkt![i])) punkte.push(punkt('S', r.punkt!));
  return {
    art: r.art,
    aussen,
    spec: ebeneMitGeraden(E, [{ g, name: 'g' }], punkte, `Die schwarze Gerade g geht durch den Punkt P bei ${sp(p)}${r.art === 'schneidet' && !aussen ? ` und durchstößt die Ebene im Punkt S bei ${sp(r.punkt!)}` : ''}.`),
  };
}

/* ---------- Aufgaben ---------- */

/** Kontrollbild: Ebene mit einer Geraden g durch P und dem Durchstoßpunkt S. */
export function kontrollBild(k: Koordinatenform, g: Gerade, S: number[], pName = 'P'): RaumBildSpec {
  const punkte = [punkt(pName, g.p)];
  if (!g.p.every((c, i) => c === S[i])) punkte.push(punkt('S', S));
  return ebeneMitGeraden(k, [{ g, name: 'g' }], punkte, `Die schwarze Gerade g geht durch den Punkt ${pName} bei ${sp(g.p)}${g.p.every((c, i) => c === S[i]) ? '' : ` und durchstößt die Ebene im Punkt S bei ${sp(S)}`}.`);
}
export const aufg1 = kontrollBild(A1.k, A1.g, A1.S);
export const aufg7: RaumBildSpec = ebeneMitGeraden(A7.k, [{ g: { p: A7.P, u: A7.k.n }, name: 'g' }], [punkt('P', A7.P), punkt('S', A7.S)], `Die Gerade g geht durch den Punkt P bei ${sp(A7.P)} und steht senkrecht auf der Ebene. Sie durchstößt die Ebene im Punkt S bei ${sp(A7.S)}.`);
export const aufg9: RaumBildSpec = kontrollBild(A9.k, A9.g, A9.S, 'A');
/** Aufgabe 3: g₁ (in E, schwarz) und g₂ (durch P in E, aber nicht parallel zu E, orange). */
export const aufg3: RaumBildSpec = ebeneMitGeraden(A3.k, [{ g: A3.g1, name: 'g₁' }, { g: A3.g2, name: 'g₂' }], [punkt('P', A3.g1.p)], `Zwei Geraden gehen durch denselben Punkt P bei ${sp(A3.g1.p)} der Ebene. Die schwarze Gerade g₁ liegt ganz in der Ebene, die orange Gerade g₂ durchstößt sie in P.`);
/** Aufgabe 8: durch P eine echt parallele Gerade (schwarz) und eine schneidende (orange) mit Durchstoßpunkt S. */
export const aufg8: RaumBildSpec = ebeneMitGeraden(A8.k, [{ g: A8.par, name: 'g' }, { g: A8.schn, name: 'h' }], [punkt('P', A8.P), punkt('S', A8.S)], `Durch den Punkt P bei ${sp(A8.P)}, der nicht in der Ebene liegt, gehen die schwarze Gerade g, die echt parallel zur Ebene ist, und die orange Gerade h, die die Ebene im Punkt S bei ${sp(A8.S)} durchstößt.`);
export const aufg11: RaumBildSpec = ebeneMitGeraden(A3.k, [{ g: A3.g2, name: 'g' }], [punkt('P', A3.g2.p)], `Die Gerade g geht durch den Punkt P bei ${sp(A3.g2.p)}, der in der Ebene liegt, durchstößt die Ebene dort aber nur und liegt nicht in ihr.`);
export type { Punkt3 };
