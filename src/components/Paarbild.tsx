import type { ReactNode } from 'react';
import { BLAU, GRUEN, ORANGE, SCHWARZ, Messbild, type Lage, type MessPunkt, type MessStrecke, type MessbildDaten } from '@/components/Messbild';
import { beschriftungsLage } from '@/lib/beschriftung';
import { BUCHSTABE, MERKMAL_NAME, monotonieIntervalle, type BesondereStelle, type Merkmal, type PaarQuelle } from '@/lib/grafisch';
import { piText, zahlText } from '@/lib/zahlen';

/**
 * Zusammengehörige Schaubilder übereinander: K_f oben und K_f′ darunter (Paar) bzw. K_f, K_f′ und K_f″ (Dreierbild).
 * Farben: K_f orange, K_f′ grün, K_f″ rosa. Die Buchstaben H, T, W und S zeigen, welche Punkte zusammengehören,
 * gestrichelte senkrechte Linien verbinden sie mit der x-Achse. Bereiche auf der x-Achse: blau, wo der Wert positiv ist, schwarz, wo er negativ ist.
 */

export const ROSA = '#CC79A7';

type Fn = (x: number) => number;
type Bereich = [number, number, number, number];

/** Zwei übereinanderstehende Schaubilder: oben K_f, unten K_f′ im selben x-Bereich. */
export interface PaarDaten {
  oben: MessbildDaten;
  unten: MessbildDaten;
}

/** Drei übereinanderstehende Schaubilder im selben x-Bereich: K_f, K_f′ und K_f″. */
export interface DreiDaten {
  oben: MessbildDaten;
  mitte: MessbildDaten;
  unten: MessbildDaten;
}

/** Lage der Beschriftung: immer auf einer freien Seite des Punkts, nie auf dem Schaubild (siehe lib/beschriftung.ts). */
export const lageFuer = (kurve: Fn, x: number, y: number, bereich: Bereich, weitere: Fn[] = [], hilfslinie = true, meideYAchse = false): Lage =>
  beschriftungsLage({ x, y }, bereich, [{ f: kurve }, ...weitere.map((f) => ({ f }))], hilfslinie, meideYAchse);

const xWort = (x: number, pi?: boolean) => (pi ? piText(x) : zahlText(x)).replace('−', 'minus ').replace('π', ' Pi ');

/** Worte für die Beschreibung der Punkte in K_f′. */
export const FOLGE: Record<Merkmal, string> = {
  hoch: 'eine Nullstelle, bei der f Strich von plus nach minus wechselt',
  tief: 'eine Nullstelle, bei der f Strich von minus nach plus wechselt',
  wende: 'eine Extremstelle von f Strich',
  sattelauf: 'ein Tiefpunkt auf der x-Achse, f Strich bleibt positiv',
  sattelab: 'ein Hochpunkt auf der x-Achse, f Strich bleibt negativ',
};

/**
 * Baut ein Paar aus K_f und K_f′. typen wählt, welche besonderen Stellen markiert werden (Standard: alle),
 * intervalle färbt die Bereiche auf der x-Achse: blau, wo K_f steigt, schwarz, wo K_f fällt.
 */
export function paarBild(q: PaarQuelle, opt: { typen?: Merkmal[]; intervalle?: boolean } = {}): PaarDaten {
  const stellen: BesondereStelle[] = q.stellen.filter((s) => !opt.typen || opt.typen.includes(s.typ));
  const strecken = (hoehe: (x: number) => number): MessStrecke[] => stellen.map((s) => ({ von: [s.x, 0], bis: [s.x, hoehe(s.x)], farbe: SCHWARZ, gestrichelt: true }));
  const bereichsStrecken: MessStrecke[] = opt.intervalle
    ? monotonieIntervalle(q.df, q.stellen, q.x[0], q.x[1]).map((t) => ({ von: [t.von, 0] as [number, number], bis: [t.bis, 0] as [number, number], farbe: t.steigt ? BLAU : SCHWARZ }))
    : [];
  const punkte = (kurve: (x: number) => number, farbe: string, bereich: Bereich): MessPunkt[] =>
    stellen.map((s) => ({ x: s.x, y: kurve(s.x), farbe, text: BUCHSTABE[s.typ], lage: lageFuer(kurve, s.x, kurve(s.x), bereich) }));
  const bereichOben: Bereich = [q.x[0], q.x[1], q.yF[0], q.yF[1]];
  const bereichUnten: Bereich = [q.x[0], q.x[1], q.yDf[0], q.yDf[1]];
  const liste = stellen.map((s) => `${MERKMAL_NAME[s.typ]} ${BUCHSTABE[s.typ]} bei x gleich ${xWort(s.x, q.pi)}`).join(', ');
  const folge = stellen.map((s) => `${BUCHSTABE[s.typ]}: ${FOLGE[s.typ]}`).join('; ');
  const intervallText = opt.intervalle
    ? ' Auf der x-Achse sind die Bereiche blau markiert, in denen K_f steigt, und schwarz, in denen K_f fällt.'
    : '';
  const gemeinsam = { teilung: q.teilung, xBeschriftung: q.pi ? ('pi' as const) : ('zahl' as const) };
  return {
    oben: {
      kurven: [{ f: q.f, farbe: ORANGE }],
      punkte: punkte(q.f, ORANGE, bereichOben),
      strecken: [...strecken(q.f), ...bereichsStrecken],
      bereich: bereichOben,
      yTeilung: q.yTeilungF,
      ...gemeinsam,
      beschreibung: `Schaubild K f von f(x) gleich ${q.sprech}.${liste ? ` Markiert sind: ${liste}.` : ''}${intervallText}`,
    },
    unten: {
      kurven: [{ f: q.df, farbe: GRUEN }],
      punkte: punkte(q.df, GRUEN, bereichUnten),
      strecken: [...strecken(q.df), ...bereichsStrecken],
      bereich: bereichUnten,
      yTeilung: q.yTeilungDf,
      ...gemeinsam,
      beschreibung: `Schaubild der Ableitungsfunktion K f Strich zum Schaubild darüber, im selben x-Bereich.${folge ? ` An denselben Stellen zeigt es: ${folge}.` : ''}${intervallText}`,
    },
  };
}

