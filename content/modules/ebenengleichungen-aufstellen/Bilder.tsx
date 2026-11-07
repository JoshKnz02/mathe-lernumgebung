import { ebeneAusGeraden, ebeneAusPunktUndGerade, type Ebene } from '@/lib/ebene';
import { ebenenFlaeche, FARBE, O, pfeil, plus3 } from '@/lib/ebenenbild';
import { lageZweier, type Gerade } from '@/lib/gerade';
import { linienNamen, punkt, type BenannteLinie } from '@/lib/geradenbild';
import { geradeLinie } from '@/lib/geradenhilfen';
import { wortKoordinaten } from '@/lib/laborhilfen';
import type { Punkt3, RaumBildSpec, RaumLinie, RaumPunkt } from '@/lib/schraegbild';
import { A_PUNKT_GERADE, A_SCHNITT, A_ZEICHNEN, AUF_GERADE, ERKLAEREN, PARALLEL, SCHNEIDEND, WINDSCHIEF, type Paar } from './daten';

export { O, pfeil, punkt };
const sp = (v: number[]) => wortKoordinaten(v);
const { orange, blau, rosa, schwarz } = FARBE;

/** Alle Bilder: feine Darstellung, keine Koordinatenebenen (sie würden die graue Ebene überdecken). */
const bild = (o: { sprech: string; punkte: RaumPunkt[]; linien: RaumLinie[]; flaechen?: RaumBildSpec['flaechen'] }): RaumBildSpec => ({ ...o, ebenenNamen: false, fein: true });

/** Zwei durchgezogene Geraden, g schwarz und h orange, mit ihren Namen dicht an der Linie (die Namen halten Abstand zu den Punkten). */
export function geradenLinien(g: Gerade, h: Gerade | null, punkte: RaumPunkt[]): { linien: RaumLinie[]; namen: RaumPunkt[] } {
  const benannt: BenannteLinie[] = [{ g, name: 'g', farbe: schwarz }, ...(h ? [{ g: h, name: 'h', farbe: orange }] : [])];
  return { linien: [...geradeLinie(g, schwarz, 2, false), ...(h ? geradeLinie(h, orange, 2, false) : [])], namen: linienNamen(benannt, punkte) };
}

/* ---------- Erklären: Punkt und Gerade ---------- */

/** Ebene durch g und Q: Stützvektor orange (vom Ursprung zu P), Richtungsvektor u blau (liegt auf g, breiter darunter), Verbindungsvektor PQ rosa. */
export function punktGeradeBild(g: Gerade, Q: Punkt3, kontrolle = false): RaumBildSpec {
  const e = ebeneAusPunktUndGerade(g, Q)!;
  const f = ebenenFlaeche(e);
  const P = g.p as Punkt3;
  const punkte: RaumPunkt[] = [{ name: 'O', p: O, ohneText: true }, punkt('P', P), punkt('Q', Q)];
  const { linien, namen } = geradenLinien(g, null, punkte);
  return bild({
    sprech: `Schrägbild. Die schwarze Gerade g geht durch den Punkt P bei ${sp(P)}. Der Punkt Q bei ${sp(Q)} liegt nicht auf g. Die graue Fläche ist ein Ausschnitt der Ebene durch g und Q. Der orange Pfeil vom Ursprung zu P ist der Stützvektor, der blaue Pfeil in P der Richtungsvektor von g, der rosa Pfeil von P nach Q der zweite Spannvektor.${kontrolle ? ' Das Bild dient zur Kontrolle der Aufgabe.' : ''}`,
    punkte: [...punkte, ...namen],
    linien: [...f.linien, ...linien, pfeil(O, P, orange), pfeil(P, plus3(P, e.u), blau, 4.5), pfeil(P, Q, rosa, 4.5)],
    flaechen: f.flaechen,
  });
}
export const RAUM_ERKLAEREN = punktGeradeBild(ERKLAEREN.g, ERKLAEREN.Q);
export const aufgPunktGerade = punktGeradeBild(A_PUNKT_GERADE.g, A_PUNKT_GERADE.Q, true);

/* ---------- Entdecken: zwei Geraden ---------- */

/**
 * Zwei Geraden, auf Wunsch mit ihrer Ebene (nur bei Schnittpunkt oder parallel). Bei sich schneidenden Geraden der Schnittpunkt S, bei parallelen die Stützpunkte P und Q
 * mit dem rosa Verbindungsvektor, bei windschiefen Geraden nur die Linien. `ohneEbene` zeigt nur die Linien.
 */
