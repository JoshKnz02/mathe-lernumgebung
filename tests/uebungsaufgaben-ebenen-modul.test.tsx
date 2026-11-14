import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/uebungsaufgaben-ebenen/Bilder';
import * as D from '../content/modules/uebungsaufgaben-ebenen/daten';
import { ABITUR_AB_2024_URL } from '../content/modules/uebungsaufgaben-ebenen/Hinweise';
import Modul from '../content/modules/uebungsaufgaben-ebenen/index';
import meta from '../content/modules/uebungsaufgaben-ebenen/meta.json';
import themen from '../content/themen.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { RAUM_BEREICH, RAUM_GRENZE, bildpunkt, normiert, raumLagen, sperrlinienRaum, x1ZahlMitte, type RaumBildSpec } from '../src/lib/schraegbild';
import { lageAbstand } from '../src/lib/vektorbild';

vi.setConfig({ testTimeout: 60000 });

interface AufgabeAufruf {
  nummer: string;
  children: ReactNode;
  felder: { id: string; erwartet: number; toleranz?: number; beschriftung: ReactNode }[];
  hilfen: ReactNode[];
  loesung: ReactNode[];
}
const aufgaben: AufgabeAufruf[] = [];

vi.mock('../src/components/Aufgabe', () => ({
  Aufgabe: (p: AufgabeAufruf & { nummer: string | number }) => {
    aufgaben.push({ ...p, nummer: String(p.nummer) });
    return <div data-aufgabe={String(p.nummer)}>{p.children}</div>;
  },
}));
vi.mock('../src/components/AufKlick', () => ({ AufKlick: ({ children }: { children: ReactNode }) => <>{children}</> }));

