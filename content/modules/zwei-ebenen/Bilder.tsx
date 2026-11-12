import { ebeneImWuerfel, type Koordinatenform } from '@/lib/ebene';
import { ebenenFlaeche, FARBE } from '@/lib/ebenenbild';
import { vieleckBild } from '@/lib/ebenenhilfen';
import { geradeLinie } from '@/lib/geradenhilfen';
import { linienNamen, punkt } from '@/lib/geradenbild';
import { imWuerfel, type Gerade } from '@/lib/gerade';
import { wortKoordinaten } from '@/lib/laborhilfen';
import type { RaumBildSpec, RaumPunkt } from '@/lib/schraegbild';
import { ebeneAusKoordinatenform, formWort } from '@/lib/spurhilfen';
import { lageEbenen, schnittgerade } from '@/lib/zweiebenen';
import { A7, A8, E, F, G, H } from './daten';

export { punkt };
export const SCHWARZ = '#222222';
export const ORANGE = FARBE.orange;
const sp = (v: number[]) => wortKoordinaten(v);

/**
 * Raumbild zweier Ebenen: E grau, die zweite Ebene mit orangem Rand. Schneiden sie sich, ist die Schnittgerade s eine schwarze durchgezogene Linie mit ihrem Namen dicht an der Linie.
 * Sind die Ebenen identisch, liegt der orange Rand breit unter dem grauen. Feine Darstellung.
 */
export function zweiEbenenBild(k1: Koordinatenform, k2: Koordinatenform, o: { sprech: string; punkte?: RaumPunkt[]; linien?: Gerade[]; namen?: string[] } = { sprech: '' }): RaumBildSpec {
  const f1 = ebenenFlaeche(ebeneAusKoordinatenform(k1));
  const art = lageEbenen(k1, k2);
  const f2 = vieleckBild(ebeneImWuerfel(ebeneAusKoordinatenform(k2)), FARBE.grau, ORANGE, 0.18);
  const s = art === 'schneiden' ? schnittgerade(k1, k2) : null;
  const punkte: RaumPunkt[] = [...(o.punkte ?? [])];
  const benannt = s ? [{ g: s, name: 's', farbe: SCHWARZ }] : [];
  const extra = (o.linien ?? []).map((g, i) => ({ g, name: o.namen?.[i] ?? 'g', farbe: SCHWARZ }));
  const texte = linienNamen([...benannt, ...extra], punkte);
  const lage = art === 'schneiden' ? 'Die beiden Ebenen schneiden sich in der schwarzen Geraden s.' : art === 'parallel' ? 'Die beiden Ebenen sind echt parallel und haben keinen gemeinsamen Punkt.' : 'Die beiden Ebenen sind identisch, der orange Rand liegt auf dem grauen.';
  return {
    sprech: `Schrägbild. Die graue Fläche ist ein Ausschnitt der Ebene E: ${formWort(k1)}, die Fläche mit orangem Rand ein Ausschnitt der zweiten Ebene: ${formWort(k2)}. ${lage}${o.sprech ? ` ${o.sprech}` : ''}`,
    punkte: [...punkte, ...texte],
    linien: [
      ...(art === 'identisch' ? f2.linien.map((l) => ({ ...l, breite: 4 })) : f2.linien),
      ...f1.linien,
      ...(s ? geradeLinie(s, SCHWARZ, 2, false) : []),
      ...extra.flatMap((x) => geradeLinie(x.g, SCHWARZ, 2, false)),
    ],
    flaechen: [...f1.flaechen, ...f2.flaechen],
    ebenenNamen: false,
    fein: true,
  };
}

/** Die drei Fälle zu E: F schneidet, G echt parallel, H identisch. */
export const RAUM_SCHNEIDEN: RaumBildSpec = zweiEbenenBild(E, F);
export const RAUM_PARALLEL: RaumBildSpec = zweiEbenenBild(E, G);
export const RAUM_IDENTISCH: RaumBildSpec = zweiEbenenBild(E, H);

/** Labor: E und die eingestellte Ebene F. Gibt zusätzlich an, ob die Ebene F gezeichnet werden kann. */
export function laborBild(k: Koordinatenform): { spec: RaumBildSpec; kein: boolean } {
  const kein = k.n.every((x) => x === 0);
  if (kein) return { spec: { sprech: 'Schrägbild mit der grauen Ebene E. Es ist keine zweite Ebene eingestellt.', ...ebenenFlaeche(ebeneAusKoordinatenform(E)), ebenenNamen: false, fein: true } as RaumBildSpec, kein: true };
  return { spec: zweiEbenenBild(E, k), kein: false };
}

/** Aufgabe 7: E, die parallele Ebene durch P und der Punkt P. */
export const aufg7: RaumBildSpec = zweiEbenenBild(E, A7.par, { sprech: `Der Punkt P liegt bei ${sp(A7.P)} in der zweiten Ebene.`, punkte: [punkt('P', A7.P)] });
/** Aufgabe 8: die beiden Dachflächen und der First. */
export const aufg8: RaumBildSpec = zweiEbenenBild(A8.d1, A8.d2, {
  sprech: `Der Punkt P bei ${sp(A8.punkt)} liegt auf dem First.`,
  punkte: [imWuerfel(A8.punkt) ? punkt('P', A8.punkt) : punkt('P', [0, 0, 0])],
});
/** Aufgabe 9: E und H (identisch). */
export const aufg9: RaumBildSpec = RAUM_IDENTISCH;
