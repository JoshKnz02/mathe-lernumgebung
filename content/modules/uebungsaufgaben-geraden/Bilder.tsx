import { wortKoordinaten } from '@/lib/laborhilfen';
import type { Punkt3, RaumBildSpec, RaumFlaeche, RaumLinie, RaumPunkt } from '@/lib/schraegbild';
import { A7, A8, A9, A10, GRAU, ORANGE, ROSA, SCHWARZ, WANDFARBE } from './daten';

const sp = (p: number[]) => wortKoordinaten(p);
const punkt = (name: string, p: number[], extra: Partial<RaumPunkt> = {}): RaumPunkt => ({ name, p: p as Punkt3, ...extra });
const linie = (von: number[], bis: number[], farbe = SCHWARZ, extra: Partial<RaumLinie> = {}): RaumLinie => ({ von: von as Punkt3, bis: bis as Punkt3, farbe, breite: 2, ...extra });
const plus = (p: number[], t: number, v: number[]) => p.map((c, i) => c + t * v[i]!);

/** Start und Richtung zweier Flugbahnen und ihr gemeinsamer Punkt. */
export interface DrohnenDaten {
  A: { start: number[]; richtung: number[] };
  B: { start: number[]; richtung: number[] };
  S: Punkt3;
}
/** Aufgabe 7: die Flugbahnen der Drohnen A (schwarz) und B (orange) bis zur Höhe 4. Mit `kontrolle` zusätzlich der gemeinsame Punkt S. */
export function raumDrohnen(kontrolle: boolean, d: DrohnenDaten = A7): RaumBildSpec {
  const a = d.A;
  const b = d.B;
  const punkte = [punkt('A₀', a.start), punkt('B₀', b.start)];
  if (kontrolle) punkte.push(punkt('S', d.S));
  return {
    sprech: `Schrägbild mit den Flugbahnen zweier Drohnen. Die schwarze Bahn der Drohne A beginnt im Punkt A₀ bei ${sp(a.start)} mit der Richtung ${sp(a.richtung)}, die orange Bahn der Drohne B im Punkt B₀ bei ${sp(b.start)} mit der Richtung ${sp(b.richtung)}.${
      kontrolle ? ` Die Bahnen schneiden sich im Punkt S bei ${sp(d.S)}.` : ''
    }`,
    punkte,
    linien: [linie(a.start, plus(a.start, 2, a.richtung), SCHWARZ), linie(b.start, plus(b.start, 2, b.richtung), ORANGE)],
    ebenen: ['e12'],
    ebenenNamen: false,
    fein: true,
  };
}

/** Aufgabe 8: Fahnenmast, Gartenmauer in der Ebene x₂ = 4 und der Sonnenstrahl durch die Spitze. Mit `kontrolle` der Schattenpunkt T′ und der Schatten des Masts. */
export function raumMast(kontrolle: boolean): RaumBildSpec {
  const d = A8;
  const mauer: RaumFlaeche = { ecken: [[d.x1Min, d.wand, 0], [d.x1Max, d.wand, 0], [d.x1Max, d.wand, d.hoehe], [d.x1Min, d.wand, d.hoehe]], farbe: WANDFARBE, deckkraft: 0.3 };
  const rand = [0, 1, 2, 3].map((i) => linie(mauer.ecken[i]!, mauer.ecken[(i + 1) % 4]!, WANDFARBE, { breite: 1.6 }));
  const punkte = [punkt('F', d.F), punkt('T', d.T)];
  const linien = [linie(d.F, d.T, SCHWARZ), ...rand];
  if (kontrolle) {
    const fuss: Punkt3 = [d.Ts[0], d.wand, 0];
    punkte.push(punkt('T′', d.Ts));
    linien.push(linie(d.T, d.Ts, ORANGE, { gestrichelt: true }), linie(d.F, fuss, GRAU, { gestrichelt: true }), linie(fuss, d.Ts, GRAU, { gestrichelt: true }));
  } else linien.push(linie(d.T, plus(d.T, 1.5, d.v), ORANGE, { gestrichelt: true }));
  return {
    sprech: `Schrägbild eines Fahnenmasts mit dem Fußpunkt F bei ${sp(d.F)} und der Spitze T bei ${sp(d.T)}. Die grüne Fläche ist die Gartenmauer in der Ebene x₂ gleich 4, sie ist 1,2 hoch. Der orange gestrichelte Sonnenstrahl läuft von der Spitze zur Ebene der Mauer.${
      kontrolle ? ` Er trifft die Ebene im Punkt T′ bei ${sp(d.Ts)}, über der Mauerkante. Der graue gestrichelte Schatten des Masts läuft über den Boden bis zur Mauer und dort nach oben.` : ''
    }`,
    punkte,
    linien,
    flaechen: [mauer],
    ebenen: ['e12'],
    ebenenNamen: false,
    fein: true,
  };
}

