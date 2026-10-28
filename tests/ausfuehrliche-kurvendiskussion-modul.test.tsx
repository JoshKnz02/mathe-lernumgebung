import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/ausfuehrliche-kurvendiskussion/Bilder';
import * as D from '../content/modules/ausfuehrliche-kurvendiskussion/daten';
import Modul from '../content/modules/ausfuehrliche-kurvendiskussion/index';
import meta from '../content/modules/ausfuehrliche-kurvendiskussion/meta.json';
import { SCHAR_FENSTER, SCHAR_TEILUNG, Scharlabor, scharMarken } from '../content/modules/ausfuehrliche-kurvendiskussion/Scharlabor';
import { Symmetrielabor } from '../content/modules/ausfuehrliche-kurvendiskussion/Symmetrielabor';
import { Verhaltenslabor } from '../content/modules/ausfuehrliche-kurvendiskussion/Verhaltenslabor';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { BLAU, GRUEN, ORANGE, SCHWARZ, type MessbildDaten } from '../src/components/Messbild';
import { ROSA, type PaarDaten } from '../src/components/Paarbild';
import { MIN_ABSTAND, NAH_Y_ACHSE, labelAbstand, type BeschriftungsLage, type Hindernis } from '../src/lib/beschriftung';
import { SYMMETRIE_FUNKTIONEN, VERHALTEN_FUNKTIONEN, scharF, scharStellen, verhaltenTex } from '../src/lib/diskussion';
import { bewerte } from '../src/lib/eingabe';
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
const MODULORDNER = 'content/modules/ausfuehrliche-kurvendiskussion';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const nahe = (a: number[], b: number[], stellen = 3) => {
  expect(a).toHaveLength(b.length);
  a.forEach((x, i) => expect(x).toBeCloseTo(b[i]!, stellen));
};
const df = (f: Fn) => (x: number) => richardson(f, x);
/** g ist (auf dem Raster) die Ableitung von f. */
const istAbleitung = (f: Fn, g: Fn, von = -3, bis = 3) => punkte(von, bis, 60).every((x) => Math.abs(g(x) - richardson(f, x)) < 1e-4 * (1 + Math.abs(g(x))));
const klassifiziere = (f: Fn, xMax = 3): 'achse' | 'punkt' | 'keine' => {
  const xs = punkte(0.05, xMax, 100);
  if (xs.every((x) => Math.abs(f(-x) - f(x)) < 1e-9 * (1 + Math.abs(f(x))))) return 'achse';
  if (xs.every((x) => Math.abs(f(-x) + f(x)) < 1e-9 * (1 + Math.abs(f(x))))) return 'punkt';
  return 'keine';
};
const alleRelevanten = () => readdirSync(MODULORDNER).filter((d) => d.endsWith('.tsx') || d.endsWith('.ts'));

