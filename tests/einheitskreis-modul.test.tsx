import { renderToStaticMarkup } from 'react-dom/server';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import meta from '../content/modules/einheitskreis-sinus-kosinus/meta.json';
import { describe, expect, it } from 'vitest';
import { A1, A2, A3, A4, A6, K_MAX, K_MIN, SCHNELLWAHL_GRAD, SCHRITT_GRAD } from '../content/modules/einheitskreis-sinus-kosinus/daten';
import Modul from '../content/modules/einheitskreis-sinus-kosinus/index';
import { bewerte } from '../src/lib/eingabe';
import { bewerteAuswahl, bogenZuGrad, gradText, gradZuBogen, punktAmEinheitskreis } from '../src/lib/winkel';

const PI = Math.PI;
const ableitung2 = (f: (x: number) => number, x: number, h = 1e-4) => (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);

describe('Winkelrechnung', () => {
  it('rechnet nach α/360° = x/(2π) um', () => {
    expect(gradZuBogen(180)).toBeCloseTo(PI, 12);
    expect(gradZuBogen(360)).toBeCloseTo(2 * PI, 12);
    expect(gradZuBogen(60)).toBeCloseTo(PI / 3, 12);
    expect(bogenZuGrad(PI / 2)).toBeCloseTo(90, 12);
    expect(bogenZuGrad(gradZuBogen(37.5))).toBeCloseTo(37.5, 12);
    expect(bogenZuGrad(1)).toBeCloseTo(57.29578, 5);
  });
  it('formatiert Grad mit Komma und Minuszeichen', () => {
    expect(gradText(150)).toBe('150°');
    expect(gradText(-120)).toBe('−120°');
    expect(gradText(114.5916)).toBe('114,59°');
    expect(gradText(-0)).toBe('0°');
  });
  it('liefert Punkte am Einheitskreis, die auf dem Kreis liegen', () => {
    expect(punktAmEinheitskreis(PI / 2).y).toBeCloseTo(1, 12);
    expect(punktAmEinheitskreis(PI).x).toBeCloseTo(-1, 12);
    for (let k = K_MIN; k <= K_MAX; k++) {
      const p = punktAmEinheitskreis((k * PI) / 12);
      expect(Math.hypot(p.x, p.y)).toBeCloseTo(1, 12);
    }
  });
  it('wertet Auswahlfragen aus', () => {
    const o = [{ id: 'a', richtig: false }, { id: 'b', richtig: true }];
    expect(bewerteAuswahl(o, null)).toBe('offen');
    expect(bewerteAuswahl(o, 'a')).toBe('falsch');
    expect(bewerteAuswahl(o, 'b')).toBe('richtig');
    expect(bewerteAuswahl(o, 'x')).toBe('falsch');
  });
});

describe('Labor-Einstellungen', () => {
  it('Schnellwahl liegt im Reglerbereich und auf dem Raster', () => {
    for (const g of SCHNELLWAHL_GRAD) {
      expect(g % SCHRITT_GRAD).toBe(0);
      expect(g / SCHRITT_GRAD).toBeGreaterThanOrEqual(K_MIN);
      expect(g / SCHRITT_GRAD).toBeLessThanOrEqual(K_MAX);
    }
    expect((K_MIN * PI) / 12).toBeCloseTo(-PI, 12);
    expect((K_MAX * PI) / 12).toBeCloseTo(3 * PI, 12);
  });
});

