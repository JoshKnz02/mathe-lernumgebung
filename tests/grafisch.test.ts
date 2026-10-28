import { describe, expect, it } from 'vitest';
import {
  GRAF_FUNKTIONEN,
  SKIZZE_1,
  SKIZZE_2,
  interpoliere,
  monotonieIntervalle,
  naechsteSpalte,
  nullstellenAbleitung,
  pruefeSkizze,
  rundeAufRaster,
  spalten,
  steigtFaellt,
  type BesondereStelle,
  type Skizze,
} from '../src/lib/grafisch';

/** Unabhängige Ableitung: Richardson-Extrapolation. */
function richardson(f: (x: number) => number, x: number): number {
  const d = (h: number) => (f(x + h) - f(x - h)) / (2 * h);
  return (4 * d(1e-3) - d(2e-3)) / 3;
}
const punkte = (von: number, bis: number, n: number) => Array.from({ length: n + 1 }, (_, i) => von + ((bis - von) * i) / n);
/** Zweite Differenz von f, unabhängig von der von Hand bestimmten zweiten Ableitung. */
const zweite = (f: (x: number) => number) => (x: number) => (f(x + 1e-2) - 2 * f(x) + f(x - 1e-2)) / 1e-4;

/** Nullstellen mit Vorzeichenwechsel durch Raster und Bisektion. */
function nullstellen(g: (x: number) => number, von: number, bis: number, n = 20000): number[] {
  const xs = punkte(von + 1.3e-7, bis - 1.7e-7, n);
  const r: number[] = [];
  for (let i = 1; i < xs.length; i++) {
    const a = xs[i - 1]!;
    const b = xs[i]!;
    if (g(a) * g(b) < 0) {
      let lo = a;
      let hi = b;
      for (let j = 0; j < 80; j++) {
        const m = (lo + hi) / 2;
        if (g(lo) * g(m) <= 0) hi = m;
        else lo = m;
      }
      r.push((lo + hi) / 2);
    }
  }
  return r;
}
/** Stellen, an denen |g| ein Minimum nahe 0 hat, ohne Vorzeichenwechsel (Berührstellen). */
function beruehrstellen(g: (x: number) => number, von: number, bis: number, n = 20000): number[] {
  const xs = punkte(von, bis, n);
  const r: number[] = [];
  for (let i = 1; i < xs.length - 1; i++) {
    const a = Math.abs(g(xs[i - 1]!));
    const b = Math.abs(g(xs[i]!));
    const c = Math.abs(g(xs[i + 1]!));
    if (b <= a && b < c && b < 1e-3 && g(xs[i - 1]!) * g(xs[i + 1]!) > 0) {
      let lo = xs[i - 1]!;
      let hi = xs[i + 1]!;
      for (let j = 0; j < 100; j++) {
        const m1 = lo + (hi - lo) / 3;
        const m2 = hi - (hi - lo) / 3;
        if (Math.abs(g(m1)) < Math.abs(g(m2))) hi = m2;
        else lo = m1;
      }
      r.push((lo + hi) / 2);
    }
  }
  return r;
}

/** Bestimmt die besonderen Stellen von f allein aus Funktionswerten (Richardson und zweite Differenz). */
function unabhaengigeStellen(f: (x: number) => number, von: number, bis: number): BesondereStelle[] {
  const df = (x: number) => richardson(f, x);
  const r: BesondereStelle[] = [];
  for (const x of nullstellen(df, von, bis)) r.push({ typ: df(x - 0.05) > 0 ? 'hoch' : 'tief', x });
  for (const x of beruehrstellen(df, von, bis)) r.push({ typ: df(x - 0.05) > 0 ? 'sattelauf' : 'sattelab', x });
  for (const x of nullstellen(zweite(f), von, bis)) if (!r.some((s) => s.typ !== 'hoch' && s.typ !== 'tief' && Math.abs(s.x - x) < 1e-2)) r.push({ typ: 'wende', x });
  return r.sort((a, b) => a.x - b.x);
}

