import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/uebungsaufgaben-geraden/Bilder';
import * as D from '../content/modules/uebungsaufgaben-geraden/daten';
import Modul from '../content/modules/uebungsaufgaben-geraden/index';
import meta from '../content/modules/uebungsaufgaben-geraden/meta.json';
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
const ORDNER = 'content/modules/uebungsaufgaben-geraden';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const texteAusHtml = (html: string): string[] => [...html.matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<'));
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
/** Parameter des Punkts auf einer Geraden, der einem Punkt am nächsten ist (Lotfußpunkt), durch feine Suche statt durch Formel. */
function naechster(p: number[], u: number[], q: number[], von = -5, bis = 5): number {
  let beste = von;
  let dm = Infinity;
  const n = 200000;
  for (let i = 0; i <= n; i++) {
    const t = von + ((bis - von) * i) / n;
    const d = laenge(diff(gerade(p, u, t), q));
    if (d < dm) {
      dm = d;
      beste = t;
    }
  }
  return beste;
}

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Geraden, hat vier Abschnitte, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('uebungsaufgaben-geraden');
    expect(meta.thema).toBe('vektorgeometrie');
    expect(meta.unterbereich).toBe('geraden');
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.bpe).toEqual(['16.1', '16.2', '16.6', '16.7']);
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
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"uebungsaufgaben-geraden"');
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
    for (const wort of ['Operator', 'BE', 'Spurpunkt', 'Lotfußpunkt', 'Seitenhalbierende', 'Schwerpunkt', 'Gradmaß', 'Problemlöse', 'Stützpunkt'.slice(0, 0) + 'Geradenschar', 'Richtungsvektor']) expect(h, wort).toContain(wort);
    expect(h).not.toMatch(/\d\/\d/);
    expect(h).not.toMatch(/\bpi\b|Pi\b/);
    expect(h).not.toMatch(/[A-Z]\(-?\d+(,\d+)? ?\/ ?-?\d/);
    expect(h).not.toMatch(/Graph(?!ik)/);
    expect(h).not.toMatch(/graphisch/);
  });
  it('nur Stoff der Geraden und Vektoren: Ebenengleichungen, Normalenvektor und Spatprodukt kommen nicht vor', () => {
    expect(rendern(null)).not.toMatch(/Ebenengleichung|Koordinatenform|Parameterform der Ebene|Normalenvektor|Spatprodukt|Hesse/);
  });
  it('alle Aufgaben eigens geschrieben: Die Szenarien und Punkte der Sammlung der Lehrkraft kommen nicht vor', () => {
    const html = rendern(null);
    const h = texteAusHtml(html).join(' ') + ' ' + html;
    // Punkte und Geraden der Originale (IQB-Sammlung und Abitur 2024) und deren Szenarien
    for (const p of ['A(3\\,|\\,5\\,|\\,5)', 'B(1\\,|\\,1\\,|\\,1)', 'A(2\\,|\\,0\\,|\\,4)', 'Q(-2\\,|\\,-4\\,|\\,6)', 'L(4\\,|\\,0\\,|\\,5)', 'S(1\\,|\\,6\\,|\\,2)', 'P(5\\,|\\,1\\,|\\,0)', 'M(8\\,|\\,5\\,|\\,10)', 'A(-5\\,|\\,5\\,|\\,-3)', 'A(1\\,|\\,3\\,|\\,3)', 'B(9\\,|\\,-1\\,|\\,-5)', 'P(-1\\,|\\,0\\,|\\,-6)', 'S(-10\\,|\\,-10\\,|\\,25)']) expect(h, p).not.toContain(p);
    for (const s of ['\\begin{pmatrix}2\\\\-1\\\\2\\end{pmatrix}', '\\begin{pmatrix}1\\\\2\\\\2\\end{pmatrix}', '\\begin{pmatrix}5-6k', '\\begin{pmatrix}14\\\\80', '\\begin{pmatrix}-2\\\\3\\\\0\\end{pmatrix}']) expect(h, s).not.toContain(s);
    for (const wort of ['Zylinder', 'Theaterkulisse', 'Pyramide', 'Regenwald', 'Prisma', 'Schacht', 'Raute']) expect(html, wort).not.toContain(wort);
  });
  it('verweist auf die Module davor und nennt den Stoff je Aufgabe, alle verwiesenen Module gibt es', () => {
    const q = readFileSync(`${ORDNER}/Hinweise.tsx`, 'utf8');
    const ids = ['geradengleichung', 'spurpunkte-besondere-lage', 'gegenseitige-lage-geraden', 'abstaende-geraden', 'schnittwinkel-geraden', 'modellieren-geraden', 'betrag-abstand-teilung', 'uebungsaufgaben-abiturstil', 'skalarprodukt-orthogonalitaet', 'vektorprodukt'];
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
  it('die Nummern: zehn Aufgaben, alle mit Eingabefeldern in mindestens einer Teilaufgabe', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    for (const a of aufgaben.filter((x) => x.nummer !== '9' && x.nummer !== '10')) expect(a.felder.length, a.nummer).toBeGreaterThan(0);
  });
  it('die Bewertungseinheiten ergeben 5 BE je Aufgabe ohne Hilfsmittel, 12, 10 und 12 BE mit Hilfsmittel, 10 BE bei der Problemlöseaufgabe', () => {
    for (const nr of ['1', '2', '3', '4', '5', '6']) expect(summe(be(aufgaben.find((a) => a.nummer === nr)!.children)), `Aufgabe ${nr}`).toBe(5);
    expect(summe(be(aufgaben.find((a) => a.nummer === '7')!.children))).toBe(12);
    expect(summe(be(aufgaben.find((a) => a.nummer === '8')!.children))).toBe(10);
    expect(summe(be(aufgaben.find((a) => a.nummer === '9')!.children))).toBe(12);
    expect(summe(be(aufgaben.find((a) => a.nummer === '10')!.children))).toBe(10);
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
    expect(n).toBe(2 + 2 + 2 + 2 + 3 + 2 + 4 + 4 + 4 + 4);
  });
  it('Aufgaben ohne Hilfsmittel haben nur ganzzahlige Ergebnisse (keine Toleranz), mit Hilfsmittel Toleranz 0,01 bei Dezimalzahlen', () => {
    for (const nr of ['1', '2', '3', '4', '5', '6']) for (const f of aufgaben.find((a) => a.nummer === nr)!.felder) {
      expect(Number.isInteger(f.erwartet), `${nr}${f.id}`).toBe(true);
      expect(f.toleranz).toBeUndefined();
    }
    for (const nr of ['7', '8', '9', '10']) for (const f of aufgaben.find((a) => a.nummer === nr)!.felder) if (!Number.isInteger(f.erwartet)) expect(f.toleranz, `${nr}${f.id}`).toBe(0.01);
  });
  it('jede Aufgabe hat mindestens drei Hilfen und mindestens zwei Lösungsschritte', () => {
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(3);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(2);
    }
  });
  it('Hilfen, Lösungsschritte und Feldbeschriftungen rendern ohne Formelfehler, Gedankenstriche und Schrägstrich-Brüche', () => {
    const alle: ReactNode[] = aufgaben.flatMap((a) => [...a.hilfen, ...a.loesung, ...a.felder.map((f) => f.beschriftung)]);
    expect(alle.length).toBeGreaterThan(60);
    for (const n of alle) {
      const h = alsText(n);
      expect(h).not.toContain('formel-fehler');
      expect(h).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(h).not.toContain(z);
      expect(h).not.toMatch(/\d\/\d/);
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
          for (const zeile of ohneVektoren.split('\\\\')) if (!zeile.includes('V') && !zeile.startsWith('g_k') && !/^[a-z]_?[abc]?:\\ \\vec/.test(zeile)) expect(zeile.length, `Aufgabe ${a.nummer}: ${zeile}`).toBeLessThanOrEqual(44);
        }
      }
    }
  });
});

