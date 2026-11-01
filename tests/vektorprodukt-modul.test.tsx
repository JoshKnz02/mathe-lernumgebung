import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/vektorprodukt/Bilder';
import * as D from '../content/modules/vektorprodukt/daten';
import Modul from '../content/modules/vektorprodukt/index';
import { Vektorproduktlabor, bildFaktor, produktBild } from '../content/modules/vektorprodukt/Labor';
import meta from '../content/modules/vektorprodukt/meta.json';
import themen from '../content/themen.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { RAUM_BEREICH, RAUM_GRENZE, bildpunkt, normiert, raumLagen, sperrlinienRaum, x1ZahlMitte, type Punkt3, type RaumBildSpec } from '../src/lib/schraegbild';
import { kollinear, vektorprodukt, winkel } from '../src/lib/vektor';
import { lageAbstand } from '../src/lib/vektorbild';

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
const ORDNER = 'content/modules/vektorprodukt';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const texteAusHtml = (html: string): string[] => [...html.matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<'));
const texte = (n: ReactNode): string[] => texteAusHtml(alsText(n));
const feld = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!;
const wert = (nr: string, id: string) => feld(nr, id).erwartet;
const koord = (nr: string, praefix: string): number[] => [1, 2, 3].map((i) => wert(nr, `${praefix}${i}`));
/** Alle Spalten (pmatrix) in einem Knoten, als Zahlenlisten. */
const spaltenAus = (n: ReactNode): number[][] =>
  [...texte(n).join(' ').matchAll(/\\begin\{pmatrix\}(.*?)\\end\{pmatrix\}/g)].map((m) => m[1]!.split('\\\\').map((z) => Number(z.replace(/\{,\}/g, '.'))));

/* Unabhängig von der Bibliothek: Vektorprodukt über Entwicklung der 3×3-Determinante nach der ersten Spalte der Einheitsvektoren (Unterdeterminanten). */
const det2 = (p: number, q: number, r: number, s: number) => p * s - q * r;
const kreuz = (a: number[], b: number[]): number[] => [det2(a[1]!, a[2]!, b[1]!, b[2]!), -det2(a[0]!, a[2]!, b[0]!, b[2]!), det2(a[0]!, a[1]!, b[0]!, b[1]!)].map((x) => x + 0);
const punkt = (u: number[], v: number[]) => u.reduce((s, x, i) => s + x * v[i]!, 0);
const laenge = (v: number[]) => Math.sqrt(punkt(v, v));
const grad = (u: number[], v: number[]) => (Math.acos(Math.max(-1, Math.min(1, punkt(u, v) / (laenge(u) * laenge(v))))) * 180) / Math.PI;
/** Determinante der Matrix mit den Spalten u, v, w (Regel von Sarrus). */
const det3 = (u: number[], v: number[], w: number[]) =>
  u[0]! * v[1]! * w[2]! + v[0]! * w[1]! * u[2]! + w[0]! * u[1]! * v[2]! - w[0]! * v[1]! * u[2]! - u[0]! * w[1]! * v[2]! - v[0]! * u[1]! * w[2]!;
const diff = (a: number[], b: number[]) => b.map((x, i) => x - a[i]!);
const nah = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;
const ggt = (a: number, b: number): number => (b === 0 ? Math.abs(a) : ggt(b, a % b));
const ggtListe = (v: number[]) => v.reduce((g, x) => ggt(g, x), 0);
const parallel = (u: number[], v: number[]) => kreuz(u, v).every((x) => x === 0);
/** Kollinear unabhängig: ein Vektor ist Null, oder b_j · a_i = b_i · a_j für die erste von null verschiedene Koordinate i von a. */
const kollinearUnabh = (a: number[], b: number[]) => {
  const i = a.findIndex((x) => x !== 0);
  if (i < 0) return true;
  return a.every((_, j) => b[j]! * a[i]! === b[i]! * a[j]!);
};

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Vektoren, hat vier Abschnitte, BPE 16.3', () => {
    expect(meta.id).toBe('vektorprodukt');
    expect(meta.thema).toBe('vektorgeometrie');
    expect(meta.unterbereich).toBe('vektoren');
    expect(meta.bpe).toEqual(['16.3']);
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
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"vektorprodukt"');
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
    for (const wort of ['Vektorprodukt', 'Kreuzprodukt', 'Skalarprodukt', 'senkrecht', 'kollinear', 'Nullvektor', 'Rechte-Hand-Regel', 'antikommutativ', 's-Multiplikation', 'Probe', 'Rechtssystem']) expect(html, wort).toContain(wort);
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).not.toMatch(/\d\/\d/);
    expect(html).not.toMatch(/\bpi\b|Pi\b/);
    expect(html).not.toMatch(/[A-Z]\(-?\d+(,\d+)? ?\/ ?-?\d/);
  });
  it('nur das Vektorprodukt als Rechenvorschrift: Normalenvektor, Ebenen, Geraden und der Flächeninhalt (nicht im Bildungsplan) kommen nicht vor', () => {
    expect(rendern(null)).not.toMatch(/Normalenvektor|Ebenengleichung|Koordinatenform|Parameterform|Geradengleichung|Hesse|Spurpunkt|Flächeninhalt|Spatprodukt|Spat\b|Volumen/);
  });
  it('das Erklären nimmt nichts vorweg: keine Senkrechtheit, keine Probe, keine Betragsformel, keine Reihenfolgeregel', () => {
    const html = rendern('erklaeren');
    const tex = texteAusHtml(html).join(' ');
    expect(tex.length).toBeGreaterThan(100);
    for (const verboten of ['\\perp', '\\sin', '\\Leftrightarrow', '\\times\\vec{a}=-', '=\\vec{0}', '(\\vec{a}\\times\\vec{b})\\cdot']) expect(tex, verboten).not.toContain(verboten);
    for (const wort of ['senkrecht', 'orthogonal', 'antikommutativ', 'Rechte-Hand', 'Nullvektor', 'kollinear']) expect(html.replace(/<[^>]*>/g, ''), wort).not.toContain(wort);
  });
  it('verweist auf die Module davor statt Skalarprodukt, Kollinearität, Betrag und Verbindungsvektoren zu wiederholen', () => {
    const quelle = readdirSync(ORDNER).filter((x) => x.endsWith('.tsx')).map((d) => readFileSync(`${ORDNER}/${d}`, 'utf8')).join('\n');
    for (const m of ['skalarprodukt-orthogonalitaet', 'rechnen-mit-vektoren', 'betrag-abstand-teilung', 'punkte-vektoren-raum']) expect(quelle, m).toContain(`modul="${m}"`);
  });
});

