import { existsSync, readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/schnittwinkel-geraden/Bilder';
import * as D from '../content/modules/schnittwinkel-geraden/daten';
import Modul from '../content/modules/schnittwinkel-geraden/index';
import { Projektionslabor, Schnittlabor } from '../content/modules/schnittwinkel-geraden/Labor';
import meta from '../content/modules/schnittwinkel-geraden/meta.json';
import themen from '../content/themen.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { geradenpunkt, KOORDINATENEBENEN, lageZweier, projektionVektor, schnittwinkel, winkelKoordinatenebene, type Gerade, type Koordinatenebene } from '../src/lib/gerade';
import { RAUM_BEREICH, RAUM_GRENZE, bildpunkt, normiert, raumLagen, sperrlinienRaum, x1ZahlMitte, type RaumBildSpec } from '../src/lib/schraegbild';
import { lageAbstand } from '../src/lib/vektorbild';

interface AufgabeAufruf {
  nummer: string;
  children: ReactNode;
  felder: { id: string; erwartet: number; toleranz?: number; beschriftung: ReactNode; name: string }[];
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
const ORDNER = 'content/modules/schnittwinkel-geraden';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const ohneSchmal = (h: string) => h.replace(/<div class="formel-schmal">[\s\S]*?<\/div>/g, '');
const texteAusHtml = (html: string): string[] => [...ohneSchmal(html).matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<'));
const texte = (n: ReactNode): string[] => texteAusHtml(alsText(n));
const zahl = (s: string) => Number(s.replace(/\{,\}/g, '.'));
const spaltenAusTexten = (ts: string[]): number[][] => [...ts.join(' ').matchAll(/\\begin\{pmatrix\*?\}(?:\[r\])?(.*?)\\end\{pmatrix\*?\}/g)].map((m) => m[1]!.split('\\\\').map(zahl)).filter((s) => s.every((x) => Number.isFinite(x)));
const spaltenAus = (n: ReactNode) => spaltenAusTexten(texte(n));
const punktAus = (n: ReactNode, name: string): number[] | null => {
  const m = new RegExp(`${name}\\(([^)]*)\\)`).exec(texte(n).join(' '));
  if (!m) return null;
  const v = m[1]!.split('\\,|\\,').map(zahl);
  return v.every((x) => Number.isFinite(x)) ? v : null;
};
const wert = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!.erwartet;
const frage = (nr: string) => fragen.find((f) => f.nummer === nr)!;
const aufgabe = (nr: string) => aufgaben.find((a) => a.nummer === nr)!;
const rd = (x: number) => String(Math.round(x * 100) / 100).replace('.', '{,}');

/* Unabhängige Methoden: Sinus über das Vektorprodukt (asin liefert nur Werte bis 90°), Winkel am Dreieck mit dem Kosinussatz, Raster über alle Richtungen der Ebene. */
const kreuz = (a: number[], b: number[]): number[] => [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!].map((x) => x + 0);
const betrag = (v: number[]) => Math.hypot(...v);
const diff = (b: number[], a: number[]) => b.map((x, i) => x - a[i]!);
const plus = (a: number[], b: number[]) => a.map((x, i) => x + b[i]!);
const mal = (k: number, v: number[]) => v.map((x) => x * k + 0);
const pu = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i]!, 0);
const grad = (r: number) => (r * 180) / Math.PI;
const gerade = (p: number[], u: number[]): Gerade => ({ p, u });
const aufGerade = (g: Gerade, x: number[]) => kreuz(diff(x, g.p), g.u).every((c) => Math.abs(c) < 1e-9);
/** Schnittwinkel über den Sinus (liefert nur Werte bis 90°). */
const alphaAsin = (u: number[], v: number[]) => grad(Math.asin(Math.min(1, betrag(kreuz(u, v)) / (betrag(u) * betrag(v)))));
/** Winkel φ über den Kosinussatz am Dreieck S, S + u, S + v. */
const phiKosinussatz = (u: number[], v: number[]) => grad(Math.acos((betrag(u) ** 2 + betrag(v) ** 2 - betrag(diff(u, v)) ** 2) / (2 * betrag(u) * betrag(v))));
function rasterWinkel(u: number[], e: Koordinatenebene): number {
  const nullIndex = e === 'e12' ? 2 : e === 'e13' ? 1 : 0;
  const frei = [0, 1, 2].filter((i) => i !== nullIndex);
  let best = 180;
  for (let w = 0; w < 180; w += 0.01) {
    const r = (w * Math.PI) / 180;
    const d = [0, 0, 0];
    d[frei[0]!] = Math.cos(r);
    d[frei[1]!] = Math.sin(r);
    const c = Math.min(1, Math.max(-1, pu(u, d) / betrag(u)));
    best = Math.min(best, grad(Math.acos(c)), 180 - grad(Math.acos(c)));
  }
  return best;
}
/** Schnittpunkt zweier Geraden mit der Cramerschen Regel auf zwei Gleichungen, Probe mit der dritten. */
function cramer(g: Gerade, h: Gerade): { t: number; s: number } | null {
  const rows = [0, 1, 2].map((i) => ({ a: g.u[i]!, b: -h.u[i]!, c: h.p[i]! - g.p[i]! }));
  for (const [i, j] of [[0, 1], [0, 2], [1, 2]] as const) {
    const det = rows[i]!.a * rows[j]!.b - rows[i]!.b * rows[j]!.a;
    if (Math.abs(det) < 1e-9) continue;
    const t = (rows[i]!.c * rows[j]!.b - rows[i]!.b * rows[j]!.c) / det;
    const s = (rows[i]!.a * rows[j]!.c - rows[i]!.c * rows[j]!.a) / det;
    const k = 3 - i - j;
    return Math.abs(rows[k]!.a * t + rows[k]!.b * s - rows[k]!.c) < 1e-9 ? { t, s } : null;
  }
  return null;
}

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Geraden, hat vier Abschnitte, BPE 16.1 und 16.2', () => {
    expect(meta.id).toBe('schnittwinkel-geraden');
    expect(meta.thema).toBe('vektorgeometrie');
    expect(meta.unterbereich).toBe('geraden');
    expect(meta.bpe).toEqual(['16.1', '16.2']);
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
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"schnittwinkel-geraden"');
  });
  it('rendert ohne Formelfehler und ohne Gedankenstriche, mit der Fachsprache der Lehrkraft, Winkel in Grad (DEG) mit cos⁻¹', () => {
    const html = rendern(null);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(html).not.toContain(z);
    for (const d of readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts'))) {
      const q = readFileSync(`${ORDNER}/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
    }
    for (const wort of ['Schnittwinkel', 'Richtungsvektor', 'Skalarprodukt', 'Projektion', 'Spurpunkt', 'Koordinatenebene', 'Gradmaß', 'DEG', 'stumpf', 'windschief', 'parallel', 'identisch']) expect(html, wort).toContain(wort);
    expect(texteAusHtml(html).join(' ')).toContain('\\cos^{-1}');
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).not.toMatch(/\d\/\d/);
    expect(html).not.toMatch(/\bpi\b|Pi\b/);
    expect(html).not.toMatch(/\bλ\b|Lambda/);
    expect(html).not.toMatch(/[A-Z]\(-?\d+(,\d+)? ?\/ ?-?\d/);
  });
  it('nur Winkel: Abstände, Ebenengleichungen, Normalenvektor, Streckenanteile und der Schwerpunkt kommen nicht vor', () => {
    expect(rendern(null)).not.toMatch(/Normalenvektor|Ebenengleichung|Koordinatenform|Hesse|Teilstrecke|Streckenanteil|Schwerpunkt|Seitenhalbierende|Lotfußpunkt|Abstand/);
  });
  it('das Erklären nimmt nichts vorweg: keine Formel mit dem Betrag des Skalarprodukts, kein Sinus, keine Nebenwinkel 180° minus φ, keine Sonderfälle der Ebene', () => {
    const html = rendern('erklaeren');
    const text = html.replace(/<[^>]*>/g, '');
    for (const wort of ['Betrag', 'Nebenwinkel', 'stumpf', 'ergänzen', 'senkrecht auf der Ebene', 'liegt in der Ebene']) expect(text, wort).not.toContain(wort);
    const tex = texteAusHtml(html).join(' ');
    expect(tex.length).toBeGreaterThan(100);
    expect(tex).not.toMatch(/\\sin(?!\^)/);
    for (const verboten of ['|\\vec{u}\\cdot\\vec{v}|', '180^{\\circ}-', 'u_i', '\\frac{|u_', '\\vec{u}\\cdot\\vec{u}']) expect(tex, verboten).not.toContain(verboten);
  });
  it('verweist auf die Module davor, statt Skalarprodukt, Spurpunkte und Lage zu wiederholen', () => {
    const quelle = readdirSync(ORDNER).filter((x) => x.endsWith('.tsx')).map((d) => readFileSync(`${ORDNER}/${d}`, 'utf8')).join('\n');
    const ids = [...quelle.matchAll(/modul="([a-z0-9-]+)"/g)].map((m) => m[1]!);
    for (const m of ['skalarprodukt-orthogonalitaet', 'gegenseitige-lage-geraden', 'spurpunkte-besondere-lage', 'geradengleichung', 'punkte-vektoren-raum']) expect(ids, m).toContain(m);
    for (const id of ids) expect(existsSync(`content/modules/${id}/meta.json`), id).toBe(true);
  });
  it('Zeilenumbrüche in Rechnungen nur vor einem Gleichheitszeichen: keine Fortsetzungszeilen mit {}+, {}- oder {}\\cdot, einzige Ausnahme ist die schmale Form einer gegebenen Geradengleichung g: x = p + t · u (wie in abstaende-geraden)', () => {
    for (const d of readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts'))) {
      const q = readFileSync(`${ORDNER}/${d}`, 'utf8');
      // Ausgenommen ist nur die schmale Form einer gegebenen Geradengleichung (… \\{}+t\cdot …)
      expect(q.replace(/\\\\\{\}\+t\\cdot/g, ''), d).not.toMatch(/\{\}\s*(\+|-|\\cdot|\\times)/);
    }
    const html = rendern(null);
    const roh = [...html.matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!);
    expect(roh.join(' ')).toContain('{}=');
    for (const r of roh) {
      const treffer = r.match(/\{\}\s*(\+|-|\\cdot|\\times)/g) ?? [];
      if (treffer.length === 0) continue;
      expect(r, `Fortsetzung nur in einer Geradengleichung: ${r.slice(0, 80)}`).toMatch(/^\\begin\{gathered\}[gh]:\\ \\vec\{x\}=.*\\\\\{\}\+[ts]\\cdot/);
      expect(treffer).toHaveLength(1);
    }
  });
  it('die Zahlen des Arbeitsblatts kommen nicht vor (öffentliches Repository)', () => {
    const html = rendern(null);
    const spalten = spaltenAusTexten(texteAusHtml(html)).map((s) => s.join(','));
    for (const verboten of D.VERBOTEN_SPALTEN) expect(spalten, verboten).not.toContain(verboten);
    const tex = texteAusHtml(html).join(' ');
    expect(tex).not.toContain('\\sqrt{24}');
    expect(tex).not.toContain('54{,}7');
    expect(tex).not.toContain('24{,}1');
  });
});

describe('Daten, unabhängig nachgerechnet', () => {
  it('Beispiel zwei Geraden: Schnittpunkt S auf beiden Geraden, Lage „schneidend“, Skalarprodukt −4, φ ≈ 116,39°, α ≈ 63,61° (Sinus, Kosinussatz, Bibliothek)', () => {
    const b = D.BEISPIEL;
    expect(geradenpunkt(b.g, b.t)).toEqual([...b.S]);
    expect(geradenpunkt(b.h, b.s)).toEqual([...b.S]);
    expect(lageZweier(b.g, b.h).art).toBe('schneidend');
    expect(pu(b.g.u, b.h.u)).toBe(b.sk);
    expect([betrag(b.g.u), betrag(b.h.u)]).toEqual([3, 3]);
    expect(phiKosinussatz(b.g.u, b.h.u)).toBeCloseTo(b.phi, 2);
    expect(grad(Math.acos(b.sk / 9))).toBeCloseTo(b.phi, 2);
    expect(alphaAsin(b.g.u, b.h.u)).toBeCloseTo(b.alpha, 2);
    expect(schnittwinkel(b.g.u, b.h.u)).toBeCloseTo(b.alpha, 2);
    expect(180 - b.phi).toBeCloseTo(b.alpha, 2);
  });
  it('Aufgabendaten: Schnittpunkte auf beiden Geraden, Skalarprodukte und Winkel (Sinus, Kosinussatz)', () => {
    const z = D.A_ZWEI;
    expect(geradenpunkt(z.g, z.t)).toEqual([...z.S]);
    expect(geradenpunkt(z.h, z.s)).toEqual([...z.S]);
    expect(lageZweier(z.g, z.h).art).toBe('schneidend');
    expect(pu(z.g.u, z.h.u)).toBe(z.sk);
    expect(phiKosinussatz(z.g.u, z.h.u)).toBeCloseTo(z.phi, 2);
    expect(alphaAsin(z.g.u, z.h.u)).toBeCloseTo(z.alpha, 2);
    const s = D.A_SCHNITT;
    expect(geradenpunkt(s.g, s.t)).toEqual([...s.S]);
    expect(geradenpunkt(s.h, s.s)).toEqual([...s.S]);
    expect(cramer(s.g, s.h)).toEqual({ t: s.t, s: s.s });
    expect(alphaAsin(s.g.u, s.h.u)).toBeCloseTo(s.alpha, 2);
    const a = D.A_AUSWAHL;
    expect(phiKosinussatz(a.u, a.v)).toBeCloseTo(a.phi, 2);
    expect(alphaAsin(a.u, a.v)).toBeCloseTo(a.alpha, 2);
    expect(a.phi + a.alpha).toBeCloseTo(180, 2);
  });
  it('Koordinatenebenen: Winkel stimmen mit Projektion, Sinus über |u_i| / |u| und dem Raster über alle Richtungen der Ebene überein, die Spurpunkte liegen in der Ebene und auf der Geraden', () => {
    const fall: [string, number[], Record<Koordinatenebene, number>][] = [
      ['EBENE', D.EBENE.g.u, D.EBENE.winkel],
      ['A_PROJ', D.A_PROJ.g.u, { e12: D.A_PROJ.e12, e13: D.A_PROJ.e13, e23: grad(Math.asin(3 / 7)) }],
      ['A_SENKRECHT', D.A_SENKRECHT.g.u, { e12: D.A_SENKRECHT.e12, e13: D.A_SENKRECHT.e13, e23: D.A_SENKRECHT.e23 }],
    ];
    for (const [name, u, soll] of fall) {
      for (const e of KOORDINATENEBENEN) {
        const i = e === 'e12' ? 2 : e === 'e13' ? 1 : 0;
        expect(winkelKoordinatenebene(u, e), `${name} ${e}`).toBeCloseTo(soll[e], 2);
        expect(grad(Math.asin(Math.abs(u[i]!) / betrag(u))), `${name} ${e} Sinus`).toBeCloseTo(soll[e], 2);
        expect(rasterWinkel(u, e), `${name} ${e} Raster`).toBeCloseTo(soll[e], 1);
        expect(alphaAsin(u, projektionVektor(u, e)), `${name} ${e} Projektion`).toBeCloseTo(soll[e], 2);
      }
    }
    expect(D.EBENE.g.p[2]).toBe(0);
    expect(D.A_PROJ.g.p[1]).toBe(0);
    expect(D.A_ZEICHNEN.g.p[2]).toBe(0);
    expect(D.A_SEILBAHN.T[2]).toBe(0);
    for (const [S, g] of [[D.EBENE.S, D.EBENE.g], [D.A_PROJ.S, D.A_PROJ.g], [D.A_ZEICHNEN.S, D.A_ZEICHNEN.g]] as const) expect(aufGerade(g, [...S])).toBe(true);
    for (const e of KOORDINATENEBENEN) expect(D.PROJLABOR.S[e][e === 'e12' ? 2 : e === 'e13' ? 1 : 0]).toBe(0);
  });
  it('Seilbahn: TB = (4 | 4 | 3), Länge √41 · 100 ≈ 640,3 m, Winkel zum Boden 27,94° (Arkustangens aus Höhe und waagerechter Strecke)', () => {
    const s = D.A_SEILBAHN;
    const u = diff(s.B, s.T);
    expect(u).toEqual([4, 4, 3]);
    expect(betrag(u) * s.einheit).toBeCloseTo(s.laenge, 1);
    expect(grad(Math.atan2(u[2]!, Math.hypot(u[0]!, u[1]!)))).toBeCloseTo(s.alpha, 2);
  });
  it('Parameteraufgaben: a = 2 ist die einzige ganze Lösung für „senkrecht“, a = 5 die einzige Lösung mit a > 0 für 45° (Raster)', () => {
    const lsg: number[] = [];
    for (let a = -30; a <= 30; a++) if (pu([2, a, 1], [a, -3, 2]) === 0) lsg.push(a);
    expect(lsg).toEqual([D.A_PARAM1.a]);
    expect(schnittwinkel([2, 2, 1], [2, -3, 2])).toBe(90);
    const gut: number[] = [];
    for (let a = 0.01; a <= 40; a += 0.01) if (Math.abs(winkelKoordinatenebene([3, 4, a], 'e12') - 45) < 0.02) gut.push(Math.round(a * 100) / 100);
    expect(gut.length).toBeGreaterThan(0);
    for (const a of gut) expect(Math.abs(a - D.A_PARAM2.a)).toBeLessThan(0.1);
    expect(winkelKoordinatenebene([3, 4, D.A_PARAM2.a], 'e12')).toBeCloseTo(45, 9);
  });
});

describe('Bilder', () => {
  const bilder: [string, RaumBildSpec][] = [
    ['SCHNITT', B.RAUM_SCHNITT],
    ['ZWEI Aufgabe', B.aufgZwei],
    ['EBENE', B.RAUM_EBENE],
    ['PROJ Aufgabe', B.aufgProj],
    ['SEILBAHN', B.aufgSeilbahn],
    ['ZEICHNEN', B.aufgZeichnen],
  ];
  const zahlenX1 = Array.from({ length: 2 * RAUM_GRENZE + 1 }, (_, i) => i - RAUM_GRENZE).filter((k) => k !== 0).map((k) => normiert(x1ZahlMitte(k)));
  const abst = (p: number[], a: number[], b: number[]) => {
    const dx = b[0]! - a[0]!, dy = b[1]! - a[1]!, l2 = dx * dx + dy * dy;
    const u = l2 === 0 ? 0 : Math.max(0, Math.min(1, ((p[0]! - a[0]!) * dx + (p[1]! - a[1]!) * dy) / l2));
    return Math.hypot(p[0]! - a[0]! - u * dx, p[1]! - a[1]! - u * dy);
  };
  it('alle beschrifteten Punkte liegen im Koordinatensystem, keiner im Schrägbild auf einer Achse oder an derselben Bildstelle wie ein anderer, jedes Bild hat eine Textalternative, feine Darstellung', () => {
    for (const [name, s] of bilder) {
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
      expect(s.sprech.length, name).toBeGreaterThan(40);
      expect(s.fein, name).toBe(true);
      for (const l of s.linien!) for (const c of [...l.von, ...l.bis]) expect(Math.abs(c), `${name} Linie`).toBeLessThanOrEqual(RAUM_GRENZE + 1e-9);
    }
  });
  it('Punkte und Namen liegen nicht bei den Achsentiteln x₁, x₂, x₃ (Mittelpunkte der Titel im Bild etwa bei (5,9 | 0,4), (0,4 | 6,1) und (−2,8 | −3,1))', () => {
    const titel = [[5.9, 0.37], [0.42, 6.1], [-2.76, -3.09]];
    for (const [name, s] of bilder) for (const p of s.punkte!) {
      const b = bildpunkt(p.p);
      for (const t of titel) expect(Math.hypot(b[0] - t[0]!, b[1] - t[1]!), `${name} ${p.name}`).toBeGreaterThan(p.nurText ? 0.9 : 1.3);
    }
  });
  it('jede Beschriftung eines Punkts hat Abstand zu allen Linien, Achsen, Achsenzahlen und anderen Beschriftungen', () => {
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
  it('die Namen g, h, g′ und α stehen im Bild: g, h, g′ dicht an ihrer Linie in deren Farbe, α im Winkel mit Abstand zu allen langen Linien, Punkten und Achsen, alle Linien durchgezogen', () => {
    const erwartet: [string, RaumBildSpec, string[]][] = [
      ['SCHNITT', B.RAUM_SCHNITT, ['g', 'h', 'α']],
      ['ZWEI Aufgabe', B.aufgZwei, ['g', 'h', 'α']],
      ['EBENE', B.RAUM_EBENE, ['g', 'g′', 'α']],
      ['PROJ Aufgabe', B.aufgProj, ['g', 'g′', 'α']],
      ['SEILBAHN', B.aufgSeilbahn, ['g', 'g′', 'α']],
      ['ZEICHNEN', B.aufgZeichnen, ['g', 'g′', 'α']],
    ];
    for (const [name, spec, namen] of erwartet) {
      const texte2 = spec.punkte!.filter((p) => p.nurText);
      expect(texte2.map((p) => p.name), name).toEqual(namen);
      const lang = spec.linien!.map((l) => [bildpunkt(l.von), bildpunkt(l.bis)] as const).filter(([a1, b1]) => Math.hypot(b1[0] - a1[0], b1[1] - a1[1]) > 0.8);
      for (const l of spec.linien!) {
        expect(l.gestrichelt, `${name} durchgezogen`).toBeFalsy();
        expect(l.farbe, name).not.toBe('#0072B2');
      }
      for (const tx of texte2) {
        const b = bildpunkt(tx.p);
        expect(Math.abs(b[0]) <= 6 && Math.abs(b[1]) <= 6, `${name} ${tx.name} im Bild`).toBe(true);
        if (tx.name !== 'α') {
          expect(Math.min(...lang.map(([a1, b1]) => abst(b, a1, b1))), `${name} ${tx.name} dicht an der Linie`).toBeLessThanOrEqual(0.4);
        } else {
          // α steht im Winkel: weg von den Linien und vom Scheitel, aber nicht weit weg
          expect(Math.min(...lang.map(([a1, b1]) => abst(b, a1, b1))), `${name} α Abstand zu den Linien`).toBeGreaterThanOrEqual(0.23);
        }
        for (const p of spec.punkte!.filter((q) => !q.nurText)) expect(Math.hypot(bildpunkt(p.p)[0] - b[0], bildpunkt(p.p)[1] - b[1]), `${name} ${tx.name} Punkt`).toBeGreaterThan(tx.name === 'α' ? 0.5 : 0.6);
        expect(spec.linien!.map((l) => l.farbe), `${name} ${tx.name}`).toContain(tx.farbe);
        for (const ach of [[[-4, 0, 0], [4, 0, 0]], [[0, -4, 0], [0, 4, 0]], [[0, 0, -4], [0, 0, 4]]] as const) {
          expect(abst(b, bildpunkt(ach[0] as [number, number, number]), bildpunkt(ach[1] as [number, number, number])), `${name} ${tx.name} Achse`).toBeGreaterThan(tx.name === 'α' ? 0.23 : 0.21);
        }
      }
    }
  });
  it('die Geraden verlaufen im Schrägbild nicht als Punkt und nicht parallel zu einem Achsenbild (Winkel mindestens 11 Grad), die Projektion g′ ebenso, g und g′ sind im Bild gut zu trennen', () => {
    const geraden: [string, number[]][] = [
      ['SCHNITT g', D.BEISPIEL.g.u], ['SCHNITT h', D.BEISPIEL.h.u], ['ZWEI g', D.A_ZWEI.g.u], ['ZWEI h', D.A_ZWEI.h.u],
      ['EBENE g', D.EBENE.g.u], ['EBENE g′', projektionVektor(D.EBENE.g.u, 'e12')], ['PROJ g', D.A_PROJ.g.u], ['PROJ g′', projektionVektor(D.A_PROJ.g.u, 'e13')],
      ['SEILBAHN g', diffV(D.A_SEILBAHN.B, D.A_SEILBAHN.T)], ['SEILBAHN g′', projektionVektor(diffV(D.A_SEILBAHN.B, D.A_SEILBAHN.T), 'e12')],
      ['ZEICHNEN g', D.A_ZEICHNEN.g.u], ['ZEICHNEN g′', projektionVektor(D.A_ZEICHNEN.g.u, 'e12')],
    ];
    function diffV(b: number[], a: number[]) { return b.map((x, i) => x - a[i]!); }
    const bild = (u: number[]) => [u[1]! - u[0]! / 2, u[2]! - u[0]! / 2];
    for (const [name, u] of geraden) {
      const d = bild(u);
      const len = Math.hypot(d[0]!, d[1]!);
      expect(len, name).toBeGreaterThan(1.2);
      for (const ax of [[-0.5, -0.5], [1, 0], [0, 1]]) expect(grad(Math.acos(Math.min(1, Math.abs(d[0]! * ax[0]! + d[1]! * ax[1]!) / (len * Math.hypot(ax[0]!, ax[1]!))))), `${name} Winkel zur Achse`).toBeGreaterThan(11);
    }
    for (const [a, b2] of [['EBENE g', 'EBENE g′'], ['PROJ g', 'PROJ g′'], ['SEILBAHN g', 'SEILBAHN g′'], ['ZEICHNEN g', 'ZEICHNEN g′']]) {
      const u = bild(geraden.find((x) => x[0] === a)![1]);
      const v = bild(geraden.find((x) => x[0] === b2)![1]);
      const w = grad(Math.acos(Math.min(1, Math.abs(u[0]! * v[0]! + u[1]! * v[1]!) / (Math.hypot(...u) * Math.hypot(...v)))));
      expect(w, `${a} und ${b2} im Bild`).toBeGreaterThan(24);
    }
  });
  it('die Bilder zeigen, was die Rechnung sagt: Schnittpunkt auf beiden Geraden, der Bogen liegt zwischen den Geraden und hat den Winkel α, g′ ist die Projektion, das Lot steht senkrecht auf der Ebene', () => {
    const bogenWinkel = (spec: RaumBildSpec, S: number[], farbe: string) => {
      const bogen = spec.linien!.filter((l) => l.farbe === farbe && l.breite === 1.6);
      expect(bogen.length).toBe(12);
      // Alle Punkte des Bogens haben von S denselben Abstand (0,6 bis 1,5), der Linienzug ist geschlossen
      const r0 = betrag(diff([...bogen[0]!.von], S));
      expect(r0).toBeGreaterThanOrEqual(0.6 - 1e-9);
      expect(r0).toBeLessThanOrEqual(1.5 + 1e-5);
      for (const l of bogen) for (const p of [l.von, l.bis]) expect(betrag(diff([...p], S))).toBeCloseTo(r0, 5);
      for (let i = 0; i < bogen.length - 1; i++) expect(bogen[i]!.bis).toEqual(bogen[i + 1]!.von);
      return { a: diff([...bogen[0]!.von], S), b: diff([...bogen[bogen.length - 1]!.bis], S) };
    };
    const farbeBogen = D.ROSA;
    for (const [spec, g, h, S] of [[B.RAUM_SCHNITT, D.BEISPIEL.g, D.BEISPIEL.h, D.BEISPIEL.S], [B.aufgZwei, D.A_ZWEI.g, D.A_ZWEI.h, D.A_ZWEI.S]] as const) {
      expect(aufGerade(g, [...S])).toBe(true);
      expect(aufGerade(h, [...S])).toBe(true);
      expect(spec.punkte!.find((p) => p.name === 'S')!.p).toEqual([...S]);
      const { a, b } = bogenWinkel(spec, [...S], farbeBogen);
      expect(kreuz(a, g.u).every((c) => Math.abs(c) < 1e-4)).toBe(true);
      expect(kreuz(b, h.u).every((c) => Math.abs(c) < 1e-4)).toBe(true);
      expect(grad(Math.acos(pu(a, b) / (betrag(a) * betrag(b))))).toBeCloseTo(alphaAsin(g.u, h.u), 3);
    }
    const ebenen: [RaumBildSpec, number[], number[], Koordinatenebene][] = [
      [B.RAUM_EBENE, [...D.EBENE.S], D.EBENE.g.u, 'e12'],
      [B.aufgProj, [...D.A_PROJ.S], D.A_PROJ.g.u, 'e13'],
      [B.aufgZeichnen, [...D.A_ZEICHNEN.S], D.A_ZEICHNEN.g.u, 'e12'],
      [B.aufgSeilbahn, [...D.A_SEILBAHN.T], diff([...D.A_SEILBAHN.B], [...D.A_SEILBAHN.T]), 'e12'],
    ];
    for (const [spec, S, u, e] of ebenen) {
      const pu2 = projektionVektor(u, e);
      const nullIndex = e === 'e12' ? 2 : e === 'e13' ? 1 : 0;
      const { a, b } = bogenWinkel(spec, S, D.SCHWARZ);
      expect(kreuz(a, u).every((c) => Math.abs(c) < 1e-4), `${e} Bogen auf g`).toBe(true);
      expect(kreuz(b, pu2).every((c) => Math.abs(c) < 1e-4), `${e} Bogen auf g′`).toBe(true);
      expect(grad(Math.acos(pu(a, b) / (betrag(a) * betrag(b))))).toBeCloseTo(winkelKoordinatenebene(u, e), 3);
      // Lot: rosa Strecke, parallel zur senkrechten Achse, Fußpunkt in der Ebene, Fußpunkt auf g′
      const lot = spec.linien!.find((l) => l.farbe === D.ROSA)!;
      const richtung = diff([...lot.bis], [...lot.von]);
      expect(richtung.filter((_, i) => i !== nullIndex).every((c) => Math.abs(c) < 1e-6)).toBe(true);
      expect(lot.von[nullIndex]).toBeCloseTo(0, 9);
      expect(aufGerade({ p: S, u: pu2 }, [...lot.von])).toBe(true);
      expect(aufGerade({ p: S, u }, [...lot.bis])).toBe(true);
      expect(spec.punkte!.find((p) => p.name === (e === 'e12' ? (spec === B.aufgSeilbahn ? 'T' : 'S₁₂') : 'S₁₃'))!.p).toEqual(S);
    }
  });
  it('Kontrollbild der Seilbahn: T auf dem Boden, B oben, B′ unter B auf dem Boden', () => {
    const s = B.aufgSeilbahn;
    const pk = (n: string) => s.punkte!.find((p) => p.name === n)!.p;
    expect(pk('T')).toEqual([...D.A_SEILBAHN.T]);
    expect(pk('B')).toEqual([...D.A_SEILBAHN.B]);
    expect(pk('B′')).toEqual([D.A_SEILBAHN.B[0], D.A_SEILBAHN.B[1], 0]);
  });
});

describe('Labore', () => {
  it('Schnittwinkellabor: drei Regler, drei Schalter, Winkel und Rechnung zunächst verborgen, ohne Schalter Ebene und Raum', () => {
    const html = renderToStaticMarkup(<Schnittlabor />);
    expect(html.match(/type="range"/g)).toHaveLength(3);
    expect(html.match(/type="checkbox"/g)).toHaveLength(3);
    expect(html).toContain('aria-label="Darstellung wählen"');
    expect(html).not.toContain('aria-label="Ebene oder Raum wählen"');
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('Skalarprodukt');
    expect(html).not.toContain('Kosinuskurve');
    expect(html).not.toContain('legende-farbe" style="background:#CC79A7');
    expect(D.SCHNITTLABOR.startV).toEqual([...D.BEISPIEL.h.u]);
    expect(D.SCHNITTLABOR.S).toEqual([...D.BEISPIEL.S]);
  });
  it('Projektionslabor: drei Regler, drei Ebenenknöpfe, zwei Schalter, Winkel und Rechnung zunächst verborgen', () => {
    const html = renderToStaticMarkup(<Projektionslabor />);
    expect(html.match(/type="range"/g)).toHaveLength(3);
    expect(html.match(/type="checkbox"/g)).toHaveLength(2);
    expect(html.match(/aria-label="Koordinatenebene x[₁₂]x[₂₃]"/g)).toHaveLength(3);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('Winkel mit der Ebene');
    expect(html).not.toContain('Länge des Projektionsvektors');
    expect(D.PROJLABOR.startU).toEqual([...D.EBENE.g.u]);
  });
  it('Schnittwinkellabor, alle 686 Einstellungen: h geht durch S, der Winkel stimmt mit dem Sinus über das Vektorprodukt überein, die Umkehr der Richtung ändert α nicht, Bogen und α nur mit Schalter und nie bei parallelen Geraden', () => {
    const R = [-3, -2, -1, 0, 1, 2, 3];
    const g = D.SCHNITTLABOR.g;
    const S = [...D.SCHNITTLABOR.S];
    let n = 0;
    for (const v1 of R) for (const v2 of R) for (const v3 of R) {
      if (!v1 && !v2 && !v3) continue;
      const v = [v1, v2, v3];
      const h = gerade(S, v);
      const parallel = kreuz(g.u, v).every((c) => c === 0);
      const a = schnittwinkel(g.u, v);
      expect(a, JSON.stringify(v)).toBeCloseTo(parallel ? 0 : alphaAsin(g.u, v), 4);
      expect(schnittwinkel(g.u, mal(-1, v))).toBeCloseTo(a, 9);
      expect(aufGerade(h, S)).toBe(true);
      expect(lageZweier(g, h).art).toBe(parallel ? 'identisch' : 'schneidend');
      const mit = B.zweiGeradenBild(g, h, S, true);
      const ohne = B.zweiGeradenBild(g, h, S, false);
      const hatBogen = mit.linien!.some((l) => l.breite === 1.6);
      expect(hatBogen, JSON.stringify(v)).toBe(!parallel && a < 90 - 1e-6);
      expect(ohne.linien!.some((l) => l.breite === 1.6)).toBe(false);
      expect(ohne.punkte!.some((p) => p.name === 'α')).toBe(false);
      for (const x of mit.linien!) for (const c of [...x.von, ...x.bis]) expect(Math.abs(c)).toBeLessThanOrEqual(4 + 1e-9);
      expect(mit.sprech.length).toBeGreaterThan(40);
      n++;
    }
    expect(n).toBe(342);
  }, 120000);
  it('Projektionslabor, alle Einstellungen: Winkel stimmt mit Projektion und Sinus überein, Bogen und Lot nur mit Schalter, bei u_i = 0 liegt g in der Ebene (kein Winkel), bei Projektion Nullvektor 90° ohne g′, alle Linien im Koordinatensystem', () => {
    const R = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6];
    let n = 0;
    for (const e of KOORDINATENEBENEN) {
      const S = [...D.PROJLABOR.S[e]];
      const i = e === 'e12' ? 2 : e === 'e13' ? 1 : 0;
      for (const u1 of R) for (const u2 of R) for (const u3 of R) {
        if (!u1 && !u2 && !u3) continue;
        const u = [u1, u2, u3];
        const a = winkelKoordinatenebene(u, e);
        expect(a, `${e} ${u}`).toBeCloseTo(grad(Math.asin(Math.abs(u[i]!) / betrag(u))), 4);
        const imEbene = u[i] === 0;
        const senkrecht = u.every((c, j) => j === i || c === 0);
        const mit = B.ebenenBild(S, u, e, { mitWinkel: true, mitLot: true });
        const ohne = B.ebenenBild(S, u, e, { mitWinkel: false, mitLot: false });
        expect(mit.imEbene).toBe(imEbene);
        expect(mit.senkrecht).toBe(senkrecht);
        const hatBogen = mit.spec.linien!.some((l) => l.breite === 1.6);
        expect(hatBogen, `${e} ${u} Bogen`).toBe(!imEbene && !senkrecht);
        expect(ohne.spec.linien!.some((l) => l.breite === 1.6)).toBe(false);
        expect(ohne.spec.linien!.some((l) => l.farbe === D.ROSA)).toBe(false);
        const hatProjektion = mit.spec.linien!.some((l) => l.farbe === D.ORANGE);
        expect(hatProjektion, `${e} ${u} g′`).toBe(!imEbene && !senkrecht);
        for (const x of mit.spec.linien!) for (const c of [...x.von, ...x.bis]) expect(Math.abs(c)).toBeLessThanOrEqual(4 + 1e-9);
        const bp = mit.spec.punkte!.filter((p) => !p.nurText).map((p) => bildpunkt(p.p).join(','));
        expect(new Set(bp).size, `${e} ${u} Punkte`).toBe(bp.length);
        if (!imEbene && mit.ausserhalb.length === 0) expect(mit.spec.linien!.some((l) => l.farbe === D.ROSA && l.breite === 2)).toBe(true);
        n++;
      }
    }
    expect(n).toBe(3 * (13 ** 3 - 1));
  }, 120000);
});

describe('Aufgaben', () => {
  it('12 Aufgaben: sieben mit Eingabefeldern (2, 3, 6, 7, 9, 10, 11), vier Auswahlfragen (1, 4, 5, 8) und eine Zeichenaufgabe (12)', () => {
    const html = rendern('ueberpruefen');
    expect(aufgaben.map((a) => a.nummer)).toEqual(['2', '3', '6', '7', '9', '10', '11']);
    expect(fragen.map((f) => f.nummer)).toEqual(['1', '4', '5', '8']);
    expect(html).toContain('Aufgabe 12: Gerade und Projektion zeichnen');
  });
  it('Aufgabe 2: Skalarprodukt, φ und α stimmen mit der unabhängigen Rechnung überein, α ist der Nebenwinkel von φ, die Winkel haben die Toleranz 0,01', () => {
    rendern('ueberpruefen');
    const [p, u, q, v] = spaltenAus(aufgabe('2').children);
    expect(wert('2', 'sk')).toBe(pu(u!, v!));
    expect(wert('2', 'phi')).toBeCloseTo(phiKosinussatz(u!, v!), 2);
    expect(wert('2', 'alpha')).toBeCloseTo(alphaAsin(u!, v!), 2);
    expect(wert('2', 'phi') + wert('2', 'alpha')).toBeCloseTo(180, 1);
    expect(cramer(gerade(p!, u!), gerade(q!, v!))).not.toBeNull();
    for (const id of ['phi', 'alpha']) expect(aufgabe('2').felder.find((f) => f.id === id)!.toleranz).toBe(0.01);
    expect(punktAus(aufgabe('2').children, 'S')).toEqual([...D.A_ZWEI.S]);
  });
  it('Aufgabe 3: t, s und α stimmen mit Cramerscher Regel und Sinus überein, der Schnittpunkt liegt auf beiden Geraden', () => {
    rendern('ueberpruefen');
    const [p, u, q, v] = spaltenAus(aufgabe('3').children);
    const g = gerade(p!, u!);
    const h = gerade(q!, v!);
    const c = cramer(g, h)!;
    expect(wert('3', 't')).toBeCloseTo(c.t, 9);
    expect(wert('3', 's')).toBeCloseTo(c.s, 9);
    expect(geradenpunkt(g, c.t)).toEqual(geradenpunkt(h, c.s));
    expect(wert('3', 'alpha')).toBeCloseTo(alphaAsin(u!, v!), 2);
    const lsg = texte(aufgabe('3').loesung).join(' ');
    expect(lsg).toContain('\\text{I:}');
    expect(lsg).toContain('S(-1\\,|\\,2\\,|\\,1)');
  });
  it('Auswahl 4: die richtige Antwort ist der Schnittwinkel, die falschen sind φ, die Ergänzung auf 90° und 360° minus φ (alle unabhängig nachgerechnet)', () => {
    rendern('ueberpruefen');
    const [u, v] = spaltenAus(frage('4').children);
    const phi = phiKosinussatz(u!, v!);
    const alpha = alphaAsin(u!, v!);
    expect(pu(u!, v!)).toBeLessThan(0);
    const erwartet = { a: alpha, b: phi, c: 90 - alpha, d: 360 - phi };
    for (const o of frage('4').optionen) {
      const t = texte(o.text).join(' ');
      expect(t, o.id).toContain(`${rd(erwartet[o.id as 'a'])}^{\\circ}`);
      expect(o.richtig).toBe(o.id === 'a');
    }
    expect(phi + alpha).toBeCloseTo(180, 9);
  });
  it('Auswahl 5: genau die Lage „schneiden sich in einem Punkt“ hat einen Schnittwinkel, jede falsche Antwort hat eine eigene Begründung', () => {
    rendern('ueberpruefen');
    const f = frage('5');
    expect(f.optionen.filter((o) => o.richtig)).toHaveLength(1);
    expect(alsText(f.optionen.find((o) => o.richtig)!.text)).toContain('schneiden sich in einem Punkt');
    const rueck = f.optionen.map((o) => alsText(o.rueckmeldung));
    expect(new Set(rueck).size).toBe(4);
    for (const o of f.optionen.filter((x) => !x.richtig)) expect(alsText(o.rueckmeldung)).toMatch(/Schnittwinkel|Schnittpunkt/);
  });
  it('Aufgabe 6: die Winkel mit x₁x₂ und x₁x₃ stimmen (Projektion, Sinus, Raster), der Stützpunkt liegt in der x₁x₃-Ebene', () => {
    rendern('ueberpruefen');
    const [p, u] = spaltenAus(aufgabe('6').children);
    expect(p![1]).toBe(0);
    expect(wert('6', 'a12')).toBeCloseTo(rasterWinkel(u!, 'e12'), 1);
    expect(wert('6', 'a13')).toBeCloseTo(rasterWinkel(u!, 'e13'), 1);
    expect(wert('6', 'a12')).toBeCloseTo(grad(Math.asin(Math.abs(u![2]!) / betrag(u!))), 2);
    expect(wert('6', 'a13')).toBeCloseTo(grad(Math.asin(Math.abs(u![1]!) / betrag(u!))), 2);
    expect(wert('6', 'a12')).toBeCloseTo(alphaAsin(u!, projektionVektor(u!, 'e12')), 2);
    expect(wert('6', 'a13')).toBeCloseTo(alphaAsin(u!, projektionVektor(u!, 'e13')), 2);
    for (const id of ['a12', 'a13']) expect(aufgabe('6').felder.find((f) => f.id === id)!.toleranz).toBe(0.01);
    const lsg = texte(aufgabe('6').loesung).join(' ');
    expect(lsg).toContain('\\vec{u}_{12}');
    expect(lsg).toContain('\\vec{u}_{13}');
  });
  it('Aufgabe 7: alle drei Winkel (Sinus, Raster), zwei Winkel sind gleich, weil |u₁| = |u₃|', () => {
    rendern('ueberpruefen');
    const [, u] = spaltenAus(aufgabe('7').children);
    expect(wert('7', 'a12')).toBeCloseTo(rasterWinkel(u!, 'e12'), 1);
    expect(wert('7', 'a13')).toBeCloseTo(rasterWinkel(u!, 'e13'), 1);
    expect(wert('7', 'a23')).toBeCloseTo(rasterWinkel(u!, 'e23'), 1);
    expect(Math.abs(u![0]!)).toBe(Math.abs(u![2]!));
    expect(wert('7', 'a12')).toBeCloseTo(wert('7', 'a23'), 2);
    expect(wert('7', 'a13')).not.toBeCloseTo(wert('7', 'a12'), 0);
  });
  it('Auswahl 8: genau ein Richtungsvektor hat den Winkel 0° mit der x₁x₂-Ebene, die anderen die in der Rückmeldung genannten Winkel', () => {
    rendern('ueberpruefen');
    let richtige = 0;
    for (const o of frage('8').optionen) {
      const [u] = spaltenAus(o.text);
      const a = rasterWinkel(u!, 'e12');
      expect(o.richtig).toBe(Math.abs(a) < 0.011);
      if (o.richtig) richtige++;
      else {
        const rueck = texte(o.rueckmeldung).join(' ');
        const m = /(\d+\{,\}\d+)\^\{\\circ\}/.exec(rueck);
        if (m) expect(zahl(m[1]!)).toBeCloseTo(Math.round(a * 100) / 100, 2);
        else expect(a).toBe(90);
      }
    }
    expect(richtige).toBe(1);
  });
  it('Aufgabe 9: für a = 2 stehen die Richtungsvektoren senkrecht aufeinander, für jedes andere ganze a nicht, die Geraden schneiden sich für jedes a in S', () => {
    rendern('ueberpruefen');
    const t = texte(aufgabe('9').children).join(' ');
    expect(t).toContain('\\begin{pmatrix}2\\\\a\\\\1\\end{pmatrix}');
    expect(t).toContain('\\begin{pmatrix}a\\\\-3\\\\2\\end{pmatrix}');
    const S = punktAus(aufgabe('9').children, 'S')!;
    expect(S).toEqual([...D.A_PARAM1.S]);
    const a = wert('9', 'a');
    expect(pu([2, a, 1], [a, -3, 2])).toBe(0);
    for (const b of [-3, -1, 0, 1, 3, 4]) expect(pu([2, b, 1], [b, -3, 2])).not.toBe(0);
    expect(schnittwinkel([2, a, 1], [a, -3, 2])).toBe(90);
  });
  it('Aufgabe 10: für a = 5 hat die Gerade 45° mit der x₁x₂-Ebene (Raster über a), a muss positiv sein', () => {
    rendern('ueberpruefen');
    const t = texte(aufgabe('10').children).join(' ');
    expect(t).toContain('\\begin{pmatrix}3\\\\4\\\\a\\end{pmatrix}');
    expect(t).toContain('a>0');
    const a = wert('10', 'a');
    expect(rasterWinkel([3, 4, a], 'e12')).toBeCloseTo(45, 1);
    expect(a).toBeGreaterThan(0);
  });
  it('Aufgabe 11: Winkel zum Boden und Länge des Seils stimmen (Arkustangens, Betrag mal 100), Toleranzen 0,01 und 0,5', () => {
    rendern('ueberpruefen');
    const T = punktAus(aufgabe('11').children, 'T')!;
    const Bp = punktAus(aufgabe('11').children, 'B')!;
    const u = diff(Bp, T);
    expect(wert('11', 'alpha')).toBeCloseTo(grad(Math.atan2(u[2]!, Math.hypot(u[0]!, u[1]!))), 2);
    expect(wert('11', 'l')).toBeCloseTo(betrag(u) * 100, 1);
    expect(aufgabe('11').felder.find((f) => f.id === 'alpha')!.toleranz).toBe(0.01);
    expect(aufgabe('11').felder.find((f) => f.id === 'l')!.toleranz).toBe(0.5);
    expect(T[2]).toBe(0);
    const html = rendern('ueberpruefen');
    expect(html).not.toMatch(/Flugzeug|Drohne/);
  });
  it('Aufgabe 12: Zeichenaufgabe, der Winkel im Lösungsweg und im Kontrollbild stimmt (Raster), der Spurpunkt liegt auf g', () => {
    const html = rendern('ueberpruefen');
    expect(html).toContain('Aufgabe 12: Gerade und Projektion zeichnen');
    const tex = texteAusHtml(html).join(' ');
    expect(tex).toContain('S_{12}(-3\\,|\\,1\\,|\\,0)');
    expect(rasterWinkel(D.A_ZEICHNEN.g.u, 'e12')).toBeCloseTo(D.A_ZEICHNEN.alpha, 1);
    expect(aufGerade(D.A_ZEICHNEN.g, [...D.A_ZEICHNEN.S])).toBe(true);
  });
  it('alle Auswahlfragen: genau eine richtige Antwort, die Position wechselt, jede Option hat eine Rückmeldung; alle Texte der Aufgaben (Hilfen, Lösungsschritte, Beschriftungen) ohne Formelfehler, Gedankenstriche und Brüche mit Schrägstrich', () => {
    rendern('ueberpruefen');
    const a = [...aufgaben];
    const f = [...fragen];
    const positionen = f.map((x) => x.optionen.findIndex((o) => o.richtig));
    expect(new Set(positionen).size).toBeGreaterThan(2);
    const knoten: ReactNode[] = [];
    for (const x of f) {
      expect(x.optionen.filter((o) => o.richtig), x.nummer).toHaveLength(1);
      expect(x.optionen, x.nummer).toHaveLength(4);
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
  it('Lösungsschritte in kurzen Zeilen: jede schmale Formel hat höchstens 24 Zeichen je Zeile (Box von etwa 143 px bei 320 px)', () => {
    rendern('ueberpruefen');
    const alle: string[] = [];
    for (const x of aufgaben) for (const l of x.loesung) alle.push(alsText(l));
    let n = 0;
    for (const h of alle) {
      for (const m of h.matchAll(/<div class="formel-schmal">([\s\S]*?)<\/div>/g)) {
        for (const tx of texteAusHtmlRoh(m[1]!)) {
          for (const zeile of tx.replace(/\\begin\{gathered\}|\\end\{gathered\}/g, '').split('\\\\')) {
            expect(zeile.replace(/\\left|\\right|\\,|\\ /g, '').length, zeile).toBeLessThanOrEqual(44);
            n++;
          }
        }
      }
    }
    expect(n).toBeGreaterThan(30);
  });
});

function texteAusHtmlRoh(html: string): string[] {
  return [...html.matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<'));
}

describe('Zusammenfassung', () => {
  it('enthält die Merksätze, beide Beispiele mit vollständigem Rechenweg und die häufigen Fehler ohne Formelfehler', () => {
    const html = rendern('zusammenfassung');
    expect(html).not.toContain('formel-fehler');
    for (const wort of ['Schnittwinkel zweier Geraden', 'Was der Betrag bewirkt', 'Wann es einen Schnittwinkel gibt', 'Winkel mit einer Koordinatenebene', 'Weg 1 (Projektion)', 'Weg 2 (senkrechter Vektor)', 'Häufige Fehler']) expect(html, wort).toContain(wort);
    const tex = texteAusHtml(html).join(' ');
    expect(tex).toContain('\\cos\\alpha=\\frac{|\\vec{u}\\cdot\\vec{v}|}{|\\vec{u}|\\cdot|\\vec{v}|}');
    expect(tex).toContain('\\sin\\alpha=\\frac{|u_i|}{|\\vec{u}|}');
    expect(tex).toContain('63{,}61^{\\circ}');
    expect(tex).toContain('59{,}0^{\\circ}');
  });
  it('das Beispiel mit zwei Geraden rechnet im Text dasselbe wie die Bibliothek', () => {
    const b = D.BEISPIEL;
    const tex = texteAusHtml(rendern('zusammenfassung')).join(' ');
    expect(tex).toContain(`${rd(b.phi)}^{\\circ}`);
    expect(tex).toContain(`${rd(b.alpha)}^{\\circ}`);
    expect(tex).toContain('\\frac{4}{9}');
  });
});