describe('Funktionen des Spurlabors', () => {
  it('f′ und f″ von Hand stimmen mit der numerischen Ableitung überein, auf dem ganzen Ausschnitt', () => {
    for (const fn of GRAF_FUNKTIONEN) {
      for (const x of punkte(fn.x[0], fn.x[1], 60)) {
        expect(fn.df(x), `${fn.id} f′ bei ${x}`).toBeCloseTo(richardson(fn.f, x), 5);
        expect(fn.ddf(x), `${fn.id} f″ bei ${x}`).toBeCloseTo(richardson(fn.df, x), 5);
      }
    }
  });
  it('die besonderen Stellen sind vollständig und richtig: Hoch-, Tief-, Sattel- und Wendestellen werden unabhängig gefunden', () => {
    for (const fn of GRAF_FUNKTIONEN) {
      const soll = [...fn.stellen].sort((a, b) => a.x - b.x);
      const ist = unabhaengigeStellen(fn.f, fn.x[0], fn.x[1]);
      expect(ist.map((s) => s.typ), fn.id).toEqual(soll.map((s) => s.typ));
      ist.forEach((s, i) => expect(s.x, `${fn.id} Stelle ${i}`).toBeCloseTo(soll[i]!.x, 3));
    }
  });
  it('Sattelstellen sind Stellen mit waagerechter Tangente ohne Vorzeichenwechsel und zugleich Wendestellen', () => {
    for (const fn of GRAF_FUNKTIONEN) {
      for (const s of fn.stellen.filter((t) => t.typ === 'sattelauf' || t.typ === 'sattelab')) {
        expect(fn.df(s.x)).toBeCloseTo(0, 9);
        expect(fn.ddf(s.x)).toBeCloseTo(0, 9);
        expect(fn.df(s.x - 0.1) * fn.df(s.x + 0.1)).toBeGreaterThan(0);
        expect(fn.ddf(s.x - 0.1) * fn.ddf(s.x + 0.1)).toBeLessThan(0);
        expect(Math.sign(fn.df(s.x + 0.1))).toBe(s.typ === 'sattelauf' ? 1 : -1);
      }
    }
  });
  it('Hoch- und Tiefpunkte: Vorzeichenwechsel von f′ von + nach − bzw. von − nach +', () => {
    for (const fn of GRAF_FUNKTIONEN) {
      for (const s of fn.stellen.filter((t) => t.typ === 'hoch' || t.typ === 'tief')) {
        const links = fn.df(s.x - 0.1);
        const rechts = fn.df(s.x + 0.1);
        expect(links, `${fn.id} ${s.x}`).toSatisfy((v: number) => (s.typ === 'hoch' ? v > 0 : v < 0));
        expect(rechts).toSatisfy((v: number) => (s.typ === 'hoch' ? v < 0 : v > 0));
      }
    }
  });
  it('Wendestellen von f sind Extremstellen von f′: f′ hat dort ein lokales Extremum', () => {
    for (const fn of GRAF_FUNKTIONEN) {
      for (const s of fn.stellen.filter((t) => t.typ !== 'hoch' && t.typ !== 'tief')) {
        // Ableitung von f′ wechselt das Vorzeichen: lokales Extremum von f′
        const d = (x: number) => richardson(fn.df, x);
        expect(d(s.x - 0.05) * d(s.x + 0.05), `${fn.id} ${s.x}`).toBeLessThan(0);
      }
    }
  });
  it('Auswahl der Stelle: Start und Schrittweite liegen im Bereich', () => {
    for (const fn of GRAF_FUNKTIONEN) {
      expect(fn.xStart).toBeGreaterThanOrEqual(fn.xMin);
      expect(fn.xStart).toBeLessThanOrEqual(fn.xMax);
      for (const w of [fn.xMax - fn.xMin, fn.xStart - fn.xMin]) expect(Math.abs(w / fn.xSchritt - Math.round(w / fn.xSchritt)), fn.id).toBeLessThan(1e-9);
      expect(fn.x[0]).toBeLessThanOrEqual(fn.xMin);
      expect(fn.x[1]).toBeGreaterThanOrEqual(fn.xMax);
    }
  });
});

