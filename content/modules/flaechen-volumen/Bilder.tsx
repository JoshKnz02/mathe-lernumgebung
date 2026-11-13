import { abstandPunktEbene } from '@/lib/abstandebene';
import { ebenenFlaeche, FARBE } from '@/lib/ebenenbild';
import { vieleckBild } from '@/lib/ebenenhilfen';
import { imWuerfel } from '@/lib/gerade';
import { linienNamen, punkt, type BenannteLinie } from '@/lib/geradenbild';
import { pyramideDreieck, quader } from '@/lib/koerper';
import { wortKoordinaten } from '@/lib/laborhilfen';
import type { Punkt3, RaumBildSpec, RaumLinie, RaumPunkt } from '@/lib/schraegbild';
import { ebeneAusKoordinatenform, formWort } from '@/lib/spurhilfen';
import { A1, A14, A2, A4, A8, PYRAMIDE, QUADER, SPITZE2 } from './daten';

export { punkt };
export const ORANGE = FARBE.orange;
export const ROSA = FARBE.rosa;
export const BLAU = FARBE.blau;
const KANTE = FARBE.schwarz;
const sp = (v: number[]) => wortKoordinaten(v);
const kommas = (v: number[]) => v.map((c) => (Number.isInteger(c) ? String(c) : String(Math.round(c * 100) / 100).replace('.', ','))).join(', ');

const kante = (von: number[], bis: number[], farbe: string = KANTE, breite = 2, gestrichelt = false): RaumLinie => ({ von: von as Punkt3, bis: bis as Punkt3, farbe, breite, ...(gestrichelt ? { gestrichelt: true } : {}) });
/** Strecke, durchgezogen und breiter (Höhe, Lot). */
export const strecke = (von: number[], bis: number[], farbe: string): RaumLinie => kante(von, bis, farbe, 3);
const lotName = (von: number[], bis: number[], farbe: string, name = 'h'): BenannteLinie => ({ strecke: [von as Punkt3, bis as Punkt3], name, farbe });

interface PyramideOptionen {
  /** Die Grundebene als graue Fläche zeichnen (nur bei einer Grundfläche aus mindestens drei Punkten, die erste Ecken legen die Ebene fest). */
  ebene?: boolean;
  /** Die Höhe (orange, mit dem Namen h) und der Höhenfußpunkt. */
  hoehe?: boolean;
  /** Der Höhenfußpunkt bekommt keinen Buchstaben (zum Beispiel, wenn er auf einer Achse liegt). */
  fussOhneText?: boolean;
  /** Zusätzliche Linien (zum Beispiel eine zweite Spitze). */
  linien?: RaumLinie[];
  punkte?: RaumPunkt[];
  /** Gefüllte Seitenfläche (Dreieck aus Spitze und zwei Ecken), rosa. */
  seitenflaeche?: Punkt3[];
  /** Grundfläche füllen (Standard: ja). */
  fuellen?: boolean;
}

/**
 * Pyramide aus der Grundfläche (Ecken in Reihenfolge) und der Spitze S: Grundfläche blau gefüllt, Kanten schwarz, Grundebene grau, Höhe orange.
 * Namen der Ecken sind A, B, C, ... in der übergebenen Reihenfolge.
 */
export function pyramideBild(basis: number[][], S: number[], sprech: string, o: PyramideOptionen = {}): RaumBildSpec {
  const namen = 'ABCDEFGH'.split('');
  const d = pyramideDreieck(basis[0]!, basis[1]!, basis[2]!, S);
  const ebene = o.ebene ? ebenenFlaeche(ebeneAusKoordinatenform(d.form)) : { flaechen: [], linien: [] };
  const grund = vieleckBild(basis as Punkt3[], BLAU, KANTE, o.fuellen === false ? 0 : 0.25);
  const punkte: RaumPunkt[] = [...basis.map((p, i) => punkt(namen[i]!, p)), punkt('S', S), ...(o.punkte ?? [])];
  const strecken: RaumLinie[] = [];
  const benannt: BenannteLinie[] = [];
  if (o.hoehe) {
    punkte.push(o.fussOhneText ? { name: 'F', p: d.F as Punkt3, ohneText: true } : punkt('F', d.F));
    strecken.push(strecke(d.F, S, ORANGE));
    benannt.push(lotName(d.F, S, ORANGE));
  }
  const seite = o.seitenflaeche ? vieleckBild(o.seitenflaeche, ROSA, ROSA, 0.35) : { flaechen: [], linien: [] };
  return {
    sprech: `Schrägbild. ${sprech}`,
    punkte: [...punkte, ...linienNamen(benannt, punkte)],
    linien: [...ebene.linien, ...grund.linien.map((l) => ({ ...l, breite: 2 })), ...basis.map((p) => kante(S, p)), ...seite.linien, ...strecken, ...(o.linien ?? [])],
    flaechen: [...ebene.flaechen, ...grund.flaechen, ...seite.flaechen],
    ebenenNamen: false,
    fein: true,
  };
}

