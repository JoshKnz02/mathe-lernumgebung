import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/kurvendiskussion/Bilder';
import { A1, A2, A3, A9, BECKEN, ERKLAEREN, F4, F5, GEGENBEISPIELE, KURVE, SCHAR_T, VIER_FAELLE, ZUORDNUNG, ZWEI_DURCH_WURZEL3 } from '../content/modules/kurvendiskussion/daten';
import Modul from '../content/modules/kurvendiskussion/index';
import { Kurvenlabor } from '../content/modules/kurvendiskussion/Kurvenlabor';
import meta from '../content/modules/kurvendiskussion/meta.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { BLAU, GRUEN, ORANGE, SCHWARZ, type MessbildDaten } from '../src/components/Messbild';
import { ROSA, type DreiDaten, type PaarDaten } from '../src/components/Paarbild';
import { bewerte } from '../src/lib/eingabe';
import { MIN_ABSTAND, NAH_Y_ACHSE, labelAbstand, type BeschriftungsLage } from '../src/lib/beschriftung';
import { findeKurve } from '../src/lib/kurve';
import { alleNullstellen, punkte, richardson, vorzeichenwechsel, zweiteDifferenz, type Fn } from './numerik';

vi.setConfig({ testTimeout: 30000 });

interface AufgabeAufruf {
  nummer: string;
  children: ReactNode;
  felder: { id: string; erwartet: number; toleranz?: number; beschriftung: ReactNode }[];
  hilfen: ReactNode[];
  loesung: ReactNode[];
}
interface FrageAufruf {
  nummer: string;
  children: ReactNode;
  optionen: { id: string; richtig: boolean; text: ReactNode; rueckmeldung: ReactNode }[];
  erklaerung: ReactNode;
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
const MODULORDNER = 'content/modules/kurvendiskussion';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const nahe = (a: number[], b: number[], stellen = 3) => {
  expect(a).toHaveLength(b.length);
  a.forEach((x, i) => expect(x).toBeCloseTo(b[i]!, stellen));
};
const df = (f: Fn) => (x: number) => richardson(f, x);
const ddf = (f: Fn) => zweiteDifferenz(f);
const vorzeichen = (v: number) => (Math.abs(v) < 1e-6 ? 0 : Math.sign(v));
/** g ist (auf dem Raster) die Ableitung von f. */
const istAbleitung = (f: Fn, g: Fn, von = -3, bis = 3) => punkte(von, bis, 60).every((x) => Math.abs(g(x) - richardson(f, x)) < 1e-4);

describe('Metadaten und Darstellung', () => {
  it('Freigegeben im Themenbereich Differentialrechnung mit vier Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('kurvendiskussion');
    expect(meta.thema).toBe('differentialrechnung');
    expect(meta.status).toBe('freigegeben');
    expect(meta.bpe).toEqual(['12.6']);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung']);
    for (const a of meta.abschnitte) {
      const html = rendern(a.id);
      expect(html).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(html).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('rendert ohne Formelfehler, ohne Gedankenstriche und ohne Brüche mit Schrägstrich im Text, mit der Fachsprache der Lehrkraft', () => {
    const html = rendern(null);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(html).not.toContain(z);
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).not.toContain('Graphisch');
    expect(html).toContain('Schaubild');
    for (const d of readdirSync(MODULORDNER)) {
      const q = readFileSync(`${MODULORDNER}/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
      expect(q, d).not.toMatch(/<code>[^<]*\//);
      expect(q, d).not.toMatch(/\{KD?D?F\}[,.;:?!)]/);
    }
  });
  it('Verweise auf andere Module nennen vorhandene Module und Abschnitte', () => {
    const ids = readdirSync('content/modules');
    for (const d of readdirSync(MODULORDNER).filter((x) => x.endsWith('.tsx'))) {
      const q = readFileSync(`${MODULORDNER}/${d}`, 'utf8');
      for (const m of q.matchAll(/<Modulverweis modul="([^"]+)"(?: abschnitt="([^"]+)")?/g)) {
        expect(ids, `${d}: ${m[1]}`).toContain(m[1]);
        if (m[2]) {
          const abschnitte = (JSON.parse(readFileSync(`content/modules/${m[1]}/meta.json`, 'utf8')) as { abschnitte: { id: string }[] }).abschnitte.map((a) => a.id);
          expect(abschnitte, `${d}: ${m[1]}/${m[2]}`).toContain(m[2]);
        }
      }
    }
  });
  it('Material der Vorgängermodule wird verlinkt statt wiederholt: Monotonie, Hochpunkt, Linkskurve, Schreibweise f″ und Tangenten', () => {
    const quelle = readdirSync(MODULORDNER).filter((d) => d.endsWith('.tsx')).map((d) => readFileSync(`${MODULORDNER}/${d}`, 'utf8')).join('\n');
    for (const m of ['aenderungsraten', 'ableitungsregeln', 'grafisches-differenzieren', 'tangenten']) expect(quelle, m).toContain(`modul="${m}"`);
  });
  it('Erklären nennt die Kriterien noch nicht, Entdecken und Zusammenfassung nennen sie', () => {
    const erklaeren = rendern('erklaeren');
    for (const w of ['Vorzeichenwechsel', 'größte Steigung', 'kleinste Steigung', 'Wendetangente', 'ne 0', 'Gegenbeispiel']) expect(erklaeren, w).not.toContain(w);
    // keine Vorzeichenaussage über f″ (die wird im Entdecken gefunden)
    expect(erklaeren).not.toMatch(/f(&#x27;|')(&#x27;|')\(x\)(&gt;|&lt;|>|<)/);
    for (const w of ['zweite Ableitung', 'linksgekrümmt', 'rechtsgekrümmt', 'Wendestelle', 'Sattelpunkt', 'notwendig', 'hinreichend', 'Testwert', 'Bergsteiger', 'Rennfahrer']) expect(erklaeren, w).toContain(w);
    const entdecken = rendern('entdecken');
    for (const w of ['Vorzeichenwechsel', 'kleinste Steigung', 'größte Steigung', 'Sattelpunkt', 'notwendig', 'hinreichend', 'Tiefpunkt', 'Kurvenlabor']) expect(entdecken, w).toContain(w);
    const zus = rendern('zusammenfassung');
    for (const w of ['Notwendige und hinreichende Bedingungen', 'Typische Fehler', 'Punkte mit größter oder kleinster Steigung', 'Notwendig ist nicht hinreichend', 'Sattelpunkt', 'Hinreichende Bedingung 1', 'Hinreichende Bedingung 2']) expect(zus, w).toContain(w);
  });
  it('Entdecken: drei Vermutungsfragen vor dem Labor, ein Labor, acht Beobachtungen', () => {
    const html = rendern('entdecken');
    expect((html.match(/class="labor"/g) ?? []).length).toBe(1);
    expect(html.indexOf('Vermutung')).toBeGreaterThan(-1);
    expect(html.indexOf('Vermutung')).toBeLessThan(html.indexOf('class="labor"'));
    expect((html.match(/Beobachtung vergleichen/g) ?? []).length).toBe(8);
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
    expect(teile.length).toBeGreaterThan(60);
    for (const [name, inhalt] of teile) {
      const html = alsText(inhalt);
      expect(html, name).not.toContain('formel-fehler');
      expect(html, name).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(html, name).not.toContain(z);
    }
  });
  it('das Kurvenlabor rendert mit drei Schaubildern, Legende, Tabelle der Vorzeichen und Stellenwahl ohne Formelfehler', () => {
    const html = renderToStaticMarkup(<Kurvenlabor />);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    expect((html.match(/role="img"/g) ?? []).length).toBe(3);
    for (const w of ['Legende', 'Vorzeichen im Abstand', 'Zu einer Stelle springen', 'besondere Stellen markieren', 'Vorzeichen auf der x-Achse färben', 'Zurücksetzen']) expect(html, w).toContain(w);
    // x₀ = −1 für „kubisch“: f′(−1) = 4,5, f″(−1) = −6, f‴ = 3
    expect(html).toContain('f&#x27;(x_0)=4{,}5');
  });
});

describe('Aufgaben und Fragen', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Nummern, Hilfen und Lösungsschritte', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '2', '3', '5', '8', '9']);
    expect(fragen.map((q) => q.nummer)).toEqual(['4', '6', '7', '10', '11']);
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(2);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(3);
    }
  });
  it('Auswahlfragen: genau eine richtige Antwort, vier Antworten, nicht immer an derselben Stelle, jede falsche Antwort mit Begründung', () => {
    const stellen = fragen.map((q) => {
      expect(q.optionen.filter((o) => o.richtig), q.nummer).toHaveLength(1);
      expect(q.optionen).toHaveLength(4);
      for (const o of q.optionen.filter((x) => !x.richtig)) expect(alsText(o.rueckmeldung).length, `${q.nummer} ${o.id}`).toBeGreaterThan(60);
      return q.optionen.findIndex((o) => o.richtig);
    });
    expect(new Set(stellen).size).toBeGreaterThan(2);
  });
  it('jede Erklärung und jeder Lösungsweg enthält ein Schaubild, jede Aufgabe mit Schaubild hat ein Kontrollschaubild', () => {
    for (const q of fragen) expect(alsText(q.erklaerung), q.nummer).toContain('class="bild');
    for (const a of aufgaben) expect(alsText(a.loesung), a.nummer).toContain('class="bild');
    for (const a of aufgaben) expect(alsText(a.children), a.nummer).toContain('Schaubild zur Kontrolle einblenden');
  });
  it('Gliederung nach den Niveaustufen des Arbeitsblatts', () => {
    const html = rendern('ueberpruefen');
    const i1 = html.indexOf('Niveaustufe 1');
    const i2 = html.indexOf('Niveaustufe 2');
    const i3 = html.indexOf('Niveaustufe 3');
    expect(i1).toBeGreaterThan(-1);
    expect(i2).toBeGreaterThan(i1);
    expect(i3).toBeGreaterThan(i2);
  });
});

describe('Aufgabenwerte gegen unabhängige Ableitung und Bisektion', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Ableitungen aller Aufgabenfunktionen von Hand stimmen mit der numerischen Ableitung überein', () => {
    const paare: [string, Fn, Fn, Fn, Fn | null, number, number][] = [
      ['Erklären', ERKLAEREN.f, ERKLAEREN.df, () => NaN, null, -3, 5],
      ['A1', A1.f, A1.df, A1.ddf, A1.dddf, -2, 6],
      ['A2', A2.f, A2.df, A2.ddf, A2.dddf, -3, 3],
      ['A3', A3.f, A3.df, A3.ddf, A3.dddf, 0.5, 3.5],
      ['F4', F4.f, F4.df, F4.ddf, F4.dddf, -3, 3],
      ['F5', F5.f, F5.df, F5.ddf, null, -3.5, 4],
      ['Zuordnung', ZUORDNUNG.f, ZUORDNUNG.df, ZUORDNUNG.ddf, null, -3, 3],
      ['Becken', BECKEN.v, BECKEN.dv, BECKEN.ddv, BECKEN.dddv, 0, 6],
      ['A9', A9.f, A9.df, A9.ddf, A9.dddf, -3, 5],
    ];
    for (const [name, f, d1, d2, d3, a, b] of paare) {
      for (const x of punkte(a, b, 36)) {
        expect(d1(x), `${name} f′ bei ${x}`).toBeCloseTo(richardson(f, x), 5);
        if (!Number.isNaN(d2(x))) expect(d2(x), `${name} f″ bei ${x}`).toBeCloseTo(richardson(d1, x), 5);
        if (d3) expect(d3(x), `${name} f‴ bei ${x}`).toBeCloseTo(richardson(d2, x), 5);
      }
    }
    for (const [name, g] of [['x⁴/12', GEGENBEISPIELE.vier], ['kubisch', GEGENBEISPIELE.kubisch]] as const) {
      for (const x of punkte(-2, 3, 30)) {
        expect(g.df(x), `${name} f′`).toBeCloseTo(richardson(g.f, x), 5);
        expect(g.ddf(x), `${name} f″`).toBeCloseTo(richardson(g.df, x), 5);
      }
    }
  });
  it('Erklären: Nullstellen und Testwerte von f′ stimmen, die Bereiche steigen und fallen wie in der Tabelle', () => {
    nahe(alleNullstellen(df(ERKLAEREN.f), -3, 5), ERKLAEREN.nullen);
    for (const w of ERKLAEREN.testwerte) expect(df(ERKLAEREN.f)(w.x)).toBeCloseTo(w.wert, 5);
    expect(ERKLAEREN.testwerte.map((w) => Math.sign(w.wert))).toEqual([1, -1, 1]);
    // Hoch- und Tiefpunkt: f(−1) = 5/3 und f(3) = −9
    expect(ERKLAEREN.f(-1)).toBeCloseTo(5 / 3, 12);
    expect(ERKLAEREN.f(3)).toBeCloseTo(-9, 12);
  });
  it('1: Extrempunkte, Wendepunkt und kleinste Steigung gegen Bisektion und Richardson', () => {
    const nullen = vorzeichenwechsel(df(A1.f), -2, 6);
    nahe(nullen, [feld('1', 'h').erwartet, feld('1', 't').erwartet]);
    // f″ entscheidet: Hochpunkt bei 0, Tiefpunkt bei 4
    expect(ddf(A1.f)(0)).toBeLessThan(0);
    expect(ddf(A1.f)(4)).toBeGreaterThan(0);
    expect(A1.f(4)).toBeCloseTo(feld('1', 'yt').erwartet, 10);
    const wende = vorzeichenwechsel(ddf(A1.f), -2, 6);
    nahe(wende, [feld('1', 'w').erwartet]);
    expect(A1.f(wende[0]!)).toBeCloseTo(feld('1', 'yw').erwartet, 5);
    // kleinste Steigung: der kleinste Wert von f′ auf einem sehr großen Bereich liegt an der Wendestelle
    const werte = punkte(-50, 50, 20000).map((x) => ({ x, m: richardson(A1.f, x) }));
    const kleinster = werte.reduce((a, b) => (b.m < a.m ? b : a));
    expect(kleinster.m).toBeCloseTo(feld('1', 'm').erwartet, 3);
    expect(kleinster.x).toBeCloseTo(wende[0]!, 1);
    expect(A1.dddf(2)).toBe(3 / 2);
  });
  it('2: Monotoniegrenze, f″(0), Wendestelle und Wendepunkt, Rundung wird akzeptiert', () => {
    const nullen = alleNullstellen(df(A2.f), -3, 3);
    nahe(nullen, [-2, 0, 2]);
    expect(feld('2', 'a').erwartet).toBeCloseTo(nullen[0]!, 3);
    // links von −2 fällt K_f, zwischen −2 und 0 steigt es
    expect(richardson(A2.f, -3)).toBeLessThan(0);
    expect(richardson(A2.f, -1)).toBeGreaterThan(0);
    expect(feld('2', 'k').erwartet).toBeCloseTo(ddf(A2.f)(0), 3);
    const wende = vorzeichenwechsel(ddf(A2.f), -3, 3);
    nahe(wende, [-ZWEI_DURCH_WURZEL3, ZWEI_DURCH_WURZEL3]);
    expect(feld('2', 'w').erwartet).toBeCloseTo(wende[1]!, 3);
    expect(A2.f(wende[1]!)).toBeCloseTo(feld('2', 'yw').erwartet, 4);
    const f = (id: string, text: string) => bewerte([{ id, erwartet: feld('2', id).erwartet, toleranz: feld('2', id).toleranz }], { [id]: text })[id];
    expect(f('w', '1,15')).toBe('richtig');
    expect(f('w', '1,155')).toBe('richtig');
    expect(f('w', '1,16')).toBe('falsch');
    expect(f('yw', '-1,11')).toBe('richtig');
    expect(f('yw', '-1,12')).toBe('falsch');
    expect(f('a', '-2')).toBe('richtig');
    // f″ wechselt an den Wendestellen das Vorzeichen, f‴ ist dort nicht null
    for (const x of wende) {
      expect(ddf(A2.f)(x - 0.05) * ddf(A2.f)(x + 0.05)).toBeLessThan(0);
      expect(Math.abs(A2.dddf(x))).toBeGreaterThan(1);
    }
    // Symmetrie zur y-Achse
    for (const x of punkte(0, 3, 10)) expect(A2.f(-x)).toBeCloseTo(A2.f(x), 12);
  });
  it('3: f′ hat bei 2 eine Berührstelle ohne Vorzeichenwechsel, kein Extrempunkt, Sattelpunkt (2 | 3)', () => {
    expect(vorzeichenwechsel(df(A3.f), 0.5, 3.5)).toHaveLength(feld('3', 'n').erwartet);
    expect(alleNullstellen(df(A3.f), 0.5, 3.5)).toHaveLength(1);
    nahe(alleNullstellen(df(A3.f), 0.5, 3.5), [feld('3', 'x').erwartet]);
    for (const x of punkte(0.5, 3.5, 300)) expect(richardson(A3.f, x)).toBeGreaterThanOrEqual(-1e-7);
    const wende = vorzeichenwechsel(ddf(A3.f), 0.5, 3.5);
    nahe(wende, [feld('3', 'x').erwartet]);
    expect(A3.f(2)).toBeCloseTo(feld('3', 'y').erwartet, 10);
    expect(A3.f(2)).toBeCloseTo((2 - 2) ** 3 + 3, 12);
    expect(richardson(A3.f, 2)).toBeCloseTo(0, 6);
  });
  it('4: Die Aussagen über f aus dem Schaubild von f′ werden einzeln geprüft', () => {
    const d1 = F4.df;
    const q = fragen.find((x) => x.nummer === '4')!;
    expect(q.optionen.find((o) => o.richtig)!.id).toBe('w');
    // f′ ist die Ableitung von f, f″ die von f′
    for (const x of punkte(-3, 3, 40)) {
      expect(richardson(F4.f, x)).toBeCloseTo(d1(x), 5);
      expect(richardson(d1, x)).toBeCloseTo(F4.ddf(x), 5);
    }
    // 'w': f′ hat bei −1 einen Hochpunkt (f″ von plus nach minus), f′(−1) = 1, also hat K_f dort einen Wendepunkt
    nahe(vorzeichenwechsel(ddf(F4.f), -3, 3), [-1, 1]);
    expect(ddf(F4.f)(-1.1)).toBeGreaterThan(0);
    expect(ddf(F4.f)(-0.9)).toBeLessThan(0);
    expect(d1(-1)).toBeCloseTo(1, 12);
    expect(d1(-1.1)).toBeLessThan(d1(-1));
    expect(d1(-0.9)).toBeLessThan(d1(-1));
    // 't1': bei 1 berührt f′ die x-Achse ohne Vorzeichenwechsel, K_f hat dort keinen Tiefpunkt
    expect(d1(0.9)).toBeGreaterThan(0);
    expect(d1(1.1)).toBeGreaterThan(0);
    expect(F4.f(1.1)).toBeGreaterThan(F4.f(1));
    expect(F4.f(0.9)).toBeLessThan(F4.f(1));
    // 'm': links von −2 ist f′ negativ, K_f fällt
    for (const x of punkte(-3, -2.05, 20)) expect(d1(x)).toBeLessThan(0);
    // 'k': zwischen −1 und 1 ist f′ positiv, aber f″ negativ: rechtsgekrümmt
    for (const x of punkte(-0.95, 0.95, 20)) {
      expect(d1(x)).toBeGreaterThan(0);
      expect(F4.ddf(x)).toBeLessThan(0);
    }
    // alle Nullstellen von f′: −2 und 1, der Tiefpunkt von K_f liegt bei (−2 | −3/2), der Wendepunkt bei (−1 | −13/16), die Sattelstelle bei (1 | 3/16)
    nahe(alleNullstellen(d1, -3, 3), [-2, 1]);
    expect(F4.f(-2)).toBeCloseTo(-3 / 2, 12);
    expect(F4.f(-1)).toBeCloseTo(-13 / 16, 12);
    expect(F4.f(1)).toBeCloseTo(3 / 16, 12);
  });
  it('5: f″ hat drei Nullstellen, aber nur zwei Wendestellen, K_f ist auf ]−2; 3[ rechtsgekrümmt', () => {
    expect(alleNullstellen(F5.ddf, -3.5, 4)).toHaveLength(feld('5', 'n0').erwartet);
    const wechsel = vorzeichenwechsel(F5.ddf, -3.5, 4);
    expect(wechsel).toHaveLength(feld('5', 'nw').erwartet);
    nahe(wechsel, [-2, 3]);
    expect(feld('5', 'a').erwartet).toBeCloseTo(wechsel[1]!, 6);
    // f″ ≤ 0 auf [−2; 3], aber f″(0) = 0
    for (const x of punkte(-2, 3, 200)) expect(F5.ddf(x)).toBeLessThanOrEqual(1e-12);
    expect(F5.ddf(0)).toBeCloseTo(0, 12);
    // f′ fällt streng durch 0 hindurch
    expect(F5.df(-0.1)).toBeGreaterThan(F5.df(0));
    expect(F5.df(0)).toBeGreaterThan(F5.df(0.1));
    // die gezeichnete Funktion f hat genau diese zweite Ableitung
    for (const x of punkte(-3.5, 4, 30)) expect(ddf(F5.f)(x)).toBeCloseTo(F5.ddf(x), 3);
    // Nullstellen von f′: 0 und (5 ± √665) / 8
    nahe(alleNullstellen(F5.df, -3.5, 4), [(5 - Math.sqrt(665)) / 8, 0, (5 + Math.sqrt(665)) / 8]);
  });
  it('6: Jede falsche Zuordnung scheitert an der Ableitungsbeziehung, B gehört zu keiner Funktion', () => {
    const Z = ZUORDNUNG;
    const S: Record<string, Fn> = { A: Z.a, B: Z.b, C: Z.c, D: Z.d };
    const geht = (f: string, f1: string, f2: string) => istAbleitung(S[f]!, S[f1]!) && istAbleitung(S[f1]!, S[f2]!);
    expect(geht('C', 'A', 'D')).toBe(true);
    // Zuordnungen der Antworten
    const zuordnungen: Record<string, [string, string, string]> = { richtig: ['C', 'A', 'D'], b: ['C', 'B', 'D'], a: ['A', 'D', 'C'], d: ['D', 'A', 'C'] };
    const q = fragen.find((x) => x.nummer === '6')!;
    expect(q.optionen.find((o) => o.richtig)!.id).toBe('richtig');
    for (const o of q.optionen) {
      const [f, f1, f2] = zuordnungen[o.id]!;
      expect(geht(f, f1, f2), o.id).toBe(o.richtig);
    }
    // alle sechs Zuordnungen mit je einer der Schaubilder: genau eine ist möglich, B kommt nie vor
    const namen = ['A', 'B', 'C', 'D'];
    const moegliche = namen.flatMap((f) => namen.flatMap((f1) => namen.filter((f2) => new Set([f, f1, f2]).size === 3 && geht(f, f1, f2)).map((f2) => `${f}${f1}${f2}`)));
    expect(moegliche).toEqual(['CAD']);
    // Begründungen der Rückmeldungen: Teilbeziehungen
    expect(istAbleitung(S.A!, S.D!)).toBe(true);
    expect(istAbleitung(S.D!, S.A!)).toBe(false);
    expect(istAbleitung(S.C!, S.B!)).toBe(false);
    expect(S.B!(0)).not.toBeCloseTo(0, 3);
    expect(S.A!(0)).toBeCloseTo(0, 12);
    // C: Hochpunkt bei 0 und Tiefpunkte bei ±√3 (waagerechte Tangenten), A: Extrempunkte bei ±1, D: Nullstellen bei ±1
    nahe(alleNullstellen(df(Z.c), -3, 3), [-Math.sqrt(3), 0, Math.sqrt(3)]);
    nahe(alleNullstellen(df(Z.a), -3, 3), [-1, 1]);
    nahe(alleNullstellen(Z.d, -3, 3), [-1, 1]);
    // B hat nur eine Nullstelle (bei etwa −2,1)
    const nb = alleNullstellen(Z.b, -3, 3);
    expect(nb).toHaveLength(1);
    expect(nb[0]!).toBeCloseTo(-2.1, 1);
    expect(Z.b(-1)).toBeCloseTo(5 / 3, 10);
    expect(Z.b(1)).toBeCloseTo(1 / 3, 10);
    // D ist eine Parabel, die Ableitung von D ist eine Gerade
    for (const x of punkte(-2, 2, 10)) expect(richardson(Z.d, x)).toBeCloseTo(2 * x, 5);
    expect(Z.c(Math.sqrt(3))).toBeCloseTo(-0.75, 12);
  });
  it('7: Gegenbeispiele: x⁴/12 hat f″(0) = 0 ohne Vorzeichenwechsel, der Wendepunkt bei 1 hat keine waagerechte Tangente', () => {
    const q = fragen.find((x) => x.nummer === '7')!;
    expect(q.optionen.find((o) => o.richtig)!.id).toBe('gegen');
    const v = GEGENBEISPIELE.vier;
    expect(ddf(v.f)(0)).toBeCloseTo(0, 4);
    expect(vorzeichenwechsel(ddf(v.f), -2, 2)).toHaveLength(0);
    expect(ddf(v.f)(-0.5)).toBeGreaterThan(0);
    expect(ddf(v.f)(0.5)).toBeGreaterThan(0);
    // K_f′ hat bei 0 eine waagerechte Tangente (f″(0) = 0), aber f′ = x³/3 steigt streng: kein Extrempunkt
    for (const x of punkte(-2, 2, 200).slice(1)) expect(v.df(x)).toBeGreaterThan(v.df(x - 0.02));
    const k = GEGENBEISPIELE.kubisch;
    nahe(vorzeichenwechsel(ddf(k.f), -2, 3), [1]);
    expect(richardson(k.f, 1)).toBeCloseTo(-1.5, 6);
    expect(k.f(1)).toBeCloseTo(1, 12);
    // an jeder Wendestelle ist f″ null (notwendig): Beispiel kubisch und sattel
    expect(k.ddf(1)).toBe(0);
  });
  it('8: Die größte Zuflussrate liegt bei der Wendestelle von V, Randwerte sind kleiner', () => {
    const V = BECKEN.v;
    const nullen = vorzeichenwechsel(ddf(V), 0, 6);
    nahe(nullen, [feld('8', 't').erwartet]);
    expect(BECKEN.dddv(3)).toBeLessThan(0);
    const raten = punkte(0, 6, 6000).map((t) => richardson(V, t));
    const groesste = Math.max(...raten);
    expect(groesste).toBeCloseTo(feld('8', 'r').erwartet, 4);
    expect(punkte(0, 6, 6000)[raten.indexOf(groesste)]!).toBeCloseTo(3, 2);
    expect(V(3)).toBeCloseTo(feld('8', 'v').erwartet, 10);
    expect(richardson(V, 6)).toBeCloseTo(feld('8', 'e').erwartet, 4);
    expect(richardson(V, 0)).toBeCloseTo(0, 6);
    expect(V(6)).toBeCloseTo(BECKEN.mengeEnde, 10);
    // die Menge nimmt zu: V′ ≥ 0 auf [0; 6]
    for (const t of punkte(0, 6, 100)) expect(richardson(V, t)).toBeGreaterThanOrEqual(-1e-7);
    // Eingaben mit Komma werden akzeptiert
    expect(bewerte([{ id: 'x', erwartet: feld('8', 'r').erwartet }], { x: '2,25' }).x).toBe('richtig');
  });
  it('9: a und b erfüllen die Bedingungen, Probe mit Vorzeichenwechseln, y-Koordinate des Hochpunkts', () => {
    const f = A9.schar(feld('9', 'a').erwartet, feld('9', 'b').erwartet);
    expect(ddf(f)(1)).toBeCloseTo(0, 5);
    expect(richardson(f, -1)).toBeCloseTo(0, 6);
    // unabhängig gelöst: aus f″(1) = 6 + 2a = 0 und f′(−1) = 3 − 2a + b = 0
    const a = -6 / 2;
    const b = -(3 - 2 * a);
    expect(a).toBe(feld('9', 'a').erwartet);
    expect(b).toBe(feld('9', 'b').erwartet);
    // Probe: f′ wechselt bei −1 von plus nach minus, f″ wechselt bei 1 das Vorzeichen
    expect(richardson(f, -1.1)).toBeGreaterThan(0);
    expect(richardson(f, -0.9)).toBeLessThan(0);
    expect(ddf(f)(0.9) * ddf(f)(1.1)).toBeLessThan(0);
    expect(f(-1)).toBeCloseTo(feld('9', 'y').erwartet, 10);
    nahe(vorzeichenwechsel(df(f), -3, 5), [-1, 3]);
    // genau diese beiden Werte erfüllen die Bedingungen: andere Werte nicht
    for (const [aa, bb] of [[-3, -8], [-2, -9], [3, 9]] as [number, number][]) {
      const g = A9.schar(aa, bb);
      expect(Math.abs(ddf(g)(1)) < 1e-6 && Math.abs(richardson(g, -1)) < 1e-6).toBe(false);
    }
    expect(A9.f(1)).toBeCloseTo(-11, 12);
    expect(A9.f(3)).toBeCloseTo(-27, 12);
  });
  it('10: Extrempunkte der Schar nur für t > 0 (Vorzeichenwechsel von f_t′), t = 0 hat nur eine Berührstelle', () => {
    const q = fragen.find((x) => x.nummer === '10')!;
    expect(q.optionen.find((o) => o.richtig)!.id).toBe('pos');
    for (const tt of [-3, -1, -0.25, 0, 0.25, 1, 4]) {
      const f = SCHAR_T.f(tt);
      const wechsel = vorzeichenwechsel(df(f), -4, 4);
      expect(wechsel.length > 0, `t = ${tt}`).toBe(tt > 0);
      if (tt > 0) nahe(wechsel, [-Math.sqrt(tt), Math.sqrt(tt)]);
      expect(alleNullstellen(df(f), -4, 4).length, `t = ${tt}`).toBe(tt > 0 ? 2 : tt === 0 ? 1 : 0);
      for (const x of punkte(-3, 3, 12)) expect(SCHAR_T.df(tt)(x), `t = ${tt}`).toBeCloseTo(richardson(f, x), 5);
    }
    // Hochpunkt bei −√t, Tiefpunkt bei √t
    const f1 = SCHAR_T.f(1);
    expect(richardson(f1, -1.1)).toBeGreaterThan(0);
    expect(richardson(f1, -0.9)).toBeLessThan(0);
    expect(f1(-1)).toBeCloseTo(2, 12);
    expect(f1(1)).toBeCloseTo(-2, 12);
    // t = 0: f′ = 3x² ≥ 0
    for (const x of punkte(-3, 3, 100)) expect(SCHAR_T.df(0)(x)).toBeGreaterThanOrEqual(0);
    // t < 0: f′ > 0 überall
    for (const x of punkte(-3, 3, 100)) expect(SCHAR_T.df(-1)(x)).toBeGreaterThan(0);
  });
  it('11: f″ ist linear mit einer Nullstelle und f‴ = 6a ≠ 0, f″ wechselt dort das Vorzeichen (Stichproben)', () => {
    const q = fragen.find((x) => x.nummer === '11')!;
    expect(q.optionen.find((o) => o.richtig)!.id).toBe('ok');
    const koeffizienten: [number, number, number, number][] = [[1, -3, 0, 2], [-2, 1, 5, -4], [0.5, 4, -1, 0], [3, 0, 0, 0], [-1, -2, 7, 1]];
    for (const [a, b, c, d] of koeffizienten) {
      const f: Fn = (x) => a * x ** 3 + b * x * x + c * x + d;
      const x0 = -b / (3 * a);
      const wende = vorzeichenwechsel(ddf(f), x0 - 10, x0 + 10);
      nahe(wende, [x0], 2);
      expect(ddf(f)(x0 - 0.1) * ddf(f)(x0 + 0.1)).toBeLessThan(0);
      expect(richardson((x) => ddf(f)(x), x0)).toBeCloseTo(6 * a, 2);
    }
    // Gegenbeispiel zur zweiten Antwort: f′ hat höchstens zwei Nullstellen, die Wendestelle liegt aber woanders: x³ − 3x² hat Extremstellen 0 und 2, die Wendestelle ist 1
    const f: Fn = (x) => x ** 3 - 3 * x * x;
    nahe(vorzeichenwechsel(df(f), -3, 4), [0, 2]);
    nahe(vorzeichenwechsel(ddf(f), -3, 4), [1]);
  });
  it('Texte der Beobachtungen: die genannten Zahlen stimmen mit den Funktionen überein', () => {
    const kub = findeKurve('kubisch');
    // Auftrag 1
    expect(kub.f(0)).toBe(2);
    expect(kub.f(1)).toBe(1);
    expect(kub.f(2)).toBe(0);
    expect(kub.ddf(0)).toBe(-3);
    expect(kub.ddf(2)).toBe(3);
    expect(kub.df(1)).toBe(-1.5);
    // Auftrag 2: kleinste bzw. größte Steigung bei x = 1, bei +x³/2 nur eine kleinste, bei −x³/2 nur eine größte
    const fall = findeKurve('kubisch-fallend');
    const rate = (fn: typeof kub) => punkte(-50, 50, 20000).map((x) => fn.df(x));
    expect(Math.min(...rate(kub))).toBeCloseTo(-1.5, 6);
    expect(Math.max(...rate(kub))).toBeGreaterThan(1000);
    expect(Math.max(...rate(fall))).toBeCloseTo(1.5, 6);
    expect(Math.min(...rate(fall))).toBeLessThan(-1000);
    expect(fall.df(1)).toBe(1.5);
    expect(ddf(kub.f)(0.9) * ddf(kub.f)(1.1)).toBeLessThan(0);
    expect(ddf(kub.f)(0.9)).toBeLessThan(0);
    expect(ddf(fall.f)(0.9)).toBeGreaterThan(0);
    // Auftrag 3 und Rechnung
    const sat = findeKurve('sattel');
    expect([sat.df(0) + 0, sat.ddf(0) + 0, sat.dddf(0) + 0]).toEqual([0, 0, -2]);
    expect(sat.df(2)).toBeCloseTo(-4 / 3, 12);
    expect(sat.dddf(2)).toBe(2);
    expect(sat.f(0)).toBe(0);
    expect(sat.f(2)).toBeCloseTo(-4 / 3, 12);
    expect(sat.f(3)).toBeCloseTo(-9 / 4, 12);
    expect(sat.ddf(3)).toBe(3);
    expect(sat.df(-1)).toBeCloseTo(-4 / 3, 12);
    expect(sat.df(1)).toBeCloseTo(-2 / 3, 12);
    expect(sat.df(4)).toBeCloseTo(16 / 3, 12);
    expect(sat.ddf(-1)).toBe(3);
    expect(sat.ddf(1)).toBe(-1);
    // K_f fällt auf ]−∞; 3[ auch durch die waagerechte Tangente bei 0
    for (const x of punkte(-1.5, 3, 200).slice(1)) expect(sat.f(x)).toBeLessThan(sat.f(x - 0.0225));
    // lokal größte und kleinste Steigung bei 0 und 2
    expect(sat.df(0)).toBeGreaterThan(sat.df(-0.2));
    expect(sat.df(0)).toBeGreaterThan(sat.df(0.2));
    expect(sat.df(2)).toBeLessThan(sat.df(1.8));
    expect(sat.df(2)).toBeLessThan(sat.df(2.2));
    // Auftrag 4: gleiche Werte bei 0, unterschiedliche Stellen
    const v = findeKurve('vier');
    const fu = findeKurve('fuenf');
    for (const fn of [v, fu]) expect([fn.df(0) + 0, fn.ddf(0) + 0, fn.dddf(0) + 0]).toEqual([0, 0, 0]);
    expect(v.df(-0.1)).toBeLessThan(0);
    expect(v.df(0.1)).toBeGreaterThan(0);
    expect(v.ddf(-0.1)).toBeGreaterThan(0);
    expect(v.ddf(0.1)).toBeGreaterThan(0);
    expect(fu.df(-0.1)).toBeGreaterThan(0);
    expect(fu.df(0.1)).toBeGreaterThan(0);
    expect(fu.ddf(-0.1)).toBeLessThan(0);
    expect(fu.ddf(0.1)).toBeGreaterThan(0);
    // Vermutung 1 bis 3
    expect(kub.ddf(1.5)).toBeGreaterThan(0);
    expect(kub.ddf(0.5)).toBeLessThan(0);
    expect(v.ddf(0.3)).toBeCloseTo(0.09, 12);
  });
});

describe('Schaubilder', () => {
  const drei: [string, DreiDaten][] = Object.entries(B).filter(([, v]) => typeof v === 'object' && v !== null && 'mitte' in (v as object)) as [string, DreiDaten][];
  const paare: [string, PaarDaten][] = Object.entries(B).filter(([, v]) => typeof v === 'object' && v !== null && 'oben' in (v as object) && !('mitte' in (v as object))) as [string, PaarDaten][];
  const einzelne: [string, MessbildDaten][] = [
    ...(Object.entries(B).filter(([, v]) => typeof v === 'object' && v !== null && 'kurven' in (v as object)) as [string, MessbildDaten][]),
    ...Object.entries(B.BILD_ZUORD).map(([n, v]) => [`BILD_ZUORD.${n}`, v] as [string, MessbildDaten]),
    ...B.BILDER_SCHAR.map((b) => [`BILDER_SCHAR.${b.t}`, b.daten] as [string, MessbildDaten]),
  ];
  const alle: [string, MessbildDaten][] = [
    ...einzelne,
    ...paare.flatMap(([n, p]) => [[`${n}.oben`, p.oben], [`${n}.unten`, p.unten]] as [string, MessbildDaten][]),
    ...drei.flatMap(([n, p]) => [[`${n}.oben`, p.oben], [`${n}.mitte`, p.mitte], [`${n}.unten`, p.unten]] as [string, MessbildDaten][]),
  ];
  it('es gibt alle Schaubilder, jedes mit Beschreibung, Punkte liegen auf einer Kurve und im Ausschnitt', () => {
    expect(einzelne.length).toBeGreaterThanOrEqual(15);
    expect(drei.length).toBeGreaterThanOrEqual(14);
    expect(paare.length).toBeGreaterThanOrEqual(1);
    for (const [name, b] of alle) {
      expect(b.beschreibung.length, name).toBeGreaterThan(60);
      for (const p of b.punkte ?? []) {
        const auf = b.kurven.some((k) => (k.von === undefined || p.x >= k.von - 1e-9) && (k.bis === undefined || p.x <= k.bis + 1e-9) && Math.abs(k.f(p.x) - p.y) < 1e-6);
        expect(auf, `${name}: Punkt (${p.x} | ${p.y})`).toBe(true);
        expect(p.x, name).toBeGreaterThanOrEqual(b.bereich[0] - 1e-9);
        expect(p.x, name).toBeLessThanOrEqual(b.bereich[1] + 1e-9);
        expect(p.y, name).toBeGreaterThanOrEqual(b.bereich[2] - 1e-9);
        expect(p.y, name).toBeLessThanOrEqual(b.bereich[3] + 1e-9);
      }
    }
  });
  it('Beschriftungen liegen nie auf einem Schaubild, einer Geraden oder der gestrichelten Hilfslinie und nicht unter der x-Achse, wenn der Punkt auf der Achse liegt', () => {
    let zahl = 0;
    const fehler: string[] = [];
    for (const [name, b] of alle) {
      for (const p of b.punkte ?? []) {
        if (!p.text) continue;
        zahl++;
        const lage = (p.lage ?? 'oben-links') as BeschriftungsLage;
        const hilfslinie = (b.strecken ?? []).some((st) => Math.abs(st.von[0] - p.x) < 1e-9 && Math.abs(st.bis[0] - p.x) < 1e-9 && st.gestrichelt);
        const d = labelAbstand(lage, p, b.bereich, b.kurven, hilfslinie);
        if (d < MIN_ABSTAND * 0.85) fehler.push(`${name}: ${p.text} bei (${p.x} | ${p.y}), Lage ${lage}, Abstand ${d.toFixed(3)}`);
        if (Math.abs(p.y) < 1e-9 && /unten/.test(lage)) fehler.push(`${name}: ${p.text} auf der Achse liegt unten`);
        // Punkte nahe der y-Achse: Beschriftung rechts davon, damit sie die Zahlen der y-Achse nicht verdeckt
        const [xmin, xmax] = b.bereich;
        if (name.startsWith('DREI_') && xmin < 0 && xmax > 0 && Math.abs((p.x - 0) / (xmax - xmin)) < NAH_Y_ACHSE && !/rechts/.test(lage)) fehler.push(`${name}: ${p.text} bei x = ${p.x} steht nicht rechts von der y-Achse (${lage})`);
      }
    }
    expect(fehler).toEqual([]);
    expect(zahl).toBeGreaterThan(90);
  });
  it('Dreierbilder: Mitte ist die Ableitung (Richardson) der oberen Kurve, unten die zweite Differenz, gleiche x-Bereiche, Farben orange, grün und rosa', () => {
    for (const [name, p] of drei) {
      for (const b of [p.mitte, p.unten]) {
        expect(b.bereich[0], name).toBe(p.oben.bereich[0]);
        expect(b.bereich[1], name).toBe(p.oben.bereich[1]);
      }
      const f = p.oben.kurven[0]!.f;
      for (const x of punkte(p.oben.bereich[0] + 0.05, p.oben.bereich[1] - 0.05, 80)) {
        expect(p.mitte.kurven[0]!.f(x), `${name} f′ bei ${x}`).toBeCloseTo(richardson(f, x), 4);
        expect(p.unten.kurven[0]!.f(x), `${name} f″ bei ${x}`).toBeCloseTo(zweiteDifferenz(f)(x), 2);
      }
      expect(p.oben.kurven[0]!.farbe).toBe(ORANGE);
      expect(p.mitte.kurven[0]!.farbe).toBe(GRUEN);
      expect(p.unten.kurven[0]!.farbe).toBe(ROSA);
      // dieselben Stellen in allen drei Schaubildern, dieselben Buchstaben
      expect((p.mitte.punkte ?? []).map((q) => [q.x, q.text])).toEqual((p.oben.punkte ?? []).map((q) => [q.x, q.text]));
      expect((p.unten.punkte ?? []).map((q) => [q.x, q.text])).toEqual((p.oben.punkte ?? []).map((q) => [q.x, q.text]));
    }
  });
  it('Dreierbilder: H, T, S haben eine waagerechte Tangente, H und T das passende Vorzeichen von f″ (oder f″ = 0), W und S einen Vorzeichenwechsel von f″', () => {
    let markiert = 0;
    for (const [name, p] of drei) {
      const f = p.oben.kurven[0]!.f;
      for (const pk of p.oben.punkte ?? []) {
        const x = pk.x;
        markiert++;
        if (pk.text === 'H' || pk.text === 'T' || pk.text === 'S') expect(Math.abs(richardson(f, x)), `${name} ${pk.text}`).toBeLessThan(1e-4);
        if (pk.text === 'W') expect(Math.abs(richardson(f, x)), `${name} W`).toBeGreaterThan(1e-3);
        if (pk.text === 'H') {
          expect(zweiteDifferenz(f)(x), `${name} H`).toBeLessThan(1e-6);
          expect(richardson(f, x - 0.05), `${name} H links`).toBeGreaterThan(0);
          expect(richardson(f, x + 0.05), `${name} H rechts`).toBeLessThan(0);
        }
        if (pk.text === 'T') {
          expect(zweiteDifferenz(f)(x), `${name} T`).toBeGreaterThan(-1e-6);
          expect(richardson(f, x - 0.05), `${name} T links`).toBeLessThan(0);
          expect(richardson(f, x + 0.05), `${name} T rechts`).toBeGreaterThan(0);
        }
        if (pk.text === 'W' || pk.text === 'S') expect(zweiteDifferenz(f)(x - 0.05) * zweiteDifferenz(f)(x + 0.05), `${name} ${pk.text}`).toBeLessThan(0);
        if (pk.text === 'S') expect(richardson(f, x - 0.05) * richardson(f, x + 0.05), `${name} S`).toBeGreaterThan(0);
      }
    }
    expect(markiert).toBeGreaterThan(30);
  });
  it('die Bereiche auf der x-Achse: blau, wo f′ bzw. f″ positiv ist, schwarz, wo es negativ ist', () => {
    let balken = 0;
    for (const [name, p] of drei) {
      const f = p.oben.kurven[0]!.f;
      const pruefe = (b: MessbildDaten, wert: (x: number) => number) => {
        for (const s of (b.strecken ?? []).filter((x) => x.von[1] === 0 && x.bis[1] === 0 && x.von[0] !== x.bis[0])) {
          balken++;
          expect([BLAU, SCHWARZ], name).toContain(s.farbe);
          for (const x of punkte(s.von[0] + 0.05, s.bis[0] - 0.05, 40)) {
            const v = wert(x);
            if (Math.abs(v) > 1e-5) expect(v > 0, `${name} bei ${x}`).toBe(s.farbe === BLAU);
          }
        }
      };
      pruefe(p.mitte, (x) => richardson(f, x));
      pruefe(p.unten, (x) => zweiteDifferenz(f)(x));
      // in K_f selbst gibt es keine Bereiche auf der Achse
      expect((p.oben.strecken ?? []).filter((x) => x.von[1] === 0 && x.bis[1] === 0 && x.von[0] !== x.bis[0])).toHaveLength(0);
    }
    expect(balken).toBeGreaterThan(30);
  });
  it('der Paarbild-Aufbau aus dem Modul Grafisches Differenzieren liefert im Erklären die Bereiche, in denen K_f steigt (blau) und fällt (schwarz)', () => {
    const p = B.PAAR_ERKLAEREN;
    const f = p.oben.kurven[0]!.f;
    const bereiche = (p.oben.strecken ?? []).filter((s) => s.von[1] === 0 && s.bis[1] === 0);
    expect(bereiche).toHaveLength(3);
    for (const s of bereiche) for (const x of punkte(s.von[0] + 0.05, s.bis[0] - 0.05, 40)) {
      const m = richardson(f, x);
      if (s.farbe === BLAU) expect(m).toBeGreaterThan(0);
      else expect(s.farbe).toBe(SCHWARZ), expect(m).toBeLessThan(0);
    }
    expect(p.oben.punkte ?? []).toHaveLength(0);
    nahe(bereiche.map((s) => s.von[0]), [-3, -1, 3]);
  });
  it('Erklären: Die Tangenten der beiden Kurven berühren K_f, die Steigungen nehmen zu bzw. ab', () => {
    for (const [bild, q, richtung] of [[B.BILD_LINKS, KURVE.links, 1], [B.BILD_RECHTS, KURVE.rechts, -1]] as const) {
      const tangenten = bild.kurven.slice(1);
      expect(tangenten).toHaveLength(3);
      const steigungen = tangenten.map((k) => k.f(1) - k.f(0));
      tangenten.forEach((k, i) => {
        const x0 = q.stellen[i]!;
        expect(k.f(x0)).toBeCloseTo(q.f(x0), 10);
        expect(steigungen[i]!).toBeCloseTo(richardson(q.f, x0), 5);
        expect(k.von).toBeCloseTo(x0 - 1.3, 12);
      });
      for (let i = 1; i < steigungen.length; i++) expect(Math.sign(steigungen[i]! - steigungen[i - 1]!)).toBe(richtung);
      expect(steigungen.map((m) => Math.round(m))).toEqual(richtung === 1 ? [-1, 0, 1] : [1, 0, -1]);
    }
  });
  it('Vier Fälle: In jedem nummerierten Punkt stimmen Monotonie und Krümmung mit den Vorzeichen von f′ und f″ überein', () => {
    const f = findeKurve('kubisch').f;
    expect(VIER_FAELLE.map((p) => p.nr)).toEqual(['1', '2', '3', '4']);
    expect(new Set(VIER_FAELLE.map((p) => `${p.steigt}${p.links}`)).size).toBe(4);
    for (const p of VIER_FAELLE) {
      expect(richardson(f, p.x) > 0, `Punkt ${p.nr}`).toBe(p.steigt);
      expect(zweiteDifferenz(f)(p.x) > 0, `Punkt ${p.nr}`).toBe(p.links);
    }
    const punkteBild = B.BILD_VIER_FAELLE.punkte ?? [];
    expect(punkteBild.map((p) => p.text)).toEqual(['1', '2', '3', '4']);
    punkteBild.forEach((p, i) => expect(p.x).toBe(VIER_FAELLE[i]!.x));
  });
  it('Aufgabe 8: Wendepunkt und Tangente (Steigung 2,25) im Bild, Hochpunkt der Zuflussrate bei 3', () => {
    const v = B.BILD_BECKEN_V;
    const w = v.punkte![0]!;
    expect(w.x).toBe(3);
    expect(w.y).toBeCloseTo(4.5, 12);
    const tangente = v.kurven[1]!;
    expect(tangente.f(3)).toBeCloseTo(4.5, 12);
    expect(tangente.f(4) - tangente.f(3)).toBeCloseTo(2.25, 12);
    expect(tangente.f(3)).toBeCloseTo(BECKEN.v(3), 12);
    expect(richardson(BECKEN.v, 3)).toBeCloseTo(2.25, 6);
    const dv = B.BILD_BECKEN_DV;
    expect(dv.punkte![0]!.y).toBeCloseTo(2.25, 12);
    expect(dv.kurven[0]!.von).toBe(0);
    expect(dv.kurven[0]!.bis).toBe(6);
  });
  it('Schaubilder der Aufgaben 4 und 5 zeigen die gegebenen Kurven in den Farben von K_f′ und K_f″', () => {
    expect(B.BILD_F4.kurven[0]!.farbe).toBe(GRUEN);
    expect(B.BILD_F5.kurven[0]!.farbe).toBe(ROSA);
    for (const x of punkte(-3, 3, 20)) expect(B.BILD_F4.kurven[0]!.f(x)).toBeCloseTo(F4.df(x), 12);
    for (const x of punkte(-3.5, 4, 20)) expect(B.BILD_F5.kurven[0]!.f(x)).toBeCloseTo(F5.ddf(x), 12);
  });
  it('die gestrichelten Geraden in den Bildern sind Tangenten an eine durchgezogene Kurve', () => {
    const linear = (f: (x: number) => number) => [[0, 1, 2], [-1.7, 0.4, 2.5], [3, 5, 7.3]].every(([a, b, c]) => Math.abs((f(c!) - f(b!)) / (c! - b!) - (f(b!) - f(a!)) / (b! - a!)) < 1e-9);
    for (const [name, b] of alle) {
      const durchgezogen = b.kurven.filter((k) => !k.gestrichelt && !linear(k.f));
      const [x0, x1] = [b.bereich[0], b.bereich[1]];
      for (const k of b.kurven.filter((c) => c.gestrichelt && linear(c.f))) {
        const m = k.f(1) - k.f(0);
        let gefunden = false;
        for (const f of durchgezogen) for (let i = 0; i <= 4000 && !gefunden; i++) {
          const x = x0 + ((x1 - x0) * i) / 4000;
          if (Math.abs(k.f(x) - f.f(x)) < 1e-2 && Math.abs(richardson(f.f, x) - m) < 2e-2) gefunden = true;
        }
        expect(gefunden, `${name}: Tangente mit Steigung ${m}`).toBe(true);
      }
    }
  });
  it('Farben: Orange, Grün, Rosa, Blau und Schwarz sind gut zu unterscheiden', () => {
    const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const abstand = (a: string, b: string) => Math.hypot(...rgb(a).map((v, k) => v - rgb(b)[k]!));
    const farben = { orange: ORANGE, gruen: GRUEN, rosa: ROSA, blau: BLAU, schwarz: SCHWARZ };
    const namen = Object.keys(farben) as (keyof typeof farben)[];
    for (let i = 0; i < namen.length; i++) for (let j = i + 1; j < namen.length; j++) {
      const a = namen[i]!;
      const b = namen[j]!;
      const mindest = (a === 'gruen' && b === 'blau') ? 70 : 100;
      expect(abstand(farben[a], farben[b]), `${a} und ${b}`).toBeGreaterThan(mindest);
    }
    // die drei Kurven eines Dreierbilds unterscheiden sich deutlich
    expect(abstand(ORANGE, ROSA)).toBeGreaterThan(150);
    expect(abstand(GRUEN, ROSA)).toBeGreaterThan(150);
    expect(abstand(ORANGE, GRUEN)).toBeGreaterThan(150);
  });
});
