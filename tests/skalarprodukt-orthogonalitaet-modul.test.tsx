import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/skalarprodukt-orthogonalitaet/Bilder';
import * as D from '../content/modules/skalarprodukt-orthogonalitaet/daten';
import Modul from '../content/modules/skalarprodukt-orthogonalitaet/index';
import { Winkellabor, winkelBild3, winkelTeX, winkelZustand2 } from '../content/modules/skalarprodukt-orthogonalitaet/Labor';
import meta from '../content/modules/skalarprodukt-orthogonalitaet/meta.json';
import themen from '../content/themen.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { LABOR_BEREICH } from '../src/components/Laborbrett';
import type { MessbildDaten } from '../src/components/Messbild';
import { RAUM_GRENZE, bildpunkt, type Punkt3, type RaumBildSpec } from '../src/lib/schraegbild';
import { winkel } from '../src/lib/vektor';

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
const ORDNER = 'content/modules/skalarprodukt-orthogonalitaet';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const texteAusHtml = (html: string): string[] => [...html.matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<'));
const texte = (n: ReactNode): string[] => texteAusHtml(alsText(n));
const feld = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!;
const wert = (nr: string, id: string) => feld(nr, id).erwartet;
/** Unabhängig: Skalarprodukt, Betrag und Winkel ohne die Bibliothek. */
const punkt = (u: number[], v: number[]) => u.reduce((s, x, i) => s + x * v[i]!, 0);
const laenge = (v: number[]) => Math.sqrt(punkt(v, v));
const grad = (u: number[], v: number[]) => (Math.acos(Math.max(-1, Math.min(1, punkt(u, v) / (laenge(u) * laenge(v))))) * 180) / Math.PI;
const diff = (a: number[], b: number[]) => b.map((x, i) => x - a[i]!);
const nah = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;
const innen = (p: number[], b: number[]) => p[0]! >= b[0]! && p[0]! <= b[1]! && p[1]! >= b[2]! && p[1]! <= b[3]!;
/** Zahlen der ersten Spalte (pmatrix) in einem Knoten. */
const spalteAus = (n: ReactNode): number[] => {
  const m = /\\begin\{pmatrix\}(.*?)\\end\{pmatrix\}/.exec(texte(n).join(' '))!;
  return m[1]!.split('\\\\').map((z) => Number(z.replace(/\{,\}/g, '.')));
};

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Vektoren, hat vier Abschnitte, BPE 7.3', () => {
    expect(meta.id).toBe('skalarprodukt-orthogonalitaet');
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
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"skalarprodukt-orthogonalitaet"');
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
    for (const wort of ['Skalarprodukt', 'orthogonal', 'Winkel', 'Skalar', 's-Multiplikation', 'Pfeilklasse', 'Betrag', 'Gradmaß', 'Nullvektor', 'senkrecht']) expect(html, wort).toContain(wort);
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).not.toMatch(/\d\/\d/);
    expect(html).not.toMatch(/\bpi\b|Pi\b/);
    expect(html).not.toMatch(/[A-Z]\(-?\d+(,\d+)? ?\/ ?-?\d/);
  });
  it('das Erklären nimmt nichts vorweg: keine Winkelformel, kein Orthogonalitätskriterium, keine Regel für senkrechte Vektoren', () => {
    const tex = texteAusHtml(rendern('erklaeren')).join(' ');
    expect(tex.length).toBeGreaterThan(100);
    expect(tex).not.toContain('\\cos');
    expect(tex).not.toContain('\\arccos');
    expect(tex).not.toContain('\\Leftrightarrow');
    expect(tex).not.toMatch(/\\cdot\\vec\{b\}\s*=\s*0/);
    expect(tex).not.toContain('\\begin{pmatrix}y\\\\-x');
  });
  it('verweist auf die Module davor statt s-Multiplikation und Betrag zu wiederholen', () => {
    const quelle = readFileSync(`${ORDNER}/Erklaeren.tsx`, 'utf8');
    for (const m of ['rechnen-mit-vektoren', 'betrag-abstand-teilung']) expect(quelle).toContain(`modul="${m}"`);
  });
  it('Figuren, Vektorprodukt, Geraden und Ebenen kommen nicht vor (eigene Module)', () => {
    expect(rendern(null)).not.toMatch(/Rechteck|Raute|Trapez|Drachen|Dreieck|Parallelogramm|Innenwinkel|Vektorprodukt|Kreuzprodukt|Normalenvektor|Geradengleichung|Ebenengleichung|Hesse|Spurpunkt/);
  });
});

