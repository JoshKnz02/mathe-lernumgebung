import { existsSync, readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/spurpunkte-besondere-lage/Bilder';
import * as D from '../content/modules/spurpunkte-besondere-lage/daten';
import Modul from '../content/modules/spurpunkte-besondere-lage/index';
import { Lagelabor, Spurpunktelabor, lageLaborBild, spurLaborBild } from '../content/modules/spurpunkte-besondere-lage/Labor';
import meta from '../content/modules/spurpunkte-besondere-lage/meta.json';
import { Eigenschaften, Pruefer, vennBild } from '../content/modules/spurpunkte-besondere-lage/Venn';
import themen from '../content/themen.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { RAUM_BEREICH, RAUM_GRENZE, bildpunkt, normiert, raumLagen, sperrlinienRaum, x1ZahlMitte, type RaumBildSpec } from '../src/lib/schraegbild';
import { lageAbstand } from '../src/lib/vektorbild';
import { regionVon } from '../src/lib/venn';

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
const ORDNER = 'content/modules/spurpunkte-besondere-lage';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const texteAusHtml = (html: string): string[] => [...html.matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<'));
const texte = (n: ReactNode): string[] => texteAusHtml(alsText(n));
const zahl = (s: string) => Number(s.replace(/\{,\}/g, '.'));
const spaltenAus = (n: ReactNode): number[][] =>
  [...texte(n).join(' ').matchAll(/\\begin\{pmatrix\}(.*?)\\end\{pmatrix\}/g)].map((m) => m[1]!.split('\\\\').map(zahl)).filter((s) => s.every((x) => Number.isFinite(x)));
const wert = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!.erwartet;

/* Unabhängige Methoden. */
const kreuz = (a: number[], b: number[]): number[] => [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!].map((x) => x + 0);
const diff = (b: number[], a: number[]) => b.map((x, i) => x - a[i]!);
const plus = (a: number[], b: number[]) => a.map((x, i) => x + b[i]!);
const mal = (k: number, v: number[]) => v.map((x) => x * k);
const aufGerade = (p: number[], u: number[], x: number[]) => kreuz(diff(x, p), u).every((c) => Math.abs(c) < 1e-9);
/** Spurpunkt in der Ebene mit der Nullkoordinate i: einziger Schnittpunkt, wenn u_i ≠ 0, sonst null. */
const spur = (p: number[], u: number[], i: number): number[] | null => {
  if (u[i] === 0) return null;
  const par = -p[i]! / u[i]!;
  return plus(p, mal(par, u)).map((c, j) => (j === i ? 0 : Math.round(c * 1e9) / 1e9 + 0));
};
const spuren = (p: number[], u: number[]) => [spur(p, u, 2), spur(p, u, 1), spur(p, u, 0)];
const verschieden = (liste: (number[] | null)[]) => liste.filter((x): x is number[] => x !== null).filter((x, i, a) => a.findIndex((y) => y.every((c, k) => Math.abs(c - x[k]!) < 1e-9)) === i);
/** Lage von Hand: Koordinatenvergleiche. */
const nullU = (u: number[], i: number) => u[i] === 0;
const inEbene = (p: number[], u: number[], i: number) => u[i] === 0 && p[i] === 0;
const parEbene = (p: number[], u: number[], i: number) => u[i] === 0 && p[i] !== 0;
const parallelZuEbene = (p: number[], u: number[]) => [0, 1, 2].some((i) => parEbene(p, u, i));
const region = (p: number[], u: number[], P: number[]) => {
  const m1 = parallelZuEbene(p, u);
  const m2 = verschieden(spuren(p, u)).length === 1;
  const m3 = aufGerade(p, u, P);
  return m1 && m2 && m3 ? 'G' : m1 && m2 ? 'D' : m2 && m3 ? 'E' : m1 && m3 ? 'F' : m1 ? 'A' : m2 ? 'B' : m3 ? 'C' : 'H';
};

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Geraden, hat fünf Abschnitte (mit dem Abschnitt Venn-Aufgabe), BPE 16.1', () => {
    expect(meta.id).toBe('spurpunkte-besondere-lage');
    expect(meta.thema).toBe('vektorgeometrie');
    expect(meta.unterbereich).toBe('geraden');
    expect(meta.bpe).toEqual(['16.1']);
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['erklaeren', 'entdecken', 'ueberpruefen', 'venn', 'zusammenfassung']);
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
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"spurpunkte-besondere-lage"');
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
    for (const wort of ['Spurpunkt', 'Durchstoßpunkt', 'Koordinatenebene', 'Koordinatenachse', 'durch den Ursprung', 'parallel', 'liegt in', 'Venn', 'Region', 'Stützvektor', 'Richtungsvektor', 'Vereinbarung']) expect(html, wort).toContain(wort);
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).not.toMatch(/\d\/\d/);
    expect(html).not.toMatch(/\bpi\b|Pi\b/);
    expect(html).not.toMatch(/[A-Z]\(-?\d+(,\d+)? ?\/ ?-?\d/);
  });
  it('nur Spurpunkte, besondere Lage und Venn: gegenseitige Lage von Geraden, Winkel, Abstände, Ebenengleichungen und Streckenanteile kommen nicht vor', () => {
    expect(rendern(null)).not.toMatch(/windschief|Schnittpunkt zweier|Schnittwinkel|Lotfußpunkt|Normalenvektor|Ebenengleichung|Koordinatenform|Hesse|Teilstrecke|Streckenanteil|Abstand|Winkel|Skalarprodukt/);
  });
  it('das Erklären nimmt nichts vorweg: keine Kennzeichen der Lage am Richtungsvektor, keine Anzahl der Spurpunkte', () => {
    const html = rendern('erklaeren');
    const text = html.replace(/<[^>]*>/g, '');
    for (const wort of ['Vielfache', 'Vielfaches', 'zusammen', 'höchstens', 'genau dann']) expect(text, wort).not.toContain(wort);
    const tex = texteAusHtml(html).join(' ');
    expect(tex.length).toBeGreaterThan(100);
    for (const verboten of ['u_i', '\\ne', '\\Leftrightarrow', 'p_i']) expect(tex, verboten).not.toContain(verboten);
  });
  it('verweist auf die Module davor statt Geradengleichung und Schrägbild zu wiederholen', () => {
    const quelle = readdirSync(ORDNER).filter((x) => x.endsWith('.tsx')).map((d) => readFileSync(`${ORDNER}/${d}`, 'utf8')).join('\n');
    const ids = [...quelle.matchAll(/modul="([a-z0-9-]+)"/g)].map((m) => m[1]!);
    for (const m of ['geradengleichung', 'punkte-vektoren-raum', 'rechnen-mit-vektoren']) expect(ids, m).toContain(m);
    for (const id of ids) expect(existsSync(`content/modules/${id}/meta.json`), id).toBe(true);
  });
  it('die Zahlen und der Punkt der Arbeitsblätter der Lehrkraft kommen nicht vor (öffentliches Repository)', () => {
    const html = rendern(null);
    expect(html).not.toContain('P(1\\,|\\,-1\\,|\\,1)');
    expect(D.VENN_P).toEqual([2, -1, -2]);
    const quelle = readdirSync(ORDNER).filter((x) => x.endsWith('.ts') || x.endsWith('.tsx')).map((d) => readFileSync(`${ORDNER}/${d}`, 'utf8')).join('\n');
    for (const v of ['p: [1, -1, 1]', 'p: [1, 2, 3]', 'p: [0, 1, 2], u: [1, 1, 0]', 'p: [0, 2, 3]']) expect(quelle, v).not.toContain(v);
    // Die Spurpunkte (0 | 1 | 2), (−1 | 0 | 1), (−2 | −1 | 0) des Venn-Blatts (Bereich H) kommen in keiner Venn-Gerade vor
    for (const b of D.VENN_BEISPIELE) {
      const s = verschieden(spuren(b.g.p, b.g.u)).map((x) => x.join(','));
      expect(s).not.toContain('-2,-1,0');
    }
  });
});