describe('Bibliothek: Vektorprodukt', () => {
  it('stimmt über Unterdeterminanten und die Probe mit dem Skalarprodukt für viele Vektoren', () => {
    let n = 0;
    for (let a1 = -2; a1 <= 2; a1++) for (let a2 = -2; a2 <= 2; a2++) for (let a3 = -2; a3 <= 2; a3++) for (const b of [[1, 0, 0], [2, -1, 3], [-2, 2, -1], [0, 0, 0], [-1, -2, 2]]) {
      const a = [a1, a2, a3];
      const k = vektorprodukt(a, b);
      expect(k).toEqual(kreuz(a, b).map((x) => x + 0));
      expect(punkt(k, a)).toBe(0);
      expect(punkt(k, b)).toBe(0);
      n++;
    }
    expect(n).toBeGreaterThan(600);
  });
  it('gibt es nur im Raum', () => {
    expect(() => vektorprodukt([1, 2], [3, 4])).toThrow();
  });
});

describe('Bilder', () => {
  const bilder: [string, RaumBildSpec][] = [['PRODUKT', B.RAUM_PRODUKT], ['TAUSCH', B.RAUM_TAUSCH], ['KOLLINEAR', B.RAUM_KOLLINEAR], ['DREIECK', B.raumDreieck], ['DACH', B.raumDach]];
  const zahlenX1 = Array.from({ length: 2 * RAUM_GRENZE + 1 }, (_, i) => i - RAUM_GRENZE).filter((k) => k !== 0).map((k) => normiert(x1ZahlMitte(k)));
  it('alle Punkte liegen im Koordinatensystem, keiner im Schrägbild auf einer Achse oder an derselben Bildstelle wie ein anderer, jedes Bild hat eine Textalternative', () => {
    for (const [name, s] of bilder) {
      const bp = s.punkte!.map((p) => bildpunkt(p.p));
      for (const [i, p] of s.punkte!.entries()) {
        for (const x of p.p) expect(Math.abs(x), `${name} ${p.name}`).toBeLessThanOrEqual(RAUM_GRENZE);
        const [x, y] = bp[i]!;
        expect(x, `${name} ${p.name} x`).not.toBe(0);
        expect(y, `${name} ${p.name} y`).not.toBe(0);
        expect(x, `${name} ${p.name} x=y`).not.toBe(y);
      }
      expect(new Set(bp.map(String)).size, name).toBe(bp.length);
      expect(s.sprech.length, name).toBeGreaterThan(40);
    }
  });
  it('jede Beschriftung hat Abstand zu allen Linien, Achsen, Achsenzahlen und anderen Beschriftungen', () => {
    for (const [name, s] of bilder) {
      const lagen = raumLagen(s);
      expect(lagen.length, name).toBe(s.punkte!.length);
      for (const l of lagen) {
        const pt = s.punkte!.find((p) => p.name === l.name)!;
        const andere = [...zahlenX1, ...lagen.filter((x) => x !== l).map((x) => normiert(x.mitte))];
        const d = lageAbstand(l.lage, bildpunkt(pt.p), { bereich: RAUM_BEREICH, teilung: 1, linien: sperrlinienRaum(s.linien), belegt: andere });
        expect(d, `${name} ${l.name}`).toBeGreaterThanOrEqual(0.015);
      }
    }
  });
  it('Bild zur Vermutung 1: das Vektorprodukt steht senkrecht auf a und b, Rechtssystem, die Zahlen stimmen mit der Rechnung überein', () => {
    const [b, a, n] = B.RAUM_PRODUKT.linien!.map((l) => diff(l.von, l.bis));
    expect(a).toEqual(D.ENTDECKEN.a);
    expect(b).toEqual(D.ENTDECKEN.b);
    expect(n).toEqual(kreuz(a!, b!));
    expect(n).toEqual(D.ENTDECKEN.n);
    expect(punkt(n!, a!)).toBe(0);
    expect(punkt(n!, b!)).toBe(0);
    // (a, b, n) bilden ein Rechtssystem: die Determinante ist |n|² > 0
    expect(det3(a!, b!, n!)).toBe(punkt(n!, n!));
    expect(det3(a!, b!, n!)).toBeGreaterThan(0);
    expect(B.RAUM_PRODUKT.linien!.every((l) => l.pfeil)).toBe(true);
  });
  it('Bild zur Vermutung 2: b × a ist der Gegenvektor von a × b, auf derselben Geraden', () => {
    const l = B.RAUM_TAUSCH.linien!.map((x) => diff(x.von, x.bis));
    const [b, a, n, m] = l;
    expect(n).toEqual(kreuz(a!, b!));
    expect(m).toEqual(kreuz(b!, a!));
    expect(m).toEqual(n!.map((x) => -x));
    expect(m).toEqual(D.ENTDECKEN.m);
    expect(parallel(n!, m!)).toBe(true);
  });
  it('Bild zur Vermutung 4: a = (1 | 2 | 1) und b = −2 a sind kollinear, das Vektorprodukt ist der Nullvektor', () => {
    const [b, a] = B.RAUM_KOLLINEAR.linien!.map((l) => diff(l.von, l.bis));
    expect(b).toEqual(a!.map((x) => D.KOLLINEAR.faktor * x));
    expect(kreuz(a!, b!)).toEqual([0, 0, 0].map((x) => x));
    expect(kollinearUnabh(a!, b!)).toBe(true);
    expect(B.RAUM_KOLLINEAR.linien).toHaveLength(2);
  });
  it('Bild zur Aufgabe 10: Der Pfeil ab A steht senkrecht auf AB und AC', () => {
    const { A, B: Bp, C } = D.A_DREIECK;
    const pfeil = B.raumDreieck.linien!.find((l) => l.pfeil)!;
    expect(pfeil.von).toEqual(A);
    const v = diff(pfeil.von, pfeil.bis);
    expect(punkt(v, diff(A, Bp))).toBe(0);
    expect(punkt(v, diff(A, C))).toBe(0);
    expect(v).toEqual(D.A_DREIECK.gekuerzt);
  });
  it('Bild zur Aufgabe 11: Der Mast steht senkrecht auf beiden Kanten und zeigt nach oben', () => {
    const [blau, orange, rosa] = B.raumDach.linien!;
    const a = diff(orange!.von, orange!.bis);
    const b = diff(blau!.von, blau!.bis);
    const m = diff(rosa!.von, rosa!.bis);
    expect(B.raumDach.linien).toHaveLength(3);
    expect(a).toEqual(D.A_DACH.a);
    expect(b).toEqual(D.A_DACH.b);
    expect(punkt(m, a)).toBe(0);
    expect(punkt(m, b)).toBe(0);
    expect(m[2]).toBeGreaterThan(0);
    expect(m).toEqual(D.A_DACH.gekuerzt);
  });
});