describe('Bilder', () => {
  const ebenenBilder: [string, MessbildDaten][] = [
    ['WINKELBEGRIFF', B.BILD_WINKELBEGRIFF], ['ORTHO', B.BILD_ORTHO], ['VORZEICHEN', B.BILD_VORZEICHEN], ['WINKEL', B.BILD_WINKEL], ['SENKRECHT', B.BILD_SENKRECHT], ['AUSWAHL', B.BILD_AUSWAHL],
    ['aufgWinkelE(false)', B.aufgWinkelE(false)], ['aufgWinkelE(true)', B.aufgWinkelE(true)],
  ];
  it('alle Punkte und Pfeile liegen im Bildausschnitt, jedes Bild hat eine Textalternative', () => {
    for (const [name, b] of ebenenBilder) {
      for (const p of b.punkte ?? []) expect(innen([p.x, p.y], b.bereich), `${name} Punkt`).toBe(true);
      for (const a of b.pfeile ?? []) {
        expect(innen(a.von, b.bereich), `${name} von`).toBe(true);
        expect(innen(a.bis, b.bereich), `${name} bis`).toBe(true);
      }
      expect(b.beschreibung.length, name).toBeGreaterThan(40);
    }
  });
  const richtung = (b: MessbildDaten) => b.pfeile!.map((p) => diff(p.von, p.bis));
  it('Orthogonalitätsbild: a ⊥ b (Skalarprodukt 0), a und c nicht', () => {
    const [a, b, c] = richtung(B.BILD_ORTHO);
    expect(punkt(a!, b!)).toBe(0);
    expect(punkt(a!, c!)).toBe(10);
    expect(Math.abs(Math.atan2(a![0]! * b![1]! - a![1]! * b![0]!, punkt(a!, b!)))).toBeCloseTo(Math.PI / 2, 9);
  });
  it('Vorzeichenbild: spitz, rechtwinklig, stumpf stimmen mit dem Skalarprodukt und dem Winkel überein', () => {
    const [a, b1, b2, b3] = richtung(B.BILD_VORZEICHEN);
    expect([punkt(a!, b1!), punkt(a!, b2!), punkt(a!, b3!)]).toEqual([7, 0, -10]);
    expect(grad(a!, b1!)).toBeLessThan(90);
    expect(nah(grad(a!, b2!), 90, 1e-9)).toBe(true);
    expect(grad(a!, b3!)).toBeGreaterThan(90);
  });
  it('Winkelbild: Winkel von 45°, Skalarprodukt 6, Beträge 2 mal Wurzel 2 und 3, Kosinus 1 durch Wurzel 2', () => {
    const [a, b] = richtung(B.BILD_WINKEL);
    expect(punkt(a!, b!)).toBe(6);
    expect(nah(laenge(a!), 2 * Math.SQRT2)).toBe(true);
    expect(laenge(b!)).toBe(3);
    expect(nah(grad(a!, b!), 45)).toBe(true);
    expect(nah(punkt(a!, b!) / (laenge(a!) * laenge(b!)), 1 / Math.SQRT2)).toBe(true);
    // Winkel über die Richtungen der Pfeile
    expect(nah((Math.atan2(a![1]!, a![0]!) - Math.atan2(b![1]!, b![0]!)) * (180 / Math.PI), 45)).toBe(true);
  });
  it('Senkrechtbild: n = (y | −x) ist orthogonal und gleich lang', () => {
    const [a, n] = richtung(B.BILD_SENKRECHT);
    expect(n).toEqual([a![1], -a![0]!]);
    expect(punkt(a!, n!)).toBe(0);
    expect(laenge(a!)).toBe(laenge(n!));
    const [a2, n2] = richtung(B.BILD_AUSWAHL);
    expect(punkt(a2!, n2!)).toBe(0);
  });
  it('Winkelbegriff: beide Pfeile beginnen im selben Punkt, der Winkel ist spitz', () => {
    const [a, b] = B.BILD_WINKELBEGRIFF.pfeile!;
    expect(a!.von).toEqual(b!.von);
    expect(grad(diff(a!.von, a!.bis), diff(b!.von, b!.bis))).toBeLessThan(90);
  });
  it('Raumbilder: senkrechte Vektoren, Winkel 70,53°; kein Punkt liegt im Schrägbild auf einer Achse, alle Bildpunkte verschieden', () => {
    const l = B.RAUM_SENKRECHT.linien!;
    const [a, n, m] = l.map((x) => diff(x.von, x.bis));
    expect(punkt(a!, n!)).toBe(0);
    expect(punkt(a!, m!)).toBe(0);
    const w = B.aufgWinkelR.linien!.map((x) => diff(x.von, x.bis));
    expect(nah(grad(w[0]!, w[1]!), 70.53, 0.005)).toBe(true);
    for (const s of [B.RAUM_SENKRECHT, B.aufgWinkelR] as RaumBildSpec[]) {
      const bilder = [[0, 0, 0] as Punkt3, ...s.punkte!.map((p) => p.p)].map((p) => bildpunkt(p));
      for (const [x, y] of bilder.slice(1)) {
        expect(x).not.toBe(0);
        expect(y).not.toBe(0);
        expect(x).not.toBe(y);
      }
      expect(new Set(bilder.map(String)).size).toBe(bilder.length);
      for (const p of s.punkte!) for (const x of p.p) expect(Math.abs(x)).toBeLessThanOrEqual(RAUM_GRENZE);
    }
  });
});

