import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ABSCHNITT_TITEL, AUSSAGEN, GRUPPEN, MODULE } from '../content/modules/ich-kann-liste-vektorgeometrie/daten';
import { BILD_K1, BILD_K3, BILD_K32 } from '../content/modules/ich-kann-liste-vektorgeometrie/Bilder';
import Modul from '../content/modules/ich-kann-liste-vektorgeometrie/index';
import meta from '../content/modules/ich-kann-liste-vektorgeometrie/meta.json';
import * as W from '../content/modules/ich-kann-liste-vektorgeometrie/werte';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { KontrollenOffenKontext } from '../src/components/IchKann';
import { bewerte } from '../src/lib/eingabe';
import { ebenenParameter, koordinatenformAusPunkt, liegtInEbene, liegtInKoordinatenform, type Ebene, type Koordinatenform } from '../src/lib/ebene';
import { dreiecksflaeche, viereck } from '../src/lib/figuren';
import { geradeAusPunkten, abstandPunktGerade, lageZweier, liegtAuf, schnittwinkel, spurpunkte, winkelKoordinatenebene, type Gerade } from '../src/lib/gerade';
import { geradenprobe, senkrechtZurEbene } from '../src/lib/geradeebene';
import { bildpunkt, spiegle } from '../src/lib/schraegbild';
import { lageImKoordinatensystem, koordinatenformAusAchsenabschnitten, spurgerade, spurpunkteEbene } from '../src/lib/spur';
import { abstandEbenen, abstandGeradeEbene, abstandPunktEbene, spiegelpunkt } from '../src/lib/abstandebene';
import { abstand, betrag, differenz, einheitsvektor, kollinear, mittelpunkt, orthogonal, skalarprodukt, summe, teilpunkt, vektorprodukt, vielfaches, winkel, type Vek } from '../src/lib/vektor';
import { lageEbenen } from '../src/lib/zweiebenen';

vi.setConfig({ testTimeout: 60000 });

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
const ORDNER = 'content/modules/ich-kann-liste-vektorgeometrie';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const wert = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!.erwartet;
const werte = (nr: string, ids: string[]) => ids.map((i) => wert(nr, i));
const frage = (nr: string) => fragen.find((q) => q.nummer === nr)!;
const richtigeOption = (nr: string) => frage(nr).optionen.find((o) => o.richtig)!.id;
const nahe = (a: number[], b: number[], eps = 1e-9) => a.length === b.length && a.every((x, i) => Math.abs(x - b[i]!) <= eps);
const ggT = (x: number, y: number): number => (y === 0 ? Math.abs(x) : ggT(y, x % y));
const teilerfremd = (v: number[]) => v.every(Number.isInteger) && v.reduce((s, x) => ggT(s, x), 0) === 1;
const ebene = (o: { p: Vek; u: Vek; v: Vek }): Ebene => o;
const g = (o: { p: Vek; u: Vek }): Gerade => o;
const rund1 = (x: number) => Math.round(x * 10) / 10;
/** Unabhängig: Determinante (Spatprodukt) aus drei Vektoren. */
const det = (a: Vek, b: Vek, c: Vek) => a[0]! * (b[1]! * c[2]! - b[2]! * c[1]!) - a[1]! * (b[0]! * c[2]! - b[2]! * c[0]!) + a[2]! * (b[0]! * c[1]! - b[1]! * c[0]!);
/** Unabhängig: Abstand eines Punktes von der Geraden durch Minimieren über t (Raster und Verfeinerung). */
function minAbstand(gg: Gerade, q: Vek): { t: number; d: number } {
  const f = (t: number) => abstand(q, gg.p.map((c, i) => c + t * gg.u[i]!));
  let lo = -50;
  let hi = 50;
  for (let i = 0; i < 200; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (f(m1) < f(m2)) hi = m2;
    else lo = m1;
  }
  return { t: (lo + hi) / 2, d: f((lo + hi) / 2) };
}

