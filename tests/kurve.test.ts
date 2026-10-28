import { describe, expect, it } from 'vitest';
import { vorzeichenBereiche } from '../src/components/Paarbild';
import { KURVEN_FUNKTIONEN, findeKurve, kandidaten, kruemmungWort, pruefwerte, vorzeichen } from '../src/lib/kurve';
import { alleNullstellen, beruehrstellen, punkte, richardson, vorzeichenwechsel, zweiteDifferenz } from './numerik';

describe('Funktionen des Kurvenlabors', () => {
  it('es gibt sechs Funktionen mit eindeutigen Namen', () => {
    expect(KURVEN_FUNKTIONEN.map((f) => f.id)).toEqual(['kubisch', 'kubisch-fallend', 'sattel', 'vier', 'fuenf', 'sinus']);
    expect(() => findeKurve('gibt-es-nicht')).toThrow();
  });
  it('f′, f″ und f‴ von Hand stimmen mit der numerischen Ableitung von f überein', () => {
    for (const fn of KURVEN_FUNKTIONEN) {
      for (const x of punkte(fn.xMin, fn.xMax, 40)) {
        expect(fn.df(x), `${fn.id} f′ bei ${x}`).toBeCloseTo(richardson(fn.f, x), 5);
        expect(fn.ddf(x), `${fn.id} f″ bei ${x}`).toBeCloseTo(zweiteDifferenz(fn.f)(x), 3);
        expect(fn.dddf(x), `${fn.id} f‴ bei ${x}`).toBeCloseTo(richardson(fn.ddf, x), 5);
      }
    }
  });
  it('die Nullstellen von f′ und f″ sind genau die angegebenen (mit und ohne Vorzeichenwechsel)', () => {
    for (const fn of KURVEN_FUNKTIONEN) {
      const gefundenDf = alleNullstellen((x) => richardson(fn.f, x), fn.x[0], fn.x[1]);
      expect(gefundenDf, `${fn.id} f′`).toHaveLength(fn.nullenDf.length);
      gefundenDf.forEach((x, i) => expect(x, `${fn.id} f′`).toBeCloseTo(fn.nullenDf[i]!, 3));
      const gefundenDdf = alleNullstellen(zweiteDifferenz(fn.f), fn.x[0], fn.x[1]);
      expect(gefundenDdf, `${fn.id} f″`).toHaveLength(fn.nullenDdf.length);
      gefundenDdf.forEach((x, i) => expect(x, `${fn.id} f″`).toBeCloseTo(fn.nullenDdf[i]!, 2));
    }
  });
  it('Hoch-, Tief-, Wende- und Sattelstellen stimmen mit den Vorzeichenwechseln von f′ und f″ überein', () => {
    for (const fn of KURVEN_FUNKTIONEN) {
      const df = (x: number) => richardson(fn.f, x);
      const ddf = zweiteDifferenz(fn.f);
      const wechselDf = vorzeichenwechsel(df, fn.x[0], fn.x[1]);
      const wechselDdf = vorzeichenwechsel(ddf, fn.x[0], fn.x[1]);
      const extrem = fn.stellen.filter((s) => s.typ === 'hoch' || s.typ === 'tief');
      const wende = fn.stellen.filter((s) => s.typ === 'wende' || s.typ === 'sattelauf' || s.typ === 'sattelab');
      expect(extrem.map((s) => s.x), fn.id).toHaveLength(wechselDf.length);
      for (const s of extrem) {
        const x = wechselDf.find((w) => Math.abs(w - s.x) < 1e-3);
        expect(x, `${fn.id} ${s.typ} bei ${s.x}`).toBeDefined();
        const d = 0.05;
        // Hochpunkt: f′ von plus nach minus, Tiefpunkt: von minus nach plus
        expect(df(s.x - d) * (s.typ === 'hoch' ? 1 : -1), `${fn.id} ${s.typ} links`).toBeGreaterThan(0);
        expect(df(s.x + d) * (s.typ === 'hoch' ? 1 : -1), `${fn.id} ${s.typ} rechts`).toBeLessThan(0);
      }
      expect(wende.map((s) => s.x), fn.id).toHaveLength(wechselDdf.length);
      for (const s of wende) {
        expect(wechselDdf.some((w) => Math.abs(w - s.x) < 1e-2), `${fn.id} ${s.typ} bei ${s.x}`).toBe(true);
        expect(ddf(s.x - 0.05) * ddf(s.x + 0.05), `${fn.id} ${s.typ} bei ${s.x}`).toBeLessThan(0);
        // Sattelstellen: waagerechte Tangente ohne Vorzeichenwechsel von f′, Wendestellen ohne waagerechte Tangente
        const waagerecht = Math.abs(df(s.x)) < 1e-5;
        expect(waagerecht, `${fn.id} ${s.typ} bei ${s.x}`).toBe(s.typ !== 'wende');
        if (s.typ !== 'wende') expect(df(s.x - 0.05) * df(s.x + 0.05), `${fn.id} ${s.typ} bei ${s.x}`).toBeGreaterThan(0);
        if (s.typ === 'sattelauf') expect(df(s.x + 0.05)).toBeGreaterThan(0);
        if (s.typ === 'sattelab') expect(df(s.x + 0.05)).toBeLessThan(0);
      }
    }
  });
  it('Hinreichende Bedingungen: f″ entscheidet bei Extremstellen mit f″ ≠ 0, f‴ bei Wendestellen mit f‴ ≠ 0, die Ausnahmen sind genau die Sonderfälle', () => {
    for (const fn of KURVEN_FUNKTIONEN) {
      for (const s of fn.stellen) {
        if (s.typ === 'hoch') {
          expect(Math.abs(fn.ddf(s.x)) < 1e-9, `${fn.id} H`).toBe(false);
          expect(fn.ddf(s.x), `${fn.id} H`).toBeLessThan(0);
        }
        if (s.typ === 'tief' && fn.id !== 'vier') expect(fn.ddf(s.x), `${fn.id} T`).toBeGreaterThan(0);
        if (s.typ === 'wende' || s.typ === 'sattelauf' || s.typ === 'sattelab') expect(Math.abs(fn.ddf(s.x)), `${fn.id} ${s.typ}`).toBeLessThan(1e-9);
        if (s.typ === 'wende' || s.typ === 'sattelab') expect(Math.abs(fn.dddf(s.x)) > 1e-9, `${fn.id} ${s.typ} bei ${s.x}`).toBe(true);
      }
    }
    // Sonderfälle: x⁴/12 hat im Tiefpunkt f″ = 0 und f‴ = 0 (kein Wendepunkt), x⁵/20 hat eine Sattelstelle mit f‴ = 0
    const vier = findeKurve('vier');
    expect(vier.ddf(0)).toBeCloseTo(0, 12);
    expect(vier.dddf(0)).toBeCloseTo(0, 12);
    expect(vier.f(0.5)).toBeGreaterThan(vier.f(0));
    expect(vier.f(-0.5)).toBeGreaterThan(vier.f(0));
    expect(vier.ddf(-0.5)).toBeGreaterThan(0);
    expect(vier.ddf(0.5)).toBeGreaterThan(0);
    const fuenf = findeKurve('fuenf');
    expect(fuenf.dddf(0)).toBeCloseTo(0, 12);
    expect(fuenf.ddf(-0.5)).toBeLessThan(0);
    expect(fuenf.ddf(0.5)).toBeGreaterThan(0);
  });
  it('kandidaten sammelt alle Nullstellen von f′ und f″ einmal und sortiert', () => {
    expect(kandidaten(findeKurve('sattel'))).toEqual([0, 2, 3]);
    expect(kandidaten(findeKurve('kubisch'))).toEqual([0, 1, 2]);
    expect(kandidaten(findeKurve('vier'))).toEqual([0]);
    const s = kandidaten(findeKurve('sinus'));
    expect(s).toHaveLength(9);
    for (let i = 1; i < s.length; i++) expect(s[i]!).toBeGreaterThan(s[i - 1]!);
  });
  it('der Abstand für links und rechts liegt unter dem halben Abstand benachbarter Nullstellen und im Raster der Regler', () => {
    for (const fn of KURVEN_FUNKTIONEN) {
      const k = kandidaten(fn);
      for (let i = 1; i < k.length; i++) expect(fn.abstand, fn.id).toBeLessThan((k[i]! - k[i - 1]!) / 2 + 1e-9);
      // alle Kandidaten liegen auf dem Raster des Reglers, sonst ließe sich die Stelle nicht einstellen
      for (const x of k) {
        const n = (x - fn.xStart) / fn.xSchritt;
        expect(Math.abs(n - Math.round(n)), `${fn.id} bei ${x}`).toBeLessThan(1e-9);
        expect(x, fn.id).toBeGreaterThanOrEqual(fn.xMin - 1e-9);
        expect(x, fn.id).toBeLessThanOrEqual(fn.xMax + 1e-9);
      }
      expect(fn.xStart, fn.id).toBeGreaterThanOrEqual(fn.xMin);
    }
  });
  it('alle Werte sind endlich und liegen in den Ausschnitten, soweit sie der Ausschnitt zeigen soll', () => {
    for (const fn of KURVEN_FUNKTIONEN) {
      for (const x of punkte(fn.xMin, fn.xMax, 40)) {
        for (const [g, y] of [[fn.f, fn.yF], [fn.df, fn.yDf], [fn.ddf, fn.yDdf]] as const) {
          expect(Number.isFinite(g(x)), fn.id).toBe(true);
          expect(g(x), `${fn.id} bei ${x}`).toBeGreaterThanOrEqual(y[0] - 1e-9);
          expect(g(x), `${fn.id} bei ${x}`).toBeLessThanOrEqual(y[1] + 1e-9);
        }
      }
      for (const s of fn.stellen) expect(s.x, fn.id).toBeGreaterThanOrEqual(fn.x[0]);
    }
  });
});

