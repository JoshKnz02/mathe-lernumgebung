import { imWuerfel, projektionVektor, schnittwinkel, type Gerade, type Koordinatenebene } from '@/lib/gerade';
import { bogenRadius, linienNamen, punkt, winkelBogen, winkelName, type BenannteLinie } from '@/lib/geradenbild';
import { geradeLinie } from '@/lib/geradenhilfen';
import { wortKoordinaten } from '@/lib/laborhilfen';
import { bildpunkt, type EbenenArt, type Punkt3, type RaumBildSpec, type RaumLinie, type RaumPunkt } from '@/lib/schraegbild';
import { skalarprodukt } from '@/lib/vektor';
import { A_PROJ, A_SEILBAHN, A_ZEICHNEN, A_ZWEI, BEISPIEL, EBENE, ORANGE, ROSA, SCHWARZ } from './daten';

const ALLE_EBENEN: EbenenArt[] = ['e12', 'e13', 'e23'];
const sp = (n: number[]) => wortKoordinaten(n);
const plus = (a: number[], b: number[]) => a.map((x, i) => x + b[i]!);
const mal = (k: number, v: number[]) => v.map((x) => x * k);
const rund = (v: number[]) => v.map((x) => Math.round(x * 1e6) / 1e6 + 0) as Punkt3;
const gleichOrt = (a: number[], b: number[]) => a.every((x, i) => Math.abs(x - b[i]!) < 1e-9);
/** Gerade im Koordinatensystem, durchgezogen. */
const linie = (g: Gerade, farbe = SCHWARZ): RaumLinie[] => geradeLinie(g, farbe, 2, false);
export const strecke = (von: number[], bis: number[], farbe: string): RaumLinie => ({ von: rund(von), bis: rund(bis), farbe, breite: 2 });

/** Raumbild in der feinen Darstellung: Linien, Punkte, die Namen der Geraden und der Name des Winkels. */
function bild(sprech: string, punkte: RaumPunkt[], linien: RaumLinie[], namen: BenannteLinie[], winkel?: { name: string; S: number[]; a: number[]; b: number[]; farbe: string }): RaumBildSpec {
  const texte = linienNamen(namen, punkte);
  const alle = [...punkte, ...texte];
  const rB = winkel ? bogenRadius(winkel.S, winkel.a, winkel.b) : 1;
  const bogen = winkel ? winkelBogen(winkel.S, winkel.a, winkel.b, winkel.farbe, rB) : [];
  const marke = winkel ? winkelName(winkel.name, winkel.S, winkel.a, winkel.b, winkel.farbe, linien, punkte, rB) : null;
  if (marke) alle.push(marke);
  return { sprech, punkte: alle, linien: [...linien, ...bogen], ebenen: ALLE_EBENEN, ebenenNamen: false, fein: true };
}

/** Richtung von h, die mit u einen spitzen oder rechten Winkel bildet (das Vorzeichen von v wird bei negativem Skalarprodukt umgekehrt). */
export const spitzeRichtung = (u: number[], v: number[]): number[] => (skalarprodukt(u, v) < 0 ? mal(-1, v) : v);

/** Zwei Geraden g (schwarz) und h (orange) durch den Schnittpunkt S, der Schnittwinkel α als rosa Bogen. */
export function zweiGeradenBild(g: Gerade, h: Gerade, S: number[], mitWinkel = true, punkte?: RaumPunkt[]): RaumBildSpec {
  const a = schnittwinkel(g.u, h.u);
  const parallel = a < 1e-6;
  const winkelOk = mitWinkel && !parallel && a < 90 - 1e-6;
  const rechter = mitWinkel && !parallel && a >= 90 - 1e-6;
  return bild(
    `Schrägbild mit den drei Koordinatenebenen. Die schwarze Gerade g und die orange Gerade h ${parallel ? 'liegen aufeinander' : `schneiden sich im Punkt S bei ${sp(S)}`}.${winkelOk ? ` Der rosa Bogen markiert den Schnittwinkel α von ${String(Math.round(a * 100) / 100).replace('.', ',')} Grad.` : ''}${rechter ? ' Die Geraden stehen senkrecht aufeinander, der Schnittwinkel ist 90 Grad.' : ''}`,
    punkte ?? [punkt('S', S)],
    [...linie(g), ...(parallel ? [] : linie(h, ORANGE))],
    parallel ? [{ g, name: 'g, h', farbe: SCHWARZ }] : [{ g, name: 'g', farbe: SCHWARZ }, { g: h, name: 'h', farbe: ORANGE }],
    winkelOk ? { name: 'α', S, a: g.u, b: spitzeRichtung(g.u, h.u), farbe: ROSA } : undefined,
  );
}

/** Erklären, Zusammenfassung: das Beispiel mit zwei Geraden. */
export const RAUM_SCHNITT: RaumBildSpec = zweiGeradenBild(BEISPIEL.g, BEISPIEL.h, BEISPIEL.S);
/** Aufgabe 2: Kontrollbild. */
export const aufgZwei: RaumBildSpec = zweiGeradenBild(A_ZWEI.g, A_ZWEI.h, A_ZWEI.S);

/** Fußpunktfaktor k: P = S + k · u soll im Koordinatensystem liegen (k = 1, 1/2, 1/4 oder 1/8). */
export function lotFaktor(S: number[], u: number[]): number {
  for (const k of [1, 0.5, 0.25, 0.125]) if (imWuerfel(plus(S, mal(k, u)))) return k;
  return 0.125;
}

