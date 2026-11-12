import { existsSync, readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/abstaende-ebenen/Bilder';
import * as D from '../content/modules/abstaende-ebenen/daten';
import Modul from '../content/modules/abstaende-ebenen/index';
import { Lotlabor, Parallelenlabor } from '../content/modules/abstaende-ebenen/Labor';
import meta from '../content/modules/abstaende-ebenen/meta.json';
import themen from '../content/themen.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { abstandEbenen, abstandGeradeEbene, abstandPunktEbene, spiegelpunkt } from '../src/lib/abstandebene';
import { RAUM_BEREICH, RAUM_GRENZE, bildpunkt, normiert, raumLagen, sperrlinienRaum, x1ZahlMitte, type RaumBildSpec } from '../src/lib/schraegbild';
import { lageAbstand } from '../src/lib/vektorbild';

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
function rendern(abschnitt: string | null = null): string {
  aufgaben.length = 0;
  fragen.length = 0;
  return renderToStaticMarkup(<AbschnittAnbieter value={abschnitt}><Modul /></AbschnittAnbieter>);
}
const ORDNER = 'content/modules/abstaende-ebenen';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const texteAusHtml = (html: string): string[] => [...html.matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<'));
const texte = (n: ReactNode): string[] => texteAusHtml(alsText(n));
const zahl = (s: string) => Number(s.replace(/\{,\}/g, '.'));

/* ---------- unabhängige Methoden ---------- */
type KF = { n: number[]; d: number };
const skal = (a: number[], b: number[]) => a[0]! * b[0]! + a[1]! * b[1]! + a[2]! * b[2]!;
const kreuz = (a: number[], b: number[]): number[] => [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!].map((x) => x + 0);
const diff = (b: number[], a: number[]) => b.map((x, i) => x - a[i]!);
const laenge = (v: number[]) => Math.hypot(v[0]!, v[1]!, v[2]!);
const imKf = (k: KF, x: number[]) => Math.abs(skal(k.n, x) - k.d) < 1e-6;
/**
 * Kürzester Abstand über eine Orthonormalbasis der Ebene (nicht über die Lotgerade): u und v stehen senkrecht auf n und aufeinander, die Projektion von q − p0 auf u und v
 * liefert den nächsten Punkt. Zusätzlich wird der Abstand mit zufälligen Punkten der Ebene nach unten geprüft.
 */
function nächster(k: KF, q: number[]): { d: number; F: number[] } {
  const p0 = k.n.map((c) => (c * k.d) / skal(k.n, k.n));
  const e = Math.abs(k.n[0]!) < Math.abs(k.n[1]!) ? [1, 0, 0] : [0, 1, 0];
  const u = kreuz(k.n, e);
  const v = kreuz(k.n, u);
  const r = skal(diff(q, p0), u) / skal(u, u);
  const s = skal(diff(q, p0), v) / skal(v, v);
  const F = p0.map((c, i) => c + r * u[i]! + s * v[i]!);
  const d = laenge(diff(q, F));
  for (let i = 0; i < 200; i++) {
    const a = Math.sin(i * 12.9898) * 5;
    const b = Math.cos(i * 78.233) * 5;
    const X = p0.map((c, j) => c + (r + a) * u[j]! + (s + b) * v[j]!);
    expect(laenge(diff(q, X))).toBeGreaterThanOrEqual(d - 1e-9);
  }
  return { d, F };
}
const kfAus = (tex: string): KF => {
  const [links, rechts] = tex.replace(/^[A-Z](?:_[a-z0-9])?:\\ /, '').split('=');
  const n = [1, 2, 3].map((i) => {
    const m = links!.match(new RegExp(`([+-]?\\d*)x_${i}`));
    if (!m) return 0;
    const z = m[1]!;
    return z === '' || z === '+' ? 1 : z === '-' ? -1 : Number(z);
  });
  return { n, d: Number(rechts) };
};
const kfIn = (n: ReactNode, name = 'E'): KF => kfAus(texte(n).join(' ').match(new RegExp(`${name}(?:_[a-z0-9])?:\\\\ ([^,\\s]*?=-?\\d+)`))![0]);
const punktIn = (n: ReactNode, name: string): number[] => texte(n).join(' ').match(new RegExp(`${name}\\(([-\\d{},\\\\|]+)\\)`))![1]!.split('\\,|\\,').map(zahl);
const wert = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!.erwartet;
const lageRaster = (g: { p: number[]; u: number[] }, k: KF): 'schneidet' | 'parallel' | 'liegtIn' => {
  const f = (t: number) => skal(k.n, g.p.map((c, i) => c + t * g.u[i]!)) - k.d;
  const [a, b] = [f(-1e4), f(1e4)];
  if (Math.abs(a) < 1e-6 && Math.abs(b) < 1e-6) return 'liegtIn';
  return a * b < 0 ? 'schneidet' : 'parallel';
};

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Ebenen, hat fünf Abschnitte, BPE 16.6', () => {
    expect(meta.id).toBe('abstaende-ebenen');
    expect(meta.thema).toBe('vektorgeometrie');
    expect(meta.unterbereich).toBe('ebenen');
    expect(meta.bpe).toEqual(['16.6']);
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['erklaeren', 'entdecken', 'wege', 'ueberpruefen', 'zusammenfassung']);
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
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"abstaende-ebenen"');
  });
  it('rendert ohne Formelfehler und ohne Gedankenstriche, mit der Fachsprache der Lehrkraft', () => {
    const html = rendern(null);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(html).not.toContain(z);
    for (const datei of [...readdirSync(ORDNER).map((x) => `${ORDNER}/${x}`), 'src/lib/abstandebene.ts', 'src/lib/abstandebenehilfen.ts']) for (const z of ['–', '—']) expect(readFileSync(datei, 'utf8'), datei).not.toContain(z);
    for (const wort of ['Abstand', 'Lotfußpunkt', 'Lot', 'Spiegelpunkt', 'echt parallel', 'Geradenprobe', 'Koordinatenform', 'Normalenvektor', 'Abstandsformel', 'Vektorprodukt', 'senkrecht']) expect(html, wort).toContain(wort);
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).not.toMatch(/\d\/\d/);
    expect(html).not.toMatch(/\bpi\b|Pi\b/);
    expect(html).not.toMatch(/Skalarmultiplikation/);
  });
  it('das Vektorprodukt wird immer mit dem Namen Kreuzprodukt genannt', () => {
    const text = rendern(null).replace(/<[^>]*>/g, ' ');
    expect(text).toContain('Vektorprodukt (Kreuzprodukt)');
    expect(text).not.toMatch(/Vektorprodukt(?! \(Kreuzprodukt\))/);
  });
  it('Schreibweise: b ist die rechte Seite der Koordinatenform, d der Abstand (Hinweis steht im Erklären)', () => {
    expect(rendern('erklaeren').replace(/<[^>]*>/g, '')).toContain('Der Abstand heißt');
    for (const tex of texteAusHtml(rendern(null))) expect(tex, tex).not.toMatch(/x_3=d\b|x_3=\\text\{d\}/);
  });
  it('Abgrenzung: keine Flächen und Volumen, kein Winkel zwischen Gerade und Ebene, keine Pyramide; die Hesse-Form wird nur als Hinweis genannt', () => {
    const text = rendern(null).replace(/<[^>]*>/g, ' ');
    const m = text.match(/.{30}(Pyramide|Quader|Volumen|Schnittwinkel|Flächeninhalt).{30}/);
    expect(m?.[0]).toBeUndefined();
    expect(text.match(/Hesse/g)?.length).toBe(1);
  });
  it('das Erklären nimmt nichts vorweg: keine Formel, keine Lotgerade, kein Normalenvektor als Richtung des Lots', () => {
    const html = rendern('erklaeren');
    const text = html.replace(/<[^>]*>/g, '');
    for (const wort of ['Abstandsformel', 'Lotgerade', 'Hesse', 'Richtung des Normalenvektors']) expect(text, wort).not.toContain(wort);
    for (const tex of texteAusHtml(html)) expect(tex, tex).not.toContain('\\frac{|');
    expect(text).toContain('Entdecken');
  });
  it('verweist auf die Module davor, alle Verweise zeigen auf vorhandene Module', () => {
    const quellen = readdirSync(ORDNER).filter((x) => x.endsWith('.tsx')).map((d) => readFileSync(`${ORDNER}/${d}`, 'utf8')).join('\n');
    const ids = [...quellen.matchAll(/modul="([a-z0-9-]+)"/g)].map((m) => m[1]!);
    for (const m of ['betrag-abstand-teilung', 'abstaende-geraden', 'normalenform-koordinatenform', 'gerade-und-ebene', 'zwei-ebenen', 'vektorprodukt']) expect(ids, m).toContain(m);
    for (const id of ids) expect(existsSync(`content/modules/${id}/meta.json`), id).toBe(true);
  });
  it('Zeilenumbrüche in Rechnungen nur vor einem Gleichheitszeichen: keine Fortsetzungen mit {}+ oder {}- oder {}\\cdot in Bibliothek und Modul', () => {
    for (const datei of [...readdirSync(ORDNER).map((x) => `${ORDNER}/${x}`), 'src/lib/abstandebenehilfen.ts']) for (const m of readFileSync(datei, 'utf8').matchAll(/\{\}([+\-]|\\cdot)(?!t\\\\cdot)/g)) throw new Error(`${datei}: Fortsetzung ${m[0]}`);
    for (const tex of texteAusHtml(rendern(null))) expect(tex, tex).not.toMatch(/\\\\\{\}([+\-]|\\cdot)(?!t\\cdot)/);
  });
  it('die Zahlen und Gleichungen der Arbeitsblätter der Lehrkraft kommen nicht vor (öffentliches Repository)', () => {
    const tex = texteAusHtml(rendern(null)).map((x) => x.replace(/^[A-Za-z]+(?:_[a-z0-9]+)?:\\ /, '')).join(' | ');
    for (const v of ['12x_1+6x_2-4x_3=13', 'x_1+8x_2-4x_3=25', 'C(-2\\,|\\,0\\,|\\,3)', '-2{,}1', '5{,}05', '3{,}8']) expect(tex, v).not.toContain(v);
    const quellen = readdirSync(ORDNER).filter((x) => x !== 'daten.ts').map((d) => readFileSync(`${ORDNER}/${d}`, 'utf8')).join('\n');
    for (const v of ['5,05', '-2,1', '12x', '(−2|0|3)']) expect(quellen, v).not.toContain(v);
  });
});