describe('Labor', () => {
  const g = Array.from({ length: 2 * D.LABOR_GRENZE + 1 }, (_, i) => i - D.LABOR_GRENZE);
  it('alle 15 625 Einstellungen: Pfeile gleich den Vektoren, Vektorprodukt gegen Determinanten, Probe, Rechtssystem, Betragsformel, Kollinearität', () => {
    let n = 0;
    let mitNullprodukt = 0;
    for (const a1 of g) for (const a2 of g) for (const a3 of g) for (const b1 of g) for (const b2 of g) for (const b3 of g) {
      const a = [a1, a2, a3];
      const b = [b1, b2, b3];
      const k = kreuz(a, b);
      const s = produktBild(a, b, true);
      // Punkte im Koordinatensystem
      for (const p of s.punkte!) for (const x of p.p) expect(Math.abs(x)).toBeLessThanOrEqual(RAUM_GRENZE);
      // Pfeile: b (blau, breiter), a (orange), dann das Produkt (rosa) und das vertauschte (schwarz)
      expect(s.linien![0]!.bis).toEqual(b);
      expect(s.linien![1]!.bis).toEqual(a);
      expect(s.linien![0]!.breite).toBeGreaterThan(2.5);
      const f = bildFaktor(k);
      expect([1, 0.5]).toContain(f);
      expect(f === 1 ? Math.max(...k.map(Math.abs)) <= RAUM_GRENZE : Math.max(...k.map(Math.abs)) > RAUM_GRENZE).toBe(true);
      expect(vektorprodukt(a, b)).toEqual(k.map((x) => x + 0));
      if (k.every((x) => x === 0)) {
        mitNullprodukt++;
        expect(s.linien).toHaveLength(2);
        expect(kollinearUnabh(a, b)).toBe(true);
        expect(kollinear(a, b)).toBe(true);
      } else {
        expect(s.linien).toHaveLength(4);
        expect(s.linien![2]!.bis).toEqual(k.map((x) => x * f));
        expect(s.linien![3]!.bis).toEqual(k.map((x) => -x * f + 0));
        expect(kollinearUnabh(a, b)).toBe(false);
        // Probe mit dem Skalarprodukt
        expect(punkt(k, a)).toBe(0);
        expect(punkt(k, b)).toBe(0);
        // Rechtssystem (a, b, a × b)
        expect(det3(a, b, k)).toBe(punkt(k, k));
        // Betrag: Lagrange-Identität (exakt) und |a × b| = |a| |b| sin α (über den Winkel aus der Bibliothek, Toleranz wegen der Rundung)
        expect(punkt(k, k)).toBe(punkt(a, a) * punkt(b, b) - punkt(a, b) ** 2);
        const w = winkel(a, b)!;
        expect(Math.abs(laenge(k) - laenge(a) * laenge(b) * Math.sin((w * Math.PI) / 180))).toBeLessThan(1e-9);
      }
      n++;
    }
    expect(n).toBe(15625);
    expect(mitNullprodukt).toBeGreaterThan(100);
  });
  it('die Pfeile der Vektorprodukte werden nur verkürzt, wenn eine Koordinate über der Grenze des Koordinatensystems liegt, und dann genau halbiert', () => {
    expect(bildFaktor([4, -4, 0])).toBe(1);
    expect(bildFaktor([5, 0, 0])).toBe(0.5);
    expect(bildFaktor([-8, 8, 8])).toBe(0.5);
    const s = produktBild([2, 2, 0], [-2, 2, 2], false);
    expect(s.sprech).toContain('Hälfte');
    expect(s.linien).toHaveLength(3);
  });
  it('die Beschriftungen haben für Stichproben genügend Abstand', () => {
    let kleinster = Infinity;
    for (const a of [[1, 2, 0], [-2, 1, 1], [2, -1, 2]]) for (const b of [[0, 1, 2], [1, -2, 1], [-1, -1, 2]]) {
      const s = produktBild(a, b, true);
      const lagen = raumLagen(s);
      // der Ursprung bleibt ohne Buchstaben: Vier Pfeile gehen von ihm aus und lassen keinen Platz für eine Beschriftung
      expect(s.punkte!.find((p) => p.name === 'O')!.ohneText).toBe(true);
      expect(lagen.map((l) => l.name)).not.toContain('O');
      for (const l of lagen) {
        const pt = s.punkte!.find((p) => p.name === l.name)!;
        const andere = [...zahlenX1(), ...lagen.filter((x) => x !== l).map((x) => normiert(x.mitte))];
        kleinster = Math.min(kleinster, lageAbstand(l.lage, bildpunkt(pt.p), { bereich: RAUM_BEREICH, teilung: 1, linien: sperrlinienRaum(s.linien), belegt: andere }));
      }
    }
    // Bei beliebigen Einstellungen mit vier Pfeilen am Ursprung lässt sich nicht immer der volle Abstand erreichen, er bleibt aber über 0,005 (Bruchteile der Bildgröße)
    expect(kleinster).toBeGreaterThan(0.005);
  });
  const zahlenX1 = () => Array.from({ length: 2 * RAUM_GRENZE + 1 }, (_, i) => i - RAUM_GRENZE).filter((k) => k !== 0).map((k) => normiert(x1ZahlMitte(k)));
  it('Startwerte entsprechen dem Beispiel der Vermutung 1', () => {
    expect(D.LABOR_START.a).toEqual(D.ENTDECKEN.a);
    expect(D.LABOR_START.b).toEqual(D.ENTDECKEN.b);
    expect(kreuz(D.ENTDECKEN.a, D.ENTDECKEN.b)).toEqual(D.ENTDECKEN.n);
    expect(kreuz(D.ENTDECKEN.b, D.ENTDECKEN.a)).toEqual(D.ENTDECKEN.m);
  });
  it('rendert mit sechs Reglern und drei Schaltern, ohne Schalter für Ebene und Raum, Ergebnisse zunächst verborgen', () => {
    const html = renderToStaticMarkup(<Vektorproduktlabor />);
    expect(html.match(/type="range"/g)).toHaveLength(6);
    expect(html.match(/type="checkbox"/g)).toHaveLength(3);
    expect(html).toContain('aria-label="Legende"');
    expect(html).toContain('aria-label="Darstellung wählen"');
    expect(html).not.toContain('aria-label="Ebene oder Raum wählen"');
    expect(html).not.toContain('formel-fehler');
    const tex = texteAusHtml(html).join(' ');
    expect(tex).not.toContain('\\begin{pmatrix}4\\\\-2\\\\1\\end{pmatrix}');
    expect(tex).not.toContain('\\sin');
  });
});

