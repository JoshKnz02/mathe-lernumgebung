import { describe, expect, it } from 'vitest';
import { PARABEL, UFER, BECKEN, TANK, V1, V2, AKKU, ZUG, WIND, TONNE, ERSATZ, PARZELLE } from '../content/modules/integral-hinfuehrung/daten';
import { bestand, bilanz, ersatzrate, flaechenPunkte, formen, minMax, obersumme, rateBei, ratePunkte, sprungstellen, streifen, trapezsumme, untersumme, type Stueck } from '../src/lib/flaeche';

/** Unabhängige Hilfen: Mittelpunktsregel mit sehr feiner Unterteilung, Gaußsche Flächenformel, Richardson-Ableitung. */
function mittelpunkt(f: (x: number) => number, a: number, b: number, n = 400000): number {
  let s = 0;
  for (let i = 0; i < n; i++) s += f(a + ((i + 0.5) * (b - a)) / n);
  return (s * (b - a)) / n;
}
function gauss(p: [number, number][]): number {
  let s = 0;
  for (let i = 0; i < p.length; i++) {
    const [x1, y1] = p[i]!;
    const [x2, y2] = p[(i + 1) % p.length]!;
    s += x1 * y2 - x2 * y1;
  }
  return Math.abs(s) / 2;
}
const ableitung = (f: (x: number) => number, x: number) => {
  const d = (h: number) => (f(x + h) - f(x - h)) / (2 * h);
  return (4 * d(1e-3) - d(2e-3)) / 3;
};

const ALLE: [string, Stueck[]][] = [['Becken', BECKEN.stuecke], ['Speicher', TANK.stuecke], ['V1', V1.stuecke], ['V2', V2.stuecke], ['Akku', AKKU.stuecke], ['Zug', ZUG.stuecke], ['Wind', WIND.stuecke], ['Tonne', TONNE.stuecke], ['Ersatz', ERSATZ.stuecke]];

describe('Abschnitte der Raten', () => {
  it('schließen lückenlos aneinander an und beginnen bei 0', () => {
    for (const [name, s] of ALLE) {
      expect(s[0]!.t0, name).toBe(0);
      s.slice(1).forEach((p, i) => expect(p.t0, name).toBe(s[i]!.t1));
    }
  });
});

describe('bilanz gegen unabhängige Integration', () => {
  it('Gesamtbilanz jeder Rate stimmt mit der Mittelpunktsregel überein, auch mit negativen Flächen', () => {
    for (const [name, s] of ALLE) {
      const ende = s[s.length - 1]!.t1;
      expect(bilanz(s, 0, ende), name).toBeCloseTo(mittelpunkt((t) => rateBei(s, t), 0, ende), 3);
    }
  });
  it('Teilbilanzen von a bis b für viele Grenzen', () => {
    for (const [name, s] of ALLE) {
      const ende = s[s.length - 1]!.t1;
      for (const a of [0, ende / 5, ende / 3]) {
        for (const b of [ende / 2, (2 * ende) / 3, ende]) expect(bilanz(s, a, b), `${name} ${a} ${b}`).toBeCloseTo(mittelpunkt((t) => rateBei(s, t), a, b, 200000), 3);
      }
    }
  });
  it('von Hand bestimmte Werte', () => {
    expect(bilanz(BECKEN.stuecke, 0, 24)).toBe(360);
    expect(bilanz(BECKEN.stuecke, 0, 6)).toBe(72);
    expect(bilanz(BECKEN.stuecke, 0, 14)).toBe(264);
    expect(bilanz(BECKEN.stuecke, 0, 20)).toBe(336);
    expect(V1.flaechen.reduce((a, b) => a + b, 0)).toBe(V1.summe);
    expect(bilanz(V1.stuecke, 0, 12)).toBe(240);
    expect(bilanz(V2.stuecke, 0, 6)).toBe(3);
    expect(bilanz(TANK.stuecke, 0, 4)).toBe(21);
    expect(bilanz(TANK.stuecke, 0, 10)).toBe(-6);
  });
});

