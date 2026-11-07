import { describe, expect, it } from 'vitest';
import { aufEinerGeraden, ebeneAusPunkten, ebeneImWuerfel, ebenenParameter, ebenenpunkt, gebilde, gleicheEbene, istEbene, liegtInEbene, punktprobe, schneideWuerfel, type Ebene } from '../src/lib/ebene';
import type { Punkt3 } from '../src/lib/schraegbild';

/* Unabhängige Methoden: Normalenvektor von Hand ausgeschrieben, Würfelkanten einzeln geschnitten. */
const kreuz = (a: number[], b: number[]): number[] => [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!].map((x) => x + 0);
const skal = (a: number[], b: number[]) => a[0]! * b[0]! + a[1]! * b[1]! + a[2]! * b[2]!;
const diff = (b: number[], a: number[]) => b.map((x, i) => x - a[i]!);
const imE = (e: Ebene, x: number[]) => skal(kreuz(e.u, e.v), diff(x, e.p)) === 0;
const nullv = (v: number[]) => v.every((x) => x === 0);
const runde = (p: number[]) => p.map((x) => Math.round(x * 1e6) / 1e6 + 0).join(',');

const E1: Ebene = { p: [-1, -1, 1], u: [2, 1, -1], v: [1, 1, 1] };

describe('Ebene in Parameterform', () => {
  it('ebenenpunkt: p + r · u + s · v', () => {
    expect(ebenenpunkt(E1, 0, 0)).toEqual([-1, -1, 1]);
    expect(ebenenpunkt(E1, 2, -1)).toEqual([2, 0, -2]);
    expect(ebenenpunkt(E1, 0.5, 0.5)).toEqual([0.5, 0, 1]);
    expect(Object.is(ebenenpunkt({ p: [0, 0, 0], u: [1, 0, 0], v: [0, 1, 0] }, -0, 0)[0], -0)).toBe(false);
  });
  it('Ebene aus drei Punkten: A, B, C liegen in ihr mit den Parametern (0|0), (1|0), (0|1)', () => {
    const A = [1, -1, 1];
    const B = [0, 1, 2];
    const C = [2, -2, -1];
    const e = ebeneAusPunkten(A, B, C);
    expect(e).toEqual({ p: A, u: [-1, 2, 1], v: [1, -1, -2] });
    expect(ebenenParameter(e, A)).toEqual({ r: 0, s: 0 });
    expect(ebenenParameter(e, B)).toEqual({ r: 1, s: 0 });
    expect(ebenenParameter(e, C)).toEqual({ r: 0, s: 1 });
    expect(aufEinerGeraden(A, B, C)).toBe(false);
    expect(aufEinerGeraden([0, 0, 0], [1, 2, 3], [3, 6, 9])).toBe(true);
    expect(aufEinerGeraden([0, 0, 0], [1, 2, 3], [0, 0, 0])).toBe(true);
  });
  it('gebilde: Ebene, Gerade (kollinear, ein Nullvektor) oder Punkt', () => {
    expect(gebilde(E1)).toBe('ebene');
    expect(gebilde({ p: [1, 0, 0], u: [1, -1, 1], v: [-2, 2, -2] })).toBe('gerade');
    expect(gebilde({ p: [1, 0, 0], u: [0, 0, 0], v: [1, 1, 1] })).toBe('gerade');
    expect(gebilde({ p: [1, 0, 0], u: [0, 0, 0], v: [0, 0, 0] })).toBe('punkt');
    expect(istEbene({ p: [0, 0, 0], u: [1, 2, 3], v: [2, 4, 6] })).toBe(false);
    expect(istEbene({ p: [0, 0, 0], u: [1, 2, 3], v: [2, 4, 7] })).toBe(true);
  });
  it('Punkte mit ganzzahligen Parametern werden mit denselben Parametern wiedergefunden, auch bei Ebenen ohne Nullen', () => {
    const planes: Ebene[] = [E1, { p: [1, -1, 1], u: [-1, 2, 1], v: [1, -1, -2] }, { p: [0, 0, 0], u: [1, 0, 0], v: [0, 1, 0] }, { p: [2, -1, 3], u: [1, 2, -1], v: [-2, 0, 1] }, { p: [1, 2, 0], u: [2, -1, 1], v: [0, 1, 2] }];
    for (const e of planes) for (let r = -3; r <= 3; r++) for (let s = -3; s <= 3; s++) {
      const x = ebenenpunkt(e, r, s);
      expect(ebenenParameter(e, x), `${JSON.stringify(e)} ${r} ${s}`).toEqual({ r: r + 0, s: s + 0 });
      expect(imE(e, x)).toBe(true);
    }
  });
  it('liegtInEbene stimmt für alle 729 Punkte im Würfel mit der Prüfung über den Normalenvektor überein', () => {
    for (const e of [E1, { p: [1, 2, 0], u: [2, -1, 1], v: [0, 1, 2] }, { p: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] }]) {
      let n = 0;
      for (let a = -4; a <= 4; a++) for (let b = -4; b <= 4; b++) for (let c = -4; c <= 4; c++) {
        const x = [a, b, c];
        expect(liegtInEbene(e, x), `${JSON.stringify(e)} ${x}`).toBe(imE(e, x));
        const pp = punktprobe(e, x)!;
        expect(pp.liegtIn).toBe(imE(e, x));
        // Die gelösten Werte r und s erfüllen die beiden gewählten Gleichungen, die dritte entscheidet
        const q = ebenenpunkt(e, pp.r, pp.s);
        for (const i of pp.paar) expect(Math.abs(q[i]! - x[i]!), `${x} ${i}`).toBeLessThan(1e-9);
        expect(Math.abs(q[pp.rest]! - pp.ergibt)).toBeLessThan(1e-9);
        expect(pp.verlangt).toBe(x[pp.rest]);
        expect(new Set([...pp.paar, pp.rest]).size).toBe(3);
        if (imE(e, x)) n++;
      }
      expect(n).toBeGreaterThan(5);
    }
  });
  it('Punktprobe der Beispiele: Q in E (r = 2, s = −1), R nicht (dritte Gleichung ergibt −2, verlangt −1)', () => {
    const q = punktprobe(E1, [2, 0, -2])!;
    expect(q).toMatchObject({ paar: [0, 1], rest: 2, r: 2, s: -1, ergibt: -2, verlangt: -2, liegtIn: true });
    const r = punktprobe(E1, [2, 0, -1])!;
    expect(r).toMatchObject({ paar: [0, 1], rest: 2, r: 2, s: -1, ergibt: -2, verlangt: -1, liegtIn: false });
    expect(punktprobe({ p: [0, 0, 0], u: [1, 2, 3], v: [2, 4, 6] }, [1, 2, 3])).toBeNull();
    expect(ebenenParameter({ p: [0, 0, 0], u: [1, 2, 3], v: [2, 4, 6] }, [1, 2, 3])).toBeNull();
  });
  it('dieselbe Ebene: Stützpunkt in E und beide Spannvektoren in E (unabhängige Prüfung der drei Punkte p′, p′ + u′, p′ + v′)', () => {
    const unabhaengig = (e: Ebene, f: Ebene) => istEbene(f) && [f.p, f.p.map((x, i) => x + f.u[i]!), f.p.map((x, i) => x + f.v[i]!)].every((x) => imE(e, x));
    const e: Ebene = { p: [1, -1, 1], u: [1, 1, -1], v: [-1, -2, -1] };
    let gleich = 0;
    let n = 0;
    for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) for (let k1 = -2; k1 <= 2; k1++) for (let k2 = -2; k2 <= 2; k2++) for (let k3 = -2; k3 <= 2; k3++) for (let k4 = -2; k4 <= 2; k4++) for (const d of [-1, 0, 1]) {
      const q = ebenenpunkt(e, a, b);
      const f: Ebene = { p: [q[0]!, q[1]!, q[2]! + d], u: ebenenpunkt({ p: [0, 0, 0], u: e.u, v: e.v }, k1, k2), v: ebenenpunkt({ p: [0, 0, 0], u: e.u, v: e.v }, k3, k4) };
      const erwartet = unabhaengig(e, f);
      expect(gleicheEbene(e, f), `${a} ${b} ${k1} ${k2} ${k3} ${k4} ${d}`).toBe(erwartet);
      // Die Ebene ist genau dann dieselbe, wenn d = 0 und k₁k₄ − k₂k₃ ≠ 0
      expect(erwartet).toBe(d === 0 && k1 * k4 - k2 * k3 !== 0);
      if (erwartet) gleich++;
      n++;
    }
    expect(n).toBe(5 * 5 * 625 * 3);
    expect(gleich).toBeGreaterThan(1000);
    expect(gleicheEbene({ p: [0, 0, 0], u: [1, 2, 3], v: [2, 4, 6] }, e)).toBe(false);
  });
});

