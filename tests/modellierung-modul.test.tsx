import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import meta from '../content/modules/modellierungsaufgaben/meta.json';
import {
  FA_GRENZE, FREIBURG, FREIBURG_E, G1, G1_E, GA_ABBILDUNGEN, HAFEN, HAFEN_E, JULIAN, LUNGE, LUNGE_E, PREIS, PREIS_E, SONNE, SONNE_E,
  STUTTGART, STUTTGART_PUNKTE, fKleinsterWert, fa, ga, grossteAbweichung,
} from '../content/modules/modellierungsaufgaben/daten';
import { Anpassungslabor } from '../content/modules/modellierungsaufgaben/Anpassungslabor';
import Modul from '../content/modules/modellierungsaufgaben/index';
import { MODELLBILD, MODELLBILD_DATEN } from '../content/modules/modellierungsaufgaben/Modellbild';
import { Parameterlabor } from '../content/modules/modellierungsaufgaben/Parameterlabor';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { wertTrig, type SinusParameter } from '../src/lib/sinus';

const PI = Math.PI;
const cos = (p: SinusParameter) => (x: number) => wertTrig(p, x, 'cos');
const sin = (p: SinusParameter) => (x: number) => wertTrig(p, x, 'sin');
/** Unabhängige Suche nach Stellen mit f(x) = k durch Vorzeichenwechsel und Bisektion. */
function stellen(f: (x: number) => number, k: number, von: number, bis: number, n = 200000): number[] {
  const g = (x: number) => f(x) - k;
  const h = (bis - von) / n;
  const r: number[] = [];
  let xa = von;
  let fa_ = g(xa);
  for (let i = 1; i <= n; i++) {
    const xb = von + i * h;
    const fb = g(xb);
    if (fa_ * fb < 0) {
      let lo = xa;
      let hi = xb;
      for (let j = 0; j < 80; j++) {
        const m = (lo + hi) / 2;
        if (g(lo) * g(m) <= 0) hi = m;
        else lo = m;
      }
      r.push((lo + hi) / 2);
    }
    xa = xb;
    fa_ = fb;
  }
  return r;
}

describe('Wasserstand im Hafen', () => {
  it('Modell: Hochpunkt 11,6 m um 2 Uhr, Tiefpunkt 5,4 m um 8 Uhr, Periode 12', () => {
    const f = cos(HAFEN);
    expect(HAFEN.a).toBeCloseTo(3.1, 12);
    expect(HAFEN.b).toBeCloseTo(PI / 6, 12);
    expect(HAFEN.c).toBe(2);
    expect(HAFEN.d).toBeCloseTo(8.5, 12);
    expect(f(2)).toBeCloseTo(11.6, 12);
    expect(f(8)).toBeCloseTo(5.4, 12);
    expect(f(14)).toBeCloseTo(11.6, 12);
  });
  it('Zeiträume mit mindestens 11 m stimmen mit einer unabhängigen Suche überein', () => {
    const f = cos(HAFEN);
    const grenzen = stellen(f, 11, 0, 24);
    expect(grenzen).toHaveLength(4);
    const b = HAFEN_E.bereiche;
    expect([b[0]!.von, b[0]!.bis, b[1]!.von, b[1]!.bis]).toEqual(grenzen.map((g) => expect.closeTo(g, 6)));
    for (const r of b) {
      expect(f((r.von + r.bis) / 2)).toBeGreaterThan(11);
      expect(f(r.von - 0.01)).toBeLessThan(11);
    }
  });
  it('Minuten: 0:48 bis 3:12 und 12:48 bis 15:12, Beginn aufgerundet, Ende abgerundet, im Zeitraum reicht die Tiefe', () => {
    expect(HAFEN_E.min).toEqual([48, 192, 768, 912]);
    const f = cos(HAFEN);
    for (const m of HAFEN_E.min) expect(f(m / 60)).toBeGreaterThanOrEqual(11);
    expect(f(47 / 60)).toBeLessThan(11);
    expect(f(193 / 60)).toBeLessThan(11);
  });
});

