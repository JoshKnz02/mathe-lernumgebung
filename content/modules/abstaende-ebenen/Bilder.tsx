import { abstandPunktEbene, spiegelpunkt } from '@/lib/abstandebene';
import type { Koordinatenform } from '@/lib/ebene';
import { ebenenFlaeche, FARBE } from '@/lib/ebenenbild';
import { imWuerfel, type Gerade } from '@/lib/gerade';
import { linienNamen, punkt, type BenannteLinie } from '@/lib/geradenbild';
import { geradeLinie } from '@/lib/geradenhilfen';
import { wortKoordinaten } from '@/lib/laborhilfen';
import type { Punkt3, RaumBildSpec, RaumLinie, RaumPunkt } from '@/lib/schraegbild';
import { ebeneAusKoordinatenform, formWort } from '@/lib/spurhilfen';
import { A1, A12, A5, A7, A8, A9, BEISPIEL, E, EBENE_F, GERADE } from './daten';

export { punkt };
export const SCHWARZ = FARBE.schwarz;
export const ORANGE = FARBE.orange;
export const ROSA = FARBE.rosa;
const sp = (v: number[]) => wortKoordinaten(v);
const kommas = (v: number[]) => v.map((c) => (Number.isInteger(c) ? String(c) : String(Math.round(c * 100) / 100).replace('.', ','))).join(', ');

/** Strecke zwischen zwei Punkten, durchgezogen und breiter (Lot, Verbindungen). */
export const strecke = (von: number[], bis: number[], farbe: string): RaumLinie => ({ von: von as Punkt3, bis: bis as Punkt3, farbe, breite: 3 });
const lotName = (von: number[], bis: number[], farbe: string, name = 'd'): BenannteLinie => ({ strecke: [von as Punkt3, bis as Punkt3], name, farbe });

interface BildOptionen {
  /** Zweite Ebene (orange berandet). */
  zweite?: Koordinatenform;
  /** Geraden (durchgezogen, mit Namen dicht an der Linie). */
  geraden?: { g: Gerade; name: string; farbe: string }[];
  strecken?: RaumLinie[];
  namen?: BenannteLinie[];
  punkte?: RaumPunkt[];
}

/** Raumbild: Ebene E als graue Fläche, optional eine zweite Ebene, Geraden, Strecken (Lot) und beschriftete Punkte. Feine Darstellung. */
export function ebenenBild(k: Koordinatenform, sprech: string, o: BildOptionen = {}): RaumBildSpec {
  const f = ebenenFlaeche(ebeneAusKoordinatenform(k));
  const f2 = o.zweite ? ebenenFlaeche(ebeneAusKoordinatenform(o.zweite), FARBE.orange, 0.2) : { flaechen: [], linien: [] };
  const benannt: BenannteLinie[] = [...(o.geraden ?? []).map((x) => ({ g: x.g, name: x.name, farbe: x.farbe })), ...(o.namen ?? [])];
  const punkte = o.punkte ?? [];
  return {
    sprech: `Schrägbild. ${sprech}`,
    punkte: [...punkte, ...linienNamen(benannt, punkte)],
    linien: [...f.linien, ...f2.linien, ...(o.geraden ?? []).flatMap((x) => geradeLinie(x.g, x.farbe, 2, false)), ...(o.strecken ?? [])],
    flaechen: [...f.flaechen, ...f2.flaechen],
    ebenenNamen: false,
    fein: true,
  };
}
const ebeneWort = (k: Koordinatenform, name = 'E') => `Die graue Fläche ist ein Ausschnitt der Ebene ${name}: ${formWort(k)}.`;

/* ---------- Erklären ---------- */

const Q = BEISPIEL.Q;
const X = BEISPIEL.X;
const FQ = abstandPunktEbene(E, Q).F;
/** Punkt Q, Lotfußpunkt F, das Lot (orange, Länge d) und die längere Strecke zu einem anderen Punkt X der Ebene (rosa). */
export const RAUM_LOT: RaumBildSpec = ebenenBild(
  E,
  `${ebeneWort(E)} Der Punkt Q liegt bei ${sp(Q)}. Der Lotfußpunkt F in der Ebene ist der Punkt, der Q am nächsten liegt. Die orange Strecke FQ ist das Lot mit der Länge d. Die rosa Strecke von Q zum Punkt X bei ${sp(X)} der Ebene ist länger.`,
  { punkte: [punkt('Q', Q), punkt('F', FQ), punkt('X', X)], strecken: [strecke(FQ, Q, ORANGE), strecke(X, Q, ROSA)], namen: [lotName(FQ, Q, ORANGE)] },
);

const P = GERADE.p;
const FP = abstandPunktEbene(E, P).F;
/** Gerade g echt parallel zu E, das Lot von P auf E. */
export const RAUM_GERADE: RaumBildSpec = ebenenBild(
  E,
  `${ebeneWort(E)} Die schwarze Gerade g ist echt parallel zur Ebene. Der Punkt P bei ${sp(P)} liegt auf g, der Punkt F bei ${kommas(FP)} ist sein Lotfußpunkt in der Ebene. Die orange Strecke PF zeigt den Abstand d der Geraden von der Ebene.`,
  { geraden: [{ g: GERADE, name: 'g', farbe: SCHWARZ }], punkte: [punkt('P', P), punkt('F', FP)], strecken: [strecke(FP, P, ORANGE)], namen: [lotName(FP, P, ORANGE)] },
);

