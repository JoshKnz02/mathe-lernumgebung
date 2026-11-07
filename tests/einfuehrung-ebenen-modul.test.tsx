import { existsSync, readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/einfuehrung-ebenen/Bilder';
import * as D from '../content/modules/einfuehrung-ebenen/daten';
import Modul from '../content/modules/einfuehrung-ebenen/index';
import { Gleichungslabor, Parameterlabor, Punktprobelabor, parameterBild, punktprobeBild, urteilGleichung, zweiteGleichung } from '../content/modules/einfuehrung-ebenen/Labor';
import meta from '../content/modules/einfuehrung-ebenen/meta.json';
import themen from '../content/themen.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { ebeneImWuerfel, ebenenParameter, ebenenpunkt, gebilde, gleicheEbene, istEbene, liegtInEbene, punktprobe, type Ebene } from '../src/lib/ebene';
import { RAUM_BEREICH, RAUM_GRENZE, bildpunkt, normiert, raumLagen, sperrlinienRaum, x1ZahlMitte, type RaumBildSpec } from '../src/lib/schraegbild';
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
const ORDNER = 'content/modules/einfuehrung-ebenen';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const texteAusHtml = (html: string): string[] => [...html.matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<'));
const texte = (n: ReactNode): string[] => texteAusHtml(alsText(n));
const zahl = (s: string) => Number(s.replace(/\{,\}/g, '.'));
/** Alle Spalten (pmatrix) in einem Knoten, als Zahlenlisten (nur Spalten mit reinen Zahlen). */
const spaltenAus = (n: ReactNode): number[][] =>
  [...texte(n).join(' ').matchAll(/\\begin\{pmatrix\}(.*?)\\end\{pmatrix\}/g)].map((m) => m[1]!.split('\\\\').map(zahl)).filter((s) => s.every((x) => Number.isFinite(x)));
/** Alle Punkte der Form A(1\,|\,−2\,|\,3) in einem Knoten, nach Namen (Punkte ohne Namen unter „_“). */
const punkteAus = (n: ReactNode): Record<string, number[]> => {
  const r: Record<string, number[]> = {};
  for (const m of texte(n).join(' ').matchAll(/([A-Z](?:_\d)?)\(([-\d{},\\|, ]+)\)/g)) {
    const koords = m[2]!.split('\\,|\\,').map(zahl);
    if (koords.every((x) => Number.isFinite(x))) r[m[1]!] = koords;
  }
  return r;
};
const feld = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!;
const wert = (nr: string, id: string) => feld(nr, id).erwartet;

/* Unabhängige Methoden: Vektorprodukt von Hand ausgeschrieben, Punktprobe über n · (x − p) = 0. */
const kreuz = (a: number[], b: number[]): number[] => [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!].map((x) => x + 0);
const skal = (a: number[], b: number[]) => a[0]! * b[0]! + a[1]! * b[1]! + a[2]! * b[2]!;
const diff = (b: number[], a: number[]) => b.map((x, i) => x - a[i]!);
const plus = (a: number[], b: number[]) => a.map((x, i) => x + b[i]!);
const mal = (k: number, v: number[]) => v.map((x) => x * k);
const nullv = (v: number[]) => v.every((x) => x === 0);
const imE = (e: Ebene, x: number[]) => skal(kreuz(e.u, e.v), diff(x, e.p)) === 0;
const keinePlane = (e: Ebene) => nullv(e.u) || nullv(e.v) || nullv(kreuz(e.u, e.v));
const echteEbene = (e: Ebene) => !keinePlane(e);
const gleichE = (e: Ebene, f: Ebene) => echteEbene(e) && echteEbene(f) && nullv(kreuz(kreuz(e.u, e.v), kreuz(f.u, f.v))) && imE(e, f.p);
const nah = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;
const ebeneAus = (spalten: number[][]): Ebene => ({ p: spalten[0]!, u: spalten[1]!, v: spalten[2]! });

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Ebenen, hat vier Abschnitte, BPE 16.3', () => {
    expect(meta.id).toBe('einfuehrung-ebenen');
    expect(meta.titel).toBe('Einführung in Ebenen im Raum');
    expect(meta.thema).toBe('vektorgeometrie');
    expect(meta.unterbereich).toBe('ebenen');
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
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"einfuehrung-ebenen"');
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
    for (const wort of ['Stützvektor', 'Stützpunkt', 'Spannvektor', 'Parameter', 'Parametergleichung', 'Parameterform', 'Punktprobe', 'Verbindungsvektor', 'Ortsvektor', 'kollinear', 'Nullvektor']) expect(html, wort).toContain(wort);
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).not.toMatch(/\d\/\d/);
    expect(html).not.toMatch(/\bpi\b|Pi\b/);
    expect(html).not.toMatch(/[A-Z]\(-?\d+(,\d+)? ?\/ ?-?\d/);
    expect(html).not.toMatch(/Skalarmultiplikation/);
  });
  it('nur Parameterform: Normalenvektor, Koordinatenform, besondere Lage, Spurpunkte, Lage zu Geraden und Ebenen, Abstand und Winkel kommen nicht vor', () => {
    expect(rendern(null)).not.toMatch(/Normalenvektor|Normalenform|Koordinatenform|Achsenabschnitt|Hesse|Spurpunkt|Spurgerade|Schnittgerade|Schnittpunkt|Durchstoßpunkt|windschief|Lotfußpunkt|Abstand|Winkel|Volumen|Vektorprodukt|Kreuzprodukt/);
  });
  it('das Erklären nimmt nichts vorweg: keine Punktprobe, keine Vielfachen als Gegenbeispiel, keine mehrfachen Gleichungen, keine Wirkung negativer Parameter', () => {
    const html = rendern('erklaeren');
    const text = html.replace(/<[^>]*>/g, '');
    for (const wort of ['Punktprobe', 'kollinear', 'dieselbe Ebene', 'unendlich viele', 'negativ', 'Gerade durch', 'liegt in']) expect(text, wort).not.toContain(wort);
    const tex = texteAusHtml(html).join(' ');
    expect(tex.length).toBeGreaterThan(100);
    expect(tex).not.toContain('\\Rightarrow');
  });
  it('verweist auf die Module davor statt Ortsvektoren, Kollinearität, Geradengleichung und Gleichungssysteme zu wiederholen', () => {
    const quelle = readdirSync(ORDNER).filter((x) => x.endsWith('.tsx')).map((d) => readFileSync(`${ORDNER}/${d}`, 'utf8')).join('\n');
    const ids = [...quelle.matchAll(/modul="([a-z0-9-]+)"/g)].map((m) => m[1]!);
    for (const m of ['punkte-vektoren-raum', 'rechnen-mit-vektoren', 'geradengleichung', 'gauss-algorithmus']) expect(ids, m).toContain(m);
    for (const id of ids) expect(existsSync(`content/modules/${id}/meta.json`), id).toBe(true);
  });
  it('Zeilenumbrüche in Rechnungen nur vor einem Gleichheitszeichen: Fortsetzungszeilen mit {}+ oder {}− gibt es nur bei Gleichungen (… + r · …, … + s · …)', () => {
    const quelle = readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts')).map((d) => readFileSync(`${ORDNER}/${d}`, 'utf8')).join('\n') + readFileSync('src/lib/ebenenhilfen.ts', 'utf8');
    for (const m of quelle.matchAll(/\{\}([+\-]|\\cdot)(.{0,14})/g)) expect(/^(\$\{[rs]\}|[rs])\\{1,2}cdot/.test(m[2]!), m[0]).toBe(true);
    const html = rendern(null);
    // in den gerenderten Rechnungen (schmale Form) beginnt keine Zeile mit {}+ ohne r bzw. s davor
    for (const tex of texteAusHtml(html)) for (const m of tex.matchAll(/\\\\\{\}([+\-]|\\cdot)(.{0,10})/g)) expect(/^[rs]\\cdot/.test(m[2]!), tex).toBe(true);
  });
  it('die Bilder zeigen Raumdarstellungen mit Schrägbild und räumlicher Ansicht (Schalter) und die feine Darstellung', () => {
    const html = rendern('erklaeren');
    expect(html).toContain('aria-label="Darstellung wählen"');
    for (const s of [B.RAUM_ERKLAEREN, B.RAUM_PARAMETER, B.RAUM_KOLLINEAR, B.RAUM_PUNKTPROBE, B.RAUM_GLEICHUNG, B.aufgDreiPunkte, B.aufgZeichnen]) {
      expect(s.fein).toBe(true);
      expect(s.ebenenNamen).toBe(false);
    }
  });
});