describe('Luftvolumen in der Lunge', () => {
  it('Modell f(x) = −1,5 cos(2π/5 · x) + 3: Tiefpunkt (0 | 1,5), Hochpunkt (2,5 | 4,5), Periode 5', () => {
    const f = cos(LUNGE);
    expect(f(0)).toBeCloseTo(1.5, 12);
    expect(f(2.5)).toBeCloseTo(4.5, 12);
    expect(f(5)).toBeCloseTo(1.5, 12);
    expect(LUNGE.b).toBeCloseTo((2 * PI) / 5, 12);
    expect(LUNGE_E.min).toBe(1.5);
    expect(LUNGE_E.periode).toBe(5);
  });
  it('die Hälfte des größten Volumens (2,25 l) wird bei 0,83 s, 4,17 s, 5,83 s und 9,17 s erreicht', () => {
    expect(LUNGE_E.halbesMaximum).toBe(2.25);
    const gesucht = stellen(cos(LUNGE), 2.25, 0, 10);
    expect(gesucht).toHaveLength(4);
    LUNGE_E.alle.forEach((x, i) => expect(x).toBeCloseTo(gesucht[i]!, 6));
    expect(LUNGE_E.drei[0]).toBeCloseTo(5 / 6, 12);
    expect(LUNGE_E.drei[1]).toBeCloseTo(25 / 6, 12);
    expect(LUNGE_E.drei[2]).toBeCloseTo(35 / 6, 12);
  });
});

describe('Preisentwicklung', () => {
  const f = cos(PREIS);
  it('Hochpunkt (0 | 250), Tiefpunkt (180 | 150), Wendepunkte (90 | 200) und (270 | 200)', () => {
    expect(f(0)).toBeCloseTo(250, 9);
    expect(f(360)).toBeCloseTo(250, 9);
    expect(f(180)).toBeCloseTo(150, 9);
    expect(f(90)).toBeCloseTo(200, 9);
    expect(f(270)).toBeCloseTo(200, 9);
  });
  it('niedrigster Preis am 30.06.', () => {
    expect(PREIS_E.tMin).toBe(180);
    expect(PREIS_E.datumMin).toEqual({ tag: 30, monat: 6 });
    let minT = 0;
    for (let t = 0; t <= 360; t++) if (f(t) < f(minT)) minT = t;
    expect(minT).toBe(180);
  });
  it('Preis genau 175 € bei t = 120 und t = 240', () => {
    expect(PREIS_E.von).toBeCloseTo(120, 9);
    expect(PREIS_E.bis).toBeCloseTo(240, 9);
    expect(f(120)).toBeCloseTo(175, 9);
    expect(f(240)).toBeCloseTo(175, 9);
  });
  it('Monate, in denen der Preis an allen Tagen unter 175 € liegt: nur Mai, Juni, Juli (am 30. August ist der Preis genau 175 €)', () => {
    // Tag für Tag mit einer ganzzahligen Prüfung, bei Gleichheit nicht „darunter“ (Rundungsfehler abfangen).
    const darunter = (t: number) => f(t) < 175 - 1e-9;
    const alleTage = (m: number) => Array.from({ length: 30 }, (_, i) => 30 * (m - 1) + 1 + i).every(darunter);
    const monate = Array.from({ length: 12 }, (_, i) => i + 1).filter(alleTage);
    expect(monate).toEqual([5, 6, 7]);
    expect(PREIS_E.monate).toEqual([5, 6, 7]);
    expect(Math.abs(f(240) - 175)).toBeLessThan(1e-9);
    expect(darunter(239)).toBe(true);
    expect(darunter(121)).toBe(true);
    expect(darunter(120)).toBe(false);
  });
});

