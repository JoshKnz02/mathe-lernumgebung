import { describe, expect, it } from 'vitest';
import {
  GROSSE_STELLEN,
  SYMMETRIE_FUNKTIONEN,
  VERHALTEN_FUNKTIONEN,
  asymptoteTex,
  quadrantenText,
  scharAnzahl,
  scharDdf,
  scharDddf,
  scharDf,
  scharF,
  scharStellen,
  tabellenZahlTex,
  verhaltenTex,
  type VerhaltenFunktion,
} from '../src/lib/diskussion';
import { alleNullstellen, punkte, richardson, vorzeichenwechsel, zweiteDifferenz } from './numerik';

/** Wert von f bei s·X für s = +1 (rechts) oder s = −1 (links). */
const bei = (fn: VerhaltenFunktion, s: 1 | -1, X: number) => fn.f(s * X);

describe('Verhalten im Unendlichen: von Hand bestimmte Aussagen gegen große Werte', () => {
  it('jede Aussage stimmt an den Stellen 20 und 40 (Werte werden größer, kleiner oder nähern sich der Zahl)', () => {
    for (const fn of VERHALTEN_FUNKTIONEN) {
      for (const [s, v] of [[1, fn.rechts], [-1, fn.links]] as const) {
        const w20 = bei(fn, s, 20);
        const w40 = bei(fn, s, 40);
        const name = `${fn.id} ${s === 1 ? 'rechts' : 'links'}`;
        if (v.ende === 'plusUnendlich') {
          expect(w20, name).toBeGreaterThan(10);
          expect(w40, name).toBeGreaterThan(w20);
        } else if (v.ende === 'minusUnendlich') {
          expect(w20, name).toBeLessThan(-10);
          expect(w40, name).toBeLessThan(w20);
        } else if (v.ende === 'wert') {
          expect(Math.abs(w40 - v.wert!), name).toBeLessThan(1e-6);
          expect(Math.abs(w40 - v.wert!), name).toBeLessThanOrEqual(Math.abs(w20 - v.wert!));
          expect(Math.abs(w20 - v.wert!), name).toBeLessThan(1e-3);
        } else {
          // kein Grenzwert: die Werte pendeln auch weit draußen noch über eine Spanne von mindestens 3
          const werte = punkte(100, 200, 2000).map((x) => fn.f(s * x));
          expect(Math.max(...werte) - Math.min(...werte), name).toBeGreaterThan(3);
        }
      }
    }
  });
  it('Asymptoten: der Abstand zur Geraden wird beliebig klein (bei 40 unter 1e-6, kleiner als bei 20)', () => {
    let zahl = 0;
    for (const fn of VERHALTEN_FUNKTIONEN) {
      for (const a of fn.asymptoten) {
        zahl++;
        const s = a.seite === 'rechts' ? 1 : -1;
        const d = (X: number) => Math.abs(fn.f(s * X) - (a.m * s * X + a.n));
        expect(d(40), `${fn.id}`).toBeLessThan(1e-6);
        expect(d(40), `${fn.id}`).toBeLessThanOrEqual(d(20));
      }
    }
    expect(zahl).toBe(4);
  });
  it('eine waagerechte Asymptote gehört genau zu einem Grenzwert auf dieser Seite, eine schiefe zu einem Ende gegen ±∞', () => {
    for (const fn of VERHALTEN_FUNKTIONEN) {
      for (const seite of ['rechts', 'links'] as const) {
        const v = seite === 'rechts' ? fn.rechts : fn.links;
        const waagerecht = fn.asymptoten.filter((a) => a.seite === seite && a.m === 0);
        const schief = fn.asymptoten.filter((a) => a.seite === seite && a.m !== 0);
        expect(waagerecht.length, `${fn.id} ${seite}`).toBe(v.ende === 'wert' ? 1 : 0);
        if (waagerecht[0]) expect(waagerecht[0].n, fn.id).toBe(v.wert);
        if (schief.length) expect(['plusUnendlich', 'minusUnendlich'], `${fn.id} ${seite}`).toContain(v.ende);
      }
    }
  });
  it('x + 2·sin x: die Gerade y = x ist keine Asymptote, der Abstand bleibt auch weit draußen bei 2', () => {
    const fn = VERHALTEN_FUNKTIONEN.find((f) => f.id === 'sinus-plus-x')!;
    expect(fn.asymptoten).toEqual([]);
    const abstaende = punkte(1000, 1100, 4000).map((x) => Math.abs(fn.f(x) - x));
    expect(Math.max(...abstaende)).toBeGreaterThan(1.99);
  });
  it('ganzrationale Funktionen: Grad und Leitkoeffizient bestimmen den Verlauf (gerade/ungerade, positiv/negativ)', () => {
    const fall = (id: string) => {
      const fn = VERHALTEN_FUNKTIONEN.find((f) => f.id === id)!;
      return [Math.sign(fn.f(100)), Math.sign(fn.f(-100))];
    };
    expect(fall('grad4-plus')).toEqual([1, 1]);
    expect(fall('grad3-plus')).toEqual([1, -1]);
    expect(fall('grad4-minus')).toEqual([-1, -1]);
    expect(fall('grad5-minus')).toEqual([-1, 1]);
  });
  it('Quadranten in Worten, Verhalten und Asymptoten in TeX', () => {
    expect(quadrantenText({ ende: 'plusUnendlich' }, { ende: 'plusUnendlich' })).toBe('vom II. in den I. Quadranten');
    expect(quadrantenText({ ende: 'minusUnendlich' }, { ende: 'plusUnendlich' })).toBe('vom III. in den I. Quadranten');
    expect(quadrantenText({ ende: 'minusUnendlich' }, { ende: 'minusUnendlich' })).toBe('vom III. in den IV. Quadranten');
    expect(quadrantenText({ ende: 'plusUnendlich' }, { ende: 'minusUnendlich' })).toBe('vom II. in den IV. Quadranten');
    expect(quadrantenText({ ende: 'wert', wert: 3 }, { ende: 'minusUnendlich' })).toBeNull();
    expect(verhaltenTex({ ende: 'plusUnendlich' }, 'rechts')).toBe(String.raw`x\to\infty:\ f(x)\to\infty`);
    expect(verhaltenTex({ ende: 'wert', wert: 3 }, 'links')).toBe(String.raw`x\to-\infty:\ f(x)\to 3`);
    expect(verhaltenTex({ ende: 'wert', wert: 0.5 }, 'rechts')).toBe(String.raw`x\to\infty:\ f(x)\to 0{,}5`);
    expect(asymptoteTex({ m: 0, n: 3, seite: 'links' })).toBe('y=3');
    expect(asymptoteTex({ m: 2, n: -1, seite: 'rechts' })).toBe('y=2x-1');
    expect(asymptoteTex({ m: 1, n: -2, seite: 'rechts' })).toBe('y=x-2');
    expect(asymptoteTex({ m: 1, n: 0, seite: 'rechts' })).toBe('y=x');
    expect(asymptoteTex({ m: 0.5, n: 1.5, seite: 'rechts' })).toBe('y=0{,}5x+1{,}5');
  });
  it('Zahlen der Wertetabelle: zwei Nachkommastellen, große und kleine Werte als Zehnerpotenz, Überlauf als Text', () => {
    expect(tabellenZahlTex(0)).toBe('0');
    expect(tabellenZahlTex(4800)).toBe('4800');
    expect(tabellenZahlTex(98.987)).toBe('98{,}99');
    expect(tabellenZahlTex(-1000)).toBe('-1000');
    expect(tabellenZahlTex(1e10)).toBe(String.raw`1\cdot10^{10}`);
    expect(tabellenZahlTex(-999000000)).toBe(String.raw`-9{,}99\cdot10^{8}`);
    expect(tabellenZahlTex(3.7e-40)).toBe(String.raw`3{,}7\cdot10^{-40}`);
    expect(tabellenZahlTex(0.004)).toBe(String.raw`4\cdot10^{-3}`);
    expect(tabellenZahlTex(999999)).toBe(String.raw`1\cdot10^{6}`);
    expect(tabellenZahlTex(Infinity)).toBe(String.raw`\text{zu groß}`);
    expect(tabellenZahlTex(-Infinity)).toBe(String.raw`\text{zu groß}`);
  });
  it('die Tabellenwerte des Labors sind alle endlich oder werden als Text gezeigt, nie als NaN', () => {
    for (const fn of VERHALTEN_FUNKTIONEN) for (const x of GROSSE_STELLEN) expect(tabellenZahlTex(fn.f(x)), `${fn.id} ${x}`).not.toContain('NaN');
  });
  it('Fenster: die Funktion ist in jedem Ausschnitt sichtbar, und Teilungen sind sinnvoll', () => {
    for (const fn of VERHALTEN_FUNKTIONEN) {
      expect(fn.x[0]).toBeLessThan(fn.x[1]);
      expect(fn.y[0]).toBeLessThan(fn.y[1]);
      const sichtbar = punkte(fn.x[0], fn.x[1], 400).filter((x) => fn.f(x) > fn.y[0] && fn.f(x) < fn.y[1]).length;
      expect(sichtbar, fn.id).toBeGreaterThan(40);
      expect((fn.x[1] - fn.x[0]) / fn.teilung, fn.id).toBeLessThan(30);
      expect((fn.y[1] - fn.y[0]) / fn.yTeilung, fn.id).toBeLessThan(20);
    }
  });
});

