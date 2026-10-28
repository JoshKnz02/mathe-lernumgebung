import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/ich-kann-liste-differentialrechnung/Bilder';
import { ABSCHNITT_TITEL, AUSSAGEN, GRUPPEN, MODULE } from '../content/modules/ich-kann-liste-differentialrechnung/daten';
import Modul from '../content/modules/ich-kann-liste-differentialrechnung/index';
import meta from '../content/modules/ich-kann-liste-differentialrechnung/meta.json';
import * as W from '../content/modules/ich-kann-liste-differentialrechnung/werte';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { KontrollenOffenKontext } from '../src/components/IchKann';
import { BLAU, GRUEN, ORANGE, SCHWARZ, type MessbildDaten } from '../src/components/Messbild';
import { MIN_ABSTAND, NAH_Y_ACHSE, labelAbstand, type BeschriftungsLage, type Hindernis } from '../src/lib/beschriftung';
import { bewerte } from '../src/lib/eingabe';
import { alleNullstellen, bedingungsZeile, gauss, punkte, richardson, vorzeichenwechsel, zweiteDifferenz, type Fn } from './numerik';

vi.setConfig({ testTimeout: 60000 });
const PI = Math.PI;

interface AufgabeAufruf {
  nummer: string;
  children: ReactNode;
  felder: { id: string; erwartet: number; toleranz?: number; beschriftung: ReactNode }[];
  hilfen: ReactNode[];
  loesung: ReactNode[];
  beiErgebnis?: (r: boolean) => void;
}
interface FrageAufruf {
  nummer: string;
  children: ReactNode;
  optionen: { id: string; richtig: boolean; text: ReactNode; rueckmeldung: ReactNode }[];
  erklaerung: ReactNode;
  beiErgebnis?: (r: boolean) => void;
}
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

function rendern(abschnitt: string | null = null, offen = true): string {
  aufgaben.length = 0;
  fragen.length = 0;
  return renderToStaticMarkup(
    <KontrollenOffenKontext.Provider value={offen}>
      <AbschnittAnbieter value={abschnitt}>
        <Modul />
      </AbschnittAnbieter>
    </KontrollenOffenKontext.Provider>,
  );
}
const ORDNER = 'content/modules/ich-kann-liste-differentialrechnung';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const wert = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!.erwartet;
const maximum = (g: Fn, von: number, bis: number, n = 200000) => punkte(von, bis, n).reduce((m, x) => (g(x) > g(m) ? x : m), von);
const minimum = (g: Fn, von: number, bis: number, n = 200000) => maximum((x) => -g(x), von, bis, n);

describe('Aussagen und Verweise', () => {
  it('IDs und Nummern sind eindeutig, 1 bis 35 wie auf der Liste der Lehrkraft, 36 und 37 ergänzt, „!“ zuletzt ohne Kontrollaufgabe', () => {
    expect(new Set(AUSSAGEN.map((a) => a.id)).size).toBe(AUSSAGEN.length);
    expect(new Set(AUSSAGEN.map((a) => a.nr)).size).toBe(AUSSAGEN.length);
    const nummern = AUSSAGEN.map((a) => a.nr);
    expect(nummern.slice(0, 35)).toEqual(Array.from({ length: 35 }, (_, i) => String(i + 1)));
    expect(nummern.slice(35)).toEqual(['36', '37', '!']);
    expect(AUSSAGEN.filter((a) => a.ergaenzt).map((a) => a.nr)).toEqual(['36', '37']);
    expect(AUSSAGEN[AUSSAGEN.length - 1]!.teile).toEqual([]);
    for (const a of AUSSAGEN) {
      expect(a.text, a.nr).toMatch(/\.$/);
      expect(a.text, a.nr).not.toMatch(/[–—]/);
      expect(a.verweise.length, a.nr).toBeGreaterThan(0);
    }
  });
  it('jede Aussage gehört zu einer Gruppe, jede Gruppe ist ein Abschnitt des Moduls und hat Aussagen', () => {
    const abschnitte = meta.abschnitte.map((a) => a.id);
    for (const g of GRUPPEN) {
      expect(abschnitte).toContain(g.id);
      expect(meta.abschnitte.find((a) => a.id === g.id)!.titel).toBe(g.titel);
      expect(AUSSAGEN.some((a) => a.gruppe === g.id), g.id).toBe(true);
    }
    for (const a of AUSSAGEN) expect(GRUPPEN.map((g) => g.id) as string[], a.nr).toContain(a.gruppe);
  });
  it('Verweise zeigen auf vorhandene Module und Abschnitte, deren Titel stimmen', () => {
    for (const a of AUSSAGEN) {
      for (const v of a.verweise) {
        const m = JSON.parse(readFileSync(`content/modules/${v.modul}/meta.json`, 'utf8')) as { titel: string; abschnitte: { id: string; titel: string }[] };
        expect(MODULE[v.modul], `${a.nr}: ${v.modul}`).toBe(m.titel);
        const ab = m.abschnitte.find((x) => x.id === v.abschnitt);
        expect(ab, `${a.nr}: ${v.modul}/${v.abschnitt}`).toBeDefined();
        expect(ABSCHNITT_TITEL[v.abschnitt], `${a.nr}: ${v.abschnitt}`).toBe(ab!.titel);
      }
    }
  });
  it('Bildungsplan: die BPE der Differentialrechnung 12.1 bis 12.7, 6.1 bis 6.3, 3.2, 3.3, 3.5, 4.3, 4.4 und 15.1 sind abgedeckt', () => {
    const bpe = new Set(AUSSAGEN.flatMap((a) => a.bpe));
    for (const b of ['12.1', '12.2', '12.3', '12.4', '12.5', '12.6', '12.7', '6.1', '6.2', '6.3', '3.2', '3.3', '3.5', '4.3', '15.1']) expect(bpe.has(b), b).toBe(true);
    for (const b of meta.bpe) expect(bpe.has(b) || ['4.4', '12.1'].includes(b), b).toBe(true);
  });
});