/** Quader ABCDEFGH aus A, B, D, E: Grundfläche ABCD blau gefüllt, zwölf Kanten, acht beschriftete Ecken. */
export function quaderBild(A: number[], B: number[], D: number[], E: number[], sprech: string, o: { hoehe?: boolean } = {}): RaumBildSpec {
  const q = quader(A, B, D, E);
  const [a, b, c, d, e, f, g, h] = q.ecken as Punkt3[];
  const grund = vieleckBild([a!, b!, c!, d!], BLAU, KANTE, 0.25);
  const namen = 'ABCDEFGH'.split('');
  const kanten: RaumLinie[] = [[e!, f!], [f!, g!], [g!, h!], [h!, e!], [a!, e!], [b!, f!], [c!, g!], [d!, h!]].map(([x, y]) => kante(x!, y!));
  const punkte: RaumPunkt[] = q.ecken.map((p, i) => punkt(namen[i]!, p));
  const strecken = o.hoehe ? [strecke(a!, e!, ORANGE)] : [];
  const benannt = o.hoehe ? [lotName(a!, e!, ORANGE)] : [];
  return {
    sprech: `Schrägbild. ${sprech}`,
    punkte: [...punkte, ...linienNamen(benannt, punkte)],
    linien: [...grund.linien.map((l) => ({ ...l, breite: 2 })), ...kanten, ...strecken],
    flaechen: grund.flaechen,
    ebenenNamen: false,
    fein: true,
  };
}

/* ---------- Erklären und Entdecken ---------- */

export const RAUM_QUADER: RaumBildSpec = quaderBild(
  QUADER.A,
  QUADER.B,
  QUADER.D,
  QUADER.E,
  `Ein Quader mit den Ecken A bis H. Die blaue Fläche ist die Grundfläche ABCD, darüber liegt die Deckfläche EFGH. Die Ecke A liegt bei ${sp(QUADER.A)}, B bei ${sp(QUADER.B)}, D bei ${sp(QUADER.D)} und E bei ${sp(QUADER.E)}. Die Kanten AB, AD und AE stehen paarweise senkrecht aufeinander.`,
);

const dP = pyramideDreieck(PYRAMIDE.A, PYRAMIDE.B, PYRAMIDE.C, PYRAMIDE.S);
/** Pyramide ABCS: blaue Grundfläche in der grauen Grundebene E, die Höhe SF (orange) steht senkrecht auf der Ebene. */
export const RAUM_PYRAMIDE: RaumBildSpec = pyramideBild(
  [PYRAMIDE.A, PYRAMIDE.B, PYRAMIDE.C],
  PYRAMIDE.S,
  `Eine Pyramide mit der dreieckigen Grundfläche ABC (blau) in der Grundebene E (grau): ${formWort({ n: [2, 2, -1], d: 2 })}. Die Spitze S liegt bei ${sp(PYRAMIDE.S)}. Der Höhenfußpunkt F liegt bei ${sp(dP.F)}, die orange Strecke SF ist die Höhe h und steht senkrecht auf der Grundebene.`,
  { ebene: true, hoehe: true },
);

/** Pyramide mit zwei Strecken zur Grundebene: Höhe SF (orange) und die Kante SA (rosa), die länger ist. */
export const RAUM_HOEHE_KANTE: RaumBildSpec = pyramideBild(
  [PYRAMIDE.A, PYRAMIDE.B, PYRAMIDE.C],
  PYRAMIDE.S,
  `Dieselbe Pyramide ABCS. Die orange Strecke SF ist die Höhe h, sie steht senkrecht auf der Grundebene. Die rosa Kante SA verbindet die Spitze mit der Ecke A und ist länger als die Höhe.`,
  { ebene: true, hoehe: true, linien: [strecke(PYRAMIDE.S, PYRAMIDE.A, ROSA)] },
);

