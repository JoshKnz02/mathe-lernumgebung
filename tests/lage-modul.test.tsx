import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import meta from '../content/modules/lage-im-koordinatensystem/meta.json';
import { A12, A2_ERWARTET, A34, A3_ERWARTET, A4_ERWARTET, A5, A6, BEISPIELE, REGLER, a6AusBeschreibung } from '../content/modules/lage-im-koordinatensystem/daten';
import Modul from '../content/modules/lage-im-koordinatensystem/index';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { bewerte } from '../src/lib/eingabe';
import { kennwerte, referenzpunkt, termSinus, wertTrig, type SinusParameter } from '../src/lib/sinus';

const PI = Math.PI;
const punkte = (von: number, bis: number, n = 40000) => Array.from({ length: n + 1 }, (_, i) => von + ((bis - von) * i) / n);
const g = (p: SinusParameter, f: 'sin' | 'cos' = 'sin') => (x: number) => wertTrig(p, x, f);
const gleichAufRaster = (f: (x: number) => number, h: (x: number) => number) => punkte(-8, 14, 400).every((x) => Math.abs(f(x) - h(x)) < 1e-9);
const abstand = (f: (x: number) => number, h: (x: number) => number) => Math.max(...punkte(-8, 14, 400).map((x) => Math.abs(f(x) - h(x))));
const ableitung = (f: (x: number) => number, x: number, h = 1e-6) => (f(x + h) - f(x - h)) / (2 * h);

/**
 * Kleinste Periode durch Probieren: Grobsuche nach dem kleinsten p > 0, bei dem sich f(x + p) kaum von f(x) unterscheidet,
 * danach Verfeinerung (Ternärsuche) auf den Minimalfehler. Gibt NaN zurück, wenn der Fehler dort nicht (fast) 0 wird.
 */
function kleinstePeriode(f: (x: number) => number): number {
  const stellen = punkte(-3, 3, 37);
  const fehler = (p: number) => Math.max(...stellen.map((x) => Math.abs(f(x + p) - f(x))));
  for (let p = 0.05; p < 20; p += 0.0005) {
    if (fehler(p) < 1e-2) {
      let lo = p - 0.05;
      let hi = p + 0.05;
      for (let i = 0; i < 60; i++) {
        const m1 = lo + (hi - lo) / 3;
        const m2 = hi - (hi - lo) / 3;
        if (fehler(m1) < fehler(m2)) hi = m2;
        else lo = m1;
      }
      const best = (lo + hi) / 2;
      return fehler(best) < 1e-8 ? best : NaN;
    }
  }
  return NaN;
}

