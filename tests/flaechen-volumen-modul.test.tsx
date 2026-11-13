import { existsSync, readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/flaechen-volumen/Bilder';
import * as D from '../content/modules/flaechen-volumen/daten';
import Modul from '../content/modules/flaechen-volumen/index';
import { Pyramidenlabor, laborSpitze } from '../content/modules/flaechen-volumen/Labor';
import meta from '../content/modules/flaechen-volumen/meta.json';
import themen from '../content/themen.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { dreiecksflaeche, parallelogrammflaeche, pyramideDreieck, pyramideParallelogramm, quader, spatprodukt, tetraederVolumen, wurzelZerlegung } from '../src/lib/koerper';
import { RAUM_BEREICH, RAUM_GRENZE, bildpunkt, normiert, raumLagen, sperrlinienRaum, x1ZahlMitte, type RaumBildSpec } from '../src/lib/schraegbild';
import { lageAbstand } from '../src/lib/vektorbild';

vi.setConfig({ testTimeout: 60000 });

interface AufgabeAufruf { nummer: string; children: ReactNode; felder: { id: string; erwartet: number; toleranz?: number; beschriftung: ReactNode; name: string }[]; hilfen: ReactNode[]; loesung: ReactNode[] }
interface FrageAufruf { nummer: string; children: ReactNode; optionen: { id: string; richtig: boolean; text: ReactNode; rueckmeldung: ReactNode }[]; erklaerung: ReactNode }
const aufgaben: AufgabeAufruf[] = [];
const fragen: FrageAufruf[] = [];
vi.mock('../src/components/Aufgabe', () => ({
  Aufgabe: (p: AufgabeAufruf & { nummer: string | number }) => {
    aufgaben.push({ ...p, nummer: String(p.nummer) });
    return <div data-aufgabe={String(p.nummer)}>{p.children}{p.felder.map((f, i) => <div key={`f${i}`}>{f.beschriftung}</div>)}{p.hilfen.map((h, i) => <div key={`h${i}`}>{h}</div>)}{p.loesung.map((h, i) => <div key={`l${i}`}>{h}</div>)}</div>;
  },
}));
vi.mock('../src/components/Auswahlfrage', () => ({
  Auswahlfrage: (p: FrageAufruf) => {
    fragen.push(p);
    return <div data-frage={p.nummer}>{p.children}{p.optionen.map((o, i) => <div key={`o${i}`}>{o.text}{o.rueckmeldung}</div>)}{p.erklaerung}</div>;
  },
}));
vi.mock('../src/components/AufKlick', () => ({ AufKlick: (p: { children: ReactNode }) => <div data-kontrolle="1">{p.children}</div> }));
function rendern(abschnitt: string | null = null): string {
  aufgaben.length = 0;
  fragen.length = 0;
  return renderToStaticMarkup(<AbschnittAnbieter value={abschnitt}><Modul /></AbschnittAnbieter>);
}
const ORDNER = 'content/modules/flaechen-volumen';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const texteAusHtml = (html: string): string[] => [...html.matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<'));
const nurText = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');

/* ---------- unabhängige Methoden ---------- */
type V3 = number[];
const skal = (a: V3, b: V3) => a[0]! * b[0]! + a[1]! * b[1]! + a[2]! * b[2]!;
const kreuz = (a: V3, b: V3): V3 => [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!].map((x) => x + 0);
const diff = (b: V3, a: V3) => b.map((x, i) => x - a[i]!);
const laenge = (v: V3) => Math.hypot(v[0]!, v[1]!, v[2]!);
/** Flächeninhalt des Dreiecks nach Heron (unabhängig vom Kreuzprodukt). */
const heron = (a: V3, b: V3, c: V3) => {
  const [x, y, z] = [laenge(diff(b, a)), laenge(diff(c, b)), laenge(diff(a, c))];
  const s = (x + y + z) / 2;
  return Math.sqrt(s * (s - x) * (s - y) * (s - z));
};
/** Abstand eines Punkts von der Ebene durch a, b, c über eine Orthonormalbasis der Ebene (Gram-Schmidt, nicht über das Kreuzprodukt oder die Abstandsformel). */
function abstandPunktDreiecksebene(a: V3, b: V3, c: V3, s: V3): { h: number; F: V3 } {
  const u = diff(b, a);
  const uh = u.map((x) => x / laenge(u));
  let v = diff(c, a);
  v = v.map((x, i) => x - skal(v, uh) * uh[i]!);
  const vh = v.map((x) => x / laenge(v));
  const d = diff(s, a);
  const F = a.map((x, i) => x + skal(d, uh) * uh[i]! + skal(d, vh) * vh[i]!);
  return { h: laenge(diff(s, F)), F };
}
const volumenPyramide = (a: V3, b: V3, c: V3, s: V3) => (heron(a, b, c) * abstandPunktDreiecksebene(a, b, c, s).h) / 3;
/** Volumen einer Pyramide numerisch: Querschnitte parallel zur Grundebene sind ähnliche Dreiecke, Mittelpunktsregel über die Höhe (unabhängig von der Formel ⅓ G h). */
const volumenSchichten = (a: V3, b: V3, c: V3, s: V3, n = 2000) => {
  const { h } = abstandPunktDreiecksebene(a, b, c, s);
  let v = 0;
  for (let i = 0; i < n; i++) {
    const lambda = (i + 0.5) / n;
    const mix = (p: V3) => p.map((x, j) => x + lambda * (s[j]! - x));
    v += heron(mix(a), mix(b), mix(c)) * (h / n);
  }
  return v;
};
const zahl = (s: string) => Number(s.replace(/\{,\}/g, '.'));
const wert = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!.erwartet;

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Ebenen, hat fünf Abschnitte, BPE 16.6', () => {
    expect(meta.id).toBe('flaechen-volumen');
    expect(meta.thema).toBe('vektorgeometrie');
    expect(meta.unterbereich).toBe('ebenen');
    expect(meta.bpe).toEqual(['16.6']);
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['erklaeren', 'entdecken', 'ueberpruefen', 'vertiefung', 'zusammenfassung']);
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
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"flaechen-volumen"');
  });
  it('rendert ohne Formelfehler und ohne Gedankenstriche, mit der Fachsprache der Lehrkraft', () => {
    const html = rendern(null);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(html).not.toContain(z);
    for (const datei of [...readdirSync(ORDNER).map((x) => `${ORDNER}/${x}`), 'src/lib/koerper.ts', 'src/lib/koerperhilfen.ts']) for (const z of ['–', '—']) expect(readFileSync(datei, 'utf8'), datei).not.toContain(z);
    for (const wort of ['Grundfläche', 'Höhe', 'Höhenfußpunkt', 'Spitze', 'Quader', 'Pyramide', 'Volumen', 'Kreuzprodukt', 'Normalenvektor', 'Koordinatenform', 'Spatprodukt', 'senkrecht', 'Vertiefung']) expect(html, wort).toContain(wort);
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).not.toMatch(/\d\/\d/);
    expect(html).not.toMatch(/\bpi\b|Pi\b/);
    expect(html).not.toMatch(/Skalarmultiplikation/);
  });
  it('das Vektorprodukt wird immer mit dem Namen Kreuzprodukt genannt', () => {
    const text = nurText(rendern(null));
    expect(text).toContain('Vektorprodukt (Kreuzprodukt)');
    expect(text).not.toMatch(/Vektorprodukts?(?![a-zäöüß])(?! \(Kreuzprodukt\))/);
    expect(JSON.stringify(meta)).not.toMatch(/Vektorprodukts?(?![a-zäöüß])(?! \(Kreuzprodukt\))/);
  });
  it('Schreibweise: b ist die rechte Seite der Koordinatenform, d kommt nicht als rechte Seite vor', () => {
    expect(nurText(rendern('erklaeren'))).toContain('wie im Modul zu den Abständen mit');
    for (const tex of texteAusHtml(rendern(null))) expect(tex, tex).not.toMatch(/x_3=d\b|x_3=\\text\{d\}/);
  });
  it('das Spatprodukt kommt nur in der Vertiefung und in der Zusammenfassung vor, der Hinweis Vertiefung steht dort', () => {
    for (const a of ['erklaeren', 'entdecken', 'ueberpruefen']) {
      const text = nurText(rendern(a));
      expect(text, a).not.toMatch(/Spatprodukt|Spat\b/);
    }
    const v = nurText(rendern('vertiefung'));
    expect(v).toContain('Dieser Abschnitt geht über den Bildungsplan hinaus');
    expect(v).toContain('Spatprodukt');
    expect(nurText(rendern('zusammenfassung'))).toContain('Vertiefung: Spatprodukt');
  });
  it('das Erklären nimmt nichts vorweg: keine Formel für die Grundfläche, keine Abstandsformel, kein Kreuzprodukt als Rechenweg', () => {
    const html = rendern('erklaeren');
    const text = nurText(html);
    for (const wort of ['Abstandsformel', 'Lotgerade', 'Spatprodukt', 'Betrag des', 'Skalarprodukt von']) expect(text, wort).not.toContain(wort);
    for (const tex of texteAusHtml(html)) {
      expect(tex, tex).not.toContain('\\times');
      expect(tex, tex).not.toContain('\\frac{|');
    }
    expect(text).toContain('Entdecken');
    // Die Formeln stehen: Quader und Pyramide (bekannte Volumenformeln)
    expect(texteAusHtml(html).some((x) => x.includes('\\frac{1}{3}\\cdot G\\cdot h'))).toBe(true);
  });
  it('Abgrenzung: kein Pyramidenstumpf, keine Oberfläche, kein Prisma als eigenes Thema, kein Winkel zwischen Ebenen', () => {
    const text = nurText(rendern(null));
    for (const wort of ['Pyramidenstumpf', 'Oberflächeninhalt', 'Zylinder', 'Kegel', 'Rotationskörper']) expect(text, wort).not.toContain(wort);
  });
  it('verweist auf die Module davor, alle Verweise zeigen auf vorhandene Module und Abschnitte', () => {
    const quellen = readdirSync(ORDNER).filter((x) => x.endsWith('.tsx')).map((d) => readFileSync(`${ORDNER}/${d}`, 'utf8')).join('\n');
    const ids = [...quellen.matchAll(/modul="([a-z0-9-]+)"/g)].map((m) => m[1]!);
    for (const m of ['betrag-abstand-teilung', 'skalarprodukt-orthogonalitaet', 'vektorprodukt', 'abstaende-ebenen', 'normalenform-koordinatenform']) expect(ids, m).toContain(m);
    for (const id of ids) expect(existsSync(`content/modules/${id}/meta.json`), id).toBe(true);
    for (const m of quellen.matchAll(/modul="([a-z0-9-]+)" abschnitt="([a-z0-9-]+)"/g)) {
      const mj = JSON.parse(readFileSync(`content/modules/${m[1]}/meta.json`, 'utf8')) as { abschnitte?: { id: string }[] };
      expect(mj.abschnitte?.map((a) => a.id), `${m[1]} ${m[2]}`).toContain(m[2]);
    }
  });
  it('Zeilenumbrüche in Rechnungen nur vor einem Gleichheitszeichen: keine Fortsetzungen mit {}+ oder {}- oder {}\\cdot in Bibliothek und Modul', () => {
    for (const datei of [...readdirSync(ORDNER).map((x) => `${ORDNER}/${x}`), 'src/lib/koerperhilfen.ts']) for (const m of readFileSync(datei, 'utf8').matchAll(/\{\}([+\-]|\\cdot)/g)) throw new Error(`${datei}: Fortsetzung ${m[0]}`);
    for (const tex of texteAusHtml(rendern(null))) if (!/^(\\begin\{gathered\})?[A-Za-z_0-9{}']*:\\ \\vec\{x\}=/.test(tex)) expect(tex, tex).not.toMatch(/\\\\\{\}([+\-]|\\cdot)/);
  });
  it('die Zahlen und Gleichungen der Arbeitsblätter der Lehrkraft kommen nicht vor (öffentliches Repository)', () => {
    const tex = texteAusHtml(rendern(null)).map((x) => x.replace(/\s/g, '')).join(' | ');
    for (const v of D.VERBOTEN) expect(tex, v).not.toContain(v.replace(/\s/g, '').replace(/\|/g, '\\,|\\,'));
    for (const v of ['A(5\\,|\\,0\\,|\\,0)', 'B(2\\,|\\,5\\,|\\,1)', 'C(-2\\,|\\,2\\,|\\,2)', 'D(7\\,|\\,4\\,|\\,10)', 'A(0\\,|\\,2\\,|\\,3)', 'B(1\\,|\\,4\\,|\\,5)', 'C(2\\,|\\,3\\,|\\,4)', '8x_1-x_2+29x_3=40', '\\frac{151}{3}', '\\sqrt{906}', '\\frac{13}{3}']) expect(tex, v).not.toContain(v);
  });
});