/** Zwei Pyramiden über demselben Dreieck, deren Spitzen S und S₂ auf einer Parallelen zur Grundebene liegen: beide Höhen sind gleich lang. */
const dS2 = pyramideDreieck(PYRAMIDE.A, PYRAMIDE.B, PYRAMIDE.C, SPITZE2);
export const RAUM_ZWEI_SPITZEN: RaumBildSpec = pyramideBild(
  [PYRAMIDE.A, PYRAMIDE.B, PYRAMIDE.C],
  PYRAMIDE.S,
  `Zwei Pyramiden mit derselben Grundfläche ABC (blau) in der Grundebene E (grau). Die Spitze S liegt bei ${sp(PYRAMIDE.S)} (schwarze Kanten, orange Höhe), die zweite Spitze S₂ bei ${sp(SPITZE2)} (rosa Kanten und rosa Höhe). Beide Spitzen liegen in einer Ebene parallel zur Grundebene, ihre Höhen sind gleich lang.`,
  {
    ebene: true,
    hoehe: true,
    punkte: [punkt('S₂', SPITZE2), { name: 'F₂', p: dS2.F as Punkt3 }],
    linien: [...[PYRAMIDE.A, PYRAMIDE.B, PYRAMIDE.C].map((p) => kante(SPITZE2, p, ROSA)), strecke(dS2.F, SPITZE2, ROSA)],
  },
);

/* ---------- Labor ---------- */

export interface LaborBild {
  spec: RaumBildSpec;
  /** Die Spitze liegt außerhalb des gezeichneten Koordinatensystems und wird nicht gezeichnet. */
  aussen: boolean;
}
/** Bild des Pyramidenlabors: Dreieck ABC in der Grundebene, die Spitze S, auf Wunsch die Höhe mit dem Höhenfußpunkt. */
export function laborBild(S: number[], zeigeHoehe: boolean): LaborBild {
  const aussen = !imWuerfel(S);
  const d = pyramideDreieck(PYRAMIDE.A, PYRAMIDE.B, PYRAMIDE.C, S);
  const gleich = d.h < 1e-9;
  const spitze = [aussen ? '' : ` Die Spitze S liegt bei ${sp(S)}.`, zeigeHoehe && !aussen && !gleich ? ` Die orange Strecke SF ist die Höhe, F liegt bei ${kommas(d.F)}.` : ''].join('');
  if (aussen) {
    const g = vieleckBild([PYRAMIDE.A, PYRAMIDE.B, PYRAMIDE.C], BLAU, KANTE, 0.25);
    const ebene = ebenenFlaeche(ebeneAusKoordinatenform(d.form));
    return {
      aussen,
      spec: {
        sprech: 'Schrägbild. Das blaue Dreieck ABC liegt in der grauen Grundebene E. Die Spitze liegt außerhalb des gezeichneten Koordinatensystems und wird nicht gezeichnet.',
        punkte: [punkt('A', PYRAMIDE.A), punkt('B', PYRAMIDE.B), punkt('C', PYRAMIDE.C)],
        linien: [...ebene.linien, ...g.linien],
        flaechen: [...ebene.flaechen, ...g.flaechen],
        ebenenNamen: false,
        fein: true,
      },
    };
  }
  return {
    aussen,
    spec: pyramideBild([PYRAMIDE.A, PYRAMIDE.B, PYRAMIDE.C], S, `Die Pyramide ABCS mit dem blauen Dreieck ABC in der grauen Grundebene E.${spitze}`, {
      ebene: true,
      hoehe: zeigeHoehe && !gleich,
    }),
  };
}

/* ---------- Aufgaben: Kontrollbilder ---------- */

const qA1 = quader(A1.A, A1.B, A1.D, A1.E);
export const aufg1 = quaderBild(
  A1.A,
  A1.B,
  A1.D,
  A1.E,
  `Ein Quader ABCDEFGH. Die Ecke A liegt bei ${sp(A1.A)}, B bei ${sp(A1.B)}, D bei ${sp(A1.D)}, E bei ${sp(A1.E)}. Die Ecke G liegt bei ${sp(qA1.ecken[6]!)}. Die blaue Fläche ist die Grundfläche ABCD.`,
);

/** Aufgabe 2: Pyramide über dem Rechteck ABCD in der Ebene x₃ = 1, die Höhe steht senkrecht auf der Grundebene. */
export const aufg2 = pyramideBild(
  [A2.A, A2.B, A2.C, A2.D],
  A2.S,
  `Eine Pyramide mit der rechteckigen Grundfläche ABCD (blau) in der Ebene x₃ = 1, die parallel zur x₁x₂-Ebene liegt. Die Ecke A liegt bei ${sp(A2.A)}, B bei ${sp(A2.B)}, C bei ${sp(A2.C)}, D bei ${sp(A2.D)}, die Spitze S bei ${sp(A2.S)}. Die orange Strecke SF ist die Höhe, sie reicht von S senkrecht zur Grundebene.`,
  { hoehe: true },
);