describe('Arbeitsblatt: Aufgaben a) bis d) numerisch geprüft', () => {
  const f = Math.sin;
  it('a) sin(x)+2 entsteht durch Verschiebung um 2 nach oben, Periode 2π, Amplitude 1', () => {
    expect(gleichAufRaster(g(A12.a), (x) => f(x) + 2)).toBe(true);
    expect(kleinstePeriode(g(A12.a))).toBeCloseTo(2 * PI, 2);
    const k = kennwerte(A12.a);
    expect([k.amplitude, k.minimum, k.maximum, k.mittellinie]).toEqual([1, 1, 3, 2]);
  });
  it('b) sin(2x) entsteht durch Streckung in x-Richtung mit Faktor 1/2, Periode π, Amplitude 1', () => {
    // Streckung in x-Richtung mit Faktor k: Punkt (x|y) von K_f wird zu (kx|y), also g(x) = f(x/k). Hier k = 1/2.
    expect(gleichAufRaster(g(A12.b), (x) => f(x / 0.5))).toBe(true);
    expect(kleinstePeriode(g(A12.b))).toBeCloseTo(PI, 2);
    expect(kennwerte(A12.b).amplitude).toBe(1);
  });
  it('c) -3 sin(x): Streckung mit Faktor 3 in y-Richtung und Spiegelung an der x-Achse, Amplitude 3, Periode 2π', () => {
    expect(gleichAufRaster(g(A12.c), (x) => -(3 * f(x)))).toBe(true);
    expect(kleinstePeriode(g(A12.c))).toBeCloseTo(2 * PI, 2);
    const k = kennwerte(A12.c);
    expect([k.amplitude, k.minimum, k.maximum]).toEqual([3, -3, 3]);
  });
  it('d) sin(x-π/2): Verschiebung um π/2 nach rechts (Punkt (x|y) wird zu (x+π/2|y)), Periode 2π, Amplitude 1', () => {
    expect(gleichAufRaster(g(A12.d), (x) => f(x - PI / 2))).toBe(true);
    for (const x of [0, 0.7, 2.1]) expect(g(A12.d)(x + PI / 2)).toBeCloseTo(f(x), 12);
    expect(kleinstePeriode(g(A12.d))).toBeCloseTo(2 * PI, 2);
  });
  it('Aufgabe 2: erwartete Werte stimmen mit den Funktionen überein', () => {
    for (const k of ['a', 'b', 'c', 'd'] as const) {
      const ys = punkte(-7, 7).map(g(A12[k]));
      const amplitude = (Math.max(...ys) - Math.min(...ys)) / 2;
      expect(A2_ERWARTET.find((e) => e.id === `${k}-amplitude`)!.erwartet).toBeCloseTo(amplitude, 6);
      expect(A2_ERWARTET.find((e) => e.id === `${k}-periode`)!.erwartet).toBeCloseTo(kleinstePeriode(g(A12[k])), 2);
    }
  });
  it('Auswertung von Aufgabe 2: typische Eingaben', () => {
    const f2 = A2_ERWARTET.map((e) => ({ id: e.id, erwartet: e.erwartet, toleranz: 0.01 }));
    const antworten = { 'a-periode': '2pi', 'a-amplitude': '1', 'b-periode': 'π', 'b-amplitude': '1', 'c-periode': '6,28', 'c-amplitude': '3', 'd-periode': '2π', 'd-amplitude': '1' };
    expect(Object.values(bewerte(f2, antworten)).every((u) => u === 'richtig')).toBe(true);
    expect(bewerte(f2, { ...antworten, 'c-amplitude': '-3' })['c-amplitude']).toBe('falsch');
    expect(bewerte(f2, { ...antworten, 'b-periode': '4' })['b-periode']).toBe('falsch');
  });
});

describe('Skizzierregel: Ruhelage, Wertebereich, Referenzpunkt, Periode', () => {
  it('Beispiel f (Sinus, Aufgabe 3)', () => {
    const f = g(A34, 'sin');
    const ys = punkte(-2, 18).map(f);
    expect(Math.max(...ys)).toBeCloseTo(A3_ERWARTET.ymax, 5);
    expect(Math.min(...ys)).toBeCloseTo(A3_ERWARTET.ymin, 5);
    expect([A3_ERWARTET.ymin, A3_ERWARTET.ymax, A3_ERWARTET.ruhelage]).toEqual([-2, 4, 1]);
    // Ruhelage = Mittelwert aus größtem und kleinstem Wert
    expect((A3_ERWARTET.ymax + A3_ERWARTET.ymin) / 2).toBe(A3_ERWARTET.ruhelage);
    // Referenzpunkt (1|1) ist ein absteigender Wendepunkt
    expect(f(A3_ERWARTET.refX)).toBeCloseTo(A3_ERWARTET.refY, 12);
    expect(ableitung(f, 1)).toBeLessThan(0);
    const zweite = (x: number) => (f(x + 1e-3) - 2 * f(x) + f(x - 1e-3)) / 1e-6;
    expect(Math.abs(zweite(1))).toBeLessThan(1e-3);
    expect(zweite(0.5) * zweite(1.5)).toBeLessThan(0);
    expect(kleinstePeriode(f)).toBeCloseTo(A3_ERWARTET.periode, 2);
    expect(A3_ERWARTET.periode).toBeCloseTo(8, 12);
  });
  it('Beispiel g (Kosinus, Aufgabe 4): Referenzpunkt ist ein Tiefpunkt (1|-2)', () => {
    const f = g(A34, 'cos');
    expect([A4_ERWARTET.refX, A4_ERWARTET.refY]).toEqual([1, -2]);
    expect(f(1)).toBeCloseTo(-2, 12);
    expect(ableitung(f, 1)).toBeCloseTo(0, 6);
    expect(f(0.9)).toBeGreaterThan(f(1));
    expect(f(1.1)).toBeGreaterThan(f(1));
    expect(Math.min(...punkte(-2, 18).map(f))).toBeCloseTo(-2, 5);
    expect(kleinstePeriode(f)).toBeCloseTo(8, 2);
  });
  it('Referenzpunkt allgemein: Art und Lage, auch für negatives b und a = 0', () => {
    const p = (a: number, b: number): SinusParameter => ({ a, b, c: 1, d: 1 });
    expect(referenzpunkt(p(2, 1))?.art).toBe('wendepunkt-aufsteigend');
    expect(referenzpunkt(p(-2, 1))?.art).toBe('wendepunkt-absteigend');
    expect(referenzpunkt(p(2, -1))?.art).toBe('wendepunkt-absteigend'); // Spiegelung an der y-Achse
    expect(referenzpunkt(p(-2, -1))?.art).toBe('wendepunkt-aufsteigend');
    expect(referenzpunkt(p(2, 1), 'cos')).toEqual({ x: 1, y: 3, art: 'hochpunkt' });
    expect(referenzpunkt(p(-2, 1), 'cos')).toEqual({ x: 1, y: -1, art: 'tiefpunkt' });
    expect(referenzpunkt(p(-2, -3), 'cos')?.art).toBe('tiefpunkt'); // Kosinus: b-Vorzeichen egal
    expect(referenzpunkt(p(0, 1))).toBeNull();
    expect(referenzpunkt(p(1, 0))).toBeNull();
    // Der Verlauf stimmt mit der Art überein
    for (const [a, b] of [[2, 1], [-2, 1], [2, -1], [-2, -1], [1.5, 2], [-1, 0.5]] as const) {
      const r = referenzpunkt(p(a, b))!;
      expect(g(p(a, b))(r.x)).toBeCloseTo(r.y, 12);
      expect(ableitung(g(p(a, b)), r.x) > 0).toBe(r.art === 'wendepunkt-aufsteigend');
    }
  });
});