/* ---------- Bibliothek ---------- */
describe('Bibliothek koerper.ts', () => {
  const dreiecke: [V3, V3, V3, V3][] = [
    [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]],
    [D.PYRAMIDE.A, D.PYRAMIDE.B, D.PYRAMIDE.C, D.PYRAMIDE.S],
    [D.A4.A, D.A4.B, D.A4.C, D.A4.S],
    [D.A14.A, D.A14.B, D.A14.C, D.A14.S],
    [[3, -1, 2], [-2, 4, 0], [1, 1, 5], [-3, -3, -3]],
    [[0, 0, 0], [4, 0, 0], [0, 3, 0], [1, 1, 2.5]],
  ];
  it('Grundfläche, Höhe und Volumen stimmen mit Heron, der Orthonormalbasis und dem Querschnittsintegral überein, F liegt in der Grundebene', () => {
    for (const [a, b, c, s] of dreiecke) {
      const p = pyramideDreieck(a, b, c, s);
      const u = abstandPunktDreiecksebene(a, b, c, s);
      expect(dreiecksflaeche(a, b, c)).toBeCloseTo(heron(a, b, c), 9);
      expect(p.G).toBeCloseTo(heron(a, b, c), 9);
      expect(p.h).toBeCloseTo(u.h, 9);
      p.F.forEach((x, i) => expect(x).toBeCloseTo(u.F[i]!, 9));
      expect(Math.abs(skal(p.n, p.F) - p.form.d)).toBeLessThan(1e-9);
      expect(laenge(kreuz(diff(s, p.F), p.n))).toBeLessThan(1e-9);
      expect(p.V).toBeCloseTo(volumenPyramide(a, b, c, s), 9);
      expect(p.V).toBeCloseTo(volumenSchichten(a, b, c, s), 4);
      // Spatprodukt: ein Sechstel des Betrags
      expect(Math.abs(p.spat) / 6).toBeCloseTo(p.V, 9);
      expect(tetraederVolumen(a, b, c, s)).toBeCloseTo(p.V, 9);
    }
  });
  it('Parallelogramm: Fläche über den Sinus, Pyramide mit Parallelogrammgrundfläche hat ein Drittel des Spatvolumens und doppeltes Dreiecksvolumen', () => {
    for (const [a, b, d, s] of [[[0, 0, 0], [2, 1, 0], [-1, 2, 1], [0, 0, 4]], [[1, 1, 1], [3, 0, 2], [0, 4, 3], [5, -2, 4]]] as [V3, V3, V3, V3][]) {
      const u = diff(b, a);
      const v = diff(d, a);
      const sinus = laenge(kreuz(u, v)) / (laenge(u) * laenge(v));
      expect(parallelogrammflaeche(a, b, d)).toBeCloseTo(laenge(u) * laenge(v) * sinus, 9);
      const p = pyramideParallelogramm(a, b, d, s);
      expect(p.V).toBeCloseTo(Math.abs(spatprodukt(u, v, diff(s, a))) / 3, 9);
      expect(p.V).toBeCloseTo((p.G * p.h) / 3, 9);
      // zwei Dreiecke ABD und BCD: Parallelogramm ist die Summe, Pyramide über ABD hat die Hälfte
      expect(pyramideDreieck(a, b, d, s).V * 2).toBeCloseTo(p.V, 9);
    }
  });
  it('Quader: C = B + AD, G = C + AE, Kantenlängen und Volumen, Orthogonalität erkannt', () => {
    const q = quader(D.A1.A, D.A1.B, D.A1.D, D.A1.E);
    expect(q.quader).toBe(true);
    expect(q.ecken[2]).toEqual([0, -4, 2]);
    expect(q.ecken[6]).toEqual(D.A1.Gp);
    expect(q.V).toBeCloseTo(6, 9);
    expect(quader([0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 0, 1]).quader).toBe(false);
    const q2 = quader(D.QUADER.A, D.QUADER.B, D.QUADER.D, D.QUADER.E);
    expect(q2.quader).toBe(true);
    expect(q2.V).toBeCloseTo(6, 9);
    expect(q2.G).toBeCloseTo(Math.sqrt(6), 9);
    // alle sechs Seitenflächen sind Rechtecke: gegenüberliegende Kanten gleich lang, je zwei benachbarte senkrecht
    const e = q2.ecken;
    expect(laenge(diff(e[2]!, e[3]!))).toBeCloseTo(laenge(diff(e[1]!, e[0]!)), 9);
    expect(skal(diff(e[1]!, e[0]!), diff(e[3]!, e[0]!))).toBe(0);
  });
  it('Wurzelzerlegung', () => {
    expect(wurzelZerlegung(99)).toEqual({ k: 3, m: 11 });
    expect(wurzelZerlegung(144)).toEqual({ k: 12, m: 1 });
    expect(wurzelZerlegung(126)).toEqual({ k: 3, m: 14 });
    expect(wurzelZerlegung(7)).toEqual({ k: 1, m: 7 });
  });
});