describe('Ausschnitt im Koordinatensystem', () => {
  /** Alle Schnittpunkte der Ebene mit den zwölf Würfelkanten, einzeln gerechnet. */
  const kantenPunkte = (e: Ebene): string[] => {
    const n = kreuz(e.u, e.v);
    const d = skal(n, e.p);
    const r = new Set<string>();
    for (let a = 0; a < 3; a++) for (const x of [-4, 4]) for (const y of [-4, 4]) {
      if (n[a] === 0) continue;
      const andere = [0, 1, 2].filter((i) => i !== a);
      const wert = (d - n[andere[0]!]! * x - n[andere[1]!]! * y) / n[a]!;
      if (Math.abs(wert) > 4 + 1e-9) continue;
      const p = [0, 0, 0];
      p[andere[0]!] = x;
      p[andere[1]!] = y;
      p[a] = wert;
      r.add(runde(p));
    }
    return [...r].sort();
  };
  const planes: Ebene[] = [
    E1,
    { p: [1, -1, 1], u: [-1, 2, 1], v: [1, -1, -2] },
    { p: [-1, -2, -1], u: [1, 1, -1], v: [1, -1, 2] },
    { p: [0, 0, 2], u: [1, 0, 0], v: [0, 1, 0] },
    { p: [1, 2, 0], u: [2, -1, 1], v: [0, 1, 2] },
    { p: [0, 0, 0], u: [1, 1, 0], v: [0, 1, 1] },
    { p: [3, 3, 3], u: [1, -1, 0], v: [0, 1, -1] },
  ];
  it('die Ecken des Vielecks sind genau die Schnittpunkte der Ebene mit den Würfelkanten', () => {
    for (const e of planes) {
      const ecken = ebeneImWuerfel(e);
      expect(ecken.length, JSON.stringify(e)).toBeGreaterThanOrEqual(3);
      expect(ecken.map((p) => runde(p)).sort(), JSON.stringify(e)).toEqual(kantenPunkte(e));
      for (const p of ecken) {
        expect(imE(e, p.map((x) => Math.round(x * 1e6) / 1e6)) || Math.abs(skal(kreuz(e.u, e.v), diff(p, e.p))) < 1e-6).toBe(true);
        for (const x of p) expect(Math.abs(x)).toBeLessThanOrEqual(4 + 1e-9);
      }
    }
  });
  it('zwei Gleichungen derselben Ebene liefern dasselbe Vieleck', () => {
    const a = ebeneImWuerfel(E1).map((p) => runde(p)).sort();
    const f: Ebene = { p: [2, 0, -2], u: [3, 2, 0], v: [1, 2, 4] };
    expect(gleicheEbene(E1, f)).toBe(true);
    expect(ebeneImWuerfel(f).map((p) => runde(p)).sort()).toEqual(a);
  });
  it('Ebene außerhalb des Würfels und Gleichungen ohne Ebene: kein Vieleck', () => {
    expect(ebeneImWuerfel({ p: [0, 0, 6], u: [1, 0, 0], v: [0, 1, 0] })).toEqual([]);
    expect(ebeneImWuerfel({ p: [0, 0, 0], u: [1, 2, 3], v: [2, 4, 6] })).toEqual([]);
    expect(schneideWuerfel([[5, 5, 5], [6, 5, 5], [6, 6, 5]] as Punkt3[])).toEqual([]);
  });
  it('die Ebene z = 4 ergibt das Quadrat mit den Ecken (±4 | ±4 | 4)', () => {
    const ecken = ebeneImWuerfel({ p: [0, 0, 4], u: [1, 0, 0], v: [0, 1, 0] }).map((p) => runde(p)).sort();
    expect(ecken).toEqual(['-4,-4,4', '-4,4,4', '4,-4,4', '4,4,4'].sort());
  });
});

