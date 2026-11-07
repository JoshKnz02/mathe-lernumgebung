import { existsSync, readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/modellieren-geraden/Bilder';
import * as D from '../content/modules/modellieren-geraden/daten';
import Modul from '../content/modules/modellieren-geraden/index';
import { Bewegungslabor, Schattenlabor } from '../content/modules/modellieren-geraden/Labor';
import meta from '../content/modules/modellieren-geraden/meta.json';
import themen from '../content/themen.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { abstandsquadrat, abstandZurZeit, begegnung, geschwindigkeit, kleinsterAbstand, ort, type Bewegung } from '../src/lib/bewegung';
import { lageZweier } from '../src/lib/gerade';
import { konvexeHuelle, parallelSchatten, zentralSchatten } from '../src/lib/projektion';
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
const ORDNER = 'content/modules/modellieren-geraden';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const ohneSchmal = (h: string) => h.replace(/<div class="formel-schmal">[\s\S]*?<\/div>/g, '');
const texteRoh = (html: string): string[] => [...html.matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&#x27;/g, "'"));
const texteAusHtml = (html: string): string[] => texteRoh(ohneSchmal(html));
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
const tempi = (n: ReactNode): number[] => [...texte(n).join(' ').matchAll(/(\d+)\\,\\frac\{\\text\{km\}\}\{\\text\{h\}\}/g)].map((m) => Number(m[1]));
const wert = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!.erwartet;
const frage = (nr: string) => fragen.find((f) => f.nummer === nr)!;
const aufgabe = (nr: string) => aufgaben.find((a) => a.nummer === nr)!;

const betrag = (v: number[]) => Math.hypot(...v);
const diff = (b: number[], a: number[]) => b.map((x, i) => x - a[i]!);
const plus = (a: number[], b: number[]) => a.map((x, i) => x + b[i]!);
const mal = (k: number, v: number[]) => v.map((x) => x * k + 0);
const pu = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i]!, 0);
const kreuz = (a: number[], b: number[]): number[] => [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!].map((x) => x + 0);
const grad = (r: number) => (r * 180) / Math.PI;
const bew = (start: number[], richtung: number[], tempo: number): Bewegung => ({ start, richtung, tempo });
/** Unabhängig: Geschwindigkeit als Tempo mal Einheitsvektor. */
const vel = (b: Bewegung) => mal(b.tempo / betrag(b.richtung), b.richtung);
/** Unabhängiger kleinster Abstand für t ≥ 0 (Raster, danach verfeinert). */
function rasterAbstand(b1: Bewegung, b2: Bewegung, tMax = 0.5): { t: number; d: number } {
  let best = Infinity;
  let bt = 0;
  const f = (t: number) => betrag(diff(plus(b2.start, mal(t, vel(b2))), plus(b1.start, mal(t, vel(b1)))));
  for (let t = 0; t <= tMax; t += 0.0002) {
    const d = f(t);
    if (d < best) {
      best = d;
      bt = t;
    }
  }
  for (let t = Math.max(0, bt - 0.0004); t <= bt + 0.0004; t += 0.000002) {
    const d = f(t);
    if (d < best) {
      best = d;
      bt = t;
    }
  }
  return { t: bt, d: best };
}

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Geraden, hat fünf Abschnitte (Bewegung und Schatten als Teile), BPE 16.7', () => {
    expect(meta.id).toBe('modellieren-geraden');
    expect(meta.thema).toBe('vektorgeometrie');
    expect(meta.unterbereich).toBe('geraden');
    expect(meta.bpe).toEqual(['16.7']);
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['erklaeren', 'bewegung', 'schatten', 'ueberpruefen', 'zusammenfassung']);
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
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"modellieren-geraden"');
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
    for (const wort of ['Geschwindigkeitsvektor', 'Punktmodell', 'Tempo', 'Bewegungsgleichung', 'Kollision', 'Bahn', 'Schattenpunkt', 'Parallelprojektion', 'Zentralprojektion', 'Lichtquelle', 'Boden', 'Spurpunkt', 'Scheitel']) expect(html, wort).toContain(wort);
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).not.toMatch(/\d\/\d(?!\d)/.source.length ? /(?<![\d\w])\d\/\d(?![\d])(?!,)(?= |\.|<)/ : /x/);
    expect(html).not.toMatch(/\bpi\b|Pi\b/);
    expect(html).not.toMatch(/\bλ\b|Lambda/);
  });
  it('die Szenarien der Arbeitsblätter kommen nicht vor (kein Flugzeug, kein Kunstwerk, keine Pyramide, keine Museumsräume), kein Flächeninhalt und keine Ebenengleichungen', () => {
    expect(rendern(null)).not.toMatch(/Flugzeug|Kunstwerk|Pyramide|Museum|Galerie|Glaswand|Normalenvektor|Ebenengleichung|Koordinatenform|Flächeninhalt|Vektorprodukt|Kreuzprodukt/);
  });
  it('das Erklären nimmt nichts vorweg: keine Formel Geschwindigkeit = Tempo mal Einheitsvektor, keine Bedingung s ≥ 1, keine Aussage über Schnittpunkt und Kollision', () => {
    const html = rendern('erklaeren');
    const text = html.replace(/<[^>]*>/g, '');
    for (const wort of ['Einheitsvektor', 'normier', 'Sonderfall', 'kleiner als 1', 'größer als 1', 'genügt nicht']) expect(text, wort).not.toContain(wort);
    const tex = texteAusHtml(html).join(' ');
    expect(tex.length).toBeGreaterThan(100);
    for (const verboten of ['\\frac{\\vec{u}}{|\\vec{u}|}', 's\\ge', 's>1', 't_1=t_2', 'a\\,t^2', '\\frac{x_2}{-v_2}']) expect(tex, verboten).not.toContain(verboten);
  });
  it('verweist auf die Module davor, statt Geradengleichung, Lage, Spurpunkte, Abstand und Optimieren zu wiederholen', () => {
    const quelle = readdirSync(ORDNER).filter((x) => x.endsWith('.tsx')).map((d) => readFileSync(`${ORDNER}/${d}`, 'utf8')).join('\n');
    const ids = [...quelle.matchAll(/modul="([a-z0-9-]+)"/g)].map((m) => m[1]!);
    for (const m of ['geradengleichung', 'gegenseitige-lage-geraden', 'spurpunkte-besondere-lage', 'abstaende-geraden', 'optimierung']) expect(ids, m).toContain(m);
    for (const id of ids) expect(existsSync(`content/modules/${id}/meta.json`), id).toBe(true);
  });
  it('Zeilenumbrüche in Rechnungen nur vor einem Gleichheitszeichen: keine Fortsetzungszeilen mit {}+, {}- oder {}\\cdot, einzige Ausnahme ist die schmale Form einer gegebenen Geradengleichung g: x = p + t · v', () => {
    for (const d of readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts'))) {
      const q = readFileSync(`${ORDNER}/${d}`, 'utf8');
      expect(q, d).not.toMatch(/\{\}\s*(\+|-|\\cdot|\\times)/);
    }
    const roh = texteRoh(rendern(null));
    expect(roh.join(' ')).toContain('{}=');
    for (const r of roh) {
      const treffer = r.match(/\{\}\s*(\+|-|\\cdot|\\times)/g) ?? [];
      if (treffer.length === 0) continue;
      expect(r, `Fortsetzung nur in einer Geradengleichung: ${r.slice(0, 80)}`).toMatch(/^\\begin\{gathered\}[gh]:\\ \\vec\{x\}=.*\\\\\{\}\+[ts]\\cdot/);
      expect(treffer).toHaveLength(1);
    }
  });
  it('die Zahlen der Arbeitsblätter kommen nicht vor (öffentliches Repository)', () => {
    const spalten = spaltenAusTexten(texteAusHtml(rendern(null))).map((s) => s.join(','));
    for (const verboten of D.VERBOTEN_SPALTEN) expect(spalten, verboten).not.toContain(verboten);
    const tex = texteAusHtml(rendern(null)).join(' ');
    for (const verboten of ['800', '679', '7{,}6', '1{,}019', '17{,}67', '53}{3}', '891}{70}', '\\sqrt{78}']) expect(tex, verboten).not.toContain(verboten);
  });
});