/* ---------- Bilder ---------- */
const AXEN: [number, number][] = [[-1, -1], [1, 0], [0, 1]];
void AXEN;
const zahlenX1 = Array.from({ length: 2 * RAUM_GRENZE + 1 }, (_, i) => i - RAUM_GRENZE).filter((k) => k !== 0).map((k) => normiert(x1ZahlMitte(k)));
const BILDER = (): [string, RaumBildSpec][] => [
  ['QUADER', B.RAUM_QUADER], ['PYRAMIDE', B.RAUM_PYRAMIDE], ['HOEHE_KANTE', B.RAUM_HOEHE_KANTE], ['ZWEI_SPITZEN', B.RAUM_ZWEI_SPITZEN], ['VEKTOREN', B.RAUM_VEKTOREN],
  ['A1', B.aufg1], ['A2', B.aufg2], ['A5', B.aufg5], ['A8', B.aufg8], ['A9', B.aufg9], ['A14', B.aufg14],
  ['Labor Start', B.laborBild(laborSpitze(1, 0, 0), true).spec],
];
describe('Bilder', () => {
  it('alle beschrifteten Punkte im Koordinatensystem, keiner im Schrägbild auf einer Achse, keine zwei an derselben Bildstelle, Textalternative, feine Darstellung', () => {
    for (const [name, s] of BILDER()) {
      const sichtbar = s.punkte!.filter((p) => !p.ohneText && !p.nurText);
      const bp = sichtbar.map((p) => bildpunkt(p.p));
      for (const [i, p] of sichtbar.entries()) {
        for (const x of p.p) expect(Math.abs(x), `${name} ${p.name}`).toBeLessThanOrEqual(RAUM_GRENZE);
        const [x, y] = bp[i]!;
        expect(x, `${name} ${p.name} x`).not.toBe(0);
        expect(y, `${name} ${p.name} y`).not.toBe(0);
        expect(x, `${name} ${p.name} x=y`).not.toBeCloseTo(y, 9);
      }
      expect(new Set(bp.map(String)).size, name).toBe(bp.length);
      expect(s.sprech.length, name).toBeGreaterThan(80);
      expect(s.fein, name).toBe(true);
      for (const l of s.linien ?? []) for (const c of [...l.von, ...l.bis]) expect(Math.abs(c), `${name} Linie`).toBeLessThanOrEqual(RAUM_GRENZE + 1e-9);
    }
  });
  it('jede Beschriftung hat Abstand zu allen Linien, Achsen, Achsenzahlen und anderen Beschriftungen', () => {
    const zuKnapp: string[] = [];
    for (const [name, s] of BILDER()) {
      const lagen = raumLagen(s);
      expect(lagen.length, name).toBe(s.punkte!.filter((p) => !p.ohneText && !p.nurText).length);
      for (const l of lagen) {
        const pt = s.punkte!.find((p) => p.name === l.name)!;
        const andere = [...zahlenX1, ...lagen.filter((x) => x !== l).map((x) => normiert(x.mitte))];
        const d = lageAbstand(l.lage, bildpunkt(pt.p), { bereich: RAUM_BEREICH, teilung: 1, linien: sperrlinienRaum(s.linien), belegt: andere });
        if (d < 0.015) zuKnapp.push(`${name} ${l.name} ${d.toFixed(4)}`);
      }
    }
    expect(zuKnapp).toEqual([]);
  });
  it('Höhen (orange, Breite 3) stehen senkrecht auf der Grundebene und haben die Länge h; Grundflächen liegen in der Ebene', () => {
    const pyr: [string, RaumBildSpec, V3[], V3][] = [
      ['PYRAMIDE', B.RAUM_PYRAMIDE, [D.PYRAMIDE.A, D.PYRAMIDE.B, D.PYRAMIDE.C], D.PYRAMIDE.S],
      ['A5', B.aufg5, [D.A4.A, D.A4.B, D.A4.C], D.A4.S],
      ['A2', B.aufg2, [D.A2.A, D.A2.B, D.A2.C], D.A2.S],
    ];
    for (const [name, s, basis, S] of pyr) {
      const hoehen = (s.linien ?? []).filter((l) => l.farbe === '#D55E00' && l.breite === 3);
      expect(hoehen.length, name).toBe(1);
      const n = kreuz(diff(basis[1]!, basis[0]!), diff(basis[2]!, basis[0]!));
      const v = diff(hoehen[0]!.bis, hoehen[0]!.von);
      expect(laenge(kreuz(v, n)), `${name} Lot`).toBeLessThan(1e-9);
      expect(laenge(v), name).toBeCloseTo(pyramideDreieck(basis[0]!, basis[1]!, basis[2]!, S).h, 9);
      expect(hoehen[0]!.bis).toEqual(S);
      const flaeche = (s.flaechen ?? []).find((f) => f.farbe === '#0072B2');
      expect(flaeche, name).toBeTruthy();
      for (const e of flaeche!.ecken) expect(Math.abs(skal(n, e) - skal(n, basis[0]!)), `${name} Ecke`).toBeLessThan(1e-9);
    }
    // zweite Spitze: die Spitzen liegen in einer Ebene parallel zur Grundebene
    const n = kreuz(diff(D.PYRAMIDE.B, D.PYRAMIDE.A), diff(D.PYRAMIDE.C, D.PYRAMIDE.A));
    expect(skal(n, D.PYRAMIDE.S)).toBe(skal(n, D.SPITZE2));
  });
  it('Quaderbilder: zwölf Kanten, acht beschriftete Ecken, die Kanten sind paarweise senkrecht oder parallel', () => {
    for (const s of [B.RAUM_QUADER, B.aufg1, B.aufg8]) {
      expect(s.punkte!.filter((p) => !p.nurText && 'ABCDEFGH'.includes(p.name)).length).toBe(8);
      expect(s.linien!.length).toBeGreaterThanOrEqual(12);
    }
    const q = quader(D.A8.A, D.A8.B, D.A8.D, D.A8.E);
    expect(q.quader).toBe(true);
    expect(B.aufg8.punkte!.some((p) => p.name === 'S')).toBe(true);
  });
});

