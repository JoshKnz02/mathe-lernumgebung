import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import meta from '../content/modules/trigonometrische-gleichungen/meta.json';
import {
  E1, E10, E2, E3, E5, E6, E7, E8, E9, F4A, F4B, G1, G10, G2, G3, G5, G6, G7, G8, G9,
  INTERVALLE, SCHNELLWAHL,
} from '../content/modules/trigonometrische-gleichungen/daten';
import { Gleichungslabor } from '../content/modules/trigonometrische-gleichungen/Gleichungslabor';
import Modul from '../content/modules/trigonometrische-gleichungen/index';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { loeseGleichung, loesungen, unterschied, type Gleichung } from '../src/lib/gleichungen';

const PI = Math.PI;
const xs = (g: Gleichung) => loeseGleichung(g).map((l) => l.x);

/** Zählt Lösungen unabhängig: Vorzeichenwechsel der Differenz auf einem feinen Raster im Intervall. */
function zaehleNumerisch(g: Gleichung, schritte = 200000): number {
  const [von, bis] = g.intervall;
  const h = (bis - von) / schritte;
  let n = 0;
  let fa = unterschied(g, von);
  if (Math.abs(fa) < 1e-12) {
    n++;
    fa = 0;
  }
  for (let i = 1; i <= schritte; i++) {
    const fb = unterschied(g, von + i * h);
    // Trifft das Raster eine Nullstelle exakt, wird sie nur einmal gezählt (fa = 0 verhindert einen zweiten Vorzeichenwechsel).
    if (Math.abs(fb) < 1e-12) n++;
    else if (fa * fb < 0) n++;
    fa = Math.abs(fb) < 1e-12 ? 0 : fb;
  }
  return n;
}

