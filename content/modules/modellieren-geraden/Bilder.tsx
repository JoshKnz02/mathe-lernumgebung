import { bahn, ort, type Bewegung } from '@/lib/bewegung';
import { imWuerfel, kuerzeImWuerfel, parameterImWuerfel } from '@/lib/gerade';
import { linienNamen, punkt, type BenannteLinie } from '@/lib/geradenbild';
import { wortKoordinaten } from '@/lib/laborhilfen';
import { konvexeHuelle, parallelSchatten, zentralSchatten, type Schatten } from '@/lib/projektion';
import { bildpunkt, type EbenenArt, type Punkt3, type RaumBildSpec, type RaumFlaeche, type RaumLinie, type RaumPunkt } from '@/lib/schraegbild';
import { hausPunkte, type Haus, WAND, A_ABSTAND, A_KOLLISION, A_MAST, A_PARALLEL, A_TETRAEDER, A_WETTER, A_ZEITEN, A_ZENTRAL, BEWEGUNGSLABOR, HUBSCHRAUBER, ORANGE, ROSA, S_BEWEGUNG, SCHATTEN, SCHWARZ } from './daten';

const ALLE_EBENEN: EbenenArt[] = ['e12', 'e12', 'e23'];
const sp = (n: number[]) => wortKoordinaten(n);
const rund = (v: number[]) => v.map((x) => Math.round(x * 1e6) / 1e6 + 0) as Punkt3;
export const strecke = (von: number[], bis: number[], farbe: string, gestrichelt = false): RaumLinie => ({ von: rund(von), bis: rund(bis), farbe, breite: 2, ...(gestrichelt ? { gestrichelt: true } : {}) });
const text = (x: number) => String(Math.round(x * 100) / 100).replace('.', ',');

/** Raumbild in der feinen Darstellung: Linien, Punkte und die Namen der Bahnen. */
function bild(sprech: string, punkte: RaumPunkt[], linien: RaumLinie[], namen: BenannteLinie[] = []): RaumBildSpec {
  return { sprech, punkte: [...punkte, ...linienNamen(namen, punkte)], linien, ebenen: ALLE_EBENEN, ebenenNamen: false, fein: true };
}

/** Ein Punkt kommt nur ins Bild, wenn er im Koordinatensystem liegt und im Schrägbild nicht auf der Stelle eines früheren Punkts (Bahn in Blickrichtung). */
function sammler() {
  const punkte: RaumPunkt[] = [];
  const ausserhalb: string[] = [];
  return {
    punkte,
    ausserhalb,
    add(name: string, p: number[]) {
      if (!imWuerfel(p)) {
        ausserhalb.push(name);
        return false;
      }
      const b = bildpunkt(p as Punkt3);
      if (punkte.some((q) => Math.hypot(bildpunkt(q.p)[0] - b[0], bildpunkt(q.p)[1] - b[1]) < 1e-6)) return false;
      punkte.push(punkt(name, p));
      return true;
    },
  };
}

/** Der Teil der Bahn mit t ≥ 0 im Koordinatensystem: von … bis (oder null). */
export function bahnStrecke(b: Bewegung): [Punkt3, Punkt3] | null {
  const r = parameterImWuerfel(bahn(b));
  if (!r) return null;
  const lo = Math.max(0, r[0]);
  if (r[1] < lo - 1e-9) return null;
  return [rund(ort(b, lo)), rund(ort(b, r[1]))];
}
function bahnen(liste: { b: Bewegung; name: string; farbe: string }[]): { linien: RaumLinie[]; namen: BenannteLinie[] } {
  const linien: RaumLinie[] = [];
  const namen: BenannteLinie[] = [];
  for (const o of liste) {
    const s = bahnStrecke(o.b);
    if (!s) continue;
    linien.push(strecke(s[0], s[1], o.farbe));
    namen.push({ strecke: s, name: o.name, farbe: o.farbe });
  }
  return { linien, namen };
}