describe('Bestand und Ableitung', () => {
  it('der Bestand hat überall (außer an Sprungstellen) die Rate als Ableitung', () => {
    for (const sz of [BECKEN, TANK]) {
      const spr = sprungstellen(sz.stuecke);
      const ende = sz.stuecke[sz.stuecke.length - 1]!.t1;
      for (let t = 0.25; t < ende; t += 0.25) {
        if (spr.some((x) => Math.abs(x - t) < 0.01) || sz.stuecke.some((p) => Math.abs(p.t0 - t) < 0.01)) continue;
        expect(ableitung((x) => bestand(sz.stuecke, sz.b0Start, x), t), `${sz.id} ${t}`).toBeCloseTo(rateBei(sz.stuecke, t), 4);
      }
    }
  });
  it('der Bestand ist stetig und der Anfangsbestand verschiebt nur', () => {
    for (const sz of [BECKEN, TANK]) {
      for (const p of sz.stuecke) {
        expect(bestand(sz.stuecke, 5, p.t0 - 1e-9)).toBeCloseTo(bestand(sz.stuecke, 5, p.t0 + 1e-9), 5);
      }
      expect(bestand(sz.stuecke, 30, 3) - bestand(sz.stuecke, 10, 3)).toBeCloseTo(20, 12);
    }
  });
  it('Speicher: größter Bestand bei t = 4, dort Rate 0, Vorzeichenwechsel von plus nach minus', () => {
    let tMax = 0;
    let max = -Infinity;
    for (let i = 0; i <= 10000; i++) {
      const t = i / 1000;
      const b = bestand(TANK.stuecke, TANK.b0Start, t);
      if (b > max) { max = b; tMax = t; }
    }
    expect(tMax).toBeCloseTo(4, 3);
    expect(max).toBeCloseTo(61, 6);
    expect(rateBei(TANK.stuecke, 4)).toBeCloseTo(0, 12);
    expect(rateBei(TANK.stuecke, 3.9)).toBeGreaterThan(0);
    expect(rateBei(TANK.stuecke, 4.1)).toBeLessThan(0);
    expect(bestand(TANK.stuecke, TANK.b0Start, 10)).toBeCloseTo(34, 12);
  });
  it('Sprungstellen und Eckpunkte', () => {
    expect(sprungstellen(BECKEN.stuecke)).toEqual([14]);
    expect(sprungstellen(TANK.stuecke)).toEqual([]);
    expect(sprungstellen(V2.stuecke)).toEqual([2, 5]);
    const p = ratePunkte(BECKEN.stuecke);
    expect(p.filter((q) => Number.isNaN(q[0]))).toHaveLength(1);
  });
});

describe('Ersatzrate', () => {
  it('Gesamtänderung geteilt durch Dauer, Rechteck hat denselben Flächeninhalt', () => {
    expect(ersatzrate(BECKEN.stuecke)).toBe(15);
    expect(ersatzrate(ERSATZ.stuecke)).toBeCloseTo(13.75, 12);
    expect(ersatzrate(ERSATZ.stuecke) * 8).toBeCloseTo(mittelpunkt((t) => rateBei(ERSATZ.stuecke, t), 0, 8), 3);
    // Der Mittelwert der Raten der Abschnitte ist wegen der verschiedenen Dauer nicht die Ersatzrate
    expect(ERSATZ.falsch).toBeCloseTo((10 + 20 + 5) / 3, 12);
    expect(ERSATZ.falsch).not.toBeCloseTo(ersatzrate(ERSATZ.stuecke), 1);
  });
});

describe('Formen oberhalb und unterhalb der Zeitachse', () => {
  it('Flächen der Formen stimmen mit der Bilanz überein, auch bei Vorzeichenwechsel im Abschnitt', () => {
    for (const [name, s] of ALLE) {
      for (const p of s) {
        for (const [lo, hi] of [[p.t0, p.t1], [p.t0, (p.t0 + p.t1) / 2], [p.t0 + (p.t1 - p.t0) / 3, p.t1]] as const) {
          const f = formen(p, lo, hi);
          const pos = f.pos ? gauss(f.pos) : 0;
          const neg = f.neg ? gauss(f.neg) : 0;
          expect(pos - neg, `${name} ${lo} ${hi}`).toBeCloseTo(bilanz([p], lo, hi), 10);
          const gesamtBetrag = mittelpunkt((t) => Math.abs(rateBei([p], t)), lo, hi, 100000);
          expect(pos + neg, `${name} ${lo} ${hi}`).toBeCloseTo(gesamtBetrag, 3);
        }
      }
    }
  });
  it('Eckpunkte des Flächenvielecks bis t liegen auf dem Schaubild', () => {
    const rand = flaechenPunkte(TANK.stuecke, 0, 4.5);
    for (const [x, y] of rand.slice(1, -1)) expect(y).toBeCloseTo(rateBei(TANK.stuecke, x), 12);
  });
});

