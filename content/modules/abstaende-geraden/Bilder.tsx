import { imWuerfel, lot, type Gerade } from '@/lib/gerade';
import { linienNamen, punkt, type BenannteLinie } from '@/lib/geradenbild';
import { geradeLinie } from '@/lib/geradenhilfen';
import { wortKoordinaten } from '@/lib/laborhilfen';
import type { EbenenArt, Punkt3, RaumBildSpec, RaumLinie, RaumPunkt } from '@/lib/schraegbild';
import { A_PARALLEL1, A_WEG1, A_ZEICHNEN, BEISPIEL, ORANGE, PARALLEL, ROSA, SCHWARZ } from './daten';

const ALLE_EBENEN: EbenenArt[] = ['e12', 'e13', 'e23'];
const sp = (n: number[]) => wortKoordinaten(n);
/** Gerade im Koordinatensystem, durchgezogen. */
const linie = (g: Gerade, farbe = SCHWARZ): RaumLinie[] => geradeLinie(g, farbe, 2, false);
/** Strecke zwischen zwei Punkten, durchgezogen. */
export const strecke = (von: number[], bis: number[], farbe: string): RaumLinie => ({ von: von as Punkt3, bis: bis as Punkt3, farbe, breite: 2 });
const plus = (a: number[], b: number[]) => a.map((x, i) => x + b[i]!);

/** Raumbild in der feinen Darstellung: Linien, Punkte und die Namen der Geraden und des Lots (`namen`). */
function bild(sprech: string, punkte: RaumPunkt[], linien: RaumLinie[], namen: BenannteLinie[]): RaumBildSpec {
  return { sprech, punkte: [...punkte, ...linienNamen(namen, punkte)], linien, ebenen: ALLE_EBENEN, ebenenNamen: false, fein: true };
}
const lotName = (F: number[], Q: number[], farbe: string): BenannteLinie => ({ strecke: [F as Punkt3, Q as Punkt3], name: 'd', farbe });

/** Erklären: g, Q, Lotfußpunkt F, Lot FQ (orange, Länge d) und die längere Strecke XQ zu einem anderen Punkt X von g (rosa). */
const B = BEISPIEL;
export const RAUM_BEISPIEL: RaumBildSpec = bild(
  `Schrägbild mit den drei Koordinatenebenen. Die schwarze Gerade g, der Punkt Q bei ${sp(B.Q)} und der Lotfußpunkt F bei ${sp(B.F)} auf g. Die orange Strecke FQ steht senkrecht auf g und ist die kürzeste Verbindung von Q zu g, die rosa Strecke von Q zum Punkt X bei ${sp(B.X)} auf g ist länger.`,
  [punkt('Q', B.Q), punkt('F', B.F), punkt('X', B.X)],
  [...linie(B.g), strecke(B.F, B.Q, ORANGE), strecke(B.X, B.Q, ROSA)],
  [{ g: B.g, name: 'g', farbe: SCHWARZ }, lotName(B.F, B.Q, ORANGE)],
);

/** Drei Wege, Weg 3: das Parallelogramm aus u und PQ (rosa), seine Höhe über g ist der Abstand d (orange). */
export const RAUM_WEG3: RaumBildSpec = bild(
  `Schrägbild mit den drei Koordinatenebenen. Die schwarze Gerade g mit dem Stützpunkt P bei ${sp(B.g.p)}, der Punkt Q bei ${sp(B.Q)} und der Lotfußpunkt F bei ${sp(B.F)}. Das rosa Parallelogramm wird von dem Richtungsvektor u und dem Vektor PQ aufgespannt, seine Höhe über der Seite auf g ist die orange Strecke FQ, der gesuchte Abstand.`,
  [punkt('P', B.g.p), punkt('Q', B.Q), punkt('F', B.F)],
  [...linie(B.g), strecke(B.F, B.Q, ORANGE), strecke(B.g.p, B.Q, ROSA), strecke(B.Q, plus(B.Q, B.g.u), ROSA), strecke(plus(B.Q, B.g.u), plus(B.g.p, B.g.u), ROSA)],
  [{ g: B.g, name: 'g', farbe: SCHWARZ }, lotName(B.F, B.Q, ORANGE)],
);

