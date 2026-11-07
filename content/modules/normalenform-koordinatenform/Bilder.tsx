import { ebeneAusNormalenform, type Ebene } from '@/lib/ebene';
import { ebenenFlaeche, FARBE, O, pfeil, plus3 } from '@/lib/ebenenbild';
import { kuerzeImWuerfel } from '@/lib/gerade';
import { punkt } from '@/lib/geradenbild';
import { wortKoordinaten } from '@/lib/laborhilfen';
import type { Punkt3, RaumBildSpec, RaumLinie, RaumPunkt } from '@/lib/schraegbild';
import { A_NORMALENVEKTOR, ERKLAEREN, PARALLEL } from './daten';

export { O, pfeil, punkt };
const sp = (v: number[]) => wortKoordinaten(v);
const { rosa, schwarz } = FARBE;

const bild = (o: { sprech: string; punkte: RaumPunkt[]; linien: RaumLinie[]; flaechen?: RaumBildSpec['flaechen'] }): RaumBildSpec => ({ ...o, ebenenNamen: false, fein: true });

/** Normalenvektor n als schwarzer, breiterer Pfeil in P (auf den Würfel gekürzt). */
export const normalenPfeil = (P: number[], n: number[]): RaumLinie => pfeil(P as Punkt3, kuerzeImWuerfel(P, plus3(P, n)).ende, schwarz, 3);

/* ---------- Erklären ---------- */

/** Die Ebene der Erklärung mit P, einem weiteren Punkt X, dem Verbindungsvektor PX (rosa, liegt in der Ebene) und dem Normalenvektor n (schwarz, steht senkrecht auf der Ebene). */
export function erklaerenBild(E: typeof ERKLAEREN): RaumBildSpec {
  
  const f = ebenenFlaeche(E.e);
  return bild({
    sprech: `Schrägbild. Die graue Fläche ist ein Ausschnitt der Ebene E mit dem Stützpunkt P bei ${sp(E.P)}. Der Punkt X bei ${sp(E.X)} liegt in E, der rosa Pfeil von P nach X liegt in der Ebene. Der schwarze Pfeil in P ist ein Normalenvektor, er steht senkrecht auf der Ebene.`,
    punkte: [punkt('P', E.P), punkt('X', E.X)],
    linien: [...f.linien, pfeil(E.P, E.X, rosa, 4.5), normalenPfeil(E.P, E.n)],
    flaechen: f.flaechen,
  });
}
export const RAUM_ERKLAEREN: RaumBildSpec = erklaerenBild(ERKLAEREN);

/* ---------- Entdecken ---------- */

/** Zwei Ebenen mit demselben Normalenvektor n (E₁ grau, E₂ orange berandet), n in P (E₁) und R liegt in E₂. */
export function parallelBild(R: Punkt3): RaumBildSpec {
  const E = ERKLAEREN;
  const e2 = ebeneAusNormalenform(R, PARALLEL.n)!;
  const f1 = ebenenFlaeche(E.e);
  const f2 = ebenenFlaeche(e2, FARBE.orange, 0.18);
  return bild({
    sprech: `Schrägbild. Zwei Ebenen mit demselben Normalenvektor: eine graue Fläche durch den Punkt P bei ${sp(E.P)} und eine Fläche mit orangem Rand durch den Punkt R bei ${sp(R)}. Der schwarze Pfeil in P ist der gemeinsame Normalenvektor. Die Ebenen sind gegeneinander verschoben und schneiden sich nicht.`,
    punkte: [punkt('P', E.P), punkt('R', R)],
    linien: [...f1.linien, ...f2.linien, normalenPfeil(E.P, E.n)],
    flaechen: [...f1.flaechen, ...f2.flaechen],
  });
}
export const RAUM_PARALLEL: RaumBildSpec = parallelBild(PARALLEL.R);

/** Bild des Normalenlabors: die Ebene durch P mit dem Normalenvektor n (Ausschnitt im Koordinatensystem), P und n. */
export function normalenLaborBild(p: number[], n: number[], mitEbene: boolean): { spec: RaumBildSpec; hatEbene: boolean } {
  const nullN = n.every((x) => x === 0);
  const e = nullN ? null : ebeneAusNormalenform(p, n);
  const f = e && mitEbene ? ebenenFlaeche(e) : { flaechen: [], linien: [] as RaumLinie[] };
  const linien: RaumLinie[] = [...f.linien];
  if (!nullN) linien.push(normalenPfeil(p, n));
  return {
    hatEbene: f.flaechen.length > 0,
    spec: bild({
      sprech: `Schrägbild. Der Punkt P liegt bei ${sp(p)}. ${nullN ? 'Der Normalenvektor ist der Nullvektor, damit gibt es keine Ebene.' : `Der schwarze Pfeil in P ist der Normalenvektor n.${mitEbene ? (f.flaechen.length ? ' Die graue Fläche ist ein Ausschnitt der Ebene durch P senkrecht zu n.' : ' Die Ebene trifft das gezeichnete Koordinatensystem nicht.') : ''}`}`,
      punkte: [punkt('P', p)],
      linien,
      flaechen: f.flaechen,
    }),
  };
}

/** Bild des Punktlabors: die Ebene der Erklärung mit dem Normalenvektor in P und dem eingestellten Punkt X. */
export function punktLaborBild(x: number[]): RaumBildSpec {
  const E = ERKLAEREN;
  const f = ebenenFlaeche(E.e);
  const gleichP = x.every((c, i) => c === E.P[i]);
  const punkte: RaumPunkt[] = [punkt('P', E.P), ...(gleichP ? [] : [punkt('X', x)])];
  return bild({
    sprech: `Schrägbild. Die graue Fläche ist ein Ausschnitt der Ebene E mit dem Stützpunkt P bei ${sp(E.P)}. ${gleichP ? 'Der eingestellte Punkt X ist der Stützpunkt P.' : `Der eingestellte Punkt X liegt bei ${sp(x)}.`}`,
    punkte,
    linien: f.linien,
    flaechen: f.flaechen,
  });
}

/* ---------- Aufgaben ---------- */

/** Aufgabe 1: die Ebene aus Aufgabe 1 mit dem Normalenvektor in P. */
export function normalenBild(e: Ebene, nv: number[]): RaumBildSpec {
  const f = ebenenFlaeche(e);
  return bild({
    sprech: `Schrägbild. Die graue Fläche ist ein Ausschnitt der Ebene mit dem Stützpunkt P bei ${sp(e.p)}. Der schwarze Pfeil in P ist ein Normalenvektor, er steht senkrecht auf der Ebene. Zu lang für das Koordinatensystem gezeichnete Pfeile werden gekürzt.`,
    punkte: [punkt('P', e.p)],
    linien: [...f.linien, normalenPfeil(e.p, nv)],
    flaechen: f.flaechen,
  });
}
export const aufgNormalenvektor: RaumBildSpec = normalenBild(A_NORMALENVEKTOR.e, A_NORMALENVEKTOR.n);