describe('Streifen, Untersumme und Obersumme', () => {
  it('kleinster und größter Wert je Streifen gegen die Rechnung von Hand', () => {
    // f(x) = 12 + 2x − 0,04x²: Scheitel bei 25 mit 37, nach unten geöffnet
    const handMinMax = (a: number, b: number): [number, number] => {
      const f = UFER.f;
      return [Math.min(f(a), f(b)), a <= 25 && 25 <= b ? 37 : Math.max(f(a), f(b))];
    };
    for (const n of UFER.stufen) {
      for (const s of streifen(UFER.f, UFER.a, UFER.b, n)) {
        const [lo, hi] = handMinMax(s.x0, s.x1);
        expect(s.unten).toBeCloseTo(lo, 6);
        expect(s.oben).toBeCloseTo(hi, 6);
      }
    }
    // f(x) = x²/2 + 1 steigt: kleinster Wert links, größter rechts
    for (const n of PARABEL.stufen) {
      for (const s of streifen(PARABEL.f, 0, 4, n)) {
        expect(s.unten).toBeCloseTo(PARABEL.f(s.x0), 12);
        expect(s.oben).toBeCloseTo(PARABEL.f(s.x1), 12);
      }
    }
  });
  it('Untersumme ≤ Fläche ≤ Obersumme, Fläche von Hand und unabhängig integriert', () => {
    expect(mittelpunkt(UFER.f, 0, 50)).toBeCloseTo(4300 / 3, 4);
    expect(UFER.exakt).toBeCloseTo(4300 / 3, 12);
    expect(mittelpunkt(PARABEL.f, 0, 4)).toBeCloseTo(44 / 3, 6);
    for (const [fn, a, b, stufen, exakt] of [[UFER.f, 0, 50, UFER.stufen, 4300 / 3], [PARABEL.f, 0, 4, PARABEL.stufen, 44 / 3]] as const) {
      let letzterUnterschied = Infinity;
      for (const n of stufen) {
        const z = streifen(fn, a, b, n);
        const u = untersumme(z);
        const o = obersumme(z);
        expect(u).toBeLessThan(exakt);
        expect(o).toBeGreaterThan(exakt);
        expect(o - u).toBeLessThan(letzterUnterschied);
        letzterUnterschied = o - u;
      }
    }
  });
  it('bei steigender Funktion: Unterschied gleich Streifenbreite mal Höhenunterschied, er halbiert sich bei doppelter Anzahl', () => {
    const unterschiede = PARABEL.stufen.map((n) => obersumme(streifen(PARABEL.f, 0, 4, n)) - untersumme(streifen(PARABEL.f, 0, 4, n)));
    PARABEL.stufen.forEach((n, i) => expect(unterschiede[i]!).toBeCloseTo((4 / n) * (PARABEL.f(4) - PARABEL.f(0)), 10));
    expect(unterschiede).toEqual([32, 16, 8, 4, 2, 1]);
  });
  it('Werte der Beobachtungen: Grundstück bei 5, 10, 25 Streifen und die Entscheidung bei 55.000 Euro', () => {
    const werte = (n: number) => [untersumme(streifen(UFER.f, 0, 50, n)), obersumme(streifen(UFER.f, 0, 50, n))];
    expect(werte(5)).toEqual([1160, 1650]);
    expect(werte(10)).toEqual([1300, 1550]);
    const [u25, o25] = werte(25);
    expect(u25).toBeCloseTo(1382.08, 6);
    expect(o25).toBeCloseTo(1482, 6);
    const grenze = UFER.betrag / UFER.preis;
    expect(grenze).toBe(1375);
    // Bei 5 und 10 Streifen ist keine Entscheidung möglich, bei 25 schon
    for (const n of [5, 10]) {
      const [u, o] = werte(n);
      expect(u! < grenze && grenze < o!).toBe(true);
    }
    expect(u25! > grenze).toBe(true);
    // 25 ist die erste Stufe der Tabelle mit Entscheidung
    expect(UFER.stufen.filter((n) => werte(n)[0]! > grenze)[0]).toBe(25);
    expect(UFER.exakt * UFER.preis).toBeGreaterThan(UFER.betrag);
    const [u100, o100] = werte(100);
    expect(u100).toBeCloseTo(1420.75, 6);
    expect(o100).toBeCloseTo(1445.75, 6);
  });
  it('minMax gegen feine Abtastung', () => {
    const [lo, hi] = minMax((x) => Math.sin(x), 0, 3);
    expect(lo).toBeCloseTo(0, 12);
    expect(hi).toBeCloseTo(1, 5);
  });
});

describe('Trapezsumme', () => {
  it('Parzelle: gegen die Summenformel und gegen die feine Integration des Streckenzugs', () => {
    const w = PARZELLE.breiten;
    const h = PARZELLE.abstand;
    expect(trapezsumme(w, h)).toBe(h * (w.reduce((a, b) => a + b, 0) - (w[0]! + w[w.length - 1]!) / 2));
    const stueckweise = (x: number) => {
      const i = Math.min(Math.floor(x / h), w.length - 2);
      return w[i]! + ((w[i + 1]! - w[i]!) * (x - i * h)) / h;
    };
    expect(trapezsumme(w, h)).toBeCloseTo(mittelpunkt(stueckweise, 0, 50, 200000), 3);
    expect(PARZELLE.flaeche).toBe(1140);
    expect(PARZELLE.flaeche * PARZELLE.preis).toBe(PARZELLE.kosten);
  });
});