/** Parallele Geraden: g schwarz, h orange, das Lot von Q (Stützpunkt von h) auf g rosa. */
const P = PARALLEL;
export const RAUM_PARALLEL: RaumBildSpec = bild(
  `Schrägbild mit den drei Koordinatenebenen. Die schwarze Gerade g und die orange Gerade h verlaufen parallel. Der Punkt Q bei ${sp(P.h.p)} liegt auf h, die rosa Strecke vom Lotfußpunkt F bei ${sp(P.F)} auf g zu Q steht senkrecht auf beiden Geraden und hat die Länge des Abstands d.`,
  [punkt('Q', P.h.p), punkt('F', P.F)],
  [...linie(P.g), ...linie(P.h, ORANGE), strecke(P.F, P.h.p, ROSA)],
  [{ g: P.g, name: 'g', farbe: SCHWARZ }, { g: P.h, name: 'h', farbe: ORANGE }, lotName(P.F, P.h.p, ROSA)],
);

/** Aufgabe 2 (Weg 1): Kontrollbild mit g, Q, Lotfußpunkt F und Lot. */
export const aufgWeg1: RaumBildSpec = bild(
  `Schrägbild mit den drei Koordinatenebenen. Die schwarze Gerade g, der Punkt Q bei ${sp(A_WEG1.Q)} und der Lotfußpunkt F bei ${sp(A_WEG1.F)}. Die orange Strecke FQ steht senkrecht auf g und hat die Länge d.`,
  [punkt('Q', A_WEG1.Q), punkt('F', A_WEG1.F)],
  [...linie(A_WEG1.g), strecke(A_WEG1.F, A_WEG1.Q, ORANGE)],
  [{ g: A_WEG1.g, name: 'g', farbe: SCHWARZ }, lotName(A_WEG1.F, A_WEG1.Q, ORANGE)],
);

/** Aufgabe 7 (parallel): Kontrollbild mit g, h und dem Lot (rosa). */
export const aufgParallel: RaumBildSpec = bild(
  `Schrägbild mit den drei Koordinatenebenen. Die schwarze Gerade g und die orange Gerade h verlaufen parallel. Der Punkt Q bei ${sp(A_PARALLEL1.h.p)} liegt auf h, der Lotfußpunkt F bei ${sp(A_PARALLEL1.F)} auf g. Die rosa Strecke FQ hat die Länge des Abstands.`,
  [punkt('Q', A_PARALLEL1.h.p), punkt('F', A_PARALLEL1.F)],
  [...linie(A_PARALLEL1.g), ...linie(A_PARALLEL1.h, ORANGE), strecke(A_PARALLEL1.F, A_PARALLEL1.h.p, ROSA)],
  [{ g: A_PARALLEL1.g, name: 'g', farbe: SCHWARZ }, { g: A_PARALLEL1.h, name: 'h', farbe: ORANGE }, lotName(A_PARALLEL1.F, A_PARALLEL1.h.p, ROSA)],
);

/** Aufgabe 13 (Zeichnen): Kontrollbild mit g, Q, F und Lot. */
export const aufgZeichnen: RaumBildSpec = bild(
  `Schrägbild mit den drei Koordinatenebenen. Die schwarze Gerade g, der Punkt Q bei ${sp(A_ZEICHNEN.Q)} und der Lotfußpunkt F bei ${sp(A_ZEICHNEN.F)}. Die orange Strecke FQ steht senkrecht auf g.`,
  [punkt('Q', A_ZEICHNEN.Q), punkt('F', A_ZEICHNEN.F)],
  [...linie(A_ZEICHNEN.g), strecke(A_ZEICHNEN.F, A_ZEICHNEN.Q, ORANGE)],
  [{ g: A_ZEICHNEN.g, name: 'g', farbe: SCHWARZ }, lotName(A_ZEICHNEN.F, A_ZEICHNEN.Q, ORANGE)],
);

/* ---------- Labore ---------- */

const gleichOrt = (a: number[], b: number[]) => a.every((x, i) => x === b[i]);

/**
 * Bild des Lotfußlabors: g, Q, der laufende Punkt X (zu t) mit der Strecke XQ (rosa) und auf Wunsch der Lotfußpunkt F mit dem Lot (orange).
 * Liegt ein Punkt außerhalb des Koordinatensystems (−4 bis 4), wird er und seine Strecke nicht gezeichnet.
 */