describe('Aussagen und Verweise', () => {
  it('IDs und Nummern sind eindeutig: 1 bis 47 und „!“, ergänzt sind 40 bis 47, Vertiefung sind 17 und 46, „!“ ohne Kontrollaufgabe', () => {
    expect(new Set(AUSSAGEN.map((a) => a.id)).size).toBe(AUSSAGEN.length);
    expect(new Set(AUSSAGEN.map((a) => a.nr)).size).toBe(AUSSAGEN.length);
    expect(AUSSAGEN.map((a) => a.nr).sort()).toEqual([...Array.from({ length: 47 }, (_, i) => String(i + 1)), '!'].sort());
    expect(AUSSAGEN.filter((a) => a.ergaenzt).map((a) => Number(a.nr)).sort((x, y) => x - y)).toEqual([40, 41, 42, 43, 44, 45, 46, 47]);
    expect(AUSSAGEN.filter((a) => a.vertiefung).map((a) => a.nr).sort()).toEqual(['17', '46']);
    expect(AUSSAGEN.find((a) => a.nr === '!')!.teile).toEqual([]);
    for (const a of AUSSAGEN) {
      expect(a.text, a.nr).toMatch(/\.$/);
      expect(a.text, a.nr).not.toMatch(/[–—]/);
      expect(a.verweise.length, a.nr).toBeGreaterThan(0);
      if (a.nr !== '!') expect(a.teile.length, a.nr).toBeGreaterThan(0);
    }
  });
  it('die Aussagen der Lehrkraft stehen in der Reihenfolge ihrer Liste, die ergänzten dazwischen', () => {
    const lehrkraft = AUSSAGEN.filter((a) => !a.ergaenzt).map((a) => a.nr);
    expect(lehrkraft).toEqual([...Array.from({ length: 39 }, (_, i) => String(i + 1)), '!']);
  });
  it('jede Aussage gehört zu einem der drei Bereiche, jeder Bereich ist ein Abschnitt des Moduls mit derselben ID und dem Titel des Unterbereichs', () => {
    const abschnitte = meta.abschnitte.map((a) => a.id);
    const themen = JSON.parse(readFileSync('content/themen.json', 'utf8')) as { themen: { id: string; unterbereiche?: { id: string; titel: string }[] }[] };
    const unter = themen.themen.find((x) => x.id === 'vektorgeometrie')!.unterbereiche!;
    expect(GRUPPEN.map((x) => x.id)).toEqual(unter.map((x) => x.id));
    for (const gr of GRUPPEN) {
      expect(abschnitte).toContain(gr.id);
      expect(meta.abschnitte.find((a) => a.id === gr.id)!.titel).toBe(gr.titel);
      expect(unter.find((u) => u.id === gr.id)!.titel).toBe(gr.titel);
      expect(AUSSAGEN.some((a) => a.gruppe === gr.id), gr.id).toBe(true);
    }
    for (const a of AUSSAGEN) expect(GRUPPEN.map((x) => x.id) as string[], a.nr).toContain(a.gruppe);
  });
  it('Verweise zeigen nur auf vorhandene Module und Abschnitte, deren Titel stimmen (auch bei gleichen Abschnitts-IDs mit verschiedenen Titeln)', () => {
    for (const a of AUSSAGEN) {
      for (const v of a.verweise) {
        const m = JSON.parse(readFileSync(`content/modules/${v.modul}/meta.json`, 'utf8')) as { titel: string; thema: string; abschnitte: { id: string; titel: string }[] };
        expect(m.thema, `${a.nr}: ${v.modul}`).toBe('vektorgeometrie');
        expect(MODULE[v.modul], `${a.nr}: ${v.modul}`).toBe(m.titel);
        const ab = m.abschnitte.find((x) => x.id === v.abschnitt);
        expect(ab, `${a.nr}: ${v.modul}/${v.abschnitt}`).toBeDefined();
        expect(ABSCHNITT_TITEL[`${v.modul}/${v.abschnitt}`] ?? ABSCHNITT_TITEL[v.abschnitt], `${a.nr}: ${v.modul}/${v.abschnitt}`).toBe(ab!.titel);
      }
    }
    // Jedes Modul der Tabelle wird auch verwendet und es sind alle 24 Module der drei Unterbereiche außer dem Modul zu den Modellierungsaufgaben der Geraden
    const benutzt = new Set(AUSSAGEN.flatMap((a) => a.verweise.map((v) => v.modul)));
    for (const id of Object.keys(MODULE)) expect(benutzt.has(id), id).toBe(true);
  });
  it('Bildungsplan: alle BPE des Moduls (7, 8.1 und 16) sind durch Aussagen abgedeckt, die Aussagen nennen nur diese BPE', () => {
    const bpe = new Set(AUSSAGEN.flatMap((a) => a.bpe));
    for (const b of meta.bpe) expect(bpe.has(b), b).toBe(true);
    for (const b of bpe) expect(meta.bpe, b).toContain(b);
    expect(AUSSAGEN.find((a) => a.nr === '47')!.bpe).toEqual(['8.1']);
  });
  it('jedes freigegebene Modul des Themenbereichs Vektorgeometrie, das Kontrollstoff liefert, wird mindestens einmal verlinkt (ohne die Module zum Modellieren der Geraden)', () => {
    const ordner = readdirSync('content/modules').filter((d) => (JSON.parse(readFileSync(`content/modules/${d}/meta.json`, 'utf8')) as { thema: string }).thema === 'vektorgeometrie' && d !== 'ich-kann-liste-vektorgeometrie');
    const benutzt = new Set(AUSSAGEN.flatMap((a) => a.verweise.map((v) => v.modul)));
    expect(ordner.filter((d) => !benutzt.has(d))).toEqual(['modellieren-geraden']);
  });
});

