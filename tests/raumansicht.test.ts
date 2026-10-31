import { describe, expect, it } from 'vitest';
import * as B from '../content/modules/punkte-vektoren-raum/Bilder';
import * as D from '../content/modules/punkte-vektoren-raum/daten';
import { punktlaborSpec } from '../content/modules/punkte-vektoren-raum/Punktlabor';
import { spiegellaborSpec } from '../content/modules/punkte-vektoren-raum/Spiegellabor';
import { vektorlaborSpec } from '../content/modules/punkte-vektoren-raum/Raumvektorlabor';
import { START_ANSICHT, raumAufBild, raumZeichnung, RAUM_RADIUS } from '../src/lib/raumansicht';
import type { Punkt3, RaumBildSpec } from '../src/lib/schraegbild';

const spezifikationen = (): [string, RaumBildSpec][] => [
  ['Erklärt', B.BILD_ERKLAERT],
  ['Ebenen', B.BILD_EBENEN],
  ['Oktanten', B.BILD_OKTANTEN],
  ['Gleich', B.BILD_GLEICH],
  ['Gleich E', B.BILD_GLEICH_E],
  ['Ablesen', B.aufgAblesen(false)],
  ['Ablesen Kontrolle', B.aufgAblesen(true)],
  ['Zeichnen', B.aufgZeichnen],
  ['Quader', B.aufgQuader(false)],
  ['Quader Kontrolle', B.aufgQuader(true)],
  ['Spiegel E', B.BILD_SPIEGEL_E],
  ['Punktlabor', punktlaborSpec(D.PUNKTLABOR_START, true, true, true)],
  ['Spiegellabor', spiegellaborSpec(D.SPIEGELLABOR_START, { art: 'spiegeln', an: 'a2' })],
  ['Vektorlabor', vektorlaborSpec(D.VEKTORLABOR_START.a, D.VEKTORLABOR_START.b, true, true)],
];
const ANSICHTEN = [-180, -135, -90, -45, 0, 35, 70, 120, 170].flatMap((az) => [-20, 0, 22, 45, 80].map((el) => ({ az, el })));
const GROESSE = 560;

describe('Räumliche Ansicht: Projektion', () => {
  it('bei az = 0 und el = 0 zeigt x₂ nach rechts, x₃ nach oben und x₁ zum Betrachter (Rechtssystem)', () => {
    const o = raumAufBild([0, 0, 0], { az: 0, el: 0 });
    const x1 = raumAufBild([1, 0, 0], { az: 0, el: 0 });
    const x2 = raumAufBild([0, 1, 0], { az: 0, el: 0 });
    const x3 = raumAufBild([0, 0, 1], { az: 0, el: 0 });
    expect([x2[0] - o[0], x2[1] - o[1]]).toEqual([1, 0]);
    expect([x3[0] - o[0], x3[1] - o[1]]).toEqual([0, 1]);
    // Tiefe: größer = weiter weg. x₁ zeigt zum Betrachter, ist also näher als der Ursprung.
    expect(x1[2] - o[2]).toBeLessThan(0);
    expect(Math.hypot(x1[0] - o[0], x1[1] - o[1])).toBeCloseTo(0, 12);
  });
  it('die Startansicht ähnelt dem Schrägbild: x₁ nach links unten, x₂ nach rechts, x₃ nach oben', () => {
    const o = raumAufBild([0, 0, 0], START_ANSICHT);
    const e = (p: Punkt3) => { const q = raumAufBild(p, START_ANSICHT); return [q[0] - o[0], q[1] - o[1]]; };
    expect(e([1, 0, 0])[0]!).toBeLessThan(0);
    expect(e([1, 0, 0])[1]!).toBeLessThan(0);
    expect(e([0, 1, 0])[0]!).toBeGreaterThan(0);
    expect(e([0, 0, 1])[1]!).toBeGreaterThan(0);
  });
  it('die Abbildung ist affin (Parallelprojektion): Mitten bleiben Mitten, Längen nie größer als im Raum', () => {
    for (const v of ANSICHTEN) {
      const a: Punkt3 = [2, -3, 1], b: Punkt3 = [-1, 4, 3];
      const m: Punkt3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
      const [pa, pb, pm] = [raumAufBild(a, v), raumAufBild(b, v), raumAufBild(m, v)];
      for (let i = 0; i < 3; i++) expect(pm[i]).toBeCloseTo((pa[i]! + pb[i]!) / 2, 9);
      expect(Math.hypot(pa[0] - pb[0], pa[1] - pb[1])).toBeLessThanOrEqual(Math.hypot(...[a[0] - b[0], a[1] - b[1], a[2] - b[2]]) + 1e-9);
    }
  });
  it('die Länge einer Einheit auf einer Achse im Bild hängt nur von der Blickrichtung ab, die x₃-Achse bei el = 0 immer 1', () => {
    for (let az = -180; az <= 180; az += 30) {
      const o = raumAufBild([0, 0, 0], { az, el: 0 });
      const q = raumAufBild([0, 0, 1], { az, el: 0 });
      expect(Math.hypot(q[0] - o[0], q[1] - o[1])).toBeCloseTo(1, 12);
    }
  });
});

