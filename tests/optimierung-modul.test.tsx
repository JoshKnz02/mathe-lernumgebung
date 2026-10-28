import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/optimierung/Bilder';
import * as D from '../content/modules/optimierung/daten';
import Modul from '../content/modules/optimierung/index';
import meta from '../content/modules/optimierung/meta.json';
import { Optimierungslabor } from '../content/modules/optimierung/Optimierungslabor';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { BLAU, ORANGE, SCHWARZ, type MessbildDaten } from '../src/components/Messbild';
import { MIN_ABSTAND, NAH_Y_ACHSE, labelAbstand, type BeschriftungsLage, type Hindernis } from '../src/lib/beschriftung';
import { bewerte } from '../src/lib/eingabe';
import { SITUATIONEN } from '../src/lib/optimierung';
import { punkte, richardson, vorzeichenwechsel, type Fn } from './numerik';

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
const MODULORDNER = 'content/modules/optimierung';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const wert = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!.erwartet;
const alleRelevanten = () => readdirSync(MODULORDNER).filter((d) => d.endsWith('.tsx') || d.endsWith('.ts'));
/** Größter bzw. kleinster Wert auf einem feinen Raster, unabhängig von der Ableitung. */
const extremum = (f: Fn, a: number, b: number, max: boolean, n = 400000) => {
  let bx = a;
  let by = f(a);
  for (const x of punkte(a, b, n)) {
    const y = f(x);
    if (max ? y > by : y < by) {
      bx = x;
      by = y;
    }
  }
  return { x: bx, y: by };
};

describe('Metadaten und Darstellung', () => {
  it('Entwurf im Themenbereich Differentialrechnung mit vier Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('optimierung');
    expect(meta.thema).toBe('differentialrechnung');
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.bpe).toEqual(['3.5', '12.7', '15.1']);
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
      expect(q, d).not.toMatch(/<code>[^<]*\/(?!\d)/);
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
    for (const m of ['kurvendiskussion', 'ausfuehrliche-kurvendiskussion']) expect(quelle, m).toContain(`modul="${m}"`);
  });
  it('das Modul ist noch in keinem Kurs eingetragen, solange es ein Entwurf ist', () => {
    if (meta.status !== 'entwurf') return;
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"optimierung"');
  });
  it('Erklären nennt die Begriffe und die sechs Schritte, nimmt aber die Randwerte als Ergebnis noch nicht vorweg', () => {
    const erklaeren = rendern('erklaeren');
    for (const w of ['Zielgröße', 'Nebenbedingung', 'Zielfunktion', 'Definitionsbereich', 'Randwerte', 'Gehege', 'Antwortsatz', 'lokaler Hochpunkt']) expect(erklaeren, w).toContain(w);
    for (const w of ['am Rand', 'Randextremum', 'Randmaximum', 'höher als der Hochpunkt', 'so hoch wie breit', 'gleich dem Durchmesser', 'keinen größten']) expect(erklaeren, w).not.toContain(w);
    const zus = rendern('zusammenfassung');
    for (const w of ['Die Strategie in sechs Schritten', 'Randwerte und globale Extrema', 'Den Extremwert nachweisen', 'Typische Fehler', 'Typische Situationen', 'Modell und Wirklichkeit']) expect(zus, w).toContain(w);
  });
  it('Entdecken: drei Vermutungsfragen vor den Laboren, vier Labore, sechzehn Beobachtungen', () => {
    const html = rendern('entdecken');
    expect((html.match(/class="labor"/g) ?? []).length).toBe(4);
    expect(html.indexOf('Vermutung')).toBeGreaterThan(-1);
    expect(html.indexOf('Vermutung')).toBeLessThan(html.indexOf('class="labor"'));
    expect((html.match(/Beobachtung vergleichen/g) ?? []).length).toBe(3 + 4 + 2 + 3 + 4);
    for (const w of ['Labor 1: Die Schachtel', 'Labor 2: Ein Minimum', 'Labor 3: Der Rand', 'Labor 4: Die Nebenbedingung']) expect(html, w).toContain(w);
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
});

