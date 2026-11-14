import { ebeneAusPunkten } from '@/lib/ebene';
import { ebenenFlaeche } from '@/lib/ebenenbild';
import { wortKoordinaten } from '@/lib/laborhilfen';
import type { Punkt3, RaumBildSpec, RaumFlaeche, RaumLinie, RaumPunkt } from '@/lib/schraegbild';
import { A7, A8, A9, FLAECHE, GRAU, ORANGE, ROSA, SCHWARZ } from './daten';

const sp = (p: number[]) => wortKoordinaten(p);
const punkt = (name: string, p: number[], extra: Partial<RaumPunkt> = {}): RaumPunkt => ({ name, p: p as Punkt3, ...extra });
const linie = (von: number[], bis: number[], farbe = SCHWARZ, extra: Partial<RaumLinie> = {}): RaumLinie => ({ von: von as Punkt3, bis: bis as Punkt3, farbe, breite: 2, ...extra });
const plus = (p: number[], t: number, v: number[]): Punkt3 => p.map((c, i) => c + t * v[i]!) as Punkt3;

/** Rand einer Fläche als Linien (dünn). */
const rand = (ecken: Punkt3[], farbe: string): RaumLinie[] => ecken.map((e, i) => linie(e, ecken[(i + 1) % ecken.length]!, farbe, { breite: 1.4 }));

/** Ausschnitt der Decke x₃ = 2 in Aufgabe 7. */
export const DECKE_ECKEN: Punkt3[] = [[-1, -3.5, 2], [3.5, -3.5, 2], [3.5, 2.5, 2], [-1, 2.5, 2]];

/**
 * Aufgabe 7: Laser L, die Decke (grün, Ebene x₃ = 2) und der Strahl, vor der Decke gezeichnet. Mit `kontrolle` der Durchstoßpunkt P, der Spiegelpunkt L′,
 * der reflektierte Strahl bis zum Boden (rosa) und der Punkt R auf dem Boden.
 */
export function raumLaser(kontrolle: boolean): RaumBildSpec {
  const d = A7;
  const decke: RaumFlaeche = { ecken: DECKE_ECKEN, farbe: FLAECHE, deckkraft: 0.22 };
  const punkte = [punkt('L', d.L)];
  const linien = [...rand(DECKE_ECKEN, FLAECHE)];
  if (kontrolle) {
    punkte.push(punkt('P', d.P), punkt('L′', d.Ls), punkt('R', d.Fl));
    linien.push(linie(d.L, d.P, ORANGE), linie(d.P, d.Fl, ROSA), linie(d.Ls, d.P, GRAU, { gestrichelt: true }));
  } else linien.push(linie(d.L, plus(d.L, 0.8, d.u), ORANGE));
  return {
    sprech: `Schrägbild eines Raums. Der Laser L liegt bei ${sp(d.L)} auf dem Boden. Die grüne Fläche ist ein Ausschnitt der Decke in der Ebene x₃ gleich 2. Der orange Laserstrahl läuft von L schräg nach oben auf die Decke zu.${
      kontrolle ? ` Er trifft die Decke im Punkt P bei ${sp(d.P)}. Der Spiegelpunkt L′ von L an der Decke liegt bei ${sp(d.Ls)}. Der reflektierte Strahl (rosa) läuft von P zum Boden und trifft ihn im Punkt R bei ${sp(d.Fl)}. Die graue gestrichelte Strecke verbindet L′ mit P.` : ''
    }`,
    punkte,
    linien,
    flaechen: [decke],
    ebenen: ['e12'],
    ebenenNamen: false,
    fein: true,
  };
}

/** Daten einer Aufgabe mit einer Ebene aus drei Punkten und einem Punkt Q. */
export interface SolarDaten {
  A: Punkt3;
  B: Punkt3;
  C: Punkt3;
  Q: Punkt3;
  F: Punkt3;
}