/** K_f oben und K_f′ darunter im selben x-Bereich, mit gemeinsamer Bildunterschrift. */
export function Paarbild({ daten, unter }: { daten: PaarDaten; unter: ReactNode }) {
  return (
    <figure className="bild paarbild">
      <Messbild {...daten.oben} />
      <div style={{ height: '0.5rem' }} />
      <Messbild {...daten.unten} />
      <figcaption>{unter}</figcaption>
    </figure>
  );
}

/** Was für ein Dreierbild aus K_f, K_f′ und K_f″ gezeichnet wird. */
export interface DreiQuelle {
  sprech: string;
  f: Fn;
  df: Fn;
  ddf: Fn;
  /** Hoch-, Tief-, Wende- und Sattelstellen von K_f. */
  stellen: BesondereStelle[];
  /** Alle Nullstellen von f′ bzw. f″ im Ausschnitt (auch ohne Vorzeichenwechsel). Ohne Angabe werden sie aus den Stellen gebildet. */
  nullenDf?: number[];
  nullenDdf?: number[];
  x: [number, number];
  yF: [number, number];
  yDf: [number, number];
  yDdf: [number, number];
  teilung: number;
  yTeilungF: number;
  yTeilungDf: number;
  yTeilungDdf: number;
  pi?: boolean;
}

export interface VorzeichenBereich {
  von: number;
  bis: number;
  positiv: boolean;
}

/**
 * Zerlegt [von; bis] an den Nullstellen von g und bestimmt das Vorzeichen von g in der Mitte jedes Teils.
 * Aufeinanderfolgende Teile mit gleichem Vorzeichen (Nullstelle ohne Vorzeichenwechsel) werden zusammengefasst.
 */
export function vorzeichenBereiche(g: Fn, nullen: number[], von: number, bis: number): VorzeichenBereich[] {
  const grenzen = [von, ...nullen.filter((x) => x > von && x < bis).sort((a, b) => a - b), bis];
  const r: VorzeichenBereich[] = [];
  for (let i = 1; i < grenzen.length; i++) {
    const positiv = g((grenzen[i - 1]! + grenzen[i]!) / 2) > 0;
    const letzter = r[r.length - 1];
    if (letzter && letzter.positiv === positiv) letzter.bis = grenzen[i]!;
    else r.push({ von: grenzen[i - 1]!, bis: grenzen[i]!, positiv });
  }
  return r;
}

/** Beschreibt in Worten, was K_f″ an einer Stelle von K_f zeigt (aus den Funktionswerten bestimmt, nicht aus dem Typ der Stelle). */
function ddfWort(ddf: Fn, x: number): string {
  const v = ddf(x);
  if (Math.abs(v) > 1e-9) return v > 0 ? 'ein positiver Wert' : 'ein negativer Wert';
  return ddf(x - 0.1) * ddf(x + 0.1) < 0 ? 'eine Nullstelle mit Vorzeichenwechsel' : 'eine Nullstelle ohne Vorzeichenwechsel';
}

/**
 * Baut ein Dreierbild. typen wählt, welche Stellen markiert werden (Standard: alle).
 * monotonie färbt in K_f′ die Bereiche auf der x-Achse (blau: f′ positiv, K_f steigt, schwarz: f′ negativ, K_f fällt),
 * kruemmung ebenso in K_f″ (blau: f″ positiv, K_f linksgekrümmt, schwarz: f″ negativ, K_f rechtsgekrümmt).
 */