describe('Arbeitsblatt und Aufgaben: erwartete Werte numerisch geprüft', () => {
  const alle: [string, Gleichung][] = [['1', G1], ['2', G2], ['3', G3], ['5', G5], ['6', G6], ['7', G7], ['8', G8], ['9', G9], ['10', G10]];

  it('jede erwartete Lösung erfüllt die ursprüngliche Gleichung (Probe)', () => {
    for (const [nr, g] of alle) {
      const l = xs(g);
      expect(l.length, `Aufgabe ${nr}`).toBeGreaterThan(0);
      for (const x of l) {
        expect(g.intervall[0] - 1e-9, `Aufgabe ${nr}`).toBeLessThanOrEqual(x);
        expect(x, `Aufgabe ${nr}`).toBeLessThanOrEqual(g.intervall[1] + 1e-9);
        const links = g.a * (g.funktion === 'sin' ? Math.sin : Math.cos)(g.b * (x - g.c)) + g.d;
        expect(links, `Aufgabe ${nr}, x = ${x}`).toBeCloseTo(g.e, 9);
      }
    }
  });

  it('es fehlt keine Lösung und es ist keine zu viel: Anzahl wie beim Nullstellenverfahren', () => {
    for (const [nr, g] of alle) expect(xs(g).length, `Aufgabe ${nr}`).toBe(zaehleNumerisch(g));
  });

  it('Aufgabe 1: sin(x) = 1/2 in [0; 2π]', () => {
    expect(xs(G1)).toEqual([PI / 6, (5 * PI) / 6].map((v) => expect.closeTo(v, 12)));
  });
  it('Aufgabe 2: cos(x) = −1/2 in [0; 2π], zweite Lösung −x1 + 2π', () => {
    expect(xs(G2)).toEqual([(2 * PI) / 3, (4 * PI) / 3].map((v) => expect.closeTo(v, 12)));
    expect(Math.acos(-0.5)).toBeCloseTo((2 * PI) / 3, 12);
  });
  it('Aufgabe 3: sin(x) = −0,8, der Taschenrechnerwert liegt nicht im Intervall', () => {
    expect(E3.x1).toBeCloseTo(-0.927295, 5);
    expect(E3.x1).toBeLessThan(0);
    expect(E3.links).toBeCloseTo(4.068888, 5);
    expect(E3.rechts).toBeCloseTo(5.35589, 5);
    expect(E3.links).toBeCloseTo(PI - E3.x1, 12);
    expect(E3.rechts).toBeCloseTo(E3.x1 + 2 * PI, 12);
  });
  it('Aufgabe 5 (Beispiel 1 des Arbeitsblatts): −√3 + 2 sin(x) = 0 in [0; 4π]', () => {
    expect(E5.s).toBeCloseTo(Math.sqrt(3) / 2, 12);
    expect(xs(G5)).toEqual([PI / 3, (2 * PI) / 3, (7 * PI) / 3, (8 * PI) / 3].map((v) => expect.closeTo(v, 12)));
  });
  it('Aufgabe 6: 3 cos(x) + 2 = 1 in [−π; π]', () => {
    expect(E6.s).toBeCloseTo(-1 / 3, 12);
    expect(E6.links).toBeCloseTo(-1.910633, 5);
    expect(E6.rechts).toBeCloseTo(1.910633, 5);
    expect(E6.loesungen).toHaveLength(2);
  });
  it('Aufgabe 7 (Beispiel 2 des Arbeitsblatts): 5 cos(4x) + 10 = 12,5 in [0; π]', () => {
    expect(E7.s).toBeCloseTo(0.5, 12);
    expect(E7.z1).toBeCloseTo(PI / 3, 12);
    expect(E7.p).toBeCloseTo(PI / 2, 12);
    expect(xs(G7)).toEqual([PI / 12, (5 * PI) / 12, (7 * PI) / 12, (11 * PI) / 12].map((v) => expect.closeTo(v, 12)));
  });
  it('Aufgabe 8: 2 sin(2(x − π/4)) + 1 = 2 in [0; 2π]', () => {
    expect(E8.s).toBeCloseTo(0.5, 12);
    expect(E8.z1).toBeCloseTo(PI / 6, 12);
    expect(xs(G8)).toEqual([PI / 3, (2 * PI) / 3, (4 * PI) / 3, (5 * PI) / 3].map((v) => expect.closeTo(v, 12)));
    // Rücksubstitution x = z/b + c
    expect(PI / 12 + PI / 4).toBeCloseTo(PI / 3, 12);
    expect((5 * PI) / 12 + PI / 4).toBeCloseTo((2 * PI) / 3, 12);
  });
  it('Aufgabe 9: 1,5 cos(0,5(x − 1)) + 2 = 3 in [0; 4π]', () => {
    expect(E9.s).toBeCloseTo(2 / 3, 12);
    expect(E9.p).toBeCloseTo(4 * PI, 12);
    expect(E9.links).toBeCloseTo(2.682137, 5);
    expect(E9.rechts).toBeCloseTo(11.884234, 5);
    expect(E9.loesungen).toHaveLength(2);
  });
  it('Aufgabe 10: Wasserstand h(t) = 1,5 sin(π/6 (t − 2)) + 4 gleich 4,75 an einem Tag', () => {
    expect(E10.s).toBeCloseTo(0.5, 12);
    expect(xs(G10)).toEqual([3, 7, 15, 19].map((v) => expect.closeTo(v, 9)));
    const h = (t: number) => 1.5 * Math.sin((PI / 6) * (t - 2)) + 4;
    for (const t of [3, 7, 15, 19]) expect(h(t)).toBeCloseTo(4.75, 12);
    // Dazwischen liegt der Wasserstand nicht bei 4,75
    expect(h(5)).toBeGreaterThan(4.75);
    expect(h(11)).toBeLessThan(4.75);
  });
});

