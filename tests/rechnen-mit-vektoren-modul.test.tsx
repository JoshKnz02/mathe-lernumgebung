import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/rechnen-mit-vektoren/Bilder';
import * as D from '../content/modules/rechnen-mit-vektoren/daten';
import Modul from '../content/modules/rechnen-mit-vektoren/index';
import {
  Additionslabor,
  additionsBild3,
  additionsDaten,
  additionsZustand2,
  Kollinearitaetslabor,
  Vielfachenlabor,
  zweiPfeileBild3,
  zweiPfeileZustand2,
} from '../content/modules/rechnen-mit-vektoren/Labor';
import { LABOR_BEREICH, laborLagen } from '../content/modules/rechnen-mit-vektoren/Laborbrett';
import meta from '../content/modules/rechnen-mit-vektoren/meta.json';
import themen from '../content/themen.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import type { MessbildDaten } from '../src/components/Messbild';
import { RAUM_GRENZE, bildpunkt, type Punkt3, type RaumBildSpec } from '../src/lib/schraegbild';

interface AufgabeAufruf {
  nummer: string;
  children: ReactNode;
  felder: { id: string; erwartet: number; beschriftung: ReactNode }[];
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
const ORDNER = 'content/modules/rechnen-mit-vektoren';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const wert = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!.erwartet;
const koord = (nr: string, praefix: string, n: number): number[] => Array.from({ length: n }, (_, i) => wert(nr, `${praefix}${i + 1}`));
const gleich = (u: number[], v: number[]) => u.length === v.length && u.every((x, i) => Math.abs(x - v[i]!) < 1e-9);
/** Alle TeX-Quelltexte der Formeln eines Knotens (aus den Annotationen von KaTeX). */
const texte = (n: ReactNode): string[] => [...alsText(n).matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<'));
/** Die Zahlen der ersten Spalte (pmatrix) in einem Knoten. */
const spalteAus = (n: ReactNode): number[] => {
  const m = /\\begin\{pmatrix\}(.*?)\\end\{pmatrix\}/.exec(texte(n).join(' '))!;
  return m[1]!.split('\\\\').map((z) => Number(z.replace(/\{,\}/g, '.')));
};
/** Unabhängig: zwei Vektoren sind kollinear, wenn alle 2×2-Unterdeterminanten verschwinden. */
const kreuzNull = (u: number[], v: number[]) => u.every((_, i) => u.every((__, j) => Math.abs(u[i]! * v[j]! - u[j]! * v[i]!) < 1e-9));
const diff = (a: number[], b: number[]) => b.map((x, i) => x - a[i]!);

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Vektoren, hat vier Abschnitte, BPE 7.2', () => {
    expect(meta.id).toBe('rechnen-mit-vektoren');
    expect(meta.thema).toBe('vektorgeometrie');
    expect(meta.unterbereich).toBe('vektoren');
    expect(meta.bpe).toEqual(['7.2']);
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
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"rechnen-mit-vektoren"');
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
    for (const wort of ['Summe', 'Skalar', 'Linearkombination', 'Koeffizienten', 'kollinear', 'parallel', 'Pfeilklasse', 'Gegenvektor', 'Nullvektor', 'Vielfache']) expect(html, wort).toContain(wort);
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).not.toMatch(/\d\/\d/);
    // Punkte mit senkrechtem Strich, nie mit Schrägstrich
    expect(html).not.toMatch(/[A-Z]\(-?\d+(,\d+)? ?\/ ?-?\d/);
  });
  it('das Erklären nimmt nichts vorweg: keine Koordinatenregeln, kein Kriterium für Kollinearität', () => {
    const html = rendern('erklaeren');
    expect(html).not.toMatch(/einzeln|koordinatenweise|Koordinate für Koordinate/);
    expect(html).not.toMatch(/Quotient|derselbe Faktor|gemeinsamer Faktor/);
  });
  it('verweist auf die beiden Module davor statt Verbindungsvektor und Ortsvektor zu wiederholen', () => {
    const quelle = readFileSync(`${ORDNER}/Erklaeren.tsx`, 'utf8');
    expect(quelle).toContain('modul="punkte-vektoren-ebene"');
    expect(quelle).toContain('modul="punkte-vektoren-raum"');
    expect(rendern(null)).not.toMatch(/Zielpunkt minus Ausgangspunkt/);
  });
  it('Betrag, Länge eines Vektors und Teilung von Strecken (Mittelpunkt) gehören nicht in dieses Modul', () => {
    expect(rendern(null)).not.toMatch(/Betrag|Länge des Vektors|Mittelpunkt|Teilverhältnis|Wurzel|\\sqrt/);
  });
});