describe('Labor', () => {
  it('rendert für jede Situation mit zwei Schaubildern, Regler, vier Schaltern, Wert merken und Tabelle ohne Formelfehler', () => {
    for (const id of ['schachtel', 'parallelogramm', 'rand', 'dose'] as const) {
      const html = renderToStaticMarkup(<Optimierungslabor situation={id} />);
      expect(html, id).not.toContain('formel-fehler');
      expect(html, id).not.toContain('katex-error');
      expect((html.match(/role="img"/g) ?? []).length, id).toBe(2);
      for (const w of ['Legende', 'Zielfunktion zeichnen', 'Tangente zeigen', 'Randwerte zeigen', `Stellen mit ${SITUATIONEN[id].zielTex}′ = 0`, 'Wert merken', 'Gemerkte Werte löschen', 'Zurücksetzen', 'type="range"', 'Größen bei']) expect(html, `${id} ${w}`).toContain(w);
      expect((html.match(/type="checkbox"/g) ?? []).length, id).toBe(4);
      for (const z of ['–', '—']) expect(html, id).not.toContain(z);
    }
  });
  it('Startwerte der Tabelle: Schachtel bei x = 1 (22, 13, 1, 286), Dose bei r = 3 (Volumen 330)', () => {
    const s = renderToStaticMarkup(<Optimierungslabor situation="schachtel" />);
    for (const w of ['>22 cm<', '>13 cm<', '>1 cm<', '>286 cm³<']) expect(s, w).toContain(w);
    const d = renderToStaticMarkup(<Optimierungslabor situation="dose" />);
    expect(d).toContain('>3 cm<');
    expect(d).toContain('>11,67 cm<');
    expect(d).toContain('>276,55 cm²<');
  });
});