describe('Labor', () => {
  const g2 = Array.from({ length: 2 * D.LABOR_GRENZE_EBENE + 1 }, (_, i) => i - D.LABOR_GRENZE_EBENE);
  it('Winkellabor in der Ebene: Pfeile gleich den Vektoren, Winkel gegen die Richtungen der Pfeile geprüft, Vorzeichen des Skalarprodukts', () => {
    let n = 0;
    for (const a1 of g2) for (const a2 of [-6, -2, 0, 3, 6]) for (const b1 of [-5, 0, 4]) for (const b2 of [-4, 1, 6]) {
      const a = [a1, a2];
      const b = [b1, b2];
      const z = winkelZustand2(a, b);
      expect(z.pfeile[1]!.bis).toEqual(a);
      expect(z.pfeile[0]!.bis).toEqual(b);
      expect(z.pfeile[0]!.breite).toBeGreaterThan(z.pfeile[1]!.breite);
      for (const p of z.punkte) expect(innen(p.p, LABOR_BEREICH)).toBe(true);
      const w = winkel(a, b);
      if (laenge(a) === 0 || laenge(b) === 0) expect(w).toBeNull();
      else {
        let d = Math.abs(Math.atan2(a2, a1) - Math.atan2(b2, b1)) * (180 / Math.PI);
        if (d > 180) d = 360 - d;
        expect(nah(w!, d, 1e-6)).toBe(true);
        const sp = a1 * b1 + a2 * b2;
        expect(Math.sign(sp) || 0).toBe(w! < 90 - 1e-9 ? 1 : w! > 90 + 1e-9 ? -1 : 0);
      }
      n++;
    }
    expect(n).toBeGreaterThan(400);
  });
  it('Winkellabor im Raum: bleibt im Koordinatensystem, Winkel stimmt mit der Formel überein', () => {
    for (const a of [[2, -1, 2], [-4, 4, 0], [1, 1, 1]]) for (const b of [[0, 3, 4], [4, 4, -4], [-1, -1, -1], [2, -1, 2]]) {
      const s = winkelBild3(a, b);
      for (const p of s.punkte!) for (const x of p.p) expect(Math.abs(x)).toBeLessThanOrEqual(RAUM_GRENZE);
      expect(nah(winkel(a, b)!, grad(a, b), 1e-6)).toBe(true);
    }
  });
  it('Gradtext und Startwerte', () => {
    expect(winkelTeX(70.5288)).toBe('70{,}53^{\\circ}');
    expect(winkelTeX(90)).toBe('90^{\\circ}');
    expect(punkt(D.WINKEL_START.a2, D.WINKEL_START.b2)).toBe(7);
    expect(winkel(D.WINKEL_START.a2, D.WINKEL_START.b2)!).toBeLessThan(90);
  });
  it('rendert mit Schalter, Reglern und Legende, die Rechnung ist zunächst verborgen', () => {
    const html = renderToStaticMarkup(<Winkellabor />);
    expect(html).toContain('aria-label="Ebene oder Raum wählen"');
    expect(html.match(/type="range"/g)).toHaveLength(4);
    expect(html).toContain('aria-label="Legende"');
    expect(html).not.toContain('formel-fehler');
    expect(texteAusHtml(html).join(' ')).not.toContain('\\cos');
  });
});