export function dreiBild(q: DreiQuelle, opt: { typen?: Merkmal[]; monotonie?: boolean; kruemmung?: boolean } = {}): DreiDaten {
  const stellen: BesondereStelle[] = q.stellen.filter((s) => !opt.typen || opt.typen.includes(s.typ));
  const verbinde = (hoehe: Fn): MessStrecke[] => stellen.map((s) => ({ von: [s.x, 0], bis: [s.x, hoehe(s.x)], farbe: SCHWARZ, gestrichelt: true }));
  const punkte = (kurve: Fn, farbe: string, bereich: Bereich): MessPunkt[] =>
    stellen.map((s) => ({ x: s.x, y: kurve(s.x), farbe, text: BUCHSTABE[s.typ], lage: lageFuer(kurve, s.x, kurve(s.x), bereich, [], true, true) }));
  const nullenDf = q.nullenDf ?? q.stellen.filter((s) => s.typ !== 'wende').map((s) => s.x);
  const nullenDdf = q.nullenDdf ?? q.stellen.filter((s) => s.typ === 'wende' || s.typ === 'sattelauf' || s.typ === 'sattelab').map((s) => s.x);
  const balken = (g: Fn, nullen: number[]): MessStrecke[] =>
    vorzeichenBereiche(g, nullen, q.x[0], q.x[1]).map((b) => ({ von: [b.von, 0] as [number, number], bis: [b.bis, 0] as [number, number], farbe: b.positiv ? BLAU : SCHWARZ }));
  const bOben: Bereich = [q.x[0], q.x[1], q.yF[0], q.yF[1]];
  const bMitte: Bereich = [q.x[0], q.x[1], q.yDf[0], q.yDf[1]];
  const bUnten: Bereich = [q.x[0], q.x[1], q.yDdf[0], q.yDdf[1]];
  const gemeinsam = { teilung: q.teilung, xBeschriftung: q.pi ? ('pi' as const) : ('zahl' as const) };
  const liste = stellen.map((s) => `${MERKMAL_NAME[s.typ]} ${BUCHSTABE[s.typ]} bei x gleich ${xWort(s.x, q.pi)}`).join(', ');
  const folge = stellen.map((s) => `${BUCHSTABE[s.typ]}: ${FOLGE[s.typ]}`).join('; ');
  const folge2 = stellen.map((s) => `${BUCHSTABE[s.typ]}: ${ddfWort(q.ddf, s.x)}`).join('; ');
  const monoText = opt.monotonie ? ' Auf der x-Achse sind die Bereiche blau markiert, in denen f Strich positiv ist (K f steigt), und schwarz, in denen f Strich negativ ist (K f fällt).' : '';
  const krText = opt.kruemmung ? ' Auf der x-Achse sind die Bereiche blau markiert, in denen f Zweistrich positiv ist (K f ist linksgekrümmt), und schwarz, in denen f Zweistrich negativ ist (K f ist rechtsgekrümmt).' : '';
  return {
    oben: {
      kurven: [{ f: q.f, farbe: ORANGE }],
      punkte: punkte(q.f, ORANGE, bOben),
      strecken: verbinde(q.f),
      bereich: bOben,
      yTeilung: q.yTeilungF,
      ...gemeinsam,
      beschreibung: `Schaubild K f von f(x) gleich ${q.sprech}.${liste ? ` Markiert sind: ${liste}.` : ''}`,
    },
    mitte: {
      kurven: [{ f: q.df, farbe: GRUEN }],
      punkte: punkte(q.df, GRUEN, bMitte),
      strecken: [...verbinde(q.df), ...(opt.monotonie ? balken(q.df, nullenDf) : [])],
      bereich: bMitte,
      yTeilung: q.yTeilungDf,
      ...gemeinsam,
      beschreibung: `Schaubild der Ableitungsfunktion K f Strich zum Schaubild darüber, im selben x-Bereich.${folge ? ` An denselben Stellen zeigt es: ${folge}.` : ''}${monoText}`,
    },
    unten: {
      kurven: [{ f: q.ddf, farbe: ROSA }],
      punkte: punkte(q.ddf, ROSA, bUnten),
      strecken: [...verbinde(q.ddf), ...(opt.kruemmung ? balken(q.ddf, nullenDdf) : [])],
      bereich: bUnten,
      yTeilung: q.yTeilungDdf,
      ...gemeinsam,
      beschreibung: `Schaubild K f Zweistrich der zweiten Ableitung, ganz unten im selben x-Bereich.${folge2 ? ` An denselben Stellen zeigt es: ${folge2}.` : ''}${krText}`,
    },
  };
}

/** K_f, K_f′ und K_f″ übereinander im selben x-Bereich, mit gemeinsamer Bildunterschrift. */
export function Dreierbild({ daten, unter }: { daten: DreiDaten; unter: ReactNode }) {
  return (
    <figure className="bild paarbild dreierbild">
      <Messbild {...daten.oben} className="brett-flach" />
      <div style={{ height: '0.5rem' }} />
      <Messbild {...daten.mitte} className="brett-flach" />
      <div style={{ height: '0.5rem' }} />
      <Messbild {...daten.unten} className="brett-flach" />
      <figcaption>{unter}</figcaption>
    </figure>
  );
}