describe('Ebene aus Punkt und Gerade, aus zwei Geraden', () => {
  /* Unabhängig: Eine Ebene enthält die Gerade und den Punkt, wenn p, p + u und q in ihr liegen. */
  it('Punkt und Gerade: die Ebene enthält g und den Punkt, bei einem Punkt auf g gibt es keine eindeutige Ebene', async () => {
    const { ebeneAusPunktUndGerade } = await import('../src/lib/ebene');
    const g = { p: [-2, -3, 2], u: [1, 2, -1] };
    let n = 0;
    let auf = 0;
    for (let a = -4; a <= 4; a++) for (let b = -4; b <= 4; b++) for (let c = -4; c <= 4; c++) {
      const q = [a, b, c];
      const e = ebeneAusPunktUndGerade(g, q);
      const aufG = nullv(kreuz(diff(q, g.p), g.u));
      expect(e === null, `${q}`).toBe(aufG);
      if (e) {
        for (const x of [g.p, g.p.map((v, i) => v + g.u[i]!), g.p.map((v, i) => v + 3 * g.u[i]!), q]) expect(imE(e, x)).toBe(true);
        expect(istEbene(e)).toBe(true);
        n++;
      } else auf++;
    }
    expect(auf).toBe(4);
    expect(n).toBe(729 - 4);
  });
  it('zwei Geraden: schneidend und parallel (verschieden) liefern die Ebene mit beiden Geraden, identisch und windschief keine', async () => {
    const { ebeneAusGeraden } = await import('../src/lib/ebene');
    const punkteVon = (g: { p: number[]; u: number[] }) => [-2, 0, 1, 3].map((t) => g.p.map((x, i) => x + t * g.u[i]!));
    const faelle: [{ p: number[]; u: number[] }, { p: number[]; u: number[] }, string][] = [
      [{ p: [-1, 0, 2], u: [1, 1, -1] }, { p: [3, 0, -4], u: [-1, 1, 2] }, 'schneidend'],
      [{ p: [1, -2, 2], u: [2, 1, -1] }, { p: [0, 3, 1], u: [-4, -2, 2] }, 'parallel'],
      [{ p: [0, 0, 1], u: [1, 1, 0] }, { p: [1, 0, 0], u: [0, 1, -1] }, 'windschief'],
      [{ p: [0, 0, 0], u: [1, 2, 3] }, { p: [2, 4, 6], u: [-1, -2, -3] }, 'identisch'],
    ];
    for (const [g, h, art] of faelle) {
      const r = ebeneAusGeraden(g, h);
      expect(r.art).toBe(art);
      if (art === 'schneidend' || art === 'parallel') {
        expect(istEbene(r.ebene!)).toBe(true);
        for (const x of [...punkteVon(g), ...punkteVon(h)]) expect(imE(r.ebene!, x), `${art} ${x}`).toBe(true);
      } else expect(r.ebene).toBeNull();
    }
    // windschief: keine Ebene durch g enthält h (jede Ebene durch g und einen Punkt von h verfehlt einen anderen Punkt von h)
    const [g, h] = faelle[2]!;
    const e = ebeneAusPunktUndGerade2(g, h.p);
    expect(imE(e, h.p.map((x, i) => x + h.u[i]!))).toBe(false);
  });
});
function ebeneAusPunktUndGerade2(g: { p: number[]; u: number[] }, q: number[]): Ebene {
  return { p: g.p, u: g.u, v: diff(q, g.p) };
}

