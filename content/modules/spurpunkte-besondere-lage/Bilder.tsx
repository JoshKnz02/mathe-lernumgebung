import { imWuerfel, spurpunkte, type Gerade } from '@/lib/gerade';
import { geradeLinie } from '@/lib/geradenhilfen';
import { wortKoordinaten } from '@/lib/laborhilfen';
import type { EbenenArt, Punkt3, RaumBildSpec, RaumLinie, RaumPunkt } from '@/lib/schraegbild';
import { A_SPUR, A_ZEICHNEN, BLAU, ERKLAEREN, IN_PARALLEL, PARALLEL, ZUSAMMENFASSUNG, ZWEI_EBENEN } from './daten';

const ALLE_EBENEN: EbenenArt[] = ['e12', 'e13', 'e23'];
const gleichOrt = (a: number[], b: number[]) => a.every((x, i) => x === b[i]);

export interface SpurOptionen {
  /** Textalternative ohne die Liste der Punkte. */
  sprech: string;
  /** Spurpunkte einzeichnen und beschriften (Standard: ja). */
  spur?: boolean;
  /** Weitere Punkte, zum Beispiel der Stützpunkt P. */
  punkte?: RaumPunkt[];
  /** Zusätzliche Linien (zum Beispiel eine zweite Gerade). */
  linien?: RaumLinie[];
  /** Koordinatenebenen als durchsichtige Flächen (Standard: alle drei). */
  ebenen?: EbenenArt[];
}

/**
 * Raumbild einer Geraden mit den Koordinatenebenen: die Gerade (schwarz gestrichelt im Koordinatensystem −4 bis 4), auf Wunsch die Spurpunkte mit ihren Namen.
 * Liegt ein Spurpunkt außerhalb des Koordinatensystems, wird er nicht gezeichnet. Fällt er mit einem anderen zusammen (zum Beispiel im Ursprung), steht nur ein Punkt, im Ursprung ohne Buchstaben.
 */
export function spurBild(g: Gerade, o: SpurOptionen): { spec: RaumBildSpec; ausserhalb: string[] } {
  const punkte: RaumPunkt[] = [...(o.punkte ?? [])];
  const ausserhalb: string[] = [];
  if (o.spur !== false) {
    const gezeichnet: number[][] = [];
    for (const s of spurpunkte(g)) {
      if (!imWuerfel(s.punkt)) {
        ausserhalb.push(s.name);
        continue;
      }
      if (gezeichnet.some((q) => gleichOrt(q, s.punkt)) || punkte.some((q) => gleichOrt(q.p, s.punkt))) continue;
      gezeichnet.push(s.punkt);
      const ursprung = s.punkt.every((c) => c === 0);
      punkte.push({ name: ursprung ? 'O' : s.name, p: s.punkt as Punkt3, ...(ursprung ? { ohneText: true } : {}) });
    }
  }
  return { spec: { sprech: o.sprech, punkte, linien: [...geradeLinie(g), ...(o.linien ?? [])], ebenen: o.ebenen ?? ALLE_EBENEN }, ausserhalb };
}

const pk = (name: string, p: Punkt3): RaumPunkt => ({ name, p });

/** Erklären: g mit den drei Spurpunkten S₁₂(1 | 2 | 0), S₁₃(3 | 0 | 4), S₂₃(0 | 3 | −2). */
export const RAUM_ERKLAEREN: RaumBildSpec = spurBild(ERKLAEREN.g, {
  sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarz gestrichelte Gerade durchstößt die x₁x₂-Ebene im Spurpunkt S₁₂ bei ${wortKoordinaten(ERKLAEREN.S12)}, die x₁x₃-Ebene im Spurpunkt S₁₃ bei ${wortKoordinaten(ERKLAEREN.S13)} und die x₂x₃-Ebene im Spurpunkt S₂₃ bei ${wortKoordinaten(ERKLAEREN.S23)}.`,
}).spec;

/** Entdecken, Vermutung 1: parallel zur x₁x₂-Ebene, nur die Spurpunkte S₁₃ und S₂₃. */
export const RAUM_PARALLEL: RaumBildSpec = spurBild(PARALLEL.g, {
  sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarz gestrichelte Gerade verläuft in der Höhe 3 parallel zur x₁x₂-Ebene und durchstößt nur die x₁x₃-Ebene im Spurpunkt S₁₃ bei ${wortKoordinaten(PARALLEL.S13)} und die x₂x₃-Ebene im Spurpunkt S₂₃ bei ${wortKoordinaten(PARALLEL.S23)}.`,
}).spec;

