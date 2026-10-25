import { describe, expect, it } from 'vitest';
import {
  KETTENFUNKTIONEN,
  analysiereKette,
  definitionsbereichTex,
  findeKette,
  inDefinitionsbereich,
  nullstellenKette,
  periodeKette,
  symmetrieKette,
  symmetrieRegelKette,
  verkette,
  verkettungTerm,
  wertKette,
} from '../src/lib/verkettung';

const PI = Math.PI;
const VON = -5;
const BIS = 5;
const paare = KETTENFUNKTIONEN.flatMap((u) => KETTENFUNKTIONEN.map((v) => ({ u, v })));
const id = (p: { u: { id: string }; v: { id: string } }) => `${p.u.id} nach ${p.v.id}`;

describe('Verkettung', () => {
  it('Funktionswerte, von Hand gerechnet', () => {
    const k = (u: string, v: string) => verkette(findeKette(u), findeKette(v));
    expect(k('sin', 'quad')(Math.sqrt(PI / 2))).toBeCloseTo(1, 12);
    expect(k('exp', 'cos')(0)).toBeCloseTo(Math.E, 12);
    expect(k('cos', 'exp')(0)).toBeCloseTo(Math.cos(1), 12);
    expect(k('quad', 'lin')(3)).toBeCloseTo(25, 12);
    expect(k('lin', 'quad')(3)).toBeCloseTo(17, 12);
    expect(k('wurzel', 'lin')(5)).toBeCloseTo(3, 12);
    expect(k('wurzel', 'lin')(0)).toBeNaN();
    expect(k('exp', 'kub')(10)).toBeNaN();
  });
  it('die Reihenfolge ist wichtig: u(v(x)) und v(u(x)) sind im Allgemeinen verschieden', () => {
    const u = findeKette('quad');
    const v = findeKette('lin');
    expect(verkette(u, v)(2)).toBeCloseTo(9, 12);
    expect(verkette(v, u)(2)).toBeCloseTo(7, 12);
  });
  it('Funktionsterme', () => {
    const t = (u: string, v: string) => verkettungTerm(findeKette(u), findeKette(v));
    expect(t('sin', 'quad')).toBe('\\sin(x^2)');
    expect(t('quad', 'sin')).toBe('(\\sin x)^2');
    expect(t('exp', 'cos')).toBe('e^{\\cos x}');
    expect(t('wurzel', 'lin')).toBe('\\sqrt{2x-1}');
    expect(t('lin', 'sin')).toBe('2\\sin x-1');
    expect(t('lin', 'lin')).toBe('2(2x-1)-1');
    expect(t('kub', 'exp')).toBe('(e^x)^3');
  });
  it('der Funktionsterm gehört zur verketteten Funktion (Stichprobe der Schreibweise gegen die Rechnung)', () => {
    const x = 0.7;
    expect(verkette(findeKette('lin'), findeKette('lin'))(x)).toBeCloseTo(2 * (2 * x - 1) - 1, 12);
    expect(verkette(findeKette('kub'), findeKette('exp'))(x)).toBeCloseTo(Math.exp(x) ** 3, 12);
    expect(verkette(findeKette('quad'), findeKette('sin'))(x)).toBeCloseTo(Math.sin(x) ** 2, 12);
  });
});

describe('Definitionsbereich', () => {
  it('die von Hand bestimmte Bedingung stimmt für alle Paare mit der Rechnung überein', () => {
    for (const p of paare)
      for (let x = -6; x <= 6; x += 0.0137) {
        const berechenbar = !Number.isNaN(verkette(p.u, p.v)(x));
        // Wo e^(x³) überläuft, ist der Wert nicht berechenbar, obwohl x im Definitionsbereich liegt.
        if (!berechenbar && inDefinitionsbereich(p.u, p.v, x)) expect(wertKette(p.v, x) > 1e3 || p.v.id === 'exp' || p.u.id === 'exp', `${id(p)} bei ${x}`).toBe(true);
        else expect(berechenbar, `${id(p)} bei ${x}`).toBe(inDefinitionsbereich(p.u, p.v, x));
      }
  });
  it('Texte', () => {
    const d = (u: string, v: string) => definitionsbereichTex(findeKette(u), findeKette(v));
    expect(d('wurzel', 'lin')).toBe('[0{,}5;\\,\\infty[');
    expect(d('sin', 'wurzel')).toBe('[0;\\,\\infty[');
    expect(d('quad', 'sin')).toBe('\\mathbb{R}');
    expect(d('wurzel', 'quad')).toBe('\\mathbb{R}');
  });
});

describe('Symmetrie', () => {
  it('Einzelfunktionen', () => {
    for (const f of KETTENFUNKTIONEN) expect(symmetrieKette((x) => wertKette(f, x)), f.id).toBe(f.symmetrie);
  });
  it('Regeln: innere Funktion achsensymmetrisch gibt achsensymmetrisch, innere punktsymmetrisch hängt von der äußeren ab', () => {
    expect(symmetrieRegelKette('keine', 'achse')).toBe('achse');
    expect(symmetrieRegelKette('punkt', 'achse')).toBe('achse');
    expect(symmetrieRegelKette('achse', 'punkt')).toBe('achse');
    expect(symmetrieRegelKette('punkt', 'punkt')).toBe('punkt');
    expect(symmetrieRegelKette('keine', 'punkt')).toBe('keine');
    expect(symmetrieRegelKette('achse', 'keine')).toBe('keine');
  });
  it('alle 49 Paare: erkannte Symmetrie stimmt mit der Regel überein', () => {
    for (const p of paare) expect(symmetrieKette(verkette(p.u, p.v)), id(p)).toBe(symmetrieRegelKette(p.u.symmetrie, p.v.symmetrie));
  });
});