const dA4 = pyramideDreieck(A4.A, A4.B, A4.C, A4.S);
/** Aufgabe 5: Pyramide mit Dreiecksgrundfläche in der Grundebene, Höhe und Höhenfußpunkt. */
export const aufg5 = pyramideBild(
  [A4.A, A4.B, A4.C],
  A4.S,
  `Die Pyramide ABCS mit dem blauen Dreieck ABC in der grauen Grundebene E. Die Ecke A liegt bei ${sp(A4.A)}, B bei ${sp(A4.B)}, C bei ${sp(A4.C)}, die Spitze S bei ${sp(A4.S)}. Der Höhenfußpunkt F liegt bei ${kommas(dA4.F)}, die orange Strecke SF ist die Höhe.`,
  { ebene: true, hoehe: true },
);

const qA8 = quader(A8.A, A8.B, A8.D, A8.E);
/** Aufgabe 8: Geräteschuppen aus einem Quader (Grundfläche blau) und einer Pyramide als Dach (Spitze S). */
export const aufg8 = ((): RaumBildSpec => {
  const k = quaderBild(A8.A, A8.B, A8.D, A8.E, '');
  const deckel = [qA8.ecken[4]!, qA8.ecken[5]!, qA8.ecken[6]!, qA8.ecken[7]!];
  return {
    ...k,
    sprech: `Schrägbild. Ein Geräteschuppen: Der Quader ABCDEFGH hat die Grundfläche ABCD (blau), das Dach ist die Pyramide EFGHS mit der Spitze S bei ${sp(A8.S)}. Die Ecke A liegt bei ${sp(A8.A)}, B bei ${sp(A8.B)}, D bei ${sp(A8.D)}, E bei ${sp(A8.E)}.`,
    punkte: [...k.punkte!, punkt('S', A8.S)],
    linien: [...k.linien!, ...deckel.map((p) => kante(A8.S, p, ROSA))],
  };
})();

/** Aufgabe 9: Seitenfläche ABS der Pyramide aus Aufgabe 2 (rosa). */
export const aufg9 = pyramideBild(
  [A2.A, A2.B, A2.C, A2.D],
  A2.S,
  `Die Pyramide aus Aufgabe 2 mit der rechteckigen Grundfläche ABCD (blau) und der Spitze S bei ${sp(A2.S)}. Die rosa Fläche ist die Seitenfläche ABS, ein Dreieck.`,
  { seitenflaeche: [A2.A, A2.B, A2.S] },
);

/** Vertiefung, Beispiel: Tetraeder ABCS mit den drei Vektoren AB (blau), AC (rosa) und AS (schwarz) ab A. */
const pfeil = (von: number[], bis: number[], farbe: string, breite = 3): RaumLinie => ({ ...kante(von, bis, farbe, breite), pfeil: true });
export const RAUM_VEKTOREN: RaumBildSpec = {
  sprech: `Schrägbild. Das Dreieck ABC der Pyramide ABCS ist blau gefüllt. Von der Ecke A bei ${sp(PYRAMIDE.A)} gehen drei Pfeile aus: AB (blau) zu B bei ${sp(PYRAMIDE.B)}, AC (rosa) zu C bei ${sp(PYRAMIDE.C)} und AS (schwarz) zur Spitze S bei ${sp(PYRAMIDE.S)}. Die Pyramide ist der Teil des Spats, der von diesen drei Vektoren aufgespannt wird, den das Dreieck ABC mit S abschneidet.`,
  ...(() => {
    const g = vieleckBild([PYRAMIDE.A, PYRAMIDE.B, PYRAMIDE.C], BLAU, KANTE, 0.2);
    return {
      punkte: [punkt('A', PYRAMIDE.A), punkt('B', PYRAMIDE.B), punkt('C', PYRAMIDE.C), punkt('S', PYRAMIDE.S)],
      linien: [...g.linien.map((l) => ({ ...l, breite: 1.4 })), kante(PYRAMIDE.B, PYRAMIDE.S, KANTE, 1.4), kante(PYRAMIDE.C, PYRAMIDE.S, KANTE, 1.4), pfeil(PYRAMIDE.A, PYRAMIDE.B, BLAU), pfeil(PYRAMIDE.A, PYRAMIDE.C, ROSA), pfeil(PYRAMIDE.A, PYRAMIDE.S, KANTE, 3)],
      flaechen: g.flaechen,
    };
  })(),
  ebenenNamen: false,
  fein: true,
};

const dA14 = pyramideDreieck(A14.A, A14.B, A14.C, A14.S);
/** Aufgabe 14: Tetraeder ABCS mit der Grundfläche ABC. */
export const aufg14 = pyramideBild(
  [A14.A, A14.B, A14.C],
  A14.S,
  `Ein Tetraeder ABCS: Das Dreieck ABC (blau) ist die Grundfläche, S die Spitze. Die Ecke A liegt bei ${sp(A14.A)}, B bei ${sp(A14.B)}, C bei ${sp(A14.C)}, S bei ${sp(A14.S)}.`,
);
export { dA14, dA4, dP, qA1, qA8 };