describe('Vorzeichen und Prüfwerte', () => {
  it('vorzeichen und kruemmungWort', () => {
    expect(vorzeichen(2)).toBe('plus');
    expect(vorzeichen(-0.1)).toBe('minus');
    expect(vorzeichen(6e-17)).toBe('null');
    expect(kruemmungWort(3)).toBe('links');
    expect(kruemmungWort(-3)).toBe('rechts');
    expect(kruemmungWort(0)).toBe('null');
  });
  it('Prüfwerte an den Stellen der Funktion „sattel“: Vorzeichen links und rechts, Werte bei x₀', () => {
    const fn = findeKurve('sattel');
    // x = 0: f′ minus, 0, minus (kein Vorzeichenwechsel), f″ plus, 0, minus
    const p0 = pruefwerte(fn, 0);
    expect(p0.links).toEqual({ df: 'minus', ddf: 'plus' });
    expect(p0.rechts).toEqual({ df: 'minus', ddf: 'minus' });
    expect(p0.bei.df).toBeCloseTo(0, 12);
    expect(p0.bei.ddf).toBeCloseTo(0, 12);
    expect(p0.bei.dddf).toBe(-2);
    // x = 3: Tiefpunkt, f′ von minus nach plus, f″ = 3
    const p3 = pruefwerte(fn, 3);
    expect(p3.links.df).toBe('minus');
    expect(p3.rechts.df).toBe('plus');
    expect(p3.bei.ddf).toBe(3);
    // x = 2: Wendestelle, f″ von minus nach plus, f‴ = 2, f′ = −4/3
    const p2 = pruefwerte(fn, 2);
    expect(p2.links.ddf).toBe('minus');
    expect(p2.rechts.ddf).toBe('plus');
    expect(p2.bei.dddf).toBe(2);
    expect(p2.bei.df).toBeCloseTo(-4 / 3, 12);
  });
  it('Prüfwerte beim Sinus an allen Kandidaten: die Vorzeichen stimmen mit Funktionswerten im Abstand überein', () => {
    const fn = findeKurve('sinus');
    for (const x of kandidaten(fn)) {
      const p = pruefwerte(fn, x);
      expect(p.links.df).toBe(vorzeichen(Math.cos(x - fn.abstand)));
      expect(p.rechts.ddf).toBe(vorzeichen(-Math.sin(x + fn.abstand)));
      expect(Math.abs(p.bei.df) < 1e-9 || Math.abs(p.bei.ddf) < 1e-9, `${x}`).toBe(true);
    }
  });
});