/** Entdecken, Vermutung 1: parallel zu zwei Koordinatenebenen, nur der Spurpunkt S₁₂. */
export const RAUM_ZWEI_EBENEN: RaumBildSpec = spurBild(ZWEI_EBENEN.g, {
  sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarz gestrichelte Gerade verläuft senkrecht nach oben, parallel zur x₃-Achse, und durchstößt nur die x₁x₂-Ebene im Spurpunkt S₁₂ bei ${wortKoordinaten(ZWEI_EBENEN.S12)}.`,
}).spec;

/** Entdecken, Vermutung 2: g₁ liegt in der x₁x₂-Ebene (blau), g₂ verläuft parallel dazu in der Höhe 2 (schwarz). */
export const RAUM_IN_PARALLEL: RaumBildSpec = {
  sprech: `Schrägbild mit der x₁x₂-Ebene. Die blau gestrichelte Gerade g₁ durch den Punkt A bei ${wortKoordinaten(IN_PARALLEL.A)} liegt in der x₁x₂-Ebene. Die schwarz gestrichelte Gerade g₂ durch den Punkt B bei ${wortKoordinaten(IN_PARALLEL.B)} hat dieselbe Richtung, verläuft aber in der Höhe 2 über der Ebene und hat mit ihr keinen gemeinsamen Punkt.`,
  punkte: [pk('A', IN_PARALLEL.A), pk('B', IN_PARALLEL.B)],
  linien: [...geradeLinie(IN_PARALLEL.g1, BLAU), ...geradeLinie(IN_PARALLEL.g2)],
  ebenen: ['e12'],
};

/** Aufgabe 1: Kontrollbild mit den drei Spurpunkten. */
export const aufgSpur: RaumBildSpec = spurBild(A_SPUR.g, {
  sprech: `Schrägbild mit den drei Koordinatenebenen. Die Gerade durchstößt die x₁x₂-Ebene bei ${wortKoordinaten(A_SPUR.S12)}, die x₁x₃-Ebene bei ${wortKoordinaten(A_SPUR.S13)} und die x₂x₃-Ebene bei ${wortKoordinaten(A_SPUR.S23)}.`,
}).spec;

/** Aufgabe 5: Kontrollbild zum Zeichnen. */
export const aufgZeichnen: RaumBildSpec = spurBild(A_ZEICHNEN.g, {
  sprech: `Schrägbild mit den drei Koordinatenebenen. Die Gerade durchstößt die x₁x₂-Ebene bei ${wortKoordinaten(A_ZEICHNEN.S12)}, die x₁x₃-Ebene bei ${wortKoordinaten(A_ZEICHNEN.S13)} und die x₂x₃-Ebene bei ${wortKoordinaten(A_ZEICHNEN.S23)}.`,
}).spec;

/** Zusammenfassung: Gerade parallel zur x₁x₂-Ebene mit den Spurpunkten S₁₃(3 | 0 | 3) und S₂₃(0 | 1,5 | 3). */
export const RAUM_ZUSAMMENFASSUNG: RaumBildSpec = spurBild(ZUSAMMENFASSUNG.g, {
  sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarz gestrichelte Gerade verläuft in der Höhe 3 parallel zur x₁x₂-Ebene und durchstößt die x₁x₃-Ebene bei ${wortKoordinaten(ZUSAMMENFASSUNG.S13)} und die x₂x₃-Ebene bei ${wortKoordinaten(ZUSAMMENFASSUNG.S23)}.`,
}).spec;