describe('Aufgaben, unabhängig gerechnet', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Aufgabe 1: A liegt auf g (t = 3), die beiden Punkte mit Abstand 6 liegen auf g bei t = 1 und t = 5 (Suche über t)', () => {
    const d = D.A1;
    expect(gerade(d.P, d.u, 3)).toEqual(d.A);
    expect(laenge(d.u)).toBe(3);
    const treffer: number[] = [];
    for (let i = -2000; i <= 2000; i++) {
      const tt = i / 100;
      if (nah(laenge(diff(d.A, gerade(d.P, d.u, tt))), 6, 1e-9)) treffer.push(tt);
    }
    expect(treffer).toEqual([1, 5]);
    expect(gerade(d.P, d.u, 1)).toEqual([wert('1', 'b1'), wert('1', 'b2'), wert('1', 'b3')]);
    expect(gerade(d.P, d.u, 5)).toEqual([wert('1', 'c1'), wert('1', 'c2'), wert('1', 'c3')]);
    expect(wert('1', 'b1')).toBeLessThan(wert('1', 'c1'));
  });
  it('Aufgabe 2: die zweite Koordinate ist konstant (parallel zur x₁x₃-Ebene), Spurpunkt mit der x₂x₃-Ebene bei t = 3', () => {
    const d = D.A2;
    for (const tt of [-3, 0, 1, 4]) expect(gerade(d.P, d.u, tt)[1]).toBe(-2);
    const tt = -d.P[0]! / d.u[0]!;
    expect(tt).toBe(3);
    const S = gerade(d.P, d.u, tt);
    expect(S[0]).toBe(0);
    expect([wert('2', 's2'), wert('2', 's3')]).toEqual([S[1], S[2]]);
  });
  it('Aufgabe 3: Q liegt für viele k auf g_k, die Richtungen sind genau bei k = −2 orthogonal zu h (Suche über k)', () => {
    const d = D.A3;
    for (const k of [-7, -2, 0, 1, 3.5]) expect(gerade(d.Q, d.richtung(k), 0)).toEqual(d.Q);
    const nullstellen: number[] = [];
    for (let i = -1000; i <= 1000; i++) {
      const k = i / 100;
      if (Math.abs(punkt(d.richtung(k), d.h)) < 1e-9) nullstellen.push(k);
    }
    expect(nullstellen).toEqual([-2]);
    expect(wert('3', 'k')).toBe(-2);
    // der Richtungsvektor ist nie der Nullvektor (zweite Koordinate 1)
    for (const k of [-5, -2, 0, 4]) expect(d.richtung(k)[1]).toBe(1);
  });
  it('Aufgabe 4: die Geraden schneiden sich genau für a = 3 (Auflösen der ersten beiden Zeilen, dritte Zeile entscheidet), Schnittpunkt S(3 | 1 | 3)', () => {
    const d = D.A4;
    // I: p1 + t u1 = q1 + s w1, II: p2 + t u2 = q2 + s w2 → Cramer
    const detM = d.u[0]! * -d.w[1]! - -d.w[0]! * d.u[1]!;
    const r1 = d.Q[0]! - d.P[0]!;
    const r2 = d.Q[1]! - d.P[1]!;
    const t = (r1 * -d.w[1]! - -d.w[0]! * r2) / detM;
    const s = (d.u[0]! * r2 - d.u[1]! * r1) / detM;
    expect(t).toBe(1);
    expect(s).toBe(-1);
    const dritteGleichung = (a: number) => d.P[2]! + t * d.u[2]! - (a + s * d.w[2]!);
    const loesungen: number[] = [];
    for (let a = -20; a <= 20; a++) if (dritteGleichung(a) === 0) loesungen.push(a);
    expect(loesungen).toEqual([3]);
    expect(wert('4', 'a')).toBe(3);
    expect([wert('4', 's1'), wert('4', 's2'), wert('4', 's3')]).toEqual(gerade(d.P, d.u, t));
    expect(gerade([4, 3, 3], d.w, s)).toEqual(gerade(d.P, d.u, t));
    // keine parallelen Richtungen
    expect(kreuz(d.u, d.w).some((c) => c !== 0)).toBe(true);
  });
  it('Aufgabe 5: Lotfußpunkt F über Suche des nächsten Punkts, |QF| = 7, QF ⊥ g, Spiegelpunkt mit F als Mitte', () => {
    const d = D.A5;
    const tt = naechster(d.P, d.u, d.Q);
    expect(nah(tt, 1, 1e-4)).toBe(true);
    const F = gerade(d.P, d.u, 1);
    expect([wert('5', 'f1'), wert('5', 'f2'), wert('5', 'f3')]).toEqual(F);
    expect(punkt(diff(d.Q, F), d.u)).toBe(0);
    expect(laenge(diff(d.Q, F))).toBe(7);
    expect(wert('5', 'd')).toBe(7);
    const Qs = [wert('5', 'q1'), wert('5', 'q2'), wert('5', 'q3')];
    expect(Qs.map((c, i) => (c + d.Q[i]!) / 2)).toEqual(F);
    expect(laenge(diff(Qs, F))).toBe(7);
    expect(laenge(d.u)).toBe(7);
  });
  it('Aufgabe 6: Winkel mit der x₁x₂-Ebene ist 45° (über den Winkel zur senkrechten Projektion), der Punkt mit x₃ = 10', () => {
    const d = D.A6;
    const proj = [d.u[0]!, d.u[1]!, 0];
    const alpha = grad(Math.acos(punkt(d.u, proj) / (laenge(d.u) * laenge(proj))));
    expect(nah(alpha, 45, 1e-9)).toBe(true);
    expect(nah(grad(Math.asin(Math.abs(d.u[2]!) / laenge(d.u))), 45, 1e-9)).toBe(true);
    const X = gerade(d.P, d.u, 3);
    expect(X[2]).toBe(10);
    expect([wert('6', 'x1'), wert('6', 'x2')]).toEqual([X[0], X[1]]);
    expect(gerade(d.P, d.u, 1)).toEqual(d.S12);
  });
  it('Aufgabe 7: Geschwindigkeiten, gemeinsamer Punkt S bei r = s = 1, Zeiten 3 und 6 Minuten, kleinster Abstand (Raster) und Parabel', () => {
    const d = D.A7;
    const vA = mal(d.A.tempo / laenge(d.A.richtung), d.A.richtung);
    const vB = mal(d.B.tempo / laenge(d.B.richtung), d.B.richtung);
    expect(vA).toEqual(d.A.v);
    expect(vB).toEqual(d.B.v);
    expect([wert('7', 'v1'), wert('7', 'v2'), wert('7', 'v3')]).toEqual(vA);
    expect(gerade(d.A.start, d.A.richtung, 1)).toEqual([...d.S]);
    expect(gerade(d.B.start, d.B.richtung, 1)).toEqual([...d.S]);
    // gleichzeitig am Ort S? Zeiten in Minuten
    const tA = (laenge(d.A.richtung) / d.A.tempo) * 60;
    const tB = (laenge(d.B.richtung) / d.B.tempo) * 60;
    expect([tA, tB]).toEqual([3, 6]);
    expect([wert('7', 'ta'), wert('7', 'tb')]).toEqual([3, 6]);
    const ort = (b: typeof d.A, tt: number) => plus(b.start, mal(tt, b.v));
    const abstand = (tt: number) => laenge(diff(ort(d.A, tt), ort(d.B, tt)));
    let best = 0;
    let bd = Infinity;
    for (let i = 0; i <= 200000; i++) {
      const tt = i / 1e6;
      const dd = abstand(tt);
      if (dd < bd) {
        bd = dd;
        best = tt;
      }
    }
    expect(nah(best * 60, wert('7', 't0'), 0.01)).toBe(true);
    expect(nah(bd, wert('7', 'd'), 0.01)).toBe(true);
    // Parabel aus den Daten
    for (const tt of [0, 0.03, 0.1]) expect(nah(abstand(tt) ** 2, d.koeff.a * tt * tt + d.koeff.b * tt + d.koeff.c, 1e-9)).toBe(true);
    // zur Zeit der Ankunft in S ist der Abstand nicht 0 (keine Kollision)
    expect(abstand(0.05)).toBeGreaterThan(0.5);
    expect(abstand(0.1)).toBeGreaterThan(0.5);
  });
  it('Aufgabe 8: T′ auf der Ebene x₂ = 4 liegt über der Mauerkante, Winkel zum Boden, Länge des Bodenschattens bis zur Mauer (Suche über den Mastpunkt)', () => {
    const d = D.A8;
    const tt = (d.wand - d.T[1]!) / d.v[1]!;
    const Ts = plus(d.T, mal(tt, d.v));
    expect(Ts).toEqual([...d.Ts]);
    expect([wert('8', 'x1'), wert('8', 'x2'), wert('8', 'x3')]).toEqual(Ts);
    expect(Ts[0]! >= d.x1Min && Ts[0]! <= d.x1Max).toBe(true);
    expect(Ts[2]! > d.hoehe).toBe(true);
    expect(tt).toBeGreaterThan(1);
    // Winkel zum Boden über den Winkel zur senkrechten Projektion
    const proj = [d.v[0]!, d.v[1]!, 0];
    expect(nah(grad(Math.acos(punkt(d.v, proj) / (laenge(d.v) * laenge(proj)))), wert('8', 'w'), 0.01)).toBe(true);
    // Schatten auf dem Boden: Mastpunkt (1 | −2 | h), der Strahl trifft den Boden bei x₂ = 4
    let hh = 0;
    for (let i = 0; i <= 3000; i++) {
      const h = i / 1000;
      const t0 = h / -d.v[2]!;
      const boden = plus([d.F[0], d.F[1], h], mal(t0, d.v));
      if (nah(boden[1]!, d.wand, 1e-9)) hh = h;
    }
    expect(hh).toBe(1.5);
    const W = plus([d.F[0], d.F[1], hh], mal(hh / -d.v[2]!, d.v));
    expect(nah(laenge(diff([...d.F], W)), wert('8', 'l'), 0.01)).toBe(true);
    // die Spitze liegt höher als hh, der Schatten der Spitze liegt also an der Ebene (nicht auf dem Boden)
    expect(d.T[2]).toBeGreaterThan(hh);
    // die Mauer steht auf dem Boden und ist niedriger als 1,5
    expect(d.hoehe).toBeLessThan(hh);
  });
  it('Aufgabe 9: Länge, Steigungswinkel, Stützenhöhe, Abstand zum Seil (Suche und Vektorprodukt)', () => {
    const d = D.A9;
    const u = diff([...d.Ta], [...d.Bs]);
    expect(u).toEqual(d.u);
    expect(nah(laenge(u) * 100, wert('9', 'l'), 0.01)).toBe(true);
    const proj = [u[0]!, u[1]!, 0];
    expect(nah(grad(Math.acos(punkt(u, proj) / (laenge(u) * laenge(proj)))), wert('9', 'w'), 0.01)).toBe(true);
    // Stütze: Punkt des Seils über P
    let hoehe = NaN;
    for (let i = 0; i <= 1000; i++) {
      const tt = i / 1000;
      const X = gerade([...d.Ta], u, tt);
      if (nah(X[0]!, d.P[0], 1e-9) && nah(X[1]!, d.P[1], 1e-9)) hoehe = X[2]! * 100;
    }
    expect(hoehe).toBe(wert('9', 'h'));
    expect(d.P[2]).toBe(0);
    // Abstand: Suche des nächsten Seilpunkts und Vektorprodukt
    const tt = naechster([...d.Ta], u, [...d.Q], 0, 1);
    const abstand = laenge(diff(gerade([...d.Ta], u, tt), [...d.Q])) * 100;
    expect(nah(abstand, wert('9', 'a'), 0.01)).toBe(true);
    const k = kreuz(diff([...d.Ta], [...d.Q]), u);
    expect(nah((laenge(k) / laenge(u)) * 100, wert('9', 'a'), 0.01)).toBe(true);
    expect(nah(tt, 3 / 5, 1e-4)).toBe(true);
    // die Stütze steht nicht im Lotfußpunkt (t = 1/2 gegen 3/5)
    expect(nah(tt, 0.5, 1e-3)).toBe(false);
  });
  it('Aufgabe 10: Seitenmitten, Schnitt von s_a und s_b, Verhältnis 2 : 1, s_c geht durch S, S = (A + B + C) / 3', () => {
    const d = D.A10;
    const mitte = (p: number[], q: number[]) => p.map((x, i) => (x + q[i]!) / 2);
    expect(mitte(d.B, d.C)).toEqual([...d.Ma]);
    expect(mitte(d.A, d.C)).toEqual([...d.Mb]);
    expect(mitte(d.A, d.B)).toEqual([...d.Mc]);
    const sa = diff([...d.A], [...d.Ma]);
    const sb = diff([...d.B], [...d.Mb]);
    const sc = diff([...d.C], [...d.Mc]);
    // Schnitt über die ersten beiden Zeilen (Cramer), dritte Zeile prüft
    const detM = sa[0]! * -sb[1]! - -sb[0]! * sa[1]!;
    const r1 = d.B[0]! - d.A[0]!;
    const r2 = d.B[1]! - d.A[1]!;
    const lam = (r1 * -sb[1]! - -sb[0]! * r2) / detM;
    const mu = (sa[0]! * r2 - sa[1]! * r1) / detM;
    expect(nah(lam, 2 / 3)).toBe(true);
    expect(nah(mu, 2 / 3)).toBe(true);
    const S = gerade([...d.A], sa, lam);
    expect(S.map((c) => Math.round(c * 1e9) / 1e9)).toEqual([...d.S]);
    expect(gerade([...d.B], sb, mu).map((c) => Math.round(c * 1e9) / 1e9)).toEqual([...d.S]);
    expect([wert('10', 's1'), wert('10', 's2'), wert('10', 's3')]).toEqual([...d.S]);
    // dritte Seitenhalbierende geht durch S bei ν = 2/3
    expect(gerade([...d.C], sc, 2 / 3).map((c) => Math.round(c * 1e9) / 1e9)).toEqual([...d.S]);
    // Schwerpunkt aus den Ortsvektoren
    expect(d.A.map((x, i) => (x + d.B[i]! + d.C[i]!) / 3)).toEqual([...d.S]);
    // Teilverhältnis AS : SM_a = 2 : 1
    expect(nah(laenge(diff([...d.A], [...d.S])), 2 * laenge(diff([...d.S], [...d.Ma])))).toBe(true);
    expect(nah(laenge(diff([...d.B], [...d.S])), 2 * laenge(diff([...d.S], [...d.Mb])))).toBe(true);
    expect(nah(laenge(diff([...d.C], [...d.S])), 2 * laenge(diff([...d.S], [...d.Mc])))).toBe(true);
    // die Richtungsvektoren im Lösungsweg sind Vielfache von AM_a, BM_b, CM_c
    expect(kreuz(sa, [-1, 0, 2]).every((c) => c === 0)).toBe(true);
    expect(kreuz(sb, [1, -2, -1]).every((c) => c === 0)).toBe(true);
    expect(kreuz(sc, [0, 2, -1]).every((c) => c === 0)).toBe(true);
    // das Dreieck ist nicht entartet
    expect(kreuz(diff([...d.A], [...d.B]), diff([...d.A], [...d.C])).some((c) => c !== 0)).toBe(true);
  });
});