describe('Aufgabenwerte stimmen mit bekannten Werten überein', () => {
  it('Aufgabe 1', () => {
    expect(A1.grad60).toBeCloseTo(1.047198, 6);
    expect(A1.grad135).toBeCloseTo(2.356194, 6);
    expect(A1.bogen5pi6).toBeCloseTo(150, 10);
    expect(A1.bogen2).toBeCloseTo(114.591559, 5);
  });
  it('Aufgabe 2: exakte Werte an den Achsenpunkten', () => {
    const w = Object.fromEntries(A2.map((e) => [e.id, e.erwartet]));
    expect(w['sin-pi']).toBeCloseTo(0, 12);
    expect(w['cos-pi']).toBeCloseTo(-1, 12);
    expect(w['sin-3pi2']).toBeCloseTo(-1, 12);
    expect(w['cos-3pi2']).toBeCloseTo(0, 12);
    expect(w['sin-mpi2']).toBeCloseTo(-1, 12);
    expect(w['cos-2pi']).toBeCloseTo(1, 12);
  });
  it('Aufgabe 3: Taschenrechnerwerte (Referenzwerte unabhängig bekannt)', () => {
    expect(A3.sinRad1).toBeCloseTo(0.841471, 6);
    expect(A3.cosRad2).toBeCloseTo(-0.416147, 6);
    expect(A3.cosDeg75).toBeCloseTo(0.258819, 6);
    expect(A3.sin30Rad).toBeCloseTo(-0.988032, 6);
    expect(Math.sin(gradZuBogen(30))).toBeCloseTo(0.5, 12);
  });
  it('Aufgabe 4: Wertetabelle', () => {
    const w = Object.fromEntries(A4.map((e) => [e.id, e.erwartet]));
    expect(w['sin-pi6']).toBeCloseTo(0.5, 12);
    expect(w['sin-pi4']).toBeCloseTo(0.707107, 6);
    expect(w['sin-pi3']).toBeCloseTo(0.866025, 6);
    expect(w['sin-3pi4']).toBeCloseTo(0.707107, 6);
    expect(w['cos-pi6']).toBeCloseTo(0.866025, 6);
    expect(w['cos-pi4']).toBeCloseTo(0.707107, 6);
    expect(w['cos-pi3']).toBeCloseTo(0.5, 12);
    expect(w['cos-3pi4']).toBeCloseTo(-0.707107, 6);
  });
  it('Auswertung: gerundete Eingaben richtig, grobe Rundung falsch', () => {
    const f = A4.map((e) => ({ id: e.id, erwartet: e.erwartet, toleranz: 0.01 }));
    const antworten = { 'sin-pi6': '0,5', 'sin-pi4': '0,71', 'sin-pi3': '0,87', 'sin-3pi4': '0.71', 'cos-pi6': '0,87', 'cos-pi4': '0,71', 'cos-pi3': '1/2', 'cos-3pi4': '-0,71' };
    expect(Object.values(bewerte(f, antworten)).every((u) => u === 'richtig')).toBe(true);
    expect(bewerte(f, { ...antworten, 'sin-pi3': '0,9' })['sin-pi3']).toBe('falsch');
    expect(bewerte(f, { ...antworten, 'cos-3pi4': '0,71' })['cos-3pi4']).toBe('falsch');
  });
  it('Aufgabe 1 und 3: typische Eingaben', () => {
    const f1 = [{ id: 'a', erwartet: A1.grad60, toleranz: 0.01 }, { id: 'c', erwartet: A1.bogen5pi6, toleranz: 0.05 }, { id: 'd', erwartet: A1.bogen2, toleranz: 0.05 }];
    expect(bewerte(f1, { a: 'pi/3', c: '150', d: '114,59' })).toEqual({ a: 'richtig', c: 'richtig', d: 'richtig' });
    expect(bewerte(f1, { a: '1,05', c: '150°', d: '115' })).toEqual({ a: 'richtig', c: 'ungueltig', d: 'falsch' });
    expect(bewerte([{ id: 'a', erwartet: A1.grad60, toleranz: 0.01 }], { a: '60' }).a).toBe('falsch');
  });
});