describe('Daten Bewegung, unabhängig nachgerechnet', () => {
  it('Hubschrauber: v = 20 · u = (40 | −20 | 40) mit Betrag 60, nach 3 Minuten eine Strecke u weiter in S(1 | 0 | 2), nach 3 km', () => {
    const h = D.HUBSCHRAUBER;
    expect(vel(h)).toEqual([40, -20, 40]);
    expect(geschwindigkeit(h)).toEqual([40, -20, 40]);
    expect(betrag(vel(h))).toBe(60);
    expect(plus(h.start, mal(0.05, vel(h)))).toEqual([...D.S_BEWEGUNG]);
    expect(betrag(diff([...D.S_BEWEGUNG], h.start))).toBe(3);
  });
  it('Bahnen von H und R schneiden sich in S, H erreicht S nach 0,05 h, R nach 3/Tempo Stunden, nur bei 60 km/h zur selben Zeit (Kollision), sonst nicht', () => {
    const L = D.BEWEGUNGSLABOR;
    for (let tempo = L.tempoMin; tempo <= L.tempoMax; tempo += L.tempoSchritt) {
      const r = bew(L.R.start, L.R.richtung, tempo);
      const be = begegnung(L.H, r);
      expect(be.bahnen.art, String(tempo)).toBe('schneidend');
      expect(be.bahnen.schnittpunkt).toEqual([...D.S_BEWEGUNG]);
      expect(be.zeiten!.t1).toBeCloseTo(0.05, 9);
      expect(be.zeiten!.t2).toBeCloseTo(3 / tempo, 9);
      expect(be.zeiten!.t1 + 1e-12 >= 0 && be.zeiten!.t2 >= 0).toBe(true);
      expect(be.kollision !== null, `Kollision bei ${tempo}`).toBe(tempo === L.tempoKollision);
      // unabhängig: Abstand zur Zeit 0,05 für Kollision
      const dS = betrag(diff(ort(r, 0.05), ort(L.H, 0.05)));
      expect(dS < 1e-9).toBe(tempo === L.tempoKollision);
      const k = kleinsterAbstand(L.H, r);
      const raster = rasterAbstand(L.H, r);
      expect(k.d, `Abstand ${tempo}`).toBeCloseTo(raster.d, 3);
      expect(k.t, `Zeit ${tempo}`).toBeCloseTo(raster.t, 3);
    }
  });
  it('Beobachtungen im Bewegungslabor: bei 90 km/h ist der Abstand zu Beginn √18, am kleinsten nach 2,31 min mit 0,83 km, die Parabel hat a = 11 700, b = −900, c = 18', () => {
    const r = bew(D.BEWEGUNGSLABOR.R.start, D.BEWEGUNGSLABOR.R.richtung, 90);
    expect(abstandsquadrat(D.HUBSCHRAUBER, r)).toEqual({ a: 11700, b: -900, c: 18 });
    const k = kleinsterAbstand(D.HUBSCHRAUBER, r);
    expect(k.t * 60).toBeCloseTo(2.3077, 3);
    expect(k.d).toBeCloseTo(0.832, 3);
    expect(abstandZurZeit(D.HUBSCHRAUBER, r, 0)).toBeCloseTo(Math.sqrt(18), 9);
  });
  it('Aufgabendaten: Wetterballon, Kollision (6 min), Zeiten (6 und 3 min), kleinster Abstand genau 4 km nach 4 min, Scheitel bei −9 min', () => {
    const w = D.A_WETTER;
    expect(vel(w.b)).toEqual(w.v);
    expect(plus(w.b.start, mal(w.minuten / 60, w.v))).toEqual([...w.Q]);
    const k = D.A_KOLLISION;
    expect(plus(k.h.start, mal(k.t, vel(k.h)))).toEqual([...k.S]);
    expect(plus(k.ballon.start, mal(k.t, vel(k.ballon)))).toEqual([...k.S]);
    expect(begegnung(k.h, k.ballon).kollision!.t).toBeCloseTo(0.1, 9);
    const z = D.A_ZEITEN;
    expect(plus(z.a.start, mal(0.1, vel(z.a)))).toEqual([...z.S]);
    expect(plus(z.b.start, mal(0.05, vel(z.b)))).toEqual([...z.S]);
    expect(begegnung(z.a, z.b).kollision).toBeNull();
    expect(rasterAbstand(z.a, z.b).d).toBeGreaterThan(0.2);
    const a = D.A_ABSTAND;
    expect(abstandsquadrat(a.h, a.ballon)).toEqual(a.koeff);
    const ra = rasterAbstand(a.h, a.ballon);
    expect(ra.d).toBeCloseTo(a.d, 4);
    expect(ra.t * 60).toBeCloseTo(a.minuten, 2);
    const n = D.A_NEGATIV;
    expect(kleinsterAbstand(n.b1, n.b2).scheitel).toBeCloseTo(n.scheitel, 9);
    expect(rasterAbstand(n.b1, n.b2).d).toBeCloseTo(Math.sqrt(11), 3);
    expect(rasterAbstand(n.b1, n.b2).t).toBe(0);
  });
});