describe('Bilder', () => {
  const bilder: [string, RaumBildSpec][] = [
    ['ERKLAEREN', B.RAUM_ERKLAEREN],
    ['PARALLEL', B.RAUM_PARALLEL],
    ['ZWEI_EBENEN', B.RAUM_ZWEI_EBENEN],
    ['IN_PARALLEL', B.RAUM_IN_PARALLEL],
    ['SPUR', B.aufgSpur],
    ['ZEICHNEN', B.aufgZeichnen],
    ['ZUSAMMENFASSUNG', B.RAUM_ZUSAMMENFASSUNG],
    ...D.VENN_BEISPIELE.map((b): [string, RaumBildSpec] => [`VENN ${b.id}`, vennBild(b.g)]),
  ];
  const zahlenX1 = Array.from({ length: 2 * RAUM_GRENZE + 1 }, (_, i) => i - RAUM_GRENZE).filter((k) => k !== 0).map((k) => normiert(x1ZahlMitte(k)));
  it('alle beschrifteten Punkte liegen im Koordinatensystem, keiner im Schrägbild auf einer Achse oder an derselben Bildstelle wie ein anderer, jedes Bild hat eine Textalternative', () => {
    for (const [name, s] of bilder) {
      const sichtbar = s.punkte!.filter((p) => !p.ohneText);
      const bp = sichtbar.map((p) => bildpunkt(p.p));
      for (const [i, p] of sichtbar.entries()) {
        for (const x of p.p) expect(Math.abs(x), `${name} ${p.name}`).toBeLessThanOrEqual(RAUM_GRENZE);
        const [x, y] = bp[i]!;
        expect(x, `${name} ${p.name} x`).not.toBe(0);
        expect(y, `${name} ${p.name} y`).not.toBe(0);
        expect(x, `${name} ${p.name} x=y`).not.toBe(y);
      }
      expect(new Set(bp.map(String)).size, name).toBe(bp.length);
      expect(s.sprech.length, name).toBeGreaterThan(40);
      for (const l of s.linien!) for (const c of [...l.von, ...l.bis]) expect(Math.abs(c), `${name} Linie`).toBeLessThanOrEqual(RAUM_GRENZE + 1e-9);
    }
  });
  it('jede Beschriftung hat Abstand zu allen Linien, Achsen, Achsenzahlen und anderen Beschriftungen', () => {
    for (const [name, s] of bilder) {
      const lagen = raumLagen(s);
      expect(lagen.length, name).toBe(s.punkte!.filter((p) => !p.ohneText).length);
      for (const l of lagen) {
        const pt = s.punkte!.find((p) => p.name === l.name)!;
        const andere = [...zahlenX1, ...lagen.filter((x) => x !== l).map((x) => normiert(x.mitte))];
        const d = lageAbstand(l.lage, bildpunkt(pt.p), { bereich: RAUM_BEREICH, teilung: 1, linien: sperrlinienRaum(s.linien), belegt: andere });
        expect(d, `${name} ${l.name}`).toBeGreaterThanOrEqual(0.015);
      }
    }
  });
  it('jeder Spurpunkt im Bild liegt auf der Geraden, in seiner Koordinatenebene und stimmt mit der unabhängigen Rechnung überein', () => {
    const gerade: [string, RaumBildSpec, { p: number[]; u: number[] }][] = [
      ['ERKLAEREN', B.RAUM_ERKLAEREN, D.ERKLAEREN.g],
      ['PARALLEL', B.RAUM_PARALLEL, D.PARALLEL.g],
      ['ZWEI_EBENEN', B.RAUM_ZWEI_EBENEN, D.ZWEI_EBENEN.g],
      ['SPUR', B.aufgSpur, D.A_SPUR.g],
      ['ZEICHNEN', B.aufgZeichnen, D.A_ZEICHNEN.g],
      ['ZUSAMMENFASSUNG', B.RAUM_ZUSAMMENFASSUNG, D.ZUSAMMENFASSUNG.g],
    ];
    const index: Record<string, number> = { 'S₁₂': 2, 'S₁₃': 1, 'S₂₃': 0 };
    for (const [name, s, g] of gerade) {
      const erwartet = spuren(g.p, g.u);
      for (const p of s.punkte!.filter((q) => q.name in index)) {
        const i = index[p.name]!;
        expect(p.p[i], `${name} ${p.name}`).toBe(0);
        expect(aufGerade(g.p, g.u, p.p), `${name} ${p.name}`).toBe(true);
        expect(p.p, `${name} ${p.name}`).toEqual(erwartet[[2, 1, 0].indexOf(i)]);
      }
      // Alle Spurpunkte im Koordinatensystem sind eingezeichnet
      const imBild = erwartet.filter((x): x is number[] => x !== null && x.every((c) => Math.abs(c) <= 4));
      expect(s.punkte!.filter((q) => q.name in index).length, name).toBe(imBild.length);
    }
  });
  it('Bild zur Vermutung 1: die Gerade in der Höhe 3 hat keinen Spurpunkt S₁₂, zwei Spurpunkte, die Zahlen stimmen mit der Rechnung überein', () => {
    const p = D.PARALLEL.g;
    expect(spur(p.p, p.u, 2)).toBeNull();
    expect(spur(p.p, p.u, 1)).toEqual(D.PARALLEL.S13);
    expect(spur(p.p, p.u, 0)).toEqual(D.PARALLEL.S23);
    expect(B.RAUM_PARALLEL.punkte!.map((x) => x.name).sort()).toEqual(['S₁₃', 'S₂₃']);
    const z = D.ZWEI_EBENEN;
    expect(verschieden(spuren(z.g.p, z.g.u))).toEqual([z.S12]);
    const u = D.URSPRUNG;
    for (const s of spuren(u.g.p, u.g.u)) expect(s).toEqual([0, 0, 0]);
    expect(plus(u.g.p, mal(u.t, u.g.u))).toEqual([0, 0, 0]);
  });
  it('Bild zur Vermutung 2: g₁ liegt in der x₁x₂-Ebene, g₂ ist echt parallel dazu, gleiche Richtung', () => {
    const { g1, g2, A, B: Bp } = D.IN_PARALLEL;
    expect(inEbene(g1.p, g1.u, 2)).toBe(true);
    expect(parEbene(g2.p, g2.u, 2)).toBe(true);
    expect(g1.u).toEqual(g2.u);
    expect(aufGerade(g1.p, g1.u, A)).toBe(true);
    expect(aufGerade(g2.p, g2.u, Bp)).toBe(true);
    expect(B.RAUM_IN_PARALLEL.ebenen).toEqual(['e12']);
  });
  it('Erklärungsbeispiel: Spurpunkte und Parameter', () => {
    const e = D.ERKLAEREN;
    expect(spur(e.g.p, e.g.u, 2)).toEqual(e.S12);
    expect(spur(e.g.p, e.g.u, 1)).toEqual(e.S13);
    expect(spur(e.g.p, e.g.u, 0)).toEqual(e.S23);
    expect(plus(e.g.p, mal(e.t12, e.g.u))).toEqual(e.S12);
    expect(plus(e.g.p, mal(e.t13, e.g.u))).toEqual(e.S13);
    expect(plus(e.g.p, mal(e.t23, e.g.u))).toEqual(e.S23);
  });
});