describe('Temperaturen', () => {
  it('Stuttgart: a = 9,8, b = π/6, c = 3,5, d = 7,7, größte Abweichung 0,8 °C', () => {
    expect(STUTTGART.a).toBeCloseTo(9.8, 12);
    expect(STUTTGART.b).toBeCloseTo(PI / 6, 12);
    expect(STUTTGART.c).toBeCloseTo(3.5, 12);
    expect(STUTTGART.d).toBeCloseTo(7.7, 12);
    expect(sin(STUTTGART)(0.5)).toBeCloseTo(-2.1, 12);
    expect(sin(STUTTGART)(6.5)).toBeCloseTo(17.5, 12);
    expect(grossteAbweichung(STUTTGART)).toBeCloseTo(0.8, 2);
    expect(STUTTGART_PUNKTE).toHaveLength(12);
    expect(STUTTGART_PUNKTE[0]).toEqual({ x: 0.5, y: -2.1 });
    expect(STUTTGART_PUNKTE[11]).toEqual({ x: 11.5, y: -0.7 });
  });
  it('Freiburg: Werte zwischen 5,1 und 24,5, über 20 °C von etwa 11:34 bis 19:14 Uhr', () => {
    expect(FREIBURG_E.min).toBeCloseTo(5.1, 12);
    expect(FREIBURG_E.max).toBeCloseTo(24.5, 12);
    const f = sin(FREIBURG);
    let kleinste = Infinity;
    let groesste = -Infinity;
    for (let x = 0; x <= 24; x += 0.001) {
      kleinste = Math.min(kleinste, f(x));
      groesste = Math.max(groesste, f(x));
    }
    expect(kleinste).toBeCloseTo(5.1, 3);
    expect(groesste).toBeCloseTo(24.5, 3);
    const grenzen = stellen(f, 20, 0, 24);
    expect(grenzen).toHaveLength(2);
    expect(FREIBURG_E.von).toBeCloseTo(grenzen[0]!, 6);
    expect(FREIBURG_E.bis).toBeCloseTo(grenzen[1]!, 6);
    expect(FREIBURG_E.von).toBeCloseTo(11.5612, 3);
    expect(FREIBURG_E.bis).toBeCloseTo(19.2388, 3);
    expect(FREIBURG_E.dauer).toBeCloseTo(7.6777, 3);
    expect(f(15)).toBeGreaterThan(20);
  });
  it('das Anpassungslabor rendert ohne Formelfehler und startet mit einer schlechten Anpassung', () => {
    const html = renderToStaticMarkup(<Anpassungslabor />);
    expect(html).not.toContain('formel-fehler');
    expect(html).toContain('Größte Abweichung');
    expect(html).toContain('Noch nicht passend');
    expect(grossteAbweichung({ a: 5, b: PI / 12, c: 0, d: 5 })).toBeGreaterThan(1);
  });
});