function rendern(abschnitt: string | null = null): string {
  aufgaben.length = 0;
  return renderToStaticMarkup(
    <AbschnittAnbieter value={abschnitt}>
      <Modul />
    </AbschnittAnbieter>,
  );
}
const ORDNER = 'content/modules/uebungsaufgaben-ebenen';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const texteAusHtml = (html: string): string[] => [...html.matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&#x27;/g, "'"));
const wert = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!.erwartet;

/* Unabhängig von der Bibliothek. */
const punkt = (u: number[], v: number[]) => u.reduce((s, x, i) => s + x * v[i]!, 0);
const laenge = (v: number[]) => Math.sqrt(punkt(v, v));
const diff = (a: number[], b: number[]) => b.map((x, i) => x - a[i]!);
const plus = (a: number[], b: number[]) => a.map((x, i) => x + b[i]!);
const mal = (r: number, v: number[]) => v.map((x) => r * x);
const det2 = (p: number, q: number, r: number, s: number) => p * s - q * r;
const kreuz = (a: number[], b: number[]): number[] => [det2(a[1]!, a[2]!, b[1]!, b[2]!), -det2(a[0]!, a[2]!, b[0]!, b[2]!), det2(a[0]!, a[1]!, b[0]!, b[1]!)].map((x) => x + 0);
const nah = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;
const gerade = (p: number[], u: number[], t: number) => plus(p, mal(t, u));
const grad = (r: number) => (r * 180) / Math.PI;
const inE = (n: number[], d: number, x: number[], eps = 1e-9) => nah(punkt(n, x), d, eps);
const vielfaches = (a: number[], b: number[]) => kreuz(a, b).every((c) => Math.abs(c) < 1e-9);
/** Kleinster Abstand eines Punkts von einer Ebene, durch Suche über Parameter (r, s) in einem feinen Raster um den Fußpunkt statt über die Formel. */
function naechsterAbstand(p: number[], u: number[], v: number[], q: number[], zentrum: number[]): number {
  let best = Infinity;
  for (let i = -300; i <= 300; i++) for (let j = -300; j <= 300; j++) {
    const x = plus(zentrum, plus(mal(i / 100, u), mal(j / 100, v)));
    best = Math.min(best, laenge(diff(x, q)));
  }
  return best;
}

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Ebenen, hat vier Abschnitte, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('uebungsaufgaben-ebenen');
    expect(meta.thema).toBe('vektorgeometrie');
    expect(meta.unterbereich).toBe('ebenen');
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.bpe).toEqual(['16.3', '16.4', '16.5', '16.6', '16.7']);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['hinweise', 'ohne-hilfsmittel', 'mit-hilfsmittel', 'problemloesen']);
    const thema = themen.themen.find((x) => x.id === meta.thema) as { unterbereiche?: { id: string }[] };
    expect(thema.unterbereiche?.map((u) => u.id)).toContain(meta.unterbereich);
    for (const a of meta.abschnitte) {
      const h = rendern(a.id);
      expect(h).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(h).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('solange es ein Entwurf ist, steht es in keinem Kurs', () => {
    if (meta.status !== 'entwurf') return;
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"uebungsaufgaben-ebenen"');
  });
  it('rendert ohne Formelfehler, ohne Gedankenstriche, ohne Schrägstrich-Brüche und mit der Fachsprache der Lehrkraft', () => {
    const h = rendern(null);
    expect(h).not.toContain('formel-fehler');
    expect(h).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(h).not.toContain(z);
    for (const d of readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts'))) {
      const q = readFileSync(`${ORDNER}/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
    }
    for (const wort of ['Operator', 'BE', 'Spurpunkt', 'Lotfußpunkt', 'Normalenvektor', 'Koordinatengleichung', 'Durchstoßpunkt', 'Schnittgerade', 'Spiegelpunkt', 'Gradmaß', 'Kreuzprodukt']) expect(h, wort).toContain(wort);
    expect(h).not.toMatch(/\d\/\d/);
    expect(h).not.toMatch(/\bpi\b|Pi\b/);
    expect(h).not.toMatch(/[A-Z]\(-?\d+(,\d+)? ?\/ ?-?\d/);
    expect(h).not.toMatch(/Graph(?!ik)/);
    expect(h).not.toMatch(/graphisch/);
  });
  it('alle Aufgaben eigens geschrieben: Szenarien, Punkte und Gleichungen der Abiturprüfungen ab 2024 kommen nicht vor', () => {
    const html = rendern(null);
    const h = texteAusHtml(html).join(' ') + ' ' + html;
    for (const p of ['A(0\\,|\\,18\\,|\\,0)', 'D(3{,}6\\,|\\,4{,}2\\,|\\,1)', 'A(-3\\,|\\,-2\\,|\\,5)', 'B(1\\,|\\,-2\\,|\\,3)', 'A(5\\,|\\,0\\,|\\,0)', 'F(5\\,|\\,2\\,|\\,2)', 'A(0\\,|\\,3\\,|\\,0)', 'C(2\\,|\\,-1\\,|\\,4)', 'P(0\\,|\\,1\\,|\\,3)', 'Q(0\\,|\\,-3\\,|\\,1)', 'A(5\\,|\\,-1\\,|\\,2)', 'B(9\\,|\\,2\\,|\\,12)', 'A(3\\,|\\,3\\,|\\,0)', 'P(-4\\,|\\,2\\,|\\,-2)']) expect(h, p).not.toContain(p);
    for (const g of ['2x_1+2x_2-x_3=6', '2x_1-x_2+2x_3=4', '2x_1-x_2+2x_3=2', '2x_1+x_2+2x_3=4', 'x_1+x_2-2x_3=4']) expect(h, g).not.toContain(g);
    for (const wort of ['Roloplan', 'Drachen', 'Gewächshaus', 'Kirchturm', 'Sonnensegel', 'Kirschbaum', 'Tragfläche']) expect(html, wort).not.toContain(wort);
  });
  it('die Landesaufgaben und der Link zu den Abiturprüfungen ab 2024 öffnen in einem neuen Tab mit noopener, der zweite Link ist erreichbar benannt', () => {
    const h = rendern('hinweise');
    expect(h).toMatch(/<a href="https:\/\/www\.schule-bw\.de[^"]*musterpruefungen" target="_blank" rel="noopener noreferrer">/);
    expect(h).toContain(`<a href="${ABITUR_AB_2024_URL}" target="_blank" rel="noopener noreferrer">`);
    expect(ABITUR_AB_2024_URL).toBe('https://www.mathe-aufgaben.com/pruefungsaufgaben/abitur/berufl-gymnasien/berufliche-gymnasien-abiturpruefungen-ab-2024/');
    expect(h).toContain('keine Gewähr');
  });
  it('verweist auf die Module davor und nennt den Stoff je Aufgabe, alle verwiesenen Module gibt es', () => {
    const q = readFileSync(`${ORDNER}/Hinweise.tsx`, 'utf8');
    const ids = ['einfuehrung-ebenen', 'normalenform-koordinatenform', 'zeichnerische-darstellung-ebenen', 'gerade-und-ebene', 'zwei-ebenen', 'abstaende-ebenen', 'schnittwinkel-geraden', 'uebungsaufgaben-abiturstil', 'vektorprodukt'];
    const vorhanden = readdirSync('content/modules');
    for (const m of ids) {
      expect(q, m).toContain(m);
      expect(vorhanden, m).toContain(m);
    }
    for (const f of ['MitHilfsmittel.tsx', 'OhneHilfsmittel.tsx', 'Problemloesen.tsx']) for (const m of readFileSync(`${ORDNER}/${f}`, 'utf8').matchAll(/modul="([a-z-]+)"/g)) expect(vorhanden, m[1]).toContain(m[1]);
  });
});

describe('Aufgaben, Bewertungseinheiten und Operatoren', () => {
  beforeEach(() => {
    rendern(null);
  });
  const OPERATOR = /(?:^|[.?:] )(Weisen Sie nach|Zeigen Sie|Begründen Sie|Beschreiben Sie|Bestimmen Sie|Berechnen Sie|Ermitteln Sie|Entscheiden Sie|Zeichnen Sie|Untersuchen Sie|Skizzieren Sie|Beurteilen Sie|Erläutern Sie|Geben Sie)/;
  const be = (n: ReactNode) => [...alsText(n).matchAll(/\((\d+) BE\)/g)].map((m) => Number(m[1]));
  const summe = (l: number[]) => l.reduce((s, x) => s + x, 0);
  it('die Nummern: neun Aufgaben, alle mit Eingabefeldern', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
    for (const a of aufgaben) expect(a.felder.length, a.nummer).toBeGreaterThan(0);
  });
  it('die Bewertungseinheiten ergeben 5 BE je Aufgabe ohne Hilfsmittel, 12 und 10 BE mit Hilfsmittel, 10 BE bei der Pyramide', () => {
    for (const nr of ['1', '2', '3', '4', '5', '6']) expect(summe(be(aufgaben.find((a) => a.nummer === nr)!.children)), `Aufgabe ${nr}`).toBe(5);
    expect(summe(be(aufgaben.find((a) => a.nummer === '7')!.children))).toBe(12);
    expect(summe(be(aufgaben.find((a) => a.nummer === '8')!.children))).toBe(10);
    expect(summe(be(aufgaben.find((a) => a.nummer === '9')!.children))).toBe(10);
  });
  it('jede Teilaufgabe enthält einen Operator der Operatorenliste als Aufforderung', () => {
    let n = 0;
    for (const a of aufgaben) {
      for (const m of alsText(a.children).matchAll(/<li>(.*?)<\/li>/gs)) {
        const text = m[1]!.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        if (!/BE\)/.test(text)) continue;
        expect(text, text.slice(0, 50)).toMatch(OPERATOR);
        n++;
      }
    }
    expect(n).toBe(6 * 2 + 5 + 4 + 4);
  });
  it('Aufgaben ohne Hilfsmittel haben nur ganzzahlige Ergebnisse (keine Toleranz), mit Hilfsmittel Toleranz 0,01 bei Dezimalzahlen', () => {
    for (const nr of ['1', '2', '3', '4', '5', '6']) for (const f of aufgaben.find((a) => a.nummer === nr)!.felder) {
      expect(Number.isInteger(f.erwartet), `${nr}${f.id}`).toBe(true);
      expect(f.toleranz).toBeUndefined();
    }
    for (const nr of ['7', '8', '9']) for (const f of aufgaben.find((a) => a.nummer === nr)!.felder) if (!Number.isInteger(f.erwartet * 2)) expect(f.toleranz, `${nr}${f.id}`).toBe(0.01);
  });
  it('jede Aufgabe hat mindestens drei Hilfen und mindestens zwei Lösungsschritte', () => {
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(3);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(2);
    }
  });
  it('Hilfen, Lösungsschritte und Feldbeschriftungen rendern ohne Formelfehler, Gedankenstriche und Schrägstrich-Brüche; überall, wo vom Vektorprodukt die Rede ist, steht (Kreuzprodukt)', () => {
    const alle: ReactNode[] = aufgaben.flatMap((a) => [...a.hilfen, ...a.loesung, ...a.felder.map((f) => f.beschriftung)]);
    expect(alle.length).toBeGreaterThan(60);
    for (const n of alle) {
      const h = alsText(n);
      expect(h).not.toContain('formel-fehler');
      expect(h).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(h).not.toContain(z);
      expect(h).not.toMatch(/\d\/\d/);
      const text = h.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
      expect(text).not.toMatch(/Vektorprodukts?(?![a-zäöüß])(?! \(Kreuzprodukt\))/);
    }
  });
  it('Lösungsschritte in kurzen Zeilen: jede schmale Formel hat höchstens 44 Zeichen je Zeile, Zeilenumbrüche stehen nur vor einem Gleichheitszeichen (keine Fortsetzung mit {}+, {}- oder {}\\cdot)', () => {
    for (const a of aufgaben) {
      for (const n of [...a.loesung, a.children]) {
        for (const f of texteAusHtml(alsText(n))) {
          // einzige Ausnahme: eine gegebene Geradengleichung darf bei schmalen Fenstern vor „+ t · u“ brechen
          const geradengleichung = /^\\begin\{gathered\}[a-z_]+:\\ \\vec\{x\}=/.test(f);
          if (!geradengleichung) expect(f, `Aufgabe ${a.nummer}`).not.toMatch(/\{\}\+|\{\}-|\{\}\\cdot/);
          if (!f.startsWith('\\begin{gathered}')) continue;
          const ohneVektoren = f.replace(/\\begin\{pmatrix\}[^]*?\\end\{pmatrix\}/g, 'V').replace(/^\\begin\{gathered\}|\\end\{gathered\}$/g, '');
          for (const zeile of ohneVektoren.split('\\\\')) if (!zeile.includes('V') && !/^[a-z]_?[abc]?:\\ \\vec/.test(zeile)) expect(zeile.length, `Aufgabe ${a.nummer}: ${zeile}`).toBeLessThanOrEqual(44);
        }
      }
    }
  });
});

describe('Aufgaben, unabhängig gerechnet', () => {
  beforeEach(() => {
    rendern(null);
  });
  const ganze = (nr: string, ids: string[]) => ids.map((i) => wert(nr, i));
  it('Aufgabe 1: n steht senkrecht auf beiden Spannvektoren, ist gekürzt und positiv, alle drei Punkte erfüllen die Gleichung, a ergibt sich durch Suche', () => {
    const d = D.A1;
    const u = diff(d.A, d.B);
    const v = diff(d.A, d.C);
    expect(kreuz(u, v)).toEqual(d.kreuz);
    const [n1, n2, n3] = ganze('1', ['n1', 'n2', 'n3']) as [number, number, number];
    expect(punkt([n1, n2, n3], u)).toBe(0);
    expect(punkt([n1, n2, n3], v)).toBe(0);
    expect(n1).toBeGreaterThan(0);
    const ggt = (a: number, b: number): number => (b === 0 ? Math.abs(a) : ggt(b, a % b));
    expect(ggt(ggt(n1, n2), n3)).toBe(1);
    expect(d.kreuz.map((c) => c / 2)).toEqual([n1, n2, n3]);
    const b = wert('1', 'b');
    for (const p of [d.A, d.B, d.C]) expect(punkt([n1, n2, n3], p)).toBe(b);
    const treffer: number[] = [];
    for (let i = -2000; i <= 2000; i++) {
      const a = i / 100;
      if (nah(punkt([n1, n2, n3], [a, -3, a]), b, 1e-9)) treffer.push(a);
    }
    expect(treffer).toEqual([2]);
    expect(wert('1', 'a')).toBe(2);
  });
  it('Aufgabe 2: die Spurpunkte liegen auf den Achsen und in E (Suche über den Achsenparameter), F enthält zu jedem Punkt die Parallele zur x₃-Achse und hat keinen Punkt auf der x₃-Achse', () => {
    const d = D.A2;
    for (const [i, id] of [[0, 's1'], [1, 's2'], [2, 's3']] as [number, string][]) {
      const treffer: number[] = [];
      for (let k = -2000; k <= 2000; k++) {
        const x = [0, 0, 0];
        x[i] = k / 100;
        if (nah(punkt(d.n, x), d.d, 1e-9)) treffer.push(k / 100);
      }
      expect(treffer, `Achse ${i + 1}`).toHaveLength(1);
      expect(treffer[0]).toBe(wert('2', id));
    }
    expect([wert('2', 's1'), wert('2', 's2'), wert('2', 's3')]).toEqual([d.S1[0], d.S2[1], d.S3[2]]);
    for (const x3 of [-5, 0, 3.5]) expect(inE(d.F, 12, [4, 0, x3]) && inE(d.F, 12, [0, 6, x3])).toBe(true);
    for (let k = -2000; k <= 2000; k++) expect(inE(d.F, 12, [0, 0, k / 100])).toBe(false);
  });
  it('Aufgabe 3: n · u ist 3, der Parameter t = 2 ist die einzige Lösung (Suche), S liegt auf g und in E', () => {
    const d = D.A3;
    expect(punkt(d.n, d.u)).toBe(3);
    const treffer: number[] = [];
    for (let i = -2000; i <= 2000; i++) if (nah(punkt(d.n, gerade(d.P, d.u, i / 100)), d.d, 1e-9)) treffer.push(i / 100);
    expect(treffer).toEqual([2]);
    expect(gerade(d.P, d.u, 2)).toEqual(d.S);
    expect([wert('3', 's1'), wert('3', 's2'), wert('3', 's3')]).toEqual(d.S);
    expect(inE(d.n, d.d, d.S)).toBe(true);
  });
  it('Aufgabe 4: keine Vielfachen, die Punkte liegen in beiden Ebenen, es gibt je Höhe genau einen Punkt (Suche im Raster)', () => {
    const d = D.A4;
    expect(vielfaches(d.nE, d.nF)).toBe(false);
    for (const [x3, p1, p2] of [[0, 'p1', 'p2'], [2, 'q1', 'q2']] as [number, string, string][]) {
      const treffer: number[][] = [];
      for (let x1 = -10; x1 <= 10; x1++) for (let x2 = -10; x2 <= 10; x2++) {
        const x = [x1, x2, x3];
        if (inE(d.nE, d.dE, x) && inE(d.nF, d.dF, x)) treffer.push([x1, x2]);
      }
      expect(treffer).toHaveLength(1);
      expect(treffer[0]).toEqual([wert('4', p1), wert('4', p2)]);
    }
    expect(vielfaches(diff(d.S0, d.S2), kreuz(d.nE, d.nF))).toBe(true);
  });
  it('Aufgabe 5: Abstand 3 (Suche über die Ebene), Lotfußpunkt, Spiegelpunkt mit F als Mitte', () => {
    const d = D.A5;
    expect(laenge(d.n)).toBe(3);
    const u = [1, 2, 2];
    const v = [2, -2, 1];
    expect(punkt(d.n, u)).toBe(0);
    expect(punkt(d.n, v)).toBe(0);
    // Fußpunkt als Mittelpunkt der Suche: der Punkt in der Ebene mit kleinstem Abstand
    const zentrum = d.F;
    expect(inE(d.n, d.d, zentrum)).toBe(true);
    const dd = naechsterAbstand([], [u[0]! / 3, u[1]! / 3, u[2]! / 3], [v[0]! / 3, v[1]! / 3, v[2]! / 3], d.Q, zentrum);
    expect(nah(dd, 3, 1e-9)).toBe(true);
    expect(wert('5', 'd')).toBe(3);
    expect(vielfaches(diff(d.F, d.Q), d.n)).toBe(true);
    const Qs = [wert('5', 'q1'), wert('5', 'q2'), wert('5', 'q3')];
    expect(Qs.map((c, i) => (c + d.Q[i]!) / 2)).toEqual(d.F);
    expect(punkt(d.n, Qs) - d.d).toBe(-(punkt(d.n, d.Q) - d.d));
  });
  it('Aufgabe 6: n · u(a) ist nur für a = −1 null (Suche), der Stützpunkt (0 | 1 | 1) liegt nicht in E, (0 | −3 | 1) schon', () => {
    const d = D.A6;
    const nullstellen: number[] = [];
    for (let i = -2000; i <= 2000; i++) if (Math.abs(punkt(d.n, d.u(i / 100))) < 1e-9) nullstellen.push(i / 100);
    expect(nullstellen).toEqual([-1]);
    expect(wert('6', 'a')).toBe(-1);
    expect(inE(d.n, d.d, d.P)).toBe(false);
    const qs: number[] = [];
    for (let q = -100; q <= 100; q++) if (inE(d.n, d.d, [0, q, 1])) qs.push(q);
    expect(qs).toEqual([-3]);
    expect(wert('6', 'q')).toBe(-3);
    // dann liegt die ganze Gerade in E
    for (const tt of [-4, 0, 2.5, 9]) expect(inE(d.n, d.d, gerade([0, -3, 1], d.u(-1), tt))).toBe(true);
  });
  it('Aufgabe 7: Durchstoßpunkt (Suche über t), Winkel zur x₁x₂-Ebene über die Projektion, Spiegelpunkt, Strahl durch L′ und P, Boden, Weg', () => {
    const d = D.A7;
    const treffer: number[] = [];
    for (let i = -2000; i <= 2000; i++) if (nah(gerade(d.L, d.u, i / 100)[2]!, d.decke, 1e-9)) treffer.push(i / 100);
    expect(treffer).toEqual([1]);
    const P = gerade(d.L, d.u, 1);
    expect(P).toEqual([...d.P]);
    expect([wert('7', 'p1'), wert('7', 'p2'), wert('7', 'p3')]).toEqual(P);
    const proj = [d.u[0]!, d.u[1]!, 0];
    const alpha = grad(Math.acos(punkt(d.u, proj) / (laenge(d.u) * laenge(proj))));
    expect(nah(alpha, wert('7', 'w'), 0.01)).toBe(true);
    expect(nah(grad(Math.asin(2 / laenge(d.u))), alpha, 1e-9)).toBe(true);
    // Spiegelpunkt: Mitte von L und L′ liegt auf der Decke, LL′ senkrecht zur Decke
    const Ls = [wert('7', 'l1'), wert('7', 'l2'), wert('7', 'l3')];
    expect(Ls).toEqual([...d.Ls]);
    expect((d.L[2] + Ls[2]!) / 2).toBe(d.decke);
    expect(diff([...d.L], Ls).slice(0, 2)).toEqual([0, 0]);
    // Reflexionsgesetz: die Richtung P − L′ ist u mit umgekehrter dritter Koordinate
    expect(diff(Ls, [...d.P])).toEqual(d.u2);
    expect(d.u2).toEqual([d.u[0], d.u[1], -d.u[2]!]);
    const boden: number[] = [];
    for (let i = -2000; i <= 2000; i++) if (nah(gerade(Ls, d.u2, i / 100)[2]!, 0, 1e-9)) boden.push(i / 100);
    expect(boden).toEqual([2]);
    const R = gerade(Ls, d.u2, 2);
    expect(R).toEqual([...d.Fl]);
    expect([wert('7', 'r1'), wert('7', 'r2')]).toEqual([R[0], R[1]]);
    expect(R[0]).toBeGreaterThan(-2);
    // Weg
    expect(nah(laenge(diff([...d.L], P)) + laenge(diff(P, R)), wert('7', 'weg'), 0.01)).toBe(true);
    // der Weg ist so lang wie der gerade Weg von L zu R′ = Spiegelbild von R an der Decke
    const Rs = [R[0]!, R[1]!, 2 * d.decke - R[2]!];
    expect(nah(laenge(diff([...d.L], Rs)), laenge(diff([...d.L], P)) + laenge(diff(P, R)), 1e-9)).toBe(true);
  });
  it('Aufgabe 8: n ⊥ Spannvektoren, Gleichung und Probe, Spurpunkte, Abstand und Lotfußpunkt (Suche über E), gekürzt und positiv', () => {
    const d = D.A8;
    const u = diff([...d.A], [...d.B]);
    const v = diff([...d.A], [...d.C]);
    expect(kreuz(u, v)).toEqual(d.kreuz);
    expect(punkt(d.n, u)).toBe(0);
    expect(punkt(d.n, v)).toBe(0);
    expect(d.kreuz.map((c) => c / 9)).toEqual(d.n);
    expect([wert('8', 'n1'), wert('8', 'n2'), wert('8', 'n3'), wert('8', 'b')]).toEqual([1, 1, 2, 4]);
    for (const p of [d.A, d.B, d.C]) expect(punkt(d.n, [...p])).toBe(4);
    for (const [i, id] of [[0, 's1'], [1, 's2'], [2, 's3']] as [number, string][]) {
      const treffer: number[] = [];
      for (let k = -2000; k <= 2000; k++) {
        const x = [0, 0, 0];
        x[i] = k / 100;
        if (nah(punkt(d.n, x), d.d, 1e-9)) treffer.push(k / 100);
      }
      expect(treffer).toEqual([wert('8', id)]);
    }
    const u1 = [1, -1, 0].map((c) => c / Math.SQRT2);
    const v1 = [1, 1, -1].map((c) => c / Math.sqrt(3));
    expect(nah(punkt(u1, v1), 0)).toBe(true);
    expect(punkt(d.n, u1)).toBeCloseTo(0, 12);
    expect(punkt(d.n, v1)).toBeCloseTo(0, 12);
    // Suche des nächsten Punkts von E in der Ebene mit der Orthonormalbasis (u1, v1), Entfernung von F aus
    const F = [...d.F];
    expect(inE(d.n, 4, F)).toBe(true);
    expect(nah(naechsterAbstand([], u1, v1, [...d.Q], F), wert('8', 'a'), 0.01)).toBe(true);
    expect(vielfaches(diff(F, [...d.Q]), d.n)).toBe(true);
    expect(nah(laenge(diff(F, [...d.Q])), 5 / Math.sqrt(6), 1e-9)).toBe(true);
    expect([wert('8', 'f1'), wert('8', 'f2'), wert('8', 'f3')].every((x, i) => nah(x, F[i]!, 1e-9))).toBe(true);
    expect(Math.round(F[0]! * 100) / 100).toBeCloseTo(0.17, 12);
  });
  it('Aufgabe 9: Ebene BCS, Durchstoßpunkt, Dreieck BCS (r, s), K im Innern der Pyramide, Schacht bleibt bis X im Innern, Abstand', () => {
    const d = D.A9;
    const BC = diff([...d.B], [...d.C]);
    const BS = diff([...d.B], [...d.S]);
    expect(kreuz(BC, BS)).toEqual(d.kreuz);
    expect(d.kreuz.map((c) => c / 8)).toEqual(d.n);
    for (const p of [d.B, d.C, d.S]) expect(punkt(d.n, [...p])).toBe(d.d);
    expect([wert('9', 'n1'), wert('9', 'n2'), wert('9', 'n3'), wert('9', 'b')]).toEqual([2, 0, 1, 2]);
    // Quadrat mit Seite 4 in der x₁x₂-Ebene, Spitze über der Mitte
    const seiten = [diff([...d.A], [...d.B]), diff([...d.B], [...d.C]), diff([...d.C], [...d.D]), diff([...d.D], [...d.A])];
    for (const s of seiten) expect(laenge(s)).toBe(4);
    expect(punkt(seiten[0]!, seiten[1]!)).toBe(0);
    expect([(d.A[0] + d.C[0]) / 2, (d.A[1] + d.C[1]) / 2]).toEqual([d.S[0], d.S[1]]);
    // Schacht: nur ein t trifft E
    const treffer: number[] = [];
    for (let i = -2000; i <= 2000; i++) if (nah(punkt(d.n, gerade([...d.K], d.u, i / 1000)), d.d, 1e-9)) treffer.push(i / 1000);
    expect(treffer).toEqual([0.5]);
    expect(gerade([...d.K], d.u, 0.5)).toEqual([...d.X]);
    expect([wert('9', 'x1'), wert('9', 'x2'), wert('9', 'x3')]).toEqual([...d.X]);
    // Dreieck: X = B + r BC + s BS mit r = 3/8, s = 1/2
    const Xr = plus(plus([...d.B], mal(d.r, diff([...d.B], [...d.C]))), mal(d.s, diff([...d.B], [...d.S])));
    expect(Xr).toEqual([...d.X]);
    expect(d.r).toBeGreaterThanOrEqual(0);
    expect(d.s).toBeGreaterThanOrEqual(0);
    expect(d.r + d.s).toBeLessThanOrEqual(1);
    // K liegt im Innern: unter allen vier Seitenflächen und über dem Boden, jeder Punkt des Schachts bis X ebenfalls
    const flaechen: [number[], number][] = [];
    for (const [p, q] of [[d.A, d.B], [d.B, d.C], [d.C, d.D], [d.D, d.A]] as [typeof d.A, typeof d.A][]) {
      const nn = kreuz(diff([...p], [...q]), diff([...p], [...d.S]));
      flaechen.push([nn, punkt(nn, [...p])]);
    }
    for (const [nn, b] of flaechen) {
      // Vorzeichen von K stimmt mit dem Vorzeichen der Mitte der Grundfläche überein, X liegt auf genau einer Fläche (BCS)
      const mitteGrund = [d.S[0], d.S[1], 0];
      expect(Math.sign(punkt(nn, [...d.K]) - b)).toBe(Math.sign(punkt(nn, mitteGrund) - b));
    }
    for (let i = 0; i <= 49; i++) {
      const x = gerade([...d.K], d.u, i / 100);
      for (const [nn, b] of flaechen) expect(Math.sign(punkt(nn, x) - b), `t=${i / 100}`).toBe(Math.sign(punkt(nn, [d.S[0], d.S[1], 0]) - b));
      expect(x[2]).toBeGreaterThan(0);
    }
    // Abstand durch Suche über E
    const u1 = [0, 1, 0];
    const v1 = [1, 0, -2].map((c) => c / Math.sqrt(5));
    expect(punkt(d.n, u1)).toBe(0);
    expect(nah(punkt(d.n, v1), 0)).toBe(true);
    const F = plus([...d.K], mal(3 / 5, d.n));
    expect(inE(d.n, d.d, F)).toBe(true);
    expect(nah(naechsterAbstand([], u1, v1, [...d.K], F), wert('9', 'a'), 0.01)).toBe(true);
    expect(nah(3 / Math.sqrt(5), wert('9', 'a'), 0.01)).toBe(true);
  });
});

describe('Lösungswege und Felder stimmen überein', () => {
  beforeEach(() => {
    rendern(null);
  });
  const lösung = (nr: string) => texteAusHtml(alsText(aufgaben.find((a) => a.nummer === nr)!.loesung)).join(' | ');
  it('die Lösungswege nennen die Ergebnisse der Felder und die Zwischenwerte aus den Daten', () => {
    expect(lösung('1')).toContain('\\begin{pmatrix}6\\\\2\\\\6\\end{pmatrix}');
    expect(lösung('1')).toContain('3x_1+x_2+3x_3=9');
    expect(lösung('1')).toContain('a=2');
    expect(lösung('2')).toContain('x_1=4');
    expect(lösung('2')).toContain('x_2=6');
    expect(lösung('2')).toContain('x_3=2');
    expect(lösung('3')).toContain('t=2');
    expect(lösung('3')).toContain('S(3\\,|\\,2\\,|\\,-1)');
    expect(lösung('4')).toContain('P(3\\,|\\,1\\,|\\,0)');
    expect(lösung('4')).toContain('Q(3\\,|\\,3\\,|\\,2)');
    expect(lösung('5')).toContain('t=-1');
    expect(lösung('5')).toContain('\\begin{pmatrix}-3\\\\2\\\\1\\end{pmatrix}');
    expect(lösung('6')).toContain('a=-1');
    expect(lösung('6')).toContain('q=-3');
    expect(lösung('7')).toContain('54{,}74^{\\circ}');
    expect(lösung('7')).toContain('R(1\\,|\\,-1\\,|\\,0)');
    expect(lösung('7')).toContain('4{,}90');
    expect(lösung('8')).toContain('E:\\ x_1+x_2+2x_3=4');
    expect(lösung('8')).toContain('2{,}04');
    expect(lösung('8')).toContain('t=-\\frac{5}{6}');
    expect(lösung('8')).toContain('F(0{,}17\\,|\\,1{,}17\\,|\\,1{,}33)');
    expect(lösung('9')).toContain('E:\\ 2x_1+x_3=2');
    expect(lösung('9')).toContain('t=\\frac{1}{2}');
    expect(lösung('9')).toContain('r=\\frac{1}{8}');
    expect(lösung('9')).toContain('1{,}34');
  });
});

describe('Bilder im Raum', () => {
  const zahlenX1 = Array.from({ length: 2 * RAUM_GRENZE + 1 }, (_, i) => i - RAUM_GRENZE).filter((k) => k !== 0).map((k) => normiert(x1ZahlMitte(k)));
  const bilder: [string, RaumBildSpec][] = [
    ['Laser', B.raumLaser(false)], ['Laser mit P', B.raumLaser(true)],
    ['Solaranlage', B.raumSolar(false)], ['Solaranlage mit F', B.raumSolar(true)],
    ['Pyramide', B.raumPyramide(false, B.PYRAMIDE)], ['Pyramide mit X', B.raumPyramide(true, B.PYRAMIDE)],
  ];
  it('alle Punkte liegen im Koordinatensystem, keiner im Schrägbild auf einer Achse oder an derselben Bildstelle wie ein anderer, jedes Bild hat eine Textalternative und die feine Darstellung', () => {
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
      expect(s.fein, name).toBe(true);
      for (const l of s.linien!) for (const c of [...l.von, ...l.bis]) expect(Math.abs(c), `${name} Linie`).toBeLessThanOrEqual(RAUM_GRENZE + 1e-9);
      for (const f of s.flaechen ?? []) for (const e of f.ecken) for (const c of e) expect(Math.abs(c), `${name} Fläche`).toBeLessThanOrEqual(RAUM_GRENZE + 1e-9);
    }
  });
  it('jede Beschriftung hat Abstand zu allen Linien, Achsen, Achsenzahlen und anderen Beschriftungen', () => {
    for (const [name, s] of bilder) {
      const lagen = raumLagen(s);
      expect(lagen.length, name).toBe(s.punkte!.filter((p) => !p.ohneText && !p.nurText).length);
      for (const l of lagen) {
        const pt = s.punkte!.find((p) => p.name === l.name)!;
        const andere = [...zahlenX1, ...lagen.filter((x) => x !== l).map((x) => normiert(x.mitte))];
        const d = lageAbstand(l.lage, bildpunkt(pt.p), { bereich: RAUM_BEREICH, teilung: 1, linien: sperrlinienRaum(s.linien), belegt: andere });
        expect(d, `${name} ${l.name}`).toBeGreaterThanOrEqual(0.015);
      }
    }
  });
  it('Geraden erscheinen im Schrägbild weder als Punkt noch parallel zu einem Achsenbild (Bildrichtung mindestens 1,2 lang, Winkel zu den drei Achsenbildern mindestens 11 Grad)', () => {
    const richtungen: [string, number[]][] = [['Strahl', D.A7.u], ['reflektierter Strahl', D.A7.u2], ['Schacht', D.A9.u]];
    for (const [name, u] of richtungen) {
      const d = [u[1]! - u[0]! / 2, u[2]! - u[0]! / 2];
      const len = Math.hypot(d[0]!, d[1]!);
      expect(len, name).toBeGreaterThan(1.2);
      for (const ax of [[-0.5, -0.5], [1, 0], [0, 1]]) expect(grad(Math.acos(Math.min(1, Math.abs(d[0]! * ax[0]! + d[1]! * ax[1]!) / (len * Math.hypot(ax[0]!, ax[1]!))))), `${name} Winkel zur Achse`).toBeGreaterThan(11);
    }
  });
  it('Punkte und Beschriftungen liegen nicht bei den Achsentiteln x₁, x₂, x₃', () => {
    const titel = [[5.9, 0.37], [0.42, 6.1], [-2.76, -3.09]];
    for (const [name, s] of bilder) for (const p of s.punkte!) {
      const b = bildpunkt(p.p);
      for (const t of titel) expect(Math.hypot(b[0] - t[0]!, b[1] - t[1]!), `${name} ${p.name}`).toBeGreaterThan(1.2);
    }
  });
  it('die Bilder zeigen, was die Rechnung sagt: Strahl und Decke, Ebene durch A, B, C mit Lot, Pyramide mit Schacht', () => {
    const pk = (s: RaumBildSpec, n: string) => s.punkte!.find((p) => p.name === n)!.p;
    const auf = (p: number[], q: number[], u: number[]) => kreuz(diff(p, q), u).every((c) => Math.abs(c) < 1e-9);
    // Laser
    const la = B.raumLaser(true);
    expect(pk(la, 'P')).toEqual([...D.A7.P]);
    expect(pk(la, 'R')).toEqual([...D.A7.Fl]);
    expect(pk(la, 'L′')).toEqual([...D.A7.Ls]);
    for (const f of la.flaechen!) expect(f.ecken.every((e) => e[2] === D.A7.decke)).toBe(true);
    const orange = la.linien!.find((l) => l.farbe === D.ORANGE)!;
    expect([...orange.von]).toEqual([...D.A7.L]);
    expect([...orange.bis]).toEqual([...D.A7.P]);
    const rosa = la.linien!.find((l) => l.farbe === D.ROSA)!;
    expect(auf([...rosa.von], [...rosa.bis], D.A7.u2)).toBe(true);
    const vorher = B.raumLaser(false);
    expect(vorher.punkte!.map((p) => p.name)).toEqual(['L']);
    const strahl = vorher.linien!.find((l) => l.farbe === D.ORANGE)!;
    expect(auf([...strahl.von], [...strahl.bis], D.A7.u)).toBe(true);
    expect(strahl.bis[2]).toBeLessThan(D.A7.decke);
    // Solaranlage
    const so = B.raumSolar(true);
    for (const n of ['A', 'B', 'C']) expect(nah(punkt(D.A8.n, [...pk(so, n)]), D.A8.d)).toBe(true);
    for (const f of so.flaechen!) for (const e of f.ecken) expect(nah(punkt(D.A8.n, e), D.A8.d, 1e-9)).toBe(true);
    const lot = so.linien!.find((l) => l.farbe === D.ROSA)!;
    expect([...lot.von]).toEqual([...D.A8.Q]);
    expect(auf([...lot.von], [...lot.bis], D.A8.n)).toBe(true);
    expect(nah(punkt(D.A8.n, [...lot.bis]), D.A8.d, 1e-9)).toBe(true);
    expect(B.raumSolar(false).punkte!.some((p) => p.name === 'F')).toBe(false);
    // Pyramide
    const py = B.raumPyramide(true, B.PYRAMIDE);
    expect(pk(py, 'X')).toEqual([...D.A9.X]);
    const flaeche = py.flaechen![0]!;
    expect(flaeche.ecken).toEqual([D.A9.B, D.A9.C, D.A9.S]);
    const schacht = py.linien!.find((l) => l.farbe === D.ORANGE)!;
    expect([...schacht.von]).toEqual([...D.A9.K]);
    expect(auf([...schacht.von], [...schacht.bis], D.A9.u)).toBe(true);
    expect(auf([...schacht.von], [...D.A9.X], D.A9.u)).toBe(true);
    expect(schacht.bis[0]).toBeGreaterThan(D.A9.X[0]);
    const lotP = py.linien!.find((l) => l.farbe === D.ROSA)!;
    expect(auf([...lotP.von], [...lotP.bis], D.A9.n)).toBe(true);
    expect(nah(punkt(D.A9.n, [...lotP.bis]), D.A9.d, 1e-9)).toBe(true);
    expect(B.raumPyramide(false, B.PYRAMIDE).punkte!.some((p) => p.name === 'X')).toBe(false);
  });
});