describe('Aufgaben und Fragen', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Nummern, Hilfen und Lösungsschritte', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['3', '4', '5', '7', '8', '9', '10', '12', '13', '14', '15']);
    expect(fragen.map((q) => q.nummer)).toEqual(['1', '2', '6', '11']);
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
  it('Gliederung: Zielfunktion und Definitionsbereich, Extremwerte an Schaubildern, Randwerte und Existenz, Anwendungen', () => {
    const html = rendern('ueberpruefen');
    const stellen = ['Zielfunktion und Definitionsbereich', 'Extremwerte an Schaubildern', 'Randwerte und Existenz', 'Anwendungen'].map((w) => html.indexOf(`<h3>${w}</h3>`));
    stellen.forEach((i) => expect(i).toBeGreaterThan(-1));
    expect([...stellen].sort((a, b) => a - b)).toEqual(stellen);
  });
  it('jeder erwartete Wert wird mit der Eingabe in Dezimalschreibweise oder als Bruch als richtig bewertet, ein falscher Wert nicht', () => {
    let zahl = 0;
    for (const a of aufgaben) {
      for (const f of a.felder) {
        zahl++;
        const tol = f.toleranz !== undefined ? { toleranz: f.toleranz } : {};
        const rund = f.toleranz ? (Math.round(f.erwartet / f.toleranz) * f.toleranz).toFixed(3).replace('.', ',') : String(f.erwartet).replace('.', ',');
        expect(bewerte([{ id: f.id, erwartet: f.erwartet, ...tol }], { [f.id]: rund })[f.id], `${a.nummer} ${f.id}`).toBe('richtig');
        expect(bewerte([{ id: f.id, erwartet: f.erwartet, ...tol }], { [f.id]: String(f.erwartet + 0.5) })[f.id], `${a.nummer} ${f.id} falsch`).toBe('falsch');
      }
    }
    expect(zahl).toBe(3 + 3 + 4 + 2 + 2 + 3 + 4 + 3 + 2 + 2 + 3);
    expect(bewerte([{ id: 'u', erwartet: 250 / 3, toleranz: 0.01 }], { u: '250/3' }).u).toBe('richtig');
    expect(bewerte([{ id: 'u', erwartet: 81 / 32, toleranz: 0.001 }], { u: '81/32' }).u).toBe('richtig');
  });

  it('Aufgabe 3: offene Kiste, Minimum der Oberfläche unabhängig gefunden, Nebenbedingung und Randverhalten', () => {
    const f = (x: number) => x * x + (4 * x * D.KISTE.volumen) / (x * x);
    const m = extremum(f, 0.05, 40, false);
    expect(m.x).toBeCloseTo(wert('3', 'x'), 3);
    expect(m.y).toBeCloseTo(wert('3', 'o'), 6);
    expect(D.KISTE.volumen / (wert('3', 'x') ** 2)).toBeCloseTo(wert('3', 'h'), 9);
    for (const x of punkte(0.5, 20, 40)) {
      expect(D.KISTE.z(x)).toBeCloseTo(f(x), 9);
      expect(D.KISTE.dz(x)).toBeCloseTo(richardson(D.KISTE.z, x), 4);
    }
    expect(f(0.05)).toBeGreaterThan(1000);
    expect(f(40)).toBeGreaterThan(1000);
  });
  it('Aufgabe 4: Glasplatte, Bruchkante durch (60 | 80) und (100 | 50), größtes Rechteck gegen Raster, Randwerte', () => {
    expect(D.GLAS.y(60)).toBeCloseTo(80, 9);
    expect(D.GLAS.y(100)).toBeCloseTo(50, 9);
    expect((50 - 80) / (100 - 60)).toBeCloseTo(-0.75, 9);
    const m = extremum(D.GLAS.z, 60, 100, true);
    expect(m.x).toBeCloseTo(wert('4', 'u'), 2);
    expect(m.y).toBeCloseTo(wert('4', 'a'), 2);
    expect(D.GLAS.y(m.x)).toBeCloseTo(wert('4', 'h'), 2);
    expect(D.GLAS.z(60)).toBe(D.GLAS.aVon);
    expect(D.GLAS.z(100)).toBe(D.GLAS.aBis);
    expect(D.GLAS.a).toBeGreaterThan(Math.max(D.GLAS.aVon, D.GLAS.aBis));
    for (const u of punkte(60, 100, 20)) expect(D.GLAS.dz(u)).toBeCloseTo(richardson(D.GLAS.z, u), 4);
    // Beispielrechteck der Skizze: P liegt auf der Bruchkante
    expect(D.GLAS.y(D.GLAS.beispielU)).toBeCloseTo(72.5, 9);
  });
  it('Aufgabe 5: Rechteck unter 12 − x², Fläche und Umfang haben verschiedene Maxima, geprüft gegen das Raster', () => {
    const a = (u: number) => (2 * u) * D.PARABEL.f(u);
    const um = (u: number) => 2 * (2 * u + D.PARABEL.f(u));
    const ma = extremum(a, 1e-6, D.PARABEL.bis, true);
    const mu = extremum(um, 1e-6, D.PARABEL.bis, true);
    expect(ma.x).toBeCloseTo(wert('5', 'ua'), 3);
    expect(ma.y).toBeCloseTo(wert('5', 'am'), 6);
    expect(mu.x).toBeCloseTo(wert('5', 'uu'), 3);
    expect(mu.y).toBeCloseTo(wert('5', 'um'), 6);
    expect(wert('5', 'ua')).not.toBe(wert('5', 'uu'));
    for (const u of punkte(0.1, 3.4, 30)) {
      expect(D.PARABEL.dFlaeche(u)).toBeCloseTo(richardson(D.PARABEL.flaeche, u), 4);
      expect(D.PARABEL.dUmfang(u)).toBeCloseTo(richardson(D.PARABEL.umfang, u), 4);
    }
    // Randwerte der Umfangsfunktion: 24 und 4√12 + 24 − 24
    expect(D.PARABEL.umfang(0)).toBe(24);
    expect(D.PARABEL.umfang(D.PARABEL.bis)).toBeCloseTo(4 * D.PARABEL.bis, 9);
    expect(D.PARABEL.f(D.PARABEL.bis)).toBeCloseTo(0, 9);
  });
  it('Frage 1 und 2: Zielfunktion zum Umfang 40 und Definitionsbereich der Schachtel aus 20 × 12', () => {
    // b = 20 − a, größter Flächeninhalt beim Quadrat
    const m = extremum(D.UMFANG40.z, 0, 20, true);
    expect(m.x).toBeCloseTo(10, 3);
    expect(m.y).toBeCloseTo(100, 6);
    // Schachtel 20 × 12: Länge und Breite positiv genau für x < 6, die Bedingung der Breite ist die schärfere
    const breite = (x: number) => 12 - 2 * x;
    const laenge = (x: number) => 20 - 2 * x;
    for (const x of punkte(0.01, 9.9, 99)) expect(breite(x) > 0 && laenge(x) > 0, `x=${x}`).toBe(x < 6);
    expect(D.BLATT20.bis).toBe(6);
    const m2 = extremum(D.BLATT20_ZIEL.z, 0, 6, true);
    expect(m2.x).toBeCloseTo(D.BLATT20_ZIEL.x, 3);
    expect(vorzeichenwechsel((x) => richardson(D.BLATT20_ZIEL.z, x), 0, 12).map((x) => Math.round(x * 100) / 100)).toEqual([2.43, 8.24]);
  });
  it('Frage 6: Z(x) = x³ − 3x² + 2 auf [−1; 4], Hochpunkt 0, Tiefpunkt 2, größter Wert am Rand bei 4', () => {
    const z = D.FEHLER.z;
    expect(vorzeichenwechsel((x) => richardson(z, x), -1, 4).map((x) => Math.round(x * 1000) / 1000)).toEqual([0, 2]);
    expect(extremum(z, -1, 4, true)).toEqual({ x: 4, y: 18 });
    expect(extremum(z, -1, 4, false)).toEqual(expect.objectContaining({ y: -2 }));
    expect([z(-1), z(0), z(2), z(4)]).toEqual([-2, 2, -2, 18]);
    expect(D.FEHLER.dz(4)).toBe(24);
    expect(richardson(z, 4)).toBeCloseTo(24, 4);
    // Z″(0) < 0 (Hochpunkt), Z″(2) > 0 (Tiefpunkt) mit Z″ = 6x − 6
    expect([6 * 0 - 6, 6 * 2 - 6]).toEqual([-6, 6]);
  });
  it('Aufgabe 7: Dreieck unter x³ − 6x² + 9x, größter Flächeninhalt gegen das Raster, exakt 81/32', () => {
    const a = (u: number) => 0.5 * u * D.DREIECK.f(u);
    const m = extremum(a, 0, 3, true);
    expect(m.x).toBeCloseTo(wert('7', 'u'), 3);
    expect(m.y).toBeCloseTo(wert('7', 'a'), 7);
    expect(wert('7', 'a')).toBe(81 / 32);
    expect(D.DREIECK.fu).toBe(D.DREIECK.f(1.5));
    expect(D.DREIECK.z(0)).toBe(0);
    expect(D.DREIECK.z(3)).toBe(0);
    for (const u of punkte(0.1, 2.9, 28)) {
      expect(D.DREIECK.dz(u)).toBeCloseTo(richardson(D.DREIECK.z, u), 4);
      expect(D.DREIECK.ddz(u)).toBeCloseTo(richardson(D.DREIECK.dz, u), 4);
    }
    expect(D.DREIECK.ddz(1.5)).toBeCloseTo(-4.5, 9);
    // f ist auf [0; 3] nicht negativ: das Dreieck liegt über der x-Achse
    for (const x of punkte(0, 3, 60)) expect(D.DREIECK.f(x)).toBeGreaterThanOrEqual(-1e-12);
  });
  it('Aufgabe 8: vertikaler Abstand von (x + 2)e^(−x) und 2e^(−x), Maximum 1/e bei u = 1, Randwerte 0', () => {
    for (const u of punkte(0, 8, 40)) {
      expect(D.ABSTAND.f(u) - D.ABSTAND.g(u)).toBeCloseTo(D.ABSTAND.z(u), 12);
      expect(D.ABSTAND.f(u)).toBeGreaterThanOrEqual(D.ABSTAND.g(u) - 1e-15);
      expect(D.ABSTAND.dz(u)).toBeCloseTo(richardson(D.ABSTAND.z, u), 5);
    }
    const m = extremum(D.ABSTAND.z, 0, 40, true);
    expect(m.x).toBeCloseTo(wert('8', 'u'), 3);
    expect(m.y).toBeCloseTo(wert('8', 'd'), 3);
    expect(D.ABSTAND.z(0)).toBe(0);
    expect(D.ABSTAND.z(40)).toBeLessThan(1e-15);
    expect(D.ABSTAND.ddz(1)).toBeCloseTo(-1 / Math.E, 12);
  });
  it('Aufgabe 9: Abstand des Punkts (0 | 3) von x², d² = u⁴ − 5u² + 9, Minimum bei u² = 5/2 gegen das Raster', () => {
    const [p, q] = D.PUNKTABSTAND.p;
    const d = (u: number) => Math.hypot(u - p, D.PUNKTABSTAND.f(u) - q);
    const m = extremum(d, 0, 4, false);
    expect(m.x ** 2).toBeCloseTo(wert('9', 'u2'), 3);
    expect(m.y ** 2).toBeCloseTo(wert('9', 'd2'), 6);
    expect(m.y).toBeCloseTo(wert('9', 'd'), 2);
    expect(wert('9', 'u2')).toBe(2.5);
    for (const u of punkte(-3, 3, 30)) {
      expect(d(u) ** 2).toBeCloseTo(D.PUNKTABSTAND.d2(u), 9);
      expect(D.PUNKTABSTAND.dd2(u)).toBeCloseTo(richardson(D.PUNKTABSTAND.d2, u), 4);
    }
    // an der Stelle u = 0 liegt ein Hochpunkt von d² mit dem Wert 9
    expect(D.PUNKTABSTAND.d2(0)).toBe(9);
    expect(D.PUNKTABSTAND.d2(0.5)).toBeLessThan(9);
  });
  it('Aufgabe 10: Rechteck mit festem Eckpunkt, lokales Maximum bei 2 (18), größter Wert am Rand bei 0 (20)', () => {
    const z = D.RANDRECHTECK.z;
    expect(vorzeichenwechsel((x) => richardson(z, x), 0, 5).map((x) => Math.round(x * 1000) / 1000)).toEqual([1.333, 2]);
    expect(z(wert('10', 'lu'))).toBe(wert('10', 'la'));
    const innen = extremum(z, 1.5, 3, true);
    expect(innen.x).toBeCloseTo(wert('10', 'lu'), 3);
    expect(innen.y).toBeCloseTo(wert('10', 'la'), 6);
    const gesamt = extremum(z, 0, 5, true);
    expect(gesamt.x).toBe(wert('10', 'gu'));
    expect(gesamt.y).toBe(wert('10', 'ga'));
    expect(D.RANDRECHTECK.dz(0)).toBe(-4);
    expect(z(4 / 3)).toBeLessThan(z(2));
    expect(z(5)).toBe(0);
  });
  it('Frage 11: Flächeninhalt der Rechtecke hat ein Maximum, das Volumen der Zylinder keines (streng monoton, Grenzwert 8π)', () => {
    expect(extremum(D.ZYLINDER.flaeche, 1e-6, 60, true).x).toBeCloseTo(2, 3);
    expect(extremum(D.ZYLINDER.flaeche, 1e-6, 60, true).y).toBeCloseTo(4, 6);
    for (const u of punkte(0.1, 200, 400)) {
      expect(D.ZYLINDER.volumen(u)).toBeCloseTo(Math.PI * u * u * D.ZYLINDER.f(u), 9);
      expect(D.ZYLINDER.dVolumen(u)).toBeGreaterThan(0);
      expect(D.ZYLINDER.volumen(u)).toBeLessThan(D.ZYLINDER.grenze);
    }
    for (const u of punkte(0.1, 50, 50)) expect(D.ZYLINDER.dVolumen(u)).toBeCloseTo(richardson(D.ZYLINDER.volumen, u), 4);
    expect(D.ZYLINDER.volumen(1e6)).toBeCloseTo(D.ZYLINDER.grenze, 4);
    const v = punkte(0.1, 100, 1000).map(D.ZYLINDER.volumen);
    expect(v.every((x, i) => i === 0 || x > v[i - 1]!)).toBe(true);
  });
  it('Aufgabe 12: Gewinn beim Turnier, Maximum gegen das Raster, Besucherzahl und Randwerte', () => {
    const m = extremum(D.EINTRITT.z, 2, 15, true);
    expect(m.x).toBeCloseTo(wert('12', 'p'), 3);
    expect(m.y).toBeCloseTo(wert('12', 'g'), 6);
    expect(D.EINTRITT.n(wert('12', 'p'))).toBe(wert('12', 'n'));
    expect(D.EINTRITT.z(2)).toBe(0);
    expect(D.EINTRITT.z(15)).toBe(0);
    expect(D.EINTRITT.n(15)).toBe(0);
    for (const p of punkte(2, 15, 26)) expect(D.EINTRITT.dz(p)).toBeCloseTo(richardson(D.EINTRITT.z, p), 4);
  });
  it('Aufgabe 13: Kabel, Minimum gegen das Raster, Randwerte 39 und 5√73, Pythagoras', () => {
    const m = extremum(D.KABEL.z, 0, 8, false);
    expect(m.x).toBeCloseTo(wert('13', 'x'), 3);
    expect(m.y).toBeCloseTo(wert('13', 'k'), 6);
    expect(D.KABEL.z(0)).toBe(39);
    expect(D.KABEL.z(8)).toBeCloseTo(5 * Math.sqrt(73), 9);
    expect(Math.hypot(3, 2.25)).toBe(3.75);
    for (const x of punkte(0, 8, 32)) {
      expect(D.KABEL.z(x)).toBeCloseTo(5 * Math.hypot(x - 0, 3) + 3 * (8 - x), 9);
      expect(D.KABEL.dz(x)).toBeCloseTo(richardson(D.KABEL.z, x), 4);
    }
    // 25x² = 81 + 9x² hat im Definitionsbereich nur die Lösung 9/4
    expect(Math.sqrt(81 / 16)).toBe(2.25);
  });
  it('Aufgabe 14: Wurfweite 14,4·sin(2α) ist v²·sin(2α)/g für v = 12 und g = 10, Maximum bei 45° gegen das Raster', () => {
    const w = (a: number) => (12 ** 2 / 10) * Math.sin(2 * a);
    for (const a of punkte(0.01, 1.5, 30)) expect(D.WURF.z(a)).toBeCloseTo(w(a), 9);
    // Herleitung: Nullstelle von tan(α)·x − 5/(v² cos²α)·x² bei x = v² tan α cos²α / 5
    for (const a of punkte(0.05, 1.5, 29)) {
      const f = (x: number) => Math.tan(a) * x - (5 / (12 ** 2 * Math.cos(a) ** 2)) * x * x;
      const x2 = (12 ** 2 * Math.tan(a) * Math.cos(a) ** 2) / 5;
      expect(f(x2)).toBeCloseTo(0, 9);
      expect(x2).toBeCloseTo(D.WURF.z(a), 9);
    }
    const m = extremum(D.WURF.z, 1e-6, Math.PI / 2 - 1e-6, true);
    expect((m.x * 180) / Math.PI).toBeCloseTo(wert('14', 'a'), 3);
    expect(m.y).toBeCloseTo(wert('14', 'w'), 6);
    for (const a of punkte(0.05, 1.5, 29)) expect(D.WURF.dz(a)).toBeCloseTo(richardson(D.WURF.z, a), 4);
  });
  it('Aufgabe 15: Kegel mit der Mantellinie 12, Maximum gegen das Raster, r² + h² = 144, exakt 128√3·π', () => {
    const v = (r: number) => (Math.PI / 3) * r * r * Math.sqrt(144 - r * r);
    const m = extremum(v, 0, 12, true);
    expect(m.x).toBeCloseTo(wert('15', 'r'), 3);
    expect(m.y).toBeCloseTo(wert('15', 'v'), 5);
    expect(wert('15', 'r') ** 2 + wert('15', 'h') ** 2).toBeCloseTo(144, 9);
    expect(wert('15', 'r') ** 2).toBeCloseTo(96, 9);
    expect(wert('15', 'v')).toBeCloseTo(128 * Math.sqrt(3) * Math.PI, 9);
    for (const r of punkte(0.5, 11.5, 22)) expect(D.KEGEL.dz(r)).toBeCloseTo(richardson(D.KEGEL.z, r), 3);
    expect(v(0)).toBe(0);
    expect(v(12)).toBe(0);
  });
});

