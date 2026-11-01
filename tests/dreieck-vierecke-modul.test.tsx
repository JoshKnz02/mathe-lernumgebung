import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/dreieck-vierecke-skalarprodukt/Bilder';
import * as D from '../content/modules/dreieck-vierecke-skalarprodukt/daten';
import Modul from '../content/modules/dreieck-vierecke-skalarprodukt/index';
import { ART_NAME, Dreieckslabor, Viereckslabor, dreieckBild3, dreieckZustand2, nachbarn, viereckZustand, zahl2 } from '../content/modules/dreieck-vierecke-skalarprodukt/Labor';
import meta from '../content/modules/dreieck-vierecke-skalarprodukt/meta.json';
import themen from '../content/themen.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { LABOR_BEREICH } from '../src/components/Laborbrett';
import type { MessbildDaten } from '../src/components/Messbild';
import { viereck } from '../src/lib/figuren';
import { RAUM_GRENZE, bildpunkt, type Punkt3, type RaumBildSpec } from '../src/lib/schraegbild';

interface AufgabeAufruf {
  nummer: string;
  children: ReactNode;
  felder: { id: string; erwartet: number; toleranz?: number; beschriftung: ReactNode }[];
  hilfen: ReactNode[];
  loesung: ReactNode[];
}
interface FrageAufruf {
  nummer: string;
  children: ReactNode;
  optionen: { id: string; richtig: boolean; text: ReactNode; rueckmeldung: ReactNode }[];
  erklaerung: ReactNode;
}
const aufgaben: AufgabeAufruf[] = [];
const fragen: FrageAufruf[] = [];

vi.mock('../src/components/Aufgabe', () => ({
  Aufgabe: (p: AufgabeAufruf & { nummer: string | number }) => {
    aufgaben.push({ ...p, nummer: String(p.nummer) });
    return <div data-aufgabe={String(p.nummer)}>{p.children}</div>;
  },
}));
vi.mock('../src/components/Auswahlfrage', () => ({
  Auswahlfrage: (p: FrageAufruf) => {
    fragen.push(p);
    return <div data-frage={p.nummer}>{p.children}</div>;
  },
}));