/* ---------- Bewegung: Erklären und Entdecken ---------- */

const H = HUBSCHRAUBER;
/** Erklären: Bahn von H ab dem Startpunkt P. */
export const RAUM_BAHN: RaumBildSpec = (() => {
  const { linien, namen } = bahnen([{ b: H, name: 'g', farbe: SCHWARZ }]);
  return bild(`Schrägbild mit den drei Koordinatenebenen. Die schwarze Bahn g des Hubschraubers beginnt im Startpunkt P bei ${sp(H.start)} und führt in Flugrichtung weiter.`, [punkt('P', H.start)], linien, namen);
})();

/** Bahn von H mit dem Startpunkt P und dem Ort Q nach 3 Minuten (Q ist die Stelle, an der H nach 3 km angekommen ist). */
export function flugBild(h: Bewegung, Q: number[]): RaumBildSpec {
  const { linien, namen } = bahnen([{ b: h, name: 'g', farbe: SCHWARZ }]);
  return bild(`Schrägbild mit den drei Koordinatenebenen. Die schwarze Bahn g des Hubschraubers mit dem Startpunkt P bei ${sp(h.start)} und dem Ort Q bei ${sp(Q)} nach 3 Minuten. Die Strecke von P nach Q ist 3 Kilometer lang.`, [punkt('P', h.start), punkt('Q', Q)], [...linien, strecke(h.start, Q, ROSA)], namen);
}
export const RAUM_FLUG: RaumBildSpec = flugBild(H, S_BEWEGUNG);

export interface BahnObjekt {
  b: Bewegung;
  bahn: string;
  farbe: string;
  /** Name des Startpunkts (oder null: Startpunkt ohne Buchstaben). */
  start: string;
  startOhneText?: boolean;
}
/** Zwei Bahnen (g schwarz, h orange) mit ihren Startpunkten und dem gemeinsamen Punkt S. */
export function bahnenBild(sprech: string, a: BahnObjekt, b: BahnObjekt, S: number[]): RaumBildSpec {
  const { linien, namen } = bahnen([{ b: a.b, name: a.bahn, farbe: a.farbe }, { b: b.b, name: b.bahn, farbe: b.farbe }]);
  const p = (o: BahnObjekt): RaumPunkt => (o.startOhneText ? { name: o.start, p: o.b.start as Punkt3, ohneText: true } : punkt(o.start, o.b.start));
  return bild(sprech, [p(a), p(b), punkt('S', S)], linien, namen);
}

const R_START: Bewegung = { ...BEWEGUNGSLABOR.R, tempo: BEWEGUNGSLABOR.tempoStart };
const OBJ_H: BahnObjekt = { b: H, bahn: 'g', farbe: SCHWARZ, start: 'H₀' };
const OBJ_R: BahnObjekt = { b: R_START, bahn: 'h', farbe: ORANGE, start: 'R₀' };
/** Entdecken: die Bahnen g von H (schwarz) und h von R (orange) mit dem Schnittpunkt S und den Startpunkten. */
export const RAUM_BAHNEN: RaumBildSpec = bahnenBild(`Schrägbild mit den drei Koordinatenebenen. Die schwarze Bahn g des Hubschraubers H und die orange Bahn h des Rettungshubschraubers R schneiden sich im Punkt S bei ${sp(S_BEWEGUNG)}. H₀ bei ${sp(H.start)} und R₀ bei ${sp(R_START.start)} sind die Startpunkte.`, OBJ_H, OBJ_R, S_BEWEGUNG);