describe('Schaubilder', () => {
  const alle = Object.entries(B).filter(([, v]) => typeof v === 'object' && v !== null && 'kurven' in (v as object)) as [string, MessbildDaten][];
  const hindernisse = (b: MessbildDaten): Hindernis[] => [
    ...b.kurven.map((k): Hindernis => ({ f: k.f, ...(k.von !== undefined ? { von: k.von } : {}), ...(k.bis !== undefined ? { bis: k.bis } : {}) })),
    ...(b.strecken ?? [])
      .filter((s) => s.von[0] !== s.bis[0] && s.von[1] !== 0)
      .map((s): Hindernis => ({ f: (x) => s.von[1] + ((s.bis[1] - s.von[1]) / (s.bis[0] - s.von[0])) * (x - s.von[0]), von: Math.min(s.von[0], s.bis[0]), bis: Math.max(s.von[0], s.bis[0]) })),
    // senkrechte Strecken sind in diesem Modul ebenfalls Hindernisse
    ...(b.strecken ?? [])
      .filter((s) => s.von[0] === s.bis[0])
      .flatMap((s) => Array.from({ length: 25 }, (_, i): Hindernis => ({ f: () => s.von[1] + ((s.bis[1] - s.von[1]) * i) / 24, von: s.von[0] - 1e-9, bis: s.von[0] + 1e-9 }))),
  ];

  it('es gibt alle Schaubilder, jedes mit Beschreibung, Punkte liegen im Ausschnitt und auf einer Kurve oder an einer Ecke einer Strecke', () => {
    expect(alle.length).toBeGreaterThanOrEqual(38);
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
  it('Beschreibungen nennen alle markierten Punkte, Zielfunktionen nennen Hochpunkt, Tiefpunkt bzw. Randpunkt', () => {
    for (const [name, b] of alle) {
      if (!b.punkte?.length) continue;
      expect(b.beschreibung, name).toContain('Markiert sind');
      for (const p of b.punkte) if (p.offen) expect(b.beschreibung, name).toContain('(offen)');
    }
    expect(B.BILD_SCHACHTEL_ZIEL.beschreibung).toContain('Hochpunkt H');
    expect(B.BILD_DOSE_ZIEL.beschreibung).toContain('Tiefpunkt T');
    expect(B.BILD_RAND_ZIEL.beschreibung).toContain('Randpunkt R');
  });
  it('Beschriftungen liegen nie auf einem Schaubild oder einer Strecke, nicht unter der x-Achse und nahe der y-Achse rechts davon', () => {
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
    expect(zahl).toBeGreaterThan(80);
  });
  it('Farben: Zielfunktion orange, Geraden blau gestrichelt, Skizzen blau, Bruchkante und Ufer schwarz', () => {
    for (const [name, b] of alle) {
      const durchgezogen = b.kurven.filter((k) => !k.gestrichelt);
      for (const k of durchgezogen) expect(k.farbe, name).toBe(ORANGE);
      for (const k of b.kurven.filter((x) => x.gestrichelt)) expect(k.farbe, name).toBe(BLAU);
      for (const s of b.strecken ?? []) expect([BLAU, SCHWARZ], name).toContain(s.farbe);
    }
    expect(B.BILD_GLAS_SKIZZE.strecken!.filter((s) => s.farbe === SCHWARZ && s.gestrichelt)).toHaveLength(1);
    expect(B.BILD_GLAS_SKIZZE.strecken!.filter((s) => s.farbe === BLAU)).toHaveLength(4);
  });
  it('offene Randpunkte genau dort, wo der Rand nicht zum Definitionsbereich gehört', () => {
    const offen = (b: MessbildDaten) => (b.punkte ?? []).filter((p) => p.offen).map((p) => p.x);
    expect(offen(B.BILD_GEHEGE_ZIEL)).toEqual([0, 30]);
    expect(offen(B.BILD_SCHACHTEL_ZIEL)).toEqual([0, 7.5]);
    expect(offen(B.BILD_PARA_ZIEL)).toEqual([]);
    expect(offen(B.BILD_RAND_ZIEL)).toEqual([]);
    expect(offen(B.BILD_GLAS_ZIEL)).toEqual([]);
    expect(offen(B.BILD_DREIECK_ZIEL)).toEqual([]);
    expect(offen(B.BILD_KABEL_ZIEL)).toEqual([]);
    expect(offen(B.BILD_EINTRITT)).toEqual([]);
    expect(offen(B.BILD_KEGEL)).toEqual([0, 12]);
  });
  it('die Skizzen zeigen Rechtecke, Dreiecke und Strecken mit den Koordinaten der Rechnung', () => {
    // Glasplatte: Rechteck mit P auf der Bruchkante
    const glas = B.BILD_GLAS_LOESUNG;
    expect(glas.punkte![0]!.x).toBeCloseTo(250 / 3, 9);
    expect(glas.punkte![0]!.y).toBeCloseTo(62.5, 9);
    // Parabel: obere Ecken liegen auf der Parabel
    for (const p of B.BILD_PARABEL_A.punkte!.filter((q) => q.text === 'C' || q.text === 'D')) expect(p.y).toBeCloseTo(D.PARABEL.f(p.x), 9);
    // Abstand: die Strecke ist senkrecht und verbindet K_g mit K_f bei u = 1
    const s = B.BILD_ABSTAND_LOESUNG.strecken![0]!;
    expect(s.von[0]).toBe(1);
    expect(s.bis[0]).toBe(1);
    expect(s.von[1]).toBeCloseTo(D.ABSTAND.g(1), 12);
    expect(s.bis[1]).toBeCloseTo(D.ABSTAND.f(1), 12);
    // Kabel: Länge der Strecke AP ist 3,75 bei x = 9/4
    const k = B.BILD_KABEL_LOESUNG.strecken![0]!;
    expect(Math.hypot(k.bis[0] - k.von[0], k.bis[1] - k.von[1])).toBeCloseTo(3.75, 12);
    // Punktabstand: Q liegt auf der Parabel, die Strecke PQ hat die Länge √11/2
    const pq = B.BILD_PUNKT_LOESUNG.strecken![0]!;
    expect(Math.hypot(pq.bis[0] - pq.von[0], pq.bis[1] - pq.von[1])).toBeCloseTo(D.PUNKTABSTAND.d, 12);
    expect(pq.bis[1]).toBeCloseTo(pq.bis[0] ** 2, 12);
    // Gehege: der Zaun hat die Länge 60 (zwei Seiten a und eine Seite b) im Beispielrechteck der Skizze
    expect(2 * D.GEHEGE.skizze.a + D.GEHEGE.skizze.b).toBe(D.GEHEGE.zaun);
  });
});
