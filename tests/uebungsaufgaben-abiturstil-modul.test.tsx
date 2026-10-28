import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/uebungsaufgaben-abiturstil/Bilder';
import * as D from '../content/modules/uebungsaufgaben-abiturstil/daten';
import Modul from '../content/modules/uebungsaufgaben-abiturstil/index';
import meta from '../content/modules/uebungsaufgaben-abiturstil/meta.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { BLAU, GRUEN, ORANGE, SCHWARZ, type MessbildDaten } from '../src/components/Messbild';
import { MIN_ABSTAND, NAH_Y_ACHSE, labelAbstand, type BeschriftungsLage, type Hindernis } from '../src/lib/beschriftung';
import { bewerte } from '../src/lib/eingabe';
import { bedingungsZeile, gauss, punkte, richardson, vorzeichenwechsel, zweiteDifferenz, alleNullstellen, type Fn } from './numerik';

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
const ORDNER = 'content/modules/uebungsaufgaben-abiturstil';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const feld = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!;
const wert = (nr: string, id: string) => feld(nr, id).erwartet;

/** Größter Wert von g auf einem feinen Raster. */
const maximum = (g: Fn, von: number, bis: number, n = 200000) => {
  let best = { x: von, y: -Infinity };
  for (const x of punkte(von, bis, n)) {
    const y = g(x);
    if (y > best.y) best = { x, y };
  }
  return best;
};
const minimum = (g: Fn, von: number, bis: number, n = 200000) => {
  const m = maximum((x) => -g(x), von, bis, n);
  return { x: m.x, y: -m.y };
};