describe('Aufgaben und Auswahlfragen, unabhängig gerechnet', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('die Nummern', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '3', '4', '6', '8', '9', '10', '11']);
    expect(fragen.map((q) => q.nummer)).toEqual(['2', '5', '7', '12']);
  });
  it('Aufgabe 1: Vektorprodukt über Determinanten, Probe, die Lösung zeigt das Ergebnis', () => {
    const { a, b } = D.A_BERECHNEN;
    expect(koord('1', 'n')).toEqual(kreuz(a, b));
    expect(punkt(koord('1', 'n'), a)).toBe(0);
    expect(punkt(koord('1', 'n'), b)).toBe(0);
    const tex = aufgaben.find((x) => x.nummer === '1')!.loesung.flatMap(texte).join(' ');
    expect(tex).toContain('-6\\\\8\\\\13');
    expect(tex).toContain('(-1)\\cdot (-2)-2\\cdot 4');
  });
  it('Auswahlfrage 2: genau ein Ergebnis ist richtig, die falschen sind typische Fehler und die Probe zeigt sie', () => {
    const q = fragen.find((x) => x.nummer === '2')!;
    const { a, b } = D.A_FEHLER;
    const n = kreuz(a, b);
    expect(q.optionen).toHaveLength(4);
    expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
    for (const o of q.optionen) {
      const v = spaltenAus(o.text)[0]!;
      expect(nah(v[0]! - n[0]!, 0) && nah(v[1]! - n[1]!, 0) && nah(v[2]! - n[2]!, 0), o.id).toBe(o.richtig);
    }
    const [fMitte, fTausch, fEinzeln] = D.A_FEHLER.falsch;
    expect(fMitte).toEqual([n[0], -n[1]!, n[2]]);
    expect(punkt(fMitte!, b)).not.toBe(0);
    expect(fTausch).toEqual(kreuz(b, a));
    expect(fEinzeln).toEqual(a.map((x, i) => x * b[i]!));
    expect(punkt(fEinzeln!, a)).not.toBe(0);
  });
  it('Aufgabe 3: die Probe findet den Fehler, die mittlere Koordinate ist die falsche, b allein hätte den Fehler nicht gezeigt', () => {
    const { a, b, falsch } = D.A_PROBE;
    const n = kreuz(a, b);
    expect(wert('3', 'pa')).toBe(punkt(falsch, a));
    expect(wert('3', 'pb')).toBe(punkt(falsch, b));
    expect(wert('3', 'pa')).not.toBe(0);
    expect(wert('3', 'pb')).toBe(0);
    expect(b[1]).toBe(0);
    expect(wert('3', 'n2')).toBe(n[1]);
    expect(falsch.filter((x, i) => x !== n[i])).toEqual([falsch[1]]);
    expect(D.A_PROBE.richtig).toEqual(n);
  });
  it('Aufgabe 4: b × a ist der Gegenvektor von a × b, direkt gerechnet', () => {
    const { a, b } = D.A_BERECHNEN;
    expect(koord('4', 'm')).toEqual(kreuz(b, a));
    expect(koord('4', 'm')).toEqual(kreuz(a, b).map((x) => -x));
  });
  it('Auswahlfrage 5: (0 | 2 | 0) × (3 | 0 | 0) zeigt entgegen der x₃-Achse, Rechtssystem', () => {
    const { a, b } = D.A_RICHTUNG;
    expect(kreuz(a, b)).toEqual([0, 0, -6].map((x) => x + 0));
    expect(det3(a, b, kreuz(a, b))).toBeGreaterThan(0);
    const q = fragen.find((x) => x.nummer === '5')!;
    expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
    expect(alsText(q.optionen.find((o) => o.richtig)!.text)).toContain('entgegen');
    // die falschen Antworten: Gegenrichtung (vertauscht), parallel zu b, parallel zu a
    expect(kreuz(b, a)).toEqual([0, 0, 6].map((x) => x + 0));
    expect(punkt([1, 0, 0], kreuz(a, b))).toBe(0);
    expect(punkt([0, 1, 0], kreuz(a, b))).toBe(0);
    expect(kreuz([1, 0, 0], [0, 1, 0])).toEqual([0, 0, 1].map((x) => x + 0));
  });
  it('Aufgabe 6: k macht das Vektorprodukt zum Nullvektor, nur für diesen Wert', () => {
    const k = wert('6', 'k');
    expect(kreuz([2, -1, 4], [-6, 3, k])).toEqual([0, 0, 0].map((x) => x + 0));
    expect(kreuz([2, -1, 4], [-6, 3, k + 1]).every((x) => x === 0)).toBe(false);
    expect(kreuz([2, -1, 4], [-6, 3, k - 1]).every((x) => x === 0)).toBe(false);
    expect([-6, 3, k]).toEqual([-3 * 2, -3 * -1, -3 * 4]);
  });
  it('Auswahlfrage 7: genau ein Paar ist kollinear, das orthogonale Paar hat ein Vektorprodukt ungleich 0, die genannten Produkte stimmen', () => {
    const q = fragen.find((x) => x.nummer === '7')!;
    expect(q.optionen).toHaveLength(4);
    expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
    for (const o of q.optionen) {
      const [a, b] = spaltenAus(o.text) as [number[], number[]];
      const fall = D.A_NULL.paare.find((p) => p.a.join() === a.join() && p.b.join() === b.join())!;
      expect(fall, o.id).toBeDefined();
      expect(kreuz(a, b).every((x) => x === 0), o.id).toBe(o.richtig);
      expect(kollinearUnabh(a, b), o.id).toBe(o.richtig);
      expect(kollinear(a, b), o.id).toBe(o.richtig);
    }
    const [, p2, p3, p4] = D.A_NULL.paare;
    expect(kreuz(p2!.a, p2!.b)).toEqual([2, -1, 0]);
    expect(punkt(p3!.a, p3!.b)).toBe(0);
    expect(kreuz(p3!.a, p3!.b)).toEqual([0, 0, 5].map((x) => x + 0));
    expect(kreuz(p4!.a, p4!.b)).toEqual([-6, -3, 0]);
    const rueck = q.optionen.map((o) => texte(o.rueckmeldung).join(' ')).join(' ');
    expect(rueck).toContain('2\\\\-1\\\\0');
    expect(rueck).toContain('0\\\\0\\\\5');
    expect(rueck).toContain('-6\\\\-3\\\\0');
  });
  it('Aufgabe 8: Betrag und Winkel von Hand, Lagrange-Identität und Betragsformel', () => {
    const { a, b } = D.A_BETRAG;
    const n = kreuz(a, b);
    expect(n).toEqual(D.A_BETRAG.n);
    expect(punkt(n, n)).toBe(11);
    expect(punkt(a, a) * punkt(b, b) - punkt(a, b) ** 2).toBe(11);
    expect(Math.abs(laenge(n) - wert('8', 'b'))).toBeLessThanOrEqual(feld('8', 'b').toleranz!);
    expect(Math.abs(grad(a, b) - wert('8', 'w'))).toBeLessThanOrEqual(feld('8', 'w').toleranz!);
    expect(wert('8', 'w')).toBe(Math.round(grad(a, b) * 100) / 100);
    expect(wert('8', 'b')).toBe(Math.round(laenge(n) * 100) / 100);
    expect(nah(laenge(a) * laenge(b) * Math.sin((grad(a, b) * Math.PI) / 180), laenge(n), 1e-9)).toBe(true);
    expect(nah(punkt(a, b) / (laenge(a) * laenge(b)), 5 / 6)).toBe(true);
  });
  it('Aufgabe 9: ein senkrechter Vektor der Länge 6 mit positiver erster Koordinate, parallel zum Vektorprodukt', () => {
    const { a, b } = D.A_LAENGE;
    const v = koord('9', 'v');
    const n = kreuz(a, b);
    expect(n).toEqual(D.A_LAENGE.n);
    expect(laenge(n)).toBe(9);
    expect(punkt(v, a)).toBe(0);
    expect(punkt(v, b)).toBe(0);
    expect(laenge(v)).toBe(6);
    expect(v[0]).toBeGreaterThan(0);
    expect(parallel(v, n)).toBe(true);
    expect(v).toEqual(n.map((x) => (-2 / 3) * x));
  });
  it('Aufgabe 10: Verbindungsvektoren aus den Punkten, senkrecht, gekürzt, erste Koordinate positiv', () => {
    const { A, B: Bp, C } = D.A_DREIECK;
    const ab = diff(A, Bp);
    const ac = diff(A, C);
    expect(ab).toEqual(D.A_DREIECK.ab);
    expect(ac).toEqual(D.A_DREIECK.ac);
    const n = kreuz(ab, ac);
    expect(n).toEqual(D.A_DREIECK.n);
    expect(ggtListe(n)).toBe(2);
    const v = koord('10', 's');
    expect(v).toEqual(n.map((x) => x / 2));
    expect(punkt(v, ab)).toBe(0);
    expect(punkt(v, ac)).toBe(0);
    expect(ggtListe(v)).toBe(1);
    expect(v[0]).toBeGreaterThan(0);
    expect(parallel(v, n)).toBe(true);
    expect(n.some((x) => x !== 0)).toBe(true);
  });
  it('Aufgabe 11: Mastrichtung senkrecht zu beiden Kanten, gekürzt, nach oben', () => {
    const { a, b } = D.A_DACH;
    const n = kreuz(a, b);
    expect(n).toEqual(D.A_DACH.n);
    const v = koord('11', 'd');
    expect(punkt(v, a)).toBe(0);
    expect(punkt(v, b)).toBe(0);
    expect(ggtListe(v)).toBe(1);
    expect(v[2]).toBeGreaterThan(0);
    expect(n[2]).toBeLessThan(0);
    expect(v).toEqual(n.map((x) => -x / 2));
    expect(parallel(v, n)).toBe(true);
    // die Kantenvektoren sind nicht orthogonal (Parallelogramm, kein Rechteck) und nicht kollinear
    expect(kollinearUnabh(a, b)).toBe(false);
  });
  it('Auswahlfrage 12: genau eine richtige Antwort, die falschen sind begründet', () => {
    const q = fragen.find((x) => x.nummer === '12')!;
    expect(q.optionen).toHaveLength(4);
    expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
    expect(alsText(q.optionen.find((o) => o.richtig)!.text)).toContain('senkrecht');
    // Gegenbeispiele zu den falschen Aussagen
    const a = [1, 2, 0];
    const b = [0, 1, 2];
    expect(kreuz(a, b)).not.toEqual(kreuz(b, a));
    expect(laenge(kreuz(a, b))).not.toBeCloseTo(laenge(a) * laenge(b), 3);
  });
  it('Auswahlfragen: Die richtigen Antworten stehen nicht alle an derselben Stelle, jede Antwort hat eine Rückmeldung, jede Aufgabe Hilfen und Lösung', () => {
    expect(new Set(fragen.map((q) => q.optionen.findIndex((o) => o.richtig))).size).toBeGreaterThan(1);
    for (const q of fragen) for (const o of q.optionen) expect(alsText(o.rueckmeldung).length, `${q.nummer}${o.id}`).toBeGreaterThan(20);
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(1);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(1);
      for (const f of a.felder) expect(Number.isFinite(f.erwartet), `${a.nummer}${f.id}`).toBe(true);
    }
  });
  it('Hilfen, Lösungsschritte, Rückmeldungen und Erklärungen rendern ohne Formelfehler und Gedankenstriche', () => {
    const alle: ReactNode[] = [...aufgaben.flatMap((a) => [...a.hilfen, ...a.loesung, ...a.felder.map((f) => f.beschriftung)]), ...fragen.flatMap((q) => [q.erklaerung, ...q.optionen.flatMap((o) => [o.text, o.rueckmeldung])])];
    expect(alle.length).toBeGreaterThan(80);
    for (const n of alle) {
      const html = alsText(n);
      expect(html).not.toContain('formel-fehler');
      expect(html).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(html).not.toContain(z);
      expect(html).not.toMatch(/\d\/\d/);
    }
  });
});