export interface EbenenBildOptionen {
  /** Namen der Punkte S (Spurpunkt), P (Punkt auf g) und P′ (Fußpunkt des Lots). */
  namen?: { S: string; P: string; Q: string };
  mitWinkel?: boolean;
  mitLot?: boolean;
  /** Faktor k für P = S + k · u, sonst automatisch. */
  k?: number;
  /** Name der Geraden und ihrer Projektion. */
  gName?: string;
}

/**
 * Gerade g durch den Punkt S der Koordinatenebene e mit dem Richtungsvektor u: g schwarz, die orthogonale Projektion g′ in die Ebene orange (ebenfalls durch S),
 * das Lot von P = S + k · u auf die Ebene rosa, der Winkel α als schwarzer Bogen. Liegt g in der Ebene (Koordinate 0), fällt g′ mit g zusammen, es gibt kein Lot und keinen Winkel.
 */
export function ebenenBild(S: number[], u: number[], e: Koordinatenebene, o: EbenenBildOptionen = {}): { spec: RaumBildSpec; ausserhalb: string[]; imEbene: boolean; senkrecht: boolean; k: number } {
  const namen = o.namen ?? { S: SPUR[e], P: 'P', Q: 'P′' };
  const gName = o.gName ?? 'g';
  const g: Gerade = { p: S, u };
  const pu = projektionVektor(u, e);
  const imEbene = pu.every((c, i) => c === u[i]);
  const senkrecht = pu.every((c) => c === 0);
  const k = o.k ?? lotFaktor(S, u);
  const P = plus(S, mal(k, u));
  const Q = plus(S, mal(k, pu));
  const ausserhalb: string[] = [];
  const punkte: RaumPunkt[] = [punkt(namen.S, S)];
  /** Ein Punkt, der im Schrägbild auf der Stelle eines früheren liegt (Gerade in Blickrichtung), bekommt keinen Buchstaben. */
  const ergaenze = (name: string, p: number[]) => {
    const b = bildpunkt(p as Punkt3);
    if (!punkte.some((q) => Math.hypot(bildpunkt(q.p)[0] - b[0], bildpunkt(q.p)[1] - b[1]) < 1e-6)) punkte.push(punkt(name, p));
  };
  const linien: RaumLinie[] = [...linie(g)];
  const nm: BenannteLinie[] = [{ g, name: gName, farbe: SCHWARZ }];
  if (!imEbene) {
    if (!senkrecht) {
      const gp: Gerade = { p: S, u: pu };
      linien.push(...linie(gp, ORANGE));
      nm.push({ g: gp, name: `${gName}′`, farbe: ORANGE });
    }
    if (o.mitLot !== false) {
      if (imWuerfel(P) && imWuerfel(Q)) {
        linien.push(strecke(Q, P, ROSA));
        ergaenze(namen.P, P);
        if (!senkrecht) ergaenze(namen.Q, Q);
      } else ausserhalb.push(namen.P);
    }
  }
  const wi = !imEbene && !senkrecht && o.mitWinkel !== false ? schnittwinkel(u, pu) : null;
  const spec = bild(
    `Schrägbild mit den drei Koordinatenebenen. Die schwarze Gerade ${gName} geht durch den Punkt ${namen.S} bei ${sp(S)} der ${EB_TEXT[e]}-Ebene.${imEbene ? ' Sie liegt in dieser Ebene, ihre Projektion fällt mit ihr zusammen.' : senkrecht ? ' Sie steht senkrecht auf dieser Ebene.' : ` Die orange Gerade ${gName}′ ist ihre orthogonale Projektion in die Ebene.`}${!imEbene && o.mitLot !== false && ausserhalb.length === 0 ? ` Die rosa Strecke ist das Lot von einem Punkt ${namen.P} von ${gName} auf die Ebene.` : ''}${wi !== null && wi > 0 ? ` Der schwarze Bogen markiert den Winkel α von ${String(Math.round(wi * 100) / 100).replace('.', ',')} Grad zwischen ${gName} und ${gName}′.` : ''}`,
    punkte,
    linien,
    nm,
    wi !== null ? { name: 'α', S, a: u, b: pu, farbe: SCHWARZ } : undefined,
  );
  return { spec, ausserhalb, imEbene, senkrecht, k };
}
const SPUR: Record<Koordinatenebene, string> = { e12: 'S₁₂', e13: 'S₁₃', e23: 'S₂₃' };
const EB_TEXT: Record<Koordinatenebene, string> = { e12: 'x₁x₂', e13: 'x₁x₃', e23: 'x₂x₃' };

/** Erklären: Gerade und x₁x₂-Ebene. */
export const RAUM_EBENE: RaumBildSpec = ebenenBild(EBENE.S, EBENE.g.u, EBENE.ebene).spec;
/** Aufgabe 6: Kontrollbild mit der x₁x₃-Ebene. */
export const aufgProj: RaumBildSpec = ebenenBild(A_PROJ.S, A_PROJ.g.u, 'e13').spec;
/** Aufgabe 11 (Seilbahn): Talstation T auf dem Boden, Bergstation B, Lot von B auf den Boden. */
export const aufgSeilbahn: RaumBildSpec = ebenenBild(A_SEILBAHN.T, A_SEILBAHN.B.map((c, i) => c - A_SEILBAHN.T[i]!), 'e12', { namen: { S: 'T', P: 'B', Q: 'B′' }, k: 1, gName: 'g' }).spec;
/** Aufgabe 12 (Zeichnen): Kontrollbild. */
export const aufgZeichnen: RaumBildSpec = ebenenBild(A_ZEICHNEN.S, A_ZEICHNEN.g.u, 'e12').spec;