describe('Funktionsterm aus dem Schaubild (Aufgabe 5)', () => {
  const f = g(A5.sinus, 'sin');
  const gc = g(A5.kosinus, 'cos');
  it('Daten des Schaubilds: Ruhelage 4, Hochpunkt 5,5, Tiefpunkt 2,5, Periode 4', () => {
    const ys = punkte(-3, 8).map(f);
    expect(Math.max(...ys)).toBeCloseTo(5.5, 6);
    expect(Math.min(...ys)).toBeCloseTo(2.5, 6);
    expect(kleinstePeriode(f)).toBeCloseTo(4, 2);
    expect(f(1.5)).toBeCloseTo(4, 12);
    expect(ableitung(f, 1.5)).toBeGreaterThan(0);
    expect(f(2.5)).toBeCloseTo(5.5, 12);
    expect(f(0.5)).toBeCloseTo(2.5, 12);
    expect(f(-1.5)).toBeCloseTo(5.5, 12);
    expect(f(4.5)).toBeCloseTo(2.5, 12);
  });
  it('Sinus- und Kosinusterm beschreiben dasselbe Schaubild', () => {
    expect(gleichAufRaster(f, gc)).toBe(true);
    expect(A5.sinus.c).toBe(1.5);
    expect(A5.kosinus.c).toBe(2.5);
  });
  it('die kleinsten c ≥ 0: davor gibt es keinen passenden Wendepunkt bzw. Hochpunkt', () => {
    expect(f(1.5 - 4)).toBeCloseTo(4, 10); // -2,5 wäre ebenfalls ein Wendepunkt, ist aber negativ
    expect(gc(2.5 - 4)).toBeCloseTo(5.5, 10); // -1,5 wäre ebenfalls ein Hochpunkt, ist aber negativ
    expect(punkte(0, 1.4999, 150).every((x) => Math.abs(f(x) - 4) > 1e-6 || ableitung(f, x) <= 0)).toBe(true);
  });
  it('Aufgabe 5b: nur der Term mit a < 0 und c = 3,5 gehört zum Schaubild, die drei anderen nicht', () => {
    expect(gleichAufRaster(g(A5.alternativRichtig), f)).toBe(true);
    for (const falsch of [A5.falschHochpunkt, A5.falschVerschoben, A5.falschPeriode]) expect(abstand(g(falsch), f)).toBeGreaterThan(0.5);
  });
  it('Auswertung: typische Eingaben für b und c', () => {
    const felder = [
      { id: 'a', erwartet: A5.sinus.a },
      { id: 'b', erwartet: A5.sinus.b, toleranz: 0.01 },
      { id: 'c1', erwartet: A5.sinus.c },
      { id: 'c2', erwartet: A5.kosinus.c },
    ];
    expect(Object.values(bewerte(felder, { a: '1,5', b: 'pi/2', c1: '1,5', c2: '2,5' })).every((u) => u === 'richtig')).toBe(true);
    expect(Object.values(bewerte(felder, { a: '3/2', b: '1,57', c1: '1.5', c2: '5/2' })).every((u) => u === 'richtig')).toBe(true);
    expect(bewerte(felder, { a: '-1,5', b: '2', c1: '2,5', c2: '1,5' })).toEqual({ a: 'falsch', b: 'falsch', c1: 'falsch', c2: 'falsch' });
  });
});

