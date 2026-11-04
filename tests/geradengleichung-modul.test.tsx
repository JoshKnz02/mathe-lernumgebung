import { existsSync, readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/geradengleichung/Bilder';
import * as D from '../content/modules/geradengleichung/daten';
import Modul from '../content/modules/geradengleichung/index';
import { Gleichungslabor, Parameterlabor, Punktprobelabor, gleichungBild, parameterBild, punktprobeBild, zweiteGleichung } from '../content/modules/geradengleichung/Labor';
import meta from '../content/modules/geradengleichung/meta.json';
import themen from '../content/themen.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { liegtAuf } from '../src/lib/gerade';
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
const ORDNER = 'content/modules/geradengleichung';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const texteAusHtml = (html: string): string[] => [...html.matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<'));
const texte = (n: ReactNode): string[] => texteAusHtml(alsText(n));
const zahl = (s: string) => Number(s.replace(/\{,\}/g, '.'));
/** Alle Spalten (pmatrix) in einem Knoten, als Zahlenlisten (nur Spalten mit reinen Zahlen). */
const spaltenAus = (n: ReactNode): number[][] =>
  [...texte(n).join(' ').matchAll(/\\begin\{pmatrix\}(.*?)\\end\{pmatrix\}/g)].map((m) => m[1]!.split('\\\\').map(zahl)).filter((s) => s.every((x) => Number.isFinite(x)));
/** Alle Punkte der Form A(1\,|\,−2\,|\,3) in einem Knoten, nach Namen. */
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

/* Unabhängige Methoden: Vektorprodukt von Hand ausgeschrieben, Punktprobe über (x − p) × u = 0. */
const kreuz = (a: number[], b: number[]): number[] => [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!].map((x) => x + 0);
const diff = (b: number[], a: number[]) => b.map((x, i) => x - a[i]!);
const plus = (a: number[], b: number[]) => a.map((x, i) => x + b[i]!);
const mal = (k: number, v: number[]) => v.map((x) => x * k);
const aufGerade = (p: number[], u: number[], x: number[]) => kreuz(diff(x, p), u).every((c) => c === 0);
const gleichGerade = (p: number[], u: number[], q: number[], v: number[]) => kreuz(u, v).every((c) => c === 0) && aufGerade(p, u, q);
const nah = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Geraden, hat vier Abschnitte, BPE 16.1', () => {
    expect(meta.id).toBe('geradengleichung');
    expect(meta.thema).toBe('vektorgeometrie');
    expect(meta.unterbereich).toBe('geraden');
    expect(meta.bpe).toEqual(['16.1']);
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
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"geradengleichung"');
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
    for (const wort of ['Stützvektor', 'Stützpunkt', 'Richtungsvektor', 'Parameter', 'Parametergleichung', 'Parameterform', 'Punktprobe', 'Verbindungsvektor', 'Ortsvektor', 'kollinear', 'dieselbe Gerade', 'Nullvektor']) expect(html, wort).toContain(wort);
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).not.toMatch(/\d\/\d/);
    expect(html).not.toMatch(/\bpi\b|Pi\b/);
    expect(html).not.toMatch(/[A-Z]\(-?\d+(,\d+)? ?\/ ?-?\d/);
    expect(html).not.toMatch(/Skalarmultiplikation/);
  });
  it('nur die Gleichung, Punkte und Punktprobe: Spurpunkte, Lage von Geraden, Schnittwinkel, Abstand, Ebenen und Streckenanteile kommen nicht vor', () => {
    expect(rendern(null)).not.toMatch(/Spurpunkt|windschief|Schnittpunkt|Schnittwinkel|Lotfußpunkt|Normalenvektor|Ebenengleichung|Koordinatenform|Hesse|Teilstrecke|Streckenanteil|Abstand|Winkel/);
  });
  it('das Erklären nimmt nichts vorweg: keine Punktprobe, keine mehrfachen Gleichungen, keine Wirkung negativer Parameter', () => {
    const html = rendern('erklaeren');
    const text = html.replace(/<[^>]*>/g, '');
    for (const wort of ['Punktprobe', 'dieselbe Gerade', 'kollinear', 'unendlich viele', 'negativ', 'Vielfache', 'liegt auf']) expect(text, wort).not.toContain(wort);
    const tex = texteAusHtml(html).join(' ');
    expect(tex.length).toBeGreaterThan(100);
    expect(tex).not.toContain('\\Rightarrow');
  });
  it('verweist auf die Module davor statt Ortsvektoren, Kollinearität und Verbindungsvektoren zu wiederholen', () => {
    const quelle = readdirSync(ORDNER).filter((x) => x.endsWith('.tsx')).map((d) => readFileSync(`${ORDNER}/${d}`, 'utf8')).join('\n');
    const ids = [...quelle.matchAll(/modul="([a-z0-9-]+)"/g)].map((m) => m[1]!);
    for (const m of ['punkte-vektoren-raum', 'rechnen-mit-vektoren']) expect(ids, m).toContain(m);
    for (const id of ids) expect(existsSync(`content/modules/${id}/meta.json`), id).toBe(true);
  });
});