/* ---------- Bibliothek ---------- */
describe('Bibliothek abstandebene.ts', () => {
  const ebenen: KF[] = [D.E, D.A1.k, D.A2.k, D.A3.k, D.A4.k, D.A5.k, D.A7.k, D.A9.k, { n: [0, 0, 1], d: 3 }, { n: [3, 0, -4], d: 0 }, { n: [1, 1, 1], d: -2 }];
  const punkte = [[0, 0, 0], [1, 2, 3], [-3, 4, 1], [2, -2, 5], [4, 1, -1], [0.5, 0.5, -2]];
  it('Abstand und Lotfußpunkt stimmen mit der Orthonormalbasis-Rechnung überein, F liegt in E, QF ist ein Vielfaches von n', () => {
    for (const k of ebenen) for (const q of punkte) {
      const r = abstandPunktEbene(k, q);
      const u = nächster(k, q);
      expect(r.d).toBeCloseTo(u.d, 9);
      r.F.forEach((c, i) => expect(c).toBeCloseTo(u.F[i]!, 9));
      expect(imKf(k, r.F)).toBe(true);
      expect(laenge(kreuz(diff(q, r.F), k.n))).toBeLessThan(1e-9);
      expect(Math.abs(r.t) * laenge(k.n)).toBeCloseTo(r.d, 9);
    }
  });
  it('Spiegelpunkt: F ist die Mitte, gleicher Abstand zur Ebene, Q′ − Q parallel zu n, Spiegelung zweimal ist die Identität', () => {
    for (const k of ebenen) for (const q of punkte) {
      const s = spiegelpunkt(k, q);
      const f = abstandPunktEbene(k, q).F;
      f.forEach((c, i) => expect(c).toBeCloseTo((q[i]! + s[i]!) / 2, 9));
      expect(abstandPunktEbene(k, s).d).toBeCloseTo(abstandPunktEbene(k, q).d, 9);
      expect(laenge(kreuz(diff(s, q), k.n))).toBeLessThan(1e-9);
      spiegelpunkt(k, s).forEach((c, i) => expect(c).toBeCloseTo(q[i]!, 9));
      if (Math.abs(skal(k.n, q) - k.d) > 1e-9) expect(Math.sign(skal(k.n, s) - k.d)).toBe(-Math.sign(skal(k.n, q) - k.d));
    }
  });
  it('Gerade und Ebene: Abstand 0 bei schneidet und liegt in, sonst jeder Punkt der Geraden hat denselben Abstand', () => {
    for (const k of ebenen) for (const g of [{ p: [1, 0, 3], u: [1, 2, 0] }, { p: [0, 0, 0], u: [1, 1, 1] }, { p: [2, 2, 0], u: [0, 0, 1] }, { p: [1, 0, 0], u: [2, 0, 1] }]) {
      const a = abstandGeradeEbene(g, k);
      expect(a.art).toBe(lageRaster(g, k));
      if (a.art !== 'parallel') expect(a.d).toBe(0);
      else for (let t = -3; t <= 3; t += 0.75) expect(abstandPunktEbene(k, g.p.map((c, i) => c + t * g.u[i]!)).d).toBeCloseTo(a.d, 9);
    }
  });
  it('parallele Ebenen: Faktor, identisch, schneidend; der Abstand ist der Abstand jedes Punkts der zweiten Ebene', () => {
    expect(abstandEbenen({ n: [1, 2, 2], d: 2 }, { n: [2, 4, 4], d: 16 })).toMatchObject({ art: 'parallel', faktor: 2, d: 2 });
    expect(abstandEbenen({ n: [1, 2, 2], d: 2 }, { n: [-2, -4, -4], d: -4 })).toMatchObject({ art: 'identisch', d: 0 });
    expect(abstandEbenen({ n: [1, 2, 2], d: 2 }, { n: [1, 0, 2], d: 2 })).toMatchObject({ art: 'schneiden', d: 0 });
    expect(abstandEbenen(D.E, D.EBENE_F)).toMatchObject({ art: 'parallel', faktor: 1, d: 2 });
    for (const [a, b] of [[D.E, D.EBENE_F], [D.A8.e, D.A8.f], [{ n: [0, 3, 4], d: 5 }, { n: [0, 6, 8], d: -10 }]] as [KF, KF][]) {
      const x = abstandEbenen(a, b);
      // Punkte der zweiten Ebene über die Orthonormalbasis
      const p0 = b.n.map((c) => (c * b.d) / skal(b.n, b.n));
      const e = Math.abs(b.n[0]!) < Math.abs(b.n[1]!) ? [1, 0, 0] : [0, 1, 0];
      const u = kreuz(b.n, e);
      for (const [r, s] of [[0, 0], [1, 0.5], [-2, 3]]) expect(nächster(a, p0.map((c, i) => c + r! * u[i]! + s! * kreuz(b.n, u)[i]!)).d).toBeCloseTo(x.d, 9);
    }
  });
});