/** Bewegungslabor: H und R zur Zeit tMin (in Minuten), auf Wunsch Abstand (rosa Strecke) und Schnittpunkt S der Bahnen. */
export function bewegungsLaborBild(tempoR: number, tMinuten: number, zeigeAbstand: boolean, zeigeSchnitt: boolean): { spec: RaumBildSpec; ausserhalb: string[] } {
  const r: Bewegung = { ...BEWEGUNGSLABOR.R, tempo: tempoR };
  const t = tMinuten / 60;
  const { linien, namen } = bahnen([{ b: H, name: 'g', farbe: SCHWARZ }, { b: r, name: 'h', farbe: ORANGE }]);
  const s = sammler();
  const oH = ort(H, t);
  const oR = ort(r, t);
  const hDa = s.add('H', oH);
  const rDa = s.add('R', oR);
  if (zeigeSchnitt) s.add('S', S_BEWEGUNG);
  if (zeigeAbstand && hDa && rDa && oH.some((c, i) => Math.abs(c - oR[i]!) > 1e-9)) linien.push(strecke(oH, oR, ROSA));
  return {
    spec: bild(`Schrägbild mit den drei Koordinatenebenen. Die Bahnen g von H (schwarz) und h von R (orange) schneiden sich im Punkt bei ${sp(S_BEWEGUNG)}. Zur Zeit ${text(tMinuten)} Minuten ist H bei ${sp(oH)} und R bei ${sp(oR)}.${zeigeAbstand ? ' Die rosa Strecke zeigt den Abstand der beiden zu dieser Zeit.' : ''}`, s.punkte, linien, namen),
    ausserhalb: s.ausserhalb,
  };
}

/* ---------- Bewegung: Aufgaben ---------- */

/** Aufgabe 2: Bahn des Wetterballons mit Start P und Ort Q nach 5 Minuten. */
export const aufgWetter: RaumBildSpec = (() => {
  const w = A_WETTER;
  const { linien, namen } = bahnen([{ b: w.b, name: 'g', farbe: SCHWARZ }]);
  return bild(`Schrägbild mit den drei Koordinatenebenen. Die schwarze Bahn g des Wetterballons mit dem Startpunkt P bei ${sp(w.b.start)} und dem Ort Q bei ${sp(w.Q)} nach 5 Minuten.`, [punkt('P', w.b.start), punkt('Q', w.Q)], [...linien, strecke(w.b.start, w.Q, ROSA)], namen);
})();
/** Aufgabe 4: Bahnen von Hubschrauber (schwarz) und Ballon (orange) mit dem Treffpunkt S. */
export const aufgKollision: RaumBildSpec = (() => {
  const k = A_KOLLISION;
  return bahnenBild(`Schrägbild mit den drei Koordinatenebenen. Die schwarze Bahn g des Hubschraubers und die orange Bahn h des Ballons. Beide sind nach 6 Minuten im Treffpunkt S bei ${sp(k.S)}. H₀ bei ${sp(k.h.start)} und B₀ bei ${sp(k.ballon.start)} sind die Startpunkte.`, { b: k.h, bahn: 'g', farbe: SCHWARZ, start: 'H₀' }, { b: k.ballon, bahn: 'h', farbe: ORANGE, start: 'B₀' }, k.S);
})();
/** Aufgabe 5: Bahnen der beiden Objekte mit dem Schnittpunkt S und den Startpunkten. */
export const aufgZeiten: RaumBildSpec = (() => {
  const z = A_ZEITEN;
  return bahnenBild(`Schrägbild mit den drei Koordinatenebenen. Die schwarze Bahn g von Objekt 1 und die orange Bahn h von Objekt 2 schneiden sich im Punkt S bei ${sp(z.S)}. P₁ bei ${sp(z.a.start)} und P₂ bei ${sp(z.b.start)} sind die Startpunkte.`, { b: z.a, bahn: 'g', farbe: SCHWARZ, start: 'P₁' }, { b: z.b, bahn: 'h', farbe: ORANGE, start: 'P₂' }, z.S);
})();
/** Bahnen und die Orte beider Objekte zur Zeit t (in Stunden), dazu die rosa Strecke zwischen ihnen (Abstand). */
export function abstandBild(h: Bewegung, ballon: Bewegung, t: number, abstandText: string): RaumBildSpec {
  const { linien, namen } = bahnen([{ b: h, name: 'g', farbe: SCHWARZ }, { b: ballon, name: 'h', farbe: ORANGE }]);
  const p1 = ort(h, t);
  const p2 = ort(ballon, t);
  return bild(`Schrägbild mit den drei Koordinatenebenen. Die schwarze Bahn g des Hubschraubers und die orange Bahn h des Ballons. Nach 4 Minuten ist der Hubschrauber bei ${sp(p1)} (H), der Ballon bei ${sp(p2)} (B). Die rosa Strecke HB ist der kleinste Abstand von ${abstandText}.`, [punkt('H', p1), punkt('B', p2)], [...linien, strecke(p1, p2, ROSA)], namen);
}
/** Aufgabe 6: Kontrollbild zur Zeit des kleinsten Abstands. */
export const aufgAbstand: RaumBildSpec = abstandBild(A_ABSTAND.h, A_ABSTAND.ballon, A_ABSTAND.minuten / 60, `${A_ABSTAND.d} Kilometern`);