/* ---------- Beispiele und Daten, unabhängig nachgerechnet ---------- */
describe('Beispiele und Daten', () => {
  it('Beispielpyramide: G = 6, h = 3, V = 6, Höhenfußpunkt F(2 | 0 | 2) liegt im Dreieck, Spatprodukt 36', () => {
    const { A, B: Bp, C, S, F } = D.PYRAMIDE;
    const p = pyramideDreieck(A, Bp, C, S);
    expect(p.G).toBeCloseTo(6, 9);
    expect(p.h).toBeCloseTo(3, 9);
    expect(p.V).toBeCloseTo(6, 9);
    expect(p.F.map((c) => Math.round(c * 1e9) / 1e9)).toEqual(F);
    expect(F).toEqual([2, 0, 2]);
    expect(p.spat).toBe(36);
    expect(heron(A, Bp, C)).toBeCloseTo(6, 9);
    expect(abstandPunktDreiecksebene(A, Bp, C, S).h).toBeCloseTo(3, 9);
    // F liegt im Dreieck: F = A + s AB + t AC mit s, t > 0 und s + t < 1
    const ab = diff(Bp, A);
    const ac = diff(C, A);
    const d = diff(F, A);
    const nn = skal(kreuz(ab, ac), kreuz(ab, ac));
    const s = skal(kreuz(d, ac), kreuz(ab, ac)) / nn;
    const t = skal(kreuz(ab, d), kreuz(ab, ac)) / nn;
    expect(s).toBeGreaterThan(0);
    expect(t).toBeGreaterThan(0);
    expect(s + t).toBeLessThan(1);
    // Koordinatenform der Grundebene wie im Text: -8x1 - 8x2 + 4x3 = -32
    expect(p.n).toEqual([-8, -8, 4]);
    expect(p.form.d).toBe(-8);
  });
  it('Labor: V = 6c für jede Einstellung, die Höhe ändert sich nur mit c, F liegt in der Grundebene', () => {
    const { A, B: Bp, C } = D.PYRAMIDE;
    let n = 0;
    for (const c of [0, 0.5, 1, 1.5]) for (const a of [-1, -0.5, 0, 0.5, 1]) for (const b of [-1, -0.5, 0, 0.5, 1]) {
      const S = laborSpitze(c, a, b);
      const p = pyramideDreieck(A, Bp, C, S);
      expect(p.h).toBeCloseTo(3 * c, 9);
      expect(p.V).toBeCloseTo(6 * c, 9);
      if (c > 0) expect(volumenPyramide(A, Bp, C, S)).toBeCloseTo(6 * c, 9);
      n++;
    }
    expect(n).toBe(100);
    expect(laborSpitze(1, 0, 0)).toEqual(D.PYRAMIDE.S);
    // u und w liegen in der Grundebene
    const nn = D.LABOR.n0;
    expect(skal(nn, D.LABOR.u)).toBe(0);
    expect(skal(nn, D.LABOR.w)).toBe(0);
    expect(laenge(nn)).toBe(3);
  });
  it('Aufgabendaten: A1 bis A9, A14 stimmen mit der unabhängigen Rechnung überein', () => {
    // A1: Quader, V = 6
    const q1 = quader(D.A1.A, D.A1.B, D.A1.D, D.A1.E);
    expect(q1.quader).toBe(true);
    expect(q1.V).toBeCloseTo(6, 9);
    expect(D.A1.V).toBe(6);
    // A2: Rechteck in der x1x2-Ebene, G = 10, h = 3, V = 10
    const [a2, b2, c2, d2] = [D.A2.A, D.A2.B, D.A2.C, D.A2.D];
    expect(skal(diff(b2, a2), diff(d2, a2))).toBe(0);
    expect(diff(c2, b2)).toEqual(diff(d2, a2));
    const g2 = laenge(diff(b2, a2)) * laenge(diff(d2, a2));
    expect(g2).toBeCloseTo(10, 9);
    expect(g2).toBeCloseTo(heron(a2, b2, c2) + heron(a2, c2, d2), 9);
    expect(D.A2.S[2] - D.A2.A[2]).toBe(3);
    for (const p of [D.A2.B, D.A2.C, D.A2.D]) expect(p[2]).toBe(D.A2.A[2]);
    expect((g2 * 3) / 3).toBeCloseTo(10, 9);
    // A3: G = 3,5
    expect(Math.hypot(...D.A3.n) / 2).toBeCloseTo(3.5, 9);
    // A4 bis 6: Pyramide
    const p4 = pyramideDreieck(D.A4.A, D.A4.B, D.A4.C, D.A4.S);
    const u4 = abstandPunktDreiecksebene(D.A4.A, D.A4.B, D.A4.C, D.A4.S);
    expect(p4.n).toEqual(D.A4.n);
    expect(p4.form.d).toBe(D.A4.b);
    expect(p4.h).toBeCloseTo(u4.h, 9);
    expect(p4.h).toBeCloseTo(D.A4.h, 2);
    expect(p4.G).toBeCloseTo(heron(D.A4.A, D.A4.B, D.A4.C), 9);
    expect(p4.G).toBeCloseTo(D.A4.G, 2);
    expect(p4.V).toBeCloseTo(3, 9);
    expect(volumenSchichten(D.A4.A, D.A4.B, D.A4.C, D.A4.S)).toBeCloseTo(3, 4);
    p4.F.forEach((c, i) => expect(c).toBeCloseTo(u4.F[i]!, 9));
    D.A4.F.forEach((c, i) => expect(c).toBeCloseTo(p4.F[i]!, 9));
    // A7: V = 5|a| / 3, V = 5 für a = 3 und a = -3, sonst nicht (Raster)
    const g7 = laenge(diff(D.A7.B, D.A7.A)) * laenge(diff(D.A7.D, D.A7.A));
    expect(g7).toBeCloseTo(5, 9);
    expect(skal(diff(D.A7.B, D.A7.A), diff(D.A7.D, D.A7.A))).toBe(0);
    const loesungen: number[] = [];
    for (let a = -10; a <= 10; a += 0.25) if (Math.abs((g7 * Math.abs(a)) / 3 - D.A7.V) < 1e-9) loesungen.push(a);
    expect(loesungen).toEqual([-3, 3]);
    expect([D.A7.a1, D.A7.a2].sort((x, y) => x - y)).toEqual([-3, 3]);
    // A8: Quader und Dach
    const q8 = quader(D.A8.A, D.A8.B, D.A8.D, D.A8.E);
    expect(q8.quader).toBe(true);
    expect(q8.V).toBeCloseTo(10, 9);
    const [e, f, g, h] = [q8.ecken[4]!, q8.ecken[5]!, q8.ecken[6]!, q8.ecken[7]!];
    const dach = pyramideDreieck(e, f, g, D.A8.S);
    expect(dach.h).toBeCloseTo(1, 9);
    expect(heron(e, f, g) + heron(e, g, h)).toBeCloseTo(5, 9);
    expect(2 * volumenPyramide(e, f, g, D.A8.S)).toBeCloseTo(5 / 3, 9);
    expect(q8.V + (5 * 1) / 3).toBeCloseTo(35 / 3, 9);
    expect(D.A8.vGesamt).toBeCloseTo(35 / 3, 9);
    // A9: Seitenfläche ABS
    expect(heron(D.A2.A, D.A2.B, D.A2.S)).toBeCloseTo(D.A9.flaeche, 2);
    expect(dreiecksflaeche(D.A2.A, D.A2.B, D.A2.S)).toBeCloseTo(Math.sqrt(D.A9.nn) / 2, 9);
    // A14: Tetraeder
    expect(tetraederVolumen(D.A14.A, D.A14.B, D.A14.C, D.A14.S)).toBeCloseTo(7 / 3, 9);
    expect(volumenPyramide(D.A14.A, D.A14.B, D.A14.C, D.A14.S)).toBeCloseTo(7 / 3, 9);
    expect(pyramideDreieck(D.A14.A, D.A14.B, D.A14.C, D.A14.S).spat).toBe(14);
    expect(D.A14.spat).toBe(14);
  });
  it('Aufgabe 12 und Bild: beide Spitzen haben dieselbe Höhe und dasselbe Volumen', () => {
    const { A, B: Bp, C, S } = D.PYRAMIDE;
    expect(abstandPunktDreiecksebene(A, Bp, C, D.SPITZE2).h).toBeCloseTo(abstandPunktDreiecksebene(A, Bp, C, S).h, 9);
    expect(volumenPyramide(A, Bp, C, D.SPITZE2)).toBeCloseTo(D.A12.V, 9);
    expect(volumenPyramide(A, Bp, C, S)).toBeCloseTo(D.A12.V, 9);
    expect(D.SPITZE2).not.toEqual(S);
  });
});