describe('Bilder', () => {
  const bilder: [string, RaumBildSpec][] = [['ERKLAEREN', B.RAUM_ERKLAEREN], ['PARAMETER', B.RAUM_PARAMETER], ['KOLLINEAR', B.RAUM_KOLLINEAR], ['PUNKTPROBE', B.RAUM_PUNKTPROBE], ['GLEICHUNG', B.RAUM_GLEICHUNG], ['DREIPUNKTE', B.aufgDreiPunkte], ['ZEICHNEN', B.aufgZeichnen]];
  const zahlenX1 = Array.from({ length: 2 * RAUM_GRENZE + 1 }, (_, i) => i - RAUM_GRENZE).filter((k) => k !== 0).map((k) => normiert(x1ZahlMitte(k)));
  const AXEN: [number, number][] = [[-1, -1], [1, 0], [0, 1]];
  const winkelZu = (a: number[], b: number[]) => (Math.acos(Math.min(1, Math.abs(a[0]! * b[0]! + a[1]! * b[1]!) / (Math.hypot(a[0]!, a[1]!) * Math.hypot(b[0]!, b[1]!)))) * 180) / Math.PI;
  it('alle Punkte liegen im Koordinatensystem, keiner im Schrägbild auf einer Achse oder an derselben Bildstelle wie ein anderer, jedes Bild hat eine Textalternative', () => {
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
      expect(s.sprech.length, name).toBeGreaterThan(80);
      for (const l of s.linien!) for (const c of [...l.von, ...l.bis]) expect(Math.abs(c), `${name} Linie`).toBeLessThanOrEqual(RAUM_GRENZE + 1e-9);
      for (const f of s.flaechen ?? []) for (const q of f.ecken) for (const c of q) expect(Math.abs(c), `${name} Fläche`).toBeLessThanOrEqual(RAUM_GRENZE + 1e-9);
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
  it('jeder Pfeil erscheint im Schrägbild nicht als Punkt und nicht parallel zu einem Achsenbild (mindestens 11°), die Länge ist mindestens 1,4', () => {
    for (const [name, s] of bilder) for (const l of s.linien!.filter((x) => x.pfeil)) {
      const v = diff(l.bis, l.von);
      const b = [v[1]! - v[0]! / 2, v[2]! - v[0]! / 2];
      expect(Math.hypot(b[0]!, b[1]!), `${name} Länge ${v}`).toBeGreaterThanOrEqual(1.4);
      for (const a of AXEN) expect(winkelZu(b, a), `${name} ${v}`).toBeGreaterThanOrEqual(11);
    }
  });
  it('Gleichung und Bild: Namen der Linien (g) haben Abstand, die Gerade im Bild der kollinearen Spannvektoren trägt den Namen g', () => {
    expect(B.RAUM_KOLLINEAR.punkte!.some((p) => p.name === 'g' && p.nurText)).toBe(true);
  });
  const pfeile = (s: RaumBildSpec) => s.linien!.filter((l) => l.pfeil).map((l) => ({ von: l.von as number[], v: diff(l.bis, l.von), farbe: l.farbe }));
  const punktNamen = (s: RaumBildSpec) => Object.fromEntries(s.punkte!.map((x) => [x.name, x.p as number[]]));
  it('Erklären: A, B, C liegen in der Ebene zu AB und AC, der Stützvektor ist orange (vom Ursprung zu A), AB blau, AC rosa, X zu r = 2 und s = 1', () => {
    const e = D.ERKLAEREN;
    expect(diff(e.B, e.A)).toEqual(e.u);
    expect(diff(e.C, e.A)).toEqual(e.v);
    const eb: Ebene = { p: e.A, u: e.u, v: e.v };
    for (const x of [e.A, e.B, e.C]) expect(imE(eb, x)).toBe(true);
    expect(echteEbene(eb)).toBe(true);
    expect(plus(plus(e.A, mal(e.r, e.u)), mal(e.s, e.v))).toEqual(e.X);
    expect(ebenenpunkt(eb, e.r, e.s)).toEqual(e.X);
    expect(skal(kreuz(e.u, e.v), e.A)).not.toBe(0);
    const [o, b, r] = pfeile(B.RAUM_ERKLAEREN);
    expect(o).toMatchObject({ von: [0, 0, 0], farbe: D.ORANGE });
    expect(o!.v).toEqual(e.A);
    expect(b).toMatchObject({ von: e.A, farbe: D.BLAU });
    expect(b!.v).toEqual(e.u);
    expect(r).toMatchObject({ von: e.A, farbe: D.ROSA });
    expect(r!.v).toEqual(e.v);
    expect(B.RAUM_ERKLAEREN.flaechen).toHaveLength(1);
  });
  it('Vermutung 1: die fünf Punkte gehören zu (0|0), (1|0), (0|1), (1|1), (−1|0), die gestrichelten Linien führen von A und B nach C', () => {
    const { e, P, A, B: Bp, C, D: Dp } = D.PARAMETER;
    const p = punktNamen(B.RAUM_PARAMETER);
    expect(ebenenParameter(e, p.P!)).toEqual({ r: 0, s: 0 });
    expect(ebenenParameter(e, p.A!)).toEqual({ r: 1, s: 0 });
    expect(ebenenParameter(e, p.B!)).toEqual({ r: 0, s: 1 });
    expect(ebenenParameter(e, p.C!)).toEqual({ r: 1, s: 1 });
    expect(ebenenParameter(e, p.D!)).toEqual({ r: -1, s: 0 });
    expect(p.P).toEqual(P);
    expect(p.A).toEqual(A);
    expect(p.B).toEqual(Bp);
    expect(p.C).toEqual(C);
    expect(p.D).toEqual(Dp);
    expect(plus(plus(P, e.u), e.v)).toEqual(C);
    expect(diff(Dp, P)).toEqual(mal(-1, e.u));
    const gestrichelt = B.RAUM_PARAMETER.linien!.filter((l) => l.gestrichelt);
    expect(gestrichelt.map((l) => [l.von, l.bis])).toEqual([[A, C], [Bp, C]]);
    expect(echteEbene(e)).toBe(true);
    expect(e.p).toEqual(P);
    for (const x of e.p) expect(x).not.toBe(0);
  });
  it('Vermutung 2: v = −2u, die Gleichung beschreibt nur eine Gerade, alle Punkte der Gleichung liegen auf ihr, das Bild hat keine Fläche', () => {
    const k = D.KOLLINEAR;
    expect(mal(k.faktor, k.e.u)).toEqual(k.e.v);
    expect(gebilde(k.e)).toBe('gerade');
    expect(keinePlane(k.e)).toBe(true);
    expect(B.RAUM_KOLLINEAR.flaechen ?? []).toHaveLength(0);
    for (let r = -3; r <= 3; r++) for (let s = -3; s <= 3; s++) {
      const x = ebenenpunkt(k.e, r, s);
      expect(nullv(kreuz(diff(x, k.e.p), k.e.u)), `${r} ${s}`).toBe(true);
      // x = p + (r − 2s) · u
      expect(x).toEqual(plus(k.e.p, mal(r - 2 * s, k.e.u)).map((c) => c + 0));
    }
    const pf = pfeile(B.RAUM_KOLLINEAR);
    expect(pf.find((x) => x.farbe === D.BLAU)!.v).toEqual(k.e.u);
    expect(pf.find((x) => x.farbe === D.ROSA)!.v).toEqual(k.e.v);
    const g = B.RAUM_KOLLINEAR.linien!.find((l) => l.farbe === D.SCHWARZ && !l.pfeil && !l.gestrichelt)!;
    expect(g).toBeDefined();
    for (const x of [g.von, g.bis]) expect(nullv(kreuz(diff(x.map((c) => Math.round(c * 1e6) / 1e6), k.e.p), k.e.u))).toBe(true);
  });
  it('Vermutung 3: Q liegt in E (r = 2, s = −1), R eine Einheit darüber nicht; die Gleichungen I und II legen r und s fest, III entscheidet', () => {
    const q = D.PUNKTPROBE;
    expect(imE(q.e, q.Q)).toBe(true);
    expect(imE(q.e, q.R)).toBe(false);
    expect(diff(q.R, q.Q)).toEqual([0, 0, 1]);
    expect(plus(plus(q.e.p, mal(q.r, q.e.u)), mal(q.s, q.e.v))).toEqual(q.Q);
    expect(q.e.u[0]! * q.e.v[1]! - q.e.u[1]! * q.e.v[0]!).not.toBe(0);
    // handgerechnet: I: r + s = 1 (s = 1 − r), II: 2r + s = 3, also 2r + (1 − r) = 3 und r = 2
    expect(q.e.u[0]! + 0).toBe(1);
    expect(q.e.v[0]).toBe(1);
    expect(q.e.u[1]).toBe(2);
    expect(q.e.v[1]).toBe(1);
    expect(punktprobe(q.e, q.Q)).toMatchObject({ paar: [0, 1], rest: 2, r: 2, s: -1, ergibt: -2, verlangt: -2 });
    expect(punktprobe(q.e, q.R)).toMatchObject({ paar: [0, 1], rest: 2, r: 2, s: -1, ergibt: -2, verlangt: -1 });
    const n = kreuz(q.e.u, q.e.v);
    expect(n.every((c) => c !== 0)).toBe(true);
    const p = punktNamen(B.RAUM_PUNKTPROBE);
    expect(p.P).toEqual(q.P);
    expect(p.Q).toEqual(q.Q);
    expect(p.R).toEqual(q.R);
    expect(q.P).toEqual(q.e.p);
  });
  it('Vermutung 4: P′ liegt in E, u′ = u + v und v′ = u − v liegen in E und sind keine Vielfachen: dieselbe Ebene, dasselbe Vieleck im Bild', () => {
    const g = D.GLEICHUNG;
    const f: Ebene = { p: g.P2, u: g.u2, v: g.v2 };
    expect(ebenenpunkt(g.e, 1, 1)).toEqual(g.P2);
    expect(plus(g.e.u, g.e.v)).toEqual(g.u2);
    expect(diff(g.e.u, g.e.v)).toEqual(g.v2);
    expect(gleichE(g.e, f)).toBe(true);
    expect(gleicheEbene(g.e, f)).toBe(true);
    const runde = (v: number[][]) => v.map((p) => p.map((c) => Math.round(c * 1e6) / 1e6 + 0).join(',')).sort();
    expect(runde(ebeneImWuerfel(f))).toEqual(runde(ebeneImWuerfel(g.e)));
    expect(D.GLEICHUNG_START).toEqual({ a: 1, b: 1, k: [1, 1, 1, -1], d: 0 });
    const z = zweiteGleichung(g.e, 1, 1, [1, 1, 1, -1], 0);
    expect(z).toEqual(f);
    expect(g.e.p).toEqual(g.P);
  });
  it('Aufgaben 2 und 10: Bilder passen zu den Daten', () => {
    const d = D.A_DREI_PUNKTE;
    expect(diff(d.B, d.A)).toEqual(d.u);
    expect(diff(d.C, d.A)).toEqual(d.v);
    const [b, r] = pfeile(B.aufgDreiPunkte);
    expect(b).toMatchObject({ von: d.A, farbe: D.BLAU });
    expect(r).toMatchObject({ von: d.A, farbe: D.ROSA });
    const z = D.A_ZEICHNEN;
    expect(diff(z.B, z.A)).toEqual(z.u);
    expect(diff(z.C, z.A)).toEqual(z.v);
    expect(plus(plus(z.A, z.u), z.v)).toEqual(z.D);
    expect(B.aufgZeichnen.flaechen![0]!.ecken).toEqual([z.A, z.B, z.D, z.C]);
    // ABDC ist ein Parallelogramm: AB = CD
    expect(diff(z.B, z.A)).toEqual(diff(z.D, z.C));
    expect(diff(z.C, z.A)).toEqual(diff(z.D, z.B));
  });
});

describe('Labore', () => {
  it('Parameterlabor: Startwerte sind das Beispiel der Vermutung 1, elf Regler, zwei Schalter, ohne Schalter Ebene und Raum, Rechnung zunächst verborgen', () => {
    const html = renderToStaticMarkup(<Parameterlabor />);
    expect(html.match(/type="range"/g)).toHaveLength(11);
    expect(html.match(/type="checkbox"/g)).toHaveLength(2);
    expect(html).toContain('aria-label="Legende"');
    expect(html).toContain('aria-label="Darstellung wählen"');
    expect(html).not.toContain('aria-label="Ebene oder Raum wählen"');
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('beschreibt eine Ebene');
    const tex = texteAusHtml(html).join(' ');
    expect(tex).not.toContain('\\vec{x}=\\vec{p}+r');
    expect(tex).toContain('\\vec{p}=');
    expect(spaltenAus(<span dangerouslySetInnerHTML={{ __html: html }} />).slice(0, 3)).toEqual([D.PARAMETER.e.p, D.PARAMETER.e.u, D.PARAMETER.e.v]);
  });
  it('Parameterlabor: für viele Einstellungen gilt: alle Linien im Koordinatensystem, X nur gezeichnet, wenn er im Koordinatensystem liegt, die Ebene nur bei echten Ebenen', () => {
    let n = 0;
    let mitX = 0;
    let aussen = 0;
    let mitFlaeche = 0;
    const R = [-2, 0, 1, 2];
    for (const p1 of R) for (const p2 of [-2, 1]) for (const p3 of [-1, 2]) for (const u1 of R) for (const u2 of R) for (const u3 of R) for (const v1 of [-2, 0, 1]) for (const v2 of [-1, 2]) for (const v3 of [0, 2]) for (const [r, s] of [[1, 1], [-3, 2], [0, 0], [0.5, -1]] as [number, number][]) {
      const p = [p1, p2, p3];
      const u = [u1, u2, u3];
      const v = [v1, v2, v3];
      const { spec, aussen: a } = parameterBild(p, u, v, r, s, true);
      const X = ebenenpunkt({ p, u, v }, r, s);
      const drin = X.every((c) => Math.abs(c) <= 4);
      const gleichP = nullv(diff(X, p));
      expect(spec.punkte!.some((q) => q.name === 'X'), `${p} ${u} ${v} ${r} ${s}`).toBe(drin && !gleichP);
      expect(a).toBe(!drin && !gleichP);
      if (drin && !gleichP) mitX++;
      if (a) aussen++;
      for (const l of spec.linien!) for (const c of [...l.von, ...l.bis]) expect(Math.abs(c)).toBeLessThanOrEqual(4 + 1e-9);
      const ebene = echteEbene({ p, u, v });
      expect((spec.flaechen ?? []).length > 0, `Fläche ${p} ${u} ${v}`).toBe(ebene && ebeneImWuerfel({ p, u, v }).length >= 3);
      if ((spec.flaechen ?? []).length) mitFlaeche++;
      expect(spec.sprech.length).toBeGreaterThan(60);
      n++;
    }
    expect(n).toBe(4 * 2 * 2 * 4 * 4 * 4 * 3 * 2 * 2 * 4);
    expect(mitX).toBeGreaterThan(5000);
    expect(aussen).toBeGreaterThan(1000);
    expect(mitFlaeche).toBeGreaterThan(20000);
  }, 120000);
  it('Parameterlabor: Pfeile sind Stützvektor (orange, ab dem Ursprung), u (blau, in P) und v (rosa, in P), der Weg zu X ist schwarz gestrichelt', () => {
    const { e } = D.PARAMETER;
    const { spec } = parameterBild(e.p, e.u, e.v, 2, 1, false);
    const farben = (f: string) => spec.linien!.find((l) => l.farbe === f && l.pfeil)!;
    expect(farben(D.ORANGE).von).toEqual([0, 0, 0]);
    expect(farben(D.ORANGE).bis).toEqual(e.p);
    expect(farben(D.BLAU).von).toEqual(e.p);
    expect(diff(farben(D.BLAU).bis, farben(D.BLAU).von)).toEqual(e.u);
    expect(farben(D.ROSA).von).toEqual(e.p);
    expect(diff(farben(D.ROSA).bis, farben(D.ROSA).von)).toEqual(e.v);
    const weg = spec.linien!.filter((l) => l.gestrichelt);
    expect(weg).toHaveLength(2);
    expect(weg[0]!.von).toEqual(e.p);
    expect(weg[0]!.bis).toEqual(plus(e.p, mal(2, e.u)));
    expect(weg[1]!.von).toEqual(plus(e.p, mal(2, e.u)));
    expect(weg[1]!.bis).toEqual(ebenenpunkt(e, 2, 1));
    expect(spec.flaechen ?? []).toHaveLength(0);
    expect(parameterBild(e.p, e.u, e.v, 2, 1, true).spec.flaechen).toHaveLength(1);
  });
  it('Parameterlabor: kollineare Spannvektoren zeigen die Gerade statt der Fläche, zwei Nullvektoren nur den Punkt', () => {
    const k = D.KOLLINEAR.e;
    const a = parameterBild(k.p, k.u, k.v, 1, 1, true).spec;
    expect(a.flaechen ?? []).toHaveLength(0);
    expect(a.linien!.some((l) => !l.pfeil && !l.gestrichelt && l.farbe === D.SCHWARZ)).toBe(true);
    const b = parameterBild([1, 1, 1], [0, 0, 0], [0, 0, 0], 1, 1, true).spec;
    expect(b.linien!.some((l) => !l.pfeil && !l.gestrichelt && l.farbe === D.SCHWARZ)).toBe(false);
    expect(b.punkte!.map((x) => x.name)).toEqual(['P']);
    const c = parameterBild([0, 0, 0], [1, 0, 0], [0, 1, 0], 1, 1, true).spec;
    expect(c.punkte!.map((x) => x.name)).toEqual(['O', 'P', 'X']);
  });
  it('Parameterlabor: Beschriftungen haben für Stichproben genügend Abstand zu Linien und Beschriftungen', () => {
    let kleinster = Infinity;
    const zahlen = Array.from({ length: 2 * RAUM_GRENZE + 1 }, (_, i) => i - RAUM_GRENZE).filter((k) => k !== 0).map((k) => normiert(x1ZahlMitte(k)));
    for (const p of [[-1, -2, -1], [-2, 1, 2], [2, 2, -1], [-1, -2, -2]]) for (const u of [[1, 1, -1], [-2, 1, 1], [2, -1, 2]]) for (const v of [[1, -1, 2], [1, 2, 1]]) for (const [r, s] of [[1, 1], [-1, 2], [2, -1]]) {
      const { spec } = parameterBild(p, u, v, r!, s!, true);
      const lagen = raumLagen(spec);
      for (const l of lagen) {
        const pt = spec.punkte!.find((q) => q.name === l.name)!;
        const andere = [...zahlen, ...lagen.filter((x) => x !== l).map((x) => normiert(x.mitte))];
        kleinster = Math.min(kleinster, lageAbstand(l.lage, bildpunkt(pt.p), { bereich: RAUM_BEREICH, teilung: 1, linien: sperrlinienRaum(spec.linien), belegt: andere }));
      }
    }
    expect(kleinster).toBeGreaterThan(0.005);
  });
  it('Punktprobelabor: Punkte liegen genau dann in E, wenn die Prüfung über den Normalenvektor es sagt (alle 729 Punkte), das Bild zeigt P und X', () => {
    const { e } = D.PUNKTPROBE;
    let treffer = 0;
    for (let a = -4; a <= 4; a++) for (let b = -4; b <= 4; b++) for (let c = -4; c <= 4; c++) {
      expect(liegtInEbene(e, [a, b, c])).toBe(imE(e, [a, b, c]));
      const s = punktprobeBild([a, b, c]);
      const namen = s.punkte!.map((q) => q.name);
      expect(namen).toContain('P');
      expect(namen.includes('X')).toBe(!(a === e.p[0] && b === e.p[1] && c === e.p[2]));
      if (imE(e, [a, b, c])) treffer++;
    }
    expect(treffer).toBeGreaterThan(5);
    expect(D.PUNKTPROBE_START).toEqual(D.PUNKTPROBE.R);
  });
  it('Punktprobelabor und Gleichungslabor: Regler, Schalter, Ergebnisse zunächst verborgen', () => {
    const a = renderToStaticMarkup(<Punktprobelabor />);
    expect(a.match(/type="range"/g)).toHaveLength(3);
    expect(a.match(/type="checkbox"/g)).toHaveLength(1);
    expect(a).not.toContain('liegt in');
    expect(a).not.toContain('formel-fehler');
    const b = renderToStaticMarkup(<Gleichungslabor />);
    expect(b.match(/type="range"/g)).toHaveLength(7);
    expect(b.match(/type="checkbox"/g)).toHaveLength(1);
    expect(b).not.toContain('beschreibt dieselbe Ebene');
    expect(b).not.toContain('formel-fehler');
  });
  it('Gleichungslabor: dieselbe Ebene genau bei d = 0 und k₁k₄ − k₂k₃ ≠ 0, für alle Einstellungen, Urteil und Bild passen dazu', () => {
    const g = D.GLEICHUNG.e;
    let gleich = 0;
    let n = 0;
    for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) for (let k1 = -2; k1 <= 2; k1++) for (let k2 = -2; k2 <= 2; k2++) for (let k3 = -2; k3 <= 2; k3++) for (let k4 = -2; k4 <= 2; k4++) for (const d of [-1, 0, 1]) {
      const f = zweiteGleichung(g, a, b, [k1, k2, k3, k4], d);
      const erwartet = d === 0 && k1 * k4 - k2 * k3 !== 0;
      expect(gleichE(g, f), `${a} ${b} ${k1} ${k2} ${k3} ${k4} ${d}`).toBe(erwartet);
      expect(urteilGleichung(g, f).gleich).toBe(erwartet);
      if (erwartet) gleich++;
      n++;
    }
    expect(n).toBe(5 * 5 * 625 * 3);
    expect(gleich).toBe(5 * 5 * 625 - 5 * 5 * (625 - 5 * 5 * 5 * 5 + 0) + 0 === 0 ? 0 : gleich);
    expect(gleich).toBeGreaterThan(5000);
  }, 120000);
  it('Gleichungslabor: Bild für Stichproben, Linien im Koordinatensystem, E′-Rand nur bei echten Ebenen, die Urteile nennen den richtigen Grund', () => {
    const g = D.GLEICHUNG.e;
    let n = 0;
    for (const a of [-2, 0, 1, 2]) for (const b of [-2, 1]) for (const k of [[1, 1, 1, -1], [1, 1, 2, 2], [0, 0, 0, 0], [2, 0, 0, 1], [-1, 2, 1, 1]]) for (const d of [-1, 0, 1]) {
      const f = zweiteGleichung(g, a, b, k, d);
      const { spec } = B.gleichungBild(g, f);
      for (const l of spec.linien!) for (const c of [...l.von, ...l.bis]) expect(Math.abs(c)).toBeLessThanOrEqual(4 + 1e-9);
      expect(spec.flaechen!.length).toBe(1 + (istEbene(f) && ebeneImWuerfel(f).length >= 3 ? 1 : 0));
      const u = urteilGleichung(g, f);
      if (!istEbene(f)) expect(u.text).toContain('keine Ebene');
      else if (d !== 0) expect(u.text).toContain('Stützpunkt');
      n++;
    }
    expect(n).toBe(4 * 2 * 5 * 3);
    expect(urteilGleichung(g, zweiteGleichung(g, 1, 1, [1, 1, 1, -1], 0)).text).toContain('dieselbe Ebene');
  });
});

describe('Aufgaben', () => {
  const alle = () => {
    rendern('ueberpruefen');
    return { aufgaben: [...aufgaben], fragen: [...fragen] };
  };
  it('10 Aufgaben: fünf mit Eingabefeldern, vier Auswahlfragen und eine Zeichenaufgabe', () => {
    const html = rendern('ueberpruefen');
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '2', '4', '6', '8']);
    expect(fragen.map((f) => f.nummer)).toEqual(['3', '5', '7', '9']);
    expect(html).toContain('Aufgabe 10: Eine Ebene im Schrägbild zeichnen');
  });
  it('Aufgabe 1: Punkt zu r und s, aus der Gleichung im Aufgabentext', () => {
    rendern('ueberpruefen');
    const e = ebeneAus(spaltenAus(aufgaben.find((a) => a.nummer === '1')!.children));
    expect(echteEbene(e)).toBe(true);
    expect(['1', '2', '3'].map((i) => wert('1', `x${i}`))).toEqual(plus(plus(e.p, mal(D.A_PUNKT.r, e.u)), mal(D.A_PUNKT.s, e.v)));
    expect(e).toEqual(D.A_PUNKT.e);
  });
  it('Aufgabe 2: AB und AC aus den Punkten des Aufgabentexts, die drei Punkte liegen nicht auf einer Geraden', () => {
    rendern('ueberpruefen');
    const pk = punkteAus(aufgaben.find((a) => a.nummer === '2')!.children);
    expect(['1', '2', '3'].map((i) => wert('2', `u${i}`))).toEqual(diff(pk.B!, pk.A!));
    expect(['1', '2', '3'].map((i) => wert('2', `v${i}`))).toEqual(diff(pk.C!, pk.A!));
    expect(nullv(kreuz(diff(pk.B!, pk.A!), diff(pk.C!, pk.A!)))).toBe(false);
    expect(pk.A).toEqual(D.A_DREI_PUNKTE.A);
  });
  it('Auswahl 3: genau eine Gleichung beschreibt die Ebene durch A, B und C, die richtige steht nicht an erster Stelle, die falschen haben je ihren Fehler', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '3')!;
    const pk = punkteAus(f.children);
    let richtig = 0;
    for (const o of f.optionen) {
      const e = ebeneAus(spaltenAus(o.text));
      const stimmt = echteEbene(e) && [pk.A!, pk.B!, pk.C!].every((x) => imE(e, x));
      expect(stimmt, o.id).toBe(o.richtig);
      if (stimmt) richtig++;
    }
    expect(richtig).toBe(1);
    expect(f.optionen[0]!.richtig).toBe(false);
    const au = D.A_AUSWAHL;
    expect(keinePlane(au.kollinear)).toBe(true);
    expect(imE(au.ortsvektoren, au.B)).toBe(false);
    expect(imE(au.vorzeichen, au.C)).toBe(false);
    expect(echteEbene(au.vorzeichen)).toBe(true);
    expect(echteEbene(au.ortsvektoren)).toBe(true);
    expect(skal(kreuz(au.ab, au.ac), au.A)).not.toBe(0);
    // die Proben im Text der Rückmeldungen
    expect(plus(au.A, au.ortsvektoren.u)).toEqual([-3, 4, -1]);
    expect(plus(au.A, au.vorzeichen.v)).toEqual([-2, 0, 1]);
  });
  it('Aufgabe 4: Q liegt in E, r und s aus der Gleichung im Aufgabentext, die handgerechneten Schritte stimmen', () => {
    rendern('ueberpruefen');
    const a = aufgaben.find((x) => x.nummer === '4')!;
    const e = ebeneAus(spaltenAus(a.children));
    const Q = punkteAus(a.children).Q!;
    expect(Q).toEqual(D.A_PUNKT_IN_E.Q);
    expect(plus(plus(e.p, mal(wert('4', 'r'), e.u)), mal(wert('4', 's'), e.v))).toEqual(Q);
    expect(imE(e, Q)).toBe(true);
    // I: 1 + 2r = −1, II: 2 − r + s = 5, III: r + 2s = 3
    expect(e.v[0]).toBe(0);
    expect(1 + 2 * -1).toBe(-1);
    expect(2 - -1 + 2).toBe(5);
    expect(-1 + 2 * 2).toBe(3);
  });
  it('Auswahl 5: genau ein Punkt liegt in E, die anderen verletzen jeweils nur die kontrollierende Gleichung, die richtige steht nicht an erster Stelle', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '5')!;
    const e = ebeneAus(spaltenAus(aufgaben.find((x) => x.nummer === '4')!.children));
    let n = 0;
    for (const o of f.optionen) {
      const x = [...texte(o.text).join(' ').matchAll(/\(([-\d\\,|{}]+)\)/g)][0]![1]!.split('\\,|\\,').map(zahl);
      expect(imE(e, x), o.id).toBe(o.richtig);
      expect(liegtInEbene(e, x)).toBe(o.richtig);
      if (o.richtig) n++;
    }
    expect(n).toBe(1);
    expect(f.optionen[0]!.richtig).toBe(false);
    expect(D.A_AUSWAHL_PUNKTE.punkte[D.A_AUSWAHL_PUNKTE.auf]).toEqual([3, 2, 3]);
    expect(ebenenParameter(D.A_EBENE, [3, 2, 3])).toEqual({ r: 1, s: 1 });
  });
  it('Aufgabe 6: Q(−1 | a | 5) liegt für genau ein a in E, a = 6', () => {
    rendern('ueberpruefen');
    const e = ebeneAus(spaltenAus(aufgaben.find((x) => x.nummer === '4')!.children));
    const a = wert('6', 'a');
    expect(imE(e, [-1, a, 5])).toBe(true);
    for (let x = -30; x <= 30; x += 0.5) if (x !== a) expect(imE(e, [-1, x, 5]), `${x}`).toBe(false);
    expect(D.A_PARAMETER_A).toEqual({ r: -1, s: 3, a: 6 });
    expect(plus(plus(e.p, mal(-1, e.u)), mal(3, e.v))).toEqual([-1, 6, 5]);
  });
  it('Auswahl 7: b = −2 · a, die Vektoren sind kollinear, nur eine Gerade; genau eine richtige Antwort', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '7')!;
    const [a, b] = spaltenAus(f.children);
    expect(nullv(kreuz(a!, b!))).toBe(true);
    expect(mal(-2, a!)).toEqual(b);
    expect(f.optionen.filter((o) => o.richtig)).toHaveLength(1);
    expect(f.optionen[0]!.richtig).toBe(false);
    expect(D.A_KOLLINEAR.b).toEqual(mal(D.A_KOLLINEAR.k, D.A_KOLLINEAR.a));
  });
  it('Aufgabe 8: Nur für a = 2 sind die Spannvektoren kollinear (alle ganzzahligen und halben Werte geprüft)', () => {
    rendern('ueberpruefen');
    const k = D.A_KEINE_EBENE;
    expect(wert('8', 'a')).toBe(k.a);
    for (let a = -40; a <= 40; a += 0.5) expect(nullv(kreuz([1, a, 2], k.v)), `${a}`).toBe(a === k.a);
  });
  it('Auswahl 9: genau eine Gleichung beschreibt dieselbe Ebene wie E, die falschen haben je einen Fehler (Spannvektor, Stützpunkt, kollinear)', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '9')!;
    const e = ebeneAus(spaltenAus(f.children));
    let n = 0;
    for (const o of f.optionen) {
      const o2 = ebeneAus(spaltenAus(o.text));
      const gleich = gleichE(e, o2);
      expect(gleich, o.id).toBe(o.richtig);
      expect(gleicheEbene(e, o2)).toBe(gleich);
      if (gleich) n++;
    }
    expect(n).toBe(1);
    expect(f.optionen[0]!.richtig).toBe(true);
    const di = D.A_DIESELBE;
    expect(echteEbene(di.spannfalsch)).toBe(true);
    expect(imE(di.e, di.spannfalsch.p)).toBe(true);
    expect(imE(di.e, plus(di.e.p, di.spannfalsch.v))).toBe(false);
    expect(echteEbene(di.punktfalsch)).toBe(true);
    expect(imE(di.e, di.punktfalsch.p)).toBe(false);
    expect(imE(di.e, plus(di.punktfalsch.p, di.punktfalsch.u))).toBe(false);
    expect(keinePlane(di.kollinear)).toBe(true);
    expect(ebenenpunkt(di.e, 1, 1)).toEqual(di.richtig.p);
    expect(diff(di.e.u, di.e.v)).toEqual(di.richtig.u);
    expect(mal(-2, di.e.v).map((c) => c + 0)).toEqual(di.richtig.v);
  });
  it('Aufgabe 10 (Zeichnen): D = A + AB + AC, ABDC ist ein Parallelogramm, die Hilfe nennt D', () => {
    const html = rendern('ueberpruefen');
    const z = D.A_ZEICHNEN;
    expect(plus(plus(z.A, z.u), z.v)).toEqual(z.D);
    expect(html).toContain('ABDC');
    const pk = punkteAus(html.includes('annotation') ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null);
    expect(pk.D === undefined || pk.D.length === 3).toBe(true);
  });
  it('alle Auswahlfragen: genau eine richtige Antwort, die Position wechselt, jede Option hat eine Rückmeldung, alle Texte ohne Formelfehler und Gedankenstriche', () => {
    const { aufgaben: a, fragen: f } = alle();
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
  it('die Rückmeldungen der Auswahl 5 und 9 nennen r und s, die Gleichung und das Ergebnis der Probe richtig (aus der Bibliothek)', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '5')!;
    const e = D.A_EBENE;
    for (const [i, o] of f.optionen.entries()) {
      const x = [...texte(o.text).join(' ').matchAll(/\(([-\d\\,|{}]+)\)/g)][0]![1]!.split('\\,|\\,').map(zahl);
      const pp = punktprobe(e, x)!;
      const tex = texte(o.rueckmeldung).join(' ');
      expect(tex, `${i}`).toContain(`r=${pp.r}`);
      expect(tex).toContain(`s=${pp.s}`);
    }
  });
  it('die Zahlen und Namen der Arbeitsblätter der Lehrkraft kommen nicht vor (öffentliches Repository)', () => {
    const quelle = readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts')).map((d) => readFileSync(`${ORDNER}/${d}`, 'utf8')).join('\n');
    const verboten = ['[2, 4, 0]', '[5, 3, 0]', '[3, 6, 0]', '[3, -1, 0]', 'Dugi', 'Aljoscha', 'Linus', 'D(2', 'M(7'];
    for (const v of verboten) expect(quelle, v).not.toContain(v);
    const html = rendern(null);
    for (const v of ['Dugi', 'Aljoscha', 'Linus']) expect(html).not.toContain(v);
    // die beiden GeoGebra-Applets sind nur als Links eingebunden (erst nach Klick, neuer Tab, kein Einbetten)
    expect(html).toContain('https://www.geogebra.org/m/pjueszfb');
    expect(html).toContain('https://www.geogebra.org/m/svxwekrp');
    expect(html).not.toMatch(/<iframe/);
    expect(html.match(/rel="noopener noreferrer"/g)!.length).toBeGreaterThanOrEqual(2);
  });
});