function rendern(abschnitt: string | null = null): string {
  aufgaben.length = 0;
  fragen.length = 0;
  return renderToStaticMarkup(
    <AbschnittAnbieter value={abschnitt}>
      <Modul />
    </AbschnittAnbieter>,
  );
}
const ORDNER = 'content/modules/dreieck-vierecke-skalarprodukt';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const texteAusHtml = (html: string): string[] => [...html.matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<'));
const feld = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!;
const wert = (nr: string, id: string) => feld(nr, id).erwartet;
/** Unabhängige Hilfen: Skalarprodukt, Länge, Winkel in Grad, Differenz. */
const punkt = (u: number[], v: number[]) => u.reduce((s, x, i) => s + x * v[i]!, 0);
const laenge = (v: number[]) => Math.sqrt(punkt(v, v));
const diff = (a: number[], b: number[]) => b.map((x, i) => x - a[i]!);
const grad = (u: number[], v: number[]) => (Math.acos(Math.max(-1, Math.min(1, punkt(u, v) / (laenge(u) * laenge(v))))) * 180) / Math.PI;
const nah = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;
const innen = (p: number[], b: number[]) => p[0]! >= b[0]! && p[0]! <= b[1]! && p[1]! >= b[2]! && p[1]! <= b[3]!;
const kreuz2 = (u: number[], v: number[]) => u[0]! * v[1]! - u[1]! * v[0]!;
const gauss = (p: number[][]) => Math.abs(p.reduce((s, q, i) => s + (q[0]! * p[(i + 1) % p.length]![1]! - p[(i + 1) % p.length]![0]! * q[1]!), 0)) / 2;

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Vektoren, hat vier Abschnitte, BPE 7.3', () => {
    expect(meta.id).toBe('dreieck-vierecke-skalarprodukt');
    expect(meta.thema).toBe('vektorgeometrie');
    expect(meta.unterbereich).toBe('vektoren');
    expect(meta.bpe).toEqual(['7.3']);
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung']);
    const thema = themen.themen.find((x) => x.id === meta.thema) as { unterbereiche?: { id: string }[] };
    expect(thema.unterbereiche?.map((u) => u.id)).toContain(meta.unterbereich);
  });
  it('zeigt jeweils nur den gewählten Abschnitt', () => {
    for (const a of meta.abschnitte) {
      const html = rendern(a.id);
      expect(html).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(html).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('solange es ein Entwurf ist, steht es in keinem Kurs', () => {
    if (meta.status !== 'entwurf') return;
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"dreieck-vierecke-skalarprodukt"');
  });
  it('rendert ohne Formelfehler und ohne Gedankenstriche, mit der Fachsprache der Lehrkraft', () => {
    const html = rendern(null);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(html).not.toContain(z);
    for (const d of readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts'))) {
      const q = readFileSync(`${ORDNER}/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
    }
    for (const wort of ['Innenwinkel', 'gleichschenklig', 'gleichseitig', 'rechtwinklig', 'Parallelogramm', 'Rechteck', 'Raute', 'Quadrat', 'Trapez', 'Drachen', 'Skalarprodukt', 'Ergänzung zur Raute']) expect(html, wort).toContain(wort);
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).not.toMatch(/\d\/\d/);
    expect(html).not.toMatch(/[A-Z]\(-?\d+(,\d+)? ?\/ ?-?\d/);
  });
  it('das Erklären nimmt nichts vorweg: keine Vektorkriterien, keine Flächenformel', () => {
    const tex = texteAusHtml(rendern('erklaeren')).join(' ');
    expect(tex.length).toBeGreaterThan(50);
    expect(tex).not.toContain('\\sin');
    expect(tex).not.toContain('\\cos');
    expect(tex).not.toMatch(/overrightarrow\{AB\}\s*=\s*\\overrightarrow\{DC\}/);
    expect(tex).not.toMatch(/\\cdot\\overrightarrow\{A[CD]\}\s*=\s*0/);
  });
  it('verweist auf die Module davor und nimmt Vektorprodukt, Geraden und Ebenen nicht vorweg', () => {
    const quelle = readFileSync(`${ORDNER}/Erklaeren.tsx`, 'utf8');
    for (const m of ['rechnen-mit-vektoren', 'betrag-abstand-teilung', 'skalarprodukt-orthogonalitaet']) expect(quelle).toContain(`modul="${m}"`);
    expect(rendern(null)).not.toMatch(/Vektorprodukt|Kreuzprodukt|Normalenvektor|Geradengleichung|Ebenengleichung|Spurpunkt/);
  });
});

describe('Bilder', () => {
  const ebenenBilder: [string, MessbildDaten][] = [
    ['DREIECK', B.BILD_DREIECK], ['VIERECKE', B.BILD_VIERECKE], ['RECHTWINKLIG', B.BILD_RECHTWINKLIG], ['INNENWINKEL', B.BILD_INNENWINKEL], ['FLAECHE', B.BILD_FLAECHE], ['PARA_E', B.BILD_PARA_E], ['ERGAENZUNG', B.BILD_ERGAENZUNG],
    ['AUSWAHL_VIERECK', B.BILD_AUSWAHL_VIERECK],
    ...([false, true] as boolean[]).flatMap((k): [string, MessbildDaten][] => [
      [`aufgDreieck(${k})`, B.aufgDreieck(k)], [`aufgRechtwinklig(${k})`, B.aufgRechtwinklig(k)], [`aufgParallelogramm(${k})`, B.aufgParallelogramm(k)], [`aufgRaute(${k})`, B.aufgRaute(k)],
      [`aufgTrapez(${k})`, B.aufgTrapez(k)], [`aufgDrachen(${k})`, B.aufgDrachen(k)],
    ]),
  ];
  it('alle Punkte, Pfeile und Seiten liegen im Bildausschnitt, jedes Bild hat eine Textalternative', () => {
    for (const [name, b] of ebenenBilder) {
      for (const p of b.punkte ?? []) expect(innen([p.x, p.y], b.bereich), `${name} Punkt`).toBe(true);
      for (const a of [...(b.pfeile ?? []), ...(b.strecken ?? [])]) {
        expect(innen(a.von, b.bereich), `${name} von`).toBe(true);
        expect(innen(a.bis, b.bereich), `${name} bis`).toBe(true);
      }
      expect(b.beschreibung.length, name).toBeGreaterThan(40);
    }
  });
  it('die sechs Vierecke der Übersicht sind tatsächlich Quadrat, Rechteck, Parallelogramm, Raute, Trapez und Drachen', () => {
    const erwartet = ['quadrat', 'rechteck', 'parallelogramm', 'raute', 'trapez', 'drachen'];
    B.VIERECKE.forEach((v, i) => expect(viereck(v.ecken[0]!, v.ecken[1]!, v.ecken[2]!, v.ecken[3]!).art, v.name).toBe(erwartet[i]));
    // die Nummern stehen im Bild nicht auf einer Seite
    expect(B.BILD_VIERECKE.punkte).toHaveLength(6);
  });
  it('Beispiele der Erklärung und des Entdeckens: rechter Winkel bei A, Innenwinkel bei B, Parallelogramm, Ergänzung zur Raute, Fläche 6', () => {
    const { a, b, c } = D.RECHTWINKLIG;
    expect(punkt(diff(a, b), diff(a, c))).toBe(0);
    expect([punkt(diff(b, a), diff(b, c)), punkt(diff(c, a), diff(c, b))]).toEqual([20, 5]);
    expect(nah(grad(diff(b, a), diff(b, c)), 26.57, 0.005)).toBe(true);
    expect(nah(grad(diff(a, b), diff(b, c)), 153.43, 0.005)).toBe(true);
    // der Außenwinkel ergänzt den Innenwinkel zu 180°
    expect(nah(grad(diff(a, b), diff(b, c)) + grad(diff(b, a), diff(b, c)), 180)).toBe(true);
    const pf = B.BILD_INNENWINKEL.pfeile!;
    expect(pf[2]!.bis).toEqual([b[0] + (b[0] - a[0]), b[1] + (b[1] - a[1])]);
    const pa = D.PARA_E;
    expect(diff(pa.a, pa.b)).toEqual(diff(pa.d, pa.c));
    expect(punkt(diff(pa.a, pa.b), diff(pa.a, pa.d))).toBe(7);
    const e = D.ERGAENZUNG;
    expect(laenge(diff(e.a, e.b))).toBe(5);
    expect(laenge(diff(e.b, e.c))).toBe(5);
    expect(e.d).toEqual([e.a[0] + (e.c[0] - e.b[0]), e.a[1] + (e.c[1] - e.b[1])]);
    expect(viereck(e.a, e.b, e.c, e.d).art).toBe('raute');
    const f = D.FLAECHE_E;
    expect(gauss([f.a, f.b, f.c])).toBe(f.flaeche);
  });
  it('Raumbilder: kein Punkt liegt im Schrägbild auf einer Achse, alle Bildpunkte verschieden, im Koordinatensystem', () => {
    for (const s of [B.aufgRaumDreieck(true), B.aufgRechteck(true)] as RaumBildSpec[]) {
      const bilder = s.punkte!.map((p) => bildpunkt(p.p));
      for (const [x, y] of bilder) {
        expect(x).not.toBe(0);
        expect(y).not.toBe(0);
        expect(x).not.toBe(y);
      }
      expect(new Set(bilder.map(String)).size).toBe(bilder.length);
      for (const p of s.punkte!) for (const x of p.p) expect(Math.abs(x)).toBeLessThanOrEqual(RAUM_GRENZE);
    }
  });
});

describe('Labore', () => {
  const g2 = Array.from({ length: 2 * D.LABOR_GRENZE_EBENE + 1 }, (_, i) => i - D.LABOR_GRENZE_EBENE);
  it('Dreieckslabor: an jeder Ecke beginnen beide Pfeile, Seitenlängen und Winkelsumme in der Ebene stimmen', () => {
    let n = 0;
    for (const a1 of g2) for (const a2 of [-6, 0, 3]) for (const b1 of [-4, 5]) for (const b2 of [-5, 2, 6]) for (const c1 of [-6, 1]) for (const c2 of [-3, 6]) {
      const p = [[a1, a2], [b1, b2], [c1, c2]];
      const [AB, BC, CA, o, bl] = dreieckZustand2(p, 0).pfeile;
      expect(nah(laenge(diff(AB!.von, AB!.bis)), laenge(diff(p[0]!, p[1]!)))).toBe(true);
      expect(nah(laenge(diff(BC!.von, BC!.bis)), laenge(diff(p[1]!, p[2]!)))).toBe(true);
      expect(CA!.ohneSpitze).toBe(true);
      expect(o!.von).toEqual(p[0]);
      expect(bl!.von).toEqual(p[0]);
      for (const e of [0, 1, 2] as const) {
        const z = dreieckZustand2(p, e);
        const [n1, n2] = nachbarn(e);
        expect(z.pfeile[3]!.von).toEqual(p[e]);
        expect(z.pfeile[3]!.bis).toEqual(p[n1]);
        expect(z.pfeile[4]!.bis).toEqual(p[n2]);
      }
      n++;
    }
    expect(n).toBeGreaterThan(300);
  });
  it('Dreieckslabor im Raum bleibt im Koordinatensystem', () => {
    for (const e of [0, 1, 2] as const) {
      const s = dreieckBild3([[-4, 4, -4], [4, -4, 4], [0, 4, 0]], e);
      for (const p of s.punkte!) for (const x of p.p) expect(Math.abs(x)).toBeLessThanOrEqual(RAUM_GRENZE);
      expect(s.linien!.filter((l) => l.pfeil)).toHaveLength(2);
    }
  });
  it('Viereckslabor: Der Name des Labors stimmt für viele Einstellungen mit einer unabhängigen Klassifikation überein', () => {
    /** Unabhängig: Konvexität über Kreuzprodukte, Parallelität über das Kreuzprodukt 0, Gleichheit über Quadrate. */
    const klasse = (A: number[], Bp: number[], C: number[], Dp: number[]): string => {
      const ab = diff(A, Bp);
      const bc = diff(Bp, C);
      const cd = diff(C, Dp);
      const da = diff(Dp, A);
      const z = [kreuz2(ab, bc), kreuz2(bc, cd), kreuz2(cd, da), kreuz2(da, ab)];
      if (!(z.every((x) => x > 0) || z.every((x) => x < 0))) return 'ungueltig';
      const dc = diff(Dp, C);
      const ad = diff(A, Dp);
      const para = ab[0] === dc[0] && ab[1] === dc[1];
      const p1 = kreuz2(ab, dc) === 0;
      const p2 = kreuz2(bc, ad) === 0;
      const rechts = punkt(ab, ad) === 0;
      const gleich = punkt(ab, ab) === punkt(ad, ad);
      if (para && rechts && gleich) return 'quadrat';
      if (para && rechts) return 'rechteck';
      if (para && gleich) return 'raute';
      if (para) return 'parallelogramm';
      if (p1 !== p2) return 'trapez';
      const cb = diff(C, Bp);
      const cdv = diff(C, Dp);
      const k1 = punkt(ab, ab) === punkt(ad, ad) && punkt(cb, cb) === punkt(cdv, cdv);
      const k2 = punkt(ab, ab) === punkt(bc, bc) && punkt(da, da) === punkt(cd, cd);
      return k1 || k2 ? 'drachen' : 'allgemein';
    };
    const werte = [-3, -1, 0, 2, 3];
    const zaehler: Record<string, number> = {};
    let n = 0;
    for (const a of werte) for (const b of werte) for (const c of werte) for (const d of werte) for (const e of [-2, 1]) for (const f of [-3, 2]) {
      const A = [a, b];
      const Bp = [c, d];
      const C = [e + 1, f];
      const Dp = [a + e - 1 + c - c, b + f - 2];
      const erwartet = klasse(A, Bp, C, Dp);
      const v = viereck(A, Bp, C, Dp);
      expect(v.art, `${A} ${Bp} ${C} ${Dp}`).toBe(erwartet);
      zaehler[v.art] = (zaehler[v.art] ?? 0) + 1;
      n++;
    }
    expect(n).toBeGreaterThan(1000);
    // mehrere Arten kommen in der Stichprobe vor
    expect(Object.keys(zaehler).length).toBeGreaterThan(2);
  });
  it('Viereckslabor: Startwerte sind ein Parallelogramm, Namen aller Arten vorhanden, alle Ecken im Bild', () => {
    const { a, b, c, d } = D.VIERECK_START;
    expect(viereck(a, b, c, d).art).toBe('parallelogramm');
    for (const art of ['quadrat', 'rechteck', 'raute', 'parallelogramm', 'trapez', 'drachen', 'allgemein', 'ungueltig'] as const) expect(ART_NAME[art].length).toBeGreaterThan(3);
    const z = viereckZustand([a, b, c, d], true);
    for (const p of z.punkte) expect(innen(p.p, LABOR_BEREICH)).toBe(true);
    expect(z.pfeile).toHaveLength(6);
    expect(z.pfeile[4]!.sichtbar).toBe(true);
    expect(viereckZustand([a, b, c, d], false).pfeile[4]!.sichtbar).toBe(false);
  });
  it('rendert mit Schalter, Reglern und Legende, die Namen sind zunächst verborgen', () => {
    const dl = renderToStaticMarkup(<Dreieckslabor />);
    const vl = renderToStaticMarkup(<Viereckslabor />);
    expect(dl).toContain('aria-label="Ebene oder Raum wählen"');
    expect(dl).toContain('aria-label="Ecke wählen"');
    expect(dl.match(/type="range"/g)).toHaveLength(6);
    expect(vl.match(/type="range"/g)).toHaveLength(8);
    for (const html of [dl, vl]) {
      expect(html).toContain('aria-label="Legende"');
      expect(html).not.toContain('formel-fehler');
    }
    expect(vl).not.toContain('Das Viereck ist ein');
    expect(dl).not.toContain('gleichschenklig');
    expect(zahl2(-0.001)).toBe('0');
  });
});

describe('Aufgaben und Auswahlfragen, unabhängig gerechnet', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('die Nummern', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '2', '4', '5', '6', '8', '9', '10', '11', '12', '13']);
    expect(fragen.map((q) => q.nummer)).toEqual(['3', '7', '14']);
  });
  it('Aufgabe 1: Seitenlängen und Innenwinkel von Hand, Winkelsumme der drei Winkel 180°', () => {
    const A = [1, 1];
    const Bp = [5, 4];
    const C = [-4, 1];
    expect(wert('1', 'ab')).toBe(laenge(diff(A, Bp)));
    expect(wert('1', 'ac')).toBe(laenge(diff(A, C)));
    expect(Math.abs(laenge(diff(Bp, C)) - wert('1', 'bc'))).toBeLessThanOrEqual(feld('1', 'bc').toleranz!);
    expect(Math.abs(grad(diff(A, Bp), diff(A, C)) - wert('1', 'al'))).toBeLessThanOrEqual(feld('1', 'al').toleranz!);
    expect(Math.abs(grad(diff(Bp, A), diff(Bp, C)) - wert('1', 'be'))).toBeLessThanOrEqual(feld('1', 'be').toleranz!);
    expect(nah(grad(diff(A, Bp), diff(A, C)) + grad(diff(Bp, A), diff(Bp, C)) + grad(diff(C, A), diff(C, Bp)), 180)).toBe(true);
    // gleichschenklig mit der Spitze A: gleiche Basiswinkel
    expect(nah(grad(diff(Bp, A), diff(Bp, C)), grad(diff(C, A), diff(C, Bp)))).toBe(true);
    expect(wert('1', 'al')).toBe(Math.round(grad(diff(A, Bp), diff(A, C)) * 100) / 100);
  });
  it('Aufgabe 2: Skalarprodukte an den Ecken, rechter Winkel nur bei B, Fläche', () => {
    const A = [-1, 2];
    const Bp = [3, 0];
    const C = [4, 2];
    expect([wert('2', 'sa'), wert('2', 'sb'), wert('2', 'sc')]).toEqual([punkt(diff(A, Bp), diff(A, C)), punkt(diff(Bp, A), diff(Bp, C)), punkt(diff(C, A), diff(C, Bp))]);
    expect(wert('2', 'sb')).toBe(0);
    expect(wert('2', 'fl')).toBe(gauss([A, Bp, C]));
    expect(nah(laenge(diff(Bp, A)) * laenge(diff(Bp, C)) / 2, wert('2', 'fl'))).toBe(true);
  });
  it('Aufgabe 3: genau eine richtige Antwort, die falschen Antworten nennen wirklich andere Winkel', () => {
    const q = fragen.find((x) => x.nummer === '3')!;
    expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
    const { a, b, c } = D.A_INNEN;
    expect(nah(grad(diff(b, a), diff(b, c)), D.A_INNEN.innen, 0.005)).toBe(true);
    expect(nah(grad(diff(a, b), diff(b, c)), D.A_INNEN.aussen, 0.005)).toBe(true);
    expect(alsText(q.erklaerung)).toContain('funktionsgraph');
  });
  it('Aufgabe 4 und 5: Dreieck im Raum, gleichschenklig und rechtwinklig mit 45° an den anderen Ecken', () => {
    const A = [-1, 0, 1];
    const Bp = [1, 1, 3];
    const C = [0, 2, -1];
    expect(wert('4', 'ab')).toBe(laenge(diff(A, Bp)));
    expect(wert('4', 'ac')).toBe(laenge(diff(A, C)));
    expect(wert('4', 'sp')).toBe(punkt(diff(A, Bp), diff(A, C)));
    expect(Math.abs(laenge(diff(Bp, C)) - wert('4', 'bc'))).toBeLessThanOrEqual(feld('4', 'bc').toleranz!);
    expect(nah(grad(diff(Bp, A), diff(Bp, C)), wert('5', 'be'), 1e-6)).toBe(true);
    expect(nah(grad(diff(C, A), diff(C, Bp)), wert('5', 'ga'), 1e-6)).toBe(true);
  });
  it('Aufgabe 6: Parallelogramm, Skalarprodukt und Fläche über die Gaußsche Formel', () => {
    const P = [[-2, -1], [3, 0], [5, 3], [0, 2]];
    expect([wert('6', 'ab1'), wert('6', 'ab2')]).toEqual(diff(P[0]!, P[1]!));
    expect([wert('6', 'dc1'), wert('6', 'dc2')]).toEqual(diff(P[3]!, P[2]!));
    expect(wert('6', 'sp')).toBe(punkt(diff(P[0]!, P[1]!), diff(P[0]!, P[3]!)));
    expect(wert('6', 'fl')).toBe(gauss(P));
    expect(viereck(P[0]!, P[1]!, P[2]!, P[3]!).art).toBe('parallelogramm');
  });
  it('Aufgabe 7: genau ein Name stimmt, das Viereck ist ein Parallelogramm, kein Rechteck, keine Raute', () => {
    const q = fragen.find((x) => x.nummer === '7')!;
    expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
    expect(alsText(q.optionen.find((o) => o.richtig)!.text)).toContain('Parallelogramm');
    expect(viereck([0, 0], [4, 0], [5, 3], [1, 3]).art).toBe('parallelogramm');
  });
  it('Aufgabe 8: Rechteck im Raum, DC = AB, rechter Winkel, Fläche, und alle vier Winkel 90°', () => {
    const A = [-1, -1, 0];
    const Bp = [1, 0, 2];
    const C = [1, 2, 1];
    const Dp = [-1, 1, -1];
    expect([wert('8', 'dc1'), wert('8', 'dc2'), wert('8', 'dc3')]).toEqual(diff(Dp, C));
    expect(diff(Dp, C)).toEqual(diff(A, Bp));
    expect(wert('8', 'sp')).toBe(punkt(diff(A, Bp), diff(A, Dp)));
    expect(Math.abs(laenge(diff(A, Bp)) * laenge(diff(A, Dp)) - wert('8', 'fl'))).toBeLessThanOrEqual(feld('8', 'fl').toleranz!);
    for (const [p, q, r] of [[Dp, A, Bp], [A, Bp, C], [Bp, C, Dp], [C, Dp, A]] as number[][][]) expect(punkt(diff(q!, p!), diff(q!, r!))).toBe(0);
    // alle vier Punkte liegen in einer Ebene: Spatprodukt von AB, AD, AC ist 0
    const ab = diff(A, Bp);
    const ad = diff(A, Dp);
    const ac = diff(A, C);
    const spat = ab[0]! * (ad[1]! * ac[2]! - ad[2]! * ac[1]!) - ab[1]! * (ad[0]! * ac[2]! - ad[2]! * ac[0]!) + ab[2]! * (ad[0]! * ac[1]! - ad[1]! * ac[0]!);
    expect(spat).toBe(0);
  });
  it('Aufgaben 9 und 10: Raute, D über AD = BC, Diagonalen senkrecht, Winkel ergänzen sich zu 180°', () => {
    const A = [-1, 0];
    const Bp = [2, 4];
    const C = [7, 4];
    const Dp = [wert('9', 'd1'), wert('9', 'd2')];
    expect(diff(A, Dp)).toEqual(diff(Bp, C));
    expect(laenge(diff(A, Bp))).toBe(laenge(diff(Bp, C)));
    expect(punkt(diff(A, C), diff(Bp, Dp))).toBe(wert('9', 'dg'));
    expect(viereck(A, Bp, C, Dp).art).toBe('raute');
    const al = grad(diff(A, Bp), diff(A, Dp));
    const be = grad(diff(Bp, A), diff(Bp, C));
    expect(Math.abs(al - wert('10', 'al'))).toBeLessThanOrEqual(feld('10', 'al').toleranz!);
    expect(Math.abs(be - wert('10', 'be'))).toBeLessThanOrEqual(feld('10', 'be').toleranz!);
    expect(nah(al + be, 180)).toBe(true);
  });
  it('Aufgabe 11: Trapez mit genau einem Paar paralleler Seiten, Faktor und Winkel', () => {
    const A = [-2, 0];
    const Bp = [4, 2];
    const C = [2, 4];
    const Dp = [-1, 3];
    const ab = diff(A, Bp);
    const dc = diff(Dp, C);
    expect(ab).toEqual(dc.map((x) => wert('11', 'r') * x));
    expect(kreuz2(diff(Bp, C), diff(A, Dp))).not.toBe(0);
    expect(Math.abs(grad(ab, diff(A, Dp)) - wert('11', 'al'))).toBeLessThanOrEqual(feld('11', 'al').toleranz!);
    expect(viereck(A, Bp, C, Dp).art).toBe('trapez');
  });
  it('Aufgabe 12: Drachen mit zwei Paaren gleich langer Nachbarseiten und senkrechten Diagonalen, kein Parallelogramm', () => {
    const A = [0, 0];
    const Bp = [2, 1];
    const C = [5, 0];
    const Dp = [2, -1];
    expect(punkt(diff(A, Bp), diff(A, Bp))).toBe(punkt(diff(A, Dp), diff(A, Dp)));
    expect(punkt(diff(C, Bp), diff(C, Bp))).toBe(punkt(diff(C, Dp), diff(C, Dp)));
    expect(Math.abs(laenge(diff(A, Bp)) - wert('12', 'la'))).toBeLessThanOrEqual(feld('12', 'la').toleranz!);
    expect(Math.abs(laenge(diff(C, Bp)) - wert('12', 'lc'))).toBeLessThanOrEqual(feld('12', 'lc').toleranz!);
    expect(wert('12', 'dg')).toBe(punkt(diff(A, C), diff(Bp, Dp)));
    expect(viereck(A, Bp, C, Dp).art).toBe('drachen');
  });
  it('Aufgabe 13: Sinus und Fläche des Dreiecks aus Aufgabe 1, mit der Gaußschen Formel geprüft', () => {
    const A = [1, 1];
    const Bp = [5, 4];
    const C = [-4, 1];
    const w = grad(diff(A, Bp), diff(A, C));
    expect(Math.abs(Math.sin((w * Math.PI) / 180) - wert('13', 's'))).toBeLessThanOrEqual(feld('13', 's').toleranz!);
    expect(wert('13', 'fl')).toBe(gauss([A, Bp, C]));
  });
  it('Aufgabe 14: genau eine richtige Antwort, ein Drachen mit einem rechten Winkel ist ein Gegenbeispiel zu b', () => {
    const q = fragen.find((x) => x.nummer === '14')!;
    expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
    expect(texteAusHtml(alsText(q.optionen.find((o) => o.richtig)!.text)).join(' ')).toContain('\\overrightarrow{AB}=\\overrightarrow{DC}');
    // Gegenbeispiel zu b: AB · AD = 0, aber kein Rechteck
    const A = [0, 0];
    const Bp = [2, 0];
    const Dp = [0, 2];
    const C = [3, 3];
    expect(punkt(diff(A, Bp), diff(A, Dp))).toBe(0);
    expect(viereck(A, Bp, C, Dp).art).not.toBe('rechteck');
    // Gegenbeispiel zu c: eine Raute, die kein Rechteck ist
    expect(viereck([-1, 0], [2, 4], [7, 4], [4, 0]).art).toBe('raute');
    // Gegenbeispiel zu d: gleichschenkliges Trapez mit gleich langen Diagonalen
    const t = viereck([0, 0], [6, 0], [5, 3], [1, 3]);
    expect(t.diagonalenGleich).toBe(true);
    expect(t.art).toBe('trapez');
  });
  it('Auswahlfragen und Aufgaben: richtige Antworten nicht alle an derselben Stelle, jede Antwort mit Rückmeldung, Hilfen und Lösungen vorhanden', () => {
    expect(new Set(fragen.map((q) => q.optionen.findIndex((o) => o.richtig))).size).toBeGreaterThan(1);
    for (const q of fragen) for (const o of q.optionen) expect(alsText(o.rueckmeldung).length, `${q.nummer}${o.id}`).toBeGreaterThan(20);
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(1);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(1);
    }
  });
  it('das Beispiel der Zusammenfassung ist richtig gerechnet', () => {
    const z = D.ZUSAMMENFASSUNG;
    expect(viereck(z.a, z.b, z.c, z.d).art).toBe('parallelogramm');
    expect(punkt(diff(z.a, z.b), diff(z.a, z.d))).toBe(z.skalar);
    expect(nah(grad(diff(z.a, z.b), diff(z.a, z.d)), 63.43, 0.005)).toBe(true);
    const flaeche = laenge(diff(z.a, z.b)) * laenge(diff(z.a, z.d)) * Math.sin((grad(diff(z.a, z.b), diff(z.a, z.d)) * Math.PI) / 180);
    expect(nah(flaeche, 24, 1e-9)).toBe(true);
    expect(gauss([z.a, z.b, z.c, z.d])).toBe(24);
  });
});