describe('Behauptungen der Eigenschaftstabelle (numerisch geprüft)', () => {
  const ks = [-3, -2, -1, 0, 1, 2, 3];
  it('Wertebereich und Periode', () => {
    const xs = Array.from({ length: 20001 }, (_, i) => -2 * PI + (4 * PI * i) / 20000);
    for (const f of [Math.sin, Math.cos]) {
      expect(Math.max(...xs.map(f))).toBeCloseTo(1, 6);
      expect(Math.min(...xs.map(f))).toBeCloseTo(-1, 6);
      for (const x of [0.3, 1.7, -2.2]) expect(f(x + 2 * PI)).toBeCloseTo(f(x), 12);
      // 2π ist die kleinste Periode: kein kleinerer Versatz im Raster ist eine Periode
      for (let T = 0.05; T < 2 * PI - 0.05; T += 0.05) expect(Math.abs(f(0.3 + T) - f(0.3)) > 1e-3 || Math.abs(f(1.1 + T) - f(1.1)) > 1e-3).toBe(true);
    }
  });
  it('Nullstellen', () => {
    for (const k of ks) {
      expect(Math.sin(k * PI)).toBeCloseTo(0, 12);
      expect(Math.cos(PI / 2 + k * PI)).toBeCloseTo(0, 12);
    }
    // keine weiteren Nullstellen im Intervall [0; 2π]: Vorzeichenwechsel genau 3- bzw. 2-mal (0, π, 2π bzw. π/2, 3π/2)
    const nullstellen = (f: (x: number) => number) => {
      const xs = Array.from({ length: 6284 }, (_, i) => 1e-4 + (i * (2 * PI - 2e-4)) / 6283);
      return xs.filter((x, i) => i > 0 && f(xs[i - 1]!) * f(x) < 0).length;
    };
    expect(nullstellen(Math.sin)).toBe(1); // im Inneren von (0; 2π) nur π
    expect(nullstellen(Math.cos)).toBe(2);
  });
  it('Extrempunkte', () => {
    for (const k of ks) {
      expect(Math.sin(PI / 2 + 2 * k * PI)).toBeCloseTo(1, 12);
      expect(Math.sin((3 * PI) / 2 + 2 * k * PI)).toBeCloseTo(-1, 12);
      expect(Math.cos(2 * k * PI)).toBeCloseTo(1, 12);
      expect(Math.cos(PI + 2 * k * PI)).toBeCloseTo(-1, 12);
    }
    expect(A6.sinHoch).toBe(PI / 2);
    expect(Math.sin(A6.sinHoch)).toBeCloseTo(1, 12);
    expect(Math.sin(A6.sinTief)).toBeCloseTo(-1, 12);
    expect(Math.cos(A6.cosHoch)).toBeCloseTo(1, 12);
    expect(Math.cos(A6.cosTief)).toBeCloseTo(-1, 12);
  });
  it('Wendepunkte: zweite Ableitung wechselt dort das Vorzeichen', () => {
    for (const k of ks) {
      const xs = k * PI;
      expect(ableitung2(Math.sin, xs)).toBeCloseTo(0, 4);
      expect(ableitung2(Math.sin, xs - 0.2) * ableitung2(Math.sin, xs + 0.2)).toBeLessThan(0);
      const xc = PI / 2 + k * PI;
      expect(ableitung2(Math.cos, xc)).toBeCloseTo(0, 4);
      expect(ableitung2(Math.cos, xc - 0.2) * ableitung2(Math.cos, xc + 0.2)).toBeLessThan(0);
    }
    // Extremstellen sind keine Wendestellen
    expect(Math.abs(ableitung2(Math.sin, PI / 2))).toBeGreaterThan(0.9);
  });
  it('Symmetrie', () => {
    for (const x of [0.2, 0.9, 1.3, 2.8, 4.1]) {
      expect(Math.sin(-x)).toBeCloseTo(-Math.sin(x), 12);
      expect(Math.cos(-x)).toBeCloseTo(Math.cos(x), 12);
    }
  });
  it('Kosinus entsteht aus Sinus durch Verschiebung um π/2 nach links', () => {
    for (const x of [-2, 0, 0.4, 3, 5.5]) expect(Math.cos(x)).toBeCloseTo(Math.sin(x + PI / 2), 12);
  });
});

describe('Darstellung des Moduls', () => {
  const html = renderToStaticMarkup(<Modul />);
  it('enthält Erklären, Entdecken, Überprüfen und die Zusammenfassung', () => {
    for (const t of ['>Erklären<', '>Entdecken<', '>Überprüfen<', '>Zusammenfassung<']) expect(html).toContain(t);
  });
  it('enthält das Labor mit Regler und Schnellwahl', () => {
    expect(html.match(/type="range"/g)).toHaveLength(1);
    expect(html).toContain('Schnellwahl des Winkels');
    for (const g of SCHNELLWAHL_GRAD) expect(html).toContain(`aria-label="${g} Grad"`);
  });
  it('enthält zwölf Aufgaben, davon sieben Auswahlfragen mit Optionen', () => {
    expect(html.match(/Aufgabe [0-9][a-e]?: /g)).toHaveLength(12);
    expect(html.match(/type="radio"/g)?.length).toBe(3 + 2 + 2 + 4 + 4 + 4 + 4);
  });
  it('zeigt Hilfen, Lösungen und Erklärungen erst nach Klick', () => {
    expect(html).not.toContain('Lösungsschritt');
    expect(html).not.toContain('Hilfe 1 von');
    expect(html).not.toMatch(/Erklärung<\/p>/);
  });
  it('verlinkt GeoGebra nur als gewöhnliche Links, ohne Einbettung', () => {
    expect(html).toContain('href="https://www.geogebra.org/m/rrgay2th"');
    expect(html).toContain('href="https://www.geogebra.org/m/gamvkbjd"');
    expect(html).not.toMatch(/<iframe|<script|<img/);
    expect(html.match(/rel="noopener noreferrer"/g)).toHaveLength(2);
  });
  it('enthält keine Formelfehler', () => {
    expect(html).not.toContain('formel-fehler');
  });

  it('zeigt mit gewähltem Abschnitt nur diesen Abschnitt', () => {
    for (const a of meta.abschnitte) {
      const nur = renderToStaticMarkup(
        <AbschnittAnbieter value={a.id}>
          <Modul />
        </AbschnittAnbieter>,
      );
      expect(nur.match(/data-abschnitt="/g), a.id).toHaveLength(1);
      expect(nur).toContain(`data-abschnitt="${a.id}"`);
      expect(nur).toContain(`>${a.titel}<`);
    }
  });
  it('rendert genau die in meta.json eingetragenen Abschnitte', () => {
    const ids = [...html.matchAll(/data-abschnitt="([^"]+)"/g)].map((m) => m[1]);
    expect(ids).toEqual(meta.abschnitte.map((a) => a.id));
  });
});