describe('Daten Schatten, unabhängig nachgerechnet (Boden x₃ = 0)', () => {
  const par = (x: number[], v: number[]) => {
    const t = x[2]! / -v[2]!;
    return { t, p: [x[0]! + t * v[0]!, x[1]! + t * v[1]!, 0] };
  };
  const zen = (x: number[], L: number[]) => {
    const s = L[2]! / (L[2]! - x[2]!);
    return { s, p: [L[0]! + s * (x[0]! - L[0]!), L[1]! + s * (x[1]! - L[1]!), 0] };
  };
  const nahe = (a: number[], b: number[]) => a.forEach((c, i) => expect(c).toBeCloseTo(b[i]!, 9));
  it('Platte: Parallelschatten (2 | 3 | 0), (−1 | 2 | 0), (−2 | 3 | 0) bei t = 2, 2, 1, Zentralschatten bei s = 2, 2, 4/3, alle Punkte im Koordinatensystem, alle Ecken über dem Boden', () => {
    const e = D.SCHATTEN.ecken;
    for (const x of e) expect(x[2]).toBeGreaterThan(0);
    const p = e.map((x) => par(x, D.SCHATTEN.v));
    expect(p.map((x) => x.p)).toEqual([[2, 3, 0], [-1, 2, 0], [-2, 3, 0]]);
    expect(p.map((x) => x.t)).toEqual([2, 2, 1]);
    const z = e.map((x) => zen(x, D.SCHATTEN.L));
    expect(z[0]!.s).toBe(2);
    expect(z[1]!.s).toBe(2);
    expect(z[2]!.s).toBeCloseTo(4 / 3, 9);
    nahe(z[0]!.p, [3, -1, 0]);
    nahe(z[1]!.p, [-3, -3, 0]);
    nahe(z[2]!.p, [-3, 5 / 3, 0]);
    for (const x of [...p, ...z]) for (const c of x.p) expect(Math.abs(c)).toBeLessThanOrEqual(4);
    for (const [i, x] of e.entries()) {
      expect(parallelSchatten(x, D.SCHATTEN.v, 'e12').punkt).toEqual(p[i]!.p);
      nahe(zentralSchatten(x, D.SCHATTEN.L, 'e12').punkt!, z[i]!.p);
    }
  });
  it('Aufgabe 8, 9 und 10: Schattenpunkte und Parameter', () => {
    const p = D.A_PARALLEL.ecken.map((x) => par(x, D.A_PARALLEL.v));
    expect(p.map((x) => x.p)).toEqual([...D.A_PARALLEL.schatten.map((s) => [...s])]);
    expect(p.map((x) => x.t)).toEqual([1.5, 0.5, 1]);
    const z = D.A_ZENTRAL.ecken.map((x) => zen(x, D.A_ZENTRAL.L));
    expect(z.map((x) => x.s.toFixed(6))).toEqual([(4 / 3).toFixed(6), '2.000000', '2.000000']);
    nahe(z[0]!.p, [-5 / 3, 1, 0]);
    nahe(z[1]!.p, [3, -1, 0]);
    nahe(z[2]!.p, [-1, -3, 0]);
    for (const x of [...p, ...z]) for (const c of x.p) expect(Math.abs(c)).toBeLessThanOrEqual(3.8);
    const a = D.A_PARAMETER;
    expect(zen(a.X, a.L).s).toBe(1.5);
    expect(zen(a.X, a.L).p).toEqual([4, -1, 0]);
  });
  it('Tetraeder: t = 2, S′ = (2 | 3 | 0), A, B, C liegen auf dem Boden, S′ liegt außerhalb des Dreiecks ABC und der Umriss des Schattens hat 4 Ecken (keine Ecke im Dreieck der übrigen drei)', () => {
    const t = D.A_TETRAEDER;
    const r = par([...t.S], t.w);
    expect(r.t).toBe(t.t);
    expect(r.p).toEqual([...t.S1]);
    for (const x of [t.A, t.B, t.C]) expect(x[2]).toBe(0);
    const drin = (q: number[], a: number[], b: number[], c: number[]) => {
      const f = (u: number[], v: number[], w: number[]) => (u[0]! - w[0]!) * (v[1]! - w[1]!) - (v[0]! - w[0]!) * (u[1]! - w[1]!);
      const d = [f(q, a, b), f(q, b, c), f(q, c, a)];
      return !(d.some((x) => x < 0) && d.some((x) => x > 0));
    };
    const pts = [[...t.A], [...t.B], [...t.C], [...t.S1]];
    expect(drin(pts[3]!, pts[0]!, pts[1]!, pts[2]!)).toBe(false);
    const innen = pts.filter((q, i) => drin(q, ...(pts.filter((_, j) => j !== i) as [number[], number[], number[]])));
    expect(innen).toHaveLength(0);
    expect(konvexeHuelle(pts)).toHaveLength(t.ecken);
    expect(t.ecken).toBe(4);
    const m = D.A_MAST;
    expect(plus([...m.T], mal(2, m.w))).toEqual([...m.T0]);
    expect(m.T0[2]).toBe(0);
    expect(parallelSchatten([...m.T], m.w, 'e12').punkt).toEqual([...m.T0]);
    expect(betrag(diff([...m.T0], [...m.F]))).toBeCloseTo(Math.sqrt(8), 9);
  });
});