/* ---------- Bilder ---------- */
const AXEN: [number, number][] = [[-1, -1], [1, 0], [0, 1]];
const zahlenX1 = Array.from({ length: 2 * RAUM_GRENZE + 1 }, (_, i) => i - RAUM_GRENZE).filter((k) => k !== 0).map((k) => normiert(x1ZahlMitte(k)));
const winkelZu = (a: number[], b: number[]) => (Math.acos(Math.min(1, Math.abs(a[0]! * b[0]! + a[1]! * b[1]!) / (Math.hypot(a[0]!, a[1]!) * Math.hypot(b[0]!, b[1]!)))) * 180) / Math.PI;
const abstandPS = (p: number[], a: number[], b: number[]) => {
  const dx = b[0]! - a[0]!;
  const dy = b[1]! - a[1]!;
  const l2 = dx * dx + dy * dy;
  const u = l2 === 0 ? 0 : Math.max(0, Math.min(1, ((p[0]! - a[0]!) * dx + (p[1]! - a[1]!) * dy) / l2));
  return Math.hypot(p[0]! - (a[0]! + u * dx), p[1]! - (a[1]! + u * dy));
};
const BILDER = (): [string, RaumBildSpec, KF][] => [
  ['LOT', B.RAUM_LOT, D.E], ['GERADE', B.RAUM_GERADE, D.E], ['EBENEN', B.RAUM_EBENEN, D.E], ['SPIEGEL', B.RAUM_SPIEGEL, D.E],
  ['A1', B.aufg1, D.A1.k], ['A5', B.aufg5, D.A5.k], ['A7', B.aufg7, D.A7.k], ['A8', B.aufg8, D.A8.e], ['A9', B.aufg9, D.A9.k], ['A12', B.aufg12, D.E],
  ['Labor Start', B.lotLaborBild(D.LABOR.startQ, abstandPunktEbene(D.E, D.LABOR.startQ).F.map((c, i) => c + D.E_RICHTUNG.u[i]!), true, true).spec, D.E],
  ['Parallelenlabor', B.parallelLaborBild(0.5).spec, D.E],
];
describe('Bilder', () => {
  it('alle Punkte im Koordinatensystem, keiner im Schrägbild auf einer Achse, keine zwei an derselben Bildstelle, Textalternative, feine Darstellung', () => {
    for (const [name, s] of BILDER()) {
      const sichtbar = s.punkte!.filter((p) => !p.ohneText && !p.nurText);
      const bp = sichtbar.map((p) => bildpunkt(p.p));
      for (const [i, p] of sichtbar.entries()) {
        for (const x of p.p) expect(Math.abs(x), `${name} ${p.name}`).toBeLessThanOrEqual(RAUM_GRENZE);
        const [x, y] = bp[i]!;
        expect(x, `${name} ${p.name} x`).not.toBe(0);
        expect(y, `${name} ${p.name} y`).not.toBe(0);
        expect(x, `${name} ${p.name} x=y`).not.toBe(y);
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
  it('Geraden (Breite 2): im Schrägbild nicht als Punkt, nicht parallel zu einem Achsenbild (mindestens 11°, Länge mindestens 1,5), Namen dicht an ihrer Linie', () => {
    let n = 0;
    for (const [name, s] of BILDER()) {
      const geraden = (s.linien ?? []).filter((l) => l.breite === 2 && l.farbe !== '#555555');
      for (const l of geraden) {
        const v = diff(l.bis, l.von);
        const b = [v[1]! - v[0]! / 2, v[2]! - v[0]! / 2];
        expect(Math.hypot(b[0]!, b[1]!), `${name} Länge`).toBeGreaterThanOrEqual(1.5);
        for (const a of AXEN) expect(winkelZu(b, a), `${name} ${v}`).toBeGreaterThanOrEqual(11);
        n++;
      }
      const linienBild = (s.linien ?? []).filter((l) => (l.breite === 2 || l.breite === 3) && l.farbe !== '#555555').map((l) => [bildpunkt(l.von), bildpunkt(l.bis)] as [number[], number[]]);
      for (const tx of s.punkte!.filter((p) => p.nurText)) {
        const b = bildpunkt(tx.p);
        const dl = linienBild.map(([a, c]) => abstandPS(b, a, c)).sort((x, y) => x - y);
        expect(dl[0], `${name} ${tx.name}`).toBeLessThanOrEqual(0.5);
        expect(dl[0], `${name} ${tx.name}`).toBeGreaterThanOrEqual(0.1);
        for (const p of s.punkte!.filter((q) => !q.nurText)) expect(Math.hypot(...(diff(bildpunkt(p.p), b) as [number, number])), `${name} ${tx.name} Punkt ${p.name}`).toBeGreaterThanOrEqual(0.3);
      }
    }
    expect(n).toBeGreaterThanOrEqual(4);
  });
  it('die Flächen liegen in ihrer Ebene (Ecken erfüllen die Gleichung), die Lote stehen senkrecht auf der Ebene und haben die Länge d', () => {
    for (const [name, s, k] of BILDER()) {
      const flaechen = s.flaechen ?? [];
      expect(flaechen.length, name).toBeGreaterThanOrEqual(1);
      expect(flaechen[0]!.ecken.every((e) => imKf(k, e)), `${name} erste Fläche`).toBe(true);
    }
    // Lote: orange, Breite 3, Richtung n
    for (const [name, s, k] of BILDER()) for (const l of (s.linien ?? []).filter((x) => x.farbe === '#D55E00' && x.breite === 3)) {
      const v = diff(l.bis, l.von);
      expect(laenge(kreuz(v, k.n)), `${name} Lot`).toBeLessThan(1e-9);
    }
    expect(imKf(D.EBENE_F, D.GERADE.p)).toBe(true);
    expect(B.RAUM_EBENEN.flaechen!.some((f) => f.ecken.every((e) => imKf(D.EBENE_F, e)))).toBe(true);
    expect(B.aufg8.flaechen!.some((f) => f.ecken.every((e) => imKf(D.A8.f, e)))).toBe(true);
  });
});

/* ---------- Daten, unabhängig nachgerechnet ---------- */
describe('Beispiele und Daten', () => {
  it('Beispiel: Q, F, Q′, d und das Lot stimmen (Orthonormalbasis), X liegt in E und ist weiter weg', () => {
    const u = nächster(D.E, D.BEISPIEL.Q);
    expect(u.d).toBeCloseTo(2, 9);
    expect(u.F).toEqual(expect.arrayContaining([expect.closeTo(2 / 3, 9), expect.closeTo(8 / 3, 9), expect.closeTo(5 / 3, 9)]));
    expect(imKf(D.E, D.BEISPIEL.X)).toBe(true);
    expect(laenge(diff(D.BEISPIEL.Q, D.BEISPIEL.X))).toBeCloseTo(Math.sqrt(5), 9);
    expect(spiegelpunkt(D.E, D.BEISPIEL.Q)).toEqual(expect.arrayContaining([expect.closeTo(-2 / 3, 9), expect.closeTo(10 / 3, 9), expect.closeTo(1 / 3, 9)]));
  });
  it('Richtungen u und v des Labors liegen in E, g ist echt parallel zu E mit dem Abstand 2, F enthält g und hat denselben Normalenvektor', () => {
    expect(skal(D.E.n, D.E_RICHTUNG.u)).toBe(0);
    expect(skal(D.E.n, D.E_RICHTUNG.v)).toBe(0);
    expect(lageRaster(D.GERADE, D.E)).toBe('parallel');
    expect(nächster(D.E, D.GERADE.p).d).toBeCloseTo(2, 9);
    for (let s = -3; s <= 3; s += 0.5) expect(imKf(D.EBENE_F, D.GERADE.p.map((c, i) => c + s * D.GERADE.u[i]!))).toBe(true);
  });
  it('Aufgabendaten: Lotfußpunkte und Abstände stimmen mit der Orthonormalbasis überein', () => {
    const a1 = nächster(D.A1.k, D.A1.Q);
    expect(a1.d).toBeCloseTo(D.A1.d, 9);
    a1.F.forEach((c, i) => expect(c).toBeCloseTo(D.A1.F[i]!, 9));
    expect(nächster(D.A2.k, D.A2.Q).d).toBeCloseTo(23 / 7, 9);
    expect(Math.round(nächster(D.A2.k, D.A2.Q).d * 100) / 100).toBe(D.A2.d);
    expect(nächster(D.A3.k, D.A3.Q).d).toBeCloseTo(10 / 3, 9);
    expect(kreuz(D.A4.u, D.A4.v)).toEqual(D.A4.k.n);
    expect(skal(D.A4.k.n, D.A4.p)).toBe(D.A4.k.d);
    expect(Math.round(nächster(D.A4.k, D.A4.Q).d * 100) / 100).toBe(D.A4.d);
    const a5 = nächster(D.A5.k, D.A5.Q);
    expect(a5.d).toBeCloseTo(D.A5.d, 9);
    expect(a5.F[2]).toBeCloseTo(D.A5.h, 9);
    expect(lageRaster(D.A7.g, D.A7.k)).toBe('parallel');
    expect(nächster(D.A7.k, D.A7.g.p).d).toBeCloseTo(D.A7.d, 9);
    for (let t = -4; t <= 4; t += 0.5) expect(nächster(D.A7.k, D.A7.g.p.map((c, i) => c + t * D.A7.g.u[i]!)).d).toBeCloseTo(D.A7.d, 9);
    expect(abstandEbenen(D.A8.e, D.A8.f)).toMatchObject({ art: 'parallel', faktor: 2, d: 2 });
    expect(imKf(D.A8.f, D.A8.Q)).toBe(true);
    expect(nächster(D.A8.e, D.A8.Q).d).toBeCloseTo(D.A8.d, 9);
    const a9 = nächster(D.A9.k, D.A9.Q);
    a9.F.forEach((c, i) => expect(c).toBeCloseTo(D.A9.F[i]!, 9));
    expect(D.A9.Q.map((c, i) => 2 * a9.F[i]! - c)).toEqual(D.A9.Qs);
    expect(nächster(D.A11.k, D.A11.M).d).toBeCloseTo(D.A11.d, 9);
    expect(D.A11.d - D.A11.r).toBeCloseTo(D.A11.abstand, 9);
    expect(lageRaster(D.A12.g, D.E)).toBe('schneidet');
    expect(imKf(D.E, D.A12.S)).toBe(true);
  });
  it('Aufgabe 10: genau a = 1 und a = 4 (Raster) liefern den Abstand 1', () => {
    const treffer: number[] = [];
    for (let a = -10; a <= 10; a += 0.5) if (Math.abs(nächster(D.E, [a, 1, -1]).d - 1) < 1e-9) treffer.push(a);
    expect(treffer).toEqual([D.A10.a1, D.A10.a2]);
  });
  it('Aufgabe 6: nur g₃ hat einen Abstand größer als 0, die anderen schneiden oder liegen in E', () => {
    const lagen = [D.A6.g1, D.A6.g2, D.A6.g3, D.A6.g4].map((g) => lageRaster(g, D.E));
    expect(lagen).toEqual(['liegtIn', 'schneidet', 'parallel', 'schneidet']);
    expect(abstandGeradeEbene(D.A6.g3, D.E).d).toBeCloseTo(2 / 3, 9);
    expect(imKf(D.E, D.A6.g2.p)).toBe(true);
    expect(imKf(D.E, D.A6.g4.p)).toBe(true);
  });
});

/* ---------- Aufgaben ---------- */
describe('Aufgaben', () => {
  it('dreizehn Aufgaben: neun mit Eingabefeldern (einschließlich Zeichenaufgabe nicht), drei Auswahlfragen, eine Zeichenaufgabe, die richtige Position wechselt', () => {
    const html = rendern('ueberpruefen');
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '2', '4', '5', '7', '8', '9', '10', '11']);
    expect(fragen.map((f) => f.nummer)).toEqual(['3', '6', '13']);
    expect(html).toContain('Aufgabe 12:');
    expect(new Set(fragen.map((f) => f.optionen.findIndex((o) => o.richtig))).size).toBeGreaterThan(1);
    for (const f of fragen) expect(f.optionen.filter((o) => o.richtig)).toHaveLength(1);
    for (const f of fragen) for (const o of f.optionen) expect(alsText(o.rueckmeldung).length, `${f.nummer} ${o.id}`).toBeGreaterThan(30);
  });
  it('Aufgabe 1 bis 5: Ebene und Punkt aus dem Aufgabentext, Felder gegen die Orthonormalbasis-Rechnung', () => {
    rendern('ueberpruefen');
    const a1 = aufgaben.find((x) => x.nummer === '1')!;
    const n1 = nächster(kfIn(a1.children), punktIn(a1.children, 'Q'));
    expect([wert('1', 'f1'), wert('1', 'f2'), wert('1', 'f3')]).toEqual(n1.F.map((c) => Math.round(c * 1e9) / 1e9));
    expect(wert('1', 'd')).toBeCloseTo(n1.d, 9);
    const a2 = aufgaben.find((x) => x.nummer === '2')!;
    expect(aufgaben.find((x) => x.nummer === '2')!.felder[0]!.toleranz).toBe(0.01);
    expect(Math.abs(wert('2', 'd') - nächster(kfIn(a2.children), punktIn(a2.children, 'Q')).d)).toBeLessThanOrEqual(0.005);
    const a4 = aufgaben.find((x) => x.nummer === '4')!;
    const [pa, ua, va] = [...texte(a4.children).join(' ').matchAll(/\\begin\{pmatrix\}(.*?)\\end\{pmatrix\}/g)].map((m) => m[1]!.split('\\\\').map(zahl));
    const n4 = kreuz(ua!, va!);
    expect(Math.abs(wert('4', 'd') - nächster({ n: n4, d: skal(n4, pa!) }, punktIn(a4.children, 'Q')).d)).toBeLessThanOrEqual(0.005);
    const a5 = aufgaben.find((x) => x.nummer === '5')!;
    const n5 = nächster(kfIn(a5.children), punktIn(a5.children, 'Q'));
    expect(wert('5', 'd')).toBeCloseTo(n5.d, 9);
    expect(wert('5', 'h')).toBeCloseTo(n5.F[2]!, 9);
  });
  it('Aufgabe 7 bis 11: Felder gegen die unabhängige Rechnung', () => {
    rendern('ueberpruefen');
    const a7 = aufgaben.find((x) => x.nummer === '7')!;
    const k7 = kfIn(a7.children);
    const s7 = [...texte(a7.children).join(' ').matchAll(/\\begin\{pmatrix\}(.*?)\\end\{pmatrix\}/g)].map((m) => m[1]!.split('\\\\').map(zahl));
    const g7 = { p: s7[0]!, u: s7[1]! };
    expect(lageRaster(g7, k7)).toBe('parallel');
    expect(wert('7', 'd')).toBeCloseTo(nächster(k7, g7.p).d, 9);
    const a8 = aufgaben.find((x) => x.nummer === '8')!;
    const t8 = texte(a8.children).join(' ');
    const e8 = kfAus(t8.match(/E:\\ ([^,\s]*?=-?\d+)/)![0]);
    const f8 = kfAus(t8.match(/F:\\ ([^,\s]*?=-?\d+)/)![0]);
    expect(abstandEbenen(e8, f8).art).toBe('parallel');
    expect(wert('8', 'd')).toBeCloseTo(abstandEbenen(e8, f8).d, 9);
    const a9 = aufgaben.find((x) => x.nummer === '9')!;
    const k9 = kfIn(a9.children);
    const q9 = punktIn(a9.children, 'Q');
    const n9 = nächster(k9, q9);
    expect([wert('9', 'q1'), wert('9', 'q2'), wert('9', 'q3')]).toEqual(q9.map((c, i) => Math.round((2 * n9.F[i]! - c) * 1e9) / 1e9));
    expect(wert('10', 'a1')).toBe(1);
    expect(wert('10', 'a2')).toBe(4);
    const a11 = aufgaben.find((x) => x.nummer === '11')!;
    const k11 = kfIn(a11.children);
    const m11 = punktIn(a11.children, 'M');
    expect(wert('11', 'd')).toBeCloseTo(nächster(k11, m11).d, 9);
    expect(wert('11', 'k')).toBeCloseTo(nächster(k11, m11).d - 1.2, 9);
  });
  it('Auswahl 3: genau die richtige Antwort ist der Abstand, die Fehlerantworten sind typische Fehler', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '3')!;
    const k = kfIn(f.children);
    const q = punktIn(f.children, 'Q');
    const d = nächster(k, q).d;
    const z = Math.abs(skal(k.n, q) - k.d);
    const wertAus = (o: { text: ReactNode }) => {
      const m = texte(o.text).join('').match(/d=(-?)(?:\\frac\{(\d+)\}\{(\d+)\}|(\d+))/)!;
      return (m[1] ? -1 : 1) * (m[4] ? Number(m[4]) : Number(m[2]) / Number(m[3]));
    };
    const werte = f.optionen.map(wertAus);
    expect(werte.filter((w) => Math.abs(w - d) < 1e-9)).toHaveLength(1);
    expect(f.optionen.find((o) => o.richtig && Math.abs(wertAus(o) - d) < 1e-9)).toBeDefined();
    expect(werte).toContain(-d);
    expect(werte.some((w) => Math.abs(w - z) < 1e-9)).toBe(true);
    expect(werte.some((w) => Math.abs(w - z / 9) < 1e-9)).toBe(true);
  });
  it('Auswahl 6: genau eine der Geraden ist echt parallel zu E, die Fälle stimmen mit der Rasterrechnung', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '6')!;
    const k = kfIn(f.children);
    const lagen = f.optionen.map((o) => {
      const [p, u] = [...texte(o.text).join(' ').matchAll(/\\begin\{pmatrix\}(.*?)\\end\{pmatrix\}/g)].map((m) => m[1]!.split('\\\\').map(zahl));
      return { l: lageRaster({ p: p!, u: u! }, k), richtig: o.richtig };
    });
    expect(lagen.filter((x) => x.l === 'parallel')).toHaveLength(1);
    expect(lagen.every((x) => (x.l === 'parallel') === x.richtig)).toBe(true);
  });
  it('Auswahl 13: Die richtige Gleichung liefert den Spiegelpunkt, jede falsche liefert für das Beispiel einen anderen Punkt', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '13')!;
    const Q = [2, 2, 3];
    const r = abstandPunktEbene(D.E, Q);
    const S = spiegelpunkt(D.E, Q);
    const plus = (a: number[], b: number[], c = 1) => a.map((x, i) => x + c * b[i]!);
    const kandidaten: Record<string, number[]> = {
      'OQ′=2OF−OQ': Q.map((c, i) => 2 * r.F[i]! - c),
      'OQ′=OQ+t0n': plus(Q, D.E.n, r.t),
      'OQ′=OQ−2t0n': plus(Q, D.E.n, -2 * r.t),
      'OQ′=2OQ−OF': Q.map((c, i) => 2 * c - r.F[i]!),
    };
    const schluessel = (o: { text: ReactNode }) => texte(o.text).join('').replace(/\\overrightarrow\{(O[QF])'?\}/g, (_, x) => x.replace('Q', 'Q').replace(/^O(Q|F)$/, (m: string) => m)).replace(/[\\ {}]/g, '').replace(/cdot/g, '').replace(/vec n/g, 'n');
    expect(f.optionen).toHaveLength(4);
    let richtige = 0;
    for (const o of f.optionen) {
      const t = schluessel(o);
      const treffer = Object.entries(kandidaten).find(([k]) => t.replace(/'/g, '′').replace(/t_0/g, 't0').replace(/vecn|n/g, 'n').includes(k.replace('OQ′=', '').replace(/[−]/g, '-')) || false);
      expect(treffer, t).toBeDefined();
      const gleichS = kandidaten[treffer![0]]!.every((c, i) => Math.abs(c - S[i]!) < 1e-9);
      expect(gleichS, `${o.id} ${t}`).toBe(o.richtig);
      if (gleichS) richtige++;
    }
    expect(richtige).toBe(1);
  });
  it('alle Hilfen, Lösungsschritte, Feldbeschriftungen und Rückmeldungen rendern ohne Formelfehler und ohne Gedankenstriche; der Lösungsweg nennt die Probe bzw. das Ergebnis', () => {
    const html = rendern('ueberpruefen');
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
  });
  it('Bei Eingabe der erwarteten Werte als Dezimalzahl oder Bruch sind die Felder lösbar (keine Wertepaare mit Wurzel ohne Toleranz)', () => {
    rendern('ueberpruefen');
    for (const a of aufgaben) for (const fe of a.felder) if (!Number.isInteger(fe.erwartet * 1000) ) expect(fe.toleranz, `${a.nummer} ${fe.id}`).toBeGreaterThan(0);
  });
});