describe('Metadaten und Darstellung', () => {
  it('im Themenbereich Differentialrechnung mit drei Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('uebungsaufgaben-abiturstil');
    expect(meta.thema).toBe('differentialrechnung');
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.bpe).toEqual(['3.3', '3.5', '12.5', '12.6', '12.7']);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['hinweise', 'ohne-hilfsmittel', 'mit-hilfsmittel']);
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
    for (const d of readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts'))) {
      const q = readFileSync(`${ORDNER}/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
    }
  });
  it('Verweise auf andere Module nennen vorhandene Module und Abschnitte', () => {
    const ids = readdirSync('content/modules');
    for (const d of readdirSync(ORDNER).filter((x) => x.endsWith('.tsx'))) {
      const q = readFileSync(`${ORDNER}/${d}`, 'utf8');
      for (const m of q.matchAll(/<Modulverweis modul="([^"]+)"(?: abschnitt="([^"]+)")?/g)) {
        expect(ids, `${d}: ${m[1]}`).toContain(m[1]);
        if (m[2]) {
          const abschnitte = (JSON.parse(readFileSync(`content/modules/${m[1]}/meta.json`, 'utf8')) as { abschnitte: { id: string }[] }).abschnitte.map((a) => a.id);
          expect(abschnitte, `${d}: ${m[1]}/${m[2]}`).toContain(m[2]);
        }
      }
    }
    const hinweise = readFileSync(`${ORDNER}/Hinweise.tsx`, 'utf8');
    for (const [, id] of hinweise.matchAll(/^\s+\['([a-z-]+)', '/gm)) expect(ids, id).toContain(id);
  });
  it('das Modul ist solange es ein Entwurf ist in keinem Kurs eingetragen', () => {
    if (meta.status !== 'entwurf') return;
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"uebungsaufgaben-abiturstil"');
  });
  it('Aufbau und Operatoren: Operatorentabelle, Verweise auf die Module, vier Arbeitsschritte', () => {
    const html = rendern('hinweise');
    for (const w of ['Operatoren und ihre Bedeutung', 'Zeigen, Nachweisen', 'Begründen', 'Beurteilen, Prüfen', 'Interpretieren, Deuten', 'Wo der Stoff steht', 'So arbeitest du mit den Aufgaben', 'Bewertungseinheiten']) expect(html, w).toContain(w);
    expect((html.match(/class="kopfspalte"/g) ?? []).length).toBe(9 + 10);
  });
  it('Gliederung: sechs Aufgaben ohne Hilfsmittel, sechs mit Hilfsmittel, Reihenfolge der Nummern', () => {
    const ohne = rendern('ohne-hilfsmittel');
    expect(ohne).not.toContain('data-abschnitt="mit-hilfsmittel"');
    expect([...aufgaben.map((a) => a.nummer), ...fragen.map((q) => q.nummer)].sort()).toEqual(['1', '2', '3a', '3b', '4', '5', '6']);
    const mit = rendern('mit-hilfsmittel');
    expect(mit).not.toContain('data-abschnitt="ohne-hilfsmittel"');
    expect([...aufgaben.map((a) => a.nummer), ...fragen.map((q) => q.nummer)].sort()).toEqual(['10', '11', '12a', '12b', '7', '8', '9']);
  });
});

describe('Hilfen, Lösungen und Rückmeldungen', () => {
  it('rendern ohne Formelfehler und ohne Gedankenstriche', () => {
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
    expect(teile.length).toBeGreaterThan(120);
    for (const [name, inhalt] of teile) {
      const html = alsText(inhalt);
      expect(html, name).not.toContain('formel-fehler');
      expect(html, name).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(html, name).not.toContain(z);
      expect(html, name).not.toMatch(/Graph(?!ik)/);
    }
  });
  it('jede Aufgabe hat drei Hilfen und mindestens drei Lösungsschritte, jede Lösung und jede Erklärung ein Schaubild, jede Aufgabe mit Schaubild ein Kontrollschaubild', () => {
    rendern(null);
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBe(3);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(3);
      expect(alsText(a.loesung), a.nummer).toContain('class="bild');
      expect(alsText(a.children), a.nummer).toContain('Schaubild zur Kontrolle einblenden');
    }
    for (const q of fragen) expect(alsText(q.erklaerung), q.nummer).toContain('class="bild');
  });
  it('jede Teilaufgabe nennt Bewertungseinheiten, Teile beginnen bei a, bei 3, 4, 12 und 6 mit dem passenden Buchstaben', () => {
    rendern(null);
    for (const a of aufgaben) expect(alsText(a.children), a.nummer).toMatch(/\(\d+ BE\)/);
    for (const q of fragen) expect(alsText(q.children), q.nummer).toMatch(/\(\d+ BE\)/);
    const hat = (nr: string, ab: number) => expect(alsText(aufgaben.find((a) => a.nummer === nr)!.children), nr).toContain(`start="${ab}"`);
    hat('1', 3);
    hat('2', 3);
    hat('4', 2);
    hat('6', 2);
    hat('12b', 2);
  });
  it('Auswahlfragen: genau eine richtige Antwort, vier Antworten, nicht immer an derselben Stelle, jede falsche mit Begründung', () => {
    rendern(null);
    const stellen = fragen.map((q) => {
      expect(q.optionen.filter((o) => o.richtig), q.nummer).toHaveLength(1);
      expect(q.optionen).toHaveLength(4);
      for (const o of q.optionen.filter((x) => !x.richtig)) expect(alsText(o.rueckmeldung).length, `${q.nummer} ${o.id}`).toBeGreaterThan(60);
      return q.optionen.findIndex((o) => o.richtig);
    });
    expect(new Set(stellen).size).toBeGreaterThan(1);
  });
  it('jeder erwartete Wert wird mit der Eingabe in Dezimalschreibweise, als Bruch oder als Vielfaches von π richtig bewertet, ein falscher nicht', () => {
    rendern(null);
    let zahl = 0;
    for (const a of aufgaben) {
      for (const f of a.felder) {
        zahl++;
        const tol = f.toleranz !== undefined ? { toleranz: f.toleranz } : {};
        const piFelder: Record<string, string> = { '4 bk': 'pi/2', '4 steig': '3pi/2' };
        const eingabe = piFelder[`${a.nummer} ${f.id}`] ?? (f.toleranz ? (Math.round(f.erwartet / f.toleranz) * f.toleranz).toFixed(4).replace('.', ',') : String(f.erwartet).replace('.', ','));
        expect(bewerte([{ id: f.id, erwartet: f.erwartet, ...tol }], { [f.id]: eingabe })[f.id], `${a.nummer} ${f.id}`).toBe('richtig');
        expect(bewerte([{ id: f.id, erwartet: f.erwartet, ...tol }], { [f.id]: String(f.erwartet + 0.5) })[f.id], `${a.nummer} ${f.id} falsch`).toBe('falsch');
      }
    }
    expect(zahl).toBe(3 + 7 + 7 + 2 + 4 + 9 + 6 + 12 + 5 + 6 + 9);
    expect(bewerte([{ id: 'a', erwartet: 3.375 }], { a: '27/8' }).a).toBe('richtig');
    expect(bewerte([{ id: 'a', erwartet: 1.375 }], { a: '11/8' }).a).toBe('richtig');
  });
});

describe('Rechnungen der Aufgaben ohne Hilfsmittel, unabhängig geprüft', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Aufgabe 1: mittlere und momentane Änderungsrate, Ableitung der Zugriffsrate, Hochpunkt', () => {
    const { F, r } = D.A1;
    expect((F(4) - F(0)) / 4).toBeCloseTo(wert('1', 'mittel'), 12);
    const zeit = vorzeichenwechsel((t) => richardson(F, t) + 4, 0, 12);
    expect(zeit).toHaveLength(1);
    expect(zeit[0]!).toBeCloseTo(wert('1', 'zeit'), 5);
    expect(F(5)).toBe(D.A1.F5);
    // r′ stimmt mit dem Term 3(1 − 0,2t)e^(−0,2t) überein, Vorzeichenwechsel von plus nach minus bei 5
    for (const x of punkte(0, 20, 40)) expect(richardson(r, x)).toBeCloseTo(3 * (1 - 0.2 * x) * Math.exp(-0.2 * x), 6);
    const w = vorzeichenwechsel((t) => richardson(r, t), 0.01, 22);
    expect(w).toHaveLength(1);
    expect(w[0]!).toBeCloseTo(wert('1', 'ab'), 5);
    expect(richardson(r, 4)).toBeGreaterThan(0);
    expect(richardson(r, 6)).toBeLessThan(0);
    expect(maximum(r, 0, 22).x).toBeCloseTo(5, 3);
    expect(maximum(r, 0, 22).y).toBeCloseTo(D.A1.rMax, 6);
  });
  it('Aufgabe 2: Tangente an die Kosinusfunktion, Wertemenge, Hyperbel mit Abstand und Steigung', () => {
    const { f, g } = D.A2;
    expect(richardson(f, Math.PI / 2)).toBeCloseTo(wert('2', 'm'), 6);
    expect(f(Math.PI / 2)).toBeCloseTo(wert('2', 'y'), 12);
    expect(minimum(f, 0, 2 * Math.PI).y).toBeCloseTo(wert('2', 'min'), 6);
    expect(maximum(f, 0, 2 * Math.PI).y).toBeCloseTo(wert('2', 'max'), 6);
    // Die Gerade y = p schneidet K_g in zwei Punkten im Abstand 4: g(x) = p hat Lösungen ±2
    const p = wert('2', 'p');
    const x = vorzeichenwechsel((s) => g(s) - p, 0.1, 20);
    expect(x).toHaveLength(1);
    expect(2 * x[0]!).toBeCloseTo(4, 6);
    // Tangente in Q(u | g(u)) mit u > 0 und Steigung −1/4
    const u = vorzeichenwechsel((s) => richardson(g, s) + 0.25, 0.5, 30);
    expect(u).toHaveLength(1);
    expect(u[0]!).toBeCloseTo(wert('2', 'u'), 4);
    expect(g(wert('2', 'u'))).toBeCloseTo(wert('2', 'gu'), 12);
    // g ist symmetrisch zur y-Achse
    for (const s of punkte(0.3, 9, 30)) expect(g(-s)).toBeCloseTo(g(s), 12);
  });
  it('Aufgabe 3: nur Schaubild I ist die Ableitungsfunktion von x³ − 3x², II und III nicht', () => {
    const { f, dfI, dfII, dfIII } = D.A3;
    for (const x of punkte(-1.5, 3.7, 60)) {
      expect(richardson(f, x)).toBeCloseTo(dfI(x), 6);
      expect(Math.abs(richardson(f, x) - dfII(x)) > 1e-3 || Math.abs(x) < 1e-9 || Math.abs(x - 2) < 1e-9, `II bei ${x}`).toBe(true);
    }
    expect(Math.abs(richardson(f, 2) - dfIII(2))).toBeGreaterThan(10);
    expect(Math.abs(richardson(f, -1) - dfII(-1))).toBeGreaterThan(1);
    // waagerechte Tangenten von K_f bei 0 und 2, Vorzeichen von f′: plus, minus, plus
    expect(vorzeichenwechsel((x) => richardson(f, x), -2, 4).map((v) => Math.round(v * 1e4) / 1e4 + 0)).toEqual([0, 2]);
    expect(richardson(f, -1)).toBeGreaterThan(0);
    expect(richardson(f, 1)).toBeLessThan(0);
    expect(richardson(f, 3)).toBeGreaterThan(0);
    // Hochpunkt bei 0 (f′ wechselt von plus nach minus), Tiefpunkt bei 2
    expect(f(0)).toBe(0);
    expect(f(2)).toBe(-4);
    expect(f(-0.1)).toBeLessThan(f(0));
    expect(f(0.1)).toBeLessThan(f(0));
    // Fragen 3a und 3b: die richtige Antwort ist die gesuchte
    expect(fragen.find((q) => q.nummer === '3a')!.optionen.find((o) => o.richtig)!.id).toBe('I');
    expect(fragen.find((q) => q.nummer === '3b')!.optionen.find((o) => o.richtig)!.id).toBe('wechsel');
  });
  it('Aufgabe 4: ax⁴ + bx² + c mit y-Achsenabschnitt 5 und Tiefpunkt (2 | 1), Kosinusfunktion mit Periode 4', () => {
    const basis: Fn[] = [(x) => x ** 4, (x) => x * x, () => 1];
    const lsg = gauss([bedingungsZeile(basis, 'f', 0), bedingungsZeile(basis, 'f', 2), bedingungsZeile(basis, 'f1', 2)], [5, 1, 0]);
    expect(lsg[0]!).toBeCloseTo(wert('4', 'a'), 9);
    expect(lsg[1]!).toBeCloseTo(wert('4', 'b'), 9);
    expect(lsg[2]!).toBeCloseTo(wert('4', 'c'), 9);
    const f = D.A4.f;
    expect(zweiteDifferenz(f)(2)).toBeGreaterThan(0);
    for (const x of punkte(0.2, 3, 20)) expect(f(-x)).toBeCloseTo(f(x), 12);
    // Kosinusfunktion: b = 2π/4, Ruhelage d und Amplitude a aus Tiefpunkt (2 | −1) und Wendepunkt (1 | 2)
    const b = (2 * Math.PI) / D.A4.periode;
    expect(b).toBeCloseTo(wert('4', 'bk'), 12);
    const k = gauss([bedingungsZeile([(x) => Math.cos(b * x), () => 1], 'f', 2), bedingungsZeile([(x) => Math.cos(b * x), () => 1], 'f', 1)], [-1, 2]);
    expect(k[0]!).toBeCloseTo(wert('4', 'ak'), 9);
    expect(k[1]!).toBeCloseTo(wert('4', 'dk'), 9);
    const kos = D.A4.kos;
    expect(richardson(kos, 2)).toBeCloseTo(0, 6);
    expect(zweiteDifferenz(kos)(1)).toBeCloseTo(0, 4);
    expect(zweiteDifferenz(kos)(3)).toBeCloseTo(0, 4);
    expect(kos(2 + D.A4.periode)).toBeCloseTo(kos(2), 9);
    expect(richardson(kos, 3)).toBeCloseTo(wert('4', 'steig'), 5);
  });
  it('Aufgabe 5: Schar x³ − kx² + 4x, Punktsymmetrie für k = 0, Wendetangente mit Steigung 1 für genau k = −3 und k = 3', () => {
    for (const x of punkte(0.1, 4, 30)) expect(D.A5.f(0)(-x)).toBeCloseTo(-D.A5.f(0)(x), 12);
    // Für jedes k die Wendestelle k/3 (zweite Differenz) und die Steigung dort
    const steigungW = (k: number) => richardson(D.A5.f(k), k / 3);
    for (const k of punkte(-8, 8, 16)) {
      expect(zweiteDifferenz(D.A5.f(k))(k / 3)).toBeCloseTo(0, 4);
      expect(steigungW(k)).toBeCloseTo(4 - (k * k) / 3, 5);
    }
    const ks = vorzeichenwechsel((k) => steigungW(k) - 1, -10, 10);
    expect(ks).toHaveLength(2);
    expect(ks[0]!).toBeCloseTo(wert('5', 'k1'), 4);
    expect(ks[1]!).toBeCloseTo(wert('5', 'k2'), 4);
    // Wendepunkte W(1 | 2) und W(−1 | −2) mit den Wendetangenten y = x + 1 und y = x − 1
    expect(D.A5.f(3)(1)).toBe(2);
    expect(D.A5.f(-3)(-1)).toBe(-2);
  });
  it('Aufgabe 6: Verkettung aus Werten, Rechteck unter 12 − x² mit größtem Flächeninhalt', () => {
    // Zwei Beispielfunktionen mit den gegebenen Werten: h = g∘f hat bei 2 den Wert 4 und die Steigung −6
    const f: Fn = (x) => -1 + 3 * (x - 2) + 0.2 * (x - 2) ** 2;
    const g: Fn = (y) => 4 - 2 * (y + 1) + 0.3 * (y + 1) ** 3;
    expect(f(2)).toBe(D.A6.f2);
    expect(richardson(f, 2)).toBeCloseTo(D.A6.df2, 6);
    expect(g(-1)).toBe(D.A6.g1);
    expect(richardson(g, -1)).toBeCloseTo(D.A6.dg1, 6);
    const h = (x: number) => g(f(x));
    const m = richardson(h, 2);
    expect(m).toBeCloseTo(wert('6', 'm'), 5);
    expect(h(2) - m * 2).toBeCloseTo(wert('6', 'n'), 5);
    // Rechteck: Breite u, Höhe f(u), Fläche A(u), größtes A auf dem Raster
    const flaeche = (u: number) => u * D.A6.f(u);
    for (const u of punkte(0, Math.sqrt(12), 30)) expect(flaeche(u)).toBeCloseTo(12 * u - u ** 3, 9);
    const best = maximum(flaeche, 0, Math.sqrt(12));
    expect(best.x).toBeCloseTo(wert('6', 'u'), 3);
    expect(best.y).toBeCloseTo(wert('6', 'A'), 6);
    expect(flaeche(0)).toBe(0);
    expect(flaeche(Math.sqrt(12))).toBeCloseTo(0, 9);
    expect(vorzeichenwechsel((u) => richardson(flaeche, u), 0.01, 3.4)).toHaveLength(1);
  });
});

describe('Rechnungen der Aufgaben mit Hilfsmittel, unabhängig geprüft', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Aufgabe 7: Wirkstoff, Zahlenwerte, Maximum, Zeitraum auf die Minute, stärkste Abnahme, mittlere Änderungsrate', () => {
    const { c } = D.A7;
    expect(c(2)).toBeCloseTo(wert('7', 'c2'), 2);
    expect(c(10)).toBeCloseTo(wert('7', 'c10'), 2);
    const m = maximum(c, 0, 12);
    expect(m.x).toBeCloseTo(wert('7', 'tmax'), 3);
    expect(m.y).toBeCloseTo(wert('7', 'cmax'), 2);
    // Zeitraum mit c ≥ 8, Minute für Minute: erste und letzte Minute
    const minuten = Array.from({ length: 12 * 60 + 1 }, (_, i) => i).filter((i) => c(i / 60) >= 8);
    expect(minuten[0]).toBe(wert('7', 'beginn'));
    expect(minuten[minuten.length - 1]).toBe(wert('7', 'ende'));
    expect(minuten.length).toBe(minuten[minuten.length - 1]! - minuten[0]! + 1);
    expect(c(59 / 60)).toBeLessThan(8);
    expect(c(305 / 60)).toBeLessThan(8);
    // Stärkste Abnahme: kleinster Wert von c′ auf [0 ; 12], auch am Rand
    const dc = (t: number) => richardson(c, t);
    const kleinste = minimum(dc, 0, 12, 24000);
    expect(kleinste.x).toBeCloseTo(wert('7', 'tw'), 2);
    expect(kleinste.y).toBeCloseTo(wert('7', 'rate'), 2);
    for (const t of punkte(0, 12, 30)) expect(dc(t)).toBeCloseTo(D.A7.dc(t), 6);
    expect((c(10) - c(2.5)) / 7.5).toBeCloseTo(wert('7', 'mittel'), 2);
  });
  it('Aufgabe 8: Rampe, Höhenunterschied, Winkel der Verbindungsgeraden, größter Winkel und Bereich über 70 Grad', () => {
    const { f } = D.A8;
    const grad = (r: number) => (r * 180) / Math.PI;
    expect(f(0) - f(2)).toBeCloseTo(wert('8', 'dh'), 12);
    expect(grad(Math.atan((f(0) - f(2)) / 2))).toBeCloseTo(wert('8', 'winkel'), 1);
    expect(grad(Math.atan((f(0) - f(2)) / 2))).toBeLessThan(65);
    const dfAbs = (x: number) => Math.abs(richardson(f, x));
    const steil = maximum(dfAbs, 0, 2, 40000);
    expect(steil.x).toBeCloseTo(wert('8', 'xw'), 2);
    expect(grad(Math.atan(steil.y))).toBeCloseTo(wert('8', 'wmax'), 1);
    expect(grad(Math.atan(steil.y))).toBeGreaterThan(70);
    const w = vorzeichenwechsel((x) => dfAbs(x) - Math.tan((70 * Math.PI) / 180), 0, 2);
    expect(w).toHaveLength(2);
    expect(w[0]!).toBeCloseTo(wert('8', 'von'), 2);
    expect(w[1]!).toBeCloseTo(wert('8', 'bis'), 2);
    for (const x of punkte(0, 2, 40)) expect(richardson(f, x)).toBeCloseTo(D.A8.df(x), 6);
    expect(zweiteDifferenz(f)(1)).toBeCloseTo(D.A8.ddf(1), 3);
  });
  it('Aufgabe 9: kubische Funktion aus drei Nullstellen und einem Punkt (Gaußverfahren), Extrema, Wendepunkt, Stellen mit Steigung 3', () => {
    const basis: Fn[] = [(x) => x ** 3, (x) => x * x, (x) => x, () => 1];
    const lsg = gauss([-1, 2, 6, 0].map((x) => bedingungsZeile(basis, 'f', x)), [0, 0, 0, 3]);
    ['a3', 'a2', 'a1', 'a0'].forEach((id, i) => expect(lsg[i]!).toBeCloseTo(wert('9', id), 9));
    const f: Fn = (x) => lsg[0]! * x ** 3 + lsg[1]! * x ** 2 + lsg[2]! * x + lsg[3]!;
    expect(f(3)).toBeCloseTo(-3, 12);
    const ex = vorzeichenwechsel((x) => richardson(f, x), -2, 7);
    expect(ex).toHaveLength(2);
    expect(ex[0]!).toBeCloseTo(wert('9', 'xh'), 2);
    expect(f(ex[0]!)).toBeCloseTo(wert('9', 'yh'), 2);
    expect(ex[1]!).toBeCloseTo(wert('9', 'xt'), 2);
    expect(f(ex[1]!)).toBeCloseTo(wert('9', 'yt'), 2);
    expect(richardson(f, ex[0]! - 0.3)).toBeGreaterThan(0);
    expect(richardson(f, ex[0]! + 0.3)).toBeLessThan(0);
    const wp = vorzeichenwechsel(zweiteDifferenz(f), -2, 7);
    expect(wp).toHaveLength(1);
    expect(wp[0]!).toBeCloseTo(wert('9', 'xw'), 2);
    expect(richardson(f, wp[0]!)).toBeCloseTo(wert('9', 'mw'), 2);
    const s = vorzeichenwechsel((x) => richardson(f, x) - 3, -2, 7);
    expect(s).toHaveLength(2);
    expect(s[0]!).toBeCloseTo(wert('9', 'x1'), 2);
    expect(s[1]!).toBeCloseTo(wert('9', 'x2'), 2);
  });
  it('Aufgabe 10: Tangente an e^(−x), Dreieck mit den Achsen aus den Achsenabschnitten der Tangente, größter Flächeninhalt, A = 1/2', () => {
    const { f } = D.A10;
    const tang = (u: number) => {
      const m = richardson(f, u);
      return { m, n: f(u) - m * u };
    };
    expect(tang(1).m).toBeCloseTo(wert('10', 'm'), 2);
    expect(tang(1).n).toBeCloseTo(wert('10', 'n'), 2);
    // Fläche des Dreiecks aus den Achsenabschnitten der Tangente: x-Achse bei −n/m, y-Achse bei n, rechter Winkel im Ursprung
    const flaeche = (u: number) => {
      const { m, n } = tang(u);
      return 0.5 * Math.abs(-n / m) * Math.abs(n);
    };
    for (const u of punkte(0, 6, 24)) {
      expect(flaeche(u)).toBeCloseTo(D.A10.A(u), 5);
      expect(richardson(D.A10.A, u)).toBeCloseTo(D.A10.dA(u), 6);
    }
    const best = maximum(flaeche, 0, 40, 40000);
    expect(best.x).toBeCloseTo(wert('10', 'u'), 2);
    expect(best.y).toBeCloseTo(wert('10', 'A'), 2);
    expect(flaeche(0)).toBeCloseTo(0.5, 6);
    expect(flaeche(40)).toBeLessThan(1e-9);
    const halb = vorzeichenwechsel((u) => flaeche(u) - 0.5, 0.05, 10);
    expect(halb).toHaveLength(1);
    expect(halb[0]!).toBeCloseTo(wert('10', 'u2'), 2);
  });
  it('Aufgabe 11: logistisches Wachstum, Grenzwert, mittlere Änderungsrate, größte Zunahme, 90 Tausend', () => {
    const { N } = D.A11;
    expect(N(0)).toBeCloseTo(wert('11', 'N0'), 12);
    expect(N(80)).toBeCloseTo(wert('11', 'g'), 9);
    for (const t of punkte(0, 30, 100)) expect(N(t)).toBeLessThan(100);
    expect((N(4) - N(0)) / 4).toBeCloseTo(wert('11', 'mittel'), 2);
    const dn = (t: number) => richardson(N, t);
    for (const t of punkte(0, 20, 40)) expect(dn(t)).toBeCloseTo(D.A11.dN(t), 6);
    const m = maximum(dn, 0, 30, 60000);
    expect(m.x).toBeCloseTo(wert('11', 'tw'), 2);
    expect(m.y).toBeCloseTo(wert('11', 'rw'), 2);
    expect(N(m.x)).toBeCloseTo(50, 2);
    const t90 = vorzeichenwechsel((t) => N(t) - 90, 0, 30);
    expect(t90).toHaveLength(1);
    expect(t90[0]!).toBeCloseTo(wert('11', 't90'), 2);
  });
  it('Aufgabe 12: Schaubild K 2 ist das Schaubild von f, waagerechte Tangenten, Tangente in S_y, weiterer Wendepunkt', () => {
    const { f } = D.A12;
    // f = 1/8 (x − 2)² (x² + 4x + 6)
    for (const x of punkte(-3.4, 3.4, 40)) expect(f(x)).toBeCloseTo(((x - 2) ** 2 * (x * x + 4 * x + 6)) / 8, 9);
    // K 1 = f(−x) und K 3 sind verschieden von f, K 2 gleich f
    expect(D.A12.k1(0)).toBe(3);
    expect(richardson(D.A12.k1, 0)).toBeCloseTo(1, 5);
    expect(richardson(f, 0)).toBeCloseTo(-1, 5);
    expect(D.A12.k3(0)).toBe(2);
    for (const x of punkte(-3, 3, 30)) expect(D.A12.k1(x)).toBeCloseTo(f(-x), 9);
    expect(fragen.find((q) => q.nummer === '12a')!.optionen.find((o) => o.richtig)!.id).toBe('K2');
    // waagerechte Tangenten bei −1 (Sattelpunkt, kein Vorzeichenwechsel) und 2 (Tiefpunkt)
    const df = (x: number) => richardson(f, x);
    const stellen = alleNullstellen(df, -3.4, 3.4);
    expect(stellen).toHaveLength(2);
    expect(stellen[0]!).toBeCloseTo(wert('12b', 'xs'), 2);
    expect(stellen[1]!).toBeCloseTo(wert('12b', 'xt'), 2);
    expect(f(-1)).toBeCloseTo(wert('12b', 'ys'), 9);
    expect(f(2)).toBeCloseTo(wert('12b', 'yt'), 9);
    expect(df(-1.3)).toBeLessThan(0);
    expect(df(-0.7)).toBeLessThan(0);
    expect(df(1.7)).toBeLessThan(0);
    expect(df(2.3)).toBeGreaterThan(0);
    expect(minimum(f, -3.4, 3.4).y).toBeCloseTo(0, 8);
    // Tangente im Schnittpunkt mit der y-Achse
    expect(df(0)).toBeCloseTo(wert('12b', 'm'), 5);
    expect(f(0) - df(0) * 0).toBeCloseTo(wert('12b', 'n'), 9);
    // Wendepunkte: zweite Differenz hat bei −1 und 1 einen Vorzeichenwechsel
    const wp = vorzeichenwechsel(zweiteDifferenz(f), -3.4, 3.4);
    expect(wp).toHaveLength(2);
    expect(wp[0]!).toBeCloseTo(-1, 3);
    expect(wp[1]!).toBeCloseTo(wert('12b', 'xw'), 3);
    expect(f(1)).toBeCloseTo(wert('12b', 'yw'), 9);
    expect(df(1)).toBeCloseTo(wert('12b', 'mw'), 5);
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
    expect(alle.length).toBeGreaterThanOrEqual(36);
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
    expect(zahl).toBeGreaterThan(50);
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
    for (const n of ['BILD_A3_I', 'BILD_A3_II', 'BILD_A3_III', 'BILD_A3_ABLEITUNG']) expect((B as unknown as Record<string, MessbildDaten>)[n]!.kurven[0]!.farbe, n).toBe(GRUEN);
  });
  it('die Schaubilder stimmen mit den Rechnungen überein: Tangenten, Geraden, Hoch-, Tief- und Wendepunkte', () => {
    expect(richardson(D.A1.F, 5)).toBeCloseTo(-4, 6);
    expect(B.BILD_A1_F.kurven[1]!.f(6) - B.BILD_A1_F.kurven[1]!.f(5)).toBeCloseTo(-4, 12);
    expect(B.BILD_A2_F.kurven[1]!.f(Math.PI / 2 + 1) - B.BILD_A2_F.kurven[1]!.f(Math.PI / 2)).toBeCloseTo(3, 12);
    expect(B.BILD_A2_G1.kurven[1]!.f(0)).toBe(2);
    expect(B.BILD_A2_G2.kurven[1]!.f(8) - B.BILD_A2_G2.kurven[1]!.f(4)).toBeCloseTo(-1, 12);
    expect(B.BILD_A4_KOS.kurven[1]!.f(4) - B.BILD_A4_KOS.kurven[1]!.f(3)).toBeCloseTo(1.5 * Math.PI, 12);
    expect(B.BILD_A5_K3.kurven[1]!.f(1)).toBe(2);
    expect(B.BILD_A5_KM3.kurven[1]!.f(-1)).toBe(-2);
    expect(B.BILD_A7_C.kurven[1]!.f(0)).toBe(8);
    expect(B.BILD_A7_WENDE.kurven[1]!.f(6) - B.BILD_A7_WENDE.kurven[1]!.f(5)).toBeCloseTo(richardson(D.A7.c, 5), 5);
    expect(B.BILD_A8_WENDE.kurven[1]!.f(2) - B.BILD_A8_WENDE.kurven[1]!.f(1)).toBeCloseTo(richardson(D.A8.f, D.A8.wende), 5);
    expect(B.BILD_A9_EXTREM.kurven[1]!.f(0)).toBeCloseTo(D.A9.hoch[1], 12);
    expect(B.BILD_A9_WENDE.kurven[1]!.f(3) - B.BILD_A9_WENDE.kurven[1]!.f(2)).toBeCloseTo(richardson(D.A9.f, 7 / 3), 5);
    expect(B.BILD_A10_TANGENTE.kurven[1]!.f(2)).toBeCloseTo(0, 12);
    expect(B.BILD_A10_TANGENTE.kurven[1]!.f(0)).toBeCloseTo(2 / Math.E, 12);
    expect(B.BILD_A11_N.kurven[1]!.f(3)).toBe(100);
    expect(B.BILD_A11_WENDE.kurven[1]!.f(5.4) - B.BILD_A11_WENDE.kurven[1]!.f(4.4)).toBeCloseTo(richardson(D.A11.N, D.A11.wendeZeit), 3);
    expect(B.BILD_A12_SY.kurven[1]!.f(0)).toBe(3);
    expect(B.BILD_A12_WENDE.kurven[1]!.f(2) - B.BILD_A12_WENDE.kurven[1]!.f(1)).toBeCloseTo(-2, 12);
  });
});