describe('Bilder', () => {
  const bilder: [string, RaumBildSpec][] = [
    ['BAHN', B.RAUM_BAHN], ['FLUG', B.RAUM_FLUG], ['BAHNEN', B.RAUM_BAHNEN], ['WETTER', B.aufgWetter], ['KOLLISION', B.aufgKollision], ['ZEITEN', B.aufgZeiten], ['ABSTAND', B.aufgAbstand],
    ['PARALLEL', B.RAUM_PARALLEL], ['ZENTRAL', B.RAUM_ZENTRAL], ['A PARALLEL', B.aufgParallel], ['A ZENTRAL', B.aufgZentral], ['TETRAEDER', B.aufgTetraeder], ['MAST', B.aufgMast],
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
  it('Punkte und Namen liegen nicht bei den Achsentiteln x₁, x₂, x₃', () => {
    const titel = [[5.9, 0.37], [0.42, 6.1], [-2.76, -3.09]];
    for (const [name, s] of bilder) for (const p of s.punkte!) {
      const b = bildpunkt(p.p);
      for (const t of titel) expect(Math.hypot(b[0] - t[0]!, b[1] - t[1]!), `${name} ${p.name}`).toBeGreaterThan(p.nurText ? 0.9 : 1.2);
    }
  });
  it('die Namen g und h stehen dicht an ihrer Bahn in deren Farbe, alle Linien sind durchgezogen, die Bahnen sind im Schrägbild nicht entartet (Winkel zu den Achsenbildern mindestens 11 Grad)', () => {
    const mitNamen: [string, RaumBildSpec, string[]][] = [
      ['BAHN', B.RAUM_BAHN, ['g']], ['FLUG', B.RAUM_FLUG, ['g']], ['BAHNEN', B.RAUM_BAHNEN, ['g', 'h']], ['WETTER', B.aufgWetter, ['g']], ['KOLLISION', B.aufgKollision, ['g', 'h']], ['ZEITEN', B.aufgZeiten, ['g', 'h']], ['ABSTAND', B.aufgAbstand, ['g', 'h']],
    ];
    for (const [name, spec, namen] of mitNamen) {
      const texte2 = spec.punkte!.filter((p) => p.nurText);
      expect(texte2.map((p) => p.name), name).toEqual(namen);
      const linien = spec.linien!.map((l) => [bildpunkt(l.von), bildpunkt(l.bis)] as const);
      for (const l of spec.linien!) {
        expect(l.gestrichelt, `${name} durchgezogen`).toBeFalsy();
        expect(l.farbe, name).not.toBe('#0072B2');
      }
      for (const tx of texte2) {
        const b = bildpunkt(tx.p);
        expect(Math.abs(b[0]) <= 6 && Math.abs(b[1]) <= 6, `${name} ${tx.name} im Bild`).toBe(true);
        expect(Math.min(...linien.map(([a1, b1]) => abst(b, a1, b1))), `${name} ${tx.name} dicht an der Linie`).toBeLessThanOrEqual(0.4);
        for (const p of spec.punkte!.filter((q) => !q.nurText)) expect(Math.hypot(bildpunkt(p.p)[0] - b[0], bildpunkt(p.p)[1] - b[1]), `${name} ${tx.name} Punkt`).toBeGreaterThan(0.6);
        expect(spec.linien!.map((l) => l.farbe), `${name} ${tx.name}`).toContain(tx.farbe);
      }
    }
    const bahnen: [string, Bewegung][] = [['H', D.HUBSCHRAUBER], ['R', bew(D.RETTUNG_START.start, D.RETTUNG_START.richtung, 90)], ['Wetter', D.A_WETTER.b], ['K Hubschrauber', D.A_KOLLISION.h], ['K Ballon', D.A_KOLLISION.ballon], ['Z 1', D.A_ZEITEN.a], ['Z 2', D.A_ZEITEN.b], ['Abstand H', D.A_ABSTAND.h], ['Abstand B', D.A_ABSTAND.ballon]];
    for (const [name, b] of bahnen) {
      const u = b.richtung;
      const d = [u[1]! - u[0]! / 2, u[2]! - u[0]! / 2];
      const len = Math.hypot(d[0]!, d[1]!);
      expect(len, name).toBeGreaterThan(1.2);
      for (const ax of [[-0.5, -0.5], [1, 0], [0, 1]]) expect(grad(Math.acos(Math.min(1, Math.abs(d[0]! * ax[0]! + d[1]! * ax[1]!) / (len * Math.hypot(ax[0]!, ax[1]!))))), `${name} Winkel zur Achse`).toBeGreaterThan(11);
    }
  });
  it('die Bilder zeigen, was die Rechnung sagt: Orte auf den Bahnen, Treffpunkt auf beiden Bahnen, Schattenpunkte, Strahlen durch Gegenstandspunkte und Schattenpunkte, rosa Schatten', () => {
    const pk = (s: RaumBildSpec, n: string) => s.punkte!.find((p) => p.name === n)!.p;
    const aufBahn = (b: Bewegung, x: number[]) => kreuz(diff(x, b.start), b.richtung).every((c) => Math.abs(c) < 1e-9);
    expect(pk(B.RAUM_FLUG, 'Q')).toEqual([...D.S_BEWEGUNG]);
    expect(aufBahn(D.HUBSCHRAUBER, [...pk(B.RAUM_BAHNEN, 'S')])).toBe(true);
    expect(aufBahn(bew(D.RETTUNG_START.start, D.RETTUNG_START.richtung, 90), [...pk(B.RAUM_BAHNEN, 'S')])).toBe(true);
    expect(pk(B.aufgKollision, 'S')).toEqual([...D.A_KOLLISION.S]);
    expect(aufBahn(D.A_KOLLISION.h, [...pk(B.aufgKollision, 'S')]) && aufBahn(D.A_KOLLISION.ballon, [...pk(B.aufgKollision, 'S')])).toBe(true);
    expect(aufBahn(D.A_ZEITEN.a, [...pk(B.aufgZeiten, 'S')]) && aufBahn(D.A_ZEITEN.b, [...pk(B.aufgZeiten, 'S')])).toBe(true);
    // Aufgabe 6: die Orte nach 4 Minuten, die rosa Strecke hat die Länge 1
    const a = D.A_ABSTAND;
    pk(B.aufgAbstand, 'H').forEach((c, i) => expect(c).toBeCloseTo(plus(a.h.start, mal(1 / 15, vel(a.h)))[i]!, 6));
    const rosa = B.aufgAbstand.linien!.find((l) => l.farbe === D.ROSA)!;
    expect(betrag(diff([...rosa.bis], [...rosa.von]))).toBeCloseTo(a.d, 5);
    // Schatten: Punkte P′ usw. (parallel) und P″ (zentral)
    const sch = (spec: RaumBildSpec, ecken: number[][], strich: string, soll: (number[] | null)[]) => {
      ecken.forEach((e, i) => expect(pk(spec, ['P', 'Q', 'R'][i]!)).toEqual(e));
      soll.forEach((s, i) => expect(pk(spec, `${['P', 'Q', 'R'][i]}${strich}`).map((x) => Math.round(x * 1e4) / 1e4)).toEqual(s!.map((x) => Math.round(x * 1e4) / 1e4)));
      const orange = spec.linien!.filter((l) => l.farbe === D.ORANGE);
      expect(orange).toHaveLength(3);
      const rosaLinien = spec.linien!.filter((l) => l.farbe === D.ROSA);
      expect(rosaLinien).toHaveLength(3);
      for (const l of rosaLinien) expect(l.gestrichelt, 'Schatten gestrichelt').toBe(true);
      for (const l of spec.linien!.filter((x) => x.farbe !== D.ROSA)) expect(l.gestrichelt, 'Strahlen und Gegenstand durchgezogen').toBeFalsy();
      for (const p2 of ['P', 'Q', 'R'].map((n) => pk(spec, n))) expect(p2[2], 'Ecke über dem Boden').toBeGreaterThan(0);
      for (const l of rosaLinien) { expect(l.von[2]).toBe(0); expect(l.bis[2]).toBe(0); }
      expect(spec.linien!.filter((l) => l.farbe === D.SCHWARZ)).toHaveLength(3);
      return orange;
    };
    const o1 = sch(B.RAUM_PARALLEL, D.SCHATTEN.ecken, '′', [[2, 3, 0], [-1, 2, 0], [-2, 3, 0]]);
    for (const l of o1) expect(kreuz(diff([...l.bis], [...l.von]), D.SCHATTEN.v).every((c) => Math.abs(c) < 1e-6)).toBe(true);
    const o2 = sch(B.RAUM_ZENTRAL, D.SCHATTEN.ecken, '″', [[3, -1, 0], [-3, -3, 0], [-3, 5 / 3, 0]]);
    for (const l of o2) expect([...l.von]).toEqual([...D.SCHATTEN.L]);
    for (const [i, e] of D.SCHATTEN.ecken.entries()) expect(kreuz(diff([...e], [...D.SCHATTEN.L]), diff([...o2[i]!.bis], [...D.SCHATTEN.L])).every((c) => Math.abs(c) < 1e-4)).toBe(true);
    sch(B.aufgParallel, D.A_PARALLEL.ecken, '′', D.A_PARALLEL.schatten.map((s) => [...s]));
    sch(B.aufgZentral, D.A_ZENTRAL.ecken, '″', [[-5 / 3, 1, 0], [3, -1, 0], [-1, -3, 0]]);
    // Tetraeder und Mast
    const t = D.A_TETRAEDER;
    expect(pk(B.aufgTetraeder, "S′")).toEqual([...t.S1]);
    expect(B.aufgTetraeder.linien!.filter((l) => l.farbe === D.SCHWARZ)).toHaveLength(6);
    const rosaT = B.aufgTetraeder.linien!.filter((l) => l.farbe === D.ROSA);
    expect(rosaT).toHaveLength(t.ecken);
    for (const l of rosaT) { expect(l.gestrichelt).toBe(true); expect(l.von[2]).toBe(0); expect(l.bis[2]).toBe(0); }
    const m = D.A_MAST;
    expect(pk(B.aufgMast, "T′")).toEqual([...m.T0]);
    const rosaMast = B.aufgMast.linien!.find((l) => l.farbe === D.ROSA)!;
    expect([[...rosaMast.von], [...rosaMast.bis]]).toEqual([[...m.F], [...m.T0]]);
    expect(rosaMast.gestrichelt).toBe(true);
  });
});

describe('Labore', () => {
  it('Bewegungslabor: zwei Regler, drei Schalter, Abstand, Kurve und Zeiten zunächst verborgen, ohne Schalter Ebene und Raum', () => {
    const html = renderToStaticMarkup(<Bewegungslabor />);
    expect(html.match(/type="range"/g)).toHaveLength(2);
    expect(html.match(/type="checkbox"/g)).toHaveLength(3);
    expect(html).toContain('aria-label="Darstellung wählen"');
    expect(html).not.toContain('aria-label="Ebene oder Raum wählen"');
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('Abstand zur Zeit');
    expect(html).not.toContain('Die Bahnen schneiden sich im Punkt');
    expect(html).not.toContain('Abstandskurve</');
  });
  it('Schattenlabor: drei Regler, drei Lichtschalter, zunächst paralleles Licht, Strahlen, Schatten und Schattenpunkte verborgen', () => {
    const html = renderToStaticMarkup(<Schattenlabor />);
    expect(html.match(/type="range"/g)).toHaveLength(3);
    expect(html.match(/type="checkbox"/g)).toHaveLength(3);
    expect(html).toContain('aria-label="Lichtart wählen"');
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('hat keinen Schatten');
    expect(html).not.toContain('legende-farbe" style="background:#CC79A7');
    expect(html).not.toContain('legende-farbe" style="background:#D55E00');
  });
  it('Bewegungslabor, alle Einstellungen: Linien im Koordinatensystem, Punkte ohne Doppelungen, Abstand nur mit Schalter, Kollision genau bei 60 km/h und t = 3 min', () => {
    const L = D.BEWEGUNGSLABOR;
    let n = 0;
    for (let tempo = L.tempoMin; tempo <= L.tempoMax; tempo += L.tempoSchritt) {
      const r = bew(L.R.start, L.R.richtung, tempo);
      for (let tm = 0; tm <= L.tMaxMin + 1e-9; tm += 0.1) {
        const t = Math.round(tm * 10) / 10;
        for (const [abstand, schnitt] of [[false, false], [true, false], [false, true], [true, true]] as const) {
          const res = B.bewegungsLaborBild(tempo, t, abstand, schnitt);
          for (const x of res.spec.linien!) for (const c of [...x.von, ...x.bis]) expect(Math.abs(c)).toBeLessThanOrEqual(4 + 1e-9);
          const bp = res.spec.punkte!.filter((p) => !p.nurText).map((p) => bildpunkt(p.p).join(','));
          expect(new Set(bp).size).toBe(bp.length);
          if (!abstand) expect(res.spec.linien!.some((x) => x.farbe === D.ROSA)).toBe(false);
          if (!schnitt) expect(res.spec.punkte!.some((p) => p.name === 'S')).toBe(false);
          expect(res.spec.sprech.length).toBeGreaterThan(40);
          n++;
        }
        const dd = betrag(diff(ort(r, t / 60), ort(L.H, t / 60)));
        if (tempo === L.tempoKollision && Math.abs(t - 3) < 1e-9) expect(dd).toBeLessThan(1e-9);
        if (tempo !== L.tempoKollision && Math.abs(t - 3) < 1e-9) expect(dd).toBeGreaterThan(0.1);
      }
    }
    expect(n).toBe(5 * 41 * 4);
  }, 120000);
  it('Schattenlabor, alle Einstellungen: Linien im Koordinatensystem, Punkte ohne Doppelungen, „kein Schatten“ genau bei Strahl parallel oder falscher Seite (unabhängige Formel), Strahlen und Schatten nur mit Schalter', () => {
    const ecken = D.SCHATTENLABOR.ecken;
    let n = 0;
    const kein = (x: number[], art: 'parallel' | 'zentral', v: number[], L: number[]) => {
      if (art === 'parallel') return v[2] === 0 || -x[2]! / v[2]! < 0;
      const d = x[2]! - L[2]!;
      return d === 0 || L[2]! / (L[2]! - x[2]!) < 1;
    };
    const kombis = [[false, false], [true, false], [false, true], [true, true]] as const;
    for (let a = -2; a <= 2; a++) for (let v2 = -2; v2 <= 2; v2++) for (let c = -3; c <= 1; c++) {
      for (const [st, sc] of kombis) {
        const r = B.schattenLaborBild('parallel', [a, v2, c], [1, 1, 4], st, sc);
        for (const x of r.spec.linien!) for (const co of [...x.von, ...x.bis]) expect(Math.abs(co)).toBeLessThanOrEqual(4 + 1e-9);
        const bp = r.spec.punkte!.filter((p) => !p.nurText).map((p) => bildpunkt(p.p).join(','));
        expect(new Set(bp).size).toBe(bp.length);
        expect(r.keinSchatten).toEqual(ecken.flatMap((e, i) => (kein(e, 'parallel', [a, v2, c], [1, 1, 4]) ? [['P', 'Q', 'R'][i]!] : [])));
        if (!st) expect(r.spec.linien!.some((x) => x.farbe === D.ORANGE)).toBe(false);
        if (!sc) expect(r.spec.linien!.some((x) => x.farbe === D.ROSA)).toBe(false);
        n++;
      }
    }
    for (let l1 = -3; l1 <= 3; l1++) for (let l2 = -3; l2 <= 3; l2++) for (let l3 = 1; l3 <= 4; l3++) {
      for (const [st, sc] of kombis) {
        const L = [l1, l2, l3];
        const r = B.schattenLaborBild('zentral', [1, -1, -1], L, st, sc);
        for (const x of r.spec.linien!) for (const co of [...x.von, ...x.bis]) expect(Math.abs(co)).toBeLessThanOrEqual(4 + 1e-9);
        const bp = r.spec.punkte!.filter((p) => !p.nurText).map((p) => bildpunkt(p.p).join(','));
        expect(new Set(bp).size).toBe(bp.length);
        expect(r.keinSchatten).toEqual(ecken.flatMap((e, i) => (kein(e, 'zentral', [1, -1, -1], L) ? [['P', 'Q', 'R'][i]!] : [])));
        n++;
      }
    }
    expect(n).toBe(125 * 4 + 7 * 7 * 4 * 4);
  }, 120000);
});

describe('Aufgaben', () => {
  it('12 Aufgaben: sieben mit Eingabefeldern (2, 4, 5, 6, 8, 9, 11), vier Auswahlfragen (1, 3, 7, 10) und eine Zeichenaufgabe (12), Auswahl und Aufgaben nach Reihenfolge', () => {
    const html = rendern('ueberpruefen');
    expect(aufgaben.map((a) => a.nummer)).toEqual(['2', '4', '5', '6', '8', '9', '11']);
    expect(fragen.map((f) => f.nummer)).toEqual(['1', '3', '7', '10']);
    expect(html).toContain('Aufgabe 12: Der Schatten eines Masts');
    expect(html).toContain('Teil Bewegung');
    expect(html).toContain('Teil Schatten');
  });
  it('Aufgabe 2: Geschwindigkeitsvektor und Ort nach 5 Minuten stimmen mit der unabhängigen Rechnung überein', () => {
    rendern('ueberpruefen');
    const [u] = spaltenAus(aufgabe('2').children);
    const P = punktAus(aufgabe('2').children, 'P')!;
    const w = tempi(aufgabe('2').children)[0]!;
    const v = mal(w / betrag(u!), u!);
    expect([wert('2', 'v1'), wert('2', 'v2'), wert('2', 'v3')]).toEqual(v);
    expect([wert('2', 'q1'), wert('2', 'q2'), wert('2', 'q3')]).toEqual(plus(P, mal(5 / 60, v)).map((x) => Math.round(x * 1e9) / 1e9));
    expect(betrag(v)).toBeCloseTo(w, 9);
  });
  it('Auswahl 3: genau die Antwort „keine Kollision, früher in S“ ist richtig, jede falsche hat eine eigene Begründung', () => {
    rendern('ueberpruefen');
    const f = frage('3');
    expect(f.optionen.filter((o) => o.richtig)).toHaveLength(1);
    expect(alsText(f.optionen.find((o) => o.richtig)!.text)).toContain('keine Kollision');
    expect(new Set(f.optionen.map((o) => alsText(o.rueckmeldung))).size).toBe(4);
    expect(alsText(f.optionen[0]!.text) + alsText(f.optionen[1]!.text) + alsText(f.optionen[2]!.text) + alsText(f.optionen[3]!.text)).toContain('10,5');
  });
  it('Aufgabe 4: Zeit und Treffpunkt (Gleichsetzen mit gemeinsamem t), alle drei Koordinatengleichungen liefern dasselbe t', () => {
    rendern('ueberpruefen');
    const [uh, ub] = spaltenAus(aufgabe('4').children);
    const [wh, wb] = tempi(aufgabe('4').children);
    const H0 = punktAus(aufgabe('4').children, 'H_0')!;
    const B0 = punktAus(aufgabe('4').children, 'B_0')!;
    const vh = mal(wh! / betrag(uh!), uh!);
    const vb = mal(wb! / betrag(ub!), ub!);
    const ts: number[] = [];
    for (let i = 0; i < 3; i++) if (Math.abs(vh[i]! - vb[i]!) > 1e-9) ts.push((B0[i]! - H0[i]!) / (vh[i]! - vb[i]!));
    for (const t of ts) expect(t).toBeCloseTo(wert('4', 't'), 9);
    expect(plus(H0, mal(wert('4', 't'), vh))).toEqual(plus(B0, mal(wert('4', 't'), vb)).map((x) => Math.round(x * 1e9) / 1e9));
    expect([wert('4', 's1'), wert('4', 's2'), wert('4', 's3')]).toEqual(plus(H0, mal(wert('4', 't'), vh)).map((x) => Math.round(x * 1e9) / 1e9));
    expect(aufgabe('4').felder.length).toBe(4);
  });
  it('Aufgabe 5: Zeiten bis S in Minuten und Unterschied in Sekunden, die Objekte sind nie zur selben Zeit am selben Ort', () => {
    rendern('ueberpruefen');
    const [u1, u2] = spaltenAus(aufgabe('5').children);
    const [w1, w2] = tempi(aufgabe('5').children);
    const P1 = punktAus(aufgabe('5').children, 'P_1')!;
    const P2 = punktAus(aufgabe('5').children, 'P_2')!;
    const S = punktAus(aufgabe('5').children, 'S')!;
    const b1 = bew(P1, u1!, w1!);
    const b2 = bew(P2, u2!, w2!);
    const t1 = ((S[0]! - P1[0]!) / vel(b1)[0]!) * 60;
    const t2 = ((S[0]! - P2[0]!) / vel(b2)[0]!) * 60;
    expect(wert('5', 'ta')).toBeCloseTo(t1, 9);
    expect(wert('5', 'tb')).toBeCloseTo(t2, 9);
    expect(wert('5', 'dt')).toBeCloseTo(Math.abs(t1 - t2) * 60, 9);
    expect(plus(P1, mal(wert('5', 'ta') / 60, vel(b1)))).toEqual(S.map((x) => x));
    expect(plus(P2, mal(wert('5', 'tb') / 60, vel(b2)))).toEqual(S.map((x) => x));
    expect(begegnung(b1, b2).kollision).toBeNull();
  });
  it('Aufgabe 6: a, b, c, Zeit in Minuten und kleinster Abstand stimmen (Raster, Koeffizienten aus den Aufgabentexten)', () => {
    rendern('ueberpruefen');
    const [uh, ub] = spaltenAus(aufgabe('6').children);
    const [wh, wb] = tempi(aufgabe('6').children);
    const H0 = punktAus(aufgabe('6').children, 'H_0')!;
    const B0 = punktAus(aufgabe('6').children, 'B_0')!;
    const bh = bew(H0, uh!, wh!);
    const bb = bew(B0, ub!, wb!);
    const dp = diff(B0, H0);
    const dv = diff(vel(bb), vel(bh));
    expect([wert('6', 'a'), wert('6', 'b'), wert('6', 'c')]).toEqual([pu(dv, dv), 2 * pu(dp, dv), pu(dp, dp)]);
    const r = rasterAbstand(bh, bb);
    expect(wert('6', 'tm')).toBeCloseTo(r.t * 60, 2);
    expect(wert('6', 'd')).toBeCloseTo(r.d, 4);
    expect(wert('6', 'tm')).toBeCloseTo((-wert('6', 'b') / (2 * wert('6', 'a'))) * 60, 9);
  });
  it('Auswahl 7: die richtige Antwort ist der Abstand bei t = 0 (√11), die falsche √2 ist der Wert am Scheitel bei t = −0,15 h, beide unabhängig berechnet', () => {
    rendern('ueberpruefen');
    const f = frage('7');
    const n = D.A_NEGATIV;
    const f2 = (t: number) => (3 + 20 * t) ** 2 + 2;
    const r = rasterAbstand(n.b1, n.b2);
    expect(r.t).toBe(0);
    expect(r.d).toBeCloseTo(Math.sqrt(11), 4);
    const richtig = f.optionen.find((o) => o.richtig)!;
    expect(texte(richtig.text).join(' ')).toContain('\\sqrt{11}');
    expect(texte(richtig.text).join(' ')).toContain('3{,}32');
    expect(texte(f.optionen.find((o) => o.id === 'b')!.text).join(' ')).toContain(String(Math.round(Math.sqrt(f2(-0.15)) * 100) / 100).replace('.', '{,}'));
    expect(f.optionen.filter((o) => o.richtig)).toHaveLength(1);
  });
  it('Aufgabe 8: Schattenpunkte (x₁ und x₂) bei Sonnenlicht, aus den Aufgabentexten unabhängig berechnet', () => {
    rendern('ueberpruefen');
    const P = punktAus(aufgabe('8').children, 'P')!;
    const Q = punktAus(aufgabe('8').children, 'Q')!;
    const R = punktAus(aufgabe('8').children, 'R')!;
    const [v] = spaltenAus(aufgabe('8').children);
    [P, Q, R].forEach((x, i) => {
      const t = x[2]! / -v![2]!;
      expect(t).toBeGreaterThan(0);
      expect(wert('8', `x${i}`)).toBeCloseTo(x[0]! + t * v![0]!, 9);
      expect(wert('8', `y${i}`)).toBeCloseTo(x[1]! + t * v![1]!, 9);
    });
    expect(aufgabe('8').felder).toHaveLength(6);
    for (const f of aufgabe('8').felder) expect(f.toleranz).toBe(0.01);
  });
  it('Aufgabe 9: Schattenpunkte bei der Lampe (Brüche mit Toleranz 0,01), aus den Aufgabentexten unabhängig berechnet', () => {
    rendern('ueberpruefen');
    const P = punktAus(aufgabe('9').children, 'P')!;
    const Q = punktAus(aufgabe('9').children, 'Q')!;
    const R = punktAus(aufgabe('9').children, 'R')!;
    const L = punktAus(aufgabe('9').children, 'L')!;
    [P, Q, R].forEach((x, i) => {
      const s = L[2]! / (L[2]! - x[2]!);
      expect(s).toBeGreaterThanOrEqual(1);
      expect(wert('9', `x${i}`)).toBeCloseTo(L[0]! + s * (x[0]! - L[0]!), 9);
      expect(wert('9', `y${i}`)).toBeCloseTo(L[1]! + s * (x[1]! - L[1]!), 9);
    });
    for (const f of aufgabe('9').felder) expect(f.toleranz).toBe(0.01);
  });
  it('Auswahl 10: s = 3/2, die richtige Antwort nennt „hinter X“, der Schattenpunkt in der Antwort ist (4 | −1 | 0)', () => {
    rendern('ueberpruefen');
    const f = frage('10');
    const r = f.optionen.find((o) => o.richtig)!;
    expect(texte(r.text).join(' ')).toContain('\\frac{3}{2}');
    expect(texte(r.rueckmeldung).join(' ')).toContain("X''(4\\,|\\,-1\\,|\\,0)");
    expect(f.optionen.filter((o) => o.richtig)).toHaveLength(1);
  });
  it('Aufgabe 11: Parameter t, Schattenpunkt S′ und Zahl der Ecken des Umrisses aus den Aufgabentexten unabhängig berechnet', () => {
    rendern('ueberpruefen');
    const [A, B, C, S] = ['A', 'B', 'C', 'S'].map((n) => punktAus(aufgabe('11').children, n)!);
    const [w] = spaltenAus(aufgabe('11').children);
    const t = S![2]! / -w![2]!;
    expect(wert('11', 't')).toBe(t);
    expect(wert('11', 's1')).toBe(S![0]! + t * w![0]!);
    expect(wert('11', 's2')).toBe(S![1]! + t * w![1]!);
    expect(A![2]).toBe(0);
    // Umriss: Ecken, die nicht im Dreieck der übrigen drei liegen (unabhängig über Flächeninhalte)
    const sp = [A!, B!, C!, [S![0]! + t * w![0]!, S![1]! + t * w![1]!]];
    const flaeche = (a: number[], b: number[], c: number[]) => Math.abs((b[0]! - a[0]!) * (c[1]! - a[1]!) - (b[1]! - a[1]!) * (c[0]! - a[0]!)) / 2;
    const ecken = sp.filter((q, i) => {
      const [a, b, c] = sp.filter((_, j) => j !== i) as [number[], number[], number[]];
      return Math.abs(flaeche(a, b, c) - (flaeche(q, a, b) + flaeche(q, b, c) + flaeche(q, c, a))) > 1e-9;
    });
    expect(wert('11', 'n')).toBe(ecken.length);
    expect(aufgabe('11').felder).toHaveLength(4);
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
      expect(h).not.toMatch(/(?<![\d,])\d\/\d(?![\d,])(?=[^}]*(<|$))/.source ? /(?<=[ >])\d\/\d(?= |<|\.)/ : /x/);
      expect(h.replace(/<[^>]*>/g, '').trim().length).toBeGreaterThan(0);
    }
    for (const x of a) {
      expect(x.hilfen.length, x.nummer).toBeGreaterThanOrEqual(2);
      expect(x.loesung.length, x.nummer).toBeGreaterThanOrEqual(2);
    }
  });
  it('Lösungsschritte in kurzen Zeilen: jede schmale Formel hat höchstens 44 Zeichen je Zeile (Vektorzeilen zählen Zeile für Zeile)', () => {
    rendern('ueberpruefen');
    let n = 0;
    for (const x of aufgaben) for (const l of x.loesung) {
      for (const m of alsText(l).matchAll(/<div class="formel-schmal">([\s\S]*?)<\/div>/g)) {
        for (const tx of texteRoh(m[1]!)) {
          for (const zeile of tx.replace(/\\begin\{gathered\}|\\end\{gathered\}/g, '').split('\\\\')) {
            // Die Vektorzeile p + t · v bleibt in einer Zeile (Ausnahme der Vorgabe vom 07.11.2026), sie ist durch die Spaltenzeilen zerteilt
            if (zeile.includes('\\end{pmatrix}') && zeile.includes('\\begin{pmatrix}')) continue;
            expect(zeile.replace(/\\left|\\right|\\,|\\ /g, '').length, zeile).toBeLessThanOrEqual(44);
            n++;
          }
        }
      }
    }
    expect(n).toBeGreaterThan(40);
  });
});
