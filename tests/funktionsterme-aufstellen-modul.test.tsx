import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/funktionsterme-aufstellen/Bilder';
import { Bedingungslabor, wertZurBedingung } from '../content/modules/funktionsterme-aufstellen/Bedingungslabor';
import * as D from '../content/modules/funktionsterme-aufstellen/daten';
import { Expolabor, expoVerhalten } from '../content/modules/funktionsterme-aufstellen/Expolabor';
import Modul from '../content/modules/funktionsterme-aufstellen/index';
import meta from '../content/modules/funktionsterme-aufstellen/meta.json';
import { Vielfachheitslabor } from '../content/modules/funktionsterme-aufstellen/Vielfachheitslabor';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { BLAU, ORANGE, SCHWARZ, type MessbildDaten } from '../src/components/Messbild';
import { bedingungTex, type Bedingung } from '../src/lib/ansatz';
import { MIN_ABSTAND, NAH_Y_ACHSE, labelAbstand, type BeschriftungsLage, type Hindernis } from '../src/lib/beschriftung';
import { bewerte } from '../src/lib/eingabe';
import { bedingungsZeile, gauss, nullstellen, punkte, richardson, vorzeichenwechsel, zweiteDifferenz, type Fn } from './numerik';

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
const MODULORDNER = 'content/modules/funktionsterme-aufstellen';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const wert = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!.erwartet;
const alleRelevanten = () => readdirSync(MODULORDNER).filter((d) => d.endsWith('.tsx') || d.endsWith('.ts'));

/** Prüft, dass f alle Bedingungen erfüllt (Richardson-Ableitung bzw. zweite Differenz). */
function erfuellt(f: Fn, bed: Bedingung[]) {
  for (const b of bed) {
    const ist = b.art === 'f' ? f(b.x) : b.art === 'f1' ? richardson(f, b.x) : zweiteDifferenz(f)(b.x);
    expect(ist, bedingungTex(b)).toBeCloseTo(b.wert, 3);
  }
}
/** Löst einen linearen Ansatz Σ pₖ·φₖ unabhängig mit dem Gaußverfahren. */
const loese = (basis: Fn[], bed: Bedingung[]) => gauss(bed.map((b) => bedingungsZeile(basis, b.art, b.x)), bed.map((b) => b.wert));