describe('Metadaten und Darstellung', () => {
  it('Freigegeben im Themenbereich Differentialrechnung mit vier Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('ausfuehrliche-kurvendiskussion');
    expect(meta.thema).toBe('differentialrechnung');
    expect(meta.status).toBe('freigegeben');
    expect(meta.bpe).toEqual(['3.2', '4.3', '12.6']);
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
    for (const d of alleRelevanten()) {
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
  it('Material der Vorgängermodule wird verlinkt statt wiederholt', () => {
    const quelle = readdirSync(MODULORDNER).filter((d) => d.endsWith('.tsx')).map((d) => readFileSync(`${MODULORDNER}/${d}`, 'utf8')).join('\n');
    for (const m of ['kurvendiskussion', 'tangenten', 'trigonometrische-gleichungen', 'umkehrfunktion', 'produkt-kettenregel', 'lage-im-koordinatensystem', 'summe-produkt-funktionen']) expect(quelle, m).toContain(`modul="${m}"`);
  });
  it('das Modul steht im Basiskurs Abitur 2027 und nicht in Abitur 2028', () => {
    expect(readFileSync('courses/abitur-2027.json', 'utf8')).toContain('"ausfuehrliche-kurvendiskussion"');
    expect(readFileSync('courses/abitur-2028.json', 'utf8')).not.toContain('ausfuehrliche-kurvendiskussion');
  });
  it('Erklären nennt die Regeln zum globalen Verhalten und zur Symmetrie ganzrationaler Funktionen noch nicht, Entdecken und Zusammenfassung nennen sie', () => {
    const erklaeren = rendern('erklaeren');
    for (const w of ['Leitkoeffizient', 'Leitglied', 'höchsten Hochzahl', 'nur gerade Hochzahlen', 'nur ungerade Hochzahlen', 'Funktionenschar', 'Fallunterscheidung', 'schneller klein']) expect(erklaeren, w).not.toContain(w);
    for (const w of ['Globales Verhalten', 'Asymptote', 'waagerechte Asymptote', 'schiefe Asymptote', 'gerade Funktionen', 'ungerade Funktionen', 'Satz vom Nullprodukt', 'Substitution', 'Wertetabelle in kleinen Schritten', 'exakt', 'Ableitungen']) expect(erklaeren, w).toContain(w);
    const entdecken = rendern('entdecken');
    for (const w of ['Leitkoeffizient', 'höchsten Hochzahl', 'gerade Hochzahlen', 'Funktionenschar', 'Forschungsaufgabe', 'Das Labor zum globalen Verhalten', 'Das Labor zur Symmetrie', 'keine</strong> Asymptote', 'Fallunterscheidung']) expect(entdecken, w).toContain(w);
    const zus = rendern('zusammenfassung');
    for (const w of ['Der Ablauf einer ausführlichen Kurvendiskussion', 'Globales Verhalten', 'Symmetrie', 'Ein vollständiges Beispiel', 'Funktionenscharen', 'Vorgehen bei einem Parameter', 'Typische Fehler', 'Leitkoeffizient', 'Beide Richtungen getrennt untersuchen']) expect(zus, w).toContain(w);
  });
  it('Entdecken: zwei Vermutungsfragen vor den Laboren, drei Labore, acht Beobachtungen', () => {
    const html = rendern('entdecken');
    expect((html.match(/class="labor"/g) ?? []).length).toBe(3);
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
    expect(teile.length).toBeGreaterThan(70);
    for (const [name, inhalt] of teile) {
      const html = alsText(inhalt);
      expect(html, name).not.toContain('formel-fehler');
      expect(html, name).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(html, name).not.toContain(z);
    }
  });
});

describe('Labore', () => {
  it('das Verhaltenslabor rendert mit Schaubild, Legende, Wertetabelle, zehn Funktionen und den beiden Schaltern ohne Formelfehler', () => {
    const html = renderToStaticMarkup(<Verhaltenslabor />);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    expect((html.match(/role="img"/g) ?? []).length).toBe(1);
    expect((html.match(/class="chip"/g) ?? []).length).toBe(VERHALTEN_FUNKTIONEN.length);
    expect(VERHALTEN_FUNKTIONEN).toHaveLength(10);
    for (const w of ['Legende', 'Werte von', 'Verhalten und Begründung', 'Asymptoten einzeichnen', 'Zurücksetzen']) expect(html, w).toContain(w);
    // Start: ½x⁴ − 2x², f(10) = 4800, f(−10) = 4800, f(100) = 49 980 000 als Zehnerpotenz
    expect(html).toContain('>4800<');
    expect(html).not.toContain('x\\to\\infty:\\ f(x)');
  });
  it('das Verhaltenslabor hat zu jeder Funktion eine Begründung (Schlüssel in der Datei)', () => {
    const quelle = readFileSync(`${MODULORDNER}/Verhaltenslabor.tsx`, 'utf8');
    for (const fn of VERHALTEN_FUNKTIONEN) expect(quelle, fn.id).toMatch(new RegExp(`(?:'${fn.id}'|\\b${fn.id}):\\s*\\(`));
  });
  it('das Symmetrielabor rendert mit Schaubild, neun Funktionen, Regler, Tabelle und den drei Schaltern', () => {
    const html = renderToStaticMarkup(<Symmetrielabor />);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    expect((html.match(/role="img"/g) ?? []).length).toBe(1);
    expect((html.match(/class="chip"/g) ?? []).length).toBe(SYMMETRIE_FUNKTIONEN.length);
    for (const w of ['Legende', 'Spiegelbild an der y-Achse', 'Spiegelbild am Ursprung', 'Ergebnis anzeigen', 'Zurücksetzen', 'type="range"']) expect(html, w).toContain(w);
    // Start: x⁴ − 3x² bei x₀ = 1: f(1) = f(−1) = −2, −f(1) = 2
    expect(html).toContain('f(x_0)');
    expect(html).toContain('f(-x_0)');
    expect(html).toContain('>-2<');
  });
  it('das Scharlabor rendert mit Schaubild, Regler und Schaltern, Start a = 1', () => {
    const html = renderToStaticMarkup(<Scharlabor />);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    expect((html.match(/role="img"/g) ?? []).length).toBe(1);
    for (const w of ['Legende', 'besondere Punkte markieren', 'Punkte auflisten und zählen', 'Zurücksetzen', 'type="range"', 'f_{1}(x)=x^4-2x^2']) expect(html, w).toContain(w);
    expect(html).not.toContain('Anzahl der Stellen');
  });
  it('die Marken des Scharlabors stehen im Ausschnitt, mit Abstand zu allen Linien, nahe der y-Achse rechts und auf der x-Achse nie darunter', () => {
    const [xmin, xmax, ymin, ymax] = SCHAR_FENSTER;
    let zahl = 0;
    const fehler: string[] = [];
    for (let a = -2; a <= 3; a += 0.5) {
      const marken = scharMarken(a);
      expect(marken.length, `a=${a}`).toBeLessThanOrEqual(7);
      for (const m of marken) {
        zahl++;
        const d = labelAbstand(m.lage, m, SCHAR_FENSTER, [{ f: scharF(a) }], false, SCHAR_TEILUNG);
        if (d < MIN_ABSTAND * 0.85) fehler.push(`a=${a} ${m.typ} bei (${m.x} | ${m.y}), Lage ${m.lage}, Abstand ${d.toFixed(3)}`);
        if (Math.abs(m.y) < 1e-9 && /unten/.test(m.lage)) fehler.push(`a=${a} ${m.typ} auf der Achse liegt unten`);
        if (Math.abs((m.x - 0) / (xmax - xmin)) < NAH_Y_ACHSE && !/rechts/.test(m.lage)) fehler.push(`a=${a} ${m.typ} steht nicht rechts von der y-Achse (${m.lage})`);
        expect(m.tx, `a=${a}`).toBeGreaterThan(xmin);
        expect(m.tx, `a=${a}`).toBeLessThan(xmax);
        expect(m.ty, `a=${a}`).toBeGreaterThan(ymin);
        expect(m.ty, `a=${a}`).toBeLessThan(ymax);
      }
    }
    expect(fehler).toEqual([]);
    expect(zahl).toBeGreaterThan(40);
  });
});

describe('Aufgaben und Fragen', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Nummern, Hilfen und Lösungsschritte', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['4', '5', '6', '7', '8', '10']);
    expect(fragen.map((q) => q.nummer)).toEqual(['1', '2', '3', '9', '11']);
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
  it('Gliederung nach dem Ablauf: Grundlagen, ausführliche Kurvendiskussionen, Forschungsaufgabe', () => {
    const html = rendern('ueberpruefen');
    const i1 = html.indexOf('Grundlagen: Verhalten und Symmetrie');
    const i2 = html.indexOf('Ausführliche Kurvendiskussionen');
    const i3 = html.indexOf('Forschungsaufgabe: eine Funktionenschar');
    expect(i1).toBeGreaterThan(-1);
    expect(i2).toBeGreaterThan(i1);
    expect(i3).toBeGreaterThan(i2);
  });
  it('jeder erwartete Wert wird mit der Eingabe auf zwei Nachkommastellen (oder exakt) als richtig bewertet, ein falscher Wert nicht', () => {
    let zahl = 0;
    for (const a of aufgaben) {
      for (const f of a.felder) {
        zahl++;
        const rund = (Math.round(f.erwartet * 100) / 100).toString().replace('.', ',');
        const urteil = bewerte([{ id: f.id, erwartet: f.erwartet, ...(f.toleranz !== undefined ? { toleranz: f.toleranz } : {}) }], { [f.id]: f.toleranz ? rund : String(f.erwartet).replace('.', ',') });
        expect(urteil[f.id], `${a.nummer} ${f.id}`).toBe('richtig');
        expect(bewerte([{ id: f.id, erwartet: f.erwartet, ...(f.toleranz !== undefined ? { toleranz: f.toleranz } : {}) }], { [f.id]: String(f.erwartet + 0.5) })[f.id], `${a.nummer} ${f.id} falsch`).toBe('falsch');
      }
    }
    expect(zahl).toBe(4 + 5 + 7 + 6 + 5 + 5);
  });

  it('Aufgabe 4 und 5: x⁴ − 5x² + 4, Ableitungen, Nullstellen, Extrem- und Wendepunkte unabhängig gefunden', () => {
    const G = D.G1;
    expect(istAbleitung(G.f, G.df)).toBe(true);
    expect(istAbleitung(G.df, G.ddf)).toBe(true);
    expect(istAbleitung(G.ddf, G.dddf)).toBe(true);
    const nullen = alleNullstellen(G.f, -3, 3);
    nahe(nullen, [-2, -1, 1, 2]);
    expect(feld('4', 'n').erwartet).toBe(nullen.length);
    expect(feld('4', 'x1').erwartet).toBeCloseTo(nullen.find((x) => x > 0)!, 6);
    expect(feld('4', 'x2').erwartet).toBeCloseTo(Math.max(...nullen), 6);
    expect(feld('4', 'sy').erwartet).toBeCloseTo(G.f(0), 12);
    // Symmetrie zur y-Achse
    expect(klassifiziere(G.f)).toBe('achse');
    // Extremstellen: Vorzeichenwechsel von f′
    const ex = vorzeichenwechsel(df(G.f), -3, 3);
    expect(ex).toHaveLength(3);
    expect(ex[1]!).toBeCloseTo(0, 4);
    expect(feld('5', 'hy').erwartet).toBeCloseTo(G.f(ex[1]!), 6);
    expect(feld('5', 'tx').erwartet).toBeCloseTo(ex[2]!, 3);
    expect(feld('5', 'ty').erwartet).toBeCloseTo(G.f(ex[2]!), 6);
    expect(G.f(ex[0]!)).toBeCloseTo(G.f(ex[2]!), 6);
    expect(zweiteDifferenz(G.f)(ex[0]!)).toBeGreaterThan(0);
    expect(zweiteDifferenz(G.f)(ex[1]!)).toBeLessThan(0);
    // Wendestellen: Vorzeichenwechsel von f″
    const we = vorzeichenwechsel(zweiteDifferenz(G.f), -3, 3);
    expect(we).toHaveLength(2);
    expect(feld('5', 'wx').erwartet).toBeCloseTo(we[1]!, 3);
    expect(feld('5', 'wy').erwartet).toBeCloseTo(G.f(we[1]!), 3);
    expect(G.dddf(we[1]!)).not.toBe(0);
  });
  it('Aufgabe 6: x·e^(−x), Asymptote, Nullstelle, Hochpunkt, Wendepunkt, Wendetangente unabhängig geprüft', () => {
    const G = D.G2;
    expect(istAbleitung(G.f, G.df, -1, 6)).toBe(true);
    expect(istAbleitung(G.df, G.ddf, -1, 6)).toBe(true);
    expect(istAbleitung(G.ddf, G.dddf, -1, 6)).toBe(true);
    expect(Math.abs(G.f(40) - feld('6', 'asy').erwartet)).toBeLessThan(1e-12);
    expect(G.f(-20)).toBeLessThan(-1e8);
    nahe(alleNullstellen(G.f, -1, 8), [0]);
    const ex = vorzeichenwechsel(df(G.f), -1, 8);
    nahe(ex, [1]);
    expect(feld('6', 'hx').erwartet).toBeCloseTo(ex[0]!, 4);
    expect(feld('6', 'hy').erwartet).toBeCloseTo(G.f(ex[0]!), 6);
    expect(richardson(G.df, ex[0]!)).toBeLessThan(0);
    const we = vorzeichenwechsel(zweiteDifferenz(G.f), -1, 8);
    nahe(we, [2]);
    expect(feld('6', 'wx').erwartet).toBeCloseTo(we[0]!, 3);
    expect(feld('6', 'wy').erwartet).toBeCloseTo(G.f(we[0]!), 4);
    // Wendetangente: Steigung f′(2), Gleichung, Nullstelle bei 4
    const m = richardson(G.f, 2);
    expect(feld('6', 'm').erwartet).toBeCloseTo(m, 6);
    for (const x of punkte(-1, 6, 14)) expect(G.wendeTangente(x)).toBeCloseTo(G.f(2) + m * (x - 2), 12);
    const nt = vorzeichenwechsel(G.wendeTangente, -1, 8);
    nahe(nt, [4]);
    expect(feld('6', 'nt').erwartet).toBeCloseTo(nt[0]!, 6);
  });
  it('Aufgabe 7: 3e^(−x) + x − 2, schiefe Asymptote, Tiefpunkt über der x-Achse, keine Nullstelle, kein Wendepunkt', () => {
    const G = D.G3;
    expect(istAbleitung(G.f, G.df, -3, 6)).toBe(true);
    expect(istAbleitung(G.df, G.ddf, -3, 6)).toBe(true);
    expect(istAbleitung(G.ddf, G.dddf, -3, 6)).toBe(true);
    // schiefe Asymptote für x → ∞, links wächst e^(−x) schneller als x fällt
    for (const x of [20, 40]) expect(Math.abs(G.f(x) - (feld('7', 'm').erwartet * x + feld('7', 'n').erwartet))).toBeLessThan(1e-6);
    expect(G.f(-20)).toBeGreaterThan(1e8);
    const ex = vorzeichenwechsel(df(G.f), -3, 8);
    expect(ex).toHaveLength(1);
    expect(feld('7', 'tx').erwartet).toBeCloseTo(ex[0]!, 3);
    expect(feld('7', 'ty').erwartet).toBeCloseTo(G.f(ex[0]!), 4);
    expect(zweiteDifferenz(G.f)(ex[0]!)).toBeGreaterThan(0);
    // globales Minimum über der x-Achse: keine Nullstelle
    expect(Math.min(...punkte(-5, 30, 4000).map(G.f))).toBeGreaterThan(0.09);
    expect(alleNullstellen(G.f, -10, 30)).toHaveLength(feld('7', 'nn').erwartet);
    // f″ nie null: kein Wendepunkt
    expect(Math.min(...punkte(-5, 10, 600).map(zweiteDifferenz(G.f)))).toBeGreaterThan(0);
    expect(vorzeichenwechsel(zweiteDifferenz(G.f), -5, 10)).toHaveLength(feld('7', 'nw').erwartet);
  });
  it('Aufgabe 8: 1 + 2cos x auf [−2π; 2π], Nullstellen, Tiefpunkte, Wendestellen, Randpunkte unabhängig geprüft', () => {
    const G = D.G4;
    expect(istAbleitung(G.f, G.df, -6, 6)).toBe(true);
    expect(istAbleitung(G.df, G.ddf, -6, 6)).toBe(true);
    expect(istAbleitung(G.ddf, G.dddf, -6, 6)).toBe(true);
    const nullen = alleNullstellen(G.f, G.von, G.bis);
    nahe(nullen, G.nullen);
    expect(feld('8', 'n').erwartet).toBe(nullen.length);
    expect(feld('8', 'x1').erwartet).toBeCloseTo(nullen.find((x) => x > 0)!, 4);
    const ex = vorzeichenwechsel(df(G.f), G.von, G.bis);
    nahe(ex, [-Math.PI, 0, Math.PI]);
    expect(feld('8', 'tp').erwartet).toBeCloseTo(G.f(ex[0]!), 6);
    expect(G.f(ex[2]!)).toBeCloseTo(-1, 9);
    expect(G.f(ex[1]!)).toBeCloseTo(G.hochY, 9);
    expect(G.f(G.von)).toBeCloseTo(G.hochY, 9);
    expect(G.f(G.bis)).toBeCloseTo(G.hochY, 9);
    const we = vorzeichenwechsel(zweiteDifferenz(G.f), G.von, G.bis);
    nahe(we, G.wenden);
    expect(feld('8', 'nw').erwartet).toBe(we.length);
    expect(feld('8', 'xw').erwartet).toBeCloseTo(we.find((x) => x > 0)!, 3);
    for (const x of we) expect(G.f(x)).toBeCloseTo(1, 6);
    expect(klassifiziere(G.f, 6)).toBe('achse');
  });
  it('Frage 9: 2x + cos x hat f′ ≥ 1 überall, keine Extrempunkte, streng monoton steigend, aber Wendepunkte', () => {
    const G = D.G5;
    expect(istAbleitung(G.f, G.df, -8, 8)).toBe(true);
    expect(istAbleitung(G.df, G.ddf, -8, 8)).toBe(true);
    expect(istAbleitung(G.ddf, G.dddf, -8, 8)).toBe(true);
    expect(Math.min(...punkte(-50, 50, 4000).map(G.df))).toBeGreaterThanOrEqual(1 - 1e-9);
    expect(vorzeichenwechsel(df(G.f), -20, 20)).toHaveLength(0);
    const xs = punkte(-20, 20, 4000);
    for (let i = 1; i < xs.length; i++) expect(G.f(xs[i]!)).toBeGreaterThan(G.f(xs[i - 1]!));
    nahe(vorzeichenwechsel(zweiteDifferenz(G.f), -5, 5), [-3 * Math.PI / 2, -Math.PI / 2, Math.PI / 2, 3 * Math.PI / 2]);
    // die falsche Rechnung 2 + sin x aus der Auswahl liefert nicht die Ableitung
    expect(Math.abs(2 + Math.sin(1) - richardson(G.f, 1))).toBeGreaterThan(0.1);
  });
  it('Aufgabe 10: Schar für a = 3 gegen scharStellen und gegen unabhängige Verfahren', () => {
    const A = D.SCHAR_AUFGABE;
    const f = scharF(A.a);
    const nullen = alleNullstellen(f, -5, 5);
    nahe(nullen, [-A.nullX, 0, A.nullX]);
    expect(feld('10', 'n').erwartet).toBeCloseTo(nullen[2]!, 4);
    const ex = vorzeichenwechsel(df(f), -5, 5);
    expect(feld('10', 'tx').erwartet).toBeCloseTo(ex[2]!, 3);
    expect(feld('10', 'ty').erwartet).toBeCloseTo(f(ex[2]!), 6);
    const we = vorzeichenwechsel(zweiteDifferenz(f), -5, 5);
    expect(feld('10', 'wx').erwartet).toBeCloseTo(we[1]!, 3);
    expect(feld('10', 'wy').erwartet).toBeCloseTo(f(we[1]!), 3);
    const stellen = scharStellen(A.a);
    expect(stellen.find((s) => s.typ === 'T' && s.x > 0)!.y).toBe(A.tiefY);
    expect(stellen.find((s) => s.typ === 'W' && s.x > 0)!.y).toBeCloseTo(A.wendeY, 12);
  });
  it('Frage 11: Wendepunkte gibt es genau für a > 0, geprüft an Vorzeichenwechseln von f″', () => {
    for (const a of [-2, -1, -0.5, 0, 0.5, 1, 2, 3]) {
      const gibt = vorzeichenwechsel(zweiteDifferenz(scharF(a)), -5, 5).length > 0;
      expect(gibt, `a=${a}`).toBe(a > 0);
    }
    const frage = fragen.find((q) => q.nummer === '11')!;
    expect(frage.optionen.find((o) => o.richtig)!.id).toBe('positiv');
  });
  it('Frage 1, 2 und 3: Verlauf, Asymptote und Symmetrie gegen große Werte und das Raster', () => {
    // Frage 1: f(x) = −2x⁵ + x³ − 4x, ungerader Grad, negativer Leitkoeffizient: vom II. in den IV. Quadranten
    const f1 = D.FRAGE1.f;
    for (const x of [20, 100, 1000]) {
      expect(f1(x)).toBeLessThan(0);
      expect(f1(-x)).toBeGreaterThan(0);
    }
    expect(fragen.find((q) => q.nummer === '1')!.optionen.find((o) => o.richtig)!.id).toBe('richtig');
    // Frage 2: 4 − 3e^(−x), Asymptote y = 4 für x → ∞, nach links gegen −∞
    const f2 = D.FRAGE2.f;
    expect(Math.abs(f2(40) - D.FRAGE2.asymptote)).toBeLessThan(1e-6);
    expect(f2(-20)).toBeLessThan(-1e8);
    expect(fragen.find((q) => q.nummer === '2')!.optionen.find((o) => o.richtig)!.id).toBe('rechts');
    // Frage 3: genau eine Funktion ist punktsymmetrisch zum Ursprung
    const arten = (['a', 'b', 'c', 'd'] as const).map((k) => klassifiziere(D.FRAGE3[k].f, 3));
    expect(arten).toEqual(['punkt', 'achse', 'keine', 'keine']);
    for (const k of ['a', 'b', 'c', 'd'] as const) expect(klassifiziere(D.FRAGE3[k].f, 3), k).toBe(D.FRAGE3[k].symmetrie);
    expect(fragen.find((q) => q.nummer === '3')!.optionen.find((o) => o.richtig)!.id).toBe('a');
    // die im Text genannten Gegenbeispiele
    expect([D.FRAGE3.c.f(1), D.FRAGE3.c.f(-1)]).toEqual([2, 0]);
    expect([D.FRAGE3.d.f(1), D.FRAGE3.d.f(-1)]).toEqual([3, 1]);
  });
});

describe('Beispiele und Zahlen im Erklären und Entdecken', () => {
  it('Nullstellen der drei Werkzeuge', () => {
    for (const [name, b] of Object.entries(D.NULLEN_BEISPIELE)) nahe(alleNullstellen(b.f, -5, 5), b.nullen, 4);
    expect(Object.keys(D.NULLEN_BEISPIELE)).toHaveLength(3);
  });
  it('Symmetriebeispiele: gerade, ungerade, keine mit den genannten Zahlenwerten', () => {
    const { gerade, ungerade, keine } = D.SYMMETRIE_BEISPIELE;
    expect(klassifiziere(gerade.f)).toBe('achse');
    expect(klassifiziere(ungerade.f)).toBe('punkt');
    expect(klassifiziere(keine.f)).toBe('keine');
    expect(gerade.f(gerade.x0)).toBe(gerade.wert);
    expect(ungerade.f(ungerade.x0)).toBe(ungerade.wert);
    expect([keine.f(keine.x0), keine.f(-keine.x0)]).toEqual([keine.wert, keine.wertSpiegel]);
    expect(keine.wertSpiegel).not.toBe(keine.wert);
    expect(keine.wertSpiegel).not.toBe(-keine.wert);
  });
  it('Asymptotenbeispiele: waagerecht y = 2 und schief y = x + 1 für x → ∞', () => {
    const { waagerecht, schief } = D.ASYMPTOTE_BEISPIELE;
    for (const [b, bez] of [[waagerecht, 'waagerecht'], [schief, 'schief']] as const) {
      expect(Math.abs(b.f(40) - (b.m * 40 + b.n)), bez).toBeLessThan(1e-6);
      expect(Math.abs(b.f(5) - (b.m * 5 + b.n)), bez).toBeGreaterThan(Math.abs(b.f(40) - (b.m * 40 + b.n)));
    }
    expect([waagerecht.m, waagerecht.n, schief.m, schief.n]).toEqual([0, 2, 1, 1]);
  });
  it('Vermutung 1: die Werte der Tabelle stimmen, x³ gewinnt erst nach x = 20', () => {
    for (const w of D.VERMUTUNG_HOCH.werte) {
      expect(w.hoch).toBe(w.x ** 3);
      expect(w.klein).toBe(20 * w.x * w.x);
      expect(w.f).toBe(D.VERMUTUNG_HOCH.f(w.x));
    }
    expect(D.VERMUTUNG_HOCH.f(10)).toBeLessThan(0);
    expect(D.VERMUTUNG_HOCH.f(20)).toBe(0);
    expect(D.VERMUTUNG_HOCH.f(21)).toBeGreaterThan(0);
    expect(D.VERMUTUNG_HOCH.werte[2]!.hoch / D.VERMUTUNG_HOCH.werte[2]!.klein).toBe(50);
    // Tiefstwert bei x = 40/3 ist etwa −1185, wie im Bild beschrieben
    expect(D.VERMUTUNG_HOCH.f(40 / 3)).toBeCloseTo(-1185.19, 1);
  });
  it('Vermutung 2: Hochzahlen und Symmetrie stimmen mit dem Raster überein', () => {
    for (const s of D.SYMMETRIE_REGEL) expect(klassifiziere(s.f), s.id).toBe(s.symmetrie);
    expect(D.SYMMETRIE_REGEL.map((s) => s.symmetrie)).toEqual(['achse', 'punkt', 'keine', 'keine', 'keine']);
  });
  it('die vier Fälle ganzrationaler Funktionen passen zu den Laborfunktionen', () => {
    const ids = ['grad4-plus', 'grad3-plus', 'grad4-minus', 'grad5-minus'];
    expect(D.VIER_FAELLE).toHaveLength(4);
    D.VIER_FAELLE.forEach((z, i) => {
      const fn = VERHALTEN_FUNKTIONEN.find((f) => f.id === ids[i])!;
      expect(`x\\to-\\infty:\\ ${z.links}`).toBe(verhaltenTex(fn.links, 'links'));
      expect(`x\\to\\infty:\\ ${z.rechts}`).toBe(verhaltenTex(fn.rechts, 'rechts'));
      expect(z.grad).toBe(fn.id.startsWith('grad4') ? 'gerade' : 'ungerade');
      expect(z.lk).toBe(fn.id.endsWith('plus') ? 'positiv' : 'negativ');
    });
    expect(new Set(D.VIER_FAELLE.map((z) => z.verlauf)).size).toBe(4);
  });
});

describe('Schaubilder', () => {
  const einzelne: [string, MessbildDaten][] = [
    ...(Object.entries(B).filter(([, v]) => typeof v === 'object' && v !== null && 'kurven' in (v as object)) as [string, MessbildDaten][]),
    ...VERHALTEN_FUNKTIONEN.map((fn) => [`bildVerhalten(${fn.id})`, B.bildVerhalten(fn.id)] as [string, MessbildDaten]),
    ...[-1, 0, 1, 2, 3].map((a) => [`scharBild(${a})`, B.scharBild(a)] as [string, MessbildDaten]),
  ];
  const paar: PaarDaten = B.PAAR_G5;
  const alle: [string, MessbildDaten][] = [...einzelne, ['PAAR_G5.oben', paar.oben], ['PAAR_G5.unten', paar.unten]];
  /** Alle Linien, auf denen eine Beschriftung nicht stehen darf: Kurven und gestrichelte Strecken, die nicht senkrecht sind. */
  const hindernisse = (b: MessbildDaten): Hindernis[] => [
    ...b.kurven.map((k): Hindernis => ({ f: k.f, ...(k.von !== undefined ? { von: k.von } : {}), ...(k.bis !== undefined ? { bis: k.bis } : {}) })),
    ...(b.strecken ?? [])
      .filter((s) => s.von[0] !== s.bis[0] && s.von[1] !== 0)
      .map((s): Hindernis => ({ f: (x) => s.von[1] + ((s.bis[1] - s.von[1]) / (s.bis[0] - s.von[0])) * (x - s.von[0]), von: Math.min(s.von[0], s.bis[0]), bis: Math.max(s.von[0], s.bis[0]) })),
  ];

  it('es gibt alle Schaubilder, jedes mit Beschreibung, Punkte liegen auf einer Kurve und im Ausschnitt', () => {
    expect(einzelne.length).toBeGreaterThanOrEqual(30);
    for (const [name, b] of alle) {
      expect(b.beschreibung.length, name).toBeGreaterThan(40);
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
  it('Schaubilder von K_f nennen das Schaubild in der Beschreibung und jeden markierten Punkt', () => {
    for (const [name, b] of einzelne) {
      if (!b.punkte?.length) continue;
      expect(b.beschreibung, name).toContain('Markiert sind');
      expect(b.beschreibung, name).toContain('Schaubild K f');
    }
  });
  it('Beschriftungen liegen nie auf einem Schaubild, einer Geraden oder gestrichelten Strecke, nicht unter der x-Achse und nahe der y-Achse rechts davon', () => {
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
  it('Farben: K_f orange, Geraden blau gestrichelt, Strecken schwarz gestrichelt, K_f′ grün', () => {
    for (const [name, b] of einzelne) {
      expect(b.kurven[0]!.farbe, name).toBe(ORANGE);
      for (const k of b.kurven.slice(1)) {
        expect(k.gestrichelt, name).toBe(true);
        expect(k.farbe, name).toBe(BLAU);
      }
      for (const s of b.strecken ?? []) {
        expect(s.gestrichelt, name).toBe(true);
        expect(s.farbe, name).toBe(SCHWARZ);
      }
    }
    expect(paar.unten.kurven[0]!.farbe).toBe(GRUEN);
    const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const abstand = (a: string, b: string) => Math.hypot(...rgb(a).map((v, k) => v - rgb(b)[k]!));
    for (const [a, b] of [[ORANGE, BLAU], [ORANGE, SCHWARZ], [BLAU, SCHWARZ], [ORANGE, GRUEN], [ORANGE, ROSA]] as const) expect(abstand(a, b)).toBeGreaterThan(150);
  });
  it('die Bilder der Laborfunktionen zeigen so viele gestrichelte Asymptoten wie angegeben, und die Geraden sind Asymptoten', () => {
    for (const fn of VERHALTEN_FUNKTIONEN) {
      const b = B.bildVerhalten(fn.id);
      expect(b.kurven.length - 1, fn.id).toBe(fn.asymptoten.length);
      fn.asymptoten.forEach((a, i) => {
        const g = b.kurven[i + 1]!;
        const s = a.seite === 'rechts' ? 1 : -1;
        expect(Math.abs(g.f(s * 40) - fn.f(s * 40)), fn.id).toBeLessThan(1e-6);
      });
      expect(b.bereich).toEqual([fn.x[0], fn.x[1], fn.y[0], fn.y[1]]);
      expect(b.kurven[0]!.f(1.5)).toBe(fn.f(1.5));
    }
  });
  it('Schar-Bilder zeigen genau die Stellen von scharStellen', () => {
    for (const a of [-1, 0, 1, 2, 3]) {
      const b = B.scharBild(a);
      const erwartet = scharStellen(a);
      expect((b.punkte ?? []).map((p) => [p.text, p.x, p.y])).toEqual(erwartet.map((s) => [s.typ, s.x, s.y]));
    }
  });
  it('Erklären: P und Q liegen bei der geraden Funktion gleich hoch, bei der ungeraden gegenüber dem Ursprung', () => {
    const g = B.BILD_SYM_GERADE.punkte!;
    expect(g.map((p) => p.text)).toEqual(['P', 'Q']);
    expect(g[0]!.x).toBe(-g[1]!.x);
    expect(g[0]!.y).toBe(g[1]!.y);
    expect(g[0]!.y).toBe(-7);
    const u = B.BILD_SYM_UNGERADE.punkte!;
    expect(u[0]!.x).toBe(-u[1]!.x);
    expect(u[0]!.y).toBe(-u[1]!.y);
    expect(u[0]!.y).toBe(5);
    const s = B.BILD_SYM_UNGERADE.strecken![0]!;
    expect(s.von[0] * s.bis[1] - s.von[1] * s.bis[0]).toBeCloseTo(0, 12);
    const s3 = B.BILD_F3.strecken![0]!;
    expect(s3.von[0] * s3.bis[1] - s3.von[1] * s3.bis[0]).toBeCloseTo(0, 12);
    const p3 = B.BILD_F3.punkte!;
    expect(p3[0]!.x).toBe(-p3[1]!.x);
    expect(p3[0]!.y).toBeCloseTo(-p3[1]!.y, 12);
  });
  it('Aufgabenbilder: Punkte und Geraden stimmen mit den Rechnungen überein', () => {
    const texte = (b: MessbildDaten) => (b.punkte ?? []).map((p) => p.text);
    expect(texte(B.BILD_A4)).toEqual(['N', 'N', 'N', 'N', 'Sy']);
    expect(texte(B.BILD_A5)).toEqual(['H', 'T', 'T', 'W', 'W']);
    expect(texte(B.BILD_ALLES)).toHaveLength(9);
    expect(texte(B.BILD_A6)).toEqual(['N', 'H', 'W']);
    expect(texte(B.BILD_A7)).toEqual(['T']);
    expect(texte(B.BILD_A8).sort()).toEqual([...'HNNNNRRTTWWWW'].sort());
    expect(B.BILD_A8.kurven[0]!.von).toBeCloseTo(-2 * Math.PI, 12);
    expect(B.BILD_A8.kurven[0]!.bis).toBeCloseTo(2 * Math.PI, 12);
    // Wendetangente: berührt K_f bei x = 2 mit der Steigung f′(2)
    const t = B.BILD_A6.kurven[1]!;
    expect(t.f(2)).toBeCloseTo(D.G2.f(2), 12);
    expect(t.f(3) - t.f(2)).toBeCloseTo(richardson(D.G2.f, 2), 6);
    expect(t.f(4)).toBeCloseTo(0, 12);
    // schiefe Asymptote y = x − 2
    const a = B.BILD_A7.kurven[1]!;
    expect(a.f(0)).toBe(-2);
    expect(a.f(5) - a.f(4)).toBe(1);
    // Frage 2: Asymptote y = 4
    expect(B.BILD_F2.kurven[1]!.f(3)).toBe(4);
  });
  it('Frage 9: das Paarbild färbt die ganze x-Achse blau, K_f steigt überall', () => {
    const f = paar.oben.kurven[0]!.f;
    const balken = (paar.oben.strecken ?? []).filter((s) => s.von[1] === 0 && s.bis[1] === 0);
    expect(balken.length).toBeGreaterThan(0);
    for (const s of balken) {
      expect(s.farbe).toBe(BLAU);
      for (const x of punkte(s.von[0] + 0.05, s.bis[0] - 0.05, 40)) expect(richardson(f, x)).toBeGreaterThan(0);
    }
    expect(paar.oben.punkte ?? []).toHaveLength(0);
  });
});