describe('Labore', () => {
  it('Spurpunktelabor: sechs Regler, zwei Schalter, Spurpunkte und Rechnung zunächst verborgen, ohne Schalter Ebene und Raum', () => {
    const html = renderToStaticMarkup(<Spurpunktelabor />);
    expect(html.match(/type="range"/g)).toHaveLength(6);
    expect(html.match(/type="checkbox"/g)).toHaveLength(2);
    expect(html).toContain('aria-label="Darstellung wählen"');
    expect(html).not.toContain('aria-label="Ebene oder Raum wählen"');
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('Verschiedene Spurpunkte');
    expect(texteAusHtml(html).join(' ')).not.toContain('Rightarrow');
    expect(D.SPURLABOR_START).toEqual({ p: D.ERKLAEREN.g.p, u: D.ERKLAEREN.g.u });
  });
  it('Lagelabor: sechs Regler, ein Schalter, die Lage zunächst verborgen', () => {
    const html = renderToStaticMarkup(<Lagelabor />);
    expect(html.match(/type="range"/g)).toHaveLength(6);
    expect(html.match(/type="checkbox"/g)).toHaveLength(1);
    expect(html).not.toContain('Besondere Lage der Geraden');
    expect(html).not.toContain('formel-fehler');
  });
  it('Spurpunktelabor: für alle 42 875 Einstellungen gilt: Spurpunkte im Koordinatensystem nur gezeichnet, wenn sie dort liegen, alle Linien im Koordinatensystem, Spurpunkte stimmen mit der unabhängigen Rechnung', () => {
    let n = 0;
    let gezeichnet = 0;
    const Rp = [-3, -2, -1, 0, 1, 2, 3];
    const Ru = [-2, -1, 0, 1, 2];
    for (const p1 of Rp) for (const p2 of Rp) for (const p3 of Rp) for (const u1 of Ru) for (const u2 of Ru) for (const u3 of Ru) {
      const p = [p1, p2, p3];
      const u = [u1, u2, u3];
      const kein = u1 === 0 && u2 === 0 && u3 === 0;
      const { spec, ausserhalb, kein: k } = spurLaborBild(p, u, true);
      expect(k).toBe(kein);
      if (!kein) {
        const erwartet = verschieden(spuren(p, u));
        const drin = erwartet.filter((x) => x.every((c) => Math.abs(c) <= 4));
        // Der Stützpunkt P steht an erster Stelle, danach folgen die gezeichneten Spurpunkte (ein Spurpunkt auf P wird nicht doppelt gezeichnet)
        const gezeichnetePunkte = spec.punkte!.slice(1);
        expect(gezeichnetePunkte.length, `${p} ${u}`).toBe(drin.filter((x) => !x.every((c, i) => c === p[i])).length);
        expect(ausserhalb.length).toBeLessThanOrEqual(3);
        gezeichnet += drin.length;
      }
      for (const l of spec.linien ?? []) for (const c of [...l.von, ...l.bis]) expect(Math.abs(c)).toBeLessThanOrEqual(4 + 1e-9);
      expect(spec.sprech.length).toBeGreaterThan(40);
      n++;
    }
    expect(n).toBe(343 * 125);
    expect(gezeichnet).toBeGreaterThan(50000);
  }, 120000);
  it('Spurpunktelabor ohne Schalter zeigt keine Spurpunkte, nur den Stützpunkt', () => {
    const { spec } = spurLaborBild([2, 1, 2], [-1, 1, -2], false);
    expect(spec.punkte!.map((q) => q.name)).toEqual(['P']);
    expect(spec.ebenen).toEqual(['e12', 'e13', 'e23']);
    expect(lageLaborBild([1, -2, 1], [1, 2, -2]).punkte!.map((q) => q.name)).toEqual(['P']);
  });
});