describe('Monotonie', () => {
  it('K_f steigt im ganzen Intervall, wenn f′ ≥ 0, und fällt, wenn f′ ≤ 0 (Raster)', () => {
    for (const fn of GRAF_FUNKTIONEN) {
      const iv = monotonieIntervalle(fn.df, fn.stellen, fn.x[0], fn.x[1]);
      expect(iv.length).toBe(nullstellenAbleitung(fn.stellen).length + 1);
      for (const t of iv) {
        for (const x of punkte(t.von, t.bis, 200)) {
          const m = richardson(fn.f, x);
          if (t.steigt) expect(m, `${fn.id} ${t.von} bis ${t.bis} bei ${x}`).toBeGreaterThanOrEqual(-1e-6);
          else expect(m, `${fn.id} ${t.von} bis ${t.bis} bei ${x}`).toBeLessThanOrEqual(1e-6);
        }
        // monoton: Funktionswerte steigen bzw. fallen von links nach rechts
        const xs = punkte(t.von, t.bis, 200).map(fn.f);
        for (let i = 1; i < xs.length; i++) expect(t.steigt ? xs[i]! - xs[i - 1]! : xs[i - 1]! - xs[i]!).toBeGreaterThanOrEqual(-1e-9);
      }
      // benachbarte Intervalle wechseln die Richtung, außer an Sattelstellen
      iv.slice(1).forEach((t, i) => {
        const grenze = t.von;
        const sattel = fn.stellen.some((s) => s.x === grenze && (s.typ === 'sattelauf' || s.typ === 'sattelab'));
        expect(t.steigt === iv[i]!.steigt, `${fn.id} bei ${grenze}`).toBe(sattel);
      });
    }
  });
  it('steigtFaellt', () => {
    expect(steigtFaellt(2)).toBe('steigt');
    expect(steigtFaellt(-0.5)).toBe('faellt');
    expect(steigtFaellt(1e-12)).toBe('waagerecht');
  });
});