/* ---------- Schatten ---------- */

const PRIM = ['′', '″'];
export interface SchattenSpec {
  ecken: number[][];
  /** Namen der Ecken (P, Q, R) und der Schattenpunkte (Strich oder Doppelstrich dahinter). */
  namen: string[];
  strich: 0 | 1;
  schatten: (number[] | null)[];
  /** Strahlen als Strecken (von Gegenstandspunkt oder Lichtquelle bis zum Schattenpunkt). */
  strahlen: [number[], number[]][];
  L?: number[];
  sprech: string;
  mitSchatten?: boolean;
}
/** Bild eines Dreiecks, seines Schattens und der Lichtstrahlen. Punkte außerhalb des Koordinatensystems werden nicht gezeichnet (`ausserhalb`). */
export function schattenBild(o: SchattenSpec): { spec: RaumBildSpec; ausserhalb: string[] } {
  const s = sammler();
  const linien: RaumLinie[] = [];
  const innen = o.ecken.map((e, i) => s.add(o.namen[i]!, e));
  const dreieck = (pts: number[][], farbe: string, gestrichelt = false) => {
    for (let i = 0; i < 3; i++) linien.push(strecke(pts[i]!, pts[(i + 1) % 3]!, farbe, gestrichelt));
  };
  if (innen.every(Boolean)) dreieck(o.ecken, SCHWARZ);
  const sch = o.schatten;
  const sichtbar = sch.map((p) => p !== null && imWuerfel(p));
  if (o.mitSchatten !== false) {
    sch.forEach((p, i) => {
      if (p && sichtbar[i]) s.add(`${o.namen[i]}${PRIM[o.strich]}`, p);
      else if (p) s.ausserhalb.push(`${o.namen[i]}${PRIM[o.strich]}`);
    });
    if (sichtbar.every(Boolean)) dreieck(sch as number[][], ROSA, true);
  }
  for (const [a, b] of o.strahlen) if (imWuerfel(a) && imWuerfel(b)) linien.push(strecke(a, b, ORANGE));
  if (o.L) s.add('L', o.L);
  return { spec: bild(o.sprech, s.punkte, linien), ausserhalb: s.ausserhalb };
}

const GRAU = '#4B5563';
const STRAHL = '#E69F00';
const WANDFARBE = '#009E73';
const DACH = '#D55E00';
const MAUER = '#9A6B3F';
export const HAUS_NAMEN = ['E', 'F', 'G', 'H', 'I'];

