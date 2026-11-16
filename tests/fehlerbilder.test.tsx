import type { ComponentType, ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { fehlerbildVerstoesse, findeFehlerbild } from '../src/lib/eingabe';

vi.setConfig({ testTimeout: 120000 });

interface FeldAufruf {
  id: string;
  erwartet: number;
  toleranz?: number;
  fehlerbilder?: { wert: number; toleranz?: number; rueckmeldung: ReactNode }[];
}
const gesammelt: { nummer: string; felder: FeldAufruf[] }[] = [];

vi.mock('../src/components/Aufgabe', () => ({
  Aufgabe: (p: { nummer: string | number; felder: FeldAufruf[] }) => {
    gesammelt.push({ nummer: String(p.nummer), felder: p.felder });
    return null;
  },
}));
vi.mock('../src/components/AufKlick', () => ({ AufKlick: (p: { children: ReactNode }) => <div>{p.children}</div> }));

const module = import.meta.glob<{ default: ComponentType }>('../content/modules/*/index.tsx', { eager: true });

describe('Fehlerbilder: Bibliothek', () => {
  const bilder = [{ wert: -3, text: 'Vorzeichen' }, { wert: 2.5, text: 'Funktionswert', toleranz: 0.01 }];
  it('findet das passende Fehlerbild, auch als Bruch oder mit Komma eingegeben', () => {
    expect(findeFehlerbild('-3', bilder)?.text).toBe('Vorzeichen');
    expect(findeFehlerbild('−3', bilder)?.text).toBe('Vorzeichen');
    expect(findeFehlerbild('5/2', bilder)?.text).toBe('Funktionswert');
    expect(findeFehlerbild('2,505', bilder)?.text).toBe('Funktionswert');
  });
  it('gibt null zurück ohne Fehlerbilder, bei anderen Werten und bei unlesbaren Eingaben', () => {
    expect(findeFehlerbild('-3', undefined)).toBeNull();
    expect(findeFehlerbild('-3', [])).toBeNull();
    expect(findeFehlerbild('4', bilder)).toBeNull();
    expect(findeFehlerbild('2,52', bilder)).toBeNull();
    expect(findeFehlerbild('abc', bilder)).toBeNull();
    expect(findeFehlerbild('', bilder)).toBeNull();
  });
  it('nutzt ohne eigene Toleranz die Toleranz des Felds', () => {
    expect(findeFehlerbild('-3,004', bilder)).toBeNull();
    expect(findeFehlerbild('-3,004', bilder, 0.005)?.text).toBe('Vorzeichen');
  });
  it('meldet Fehlerbilder, die als richtig gelten würden oder sich überdecken', () => {
    expect(fehlerbildVerstoesse(3, undefined, [{ wert: -3 }, { wert: 2 }])).toEqual([]);
    expect(fehlerbildVerstoesse(3, undefined, [{ wert: 3 }])).toHaveLength(1);
    expect(fehlerbildVerstoesse(3, 0.01, [{ wert: 3.015, toleranz: 0.01 }])).toHaveLength(1);
    expect(fehlerbildVerstoesse(3, undefined, [{ wert: 2 }, { wert: 2 }])).toHaveLength(1);
    expect(fehlerbildVerstoesse(3, undefined, [{ wert: NaN }])).not.toEqual([]);
  });
});

describe('Fehlerbilder: alle Module', () => {
  const jeModul = Object.entries(module).map(([pfad, m]) => {
    gesammelt.length = 0;
    renderToStaticMarkup(<m.default />);
    return [pfad.split('/')[3]!, gesammelt.slice()] as const;
  });
  const mit = jeModul.flatMap(([id, aufgaben]) => aufgaben.flatMap((a) => a.felder.filter((f) => f.fehlerbilder).map((f) => ({ ort: `${id}, Aufgabe ${a.nummer}, Feld ${f.id}`, feld: f, modul: id }))));

  it('Die Pilotmodule haben Fehlerbilder', () => {
    const modulIds = new Set(mit.map((x) => x.modul));
    for (const id of ['tangenten', 'flaeche-kurve-x-achse']) expect(modulIds.has(id), id).toBe(true);
    expect(mit.length).toBeGreaterThanOrEqual(20);
  });
  it('Kein Fehlerbild gilt als richtig, keine zwei überdecken sich', () => {
    const verstoesse = mit.flatMap(({ ort, feld }) => fehlerbildVerstoesse(feld.erwartet, feld.toleranz, feld.fehlerbilder!).map((v) => `${ort}: ${v}`));
    expect(verstoesse).toEqual([]);
  });
  it('Die Rückmeldungen rendern ohne Formelfehler und ohne Gedankenstriche, enden mit Satzzeichen und nennen den richtigen Wert nicht als Zahl', () => {
    for (const { ort, feld } of mit) {
      for (const b of feld.fehlerbilder!) {
        const html = renderToStaticMarkup(<div>{b.rueckmeldung}</div>);
        expect(html, ort).not.toContain('katex-error');
        for (const z of ['–', '—']) expect(html, ort).not.toContain(z);
        const text = html.replace(/<annotation[^>]*>[^<]*<\/annotation>/g, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        expect(text.length, ort).toBeGreaterThan(20);
        expect(html, ort).toMatch(/[.?]\s*(<\/span>)*\s*<\/div>$/);
      }
    }
  });
});

describe('Baustein Aufgabe', () => {
  it('zeigt vor dem Prüfen keine Rückmeldung zu Fehlerbildern', async () => {
    const { Aufgabe } = await vi.importActual<typeof import('../src/components/Aufgabe')>('../src/components/Aufgabe');
    const html = renderToStaticMarkup(
      <Aufgabe nummer={1} titel="Test" felder={[{ id: 'a', name: 'a', beschriftung: 'a', erwartet: 3, fehlerbilder: [{ wert: -3, rueckmeldung: 'Prüfe das Vorzeichen.' }] }]} hilfen={[]} loesung={[]}>
        Text
      </Aufgabe>,
    );
    expect(html).not.toContain('Rückmeldung zu deiner Eingabe');
    expect(html).not.toContain('Prüfe das Vorzeichen.');
  });
});