describe('Bereiche mit gleichem Vorzeichen', () => {
  it('Bereiche liegen zwischen den Nullstellen, Teile mit gleichem Vorzeichen werden zusammengefasst', () => {
    const fn = findeKurve('sattel');
    // f′ = x²(x − 3)/3 ist links von 3 negativ (auch bei der Berührstelle 0) und rechts davon positiv
    const mono = vorzeichenBereiche(fn.df, fn.nullenDf, fn.x[0], fn.x[1]);
    expect(mono).toEqual([{ von: -1.5, bis: 3, positiv: false }, { von: 3, bis: 4, positiv: true }]);
    // f″ = x(x − 2): plus, minus, plus
    const kr = vorzeichenBereiche(fn.ddf, fn.nullenDdf, fn.x[0], fn.x[1]);
    expect(kr.map((b) => b.positiv)).toEqual([true, false, true]);
    expect(kr.map((b) => [b.von, b.bis])).toEqual([[-1.5, 0], [0, 2], [2, 4]]);
  });
  it('die Bereiche stimmen mit dem Vorzeichen der numerischen Ableitung überein, für alle Funktionen', () => {
    for (const fn of KURVEN_FUNKTIONEN) {
      for (const b of vorzeichenBereiche(fn.df, fn.nullenDf, fn.x[0], fn.x[1])) {
        for (const x of punkte(b.von + 0.05, b.bis - 0.05, 20)) {
          const m = richardson(fn.f, x);
          if (Math.abs(m) > 1e-6) expect(m > 0, `${fn.id} f′ bei ${x}`).toBe(b.positiv);
        }
      }
      for (const b of vorzeichenBereiche(fn.ddf, fn.nullenDdf, fn.x[0], fn.x[1])) {
        for (const x of punkte(b.von + 0.05, b.bis - 0.05, 20)) {
          const k = zweiteDifferenz(fn.f)(x);
          if (Math.abs(k) > 1e-6) expect(k > 0, `${fn.id} f″ bei ${x}`).toBe(b.positiv);
        }
      }
    }
  });
  it('Berührstellen werden gefunden: f′ von „sattel“ bei 0, f″ von „vier“ bei 0', () => {
    expect(beruehrstellen((x) => richardson(findeKurve('sattel').f, x), -1.5, 4)[0]!).toBeCloseTo(0, 2);
    expect(beruehrstellen(zweiteDifferenz(findeKurve('vier').f), -2.5, 2.5)[0]!).toBeCloseTo(0, 2);
  });
});