export interface Szene {
  spec: RaumBildSpec;
  /** Punkte (Namen), die nicht im Koordinatensystem liegen. */
  ausserhalb: string[];
  /** Die oberen Punkte (E bis I), deren Strahl die Wand nicht erreicht (parallel zur Wand oder Wand hinter dem Licht). */
  keinSchatten: string[];
  /** Alle fünf Schattenpunkte auf der Wand liegen im Koordinatensystem über dem Boden (nur dann wird der Schatten gezeichnet). */
  ok: boolean;
  treffer: Schatten[];
}
/**
 * Szene wie in den GeoGebra-Beispielen: Haus mit Pyramidendach vor der Wand x₂ = −4, Licht (parallel mit Richtung v oder von der Lampe J), Lichtstrahlen (orange, gestrichelt) durch die Punkte E, F, G, H, I
 * und der Schatten in zwei grauen Flächen: auf der Wand (Hülle der fünf Schattenpunkte) und auf dem Boden (Hülle der Grundfläche und der Fußpunkte der Wandpunkte von E bis H).
 */
export function szene(h: Haus, art: 'parallel' | 'zentral', v: number[], J: number[], strahlen: boolean, schatten: boolean, sprechVorne = 'Schrägbild mit dem Boden (blau) und der Wand (grün).'): Szene {
  const H = hausPunkte(h);
  const s = sammler();
  const linien: RaumLinie[] = H.kanten.map(([a, c]) => strecke(a, c, SCHWARZ));
  const flaechen: RaumFlaeche[] = [
    { ecken: [[-4, WAND, 0], [4, WAND, 0], [4, WAND, 4], [-4, WAND, 4]], farbe: WANDFARBE, deckkraft: 0.13 },
    ...H.waende.map((e) => ({ ecken: e, farbe: MAUER, deckkraft: 0.22 })),
    ...H.dach.map((e) => ({ ecken: e, farbe: DACH, deckkraft: 0.4 })),
  ];
  const treffer = H.hoch.map((x) => (art === 'parallel' ? parallelSchatten(x, v, 'e13', WAND) : zentralSchatten(x, J, 'e13', WAND)));
  const keinSchatten = treffer.flatMap((x, i) => (x.art === 'schatten' ? [] : [HAUS_NAMEN[i]!]));
  const ok = treffer.every((x) => x.art === 'schatten' && imWuerfel(x.punkt!) && x.punkt![2]! >= -1e-9);
  s.add('E', H.traufe[0]!);
  s.add('I', H.I);
  const strich = art === 'parallel' ? '′' : '″';
  if (art === 'zentral') s.add('J', J);
  if (strahlen) {
    treffer.forEach((x, i) => {
      if (x.art !== 'schatten') return;
      const p = H.hoch[i]!;
      let von: number[];
      if (art === 'parallel') {
        const r = parameterImWuerfel({ p: [...p], u: v });
        von = r ? p.map((c, k) => c + Math.min(0, r[0]) * v[k]!) : p;
      } else von = J;
      const bis = imWuerfel(x.punkt!) ? x.punkt! : kuerzeImWuerfel(von, x.punkt!).ende;
      linien.push({ ...strecke(von, bis, STRAHL), gestrichelt: true, breite: 1.6 });
    });
  }
  if (schatten && ok) {
    const pt = treffer.map((x) => x.punkt!);
    const wand = konvexeHuelle(pt.map((q) => [q[0]!, q[2]!]));
    flaechen.push({ ecken: wand.map((q) => [q[0]!, WAND, q[1]!] as Punkt3), farbe: GRAU, deckkraft: 0.45 });
    wand.forEach((q, k) => linien.push({ ...strecke([q[0]!, WAND, q[1]!], [wand[(k + 1) % wand.length]![0]!, WAND, wand[(k + 1) % wand.length]![1]!], GRAU), gestrichelt: true, breite: 1.4 }));
    const boden = konvexeHuelle([...H.grund.map((g) => [g[0], g[1]]), ...pt.slice(0, 4).map((q) => [q[0]!, WAND])]);
    flaechen.push({ ecken: boden.map((q) => [q[0]!, q[1]!, 0] as Punkt3), farbe: GRAU, deckkraft: 0.55 });
    boden.forEach((q, k) => linien.push({ ...strecke([q[0]!, q[1]!, 0], [boden[(k + 1) % boden.length]![0]!, boden[(k + 1) % boden.length]![1]!, 0], GRAU), gestrichelt: true, breite: 1.4 }));
    s.add(`E${strich}`, pt[0]!);
    s.add(`I${strich}`, pt[4]!);
  } else if (schatten && !ok) s.ausserhalb.push('Schatten');
  const sprech = art === 'parallel'
    ? `${sprechVorne} Das Haus ist ein Quader mit Pyramidendach, E ist eine Traufecke bei ${sp(H.traufe[0]!)}, I die Dachspitze bei ${sp(H.I)}. Die Sonnenstrahlen laufen in der Richtung ${sp(v)} durch die oberen Punkte des Hauses zur Wand. Der Schatten liegt in zwei grauen Flächen, auf der Wand und auf dem Boden zwischen Haus und Wand.`
    : `${sprechVorne} Das Haus ist ein Quader mit Pyramidendach, E ist eine Traufecke bei ${sp(H.traufe[0]!)}, I die Dachspitze bei ${sp(H.I)}. Die Lampe J steht bei ${sp(J)}, die Strahlen gehen von J durch die oberen Punkte des Hauses zur Wand. Der Schatten liegt in zwei grauen Flächen, auf der Wand und auf dem Boden zwischen Haus und Wand.`;
  const spec: RaumBildSpec = { ...bild(sprech, s.punkte, linien), ebenen: ['e12'], flaechen };
  return { spec, ausserhalb: s.ausserhalb, keinSchatten, ok, treffer };
}