describe('Periode', () => {
  it('periodisch, wenn die innere Funktion periodisch ist oder wenn Sinus oder Kosinus außen steht und innen eine lineare Funktion', () => {
    for (const p of paare) {
      const trig = (f: { id: string }) => f.id === 'sin' || f.id === 'cos';
      const periodisch = trig(p.v) || (trig(p.u) && p.v.id === 'lin');
      const halb = (p.u.id === 'quad' && trig(p.v)) || (p.u.id === 'cos' && trig(p.v)) || (trig(p.u) && p.v.id === 'lin');
      const erwartet = !periodisch ? null : halb ? PI : 2 * PI;
      const p0 = periodeKette(verkette(p.u, p.v));
      expect(p0 === null ? null : Math.round(p0 * 1e9), id(p)).toBe(erwartet === null ? null : Math.round(erwartet * 1e9));
    }
  });
  it('sin(x²) ist trotz Wellen nicht periodisch, die Nullstellen liegen bei ±√(kπ)', () => {
    const h = verkette(findeKette('sin'), findeKette('quad'));
    expect(periodeKette(h)).toBeNull();
    const z = nullstellenKette(h, VON, BIS);
    const erwartet = [0];
    for (let k = 1; k * PI <= 25; k++) erwartet.push(Math.sqrt(k * PI), -Math.sqrt(k * PI));
    erwartet.sort((a, b) => a - b);
    expect(z).toHaveLength(erwartet.length);
    z.forEach((x, i) => expect(x).toBeCloseTo(erwartet[i]!, 6));
  });
});

describe('Nullstellen', () => {
  it('von Hand bekannte Fälle', () => {
    const z = (u: string, v: string) => nullstellenKette(verkette(findeKette(u), findeKette(v)), VON, BIS);
    expect(z('exp', 'cos')).toEqual([]);
    const c = z('cos', 'lin'); // 2x − 1 = π/2 + kπ
    const erwartet: number[] = [];
    for (let k = -4; k <= 4; k++) erwartet.push((PI / 2 + k * PI + 1) / 2);
    const im = erwartet.filter((x) => x >= VON && x <= BIS).sort((a, b) => a - b);
    expect(c).toHaveLength(im.length);
    c.forEach((x, i) => expect(x).toBeCloseTo(im[i]!, 6));
    // √(sin x): Nullstellen am Rand des Definitionsbereichs bei −π, 0 und π (sin x ≥ 0 auf [−2π; −π], [0; π], [2π; 3π])
    const w = z('wurzel', 'sin');
    expect(w).toHaveLength(3);
    expect(w[0]).toBeCloseTo(-PI, 6);
    expect(w[1]).toBeCloseTo(0, 6);
    expect(w[2]).toBeCloseTo(PI, 6);
    const l = z('lin', 'sin'); // 2 sin x − 1 = 0
    l.forEach((x) => expect(2 * Math.sin(x) - 1).toBeCloseTo(0, 8));
    expect(l).toHaveLength(3); // x = π/6 und 5π/6 plus Vielfache von 2π im Bereich −5 bis 5
  });
  it('alle Paare gegen ein unabhängiges feines Raster, einschließlich Nullstellen am Rand des Definitionsbereichs', () => {
    const schritt = 1e-4;
    for (const p of paare) {
      const h = verkette(p.u, p.v);
      const werte: number[] = [];
      for (let i = 0; i <= (BIS - VON) / schritt; i++) werte.push(h(Math.round((VON + i * schritt) * 1e6) / 1e6));
      let anzahl = 0;
      for (let i = 0; i < werte.length; i++) {
        const a = werte[i]!;
        const b = werte[i + 1];
        if (Number.isNaN(a)) continue;
        if (b !== undefined && !Number.isNaN(b) && a * b < 0) {
          anzahl++;
          i++;
        } else if (Math.abs(a) < 1e-7 && i > 0 && i < werte.length - 1) {
          // Randpunkte des Ausschnitts zählen nicht: Dort kann nur der Schwanz einer abfallenden Funktion sehr klein sein (e^(x³) bei −5).
          const l = werte[i - 1];
          const r = b;
          const lok = l === undefined || Number.isNaN(l) || Math.abs(l) >= Math.abs(a);
          const rok = r === undefined || Number.isNaN(r) || Math.abs(r) >= Math.abs(a);
          if (lok && rok) anzahl++;
        } else if (((b !== undefined && Number.isNaN(b)) || (werte[i - 1] !== undefined && Number.isNaN(werte[i - 1]!)))) {
          // Rand des Definitionsbereichs mit einem Wert nahe 0: genauer nachrechnen
          let def = (VON + i * schritt);
          let undef = Number.isNaN(b ?? NaN) ? def + schritt : def - schritt;
          for (let k = 0; k < 60; k++) {
            const m = (def + undef) / 2;
            if (Number.isNaN(h(m))) undef = m;
            else def = m;
          }
          if (Math.abs(h(def)) < 1e-6) anzahl++;
        }
      }
      const z = nullstellenKette(h, VON, BIS);
      expect(z.length, id(p)).toBe(anzahl);
      for (const x of z) expect(Math.abs(h(x)), id(p)).toBeLessThan(1e-6);
    }
  });
});

describe('Gesamtanalyse', () => {
  it('Beispiel cos(2x − 1)', () => {
    const a = analysiereKette(findeKette('cos'), findeKette('lin'), VON, BIS);
    expect(a.definitionsbereich).toBe('\\mathbb{R}');
    expect(a.symmetrie).toBe('keine');
    expect(a.periode).toBeCloseTo(PI, 9);
    expect(a.nullstellen.length).toBeGreaterThan(4);
  });
});