/** Aufgabe 8: die Ebene E (grau) durch A, B, C und die Messdrohne Q. Mit `kontrolle` der Lotfußpunkt F und das Lot QF (rosa). */
export function raumSolar(kontrolle: boolean, d: SolarDaten = A8): RaumBildSpec {
  const e = ebeneAusPunkten([...d.A], [...d.B], [...d.C]);
  const { flaechen, linien } = ebenenFlaeche(e);
  const punkte = [punkt('A', d.A), punkt('B', d.B), punkt('C', d.C), punkt('Q', d.Q)];
  if (kontrolle) {
    punkte.push(punkt('F', d.F));
    linien.push(linie(d.Q, d.F, ROSA, { breite: 3 }));
  }
  return {
    sprech: `Schrägbild der grauen Ebene E mit den Punkten A bei ${sp(d.A)}, B bei ${sp(d.B)} und C bei ${sp(d.C)}. Über der Ebene schwebt die Messdrohne im Punkt Q bei ${sp(d.Q)}.${
      kontrolle ? ` Die rosa Strecke steht senkrecht auf der Ebene und verbindet Q mit dem Lotfußpunkt F bei ${sp(d.F.map((c) => Math.round(c * 100) / 100))}.` : ''
    }`,
    punkte,
    linien,
    flaechen,
    ebenen: ['e12'],
    ebenenNamen: false,
    fein: true,
  };
}

/** Daten der Glaspyramide mit Schacht. */
export interface PyramideDaten {
  A: Punkt3;
  B: Punkt3;
  C: Punkt3;
  D: Punkt3;
  S: Punkt3;
  K: Punkt3;
  u: number[];
  X: Punkt3;
  F: Punkt3;
}

/**
 * Aufgabe 9: die Pyramide ABCDS, die Seitenfläche BCS (grün) und der Schacht g (orange) von K aus, gezeichnet bis über die Seitenfläche hinaus.
 * Mit `kontrolle` der Durchstoßpunkt X und das Lot von K auf die Ebene der Seitenfläche (rosa) mit Fußpunkt F.
 */
export function raumPyramide(kontrolle: boolean, d: PyramideDaten): RaumBildSpec {
  const flaeche: RaumFlaeche = { ecken: [d.B, d.C, d.S], farbe: FLAECHE, deckkraft: 0.3 };
  const punkte = [punkt('A', d.A), punkt('B', d.B), punkt('C', d.C), punkt('D', d.D), punkt('S', d.S), punkt('K', d.K)];
  const linien = [
    linie(d.A, d.B), linie(d.B, d.C), linie(d.C, d.D), linie(d.D, d.A),
    linie(d.A, d.S), linie(d.B, d.S), linie(d.C, d.S), linie(d.D, d.S),
    linie(d.K, plus(d.K, 0.8, d.u), ORANGE, { breite: 3 }),
  ];
  if (kontrolle) {
    punkte.push(punkt('X', d.X), punkt('F', d.F, { ohneText: true }));
    linien.push(linie(d.K, d.F, ROSA, { gestrichelt: true }));
  }
  return {
    sprech: `Schrägbild einer Pyramide mit quadratischer Grundfläche ABCD in der x₁x₂-Ebene und der Spitze S bei ${sp(d.S)}. Die Seitenfläche BCS ist grün gefüllt. Der orange Schacht beginnt im Innern der Pyramide im Punkt K bei ${sp(d.K)} und läuft schräg nach außen auf die Seitenfläche BCS zu.${
      kontrolle ? ` Er durchstößt die Seitenfläche im Punkt X bei ${sp(d.X)}. Die rosa gestrichelte Strecke ist das Lot von K auf die Ebene der Seitenfläche.` : ''
    }`,
    punkte,
    linien,
    flaechen: [flaeche],
    ebenen: ['e12'],
    ebenenNamen: false,
    fein: true,
  };
}

export const PYRAMIDE: PyramideDaten = (() => {
  const a = A9;
  const f = plus([...a.K], 3 / 5, [...a.n]);
  return { A: a.A, B: a.B, C: a.C, D: a.D, S: a.S, K: a.K, u: a.u, X: a.X, F: f };
})();