/** Parallele Ebenen E (grau) und F (orange berandet), ein Punkt P in F und sein Lot auf E. */
export const RAUM_EBENEN: RaumBildSpec = ebenenBild(
  E,
  `Zwei parallele Ebenen. Die graue Fläche ist ein Ausschnitt der Ebene E: ${formWort(E)}, die orange berandete Fläche ein Ausschnitt der Ebene F: ${formWort(EBENE_F)}. Der Punkt P bei ${sp(P)} liegt in F, der Punkt G bei ${kommas(FP)} ist sein Lotfußpunkt in E. Die orange Strecke PG zeigt den Abstand d der Ebenen.`,
  { zweite: EBENE_F, punkte: [punkt('P', P), punkt('G', FP)], strecken: [strecke(FP, P, ORANGE)], namen: [lotName(FP, P, ORANGE)] },
);

const Qs = spiegelpunkt(E, Q);
/** Spiegelung: Q, Lotfußpunkt F als Mitte und der Spiegelpunkt Q′. */
export const RAUM_SPIEGEL: RaumBildSpec = ebenenBild(
  E,
  `${ebeneWort(E)} Der Punkt Q liegt bei ${sp(Q)}. Sein Lotfußpunkt F in der Ebene liegt genau in der Mitte zwischen Q und dem Spiegelpunkt Q′ bei ${kommas(Qs)}. Die orange Strecke von Q zu F und die rosa Strecke von F zu Q′ sind gleich lang und stehen senkrecht auf der Ebene.`,
  { punkte: [punkt('Q', Q), punkt('F', FQ), punkt("Q′", Qs)], strecken: [strecke(FQ, Q, ORANGE), strecke(FQ, Qs, ROSA)] },
);

/* ---------- Labor ---------- */

export interface LaborBild {
  spec: RaumBildSpec;
  /** Punkte, die außerhalb des gezeichneten Koordinatensystems liegen und nicht gezeichnet werden. */
  aussen: string[];
}
/**
 * Bild des Lotlabors: E, Q, der Punkt X der Ebene (Verschiebung a · u + b · v vom Lotfußpunkt aus) mit der Strecke XQ (rosa), auf Wunsch das Lot FQ (orange) und der Spiegelpunkt Q′.
 * Punkte außerhalb des Koordinatensystems (−4 bis 4) werden nicht gezeichnet.
 */
export function lotLaborBild(q: number[], x: number[], zeigeLot: boolean, zeigeSpiegel: boolean): LaborBild {
  const r = abstandPunktEbene(E, q);
  const sp3 = spiegelpunkt(E, q);
  const aussen: string[] = [];
  const innen = (name: string, p: number[]) => {
    if (imWuerfel(p)) return true;
    aussen.push(name);
    return false;
  };
  const gleich = (a: number[], b: number[]) => a.every((c, i) => Math.abs(c - b[i]!) < 1e-9);
  const punkte: RaumPunkt[] = [];
  const strecken: RaumLinie[] = [];
  const namen: BenannteLinie[] = [];
  const qDa = innen('Q', q);
  if (qDa) punkte.push(punkt('Q', q));
  const xDa = innen('X', x);
  if (xDa && !gleich(x, r.F)) punkte.push(punkt('X', x));
  if (xDa && qDa && !gleich(x, r.F)) strecken.push(strecke(x, q, ROSA));
  const fDa = imWuerfel(r.F);
  if (zeigeLot && fDa && qDa) {
    punkte.push(punkt('F', r.F));
    if (!gleich(q, r.F)) {
      strecken.push(strecke(r.F, q, ORANGE));
      namen.push(lotName(r.F, q, ORANGE));
    }
  } else if (zeigeLot && !fDa) aussen.push('F');
  if (zeigeSpiegel && !gleich(q, r.F)) {
    if (innen("Q′", sp3)) {
      punkte.push(punkt("Q′", sp3));
      if (fDa) strecken.push(strecke(r.F, sp3, ROSA));
    }
  }
  const text = `${ebeneWort(E)} Der Punkt Q liegt bei ${sp(q)}${xDa ? `, der Punkt X der Ebene bei ${sp(x)}. Die rosa Strecke XQ verbindet ihn mit Q` : ''}.${zeigeLot && fDa ? ` Der Lotfußpunkt F liegt bei ${kommas(r.F)}, die orange Strecke FQ ist das Lot.` : ''}${zeigeSpiegel && imWuerfel(sp3) && !gleich(q, r.F) ? ` Der Spiegelpunkt Q′ liegt bei ${kommas(sp3)}.` : ''}`;
  return { spec: ebenenBild(E, text, { punkte, strecken, namen }), aussen: [...new Set(aussen)] };
}