describe('Aufgaben', () => {
  it('12 Aufgaben: sechs mit Eingabefeldern (1, 2, 4, 6, 9, 11), fünf Auswahlfragen (3, 7, 8, 10, 12) und eine Zeichenaufgabe (5)', () => {
    const html = rendern('ueberpruefen');
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '2', '4', '6', '9', '11']);
    expect(fragen.map((f) => f.nummer)).toEqual(['3', '7', '8', '10', '12']);
    expect(html).toContain('Aufgabe 5: Eine Gerade mit Spurpunkten zeichnen');
  });
  it('Aufgabe 1: die sechs Koordinaten sind die Spurpunkte der Geraden aus dem Aufgabentext', () => {
    rendern('ueberpruefen');
    const [p, u] = spaltenAus(aufgaben.find((a) => a.nummer === '1')!.children);
    const [s12, s13, s23] = spuren(p!, u!);
    expect([wert('1', 'a1'), wert('1', 'a2')]).toEqual([s12![0], s12![1]]);
    expect([wert('1', 'b1'), wert('1', 'b3')]).toEqual([s13![0], s13![2]]);
    expect([wert('1', 'c2'), wert('1', 'c3')]).toEqual([s23![1], s23![2]]);
    expect(Object.values(D.A_SPUR.g.p)).toEqual(p);
  });
  it('Aufgabe 2: der Spurpunkt S₁₃ hat Dezimalkoordinaten (−0,5 | 0 | 1,5)', () => {
    rendern('ueberpruefen');
    const [p, u] = spaltenAus(aufgaben.find((a) => a.nummer === '2')!.children);
    const s = spur(p!, u!, 1)!;
    expect(wert('2', 'x1')).toBe(s[0]);
    expect(wert('2', 'x3')).toBe(s[2]);
    expect(s).toEqual([-0.5, 0, 1.5]);
  });
  it('Auswahl 3: die Gerade hat genau zwei Spurpunkte, S₁₂ und S₁₃, kein S₂₃ (x₁ ist immer 2)', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '3')!;
    const [p, u] = spaltenAus(f.children);
    expect(spur(p!, u!, 0)).toBeNull();
    expect(spur(p!, u!, 2)).toEqual([2, -2, 0]);
    expect(spur(p!, u!, 1)).toEqual([2, 0, -2]);
    expect(f.optionen.filter((o) => o.richtig)).toHaveLength(1);
    expect(texte(f.optionen.find((o) => o.richtig)!.text).join(' ')).toContain('S_{12}');
    expect(f.optionen[0]!.richtig).toBe(false);
  });
  it('Aufgabe 4: S₂₃ aus S₁₂ und S₁₃', () => {
    rendern('ueberpruefen');
    const pk = [...texte(aufgaben.find((a) => a.nummer === '4')!.children).join(' ').matchAll(/S_\{(\d\d)\}\(([^)]*)\)/g)].map((m) => ({ n: m[1], v: m[2]!.split('\\,|\\,').map(zahl) }));
    const s12 = pk.find((x) => x.n === '12')!.v;
    const s13 = pk.find((x) => x.n === '13')!.v;
    const u = diff(s13, s12);
    // S₂₃: x₁ = 0
    const par = -s12[0]! / u[0]!;
    const s23 = plus(s12, mal(par, u));
    expect(wert('4', 'y')).toBe(s23[1]);
    expect(wert('4', 'z')).toBe(s23[2]);
  });
  it('Aufgabe 6: die Zuordnung ist nach der Vereinbarung eindeutig und stimmt mit den Lösungsfeldern überein, einzelne Geraden erfüllen mehrere Beschreibungen', () => {
    rendern('ueberpruefen');
    const a = aufgaben.find((x) => x.nummer === '6')!;
    const spalten = spaltenAus(a.children);
    expect(spalten).toHaveLength(16);
    const geraden = Array.from({ length: 8 }, (_, i) => ({ p: spalten[2 * i]!, u: spalten[2 * i + 1]! }));
    const achse = (p: number[], u: number[], k: number) => [0, 1, 2].every((j) => j === k || (p[j] === 0 && u[j] === 0));
    const parAchse = (u: number[], k: number) => [0, 1, 2].every((j) => j === k || u[j] === 0);
    const kriterien: ((p: number[], u: number[]) => boolean)[] = [
      (p, u) => kreuz(p, u).every((c) => c === 0),
      (p, u) => inEbene(p, u, 1),
      (p, u) => parAchse(u, 0) && inEbene(p, u, 2),
      (p, u) => parAchse(u, 1) && inEbene(p, u, 0),
      (p, u) => parEbene(p, u, 0),
      (p, u) => parEbene(p, u, 1),
      (p, u) => achse(p, u, 2),
      (p, u) => inEbene(p, u, 2),
    ];
    const erfuellt = geraden.map((g) => kriterien.map((k, i) => (k(g.p, g.u) ? i + 1 : 0)).filter(Boolean));
    expect(erfuellt.some((e) => e.length > 1)).toBe(true);
    expect(erfuellt.every((e) => e.length >= 1)).toBe(true);
    // genau eine Zuordnung, jede Beschreibung genau einmal
    const losungen: number[][] = [];
    const such = (i: number, benutzt: number[]) => {
      if (i === 8) return void losungen.push([...benutzt]);
      for (const d of erfuellt[i]!) if (!benutzt.includes(d)) such(i + 1, [...benutzt, d]);
    };
    such(0, []);
    expect(losungen).toHaveLength(1);
    expect(['1', '2', '3', '4', '5', '6', '7', '8'].map((i) => wert('6', `g${i}`))).toEqual(losungen[0]);
    expect(D.A_ZUORDNUNG.loesung).toEqual(losungen[0]);
  });
  it('Auswahl 7: parallel zur x₁x₂-Ebene, ohne Spurpunkt S₁₂ (u₃ = 0, p₃ ≠ 0)', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '7')!;
    const [p, u] = spaltenAus(f.children);
    expect(parEbene(p!, u!, 2)).toBe(true);
    expect(inEbene(p!, u!, 2)).toBe(false);
    expect(spur(p!, u!, 2)).toBeNull();
    expect(f.optionen.filter((o) => o.richtig)).toHaveLength(1);
    expect(alsText(f.optionen.find((o) => o.richtig)!.text)).toContain('parallel');
  });
  it('Auswahl 8: genau eine der vier Geraden geht durch den Ursprung', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '8')!;
    let n = 0;
    for (const o of f.optionen) {
      const [p, u] = spaltenAus(o.text);
      const durch = kreuz(p!, u!).every((c) => c === 0);
      expect(durch, o.id).toBe(o.richtig);
      if (durch) n++;
    }
    expect(n).toBe(1);
  });
  it('Aufgabe 9 und Auswahl 10: u₂ = 2a − 4 ist nur für a = 2 gleich 0, dann echt parallel, wenn p₂ ≠ 0, in der Ebene, wenn p₂ = 0', () => {
    rendern('ueberpruefen');
    const p9 = spaltenAus(aufgaben.find((x) => x.nummer === '9')!.children)[0]!;
    const richtig: number[] = [];
    for (let a = -20; a <= 20; a++) if (parEbene(p9, [a, 2 * a - 4, 1], 1)) richtig.push(a);
    expect(richtig).toEqual([wert('9', 'a')]);
    const p10 = spaltenAus(fragen.find((x) => x.nummer === '10')!.children)[0]!;
    for (let a = -20; a <= 20; a++) expect(parEbene(p10, [a, 2 * a - 4, 1], 1), `a=${a}`).toBe(false);
    expect(inEbene(p10, [2, 0, 1], 1)).toBe(true);
    // a = 0 ist parallel zur x₂x₃-Ebene
    expect(parEbene(p10, [0, -4, 1], 0)).toBe(true);
    expect(fragen.find((x) => x.nummer === '10')!.optionen.filter((o) => o.richtig)).toHaveLength(1);
  });
  it('Aufgabe 11: der Laserstrahl trifft den Boden (x₃ = 0) im Punkt (5 | 7)', () => {
    rendern('ueberpruefen');
    const [p, u] = spaltenAus(aufgaben.find((x) => x.nummer === '11')!.children);
    const s = spur(p!, u!, 2)!;
    expect(wert('11', 'x1')).toBe(s[0]);
    expect(wert('11', 'x2')).toBe(s[1]);
  });
  it('Auswahl 12: die Gerade liegt in der x₁x₂-Ebene, die Spurpunkte S₁₃(5 | 0 | 0) und S₂₃(0 | 2,5 | 0) liegen auf den Achsen', () => {
    rendern('ueberpruefen');
    const [p, u] = spaltenAus(fragen.find((x) => x.nummer === '12')!.children);
    expect(inEbene(p!, u!, 2)).toBe(true);
    expect(spur(p!, u!, 1)).toEqual([5, 0, 0]);
    expect(spur(p!, u!, 0)).toEqual([0, 2.5, 0]);
    expect(spur(p!, u!, 2)).toBeNull();
  });
  it('alle Auswahlfragen: genau eine richtige Antwort, die Position wechselt, jede Option hat eine Rückmeldung, alle Texte ohne Formelfehler und Gedankenstriche', () => {
    rendern('ueberpruefen');
    const a = [...aufgaben];
    const f = [...fragen];
    const positionen = f.map((x) => x.optionen.findIndex((o) => o.richtig));
    expect(new Set(positionen).size).toBeGreaterThan(2);
    const knoten: ReactNode[] = [];
    for (const x of f) {
      expect(x.optionen.filter((o) => o.richtig), x.nummer).toHaveLength(1);
      for (const o of x.optionen) knoten.push(o.text, o.rueckmeldung);
      knoten.push(x.erklaerung, x.children);
    }
    for (const x of a) knoten.push(x.children, ...x.hilfen, ...x.loesung, ...x.felder.map((fl) => fl.beschriftung));
    for (const k of knoten) {
      const h = alsText(k);
      expect(h).not.toContain('formel-fehler');
      expect(h).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(h).not.toContain(z);
      expect(h).not.toMatch(/\d\/\d/);
      expect(h.replace(/<[^>]*>/g, '').trim().length).toBeGreaterThan(0);
    }
    for (const x of a) {
      expect(x.hilfen.length, x.nummer).toBeGreaterThanOrEqual(2);
      expect(x.loesung.length, x.nummer).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('Venn-Aufgabe', () => {
  const P = D.VENN_P;
  it('jede der acht Regionen kommt in den Beispielen genau einmal vor, jede Gerade liegt in der angegebenen Region (unabhängig berechnet), keine liegt in einer Koordinatenebene', () => {
    expect(D.VENN_BEISPIELE.map((b) => b.region).sort()).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
    for (const b of D.VENN_BEISPIELE) {
      expect(region(b.g.p, b.g.u, P), b.id).toBe(b.region);
      expect([0, 1, 2].some((i) => inEbene(b.g.p, b.g.u, i)), b.id).toBe(false);
    }
    // die Reihenfolge ist durchmischt: nicht alphabetisch
    expect(D.VENN_BEISPIELE.map((b) => b.region).join('')).not.toBe('ABCDEFGH');
  });
  it('die vier Aufgaben: Region unabhängig bestimmt, falsche Regionen sind andere Regionen', () => {
    for (const a of D.VENN_AUFGABEN) {
      expect(region(a.g.p, a.g.u, P)).toBe(a.region);
      for (const r of a.falsch) expect(r).not.toBe(a.region);
    }
    expect(new Set(D.VENN_AUFGABEN.map((a) => a.region)).size).toBe(4);
  });
  it('Auswahlfragen V1 bis V4: eine richtige Antwort, die Position wechselt, jede Rückmeldung nennt den Unterschied, Erklärung zeigt die drei Eigenschaften', () => {
    rendern('venn');
    expect(fragen.map((f) => f.nummer)).toEqual(['V1', 'V2', 'V3', 'V4']);
    const pos = fragen.map((f) => f.optionen.findIndex((o) => o.richtig));
    expect(new Set(pos).size).toBeGreaterThan(2);
    fragen.forEach((f, k) => {
      const richtig = f.optionen.filter((o) => o.richtig);
      expect(richtig).toHaveLength(1);
      expect(richtig[0]!.id).toBe(D.VENN_AUFGABEN[k]!.region);
      for (const o of f.optionen.filter((x) => !x.richtig)) {
        const h = alsText(o.rueckmeldung);
        expect(h).toMatch(/ist |hat |geht /);
        expect(h).not.toContain('formel-fehler');
      }
      const e = alsText(f.erklaerung);
      expect(e).toContain('parallel zu einer Koordinatenebene');
      expect(e).toContain('genau ein Spurpunkt');
      expect(e).toContain('durch den Punkt P');
    });
  });
  it('Prüfer und Eigenschaften rendern für alle acht Geraden ohne Formelfehler, Ja und Nein stimmen mit der unabhängigen Rechnung überein', () => {
    for (const b of D.VENN_BEISPIELE) {
      const h = renderToStaticMarkup(<Eigenschaften g={b.g} />);
      expect(h).not.toContain('formel-fehler');
      expect(h).not.toContain('katex-error');
      const [m1, m2] = [parallelZuEbene(b.g.p, b.g.u), verschieden(spuren(b.g.p, b.g.u)).length === 1];
      const m3 = aufGerade(b.g.p, b.g.u, P);
      expect(h).toContain(`parallel zu einer Koordinatenebene (K): ${m1 ? 'ja' : 'nein'}`);
      expect(h).toContain(`genau ein Spurpunkt (S): ${m2 ? 'ja' : 'nein'}`);
      expect(h).toContain(`durch den Punkt P (P): ${m3 ? 'ja' : 'nein'}`);
      expect(regionVon([m1, m2, m3])).toBe(b.region);
    }
    const html = renderToStaticMarkup(<Pruefer />);
    expect(html.match(/type="radio"/g)).toHaveLength(8);
    expect(html).toContain('Die Gerade gehört in die Region');
    expect(html).not.toContain('formel-fehler');
  });
  it('bei getrennter Zählung der Spurpunkte wären B und E leer: ihre Geraden gehen durch den Ursprung und sind nicht parallel', () => {
    for (const b of D.VENN_BEISPIELE.filter((x) => x.region === 'B' || x.region === 'E')) {
      expect(b.g.p).toEqual([0, 0, 0]);
      expect(parallelZuEbene(b.g.p, b.g.u)).toBe(false);
      expect(spuren(b.g.p, b.g.u).filter(Boolean)).toHaveLength(3);
      expect(verschieden(spuren(b.g.p, b.g.u))).toEqual([[0, 0, 0]]);
    }
    expect(rendern('venn')).toContain('Zählweise der Spurpunkte');
  });
});

describe('Zusammenfassung', () => {
  it('das Beispiel stimmt: kein S₁₂, S₁₃(3 | 0 | 3), S₂₃(0 | 1,5 | 3), parallel zur x₁x₂-Ebene, nicht durch den Ursprung', () => {
    const z = D.ZUSAMMENFASSUNG;
    expect(spur(z.g.p, z.g.u, 2)).toBeNull();
    expect(spur(z.g.p, z.g.u, 1)).toEqual(z.S13);
    expect(spur(z.g.p, z.g.u, 0)).toEqual(z.S23);
    expect(parEbene(z.g.p, z.g.u, 2)).toBe(true);
    expect(kreuz(z.g.p, z.g.u).every((c) => c === 0)).toBe(false);
    const html = rendern('zusammenfassung');
    expect(html).not.toContain('formel-fehler');
    expect(html).toContain('Vorgehen bei der Venn-Aufgabe');
  });
});