/** Daten einer Seilbahnaufgabe (Talstation, Bergstation, Aussichtspunkt). */
export interface SeilbahnDaten {
  Ta: Punkt3;
  Bs: Punkt3;
  Q: Punkt3;
}
const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i]!, 0);
const diff = (a: number[], b: number[]) => a.map((x, i) => x - b[i]!);

/** Aufgabe 9: die Seilbahn von Ta nach Bs und der Aussichtspunkt Q. Mit `kontrolle` die Stütze bei P (Seilmitte, senkrecht darunter) und der Lotfußpunkt F mit der Strecke QF. */
export function raumSeilbahn(kontrolle: boolean, d: SeilbahnDaten = A9): RaumBildSpec {
  const u = diff(d.Bs, d.Ta);
  const punkte = [punkt('Ta', d.Ta, { breite: 2 }), punkt('Bs', d.Bs, { breite: 2 }), punkt('Q', d.Q)];
  const linien = [linie(d.Ta, d.Bs, SCHWARZ)];
  const P = [d.Ta[0] + u[0]! / 2, d.Ta[1] + u[1]! / 2, 0];
  if (kontrolle) {
    const t = dot(diff(d.Q, d.Ta), u) / dot(u, u);
    const F = plus(d.Ta, t, u);
    const oben = plus(d.Ta, 0.5, u);
    punkte.push(punkt('P', P), punkt('F', F));
    linien.push(linie(P, oben, ORANGE), linie(d.Q, F, ROSA));
  }
  return {
    sprech: `Schrägbild einer Seilbahn. Das schwarze Seil läuft von der Talstation Ta bei ${sp(d.Ta)} zur Bergstation Bs bei ${sp(d.Bs)}. Der Aussichtspunkt Q liegt bei ${sp(d.Q)}.${
      kontrolle ? ` Die orange Stütze steht im Punkt P bei ${sp(P)} senkrecht unter dem Seil. Die rosa Strecke verbindet Q mit dem Lotfußpunkt F auf dem Seil, sie steht senkrecht auf dem Seil.` : ''
    }`,
    punkte,
    linien,
    ebenen: ['e12'],
    ebenenNamen: false,
    fein: true,
  };
}

/** Daten einer Dreiecksaufgabe. */
export interface DreieckDaten {
  A: Punkt3;
  B: Punkt3;
  C: Punkt3;
}
const mitte = (p: number[], q: number[]): Punkt3 => p.map((x, i) => (x + q[i]!) / 2) as Punkt3;

/** Aufgabe 10: das Dreieck ABC mit den Seitenmitten. Mit `kontrolle` die Seitenhalbierenden (schwarz, orange, rosa) und der Schwerpunkt S. */
export function raumDreieck(kontrolle: boolean, d: DreieckDaten = A10): RaumBildSpec {
  const Ma = mitte(d.B, d.C);
  const Mb = mitte(d.A, d.C);
  const Mc = mitte(d.A, d.B);
  const S = d.A.map((x, i) => (x + d.B[i]! + d.C[i]!) / 3);
  const punkte = [punkt('A', d.A), punkt('B', d.B), punkt('C', d.C), punkt('Mₐ', Ma), punkt('M_b', Mb), punkt('M_c', Mc)];
  const linien = [linie(d.A, d.B), linie(d.B, d.C), linie(d.C, d.A)];
  if (kontrolle) {
    punkte.push(punkt('S', S));
    linien.push(linie(d.A, Ma, SCHWARZ, { breite: 3 }), linie(d.B, Mb, ORANGE, { breite: 3 }), linie(d.C, Mc, ROSA, { breite: 3 }));
  }
  return {
    sprech: `Schrägbild des Dreiecks ABC mit A bei ${sp(d.A)}, B bei ${sp(d.B)} und C bei ${sp(d.C)}. Die Punkte Mₐ, M_b und M_c sind die Mitten der Seiten BC, AC und AB.${
      kontrolle ? ` Die drei Seitenhalbierenden AMₐ (schwarz), BM_b (orange) und CM_c (rosa) schneiden sich im Schwerpunkt S bei ${sp(S)}.` : ''
    }`,
    punkte,
    linien,
    ebenen: ['e12'],
    ebenenNamen: false,
    fein: true,
  };
}
