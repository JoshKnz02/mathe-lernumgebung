import { existsSync, readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/gerade-und-ebene/Bilder';
import * as D from '../content/modules/gerade-und-ebene/daten';
import Modul from '../content/modules/gerade-und-ebene/index';
import { Geradenlabor } from '../content/modules/gerade-und-ebene/Labor';
import meta from '../content/modules/gerade-und-ebene/meta.json';
import themen from '../content/themen.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { gleichsetzMatrix, stufenform } from '../src/lib/geradeebene';
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
const ORDNER = 'content/modules/gerade-und-ebene';
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
const kfAus = (tex: string): KF => {
  const [links, rechts] = tex.replace(/^E(?:_[a-z0-9])?:\\ /, '').split('=');
  const n = [1, 2, 3].map((i) => {
    const m = links!.match(new RegExp(`([+-]?\\d*)x_${i}`));
    if (!m) return 0;
    const z = m[1]!;
    return z === '' || z === '+' ? 1 : z === '-' ? -1 : Number(z);
  });
  return { n, d: Number(rechts) };
};
const kfIn = (n: ReactNode): KF => kfAus(texte(n).join(' ').match(/E(?:_[a-z0-9])?:\\ ([^,\s]*?=-?\d+)/)![0]);
/** Treffer der Geraden mit der Ebene auf einem Raster von t: kein, ein oder alle Parameter. */
const treffer = (g: { p: number[]; u: number[] }, k: KF): number[] => {
  const r: number[] = [];
  for (let t = -24; t <= 24; t += 0.25) if (Math.abs(skal(k.n, g.p.map((c, i) => c + t * g.u[i]!)) - k.d) < 1e-9) r.push(t);
  return r;
};
/** Lage über die Vorzeichen von n · x − d an zwei weit entfernten Punkten der Geraden (unabhängig von der Formel): beide 0 heißt liegt in, verschiedene Vorzeichen heißt schneidet, sonst echt parallel. */
const lageRaster = (g: { p: number[]; u: number[] }, k: KF): 'schneidet' | 'parallel' | 'liegtIn' => {
  const f = (t: number) => skal(k.n, g.p.map((c, i) => c + t * g.u[i]!)) - k.d;
  const [a, b] = [f(-1e4), f(1e4)];
  if (Math.abs(a) < 1e-6 && Math.abs(b) < 1e-6) return 'liegtIn';
  return a * b < 0 ? 'schneidet' : 'parallel';
};
const punktAus = (g: { p: number[]; u: number[] }, k: KF): number[] => g.p.map((c, i) => c + treffer(g, k)[0]! * g.u[i]!);
const imKf = (k: KF, x: number[]) => Math.abs(skal(k.n, x) - k.d) < 1e-6;

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Ebenen, hat vier Abschnitte, BPE 16.5', () => {
    expect(meta.id).toBe('gerade-und-ebene');
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
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"gerade-und-ebene"');
  });
  it('rendert ohne Formelfehler und ohne Gedankenstriche, mit der Fachsprache der Lehrkraft', () => {
    const html = rendern(null);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(html).not.toContain(z);
    for (const datei of [...readdirSync(ORDNER).map((x) => `${ORDNER}/${x}`), 'src/lib/geradeebene.ts', 'src/lib/geradeebenehilfen.ts']) for (const z of ['–', '—']) expect(readFileSync(datei, 'utf8'), datei).not.toContain(z);
    for (const wort of ['Durchstoßpunkt', 'echt parallel', 'liegt in', 'Geradenprobe', 'Koordinatenform', 'Parameterform', 'Normalenvektor', 'Skalarprodukt', 'Vektorprodukt', 'senkrecht']) expect(html, wort).toContain(wort);
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
  it('Abgrenzung: nichts aus den Folgemodulen (zwei Ebenen, Abstände, Lotfußpunkt, Spiegelung, Winkel, Volumen), keine Hesse-Form', () => {
    const m = rendern(null).replace(/<[^>]*>/g, ' ').match(/.{30}(Hesse|Schnittwinkel|Lotfußpunkt|Abstand|Spiegelung|Volumen|windschief|zwei Ebenen|Schnittgerade).{30}/);
    expect(m?.[0]).toBeUndefined();
  });
  it('das Erklären nimmt nichts vorweg: keine Deutung des Ergebnisses, kein Schnelltest, keine Orthogonalität', () => {
    const text = rendern('erklaeren').replace(/<[^>]*>/g, '');
    for (const wort of ['wahre Aussage', 'falsche Aussage', 'Schnelltest', 'Vielfaches', 'Skalarprodukt']) expect(text, wort).not.toContain(wort);
    expect(text).toContain('Entdecken');
  });
  it('verweist auf die Module davor', () => {
    const ids = [...quellen().matchAll(/modul="([a-z0-9-]+)"/g)].map((m) => m[1]!);
    for (const m of ['geradengleichung', 'normalenform-koordinatenform', 'vektorprodukt', 'loesbarkeit-lgs']) expect(ids, m).toContain(m);
    for (const id of ids) expect(existsSync(`content/modules/${id}/meta.json`), id).toBe(true);
  });
  it('Zeilenumbrüche in Rechnungen nur vor einem Gleichheitszeichen: Fortsetzungen mit {}+ nur bei Gleichungen (… + t · …)', () => {
    for (const m of readFileSync('src/lib/geradeebenehilfen.ts', 'utf8').matchAll(/\{\}([+\-]|\\cdot)/g)) throw new Error(`Fortsetzung ${m[0]}`);
    for (const m of quellen().matchAll(/\{\}([+\-]|\\cdot)(.{0,14})/g)) expect(/^(\$\{[rstk]\}|[rstk])\\{1,2}cdot|^\$\{(par < 0|F\.t|A\d|Sk)/.test(m[2]!) || /^\$\{/.test(m[2]!), m[0]).toBe(true);
    for (const tex of texteAusHtml(rendern(null))) for (const m of tex.matchAll(/\\\\\{\}([+\-]|\\cdot)(.{0,10})/g)) expect(/^[rstk]\\cdot|^\(?-?\d*\)?\\cdot\\begin\{pmatrix\}/.test(m[2]!), tex).toBe(true);
  });
  it('die Zahlen und Aufgaben der Arbeitsblätter der Lehrkraft kommen nicht vor (öffentliches Repository)', () => {
    const items = texteAusHtml(rendern(null)).map((x) => x.replace(/^[A-Za-z]+(?:_[a-z0-9]+)?:\\ /, ''));
    expect(items).not.toContain('3x_1+4x_2-3x_3=12');
    const tex = items.join(' ');
    for (const v of ['\\begin{pmatrix}2\\\\7\\\\1\\end{pmatrix}', '\\begin{pmatrix}10\\\\-1\\\\8\\end{pmatrix}', '\\begin{pmatrix}3\\\\-5\\\\0\\end{pmatrix}', '\\begin{pmatrix}-1\\\\-3\\\\0\\end{pmatrix}', '\\begin{pmatrix}6\\\\11\\\\']) expect(tex, v).not.toContain(v);
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
  ['FAELLE', B.RAUM_FAELLE, D.E], ['G', B.RAUM_G, D.E], ['PARALLEL_IN', B.RAUM_PARALLEL_IN, D.E], ['SENKRECHT', B.RAUM_SENKRECHT, D.E],
  ['A1', B.aufg1, D.A1.k], ['A3', B.aufg3, D.A3.k], ['A7', B.aufg7, D.A7.k], ['A8', B.aufg8, D.A8.k], ['A9', B.aufg9, D.A9.k], ['A11', B.aufg11, D.A3.k],
  ['Labor Start', B.laborBild(D.LABOR_START.p, D.LABOR_START.u).spec, D.E],
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
    for (const [name, s] of BILDER()) {
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
  it('Geraden: im Schrägbild nicht als Punkt, nicht parallel zu einem Achsenbild (mindestens 11°, Länge mindestens 1,5), Namen dicht an ihrer Linie', () => {
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
      const linienBild = geraden.map((l) => [bildpunkt(l.von), bildpunkt(l.bis)] as [number[], number[]]);
      for (const tx of s.punkte!.filter((p) => p.nurText)) {
        const b = bildpunkt(tx.p);
        const dl = linienBild.map(([a, c]) => abstandPS(b, a, c)).sort((x, y) => x - y);
        expect(dl[0], `${name} ${tx.name}`).toBeLessThanOrEqual(0.45);
        expect(dl[0], `${name} ${tx.name}`).toBeGreaterThanOrEqual(0.15);
        if (dl[1] !== undefined) expect(dl[1], `${name} ${tx.name} andere Linie`).toBeGreaterThanOrEqual(0.2);
        for (const p of s.punkte!.filter((q) => !q.nurText)) expect(Math.hypot(...diff(bildpunkt(p.p), b)), `${name} ${tx.name} Punkt ${p.name}`).toBeGreaterThanOrEqual(0.3);
      }
    }
    expect(n).toBeGreaterThan(12);
  });
  it('die graue Fläche liegt in der Ebene, jede Gerade im Bild liegt auf der Geraden der Daten (Punkte erfüllen die Geradengleichung)', () => {
    for (const [name, s, k] of BILDER()) for (const f of s.flaechen ?? []) for (const e of f.ecken) expect(imKf(k, e), `${name} Fläche`).toBe(true);
  });
});

describe('Beispiele und Daten', () => {
  it('die Ebene in Parameterform und in Koordinatenform sind dieselbe (n = u × v, d = n · p)', () => {
    expect(kreuz(D.E_PARAM.u, D.E_PARAM.v)).toEqual(D.E.n);
    expect(skal(D.E.n, D.E_PARAM.p)).toBe(D.E.d);
    for (let r = -3; r <= 3; r++) for (let s = -3; s <= 3; s++) expect(skal(D.E.n, D.E_PARAM.p.map((p, i) => p + r * D.E_PARAM.u[i]! + s * D.E_PARAM.v[i]!))).toBe(D.E.d);
  });
  it('die drei Fälle stimmen mit der Rasterrechnung überein, der Durchstoßpunkt und der Parameter stimmen', () => {
    const F = D.FAELLE;
    expect(lageRaster(F.g, D.E)).toBe('schneidet');
    expect(lageRaster(F.h, D.E)).toBe('parallel');
    expect(lageRaster(F.k, D.E)).toBe('liegtIn');
    expect(treffer(F.g, D.E)).toEqual([F.t]);
    expect(punktAus(F.g, D.E)).toEqual(F.S);
    expect(skal(D.E.n, F.h.u)).toBe(0);
    expect(skal(D.E.n, F.k.u)).toBe(0);
  });
  it('Orthogonalität: Die Gerade ist ein Vielfaches von n und trifft E in S, P liegt nicht in E', () => {
    const s = D.SENKRECHT;
    expect(s.g.u).toEqual(D.E.n);
    expect(imKf(D.E, s.P)).toBe(false);
    expect(treffer(s.g, D.E)).toEqual([s.t]);
    expect(punktAus(s.g, D.E)).toEqual(s.S);
  });
  it('Parameter b: genau b = 2 macht g parallel oder in E_b, mit P in E_b, mit dem Nullpunkt echt parallel', () => {
    const p = D.PARAMETER;
    for (let b = -10; b <= 10; b += 0.5) {
      const k = { n: [1, b, 2], d: 4 };
      const l = lageRaster({ p: p.P, u: p.u }, k);
      expect(l === 'schneidet', `${b}`).toBe(b !== p.b);
      if (b === p.b) {
        expect(l).toBe('liegtIn');
        expect(lageRaster({ p: p.P0, u: p.u }, k)).toBe('parallel');
      }
    }
  });
  it('Gleichsetzen: Die Zeilenstufenformen zeigen eine Lösung, keine Lösung und unendlich viele (Rang unabhängig mit Brüchen)', () => {
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
    for (const [g, erwartet] of [[D.FAELLE.g, 'schneidet'], [D.FAELLE.h, 'parallel'], [D.FAELLE.k, 'liegtIn']] as const) {
      const m = gleichsetzMatrix(D.E_PARAM, g);
      const koef = m.map((z) => z.slice(0, 3));
      const rk = rang(koef);
      const rm = rang(m);
      const art = rm > rk ? 'parallel' : rk === 3 ? 'schneidet' : 'liegtIn';
      expect(art).toBe(erwartet);
      expect(lageRaster(g, D.E)).toBe(erwartet);
      const st = stufenform(m);
      expect(st.length).toBe(3);
    }
  });
});

describe('Labor', () => {
  it('Geradenlabor: Regler, Schalter, Ergebnisse zunächst verborgen, kein Schalter Ebene und Raum, aber Schrägbild und räumlich', () => {
    const a = renderToStaticMarkup(<Geradenlabor />);
    expect(a.match(/type="range"/g)).toHaveLength(6);
    expect(a.match(/type="checkbox"/g)).toHaveLength(2);
    expect(a).toContain('aria-label="Darstellung wählen"');
    expect(a).not.toContain('aria-label="Ebene oder Raum wählen"');
    expect(a).not.toContain('formel-fehler');
    expect(a).not.toContain('Gleichung der Geradenprobe');
    expect(a).not.toContain('echt parallel');
  });
  it('Geradenlabor: für viele Einstellungen stimmen Lage, Durchstoßpunkt und Bild mit der Rasterrechnung überein', () => {
    let n = 0;
    for (const p1 of [-3, 0, 2]) for (const p2 of [-3, 1, 3]) for (const p3 of [-2, 0, 3]) for (const u1 of [-3, -1, 0, 2]) for (const u2 of [-2, 0, 1, 3]) for (const u3 of [-3, 0, 1, 2]) {
      const g = { p: [p1, p2, p3], u: [u1, u2, u3] };
      const { spec, art, aussen } = B.laborBild(g.p, g.u);
      if (g.u.every((c) => c === 0)) { expect(art).toBeNull(); continue; }
      expect(art, `${g.p} ${g.u}`).toBe(lageRaster(g, D.E));
      const S = spec.punkte!.find((q) => q.name === 'S');
      if (S) {
        // S liegt in E und auf g (S − P ist ein Vielfaches von u)
        expect(imKf(D.E, S.p), `${g.p} ${g.u}`).toBe(true);
        expect(kreuz(diff(S.p, g.p), g.u).every((c) => Math.abs(c) < 1e-6), `${g.p} ${g.u}`).toBe(true);
      }
      if (art === 'schneidet' && !aussen && !imKf(D.E, g.p)) expect(S).toBeDefined();
      for (const l of spec.linien ?? []) for (const c of [...l.von, ...l.bis]) expect(Math.abs(c)).toBeLessThanOrEqual(4 + 1e-9);
      n++;
    }
    expect(n).toBeGreaterThan(1000);
  }, 120000);
});

/* ---------- Aufgaben ---------- */
describe('Aufgaben', () => {
  it('elf Aufgaben: fünf mit Eingabefeldern, vier Auswahlfragen, zwei Zeichenaufgaben, die richtige Position wechselt', () => {
    const html = rendern('ueberpruefen');
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '4', '6', '7', '9']);
    expect(fragen.map((f) => f.nummer)).toEqual(['2', '3', '5', '10']);
    for (const nr of ['8', '11']) expect(html, nr).toContain(`Aufgabe ${nr}:`);
    expect(new Set(fragen.map((f) => f.optionen.findIndex((o) => o.richtig))).size).toBeGreaterThan(1);
    expect(fragen.map((f) => f.optionen.findIndex((o) => o.richtig))).not.toContain(-1);
    for (const f of fragen) expect(f.optionen.filter((o) => o.richtig)).toHaveLength(1);
  });
  it('Aufgabe 1: S aus der Rasterrechnung, Ebene und Gerade aus dem Aufgabentext', () => {
    rendern('ueberpruefen');
    const a = aufgaben.find((x) => x.nummer === '1')!;
    const k = kfIn(a.children);
    const [p, u] = spaltenAus(a.children);
    expect(k).toEqual(D.A1.k);
    const g = { p: p!, u: u! };
    expect(lageRaster(g, k)).toBe('schneidet');
    expect([wert('1', 's1'), wert('1', 's2'), wert('1', 's3')]).toEqual(punktAus(g, k));
  });
  it('Auswahl 2: Die Gleichung ist falsch für jedes t, die Gerade ist echt parallel (Raster), die richtige Antwort steht an erster Stelle nicht', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '2')!;
    expect(lageRaster(D.A2.g, D.A2.k)).toBe('parallel');
    expect(texte(f.children).join(' ')).toContain('-4=3');
    expect(alsText(f.optionen.find((o) => o.richtig)!.text)).toContain('echt parallel');
  });
  it('Auswahl 3: genau eine der vier Geraden liegt in E (Raster), die anderen sind parallel oder schneiden, jede mit ihrem Grund', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '3')!;
    const k = kfIn(f.children);
    expect(k).toEqual(D.A3.k);
    let n = 0;
    for (const o of f.optionen) {
      const [p, u] = spaltenAus(o.text);
      const g = { p: p!, u: u! };
      const liegt = lageRaster(g, k) === 'liegtIn';
      expect(liegt, o.id).toBe(o.richtig);
      if (liegt) n++;
    }
    expect(n).toBe(1);
    const lagen = f.optionen.map((o) => { const [p, u] = spaltenAus(o.text); return lageRaster({ p: p!, u: u! }, k); });
    expect(lagen.sort()).toEqual(['liegtIn', 'parallel', 'schneidet', 'schneidet']);
    // g₂ hat den Stützpunkt in E, aber n · u ≠ 0
    expect(imKf(k, D.A3.g2.p)).toBe(true);
    expect(skal(k.n, D.A3.g2.u)).not.toBe(0);
  });
  it('Aufgabe 4: n = u × v, d = n · p aus der Parameterform im Text, S aus der Rasterrechnung', () => {
    rendern('ueberpruefen');
    const a = aufgaben.find((x) => x.nummer === '4')!;
    const [p, u, v, gp, gu] = spaltenAus(a.children);
    const n = kreuz(u!, v!);
    const k = { n, d: skal(n, p!) };
    expect(k).toEqual(D.A4.k);
    const g = { p: gp!, u: gu! };
    expect(lageRaster(g, k)).toBe('schneidet');
    expect([wert('4', 's1'), wert('4', 's2'), wert('4', 's3')]).toEqual(punktAus(g, k));
  });
  it('Auswahl 5: Die Matrix gehört zur Parameterform und h, die Gerade ist echt parallel, die letzte Zeile ist ein Widerspruch', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '5')!;
    const [p, u, v, hp, hu] = spaltenAus(f.children);
    const e = { p: p!, u: u!, v: v! };
    const m = stufenform(gleichsetzMatrix(e, { p: hp!, u: hu! }));
    const k = { n: kreuz(e.u, e.v), d: skal(kreuz(e.u, e.v), e.p) };
    expect(lageRaster({ p: hp!, u: hu! }, k)).toBe('parallel');
    expect(m[2]!.slice(0, 3)).toEqual([0, 0, 0]);
    expect(m[2]![3]).not.toBe(0);
    expect(texte(f.children).join(' ')).toContain(String(m[2]![3]));
  });
  it('Aufgabe 6: a ist der einzige Wert (Raster aller a von −10 bis 10 in Halbschritten), bei dem g parallel ist, und dann echt parallel', () => {
    rendern('ueberpruefen');
    const a = aufgaben.find((x) => x.nummer === '6')!;
    const [p, u] = spaltenAus(a.children);
    const treffer6: number[] = [];
    for (let w = -10; w <= 10; w += 0.5) {
      const l = lageRaster({ p: p!, u: u! }, { n: [w, 1, -1], d: 3 });
      if (l !== 'schneidet') { treffer6.push(w); expect(l).toBe('parallel'); }
    }
    expect(treffer6).toEqual([wert('6', 'a')]);
  });
  it('Aufgabe 7: Die Gerade ist P + t n, S aus der Rasterrechnung, P liegt nicht in E', () => {
    rendern('ueberpruefen');
    const k = kfIn(aufgaben.find((x) => x.nummer === '7')!.children);
    const g = { p: D.A7.P, u: k.n };
    expect(k).toEqual(D.A7.k);
    expect(imKf(k, D.A7.P)).toBe(false);
    expect([wert('7', 's1'), wert('7', 's2'), wert('7', 's3')]).toEqual(punktAus(g, k));
  });
  it('Aufgabe 9: S aus der Rasterrechnung, Ebene und Gerade aus dem Aufgabentext', () => {
    rendern('ueberpruefen');
    const a = aufgaben.find((x) => x.nummer === '9')!;
    const k = kfIn(a.children);
    const [u] = spaltenAus(a.children);
    const pm = texte(a.children).join(' ').match(/A\(([-\d\\,|]+)\)/)![1]!.split('\\,|\\,').map(zahl);
    const g = { p: pm, u: u! };
    expect(k).toEqual(D.A9.k);
    expect([wert('9', 's1'), wert('9', 's2'), wert('9', 's3')]).toEqual(punktAus(g, k));
  });
  it('Aufgabe 8 und 11: Die genannten Geraden haben die angegebene Lage (Raster), der Punkt P liegt nicht in E bzw. in E', () => {
    const a = D.A8;
    expect(imKf(a.k, a.P)).toBe(false);
    expect(lageRaster(a.par, a.k)).toBe('parallel');
    expect(lageRaster(a.schn, a.k)).toBe('schneidet');
    expect(punktAus(a.schn, a.k)).toEqual(a.S);
    expect(treffer(a.schn, a.k)).toEqual([a.t]);
    const b = D.A11;
    expect(imKf(b.k, b.g.p)).toBe(true);
    expect(lageRaster(b.g, b.k)).toBe('schneidet');
    expect(punktAus(b.g, b.k)).toEqual(b.g.p);
  });
  it('Auswahl 10: genau eine richtige Antwort, die falschen haben je ihren Grund', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '10')!;
    expect(f.optionen.filter((o) => o.richtig)).toHaveLength(1);
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
  it('das Beispiel ist das der Erklärung, rendert ohne Formelfehler', () => {
    const h = rendern('zusammenfassung');
    expect(h).not.toContain('formel-fehler');
    expect(texteAusHtml(h).join(' ')).toContain('2x_1-x_2+2x_3=2');
    expect(h).toContain('Schnelltest');
  });
});