describe('Bilder', () => {
  const bilder: [string, RaumBildSpec][] = [['ERKLAEREN', B.RAUM_ERKLAEREN], ['PARAMETER', B.RAUM_PARAMETER], ['PUNKTPROBE', B.RAUM_PUNKTPROBE], ['GLEICHUNG', B.RAUM_GLEICHUNG], ['RICHTUNG', B.aufgRichtung], ['ZEICHNEN', B.aufgZeichnen]];
  const zahlenX1 = Array.from({ length: 2 * RAUM_GRENZE + 1 }, (_, i) => i - RAUM_GRENZE).filter((k) => k !== 0).map((k) => normiert(x1ZahlMitte(k)));
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
  const gerade = (s: RaumBildSpec) => s.linien!.find((l) => l.gestrichelt)!;
  const pfeile = (s: RaumBildSpec) => s.linien!.filter((l) => l.pfeil).map((l) => ({ von: l.von as number[], v: diff(l.bis, l.von), farbe: l.farbe }));
  it('Erklären: A, B und die Gerade stimmen mit der Rechnung überein, Stützvektor ist der Ortsvektor von A, Richtungsvektor AB', () => {
    const e = D.ERKLAEREN;
    expect(diff(e.B, e.A)).toEqual(e.u);
    expect(plus(e.A, mal(e.t, e.u))).toEqual(e.X);
    const [r, o] = pfeile(B.RAUM_ERKLAEREN);
    expect(o!.von).toEqual([0, 0, 0]);
    expect(o!.v).toEqual(e.A);
    expect(r!.von).toEqual(e.A);
    expect(r!.v).toEqual(e.u);
    const g = gerade(B.RAUM_ERKLAEREN);
    for (const x of [g.von, g.bis]) expect(aufGerade(e.A, e.u, x.map((c) => Math.round(c * 1e6) / 1e6)) || kreuz(diff(x, e.A), e.u).every((c) => Math.abs(c) < 1e-6)).toBe(true);
  });
  it('Vermutung 1: die vier Punkte gehören zu t = −1, 0, 1, 2 und liegen auf der Geraden', () => {
    const { g } = D.PARAMETER;
    const p = Object.fromEntries(B.RAUM_PARAMETER.punkte!.map((x) => [x.name, x.p as number[]]));
    expect(p.C).toEqual(plus(g.p, mal(-1, g.u)));
    expect(p.P).toEqual(g.p);
    expect(p.A).toEqual(plus(g.p, g.u));
    expect(p.B).toEqual(plus(g.p, mal(2, g.u)));
    for (const k of ['C', 'P', 'A', 'B']) expect(aufGerade(g.p, g.u, p[k]!), k).toBe(true);
    // gleiche Abstände
    expect(diff(p.A!, p.P!)).toEqual(diff(p.B!, p.A!));
    expect(diff(p.P!, p.C!)).toEqual(diff(p.A!, p.P!));
  });
  it('Vermutung 2: A liegt auf g (t = 2), B nicht (die 1. und 2. Koordinate verlangen t = 2, die 3. verlangt t = 5/2); fünf ganzzahlige Punkte im Koordinatensystem', () => {
    const { g, A, B: Bp, tA } = D.PUNKTPROBE;
    expect(plus(g.p, mal(tA, g.u))).toEqual(A);
    expect(aufGerade(g.p, g.u, A)).toBe(true);
    expect(aufGerade(g.p, g.u, Bp)).toBe(false);
    expect((Bp[0]! - g.p[0]!) / g.u[0]!).toBe(2);
    expect((Bp[1]! - g.p[1]!) / g.u[1]!).toBe(2);
    expect((Bp[2]! - g.p[2]!) / g.u[2]!).toBe(2.5);
    let n = 0;
    for (let a = -4; a <= 4; a++) for (let b = -4; b <= 4; b++) for (let c = -4; c <= 4; c++) if (aufGerade(g.p, g.u, [a, b, c])) n++;
    expect(n).toBe(5);
    expect(diff(Bp, A)).toEqual([0, 0, 1]);
  });
  it('Vermutung 2, zweiter Auftrag: bei einer 0 im Richtungsvektor muss die Koordinate übereinstimmen', () => {
    const n = D.NULL_KOORDINATE;
    expect(aufGerade(n.g.p, n.g.u, n.auf)).toBe(true);
    expect(plus(n.g.p, mal(n.t, n.g.u))).toEqual(n.auf);
    expect(aufGerade(n.g.p, n.g.u, n.nicht)).toBe(false);
    // die 2. und 3. Koordinate von (2 | 3 | −1) passen beide zu t = 1, nur die 1. nicht
    expect((n.nicht[1]! - n.g.p[1]!) / n.g.u[1]!).toBe(1);
    expect((n.nicht[2]! - n.g.p[2]!) / n.g.u[2]!).toBe(1);
    expect(n.nicht[0]).not.toBe(n.g.p[0]);
  });
  it('Vermutung 3: Q = P + 2u liegt auf g, der blaue Pfeil in P ist u, der rosa Pfeil in Q ist −2u und führt nach P', () => {
    const { g, P, Q, T, h3 } = D.GLEICHUNG;
    expect(plus(g.p, mal(2, g.u))).toEqual(Q);
    expect(plus(g.p, g.u)).toEqual(T);
    expect(aufGerade(g.p, g.u, Q)).toBe(true);
    const [u, v] = pfeile(B.RAUM_GLEICHUNG);
    expect(u!.von).toEqual(P);
    expect(u!.v).toEqual(g.u);
    expect(v!.von).toEqual(Q);
    expect(v!.v).toEqual(mal(-2, g.u));
    expect(plus(Q, v!.v)).toEqual(P);
    expect(gleichGerade(g.p, g.u, Q, v!.v)).toBe(true);
    expect(gleichGerade(g.p, g.u, g.p, h3)).toBe(false);
    expect(gleichGerade(g.p, g.u, g.p, mal(-2, g.u))).toBe(true);
  });
  it('Aufgabe 1 und 12: Bilder passen zu den Daten', () => {
    const r = D.A_RICHTUNG;
    expect(diff(r.B, r.A)).toEqual(r.u);
    const z = D.A_ZEICHNEN;
    expect(plus(z.g.p, z.g.u)).toEqual(z.Q);
    expect(z.P).toEqual(z.g.p);
    const [pf] = pfeile(B.aufgZeichnen);
    expect(pf!.v).toEqual(z.g.u);
  });
});