describe('Darstellung: Ebene und Raum, Schrägbild und räumlich', () => {
  it('über jedem Raumbild gibt es den Schalter, die Labore haben den Schalter zwischen Ebene und Raum', () => {
    const html = rendern(null);
    const schalter = html.match(/class="darstellungswahl"/g) ?? [];
    const bilder = html.match(/class="raumbild"/g) ?? [];
    const dimensionen = html.match(/aria-label="Ebene oder Raum wählen"/g) ?? [];
    expect(dimensionen).toHaveLength(3);
    // die drei Labore beginnen in der Ebene, deshalb zählt der Schalter für Raumbilder nur die Bilder im Modul
    expect(schalter.length).toBe(bilder.length + dimensionen.length);
    expect(bilder.length).toBeGreaterThanOrEqual(2);
  });
  it('Erklären nennt die Wahl zwischen Schrägbild und räumlicher Ansicht', () => {
    expect(rendern('erklaeren')).toContain('Schrägbild und räumlicher Ansicht');
  });
});

/* ---------- Bilder ---------- */

const innen = (p: number[], b: number[]) => p[0]! >= b[0]! && p[0]! <= b[1]! && p[1]! >= b[2]! && p[1]! <= b[3]!;

describe('Bilder', () => {
  const ebenenBilder: [string, MessbildDaten][] = [
    ['BILD_WEG', B.BILD_WEG],
    ['BILD_VIELFACHE', B.BILD_VIELFACHE],
    ['BILD_PARALLELOGRAMM', B.BILD_PARALLELOGRAMM],
    ['BILD_DIFFERENZ', B.BILD_DIFFERENZ],
    ['BILD_KOLLINEAR', B.BILD_KOLLINEAR],
    ['aufgZeichnen', B.aufgZeichnen],
    ['aufgRoboter(false)', B.aufgRoboter(false)],
    ['aufgRoboter(true)', B.aufgRoboter(true)],
    ['aufgParallelogramm(false)', B.aufgParallelogramm(false)],
    ['aufgParallelogramm(true)', B.aufgParallelogramm(true)],
    ['aufgViereck', B.aufgViereck],
  ];
  it('alle Punkte und Pfeile der Bilder in der Ebene liegen im Bildausschnitt, jedes Bild hat eine Textalternative', () => {
    for (const [name, b] of ebenenBilder) {
      for (const p of b.punkte ?? []) expect(innen([p.x, p.y], b.bereich), `${name} Punkt`).toBe(true);
      for (const a of b.pfeile ?? []) {
        expect(innen(a.von, b.bereich), `${name} Pfeil von`).toBe(true);
        expect(innen(a.bis, b.bereich), `${name} Pfeil bis`).toBe(true);
      }
      expect(b.beschreibung.length, name).toBeGreaterThan(40);
    }
  });
  it('alle Raumbilder liegen im Koordinatensystem (Koordinaten von −4 bis 4)', () => {
    const raum: RaumBildSpec[] = [B.RAUM_WEG, B.aufgDrohne(false), B.aufgDrohne(true), B.aufgGerade, additionsBild3(D.ADD_START.a3, D.ADD_START.b3, false, false)];
    for (const s of raum) {
      for (const p of s.punkte ?? []) for (const x of p.p) expect(Math.abs(x)).toBeLessThanOrEqual(RAUM_GRENZE);
      for (const l of s.linien ?? []) for (const x of [...l.von, ...l.bis]) expect(Math.abs(x)).toBeLessThanOrEqual(RAUM_GRENZE);
    }
  });
  it('Raumbilder der Aufgaben: kein Punkt liegt im Schrägbild auf einer Achse und alle Bildpunkte sind verschieden', () => {
    for (const spec of [B.aufgDrohne(true), B.RAUM_WEG, B.aufgGerade]) {
      const bilder = spec.punkte!.map((p) => bildpunkt(p.p));
      for (const [x, y] of bilder) {
        expect(x).not.toBe(0);
        expect(y).not.toBe(0);
        expect(x).not.toBe(y);
      }
      expect(new Set(bilder.map(String)).size).toBe(bilder.length);
    }
  });
  it('Weg A, B, C: die Pfeile sind AB, BC und AC mit den Koordinaten der Daten, die Summe stimmt', () => {
    const { a, b, c, d } = D.WEG;
    const pf = B.BILD_WEG.pfeile!;
    expect(pf.map((p) => diff(p.von, p.bis))).toEqual([[3, 2], [2, 4], [5, 6]]);
    expect(pf[0]!.bis).toEqual(pf[1]!.von);
    expect(pf[2]!.bis).toEqual(pf[1]!.bis);
    // Parallelogramm: D = A + BC, die gestrichelten Pfeile sind die verschobenen
    expect(d).toEqual([a[0] + (c[0] - b[0]), a[1] + (c[1] - b[1])]);
    const par = B.BILD_PARALLELOGRAMM.pfeile!;
    expect(diff(par[2]!.von, par[2]!.bis)).toEqual(diff(b, c));
    expect(diff(par[3]!.von, par[3]!.bis)).toEqual(diff(a, b));
  });
  it('Weg im Raum: AB + BC = AC, die Bildpunkte von O, A, B und C sind verschieden und liegen auf keiner Achse', () => {
    const { a, b, c } = D.WEG_RAUM;
    const l = B.RAUM_WEG.linien!;
    expect(diff(l[0]!.von, l[0]!.bis)).toEqual([2, 4, 1]);
    expect(diff(l[1]!.von, l[1]!.bis)).toEqual([-3, 1, 1]);
    expect(diff(l[2]!.von, l[2]!.bis)).toEqual([2 + -3, 4 + 1, 1 + 1]);
    expect(l[0]!.bis).toEqual(l[1]!.von);
    expect(l[2]!.bis).toEqual(c);
    const bilder = [[0, 0, 0], a, b, c].map((p) => bildpunkt(p as Punkt3));
    expect(new Set(bilder.map(String)).size).toBe(4);
    for (const bp of bilder.slice(1)) {
      expect(bp[0]).not.toBe(0);
      expect(bp[1]).not.toBe(0);
      // nicht auf der schräg gezeichneten x₁-Achse (dort sind beide Bildkoordinaten gleich)
      expect(bp[0]).not.toBe(bp[1]);
    }
  });
  it('Differenz: AC − AB = BC', () => {
    const { ab, ac, bc } = D.WEG;
    expect(ac.map((x, i) => x - ab[i]!)).toEqual(bc);
    const pf = B.BILD_DIFFERENZ.pfeile!;
    expect(diff(pf[1]!.von, pf[1]!.bis).map((x, i) => x - diff(pf[0]!.von, pf[0]!.bis)[i]!)).toEqual(diff(pf[2]!.von, pf[2]!.bis));
  });
  it('Vielfache im Bild: 3a, −a und ½a haben die Koordinaten 3, −1 und ½ mal (2 | 1)', () => {
    const [a, a3, am, ah] = B.BILD_VIELFACHE.pfeile!.map((p) => diff(p.von, p.bis));
    expect(a).toEqual([2, 1]);
    expect(a3).toEqual([6, 3]);
    expect(am).toEqual([-2, -1]);
    expect(ah).toEqual([1, 0.5]);
  });
  it('Kollinearität im Bild: v = (−3) · u, beide Pfeile liegen nicht auf derselben Geraden', () => {
    const [u, v] = B.BILD_KOLLINEAR.pfeile!;
    const du = diff(u!.von, u!.bis);
    const dv = diff(v!.von, v!.bis);
    expect(dv).toEqual(du.map((x) => -3 * x));
    // verschiedene Geraden: der Verbindungsvektor der Anfangspunkte ist kein Vielfaches von u
    expect(kreuzNull(du, diff(u!.von, v!.von))).toBe(false);
  });
  it('Zeichenaufgabe 3: die Summe im Kontrollbild, beide Reihenfolgen enden im selben Punkt', () => {
    const p = B.aufgZeichnen.pfeile!;
    expect(p[1]!.bis).toEqual(p[3]!.bis);
    expect(p[1]!.bis).toEqual(p[4]!.bis);
    expect(p[1]!.bis).toEqual([3 + -1, 1 + 3]);
  });
});

