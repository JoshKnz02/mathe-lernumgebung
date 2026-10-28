import { describe, expect, it } from 'vitest';
import { MIN_ABSTAND, VERSATZ, ankerUndVersatz, beschriftungsLage, labelAbstand } from '../src/lib/beschriftung';

const bereich: [number, number, number, number] = [-3, 3, -3, 3];

describe('Beschriftung von Punkten', () => {
  it('Hochpunkt einer Parabel: die Beschriftung steht über dem Punkt, nicht auf der Kurve', () => {
    const f = (x: number) => -x * x + 2;
    const l = beschriftungsLage({ x: 0, y: 2 }, bereich, [{ f }]);
    expect(l).toBe('oben');
    expect(labelAbstand(l, { x: 0, y: 2 }, bereich, [{ f }])).toBeGreaterThanOrEqual(MIN_ABSTAND);
  });
  it('steigende Kurve: die Beschriftung steht auf der freien Seite oben links, fallende Kurve: oben rechts', () => {
    const steigt = (x: number) => x;
    const faellt = (x: number) => -x;
    const a = beschriftungsLage({ x: 0.5, y: 0.5 }, bereich, [{ f: steigt }]);
    const b = beschriftungsLage({ x: 0.5, y: -0.5 }, bereich, [{ f: faellt }]);
    expect(['oben-links', 'oben', 'links', 'unten-rechts', 'rechts', 'unten']).toContain(a);
    expect(labelAbstand(a, { x: 0.5, y: 0.5 }, bereich, [{ f: steigt }])).toBeGreaterThanOrEqual(MIN_ABSTAND);
    expect(labelAbstand(b, { x: 0.5, y: -0.5 }, bereich, [{ f: faellt }])).toBeGreaterThanOrEqual(MIN_ABSTAND);
  });
  it('liegt der Punkt auf der x-Achse, steht die Beschriftung nie darunter (dort stehen die Zahlen der Achse)', () => {
    for (const f of [(x: number) => x, (x: number) => -x, (x: number) => x * x - 1, (x: number) => 1 - x * x]) {
      for (const x of [-2, -1, 0, 1, 2]) {
        const l = beschriftungsLage({ x, y: 0 }, bereich, [{ f }]);
        expect(VERSATZ[l][1], `x=${x}`).toBeGreaterThanOrEqual(0);
      }
    }
  });
  it('das senkrechte Hilfsstück zur x-Achse wird gemieden: bei einem Punkt unter der Achse steht die Beschriftung nicht darüber', () => {
    const f = (x: number) => x * x - 2;
    const l = beschriftungsLage({ x: 1, y: -1 }, bereich, [{ f }]);
    expect(labelAbstand(l, { x: 1, y: -1 }, bereich, [{ f }])).toBeGreaterThanOrEqual(MIN_ABSTAND);
    expect(labelAbstand('oben', { x: 1, y: -1 }, bereich, [{ f }])).toBeLessThan(MIN_ABSTAND);
  });
  it('weitere Linien (Tangente) werden gemieden, Lagen außerhalb des Bildes werden nicht gewählt', () => {
    const f = (x: number) => x * x;
    const t = (x: number) => 2 * x - 1;
    const l = beschriftungsLage({ x: 1, y: 1 }, bereich, [{ f }, { f: t }]);
    expect(labelAbstand(l, { x: 1, y: 1 }, bereich, [{ f }, { f: t }])).toBeGreaterThanOrEqual(MIN_ABSTAND);
    const oben = beschriftungsLage({ x: 0, y: 2.95 }, bereich, []);
    expect(VERSATZ[oben][1]).toBeLessThanOrEqual(0.0001);
  });
  it('Anker und Versatz entsprechen der Zuordnung im Baustein Messbild', () => {
    const a = ankerUndVersatz('oben-rechts', [0, 10, 0, 4]);
    expect(a).toEqual({ anchorX: 'left', anchorY: 'bottom', dx: 0.15, dy: 0.1 });
    const b = ankerUndVersatz('unten-links', [0, 10, 0, 4]);
    expect(b).toEqual({ anchorX: 'right', anchorY: 'top', dx: -0.15, dy: -0.1 });
    expect(ankerUndVersatz('oben', [0, 10, 0, 4])).toEqual({ anchorX: 'middle', anchorY: 'bottom', dx: 0, dy: 0.1 });
  });
  it('mit Angabe der Teilung meidet die Beschriftung die Zahlen an der x-Achse, ohne die Angabe bleibt die Wahl unverändert', () => {
    // Ein Punkt knapp unter der x-Achse bei einem Teilstrich: über ihm stehen die Zahlen der Achse nicht, aber nahe darunter ist die Achsenbeschriftung
    const f = (x: number) => 0.5 * (x * x - 1) - 0.5;
    const punkt = { x: 1, y: f(1) };
    const hoch: [number, number, number, number] = [-3, 3, -10, 10];
    const ohne = beschriftungsLage(punkt, hoch, [{ f }], false, true);
    const mit = beschriftungsLage(punkt, hoch, [{ f }], false, true, { x: 1, y: 2 });
    // ohne Angabe darf sie auf den Zahlen stehen, mit Angabe hat sie Abstand zu allen Zahlen der Achse
    expect(labelAbstand(mit, punkt, hoch, [{ f }], false, { x: 1, y: 2 })).toBeGreaterThanOrEqual(MIN_ABSTAND);
    expect(beschriftungsLage(punkt, hoch, [{ f }], false, true)).toBe(ohne);
    // die Teilung ändert nichts, wenn keine Zahlen in der Nähe liegen
    const ferne = { x: 1, y: 8 };
    expect(beschriftungsLage(ferne, hoch, [{ f: () => 8 }], false, true, { x: 1, y: 2 })).toBe(beschriftungsLage(ferne, hoch, [{ f: () => 8 }], false, true));
  });
});