describe('Metadaten und Darstellung', () => {
  it('ist ein Modul des Themenbereichs Differentialrechnung mit acht Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('ich-kann-liste-differentialrechnung');
    expect(meta.thema).toBe('differentialrechnung');
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['anleitung', 'gleichungen', 'aenderung', 'tangenten', 'schaubild', 'kurve', 'anwendung', 'auswertung']);
    for (const a of meta.abschnitte) {
      const html = rendern(a.id);
      expect(html).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(html).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('solange es ein Entwurf ist, steht es in keinem Kurs', () => {
    if (meta.status !== 'entwurf') return;
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"ich-kann-liste-differentialrechnung"');
  });
  it('rendert ohne Formelfehler, ohne Gedankenstriche und ohne „Graph“, mit der Fachsprache der Lehrkraft', () => {
    const html = rendern(null);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(html).not.toContain(z);
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).toContain('Schaubild');
    for (const d of readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts'))) {
      const q = readFileSync(`${ORDNER}/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
    }
    const alles = [...aufgaben.flatMap((a) => [a.children, ...a.hilfen, ...a.loesung]), ...fragen.flatMap((q) => [q.children, q.erklaerung])].map(alsText).join(' ');
    expect(alles).toContain('linksgekrümmt');
    expect(alles).toContain('rechtsgekrümmt');
    expect(alles).not.toMatch(/Linkskurve|Rechtskurve|Ableitungsgraph/);
  });
  it('jede Aussage erscheint mit Nummer, drei Stufen der Einschätzung und Verweisen, die ergänzten sind gekennzeichnet', () => {
    const html = rendern(null, false);
    for (const a of AUSSAGEN) expect(html, a.nr).toContain(`<span class="ik-nr">${a.nr}</span> Ich kann`);
    expect((html.match(/<strong>\+\+<\/strong>/g) ?? []).length).toBe(AUSSAGEN.length);
    expect((html.match(/Ergänzt nach dem Bildungsplan/g) ?? []).length).toBe(2);
    expect(aufgaben).toHaveLength(0);
    expect(fragen).toHaveLength(0);
  });
  it('die Kontrollaufgaben passen zu den Teilen jeder Aussage (K<Nr> oder K<Nr>a, K<Nr>b)', () => {
    rendern(null);
    const alle = [...aufgaben.map((a) => a.nummer), ...fragen.map((q) => q.nummer)];
    const erwartet = AUSSAGEN.flatMap((a) => (a.teile.length === 0 ? [] : a.teile.length === 1 ? [`K${a.nr}`] : a.teile.map((t) => `K${a.nr}${t}`)));
    expect([...alle].sort()).toEqual([...erwartet].sort());
    expect(alle.length).toBe(39);
  });
  it('Hilfen, Lösungswege, Beschriftungen, Antworten und Erklärungen rendern ohne Formelfehler und ohne Gedankenstriche', () => {
    rendern(null);
    const teile: [string, ReactNode][] = [];
    for (const a of aufgaben) {
      teile.push([`${a.nummer} Text`, a.children]);
      a.hilfen.forEach((h, i) => teile.push([`${a.nummer} Hilfe ${i + 1}`, h]));
      a.loesung.forEach((s, i) => teile.push([`${a.nummer} Lösungsschritt ${i + 1}`, s]));
      a.felder.forEach((f) => teile.push([`${a.nummer} Feld ${f.id}`, f.beschriftung]));
    }
    for (const q of fragen) {
      teile.push([`${q.nummer} Frage`, q.children], [`${q.nummer} Erklärung`, q.erklaerung]);
      q.optionen.forEach((o) => teile.push([`${q.nummer} ${o.id} Text`, o.text], [`${q.nummer} ${o.id} Rückmeldung`, o.rueckmeldung]));
    }
    expect(teile.length).toBeGreaterThan(300);
    for (const [name, inhalt] of teile) {
      const html = alsText(inhalt);
      expect(html, name).not.toContain('formel-fehler');
      expect(html, name).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(html, name).not.toContain(z);
      expect(html, name).not.toMatch(/Graph(?!ik)/);
    }
  });
  it('jede Aufgabe hat mindestens zwei Hilfen und zwei Lösungsschritte, jede Auswahlfrage genau eine richtige von vier Antworten, nicht immer an derselben Stelle', () => {
    rendern(null);
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(2);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(2);
      expect(a.felder.length, a.nummer).toBeGreaterThanOrEqual(1);
    }
    const stellen = fragen.map((q) => {
      expect(q.optionen.filter((o) => o.richtig), q.nummer).toHaveLength(1);
      expect(q.optionen, q.nummer).toHaveLength(4);
      for (const o of q.optionen.filter((x) => !x.richtig)) expect(alsText(o.rueckmeldung).length, `${q.nummer} ${o.id}`).toBeGreaterThan(40);
      return q.optionen.findIndex((o) => o.richtig);
    });
    expect(new Set(stellen).size).toBeGreaterThan(2);
  });
  it('jeder erwartete Wert wird in Dezimalschreibweise, als Bruch oder als Vielfaches von π richtig bewertet, ein falscher nicht', () => {
    rendern(null);
    const pi: Record<string, string> = { 'K3 a1': 'pi/3', 'K3 a2': '5pi/3', 'K24 e': 'pi/4', 'K25 c': 'pi/2' };
    let zahl = 0;
    for (const a of aufgaben) {
      for (const f of a.felder) {
        zahl++;
        const tol = f.toleranz !== undefined ? { toleranz: f.toleranz } : {};
        const roh = f.toleranz && f.toleranz >= 0.01 ? (Math.round(f.erwartet / 0.01) * 0.01).toFixed(2) : String(f.erwartet);
        const eingabe = pi[`${a.nummer} ${f.id}`] ?? (a.nummer === 'K21' && f.id === 'c' ? '2/3' : roh.replace('.', ','));
        expect(bewerte([{ id: f.id, erwartet: f.erwartet, ...tol }], { [f.id]: eingabe })[f.id], `${a.nummer} ${f.id} (${eingabe})`).toBe('richtig');
        expect(bewerte([{ id: f.id, erwartet: f.erwartet, ...tol }], { [f.id]: String(f.erwartet + 3) })[f.id], `${a.nummer} ${f.id} falsch`).toBe('falsch');
      }
    }
    expect(zahl).toBeGreaterThan(100);
  });
});

describe('Kontrollaufgaben Gleichungen und Änderungsrate (K1 bis K11), unabhängig geprüft', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('K1 bis K4: Lösungen erfüllen die Gleichungen und es gibt keine weiteren', () => {
    expect(W.K1.fa(wert('K1', 'a1'))).toBeCloseTo(0, 9);
    expect(W.K1.fa(wert('K1', 'a2'))).toBeCloseTo(0, 9);
    expect(alleNullstellen(W.K1.fa, -5, 5)).toHaveLength(2);
    expect(W.K1.fb(wert('K1', 'b'))).toBeCloseTo(0, 9);
    expect(alleNullstellen(W.K1.fb, -5, 5)).toHaveLength(1);
    const c = alleNullstellen(W.K1.fc, -5, 5);
    expect(c.map((x) => Math.round(x * 1e3) / 1e3 + 0)).toEqual(W.K1.cLoesungen);
    expect(c).toHaveLength(wert('K1', 'c'));
    expect(W.K2.fa(wert('K2', 'a'))).toBeCloseTo(0, 9);
    const e = vorzeichenwechsel(W.K2.fb, -3, 3);
    expect(e).toHaveLength(2);
    expect(e[0]!).toBeCloseTo(wert('K2', 'b1'), 5);
    expect(e[1]!).toBeCloseTo(wert('K2', 'b2'), 5);
    const t1 = vorzeichenwechsel((x) => W.K3.fa(x) - 1, 0, 2 * PI);
    expect(t1).toHaveLength(2);
    expect(t1[0]!).toBeCloseTo(wert('K3', 'a1'), 5);
    expect(t1[1]!).toBeCloseTo(wert('K3', 'a2'), 5);
    const t2 = vorzeichenwechsel((x) => W.K3.fb(x) - 4, 0, 12);
    expect(t2).toHaveLength(2);
    expect(t2[0]!).toBeCloseTo(wert('K3', 'b1'), 5);
    expect(t2[1]!).toBeCloseTo(wert('K3', 'b2'), 5);
    // dritte Lösung liegt eine Periode (4π) hinter der ersten und damit außerhalb von [0; 12]
    expect(W.K3.b1 + 4 * PI).toBeGreaterThan(12);
    const n = alleNullstellen(W.K4.f, -8, 8);
    expect(n).toHaveLength(4);
    n.forEach((x, i) => expect(x).toBeCloseTo(wert('K4', `x${i + 1}`), 5));
  });
  it('K5 bis K8: Änderungsraten, Differenzenquotient und Potenzregel gegen Richardson', () => {
    expect((W.K5.f(4) - W.K5.f(-2)) / 6).toBeCloseTo(wert('K5', 'f'), 12);
    expect(W.K5.g(-2)).toBeCloseTo(0, 12);
    expect(W.K5.g(2)).toBeCloseTo(2, 12);
    expect((W.K5.g(2) - W.K5.g(-2)) / 4).toBeCloseTo(wert('K5', 'g'), 12);
    expect(richardson(W.K5.g, 0)).toBeCloseTo(wert('K6', 'm'), 5);
    expect(W.K5.g(0)).toBe(1);
    expect(W.K5.g(0) + wert('K6', 'm') * 2).toBeCloseTo(0, 9);
    expect((W.K7.f(2.5) - W.K7.f(2)) / 0.5).toBeCloseTo(wert('K7', 'dq'), 12);
    expect(richardson(W.K7.f, 2)).toBeCloseTo(wert('K7', 'f'), 6);
    for (const h of [1e-3, 1e-5]) expect((W.K7.f(2 + h) - W.K7.f(2)) / h).toBeCloseTo(1, 2);
    expect(richardson(W.K8.f, -1)).toBeCloseTo(wert('K8', 'a'), 5);
    expect(richardson(W.K8.f, 2)).toBeCloseTo(wert('K8', 'b'), 5);
  });
  it('K9 bis K11: Ableitung, Steigung im Punkt und Stellen mit vorgegebener Steigung', () => {
    for (const x of punkte(-3, 3, 12)) expect(richardson(W.K9.f, x)).toBeCloseTo(wert('K9', 'a') * x * x + wert('K9', 'b') * x + wert('K9', 'c'), 5);
    expect(richardson(W.K9.h, 4)).toBeCloseTo(wert('K9', 'h'), 5);
    expect(W.K10.f(-1)).toBe(wert('K10', 'y'));
    expect(richardson(W.K10.f, -1)).toBeCloseTo(wert('K10', 'm'), 5);
    const waag = vorzeichenwechsel((x) => richardson(W.K11.f, x), -6, 6);
    expect(waag).toHaveLength(2);
    expect(waag[0]!).toBeCloseTo(wert('K11', 'a1'), 5);
    expect(waag[1]!).toBeCloseTo(wert('K11', 'a2'), 5);
    const st = vorzeichenwechsel((x) => richardson(W.K11.f, x) - 15, -6, 6);
    expect(st).toHaveLength(2);
    expect(st[0]!).toBeCloseTo(wert('K11', 'b1'), 5);
    expect(st[1]!).toBeCloseTo(wert('K11', 'b2'), 5);
  });
});

describe('Kontrollaufgaben Tangenten, Ableitung und Schaubild (K12 bis K23), unabhängig geprüft', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('K12 bis K14: Tangente, Normale, Berührpunkt, Lage und Schnittwinkel', () => {
    const m = richardson(W.K12.f, 3);
    expect(m).toBeCloseTo(wert('K12', 'mt'), 5);
    expect(W.K12.f(3) - m * 3).toBeCloseTo(wert('K12', 'nt'), 5);
    expect(-1 / m).toBeCloseTo(wert('K12', 'mn'), 9);
    expect(W.K12.f(3) - (-1 / m) * 3).toBeCloseTo(wert('K12', 'nn'), 9);
    expect(richardson(W.K13.f, 0.5)).toBeCloseTo(2 * Math.E, 5);
    expect(W.K13.f(0.5)).toBeCloseTo(W.K13.g(0.5), 12);
    const berueh = vorzeichenwechsel((x) => richardson(W.K13.f, x) - 2 * Math.E, -3, 3);
    expect(berueh).toHaveLength(1);
    expect(berueh[0]!).toBeCloseTo(wert('K13', 'x'), 5);
    expect(W.K13.f(wert('K13', 'x'))).toBeCloseTo(wert('K13', 'y'), 12);
    // Fall 1: gemeinsamer Punkt, verschiedene Steigungen, kein rechter Winkel
    expect(W.K14.f1(2)).toBeCloseTo(W.K14.g1(2), 12);
    const m1 = richardson(W.K14.f1, 2);
    const m2 = richardson(W.K14.g1, 2);
    expect(m1).toBeCloseTo(8, 5);
    expect(m2).toBeCloseTo(4, 5);
    expect(Math.abs(m1 * m2 + 1)).toBeGreaterThan(1);
    expect(((Math.atan(m1) - Math.atan(m2)) * 180) / PI).toBeCloseTo(wert('K14', 'a'), 2);
    // Fall 2: senkrecht
    expect(W.K14.f2(1)).toBeCloseTo(W.K14.g2(1), 12);
    expect(richardson(W.K14.f2, 1) * richardson(W.K14.g2, 1)).toBeCloseTo(-1, 6);
    expect(wert('K14', 'b')).toBe(90);
  });
  it('K15 bis K17: Ableitungsregeln, grafisches Ableiten und Vorzeichenwechsel der Ableitung', () => {
    expect(richardson(W.K15.f, 0)).toBeCloseTo(wert('K15', 'a'), 5);
    expect(richardson(W.K15.f, PI / 2)).toBeCloseTo(wert('K15', 'b'), 2);
    expect(richardson(W.K15.g, 0)).toBeCloseTo(wert('K15', 'c'), 5);
    expect(Math.abs(richardson(W.K16.f, 0) - wert('K16', 'a'))).toBeLessThan(1e-6);
    expect(richardson(W.K16.f, 2)).toBeCloseTo(wert('K16', 'c'), 5);
    const nst = vorzeichenwechsel((x) => richardson(W.K16.f, x), -3, 3);
    expect(nst.map((x) => Math.round(x * 1e4) / 1e4)).toEqual([-1, 1]);
    for (const x of punkte(-3, 3, 30)) expect(richardson(W.K16.f, x)).toBeCloseTo(W.K16.df(x), 6);
    expect(wert('K16', 'b')).toBe(1);
    // K17: Vorzeichen von f′ = (x + 2)(x − 1)²: minus → plus bei −2, kein Wechsel bei 1
    const d = W.K17.df;
    expect(d(-3)).toBeLessThan(0);
    expect(d(-1)).toBeGreaterThan(0);
    expect(d(0.5)).toBeGreaterThan(0);
    expect(d(1.5)).toBeGreaterThan(0);
    expect(vorzeichenwechsel(d, -4, 4)).toHaveLength(1);
    expect(fragen.find((q) => q.nummer === 'K17')!.optionen.find((o) => o.richtig)!.id).toBe('a');
  });
  it('K18 bis K21: Monotonie, Krümmung, Extrem- und Wendepunkte über Vorzeichenwechsel', () => {
    const { f, g, h } = W.F18;
    const df = (x: number) => richardson(f, x);
    const z = vorzeichenwechsel(df, -2, 6);
    expect(z).toHaveLength(2);
    expect(z[0]!).toBeCloseTo(wert('K18', 'a1'), 5);
    expect(z[1]!).toBeCloseTo(wert('K18', 'a2'), 5);
    expect(df(2)).toBeLessThan(0);
    expect(df(0)).toBeGreaterThan(0);
    expect(df(4)).toBeGreaterThan(0);
    const zg = vorzeichenwechsel((x) => richardson(g, x), -2, 4);
    expect(zg).toHaveLength(1);
    expect(zg[0]!).toBeCloseTo(wert('K18', 'b'), 3);
    expect(richardson(g, 0)).toBeGreaterThan(0);
    expect(richardson(g, 2)).toBeLessThan(0);
    const dd = zweiteDifferenz(f);
    const w = vorzeichenwechsel(dd, -3, 7);
    expect(w).toHaveLength(1);
    expect(w[0]!).toBeCloseTo(wert('K19', 'a'), 3);
    expect(dd(0)).toBeCloseTo(wert('K19', 'b'), 3);
    expect(dd(4)).toBeCloseTo(wert('K19', 'c'), 3);
    // K20: Hochpunkt bei 1 (plus → minus), Tiefpunkt bei 3 (minus → plus)
    expect(df(0.9)).toBeGreaterThan(0);
    expect(df(1.1)).toBeLessThan(0);
    expect(df(2.9)).toBeLessThan(0);
    expect(df(3.1)).toBeGreaterThan(0);
    expect(f(1)).toBeCloseTo(wert('K20', 'a'), 9);
    expect(f(3)).toBeCloseTo(wert('K20', 'b'), 9);
    const eh = vorzeichenwechsel((x) => richardson(h, x), -2, 3);
    expect(eh).toHaveLength(wert('K20', 'e'));
    expect(eh[0]!).toBeCloseTo(wert('K20', 'c'), 5);
    expect(h(eh[0]!)).toBeCloseTo(wert('K20', 'd'), 9);
    expect(richardson(h, 0)).toBeCloseTo(0, 6);
    expect(h(-0.1)).toBeGreaterThan(h(0));
    expect(h(0.1)).toBeLessThan(h(0));
    // K21
    expect(f(2)).toBeCloseTo(wert('K21', 'a'), 9);
    const wh = vorzeichenwechsel(zweiteDifferenz(h), -2, 3);
    expect(wh).toHaveLength(2);
    expect(wh[0]!).toBeCloseTo(wert('K21', 'b'), 3);
    expect(wh[1]!).toBeCloseTo(wert('K21', 'c'), 3);
    expect(h(wh[1]!)).toBeCloseTo(wert('K21', 'd'), 3);
    expect(h(W.K21.xW2)).toBeCloseTo(wert('K21', 'd'), 12);
  });
  it('K22 und K23: Ketten- und Produktregel, Parameter', () => {
    expect(richardson(W.K22.f, 1)).toBeCloseTo(wert('K22', 'a'), 4);
    expect(richardson(W.K22.g, 1)).toBeCloseTo(wert('K22', 'b'), 2);
    expect(richardson(W.K22.h, PI / 2)).toBeCloseTo(wert('K22', 'c'), 2);
    expect(richardson(W.K22.m, 1)).toBeCloseTo(wert('K22', 'd'), 2);
    expect(richardson(W.K23.f(2), 1)).toBeCloseTo(wert('K23', 'a'), 3);
    expect(richardson(W.K23.g(2), PI / 8)).toBeCloseTo(wert('K23', 'b'), 5);
  });
});

describe('Kontrollaufgaben Kurvendiskussion, Funktionsterme und Optimierung (K24 bis K37), unabhängig geprüft', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('K24 und K25: Extrem- und Wendepunkte verschiedener Funktionstypen', () => {
    const e = vorzeichenwechsel((x) => richardson(W.K24.f, x), -6, 6);
    expect(e).toHaveLength(2);
    expect(W.K24.f(e[0]!)).toBeCloseTo(wert('K24', 'a'), 6);
    expect(W.K24.f(e[1]!)).toBeCloseTo(wert('K24', 'b'), 6);
    expect(zweiteDifferenz(W.K24.f)(e[0]!)).toBeLessThan(0);
    expect(zweiteDifferenz(W.K24.f)(e[1]!)).toBeGreaterThan(0);
    const eg = vorzeichenwechsel((x) => richardson(W.K24.g, x), -4, 4);
    expect(eg).toHaveLength(1);
    expect(eg[0]!).toBeCloseTo(wert('K24', 'c'), 5);
    expect(W.K24.g(eg[0]!)).toBeCloseTo(wert('K24', 'd'), 2);
    expect(zweiteDifferenz(W.K24.g)(eg[0]!)).toBeGreaterThan(0);
    const eh = vorzeichenwechsel((x) => richardson(W.K24.h, x), 0.001, PI - 0.001);
    expect(eh).toHaveLength(2);
    expect(eh[0]!).toBeCloseTo(wert('K24', 'e'), 5);
    expect(W.K24.h(eh[0]!)).toBeCloseTo(wert('K24', 'f'), 9);
    expect(W.K24.h(eh[1]!)).toBeCloseTo(-2, 9);
    // Wendepunkte
    const wf = vorzeichenwechsel(zweiteDifferenz(W.K24.f), -4, 4);
    expect(wf).toHaveLength(1);
    expect(wf[0]!).toBeCloseTo(wert('K25', 'a'), 3);
    const wg = vorzeichenwechsel(zweiteDifferenz(W.K24.g), -4, 4);
    expect(wg).toHaveLength(1);
    expect(W.K24.g(wg[0]!)).toBeCloseTo(wert('K25', 'b'), 3);
    const wh = vorzeichenwechsel(zweiteDifferenz(W.K24.h), 0.01, PI - 0.01);
    expect(wh).toHaveLength(1);
    expect(wh[0]!).toBeCloseTo(wert('K25', 'c'), 3);
  });
  it('K26 und K27: Wertebereich und Symmetrie', () => {
    expect(W.K26.f(minimum(W.K26.f, -4, 2))).toBeCloseTo(wert('K26', 'a'), 6);
    expect(W.K26.f(maximum(W.K26.f, -4, 2))).toBeCloseTo(wert('K26', 'b'), 6);
    expect(W.K26.g(minimum(W.K26.g, 0, 20))).toBeCloseTo(wert('K26', 'c'), 6);
    expect(W.K26.g(maximum(W.K26.g, 0, 20))).toBeCloseTo(wert('K26', 'd'), 6);
    const art = (f: Fn) => {
      const achse = punkte(0.1, 7, 40).every((x) => Math.abs(f(-x) - f(x)) < 1e-9);
      const punkt = punkte(0.1, 7, 40).every((x) => Math.abs(f(-x) + f(x)) < 1e-9);
      return achse ? 1 : punkt ? 2 : 3;
    };
    for (const k of ['f', 'g', 'h', 'v', 'w'] as const) expect(art(W.K27[k]), k).toBe(wert('K27', k));
  });
  it('K28 und K29: globales Verhalten und trigonometrische Funktion', () => {
    const g = W.K28.g;
    expect(g(-10)).toBeGreaterThan(0);
    expect(g(10)).toBeLessThan(0);
    expect(Math.abs(g(10))).toBeGreaterThan(1e4);
    expect(fragen.find((q) => q.nummer === 'K28a')!.optionen.find((o) => o.richtig)!.id).toBe('a');
    for (const x of [20, 30, 40]) expect(W.K28.i(x) - (wert('K28b', 'm') * x + wert('K28b', 'n'))).toBeCloseTo(0, 6);
    expect(W.K28.i(-5) - (3 * -5 - 1)).toBeGreaterThan(100);
    expect(W.K28.j(40)).toBeCloseTo(wert('K28b', 'g'), 9);
    const f = W.K29.f;
    expect(f(1 + wert('K29', 'p'))).toBeCloseTo(f(1), 9);
    expect(f(wert('K29', 'xt'))).toBeCloseTo(wert('K29', 'yt'), 9);
    expect(f(minimum(f, 0, 4))).toBeCloseTo(-4, 6);
    expect(f(maximum(f, 0, 4))).toBeCloseTo(wert('K29', 'yh'), 6);
    expect(minimum(f, 0, 4)).toBeCloseTo(1, 3);
    expect(maximum(f, 0, 4)).toBeCloseTo(3, 3);
    const wp = vorzeichenwechsel(zweiteDifferenz(f), 0.01, 4.5);
    expect(wp.map((x) => Math.round(x * 1e3) / 1e3)).toEqual([2, 4]);
    for (const x of [0, 2, 4]) expect(f(x)).toBeCloseTo(wert('K29', 'yw'), 9);
  });
  it('K30 und K31: Bedingungen der Beispielfunktionen und Funktionsterme per Gaußverfahren', () => {
    expect(W.K30.fa(-3)).toBe(2);
    expect(richardson(W.K30.fa, -3)).toBeCloseTo(4, 5);
    expect(W.K30.fb(3)).toBe(-4);
    expect(richardson(W.K30.fb, 3)).toBeCloseTo(0, 6);
    expect(zweiteDifferenz(W.K30.fb)(3)).toBeCloseTo(0, 3);
    expect(fragen.find((q) => q.nummer === 'K30a')!.optionen.find((o) => o.richtig)!.id).toBe('a');
    expect(fragen.find((q) => q.nummer === 'K30b')!.optionen.find((o) => o.richtig)!.id).toBe('a');
    const basis: Fn[] = [(x) => x ** 3, (x) => x * x, (x) => x];
    const l = gauss([bedingungsZeile(basis, 'f', 3), bedingungsZeile(basis, 'f1', 3), bedingungsZeile(basis, 'f1', 0)], [0, 0, 9]);
    expect(l[0]!).toBeCloseTo(wert('K31', 'a'), 9);
    expect(l[1]!).toBeCloseTo(wert('K31', 'b'), 9);
    expect(l[2]!).toBeCloseTo(wert('K31', 'c'), 9);
    const b2: Fn[] = [(x) => x * Math.exp(-x), (x) => Math.exp(-x)];
    const e = gauss([bedingungsZeile(b2, 'f', 0), bedingungsZeile(b2, 'f1', 2)], [4, 0]);
    expect(e[0]!).toBeCloseTo(wert('K31', 'ga'), 6);
    expect(e[1]!).toBeCloseTo(wert('K31', 'gb'), 6);
    expect(richardson(W.K31.g, 2)).toBeCloseTo(0, 6);
  });
  it('K32 bis K35: Optimierung, Zielfunktion aus Geometrie, Definitionsbereich und globales Minimum mit Randverhalten', () => {
    expect(fragen.find((q) => q.nummer === 'K32')!.optionen.find((o) => o.richtig)!.id).toBe('a');
    expect(fragen.find((q) => q.nummer === 'K34')!.optionen.find((o) => o.richtig)!.id).toBe('a');
    // Zielfunktion aus der Geometrie: Oberfläche ohne Deckel mit h = 32 / a²
    const oberflaeche = (a: number) => {
      const h = 32 / (a * a);
      return a * a + 4 * a * h;
    };
    expect(32 / 16).toBe(wert('K33', 'h'));
    expect(oberflaeche(2)).toBeCloseTo(wert('K33', 'O'), 9);
    for (const a of punkte(0.5, 12, 30)) {
      expect(oberflaeche(a)).toBeCloseTo(W.K33.O(a), 9);
      expect(oberflaeche(a)).toBeCloseTo(a * a + wert('K33', 'k') / a, 9);
    }
    const best = minimum(oberflaeche, 0.05, 200, 400000);
    expect(best).toBeCloseTo(wert('K35', 'a'), 2);
    expect(oberflaeche(best)).toBeCloseTo(wert('K35', 'O'), 3);
    expect(32 / (best * best)).toBeCloseTo(wert('K35', 'h'), 1);
    expect(oberflaeche(0.01)).toBeGreaterThan(1000);
    expect(oberflaeche(500)).toBeGreaterThan(1000);
    for (const a of punkte(0.5, 12, 30)) expect(richardson(oberflaeche, a)).toBeCloseTo(W.K33.dO(a), 4);
    // K34: das Rechteck mit Umfang 20 hat die Fläche x (10 − x), größte Fläche 25 bei x = 5
    expect(maximum(W.K34.A, 0, 10)).toBeCloseTo(5, 3);
    expect(W.K34.A(0)).toBe(0);
    expect(W.K34.A(10)).toBe(0);
  });
  it('K36 und K37: kleinste Steigung und globale Extrema auf [0; 4]', () => {
    const { f } = W.F18;
    const x = minimum((s) => richardson(f, s), -6, 10, 80000);
    expect(x).toBeCloseTo(wert('K36', 'x'), 3);
    expect(richardson(f, x)).toBeCloseTo(wert('K36', 'm'), 4);
    expect(richardson(f, 40)).toBeGreaterThan(1000);
    expect(f(maximum(f, 0, 4))).toBeCloseTo(wert('K37', 'max'), 6);
    expect(f(minimum(f, 0, 4))).toBeCloseTo(wert('K37', 'min'), 6);
    const stellen = alleNullstellen((s) => f(s) - wert('K37', 'max'), 0, 4);
    expect(stellen).toHaveLength(wert('K37', 'n'));
    expect(stellen[0]!).toBeCloseTo(1, 2);
    expect(stellen[1]!).toBeCloseTo(4, 2);
  });
});

describe('Schaubilder', () => {
  const alle = Object.entries(B).filter(([, v]) => typeof v === 'object' && v !== null && 'kurven' in (v as object)) as [string, MessbildDaten][];
  const hindernisse = (b: MessbildDaten): Hindernis[] => [
    ...b.kurven.map((k): Hindernis => ({ f: k.f, ...(k.von !== undefined ? { von: k.von } : {}), ...(k.bis !== undefined ? { bis: k.bis } : {}) })),
    ...(b.strecken ?? [])
      .filter((s) => s.von[0] !== s.bis[0] && s.von[1] !== 0)
      .map((s): Hindernis => ({ f: (x) => s.von[1] + ((s.bis[1] - s.von[1]) / (s.bis[0] - s.von[0])) * (x - s.von[0]), von: Math.min(s.von[0], s.bis[0]), bis: Math.max(s.von[0], s.bis[0]) })),
    ...(b.strecken ?? [])
      .filter((s) => s.von[0] === s.bis[0])
      .flatMap((s) => Array.from({ length: 25 }, (_, i): Hindernis => ({ f: () => s.von[1] + ((s.bis[1] - s.von[1]) * i) / 24, von: s.von[0] - 1e-9, bis: s.von[0] + 1e-9 }))),
  ];

  it('es gibt alle Schaubilder, jedes mit Beschreibung, Punkte liegen im Ausschnitt und auf einer Kurve oder an einer Ecke einer Strecke', () => {
    expect(alle.length).toBeGreaterThanOrEqual(26);
    for (const [name, b] of alle) {
      expect(b.beschreibung.length, name).toBeGreaterThan(40);
      for (const p of b.punkte ?? []) {
        const aufKurve = b.kurven.some((k) => (k.von === undefined || p.x >= k.von - 1e-9) && (k.bis === undefined || p.x <= k.bis + 1e-9) && Math.abs(k.f(p.x) - p.y) < 1e-6);
        const aufEcke = (b.strecken ?? []).some((s) => [s.von, s.bis].some((e) => Math.abs(e[0] - p.x) < 1e-9 && Math.abs(e[1] - p.y) < 1e-9));
        expect(aufKurve || aufEcke, `${name}: Punkt (${p.x} | ${p.y})`).toBe(true);
        expect(p.x, name).toBeGreaterThanOrEqual(b.bereich[0] - 1e-9);
        expect(p.x, name).toBeLessThanOrEqual(b.bereich[1] + 1e-9);
        expect(p.y, name).toBeGreaterThanOrEqual(b.bereich[2] - 1e-9);
        expect(p.y, name).toBeLessThanOrEqual(b.bereich[3] + 1e-9);
      }
    }
  });
  it('Beschriftungen liegen nie auf einem Schaubild, einer Geraden oder Strecke, nicht unter der x-Achse und nahe der y-Achse rechts davon', () => {
    let zahl = 0;
    const fehler: string[] = [];
    for (const [name, b] of alle) {
      for (const p of b.punkte ?? []) {
        if (!p.text) continue;
        zahl++;
        const lage = (p.lage ?? 'oben-links') as BeschriftungsLage;
        const d = labelAbstand(lage, p, b.bereich, hindernisse(b), false, { x: b.teilung ?? 1, y: b.yTeilung ?? b.teilung ?? 1 });
        if (d < MIN_ABSTAND * 0.85) fehler.push(`${name}: ${p.text} bei (${p.x} | ${p.y}), Lage ${lage}, Abstand ${d.toFixed(3)}`);
        if (Math.abs(p.y) < 1e-9 && /unten/.test(lage)) fehler.push(`${name}: ${p.text} auf der Achse liegt unten`);
        const [xmin, xmax] = b.bereich;
        if (xmin < 0 && xmax > 0 && Math.abs(p.x / (xmax - xmin)) < NAH_Y_ACHSE && !/rechts/.test(lage)) fehler.push(`${name}: ${p.text} bei x = ${p.x} steht nicht rechts von der y-Achse (${lage})`);
      }
    }
    expect(fehler).toEqual([]);
    expect(zahl).toBeGreaterThan(40);
  });
  it('Farben: K_f orange, K_f′ grün, weitere Linien gestrichelt blau oder schwarz, Platz für die Zahlen links der y-Achse', () => {
    for (const [name, b] of alle) {
      const durchgezogen = b.kurven.filter((k) => !k.gestrichelt);
      expect(durchgezogen.length, name).toBeGreaterThanOrEqual(1);
      for (const k of durchgezogen) expect([ORANGE, GRUEN], name).toContain(k.farbe);
      for (const k of b.kurven.filter((x) => x.gestrichelt)) expect([BLAU, SCHWARZ], name).toContain(k.farbe);
      for (const s of b.strecken ?? []) expect([BLAU, SCHWARZ], name).toContain(s.farbe);
      const [xmin, xmax] = b.bereich;
      if (xmin >= 0) throw new Error(`${name}: Ausschnitt beginnt bei x = ${xmin}, die Zahlen der y-Achse fehlen`);
      expect(-xmin / (xmax - xmin), name).toBeGreaterThan(0.04);
    }
    for (const n of ['BILD_K16_ABLEITUNG', 'BILD_K17', 'BILD_K36']) expect((B as unknown as Record<string, MessbildDaten>)[n]!.kurven[0]!.farbe, n).toBe(GRUEN);
  });
  it('die Schaubilder stimmen mit den Rechnungen überein: Tangenten, Geraden und Punkte', () => {
    expect(B.BILD_K5_SEKANTE.kurven[1]!.f(2)).toBeCloseTo(2, 12);
    expect(B.BILD_K6.kurven[1]!.f(2)).toBeCloseTo(0, 12);
    expect(B.BILD_K12.kurven[1]!.f(4) - B.BILD_K12.kurven[1]!.f(3)).toBeCloseTo(10, 12);
    expect(B.BILD_K13.kurven[1]!.f(0.5)).toBeCloseTo(Math.E, 12);
    expect(B.BILD_K24.kurven[1]!.f(0)).toBe(16);
    expect(B.BILD_K28B.kurven[1]!.f(2)).toBe(5);
    expect(B.BILD_K29.kurven[1]!.f(1)).toBe(-1);
    expect(B.BILD_K30A.kurven[1]!.f(-2) - B.BILD_K30A.kurven[1]!.f(-3)).toBeCloseTo(4, 12);
    expect(B.BILD_K31A.kurven[1]!.f(1)).toBe(9);
    expect(B.BILD_K37.kurven[1]!.f(2)).toBe(5);
  });
});