describe('Auswahlfragen', () => {
  const sin = Math.sin;
  const cos = Math.cos;
  it('4a: sin(x) = 0,3, zweite Lösung π − x1 liegt im Intervall, die anderen Angebote sind keine Lösung', () => {
    expect(sin(F4A.x1)).toBeCloseTo(0.3, 12);
    expect(F4A.zweite).toBeCloseTo(PI - F4A.x1, 12);
    expect(sin(F4A.zweite)).toBeCloseTo(0.3, 12);
    expect(F4A.zweite).toBeLessThan(2 * PI);
    // gerundete Angaben im Text
    expect(Math.abs(sin(2.84) - 0.3)).toBeLessThan(0.01);
    expect(sin(-0.3)).toBeLessThan(0);
    expect(sin(3.45)).toBeCloseTo(-0.3, 1);
    expect(sin(5.98)).toBeCloseTo(-0.3, 1);
    expect(F4A.x1).toBeCloseTo(0.3, 1);
  });
  it('4b: cos(x) = 0,2 in [−π; π]: −x1 ist Lösung, π − x1 nicht, 2π − x1 ist Lösung außerhalb', () => {
    expect(F4B.x1).toBeCloseTo(1.37, 2);
    expect(cos(F4B.zweite)).toBeCloseTo(0.2, 12);
    expect(Math.abs(cos(1.77) - 0.2)).toBeGreaterThan(0.3);
    expect(cos(1.77)).toBeCloseTo(-0.2, 1);
    expect(cos(4.91)).toBeCloseTo(0.2, 1);
    expect(4.91).toBeGreaterThan(PI);
    expect(cos(-1.77)).toBeCloseTo(-0.2, 1);
    expect(loesungen('cos', 0.2, 1, 0, -PI, PI)).toHaveLength(2);
  });
  it('4c: sin(x) = −1 in [0; 4π] hat genau zwei Lösungen (3π/2 und 7π/2)', () => {
    const l = loesungen('sin', -1, 1, 0, 0, 4 * PI).map((q) => q.x);
    expect(l).toHaveLength(2);
    expect(l[0]).toBeCloseTo((3 * PI) / 2, 12);
    expect(l[1]).toBeCloseTo((7 * PI) / 2, 12);
  });
  it('4d: nur 3cos(x) + 1 = 5 hat keine Lösung', () => {
    const rechteSeiten = { a: 1.5 / 2, b: (5 - 1) / 3, c: (3 + 1) / 4, d: 1.8 / -2 };
    expect(rechteSeiten.a).toBeCloseTo(0.75, 12);
    expect(rechteSeiten.b).toBeCloseTo(4 / 3, 12);
    expect(rechteSeiten.c).toBe(1);
    expect(rechteSeiten.d).toBeCloseTo(-0.9, 12);
    const loesbar = (f: 'sin' | 'cos', s: number) => loesungen(f, s, 1, 0, 0, 2 * PI).length > 0;
    expect(loesbar('sin', rechteSeiten.a)).toBe(true);
    expect(loesbar('cos', rechteSeiten.b)).toBe(false);
    expect(loesbar('sin', rechteSeiten.c)).toBe(true);
    expect(loesbar('cos', rechteSeiten.d)).toBe(true);
  });
  it('Zusammenfassung: Vorzeichenregeln für negative Werte', () => {
    expect(Math.asin(-Math.SQRT1_2)).toBeCloseTo(-PI / 4, 12);
    expect(Math.acos(-Math.SQRT1_2)).toBeCloseTo((3 * PI) / 4, 12);
    for (const s of [0, 0.5, Math.SQRT1_2, Math.sqrt(3) / 2, 1]) {
      expect(Math.asin(-s)).toBeCloseTo(-Math.asin(s), 12);
      expect(Math.acos(-s)).toBeCloseTo(PI - Math.acos(s), 12);
    }
  });
  it('Zusammenfassung: unendlich viele Lösungen von cos(x) = 1/2 als x = ±π/3 + k·2π', () => {
    for (let k = -3; k <= 3; k++) {
      expect(Math.cos(-PI / 3 + k * 2 * PI)).toBeCloseTo(0.5, 12);
      expect(Math.cos(PI / 3 + k * 2 * PI)).toBeCloseTo(0.5, 12);
    }
  });
  it('Zusammenfassung: Tabelle der Werte x1', () => {
    const werte = [0, 0.5, Math.SQRT1_2, Math.sqrt(3) / 2, 1];
    const sinus = [0, PI / 6, PI / 4, PI / 3, PI / 2];
    const kosinus = [PI / 2, PI / 3, PI / 4, PI / 6, 0];
    werte.forEach((s, i) => {
      expect(Math.asin(s)).toBeCloseTo(sinus[i]!, 12);
      expect(Math.acos(s)).toBeCloseTo(kosinus[i]!, 12);
    });
  });
  it('Zusammenfassung: Im Intervall [0; 2π] ist die zweite Kosinuslösung 2π − x1', () => {
    for (const s of [-0.9, -0.3, 0.2, 0.8]) {
      const x1 = Math.acos(s);
      expect(Math.cos(2 * PI - x1)).toBeCloseTo(s, 12);
      expect(loesungen('cos', s, 1, 0, 0, 2 * PI).map((q) => q.x)).toEqual([x1, 2 * PI - x1].map((v) => expect.closeTo(v, 12)));
    }
  });
});