const NAMEN = ['P', 'Q', 'R'];
export function parallelBild(ecken: number[][], v: number[], sprechVorne: string, mitSchatten = true, mitStrahlen = true) {
  const sch = ecken.map((e) => parallelSchatten(e, v, 'e12'));
  const punkte = sch.map((x) => (x.art === 'schatten' ? x.punkt : null));
  return schattenBild({
    ecken,
    namen: NAMEN,
    strich: 0,
    schatten: punkte,
    strahlen: mitStrahlen ? ecken.flatMap((e, i) => (punkte[i] ? [[e, punkte[i]!] as [number[], number[]]] : [])) : [],
    sprech: `${sprechVorne} Die Ecken P bei ${sp(ecken[0]!)}, Q bei ${sp(ecken[1]!)} und R bei ${sp(ecken[2]!)}. Die orangen Lichtstrahlen laufen in der Richtung ${sp(v)} von den Ecken zum Boden. Das rosa gestrichelte Dreieck P′Q′R′ auf dem Boden ist der Schatten.`,
    mitSchatten,
  });
}
export function zentralBild(ecken: number[][], L: number[], sprechVorne: string, mitSchatten = true, mitStrahlen = true) {
  const sch = ecken.map((e) => zentralSchatten(e, L, 'e12'));
  const punkte = sch.map((x) => (x.art === 'schatten' ? x.punkt : null));
  return schattenBild({
    ecken,
    namen: NAMEN,
    strich: 1,
    schatten: punkte,
    strahlen: mitStrahlen ? ecken.flatMap((_, i) => (punkte[i] ? [[L, punkte[i]!] as [number[], number[]]] : [])) : [],
    L,
    sprech: `${sprechVorne} Die Ecken P bei ${sp(ecken[0]!)}, Q bei ${sp(ecken[1]!)} und R bei ${sp(ecken[2]!)}, die Lichtquelle L bei ${sp(L)}. Die orangen Lichtstrahlen gehen von L durch die Ecken zum Boden. Das rosa gestrichelte Dreieck P″Q″R″ auf dem Boden ist der Schatten.`,
    mitSchatten,
  });
}
/** Erklären und Entdecken: Schatten des Hauses bei parallelem Licht (Sonne) und bei einer punktförmigen Lichtquelle (Lampe). */
export const RAUM_PARALLEL: RaumBildSpec = szene(SCHATTEN.haus, 'parallel', SCHATTEN.v, SCHATTEN.J, true, true).spec;
export const RAUM_ZENTRAL: RaumBildSpec = szene(SCHATTEN.haus, 'zentral', SCHATTEN.v, SCHATTEN.J, true, true).spec;
/** Aufgaben 8 und 9: Kontrollbilder. */
export const aufgParallel: RaumBildSpec = parallelBild(A_PARALLEL.ecken, A_PARALLEL.v, 'Schrägbild mit den drei Koordinatenebenen. Der Boden ist die blaue x₁x₂-Ebene.').spec;
export const aufgZentral: RaumBildSpec = zentralBild(A_ZENTRAL.ecken, A_ZENTRAL.L, 'Schrägbild mit den drei Koordinatenebenen. Der Boden ist die blaue x₁x₂-Ebene.').spec;

