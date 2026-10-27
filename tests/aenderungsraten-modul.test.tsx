import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import meta from '../content/modules/aenderungsraten/meta.json';
import * as B from '../content/modules/aenderungsraten/Bilder';
import { BREMS, EXAKT, KOSTEN, NAEHERUNG, PFLANZE, RENN, SEKANTE, TOL2 } from '../content/modules/aenderungsraten/daten';
import Modul from '../content/modules/aenderungsraten/index';
import type { MessbildDaten } from '../src/components/Messbild';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { bewerte } from '../src/lib/eingabe';
import { differenzenquotient } from '../src/lib/aenderung';

vi.setConfig({ testTimeout: 30000 });

interface AufgabeAufruf { nummer: string; felder: { id: string; erwartet: number; toleranz?: number }[]; hilfen: unknown[]; loesung: unknown[] }
interface FrageAufruf { nummer: string; optionen: { id: string; richtig: boolean }[] }
const aufgaben: AufgabeAufruf[] = [];
const fragen: FrageAufruf[] = [];

vi.mock('../src/components/Aufgabe', () => ({
  Aufgabe: (p: AufgabeAufruf & { nummer: string | number }) => {
    aufgaben.push({ ...p, nummer: String(p.nummer) });
    return <div data-aufgabe={String(p.nummer)} />;
  },
}));
vi.mock('../src/components/Auswahlfrage', () => ({
  Auswahlfrage: (p: FrageAufruf) => {
    fragen.push(p);
    return <div data-frage={p.nummer} />;
  },
}));

function rendern(abschnitt: string | null = null): string {
  aufgaben.length = 0;
  fragen.length = 0;
  return renderToStaticMarkup(
    <AbschnittAnbieter value={abschnitt}>
      <Modul />
    </AbschnittAnbieter>,
  );
}
const feld = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!;

/** Unabhängige Ableitung: Richardson-Extrapolation aus zentralen Differenzen. */
function ableitung(f: (x: number) => number, x: number): number {
  const d = (h: number) => (f(x + h) - f(x - h)) / (2 * h);
  return (4 * d(1e-3) - d(2e-3)) / 3;
}
function bisektion(g: (x: number) => number, lo: number, hi: number): number {
  for (let i = 0; i < 100; i++) {
    const m = (lo + hi) / 2;
    if (g(lo) * g(m) <= 0) hi = m;
    else lo = m;
  }
  return (lo + hi) / 2;
}