describe('Räumliche Ansicht: Zeichnung', () => {
  it('alle Punkte, Linienenden, Ebenenecken und Achsen liegen für jede Blickrichtung im Bild', () => {
    for (const [name, spec] of spezifikationen()) {
      for (const v of ANSICHTEN) {
        const z = raumZeichnung(spec, v, GROESSE);
        const innen = (p: [number, number]) => p[0] >= 0 && p[0] <= GROESSE && p[1] >= 0 && p[1] <= GROESSE;
        for (const p of z.punkte) expect(innen(p.pos), `${name} ${v.az}/${v.el} ${p.name}`).toBe(true);
        for (const l of z.linien) expect(innen(l.von) && innen(l.bis), `${name} Linie`).toBe(true);
        for (const e of z.ebenen) for (const c of e.ecken) expect(innen(c), `${name} Ebene`).toBe(true);
        for (const a of z.achsen) expect(innen(a.von) && innen(a.bis), `${name} Achse ${a.name}`).toBe(true);
      }
    }
    expect(RAUM_RADIUS).toBeGreaterThan(Math.hypot(4, 4, 4));
  });
  it('in der Startansicht überschneiden sich keine zwei Beschriftungen von Punkten und keine Beschriftung ein Zahlenfeld einer Achse (Stichprobe der festen Bilder)', () => {
    for (const [name, spec] of spezifikationen().slice(0, 11)) {
      const z = raumZeichnung(spec, START_ANSICHT, GROESSE);
      const mitText = z.punkte.filter((p) => p.text && !p.nurText);
      for (let i = 0; i < mitText.length; i++) for (let j = i + 1; j < mitText.length; j++) {
        const [a, b] = [mitText[i]!.text!.rechteck, mitText[j]!.text!.rechteck];
        const schneidet = a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
        expect(schneidet, `${name} ${mitText[i]!.name}/${mitText[j]!.name}`).toBe(false);
      }
    }
  });
  it('jeder Punkt mit Text hat eine Beschriftung, nurText ohne Punkt, ohneText ohne Beschriftung', () => {
    const z = raumZeichnung({ sprech: 'x', punkte: [{ name: 'A', p: [1, 1, 1] }, { name: 'B', p: [2, 2, 2], ohneText: true }, { name: 'I', p: [3, 3, 3], nurText: true }] }, START_ANSICHT, GROESSE);
    expect(z.punkte.find((p) => p.name === 'A')!.text).not.toBeNull();
    expect(z.punkte.find((p) => p.name === 'B')!.text).toBeNull();
    expect(z.punkte.find((p) => p.name === 'I')!.nurText).toBe(true);
  });
  it('Ebenen und Linien: die hinteren werden zuerst gezeichnet (Tiefe absteigend)', () => {
    const z = raumZeichnung(B.BILD_EBENEN, START_ANSICHT, GROESSE);
    expect(z.ebenen).toHaveLength(3);
    for (let i = 1; i < z.ebenen.length; i++) expect(z.ebenen[i - 1]!.tiefe).toBeGreaterThanOrEqual(z.ebenen[i]!.tiefe);
    const q = raumZeichnung(B.aufgQuader(true), START_ANSICHT, GROESSE);
    expect(q.linien).toHaveLength(12);
    for (let i = 1; i < q.linien.length; i++) expect(q.linien[i - 1]!.tiefe).toBeGreaterThanOrEqual(q.linien[i]!.tiefe);
  });
  it('jede Achse hat 8 Teilstriche mit Zahlen von −4 bis 4 ohne 0', () => {
    const z = raumZeichnung({ sprech: 'x' }, START_ANSICHT, GROESSE);
    expect(z.achsen.map((a) => a.name)).toEqual(['x₁', 'x₂', 'x₃']);
    for (const a of z.achsen) expect(a.ticks.map((t) => t.zahl)).toEqual(['−4', '−3', '−2', '−1', '1', '2', '3', '4']);
  });
});