describe('Symmetrie: von Hand bestimmte Eigenschaft gegen ein Raster', () => {
  it('achsensymmetrisch: f(−x) = f(x), punktsymmetrisch: f(−x) = −f(x), sonst gibt es ein Gegenbeispiel für beide', () => {
    for (const fn of SYMMETRIE_FUNKTIONEN) {
      const xs = punkte(0.05, fn.xMax, 200);
      const gleich = xs.every((x) => Math.abs(fn.f(-x) - fn.f(x)) < 1e-9 * (1 + Math.abs(fn.f(x))));
      const gegen = xs.every((x) => Math.abs(fn.f(-x) + fn.f(x)) < 1e-9 * (1 + Math.abs(fn.f(x))));
      expect(gleich, `${fn.id} achse`).toBe(fn.symmetrie === 'achse');
      expect(gegen, `${fn.id} punkt`).toBe(fn.symmetrie === 'punkt');
      if (fn.symmetrie === 'keine') {
        expect(xs.some((x) => Math.abs(fn.f(-x) - fn.f(x)) > 1e-6), `${fn.id} Gegenbeispiel achse`).toBe(true);
        expect(xs.some((x) => Math.abs(fn.f(-x) + fn.f(x)) > 1e-6), `${fn.id} Gegenbeispiel punkt`).toBe(true);
      }
    }
  });
  it('die Auswahl enthält alle drei Arten, die Ausschnitte sind symmetrisch zur y-Achse, die Reglerwerte liegen im Ausschnitt', () => {
    expect(new Set(SYMMETRIE_FUNKTIONEN.map((f) => f.symmetrie))).toEqual(new Set(['achse', 'punkt', 'keine']));
    expect(SYMMETRIE_FUNKTIONEN).toHaveLength(9);
    for (const fn of SYMMETRIE_FUNKTIONEN) {
      expect(fn.x[0], fn.id).toBeCloseTo(-fn.x[1], 9);
      expect(fn.xMax, fn.id).toBeLessThanOrEqual(fn.x[1]);
      expect(fn.schritt, fn.id).toBeGreaterThan(0);
    }
  });
  it('x² + x ist symmetrisch zur Geraden x = −1/2, aber nicht zur y-Achse und nicht zum Ursprung (Hinweis im Labor)', () => {
    const f = SYMMETRIE_FUNKTIONEN.find((s) => s.id === 'quadrat-plus-x')!.f;
    for (const x of punkte(0, 3, 30)) expect(f(-0.5 + x)).toBeCloseTo(f(-0.5 - x), 9);
  });
});