/** Bild des Parallelenlabors: E, die parallele Gerade g, der Punkt X auf g und sein Lot auf E. */
export function parallelLaborBild(s: number): { spec: RaumBildSpec; aussen: boolean } {
  const x = GERADE.p.map((c, i) => c + s * GERADE.u[i]!);
  const r = abstandPunktEbene(E, x);
  const aussen = !imWuerfel(x) || !imWuerfel(r.F);
  const punkte = aussen ? [] : [punkt('X', x), punkt('F', r.F)];
  return {
    aussen,
    spec: ebenenBild(
      E,
      `${ebeneWort(E)} Die schwarze Gerade g ist echt parallel zur Ebene.${aussen ? '' : ` Der Punkt X bei ${sp(x)} liegt auf g, die orange Strecke XF ist sein Lot auf die Ebene.`}`,
      { geraden: [{ g: GERADE, name: 'g', farbe: SCHWARZ }], punkte, strecken: aussen ? [] : [strecke(r.F, x, ORANGE)], namen: aussen ? [] : [lotName(r.F, x, ORANGE)] },
    ),
  };
}

/* ---------- Aufgaben: Kontrollbilder ---------- */

/** Punkt, Lotfußpunkt und Lot zu einer Ebene (Aufgaben 1 und 5). */
export function lotKontrolle(k: Koordinatenform, q: number[], pName = 'Q', extra = ''): RaumBildSpec {
  const r = abstandPunktEbene(k, q);
  return ebenenBild(k, `${ebeneWort(k)} Der Punkt ${pName} liegt bei ${sp(q)}. Der Lotfußpunkt F liegt bei ${kommas(r.F)}. Die orange Strecke FQ steht senkrecht auf der Ebene und hat die Länge d.${extra}`, {
    punkte: [punkt(pName, q), punkt('F', r.F)],
    strecken: [strecke(r.F, q, ORANGE)],
    namen: [lotName(r.F, q, ORANGE)],
  });
}
export const aufg1 = lotKontrolle(A1.k, A1.Q);
export const aufg5 = lotKontrolle(A5.k, A5.Q, 'Q', ' Die Höhe des Lotfußpunkts ist seine x₃-Koordinate.');

const FA7 = abstandPunktEbene(A7.k, A7.g.p).F;
/** Aufgabe 7: Gerade g parallel zu E₇ mit dem Lot von P. */
export const aufg7 = ebenenBild(A7.k, `${ebeneWort(A7.k)} Die schwarze Gerade g ist echt parallel zur Ebene. Der Punkt P bei ${sp(A7.g.p)} liegt auf g, sein Lotfußpunkt F bei ${kommas(FA7)} in der Ebene. Die orange Strecke PF zeigt den Abstand.`, {
  geraden: [{ g: A7.g, name: 'g', farbe: SCHWARZ }],
  punkte: [punkt('P', A7.g.p), punkt('F', FA7)],
  strecken: [strecke(FA7, A7.g.p, ORANGE)],
  namen: [lotName(FA7, A7.g.p, ORANGE)],
});

const FA8 = abstandPunktEbene(A8.e, A8.Q).F;
/** Aufgabe 8: parallele Ebenen E₈ (grau) und F₈ (orange berandet), Q in F₈ und sein Lot auf E₈. */
export const aufg8 = ebenenBild(A8.e, `Zwei parallele Ebenen. Die graue Fläche ist ein Ausschnitt der Ebene E: ${formWort(A8.e)}, die orange berandete Fläche ein Ausschnitt der Ebene F: ${formWort(A8.f)}. Der Punkt Q bei ${sp(A8.Q)} liegt in F, sein Lotfußpunkt G bei ${kommas(FA8)} in E. Die orange Strecke QG zeigt den Abstand der Ebenen.`, {
  zweite: A8.f,
  punkte: [punkt('Q', A8.Q), punkt('G', FA8)],
  strecken: [strecke(FA8, A8.Q, ORANGE)],
  namen: [lotName(FA8, A8.Q, ORANGE)],
});

/** Aufgabe 9: Q, Lotfußpunkt F und Spiegelpunkt Q′. */
export const aufg9 = ebenenBild(A9.k, `${ebeneWort(A9.k)} Der Punkt Q liegt bei ${sp(A9.Q)}, der Lotfußpunkt F bei ${sp(A9.F)} und der Spiegelpunkt Q′ bei ${sp(A9.Qs)}. F liegt in der Mitte zwischen Q und Q′.`, {
  punkte: [punkt('Q', A9.Q), punkt('F', A9.F), punkt("Q′", A9.Qs)],
  strecken: [strecke(A9.F, A9.Q, ORANGE), strecke(A9.F, A9.Qs, ROSA)],
});

/** Aufgabe 12: g schneidet E im Punkt S, der Abstand ist 0. */
export const aufg12 = ebenenBild(E, `${ebeneWort(E)} Die schwarze Gerade g durchstößt die Ebene im Punkt S bei ${sp(A12.S)}. Sie hat also einen Punkt mit der Ebene gemeinsam, ihr Abstand zur Ebene ist 0.`, {
  geraden: [{ g: A12.g, name: 'g', farbe: SCHWARZ }],
  punkte: [punkt('S', A12.S)],
});
