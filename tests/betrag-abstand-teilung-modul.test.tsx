import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/betrag-abstand-teilung/Bilder';
import * as D from '../content/modules/betrag-abstand-teilung/daten';
import Modul from '../content/modules/betrag-abstand-teilung/index';
import { Abstandslabor, Teilungslabor, abstandBild3, abstandZustand2, betragTeX, teilungBild3, teilungZustand2, zahlTeX } from '../content/modules/betrag-abstand-teilung/Labor';
import meta from '../content/modules/betrag-abstand-teilung/meta.json';
import themen from '../content/themen.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { LABOR_BEREICH } from '../src/components/Laborbrett';
import type { MessbildDaten } from '../src/components/Messbild';
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
const ORDNER = 'content/modules/betrag-abstand-teilung';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const feld = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!;
const wert = (nr: string, id: string) => feld(nr, id).erwartet;
const koord = (nr: string, praefix: string, n: number): number[] => Array.from({ length: n }, (_, i) => wert(nr, `${praefix}${i + 1}`));
const texte = (n: ReactNode): string[] => [...alsText(n).matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<'));
const diff = (a: number[], b: number[]) => b.map((x, i) => x - a[i]!);
const laenge = (v: number[]) => Math.hypot(...v);
const nah = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;
const nahV = (u: number[], v: number[], eps = 1e-9) => u.length === v.length && u.every((x, i) => nah(x, v[i]!, eps));
const innen = (p: number[], b: number[]) => p[0]! >= b[0]! && p[0]! <= b[1]! && p[1]! >= b[2]! && p[1]! <= b[3]!;

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Vektoren, hat vier Abschnitte, BPE 7.2', () => {
    expect(meta.id).toBe('betrag-abstand-teilung');
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
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"betrag-abstand-teilung"');
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
    for (const wort of ['Betrag', 'Einheitsvektor', 'Abstand', 'Mittelpunkt', 'Verhältnis', 'Verbindungsvektor', 'Ortsvektor', 'Pfeilklasse', 'Schrägbild']) expect(html, wort).toContain(wort);
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).not.toMatch(/\d\/\d/);
    expect(html).not.toMatch(/[A-Z]\(-?\d+(,\d+)? ?\/ ?-?\d/);
  });
  it('das Erklären nimmt nichts vorweg: keine allgemeine Formel für den Raum, keine Formel für den Teilpunkt oder den Einheitsvektor', () => {
    const html = rendern('erklaeren');
    const tex = [...html.matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]).join(' ');
    expect(tex.length).toBeGreaterThan(100);
    expect(tex).not.toContain('a_3');
    expect(tex).not.toContain('m+n');
    expect(tex).not.toMatch(/\\frac\{1\}\{\|/);
    expect(html).not.toMatch(/Einheitsvektor in derselben Richtung ist/);
  });
  it('verweist auf die Module davor statt Rechnen, Verbindungsvektor und Ortsvektor zu wiederholen', () => {
    const quelle = readFileSync(`${ORDNER}/Erklaeren.tsx`, 'utf8');
    for (const m of ['rechnen-mit-vektoren', 'punkte-vektoren-ebene', 'punkte-vektoren-raum']) expect(quelle).toContain(`modul="${m}"`);
    expect(rendern(null)).not.toMatch(/Zielpunkt minus Ausgangspunkt/);
  });
  it('Skalarprodukt, Winkel, Geraden und Ebenen kommen nicht vor (eigene Module)', () => {
    expect(rendern(null)).not.toMatch(/Skalarprodukt|orthogonal|senkrecht aufeinander|Winkel|Geradengleichung|Parameter|Normalenvektor|Lotfußpunkt|Ebenengleichung|Abstand von Punkt und Gerade/);
  });
});