describe('Funktionsterm aus der Beschreibung (Aufgabe 6)', () => {
  it('Verkettung der Lageveränderungen aus sin(x) ergibt den erwarteten Term', () => {
    const f0 = Math.sin;
    const f1 = (x: number) => f0(x / 0.5); // Streckung in x-Richtung mit Faktor 1/2: Periode π
    const f2 = (x: number) => f1(x - PI / 3); // Verschiebung um π/3 nach rechts
    const f3 = (x: number) => -2 * f2(x); // Streckung mit Faktor 2 in y-Richtung und Spiegelung an der x-Achse
    const f4 = (x: number) => f3(x) - 1; // Verschiebung um 1 nach unten
    expect(gleichAufRaster(f4, g(A6))).toBe(true);
    expect(gleichAufRaster(f4, a6AusBeschreibung)).toBe(true);
    expect(kleinstePeriode(f4)).toBeCloseTo(PI, 2);
    expect(A6).toEqual({ a: -2, b: 2, c: PI / 3, d: -1 });
  });
});

describe('Terme und Schreibweise', () => {
  it('stellt die Terme wie auf den Arbeitsblättern dar', () => {
    const opt = { klammer: 'eckig', immerKlammer: true } as const;
    expect(termSinus({ a: 1, b: 1, c: 0, d: 2 }, 'g', opt)).toBe('g(x)=\\sin(x)+2');
    expect(termSinus({ a: 1, b: 2, c: 0, d: 0 }, 'g', opt)).toBe('g(x)=\\sin\\left(2x\\right)');
    expect(termSinus({ a: -3, b: 1, c: 0, d: 0 }, 'g', opt)).toBe('g(x)=-3\\sin(x)');
    expect(termSinus({ a: 1, b: 1, c: PI / 2, d: 0 }, 'g', opt)).toBe('g(x)=\\sin\\left(x-\\frac{\\pi}{2}\\right)');
    expect(termSinus(A34, 'f', opt)).toBe('f(x)=-3\\sin\\left[\\frac{\\pi}{4}\\,(x-1)\\right]+1');
    expect(termSinus(A34, 'g', { ...opt, funktion: 'cos' })).toBe('g(x)=-3\\cos\\left[\\frac{\\pi}{4}\\,(x-1)\\right]+1');
    expect(termSinus(A6, 'g', opt)).toBe('g(x)=-2\\sin\\left[2\\,(x-\\frac{\\pi}{3})\\right]-1');
    // Standard bleibt unverändert
    expect(termSinus({ a: 1, b: 1, c: 0, d: 0 })).toBe('f(x)=\\sin x');
    expect(termSinus({ a: 2, b: 1.5, c: PI / 3, d: -1 })).toBe('f(x)=2\\sin\\bigl(1{,}5\\,(x-\\frac{\\pi}{3})\\bigr)-1');
  });
});

