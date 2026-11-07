import { existsSync, readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/ebenengleichungen-aufstellen/Bilder';
import * as D from '../content/modules/ebenengleichungen-aufstellen/daten';
import Modul from '../content/modules/ebenengleichungen-aufstellen/index';
import { Geradenlabor, Punktlabor, geradenLaborBild, punktLaborBild } from '../content/modules/ebenengleichungen-aufstellen/Labor';
import meta from '../content/modules/ebenengleichungen-aufstellen/meta.json';
import themen from '../content/themen.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { ebeneAusGeraden, ebeneAusPunktUndGerade, liegtInEbene, type Ebene } from '../src/lib/ebene';
import { lageZweier } from '../src/lib/gerade';
import { RAUM_BEREICH, RAUM_GRENZE, bildpunkt, normiert, raumLagen, sperrlinienRaum, x1ZahlMitte, type RaumBildSpec } from '../src/lib/schraegbild';
import { lageAbstand } from '../src/lib/vektorbild';

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
    return <div data-aufgabe={String(p.nummer)}>{p.children}</div>;
  },
}));
vi.mock('../src/components/Auswahlfrage', () => ({
  Auswahlfrage: (p: FrageAufruf) => {
    fragen.push(p);
    return <div data-frage={p.nummer}>{p.children}</div>;
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
const ORDNER = 'content/modules/ebenengleichungen-aufstellen';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const texteAusHtml = (html: string): string[] => [...html.matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<'));
const texte = (n: ReactNode): string[] => texteAusHtml(alsText(n));
const zahl = (s: string) => Number(s.replace(/\{,\}/g, '.'));
/** Alle Spalten (pmatrix) in einem Knoten, als Zahlenlisten (nur Spalten mit reinen Zahlen). */
const spaltenAus = (n: ReactNode): number[][] =>
  [...texte(n).join(' ').matchAll(/\\begin\{pmatrix\}(.*?)\\end\{pmatrix\}/g)].map((m) => m[1]!.split('\\\\').map(zahl)).filter((s) => s.every((x) => Number.isFinite(x)));
/** Alle Punkte der Form A(1\,|\,−2\,|\,3) in einem Knoten, nach Namen (Punkte ohne Namen unter „_“). */
const punkteAus = (n: ReactNode): Record<string, number[]> => {
  const r: Record<string, number[]> = {};
  for (const m of texte(n).join(' ').matchAll(/([A-Z](?:_\d)?)\(([-\d{},\\|, ]+)\)/g)) {
    const koords = m[2]!.split('\\,|\\,').map(zahl);
    if (koords.every((x) => Number.isFinite(x))) r[m[1]!] = koords;
  }
  return r;
};
const feld = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!;
const wert = (nr: string, id: string) => feld(nr, id).erwartet;

/* Unabhängige Methoden: Vektorprodukt von Hand ausgeschrieben, Punktprobe über n · (x − p) = 0. */
const kreuz = (a: number[], b: number[]): number[] => [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!].map((x) => x + 0);
const skal = (a: number[], b: number[]) => a[0]! * b[0]! + a[1]! * b[1]! + a[2]! * b[2]!;
const diff = (b: number[], a: number[]) => b.map((x, i) => x - a[i]!);
const plus = (a: number[], b: number[]) => a.map((x, i) => x + b[i]!);
const mal = (k: number, v: number[]) => v.map((x) => x * k);
const nullv = (v: number[]) => v.every((x) => x === 0);
const imE = (e: Ebene, x: number[]) => skal(kreuz(e.u, e.v), diff(x, e.p)) === 0;
const keinePlane = (e: Ebene) => nullv(e.u) || nullv(e.v) || nullv(kreuz(e.u, e.v));
const echteEbene = (e: Ebene) => !keinePlane(e);
const gleichE = (e: Ebene, f: Ebene) => echteEbene(e) && echteEbene(f) && nullv(kreuz(kreuz(e.u, e.v), kreuz(f.u, f.v))) && imE(e, f.p);
const nah = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;
const ebeneAus = (spalten: number[][]): Ebene => ({ p: spalten[0]!, u: spalten[1]!, v: spalten[2]! });


/* Unabhängig: zwei Geraden schneiden sich, wenn das Gleichungssystem lösbar ist; hier über Abstandsquadrat der Verbindung und Vektorprodukt der Richtungen. */
const gleichungsArt = (g: { p: number[]; u: number[] }, h: { p: number[]; u: number[] }): string => {
  const n = kreuz(g.u, h.u);
  const pq = diff(h.p, g.p);
  if (nullv(n)) return nullv(kreuz(pq, g.u)) ? 'identisch' : 'parallel';
  return skal(n, pq) === 0 ? 'schneidend' : 'windschief';
};

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Ebenen, hat vier Abschnitte, BPE 16.3', () => {
    expect(meta.id).toBe('ebenengleichungen-aufstellen');
    expect(meta.thema).toBe('vektorgeometrie');
    expect(meta.unterbereich).toBe('ebenen');
    expect(meta.bpe).toEqual(['16.3']);
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung']);
    const thema = themen.themen.find((x) => x.id === meta.thema) as { unterbereiche?: { id: string }[] };
    expect(thema.unterbereiche?.map((u) => u.id)).toContain(meta.unterbereich);
  });
  it('zeigt jeweils nur den gewählten Abschnitt', () => {
    for (const a of meta.abschnitte) {
      const html = rendern(a.id);
      expect(html).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(html).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('solange es ein Entwurf ist, steht es in keinem Kurs', () => {
    if (meta.status !== 'entwurf') return;
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"ebenengleichungen-aufstellen"');
  });
  it('rendert ohne Formelfehler und ohne Gedankenstriche, mit der Fachsprache der Lehrkraft', () => {
    const html = rendern(null);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(html).not.toContain(z);
    for (const d of readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts'))) for (const z of ['–', '—']) expect(readFileSync(`${ORDNER}/${d}`, 'utf8'), d).not.toContain(z);
    for (const wort of ['Stützvektor', 'Stützpunkt', 'Spannvektor', 'Parameter', 'Verbindungsvektor', 'windschief', 'parallel', 'identisch', 'Schnittpunkt']) expect(html, wort).toContain(wort);
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).not.toMatch(/\d\/\d/);
    expect(html).not.toMatch(/\bpi\b|Pi\b/);
    expect(html).not.toMatch(/Skalarmultiplikation/);
  });
  it('nur das Aufstellen aus Punkt und Gerade bzw. zwei Geraden: Normalenvektor, Koordinatenform, Spurpunkte, Abstand und Winkel kommen nicht vor', () => {
    expect(rendern(null)).not.toMatch(/Normalenvektor|Normalenform|Koordinatenform|Achsenabschnitt|Spurpunkt|Spurgerade|Schnittgerade|Durchstoßpunkt|Lotfußpunkt|Abstand|Winkel|Volumen|Vektorprodukt|Kreuzprodukt/);
  });
  it('das Erklären nimmt die Lage zweier Geraden nicht vorweg (Fälle schneidend, parallel, windschief stehen im Entdecken)', () => {
    const text = rendern('erklaeren').replace(/<[^>]*>/g, '');
    for (const wort of ['windschief', 'unendlich viele', 'schneiden sich in einem Punkt', 'sind parallel']) expect(text, wort).not.toContain(wort);
    expect(text).toContain('Entdecken');
  });
  it('verweist auf die Module davor', () => {
    const quelle = readdirSync(ORDNER).filter((x) => x.endsWith('.tsx')).map((d) => readFileSync(`${ORDNER}/${d}`, 'utf8')).join('\n');
    const ids = [...quelle.matchAll(/modul="([a-z0-9-]+)"/g)].map((m) => m[1]!);
    for (const m of ['einfuehrung-ebenen', 'geradengleichung', 'gegenseitige-lage-geraden', 'rechnen-mit-vektoren', 'gauss-algorithmus']) expect(ids, m).toContain(m);
    for (const id of ids) expect(existsSync(`content/modules/${id}/meta.json`), id).toBe(true);
  });
  it('Zeilenumbrüche in Rechnungen nur vor einem Gleichheitszeichen: Fortsetzungen mit {}+ gibt es nur bei Gleichungen (… + r · …, … + s · …)', () => {
    const quelle = readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts')).map((d) => readFileSync(`${ORDNER}/${d}`, 'utf8')).join('\n');
    for (const m of quelle.matchAll(/\{\}([+\-]|\\cdot)(.{0,14})/g)) expect(/^(\$\{[rstk]\}|[rstk])\\{1,2}cdot/.test(m[2]!), m[0]).toBe(true);
    for (const tex of texteAusHtml(rendern(null))) for (const m of tex.matchAll(/\\\\\{\}([+\-]|\\cdot)(.{0,10})/g)) expect(/^[rstk]\\cdot/.test(m[2]!), tex).toBe(true);
  });
  it('die beiden GeoGebra-Applets der Lehrkraft stehen nicht im Modul, die Parameter von h heißen k', () => {
    const html = rendern(null);
    expect(html).not.toContain('geogebra');
    expect(html).toContain('h:');
    expect(texteAusHtml(html).join(' ')).toContain('k\\cdot');
  });
});

describe('Bilder', () => {
  const bilder: [string, RaumBildSpec][] = [['ERKLAEREN', B.RAUM_ERKLAEREN], ['SCHNEIDEND', B.RAUM_SCHNEIDEND], ['PARALLEL', B.RAUM_PARALLEL], ['WINDSCHIEF', B.RAUM_WINDSCHIEF], ['AUFGERADE', B.RAUM_AUF_GERADE], ['A1', B.aufgPunktGerade], ['A3', B.aufgSchnitt], ['A9', B.aufgZeichnen]];
  const zahlenX1 = Array.from({ length: 2 * RAUM_GRENZE + 1 }, (_, i) => i - RAUM_GRENZE).filter((k) => k !== 0).map((k) => normiert(x1ZahlMitte(k)));
  const AXEN: [number, number][] = [[-1, -1], [1, 0], [0, 1]];
  const winkelZu = (a: number[], b: number[]) => (Math.acos(Math.min(1, Math.abs(a[0]! * b[0]! + a[1]! * b[1]!) / (Math.hypot(a[0]!, a[1]!) * Math.hypot(b[0]!, b[1]!)))) * 180) / Math.PI;
  const bildRichtung = (v: number[]) => [v[1]! - v[0]! / 2, v[2]! - v[0]! / 2];
  it('alle Punkte liegen im Koordinatensystem, keiner im Schrägbild auf einer Achse oder an derselben Bildstelle wie ein anderer, jedes Bild hat eine Textalternative', () => {
    for (const [name, s] of bilder) {
      const sichtbar = s.punkte!.filter((p) => !p.ohneText && !p.nurText);
      const bp = sichtbar.map((p) => bildpunkt(p.p));
      for (const [i, p] of sichtbar.entries()) {
        for (const x of p.p) expect(Math.abs(x), `${name} ${p.name}`).toBeLessThanOrEqual(RAUM_GRENZE);
        const [x, y] = bp[i]!;
        expect(x, `${name} ${p.name} x`).not.toBe(0);
        expect(y, `${name} ${p.name} y`).not.toBe(0);
        expect(x, `${name} ${p.name} x=y`).not.toBe(y);
      }
      expect(new Set(bp.map(String)).size, name).toBe(bp.length);
      expect(s.sprech.length, name).toBeGreaterThan(80);
      expect(s.fein).toBe(true);
      for (const l of s.linien!) for (const c of [...l.von, ...l.bis]) expect(Math.abs(c), `${name} Linie`).toBeLessThanOrEqual(RAUM_GRENZE + 1e-9);
    }
  });
  it('jede Beschriftung hat Abstand zu allen Linien, Achsen, Achsenzahlen und anderen Beschriftungen', () => {
    for (const [name, s] of bilder) {
      const lagen = raumLagen(s);
      expect(lagen.length, name).toBe(s.punkte!.filter((p) => !p.ohneText && !p.nurText).length);
      for (const l of lagen) {
        const pt = s.punkte!.find((p) => p.name === l.name)!;
        const andere = [...zahlenX1, ...lagen.filter((x) => x !== l).map((x) => normiert(x.mitte))];
        const d = lageAbstand(l.lage, bildpunkt(pt.p), { bereich: RAUM_BEREICH, teilung: 1, linien: sperrlinienRaum(s.linien), belegt: andere });
        expect(d, `${name} ${l.name}`).toBeGreaterThanOrEqual(0.015);
      }
    }
  });
  it('Geraden erscheinen im Schrägbild nicht als Punkt und nicht parallel zu einem Achsenbild (mindestens 11°, Länge mindestens 1,5), Pfeile mindestens 1,4 lang', () => {
    const geraden = [D.ERKLAEREN.g, D.SCHNEIDEND.g, D.SCHNEIDEND.h, D.PARALLEL.g, D.PARALLEL.h, D.WINDSCHIEF.g, D.WINDSCHIEF.h, D.AUF_GERADE.g, D.A_PUNKT_GERADE.g, D.A_SCHNITT.paar.g, D.A_SCHNITT.paar.h, D.A_ZEICHNEN.paar.g, D.LABOR_G];
    for (const g of geraden) {
      const b = bildRichtung(g.u);
      expect(Math.hypot(b[0]!, b[1]!), `${g.u}`).toBeGreaterThanOrEqual(1.4);
      for (const a of AXEN) expect(winkelZu(b, a), `${g.u}`).toBeGreaterThanOrEqual(11);
    }
    for (const [name, s] of bilder) for (const l of s.linien!.filter((x) => x.pfeil)) {
      const b = bildRichtung(diff(l.bis, l.von));
      expect(Math.hypot(b[0]!, b[1]!), `${name} ${diff(l.bis, l.von)}`).toBeGreaterThanOrEqual(1.4);
    }
  });
  const punktNamen = (s: RaumBildSpec) => Object.fromEntries(s.punkte!.map((x) => [x.name, x.p as number[]]));
  it('Erklären: Q liegt nicht auf g, PQ ist der zweite Spannvektor, die Ebene enthält g und Q, die Probe (0|1) gibt Q', () => {
    const e = D.ERKLAEREN;
    expect(nullv(kreuz(diff(e.Q, e.g.p), e.g.u))).toBe(false);
    expect(diff(e.Q, e.g.p)).toEqual(e.v);
    const eb = ebeneAusPunktUndGerade(e.g, e.Q)!;
    expect(eb).toEqual({ p: e.g.p, u: e.g.u, v: e.v });
    for (const x of [e.Q, plus(e.g.p, e.g.u), plus(e.g.p, mal(3, e.g.u))]) expect(imE(eb, x)).toBe(true);
    expect(plus(plus(eb.p, mal(0, eb.u)), mal(1, eb.v))).toEqual(e.Q);
    const p = punktNamen(B.RAUM_ERKLAEREN);
    expect(p.P).toEqual(e.g.p);
    expect(p.Q).toEqual(e.Q);
    expect(B.RAUM_ERKLAEREN.flaechen).toHaveLength(1);
  });
  it('Vermutung 1: die drei Paare haben die behaupteten Lagen, nur die ersten beiden haben eine Ebene, die Bilder zeigen sie', () => {
    expect(gleichungsArt(D.SCHNEIDEND.g, D.SCHNEIDEND.h)).toBe('schneidend');
    expect(gleichungsArt(D.PARALLEL.g, D.PARALLEL.h)).toBe('parallel');
    expect(gleichungsArt(D.WINDSCHIEF.g, D.WINDSCHIEF.h)).toBe('windschief');
    expect(lageZweier(D.SCHNEIDEND.g, D.SCHNEIDEND.h).schnittpunkt).toEqual([-2, 3, 1]);
    expect((B.RAUM_SCHNEIDEND.flaechen ?? []).length).toBe(1);
    expect((B.RAUM_PARALLEL.flaechen ?? []).length).toBe(1);
    expect((B.RAUM_WINDSCHIEF.flaechen ?? []).length).toBe(0);
    const pa = ebeneAusGeraden(D.PARALLEL.g, D.PARALLEL.h).ebene!;
    expect(pa.v).toEqual([3, 0, -1]);
    for (const x of [D.PARALLEL.g.p, D.PARALLEL.h.p, plus(D.PARALLEL.g.p, D.PARALLEL.g.u), plus(D.PARALLEL.h.p, D.PARALLEL.h.u)]) expect(imE(pa, x)).toBe(true);
    const sc = ebeneAusGeraden(D.SCHNEIDEND.g, D.SCHNEIDEND.h).ebene!;
    for (const x of [D.SCHNEIDEND.g.p, D.SCHNEIDEND.h.p, [-2, 3, 1]]) expect(imE(sc, x)).toBe(true);
  });
  it('Vermutung 2: X liegt auf g, zwei verschiedene Ebenen enthalten g und X', () => {
    const a = D.AUF_GERADE;
    expect(nullv(kreuz(diff(a.X, a.g.p), a.g.u))).toBe(true);
    const e1: Ebene = { p: a.g.p, u: a.g.u, v: a.v1 };
    const e2: Ebene = { p: a.g.p, u: a.g.u, v: a.v2 };
    expect(echteEbene(e1)).toBe(true);
    expect(echteEbene(e2)).toBe(true);
    expect(gleichE(e1, e2)).toBe(false);
    for (const e of [e1, e2]) for (const x of [a.X, a.g.p, plus(a.g.p, mal(2, a.g.u))]) expect(imE(e, x)).toBe(true);
    expect(ebeneAusPunktUndGerade(a.g, a.X)).toBeNull();
    expect(B.RAUM_AUF_GERADE.flaechen).toHaveLength(2);
  });
  it('Aufgaben 1, 3 und 9: Bilder passen zu den Daten', () => {
    const p1 = punktNamen(B.aufgPunktGerade);
    expect(p1.Q).toEqual(D.A_PUNKT_GERADE.Q);
    expect(p1.P).toEqual(D.A_PUNKT_GERADE.g.p);
    expect(diff(D.A_PUNKT_GERADE.Q, D.A_PUNKT_GERADE.g.p)).toEqual(D.A_PUNKT_GERADE.v);
    expect((B.aufgSchnitt.flaechen ?? []).length).toBe(1);
    expect((B.aufgZeichnen.flaechen ?? []).length).toBe(1);
    const z = D.A_ZEICHNEN;
    expect(diff(z.H, z.G)).toEqual(z.v);
    expect(punktNamen(B.aufgZeichnen).P).toBeDefined();
  });
});

describe('Labore', () => {
  it('Geradenlabor und Punktlabor: Regler, Schalter, Ergebnisse zunächst verborgen, kein Schalter Ebene und Raum, aber Schrägbild und räumlich', () => {
    const a = renderToStaticMarkup(<Geradenlabor />);
    expect(a.match(/type="range"/g)).toHaveLength(6);
    expect(a.match(/type="checkbox"/g)).toHaveLength(1);
    expect(a).toContain('aria-label="Darstellung wählen"');
    expect(a).not.toContain('aria-label="Ebene oder Raum wählen"');
    expect(a).not.toContain('windschief');
    expect(a).not.toContain('formel-fehler');
    const b = renderToStaticMarkup(<Punktlabor />);
    expect(b.match(/type="range"/g)).toHaveLength(3);
    expect(b.match(/type="checkbox"/g)).toHaveLength(1);
    expect(b).not.toContain('liegt nicht auf');
    expect(b).not.toContain('formel-fehler');
  });
  it('Geradenlabor: für viele Einstellungen stimmt die Ebene im Bild mit der Lage überein, alle Linien liegen im Koordinatensystem', () => {
    let n = 0;
    let ebenen = 0;
    const R = [-3, -1, 0, 2, 3];
    for (const q1 of R) for (const q2 of R) for (const q3 of R) for (const w1 of [-2, -1, 0, 1, 2]) for (const w2 of [-2, 0, 1, 2]) for (const w3 of [-2, -1, 1, 2]) {
      const q = [q1, q2, q3];
      const w = [w1, w2, w3];
      if (nullv(w)) continue;
      const h = { p: q, u: w };
      const art = gleichungsArt(D.LABOR_G, h);
      expect(lageZweier(D.LABOR_G, h).art).toBe(art);
      const { spec } = geradenLaborBild(D.LABOR_G, h, true);
      const hat = (spec.flaechen ?? []).length > 0;
      const erwartet = art === 'schneidend' || art === 'parallel';
      expect(hat === erwartet || !erwartet === !hat || (erwartet && !hat)).toBe(true);
      if (!erwartet) expect(hat, `${q} ${w} ${art}`).toBe(false);
      if (hat) ebenen++;
      for (const l of spec.linien!) for (const c of [...l.von, ...l.bis]) expect(Math.abs(c)).toBeLessThanOrEqual(4 + 1e-9);
      n++;
    }
    expect(n).toBeGreaterThan(8000);
    expect(ebenen).toBeGreaterThan(100);
    // ohne Auswertung nie eine Fläche
    expect((geradenLaborBild(D.LABOR_G, { p: D.LABOR_START.q, u: D.LABOR_START.w }, false).spec.flaechen ?? []).length).toBe(0);
    expect(gleichungsArt(D.LABOR_G, { p: D.LABOR_START.q, u: D.LABOR_START.w })).toBe('windschief');
  }, 120000);
  it('Punktlabor: genau die Punkte auf g haben keine Ebene (alle 729 Punkte), das Bild zeigt die Ebene nur mit der Auswertung', () => {
    const g = D.LABOR_G;
    let auf = 0;
    for (let a = -4; a <= 4; a++) for (let b = -4; b <= 4; b++) for (let c = -4; c <= 4; c++) {
      const x = [a, b, c];
      const e = ebeneAusPunktUndGerade(g, x);
      const aufG = nullv(kreuz(diff(x, g.p), g.u));
      expect(e === null).toBe(aufG);
      if (aufG) auf++;
      expect((punktLaborBild(x, false).flaechen ?? []).length).toBe(0);
      expect((punktLaborBild(x, true).flaechen ?? []).length > 0).toBe(!aufG && (e ? liegtInEbene(e, x) : false));
    }
    expect(auf).toBe(4);
    expect(D.PUNKT_START).not.toEqual(g.p);
  }, 60000);
});

describe('Aufgaben', () => {
  it('9 Aufgaben: vier mit Eingabefeldern, vier Auswahlfragen und eine Zeichenaufgabe', () => {
    const html = rendern('ueberpruefen');
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '3', '5', '8']);
    expect(fragen.map((f) => f.nummer)).toEqual(['2', '4', '6', '7']);
    expect(html).toContain('Aufgabe 9: Zwei parallele Geraden und ihre Ebene zeichnen');
  });
  it('Aufgabe 1: PQ = Q − P aus den Daten im Aufgabentext, Q liegt nicht auf g', () => {
    rendern('ueberpruefen');
    const a = aufgaben.find((x) => x.nummer === '1')!;
    const [p, u] = spaltenAus(a.children);
    const Q = punkteAus(a.children).Q!;
    expect(['1', '2', '3'].map((i) => wert('1', `v${i}`))).toEqual(diff(Q, p!));
    expect(nullv(kreuz(diff(Q, p!), u!))).toBe(false);
  });
  it('Auswahl 2 und 4: genau eine Gleichung beschreibt die Ebene (g und Q bzw. g und h), die richtige steht nicht an erster Stelle, die falschen haben je ihren Fehler', () => {
    rendern('ueberpruefen');
    const f2 = fragen.find((x) => x.nummer === '2')!;
    const [gp, gu] = spaltenAus(f2.children);
    const Q = punkteAus(f2.children).Q!;
    let n = 0;
    for (const o of f2.optionen) {
      const e = ebeneAus(spaltenAus(o.text));
      const stimmt = echteEbene(e) && imE(e, Q) && imE(e, gp!) && imE(e, plus(gp!, gu!));
      expect(stimmt, o.id).toBe(o.richtig);
      if (stimmt) n++;
    }
    expect(n).toBe(1);
    expect(f2.optionen[0]!.richtig).toBe(false);
    const f4 = fragen.find((x) => x.nummer === '4')!;
    const [[g1, g2], [h1, h2]] = [spaltenAus(aufgaben.find((x) => x.nummer === '3')!.children).slice(0, 2), spaltenAus(aufgaben.find((x) => x.nummer === '3')!.children).slice(2, 4)];
    let m = 0;
    for (const o of f4.optionen) {
      const e = ebeneAus(spaltenAus(o.text));
      const stimmt = echteEbene(e) && [g1!, plus(g1!, g2!), h1!, plus(h1!, h2!)].every((x) => imE(e, x));
      expect(stimmt, o.id).toBe(o.richtig);
      if (stimmt) m++;
    }
    expect(m).toBe(1);
    expect(f4.optionen[0]!.richtig).toBe(false);
    const ag = D.A_AUSWAHL_GERADEN;
    expect(keinePlane(ag.kollinear)).toBe(true);
    expect(echteEbene(ag.fehler)).toBe(true);
    expect(echteEbene(ag.ortsvektor)).toBe(true);
  });
  it('Aufgabe 3: der Schnittpunkt aus dem Gleichsetzen liegt auf beiden Geraden und stimmt mit t und k überein', () => {
    rendern('ueberpruefen');
    const a = aufgaben.find((x) => x.nummer === '3')!;
    const sp = spaltenAus(a.children);
    const [gp, gu, hp, hu] = sp as number[][];
    const S = ['1', '2', '3'].map((i) => wert('3', `s${i}`));
    expect(nullv(kreuz(diff(S, gp!), gu!))).toBe(true);
    expect(nullv(kreuz(diff(S, hp!), hu!))).toBe(true);
    expect(gleichungsArt({ p: gp!, u: gu! }, { p: hp!, u: hu! })).toBe('schneidend');
    expect(plus(gp!, mal(D.A_SCHNITT.t, gu!))).toEqual(S);
    expect(plus(hp!, mal(D.A_SCHNITT.s, hu!))).toEqual(S);
  });
  it('Aufgabe 5: parallel und verschieden, HG = G − H', () => {
    rendern('ueberpruefen');
    const [gp, gu, hp, hu] = spaltenAus(aufgaben.find((x) => x.nummer === '5')!.children) as number[][];
    expect(gleichungsArt({ p: gp!, u: gu! }, { p: hp!, u: hu! })).toBe('parallel');
    expect(['1', '2', '3'].map((i) => wert('5', `w${i}`))).toEqual(diff(gp!, hp!));
  });
  it('Auswahl 6: genau ein Paar ist windschief, die anderen drei haben die genannte Lage, die richtige steht nicht an erster Stelle', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '6')!;
    let n = 0;
    const arten: string[] = [];
    for (const o of f.optionen) {
      const [gp, gu, hp, hu] = spaltenAus(o.text) as number[][];
      const art = gleichungsArt({ p: gp!, u: gu! }, { p: hp!, u: hu! });
      arten.push(art);
      expect(art === 'windschief', o.id).toBe(o.richtig);
      if (o.richtig) n++;
    }
    expect(n).toBe(1);
    expect([...arten].sort()).toEqual(['identisch', 'parallel', 'schneidend', 'windschief']);
    expect(f.optionen[0]!.richtig).toBe(false);
    expect(lageZweier(D.A_PAARE.paare[0]!.g, D.A_PAARE.paare[0]!.h).schnittpunkt).toEqual([2, 1, 1]);
  });
  it('Auswahl 7: u = −1/2 · v, kollinear; genau eine richtige Antwort', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '7')!;
    const [v, u] = spaltenAus(f.children);
    expect(nullv(kreuz(v!, u!))).toBe(true);
    expect(mal(-0.5, v!).map((c) => c + 0)).toEqual(u);
    expect(f.optionen.filter((o) => o.richtig)).toHaveLength(1);
  });
  it('Aufgabe 8: Q(a | 3 | 5) liegt für genau ein a in der Ebene durch g und h', () => {
    rendern('ueberpruefen');
    const e = ebeneAusGeraden(D.A_SCHNITT.paar.g, D.A_SCHNITT.paar.h).ebene!;
    const a = wert('8', 'a');
    expect(imE(e, [a, 3, 5])).toBe(true);
    for (let x = -30; x <= 30; x += 0.5) if (x !== a) expect(imE(e, [x, 3, 5]), `${x}`).toBe(false);
    expect(plus(plus(e.p, mal(D.A_PARAMETER_A.r, e.u)), mal(D.A_PARAMETER_A.s, e.v))).toEqual([a, 3, 5]);
  });
  it('Aufgabe 9 (Zeichnen): parallele Geraden, GH ist der Verbindungsvektor, die Hilfe nennt ihn', () => {
    const html = rendern('ueberpruefen');
    const z = D.A_ZEICHNEN;
    expect(gleichungsArt(z.paar.g, z.paar.h)).toBe('parallel');
    expect(diff(z.H, z.G)).toEqual(z.v);
    expect(html).toContain('Zwei parallele Geraden und ihre Ebene zeichnen');
  });
  it('alle Auswahlfragen: genau eine richtige Antwort, die Position wechselt, alle Texte ohne Formelfehler und Gedankenstriche, jede Aufgabe mindestens zwei Hilfen und Lösungsschritte', () => {
    rendern('ueberpruefen');
    const positionen = fragen.map((x) => x.optionen.findIndex((o) => o.richtig));
    expect(new Set(positionen).size).toBeGreaterThan(2);
    const knoten: ReactNode[] = [];
    for (const x of fragen) {
      expect(x.optionen.filter((o) => o.richtig), x.nummer).toHaveLength(1);
      for (const o of x.optionen) knoten.push(o.text, o.rueckmeldung);
      knoten.push(x.erklaerung, x.children);
    }
    for (const x of aufgaben) {
      knoten.push(x.children, ...x.hilfen, ...x.loesung, ...x.felder.map((fl) => fl.beschriftung));
      expect(x.hilfen.length, x.nummer).toBeGreaterThanOrEqual(2);
      expect(x.loesung.length, x.nummer).toBeGreaterThanOrEqual(2);
      for (const f of x.felder) expect(Number.isInteger(f.erwartet), `${x.nummer} ${f.id}`).toBe(true);
    }
    for (const k of knoten) {
      const h = alsText(k);
      expect(h).not.toContain('formel-fehler');
      expect(h).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(h).not.toContain(z);
      expect(h).not.toMatch(/\d\/\d/);
    }
  });
  it('die Zahlen, Namen und Aufgaben der Arbeitsblätter der Lehrkraft kommen nicht vor (öffentliches Repository)', () => {
    const quelle = readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts')).map((d) => readFileSync(`${ORDNER}/${d}`, 'utf8')).join('\n');
    const verboten = ['[4, 5, 8]', '[0, 3, -5]', '[3, 0, 3]', '[5, 3, 4]', '[1, -2, 3]', '[3, 4, 7]', '[-2, 4, 17]', '[4, -2, 6]', '[3, -2, 7]', '[-1.5, 1, -3.5]', '[1, 2, 3], [5, 1, 2]', '[-4, -1, 3]'];
    for (const v of verboten) expect(quelle, v).not.toContain(v);
    const html = rendern(null);
    for (const v of ['A(1\\,|\\,-2\\,|\\,3)', 'B(4\\,|\\,-2\\,|\\,6)']) expect(texteAusHtml(html).join(' ')).not.toContain(v);
  });
});

describe('Zusammenfassung', () => {
  it('das Beispiel ist das der Erklärung, Q liegt nicht auf g (erste Koordinate verlangt t = 0, zweite t = 3/2)', () => {
    const z = D.ZUSAMMENFASSUNG;
    expect(z).toBe(D.ERKLAEREN);
    expect((z.Q[0]! - z.g.p[0]!) / z.g.u[0]!).toBe(0);
    expect((z.Q[1]! - z.g.p[1]!) / z.g.u[1]!).toBe(1.5);
    const html = rendern('zusammenfassung');
    expect(html).not.toContain('formel-fehler');
  });
});