describe('Beispiele der Erklärung und der Zusammenfassung', () => {
  it('Erklärung: Das Beispiel ist richtig gerechnet', () => {
    const { a, b, n } = D.BEISPIEL;
    expect(kreuz(a, b)).toEqual(n);
    expect(punkt(n, a)).toBe(0);
    expect(punkt(n, b)).toBe(0);
  });
  it('Zusammenfassung: Vektorprodukt, beide Proben, gekürzter Vektor', () => {
    const z = D.ZUSAMMENFASSUNG;
    expect(kreuz(z.a, z.b)).toEqual(z.n);
    expect(punkt(z.n, z.a)).toBe(0);
    expect(punkt(z.n, z.b)).toBe(0);
    expect(z.n).toEqual(z.gekuerzt.map((x) => 7 * x));
    expect(ggtListe(z.gekuerzt)).toBe(1);
    const tex = texteAusHtml(rendern('zusammenfassung')).join(' ');
    expect(tex).toContain('28-21-7=0');
    expect(tex).toContain('-14-14+28=0');
    expect(tex).toContain('3\\cdot 4-(-1)\\cdot 2');
  });
  it('Vermutung 3: Zahlen der Beobachtung (Betrag Wurzel 21, Winkel 66,42°, 5 sin α)', () => {
    const { a, b, n, betragN, winkel: w } = D.ENTDECKEN;
    expect(punkt(n, n)).toBe(21);
    expect(Math.round(laenge(n) * 100) / 100).toBe(betragN);
    expect(punkt(a, a)).toBe(5);
    expect(punkt(b, b)).toBe(5);
    expect(Math.round(grad(a, b) * 100) / 100).toBe(w);
    expect(Math.round(5 * Math.sin((grad(a, b) * Math.PI) / 180) * 100) / 100).toBe(betragN);
    expect(nah(punkt(a, b) / 5, 0.4)).toBe(true);
  });
  it('Die Rechenvorschrift nach Schema (Zeilen 2 und 3, 3 und 4, 4 und 5) gibt dasselbe wie die Determinanten', () => {
    for (const [a, b] of [[[2, 1, 3], [1, 4, -1]], [[3, -1, 2], [1, 4, -2]], [[-2, 5, 1], [4, 0, -3]]] as [number[], number[]][]) {
      const za = [...a, a[0]!, a[1]!];
      const zb = [...b, b[0]!, b[1]!];
      const schema = [1, 2, 3].map((i) => za[i]! * zb[i + 1]! - za[i + 1]! * zb[i]!);
      expect(schema).toEqual(kreuz(a, b));
    }
  });
});
