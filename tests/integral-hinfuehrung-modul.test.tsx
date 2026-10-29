import { readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/integral-hinfuehrung/Bilder';
import { laborFormeln } from '../content/modules/integral-hinfuehrung/Bestandslabor';
import { AKKU, BECKEN, ERSATZ, NAEHERUNG, PARABEL, PARZELLE, SZENARIEN, TANK, TONNE, UFER, V1, V2, WIND, ZUG } from '../content/modules/integral-hinfuehrung/daten';
import Modul from '../content/modules/integral-hinfuehrung/index';
import meta from '../content/modules/integral-hinfuehrung/meta.json';
import { STREIFEN_FUNKTIONEN } from '../content/modules/integral-hinfuehrung/Streifenlabor';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { FLAECHE_BLAU, FLAECHE_GELB, FLAECHE_ROSA, schwerpunkt, type Flaeche, type FlaechenbildDaten } from '../src/components/Flaechenbild';
import { BLAU, ORANGE, type MessbildDaten } from '../src/components/Messbild';
import { bewerte } from '../src/lib/eingabe';
import { bestand, bilanz, obersumme, rateBei, streifen, untersumme } from '../src/lib/flaeche';
import { rendereFormel } from '../src/lib/formel';

vi.setConfig({ testTimeout: 60000 });

interface AufgabeAufruf { nummer: string; children: ReactNode; felder: { id: string; erwartet: number; toleranz?: number; beschriftung: ReactNode }[]; hilfen: ReactNode[]; loesung: ReactNode[] }
interface FrageAufruf { nummer: string; children: ReactNode; optionen: { id: string; richtig: boolean; text: ReactNode; rueckmeldung: ReactNode }[]; erklaerung: ReactNode }
const aufgaben: AufgabeAufruf[] = [];
const fragen: FrageAufruf[] = [];

vi.mock('../src/components/Aufgabe', () => ({
  Aufgabe: (p: AufgabeAufruf & { nummer: string | number }) => {
    aufgaben.push({ ...p, nummer: String(p.nummer) });
    return <div data-aufgabe={String(p.nummer)}>{p.children}</div>;
  },
}));
vi.mock('../src/components/Auswahlfrage', () => ({
  Auswahlfrage: (p: FrageAufruf) => {
    fragen.push(p);
    return <div data-frage={p.nummer}>{p.children}</div>;
  },
}));
// Kontrollschaubilder werden im Test immer gerendert.
vi.mock('../src/components/AufKlick', () => ({ AufKlick: ({ children }: { children: ReactNode }) => <>{children}</> }));

function rendern(abschnitt: string | null = null): string {
  aufgaben.length = 0;
  fragen.length = 0;
  return renderToStaticMarkup(
    <AbschnittAnbieter value={abschnitt}>
      <Modul />
    </AbschnittAnbieter>,
  );
}
const html = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const feld = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!;

/** Unabhängige Hilfen. */
function mittelpunkt(f: (x: number) => number, a: number, b: number, n = 200000): number {
  let s = 0;
  for (let i = 0; i < n; i++) s += f(a + ((i + 0.5) * (b - a)) / n);
  return (s * (b - a)) / n;
}
function gauss(p: [number, number][]): number {
  let s = 0;
  for (let i = 0; i < p.length; i++) {
    const [x1, y1] = p[i]!;
    const [x2, y2] = p[(i + 1) % p.length]!;
    s += x1 * y2 - x2 * y1;
  }
  return Math.abs(s) / 2;
}
const innen = (pt: [number, number], p: [number, number][]) => {
  let drin = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, yi] = p[i]!;
    const [xj, yj] = p[j]!;
    if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) drin = !drin;
  }
  return drin;
};
const abstand = (a: string, b: string) => {
  const c = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const [x, y] = [c(a), c(b)];
  return Math.hypot(x[0]! - y[0]!, x[1]! - y[1]!, x[2]! - y[2]!);
};