describe('Labor und Schnellwahl', () => {
  it('die Schnellwahl enthält die exakten Werte der Tabelle mit Vorzeichen', () => {
    const s = SCHNELLWAHL.map((w) => w.s);
    for (const v of [0, 0.5, Math.SQRT1_2, Math.sqrt(3) / 2, 1]) {
      expect(s.some((w) => Math.abs(w - v) < 1e-12), String(v)).toBe(true);
      expect(s.some((w) => Math.abs(w + v) < 1e-12), String(-v)).toBe(true);
    }
  });
  it('die Intervalle sind aufsteigend und enthalten die gewünschten Grenzen', () => {
    for (const iv of INTERVALLE) expect(iv.von).toBeLessThan(iv.bis);
    expect(INTERVALLE[0]).toMatchObject({ von: 0, bis: 2 * PI });
  });
  it('das Labor ohne Parameter zeigt zwei Lösungen für sin(x) = 0,5 in [0; 2π]', () => {
    const html = renderToStaticMarkup(<Gleichungslabor mitParametern={false} />);
    const koerper = html.slice(html.indexOf('<tbody>'), html.indexOf('</tbody>'));
    expect(koerper.match(/<tr/g)).toHaveLength(2);
    expect(html).toContain('Anzahl der Lösungen im Intervall');
    expect(html).not.toContain('Parameter b');
    expect(html).not.toContain('formel-fehler');
  });
  it('das Labor mit Parametern zeigt zusätzlich b, c und die Spalte z', () => {
    const html = renderToStaticMarkup(<Gleichungslabor mitParametern />);
    expect(html).toContain('Parameter b');
    expect(html).toContain('Parameter c');
    expect(html).toContain('Periode');
    expect(html).not.toContain('formel-fehler');
  });
});

describe('Darstellung des Moduls', () => {
  const html = renderToStaticMarkup(<Modul />);
  const abschnitt = (id: string) =>
    renderToStaticMarkup(
      <AbschnittAnbieter value={id}>
        <Modul />
      </AbschnittAnbieter>,
    );
  it('hat die Abschnitte in der Reihenfolge aus meta.json und ist ein Entwurf im Thema trigonometrische Funktionen', () => {
    expect([...html.matchAll(/data-abschnitt="([^"]+)"/g)].map((m) => m[1])).toEqual(meta.abschnitte.map((a) => a.id));
    for (const a of meta.abschnitte) expect(abschnitt(a.id).match(/data-abschnitt="/g), a.id).toHaveLength(1);
    expect(meta.status).toBe('entwurf');
    expect(meta.bpe).toEqual(['10.5', '10.6']);
    expect(meta.id).toBe('trigonometrische-gleichungen');
    expect(meta.thema).toBe('trigonometrische-funktionen');
  });
  it('alle Formeln lassen sich darstellen', () => {
    for (const a of meta.abschnitte) expect(abschnitt(a.id), a.id).not.toContain('formel-fehler');
  });
  it('verwendet die Fachsprache der Lehrkraft', () => {
    expect(html).toContain('Schaubild');
    expect(html).toContain('Intervall');
    expect(html).not.toContain('Mittellinie');
    expect(html).not.toContain('Graph ');
  });
  it('Erklären nennt Begriffe und Taschenrechner, aber nicht das zu Entdeckende', () => {
    const e = abschnitt('erklaeren');
    for (const t of ['Lösungsmenge', 'Intervall', 'Bogenmaß', 'Taschenrechner', 'Probe']) expect(e).toContain(t);
    expect(e).not.toContain('symmetrisch');
    expect(e).not.toContain('Symmetrie');
    expect(e).not.toContain('Substitution');
    expect(e).not.toContain('Periode addier');
  });
  it('Entdecken beginnt mit einer Vermutungsfrage vor dem ersten Labor', () => {
    const e = abschnitt('entdecken');
    expect(e.indexOf('Vermutung')).toBeGreaterThan(-1);
    expect(e.indexOf('Vermutung')).toBeLessThan(e.indexOf('class="labor"'));
  });
  it('Zusammenfassung nennt Verfahren, Sonderfälle, negative Werte und Substitution', () => {
    const z = abschnitt('zusammenfassung');
    for (const t of ['Substituieren', 'Rücksubstituieren', 'keine Lösung', 'Negative Werte', 'Typische Fehler']) expect(z).toContain(t);
  });
  it('enthält keine Gedankenstriche', () => {
    expect(html).not.toContain(' – ');
    expect(html).not.toContain(' — ');
  });
});