describe('Funktionenschar f_a(x) = x⁴ − 2a·x²', () => {
  const WERTE = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3];
  it('Ableitungen von Hand gegen Richardson und zweite Differenz', () => {
    for (const a of WERTE) {
      for (const x of punkte(-3, 3, 60)) {
        expect(scharDf(a)(x), `f′ a=${a} x=${x}`).toBeCloseTo(richardson(scharF(a), x), 5);
        expect(scharDdf(a)(x), `f″ a=${a} x=${x}`).toBeCloseTo(zweiteDifferenz(scharF(a))(x), 3);
        expect(scharDddf()(x), `f‴ a=${a} x=${x}`).toBeCloseTo(richardson(scharDdf(a), x), 5);
      }
    }
  });
  it('Extrem- und Wendepunkte gegen Vorzeichenwechsel von f′ und f″, Typ gegen die Richtung des Wechsels', () => {
    for (const a of WERTE) {
      const f = scharF(a);
      const stellen = scharStellen(a);
      const extremX = vorzeichenwechsel((x) => richardson(f, x), -5, 5);
      const hochTief = stellen.filter((s) => s.typ === 'H' || s.typ === 'T');
      expect(hochTief.map((s) => s.x).sort((p, q) => p - q), `Extremstellen a=${a}`).toHaveLength(extremX.length);
      hochTief.map((s) => s.x).sort((p, q) => p - q).forEach((x, i) => expect(x, `a=${a}`).toBeCloseTo(extremX[i]!, 3));
      for (const s of hochTief) {
        const links = richardson(f, s.x - 0.05);
        const rechts = richardson(f, s.x + 0.05);
        expect(Math.sign(links), `${s.typ} a=${a} x=${s.x}`).toBe(s.typ === 'H' ? 1 : -1);
        expect(Math.sign(rechts), `${s.typ} a=${a} x=${s.x}`).toBe(s.typ === 'H' ? -1 : 1);
      }
      const wendeX = vorzeichenwechsel(zweiteDifferenz(f), -5, 5);
      const wende = stellen.filter((s) => s.typ === 'W').map((s) => s.x).sort((p, q) => p - q);
      expect(wende, `Wendestellen a=${a}`).toHaveLength(wendeX.length);
      wende.forEach((x, i) => expect(x, `a=${a}`).toBeCloseTo(wendeX[i]!, 2));
    }
  });
  it('Nullstellen (mit und ohne Vorzeichenwechsel) gegen ein unabhängiges Verfahren, y-Koordinaten gegen f', () => {
    for (const a of WERTE) {
      const f = scharF(a);
      const stellen = scharStellen(a);
      for (const s of stellen) expect(s.y, `a=${a} ${s.typ}`).toBeCloseTo(f(s.x), 9);
      // Der Ursprung wird nur als Extrempunkt geführt, er ist aber immer eine Nullstelle
      const erwartet = [...stellen.filter((s) => s.typ === 'N' || (s.typ !== 'W' && Math.abs(s.y) < 1e-9)).map((s) => s.x)].sort((p, q) => p - q);
      const gefunden = alleNullstellen(f, -5, 5);
      expect(gefunden, `Nullstellen a=${a}`).toHaveLength(erwartet.length);
      erwartet.forEach((x, i) => expect(gefunden[i]!, `a=${a}`).toBeCloseTo(x, 2));
    }
  });
  it('Anzahl der Nullstellen, Extrempunkte und Wendepunkte passt zu den Stellen, die Stellen liegen symmetrisch', () => {
    for (const a of WERTE) {
      const stellen = scharStellen(a);
      const n = scharAnzahl(a);
      const nullen = new Set(stellen.filter((s) => Math.abs(s.y) < 1e-9 && s.typ !== 'W').map((s) => s.x));
      expect(nullen.size, `a=${a}`).toBe(n.nullstellen);
      expect(stellen.filter((s) => s.typ === 'H' || s.typ === 'T').length, `a=${a}`).toBe(n.extrempunkte);
      expect(stellen.filter((s) => s.typ === 'W').length, `a=${a}`).toBe(n.wendepunkte);
      for (const s of stellen) expect(stellen.some((q) => q.typ === s.typ && Math.abs(q.x + s.x) < 1e-9 && Math.abs(q.y - s.y) < 1e-9), `a=${a} ${s.typ} ${s.x}`).toBe(true);
    }
  });
  it('der Fall a = 0: f″(0) = 0 ohne Vorzeichenwechsel, also Tiefpunkt und kein Wendepunkt; a < 0: nur der Tiefpunkt im Ursprung', () => {
    expect(scharStellen(0)).toEqual([{ typ: 'T', x: 0, y: 0 }]);
    expect(scharStellen(-1.5)).toEqual([{ typ: 'T', x: 0, y: 0 }]);
    expect(scharDdf(0)(0)).toBe(0);
    expect(scharDdf(0)(0.1)).toBeGreaterThan(0);
    expect(scharDdf(0)(-0.1)).toBeGreaterThan(0);
  });
  it('für a > 0: Hochpunkt im Ursprung, Tiefpunkte (±√a | −a²), Wendepunkte (±√(a/3) | −5a²/9)', () => {
    for (const a of [0.5, 1, 2, 3]) {
      const s = scharStellen(a);
      expect(s.find((p) => p.typ === 'H')).toEqual({ typ: 'H', x: 0, y: 0 });
      expect(s.filter((p) => p.typ === 'T').map((p) => p.y)).toEqual([-a * a, -a * a]);
      expect(s.filter((p) => p.typ === 'W').map((p) => p.y)[0]).toBeCloseTo((-5 * a * a) / 9, 12);
      expect(s.filter((p) => p.typ === 'N').map((p) => p.x)[1]).toBeCloseTo(Math.sqrt(2 * a), 12);
    }
  });
});