describe('Metadaten und Darstellung', () => {
  it('Entwurf im Themenbereich Differentialrechnung mit vier Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('aenderungsraten');
    expect(meta.thema).toBe('differentialrechnung');
    expect(meta.bpe).toEqual(['6.1', '6.2', '12.1']);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung']);
    for (const a of meta.abschnitte) {
      const html = rendern(a.id);
      expect(html).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(html).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('rendert ohne Formelfehler, ohne Gedankenstriche und ohne Brüche mit Schrägstrich im Text', () => {
    const html = rendern(null);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(html).not.toContain(z);
    for (const d of ['index.tsx', 'Erklaeren.tsx', 'Entdecken.tsx', 'Ueberpruefen.tsx', 'Zusammenfassung.tsx', 'Bilder.tsx', 'daten.ts', 'Sekantenlabor.tsx']) {
      const q = readFileSync(`content/modules/aenderungsraten/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
      expect(q, d).not.toMatch(/<code>[^<]*\//);
    }
  });
  it('Erklären nennt noch keinen Grenzwert und keinen Differenzialquotienten (das wird entdeckt)', () => {
    const html = rendern('erklaeren');
    expect(html).not.toContain('Differenzialquotient');
    expect(html).not.toContain('\\lim');
    expect(html).not.toContain('Grenzwert');
    expect(html).toContain('Differenzenquotient');
  });
  it('Zusammenfassung nennt Differenzenquotient, Differenzialquotient, Sekante und Tangente', () => {
    const html = rendern('zusammenfassung');
    for (const w of ['Differenzenquotient', 'Differenzialquotient', 'Sekante', 'Tangente', 'erste Ableitung']) expect(html).toContain(w);
  });
});

describe('Aufgaben und Fragen', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Nummern, Hilfen und Lösungsschritte', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '2', '4', '5', '7', '9', '10', '11']);
    expect(fragen.map((q) => q.nummer)).toEqual(['3', '6', '8']);
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(2);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(2);
    }
  });
  it('Auswahlfragen: genau eine richtige Antwort, nicht immer an derselben Stelle', () => {
    const stellen = fragen.map((q) => {
      expect(q.optionen.filter((o) => o.richtig), q.nummer).toHaveLength(1);
      expect(q.optionen).toHaveLength(4);
      return q.optionen.findIndex((o) => o.richtig);
    });
    expect(new Set(stellen).size).toBeGreaterThan(1);
  });
});

describe('Aufgabenwerte gegen unabhängige Rechnung', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('1: Rennwagen, s(t) = 3t²', () => {
    const s = (t: number) => 3 * t * t;
    expect(feld('1', 'ds').erwartet).toBe(s(7) - s(3));
    expect(feld('1', 'dt').erwartet).toBe(4);
    expect(feld('1', 'v').erwartet).toBe((s(7) - s(3)) / (7 - 3));
    expect(feld('1', 'kmh').erwartet).toBeCloseTo(feld('1', 'v').erwartet * 3.6, 10);
    expect(feld('1', 'kmh').erwartet).toBeCloseTo(108, 10);
    expect(RENN.v3).toBeCloseTo(ableitung(s, 3), 6);
  });
  it('2: Pflanze, Differenzenquotienten aus der Tabelle', () => {
    const h = (t: number) => PFLANZE.h[PFLANZE.t.indexOf(t)]!;
    expect(feld('2', 'a').erwartet).toBeCloseTo((h(10) - h(0)) / 10, 12);
    expect(feld('2', 'b').erwartet).toBeCloseTo((h(15) - h(5)) / 10, 12);
    expect(feld('2', 'c').erwartet).toBeCloseTo((h(15) - h(10)) / 5, 12);
    // Die Änderungsraten der drei gleich langen Abschnitte wachsen (Aussage der Frage 3)
    const abschnitte = [0, 1, 2].map((i) => (PFLANZE.h[i + 1]! - PFLANZE.h[i]!) / 5);
    expect(abschnitte[0]!).toBeLessThan(abschnitte[1]!);
    expect(abschnitte[1]!).toBeLessThan(abschnitte[2]!);
    expect(abschnitte).toEqual([0.8, 1.4, 2.4]);
  });
  it('4: Sekante am Schaubild von 0,5 x²', () => {
    const f = (x: number) => 0.5 * x * x;
    expect(feld('4', 'dx').erwartet).toBe(6 - 2);
    expect(feld('4', 'dy').erwartet).toBe(f(6) - f(2));
    expect(feld('4', 'm').erwartet).toBeCloseTo(differenzenquotient(f, 2, 4), 12);
    expect(SEKANTE.m).toBe(4);
  });
  it('5: Tangente im Bremsvorgang, Steigung gegen die Ableitung, A und B liegen auf der Tangente', () => {
    const s = BREMS.s;
    const m = ableitung(s, 4);
    expect(feld('5', 'm').erwartet).toBeCloseTo(m, 5);
    const tg = (t: number) => s(4) + m * (t - 4);
    expect(tg(2)).toBeCloseTo(48, 5);
    expect(tg(6)).toBeCloseTo(80, 5);
    expect(feld('5', 'dt').erwartet).toBe(6 - 2);
    expect(feld('5', 'ds').erwartet).toBeCloseTo(tg(6) - tg(2), 5);
    expect(s(4)).toBe(64);
  });
  it('7: Näherungen für x³ bei 2 gehen gegen 12, auch unabhängig über kleinere h', () => {
    const f = (x: number) => x ** 3;
    for (const [id, h] of [['a', 0.1], ['b', 0.01], ['c', 0.001]] as const) {
      const wert = (f(2 + h) - f(2)) / h;
      expect(feld('7', id).erwartet).toBeCloseTo(wert, 8);
      expect(feld('7', id).toleranz).toBe(TOL2);
      // Rundung auf zwei Stellen wird akzeptiert, die Näherung ist nicht 12 genau
      const gerundet = String(Math.round(wert * 100) / 100).replace('.', ',');
      expect(bewerte([{ id: 'x', erwartet: wert, toleranz: TOL2 }], { x: gerundet }).x).toBe('richtig');
    }
    expect(NAEHERUNG.d1).toBeGreaterThan(NAEHERUNG.d2);
    expect(NAEHERUNG.d2).toBeGreaterThan(NAEHERUNG.d3);
    expect(NAEHERUNG.d3).toBeGreaterThan(12);
    expect(ableitung(f, 2)).toBeCloseTo(12, 5);
  });
  it('9: f′(3) = 13 und f′(1) = 5 für 2x² + x, auch über Differenzenquotienten', () => {
    expect(feld('9', 'a').erwartet).toBeCloseTo(ableitung(EXAKT.f, 3), 5);
    expect(feld('9', 'b').erwartet).toBeCloseTo(ableitung(EXAKT.f, 1), 5);
    for (const x0 of [1, 3]) {
      for (const h of [1e-4, -1e-4]) expect(differenzenquotient(EXAKT.f, x0, h)).toBeCloseTo(EXAKT.df(x0), 3);
    }
    // vereinfachte Terme der Lösung: für x ≠ x0 gleich dem Differenzenquotienten
    for (const x of [1.5, 2, 3.5, 4]) expect((EXAKT.f(x) - EXAKT.f(3)) / (x - 3)).toBeCloseTo(2 * x + 7, 10);
    for (const x of [0.5, 1.5, 2]) expect((EXAKT.f(x) - EXAKT.f(1)) / (x - 1)).toBeCloseTo(2 * x + 3, 10);
  });
  it('10: Bremsvorgang, s′(t0) = 24 − 4 t0, Stillstand bei 6 s (Hochpunkt von s)', () => {
    const s = BREMS.s;
    expect(feld('10', 'a').erwartet).toBeCloseTo(ableitung(s, 0), 5);
    expect(feld('10', 'b').erwartet).toBeCloseTo(ableitung(s, 4), 5);
    const t0 = feld('10', 'c').erwartet;
    expect(ableitung(s, t0)).toBeCloseTo(0, 5);
    expect(bisektion((t) => ableitung(s, t), 1, 10)).toBeCloseTo(t0, 5);
    // s steigt bis 6 und ist dort am größten, der Term des Differenzenquotienten stimmt
    expect(Math.max(...Array.from({ length: 601 }, (_, i) => s(i / 100)))).toBeCloseTo(s(6), 8);
    for (const t of [0.5, 2, 5]) expect((s(t) - s(4)) / (t - 4)).toBeCloseTo(24 - 2 * (t + 4), 10);
  });
  it('11: Kostenfunktion, mittlere und momentane Änderungsrate, Mehrkosten', () => {
    const k = KOSTEN.k;
    expect(feld('11', 'a').erwartet).toBeCloseTo((k(20) - k(10)) / 10, 12);
    expect(feld('11', 'b').erwartet).toBeCloseTo(ableitung(k, 10), 5);
    expect(feld('11', 'c').erwartet).toBeCloseTo(k(11) - k(10), 12);
    // Grenzkosten sind eine gute Näherung für die Mehrkosten der nächsten Einheit
    expect(Math.abs(feld('11', 'b').erwartet - feld('11', 'c').erwartet)).toBeLessThan(1);
  });
});

describe('Schaubilder', () => {
  const alle: [string, MessbildDaten][] = Object.entries(B).filter(([, v]) => typeof v === 'object' && v !== null && 'kurven' in (v as object)) as [string, MessbildDaten][];
  it('es gibt alle Schaubilder, jedes mit Beschreibung, Punkte außer Lücken liegen auf einer Kurve', () => {
    expect(alle.length).toBeGreaterThanOrEqual(16);
    for (const [name, b] of alle) {
      expect(b.beschreibung.length, name).toBeGreaterThan(60);
      for (const p of b.punkte ?? []) {
        if (p.offen) continue;
        const nahe = b.kurven.some((k) => (k.von === undefined || p.x >= k.von - 1e-9) && (k.bis === undefined || p.x <= k.bis + 1e-9) && Math.abs(k.f(p.x) - p.y) < 1e-6);
        expect(nahe, `${name}: Punkt (${p.x} | ${p.y})`).toBe(true);
      }
    }
  });
  it('gestrichelte Geraden sind Tangenten an die erste Kurve: Berührpunkt und Steigung stimmen', () => {
    for (const [name, b] of alle) {
      const f = b.kurven[0]!.f;
      for (const k of b.kurven.slice(1).filter((x) => x.gestrichelt)) {
        const m = k.f(1) - k.f(0);
        // Berührstelle: dort ist die Gerade gleich f, und die Steigungen stimmen überein
        let gefunden = false;
        for (let i = 0; i <= 3000; i++) {
          const x = b.bereich[0] + ((b.bereich[1] - b.bereich[0]) * i) / 3000;
          if (Math.abs(k.f(x) - f(x)) < 1e-2 && Math.abs(ableitung(f, x) - m) < 1e-2) gefunden = true;
        }
        expect(gefunden, `${name}: Tangente mit Steigung ${m}`).toBe(true);
      }
    }
  });
  it('durchgezogene blaue oder grüne Geraden sind Sekanten: sie schneiden die erste Kurve in zwei Punkten, deren x-Abstand zur Beschriftung passt', () => {
    const sek = [B.BILD_SEKANTE_RENN, B.BILD_QUAD_RECHTS, B.BILD_QUAD_LINKS, B.BILD_KUB, B.BILD_UEBERSICHT, B.BILD_BREMS_VERGLEICH, B.BILD_KOSTEN];
    for (const b of sek) {
      const f = b.kurven[0]!.f;
      for (const k of b.kurven.slice(1).filter((x) => !x.gestrichelt)) {
        let schnitte = 0;
        let vorher = k.f(-1) - f(-1);
        for (let i = -99; i <= 3000; i++) {
          const x = i / 100;
          const d = k.f(x) - f(x);
          if (vorher * d < 0 || Math.abs(d) < 1e-9) schnitte++;
          vorher = d;
        }
        expect(schnitte).toBeGreaterThanOrEqual(2);
      }
    }
  });
  it('Zahlen der Bildunterschriften: Sekantensteigungen des Rennwagens und Tangentensteigungen', () => {
    const s = RENN.s;
    expect(differenzenquotient(s, 3, 4)).toBe(30);
    expect(differenzenquotient(s, 3, 1)).toBe(21);
    expect(ableitung(s, 3)).toBeCloseTo(18, 5);
    for (const [t0, m] of [[1, 6], [2, 12], [3, 18]] as const) expect(ableitung(s, t0)).toBeCloseTo(m, 5);
    const kub = (x: number) => x ** 3 - 3 * x;
    expect(differenzenquotient(kub, 1.5, 0.5)).toBeCloseTo(6.25, 12);
    expect(ableitung(kub, 1.5)).toBeCloseTo(3.75, 5);
    expect(differenzenquotient((x) => x * x, 1, 2)).toBe(4);
    expect(differenzenquotient((x) => x * x, 1, -1)).toBe(1);
    expect(differenzenquotient(BREMS.s, 0, 4)).toBe(16);
    expect(differenzenquotient(KOSTEN.k, 10, 10)).toBe(17);
  });
});