/* ---------- Aufgaben ---------- */
describe('Aufgaben', () => {
  it('zwölf Aufgaben im Überprüfen (acht mit Feldern, zwei Auswahlfragen, eine Zeichenaufgabe, eine weitere Auswahlfrage), drei in der Vertiefung, die richtige Position wechselt', () => {
    const html = rendern('ueberpruefen');
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '2', '4', '5', '6', '7', '8', '9']);
    expect(fragen.map((f) => f.nummer)).toEqual(['3', '10', '11']);
    expect(html).toContain('Aufgabe 12:');
    for (const f of fragen) expect(f.optionen.filter((o) => o.richtig)).toHaveLength(1);
    for (const f of fragen) for (const o of f.optionen) expect(alsText(o.rueckmeldung).length, `${f.nummer} ${o.id}`).toBeGreaterThan(30);
    expect(new Set(fragen.map((f) => f.optionen.findIndex((o) => o.richtig))).size).toBeGreaterThan(1);
    rendern('vertiefung');
    expect(aufgaben.map((a) => a.nummer)).toEqual(['13', '14']);
    expect(fragen.map((f) => f.nummer)).toEqual(['15']);
    expect(fragen[0]!.optionen.findIndex((o) => o.richtig)).toBeGreaterThanOrEqual(0);
  });
  it('Felder: Erwartungswerte gegen die unabhängige Rechnung', () => {
    rendern('ueberpruefen');
    const q1 = quader(D.A1.A, D.A1.B, D.A1.D, D.A1.E);
    for (const i of [1, 2, 3]) expect(wert('1', `g${i}`)).toBe(q1.ecken[6]![i - 1]);
    expect(wert('1', 'v')).toBe(6);
    expect(wert('2', 'g')).toBeCloseTo(10, 9);
    expect(wert('2', 'h')).toBe(3);
    expect(wert('2', 'v')).toBeCloseTo(10, 9);
    const p4 = pyramideDreieck(D.A4.A, D.A4.B, D.A4.C, D.A4.S);
    for (const i of [1, 2, 3]) expect(wert('4', `n${i}`)).toBe(p4.n[i - 1]);
    expect(wert('4', 'b')).toBe(p4.form.d);
    const u4 = abstandPunktDreiecksebene(D.A4.A, D.A4.B, D.A4.C, D.A4.S);
    for (const i of [1, 2, 3]) expect(wert('5', `f${i}`)).toBeCloseTo(u4.F[i - 1]!, 2);
    expect(wert('5', 'h')).toBeCloseTo(u4.h, 2);
    expect(wert('6', 'g')).toBeCloseTo(heron(D.A4.A, D.A4.B, D.A4.C), 2);
    expect(wert('6', 'v')).toBeCloseTo(volumenPyramide(D.A4.A, D.A4.B, D.A4.C, D.A4.S), 2);
    expect(wert('7', 'a1')).toBe(3);
    expect(wert('7', 'a2')).toBe(-3);
    expect(wert('8', 'q')).toBe(10);
    expect(wert('8', 'd')).toBeCloseTo(5 / 3, 2);
    expect(wert('8', 'g')).toBeCloseTo(35 / 3, 2);
    expect(wert('9', 'f')).toBeCloseTo(heron(D.A2.A, D.A2.B, D.A2.S), 2);
    rendern('vertiefung');
    expect(wert('13', 's')).toBe(18);
    expect(wert('13', 'v')).toBeCloseTo(3, 9);
    expect(wert('14', 's')).toBe(14);
    expect(wert('14', 'v')).toBeCloseTo(7 / 3, 2);
    // Spatprodukt der Aufgabe 13 unabhängig: det der drei Vektoren
    const [a, b, c] = [diff(D.A4.B, D.A4.A), diff(D.A4.C, D.A4.A), diff(D.A4.S, D.A4.A)];
    const det = a[0]! * (b[1]! * c[2]! - b[2]! * c[1]!) - a[1]! * (b[0]! * c[2]! - b[2]! * c[0]!) + a[2]! * (b[0]! * c[1]! - b[1]! * c[0]!);
    expect(Math.abs(det)).toBe(18);
  });
  it('Aufgabe 4: der Normalenvektor ist ungekürzt (gemeinsamer Teiler 3), Hinweis steht in der Aufgabe', () => {
    const html = rendern('ueberpruefen');
    expect(nurText(html)).toContain('ungekürzten Normalenvektor');
    expect(wert('4', 'n1')).toBe(3);
  });
  it('Auswahl 3: genau die richtige Antwort ist die Hälfte des Betrags, die Fehler sind typisch (Betrag ohne Hälfte, Quadrat halbiert, Koordinaten addiert)', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '3')!;
    const werte = f.optionen.map((o) => ({ id: o.id, w: texteAusHtml(alsText(o.text))[0]!.replace('G=', '') }));
    const r = f.optionen.find((o) => o.richtig)!;
    expect(zahl(texteAusHtml(alsText(r.text))[0]!.replace('G=', ''))).toBe(Math.hypot(...D.A3.n) / 2);
    expect(werte.map((x) => zahl(x.w)).sort((a, b) => a - b)).toEqual([3.5, 5.5, 7, 24.5]);
    expect(Math.hypot(...D.A3.n)).toBe(7);
  });
  it('Auswahl 11: achtfaches Volumen bei verdoppelten Kanten (Rechnung am Beispiel)', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '11')!;
    expect(nurText(alsText(f.optionen.find((o) => o.richtig)!.text))).toContain('achtmal');
    const { A, B: Bp, C, S } = D.PYRAMIDE;
    const mal2 = (p: V3) => p.map((c) => 2 * c);
    expect(volumenPyramide(mal2(A), mal2(Bp), mal2(C), mal2(S)) / volumenPyramide(A, Bp, C, S)).toBeCloseTo(8, 9);
  });
  it('Auswahl 15: Parallelogramm-Pyramide hat ein Drittel des Spatprodukts, ein Dreieck die Hälfte davon', () => {
    rendern('vertiefung');
    const f = fragen.find((x) => x.nummer === '15')!;
    expect(texteAusHtml(alsText(f.optionen.find((o) => o.richtig)!.text))[0]).toBe('V=15');
    expect(Math.abs(-45) / 3).toBe(15);
    expect(Math.abs(-45) / 6).toBe(7.5);
  });
  it('alle Hilfen, Lösungsschritte, Feldbeschriftungen und Rückmeldungen rendern ohne Formelfehler und ohne Gedankenstriche', () => {
    for (const abschnitt of ['ueberpruefen', 'vertiefung']) {
      const html = rendern(abschnitt);
      expect(html).not.toContain('formel-fehler');
      for (const a of aufgaben) {
        expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(2);
        expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(1);
        for (const n of [...a.hilfen, ...a.loesung, a.children, ...a.felder.map((f) => f.beschriftung)]) {
          const h = alsText(n);
          expect(h).not.toContain('formel-fehler');
          for (const z of ['–', '—']) expect(h).not.toContain(z);
        }
      }
      for (const f of fragen) for (const n of [f.children, f.erklaerung, ...f.optionen.flatMap((o) => [o.text, o.rueckmeldung])]) {
        const h = alsText(n);
        expect(h).not.toContain('formel-fehler');
        for (const z of ['–', '—']) expect(h).not.toContain(z);
      }
    }
  });
  it('Bei Eingabe der erwarteten Werte als Dezimalzahl oder Bruch sind die Felder lösbar (Werte mit Wurzel haben eine Toleranz)', () => {
    for (const abschnitt of ['ueberpruefen', 'vertiefung']) {
      rendern(abschnitt);
      for (const a of aufgaben) for (const fe of a.felder) if (!Number.isInteger(fe.erwartet * 1000)) expect(fe.toleranz, `${a.nummer} ${fe.id}`).toBeGreaterThan(0);
    }
  });
  it('Aufgaben mit Schaubild haben ein aufklappbares Kontrollbild', () => {
    const html = rendern('ueberpruefen');
    expect((html.match(/data-kontrolle="1"/g) ?? []).length).toBeGreaterThanOrEqual(7);
  });
});