describe('Bilder', () => {
  const ebenenBilder: [string, MessbildDaten][] = [
    ['BILD_ERKLAERT', B.BILD_ERKLAERT], ['BILD_TEILUNG', B.BILD_TEILUNG], ['BILD_EINHEIT', B.BILD_EINHEIT], ['BILD_MITTE', B.BILD_MITTE], ['BILD_BETRAG', B.BILD_BETRAG],
    ['aufgAbstandE(false)', B.aufgAbstandE(false)], ['aufgAbstandE(true)', B.aufgAbstandE(true)], ['aufgMitteE(false)', B.aufgMitteE(false)], ['aufgMitteE(true)', B.aufgMitteE(true)],
    ['aufgTeilungE(false)', B.aufgTeilungE(false)], ['aufgTeilungE(true)', B.aufgTeilungE(true)],
  ];
  it('alle Punkte, Pfeile und Hilfslinien der Bilder in der Ebene liegen im Ausschnitt, jedes Bild hat eine Textalternative', () => {
    for (const [name, b] of ebenenBilder) {
      for (const p of b.punkte ?? []) expect(innen([p.x, p.y], b.bereich), `${name} Punkt`).toBe(true);
      for (const a of [...(b.pfeile ?? []), ...(b.strecken ?? [])]) {
        expect(innen(a.von, b.bereich), `${name} von`).toBe(true);
        expect(innen(a.bis, b.bereich), `${name} bis`).toBe(true);
      }
      expect(b.beschreibung.length, name).toBeGreaterThan(40);
    }
  });
  it('Erklärbild: Pfeil (3 | 4) mit rechtwinkligem Dreieck, Länge 5', () => {
    const b = B.BILD_ERKLAERT;
    const pf = b.pfeile![0]!;
    expect(diff(pf.von, pf.bis)).toEqual([3, 4]);
    const [h1, h2] = b.strecken!;
    expect(diff(h1!.von, h1!.bis)).toEqual([3, 0]);
    expect(diff(h2!.von, h2!.bis)).toEqual([0, 4]);
    expect(laenge(diff(pf.von, pf.bis))).toBe(5);
  });
  it('Betragsbild: Katheten 5 und 12, Pfeil der Länge 13', () => {
    const b = B.BILD_BETRAG;
    const pf = b.pfeile![0]!;
    expect(laenge(diff(pf.von, pf.bis))).toBe(13);
    expect(b.strecken!.map((s) => laenge(diff(s.von, s.bis)))).toEqual([5, 12]);
  });
  it('Einheitsbild: beide Pfeile in derselben Richtung, Längen 5 und 1', () => {
    const [v, e] = B.BILD_EINHEIT.pfeile!.map((p) => diff(p.von, p.bis));
    expect(laenge(v!)).toBe(5);
    expect(nah(laenge(e!), 1)).toBe(true);
    expect(nah(v![0]! * e![1]!, v![1]! * e![0]!)).toBe(true);
    expect(v![0]! * e![0]! + v![1]! * e![1]!).toBeGreaterThan(0);
  });
  it('Mittelpunktbild: AM ist die Hälfte von AB, M ist der Mittelwert von A und B, der Ortsvektor endet in M', () => {
    const { a, b, m } = D.MITTE_E;
    expect(m).toEqual([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]);
    const [ab, am, om] = B.BILD_MITTE.pfeile!.map((p) => diff(p.von, p.bis));
    expect(am).toEqual(ab!.map((x) => x / 2));
    expect(om).toEqual(m);
  });
  it('Teilungsbild: AT : TB = 2 : 3 über die Längen, T liegt auf der Strecke AB', () => {
    const [at, tb] = B.BILD_TEILUNG.pfeile!.map((p) => diff(p.von, p.bis));
    expect(nah(laenge(at!) * 3, laenge(tb!) * 2)).toBe(true);
    const ab = diff(D.TEILUNG_E.a, D.TEILUNG_E.b);
    expect(at!.map((x, i) => x + tb![i]!)).toEqual(ab);
    expect(nahV(at!, ab.map((x) => (2 / 5) * x))).toBe(true);
  });
  it('Quader im Raum: Grundflächendiagonale Wurzel 5, Raumdiagonale 3, Hilfsweg 2, 1, 2', () => {
    const l = B.RAUM_QUADER.linien!;
    const weg = l.slice(0, 3).map((x) => laenge(diff(x.von, x.bis)));
    expect(weg).toEqual([2, 1, 2]);
    const grund = l[3]!;
    const raum = l[4]!;
    expect(nah(laenge(diff(grund.von, grund.bis)), Math.sqrt(5))).toBe(true);
    expect(nah(laenge(diff(raum.von, raum.bis)), 3)).toBe(true);
    expect(nah(Math.hypot(Math.sqrt(5), 2), 3)).toBe(true);
  });
  it('Raumbilder: kein Punkt liegt im Schrägbild auf einer Achse und alle Bildpunkte sind verschieden', () => {
    const spezifikationen: RaumBildSpec[] = [B.aufgAbstandR(true), B.aufgMitteRBild(true), B.aufgEndpunktBild(true), B.aufgTeilungR(true), B.RAUM_QUADER];
    for (const s of spezifikationen) {
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

describe('Labore', () => {
  const g2 = Array.from({ length: 2 * D.LABOR_GRENZE_EBENE + 1 }, (_, i) => i - D.LABOR_GRENZE_EBENE);
  it('Abstandslabor in der Ebene: Der Pfeil hat die Länge des Abstands, der Einheitsvektor die Länge 1, das Hilfsdreieck ist rechtwinklig', () => {
    let n = 0;
    for (const a1 of g2) for (const a2 of [-6, -1, 3]) for (const b1 of [-5, 0, 6]) for (const b2 of g2) {
      const a = [a1, a2];
      const b = [b1, b2];
      const z = abstandZustand2(a, b, true);
      const [h1, h2, ab, e] = z.pfeile;
      const d = Math.sqrt((b1 - a1) ** 2 + (b2 - a2) ** 2);
      expect(nah(laenge(diff(ab!.von, ab!.bis)), d)).toBe(true);
      expect(nah(laenge(diff(h1!.von, h1!.bis)) ** 2 + laenge(diff(h2!.von, h2!.bis)) ** 2, d * d)).toBe(true);
      expect(h1!.ohneSpitze && h2!.ohneSpitze && h1!.gestrichelt).toBe(true);
      if (d > 0) {
        expect(e!.sichtbar).toBe(true);
        expect(nah(laenge(diff(e!.von, e!.bis)), 1)).toBe(true);
        expect(nah(diff(e!.von, e!.bis)[0]! * (b2 - a2), diff(e!.von, e!.bis)[1]! * (b1 - a1))).toBe(true);
      } else expect(e!.sichtbar).toBe(false);
      for (const p of z.punkte) expect(innen(p.p, LABOR_BEREICH)).toBe(true);
      n++;
    }
    expect(n).toBeGreaterThan(500);
  });
  it('Abstandslabor im Raum: Pfeil, Weg in drei Schritten und Einheitsvektor bleiben im Koordinatensystem', () => {
    for (const a of [[-4, -4, -4], [0, 0, 0], [4, -2, 3]]) for (const b of [[4, 4, 4], [1, 2, 3], [-4, 4, -4], [4, -2, 3]]) {
      const s = abstandBild3(a, b, true);
      const d = Math.sqrt(a.reduce((q, x, i) => q + (b[i]! - x) ** 2, 0));
      const pfeile = s.linien!.filter((l) => l.pfeil);
      expect(nah(laenge(diff(pfeile[0]!.von, pfeile[0]!.bis)), d)).toBe(true);
      if (d > 0) expect(nah(laenge(diff(pfeile[1]!.von, pfeile[1]!.bis)), 1)).toBe(true);
      const kanten = s.linien!.filter((l) => l.gestrichelt).map((l) => laenge(diff(l.von, l.bis)));
      expect(nah(kanten.reduce((q, x) => q + x * x, 0), d * d)).toBe(true);
      for (const l of s.linien!) for (const x of [...l.von, ...l.bis]) expect(Math.abs(x)).toBeLessThanOrEqual(RAUM_GRENZE + 1);
    }
  });
  it('Teilungslabor: AT : TB = m : n über die Längen, T liegt zwischen A und B, in Ebene und Raum', () => {
    for (const [a, b] of [[[-4, -2], [5, 4]], [[6, -6], [-6, 6]], [[0, 0], [3, 3]]] as [number[], number[]][]) for (let m = 1; m <= 5; m++) for (let n = 1; n <= 5; n++) {
      const z = teilungZustand2(a, b, m, n);
      const [at, tb] = z.pfeile.map((p) => diff(p.von, p.bis));
      expect(nah(laenge(at!) * n, laenge(tb!) * m, 1e-9)).toBe(true);
      expect(nahV(at!.map((x, i) => x + tb![i]!), diff(a, b))).toBe(true);
      for (const p of z.punkte) expect(innen(p.p, LABOR_BEREICH)).toBe(true);
    }
    for (const [a, b] of [[[-4, -4, -4], [4, 4, 4]], [[3, -2, 1], [-1, 2, 4]]] as [number[], number[]][]) for (let m = 1; m <= 5; m++) for (let n = 1; n <= 5; n++) {
      const s = teilungBild3(a, b, m, n);
      const [at, tb] = s.linien!.map((l) => diff(l.von, l.bis));
      expect(nah(laenge(at!) * n, laenge(tb!) * m)).toBe(true);
      for (const p of s.punkte!) for (const x of p.p) expect(Math.abs(x)).toBeLessThanOrEqual(RAUM_GRENZE);
    }
    // Mittelpunkt bei m = n
    const z = teilungZustand2([-4, -2], [6, 4], 3, 3);
    expect(z.punkte[1]!.p).toEqual([1, 1]);
  });
  it('Zahl- und Betragsdarstellung: exakte oder gerundete Werte', () => {
    expect(zahlTeX(3)).toEqual({ tex: '3', exakt: true });
    expect(zahlTeX(2.5)).toEqual({ tex: '2{,}5', exakt: true });
    expect(zahlTeX(10 / 3).exakt).toBe(false);
    expect(zahlTeX(10 / 3).tex).toBe('3{,}33');
    expect(betragTeX([3, 4])).toBe('\\sqrt{25}=5');
    expect(betragTeX([2, 5])).toBe('\\sqrt{29}\\approx 5{,}39');
    expect(Object.is(parseFloat(zahlTeX(-0.0001).tex.replace('{,}', '.')), -0)).toBe(false);
  });
  it('die Labore rendern mit Schalter, Reglern und Legende', () => {
    const a = renderToStaticMarkup(<Abstandslabor />);
    const t = renderToStaticMarkup(<Teilungslabor />);
    for (const html of [a, t]) {
      expect(html).toContain('aria-label="Ebene oder Raum wählen"');
      expect(html).toContain('aria-label="Legende"');
      expect(html).not.toContain('formel-fehler');
    }
    expect(a.match(/type="range"/g)).toHaveLength(4);
    expect(t.match(/type="range"/g)).toHaveLength(6);
    expect(a).toContain('Einheitsvektor zeigen');
  });
});

describe('Aufgaben und Auswahlfragen, unabhängig gerechnet', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('die Nummern', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '2', '4', '5', '6', '7', '8', '9', '10', '11', '12', '14', '15']);
    expect(fragen.map((q) => q.nummer)).toEqual(['3', '13', '16']);
  });
  it('Aufgaben 1 und 2: Beträge, Rundung auf zwei Stellen mit Toleranz', () => {
    expect(wert('1', 'a')).toBe(Math.hypot(-5, 12));
    expect(nah(wert('1', 'b'), Math.round(Math.sqrt(2 * 2 + 5 * 5) * 100) / 100)).toBe(true);
    expect(Math.abs(Math.sqrt(29) - wert('1', 'b'))).toBeLessThanOrEqual(feld('1', 'b').toleranz!);
    expect(wert('2', 'a')).toBe(Math.hypot(4, -4, 2));
    expect(Math.abs(Math.sqrt(38) - wert('2', 'b'))).toBeLessThanOrEqual(feld('2', 'b').toleranz!);
    expect(nah(wert('2', 'b'), 6.16)).toBe(true);
  });
  it('Aufgabe 3: genau eine richtige Antwort, 10 = |−2| · 5, kein negativer Betrag als richtig', () => {
    const q = fragen.find((x) => x.nummer === '3')!;
    expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
    expect(texte(q.optionen.find((o) => o.richtig)!.text)).toEqual(['10']);
    expect(Math.abs(-2) * 5).toBe(10);
    expect(q.optionen.some((o) => texte(o.text)[0] === '-10' && !o.richtig)).toBe(true);
  });
  it('Aufgabe 4: Verbindungsvektor und Abstand aus den Punkten, das Kontrollbild zeigt dieselben Punkte', () => {
    const P = [-2, 1];
    const Q = [4, -7];
    expect(koord('4', 'v', 2)).toEqual(diff(P, Q));
    expect(wert('4', 'd')).toBe(Math.sqrt((4 - -2) ** 2 + (-7 - 1) ** 2));
    const b = B.aufgAbstandE(true);
    expect(b.punkte!.map((p) => [p.x, p.y])).toEqual([P, Q]);
    expect(b.pfeile![0]!.von).toEqual(P);
    expect(b.pfeile![0]!.bis).toEqual(Q);
    expect(b.strecken!.map((s) => laenge(diff(s.von, s.bis)))).toEqual([6, 8]);
  });
  it('Aufgabe 5: Verbindungsvektor und Abstand im Raum, Bild stimmt', () => {
    const A = [-3, -2, -1];
    const Bp = [1, 2, 1];
    expect(koord('5', 'v', 3)).toEqual(diff(A, Bp));
    expect(wert('5', 'd')).toBe(Math.sqrt(16 + 16 + 4));
    const s = B.aufgAbstandR(true);
    expect(s.punkte!.map((p) => p.p)).toEqual([A, Bp]);
    const kanten = s.linien!.filter((l) => l.gestrichelt).map((l) => laenge(diff(l.von, l.bis)));
    expect(kanten).toEqual([4, 4, 2]);
  });
  it('Aufgaben 6 und 7: Einheitsvektoren haben den Betrag 1 und sind kollinear zu a', () => {
    const e6 = koord('6', 'e', 2);
    expect(nah(laenge(e6), 1)).toBe(true);
    expect(nahV(e6, [-6 / 10, 8 / 10])).toBe(true);
    const e7 = koord('7', 'e', 3);
    expect(nah(laenge(e7), 1)).toBe(true);
    expect(nahV(e7, [2 / 3, -1 / 3, 2 / 3])).toBe(true);
    for (const x of e7) expect(Math.abs(x - Math.round(x * 100) / 100)).toBeLessThanOrEqual(0.01);
    expect(feld('7', 'e1').toleranz).toBe(0.01);
  });
  it('Aufgabe 8: Vektoren der Länge 15 in und gegen die Richtung von (3 | 4)', () => {
    const g = koord('8', 'g', 2);
    const h = koord('8', 'h', 2);
    expect(nah(laenge(g), 15)).toBe(true);
    expect(nah(laenge(h), 15)).toBe(true);
    expect(g[0]! * 4).toBe(g[1]! * 3);
    expect(g[0]! * 3 + g[1]! * 4).toBeGreaterThan(0);
    expect(h).toEqual(g.map((x) => -x));
  });
  it('Aufgabe 9: Luftlinie und Flugstrecke, Betrag der Summe ist kleiner als die Summe der Beträge', () => {
    const v = [[1, -2, 4], [-2, -3, 1], [3, -1, 4]];
    const summe = [0, 1, 2].map((i) => v[0]![i]! + v[1]![i]! + v[2]![i]!);
    expect(summe).toEqual([2, -6, 9]);
    expect(wert('9', 'luft')).toBe(Math.sqrt(4 + 36 + 81));
    const weg = v.map((x) => Math.sqrt(x.reduce((q, y) => q + y * y, 0))).reduce((q, y) => q + y, 0);
    expect(Math.abs(weg - wert('9', 'weg'))).toBeLessThanOrEqual(feld('9', 'weg').toleranz!);
    expect(wert('9', 'weg')).toBeGreaterThan(wert('9', 'luft'));
  });
  it('Aufgaben 10 und 11: Mittelpunkte, über den Mittelwert gerechnet, das Kontrollbild zeigt M', () => {
    expect(koord('10', 'm', 2)).toEqual([(-3 + 7) / 2, (5 + -1) / 2]);
    const b = B.aufgMitteE(true);
    expect(b.punkte!.find((p) => p.text === 'M')).toMatchObject({ x: 2, y: 2 });
    const [ab, am] = b.pfeile!.map((p) => diff(p.von, p.bis));
    expect(am).toEqual(ab!.map((x) => x / 2));
    expect(koord('11', 'm', 3)).toEqual([(-2 + 4) / 2, (2 + 0) / 2, (1 + 3) / 2]);
    const l = B.aufgMitteRBild(true).linien!;
    expect(diff(l[0]!.von, l[0]!.bis)).toEqual(diff(l[1]!.von, l[1]!.bis));
  });
  it('Aufgabe 12: B aus A und M, M ist der Mittelpunkt von AB', () => {
    const A = [1, -4, -3];
    const M = [-1, -1, -2];
    const Bp = koord('12', 'b', 3);
    expect(Bp.map((x, i) => (A[i]! + x) / 2)).toEqual(M);
    const l = B.aufgEndpunktBild(true).linien!;
    expect(diff(l[0]!.von, l[0]!.bis)).toEqual(diff(l[1]!.von, l[1]!.bis));
    expect(l[1]!.bis).toEqual(Bp);
  });
  it('Aufgabe 13: genau eine richtige Antwort, der Mittelwert, die Vektorlänge der falschen Antworten stimmt nicht', () => {
    const q = fragen.find((x) => x.nummer === '13')!;
    expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
    expect(texte(q.optionen.find((o) => o.richtig)!.text)[0]).toContain('\\tfrac{1}{2}');
    expect(texte(q.optionen.find((o) => o.richtig)!.text)[0]).toContain('\\vec{a}+\\vec{b}');
    // gegen konkrete Werte: a = (1 | 2), b = (7 | 6)
    const a = [1, 2];
    const b = [7, 6];
    const kandidaten = {
      richtig: a.map((x, i) => (x + b[i]!) / 2),
      b: a.map((x, i) => (x - b[i]!) / 2),
      c: a.map((x, i) => x + b[i]! / 2),
      d: a.map((x, i) => (b[i]! - x) / 2),
    };
    expect(kandidaten.richtig).toEqual([4, 4]);
    for (const k of ['b', 'c', 'd'] as const) expect(kandidaten[k]).not.toEqual(kandidaten.richtig);
  });
  it('Aufgaben 14 und 15: Teilpunkte mit AT : TB = m : n über die Längen, Bilder stimmen', () => {
    const A = [-4, -1];
    const Bp = [6, 4];
    const T = koord('14', 't', 2);
    expect(nah(laenge(diff(A, T)) * 3, laenge(diff(T, Bp)) * 2)).toBe(true);
    expect(nahV(diff(A, T), diff(A, Bp).map((x) => (2 / 5) * x))).toBe(true);
    const b = B.aufgTeilungE(true);
    expect(b.punkte!.find((p) => p.text === 'T')).toMatchObject({ x: T[0], y: T[1] });
    const A3 = [2, -3, -4];
    const B3 = [-1, 3, 2];
    const P = koord('15', 'p', 3);
    expect(nah(laenge(diff(A3, P)) * 2, laenge(diff(P, B3)) * 1)).toBe(true);
    expect(nahV(diff(A3, P), diff(A3, B3).map((x) => x / 3))).toBe(true);
    const l = B.aufgTeilungR(true).linien!;
    expect(l[0]!.bis).toEqual(P);
  });
  it('Aufgabe 16: AT = drei Viertel AB bedeutet 3 : 1, die anderen Antworten sind falsch', () => {
    const q = fragen.find((x) => x.nummer === '16')!;
    expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
    expect(texte(q.optionen.find((o) => o.richtig)!.text)).toEqual(['3:1']);
    const A = [0, 0];
    const Bp = [8, 4];
    const T = A.map((x, i) => x + (3 / 4) * (Bp[i]! - x));
    expect(nah(laenge(diff(A, T)) * 1, laenge(diff(T, Bp)) * 3)).toBe(true);
  });
  it('Auswahlfragen: die richtigen Antworten stehen nicht alle an derselben Stelle, jede falsche Antwort hat eine Rückmeldung', () => {
    expect(new Set(fragen.map((q) => q.optionen.findIndex((o) => o.richtig))).size).toBeGreaterThan(1);
    for (const q of fragen) for (const o of q.optionen) expect(alsText(o.rueckmeldung).length, `${q.nummer}${o.id}`).toBeGreaterThan(20);
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(1);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(1);
    }
  });
  it('die Zahlen im Aufgabentext stimmen mit den Daten überein', () => {
    const tex = (nr: string) => texte(aufgaben.find((x) => x.nummer === nr)!.children).join(' ');
    expect(tex('1')).toContain('-5\\\\12');
    expect(tex('4')).toContain('P(-2\\,|\\,1)');
    expect(tex('5')).toContain('B(1\\,|\\,2\\,|\\,1)');
    expect(tex('9')).toContain('1\\\\-2\\\\4');
    expect(tex('14')).toContain('2:3');
    expect(tex('15')).toContain('1:2');
  });
  it('das Beispiel der Zusammenfassung ist richtig gerechnet', () => {
    const z = D.ZUSAMMENFASSUNG;
    expect(z.ab).toEqual(diff(z.a, z.b));
    expect(laenge(z.ab)).toBe(z.betrag);
    expect(nahV(z.einheit, z.ab.map((x) => x / 15))).toBe(true);
    expect(z.mitte).toEqual(z.a.map((x, i) => (x + z.b[i]!) / 2));
    expect(z.teil).toEqual(z.a.map((x, i) => x + (2 / 5) * (z.b[i]! - x)));
    expect(nah(laenge(diff(z.a, z.teil)) * 3, laenge(diff(z.teil, z.b)) * 2)).toBe(true);
    expect(laenge(diff(z.a, z.teil))).toBe(6);
    expect(laenge(diff(z.teil, z.b))).toBe(9);
  });
});