describe('Labor', () => {
  it('alle Beispiele liegen in den Reglerbereichen oder werden exakt gesetzt (Bereich enthält die Werte)', () => {
    for (const b of BEISPIELE) {
      for (const k of ['a', 'b', 'c', 'd'] as const) {
        expect(b.p[k], `${b.id}.${k}`).toBeGreaterThanOrEqual(REGLER[k].min);
        expect(b.p[k], `${b.id}.${k}`).toBeLessThanOrEqual(REGLER[k].max);
      }
    }
  });
  it('die Beispiele a) bis d) und f, g entsprechen den Arbeitsblattaufgaben', () => {
    const w = Object.fromEntries(BEISPIELE.map((b) => [b.id, b]));
    expect(w['a']!.p).toEqual({ a: 1, b: 1, c: 0, d: 2 });
    expect(w['b']!.p.b).toBe(2);
    expect(w['c']!.p.a).toBe(-3);
    expect(w['d']!.p.c).toBe(PI / 2);
    expect(w['f']!.funktion).toBe('sin');
    expect(w['g']!.funktion).toBe('cos');
    expect(w['f']!.p).toEqual(A34);
  });
  it('b = 0 ergibt keine Periode', () => {
    expect(kennwerte({ a: 1, b: 0, c: 0, d: 0 }).periode).toBeNull();
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
  it('hat die Abschnitte Erklären, Entdecken, Überprüfen, Zusammenfassung in dieser Reihenfolge, so wie in meta.json', () => {
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung']);
    expect([...html.matchAll(/data-abschnitt="([^"]+)"/g)].map((m) => m[1])).toEqual(meta.abschnitte.map((a) => a.id));
    for (const a of meta.abschnitte) expect(abschnitt(a.id).match(/data-abschnitt="/g), a.id).toHaveLength(1);
  });
  it('ist dem Bildungsplan zugeordnet (BPE 10.2 bis 10.4) und noch ein Entwurf', () => {
    expect(meta.bpe).toEqual(['10.2', '10.3', '10.4']);
    expect(meta.status).toBe('entwurf');
    expect(meta.thema).toBe('trigonometrische-funktionen');
  });
  it('nimmt das Entdecken nicht vorweg: das Erklären nennt die Wirkung der Parameter nicht', () => {
    const e = abschnitt('erklaeren');
    expect(e).not.toContain('Merke');
    expect(e).not.toMatch(/Spiegelung an der x-Achse für/);
    expect(e).not.toContain('Referenzpunkt');
    expect(e).toContain('Ruhelage');
    expect(e).toContain('Amplitude');
    expect(e).toContain('Periode');
  });
  it('das Entdecken beginnt mit der Vermutung, vor dem Labor', () => {
    const e = abschnitt('entdecken');
    expect(e.indexOf('>Vermutung<')).toBeGreaterThan(-1);
    expect(e.indexOf('>Vermutung<')).toBeLessThan(e.indexOf('>Labor<'));
    expect(e.match(/type="range"/g)).toHaveLength(4);
    expect(e).toContain('Hilfen zum Skizzieren anzeigen');
    for (const b of BEISPIELE) expect(e).toContain(`>${b.text}<`);
  });
  it('das Überprüfen enthält zehn Aufgaben, Hilfen und Lösungen erst nach Klick', () => {
    const u = abschnitt('ueberpruefen');
    expect(u.match(/Aufgabe [0-9][a-d]?: /g)).toHaveLength(10);
    expect(u.match(/type="radio"/g)).toHaveLength(4 * 4 + 4);
    expect(u).not.toContain('Lösungsschritt');
    expect(u).not.toContain('Hilfe 1 von');
    expect(u).toContain('Schaubild zum Vergleich einblenden');
    // Vergleichsschaubilder sind erst nach Klick gezeichnet, nur das Schaubild der Aufgabe 5 steht bereits da
    expect(u.match(/class="funktionsgraph/g)).toHaveLength(1);
  });
  it('die Zusammenfassung enthält Merke, Skizzierschritte und den Link zu GeoGebra', () => {
    const z = abschnitt('zusammenfassung');
    for (const t of ['Merke', 'Vier Schritte beim Skizzieren', 'Funktionsterm aus dem Schaubild', 'href="https://www.geogebra.org/m/nxydvncr"']) expect(z).toContain(t);
    expect(z).not.toMatch(/<iframe|<script|<img/);
    expect(z.match(/rel="noopener noreferrer"/g)).toHaveLength(1);
  });
  it('enthält kein Verlagsmaterial und keine Formelfehler', () => {
    expect(html).not.toMatch(/Lambacher|Klett|Lehrbuch|Sterne/);
    expect(html).not.toContain('formel-fehler');
  });
  it('Schreibweise: sin und cos mit konkretem Argument stehen in Klammern', () => {
    const quelle = ['index.tsx', 'Parameterlabor.tsx', 'daten.ts'].map((n) => readFileSync(new URL(`../content/modules/lage-im-koordinatensystem/${n}`, import.meta.url), 'utf8')).join('\n');
    const verstoesse = [...quelle.matchAll(/\\{1,2}(sin|cos)\s*(\d|\\pi|\\frac|\\tfrac)/g)].map((m) => m[0]);
    expect(verstoesse).toEqual([]);
  });
});
