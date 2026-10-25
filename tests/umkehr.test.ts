import { describe, expect, it, vi } from 'vitest';

// Die Rasterprüfungen über alle Paare brauchen bei voller Auslastung mehr als die üblichen 5 Sekunden.
vi.setConfig({ testTimeout: 30000 });
import { UMKEHR_FUNKTIONEN, findeUmkehr, imWertebereich, inDefinitionsbereichU, parameterBereich, schnittstellenWaagerechte, spiegle, wertInv, wertU } from '../src/lib/umkehr';

const PI = Math.PI;
const gitter = (von: number, bis: number, schritt: number) => Array.from({ length: Math.round((bis - von) / schritt) + 1 }, (_, i) => von + i * schritt);

describe('Katalog: von Hand bestimmte Angaben gegen die Rechnung', () => {
  it('Wertebereich: alle Werte liegen darin, die Grenzen werden erreicht oder unbegrenzt angenähert', () => {
    for (const u of UMKEHR_FUNKTIONEN) {
      const weit = [1e-12, 1e-6, 100, 1e3, 1e6, 1e12].flatMap((x) => [x, -x]);
      const xs = [...gitter(-60, 60, 0.01), ...weit].filter((x) => inDefinitionsbereichU(u, x));
      const ys = xs.map((x) => u.f(x)).filter((y) => Number.isFinite(y));
      expect(ys.length, u.id).toBeGreaterThan(100);
      const min = Math.min(...ys);
      const max = Math.max(...ys);
      for (const y of ys) expect(imWertebereich(u, y) || Math.abs(y - u.wMin) < 1e-9 || Math.abs(y - u.wMax) < 1e-9, `${u.id}: ${y}`).toBe(true);
      if (Number.isFinite(u.wMin)) expect(min - u.wMin, `${u.id} Minimum`).toBeLessThan(1e-3);
      else expect(min, `${u.id} Minimum`).toBeLessThan(-25);
      if (Number.isFinite(u.wMax)) expect(u.wMax - max, `${u.id} Maximum`).toBeLessThan(1e-3);
      else expect(max, `${u.id} Maximum`).toBeGreaterThan(25);
    }
  });
  it('Umkehrbarkeit: genau die Funktionen, die streng monoton sind, haben keine zwei Stellen mit gleichem Funktionswert', () => {
    for (const u of UMKEHR_FUNKTIONEN) {
      const xs = gitter(-12, 12, 0.001).filter((x) => inDefinitionsbereichU(u, x));
      const ys = xs.map((x) => u.f(x));
      const steigend = ys.every((y, i) => i === 0 || y > ys[i - 1]!);
      const fallend = ys.every((y, i) => i === 0 || y < ys[i - 1]!);
      expect(steigend || fallend, u.id).toBe(u.umkehrbar);
      if (!u.umkehrbar) {
        const g = u.gegenbeispiel!;
        expect(g.x1).not.toBe(g.x2);
        expect(u.f(g.x1)).toBeCloseTo(u.f(g.x2), 12);
      }
    }
  });
  it('Umkehrfunktion: f⁻¹(f(x)) = x auf D, f(f⁻¹(y)) = y auf W, und f⁻¹ ist genau auf W definiert', () => {
    for (const u of UMKEHR_FUNKTIONEN.filter((v) => v.umkehrbar)) {
      for (const x of gitter(-8, 8, 0.05).filter((t) => inDefinitionsbereichU(u, t))) {
        const y = u.f(x);
        if (Number.isFinite(y) && Math.abs(y) < 1e6) expect(wertInv(u, y), `${u.id} bei x = ${x}`).toBeCloseTo(x, 8);
      }
      for (const y of gitter(-9, 9, 0.05)) {
        const x = wertInv(u, y);
        expect(Number.isNaN(x), `${u.id} bei y = ${y}`).toBe(!imWertebereich(u, y));
        if (!Number.isNaN(x)) {
          expect(inDefinitionsbereichU(u, x), `${u.id}: f⁻¹(${y}) liegt in D`).toBe(true);
          expect(u.f(x), `${u.id}`).toBeCloseTo(y, 8);
        }
      }
    }
  });
  it('Definitions- und Wertebereich werden vertauscht: Der Wertebereich von f⁻¹ ist der Definitionsbereich von f', () => {
    for (const u of UMKEHR_FUNKTIONEN.filter((v) => v.umkehrbar)) {
      const werte = gitter(-9, 9, 0.01).map((y) => wertInv(u, y)).filter((x) => !Number.isNaN(x));
      for (const x of werte) expect(inDefinitionsbereichU(u, x), u.id).toBe(true);
      if (Number.isFinite(u.dMin)) expect(Math.min(...werte) - u.dMin, `${u.id} untere Grenze`).toBeLessThan(0.05);
      if (Number.isFinite(u.dMax)) expect(u.dMax - Math.max(...werte), `${u.id} obere Grenze`).toBeLessThan(0.05);
    }
  });
  it('bekannte Paare: √x zu x² (x ≥ 0), ln zu e^x, Arkussinus zu sin auf [−π/2; π/2]', () => {
    expect(wertInv(findeUmkehr('quad-rechts'), 9)).toBeCloseTo(3, 12);
    expect(wertInv(findeUmkehr('quad-links'), 9)).toBeCloseTo(-3, 12);
    expect(wertInv(findeUmkehr('exp'), Math.E)).toBeCloseTo(1, 12);
    expect(wertInv(findeUmkehr('exp'), 0)).toBeNaN();
    expect(wertInv(findeUmkehr('exp-minus'), 0)).toBeCloseTo(0, 12);
    expect(wertInv(findeUmkehr('exp-minus'), -1)).toBeNaN();
    expect(wertInv(findeUmkehr('sin-eing'), 0.5)).toBeCloseTo(PI / 6, 12);
    expect(wertInv(findeUmkehr('sin-eing'), 1.01)).toBeNaN();
    expect(wertInv(findeUmkehr('wurzel'), 16)).toBeCloseTo(256, 9);
    expect(wertInv(findeUmkehr('ln'), 0)).toBeCloseTo(1, 12);
    expect(wertInv(findeUmkehr('par-rechts'), 8)).toBeCloseTo(5, 12);
    expect(wertInv(findeUmkehr('par-links'), 8)).toBeCloseTo(-1, 12);
    expect(wertInv(findeUmkehr('quad'), 4)).toBeNaN();
  });
  it('Spiegelung an y = x vertauscht die Koordinaten, und die Spiegelkurve (f(t), t) liegt auf dem Schaubild von f⁻¹', () => {
    expect(spiegle({ x: 2, y: 5 })).toEqual({ x: 5, y: 2 });
    for (const u of UMKEHR_FUNKTIONEN.filter((v) => v.umkehrbar)) {
      const [a, b] = parameterBereich(u);
      for (const t of gitter(a, b, (b - a) / 40).filter((x) => inDefinitionsbereichU(u, x))) {
        const p = spiegle({ x: t, y: u.f(t) });
        if (Math.abs(p.x) < 1e6) expect(wertInv(u, p.x), `${u.id} bei t = ${t}`).toBeCloseTo(p.y, 7);
      }
    }
  });
  it('Parameterbereich: für ln beginnt die Kurve knapp rechts von 0', () => {
    const [a] = parameterBereich(findeUmkehr('ln'));
    expect(a).toBeGreaterThan(0);
    expect(a).toBeLessThan(1e-3);
    expect(parameterBereich(findeUmkehr('quad'))).toEqual([-9, 9]);
  });
});