describe('Skizzen von K_f′', () => {
  const alle: Skizze[] = [SKIZZE_1, SKIZZE_2];
  it('f′ von Hand stimmt mit der numerischen Ableitung von f überein', () => {
    for (const s of alle) for (const x of punkte(s.xMin, s.xMax, 70)) expect(s.df(x), `${s.id} bei ${x}`).toBeCloseTo(richardson(s.f, x), 5);
  });
  it('die Stellen mit waagerechter Tangente liegen auf dem Spaltenraster und sind vollständig und richtig', () => {
    for (const s of alle) {
      const alleIst = unabhaengigeStellen(s.f, s.xMin, s.xMax);
      const ist = alleIst.filter((t) => t.typ !== 'wende');
      expect(ist.map((t) => t.typ), s.id).toEqual(s.stellen.map((t) => t.typ));
      ist.forEach((t, i) => expect(t.x).toBeCloseTo(s.stellen[i]!.x, 3));
      const wende = alleIst.filter((t) => t.typ === 'wende').map((t) => t.x);
      expect(wende, `${s.id} Wendestellen`).toHaveLength(s.wende.length);
      wende.forEach((x, i) => expect(x).toBeCloseTo(s.wende[i]!, 3));
      for (const t of s.stellen) expect(spalten(s).some((x) => Math.abs(x - t.x) < 1e-9), `${s.id} ${t.x}`).toBe(true);
    }
  });
  it('Spalten, nächste Spalte und Raster', () => {
    expect(spalten(SKIZZE_1)).toHaveLength(14);
    expect(spalten(SKIZZE_1)[0]).toBe(-3);
    expect(spalten(SKIZZE_1).at(-1)).toBe(3.5);
    expect(naechsteSpalte(SKIZZE_1, -3.1)).toBe(0);
    expect(naechsteSpalte(SKIZZE_1, 0.2)).toBe(6);
    expect(naechsteSpalte(SKIZZE_1, 0.3)).toBe(7);
    expect(naechsteSpalte(SKIZZE_1, 9)).toBe(13);
    expect(rundeAufRaster(1.13)).toBe(1.25);
    expect(rundeAufRaster(-0.1)).toBe(-0);
  });
  it('die richtigen Werte (auf Viertel gerundet) werden akzeptiert, falsche nicht, Richtung der Abweichung stimmt', () => {
    for (const s of alle) {
      const xs = spalten(s);
      const richtig = xs.map((x) => rundeAufRaster(s.df(x)));
      const u = pruefeSkizze(s, richtig);
      expect(u.alleGesetzt).toBe(true);
      expect(u.alleRichtig, s.id).toBe(true);
      expect(u.stellenGetroffen.every(Boolean)).toBe(true);
      const hoch = pruefeSkizze(s, richtig.map((v) => v + 2));
      expect(hoch.urteile.every((x) => x === 'zuHoch')).toBe(true);
      const tief = pruefeSkizze(s, richtig.map((v) => v - 2));
      expect(tief.urteile.every((x) => x === 'zuTief')).toBe(true);
      const leer = pruefeSkizze(s, xs.map(() => null));
      expect(leer.alleGesetzt).toBe(false);
      expect(leer.urteile.every((x) => x === 'fehlt')).toBe(true);
      // Alles null: nur die Spalten nahe einer Nullstelle von f′ sind richtig, die Stellen mit waagerechter Tangente stimmen
      const nullen = pruefeSkizze(s, xs.map(() => 0));
      expect(nullen.alleRichtig).toBe(false);
      expect(nullen.stellenGetroffen.every(Boolean)).toBe(true);
    }
  });
  it('typische Fehler werden erkannt: Hochpunkt statt Sattelstelle (Vorzeichenwechsel bei −2 in Skizze 1)', () => {
    const xs = spalten(SKIZZE_1);
    const falsch = xs.map((x) => rundeAufRaster(x < -2 ? SKIZZE_1.df(x) : x <= -1.5 ? -1 : SKIZZE_1.df(x)));
    const u = pruefeSkizze(SKIZZE_1, falsch);
    expect(u.alleRichtig).toBe(false);
    expect(u.urteile[naechsteSpalte(SKIZZE_1, -1.5)]).toBe('zuTief');
  });
  it('die Verbindung durch die gesetzten Punkte läuft durch jeden Punkt und bleibt nahe an K_f′', () => {
    for (const s of alle) {
      const xs = spalten(s);
      const ys = xs.map((x) => s.df(x));
      const g = interpoliere(xs, ys);
      xs.forEach((x, i) => expect(g(x)).toBeCloseTo(ys[i]!, 9));
      let maxAbw = 0;
      for (const x of punkte(s.xMin, s.xMax, 400)) maxAbw = Math.max(maxAbw, Math.abs(g(x) - s.df(x)));
      expect(maxAbw, s.id).toBeLessThan(0.4);
      expect(Number.isNaN(g(s.xMin - 0.1))).toBe(true);
      expect(Number.isNaN(g(s.xMax + 0.1))).toBe(true);
    }
    expect(Number.isNaN(interpoliere([1], [2])(1))).toBe(true);
    expect(interpoliere([0, 1], [0, 2])(0.5)).toBeCloseTo(1, 12);
  });
  it('der Ausschnitt zeigt K_f′ ganz, die Toleranz ist kleiner als die Hälfte des Rasters der Höhen mal 2.5', () => {
    for (const s of alle) {
      for (const x of punkte(s.xMin, s.xMax, 100)) {
        expect(s.df(x)).toBeGreaterThanOrEqual(s.yMin);
        expect(s.df(x)).toBeLessThanOrEqual(s.yMax);
        expect(s.f(x)).toBeGreaterThanOrEqual(s.yFMin);
        expect(s.f(x)).toBeLessThanOrEqual(s.yFMax);
      }
      expect(s.toleranz).toBeLessThanOrEqual(0.75);
    }
  });
});