/* ---------- Labore ---------- */

describe('Labore', () => {
  const bereich2 = Array.from({ length: 2 * D.LABOR_GRENZE_EBENE + 1 }, (_, i) => i - D.LABOR_GRENZE_EBENE);
  const bereich3 = Array.from({ length: 2 * D.LABOR_GRENZE_RAUM + 1 }, (_, i) => i - D.LABOR_GRENZE_RAUM);
  it('Additionslabor: Summe und Differenz in der Ebene und im Raum, beide Reihenfolgen, alle Einstellungen im Bild', () => {
    let n = 0;
    for (const a1 of bereich2) for (const a2 of bereich2) for (const b1 of [-3, 0, 2]) for (const b2 of [-3, 1, 3]) for (const minus of [false, true]) for (const getauscht of [false, true]) {
      const a = [a1, a2];
      const b = [b1, b2];
      const d = additionsDaten(a, b, minus, getauscht);
      const erwartet = [a1 + (minus ? -b1 : b1), a2 + (minus ? -b2 : b2)];
      expect(gleich(d.ergebnis, erwartet)).toBe(true);
      expect(gleich([d.erster[0]! + d.zweiter[0]!, d.erster[1]! + d.zweiter[1]!], erwartet)).toBe(true);
      const z = additionsZustand2(a, b, minus, getauscht);
      // Reihenfolge der Pfeile: Summe (breit, unten), erster, zweiter Weg
      expect(z.pfeile[1]!.bis).toEqual(z.pfeile[2]!.von);
      expect(z.pfeile[2]!.bis).toEqual(z.pfeile[0]!.bis);
      expect(z.pfeile[0]!.breite).toBeGreaterThan(z.pfeile[1]!.breite);
      expect(gleich(z.pfeile[0]!.bis, erwartet)).toBe(true);
      for (const p of z.punkte) expect(innen(p.p, LABOR_BEREICH)).toBe(true);
      const lagen = laborLagen(z);
      for (const [x, y] of lagen) {
        expect(x).toBeGreaterThan(0);
        expect(x).toBeLessThan(1);
        expect(y).toBeGreaterThan(0);
        expect(y).toBeLessThan(1);
      }
      n++;
    }
    expect(n).toBeGreaterThan(1000);
    for (const a of bereich3.flatMap((x) => bereich3.map((y) => [x, y, 1]))) for (const b of [[-2, 2, 0], [2, 1, -2]]) for (const minus of [false, true]) {
      const d = additionsDaten(a, b, minus, false);
      const s = additionsBild3(a, b, minus, false);
      expect(gleich(d.ergebnis, a.map((x, i) => x + (minus ? -b[i]! : b[i]!)))).toBe(true);
      for (const p of s.punkte!) for (const x of p.p) expect(Math.abs(x)).toBeLessThanOrEqual(RAUM_GRENZE);
    }
  });
  it('Vielfachenlabor: r · a mit r von −2 bis 2 in Schritten von 0,5 bleibt im Bild, das breitere Pfeil liegt unten', () => {
    for (const r of [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2]) for (const a of [[3, -3], [-3, 2], [2, 1]]) {
      const ra = a.map((x) => r * x);
      const z = zweiPfeileZustand2(a, ra, 'Q');
      expect(z.pfeile[0]!.breite).toBeGreaterThan(z.pfeile[1]!.breite);
      expect(z.pfeile[0]!.farbe).toBe(D.BLAU);
      expect(z.pfeile[1]!.farbe).toBe(D.ORANGE);
      for (const p of z.punkte) expect(innen(p.p, LABOR_BEREICH)).toBe(true);
    }
    for (const r of [-2, -0.5, 1.5, 2]) {
      const a = [2, -2, 2];
      const s = zweiPfeileBild3(a, a.map((x) => r * x), 'Q', '');
      for (const p of s.punkte!) for (const x of p.p) expect(Math.abs(x)).toBeLessThanOrEqual(RAUM_GRENZE);
    }
  });
  it('Kollinearitätslabor: Das Urteil des Labors stimmt für alle Einstellungen mit der Unterdeterminanten-Probe überein', async () => {
    const { faktor } = await import('../src/lib/vektor');
    const g = D.KOLL_LABOR.grenze;
    const reichweite = Array.from({ length: 2 * g + 1 }, (_, i) => i - g);
    let kollinear2 = 0;
    for (const x of reichweite) for (const y of reichweite) {
      const k = kreuzNull(D.KOLL_LABOR.a2, [x, y]);
      expect(faktor(D.KOLL_LABOR.a2, [x, y]) !== null).toBe(k);
      if (k) kollinear2++;
    }
    // (2 | −1) hat im Bereich genau die Vielfachen r = −2, −1, 0, 1, 2 als kollineare Vektoren
    expect(kollinear2).toBe(5);
    let kollinear3 = 0;
    for (const x of reichweite) for (const y of reichweite) for (const z of reichweite) {
      const k = kreuzNull(D.KOLL_LABOR.a3, [x, y, z]);
      expect(faktor(D.KOLL_LABOR.a3, [x, y, z]) !== null).toBe(k);
      if (k) kollinear3++;
    }
    // (1 | −2 | 2): r · (1 | −2 | 2) im Bereich −4 bis 4 für r = −2, −1, 0, 1, 2
    expect(kollinear3).toBe(5);
  });
  it('die Startwerte sind nicht kollinear (das Labor beginnt mit einer Frage) und das Vielfachenlabor beginnt mit r = 2', () => {
    expect(kreuzNull(D.KOLL_LABOR.a2, D.KOLL_LABOR.b2)).toBe(false);
    expect(kreuzNull(D.KOLL_LABOR.a3, D.KOLL_LABOR.b3)).toBe(false);
    expect(D.VIEL_START.r).toBe(2);
  });
  it('die Startwerte im Raum haben im Schrägbild verschiedene Bildpunkte für O, P und Z', () => {
    const s = additionsBild3(D.ADD_START.a3, D.ADD_START.b3, false, false);
    const bilder = s.punkte!.map((p) => bildpunkt(p.p).map(String).join(','));
    expect(new Set(bilder).size).toBe(bilder.length);
    const v = zweiPfeileBild3(D.VIEL_START.a3, D.VIEL_START.a3.map((x) => D.VIEL_START.r * x), 'Q', '');
    const vb = v.punkte!.map((p) => bildpunkt(p.p).map(String).join(','));
    expect(new Set(vb).size).toBe(vb.length);
    // kein Pfeil liegt im Schrägbild auf einer Achse: nicht x₁ (beide Bildkoordinaten gleich), nicht x₂ oder x₃ (eine Bildkoordinate 0)
    const k = zweiPfeileBild3(D.KOLL_LABOR.a3, D.KOLL_LABOR.b3, 'Q', '');
    for (const s2 of [s, v, k]) for (const p of s2.punkte!.slice(1)) {
      const [x, y] = bildpunkt(p.p);
      expect(x, p.name).not.toBe(y);
      expect(x, p.name).not.toBe(0);
      expect(y, p.name).not.toBe(0);
    }
  });
  it('Beschriftungen der Labore liegen im Bild und fallen nicht aufeinander, wenn die Punkte verschieden sind', () => {
    const z = additionsZustand2(D.ADD_START.a2, D.ADD_START.b2, false, false);
    const l = laborLagen(z);
    expect(l).toHaveLength(3);
    for (let i = 0; i < l.length; i++) for (let j = i + 1; j < l.length; j++) expect(Math.hypot(l[i]![0] - l[j]![0], l[i]![1] - l[j]![1])).toBeGreaterThan(0.03);
  });
  it('die Labore rendern mit Schalter, Reglern und Legende', () => {
    for (const L of [Additionslabor, Vielfachenlabor, Kollinearitaetslabor]) {
      const html = renderToStaticMarkup(<L />);
      expect(html).toContain('aria-label="Ebene oder Raum wählen"');
      expect(html).toContain('type="range"');
      expect(html).toContain('aria-label="Legende"');
      expect(html).not.toContain('formel-fehler');
    }
    expect(renderToStaticMarkup(<Vielfachenlabor />)).toContain('Faktor r');
  });
});