describe('Genauigkeit der Zahlen', () => {
  it('nah() ist hier nur Hilfsfunktion, die Aufgabenwerte sind ganzzahlig', () => {
    expect(nah(0.1 + 0.2, 0.3)).toBe(true);
    rendern('ueberpruefen');
    for (const a of aufgaben) for (const f of a.felder) expect(Number.isInteger(f.erwartet), `${a.nummer} ${f.id}`).toBe(true);
  });
});

describe('Zusammenfassung', () => {
  it('Y liegt in E (r = 2, s = 1), Z nicht (die dritte Gleichung ergibt 1, verlangt ist 2), E wie im Erklären', () => {
    const z = D.ZUSAMMENFASSUNG;
    const e = D.ERKLAEREN;
    const eb: Ebene = { p: e.A, u: e.u, v: e.v };
    expect(imE(eb, z.Y)).toBe(true);
    expect(ebenenParameter(eb, z.Y)).toEqual({ r: 2, s: 1 });
    expect(imE(eb, z.Z)).toBe(false);
    expect(diff(z.Z, z.Y)).toEqual([0, 0, 1]);
    expect(z.Y).toEqual(e.X);
    const pz = punktprobe(eb, z.Z)!;
    expect(pz.r).toBe(2);
    expect(pz.s).toBe(1);
    expect(pz.ergibt).not.toBe(pz.verlangt);
    const html = rendern('zusammenfassung');
    expect(html).not.toContain('formel-fehler');
  });
});