describe('Aufgaben und Auswahlfragen, unabhängig gerechnet', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('die Nummern', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '2', '4', '5', '7', '8', '9', '11', '12', '13', '14']);
    expect(fragen.map((q) => q.nummer)).toEqual(['3', '6', '10']);
  });
  it('Aufgaben 1 und 2: Skalarprodukte von Hand, die Aufgabentexte nennen die Vektoren', () => {
    expect([wert('1', 'p1'), wert('1', 'p2'), wert('1', 'p3')]).toEqual([-3 * 2 + 5 * 4, 4 * 3 + -2 * 6, -2 * 5 + 7 * 1]);
    expect([wert('2', 'p1'), wert('2', 'p2'), wert('2', 'p3')]).toEqual([1 * 3 + -4 * 1 + 2 * 5, 1 * 2 + 2 * -1 + 2 * 0, 5 * 3 + 0 * 4 + -1 * 2]);
    const t1 = texte(aufgaben.find((a) => a.nummer === '1')!.children).join(' ');
    expect(t1).toContain('-3\\\\5');
    expect(t1).toContain('4\\\\-2');
    expect(wert('1', 'p2')).toBe(0);
  });
  it('Aufgabe 3: genau eine richtige Antwort, nur die s-Multiplikation ergibt einen Vektor', () => {
    const q = fragen.find((x) => x.nummer === '3')!;
    expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
    expect(texte(q.optionen.find((o) => o.richtig)!.text)[0]).toContain('5\\cdot\\vec{a}');
  });
  it('Aufgaben 4 und 5: Der Parameter macht das Skalarprodukt zu 0', () => {
    expect(6 * 4 + wert('4', 'k') * -3).toBe(0);
    expect(2 * 6 + -3 * 3 + wert('5', 'k') * 3).toBe(0);
  });
  it('Aufgabe 6: genau ein Vektor ist orthogonal zu (5 | −2), die anderen nicht', () => {
    const q = fragen.find((x) => x.nummer === '6')!;
    expect(q.optionen).toHaveLength(4);
    expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
    for (const o of q.optionen) expect(punkt([5, -2], spalteAus(o.text)) === 0, o.id).toBe(o.richtig);
    // die Erklärung zeigt dazu ein Bild
    expect(alsText(q.erklaerung)).toContain('funktionsgraph');
  });
  it('Aufgabe 7: die senkrechten Vektoren im Raum', () => {
    expect(punkt([2, -1, 3], [1, wert('7', 'n2'), 0])).toBe(0);
    expect(punkt([2, -1, 3], [3, 0, wert('7', 'm3')])).toBe(0);
  });
  it('Aufgaben 8 und 9: Skalarprodukt und Winkel von Hand, auf zwei Stellen mit Toleranz', () => {
    expect(wert('8', 'sp')).toBe(5 * 4 + 12 * -3);
    expect(Math.abs(grad([5, 12], [4, -3]) - wert('8', 'w'))).toBeLessThanOrEqual(feld('8', 'w').toleranz!);
    expect(grad([5, 12], [4, -3])).toBeGreaterThan(90);
    expect(wert('9', 'sp')).toBe(2 * 0 + -1 * 3 + 2 * 4);
    expect(Math.abs(grad([2, -1, 2], [0, 3, 4]) - wert('9', 'w'))).toBeLessThanOrEqual(feld('9', 'w').toleranz!);
    expect(laenge([2, -1, 2])).toBe(3);
    expect(laenge([0, 3, 4])).toBe(5);
    // Rundung auf zwei Stellen stimmt
    expect(wert('8', 'w')).toBe(Math.round(grad([5, 12], [4, -3]) * 100) / 100);
    expect(wert('9', 'w')).toBe(Math.round(grad([2, -1, 2], [0, 3, 4]) * 100) / 100);
  });
  it('Aufgabe 10: Ein negatives Skalarprodukt gehört zu einem stumpfen Winkel (über den Kosinus geprüft)', () => {
    const q = fragen.find((x) => x.nummer === '10')!;
    expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
    expect(alsText(q.optionen.find((o) => o.richtig)!.text)).toContain('stumpf');
    for (const [u, v] of [[[1, 0], [-3, 1]], [[2, 2], [-5, 0]], [[1, 1, 1], [-2, 0, 0]]] as [number[], number[]][]) {
      expect(punkt(u, v)).toBeLessThan(0);
      expect(grad(u, v)).toBeGreaterThan(90);
    }
  });
  it('Aufgabe 11: 45° über den Kosinus 1 durch Wurzel 2', () => {
    expect(nah(grad([2, 2], [3, 0]), wert('11', 'w'))).toBe(true);
    expect(nah(punkt([2, 2], [3, 0]) / (laenge([2, 2]) * 3), Math.SQRT1_2)).toBe(true);
  });
  it('Aufgabe 12: a · a ist das Quadrat des Betrags', () => {
    expect(wert('12', 'q')).toBe(2 * 2 + -3 * -3 + 6 * 6);
    expect(wert('12', 'b')).toBe(Math.sqrt(wert('12', 'q')));
    expect(wert('12', 'b')).toBe(laenge([2, -3, 6]));
  });
  it('Aufgaben 13 und 14: Rechnungsbetrag und Arbeit, auf Cent gerundet', () => {
    expect(Math.round(wert('13', 'e') * 100)).toBe(Math.round((12 * 0.85 + 8 * 1.2 + 5 * 2.4) * 100));
    expect(Math.round(wert('13', 'e') * 100)).toBe(3180);
    expect(wert('14', 'w')).toBe(40 * 5 + 30 * -2);
  });
  it('Auswahlfragen: Die richtigen Antworten stehen nicht alle an derselben Stelle, jede Antwort hat eine Rückmeldung', () => {
    expect(new Set(fragen.map((q) => q.optionen.findIndex((o) => o.richtig))).size).toBeGreaterThan(1);
    for (const q of fragen) for (const o of q.optionen) expect(alsText(o.rueckmeldung).length, `${q.nummer}${o.id}`).toBeGreaterThan(20);
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(1);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(1);
    }
  });
  it('das Beispiel der Zusammenfassung ist richtig gerechnet', () => {
    const z = D.ZUSAMMENFASSUNG;
    expect(punkt(z.a, z.b)).toBe(z.skalar);
    expect(laenge(z.a)).toBe(z.betragA);
    expect(laenge(z.b)).toBe(z.betragB);
    expect(nah(grad(z.a, z.b), z.winkel, 0.005)).toBe(true);
    expect(nah(Math.cos((z.winkel * Math.PI) / 180), 20 / 21, 1e-4)).toBe(true);
  });
  it('das Beispiel der Erklärung: Skalarprodukt −3 und Rechnungsbetrag 26,90', () => {
    expect(punkt(D.BEISPIEL.a, D.BEISPIEL.b)).toBe(-3);
    expect(Math.round((3 * 2.4 + 2 * 1.1 + 5 * 3.5) * 100)).toBe(2690);
  });
});
