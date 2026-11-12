import { existsSync, readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/zwei-ebenen/Bilder';
import * as D from '../content/modules/zwei-ebenen/daten';
import Modul from '../content/modules/zwei-ebenen/index';
import { Zweiebenenlabor } from '../content/modules/zwei-ebenen/Labor';
import meta from '../content/modules/zwei-ebenen/meta.json';
import themen from '../content/themen.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { stufenform } from '../src/lib/geradeebene';
import { freieVariablen, gleichsetzMatrixEE, lageEbenen } from '../src/lib/zweiebenen';
import { RAUM_BEREICH, RAUM_GRENZE, bildpunkt, normiert, raumLagen, sperrlinienRaum, x1ZahlMitte, type RaumBildSpec } from '../src/lib/schraegbild';
import { lageAbstand } from '../src/lib/vektorbild';

interface AufgabeAufruf { nummer: string; children: ReactNode; felder: { id: string; erwartet: number; beschriftung: ReactNode }[]; hilfen: ReactNode[]; loesung: ReactNode[] }
interface FrageAufruf { nummer: string; children: ReactNode; optionen: { id: string; richtig: boolean; text: ReactNode; rueckmeldung: ReactNode }[]; erklaerung: ReactNode }
const aufgaben: AufgabeAufruf[] = [];
const fragen: FrageAufruf[] = [];
vi.mock('../src/components/Aufgabe', () => ({
  Aufgabe: (p: AufgabeAufruf & { nummer: string | number }) => {
    aufgaben.push({ ...p, nummer: String(p.nummer) });
    return <div data-aufgabe={String(p.nummer)}>{p.children}{p.hilfen.map((h, i) => <div key={`h${i}`}>{h}</div>)}{p.loesung.map((h, i) => <div key={`l${i}`}>{h}</div>)}</div>;
  },
}));
vi.mock('../src/components/Auswahlfrage', () => ({
  Auswahlfrage: (p: FrageAufruf) => {
    fragen.push(p);
    return <div data-frage={p.nummer}>{p.children}{p.erklaerung}</div>;
  },
}));
function rendern(abschnitt: string | null = null): string {
  aufgaben.length = 0;
  fragen.length = 0;
  return renderToStaticMarkup(<AbschnittAnbieter value={abschnitt}><Modul /></AbschnittAnbieter>);
}
const ORDNER = 'content/modules/zwei-ebenen';
const quellen = () => readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts')).map((d) => readFileSync(`${ORDNER}/${d}`, 'utf8')).join('\n');
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const texteAusHtml = (html: string): string[] => [...html.matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<'));
const texte = (n: ReactNode): string[] => texteAusHtml(alsText(n));
const zahl = (s: string) => Number(s.replace(/\{,\}/g, '.'));
const spaltenAus = (n: ReactNode): number[][] => [...texte(n).join(' ').matchAll(/\\begin\{pmatrix\}(.*?)\\end\{pmatrix\}/g)].map((m) => m[1]!.split('\\\\').map(zahl)).filter((s) => s.every((x) => Number.isFinite(x)));
const wert = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!.erwartet;

/* ---------- unabhängige Methoden ---------- */
type KF = { n: number[]; d: number };
const skal = (a: number[], b: number[]) => a[0]! * b[0]! + a[1]! * b[1]! + a[2]! * b[2]!;
const kreuz = (a: number[], b: number[]): number[] => [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!].map((x) => x + 0);
const diff = (b: number[], a: number[]) => b.map((x, i) => x - a[i]!);
const nullv = (v: number[]) => v.every((x) => Math.abs(x) < 1e-9);
const kfAus = (tex: string): KF => {
  const [links, rechts] = tex.replace(/^[A-Za-z]+(?:_[a-z0-9])?:\\ /, '').split('=');
  const n = [1, 2, 3].map((i) => {
    const m = links!.match(new RegExp(`([+-]?\\d*)x_${i}`));
    if (!m) return 0;
    const z = m[1]!;
    return z === '' || z === '+' ? 1 : z === '-' ? -1 : Number(z);
  });
  return { n, d: Number(rechts) };
};
/** Alle Koordinatenformen mit Namen (E_1: …) in einem Knoten. */
const formenIn = (n: ReactNode): KF[] => [...texte(n).join(' ').matchAll(/[A-Z](?:_\d)?:\\ ((?:-?\d*x_[123]\+?-?)+(?:\d*x_[123])?=-?\d+)/g)].map((m) => kfAus(m[1]!));
/** Rang einer Matrix mit Gleitkommazahlen (unabhängig von der Bibliothek). */
const rang = (m: number[][]) => {
  const a = m.map((z) => [...z]);
  let r = 0;
  for (let c = 0; c < a[0]!.length && r < a.length; c++) {
    const p = a.findIndex((z, i) => i >= r && Math.abs(z[c]!) > 1e-9);
    if (p < 0) continue;
    [a[r], a[p]] = [a[p]!, a[r]!];
    for (let i = r + 1; i < a.length; i++) { const f = a[i]![c]! / a[r]![c]!; a[i] = a[i]!.map((x, j) => x - f * a[r]![j]!); }
    r++;
  }
  return r;
};
/** Lage zweier Ebenen über Ränge: Rang der Koeffizienten- und der erweiterten Matrix. */
const lageRang = (a: KF, b: KF): 'schneiden' | 'parallel' | 'identisch' => {
  const rk = rang([a.n, b.n]);
  const re = rang([[...a.n, a.d], [...b.n, b.d]]);
  return rk === 2 ? 'schneiden' : re === 2 ? 'parallel' : 'identisch';
};
const imKf = (k: KF, x: number[]) => Math.abs(skal(k.n, x) - k.d) < 1e-6;
const imPar = (e: { p: number[]; u: number[]; v: number[] }, k: KF, r: number, s: number) => imKf(k, e.p.map((c, i) => c + r * e.u[i]! + s * e.v[i]!));
const kfZuParam = (e: { p: number[]; u: number[]; v: number[] }): KF => ({ n: kreuz(e.u, e.v), d: skal(kreuz(e.u, e.v), e.p) });

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Ebenen, hat vier Abschnitte, BPE 16.5', () => {
    expect(meta.id).toBe('zwei-ebenen');
    expect(meta.thema).toBe('vektorgeometrie');
    expect(meta.unterbereich).toBe('ebenen');
    expect(meta.bpe).toEqual(['16.5']);
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
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"zwei-ebenen"');
  });
  it('rendert ohne Formelfehler und ohne Gedankenstriche, mit der Fachsprache der Lehrkraft', () => {
    const html = rendern(null);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(html).not.toContain(z);
    for (const datei of [...readdirSync(ORDNER).map((x) => `${ORDNER}/${x}`), 'src/lib/zweiebenen.ts', 'src/lib/zweiebenenhilfen.ts']) for (const z of ['–', '—']) expect(readFileSync(datei, 'utf8'), datei).not.toContain(z);
    for (const wort of ['Schnittgerade', 'echt parallel', 'identisch', 'Ebenenprobe', 'Koordinatenform', 'Parameterform', 'Normalenvektor', 'Zeilenstufenform', 'Gauß']) expect(html, wort).toContain(wort);
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).not.toMatch(/\d\/\d/);
    expect(html).not.toMatch(/\bpi\b|Pi\b/);
    expect(html).not.toMatch(/Skalarmultiplikation/);
  });
  it('wo das Vektorprodukt vorkommt, steht auch Kreuzprodukt', () => {
    const text = rendern(null).replace(/<[^>]*>/g, ' ');
    expect(text).not.toMatch(/Vektorprodukt(?! \(Kreuzprodukt\))/);
  });
  it('Abgrenzung: keine Abstände, Lotfußpunkte, Spiegelungen, Winkel, Volumen, keine Hesse-Form', () => {
    const m = rendern(null).replace(/<[^>]*>/g, ' ').match(/.{30}(Hesse|Schnittwinkel|Lotfußpunkt|Abstand|Spiegelung|Volumen).{30}/);
    expect(m?.[0]).toBeUndefined();
  });
  it('das Erklären nimmt nichts vorweg: keine Deutung der Ergebnisse, kein Schnelltest, keine Pivots', () => {
    const text = rendern('erklaeren').replace(/<[^>]*>/g, '');
    for (const wort of ['wahre Aussage', 'falsche Aussage', 'Schnelltest', 'Vielfache', 'freie Unbekannte', 'Pivot', 'Widerspruch']) expect(text, wort).not.toContain(wort);
    expect(text).toContain('Entdecken');
  });
  it('verweist auf die Module davor', () => {
    const ids = [...quellen().matchAll(/modul="([a-z0-9-]+)"/g)].map((m) => m[1]!);
    for (const m of ['gerade-und-ebene', 'einfuehrung-ebenen', 'normalenform-koordinatenform', 'gauss-algorithmus', 'gegenseitige-lage-geraden']) expect(ids, m).toContain(m);
    for (const id of ids) expect(existsSync(`content/modules/${id}/meta.json`), id).toBe(true);
  });
  it('Zeilenumbrüche in Rechnungen nur vor einem Gleichheitszeichen: Fortsetzungen mit {}+ nur bei Gleichungen (… + s · …)', () => {
    for (const m of readFileSync('src/lib/zweiebenenhilfen.ts', 'utf8').matchAll(/\{\}([+\-]|\\cdot)/g)) throw new Error(`Fortsetzung ${m[0]}`);
    for (const tex of texteAusHtml(rendern(null))) for (const m of tex.matchAll(/\\\\\{\}([+\-]|\\cdot)(.{0,12})/g)) expect(/^[rstk]_?\d?\\cdot|^-?[rs]\\cdot/.test(m[2]!) || /^s\\cdot/.test(m[2]!), tex).toBe(true);
  });
  it('die Zahlen und Aufgaben der Arbeitsblätter der Lehrkraft kommen nicht vor (öffentliches Repository)', () => {
    const items = texteAusHtml(rendern(null)).map((x) => x.replace(/^[A-Za-z]+(?:_[a-z0-9]+)?:\\ /, ''));
    for (const g of ['x_1+2x_2+3x_3=-2', '-x_1-3x_2-2x_3=5', '3x_1+6x_2+9x_3=5', '-2x_1-4x_2-6x_3=4', 'x_1+2x_2-4x_3=1', 'x_1+2x_2=3', '-x_1-2x_2=-1']) expect(items, g).not.toContain(g);
    const tex = items.join(' ');
    for (const v of ['\\begin{pmatrix}-2\\\\1\\\\1\\end{pmatrix}', '\\begin{pmatrix}-4\\\\2\\\\1\\end{pmatrix}', '\\begin{pmatrix}1\\\\0\\\\2\\end{pmatrix}+r', '\\begin{pmatrix}2\\\\3\\\\2\\end{pmatrix}']) expect(tex, v).not.toContain(v);
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
const BILDER = (): [string, RaumBildSpec, KF, KF][] => [
  ['SCHNEIDEN', B.RAUM_SCHNEIDEN, D.E, D.F], ['PARALLEL', B.RAUM_PARALLEL, D.E, D.G], ['IDENTISCH', B.RAUM_IDENTISCH, D.E, D.H],
  ['A7', B.aufg7, D.E, D.A7.par], ['A8', B.aufg8, D.A8.d1, D.A8.d2], ['Labor Start', B.laborBild(D.LABOR_START).spec, D.E, D.LABOR_START],
];
describe('Bilder', () => {
  it('alle Punkte im Koordinatensystem, keiner im Schrägbild auf einer Achse, keine zwei an derselben Bildstelle, Textalternative, feine Darstellung', () => {
    for (const [name, s] of BILDER()) {
      const sichtbar = (s.punkte ?? []).filter((p) => !p.ohneText && !p.nurText);
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
    for (const [name, s] of BILDER()) {
      const lagen = raumLagen(s);
      expect(lagen.length, name).toBe((s.punkte ?? []).filter((p) => !p.ohneText && !p.nurText).length);
      for (const l of lagen) {
        const pt = s.punkte!.find((p) => p.name === l.name)!;
        const andere = [...zahlenX1, ...lagen.filter((x) => x !== l).map((x) => normiert(x.mitte))];
        const d = lageAbstand(l.lage, bildpunkt(pt.p), { bereich: RAUM_BEREICH, teilung: 1, linien: sperrlinienRaum(s.linien), belegt: andere });
        expect(d, `${name} ${l.name}`).toBeGreaterThanOrEqual(0.015);
      }
    }
  });
  it('die Schnittgerade s im Bild: schwarz, nicht als Punkt, nicht parallel zu einem Achsenbild (mindestens 11°, Länge mindestens 1,5), liegt in beiden Ebenen, Name dicht an der Linie', () => {
    let n = 0;
    for (const [name, s, k1, k2] of BILDER()) {
      const geraden = (s.linien ?? []).filter((l) => l.farbe === '#222222' && l.breite === 2);
      expect(geraden.length > 0, name).toBe(lageRang(k1, k2) === 'schneiden' && !name.startsWith('Labor'));
      for (const l of geraden) {
        const v = diff(l.bis, l.von);
        const b = [v[1]! - v[0]! / 2, v[2]! - v[0]! / 2];
        expect(Math.hypot(b[0]!, b[1]!), `${name} Länge`).toBeGreaterThanOrEqual(1.5);
        for (const a of AXEN) expect(winkelZu(b, a), `${name} ${v}`).toBeGreaterThanOrEqual(11);
        expect(imKf(k1, l.von) && imKf(k1, l.bis) && imKf(k2, l.von) && imKf(k2, l.bis), `${name} in beiden Ebenen`).toBe(true);
        const linienBild = [[bildpunkt(l.von), bildpunkt(l.bis)] as [number[], number[]]];
        for (const tx of (s.punkte ?? []).filter((p) => p.nurText)) {
          const bt = bildpunkt(tx.p);
          const dl = abstandPS(bt, linienBild[0]![0], linienBild[0]![1]);
          expect(dl, `${name} ${tx.name}`).toBeLessThanOrEqual(0.45);
          expect(dl, `${name} ${tx.name}`).toBeGreaterThanOrEqual(0.15);
          for (const p of (s.punkte ?? []).filter((q) => !q.nurText)) expect(Math.hypot(...diff(bildpunkt(p.p), bt)), `${name} ${tx.name} Punkt ${p.name}`).toBeGreaterThanOrEqual(0.3);
        }
        n++;
      }
    }
    expect(n).toBeGreaterThanOrEqual(2);
  });
  it('die erste Fläche liegt in der ersten, die zweite in der zweiten Ebene, bei Parallelen ohne gemeinsame Punkte', () => {
    for (const [name, s, k1, k2] of BILDER()) {
      const [f1, f2] = s.flaechen ?? [];
      if (f1) for (const e of f1.ecken) expect(imKf(k1, e), `${name} Fläche 1`).toBe(true);
      if (f2) for (const e of f2.ecken) expect(imKf(k2, e), `${name} Fläche 2`).toBe(true);
    }
  });
});

describe('Beispiele und Daten', () => {
  it('E in Parameterform und Koordinatenform ist dieselbe Ebene (n = u × v, d = n · p), ebenso F, G, H in beiden Formen', () => {
    for (const [e, k, name] of [[D.E_PARAM, D.E, 'E'], [D.F_PARAM, D.F, 'F'], [D.G_PARAM, D.G, 'G'], [D.H_PARAM, D.H, 'H']] as const) {
      const z = kfZuParam(e);
      expect(nullv(kreuz(z.n, k.n)), name).toBe(true);
      const lam = z.n.find((x) => x !== 0) !== undefined ? k.n[z.n.findIndex((x) => x !== 0)]! / z.n[z.n.findIndex((x) => x !== 0)]! : 0;
      expect(Math.abs(k.d - lam * z.d), name).toBeLessThan(1e-9);
      for (let r = -3; r <= 3; r++) for (let s = -3; s <= 3; s++) expect(imPar(e, k, r, s), `${name} ${r} ${s}`).toBe(true);
    }
    expect(kfZuParam(D.E_PARAM)).toEqual(D.E);
  });
  it('die drei Fälle stimmen mit dem Rang überein, die Bibliothek ebenso', () => {
    expect(lageRang(D.E, D.F)).toBe('schneiden');
    expect(lageRang(D.E, D.G)).toBe('parallel');
    expect(lageRang(D.E, D.H)).toBe('identisch');
    for (const k of [D.F, D.G, D.H]) expect(lageEbenen(D.E, k)).toBe(lageRang(D.E, k));
    expect(D.H.n).toEqual(D.E.n.map((x) => -2 * x));
    expect(D.H.d).toBe(-2 * D.E.d);
    expect(D.G.n).toEqual(D.E.n);
  });
  it('die Schnittgerade liegt in beiden Ebenen, jeder Punkt der Rasterlösung liegt auf ihr', () => {
    const s = D.SCHNITT;
    for (const t of [-3, -1, 0, 2, 5]) {
      const x = s.p.map((c, i) => c + t * s.u[i]!);
      expect(imKf(D.E, x)).toBe(true);
      expect(imKf(D.F, x)).toBe(true);
    }
    for (let x = -6; x <= 6; x++) for (let y = -6; y <= 6; y++) for (let z = -6; z <= 6; z++) if (imKf(D.E, [x, y, z]) && imKf(D.F, [x, y, z])) expect(nullv(kreuz(diff([x, y, z], s.p), s.u))).toBe(true);
  });
  it('Gleichsetzen und Gauß: freie Unbekannte 1, keine Lösung, 2 (Rang unabhängig)', () => {
    const werte = [[D.F_PARAM, 1], [D.G_PARAM, null], [D.H_PARAM, 2]] as const;
    for (const [f, erwartet] of werte) {
      const m = gleichsetzMatrixEE(D.E_PARAM, f);
      const rk = rang(m.map((z) => z.slice(0, 4)));
      const re = rang(m);
      expect(freieVariablen(stufenform(m))).toBe(erwartet);
      if (erwartet === null) expect(re).toBeGreaterThan(rk);
      else expect(4 - rk).toBe(erwartet);
    }
    for (const [k, erwartet] of [[D.F, 1], [D.G, null], [D.H, 2]] as const) {
      const m = [[...D.E.n, D.E.d], [...k.n, k.d]];
      const st = stufenform(m);
      const rk = rang(m.map((z) => z.slice(0, 3)));
      expect(freieVariablen(st)).toBe(erwartet === null ? null : 3 - rk);
      if (erwartet === 2) expect(st[1]).toEqual([0, 0, 0, 0]);
    }
  });
  it('Parameter a in Vermutung 5: genau für a = 4 sind die Normalenvektoren Vielfache, dann identisch (d = 4)', () => {
    for (let a = -10; a <= 10; a += 0.5) {
      const k = { n: [a, -2, 4], d: D.PARAMETER.d };
      const l = lageRang(D.E, k);
      expect(l === 'schneiden', `${a}`).toBe(a !== D.PARAMETER.a);
      if (a === D.PARAMETER.a) expect(l).toBe('identisch');
    }
  });
});

describe('Labor', () => {
  it('Zweiebenenlabor: Regler, Schalter, Ergebnisse zunächst verborgen, kein Schalter Ebene und Raum, aber Schrägbild und räumlich', () => {
    const a = renderToStaticMarkup(<Zweiebenenlabor />);
    expect(a.match(/type="range"/g)).toHaveLength(4);
    expect(a.match(/type="checkbox"/g)).toHaveLength(2);
    expect(a).toContain('aria-label="Darstellung wählen"');
    expect(a).not.toContain('aria-label="Ebene oder Raum wählen"');
    expect(a).not.toContain('formel-fehler');
    expect(a).not.toContain('Die Ebenen sind');
    expect(a).not.toContain('Vielfache voneinander');
  });
  it('Zweiebenenlabor: für viele Einstellungen stimmen Lage, Schnittgerade und Bild mit der Rangrechnung überein', () => {
    let n = 0;
    for (const a of [-3, -2, 0, 1, 2, 3]) for (const b of [-3, -1, 0, 2]) for (const c of [-2, 0, 1, 3]) for (const d of [-6, -4, -1, 0, 2, 5]) {
      const k = { n: [a, b, c], d };
      if (nullv(k.n)) continue;
      const { spec } = B.laborBild(k);
      const art = lageRang(D.E, k);
      expect(lageEbenen(D.E, k), `${k.n} ${d}`).toBe(art);
      const f = spec.flaechen ?? [];
      for (const e of f[1]?.ecken ?? []) expect(imKf(k, e)).toBe(true);
      const s = (spec.linien ?? []).filter((l) => l.farbe === '#222222' && l.breite === 2);
      if (art !== 'schneiden') expect(s).toHaveLength(0);
      for (const l of s) expect(imKf(D.E, l.von) && imKf(k, l.von) && imKf(D.E, l.bis) && imKf(k, l.bis)).toBe(true);
      for (const l of spec.linien ?? []) for (const x of [...l.von, ...l.bis]) expect(Math.abs(x)).toBeLessThanOrEqual(4 + 1e-9);
      n++;
    }
    expect(n).toBeGreaterThan(300);
  }, 120000);
});

/* ---------- Aufgaben ---------- */
describe('Aufgaben', () => {
  it('zehn Aufgaben: vier mit Eingabefeldern, vier Auswahlfragen, zwei Zeichenaufgaben, die richtige Position wechselt', () => {
    const html = rendern('ueberpruefen');
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '3', '5', '8']);
    expect(fragen.map((f) => f.nummer)).toEqual(['2', '4', '6', '10']);
    for (const nr of ['7', '9']) expect(html, nr).toContain(`Aufgabe ${nr}:`);
    expect(new Set(fragen.map((f) => f.optionen.findIndex((o) => o.richtig))).size).toBeGreaterThan(1);
    for (const f of fragen) expect(f.optionen.filter((o) => o.richtig)).toHaveLength(1);
  });
  it('Aufgabe 1: Die Schnittgerade x = (a + b t | c + d t | t) liegt für viele t in beiden Ebenen (Gleichungen aus dem Aufgabentext)', () => {
    rendern('ueberpruefen');
    const [e, f] = formenIn(aufgaben.find((x) => x.nummer === '1')!.children);
    expect([e, f]).toEqual([D.A1.e, D.A1.f]);
    expect(lageRang(e!, f!)).toBe('schneiden');
    const [a, b, c, d] = ['a', 'b', 'c', 'd'].map((i) => wert('1', i));
    for (const t of [-3, -1, 0, 1, 2, 4]) {
      const x = [a! + b! * t, c! + d! * t, t];
      expect(imKf(e!, x), `${t}`).toBe(true);
      expect(imKf(f!, x), `${t}`).toBe(true);
    }
  });
  it('Auswahl 2: Die zweite Gleichung ist ein Vielfaches der ersten samt d, die Ebenen sind identisch (Rang), die richtige Antwort sagt es', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '2')!;
    const [e, g] = formenIn(f.children);
    expect(lageRang(e!, g!)).toBe('identisch');
    expect(alsText(f.optionen.find((o) => o.richtig)!.text)).toContain('identisch');
  });
  it('Aufgabe 3: r = α + β s beschreibt genau die gemeinsamen Punkte (Parameterraster), n · u, n · v, n · p aus dem Text', () => {
    rendern('ueberpruefen');
    const a = aufgaben.find((x) => x.nummer === '3')!;
    const [p, u, v] = spaltenAus(a.children);
    const e = { p: p!, u: u!, v: v! };
    const [fk] = formenIn(a.children);
    expect(fk).toEqual(D.A3.f);
    const al = wert('3', 'alpha');
    const be = wert('3', 'beta');
    for (let r = -6; r <= 6; r++) for (let s = -6; s <= 6; s++) expect(imPar(e, fk!, r, s), `${r} ${s}`).toBe(r === al + be * s);
  });
  it('Auswahl 4: Die Normalenvektoren sind Vielfache, aber d nicht mit demselben Faktor, also echt parallel (Rang), die falschen Antworten haben je ihren Grund', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '4')!;
    const [e, g] = formenIn(f.children);
    expect(lageRang(e!, g!)).toBe('parallel');
    expect(nullv(kreuz(e!.n, g!.n))).toBe(true);
    expect(alsText(f.optionen.find((o) => o.richtig)!.text)).toContain('echt parallel');
    for (const o of f.optionen) expect(alsText(o.rueckmeldung).length, o.id).toBeGreaterThan(30);
  });
  it('Aufgabe 5: a ist der einzige Wert (von −10 bis 10 in Halbschritten) mit parallelen Normalenvektoren, dann echt parallel', () => {
    rendern('ueberpruefen');
    const a = aufgaben.find((x) => x.nummer === '5')!;
    expect(texte(a.children).join(' ')).toContain(`F_a:\\ a\\,x_1-2x_2+4x_3=${D.A5.d}`);
    const gefunden: number[] = [];
    for (let w = -10; w <= 10; w += 0.5) {
      const l = lageRang(D.E, { n: [w, -2, 4], d: D.A5.d });
      if (l !== 'schneiden') { gefunden.push(w); expect(l).toBe('parallel'); }
    }
    expect(gefunden).toEqual([wert('5', 'a')]);
  });
  it('Auswahl 6: Die Matrix gehört zu den Ebenen im Text, die Ebenen schneiden sich (eine freie Unbekannte), die Stufenform im Text stimmt', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '6')!;
    const sp = spaltenAus(f.children);
    const q1 = { p: sp[0]!, u: sp[1]!, v: sp[2]! };
    const q2 = { p: sp[3]!, u: sp[4]!, v: sp[5]! };
    expect(lageRang(kfZuParam(q1), kfZuParam(q2))).toBe('schneiden');
    const m = gleichsetzMatrixEE(q1, q2);
    expect(4 - rang(m.map((z) => z.slice(0, 4)))).toBe(1);
    expect(rang(m)).toBe(rang(m.map((z) => z.slice(0, 4))));
    expect(texte(f.children).join(' ')).toContain(stufenform(m).map((z) => z.join('&')).join('\\\\'));
    expect(alsText(f.optionen.find((o) => o.richtig)!.text)).toContain('schneiden sich');
  });
  it('Aufgabe 8: Der Punkt liegt in beiden Dachebenen und hat die Höhe 2, der First ist ihre Schnittgerade', () => {
    rendern('ueberpruefen');
    const a = aufgaben.find((x) => x.nummer === '8')!;
    const [d1, d2] = formenIn(a.children);
    expect([d1, d2]).toEqual([D.A8.d1, D.A8.d2]);
    const p = ['1', '2', '3'].map((i) => wert('8', `p${i}`));
    expect(imKf(d1!, p)).toBe(true);
    expect(imKf(d2!, p)).toBe(true);
    expect(p[2]).toBe(2);
    expect(lageRang(d1!, d2!)).toBe('schneiden');
    // die Gerade der Daten liegt in beiden Ebenen und enthält den Punkt
    for (const t of [-1, 0, 1, 2]) { const x = D.A8.first.p.map((c, i) => c + t * D.A8.first.u[i]!); expect(imKf(d1!, x) && imKf(d2!, x)).toBe(true); }
    expect(nullv(kreuz(diff(p, D.A8.first.p), D.A8.first.u))).toBe(true);
  });
  it('Aufgabe 7 und 9: Die parallele Ebene durch P ist echt parallel zu E und enthält P, H ist identisch zu E mit vielfachem Normalenvektor', () => {
    const k = D.A7.par;
    expect(imKf(k, D.A7.P)).toBe(true);
    expect(imKf(D.E, D.A7.P)).toBe(false);
    expect(lageRang(D.E, k)).toBe('parallel');
    expect(lageRang(D.E, D.H)).toBe('identisch');
  });
  it('Auswahl 10: genau eine richtige Antwort, die falschen haben je ihren Grund', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '10')!;
    for (const o of f.optionen) expect(alsText(o.rueckmeldung).length, o.id).toBeGreaterThan(30);
  });
  it('alle Aufgaben: Texte ohne Formelfehler und Gedankenstriche, mindestens zwei Hilfen und Lösungsschritte, Werte ganzzahlig', () => {
    rendern('ueberpruefen');
    const knoten: ReactNode[] = [];
    for (const x of fragen) { for (const o of x.optionen) knoten.push(o.text, o.rueckmeldung); knoten.push(x.erklaerung, x.children); }
    for (const x of aufgaben) {
      knoten.push(x.children, ...x.hilfen, ...x.loesung, ...x.felder.map((fl) => fl.beschriftung));
      expect(x.hilfen.length, x.nummer).toBeGreaterThanOrEqual(2);
      expect(x.loesung.length, x.nummer).toBeGreaterThanOrEqual(2);
      for (const fl of x.felder) expect(Number.isInteger(fl.erwartet), `${x.nummer} ${fl.id}`).toBe(true);
    }
    for (const k of knoten) {
      const h = alsText(k);
      expect(h).not.toContain('formel-fehler');
      expect(h).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(h).not.toContain(z);
      expect(h).not.toMatch(/\d\/\d/);
    }
  });
});

describe('Zusammenfassung', () => {
  it('rendert ohne Formelfehler, mit Übersicht der Lagebeziehungen und Beispiel', () => {
    const h = rendern('zusammenfassung');
    expect(h).not.toContain('formel-fehler');
    expect(h).toContain('Übersicht: Lagebeziehungen im Raum');
    expect(h).toContain('Schnelltest');
    expect(texteAusHtml(h).join(' ')).toContain('3r+3s=0');
  });
});