describe('Waagerechte Gerade y = c schneidet K_f', () => {
  it('Anzahl der Schnittstellen, von Hand', () => {
    const anzahl = (id: string, c: number) => schnittstellenWaagerechte(findeUmkehr(id), c, -6, 6).length;
    expect(anzahl('quad', 4)).toBe(2);
    expect(anzahl('quad', 0)).toBe(1);
    expect(anzahl('quad', -1)).toBe(0);
    expect(anzahl('quad-rechts', 4)).toBe(1);
    expect(anzahl('quad-links', 4)).toBe(1);
    expect(anzahl('sin', 0.5)).toBe(4);
    expect(anzahl('sin-eing', 0.5)).toBe(1);
    expect(anzahl('par-rechts', 3)).toBe(1);
    expect(anzahl('par-links', 3)).toBe(1);
    expect(anzahl('exp', 0)).toBe(0);
    expect(anzahl('exp', 2)).toBe(1);
    expect(anzahl('kub', 3)).toBe(1);
  });
  it('umkehrbare Funktionen werden von keiner waagerechten Geraden mehr als einmal geschnitten, nicht umkehrbare von einer mindestens zweimal', () => {
    for (const u of UMKEHR_FUNKTIONEN) {
      const maximum = Math.max(...gitter(-5.5, 5.5, 0.5).map((c) => schnittstellenWaagerechte(u, c, -6, 6).length));
      expect(maximum <= 1, u.id).toBe(u.umkehrbar);
    }
  });
  it('die Schnittstellen sind wirklich Lösungen von f(x) = c', () => {
    for (const x of schnittstellenWaagerechte(findeUmkehr('sin'), 0.5, -6, 6)) expect(Math.sin(x)).toBeCloseTo(0.5, 8);
  });
});