export function geradenPaarBild(paar: Paar, mitEbene = true): { spec: RaumBildSpec; art: string; hatEbene: boolean } {
  const { art, ebene } = ebeneAusGeraden(paar.g, paar.h);
  const f = mitEbene && ebene ? ebenenFlaeche(ebene) : { flaechen: [], linien: [] as RaumLinie[] };
  const punkte: RaumPunkt[] = [];
  const extra: RaumLinie[] = [];
  if (art === 'schneidend' && mitEbene) {
    const S = schnittpunktVon(paar);
    if (S) punkte.push({ name: 'S', p: S, ohneText: true });
  }
  if (art === 'parallel' && mitEbene && ebene) {
    punkte.push(punkt('P', paar.g.p), punkt('Q', paar.h.p));
    extra.push(pfeil(paar.g.p as Punkt3, paar.h.p as Punkt3, rosa, 4.5));
  }
  const { linien, namen } = geradenLinien(paar.g, paar.h, punkte);
  const text = !mitEbene
    ? ''
    : art === 'schneidend' ? 'Die beiden Geraden schneiden sich in einem Punkt.' : art === 'parallel' ? 'Die beiden Geraden sind parallel und verschieden.' : art === 'windschief' ? 'Die beiden Geraden sind windschief: nicht parallel und ohne gemeinsamen Punkt.' : 'Die beiden Geraden sind identisch.';
  return {
    art,
    hatEbene: !!ebene && mitEbene,
    spec: bild({
      sprech: `Schrägbild. Eine schwarze Gerade g und eine orange Gerade h. ${text}${ebene && mitEbene ? ' Die graue Fläche ist ein Ausschnitt der Ebene, die beide Geraden enthält.' : ''}${art === 'parallel' && ebene && mitEbene ? ' Der rosa Pfeil führt von P auf g zu Q auf h.' : ''}`,
      punkte: [...punkte, ...namen],
      linien: [...f.linien, ...linien, ...extra],
      flaechen: f.flaechen,
    }),
  };
}
function schnittpunktVon(p: Paar): Punkt3 | null {
  const l = lageZweier(p.g, p.h);
  return l.schnittpunkt ? (l.schnittpunkt as Punkt3) : null;
}
export const RAUM_SCHNEIDEND = geradenPaarBild(SCHNEIDEND).spec;
export const RAUM_PARALLEL = geradenPaarBild(PARALLEL).spec;
export const RAUM_WINDSCHIEF = geradenPaarBild(WINDSCHIEF).spec;
export const aufgSchnitt = geradenPaarBild(A_SCHNITT.paar).spec;
export const aufgZeichnen = ((): RaumBildSpec => {
  const z = A_ZEICHNEN;
  const b = geradenPaarBild(z.paar).spec;
  return { ...b, sprech: `${b.sprech} Der rosa Pfeil führt von G auf g zu H auf h.` };
})();

/* ---------- Entdecken: Punkt auf der Geraden ---------- */

/** Zwei verschiedene Ebenen durch dieselbe Gerade g und den Punkt X auf g: E₁ grau, E₂ orange berandet. */
export const RAUM_AUF_GERADE: RaumBildSpec = (() => {
  const a = AUF_GERADE;
  const e1: Ebene = { p: a.g.p, u: a.g.u, v: a.v1 };
  const e2: Ebene = { p: a.g.p, u: a.g.u, v: a.v2 };
  const f1 = ebenenFlaeche(e1);
  const f2 = ebenenFlaeche(e2, orange, 0.18);
  const punkte: RaumPunkt[] = [punkt('X', a.X)];
  const { linien, namen } = geradenLinien(a.g, null, punkte);
  return bild({
    sprech: `Schrägbild. Die schwarze Gerade g geht durch den Punkt X bei ${sp(a.X)}. Zwei verschiedene Ebenen enthalten g: eine graue Fläche und eine zweite Fläche mit orangem Rand. Beide enthalten X, denn X liegt auf g.`,
    punkte: [...punkte, ...namen],
    linien: [...f1.linien, ...f2.linien, ...linien],
    flaechen: [...f1.flaechen, ...f2.flaechen],
  });
})();