/* ---------- Aufgaben ---------- */

describe('Aufgaben und Auswahlfragen, unabhängig gerechnet', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('die Nummern: Aufgaben 1, 2, 5 bis 11, 13 bis 15, Auswahlfragen 4, 12, 16, Zeichnen 3', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '2', '5', '6', '7', '8', '9', '10', '11', '13', '14', '15']);
    expect(fragen.map((q) => q.nummer)).toEqual(['4', '12', '16']);
    expect(alsText(<Modul />)).toContain('Aufgabe 3: Summe zeichnen');
  });
  it('Aufgabe 1 (Ebene): a + b und a − b koordinatenweise', () => {
    const a = [3, -5];
    const b = [-2, 8];
    expect(koord('1', 's', 2)).toEqual([a[0]! + b[0]!, a[1]! + b[1]!]);
    expect(koord('1', 'd', 2)).toEqual([a[0]! - b[0]!, a[1]! - b[1]!]);
    expect(texte(aufgaben.find((x) => x.nummer === '1')!.children).join(' ')).toContain('3\\\\-5');
  });
  it('Aufgabe 2 (Raum): a + b und a − b', () => {
    const a = [2, -1, 4];
    const b = [-3, 5, 1];
    expect(koord('2', 's', 3)).toEqual(a.map((x, i) => x + b[i]!));
    expect(koord('2', 'd', 3)).toEqual(a.map((x, i) => x - b[i]!));
  });
  it('Aufgabe 4: genau eine richtige Antwort, der Nullvektor', () => {
    const q = fragen.find((x) => x.nummer === '4')!;
    expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
    expect(spalteAus(q.optionen.find((o) => o.richtig)!.text)).toEqual([0, 0]);
  });
  it('Aufgabe 5: Gesamtfahrt und Zielpunkt, die Stationen im Bild stimmen', () => {
    const start = [-2, 1];
    const v = [[4, 3], [-1, -5], [3, 2]];
    const g = [v[0]![0]! + v[1]![0]! + v[2]![0]!, v[0]![1]! + v[1]![1]! + v[2]![1]!];
    expect(koord('5', 'g', 2)).toEqual(g);
    expect(koord('5', 'z', 2)).toEqual([start[0]! + g[0]!, start[1]! + g[1]!]);
    const pf = B.aufgRoboter(true).pfeile!;
    expect(pf.slice(0, 3).map((p) => diff(p.von, p.bis))).toEqual(v);
    expect(pf[3]!.bis).toEqual(koord('5', 'z', 2));
    expect(pf[3]!.von).toEqual(start);
  });
  it('Aufgabe 6: Kräfte, die dritte Kraft macht die Summe zum Nullvektor', () => {
    const f1 = [120, 50];
    const f2 = [-40, 90];
    const f = koord('6', 'f', 2);
    expect(f).toEqual([f1[0]! + f2[0]!, f1[1]! + f2[1]!]);
    const f3 = koord('6', 'g', 2);
    expect(f.map((x, i) => x + f3[i]!)).toEqual([0, 0]);
  });
  it('Aufgabe 7: Preisvektoren, auf Cent gerundet nachgerechnet', () => {
    const p = [2.4, 1.1, 3.5];
    const q = [2.6, 0.9, 3.4];
    const cent = (x: number) => Math.round(x * 100) / 100;
    expect(koord('7', 'e', 3).map(cent)).toEqual(p.map((x) => cent(x * 1.1)));
    expect(koord('7', 'e', 3)).toEqual([2.64, 1.21, 3.85]);
    expect(koord('7', 'u', 3).map(cent)).toEqual(q.map((x, i) => cent(x - p[i]!)));
  });
  it('Aufgabe 8: Vielfache von (−4 | 6)', () => {
    expect(koord('8', 'a', 2)).toEqual([2.5 * -4, 2.5 * 6]);
    expect(koord('8', 'b', 2)).toEqual([-0.5 * -4, -0.5 * 6]);
  });
  it('Aufgabe 9: 2a − 3b im Raum', () => {
    const a = [1, 2, -1];
    const b = [0, -3, 4];
    expect(koord('9', 'k', 3)).toEqual(a.map((x, i) => 2 * x - 3 * b[i]!));
  });
  it('Aufgabe 10: Gesamtflug und Zielpunkt der Drohne, Bild passt', () => {
    const a = [-2, 1, 0];
    const v1 = [3, -2, 1];
    const v2 = [1, 3, 2];
    const g = v1.map((x, i) => x + v2[i]!);
    expect(koord('10', 'g', 3)).toEqual(g);
    expect(koord('10', 'z', 3)).toEqual(a.map((x, i) => x + g[i]!));
    const l = B.aufgDrohne(true).linien!;
    expect(diff(l[0]!.von, l[0]!.bis)).toEqual(v1);
    expect(diff(l[1]!.von, l[1]!.bis)).toEqual(v2);
    expect(l[2]!.bis).toEqual(koord('10', 'z', 3));
  });
  it('Aufgabe 11: D ergänzt das Parallelogramm, AB = DC und AD = BC', () => {
    const A = [-1, 1];
    const Bp = [4, 2];
    const C = [6, 5];
    const bc = koord('11', 'b', 2);
    expect(bc).toEqual(diff(Bp, C));
    const d = koord('11', 'd', 2);
    expect(diff(A, Bp)).toEqual(diff(d, C));
    expect(diff(A, d)).toEqual(bc);
    expect(B.aufgParallelogramm(true).punkte!.find((p) => p.text === 'D')).toMatchObject({ x: d[0], y: d[1] });
  });
  it('Aufgabe 12: genau ein Vektor ist kollinear zu (3 | −6 | 9), unabhängig mit Unterdeterminanten geprüft', () => {
    const q = fragen.find((x) => x.nummer === '12')!;
    const u = [3, -6, 9];
    expect(q.optionen).toHaveLength(4);
    expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
    for (const o of q.optionen) expect(kreuzNull(u, spalteAus(o.text)), o.id).toBe(o.richtig);
    expect(texte(q.children).join(' ')).toContain('3\\\\-6\\\\9');
  });
  it('Aufgabe 13 und 14: Faktor und Parameter machen die Vektoren kollinear', () => {
    const r = wert('13', 'r');
    const k = wert('13', 'k');
    expect([r * 6, r * -4]).toEqual([9, k]);
    expect(kreuzNull([6, -4], [9, k])).toBe(true);
    const r3 = wert('14', 'r');
    const k3 = wert('14', 'k');
    const m3 = wert('14', 'm');
    expect([r3 * 2, r3 * -3, r3 * 5]).toEqual([-4, k3, m3]);
    expect(kreuzNull([2, -3, 5], [-4, k3, m3])).toBe(true);
  });
  it('Aufgabe 15: AB, AC und der Faktor, die drei Punkte liegen auf einer Geraden', () => {
    const A = [-2, 2, 1];
    const Bp = [0, 1, 2];
    const C = [2, 0, 3];
    const ab = koord('15', 'ab', 3);
    const ac = koord('15', 'ac', 3);
    expect(ab).toEqual(diff(A, Bp));
    expect(ac).toEqual(diff(A, C));
    const r = wert('15', 'r');
    expect(ab.map((x) => r * x)).toEqual(ac);
    expect(kreuzNull(ab, ac)).toBe(true);
    // B liegt zwischen A und C (Faktor zwischen 0 und 1 für AB/AC), sonst wäre die Aussage der Lösung falsch
    expect(r).toBeGreaterThan(1);
  });
  it('Aufgabe 16: nur AB und DC sind parallel, über Unterdeterminanten gerechnet', () => {
    const q = fragen.find((x) => x.nummer === '16')!;
    const A = [-2, -1];
    const Bp = [4, 1];
    const C = [3, 4];
    const Dp = [0, 3];
    const abDc = kreuzNull(diff(A, Bp), diff(Dp, C));
    const bcAd = kreuzNull(diff(Bp, C), diff(A, Dp));
    expect([abDc, bcAd]).toEqual([true, false]);
    expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
    expect(alsText(q.optionen.find((o) => o.richtig)!.text)).toContain('AB');
    expect(alsText(q.optionen.find((o) => o.richtig)!.text)).toContain('DC');
    expect(D.A_VIERECK.d).toEqual(Dp);
  });
  it('Die richtigen Antworten der Auswahlfragen stehen nicht alle an derselben Stelle', () => {
    const stellen = fragen.map((q) => q.optionen.findIndex((o) => o.richtig));
    expect(new Set(stellen).size).toBeGreaterThan(1);
  });
  it('jede Aufgabe hat Hilfen und eine Lösung, jede falsche Antwort eine Rückmeldung', () => {
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(1);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(1);
    }
    for (const q of fragen) for (const o of q.optionen) expect(alsText(o.rueckmeldung).length, `${q.nummer}${o.id}`).toBeGreaterThan(20);
  });
  it('die Zahlen im Text der Aufgaben stimmen mit den Daten überein', () => {
    const tex = (nr: string) => texte(aufgaben.find((x) => x.nummer === nr)!.children).join(' ');
    expect(tex('6')).toContain('120\\\\50');
    expect(tex('7')).toContain('2{,}40\\\\1{,}10\\\\3{,}50');
    expect(tex('9')).toContain('1\\\\2\\\\-1');
    expect(tex('10')).toContain('3\\\\-2\\\\1');
    expect(tex('10')).toContain('1\\\\3\\\\2');
    expect(tex('10')).toContain('A(-2\\,|\\,1\\,|\\,0)');
    expect(tex('15')).toContain('A(-2\\,|\\,2\\,|\\,1)');
    expect(tex('15')).toContain('C(2\\,|\\,0\\,|\\,3)');
  });
  it('das Beispiel der Zusammenfassung ist richtig gerechnet', () => {
    const z = D.ZUSAMMENFASSUNG;
    expect(z.summe).toEqual(z.a.map((x, i) => x + z.b[i]!));
    expect(z.differenz).toEqual(z.a.map((x, i) => x - z.b[i]!));
    expect(z.lk).toEqual(z.a.map((x, i) => 2 * x - z.b[i]!));
    expect(z.c).toEqual(z.a.map((x) => z.r * x));
    expect(kreuzNull(z.a, z.c)).toBe(true);
  });
});