export function lotLaborBild(g: Gerade, q: number[], t: number, zeigeLot: boolean): { spec: RaumBildSpec; ausserhalb: string[] } {
  const X = g.p.map((c, i) => c + t * g.u[i]!);
  const l = lot(g, q);
  const ausserhalb: string[] = [];
  const punkte: RaumPunkt[] = [];
  const linien: RaumLinie[] = [...linie(g)];
  const sichtbar = (name: string, p: number[]) => {
    if (!imWuerfel(p)) {
      ausserhalb.push(name);
      return false;
    }
    return true;
  };
  const qDa = sichtbar('Q', q);
  const xDa = sichtbar('X', X);
  const fDa = zeigeLot ? sichtbar('F', l.F) : false;
  if (qDa) punkte.push(punkt('Q', q));
  if (xDa && !gleichOrt(X, q) && !(qDa && punkte.some((p) => gleichOrt(p.p, X)))) punkte.push(punkt('X', X));
  if (qDa && xDa && !gleichOrt(X, q)) linien.push(strecke(X, q, ROSA));
  if (zeigeLot && fDa && qDa && !gleichOrt(l.F, q)) {
    linien.push(strecke(l.F, q, ORANGE));
    if (!punkte.some((p) => gleichOrt(p.p, l.F))) punkte.push(punkt('F', l.F));
  }
  const namen: BenannteLinie[] = [{ g, name: 'g', farbe: SCHWARZ }];
  if (zeigeLot && fDa && qDa && !gleichOrt(l.F, q)) namen.push(lotName(l.F, q, ORANGE));
  const lotSatz = zeigeLot ? ` Der Lotfußpunkt F liegt bei ${sp(l.F)}.` : '';
  return {
    spec: bild(`Schrägbild mit den drei Koordinatenebenen. Die schwarze Gerade g, der Punkt Q bei ${sp(q)} und der laufende Punkt X bei ${sp(X)} auf g. Die rosa Strecke XQ hat die Länge ${String(Math.round(Math.hypot(...X.map((c, i) => c - q[i]!)) * 100) / 100).replace('.', ',')}.${lotSatz}`, punkte, linien, namen),
    ausserhalb,
  };
}

/**
 * Bild des Labors für parallele Geraden: g (schwarz), h durch Q mit dem Richtungsvektor k · u (orange), der Punkt X auf h (Parameter s), auf Wunsch das Lot von X auf g (rosa).
 */
export function parLaborBild(g: Gerade, q: number[], k: number, s: number, zeigeLot: boolean): { spec: RaumBildSpec; ausserhalb: string[]; identisch: boolean } {
  const h: Gerade = { p: q, u: g.u.map((c) => c * k) };
  const X = h.p.map((c, i) => c + s * h.u[i]!);
  const l = lot(g, X);
  const identisch = l.d2 < 1e-12;
  const ausserhalb: string[] = [];
  const punkte: RaumPunkt[] = [];
  const hat = (name: string, p: number[]) => {
    if (!imWuerfel(p)) {
      ausserhalb.push(name);
      return false;
    }
    return true;
  };
  const qDa = hat('Q', q);
  const xDa = hat('X', X);
  const fDa = zeigeLot ? hat('F', l.F) : false;
  if (qDa) punkte.push(punkt('Q', q));
  if (xDa && !punkte.some((p) => gleichOrt(p.p, X))) punkte.push(punkt('X', X));
  const linien: RaumLinie[] = [...linie(g), ...(identisch ? [] : linie(h, ORANGE))];
  const namen: BenannteLinie[] = identisch ? [{ g, name: 'g, h', farbe: SCHWARZ }] : [{ g, name: 'g', farbe: SCHWARZ }, { g: h, name: 'h', farbe: ORANGE }];
  if (zeigeLot && !identisch && xDa && fDa) {
    linien.push(strecke(l.F, X, ROSA));
    if (!punkte.some((p) => gleichOrt(p.p, l.F))) punkte.push(punkt('F', l.F));
    namen.push(lotName(l.F, X, ROSA));
  }
  return {
    spec: bild(`Schrägbild mit den drei Koordinatenebenen. Die schwarze Gerade g und die orange Gerade h durch den Punkt Q bei ${sp(q)}${identisch ? ' liegen aufeinander' : ' verlaufen parallel'}. Der Punkt X bei ${sp(X)} liegt auf h.${zeigeLot && !identisch ? ` Das rosa Lot von X auf g trifft g im Punkt F bei ${sp(l.F)}.` : ''}`, punkte, linien, namen),
    ausserhalb,
    identisch,
  };
}