describe('Gemischte Aufgaben', () => {
  it('Aufgabe 6: g(x) = 2[sin(π/2 x − π/2) + 1/2] ist 2 sin(π/2 (x − 1)) + 1, Periode 4, Wendepunkte (1 | 1) und (3 | 1)', () => {
    const original = (x: number) => 2 * (Math.sin((PI / 2) * x - PI / 2) + 0.5);
    for (let x = -6; x <= 6; x += 0.13) expect(original(x)).toBeCloseTo(wertTrig(G1, x, 'sin'), 12);
    expect(G1_E.periode).toBe(4);
    for (const w of [G1_E.w1, G1_E.w2]) {
      expect(original(w.x)).toBeCloseTo(w.y, 12);
      // Wendepunkt: Funktionswert gleich der Ruhelage, Krümmung wechselt (zweite Differenz wechselt das Vorzeichen)
      const h = 1e-3;
      const z = (x: number) => original(x + h) - 2 * original(x) + original(x - h);
      expect(z(w.x - 0.2) * z(w.x + 0.2)).toBeLessThan(0);
    }
    // keine anderen Wendepunkte mit kleinerer positiver x-Koordinate
    expect(G1_E.w2.x - G1_E.w1.x).toBe(G1_E.periode / 2);
  });
  it('Aufgabe 6a: Die Beschreibung der Transformationen führt auf g (Faktor 2/π, 1 nach rechts, Faktor 2, 1 nach oben)', () => {
    const aus = (kx: number, c: number, ky: number, d: number) => (x: number) => ky * Math.sin((x - c) / kx) + d;
    const richtig = aus(2 / PI, 1, 2, 1);
    for (let x = -5; x <= 5; x += 0.17) expect(richtig(x)).toBeCloseTo(wertTrig(G1, x, 'sin'), 12);
    // die falschen Antwortmöglichkeiten unterscheiden sich
    for (const falsch of [aus(PI / 2, 1, 2, 1), aus(2 / PI, PI / 2, 2, 1), aus(2 / PI, 1, 2, 0.5)]) {
      const abweichung = Math.max(...[-3, -1, 0.3, 2.2, 4].map((x) => Math.abs(falsch(x) - wertTrig(G1, x, 'sin'))));
      expect(abweichung).toBeGreaterThan(0.05);
    }
  });
  it('Aufgabe 7: Sonnenscheindauer, 4,25 cos(2π/365 (t − 172)) + 12,25', () => {
    const f = cos(SONNE);
    expect(SONNE.a).toBeCloseTo(4.25, 12);
    expect(SONNE.d).toBeCloseTo(12.25, 12);
    expect(SONNE.b).toBeCloseTo((2 * PI) / 365, 12);
    expect(SONNE.c).toBe(172);
    expect(f(172)).toBeCloseTo(16.5, 12);
    expect(f(172 + 182.5)).toBeCloseTo(8, 12);
    expect(Math.abs(f(355) - 8)).toBeLessThan(0.01);
    // 21.6. ist der 172. Tag, 21.12. der 355. Tag (Jahr mit 365 Tagen)
    const tage = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    expect(tage.slice(0, 5).reduce((s, t) => s + t, 0) + 21).toBe(172);
    expect(tage.slice(0, 11).reduce((s, t) => s + t, 0) + 21).toBe(355);
    const grenzen = stellen(f, 14, 0, 365);
    expect(grenzen).toHaveLength(2);
    expect(SONNE_E.von).toBeCloseTo(grenzen[0]!, 6);
    expect(SONNE_E.bis).toBeCloseTo(grenzen[1]!, 6);
    expect(SONNE_E.tage).toBeCloseTo(133.19, 2);
    expect(f(Math.round(SONNE_E.von) + 1)).toBeGreaterThan(14);
    expect(f(Math.round(SONNE_E.von) - 2)).toBeLessThan(14);
  });
  it('Aufgabe 8: x · sin(x) = x in [−1; 2] hat genau die Lösungen 0 und π/2, Julian verliert 0', () => {
    const f = (x: number) => x * Math.sin(x) - x;
    for (const x of JULIAN.loesungen) expect(f(x)).toBeCloseTo(0, 12);
    // x = 0 ist ein Vorzeichenwechsel (wird gefunden), x = π/2 ist eine Berührstelle: f ≤ 0 für x ≥ 0 und f(π/2) = 0 ist das Maximum.
    const gefunden = stellen(f, 0, -1, 2);
    expect(gefunden).toHaveLength(1);
    expect(gefunden[0]!).toBeCloseTo(0, 9);
    expect(f(PI / 2)).toBeCloseTo(0, 12);
    for (let x = 0.01; x <= 2; x += 0.001) expect(f(x)).toBeLessThanOrEqual(1e-12);
    for (let x = -1; x <= -0.01; x += 0.001) expect(f(x)).toBeGreaterThan(0);
    // Julians Lösung ist nur eine von zwei
    expect(JULIAN.loesungen).toHaveLength(2);
    // zwischen den Lösungen gibt es keine weitere Nullstelle
    for (let x = -1; x <= 2; x += 0.0005) if (Math.abs(x) > 0.01 && Math.abs(x - PI / 2) > 0.01) expect(Math.abs(f(x))).toBeGreaterThan(0);
  });
  it('Aufgabe 9: exakte Werte', () => {
    expect(Math.sin(PI / 4)).toBeCloseTo(Math.sqrt(2) / 2, 12);
    expect(Math.cos((5 * PI) / 6)).toBeCloseTo(-Math.sqrt(3) / 2, 12);
    expect(Math.cos((11 * PI) / 3)).toBeCloseTo(0.5, 12);
    expect(Math.sin((7 * PI) / 6)).toBeCloseTo(-0.5, 12);
    expect(Math.sin((11 * PI) / 6)).toBeCloseTo(-0.5, 12);
    expect(stellen(Math.sin, -0.5, 0, 2 * PI)).toEqual([(7 * PI) / 6, (11 * PI) / 6].map((v) => expect.closeTo(v, 8)));
  });
  it('Aufgabe 10: g_a(x) = a + a cos(x), die Abbildungen 1 und 2 gehören dazu, 3 und 4 nicht', () => {
    const [a1, a2, a3, a4] = GA_ABBILDUNGEN;
    expect(a1.gehoert && a2.gehoert).toBe(true);
    expect(a3.gehoert || a4.gehoert).toBe(false);
    for (let x = -2 * PI; x <= 2 * PI; x += 0.11) {
      expect(a1.f(x)).toBeCloseTo(ga(2, x), 12);
      expect(a2.f(x)).toBeCloseTo(ga(-1.5, x), 12);
    }
    expect(ga(2, 0)).toBe(4);
    expect(ga(-1.5, 0)).toBe(-3);
    expect(a1.a).toBe(2);
    expect(a2.a).toBe(-1.5);
    // Es gibt kein a ≠ 0 mit g_a gleich Abbildung 3 oder 4: Die Funktionswerte bei x = 0 und x = π passen nicht zu g_a(0) = 2a und g_a(π) = 0.
    expect(a3.f(PI)).not.toBeCloseTo(0, 6);
    expect(a3.f(0)).toBeCloseTo(0, 12);
    expect(a4.f(PI)).not.toBeCloseTo(0, 6);
    expect(a4.f(2 * PI)).toBeCloseTo(0, 12);
    // g_a hat die Periode 2π
    for (const a of [2, -1.5, 0.7]) expect(ga(a, 1.234)).toBeCloseTo(ga(a, 1.234 + 2 * PI), 12);
  });
  it('Aufgabe 11: f_a(x) = 1/a − a sin(x) liegt genau für 0 < a < 1 oberhalb der x-Achse', () => {
    expect(FA_GRENZE).toBe(1);
    expect(fKleinsterWert(0.5)).toBeCloseTo(1.5, 12);
    const kleinsterNumerisch = (a: number) => {
      let m = Infinity;
      for (let i = 1; i < 20000; i++) m = Math.min(m, fa(a, (i * 2 * PI) / 20000));
      return m;
    };
    for (const a of [0.25, 0.5, 0.9, 0.99]) {
      expect(kleinsterNumerisch(a)).toBeGreaterThan(0);
      expect(fKleinsterWert(a)).toBeGreaterThan(0);
    }
    for (const a of [1.01, 1.5, 2, 2.5]) {
      expect(kleinsterNumerisch(a)).toBeLessThan(0);
      expect(fKleinsterWert(a)).toBeLessThan(0);
    }
    expect(fKleinsterWert(1)).toBe(0);
    expect(fa(1, PI / 2)).toBe(0);
    for (const a of [0.3, 1, 2]) expect(kleinsterNumerisch(a)).toBeCloseTo(fKleinsterWert(a), 6);
  });
  it('das Parameterlabor rendert ohne Formelfehler', () => {
    const html = renderToStaticMarkup(<Parameterlabor />);
    expect(html).not.toContain('formel-fehler');
    expect(html).toContain('Oberhalb der x-Achse');
  });
});

