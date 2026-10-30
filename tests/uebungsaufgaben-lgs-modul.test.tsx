import { existsSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { BILD_A6, Verkehrsknoten } from '../content/modules/uebungsaufgaben-lgs/Bilder';
import { A1, A2, A3, A4, A5, A6, A7, A8 } from '../content/modules/uebungsaufgaben-lgs/daten';
import Modul from '../content/modules/uebungsaufgaben-lgs/index';
import meta from '../content/modules/uebungsaufgaben-lgs/meta.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { bewerte } from '../src/lib/eingabe';
import { bruch, erfuellt, gaussSchritte, loeseAllgemein, wendeAn, type Bruch, type Matrix } from '../src/lib/lgs';
import { cramer } from './lgs.test';

vi.setConfig({ testTimeout: 60000 });

interface AufgabeAufruf { nummer: string; children: ReactNode; felder: { id: string; erwartet: number; toleranz?: number; beschriftung: ReactNode }[]; hilfen: ReactNode[]; loesung: ReactNode[] }
const aufgaben: AufgabeAufruf[] = [];

vi.mock('../src/components/Aufgabe', () => ({
  Aufgabe: (p: AufgabeAufruf & { nummer: string | number }) => {
    aufgaben.push({ ...p, nummer: String(p.nummer) });
    return <div data-aufgabe={String(p.nummer)}>{p.children}</div>;
  },
}));
vi.mock('../src/components/AufKlick', () => ({ AufKlick: ({ children }: { children: ReactNode }) => <>{children}</> }));

function rendern(abschnitt: string | null = null): string {
  aufgaben.length = 0;
  return renderToStaticMarkup(
    <AbschnittAnbieter value={abschnitt}>
      <Modul />
    </AbschnittAnbieter>,
  );
}
const html = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const art = (m: Matrix) => loeseAllgemein(m).art;
const wert = (b: Bruch) => b.z / b.n;
const koeff = (m: Matrix) => {
  const l = loeseAllgemein(m);
  return l.art === 'mehrdeutig' ? l.x.map((a) => a.map(wert)) : null;
};
const feld = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!.erwartet;
const bereich = (von: number, bis: number) => Array.from({ length: bis - von + 1 }, (_, i) => von + i);

describe('Modul, Metadaten und Darstellung', () => {
  it('ist ein Modul des Themenbereichs Lineare Gleichungssysteme mit drei Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('uebungsaufgaben-lgs');
    expect(meta.thema).toBe('lineare-gleichungssysteme');
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.bpe).toEqual(['18.1']);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['hinweise', 'ohne-hilfsmittel', 'mit-hilfsmittel']);
    for (const a of meta.abschnitte) {
      const h = rendern(a.id);
      expect(h).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(h).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('rendert ohne Formelfehler, ohne Gedankenstriche und ohne Schrägstrich-Brüche', () => {
    const h = rendern(null);
    expect(h).not.toContain('formel-fehler');
    expect(h).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(h).not.toContain(z);
    expect(h).not.toMatch(/\d\/\d/);
    expect(h).toContain('Operatorenliste des Bildungsplans');
    for (const d of ['index.tsx', 'daten.ts', 'Bilder.tsx', 'Hinweise.tsx', 'OhneHilfsmittel.tsx', 'MitHilfsmittel.tsx']) {
      const q = readFileSync(`content/modules/uebungsaufgaben-lgs/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
    }
  });
  it('übernimmt keine Aufgabe der Vorlage: weder Systeme noch Texte', () => {
    const h = rendern(null);
    for (const s of ['x+y+z=12', '5x+10y+20z=150', 't^{2}-4t+3', 't^2-4t+3', '(4-a^2)', '2y+bz=1', '2x+z=0', '-y+2z=0', '2x-y-2z=11', '3x-y+2z=a', '-x+y=-3', '2x-2y=6', 'ax-3y=b', 'Hauptprüfung', 'Abitur 2025', 'natürliche Zahlen']) expect(h, s).not.toContain(s);
  });
  it('Operatoren stehen am Anfang jeder Teilaufgabe, jede Teilaufgabe hat Bewertungseinheiten', () => {
    const erlaubt = ['Angeben', 'Nennen', 'Begründen', 'Nachweisen', 'Zeigen', 'Berechnen', 'Beschreiben', 'Bestimmen', 'Ermitteln', 'Beurteilen', 'Deuten', 'Interpretieren', 'Erläutern', 'Entscheiden', 'Skizzieren', 'Untersuchen', 'Zeichnen'];
    let anzahl = 0;
    for (const d of ['OhneHilfsmittel.tsx', 'MitHilfsmittel.tsx']) {
      const q = readFileSync(`content/modules/uebungsaufgaben-lgs/${d}`, 'utf8');
      const teilaufgaben = [...q.matchAll(/<Teile[^>]*>([\s\S]*?)<\/Teile>/g)].flatMap((m) => [...m[1]!.matchAll(/<li>\s*([\s\S]*?)<\/li>/g)].map((x) => x[1]!.trim()));
      for (const z of teilaufgaben) {
        expect(erlaubt.some((o) => z.startsWith(o)), z.slice(0, 40)).toBe(true);
        expect(z, z.slice(0, 40)).toMatch(/<BE n=\{\d+\} \/>\s*$/);
        anzahl++;
      }
    }
    expect(anzahl).toBe(22);
  });
  it('Verweise auf Module führen zu vorhandenen Modulen', () => {
    for (const d of ['Hinweise.tsx', 'OhneHilfsmittel.tsx', 'MitHilfsmittel.tsx']) {
      const q = readFileSync(`content/modules/uebungsaufgaben-lgs/${d}`, 'utf8');
      for (const m of q.matchAll(/modul="([^"]+)"/g)) expect(existsSync(`content/modules/${m[1]}/meta.json`), m[1]).toBe(true);
    }
  });
});

describe('Aufgaben und Werte gegen die Rechnung', () => {
  it('Hilfen (drei Stufen), Lösungswege, Beschriftungen und Texte rendern ohne Formelfehler und Gedankenstriche, Aufgaben 1 bis 8 in Reihenfolge', () => {
    rendern(null);
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);
    for (const a of aufgaben) {
      expect(a.hilfen, a.nummer).toHaveLength(3);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(3);
      const teile: ReactNode[] = [a.children, ...a.hilfen, ...a.loesung, ...a.felder.map((f) => f.beschriftung)];
      for (const n of teile) {
        const h = html(n);
        expect(h, a.nummer).not.toContain('formel-fehler');
        expect(h, a.nummer).not.toContain('katex-error');
        for (const z of ['–', '—']) expect(h, a.nummer).not.toContain(z);
        expect(h, a.nummer).not.toMatch(/\d\/\d/);
      }
    }
  });
  it('alle erwarteten Werte werden als Eingabe richtig bewertet, ein falscher nicht', () => {
    rendern(null);
    for (const a of aufgaben) {
      const richtig = Object.fromEntries(a.felder.map((f) => [f.id, String(f.erwartet).replace('.', ',')]));
      expect(Object.values(bewerte(a.felder, richtig)).every((u) => u === 'richtig'), a.nummer).toBe(true);
      const falsch = Object.fromEntries(a.felder.map((f) => [f.id, String(f.erwartet + 1)]));
      expect(Object.values(bewerte(a.felder, falsch)).every((u) => u === 'falsch'), a.nummer).toBe(true);
    }
  });

  it('Aufgabe 1: genau eine Lösung außer für k = −1 (keine) und k = 2 (unendlich viele), Stufenform, Lösung für k = 0 und die Menge für k = 2', () => {
    rendern(null);
    for (const k of bereich(-12, 12)) expect(art(A1.matrix(k)), `k=${k}`).toBe(k === -1 ? 'unloesbar' : k === 2 ? 'mehrdeutig' : 'eindeutig');
    expect(feld('1', 'keine')).toBe(-1);
    expect(feld('1', 'unendlich')).toBe(2);
    // letzte Zeile (k² − k − 2)·z = k² − 4 nach den im Lösungsweg genannten Schritten
    for (const k of bereich(-6, 6)) {
      const m = wendeAn(A1.matrix(k), [{ art: 'ersetze', i: 1, a: 1, j: 0, b: -2 }, { art: 'ersetze', i: 2, a: 1, j: 0, b: -3 }, { art: 'ersetze', i: 2, a: 1, j: 1, b: -1 }]);
      expect(m, `k=${k}`).toEqual([[1, 2, 1, 5], [0, -1, -1, -2], [0, 0, k * k - k - 2, k * k - 4]]);
      expect(k * k - k - 2).toBe((k - 2) * (k + 1) + 0);
      expect(k * k - 4).toBe((k - 2) * (k + 2) + 0);
    }
    expect(loeseAllgemein(A1.matrix(0))).toEqual({ art: 'eindeutig', x: A1.k0.map((v) => bruch(v)) });
    expect(cramer(A1.matrix(0))).toEqual(A1.k0);
    expect(erfuellt(A1.matrix(0), A1.k0.map((v) => bruch(v)))).toBe(true);
    expect(['x', 'y', 'z'].map((id) => feld('1', id))).toEqual(A1.k0);
    expect(koeff(A1.matrix(2))).toEqual([[1, 1], [2, -1], [0, 1]]);
    expect(['x0', 'xt', 'y0', 'yt'].map((id) => feld('1', id))).toEqual([...A1.k2.x, ...A1.k2.y]);
    // z = (k + 2) durch (k + 1) für k = 0 gibt 2
    expect((0 + 2) / (0 + 1)).toBe(2);
  });
  it('Aufgabe 2: Lösungen in nichtnegativen ganzen Zahlen durch Abzählen, Parameterform der reellen Lösungsmenge', () => {
    rendern(null);
    expect(koeff(A2.matrix)).toEqual([[5, 2], [9, -3], [0, 1]]);
    const loesungen: number[][] = [];
    for (let x = 0; x <= 14; x++) for (let y = 0; y <= 14; y++) for (let z = 0; z <= 14; z++) if (x + y + z === 14 && 2 * x + 3 * y + 5 * z === 37) loesungen.push([x, y, z]);
    expect(loesungen).toEqual([[5, 9, 0], [7, 6, 1], [9, 3, 2], [11, 0, 3]]);
    expect(feld('2', 'anzahl')).toBe(loesungen.length);
    expect(feld('2', 'xmax')).toBe(Math.max(...loesungen.map((l) => l[0]!)));
    expect(['x0', 'xt', 'y0', 'yt'].map((id) => feld('2', id))).toEqual([...A2.x, ...A2.y]);
    for (const [x, y, z] of loesungen) expect([x, y]).toEqual([A2.x[0]! + A2.x[1]! * z!, A2.y[0]! + A2.y[1]! * z!]);
    const alle = aufgaben.find((a) => a.nummer === '2')!.loesung.map((s) => html(s)).join(' ');
    for (const s of ['(5;\\,9;\\,0)', '(7;\\,6;\\,1)', '(9;\\,3;\\,2)', '(11;\\,0;\\,3)']) expect(alle, s).toContain(s);
  });
  it('Aufgabe 3: für a = 0 keine, für a = 2 unendlich viele, sonst genau eine Lösung (ganzzahlige a von −60 bis 60), die Werte für a = 1 und a = 2', () => {
    rendern(null);
    const arten = bereich(-60, 60).map((a) => [a, art(A3.matrix(a))] as const);
    expect(arten.filter(([, x]) => x === 'unloesbar').map(([a]) => a)).toEqual([0]);
    expect(arten.filter(([, x]) => x === 'mehrdeutig').map(([a]) => a)).toEqual([2]);
    expect(arten.filter(([, x]) => x === 'eindeutig')).toHaveLength(121 - 2);
    // Faktorzerlegung: a² − 2a = a(a − 2) und a² − 4 = (a − 2)(a + 2)
    for (const a of bereich(-9, 9)) {
      expect(a * a - 2 * a).toBe(a * (a - 2) + 0);
      expect(a * a - 4).toBe((a - 2) * (a + 2) + 0);
    }
    expect(loeseAllgemein(A3.matrix(1))).toEqual({ art: 'eindeutig', x: A3.a1.map((v) => bruch(v)) });
    expect(['x', 'y', 'z'].map((id) => feld('3', id))).toEqual(A3.a1);
    expect(koeff(A3.matrix(2))).toEqual([[1, -2], [1, 2], [0, 1]]);
    expect(['x0', 'xt', 'y0', 'yt'].map((id) => feld('3', id))).toEqual([...A3.a2.x, ...A3.a2.y]);
    // Für a ≠ 0 und a ≠ 2 ist z = (a + 2) durch a
    for (const a of [1, 3, 4, -1, -3]) {
      const l = loeseAllgemein(A3.matrix(a));
      expect(l.art === 'eindeutig' && wert(l.x[2]!)).toBeCloseTo((a + 2) / a, 12);
    }
  });
  it('Aufgabe 4: keine Lösung nur für c = −1, sonst genau eine, nie unendlich viele; Lösung für c = 2', () => {
    rendern(null);
    for (const c of bereich(-30, 30)) expect(art(A4.matrix(c)), `c=${c}`).toBe(c === -1 ? 'unloesbar' : 'eindeutig');
    expect(feld('4', 'keine')).toBe(A4.keine);
    expect(loeseAllgemein(A4.matrix(2))).toEqual({ art: 'eindeutig', x: A4.c2.map((v) => bruch(v)) });
    expect(['x', 'y', 'z'].map((id) => feld('4', id))).toEqual(A4.c2);
    // (c + 1)·x = 3 für alle c
    for (const c of [0, 2, 5, -4]) {
      const l = loeseAllgemein(A4.matrix(c));
      expect(l.art === 'eindeutig' && wert(l.x[0]!)).toBeCloseTo(3 / (c + 1), 12);
    }
  });
  it('Aufgabe 5: (2; 1; 1) löst I und II, Gleichung III ist I + II mit a = 9: nie genau eine Lösung, für a = 9 unendlich viele (−60 bis 60)', () => {
    rendern(null);
    expect(erfuellt(A5.zwei, A5.loesung.map((v) => bruch(v)))).toBe(true);
    const m = A5.matrix(0);
    expect(m[2]!.slice(0, 3)).toEqual(m[0]!.slice(0, 3).map((k, c) => k + m[1]![c]!));
    expect(A5.zwei[0]![3]! + A5.zwei[1]![3]!).toBe(A5.a);
    for (const a of bereich(-60, 60)) expect(art(A5.matrix(a)), `a=${a}`).toBe(a === 9 ? 'mehrdeutig' : 'unloesbar');
    expect(feld('5', 'a')).toBe(A5.a);
    expect(koeff(A5.matrix(A5.a))).toEqual([[3, -1], [0, 1], [0, 1]]);
    expect([feld('5', 'x0'), feld('5', 'xt')]).toEqual(A5.x);
    // die Lösung aus Teil a gehört zur Menge (t = 1)
    expect([3 - 1, 1, 1]).toEqual(A5.loesung);
  });
  it('Aufgabe 6: II ist das Dreifache von I, dieselbe Gerade, Punkt für x = −2; unendlich viele Lösungen nur für a = 4 und b = 16, keine für a = 4 und b ≠ 16', () => {
    rendern(null);
    expect(A6.matrix[1]).toEqual(A6.matrix[0]!.map((v) => 3 * v));
    expect(art(A6.matrix)).toBe('mehrdeutig');
    // Gerade y = 2 − x durch 2 und Punkt
    const [x, y] = A6.punkt as [number, number];
    expect(A6.gerade.m * x + A6.gerade.c).toBe(y);
    expect(x + 2 * y).toBe(4);
    expect(3 * x + 6 * y).toBe(12);
    expect(feld('6', 'y')).toBe(y);
    for (const a of bereich(-8, 12)) for (const b of bereich(0, 30)) {
      const s: Matrix = [[1, 2, 4], [a, 8, b]];
      const erwartet = a === 4 ? (b === 16 ? 'mehrdeutig' : 'unloesbar') : 'eindeutig';
      expect(art(s), `a=${a} b=${b}`).toBe(erwartet);
    }
    expect([feld('6', 'a'), feld('6', 'b')]).toEqual([A6.a, A6.b]);
    expect(art([[1, 2, 4], [4, 8, 20]])).toBe('unloesbar');
    // Bild: Gerade durch die Punkte (0 | 2) und (−2 | 3)
    expect(BILD_A6.kurven[0]!.f(0)).toBe(2);
    expect(BILD_A6.kurven[0]!.f(-2)).toBe(3);
    expect(BILD_A6.punkte).toEqual([expect.objectContaining({ x: -2, y: 3 })]);
    expect(BILD_A6.beschreibung.length).toBeGreaterThan(40);
  });
  it('Aufgabe 7: Gleichungen und Prozentwerte, eindeutige Lösung (40; 30; 30), ohne Sorte C 8,75 kg Phosphor, Ziel nicht erreichbar', () => {
    rendern(null);
    const [na, nb, nc] = A7.anteil.N as [number, number, number];
    const [pa, pb, pc] = A7.anteil.P as [number, number, number];
    const m: Matrix = [[1, 1, 1, A7.gesamt], [na, nb, nc, A7.ziel.N * 100], [pa, pb, pc, A7.ziel.P * 100]];
    expect(cramer(m)).toEqual(A7.loesung);
    expect(loeseAllgemein(m)).toEqual({ art: 'eindeutig', x: A7.loesung.map((v) => bruch(v)) });
    const [a, b, c] = A7.loesung as [number, number, number];
    expect(a + b + c).toBe(100);
    expect(0.2 * a + 0.1 * b + 0.05 * c).toBeCloseTo(12.5, 12);
    expect(0.05 * a + 0.1 * b + 0.15 * c).toBeCloseTo(9.5, 12);
    expect(['a', 'b', 'c'].map((id) => feld('7', id))).toEqual(A7.loesung);
    // ohne C: zwei Gleichungen, zwei Unbekannte
    const zwei: Matrix = [[1, 1, 100], [na, nb, 1250]];
    expect(loeseAllgemein(zwei)).toEqual({ art: 'eindeutig', x: [bruch(A7.zweiSorten.a), bruch(A7.zweiSorten.b)] });
    const p = (pa * A7.zweiSorten.a + pb * A7.zweiSorten.b) / 100;
    expect(p).toBe(A7.zweiSorten.P);
    expect(feld('7', 'p')).toBe(p);
    expect(p).toBeLessThan(A7.ziel.P);
    // alle drei Gleichungen mit c = 0 haben keine Lösung
    expect(art([[1, 1, 0, 100], [na, nb, 0, 1250], [pa, pb, 0, 950]])).toBe('unloesbar');
    const alle = aufgaben.find((x) => x.nummer === '7')!.loesung.map((s) => html(s)).join(' ');
    expect(alle).toContain('matrixfolge');
    for (const s of ['8{,}75', 'a=25', 'b=75']) expect(alle, s).toContain(s);
  });
  it('Aufgabe 8: Knotengleichungen, Lösungsmenge (640 − t; t; 480 + t), größtes y und Bereich von z bei Baustelle (Abzählen)', () => {
    rendern(null);
    // Unbekannte in der Reihenfolge x, z, y: x + y = 640 und z − y = 480, y ist die freie Unbekannte
    const m: Matrix = [[1, 0, 1, A8.ein1], [0, 1, -1, A8.ein2]];
    expect(koeff(m)).toEqual([[640, -1], [480, 1], [0, 1]]);
    const l = loeseAllgemein(m);
    expect(l.art === 'mehrdeutig' && l.frei).toEqual([2]);
    expect([feld('8', 'x0'), feld('8', 'z0')]).toEqual([A8.x0, A8.z0]);
    const zul: number[][] = [];
    for (let y = 0; y <= 1000; y++) {
      const x = 640 - y;
      const z = 480 + y;
      if (x >= 0 && z >= 0) zul.push([x, y, z]);
    }
    expect(Math.max(...zul.map((v) => v[1]!))).toBe(feld('8', 'tmax'));
    const mitBaustelle = zul.filter((v) => v[1]! <= A8.yHoechstens);
    expect(Math.min(...mitBaustelle.map((v) => v[2]!))).toBe(feld('8', 'zmin'));
    expect(Math.max(...mitBaustelle.map((v) => v[2]!))).toBe(feld('8', 'zmax'));
    // Probe der Knoten für ein Beispiel
    for (const v of zul.slice(0, 700)) {
      expect(v[0]! + v[1]!).toBe(640);
      expect(v[1]! + 480).toBe(v[2]);
    }
    const h = renderToStaticMarkup(<Verkehrsknoten />);
    for (const s of ['640', '480', '>x<', '>y<', '>z<', 'K₁', 'K₂', 'role="img"', 'aria-label']) expect(h, s).toContain(s);
    expect(h).not.toContain('formel-fehler');
  });
  it('die Aufgaben nutzen den Gauß-Algorithmus des Moduls davor, die Schritte sind erlaubt', () => {
    for (const k of [0, 3, -2]) {
      const s = gaussSchritte(A1.matrix(k));
      expect(s.length).toBeGreaterThan(0);
    }
  });
});