/* ---------- Labore ---------- */
describe('Labore', () => {
  it('Lotlabor: fünf Regler, vier Schalter, Ergebnisse zunächst verborgen, kein Schalter Ebene und Raum, aber Schrägbild und räumlich', () => {
    const a = renderToStaticMarkup(<Lotlabor />);
    expect(a.match(/type="range"/g)).toHaveLength(5);
    expect(a.match(/type="checkbox"/g)).toHaveLength(4);
    expect(a).toContain('aria-label="Darstellung wählen"');
    expect(a).not.toContain('aria-label="Ebene oder Raum wählen"');
    expect(a).not.toContain('formel-fehler');
    expect(a).not.toContain('Länge der Strecke');
    expect(a).not.toContain('Lotfußpunkt ist');
    expect(a).not.toContain('Spiegelpunkt ist');
  });
  it('Parallelenlabor: ein Regler, ein Schalter, Abstand zunächst verborgen', () => {
    const a = renderToStaticMarkup(<Parallelenlabor />);
    expect(a.match(/type="range"/g)).toHaveLength(1);
    expect(a.match(/type="checkbox"/g)).toHaveLength(1);
    expect(a).not.toContain('formel-fehler');
    expect(a).not.toContain('Abstand von');
  });
  it('Lotlabor: für viele Einstellungen stimmen F, Q′, die Strecken und das Bild mit der unabhängigen Rechnung überein', () => {
    let n = 0;
    for (const q1 of [-3, 0, 2, 3]) for (const q2 of [-3, 1, 3]) for (const q3 of [-2, 0, 3]) for (const a of [-2, -0.5, 0, 1, 2]) for (const b of [-2, 0, 1.5]) {
      const q = [q1, q2, q3];
      const u = nächster(D.E, q);
      const x = u.F.map((c, i) => c + a * D.E_RICHTUNG.u[i]! + b * D.E_RICHTUNG.v[i]!);
      const { spec } = B.lotLaborBild(q, x, true, true);
      const pt = (name: string) => spec.punkte!.find((p) => p.name === name);
      if (pt('X')) {
        expect(imKf(D.E, pt('X')!.p)).toBe(true);
        expect(laenge(diff(pt('X')!.p, q))).toBeGreaterThanOrEqual(u.d - 1e-9);
      }
      if (pt('F')) pt('F')!.p.forEach((c, i) => expect(c).toBeCloseTo(u.F[i]!, 9));
      if (pt('Q′')) {
        const s = spiegelpunkt(D.E, q);
        pt('Q′')!.p.forEach((c, i) => expect(c).toBeCloseTo(s[i]!, 9));
        expect(abstandPunktEbene(D.E, pt('Q′')!.p).d).toBeCloseTo(u.d, 9);
      }
      for (const p of spec.punkte!.filter((p) => !p.nurText)) for (const c of p.p) expect(Math.abs(c)).toBeLessThanOrEqual(4 + 1e-9);
      n++;
    }
    expect(n).toBeGreaterThan(500);
  }, 60000);
  it('Parallelenlabor: jeder Punkt von g hat denselben Abstand, der Lotfußpunkt liegt in E', () => {
    for (let s = D.LABOR.sMin; s <= D.LABOR.sMax; s += 0.5) {
      const { spec, aussen } = B.parallelLaborBild(s);
      expect(aussen, `s=${s}`).toBe(false);
      for (const p of spec.punkte!.filter((q) => !q.nurText)) {
        const [bx, by] = bildpunkt(p.p);
        expect(bx, `s=${s} ${p.name}`).not.toBe(0);
        expect(by, `s=${s} ${p.name}`).not.toBe(0);
        expect(bx, `s=${s} ${p.name} x=y`).not.toBeCloseTo(by, 9);
      }
      const x = D.GERADE.p.map((c, i) => c + s * D.GERADE.u[i]!);
      expect(nächster(D.E, x).d).toBeCloseTo(2, 9);
      if (!aussen) {
        const F = spec.punkte!.find((p) => p.name === 'F')!;
        expect(imKf(D.E, F.p)).toBe(true);
        expect(laenge(diff(F.p, x))).toBeCloseTo(2, 9);
      }
    }
  });
});