describe('Metadaten und Darstellung', () => {
  it('Modul im Themenbereich Integralrechnung mit vier Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('integral-hinfuehrung');
    expect(meta.thema).toBe('integralrechnung');
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.bpe).toEqual(['13.1']);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung']);
    for (const a of meta.abschnitte) {
      const h = rendern(a.id);
      expect(h).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(h).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('rendert ohne Formelfehler, ohne Gedankenstriche und ohne Schrägstrich-Brüche im Quelltext', () => {
    const h = rendern(null);
    expect(h).not.toContain('formel-fehler');
    expect(h).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(h).not.toContain(z);
    for (const d of ['index.tsx', 'Erklaeren.tsx', 'Entdecken.tsx', 'Ueberpruefen.tsx', 'Zusammenfassung.tsx', 'Bilder.tsx', 'daten.ts', 'Bestandslabor.tsx', 'Streifenlabor.tsx']) {
      const q = readFileSync(`content/modules/integral-hinfuehrung/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
      expect(q, d).not.toMatch(/<code>[^<]*\//);
      expect(q, d).not.toMatch(/\bpi\b/i);
    }
  });
  it('Hilfen, Lösungsschritte, Feldbeschriftungen, Antworten, Rückmeldungen und Erklärungen rendern ohne Formelfehler und ohne Gedankenstriche', () => {
    rendern(null);
    const teile: ReactNode[] = [];
    for (const a of aufgaben) teile.push(a.children, ...a.hilfen, ...a.loesung, ...a.felder.map((f) => f.beschriftung));
    for (const q of fragen) teile.push(q.children, q.erklaerung, ...q.optionen.flatMap((o) => [o.text, o.rueckmeldung]));
    for (const n of teile) {
      const h = html(n);
      expect(h).not.toContain('formel-fehler');
      for (const z of ['–', '—']) expect(h).not.toContain(z);
    }
  });
  it('Erklären nimmt nichts vorweg, Zusammenfassung nennt die Begriffe', () => {
    const e = rendern('erklaeren');
    for (const w of ['orientiert', 'Ersatzrate', 'Grenzwert', 'Bilanz', 'Flächeninhalt zwischen']) expect(e, w).not.toContain(w);
    for (const w of ['Bestand', 'Änderungsrate', 'Untersumme', 'Obersumme', 'Trapez']) expect(e, w).toContain(w);
    const z = rendern('zusammenfassung');
    for (const w of ['orientierten Flächeninhalt', 'Untersumme', 'Obersumme', 'Ersatzrate', 'Anfangsbestand', 'Aufsummieren', 'Mittelwert', 'Bestand rekonstruieren']) expect(z, w).toContain(w);
  });
  it('Labore rendern ihre Zeichnung mit Textalternative', () => {
    const h = rendern('entdecken');
    expect(h.match(/role="img"/g)!.length).toBeGreaterThanOrEqual(6);
    expect(h).toContain('Schaubild der Zuflussrate in l pro min über der Zeit t in min');
    expect(h).toContain('Schaubild des Bestands');
    expect(h).toContain('Untersumme');
  });
});

describe('Aufgaben und Fragen', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Nummern, Hilfen und Lösungsschritte', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '2', '3', '4', '6', '8', '9']);
    expect(fragen.map((q) => q.nummer)).toEqual(['5', '7', '10', '11']);
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(2);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(2);
    }
  });
  it('Auswahlfragen: genau eine richtige Antwort, vier Antworten, nicht immer an derselben Stelle, jede mit Rückmeldung', () => {
    const stellen = fragen.map((q) => {
      expect(q.optionen.filter((o) => o.richtig), q.nummer).toHaveLength(1);
      expect(q.optionen).toHaveLength(4);
      for (const o of q.optionen) expect(html(o.rueckmeldung).length).toBeGreaterThan(5);
      return q.optionen.findIndex((o) => o.richtig);
    });
    expect(new Set(stellen).size).toBeGreaterThan(2);
  });
  it('Aufgabenstellungen beginnen mit einem Operator der Liste des Bildungsplans', () => {
    const op = /^(Bestimme|Berechne|Beschreibe|Begründe|Deute|Erkläre|Gib|Zeige|Welche|Das|Ein|Die|Gegeben|In|Eine|Der)/;
    for (const a of aufgaben) expect(html(a.children).replace(/<[^>]+>/g, ''), a.nummer).toMatch(op);
    const text = rendern(null).replace(/<[^>]+>/g, ' ');
    for (const o of ['Berechne', 'Bestimme']) expect(text).toContain(o);
  });
});

describe('Aufgabenwerte gegen unabhängige Rechnung', () => {
  beforeEach(() => {
    rendern(null);
  });
  const fn = (s: typeof WIND.stuecke) => (t: number) => rateBei(s, t);
  it('1: Windpark, Energie je Abschnitt und insgesamt', () => {
    const f = fn(WIND.stuecke);
    expect(feld('1', 'e1').erwartet).toBeCloseTo(mittelpunkt(f, 0, 3), 3);
    expect(feld('1', 'e2').erwartet).toBeCloseTo(mittelpunkt(f, 3, 5), 3);
    expect(feld('1', 'e3').erwartet).toBeCloseTo(mittelpunkt(f, 5, 9), 3);
    expect(feld('1', 'ges').erwartet).toBeCloseTo(mittelpunkt(f, 0, 9), 3);
    expect(feld('1', 'ges').erwartet).toBe(4 * 3 + 7 * 2 + 2 * 4);
  });
  it('2: Zug, Dreieck und Rechteck', () => {
    const f = fn(ZUG.stuecke);
    expect(f(12)).toBe(24);
    expect(feld('2', 's1').erwartet).toBeCloseTo(mittelpunkt(f, 0, 12), 3);
    expect(feld('2', 's2').erwartet).toBeCloseTo(mittelpunkt(f, 12, 32), 3);
    expect(feld('2', 'ges').erwartet).toBeCloseTo(mittelpunkt(f, 0, 32), 3);
  });
  it('3: Regentonne, zugeflossene Menge und Bestand', () => {
    const f = fn(TONNE.stuecke);
    expect(f(30)).toBe(1);
    expect(feld('3', 'aend').erwartet).toBeCloseTo(mittelpunkt(f, 0, 30), 3);
    expect(feld('3', 'ende').erwartet).toBeCloseTo(35 + mittelpunkt(f, 0, 30), 3);
  });
  it('4: Batteriespeicher, Änderung, Ende und kleinste Energie (Raster, unabhängig)', () => {
    const f = fn(AKKU.stuecke);
    expect(feld('4', 'aend').erwartet).toBeCloseTo(mittelpunkt(f, 0, 7), 3);
    expect(feld('4', 'ende').erwartet).toBeCloseTo(12 + mittelpunkt(f, 0, 7), 3);
    let min = Infinity;
    let tMin = 0;
    for (let i = 0; i <= 7000; i++) {
      const t = i / 1000;
      const b = 12 + mittelpunkt(f, 0, t, Math.max(10, i * 4));
      if (b < min) { min = b; tMin = t; }
    }
    expect(feld('4', 'min').erwartet).toBeCloseTo(min, 2);
    expect(tMin).toBeCloseTo(AKKU.tMin, 2);
    expect(min).toBeGreaterThan(0);
  });
  it('6: Untersumme und Obersumme, Werte unabhängig aus den Funktionswerten', () => {
    for (const [n, id] of [[4, '4'], [8, '8']] as const) {
      const w = 4 / n;
      let u = 0;
      let o = 0;
      for (let i = 0; i < n; i++) {
        const werte = Array.from({ length: 1001 }, (_, k) => PARABEL.f(i * w + (w * k) / 1000));
        u += w * Math.min(...werte);
        o += w * Math.max(...werte);
      }
      expect(feld('6', `u${id}`).erwartet).toBeCloseTo(u, 6);
      expect(feld('6', `o${id}`).erwartet).toBeCloseTo(o, 6);
      expect(u).toBeLessThan(44 / 3);
      expect(o).toBeGreaterThan(44 / 3);
    }
    expect(feld('6', 'u8').toleranz).toBe(0.01);
    expect(bewerte([{ id: 'x', erwartet: 12.75, toleranz: 0.01 }], { x: '12,75' }).x).toBe('richtig');
    expect(bewerte([{ id: 'x', erwartet: 11 }], { x: '11' }).x).toBe('richtig');
    expect(bewerte([{ id: 'x', erwartet: 11 }], { x: '12' }).x).toBe('falsch');
  });
  it('8: Parzelle, Trapeze gegen die Integration des Streckenzugs, Kaufpreis', () => {
    const w = PARZELLE.breiten;
    const f = (x: number) => {
      const i = Math.min(Math.floor(x / 10), w.length - 2);
      return w[i]! + ((w[i + 1]! - w[i]!) * (x - i * 10)) / 10;
    };
    expect(feld('8', 'a').erwartet).toBeCloseTo(mittelpunkt(f, 0, 50), 3);
    expect(feld('8', 'k').erwartet).toBe(feld('8', 'a').erwartet * 85);
  });
  it('9: Gesamtmenge und Ersatzrate, der Mittelwert der Raten wäre falsch', () => {
    const f = fn(ERSATZ.stuecke);
    expect(feld('9', 'ges').erwartet).toBeCloseTo(mittelpunkt(f, 0, 8), 3);
    expect(feld('9', 'rate').erwartet).toBeCloseTo(mittelpunkt(f, 0, 8) / 8, 3);
    expect(feld('9', 'rate').toleranz).toBe(0.01);
    expect(ERSATZ.falsch).not.toBeCloseTo(feld('9', 'rate').erwartet, 0);
    expect(NAEHERUNG.n4.unter).toBe(11);
  });
});

describe('Labore: alle Formeln aller Reglerstellen', () => {
  it('Bestandslabor erzeugt für beide Situationen, jede Zeit und jeden Anfangsbestand gültige Formeln', () => {
    for (const sz of SZENARIEN) {
      const ende = sz.stuecke[sz.stuecke.length - 1]!.t1;
      for (let t = 0; t <= ende; t += 0.5) {
        for (let b0 = sz.b0Min; b0 <= sz.b0Max; b0 += 10) {
          for (const tex of Object.values(laborFormeln(sz, t, b0))) {
            expect(rendereFormel(tex, false).ok, `${sz.id} ${t} ${b0} ${tex}`).toBe(true);
            expect(tex).not.toContain('+-');
          }
        }
      }
    }
  });
  it('Bestand im Labor: nie negativ bei den erlaubten Anfangsbeständen', () => {
    for (const sz of SZENARIEN) {
      const ende = sz.stuecke[sz.stuecke.length - 1]!.t1;
      for (let t = 0; t <= ende; t += 0.25) expect(bestand(sz.stuecke, sz.b0Min, t), `${sz.id} ${t}`).toBeGreaterThanOrEqual(0);
    }
    // Der größte Bestand passt in das Fenster des unteren Schaubilds
    for (const sz of SZENARIEN) {
      const ende = sz.stuecke[sz.stuecke.length - 1]!.t1;
      let max = 0;
      for (let t = 0; t <= ende; t += 0.25) max = Math.max(max, bestand(sz.stuecke, sz.b0Max, t));
      expect(max).toBeLessThan(sz.bereichBestand[3]);
    }
  });
  it('Streifenlabor: Funktionen, Stufen und Bereiche passen', () => {
    for (const f of STREIFEN_FUNKTIONEN) {
      expect(f.stufen.every((n) => Number.isInteger(n))).toBe(true);
      const [xmin, xmax, ymin, ymax] = f.bereich;
      expect(xmin).toBeLessThan(f.a);
      expect(xmax).toBeGreaterThan(f.b);
      let max = 0;
      for (let i = 0; i <= 1000; i++) max = Math.max(max, f.f(f.a + ((f.b - f.a) * i) / 1000));
      expect(max).toBeLessThan(ymax);
      expect(ymin).toBeLessThan(0);
      for (const n of f.stufen) {
        const z = streifen(f.f, f.a, f.b, n);
        expect(obersumme(z)).toBeGreaterThan(untersumme(z));
      }
    }
  });
});

const flaechenBilder = (Object.entries(B) as [string, unknown][]).filter(([n, v]) => n.startsWith('BILD_') && typeof v === 'object') as [string, FlaechenbildDaten & MessbildDaten][];

describe('Schaubilder', () => {
  it('jedes Schaubild hat eine Textalternative ohne Gedankenstriche, Punkte liegen im Fenster', () => {
    expect(flaechenBilder.length).toBeGreaterThan(20);
    for (const [name, d] of flaechenBilder) {
      expect(d.beschreibung.length, name).toBeGreaterThan(30);
      for (const z of ['–', '—']) expect(d.beschreibung, name).not.toContain(z);
      const [xmin, xmax, ymin, ymax] = d.bereich;
      for (const f of d.flaechen ?? []) for (const [x, y] of f.punkte) {
        expect(x, name).toBeGreaterThanOrEqual(xmin);
        expect(x, name).toBeLessThanOrEqual(xmax);
        expect(y, name).toBeGreaterThanOrEqual(ymin);
        expect(y, name).toBeLessThanOrEqual(ymax);
      }
    }
  });
  const betraege = (d: FlaechenbildDaten) => (d.flaechen ?? []).filter((f: Flaeche) => !f.umriss).map((f) => gauss(f.punkte)).filter((a) => a > 0);
  it('Flächen der Schaubilder stimmen mit den Rechnungen überein', () => {
    expect(betraege(B.BILD_V1)).toEqual(V1.flaechen);
    expect(betraege(B.BILD_V2).sort((a, b) => b - a)).toEqual([12, 12, 3]);
    expect(betraege(B.BILD_BECKEN_FLAECHEN)).toEqual([72, 192, 72, 24]);
    expect(betraege(B.BILD_WIND)).toEqual(WIND.energien);
    expect(betraege(B.BILD_ZUG)).toEqual(ZUG.wege);
    expect(betraege(B.BILD_TONNE)).toEqual([30, 40]);
    expect(betraege(B.BILD_AKKU)).toEqual([10, 12, 4]);
    expect(betraege(B.BILD_PARZELLE).reduce((a, b) => a + b, 0)).toBeCloseTo(PARZELLE.flaeche, 10);
    expect(betraege(B.BILD_FALLEND_RATE)).toEqual([140]);
  });
  it('Vorzeichen der Flächen: oberhalb blau oder gelb, unterhalb rosa', () => {
    for (const f of B.BILD_V2.flaechen!) {
      const unten = f.punkte.some(([, y]) => y < 0);
      expect(f.farbe === FLAECHE_ROSA, 'rosa gehört zu negativen Flächen').toBe(unten);
    }
    for (const f of B.BILD_AKKU.flaechen!) expect(f.farbe === FLAECHE_ROSA).toBe(f.punkte.some(([, y]) => y < 0));
  });
  it('Streifen: gefüllte Rechtecke ergeben die Untersumme, gestrichelte die Obersumme', () => {
    for (const [d, f, a, b, n] of [[B.BILD_UFER_5, UFER.f, 0, 50, 5], [B.BILD_UFER_25, UFER.f, 0, 50, 25], [B.BILD_PARABEL_4(4, true, true), PARABEL.f, 0, 4, 4], [B.BILD_PARABEL_4(8, true, true), PARABEL.f, 0, 4, 8]] as const) {
      const gefuellt = (d.flaechen ?? []).filter((x) => !x.umriss).reduce((s, x) => s + gauss(x.punkte), 0);
      expect(gefuellt).toBeCloseTo(untersumme(streifen(f, a, b, n)), 8);
      const ober = (d.flaechen ?? []).filter((x) => x.umriss).reduce((s, x) => s + gauss(x.punkte), 0);
      if (ober) expect(ober).toBeCloseTo(obersumme(streifen(f, a, b, n)), 8);
    }
    expect(B.BILD_UFER_FRAGE.flaechen).toHaveLength(0);
    expect(B.BILD_UFER_0.beschreibung).not.toMatch(/1160|1650/);
    expect(B.BILD_UFER_5.beschreibung).toContain('1160');
  });
  it('Beschriftungen A₁, A₂ … stehen innerhalb ihrer Fläche', () => {
    for (const [name, d] of flaechenBilder) {
      for (const f of d.flaechen ?? []) {
        if (!f.text) continue;
        const pos = f.textPos ?? schwerpunkt(f.punkte);
        expect(innen(pos, f.punkte), `${name} ${f.text}`).toBe(true);
      }
    }
  });
  it('Linien liegen auf der Rate, Ersatzrechtecke haben den Flächeninhalt der Fläche', () => {
    for (const [d, s] of [[B.BILD_V1, V1.stuecke], [B.BILD_BECKEN_FLAECHEN, BECKEN.stuecke], [B.BILD_WIND, WIND.stuecke], [B.BILD_AKKU, AKKU.stuecke]] as const) {
      for (const [x, y] of d.linien![0]!.punkte) if (!Number.isNaN(x)) expect([y, rateBei(s as never, x - 1e-9), rateBei(s as never, x + 1e-9)].some((v) => Math.abs(v - y) < 1e-6)).toBe(true);
    }
    const rechteck = (d: FlaechenbildDaten) => gauss(d.flaechen!.find((f) => f.umriss)!.punkte);
    expect(rechteck(B.BILD_ERSATZ_BECKEN)).toBeCloseTo(bilanz(BECKEN.stuecke, 0, 24), 10);
    expect(rechteck(B.BILD_ERSATZ)).toBeCloseTo(bilanz(ERSATZ.stuecke, 0, 8), 10);
  });
  it('Bestandskurven und Tangente: Punkt, Steigung und Hochpunkt stimmen', () => {
    const t = B.BILD_BESTAND_BECKEN.kurven[1]!;
    expect(t.f(10)).toBeCloseTo(bestand(BECKEN.stuecke, 0, 10), 10);
    expect(t.f(11) - t.f(10)).toBeCloseTo(24, 10);
    expect(B.BILD_BESTAND_BECKEN.punkte![0]!.y).toBe(168);
    expect(B.BILD_TANK_HOCH.punkte![0]).toMatchObject({ x: 4, y: 61 });
    expect(B.BILD_ANFANGSBESTAND.kurven[0]!.f(0) - B.BILD_ANFANGSBESTAND.kurven[1]!.f(0)).toBe(20);
    expect(B.BILD_ANFANGSBESTAND.kurven[0]!.f(7) - B.BILD_ANFANGSBESTAND.kurven[1]!.f(7)).toBeCloseTo(20, 12);
    expect(B.BILD_FALLEND_BESTAND.kurven[0]!.f(10)).toBe(140);
  });
  it('Farben lassen sich unterscheiden', () => {
    expect(abstand(FLAECHE_BLAU, FLAECHE_GELB)).toBeGreaterThan(150);
    expect(abstand(FLAECHE_BLAU, FLAECHE_ROSA)).toBeGreaterThan(150);
    expect(abstand(FLAECHE_GELB, FLAECHE_ROSA)).toBeGreaterThan(100);
    expect(abstand(ORANGE, BLAU)).toBeGreaterThan(150);
    expect(abstand(ORANGE, FLAECHE_GELB)).toBeGreaterThan(100);
  });
  it('Zahlen der Textalternativen passen zu den Daten', () => {
    expect(B.BILD_V1.beschreibung).toContain('40, 80 und 120');
    expect(B.BILD_BECKEN_FLAECHEN.beschreibung).toContain('72, 192, 72 und 24');
    expect(B.BILD_ERSATZ_BECKEN.beschreibung).toContain('Höhe 15');
    expect(B.BILD_ERSATZ_BECKEN.beschreibung).toContain('360');
    expect(B.BILD_ERSATZ.beschreibung).toContain('13,75');
    expect(B.BILD_TANK_HOCH.beschreibung).toContain('61');
  });
});