describe('Metadaten und Darstellung', () => {
  it('ist ein Modul des Themenbereichs Vektorgeometrie ohne Unterbereich (Abschluss) mit fünf Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('ich-kann-liste-vektorgeometrie');
    expect(meta.thema).toBe('vektorgeometrie');
    expect((meta as { unterbereich?: string }).unterbereich).toBeUndefined();
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['anleitung', 'vektoren', 'geraden', 'ebenen', 'auswertung']);
    for (const a of meta.abschnitte) {
      const html = rendern(a.id);
      expect(html).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(html).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('solange es ein Entwurf ist, steht es in keinem Kurs', () => {
    if (meta.status !== 'entwurf') return;
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"ich-kann-liste-vektorgeometrie"');
  });
  it('rendert ohne Formelfehler, ohne Gedankenstriche und ohne „Graph“, nennt Vektorprodukt immer mit (Kreuzprodukt)', () => {
    const html = rendern(null);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(html).not.toContain(z);
    expect(html).not.toMatch(/Graph(?!ik)/);
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    expect(text.match(/.{0,30}Vektorprodukts?(?![a-zäöüß])(?! \(Kreuzprodukt\)).{0,20}/g) ?? []).toEqual([]);
    for (const d of readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts'))) {
      const q = readFileSync(`${ORDNER}/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
    }
  });
  it('jede Aussage erscheint mit Nummer, drei Stufen der Einschätzung und Verweisen, die ergänzten und die Vertiefungen sind gekennzeichnet', () => {
    const html = rendern(null, false);
    for (const a of AUSSAGEN) expect(html, a.nr).toContain(`<span class="ik-nr">${a.nr}</span> Ich kann`);
    expect((html.match(/<strong>\+\+<\/strong>/g) ?? []).length).toBe(AUSSAGEN.length);
    expect((html.match(/Ergänzt nach dem Bildungsplan/g) ?? []).length).toBe(8);
    expect((html.match(/Vertiefung, nicht im Bildungsplan/g) ?? []).length).toBe(2);
    expect(aufgaben).toHaveLength(0);
    expect(fragen).toHaveLength(0);
  });
  it('die Kontrollaufgaben passen zu den Teilen jeder Aussage (K<Nr> oder K<Nr>a, K<Nr>b)', () => {
    rendern(null);
    const alle = [...aufgaben.map((a) => a.nummer), ...fragen.map((q) => q.nummer)];
    const erwartet = AUSSAGEN.flatMap((a) => (a.teile.length === 0 ? [] : a.teile.length === 1 ? [`K${a.nr}`] : a.teile.map((x) => `K${a.nr}${x}`)));
    expect([...alle].sort()).toEqual([...erwartet].sort());
    expect(alle.length).toBe(61);
    expect(new Set(alle).size).toBe(alle.length);
  });
  it('Hilfen, Lösungswege, Beschriftungen, Antworten und Erklärungen rendern ohne Formelfehler, ohne Gedankenstriche und ohne Brüche wie 1/2', () => {
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
      expect(html, name).not.toMatch(/\d\/\d/);
      expect(html, name).not.toMatch(/\bpi\b|\bPi\b/);
    }
  });
  it('jede Aufgabe hat mindestens zwei Hilfen und zwei Lösungsschritte, jede Auswahlfrage genau eine richtige von vier Antworten, die richtige steht nicht immer an derselben Stelle', () => {
    rendern(null);
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(2);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(2);
      expect(a.felder.length, a.nummer).toBeGreaterThanOrEqual(1);
    }
    for (const q of fragen) {
      expect(q.optionen.filter((o) => o.richtig), q.nummer).toHaveLength(1);
      expect(q.optionen, q.nummer).toHaveLength(4);
      for (const o of q.optionen.filter((x) => !x.richtig)) expect(alsText(o.rueckmeldung).replace(/<[^>]*>/g, '').length, `${q.nummer} ${o.id}`).toBeGreaterThan(40);
    }
    const stellen = new Set(fragen.map((q) => q.optionen.findIndex((o) => o.richtig)));
    expect(stellen.size).toBe(4);
    expect(fragen.length).toBe(14);
  });
  it('jeder erwartete Wert wird richtig bewertet, ein falscher nicht', () => {
    rendern(null);
    let zahl = 0;
    for (const a of aufgaben) {
      for (const f of a.felder) {
        zahl++;
        const tol = f.toleranz !== undefined ? { toleranz: f.toleranz } : {};
        const eingabe = (f.toleranz ? f.erwartet.toFixed(2) : String(f.erwartet)).replace('.', ',');
        expect(bewerte([{ id: f.id, erwartet: f.erwartet, ...tol }], { [f.id]: eingabe })[f.id], `${a.nummer} ${f.id} (${eingabe})`).toBe('richtig');
        expect(bewerte([{ id: f.id, erwartet: f.erwartet, ...tol }], { [f.id]: String(f.erwartet + 10) })[f.id], `${a.nummer} ${f.id} falsch`).toBe('falsch');
      }
    }
    expect(zahl).toBeGreaterThan(100);
  });
  it('Felder einer Aufgabe haben eindeutige IDs und Namen, gerundete Werte stimmen mit dem exakten Wert bis auf die Toleranz überein', () => {
    rendern(null);
    for (const a of aufgaben) {
      expect(new Set(a.felder.map((f) => f.id)).size, a.nummer).toBe(a.felder.length);
      for (const f of a.felder) if (f.toleranz !== undefined) expect(f.toleranz, `${a.nummer} ${f.id}`).toBeLessThanOrEqual(0.05);
    }
  });
});

describe('Kontrollaufgaben Vektoren, unabhängig geprüft', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('K1: Quader, Ecken, Vektor FB und Schrägbild (keine Punkte an gleicher Bildstelle, F und G nicht auf der Achse im Bild)', () => {
    const { G, F, B, FB } = W.K1;
    expect(nahe(F, [G[0], 0, G[2]])).toBe(true);
    expect(nahe(B, [0, G[1], 0])).toBe(true);
    expect(nahe(werte('K1', ['f1', 'f2', 'f3']), F)).toBe(true);
    expect(nahe(werte('K1', ['v1', 'v2', 'v3']), FB)).toBe(true);
    expect(nahe(FB, differenz(B, F))).toBe(true);
    const bild = [[0, 0, 0], F, B, G].map((p) => bildpunkt(p as [number, number, number]));
    expect(new Set(bild.map((p) => p.join(','))).size).toBe(4);
    for (const p of [bildpunkt(F), bildpunkt(G)]) {
      expect(p[0]).not.toBe(0);
      expect(p[1]).not.toBe(0);
      expect(p[0]).not.toBe(p[1]);
    }
    expect(BILD_K1.punkte!.map((p) => p.name)).toEqual(['O', 'F', 'B', 'G']);
    expect(BILD_K1.linien!.length).toBe(12 + 1);
    const pfeil = BILD_K1.linien!.find((l) => l.pfeil)!;
    expect(nahe(pfeil.von, F) && nahe(pfeil.bis, B)).toBe(true);
  });
  it('K2: Spiegelungen mit der Bibliothek und von Hand', () => {
    const P = W.K2.P;
    expect(nahe(werte('K2', ['u1', 'u2', 'u3']), spiegle(P as [number, number, number], 'o'))).toBe(true);
    expect(nahe(werte('K2', ['a1', 'a2', 'a3']), spiegle(P as [number, number, number], 'a1'))).toBe(true);
    expect(nahe(werte('K2', ['e1', 'e2', 'e3']), spiegle(P as [number, number, number], 'e23'))).toBe(true);
    expect(nahe(werte('K2', ['u1', 'u2', 'u3']), P.map((x) => -x))).toBe(true);
    expect(nahe(werte('K2', ['a1', 'a2', 'a3']), [P[0]!, -P[1]!, -P[2]!])).toBe(true);
    expect(nahe(werte('K2', ['e1', 'e2', 'e3']), [-P[0]!, P[1]!, P[2]!])).toBe(true);
  });
  it('K3: c = 2a − b, das Bild zeigt 2a, dann −b und c, Pfeile schließen aneinander an', () => {
    const { a, b, c } = W.K3;
    expect(nahe(werte('K3', ['c1', 'c2']), c)).toBe(true);
    expect(nahe(c, differenz(vielfaches(2, a), b))).toBe(true);
    const pf = BILD_K3.pfeile!;
    expect(pf).toHaveLength(3);
    expect(nahe([pf[0]!.bis[0], pf[0]!.bis[1]], [pf[1]!.von[0], pf[1]!.von[1]])).toBe(true);
    expect(nahe([pf[1]!.bis[0], pf[1]!.bis[1]], [pf[2]!.bis[0], pf[2]!.bis[1]])).toBe(true);
    expect(nahe([pf[1]!.bis[0] - pf[1]!.von[0], pf[1]!.bis[1] - pf[1]!.von[1]], b.map((x) => -x))).toBe(true);
  });
  it('K4 bis K6: Mittelpunkt, Teilpunkt und Punktspiegelung', () => {
    expect(nahe(werte('K4', ['m1', 'm2', 'm3']), mittelpunkt(W.K4.A, W.K4.B))).toBe(true);
    expect(abstand(W.K4.A, W.K4.M)).toBeCloseTo(abstand(W.K4.M, W.K4.B), 12);
    expect(nahe(werte('K5', ['t1', 't2', 't3']), teilpunkt(W.K5.P, W.K5.Q, 3, 2))).toBe(true);
    expect(abstand(W.K5.P, W.K5.T) / abstand(W.K5.T, W.K5.Q)).toBeCloseTo(3 / 2, 12);
    const A2 = werte('K6', ['s1', 's2', 's3']);
    expect(nahe(A2, W.K6.A.map((x, i) => 2 * W.K6.B[i]! - x))).toBe(true);
    expect(nahe(mittelpunkt(W.K6.A, A2), W.K6.B)).toBe(true);
  });
  it('K7 und K8: Längen sind ganz, der Einheitsvektor hat die Länge 1 und zeigt in dieselbe Richtung', () => {
    expect(wert('K7', 'u')).toBe(betrag(W.K7.u));
    expect(wert('K7', 'v')).toBe(betrag(W.K7.v));
    expect(wert('K7', 'pq')).toBe(abstand(W.K7.P, W.K7.Q));
    expect(Number.isInteger(wert('K7', 'pq'))).toBe(true);
    const e = werte('K8', ['e1', 'e2', 'e3']);
    expect(betrag(e)).toBeCloseTo(1, 12);
    expect(nahe(e, einheitsvektor(W.K8.v))).toBe(true);
    expect(kollinear(e, W.K8.v)).toBe(true);
    expect(betrag(W.K8.v)).toBe(W.K8.betrag);
  });
  it('K9: D liegt auf der Strecke AB im Abstand 14 von A', () => {
    const D = werte('K9', ['d1', 'd2', 'd3']);
    expect(abstand(W.K9.A, D)).toBeCloseTo(W.K9.abstand, 12);
    expect(abstand(W.K9.A, D) + abstand(D, W.K9.B)).toBeCloseTo(abstand(W.K9.A, W.K9.B), 12);
    expect(abstand(W.K9.A, W.K9.B)).toBe(21);
  });
  it('K10 und K11: Skalarprodukt und Winkel (unabhängig über acos und über die Bibliothek)', () => {
    expect(wert('K10', 'sp')).toBe(skalarprodukt(W.K10.u, W.K10.v));
    const { u, v } = W.K11;
    const cos = (u[0]! * v[0]! + u[1]! * v[1]! + u[2]! * v[2]!) / (Math.hypot(...u) * Math.hypot(...v));
    const exakt = (Math.acos(cos) * 180) / Math.PI;
    expect(Math.abs(wert('K11', 'w') - exakt)).toBeLessThanOrEqual(0.05);
    expect(wert('K11', 'w')).toBe(rund1(exakt));
    expect(winkel(u, v)).toBeCloseTo(exakt, 9);
  });
  it('K12: b = r · a, genau ein Kandidat ist orthogonal zu c', () => {
    const r = wert('K12a', 'r');
    expect(nahe(vielfaches(r, W.K12.a), W.K12.b)).toBe(true);
    expect(kollinear(W.K12.a, W.K12.b)).toBe(true);
    const k = W.K12.kandidaten as Record<string, Vek>;
    const orth = Object.keys(k).filter((id) => orthogonal(k[id]!, W.K12.c));
    expect(orth).toEqual([W.K12.richtig]);
    expect(richtigeOption('K12b')).toBe(W.K12.richtig);
  });
  it('K13 und K14: orthogonaler Vektor, Vektorprodukt (Kreuzprodukt) teilerfremd mit positiver erster Koordinate', () => {
    const a = wert('K13', 'a');
    expect(skalarprodukt(W.K13.w(a), W.K13.v)).toBe(0);
    for (const x of [-3, 0, 4, 6]) expect(skalarprodukt(W.K13.w(x), W.K13.v)).not.toBe(0);
    const n = werte('K14', ['n1', 'n2', 'n3']);
    expect(orthogonal(n, W.K14.u)).toBe(true);
    expect(orthogonal(n, W.K14.v)).toBe(true);
    expect(teilerfremd(n)).toBe(true);
    expect(n[0]).toBeGreaterThan(0);
    expect(kollinear(n, vektorprodukt(W.K14.u, W.K14.v))).toBe(true);
    expect(nahe(n, vektorprodukt(W.K14.u, W.K14.v))).toBe(true);
  });
  it('K15: gleichschenkliges Dreieck mit den Seitenlängen, Raute als Bedingung (an einem Beispiel unabhängig bestätigt)', () => {
    const { A, B, C } = W.K15;
    expect(werte('K15a', ['ab', 'ac', 'bc'])).toEqual([abstand(A, B), abstand(A, C), abstand(B, C)]);
    expect(abstand(A, B)).toBe(abstand(A, C));
    expect(abstand(B, C)).not.toBe(abstand(A, B));
    expect(richtigeOption('K15b')).toBe(W.K15.richtig);
    // Raute: AB = DC und |AB| = |AD|; Gegenbeispiele für die anderen Bedingungen
    const raute = viereck([0, 0], [5, 0], [8, 4], [3, 4]);
    expect(raute.art).toBe('raute');
    const rechteck = viereck([0, 0], [4, 0], [4, 2], [0, 2]);
    expect(rechteck.art).toBe('rechteck');
    expect(orthogonal([4, 0], [0, 2])).toBe(true);
    const drachen2 = viereck([0, 0], [2, -1], [6, 0], [2, 1]);
    expect(drachen2.diagonalenSenkrecht).toBe(true);
    expect(drachen2.art).not.toBe('raute');
  });
  it('K16: ABCD ist ein Parallelogramm und D die vierte Ecke', () => {
    const D = werte('K16', ['d1', 'd2', 'd3']);
    const { A, B, C } = W.K16;
    expect(nahe(differenz(B, A), differenz(C, D))).toBe(true);
    expect(nahe(differenz(D, A), differenz(C, B))).toBe(true);
    expect(nahe(D, summe(A, differenz(C, B)))).toBe(true);
    // gleiche Aufgabe in der Ebene mit der Bibliothek (x₃ weggelassen wäre keine Parallelogrammprüfung für den Raum, daher an einem ebenen Beispiel)
    expect(viereck([0, 0], [4, 1], [6, 4], [2, 3]).art).toBe('parallelogramm');
  });
  it('K17: Flächeninhalte über das Vektorprodukt (Kreuzprodukt) und unabhängig über die Heronsche Formel', () => {
    const { A, B, C } = W.K17;
    const k = vektorprodukt(differenz(B, A), differenz(C, A));
    expect(nahe(k, W.K17.kreuz)).toBe(true);
    expect(wert('K17', 'para')).toBe(betrag(k));
    expect(wert('K17', 'dreieck')).toBe(betrag(k) / 2);
    const a = abstand(B, C);
    const b = abstand(A, C);
    const c = abstand(A, B);
    const s = (a + b + c) / 2;
    expect(wert('K17', 'dreieck')).toBeCloseTo(Math.sqrt(s * (s - a) * (s - b) * (s - c)), 9);
    expect(dreiecksflaeche(A, B, C)).toBeCloseTo(4.5, 9);
  });
});

describe('Kontrollaufgaben Geraden, unabhängig geprüft', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('K18: Richtungsvektor PQ, h parallel zu g durch R, S auf h mit x₂ = 5', () => {
    const { P, Q, R } = W.K18;
    const u = werte('K18', ['u1', 'u2', 'u3']);
    expect(nahe(u, differenz(Q, P))).toBe(true);
    expect(nahe(geradeAusPunkten(P, Q).u, u)).toBe(true);
    const h = g({ p: R, u });
    const S = [wert('K18', 'sa'), 5, wert('K18', 'sb')];
    expect(liegtAuf(h, S)).toBe(true);
    expect(lageZweier(g({ p: P, u }), h).art).toBe('parallel');
  });
  it('K19: Punktprobe mit der Bibliothek, nur ein Punkt liegt auf g, a = 1', () => {
    const gg = g({ p: W.K19.p, u: W.K19.u });
    const pts = W.K19.punkte as Record<string, Vek>;
    expect(Object.keys(pts).filter((id) => liegtAuf(gg, pts[id]!))).toEqual([W.K19.richtig]);
    expect(richtigeOption('K19a')).toBe(W.K19.richtig);
    const a = wert('K19b', 'a');
    expect(liegtAuf(gg, W.K19.R(a))).toBe(true);
    for (const x of [-2, 0, 2, 5]) expect(liegtAuf(gg, W.K19.R(x))).toBe(false);
  });
  it('K20: genau die Gerade g₁ ist parallel zur x₁x₃-Ebene, aber nicht in ihr', () => {
    const geraden = W.K20.geraden as Record<string, { p: Vek; u: Vek }>;
    const treffer = Object.keys(geraden).filter((id) => geraden[id]!.u[1] === 0 && geraden[id]!.p[1] !== 0);
    expect(treffer).toEqual([W.K20.richtig]);
    expect(richtigeOption('K20')).toBe(W.K20.richtig);
    expect(lageImKoordinatensystem).toBeDefined();
  });
  it('K21: Spurpunkte mit der Bibliothek und durch Einsetzen', () => {
    const gg = g({ p: W.K21.p, u: W.K21.u });
    const sp = spurpunkte(gg);
    const s12 = sp.find((s) => s.ebene === 'e12')!.punkt;
    const s13 = sp.find((s) => s.ebene === 'e13')!.punkt;
    const s23 = sp.find((s) => s.ebene === 'e23')!.punkt;
    expect(nahe([wert('K21', 's12a'), wert('K21', 's12b'), 0], s12)).toBe(true);
    expect(nahe([wert('K21', 's13a'), 0, wert('K21', 's13b')], s13)).toBe(true);
    expect(nahe([0, wert('K21', 's23a'), wert('K21', 's23b')], s23)).toBe(true);
    for (const s of [s12, s13, s23]) expect(liegtAuf(gg, s)).toBe(true);
  });
  it('K22: a) windschief (Gleichungssystem ohne Lösung), b) Schnittpunkt liegt auf beiden Geraden', () => {
    const a = W.K22.a;
    expect(lageZweier(g(a.g), g(a.h)).art).toBe('windschief');
    expect(richtigeOption('K22a')).toBe(a.richtig === 'windschief' ? frage('K22a').optionen.find((o) => alsText(o.text).includes('windschief'))!.id : '');
    const b = W.K22.b;
    const S = werte('K22b', ['s1', 's2', 's3']);
    expect(lageZweier(g(b.g), g(b.h)).art).toBe('schneidend');
    expect(liegtAuf(g(b.g), S)).toBe(true);
    expect(liegtAuf(g(b.h), S)).toBe(true);
    expect(nahe(S, b.S)).toBe(true);
  });
  it('K40: nur für a = −8 ist h parallel zu g, und zwar echt parallel', () => {
    const a = wert('K40', 'a');
    for (let x = -20; x <= 20; x++) {
      const h = g({ p: [0, 1, 3], u: W.K40.h.u(x) });
      expect(kollinear(W.K40.g.u, h.u), `a=${x}`).toBe(x === a);
    }
    expect(lageZweier(g(W.K40.g), g({ p: [0, 1, 3], u: W.K40.h.u(a) })).art).toBe('parallel');
  });
  it('K23: Abstand und Lotfußpunkt mit der Bibliothek und durch unabhängige Minimierung', () => {
    const gg = g({ p: W.K23.p, u: W.K23.u });
    expect(wert('K23', 'd')).toBeCloseTo(abstandPunktGerade(gg, W.K23.Q), 9);
    const m = minAbstand(gg, W.K23.Q);
    expect(wert('K23', 'd')).toBeCloseTo(m.d, 6);
    expect(m.t).toBeCloseTo(W.K23.t, 6);
    expect(nahe(gg.p.map((c, i) => c + W.K23.t * gg.u[i]!), W.K23.F)).toBe(true);
    expect(orthogonal(differenz(W.K23.Q, W.K23.F), gg.u)).toBe(true);
  });
  it('K24: Schnittwinkel (spitz) mit der Bibliothek und unabhängig', () => {
    const { u, v } = { u: W.K24.g.u, v: W.K24.h.u };
    const exakt = (Math.acos(Math.abs(skalarprodukt(u, v)) / (betrag(u) * betrag(v))) * 180) / Math.PI;
    expect(Math.abs(wert('K24', 'w') - exakt)).toBeLessThanOrEqual(0.05);
    expect(wert('K24', 'w')).toBe(rund1(exakt));
    expect(schnittwinkel(u, v)).toBeCloseTo(exakt, 9);
    expect(lageZweier(g(W.K24.g), g(W.K24.h)).art).toBe('windschief');
    // Die Geraden schneiden sich laut Aufgabentext: Kontrolle, dass das auch stimmt
  });
  it('K25: Winkel zwischen Gerade und Koordinatenebenen mit der Bibliothek und über den Sinus', () => {
    const u = W.K25.g.u;
    const sin = (i: number) => (Math.asin(Math.abs(u[i]!) / betrag(u)) * 180) / Math.PI;
    for (const [id, ebeneId, i] of [['w12', 'e12', 2], ['w13', 'e13', 1], ['w23', 'e23', 0]] as const) {
      expect(Math.abs(wert('K25', id) - sin(i)), id).toBeLessThanOrEqual(0.05);
      expect(wert('K25', id), id).toBe(rund1(sin(i)));
      expect(winkelKoordinatenebene(u, ebeneId)).toBeCloseTo(sin(i), 9);
    }
  });
});

describe('Kontrollaufgaben Ebenen, unabhängig geprüft', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('K26: nur die richtige Parameterform enthält A, B und C, K26b: zweiter Spannvektor führt zu P', () => {
    const { A, B, C } = W.K26;
    const o = W.K26.optionen as Record<string, { p: Vek; u: Vek; v: Vek }>;
    const alleDrei = (e: Ebene) => [A, B, C].every((p) => liegtInEbene(e, p));
    expect(Object.keys(o).filter((id) => alleDrei(ebene(o[id]!)))).toEqual([W.K26.richtig]);
    expect(richtigeOption('K26a')).toBe(W.K26.richtig);
    // unabhängig: A, B, C erfüllen n · x = d mit n = (AB × AC)
    const n = vektorprodukt(differenz(B, A), differenz(C, A));
    const k = koordinatenformAusPunkt(A, n);
    for (const p of [A, B, C]) expect(liegtInKoordinatenform(k, p)).toBe(true);
    for (const id of ['b', 'c', 'd']) expect(!(liegtInKoordinatenform(k, summe(o[id]!.p, o[id]!.u)) && liegtInKoordinatenform(k, summe(o[id]!.p, o[id]!.v)) && liegtInKoordinatenform(k, o[id]!.p)), id).toBe(true);
    const v = werte('K26b', ['v1', 'v2', 'v3']);
    expect(nahe(v, differenz(W.K26.P, W.K26.g.p))).toBe(true);
    const e = ebene({ p: W.K26.g.p, u: W.K26.g.u, v });
    expect(liegtInEbene(e, W.K26.P)).toBe(true);
    expect(kollinear(W.K26.g.u, v)).toBe(false);
  });
  it('K27: Koordinatenform aus Punkt und Normalenvektor und aus drei Punkten (teilerfremd, n₁ > 0)', () => {
    const a = W.K27.a;
    expect(wert('K27a', 'd')).toBe(skalarprodukt(a.n, a.P));
    const b = W.K27.b;
    const n = werte('K27b', ['n1', 'n2', 'n3']);
    const d = wert('K27b', 'd');
    for (const p of [b.A, b.B, b.C]) expect(skalarprodukt(n, p)).toBe(d);
    expect(teilerfremd(n)).toBe(true);
    expect(n[0]).toBeGreaterThan(0);
    expect(kollinear(n, vektorprodukt(differenz(b.B, b.A), differenz(b.C, b.A)))).toBe(true);
  });
  it('K41: Achsenabschnittsform mit der Bibliothek und durch Einsetzen der Spurpunkte', () => {
    const n = werte('K41', ['n1', 'n2', 'n3']);
    const { a, b, c } = W.K41;
    const k = koordinatenformAusAchsenabschnitten(a, b, c);
    expect(nahe(n, k.n)).toBe(true);
    expect(k.d).toBe(12);
    expect(nahe(n, W.K41.n)).toBe(true);
    for (const [i, s] of [[0, a], [1, b], [2, c]] as const) {
      const p = [0, 0, 0];
      p[i] = s;
      expect(skalarprodukt(n, p)).toBe(12);
    }
    expect(spurpunkteEbene({ n, d: 12 }).map((s) => s.punkt)).toEqual([[a, 0, 0], [0, b, 0], [0, 0, c]]);
  });
  it('K28: Parameterform in Koordinatenform (Normalenvektor mit der Bibliothek), Koordinatenform in Parameterform (nur eine Option)', () => {
    const a = W.K28.a;
    const n = [wert('K28a', 'n1'), wert('K28a', 'n2'), 1];
    const d = wert('K28a', 'd');
    for (const p of [a.p, summe(a.p, a.u), summe(a.p, a.v), summe(summe(a.p, a.u), a.v)]) expect(skalarprodukt(n, p)).toBe(d);
    expect(kollinear(n, vektorprodukt(a.u, a.v))).toBe(true);
    const b = W.K28.b;
    const o = b.optionen as Record<string, { p: Vek; u: Vek; v: Vek }>;
    const gueltig = (e: { p: Vek; u: Vek; v: Vek }) => skalarprodukt(b.k.n, e.p) === b.k.d && orthogonal(b.k.n, e.u) && orthogonal(b.k.n, e.v) && !kollinear(e.u, e.v);
    expect(Object.keys(o).filter((id) => gueltig(o[id]!))).toEqual([b.richtig]);
    expect(richtigeOption('K28b')).toBe(b.richtig);
  });
  it('K29: P liegt in E (Einsetzen), nicht in F (Parameter)', () => {
    expect(liegtInKoordinatenform(koordinatenformAusPunkt([0, 0, 0], [0, 0, 0]), [0, 0, 0])).toBe(true);
    expect(liegtInKoordinatenform(W.K29.E, W.K29.P)).toBe(true);
    expect(liegtInEbene(ebene(W.K29.F), W.K29.P)).toBe(false);
    expect(ebenenParameter(ebene(W.K29.F), W.K29.P)).toBeNull();
    expect(alsText(frage('K29').optionen.find((o) => o.richtig)!.text)).toContain('nur in');
    expect(richtigeOption('K29')).toBe('a');
  });
  it('K30: r und s mit der Bibliothek, im Parallelogramm (0 ≤ r, s ≤ 1), aber nicht im Dreieck (r + s > 1)', () => {
    const e = ebene({ p: W.K30.A, u: differenz(W.K30.B, W.K30.A), v: differenz(W.K30.C, W.K30.A) });
    const rs = ebenenParameter(e, W.K30.P)!;
    expect(wert('K30a', 'r')).toBeCloseTo(rs.r, 9);
    expect(wert('K30a', 's')).toBeCloseTo(rs.s, 9);
    expect(rs.r >= 0 && rs.r <= 1 && rs.s >= 0 && rs.s <= 1).toBe(true);
    expect(rs.r + rs.s).toBeGreaterThan(1);
    expect(frage('K30b').optionen.find((o) => o.richtig)!.id).toBe(richtigeOption('K30b'));
    expect(alsText(frage('K30b').optionen.find((o) => o.richtig)!.text)).toContain('im Parallelogramm, aber nicht im Dreieck');
  });
  it('K31 und K42: Spurpunkte und Spurgerade mit der Bibliothek', () => {
    const s = spurpunkteEbene(W.K31.k).map((x) => x.punkt);
    expect(nahe([wert('K31', 's1'), 0, 0], s[0]!)).toBe(true);
    expect(nahe([0, wert('K31', 's2'), 0], s[1]!)).toBe(true);
    expect(nahe([0, 0, wert('K31', 's3')], s[2]!)).toBe(true);
    const sg = spurgerade(W.K42.k, 'e12');
    expect(sg.art).toBe('gerade');
    if (sg.art === 'gerade') {
      const u = [wert('K42', 'u1'), wert('K42', 'u2'), 0];
      expect(kollinear(u, sg.g.u)).toBe(true);
      expect(teilerfremd(u)).toBe(true);
      expect(u[0]).toBeGreaterThan(0);
      expect(skalarprodukt(W.K42.k.n, u)).toBe(0);
    }
  });
  it('K32: Spurpunkte der Ebene G, Bild und Auswahl', () => {
    const s = spurpunkteEbene(W.K32.k).map((x) => x.punkt);
    expect(nahe(s[0]!, W.K32.S1) && nahe(s[1]!, W.K32.S2) && nahe(s[2]!, W.K32.S3)).toBe(true);
    for (const p of [W.K32.S1, W.K32.S2, W.K32.S3]) expect(skalarprodukt(W.K32.k.n, p)).toBe(W.K32.k.d);
    expect(BILD_K32.flaechen![0]!.ecken).toEqual([W.K32.S1, W.K32.S2, W.K32.S3]);
    expect(BILD_K32.linien!.map((l) => [l.von, l.bis])).toEqual([[W.K32.S1, W.K32.S2], [W.K32.S1, W.K32.S3], [W.K32.S2, W.K32.S3]]);
    const bild = [W.K32.S1, W.K32.S2, W.K32.S3].map((p) => bildpunkt(p).join(','));
    expect(new Set(bild).size).toBe(3);
    expect(richtigeOption('K32')).toBe(W.K32.richtig);
    // Spurgeraden verbinden je zwei Spurpunkte
    for (const [ebeneId, i, j] of [['e12', 0, 1], ['e13', 0, 2], ['e23', 1, 2]] as const) {
      const sg = spurgerade(W.K32.k, ebeneId);
      expect(sg.art).toBe('gerade');
      if (sg.art === 'gerade') {
        const punkte = [W.K32.S1, W.K32.S2, W.K32.S3];
        expect(liegtAuf(sg.g, punkte[i]!) && liegtAuf(sg.g, punkte[j]!)).toBe(true);
      }
    }
  });
  it('K33: genau eine Ebene enthält die x₃-Achse (n₃ = 0 und d = 0)', () => {
    const e = W.K33.ebenen as Record<string, Koordinatenform>;
    const treffer = Object.keys(e).filter((id) => e[id]!.n[2] === 0 && e[id]!.d === 0);
    expect(treffer).toEqual([W.K33.richtig]);
    expect(richtigeOption('K33')).toBe(W.K33.richtig);
    const l = lageImKoordinatensystem(e[W.K33.richtig]!);
    expect(l.art).toBe('ursprungAchse');
    for (const id of Object.keys(e).filter((x) => x !== W.K33.richtig)) expect(lageImKoordinatensystem(e[id]!).art, id).not.toBe('ursprungAchse');
  });
  it('K34: Durchstoßpunkt mit der Geradenprobe, echt parallele Gerade', () => {
    const a = W.K34.a;
    const r = geradenprobe(g(a), W.K34.k);
    expect(r.art).toBe('schneidet');
    expect(nahe(werte('K34a', ['s1', 's2', 's3']), r.punkt!)).toBe(true);
    expect(r.t).toBe(a.t);
    expect(liegtInKoordinatenform(W.K34.k, r.punkt!)).toBe(true);
    expect(geradenprobe(g(W.K34.b), W.K34.k).art).toBe('parallel');
    expect(alsText(frage('K34b').optionen.find((o) => o.richtig)!.text)).toContain('echt parallel');
    expect(senkrechtZurEbene(g(W.K34.b), W.K34.k)).toBe(false);
  });
  it('K43: nur für a = 2 steht g senkrecht auf E, Durchstoßpunkt mit der Geradenprobe', () => {
    const a = wert('K43', 'a');
    for (let x = -10; x <= 10; x++) expect(senkrechtZurEbene(g({ p: W.K43.p, u: W.K43.u(x) }), W.K43.k), `a=${x}`).toBe(x === a);
    const r = geradenprobe(g({ p: W.K43.p, u: W.K43.u(a) }), W.K43.k);
    expect(r.art).toBe('schneidet');
    expect(r.t).toBe(W.K43.t);
    expect(nahe(werte('K43', ['s1', 's2', 's3']), r.punkt!)).toBe(true);
  });
  it('K44: nur für a = 5 ist g parallel zu E, und zwar echt parallel', () => {
    const a = wert('K44', 'a');
    for (let x = -10; x <= 10; x++) expect(geradenprobe(g({ p: W.K44.p, u: W.K44.u(x) }), W.K44.k).art, `a=${x}`).toBe(x === a ? 'parallel' : 'schneidet');
  });
  it('K35: a) schneiden sich, b) parallel nur für k = −6 und echt parallel', () => {
    expect(lageEbenen(W.K35.a.E, W.K35.a.F)).toBe('schneiden');
    expect(alsText(frage('K35a').optionen.find((o) => o.richtig)!.text)).toContain('schneiden sich in einer Geraden');
    const k = wert('K35b', 'k');
    for (let x = -12; x <= 12; x++) expect(lageEbenen(W.K35.b.E(x), W.K35.b.F) === 'schneiden', `k=${x}`).toBe(x !== k);
    expect(lageEbenen(W.K35.b.E(k), W.K35.b.F)).toBe('parallel');
  });
  it('K36: Abstand und Lotfußpunkt (Bibliothek), unabhängig über die Länge des Lots und gerundeter Abstand für R', () => {
    const r = abstandPunktEbene(W.K36.k, W.K36.Q);
    expect(wert('K36a', 'd')).toBeCloseTo(r.d, 9);
    expect(nahe(werte('K36a', ['f1', 'f2', 'f3']), r.F)).toBe(true);
    expect(liegtInKoordinatenform(W.K36.k, r.F)).toBe(true);
    expect(orthogonal(differenz(W.K36.Q, r.F), [1, 0, 0].map(() => 0).concat([]).length ? vektorprodukt(vektorprodukt(W.K36.k.n, [1, 0, 0]), W.K36.k.n) : [0, 0, 0])).toBe(true);
    expect(abstand(W.K36.Q, r.F)).toBeCloseTo(wert('K36a', 'd'), 9);
    const exakt = Math.abs(skalarprodukt(W.K36.k.n, W.K36.R) - W.K36.k.d) / betrag(W.K36.k.n);
    expect(Math.abs(wert('K36b', 'd') - exakt)).toBeLessThanOrEqual(W.TOL2);
    expect(abstandPunktEbene(W.K36.k, W.K36.R).d).toBeCloseTo(exakt, 12);
    expect(wert('K36b', 'd')).toBe(Math.round(exakt * 100) / 100);
  });
  it('K37: P liegt in E, Q = P + n liegt auf dem Lot und hat den Abstand 3', () => {
    expect(liegtInKoordinatenform(W.K37.k, W.K37.P)).toBe(true);
    const Q = werte('K37', ['q1', 'q2', 'q3']);
    expect(nahe(Q, summe(W.K37.P, W.K37.k.n))).toBe(true);
    expect(abstandPunktEbene(W.K37.k, Q).d).toBeCloseTo(W.K37.abstand, 12);
    expect(kollinear(differenz(Q, W.K37.P), W.K37.k.n)).toBe(true);
  });
  it('K38: Spiegelpunkt mit der Bibliothek, Lotfußpunkt ist der Mittelpunkt', () => {
    const Q2 = werte('K38', ['s1', 's2', 's3']);
    expect(nahe(Q2, spiegelpunkt(W.K38.k, W.K38.Q))).toBe(true);
    const F = abstandPunktEbene(W.K38.k, W.K38.Q).F;
    expect(nahe(mittelpunkt(W.K38.Q, Q2), F)).toBe(true);
    expect(abstandPunktEbene(W.K38.k, Q2).d).toBeCloseTo(abstandPunktEbene(W.K38.k, W.K38.Q).d, 12);
  });
  it('K45: Abstand paralleler Ebenen und von Gerade und Ebene mit der Bibliothek und unabhängig', () => {
    const a = abstandEbenen(W.K45.a.e1, W.K45.a.e2);
    expect(a.art).toBe('parallel');
    expect(wert('K45a', 'd')).toBeCloseTo(a.d, 9);
    // unabhängig: Punkt der zweiten Ebene (n₂ · x = d₂ mit x = d₂ n₂ / |n₂|²) gegen die erste Ebene
    const n2 = W.K45.a.e2.n;
    const x = n2.map((c) => (c * W.K45.a.e2.d) / skalarprodukt(n2, n2));
    expect(liegtInKoordinatenform(W.K45.a.e2, x)).toBe(true);
    expect(Math.abs(skalarprodukt(W.K45.a.e1.n, x) - W.K45.a.e1.d) / betrag(W.K45.a.e1.n)).toBeCloseTo(wert('K45a', 'd'), 9);
    const b = abstandGeradeEbene(g(W.K45.b.g), W.K45.b.k);
    expect(b.d).toBeCloseTo(wert('K45b', 'd'), 9);
    expect(geradenprobe(g(W.K45.b.g), W.K45.b.k).art).toBe('parallel');
    for (const t of [-3, 0, 2.5]) expect(abstandPunktEbene(W.K45.b.k, W.K45.b.g.p.map((c, i) => c + t * W.K45.b.g.u[i]!)).d).toBeCloseTo(wert('K45b', 'd'), 9);
  });
  it('K39: Rechteck in E, Höhe, Volumen von Quader und Pyramide (unabhängig über das Spatprodukt)', () => {
    const { A, B, C, D, S } = W.K39;
    const ab = differenz(B, A);
    const ad = differenz(D, A);
    expect(orthogonal(ab, ad)).toBe(true);
    expect(nahe(C, summe(B, ad))).toBe(true);
    const k = { n: W.K39.n, d: W.K39.d };
    for (const p of [A, B, C, D]) expect(liegtInKoordinatenform(k, p)).toBe(true);
    expect(betrag(ab) * betrag(ad)).toBe(W.K39.grundflaeche);
    expect(abstandPunktEbene(k, S).d).toBe(W.K39.hoehe);
    const spat = Math.abs(det(ab, ad, differenz(S, A)));
    expect(wert('K39a', 'v')).toBeCloseTo(spat, 9);
    expect(wert('K39b', 'v')).toBeCloseTo(spat / 3, 9);
    expect(wert('K39a', 'v')).toBe(W.K39.grundflaeche * W.K39.hoehe);
    expect(wert('K39b', 'v')).toBe(wert('K39a', 'v') / 3);
  });
  it('K46: Spatprodukt als Determinante, Pyramide ein Drittel', () => {
    const { u, v, w } = W.K46;
    expect(wert('K46', 'spat')).toBe(Math.abs(det(u, v, w)));
    expect(wert('K46', 'spat')).toBe(Math.abs(skalarprodukt(vektorprodukt(u, v), w)));
    expect(Math.abs(wert('K46', 'pyr') - wert('K46', 'spat') / 3)).toBeLessThanOrEqual(W.TOL2);
    expect(wert('K46', 'pyr')).toBe(Math.round((wert('K46', 'spat') / 3) * 100) / 100);
  });
  it('K47: Mittelpunkt von QQ′ liegt in x₁ = x₂, Vertauschen ist die Spiegelung an dieser Ebene (an vielen Punkten bestätigt), K47b hat genau eine richtige Antwort', () => {
    const M = werte('K47a', ['m1', 'm2', 'm3']);
    expect(nahe(M, mittelpunkt(W.K47.Q, W.K47.Q2))).toBe(true);
    expect(M[0]).toBe(M[1]);
    const k: Koordinatenform = { n: [1, -1, 0], d: 0 };
    expect(nahe(spiegelpunkt(k, W.K47.Q), W.K47.Q2)).toBe(true);
    for (let a = -3; a <= 3; a++) for (let b = -3; b <= 3; b++) expect(nahe(spiegelpunkt(k, [a, b, 7]), [b, a, 7]), `${a},${b}`).toBe(true);
    expect(richtigeOption('K47b')).toBe(frage('K47b').optionen.find((o) => alsText(o.text).includes('stützt'))!.id);
  });
});