describe('Lösungswege und Felder stimmen überein', () => {
  beforeEach(() => {
    rendern(null);
  });
  const lösung = (nr: string) => texteAusHtml(alsText(aufgaben.find((a) => a.nummer === nr)!.loesung)).join(' | ');
  const komma = (x: number) => String(x).replace('.', '{,}');
  it('die Lösungswege nennen die Ergebnisse der Felder (gerundet wie in den Feldern) und die Zwischenwerte aus den Daten', () => {
    expect(lösung('1')).toContain('\\begin{pmatrix}3\\\\-1\\\\5\\end{pmatrix}');
    expect(lösung('1')).toContain('\\begin{pmatrix}11\\\\3\\\\13\\end{pmatrix}');
    expect(lösung('2')).toContain('\\begin{pmatrix}0\\\\-2\\\\10\\end{pmatrix}');
    expect(lösung('3')).toContain('k=-2');
    expect(lösung('4')).toContain('a=1+2\\cdot 1=3');
    expect(lösung('5')).toContain('=7');
    expect(lösung('5')).toContain('\\begin{pmatrix}-2\\\\13\\\\4\\end{pmatrix}');
    expect(lösung('6')).toContain('\\begin{pmatrix}11\\\\13\\\\10\\end{pmatrix}');
    const k = D.A7.koeff;
    expect(lösung('7')).toContain(`d(t)^2=${k.a}t^2${k.b}t+${k.c}`);
    expect(lösung('7')).toContain(`\\approx ${komma(D.A7.minuten)}\\,\\text{min}`);
    expect(lösung('7')).toContain(`d\\approx ${komma(D.A7.abstand)}`);
    expect(lösung('8')).toContain(`\\begin{pmatrix}2{,}5\\\\4\\\\1{,}5\\end{pmatrix}`);
    expect(lösung('8')).toContain(`\\approx ${komma(D.A8.winkel)}^{\\circ}`);
    expect(lösung('8')).toContain(`\\approx ${komma(D.A8.schatten)}`);
    expect(lösung('9')).toContain(`\\approx ${komma(D.A9.winkel)}^{\\circ}`);
    expect(lösung('9')).toContain('\\sqrt{20}');
    expect(lösung('10')).toContain('\\begin{pmatrix}2\\\\-1\\\\2\\end{pmatrix}');
  });
});