describe('Metadaten und Darstellung', () => {
  it('im Themenbereich Differentialrechnung mit vier Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('funktionsterme-aufstellen');
    expect(meta.thema).toBe('differentialrechnung');
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.bpe).toEqual(['3.3', '4.4']);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung']);
    for (const a of meta.abschnitte) {
      const html = rendern(a.id);
      expect(html).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(html).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('rendert ohne Formelfehler und ohne Gedankenstriche, mit der Fachsprache der Lehrkraft', () => {
    const html = rendern(null);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(html).not.toContain(z);
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).toContain('Schaubild');
    for (const d of alleRelevanten()) {
      const q = readFileSync(`${MODULORDNER}/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
    }
  });
  it('Verweise auf andere Module nennen vorhandene Module und Abschnitte, Vorwissen wird verlinkt', () => {
    const ids = readdirSync('content/modules');
    let quelle = '';
    for (const d of readdirSync(MODULORDNER).filter((x) => x.endsWith('.tsx'))) {
      const q = readFileSync(`${MODULORDNER}/${d}`, 'utf8');
      quelle += q;
      for (const m of q.matchAll(/<Modulverweis modul="([^"]+)"(?: abschnitt="([^"]+)")?/g)) {
        expect(ids, `${d}: ${m[1]}`).toContain(m[1]);
        if (m[2]) {
          const abschnitte = (JSON.parse(readFileSync(`content/modules/${m[1]}/meta.json`, 'utf8')) as { abschnitte: { id: string }[] }).abschnitte.map((a) => a.id);
          expect(abschnitte, `${d}: ${m[1]}/${m[2]}`).toContain(m[2]);
        }
      }
    }
    for (const m of ['kurvendiskussion', 'tangenten', 'ableitungsregeln', 'produkt-kettenregel', 'ausfuehrliche-kurvendiskussion', 'lage-im-koordinatensystem', 'umkehrfunktion']) expect(quelle, m).toContain(`modul="${m}"`);
  });
  it('das Modul ist solange es ein Entwurf ist in keinem Kurs eingetragen', () => {
    if (meta.status !== 'entwurf') return;
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"funktionsterme-aufstellen"');
  });
  it('Erklären nennt Ansätze und Schritte, nimmt aber Vielfachheit, Anzahl der Bedingungen und Asymptote noch nicht vorweg', () => {
    const erklaeren = rendern('erklaeren');
    for (const w of ['Steckbriefaufgaben', 'Parameter', 'Ansatz wählen', 'Bedingungen aufstellen', 'Produktform', 'Allgemeine Form', 'Ein vollständiges Beispiel']) expect(erklaeren, w).toContain(w);
    for (const w of ['Vielfachheit', 'Sattelstelle', 'Asymptote', 'unendlich viele', 'so viele Bedingungen', 'frei']) expect(erklaeren, w).not.toContain(w);
    const zus = rendern('zusammenfassung');
    for (const w of ['Die vier Schritte', 'Aus Worten werden Bedingungen', 'Die passende Form wählen', 'Vielfachheit einer Nullstelle', 'Wie viele Bedingungen?', 'Exponentialfunktionen', 'Typische Fehler', 'Taschenrechner']) expect(zus, w).toContain(w);
  });
  it('Entdecken: zwei Vermutungsfragen vor den Laboren, zwölf Formulierungen, drei Labore, zwölf Beobachtungen', () => {
    const html = rendern('entdecken');
    expect((html.match(/class="labor"/g) ?? []).length).toBe(3);
    expect(html.indexOf('Vermutung')).toBeLessThan(html.indexOf('class="labor"'));
    expect((html.match(/Beobachtung vergleichen/g) ?? []).length).toBe(2 + 4 + 3 + 3);
    expect(D.UEBERSETZUNG).toHaveLength(12);
    expect((html.match(/<summary>K/g) ?? []).length + (html.match(/<summary>W\(/g) ?? []).length + (html.match(/<summary>Die Wendetangente/g) ?? []).length).toBe(12);
    for (const w of ['Labor 1: Nullstellen und Vielfachheiten', 'Labor 2: Bedingungen und Gleichungssystem', 'Labor 3: Exponentialfunktion', 'Aus Worten werden Bedingungen']) expect(html, w).toContain(w);
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
    expect(teile.length).toBeGreaterThan(90);
    for (const [name, inhalt] of teile) {
      const html = alsText(inhalt);
      expect(html, name).not.toContain('formel-fehler');
      expect(html, name).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(html, name).not.toContain(z);
    }
  });
});

describe('Labore', () => {
  it('Vielfachheitslabor: Schaubild, Legende, Chips für drei Vielfachheiten je Nullstelle, Regler, zwei Schalter', () => {
    const html = renderToStaticMarkup(<Vielfachheitslabor />);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    expect((html.match(/role="img"/g) ?? []).length).toBe(1);
    expect((html.match(/class="chip"/g) ?? []).length).toBe(9);
    for (const w of ['Legende', 'Tangente zeigen', 'Verhalten anzeigen', 'Zurücksetzen', 'type="range"', 'Grad:']) expect(html, w).toContain(w);
    expect((html.match(/type="checkbox"/g) ?? []).length).toBe(2);
  });
  it('Bedingungslabor: die Lösung erfüllt alle vier Bedingungen, der Start (alle Parameter 0) erfüllt nur die beiden Steigungsbedingungen', () => {
    const l = D.LABOR_KUBIK;
    for (const b of l.bedingungen) expect(wertZurBedingung(l.loesung, b)).toBeCloseTo(b.wert, 12);
    expect(l.bedingungen.filter((b) => Math.abs(wertZurBedingung(l.start, b) - b.wert) < 1e-9)).toHaveLength(2);
    const html = renderToStaticMarkup(<Bedingungslabor />);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    expect((html.match(/role="img"/g) ?? []).length).toBe(1);
    expect((html.match(/type="range"/g) ?? []).length).toBe(4);
    for (const w of ['2 von 4 erfüllt', 'Gleichungen zeigen', 'nicht erfüllt, aktuell', 'Zurücksetzen']) expect(html, w).toContain(w);
    // Die vier Regler erreichen die Lösung auf ihrem Raster (Schrittweite 0,5)
    for (const v of l.loesung) expect(Math.abs(v * 2 - Math.round(v * 2))).toBeLessThan(1e-12);
  });
  it('Bedingungslabor: das Gleichungssystem wird unabhängig mit dem Gaußverfahren gelöst', () => {
    const basis = [(x: number) => x ** 3, (x: number) => x * x, (x: number) => x, () => 1];
    const p = loese(basis, D.LABOR_KUBIK.bedingungen);
    D.LABOR_KUBIK.loesung.forEach((v, i) => expect(p[i]).toBeCloseTo(v, 3));
    erfuellt(D.LABOR_KUBIK.f, D.LABOR_KUBIK.bedingungen);
  });
  it('Exponentiallabor: Verhalten für x → ±∞ gegen große Werte, Asymptote y = d auf der richtigen Seite', () => {
    for (const a of [-3, -1, 1, 2.5]) {
      for (const b of [-2, -0.5, 0.5, 1.5]) {
        for (const d of [-2, 0, 3]) {
          const f = (x: number) => a * Math.exp(b * x) + d;
          const v = expoVerhalten(a, b, d);
          const rechtsNahe = Math.abs(f(40) - d) < 1e-6;
          const linksNahe = Math.abs(f(-40) - d) < 1e-6;
          expect(v.rechts.includes(`→ ${String(d).replace('-', '−')}`), `a=${a} b=${b} d=${d} rechts`).toBe(rechtsNahe);
          expect(v.links.includes(`→ ${String(d).replace('-', '−')}`), `a=${a} b=${b} d=${d} links`).toBe(linksNahe);
          expect(rechtsNahe !== linksNahe).toBe(true);
          if (!rechtsNahe) expect(v.rechts.includes('∞') && (f(40) > 0) === !v.rechts.includes('−∞')).toBe(true);
          // Steigung: f′ = ab·e^(bx) hat überall das Vorzeichen von a·b
          expect(Math.sign(richardson(f, 0.3)), `a=${a} b=${b}`).toBe(Math.sign(a * b));
        }
      }
    }
    const html = renderToStaticMarkup(<Expolabor />);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    expect((html.match(/role="img"/g) ?? []).length).toBe(1);
    expect((html.match(/type="range"/g) ?? []).length).toBe(3);
  });
});

describe('Aufgaben und Fragen', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Nummern, Hilfen und Lösungsschritte', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['5', '6', '7', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18']);
    expect(fragen.map((q) => q.nummer)).toEqual(['1', '2', '3', '4', '8']);
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(3);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(4);
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
  it('jede Erklärung und jeder Lösungsweg enthält ein Schaubild, jede Aufgabe hat ein Kontrollschaubild', () => {
    for (const q of fragen) expect(alsText(q.erklaerung), q.nummer).toContain('class="bild');
    for (const a of aufgaben) expect(alsText(a.loesung), a.nummer).toContain('class="bild');
    for (const a of aufgaben) expect(alsText(a.children), a.nummer).toContain('Schaubild zur Kontrolle einblenden');
  });
  it('Gliederung: Bedingungen aufstellen, Ganzrationale Funktionen, Exponentialfunktionen und trigonometrische Funktionen, Anwendungen', () => {
    const html = rendern('ueberpruefen');
    const stellen = ['Bedingungen aufstellen', 'Ganzrationale Funktionen', 'Exponentialfunktionen und trigonometrische Funktionen', 'Anwendungen'].map((w) => html.indexOf(`<h3>${w}</h3>`));
    stellen.forEach((i) => expect(i).toBeGreaterThan(-1));
    expect([...stellen].sort((a, b) => a - b)).toEqual(stellen);
  });
  it('jeder erwartete Wert wird mit der Eingabe in Dezimalschreibweise, als Bruch oder als Vielfaches von π richtig bewertet, ein falscher nicht', () => {
    let zahl = 0;
    for (const a of aufgaben) {
      for (const f of a.felder) {
        zahl++;
        const tol = f.toleranz !== undefined ? { toleranz: f.toleranz } : {};
        const eingabe = a.nummer === '15' && f.id === 'b' ? 'pi/3' : f.toleranz ? (Math.round(f.erwartet / f.toleranz) * f.toleranz).toFixed(4).replace('.', ',') : String(f.erwartet).replace('.', ',');
        expect(bewerte([{ id: f.id, erwartet: f.erwartet, ...tol }], { [f.id]: eingabe })[f.id], `${a.nummer} ${f.id}`).toBe('richtig');
        expect(bewerte([{ id: f.id, erwartet: f.erwartet, ...tol }], { [f.id]: String(f.erwartet + 0.5) })[f.id], `${a.nummer} ${f.id} falsch`).toBe('falsch');
      }
    }
    expect(zahl).toBe(3 + 3 + 3 + 4 + 3 + 4 + 3 + 2 + 3 + 3 + 3 + 4 + 4);
    expect(bewerte([{ id: 'a', erwartet: 0.75 }], { a: '3/4' }).a).toBe('richtig');
    expect(bewerte([{ id: 'a', erwartet: -1.5 }], { a: '-3/2' }).a).toBe('richtig');
  });

  it('Frage 1 bis 3: Bedingungen der Formulierungen gelten für die Bilder (berühren, Wendepunkt, senkrecht schneiden)', () => {
    erfuellt(D.F1.f, [{ art: 'f', x: 3, wert: 0 }, { art: 'f1', x: 3, wert: 0 }]);
    erfuellt(D.F2.f, [{ art: 'f', x: 2, wert: -1 }, { art: 'f2', x: 2, wert: 0 }, { art: 'f1', x: 2, wert: 0.5 }]);
    expect(Math.sign(D.F2.ddf(1.5))).toBe(-1);
    expect(Math.sign(D.F2.ddf(2.5))).toBe(1);
    expect(D.F3.f(1)).toBe(4);
    expect(D.F3.g(1)).toBe(4);
    expect(richardson(D.F3.f, 1) * richardson(D.F3.g, 1)).toBeCloseTo(-1, 6);
    // Gleiche Steigungen oder Gegenzahlen wären nicht senkrecht
    expect(richardson(D.F3.f, 1)).not.toBeCloseTo(richardson(D.F3.g, 1), 1);
    expect(richardson(D.F3.f, 1)).not.toBeCloseTo(-richardson(D.F3.g, 1), 1);
  });
  it('Frage 4: drei Bedingungen für vier Parameter lassen unendlich viele Funktionen zu', () => {
    const bed: Bedingung[] = D.FRAGE4.punkte.map(([x, y]) => ({ art: 'f', x, wert: y }));
    for (const k of D.FRAGE4_FAMILIE) erfuellt((x) => x + 1 + k * x * (x - 1) * (x - 2), bed);
    erfuellt((x) => x + 1, bed);
    // Das System mit vier Unbekannten hat nur drei Gleichungen: Rang 3
    const basis = [(x: number) => x ** 3, (x: number) => x * x, (x: number) => x, () => 1];
    const A = bed.map((b) => bedingungsZeile(basis, b.art, b.x));
    expect(A).toHaveLength(3);
    expect(A[0]).toHaveLength(4);
    // Zwei verschiedene Lösungen: a = 0 (Gerade) und a = 1
    const f0 = (x: number) => x + 1;
    const f1 = (x: number) => x + 1 + x * (x - 1) * (x - 2);
    expect(f0(3)).not.toBeCloseTo(f1(3), 3);
  });
  it('Aufgabe 5, 6, 7 und Frage 8: Produktform, Vielfachheiten, Nullstellen und Punkte gegen Raster und Gaußverfahren', () => {
    // 5: drei einfache Nullstellen, P(0 | 3)
    expect(nullstellen(D.A5.f, -4, 5).map((x) => Math.round(x * 1000) / 1000)).toEqual([-2, 1, 3]);
    expect(D.A5.f(0)).toBeCloseTo(3, 12);
    expect(wert('5', 'a')).toBe(D.A5.a);
    expect(D.A5.a * (0 + 2) * (0 - 1) * (0 - 3)).toBeCloseTo(3, 12);
    expect(D.A5.f(4)).toBeCloseTo(wert('5', 'f4'), 9);
    expect(richardson(D.A5.f, 0)).toBeCloseTo(wert('5', 'df0'), 4);
    for (const x of punkte(-3, 4, 28)) expect(D.A5.df(x)).toBeCloseTo(richardson(D.A5.f, x), 4);
    // 6: schneidet bei −2, berührt bei 1, P(0 | −2)
    expect(vorzeichenwechsel(D.A6.f, -4, 3).map((x) => Math.round(x * 1000) / 1000)).toEqual([-2]);
    expect(D.A6.f(1)).toBeCloseTo(0, 12);
    expect(richardson(D.A6.f, 1)).toBeCloseTo(0, 6);
    expect(D.A6.f(1 - 0.01) * D.A6.f(1 + 0.01)).toBeGreaterThan(0);
    expect(D.A6.f(0)).toBeCloseTo(-2, 12);
    const t6 = vorzeichenwechsel((x) => richardson(D.A6.f, x), -3, 2);
    expect(t6.map((x) => Math.round(x * 1000) / 1000)).toEqual([-1, 1]);
    expect(D.A6.f(wert('6', 'xt'))).toBeCloseTo(wert('6', 'yt'), 9);
    expect(zweiteDifferenz(D.A6.f)(-1)).toBeGreaterThan(0);
    // 7: Grad 5, schneidet bei −1 mit waagerechter Tangente, berührt bei 1, P(0 | −2)
    const f7 = D.A7.f;
    expect(f7(-0.01) * f7(0)).toBeGreaterThan(0);
    expect(f7(-1 - 0.01) * f7(-1 + 0.01)).toBeLessThan(0);
    expect(richardson(f7, -1)).toBeCloseTo(0, 5);
    expect(f7(1 - 0.01) * f7(1 + 0.01)).toBeGreaterThan(0);
    expect(f7(0)).toBeCloseTo(-2, 12);
    expect(f7(2)).toBeCloseTo(wert('7', 'f2'), 9);
    expect(wert('7', 'grad')).toBe(2 + 3);
    for (const x of punkte(-1.8, 1.8, 36)) expect(D.A7.df(x)).toBeCloseTo(richardson(f7, x), 3);
    // 8: Ansatz a·x(x+3)(x−2) mit P(1 | −8)
    const a8 = D.FRAGE5.p[1] / (1 * 4 * -1);
    expect(a8).toBe(D.FRAGE5.a);
    expect(nullstellen(D.FRAGE5.f, -5, 4).map((x) => Math.round(x * 1000) / 1000)).toEqual([-3, 0, 2]);
    expect(D.FRAGE5.f(1)).toBe(D.FRAGE5.p[1]);
    // ohne den Faktor x wäre f(0) = −6a, nicht 0
    expect(2 * (0 + 3) * (0 - 2)).toBe(-12);
  });
  it('Aufgabe 9, 10, 11: lineare Ansätze mit dem Gaußverfahren unabhängig gelöst', () => {
    const p9 = loese([(x) => x ** 3, (x) => x * x, (x) => x], D.A8.bedingungen);
    [wert('9', 'a'), wert('9', 'b'), wert('9', 'c')].forEach((v, i) => expect(p9[i]).toBeCloseTo(v, 3));
    erfuellt(D.A8.f, D.A8.bedingungen);
    expect(D.A8.f(1)).toBe(wert('9', 'wy'));
    expect(zweiteDifferenz(D.A8.f)(1)).toBeCloseTo(0, 3);
    const p10 = loese([(x) => x ** 4, (x) => x * x, () => 1], D.A9.bedingungen);
    [wert('10', 'a'), wert('10', 'b'), wert('10', 'c')].forEach((v, i) => expect(p10[i]).toBeCloseTo(v, 3));
    erfuellt(D.A9.f, D.A9.bedingungen);
    for (const x of punkte(0.2, 3, 14)) expect(D.A9.f(-x)).toBeCloseTo(D.A9.f(x), 12);
    for (const x of punkte(-2, 2, 20)) expect(D.A9.df(x)).toBeCloseTo(richardson(D.A9.f, x), 4);
    const tabelle: Bedingung[] = D.A10.tabelle.map(([x, y]) => ({ art: 'f', x, wert: y }));
    const p11 = loese([(x) => x ** 3, (x) => x * x, (x) => x, () => 1], tabelle);
    [wert('11', 'a'), wert('11', 'b'), wert('11', 'c'), wert('11', 'd')].forEach((v, i) => expect(p11[i]).toBeCloseTo(v, 3));
    for (const [x, y] of D.A10.tabelle) expect(D.A10.f(x)).toBeCloseTo(y, 12);
  });
  it('Aufgabe 12: Asymptote, P und Q, b unabhängig durch Bisektion', () => {
    const { a, b, d } = D.A11;
    expect(wert('12', 'a')).toBe(a);
    expect(wert('12', 'b')).toBe(b);
    expect(wert('12', 'd')).toBe(d);
    expect(D.A11.f(0)).toBeCloseTo(3, 12);
    expect(D.A11.f(Math.LN2)).toBeCloseTo(2, 12);
    expect(D.A11.f(60)).toBeCloseTo(1, 12);
    // b aus 2·e^(b ln 2) + 1 = 2 durch Bisektion
    const g = (bb: number) => 2 * Math.exp(bb * Math.LN2) + 1 - 2;
    let lo = -5;
    let hi = 5;
    for (let i = 0; i < 100; i++) {
      const m = (lo + hi) / 2;
      if (g(lo) * g(m) <= 0) hi = m;
      else lo = m;
    }
    expect((lo + hi) / 2).toBeCloseTo(b, 9);
    for (const x of punkte(-1, 3, 20)) expect(D.A11.df(x)).toBeCloseTo(richardson(D.A11.f, x), 4);
  });
  it('Aufgabe 13: (ax + b)e^x mit Tiefpunkt bei 1 und Wert −e, Gaußverfahren', () => {
    const bed: Bedingung[] = [{ art: 'f', x: 1, wert: -Math.E }, { art: 'f1', x: 1, wert: 0 }];
    const p = loese([(x) => x * Math.exp(x), (x) => Math.exp(x)], bed);
    expect(p[0]).toBeCloseTo(wert('13', 'a'), 3);
    expect(p[1]).toBeCloseTo(wert('13', 'b'), 3);
    erfuellt(D.A12.f, bed);
    expect(zweiteDifferenz(D.A12.f)(1)).toBeGreaterThan(0);
    for (const x of punkte(-3, 2, 20)) expect(D.A12.df(x)).toBeCloseTo(richardson(D.A12.f, x), 4);
  });
  it('Aufgabe 14: a(x + b)e^(kx), die Bedingungen legen b, k und a eindeutig fest (Suche über k)', () => {
    erfuellt(D.A13.f, [{ art: 'f', x: 1, wert: 0 }, { art: 'f1', x: 0.5, wert: 0 }, { art: 'f', x: 0, wert: -3 }]);
    expect([wert('14', 'a'), wert('14', 'b'), wert('14', 'k')]).toEqual([3, -1, 2]);
    // Für jedes k ≠ 0 folgt b = −1 aus f(1) = 0 und a = 3 aus f(0) = −3. Nur k = 2 erfüllt dann f′(½) = 0.
    const mitK = (k: number) => (x: number) => 3 * (x - 1) * Math.exp(k * x);
    const gk = (k: number) => richardson(mitK(k), 0.5);
    expect(vorzeichenwechsel(gk, -6, 6, 4000)).toHaveLength(1);
    expect(vorzeichenwechsel(gk, -6, 6, 4000)[0]).toBeCloseTo(2, 3);
    for (const x of punkte(-1.5, 1.5, 30)) expect(D.A13.df(x)).toBeCloseTo(richardson(D.A13.f, x), 3);
  });
  it('Aufgabe 15: 3·sin(πx/3) + 2 hat die Periode 6 und im Schnittpunkt mit der y-Achse die Wendetangente y = πx + 2', () => {
    for (const x of punkte(-3, 3, 24)) expect(D.A14.f(x + 6)).toBeCloseTo(D.A14.f(x), 9);
    expect(2 * Math.PI / wert('15', 'b')).toBeCloseTo(6, 12);
    expect(D.A14.f(0)).toBeCloseTo(wert('15', 'c'), 12);
    expect(richardson(D.A14.f, 0)).toBeCloseTo(Math.PI, 4);
    expect(zweiteDifferenz(D.A14.f)(0)).toBeCloseTo(0, 4);
    expect(D.A14.wende(0)).toBe(2);
    expect(wert('15', 'a') * wert('15', 'b')).toBeCloseTo(Math.PI, 12);
    for (const x of punkte(-3, 3, 24)) expect(D.A14.df(x)).toBeCloseTo(richardson(D.A14.f, x), 4);
    // Wendestellen von f: f″ wechselt das Vorzeichen bei x = 0
    expect(zweiteDifferenz(D.A14.f)(-0.3) * zweiteDifferenz(D.A14.f)(0.3)).toBeLessThan(0);
  });
  it('Aufgabe 16 und 17: Brücke und Ballwurf mit dem Gaußverfahren, Wurfweite als Nullstelle', () => {
    const bruecke: Bedingung[] = [{ art: 'f', x: 0, wert: 8 }, { art: 'f', x: 20, wert: 0 }];
    const p = loese([(x) => x * x, () => 1], bruecke);
    expect(p[0]).toBeCloseTo(wert('16', 'a'), 9);
    expect(p[1]).toBeCloseTo(wert('16', 'c'), 9);
    expect(D.A15.f(-20)).toBeCloseTo(0, 12);
    expect(D.A15.f(10)).toBeCloseTo(wert('16', 'h'), 12);
    const ball: Bedingung[] = [{ art: 'f', x: 0, wert: 2 }, { art: 'f1', x: 4, wert: 0 }, { art: 'f', x: 4, wert: 6 }];
    const q = loese([(x) => x * x, (x) => x, () => 1], ball);
    [wert('17', 'a'), wert('17', 'b'), wert('17', 'c')].forEach((v, i) => expect(q[i]).toBeCloseTo(v, 3));
    erfuellt(D.A16.f, ball);
    expect(nullstellen(D.A16.f, 0.5, 20)[0]).toBeCloseTo(wert('17', 'w'), 2);
    expect(Math.abs(wert('17', 'w') - (4 + Math.sqrt(24)))).toBeLessThan(0.01);
  });
  it('Aufgabe 18: Abkühlung, b durch Bisektion, T(30) aus dem Modell', () => {
    const { d, a } = D.A17;
    expect(wert('18', 'd')).toBe(d);
    expect(wert('18', 'a')).toBe(a);
    expect(D.A17.f(0)).toBeCloseTo(90, 9);
    expect(D.A17.f(10)).toBeCloseTo(50, 9);
    expect(D.A17.f(400)).toBeCloseTo(20, 6);
    const g = (b: number) => 70 * Math.exp(10 * b) + 20 - 50;
    let lo = -1;
    let hi = 0;
    for (let i = 0; i < 100; i++) {
      const m = (lo + hi) / 2;
      if (g(lo) * g(m) <= 0) hi = m;
      else lo = m;
    }
    expect((lo + hi) / 2).toBeCloseTo(wert('18', 'b'), 9);
    expect(D.A17.f(30)).toBeCloseTo(wert('18', 't'), 9);
    expect(Math.round(wert('18', 'b') * 1000) / 1000).toBe(-0.085);
    expect(Math.round(wert('18', 't') * 100) / 100).toBe(25.51);
  });
  it('Übersetzung: die Bedingungen stehen in der TeX-Zeichenkette und gelten für passende Beispielfunktionen', () => {
    for (const u of D.UEBERSETZUNG) for (const b of u.bedingungen) expect(u.tex, u.text).toContain(bedingungTex(b));
    // Beispiele: f(x) = (x − 3)² berührt die x-Achse bei 3, W(2 | 1) bei f(x) = (x − 2)³ + 1
    erfuellt((x) => (x + 3) ** 2, [{ art: 'f', x: -3, wert: 0 }, { art: 'f1', x: -3, wert: 0 }]);
    erfuellt((x) => (x - 2) ** 3 + 1, [{ art: 'f', x: 2, wert: 1 }, { art: 'f2', x: 2, wert: 0 }]);
    // Sattelpunkt W(1 | 4): f = (x − 1)³ + 4
    erfuellt((x) => (x - 1) ** 3 + 4, [{ art: 'f', x: 1, wert: 4 }, { art: 'f1', x: 1, wert: 0 }, { art: 'f2', x: 1, wert: 0 }]);
    // Wendetangente in W(0 | −2) mit der Steigung 0,5: x³ + 0,5x − 2
    erfuellt((x) => x ** 3 + 0.5 * x - 2, [{ art: 'f', x: 0, wert: -2 }, { art: 'f1', x: 0, wert: 0.5 }, { art: 'f2', x: 0, wert: 0 }]);
    // Senkrechtes Schneiden in P(2 | 1): f = x² − 3 (f′(2) = 4), g = −x/4 + 3/2 (g′ = −1/4)
    const f = (x: number) => x * x - 3;
    const g = (x: number) => -x / 4 + 1.5;
    expect(f(2)).toBe(g(2));
    expect(richardson(f, 2) * richardson(g, 2)).toBeCloseTo(-1, 6);
  });
  it('die Beispiele im Erklären und Entdecken stimmen: Parabel, drei Funktionen durch drei Punkte, Vielfachheiten', () => {
    erfuellt(D.BEISPIEL.f, D.BEISPIEL.bedingungen);
    const p = loese([(x) => x * x, (x) => x, () => 1], D.BEISPIEL.bedingungen);
    [D.BEISPIEL.a, D.BEISPIEL.b, D.BEISPIEL.c].forEach((v, i) => expect(p[i]).toBeCloseTo(v, 3));
    for (const t of D.DREI_PUNKTE.t) for (const [x, y] of D.DREI_PUNKTE.punkte) expect(D.DREI_PUNKTE.f(t)(x)).toBeCloseTo(y, 12);
    expect(D.DREI_PUNKTE.f(-1)(0.5)).not.toBeCloseTo(D.DREI_PUNKTE.f(1)(0.5), 3);
    // f(x) = (x + 1)(x − 2)² berührt bei 2, g(x) = (x + 1)(x − 2)³ schneidet bei 2 mit waagerechter Tangente
    expect(D.VIELFACH.zwei(2 - 0.01) * D.VIELFACH.zwei(2 + 0.01)).toBeGreaterThan(0);
    expect(D.VIELFACH.drei(2 - 0.01) * D.VIELFACH.drei(2 + 0.01)).toBeLessThan(0);
    expect(richardson(D.VIELFACH.zwei, 2)).toBeCloseTo(0, 6);
    expect(richardson(D.VIELFACH.drei, 2)).toBeCloseTo(0, 6);
    // Labor 1, Auftrag 4: a = 1 für P(0 | 1,5), Auftrag 3: Grad 6
    expect(1 * (0 + 1.5) * (0 - 0.5) * (0 - 2)).toBeCloseTo(1.5, 12);
    expect(D.GRAD6.reduce((s, n) => s + n.m, 0)).toBe(6);
    // Labor 3: Asymptote y = −1, P(0 | 2), Q(ln 3 | 8): f = 3e^x − 1
    const f3 = (x: number) => 3 * Math.exp(x) - 1;
    expect(f3(0)).toBeCloseTo(2, 12);
    expect(f3(Math.log(3))).toBeCloseTo(8, 12);
    expect(f3(-40)).toBeCloseTo(-1, 9);
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
    expect(alle.length).toBeGreaterThanOrEqual(28);
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
    expect(zahl).toBeGreaterThan(60);
  });
  it('Farben: K_f orange, Tangenten, Asymptoten und weitere Kurven gestrichelt (blau oder schwarz), Skizzen blau, ein Platz für die Zahlen links der y-Achse', () => {
    for (const [name, b] of alle) {
      const durchgezogen = b.kurven.filter((k) => !k.gestrichelt);
      expect(durchgezogen.length, name).toBeGreaterThanOrEqual(1);
      for (const k of durchgezogen) expect(k.farbe, name).toBe(ORANGE);
      for (const k of b.kurven.filter((x) => x.gestrichelt)) expect([BLAU, SCHWARZ], name).toContain(k.farbe);
      for (const s of b.strecken ?? []) expect([BLAU, SCHWARZ], name).toContain(s.farbe);
      // links der y-Achse (bzw. links des Fensters) bleibt Platz für die Zahlen der y-Achse
      const [xmin, xmax] = b.bereich;
      if (xmin >= 0) throw new Error(`${name}: Ausschnitt beginnt bei x = ${xmin}, die Zahlen der y-Achse fehlen`);
      expect(-xmin / (xmax - xmin), name).toBeGreaterThan(0.06);
    }
  });
  it('die Schaubilder stimmen mit den Rechnungen überein: Tangenten, Asymptoten, Hoch- und Tiefpunkte', () => {
    // Waagerechte Tangenten in den Beispielen
    expect(B.BILD_BEISPIEL.kurven[1]!.f(0)).toBe(-1);
    expect(B.BILD_A8.kurven[1]!.f(0)).toBe(-4);
    // Wendetangente von Aufgabe 15 und Tangente der Wendestelle in Frage 2
    expect(B.BILD_A14.kurven[1]!.f(0)).toBeCloseTo(2, 12);
    expect(B.BILD_A14.kurven[1]!.f(1) - B.BILD_A14.kurven[1]!.f(0)).toBeCloseTo(Math.PI, 12);
    expect(B.BILD_F2.kurven[1]!.f(3) - B.BILD_F2.kurven[1]!.f(2)).toBeCloseTo(0.5, 12);
    // Vielfachheit: Tangente bei x = 1 mit Steigung 1,5 für m = 1, sonst waagerecht
    expect(B.BILD_VIEL(1).kurven[1]!.f(2) - B.BILD_VIEL(1).kurven[1]!.f(1)).toBeCloseTo(1.5, 12);
    expect(richardson(D.VIEL_BILD(1), 1)).toBeCloseTo(1.5, 5);
    for (const m of [2, 3]) {
      expect(B.BILD_VIEL(m).kurven[1]!.f(3)).toBe(0);
      expect(richardson(D.VIEL_BILD(m), 1)).toBeCloseTo(0, 5);
    }
    // Asymptoten der e-Funktionen
    expect(D.EXPO_BILD.links(-40)).toBeCloseTo(-1, 9);
    expect(D.EXPO_BILD.rechts(60)).toBeCloseTo(2, 9);
    // Hoch- und Tiefpunkt von x³ − 3x + 1
    expect(D.LABOR_KUBIK.f(-1)).toBe(3);
    expect(D.LABOR_KUBIK.f(1)).toBe(-1);
    // Tiefpunkte von Aufgabe 10 (nur zur Probe) und Tiefpunkt von Aufgabe 13
    expect(richardson(D.A13.f, 0.5)).toBeCloseTo(0, 5);
    expect(D.A13.f(0.5)).toBeCloseTo(-1.5 * Math.E, 9);
    expect(richardson(D.A9.f, 1)).toBeCloseTo(0, 6);
  });
});