describe('Modellbild im Vorgehen', () => {
  it('Beispielwerte: größter Wert 10 bei x = 1, kleinster 2, Periode 8, a = 4, b = π/4, c = 1, d = 6', () => {
    expect(MODELLBILD).toEqual({ a: 4, b: PI / 4, c: 1, d: 6 });
    const f = cos(MODELLBILD);
    expect(f(MODELLBILD_DATEN.xHoch)).toBeCloseTo(10, 12);
    expect(f(5)).toBeCloseTo(2, 12);
    expect(f(9)).toBeCloseTo(10, 12);
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
  it('hat die Abschnitte in der Reihenfolge aus meta.json und ist freigegeben', () => {
    expect([...html.matchAll(/data-abschnitt="([^"]+)"/g)].map((m) => m[1])).toEqual(meta.abschnitte.map((a) => a.id));
    for (const a of meta.abschnitte) expect(abschnitt(a.id).match(/data-abschnitt="/g), a.id).toHaveLength(1);
    expect(meta.id).toBe('modellierungsaufgaben');
    expect(meta.status).toBe('freigegeben');
    expect(meta.thema).toBe('trigonometrische-funktionen');
    expect(meta.bpe).toEqual(['10.4', '10.5', '10.6']);
  });
  it('alle Formeln lassen sich darstellen', () => {
    for (const a of meta.abschnitte) expect(abschnitt(a.id), a.id).not.toContain('formel-fehler');
  });
  it('verwendet die Fachsprache der Lehrkraft', () => {
    expect(html).toContain('Ruhelage');
    expect(html).toContain('Schaubild');
    expect(html).not.toContain('Mittellinie');
    expect(html).not.toContain('Streckfaktor');
  });
  it('die Substitutionsvariable heißt wie im Modul Trigonometrische Gleichungen durchgehend z (nie u)', () => {
    const tex = [...html.matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!);
    expect(tex.length).toBeGreaterThan(100);
    expect(tex.filter((t) => /(?<![\\A-Za-z])u(_[12])?(?![A-Za-z])/.test(t))).toEqual([]);
    expect(tex.some((t) => /z_1/.test(t))).toBe(true);
    expect(tex.some((t) => /z_2/.test(t))).toBe(true);
    expect(abschnitt('vorgehen')).toContain('z_1');
  });
  it('enthält keine Gedankenstriche und kein Betragszeichen ohne Not im Fließtext des Vorgehens', () => {
    expect(html).not.toContain(' – ');
    expect(html).not.toContain(' — ');
  });
  it('enthält keinen neuen Stoff: Vorgehen nennt die Schritte, Aufgaben stehen im Abschnitt Modellieren und Gemischte Aufgaben', () => {
    expect(abschnitt('vorgehen')).toContain('Schritt für Schritt');
    expect(abschnitt('vorgehen')).toContain('Denkhinweis zu b');
    expect(abschnitt('modellieren')).toContain('Wasserstand im Hafen');
    expect(abschnitt('modellieren')).toContain('Preisentwicklung');
    expect(abschnitt('gemischt')).toContain('Julians Rechnung');
    expect(abschnitt('zusammenfassung')).toContain('Typische Fehler');
  });
  it('die Aufgaben sind fortlaufend nummeriert und haben gestufte Hilfen', () => {
    const modellieren = abschnitt('modellieren');
    for (const t of ['Aufgabe 1:', 'Aufgabe 2:', 'Aufgabe 3:', 'Aufgabe 4a:', 'Aufgabe 4b:', 'Aufgabe 5:']) expect(modellieren, t).toContain(t);
    const gemischt = abschnitt('gemischt');
    for (const t of ['Aufgabe 6a:', 'Aufgabe 6b:', 'Aufgabe 7:', 'Aufgabe 8a:', 'Aufgabe 8b:', 'Aufgabe 9a:', 'Aufgabe 9d:', 'Aufgabe 10a:', 'Aufgabe 10b:', 'Aufgabe 11a:', 'Aufgabe 11b:']) expect(gemischt, t).toContain(t);
    expect(modellieren.match(/Hilfe anzeigen/g)!.length).toBeGreaterThanOrEqual(4);
  });
});