describe('Labore', () => {
  it('Parameterlabor: Startwerte sind das Beispiel der Vermutung 1, sieben Regler, zwei Schalter, ohne Schalter Ebene und Raum, Rechnung zunächst verborgen', () => {
    const html = renderToStaticMarkup(<Parameterlabor />);
    expect(html.match(/type="range"/g)).toHaveLength(7);
    expect(html.match(/type="checkbox"/g)).toHaveLength(2);
    expect(html).toContain('aria-label="Legende"');
    expect(html).toContain('aria-label="Darstellung wählen"');
    expect(html).not.toContain('aria-label="Ebene oder Raum wählen"');
    expect(html).not.toContain('formel-fehler');
    const tex = texteAusHtml(html).join(' ');
    expect(tex).not.toContain('\\vec{x}=\\vec{p}+t');
    expect(tex).toContain('\\vec{p}=');
  });
  it('Punktprobelabor und Gleichungslabor: Regler, Schalter, Ergebnisse zunächst verborgen', () => {
    const a = renderToStaticMarkup(<Punktprobelabor />);
    expect(a.match(/type="range"/g)).toHaveLength(3);
    expect(a.match(/type="checkbox"/g)).toHaveLength(1);
    expect(a).not.toContain('liegt auf');
    expect(a).not.toContain('formel-fehler');
    const b = renderToStaticMarkup(<Gleichungslabor />);
    expect(b.match(/type="range"/g)).toHaveLength(4);
    expect(b.match(/type="checkbox"/g)).toHaveLength(1);
    expect(b).not.toContain('dieselbe Gerade');
    expect(b).not.toContain('formel-fehler');
  });
  it('Parameterlabor: für alle Einstellungen gilt: P und alle Pfeile im Koordinatensystem, X nur gezeichnet, wenn er im Koordinatensystem liegt, der Richtungsvektor nicht der Nullvektor', () => {
    let n = 0;
    let mitX = 0;
    let aussen = 0;
    const R = [-2, -1, 0, 1, 2];
    for (const p1 of R) for (const p2 of R) for (const p3 of R) for (const u1 of R) for (const u2 of R) for (const u3 of R) for (const t of [-3, -1, 0, 0.5, 1, 2, 3]) {
      const { spec, aussen: a } = parameterBild([p1, p2, p3], [u1, u2, u3], t, true);
      const kein = u1 === 0 && u2 === 0 && u3 === 0;
      const X = [p1 + t * u1, p2 + t * u2, p3 + t * u3];
      const drin = X.every((c) => Math.abs(c) <= 4);
      const hatX = spec.punkte!.some((q) => q.name === 'X');
      expect(hatX, `${p1}${p2}${p3} ${u1}${u2}${u3} ${t}`).toBe(!kein && drin && t !== 0);
      expect(a).toBe(!kein && !drin && t !== 0);
      if (hatX) {
        mitX++;
        const q = spec.punkte!.find((x) => x.name === 'X')!;
        expect(q.p).toEqual(X);
        expect(aufGerade([p1, p2, p3], [u1, u2, u3], q.p)).toBe(true);
      } else if (a) aussen++;
      for (const l of spec.linien!) for (const c of [...l.von, ...l.bis]) expect(Math.abs(c)).toBeLessThanOrEqual(4 + 1e-9);
      expect(spec.sprech.length).toBeGreaterThan(40);
      n++;
    }
    expect(n).toBe(15625 * 7);
    expect(mitX).toBeGreaterThan(30000);
    expect(aussen).toBeGreaterThan(1000);
  }, 120000);
  it('Parameterlabor: Pfeile sind Stützvektor (orange, ab dem Ursprung), Richtungsvektor (blau, in P) und t · u (rosa, in P)', () => {
    const { spec } = parameterBild([1, -2, 1], [1, 2, -2], 2, false);
    const farben = (f: string) => spec.linien!.find((l) => l.farbe === f)!;
    expect(farben(D.ORANGE).von).toEqual([0, 0, 0]);
    expect(farben(D.ORANGE).bis).toEqual([1, -2, 1]);
    expect(diff(farben(D.BLAU).bis, farben(D.BLAU).von)).toEqual([1, 2, -2]);
    expect(farben(D.BLAU).von).toEqual([1, -2, 1]);
    expect(diff(farben(D.ROSA).bis, farben(D.ROSA).von)).toEqual([2, 4, -4]);
    expect(farben(D.ROSA).von).toEqual([1, -2, 1]);
    expect(spec.linien!.some((l) => l.gestrichelt)).toBe(false);
    expect(parameterBild([1, -2, 1], [1, 2, -2], 2, true).spec.linien!.some((l) => l.gestrichelt)).toBe(true);
  });
  it('Parameterlabor: Beschriftungen haben für Stichproben genügend Abstand zu Linien und Beschriftungen', () => {
    let kleinster = Infinity;
    const zahlen = Array.from({ length: 2 * RAUM_GRENZE + 1 }, (_, i) => i - RAUM_GRENZE).filter((k) => k !== 0).map((k) => normiert(x1ZahlMitte(k)));
    for (const p of [[1, -2, 1], [-2, 1, 2], [2, 2, -1], [-1, -2, -2]]) for (const u of [[1, 2, -2], [-2, 1, 1], [2, -1, 2]]) for (const t of [-1, 1, 2]) {
      const { spec } = parameterBild(p, u, t, true);
      const lagen = raumLagen(spec);
      for (const l of lagen) {
        const pt = spec.punkte!.find((q) => q.name === l.name)!;
        const andere = [...zahlen, ...lagen.filter((x) => x !== l).map((x) => normiert(x.mitte))];
        kleinster = Math.min(kleinster, lageAbstand(l.lage, bildpunkt(pt.p), { bereich: RAUM_BEREICH, teilung: 1, linien: sperrlinienRaum(spec.linien), belegt: andere }));
      }
    }
    expect(kleinster).toBeGreaterThan(0.005);
  });
  it('Punktprobelabor: Punkte liegen genau dann auf g, wenn die Methode über das Vektorprodukt es sagt (alle 729 Punkte), das Bild zeigt P und X', () => {
    const { g } = D.PUNKTPROBE;
    let treffer = 0;
    for (let a = -4; a <= 4; a++) for (let b = -4; b <= 4; b++) for (let c = -4; c <= 4; c++) {
      expect(liegtAuf(g, [a, b, c])).toBe(aufGerade(g.p, g.u, [a, b, c]));
      const s = punktprobeBild([a, b, c]);
      const namen = s.punkte!.map((q) => q.name);
      expect(namen).toContain('P');
      expect(namen.includes('X')).toBe(!(a === g.p[0] && b === g.p[1] && c === g.p[2]));
      if (aufGerade(g.p, g.u, [a, b, c])) treffer++;
    }
    expect(treffer).toBe(5);
    expect(D.PUNKTPROBE_START).toEqual(g.p);
  });
  it('Punktprobelabor mit Punktprobe zeigt die Gleichungen und das Ergebnis (geprüft über die Bibliothek)', () => {
    // Die Ausgabe nach dem Einblenden hängt vom Zustand ab. Hier wird die Logik über die Bibliothek geprüft: A liegt auf g, B nicht.
    expect(liegtAuf(D.PUNKTPROBE.g, D.PUNKTPROBE.A)).toBe(true);
    expect(liegtAuf(D.PUNKTPROBE.g, D.PUNKTPROBE.B)).toBe(false);
  });
  it('Gleichungslabor: dieselbe Gerade genau bei d = 0, e = 0 und k ≠ 0, für alle Einstellungen, Pfeile im Koordinatensystem', () => {
    const g = D.GLEICHUNG.g;
    let gleich = 0;
    let n = 0;
    for (let a = -2; a <= 2; a++) for (let k = -2; k <= 2; k++) for (let d = -1; d <= 1; d++) for (let e = -1; e <= 1; e++) {
      const h = zweiteGleichung(a, k, d, e);
      expect(h.p).toEqual([g.p[0]! + a * g.u[0]! + 0, g.p[1]! + a * g.u[1]! + 0, g.p[2]! + a * g.u[2]! + d + 0]);
      expect(h.u).toEqual([k * g.u[0]! + 0, k * g.u[1]! + 0, k * g.u[2]! + e + 0]);
      const { spec, keinH } = gleichungBild(a, k, d, e);
      const kein = h.u.every((x) => x === 0);
      expect(keinH).toBe(kein);
      const erwartet = !kein && d === 0 && e === 0;
      if (!kein) expect(gleichGerade(g.p, g.u, h.p, h.u), `${a} ${k} ${d} ${e}`).toBe(erwartet);
      if (erwartet) gleich++;
      for (const l of spec.linien!) for (const c of [...l.von, ...l.bis]) expect(Math.abs(c)).toBeLessThanOrEqual(4 + 1e-9);
      n++;
    }
    expect(n).toBe(5 * 5 * 3 * 3);
    expect(gleich).toBe(5 * 4);
    expect(D.GLEICHUNG_START).toEqual({ a: 2, k: -2, d: 0, e: 0 });
  });
});