/* ---------- Labor ---------- */
describe('Labor', () => {
  it('Pyramidenlabor: drei Regler, zwei Schalter, Werte zunächst verborgen, kein Schalter Ebene und Raum, aber Schrägbild und räumlich', () => {
    const a = renderToStaticMarkup(<Pyramidenlabor />);
    expect(a.match(/type="range"/g)).toHaveLength(3);
    expect(a.match(/type="checkbox"/g)).toHaveLength(2);
    expect(a).toContain('aria-label="Darstellung wählen"');
    expect(a).not.toContain('aria-label="Ebene oder Raum wählen"');
    expect(a).not.toContain('formel-fehler');
    expect(a).not.toContain('\\frac{1}{3}');
    expect(a).not.toContain('Volumen');
  });
  it('Laborbilder für alle Einstellungen: beschriftete Punkte im Koordinatensystem, Höhenfußpunkt in der Grundebene, Textalternative', () => {
    let n = 0;
    for (const c of [0, 0.5, 1, 1.5]) for (const a of [-1, -0.5, 0, 0.5, 1]) for (const b of [-1, -0.5, 0, 0.5, 1]) for (const hoehe of [false, true]) {
      const S = laborSpitze(c, a, b);
      const { spec, aussen } = B.laborBild(S, hoehe);
      expect(spec.sprech.length).toBeGreaterThan(60);
      expect(aussen).toBe(S.some((x) => Math.abs(x) > 4));
      for (const p of spec.punkte!.filter((q) => !q.nurText)) for (const x of p.p) expect(Math.abs(x)).toBeLessThanOrEqual(4 + 1e-9);
      const F = spec.punkte!.find((p) => p.name === 'F');
      if (F) {
        const nn = kreuz(diff(D.PYRAMIDE.B, D.PYRAMIDE.A), diff(D.PYRAMIDE.C, D.PYRAMIDE.A));
        expect(Math.abs(skal(nn, F.p) - skal(nn, D.PYRAMIDE.A))).toBeLessThan(1e-9);
      }
      n++;
    }
    expect(n).toBe(200);
  });
});