/** Schattenlabor: das Haus des Beispiels, Lichtart, Strahlen und Schatten zuschaltbar. Punkte ohne Schatten (falsche Seite, Strahl parallel zum Boden) werden gemeldet. */
export function schattenLaborBild(art: 'parallel' | 'zentral', v: number[], J: number[], mitStrahlen: boolean, mitSchatten: boolean): Szene {
  return szene(SCHATTEN.haus, art, v, J, mitStrahlen, mitSchatten);
}

/** Tetraeder auf dem Boden, Lichtstrahl durch die Spitze S bis zum Bodenpunkt S′ (orange), Schatten als gestrichelte Hülle von A, B, C und S′ (rosa). */
export function tetraederBild(A: number[], B: number[], C: number[], S: number[], S1: number[]): RaumBildSpec {
  const e = [A, B, C, S];
  const kanten = [[0, 1], [0, 2], [1, 2], [0, 3], [1, 3], [2, 3]] as const;
  const linien = kanten.map(([i, j]) => strecke(e[i]!, e[j]!, SCHWARZ));
  linien.push(strecke(S, S1, ORANGE));
  const huelle = konvexeHuelle([A, B, C, S1]);
  huelle.forEach((q, i) => linien.push(strecke(q, huelle[(i + 1) % huelle.length]!, ROSA, true)));
  return bild(`Schrägbild mit den drei Koordinatenebenen. Das schwarze Tetraeder mit den Ecken A bei ${sp(A)}, B bei ${sp(B)}, C bei ${sp(C)} und der Spitze S bei ${sp(S)} steht auf dem Boden, der blauen x₁x₂-Ebene. Der orange Lichtstrahl durch S trifft den Boden im Punkt S′ bei ${sp(S1)}. Das rosa gestrichelte Viereck aus A, B, C und S′ ist der Schatten.`, [punkt('A', A), punkt('B', B), punkt('C', C), punkt('S', S), punkt('S′', S1)], linien);
}
export const aufgTetraeder: RaumBildSpec = tetraederBild(A_TETRAEDER.A, A_TETRAEDER.B, A_TETRAEDER.C, A_TETRAEDER.S, A_TETRAEDER.S1);
/** Aufgabe 12: Mast, Lichtstrahl durch die Spitze T (orange) und Schatten auf dem Boden (rosa). */
export const aufgMast: RaumBildSpec = (() => {
  const m = A_MAST;
  return bild(`Schrägbild mit den drei Koordinatenebenen. Der schwarze Mast steht im Fußpunkt F bei ${sp(m.F)} und reicht bis zur Spitze T bei ${sp(m.T)}. Der orange Lichtstrahl durch T trifft den Boden, die blaue x₁x₂-Ebene, im Punkt T′ bei ${sp(m.T0)}. Die rosa gestrichelte Strecke FT′ ist der Schatten des Masts.`, [punkt('F', m.F), punkt('T', m.T), punkt('T′', m.T0)], [strecke(m.F, m.T, SCHWARZ), strecke(m.T, m.T0, ORANGE), strecke(m.F, m.T0, ROSA, true)]);
})();