describe('Normalenvektor, Normalenform und Koordinatenform', () => {
  it('Normalenvektor und Koordinatenform: n steht senkrecht auf u und v, d = n · p, alle Punkte der Parameterform erfüllen die Gleichung', async () => {
    const L = await import('../src/lib/ebene');
    for (const e of [E1, { p: [-1, -1, 1], u: [-1, 1, 0], v: [0, 1, 2] }, { p: [1, 0, 2], u: [2, 1, 0], v: [0, 1, -1] }, { p: [2, 0, 1], u: [1, -1, 2], v: [0, 1, 3] }]) {
      const k = L.koordinatenform(e)!;
      expect(k.n).toEqual(kreuz(e.u, e.v));
      expect(skal(k.n, e.u)).toBe(0);
      expect(skal(k.n, e.v)).toBe(0);
      expect(k.d).toBe(skal(k.n, e.p));
      for (let r = -3; r <= 3; r++) for (let s = -3; s <= 3; s++) expect(L.liegtInKoordinatenform(k, L.ebenenpunkt(e, r, s))).toBe(true);
      // Punkte neben der Ebene erfüllen sie nicht
      expect(L.liegtInKoordinatenform(k, e.p.map((x, i) => x + k.n[i]!))).toBe(false);
    }
    expect(L.koordinatenform({ p: [0, 0, 0], u: [1, 2, 3], v: [2, 4, 6] })).toBeNull();
    expect(L.koordinatenformAusPunkt([3, -1, 2], [2, 1, -2])).toEqual({ n: [2, 1, -2], d: 1 });
  });
  it('Koordinatenform und Parameterform stimmen für alle 729 Punkte im Würfel überein', async () => {
    const L = await import('../src/lib/ebene');
    const e: Ebene = { p: [-1, -1, 1], u: [-1, 1, 0], v: [0, 1, 2] };
    const k = L.koordinatenform(e)!;
    expect(k).toEqual({ n: [2, 2, -1], d: -5 });
    for (let a = -4; a <= 4; a++) for (let b = -4; b <= 4; b++) for (let c = -4; c <= 4; c++) expect(L.liegtInKoordinatenform(k, [a, b, c]), `${a} ${b} ${c}`).toBe(L.liegtInEbene(e, [a, b, c]));
  });
  it('Parameterform aus der Normalenform und aus der Koordinatenform: Punkte liegen in der Ebene, die Spannvektoren sind senkrecht zu n und keine Vielfachen', async () => {
    const L = await import('../src/lib/ebene');
    for (const n of [[2, 2, -1], [1, 2, -1], [3, 0, 1], [0, 0, 2], [-1, 2, 2], [0, 3, -2]]) {
      const p = [1, -1, 2];
      const e = L.ebeneAusNormalenform(p, n)!;
      expect(L.istEbene(e)).toBe(true);
      expect(skal(n, e.u)).toBe(0);
      expect(skal(n, e.v)).toBe(0);
      const k = L.koordinatenformAusPunkt(p, n);
      for (let r = -2; r <= 2; r++) for (let s = -2; s <= 2; s++) expect(L.liegtInKoordinatenform(k, L.ebenenpunkt(e, r, s))).toBe(true);
      const f = L.parameterformAusKoordinatenform(k);
      expect(L.istEbene(f)).toBe(true);
      for (let r = -2; r <= 2; r++) for (let s = -2; s <= 2; s++) expect(Math.abs(skal(n, L.ebenenpunkt(f, r, s)) - k.d)).toBeLessThan(1e-7);
    }
    expect(L.parameterformAusKoordinatenform({ n: [1, 2, -1], d: 6 })).toEqual({ p: [6, 0, 0], u: [-2, 1, 0], v: [1, 0, 1] });
    expect(L.parameterformAusKoordinatenform({ n: [1, -2, 2], d: 4 })).toEqual({ p: [4, 0, 0], u: [2, 1, 0], v: [-2, 0, 1] });
    expect(L.ebeneAusNormalenform(p0, [0, 0, 0])).toBeNull();
  });
});
const p0 = [0, 0, 0];