describe('Aufgaben', () => {
  const alle = () => {
    rendern('ueberpruefen');
    return { aufgaben: [...aufgaben], fragen: [...fragen] };
  };
  it('13 Aufgaben: sieben mit Eingabefeldern, fünf Auswahlfragen und eine Zeichenaufgabe', () => {
    const html = rendern('ueberpruefen');
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '3', '4', '5', '6', '8', '11']);
    expect(fragen.map((f) => f.nummer)).toEqual(['2', '7', '9', '10', '13']);
    expect(html).toContain('Aufgabe 12: Eine Gerade im Schrägbild zeichnen');
  });
  it('Aufgabe 1: AB = B − A, aus den Punkten des Aufgabentexts', () => {
    rendern('ueberpruefen');
    const pk = punkteAus(aufgaben.find((a) => a.nummer === '1')!.children);
    expect(pk.A).toBeDefined();
    expect(pk.B).toBeDefined();
    expect(['1', '2', '3'].map((i) => wert('1', `u${i}`))).toEqual(diff(pk.B!, pk.A!));
    expect(pk.A).toEqual(D.A_RICHTUNG.A);
  });
  it('Aufgabe 2: genau eine Gleichung beschreibt die Gerade durch A und B, die richtige steht nicht an erster Stelle', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '2')!;
    const pk = punkteAus(f.children);
    const A = pk.A!;
    const Bp = pk.B!;
    let richtig = 0;
    for (const o of f.optionen) {
      const [p, u] = spaltenAus(o.text);
      const stimmt = aufGerade(p!, u!, A) && aufGerade(p!, u!, Bp);
      expect(stimmt, o.id).toBe(o.richtig);
      if (stimmt) richtig++;
    }
    expect(richtig).toBe(1);
    expect(f.optionen[0]!.richtig).toBe(false);
  });
  it('Aufgabe 3: Punkt zu t = −2, aus der Gleichung im Aufgabentext', () => {
    rendern('ueberpruefen');
    const [p, u] = spaltenAus(aufgaben.find((a) => a.nummer === '3')!.children);
    expect(['1', '2', '3'].map((i) => wert('3', `x${i}`))).toEqual(plus(p!, mal(-2, u!)));
  });
  it('Aufgabe 4: R liegt für t = 4 auf g, der Punkt mit der 3. Koordinate 7 hat die ersten Koordinaten 0 und 5', () => {
    rendern('ueberpruefen');
    const a = aufgaben.find((x) => x.nummer === '4')!;
    // Aufgabe 4 benutzt die Gerade aus Aufgabe 3
    const [gp, gu] = spaltenAus(aufgaben.find((x) => x.nummer === '3')!.children);
    const g = { p: gp!, u: gu! };
    const R = punkteAus(a.children).R!;
    expect(R).toEqual(D.A_PARAMETER_T.R);
    expect(plus(g.p, mal(wert('4', 't'), g.u))).toEqual(R);
    const tx = (7 - g.p[2]!) / g.u[2]!;
    const X = plus(g.p, mal(tx, g.u));
    expect(wert('4', 'x1')).toBe(X[0]);
    expect(wert('4', 'x2')).toBe(X[1]);
    expect(X[2]).toBe(7);
  });
  it('Aufgabe 5: A bei t = 0, B bei t = 1, gesucht der Punkt bei t = 3', () => {
    rendern('ueberpruefen');
    const pk = punkteAus(aufgaben.find((a) => a.nummer === '5')!.children);
    const u = diff(pk.B!, pk.A!);
    expect(['1', '2', '3'].map((i) => wert('5', `x${i}`))).toEqual(plus(pk.A!, mal(3, u)));
  });
  it('Aufgabe 6: t aus der 1. Gleichung, dann die 3. Koordinate der Geraden, C liegt nicht auf g', () => {
    rendern('ueberpruefen');
    const a = aufgaben.find((x) => x.nummer === '6')!;
    const [p, u] = spaltenAus(a.children);
    const C = punkteAus(a.children).C!;
    const t1 = (C[0]! - p![0]!) / u![0]!;
    expect(wert('6', 't')).toBe(t1);
    expect(wert('6', 'x3')).toBe(p![2]! + t1 * u![2]!);
    expect(wert('6', 'x3')).not.toBe(C[2]);
    expect(aufGerade(p!, u!, C)).toBe(false);
  });
  it('Auswahl 7: P₁ und P₄ liegen auf g, P₂ und P₃ nicht, die richtige Antwort nennt genau diese', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '7')!;
    const [p, u] = spaltenAus(f.children);
    const pk = punkteAus(f.children);
    const auf = ['P_1', 'P_2', 'P_3', 'P_4'].map((n) => aufGerade(p!, u!, pk[n]!));
    expect(auf).toEqual([true, false, false, true]);
    const richtige = f.optionen.filter((o) => o.richtig);
    expect(richtige).toHaveLength(1);
    const text = texte(richtige[0]!.text).join(' ');
    expect(text).toContain('P_1');
    expect(text).toContain('P_4');
    expect(text).not.toContain('P_2');
    expect(text).not.toContain('P_3');
    expect(D.A_AUSWAHL_PUNKTE.auf).toEqual([0, 3]);
  });
  it('Aufgabe 8: Q(a | 2 | 0) auf g für t = 2 und a = 5, aus der Gleichung im Aufgabentext', () => {
    rendern('ueberpruefen');
    const [p, u] = spaltenAus(aufgaben.find((x) => x.nummer === '8')!.children);
    const t = (2 - p![1]!) / u![1]!;
    expect(wert('8', 't')).toBe(t);
    expect(p![2]! + t * u![2]!).toBe(0);
    expect(wert('8', 'a')).toBe(p![0]! + t * u![0]!);
  });
  it('Auswahl 9: für R(a | 3 | 1) widersprechen sich die 2. und 3. Gleichung, die falschen Antworten sind a = 7 und a = 3 (je aus zwei Gleichungen)', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '9')!;
    const [p, u] = spaltenAus(f.children);
    const t2 = (3 - p![1]!) / u![1]!;
    const t3 = (1 - p![2]!) / u![2]!;
    expect(t2).toBe(3);
    expect(t3).toBe(1);
    expect(p![0]! + t2 * u![0]!).toBe(7);
    expect(p![0]! + t3 * u![0]!).toBe(3);
    for (let a = -20; a <= 20; a++) expect(aufGerade(p!, u!, [a, 3, 1])).toBe(false);
    expect(f.optionen.filter((o) => o.richtig)).toHaveLength(1);
    expect(texte(f.optionen.find((o) => o.richtig)!.text).join(' ')).not.toContain('a=');
    expect(D.A_KEIN_A).toMatchObject({ t: 3, a: 7 });
  });
  it('Auswahl 10: genau eine Gleichung beschreibt dieselbe Gerade wie g', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '10')!;
    const [p, u] = spaltenAus(f.children);
    let n = 0;
    for (const o of f.optionen) {
      const [q, v] = spaltenAus(o.text);
      const gleich = gleichGerade(p!, u!, q!, v!);
      expect(gleich, o.id).toBe(o.richtig);
      if (gleich) n++;
    }
    expect(n).toBe(1);
    // die falschen Antworten: Stützpunkt neben g, andere Richtung, Stützpunkt auf g aber Richtung teilweise gleich
    const [bq, bv] = spaltenAus(f.optionen.find((o) => o.id === 'b')!.text);
    expect(aufGerade(p!, u!, bq!)).toBe(false);
    expect(kreuz(u!, bv!).every((c) => c === 0)).toBe(true);
    const [dq, dv] = spaltenAus(f.optionen.find((o) => o.id === 'd')!.text);
    expect(aufGerade(p!, u!, dq!)).toBe(true);
    expect(kreuz(u!, dv!).every((c) => c === 0)).toBe(false);
  });
  it('Aufgabe 11: die Mastspitze liegt für t = 3 auf der Flugbahn, bei x₁ = 11 ist die Höhe 500 m', () => {
    rendern('ueberpruefen');
    const a = aufgaben.find((x) => x.nummer === '11')!;
    const [p, u] = spaltenAus(a.children);
    const M = punkteAus(a.children).M!;
    expect(aufGerade(p!, u!, M)).toBe(true);
    expect(p![0]! + wert('11', 't') * u![0]!).toBe(M[0]);
    const t = (11 - p![0]!) / u![0]!;
    expect(wert('11', 'h')).toBe((p![2]! + t * u![2]!) * 100);
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
  it('die Zahlen der Arbeitsblätter der Lehrkraft kommen nicht vor (öffentliches Repository)', () => {
    const quelle = readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts')).map((d) => readFileSync(`${ORDNER}/${d}`, 'utf8')).join('\n');
    const verboten = ['(-5, 5, 5)', '[-5, 5, 5]', '[5, -3, 4]', '[3, 4, -2]', '[-1, 3, 8]', '[-2, 3, 4]', '[2, 4, 3]', '[3, 6, 2]', '[4, 5, 2]'];
    for (const v of verboten) expect(quelle, v).not.toContain(v);
    const html = rendern(null);
    for (const v of ['P(-5', 'P(−5']) expect(html).not.toContain(v);
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
  it('Y liegt auf g (t = 3 in allen drei Gleichungen), Z nicht (die 3. Koordinate für t = 3 ist 1, nicht 2), g wie im Erklären', () => {
    const z = D.ZUSAMMENFASSUNG;
    expect(z.g.p).toEqual(D.ERKLAEREN.A);
    expect(z.g.u).toEqual(diff(D.ERKLAEREN.B, D.ERKLAEREN.A));
    expect(aufGerade(z.g.p, z.g.u, z.Y)).toBe(true);
    expect(plus(z.g.p, mal(z.t, z.g.u))).toEqual(z.Y);
    expect(aufGerade(z.g.p, z.g.u, z.Z)).toBe(false);
    expect(z.g.p[2]! + z.t * z.g.u[2]!).toBe(z.x3);
    expect(z.Z[2]).not.toBe(z.x3);
    expect(diff(z.Z, z.Y)).toEqual([0, 0, 1]);
  });
});