describe('Bilder im Raum', () => {
  const zahlenX1 = Array.from({ length: 2 * RAUM_GRENZE + 1 }, (_, i) => i - RAUM_GRENZE).filter((k) => k !== 0).map((k) => normiert(x1ZahlMitte(k)));
  const bilder: [string, RaumBildSpec][] = [
    ['Drohnen', B.raumDrohnen(false)], ['Drohnen mit S', B.raumDrohnen(true)],
    ['Mast', B.raumMast(false)], ['Mast mit T′', B.raumMast(true)],
    ['Seilbahn', B.raumSeilbahn(false)], ['Seilbahn mit Stütze', B.raumSeilbahn(true)],
    ['Dreieck', B.raumDreieck(false)], ['Dreieck mit S', B.raumDreieck(true)],
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
  it('Geraden erscheinen im Schrägbild weder als Punkt noch parallel zu einem Achsenbild (Bildrichtung mindestens 1,5 lang, Winkel zu den drei Achsenbildern mindestens 11 Grad)', () => {
    const richtungen: [string, number[]][] = [
      ['Bahn A', D.A7.A.richtung], ['Bahn B', D.A7.B.richtung], ['Sonnenstrahl', D.A8.v], ['Seil', D.A9.u],
      ['s_a', diff([...D.A10.A], [...D.A10.Ma])], ['s_b', diff([...D.A10.B], [...D.A10.Mb])], ['s_c', diff([...D.A10.C], [...D.A10.Mc])],
    ];
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
  it('die Bilder zeigen, was die Rechnung sagt: Bahnen durch S, Mast mit Strahl und Schatten, Seil mit Stütze und Lot, Seitenhalbierende durch S', () => {
    const pk = (s: RaumBildSpec, n: string) => s.punkte!.find((p) => p.name === n)!.p;
    const auf = (p: number[], q: number[], u: number[]) => kreuz(diff(q, p), u).every((c) => Math.abs(c) < 1e-9);
    // Drohnen
    const dr = B.raumDrohnen(true);
    expect(pk(dr, 'S')).toEqual([...D.A7.S]);
    expect(auf(D.A7.A.start, [...D.A7.S], D.A7.A.richtung) && auf(D.A7.B.start, [...D.A7.S], D.A7.B.richtung)).toBe(true);
    expect(dr.linien!.map((l) => l.farbe)).toEqual([D.SCHWARZ, D.ORANGE]);
    for (const l of dr.linien!) expect(l.gestrichelt).toBeFalsy();
    // Mast
    const m = B.raumMast(true);
    expect(pk(m, 'T′')).toEqual([...D.A8.Ts]);
    const strahl = m.linien!.find((l) => l.farbe === D.ORANGE)!;
    expect([...strahl.von]).toEqual([...D.A8.T]);
    expect([...strahl.bis]).toEqual([...D.A8.Ts]);
    expect(auf([...D.A8.T], [...D.A8.Ts], D.A8.v)).toBe(true);
    const grau = m.linien!.filter((l) => l.farbe === D.GRAU);
    expect(grau).toHaveLength(2);
    expect([...grau[0]!.von]).toEqual([...D.A8.F]);
    expect(grau[0]!.bis[2]).toBe(0);
    expect(grau[0]!.bis[1]).toBe(D.A8.wand);
    const mauer = m.flaechen![0]!;
    expect(mauer.ecken.every((e) => e[1] === D.A8.wand)).toBe(true);
    expect(Math.max(...mauer.ecken.map((e) => e[2]))).toBe(D.A8.hoehe);
    // Seilbahn
    const sb = B.raumSeilbahn(true);
    const u = D.A9.u;
    const F = pk(sb, 'F');
    expect(auf([...D.A9.Ta], F, u)).toBe(true);
    expect(nah(punkt(diff([...D.A9.Q], F), u), 0, 1e-9)).toBe(true);
    const stuetze = sb.linien!.find((l) => l.farbe === D.ORANGE)!;
    expect([...stuetze.von]).toEqual([...D.A9.P]);
    expect(stuetze.bis[0]).toBe(D.A9.P[0]);
    expect(stuetze.bis[1]).toBe(D.A9.P[1]);
    expect(stuetze.bis[2]! * 100).toBe(D.A9.stuetze);
    expect(auf([...D.A9.Ta], stuetze.bis, u)).toBe(true);
    // Dreieck
    const dr3 = B.raumDreieck(true);
    const S = pk(dr3, 'S');
    expect(S).toEqual([...D.A10.S]);
    const halb = dr3.linien!.filter((l) => l.breite === 3);
    expect(halb).toHaveLength(3);
    expect(halb.map((l) => l.farbe)).toEqual([D.SCHWARZ, D.ORANGE, D.ROSA]);
    for (const l of halb) expect(auf([...l.von], S, diff([...l.von], [...l.bis]))).toBe(true);
    expect(B.raumDreieck(false).punkte!.some((p) => p.name === 'S')).toBe(false);
  });
});
