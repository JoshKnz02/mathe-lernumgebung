import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import meta from '../content/modules/ich-kann-liste/meta.json';
import { AUSSAGEN, GRUPPEN, K10A, K10B, K10_E, K11, K11_E, K12, K13, K16, K17_E, K2, K5A, K6, K7, K8, MODULE, ABSCHNITT_TITEL } from '../content/modules/ich-kann-liste/daten';
import {
  empfehlung, kontrollSchluessel, kontrollStatus, nachDringlichkeit, zaehle, type Ergebnisse, type Wahl,
} from '../content/modules/ich-kann-liste/auswertung';
import Modul from '../content/modules/ich-kann-liste/index';
import { KontrollenOffenKontext } from '../content/modules/ich-kann-liste/Punkt';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { bewerte } from '../src/lib/eingabe';
import { wertTrig, wert, type SinusParameter } from '../src/lib/sinus';

const PI = Math.PI;

/* ---------- Abfangen der Aufgaben und Auswahlfragen des echten Moduls ---------- */

interface AufgabeAufruf {
  nummer: string;
  felder: { id: string; erwartet: number; toleranz?: number }[];
  hilfen: unknown[];
  loesung: unknown[];
}
interface FrageAufruf {
  nummer: string;
  optionen: { id: string; richtig: boolean }[];
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

const felder = (nummer: string) => {
  const a = aufgaben.find((x) => x.nummer === nummer);
  if (!a) throw new Error(`Aufgabe ${nummer} nicht gefunden`);
  return Object.fromEntries(a.felder.map((f) => [f.id, f])) as Record<string, { erwartet: number; toleranz?: number }>;
};
const erwartet = (nummer: string, id: string) => felder(nummer)[id]!.erwartet;

/** Unabhängige Suche nach Stellen mit f(x) = k durch Vorzeichenwechsel und Bisektion. */
function stellen(f: (x: number) => number, k: number, von: number, bis: number, n = 200000): number[] {
  const g = (x: number) => f(x) - k;
  const h = (bis - von) / n;
  const r: number[] = [];
  let xa = von;
  let fa = g(xa);
  for (let i = 1; i <= n; i++) {
    const xb = von + i * h;
    const fb = g(xb);
    if (fb === 0) {
      r.push(xb);
    } else if (fa * fb < 0) {
      let lo = xa;
      let hi = xb;
      for (let j = 0; j < 80; j++) {
        const m = (lo + hi) / 2;
        if (g(lo) * g(m) <= 0) hi = m;
        else lo = m;
      }
      r.push((lo + hi) / 2);
    }
    xa = xb;
    fa = fb;
  }
  return r;
}
const ableitung = (f: (x: number) => number) => (x: number) => (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;
const cos = (p: SinusParameter) => (x: number) => wertTrig(p, x, 'cos');
const sin = (p: SinusParameter) => (x: number) => wert(p, x);
const grad = (x: number) => (x * 180) / PI;

describe('Aussagen und Verweise', () => {
  it('alle IDs und Nummern sind eindeutig, die Nummern entsprechen der Liste der Lehrkraft und den Ergänzungen 14 bis 17', () => {
    expect(new Set(AUSSAGEN.map((a) => a.id)).size).toBe(AUSSAGEN.length);
    expect(new Set(AUSSAGEN.map((a) => a.nr)).size).toBe(AUSSAGEN.length);
    expect(AUSSAGEN.map((a) => a.nr).sort()).toEqual(['!', '1', '10', '11', '12', '13', '14', '15', '16', '17', '2', '3', '4', '5', '6', '7', '8', '9']);
    expect(AUSSAGEN.filter((a) => a.ergaenzt).map((a) => a.nr).sort()).toEqual(['14', '15', '16', '17']);
  });
  it('jede Aussage gehört zu einer Gruppe, jede Gruppe hat Aussagen', () => {
    const gruppen = new Set(GRUPPEN.map((g) => g.id));
    for (const a of AUSSAGEN) expect(gruppen.has(a.gruppe)).toBe(true);
    for (const g of GRUPPEN) expect(AUSSAGEN.some((a) => a.gruppe === g.id)).toBe(true);
  });
  it('Verweise zeigen auf vorhandene Module und Abschnitte, deren Titel stimmen', () => {
    for (const a of AUSSAGEN) {
      expect(a.verweise.length).toBeGreaterThan(0);
      for (const v of a.verweise) {
        const m = JSON.parse(readFileSync(`content/modules/${v.modul}/meta.json`, 'utf8')) as { id: string; abschnitte: { id: string; titel: string }[] };
        expect(m.id).toBe(v.modul);
        const abschnitt = m.abschnitte.find((x) => x.id === v.abschnitt);
        expect(abschnitt, `${a.nr}: ${v.modul}/${v.abschnitt}`).toBeDefined();
        expect(ABSCHNITT_TITEL[v.abschnitt]).toBe(abschnitt!.titel);
        expect(Object.keys(MODULE)).toContain(v.modul);
      }
    }
  });
  it('Bildungsplan: alle Teile BPE 10.1 bis 10.6 sind abgedeckt', () => {
    const bpe = new Set(AUSSAGEN.flatMap((a) => a.bpe));
    for (const b of ['10.1', '10.2', '10.3', '10.4', '10.5', '10.6']) expect(bpe.has(b)).toBe(true);
    expect(meta.bpe).toEqual(['10.1', '10.2', '10.3', '10.4', '10.5', '10.6']);
  });
});

describe('Metadaten', () => {
  it('ist ein Entwurf mit den sechs Abschnitten, die zum Modul passen', () => {
    expect(meta.id).toBe('ich-kann-liste');
    expect(meta.status).toBe('entwurf');
    expect(meta.thema).toBe('trigonometrische-funktionen');
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['anleitung', 'einheitskreis', 'schaubild', 'gleichungen', 'anwendungen', 'auswertung']);
    const html = rendern(null);
    for (const a of meta.abschnitte) expect(html).toContain(`data-abschnitt="${a.id}"`);
  });
  it('zeigt jeweils nur den gewählten Abschnitt', () => {
    for (const a of meta.abschnitte) {
      const html = rendern(a.id);
      expect(html).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(html).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
});

describe('Darstellung', () => {
  it('rendert ohne Formelfehler und ohne Gedankenstriche', () => {
    const html = rendern(null);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    expect(html).not.toContain(' – ');
    expect(html).not.toContain(' — ');
    expect(html).not.toContain('–');
    expect(html).not.toContain('—');
  });
  it('jede Aussage erscheint mit Nummer, Einschätzung (drei Stufen) und Verweisen', () => {
    const html = rendern(null);
    expect(html.match(/class="ik-punkt"/g)).toHaveLength(AUSSAGEN.length);
    expect(html.match(/data-wahl="offen"/g)).toHaveLength(AUSSAGEN.length);
    expect(html.match(/type="radio"/g)?.length).toBeGreaterThanOrEqual(AUSSAGEN.length * 3);
    for (const a of AUSSAGEN) expect(html).toContain(`Ich kann ${a.text}`.replace('&', '&amp;'));
  });
  it('die vier Ergänzungen sind als ergänzt gekennzeichnet, Aussagen der Lehrkraft nicht', () => {
    const html = rendern(null);
    expect(html.match(/Ergänzt nach dem Bildungsplan/g)).toHaveLength(4);
  });
  it('ohne Klick sind die Kontrollaufgaben nicht erzeugt, mit Schalter sind alle da', () => {
    rendern(null, false);
    expect(aufgaben).toHaveLength(0);
    expect(fragen).toHaveLength(0);
    rendern(null, true);
    // 14 Aufgaben mit Zahleneingaben und 4 Auswahlfragen, zusammen 18 Kontrollen für 17 Aussagen (Aussage 5 hat zwei Teile)
    expect(aufgaben.map((a) => a.nummer).sort()).toEqual(['K1', 'K10', 'K11', 'K12', 'K13', 'K16', 'K2', 'K3', 'K4', 'K5a', 'K6', 'K7', 'K8', 'K9'].sort());
    expect(fragen.map((q) => q.nummer).sort()).toEqual(['K14', 'K15', 'K17', 'K5b']);
  });
  it('jede Aussage mit Kontrollaufgabe hat die passenden Teile, die Transferaussage hat keine', () => {
    rendern(null);
    const nummern = [...aufgaben.map((a) => a.nummer), ...fragen.map((q) => q.nummer)];
    for (const a of AUSSAGEN) {
      if (a.nr === '!') {
        expect(a.teile).toEqual([]);
        continue;
      }
      for (const teil of a.teile) {
        const erwartetNr = a.teile.length === 1 ? `K${a.nr}` : `K${a.nr}${teil}`;
        expect(nummern, `Aussage ${a.nr}`).toContain(erwartetNr);
      }
    }
  });
  it('alle Aufgaben haben Hilfen und einen schrittweisen Lösungsweg', () => {
    rendern(null);
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(2);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(2);
    }
  });
  it('jede Auswahlfrage hat genau eine richtige Antwort, nicht immer an derselben Stelle', () => {
    rendern(null);
    const stellenRichtig = fragen.map((q) => {
      expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
      expect(q.optionen.length).toBe(4);
      return q.optionen.findIndex((o) => o.richtig);
    });
    expect(new Set(stellenRichtig).size).toBeGreaterThan(1);
  });
  it('jedes Schaubild hat eine nicht leere Textalternative (Quelltext), Zeichenbretter entstehen erst im Browser', () => {
    const quelle = readFileSync('content/modules/ich-kann-liste/index.tsx', 'utf8');
    const anzahl = (quelle.match(/<(Kontrollbild|Einheitskreis)\b/g) ?? []).length;
    const beschreibungen = [...quelle.matchAll(/\n\s+beschreibung=(\{`([^`]*)`\}|"([^"]*)")/g)].map((m) => m[2] ?? m[3] ?? '');
    expect(anzahl).toBeGreaterThanOrEqual(22);
    expect(beschreibungen.length).toBe(anzahl);
    for (const b of beschreibungen) expect(b.length, b.slice(0, 60)).toBeGreaterThan(40);
  });
});

describe('Aufgabenwerte: Grundlagen (K1 bis K4)', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('K1: Sinus und Kosinus gegen Referenzwerte', () => {
    expect(erwartet('K1', 'a')).toBeCloseTo(0.7660444431, 8);
    expect(erwartet('K1', 'b')).toBeCloseTo(0.6427876097, 8);
    expect(erwartet('K1', 'c')).toBeCloseTo(0.5, 12);
    expect(erwartet('K1', 'd')).toBeCloseTo(-0.8660254038, 8);
    // Probe: sin² + cos² = 1 für beide Winkel
    expect(erwartet('K1', 'a') ** 2 + erwartet('K1', 'b') ** 2).toBeCloseTo(1, 12);
    expect(erwartet('K1', 'c') ** 2 + erwartet('K1', 'd') ** 2).toBeCloseTo(1, 12);
  });
  it('K2: Winkel in [0°; 360°[ erfüllen die Gleichungen und sind die einzigen', () => {
    const sinus = ['a1', 'a2'].map((id) => erwartet('K2', id));
    const kosinus = ['b1', 'b2'].map((id) => erwartet('K2', id));
    expect(sinus[0]).toBeCloseTo(36.8699, 3);
    expect(sinus[1]).toBeCloseTo(143.1301, 3);
    expect(kosinus[0]).toBeCloseTo(107.4576, 3);
    expect(kosinus[1]).toBeCloseTo(252.5424, 3);
    for (const w of sinus) expect(Math.sin((w * PI) / 180)).toBeCloseTo(0.6, 10);
    for (const w of kosinus) expect(Math.cos((w * PI) / 180)).toBeCloseTo(-0.3, 10);
    const gefundenSin = stellen((x) => Math.sin(x), 0.6, 0, 2 * PI).map(grad);
    const gefundenCos = stellen((x) => Math.cos(x), -0.3, 0, 2 * PI).map(grad);
    expect(gefundenSin).toEqual(sinus.map((w) => expect.closeTo(w, 4)));
    expect(gefundenCos).toEqual(kosinus.map((w) => expect.closeTo(w, 4)));
    expect(K2.toleranz).toBeLessThan(0.1);
  });
  it('K3: Umrechnung stimmt in beide Richtungen', () => {
    expect(erwartet('K3', 'a')).toBeCloseTo((105 / 180) * PI, 12);
    expect(erwartet('K3', 'a')).toBeCloseTo((7 * PI) / 12, 12);
    expect(erwartet('K3', 'b')).toBeCloseTo(100, 10);
    expect(Math.sin((105 * PI) / 180)).toBeCloseTo(Math.sin(erwartet('K3', 'a')), 12);
  });
  it('K4: zweiter Tiefpunkt und Nullstellen im offenen Intervall', () => {
    expect(erwartet('K4', 'x')).toBeCloseTo((7 * PI) / 2, 12);
    expect(erwartet('K4', 'y')).toBe(-1);
    expect(Math.sin(erwartet('K4', 'x'))).toBeCloseTo(-1, 12);
    // Tiefpunkte der Sinusfunktion rechts von 0: Stellen mit sin = -1 sind 3π/2 und 7π/2 (zweiter)
    const tiefpunkte = [3 * PI / 2, 7 * PI / 2];
    expect(erwartet('K4', 'x')).toBe(tiefpunkte[1]);
    // Nullstellen im offenen Intervall ]0; 3π[ durch Vorzeichenwechsel, ohne Randwerte
    const nullstellen = stellen(Math.sin, 0, 1e-4, 3 * PI - 1e-4);
    expect(nullstellen).toHaveLength(2);
    expect(erwartet('K4', 'n')).toBe(nullstellen.length);
  });
});

describe('Aufgabenwerte: Schaubild und Term (K5a bis K8)', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('K5a: Parameter passen zu Hochpunkt, Tiefpunkt und Periode des Schaubilds', () => {
    const p: SinusParameter = { a: erwartet('K5a', 'a'), b: erwartet('K5a', 'b'), c: erwartet('K5a', 'c'), d: erwartet('K5a', 'd') };
    const f = cos(p);
    expect(f(1)).toBeCloseTo(3, 12);
    expect(f(3)).toBeCloseTo(-1, 12);
    expect(f(5)).toBeCloseTo(3, 12);
    expect(f(1 + 4)).toBeCloseTo(f(1), 12);
    expect(p.a).toBeGreaterThan(0);
    expect(p.b).toBeGreaterThan(0);
    expect(p.c).toBeGreaterThanOrEqual(0);
    expect(p.c).toBeLessThan((2 * PI) / p.b);
    expect(felder('K5a').b!.toleranz).toBeLessThanOrEqual(0.01);
    expect(K5A).toEqual({ a: 2, b: PI / 2, c: 1, d: 1 });
  });
  it('K6: Amplitude, Periode, kleinster und größter Wert über Abtastung', () => {
    const f = sin(K6.p);
    let min = Infinity;
    let max = -Infinity;
    for (let x = 0; x <= 6; x += 1e-4) {
      min = Math.min(min, f(x));
      max = Math.max(max, f(x));
    }
    expect(erwartet('K6', 'min')).toBeCloseTo(min, 6);
    expect(erwartet('K6', 'max')).toBeCloseTo(max, 6);
    expect(erwartet('K6', 'a')).toBeCloseTo((max - min) / 2, 6);
    expect(erwartet('K6', 'p')).toBeCloseTo(6, 12);
    expect(f(0.3 + 6)).toBeCloseTo(f(0.3), 10);
    expect(f(0.3 + 3)).not.toBeCloseTo(f(0.3), 3);
  });
  it('K7: markante Punkte rechts der y-Achse über Ableitung und Funktionswerte', () => {
    const f = cos(K7.p);
    const d = ableitung(f);
    const hx = erwartet('K7', 'hx');
    const tx = erwartet('K7', 'tx');
    const wx = erwartet('K7', 'wx');
    expect([hx, tx, wx]).toEqual([2.5, 0.5, 1.5]);
    expect(d(hx)).toBeCloseTo(0, 5);
    expect(d(tx)).toBeCloseTo(0, 5);
    expect(f(hx)).toBeCloseTo(erwartet('K7', 'hy'), 10);
    expect(f(tx)).toBeCloseTo(erwartet('K7', 'ty'), 10);
    expect(f(wx)).toBeCloseTo(erwartet('K7', 'wy'), 10);
    expect(erwartet('K7', 'hy')).toBeGreaterThan(erwartet('K7', 'ty'));
    // Wendepunkt: Ableitung hat bei wx ein Extremum
    const dd = ableitung(d);
    expect(dd(wx)).toBeCloseTo(0, 4);
    // keine anderen Extremstellen rechts der y-Achse vor dem Hochpunkt
    const extremstellen = stellen(d, 0, 1e-3, 3).sort((p, q) => p - q);
    expect(extremstellen).toEqual([expect.closeTo(tx, 4), expect.closeTo(hx, 4)]);
    // Stellen links der y-Achse liegen nicht rechts: der Wendepunkt bei -0,5 und der Hochpunkt bei -1,5 zählen nicht
    expect(f(-1.5)).toBeCloseTo(erwartet('K7', 'hy'), 10);
    expect(f(-0.5)).toBeCloseTo(erwartet('K7', 'wy'), 10);
  });
  it('K8: Symmetrieachse und Symmetriezentrum rechnerisch geprüft', () => {
    const f = sin(K8.p);
    const achse = erwartet('K8', 'achse');
    const zx = erwartet('K8', 'zx');
    const zy = erwartet('K8', 'zy');
    for (const h of [0.1, 0.4, 0.9, 1.3]) {
      expect(f(achse + h)).toBeCloseTo(f(achse - h), 10); // Achsensymmetrie
      expect(f(zx + h) + f(zx - h)).toBeCloseTo(2 * zy, 10); // Punktsymmetrie
    }
    const d = ableitung(f);
    expect(d(achse)).toBeCloseTo(0, 5);
    expect(achse).toBeGreaterThan(0);
    expect(zx).toBeGreaterThan(0);
    // kleinste positive Extremstelle und kleinste positive Wendestelle
    const extrem = stellen(d, 0, 1e-3, 6)[0]!;
    const wende = stellen(f, K8.p.d, 1e-3, 6)[0]!;
    expect(achse).toBeCloseTo(extrem, 4);
    expect(zx).toBeCloseTo(wende, 4);
    expect(zy).toBeCloseTo(3, 12);
  });
});

describe('Aufgabenwerte: Gleichungen (K9 bis K16)', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('K9: exakte Lösungen erfüllen die Gleichungen und es ist die einzige im Intervall [0; π/2]', () => {
    const a = erwartet('K9', 'a');
    const b = erwartet('K9', 'b');
    expect(a).toBeCloseTo(PI / 3, 14);
    expect(b).toBeCloseTo(PI / 4, 14);
    expect(2 * Math.sin(a) - Math.sqrt(3)).toBeCloseTo(0, 12);
    expect(6 * Math.cos(b) - 3 * Math.sqrt(2)).toBeCloseTo(0, 12);
    expect(stellen((x) => 2 * Math.sin(x) - Math.sqrt(3), 0, 1e-6, PI / 2 - 1e-6)).toHaveLength(1);
    expect(stellen((x) => 6 * Math.cos(x) - 3 * Math.sqrt(2), 0, 1e-6, PI / 2 - 1e-6)).toHaveLength(1);
    // Exakt: nur Vielfache von π zählen (keine Toleranz)
    expect(felder('K9').a!.toleranz).toBeUndefined();
    expect(bewerte([{ id: 'a', erwartet: a }], { a: 'pi/3' }).a).toBe('richtig');
    expect(bewerte([{ id: 'a', erwartet: a }], { a: '1,05' }).a).toBe('falsch');
  });
  it('K10: Lösungen gegen unabhängige Nullstellensuche, auch Randfälle des Intervalls', () => {
    const a = stellen((x) => 5 * Math.cos(x) + 1, 4, -1, 6);
    const b = stellen((x) => 8 * Math.sin(x) + 1, 6, 0, 7);
    expect(a).toHaveLength(3);
    expect(b).toHaveLength(3);
    const ids = ['a1', 'a2', 'a3'] as const;
    ids.forEach((id, i) => expect(erwartet('K10', id)).toBeCloseTo(a[i]!, 6));
    (['b1', 'b2', 'b3'] as const).forEach((id, i) => expect(erwartet('K10', id)).toBeCloseTo(b[i]!, 6));
    // dritte Lösung bei a liegt knapp unter 6, bei b knapp unter 7, die nächste ist jeweils außerhalb
    expect(a[2]!).toBeLessThan(6);
    expect(a[2]! + 0.5).toBeGreaterThan(5.8);
    expect(a[1]! + 2 * PI).toBeGreaterThan(6);
    expect(a[0]! + 2 * PI).toBeCloseTo(a[2]!, 10);
    expect(a[0]! - 2 * PI).toBeLessThan(-1);
    expect(b[2]!).toBeLessThan(7);
    expect(b[1]! + 2 * PI).toBeGreaterThan(7);
    expect(K10A.intervall).toEqual([-1, 6]);
    expect(K10B.intervall).toEqual([0, 7]);
    expect(K10_E.a).toHaveLength(3);
    expect(K10_E.b).toHaveLength(3);
    // aufsteigend und innerhalb der Toleranz 0,01 auch bei Rundung auf zwei Stellen
    for (const id of [...ids, 'b1', 'b2', 'b3'] as const) {
      const v = erwartet('K10', id);
      expect(bewerte([{ id: 'x', erwartet: v, toleranz: felder('K10')[id]!.toleranz }], { x: String(Math.round(v * 100) / 100) }).x).toBe('richtig');
    }
  });
  it('K11: Substitution z = 3(x − 0,5), drei Lösungen, gegen unabhängige Suche und Periode', () => {
    const f = (x: number) => 4 * Math.sin(3 * (x - 0.5)) + 1;
    const gefunden = stellen(f, 3, 0, 3);
    expect(gefunden).toHaveLength(3);
    (['x1', 'x2', 'x3'] as const).forEach((id, i) => expect(erwartet('K11', id)).toBeCloseTo(gefunden[i]!, 6));
    expect(erwartet('K11', 'x3')).toBeCloseTo(erwartet('K11', 'x1') + (2 * PI) / 3, 10);
    expect(K11.intervall).toEqual([0, 3]);
    expect(K11_E.s).toBe(0.5);
    // Lösungen außerhalb des Intervalls: x2 + p > 3, x1 − p < 0
    expect(erwartet('K11', 'x2') + (2 * PI) / 3).toBeGreaterThan(3);
    expect(erwartet('K11', 'x1') - (2 * PI) / 3).toBeLessThan(0);
  });
  it('K16: Anzahl der Lösungen von 0 = t · sin x + 3 in [0; 2π] (Berührstelle bei t = 3 eingeschlossen)', () => {
    const anzahl = (t: number) => {
      const f = (x: number) => t * Math.sin(x) + 3;
      const schnitt = stellen(f, 0, 0, 2 * PI).length;
      // Berührung ohne Vorzeichenwechsel: Minimum von f ist genau 0
      let min = Infinity;
      let xmin = 0;
      for (let x = 0; x <= 2 * PI; x += 1e-4) if (f(x) < min) { min = f(x); xmin = x; }
      const beruehrt = Math.abs(min) < 1e-6 && schnitt === 0 ? 1 : 0;
      void xmin;
      return schnitt + beruehrt;
    };
    expect([2, 3, 5].map(anzahl)).toEqual([0, 1, 2]);
    expect(erwartet('K16', 't2')).toBe(0);
    expect(erwartet('K16', 't3')).toBe(1);
    expect(erwartet('K16', 't5')).toBe(2);
    expect(K16.anzahl).toEqual([0, 1, 2]);
  });
});

describe('Aufgabenwerte: Anwendungen (K12, K13, K17)', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('K12: Modell passt zu Tabelle, Extremwerten und Periode', () => {
    const p: SinusParameter = { a: erwartet('K12', 'a'), b: erwartet('K12', 'b'), c: erwartet('K12', 'c'), d: erwartet('K12', 'd') };
    const f = cos(p);
    expect(p).toEqual(K12);
    expect(f(8)).toBeCloseTo(4.6, 12);
    expect(f(2)).toBeCloseTo(1.8, 12);
    expect(f(8 + 12)).toBeCloseTo(f(8), 12);
    // Tabelle: Monatswerte auf eine Dezimale gerundet
    const tabelle = Array.from({ length: 12 }, (_, i) => Math.round(f(i + 1) * 10) / 10);
    expect(tabelle).toEqual([2, 1.8, 2, 2.5, 3.2, 3.9, 4.4, 4.6, 4.4, 3.9, 3.2, 2.5]);
    expect(Math.max(...tabelle)).toBe(4.6);
    expect(Math.min(...tabelle)).toBe(1.8);
    expect(p.a).toBeGreaterThan(0);
    expect(p.c).toBeGreaterThanOrEqual(0);
    expect(p.c).toBeLessThan(12);
  });
  it('K13: Wasserstand bei 4,5 und Zeitraum über 4 m gegen unabhängige Nullstellensuche', () => {
    const f = cos(K12);
    expect(erwartet('K13', 'w')).toBeCloseTo(f(4.5), 10);
    expect(erwartet('K13', 'w')).toBeCloseTo(2.8377, 3);
    const grenzen = stellen(f, 4, 0, 12);
    expect(grenzen).toHaveLength(2);
    expect(erwartet('K13', 'x1')).toBeCloseTo(grenzen[0]!, 6);
    expect(erwartet('K13', 'x2')).toBeCloseTo(grenzen[1]!, 6);
    // dazwischen über 4, außerhalb darunter
    expect(f((grenzen[0]! + grenzen[1]!) / 2)).toBeGreaterThan(4);
    expect(f(grenzen[0]! - 0.05)).toBeLessThan(4);
    expect(f(grenzen[1]! + 0.05)).toBeLessThan(4);
    expect(K13.dauer).toBeCloseTo(grenzen[1]! - grenzen[0]!, 6);
    expect(K13.s).toBeCloseTo(0.8 / 1.4, 12);
  });
  it('K17: Riesenrad, Periode 8 min, höchster Punkt 45 m, Start bei 5 m, Durchmesser 40 m', () => {
    expect(K17_E.periode).toBeCloseTo(8, 12);
    expect(K17_E.hoechste).toBeCloseTo(45, 12);
    expect(K17_E.tiefste).toBeCloseTo(5, 12);
    expect(K17_E.durchmesser).toBeCloseTo(40, 12);
    expect(K17_E.mitte).toBe(25);
    const h = (t: number) => -20 * Math.cos((PI / 4) * t) + 25;
    expect(h(0)).toBeCloseTo(5, 12);
    expect(h(4)).toBeCloseTo(45, 12);
    expect(h(8)).toBeCloseTo(5, 12);
    let max = -Infinity;
    for (let t = 0; t <= 8; t += 1e-3) max = Math.max(max, h(t));
    expect(max).toBeCloseTo(45, 4);
  });
});

describe('Auswertung', () => {
  const a = (id: string) => AUSSAGEN.find((x) => x.id === id)!;
  it('kontrollStatus: keine, offen, teilweise, richtig, falsch', () => {
    const lage = a('lage-ablesen');
    const einfach = a('bogenmass');
    const ohne = a('komplex');
    expect(kontrollStatus(ohne, {})).toBe('keine');
    expect(kontrollStatus(einfach, {})).toBe('offen');
    expect(kontrollStatus(einfach, { [kontrollSchluessel('bogenmass', '1')]: true })).toBe('richtig');
    expect(kontrollStatus(einfach, { [kontrollSchluessel('bogenmass', '1')]: false })).toBe('falsch');
    expect(kontrollStatus(lage, { [kontrollSchluessel('lage-ablesen', 'a')]: true })).toBe('teilweise');
    expect(kontrollStatus(lage, { [kontrollSchluessel('lage-ablesen', 'a')]: true, [kontrollSchluessel('lage-ablesen', 'b')]: true })).toBe('richtig');
    expect(kontrollStatus(lage, { [kontrollSchluessel('lage-ablesen', 'a')]: true, [kontrollSchluessel('lage-ablesen', 'b')]: false })).toBe('falsch');
    expect(kontrollStatus(lage, { [kontrollSchluessel('lage-ablesen', 'a')]: false })).toBe('falsch');
  });
  it('Empfehlung nach Einschätzung und Kontrollaufgabe', () => {
    expect(empfehlung(undefined, 'offen')).toBe('einschaetzen');
    expect(empfehlung('noch-nicht', 'richtig')).toBe('zuerst');
    expect(empfehlung('ueben', 'offen')).toBe('ueben');
    expect(empfehlung('sicher', 'falsch')).toBe('pruefen');
    expect(empfehlung('sicher', 'richtig')).toBe('gut');
    expect(empfehlung('sicher', 'offen')).toBe('gut');
    expect(empfehlung('sicher', 'keine')).toBe('gut');
  });
  it('Sortierung nach Dringlichkeit und Zählung', () => {
    const wahl: Record<string, Wahl> = { bogenmass: 'ueben', 'wert-einheitskreis': 'noch-nicht', symmetrie: 'sicher', komplex: 'sicher', substitution: 'sicher' };
    const ergebnisse: Ergebnisse = { [kontrollSchluessel('symmetrie', '1')]: false, [kontrollSchluessel('substitution', '1')]: true };
    const liste = nachDringlichkeit(AUSSAGEN, wahl, ergebnisse);
    expect(liste).toHaveLength(AUSSAGEN.length);
    const ids = liste.map((x) => x.aussage.id);
    expect(ids.slice(0, 3)).toEqual(['wert-einheitskreis', 'bogenmass', 'symmetrie']);
    expect(liste[0]!.empfehlung).toBe('zuerst');
    expect(liste[1]!.empfehlung).toBe('ueben');
    expect(liste[2]!.empfehlung).toBe('pruefen');
    // danach folgen die noch nicht eingeschätzten in der Reihenfolge der Liste, zuletzt die guten
    const rang = liste.map((x) => x.empfehlung);
    expect(rang.lastIndexOf('einschaetzen')).toBeLessThan(rang.indexOf('gut'));
    expect(ids.slice(-2).sort()).toEqual(['komplex', 'substitution']);
    expect(zaehle(AUSSAGEN, wahl)).toEqual({ sicher: 3, ueben: 1, 'noch-nicht': 1, offen: AUSSAGEN.length - 5 });
  });
  it('die Auswertung ist im Abschnitt ohne Eingaben leer und bleibt lesbar', () => {
    const html = rendern('auswertung');
    expect(html).toContain('Noch nichts eingeschätzt');
    expect(html).toContain('Eingeschätzt: <strong>0</strong>');
    expect(html.match(/data-empfehlung="einschaetzen"/g)).toHaveLength(AUSSAGEN.length);
  });
});
