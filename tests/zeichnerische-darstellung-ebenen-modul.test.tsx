import { existsSync, readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/zeichnerische-darstellung-ebenen/Bilder';
import * as D from '../content/modules/zeichnerische-darstellung-ebenen/daten';
import Modul from '../content/modules/zeichnerische-darstellung-ebenen/index';
import { Ebenenlabor, Zeichenlabor } from '../content/modules/zeichnerische-darstellung-ebenen/Labor';
import meta from '../content/modules/zeichnerische-darstellung-ebenen/meta.json';
import themen from '../content/themen.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { spurpunkteEbene } from '../src/lib/spur';
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
    return <div data-aufgabe={String(p.nummer)}>{p.children}{p.hilfen.map((h, i) => <div key={`h${i}`}>{h}</div>)}{p.loesung.map((h, i) => <div key={`l${i}`}>{h}</div>)}</div>;
  },
}));
vi.mock('../src/components/Auswahlfrage', () => ({
  Auswahlfrage: (p: FrageAufruf) => {
    fragen.push(p);
    return <div data-frage={p.nummer}>{p.children}{p.erklaerung}</div>;
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
const ORDNER = 'content/modules/zeichnerische-darstellung-ebenen';
const quellen = () => readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts')).map((d) => readFileSync(`${ORDNER}/${d}`, 'utf8')).join('\n');
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const texteAusHtml = (html: string): string[] => [...html.matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<'));
const texte = (n: ReactNode): string[] => texteAusHtml(alsText(n));
const zahl = (s: string) => Number(s.replace(/\{,\}/g, '.'));
const spaltenAus = (n: ReactNode): number[][] =>
  [...texte(n).join(' ').matchAll(/\\begin\{pmatrix\}(.*?)\\end\{pmatrix\}/g)].map((m) => m[1]!.split('\\\\').map(zahl)).filter((s) => s.every((x) => Number.isFinite(x)));
const feld = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!;
const wert = (nr: string, id: string) => feld(nr, id).erwartet;

/* ---------- unabhängige Methoden ---------- */
const kreuz = (a: number[], b: number[]): number[] => [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!].map((x) => x + 0);
const skal = (a: number[], b: number[]) => a[0]! * b[0]! + a[1]! * b[1]! + a[2]! * b[2]!;
const diff = (b: number[], a: number[]) => b.map((x, i) => x - a[i]!);
const nullv = (v: number[]) => v.every((x) => x === 0);
type KF = { n: number[]; d: number };
/** Koordinatenform aus einem TeX-Text wie `2x_1+3x_2-2x_3=6` lesen. */
const kfAus = (tex: string): KF => {
  const [links, rechts] = tex.replace(/^E(?:_[a-c0-9])?:\\ /, '').split('=');
  const n = [1, 2, 3].map((i) => {
    const m = links!.match(new RegExp(`([+-]?\\d*)x_${i}`));
    if (!m) return 0;
    const z = m[1]!;
    return z === '' || z === '+' ? 1 : z === '-' ? -1 : Number(z);
  });
  return { n, d: Number(rechts) };
};
const kfIn = (n: ReactNode): KF => kfAus(texte(n).join(' ').match(/E(?:_[a-c0-9])?:\\ ([^,\s]*?=-?\d+)/)![0]);
/** Spurpunkte unabhängig: Punkte der Achse i auf einem Raster, die die Gleichung erfüllen (kein, ein oder alle). */
const achsenPunkte = (k: KF, i: number): number[][] => {
  const r: number[][] = [];
  for (let t = -40; t <= 40; t += 0.25) {
    const x = [0, 0, 0];
    x[i] = t;
    if (Math.abs(skal(k.n, x) - k.d) < 1e-9) r.push(x);
  }
  return r;
};
const spurBrute = (k: KF): (number[] | 'keiner' | 'achse')[] => [0, 1, 2].map((i) => {
  const p = achsenPunkte(k, i);
  return p.length === 0 ? 'keiner' : p.length === 1 ? p[0]! : 'achse';
});
const echteSpuren = (k: KF) => spurBrute(k).filter((s): s is number[] => Array.isArray(s));
const imKf = (k: KF, x: number[]) => Math.abs(skal(k.n, x) - k.d) < 1e-6;

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Ebenen, hat vier Abschnitte, BPE 16.4', () => {
    expect(meta.id).toBe('zeichnerische-darstellung-ebenen');
    expect(meta.thema).toBe('vektorgeometrie');
    expect(meta.unterbereich).toBe('ebenen');
    expect(meta.bpe).toEqual(['16.4']);
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
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"zeichnerische-darstellung-ebenen"');
  });
  it('rendert ohne Formelfehler und ohne Gedankenstriche, mit der Fachsprache der Lehrkraft', () => {
    const html = rendern(null);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(html).not.toContain(z);
    for (const datei of [...readdirSync(ORDNER).map((x) => `${ORDNER}/${x}`), 'src/lib/spur.ts', 'src/lib/spurhilfen.ts']) for (const z of ['–', '—']) expect(readFileSync(datei, 'utf8'), datei).not.toContain(z);
    for (const wort of ['Spurpunkt', 'Spurgerade', 'Spurdreieck', 'Koordinatenform', 'Koordinatenebene', 'Ausschnitt', 'Achsenabschnittsform', 'Parameterform', 'Vektorprodukt', 'Ursprung', 'Wortspeicher', 'Sprachhilfe', 's-Multiplikation'.slice(0, 0)]) expect(html, wort).toContain(wort);
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).not.toMatch(/\d\/\d/);
    expect(html).not.toMatch(/\bpi\b|Pi\b/);
    expect(html).not.toMatch(/Skalarmultiplikation/);
  });
  it('das Vektorprodukt wird immer mit dem geläufigeren Namen Kreuzprodukt genannt', () => {
    const text = rendern(null).replace(/<[^>]*>/g, ' ');
    expect(text).toContain('Vektorprodukt (Kreuzprodukt)');
    expect(text).not.toMatch(/Vektorprodukt(?! \(Kreuzprodukt\))/);
  });
  it('Abgrenzung: nichts aus den Folgemodulen (Gerade und Ebene, zwei Ebenen, Abstände, Flächen, Volumen), keine Hesse-Form', () => {
    const m = rendern(null).replace(/<[^>]*>/g, ' ').match(/.{30}(Hesse|Schnittwinkel|Lotfußpunkt|Abstand|Volumen|windschief).{30}/);
    expect(m?.[0]).toBeUndefined();
  });
  it('das Erklären nimmt nichts vorweg: kein Berechnungsverfahren, keine Regeln zur besonderen Lage, keine Achsenabschnittsform', () => {
    const text = rendern('erklaeren').replace(/<[^>]*>/g, '');
    for (const wort of ['gleich 0 setzen', 'gleich null setzen', 'Achsenabschnitt', 'parallel zur', 'Streifen', 'durch den Ursprung', 'Spurpunkte berechnen']) expect(text, wort).not.toContain(wort);
    expect(text).toContain('Entdecken');
    const tex = texteAusHtml(rendern('erklaeren')).join(' ');
    expect(tex).not.toMatch(/6x_1|4x_2|3x_3/);
  });
  it('verweist auf die Module davor', () => {
    const ids = [...quellen().matchAll(/modul="([a-z0-9-]+)"/g)].map((m) => m[1]!);
    for (const m of ['punkte-vektoren-raum', 'normalenform-koordinatenform', 'spurpunkte-besondere-lage', 'vektorprodukt']) expect(ids, m).toContain(m);
    for (const id of ids) expect(existsSync(`content/modules/${id}/meta.json`), id).toBe(true);
  });
  it('Zeilenumbrüche in Rechnungen nur vor einem Gleichheitszeichen: Fortsetzungen mit {}+ gibt es nur bei Gleichungen (… + t · …)', () => {
    for (const m of quellen().matchAll(/\{\}([+\-]|\\cdot)(.{0,14})/g)) expect(/^(\$\{[rstk]\}|[rstk])\\{1,2}cdot/.test(m[2]!), m[0]).toBe(true);
    for (const tex of texteAusHtml(rendern(null))) for (const m of tex.matchAll(/\\\\\{\}([+\-]|\\cdot)(.{0,10})/g)) expect(/^[rstk]\\cdot/.test(m[2]!), tex).toBe(true);
  });
  it('die Zahlen und Aufgaben der Arbeitsblätter der Lehrkraft kommen nicht vor (öffentliches Repository)', () => {
    const gleichungen = [
      '4x_1+3x_2+6x_3=12', '3x_1+6x_2+4x_3=12', '3x_1-4x_2+6x_3=12', '5{,}5x_1+11x_3=22', '2x_2+3x_3=6', 'x_2=3', 'x_1-x_2+x_3=0', 'x_1+2x_2=4', '3x_1+6x_2+2x_3=12', 'x_1+3x_3=6',
      '2x_1+5x_2+x_3=10', '\\frac{x_1}{2}+\\frac{x_2}{5}+\\frac{x_3}{4}=1',
    ];
    const items = texteAusHtml(rendern(null)).map((x) => x.replace(/^[A-Za-z]+(?:_[a-z0-9]+)?:\\ /, ''));
    for (const g of gleichungen) expect(items, g).not.toContain(g);
    const tex = items.join(' ');
    const verboten = ['P(0\\,|\\,2\\,|\\,1)', '1\\\\2\\\\-2', '1\\\\-2\\\\0', '0\\\\4\\\\-1', '2\\\\0\\\\1', '0\\\\-3\\\\1'];
    for (const v of verboten) expect(tex, v).not.toContain(v);
    const q = quellen();
    for (const v of ['[1, 2, -2]', '[0, 4, -1]', '[2, 0, 1]', '[0, -3, 1]', '[5.5, 0, 11]']) expect(q, v).not.toContain(v);
  });
});

/* ---------- Bilder ---------- */
const AXEN: [number, number][] = [[-1, -1], [1, 0], [0, 1]];
const zahlenX1 = Array.from({ length: 2 * RAUM_GRENZE + 1 }, (_, i) => i - RAUM_GRENZE).filter((k) => k !== 0).map((k) => normiert(x1ZahlMitte(k)));
const abstandPS = (p: number[], a: number[], b: number[]) => {
  const dx = b[0]! - a[0]!;
  const dy = b[1]! - a[1]!;
  const l2 = dx * dx + dy * dy;
  const u = l2 === 0 ? 0 : Math.max(0, Math.min(1, ((p[0]! - a[0]!) * dx + (p[1]! - a[1]!) * dy) / l2));
  return Math.hypot(p[0]! - (a[0]! + u * dx), p[1]! - (a[1]! + u * dy));
};
const ECHTE_BILDER = (): [string, RaumBildSpec, KF][] => [
  ['ERKLAEREN', B.RAUM_ERKLAEREN, D.BEISPIEL.k],
  ['SPURGERADE', B.RAUM_SPURGERADE, D.BEISPIEL.k],
  ['STREIFEN', B.RAUM_STREIFEN, D.PARALLEL.achse.k],
  ['QUADRAT', B.RAUM_QUADRAT, D.PARALLEL.ebene.k],
  ['URSPRUNG', B.RAUM_URSPRUNG, D.URSPRUNG.k],
  ['ABSCHNITT', B.RAUM_ABSCHNITT, D.ABSCHNITT.k],
  ['A1', B.kontrollBild(D.A1.k), D.A1.k],
  ['A2', B.kontrollBild(D.A2.k), D.A2.k],
  ['A3', B.kontrollBild(D.A3.k), D.A3.k],
  ['A4', B.kontrollBild(D.A4.richtig), D.A4.richtig],
  ['A5', B.kontrollBild(D.A5.k), D.A5.k],
  ['A6', B.kontrollBild(D.A6.k), D.A6.k],
  ['A7', B.kontrollBild(D.A7.k), D.A7.k],
  ['A8', B.kontrollBild(D.A8.k), D.A8.k],
  ['A9', B.ebenenBild(D.A9.k, { flaeche: 'ausschnitt', spurgeraden: true }).spec, D.A9.k],
  ['A12a', B.kontrollBild(D.A12.eins), D.A12.eins],
  ['A12b', B.kontrollBild(D.A12.zwei), D.A12.zwei],
  ['A12c', B.kontrollBild(D.A12.achse), D.A12.achse],
  ...D.ZEICHEN.flatMap((z): [string, RaumBildSpec, KF][] => [0, 3, 4].map((s) => [`${z.id} Schritt ${s}`, B.zeichenBild(z, s), z.k]) as [string, RaumBildSpec, KF][]),
];

describe('Bilder', () => {
  it('alle Punkte liegen im Koordinatensystem, außer den Spurpunkten auf den Achsen keiner auf einer Achse, keine zwei an derselben Bildstelle, jedes Bild hat eine Textalternative und die feine Darstellung', () => {
    for (const [name, s, k] of ECHTE_BILDER()) {
      const sichtbar = s.punkte!.filter((p) => !p.ohneText && !p.nurText);
      const bp = sichtbar.map((p) => bildpunkt(p.p));
      const spuren = echteSpuren(k).map(String);
      for (const [i, p] of sichtbar.entries()) {
        for (const x of p.p) expect(Math.abs(x), `${name} ${p.name}`).toBeLessThanOrEqual(RAUM_GRENZE);
        const [x, y] = bp[i]!;
        if (/^S[₁₂₃]$/.test(p.name)) expect(spuren, `${name} ${p.name} ist ein Spurpunkt`).toContain(String(p.p));
        else {
          expect(x, `${name} ${p.name} x`).not.toBe(0);
          expect(y, `${name} ${p.name} y`).not.toBe(0);
          expect(x, `${name} ${p.name} x=y`).not.toBe(y);
        }
      }
      expect(new Set(bp.map(String)).size, name).toBe(bp.length);
      expect(s.sprech.length, name).toBeGreaterThan(60);
      expect(s.fein, name).toBe(true);
      for (const l of s.linien ?? []) for (const c of [...l.von, ...l.bis]) expect(Math.abs(c), `${name} Linie`).toBeLessThanOrEqual(RAUM_GRENZE + 1e-9);
      for (const f of s.flaechen ?? []) for (const e of f.ecken) for (const c of e) expect(Math.abs(c), `${name} Fläche`).toBeLessThanOrEqual(RAUM_GRENZE + 1e-9);
    }
  });
  it('jede Beschriftung hat Abstand zu allen Linien, Achsen, Achsenzahlen und anderen Beschriftungen (Spurpunkte auf den Achsen: mindestens 0,015)', () => {
    for (const [name, s] of ECHTE_BILDER()) {
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
  it('die Namen der Spurgeraden stehen dicht an ihrer Linie und halten Abstand zu anderen Linien, Achsen und Punkten', () => {
    let n = 0;
    for (const [name, s] of ECHTE_BILDER()) {
      const texte = s.punkte!.filter((p) => p.nurText);
      const linien = (s.linien ?? []).filter((l) => l.breite === 3).map((l) => [bildpunkt(l.von), bildpunkt(l.bis)] as [number[], number[]]);
      for (const tx of texte) {
        n++;
        const b = bildpunkt(tx.p);
        const d = linien.map(([a, c]) => abstandPS(b, a, c)).sort((x, y) => x - y);
        expect(d[0], `${name} ${tx.name} eigene Linie`).toBeLessThanOrEqual(0.45);
        expect(d[0], `${name} ${tx.name} nicht auf der Linie`).toBeGreaterThanOrEqual(0.15);
        if (d[1] !== undefined) expect(d[1], `${name} ${tx.name} andere Linie`).toBeGreaterThanOrEqual(0.25);
        for (const [a, c] of [[[-5, -5], [5, 5]], [[-5, 0], [5, 0]], [[0, -5], [0, 5]]] as [number[], number[]][]) expect(abstandPS(b, a, c), `${name} ${tx.name} Achse`).toBeGreaterThanOrEqual(0.2);
        for (const p of s.punkte!.filter((q) => !q.nurText)) expect(Math.hypot(...diff(bildpunkt(p.p), b)), `${name} ${tx.name} Punkt ${p.name}`).toBeGreaterThanOrEqual(0.3);
      }
    }
    expect(n).toBeGreaterThan(15);
  });
  it('Flächen und Spurlinien liegen in der Ebene, die Spurlinien in der Koordinatenebene ihrer Farbe, jede Linie ist im Schrägbild mindestens 1,4 lang', () => {
    const FARBE_ZU_NULL: Record<string, number> = { '#1479b5': 2, '#00705a': 1, '#B26B00': 0 };
    for (const [name, s, k] of ECHTE_BILDER()) {
      for (const f of s.flaechen ?? []) for (const e of f.ecken) expect(imKf(k, e), `${name} Fläche ${e}`).toBe(true);
      for (const l of s.linien ?? []) {
        expect(imKf(k, l.von) && imKf(k, l.bis), `${name} Linie`).toBe(true);
        const sp = bildpunkt(l.bis).map((v, i) => v - bildpunkt(l.von)[i]!);
        expect(Math.hypot(sp[0]!, sp[1]!), `${name} Länge`).toBeGreaterThanOrEqual(1.4);
        if (l.breite === 3) {
          const z = FARBE_ZU_NULL[l.farbe!];
          expect(z, `${name} Farbe`).not.toBeUndefined();
          expect(l.von[z!], `${name} ${l.farbe}`).toBe(0);
          expect(l.bis[z!], `${name} ${l.farbe}`).toBe(0);
        }
      }
    }
  });
  it('Spurgeraden verdecken keine Achse: Eine Spurlinie liegt nie auf einer Achse', () => {
    for (const [name, s] of ECHTE_BILDER()) for (const l of (s.linien ?? []).filter((x) => x.breite === 3)) {
      const nullen = (p: number[]) => p.filter((c) => c === 0).length;
      expect(nullen(l.von) === 2 && nullen(l.bis) === 2 && l.von.findIndex((c) => c !== 0) === l.bis.findIndex((c) => c !== 0) && l.von.some((c) => c !== 0), `${name} auf Achse`).toBe(false);
    }
  });
});

describe('Spurdreiecke im Schrägbild', () => {
  it('jedes Spurdreieck ist im Schrägbild ein echtes Dreieck (Fläche mindestens 1), nicht zusammengefallen', () => {
    let n = 0;
    for (const [name, s] of ECHTE_BILDER()) for (const f of s.flaechen ?? []) {
      if (f.ecken.length !== 3) continue;
      const [a, b, c] = f.ecken.map(bildpunkt);
      const flaeche = Math.abs((b![0]! - a![0]!) * (c![1]! - a![1]!) - (c![0]! - a![0]!) * (b![1]! - a![1]!)) / 2;
      expect(flaeche, name).toBeGreaterThanOrEqual(1);
      n++;
    }
    expect(n).toBeGreaterThan(8);
  });
});

describe('Beispiele und Daten', () => {
  it('Erklären und Zusammenfassung: die Spurpunkte stimmen mit der unabhängigen Rasterrechnung überein, die Zahlen passen zur Gleichung', () => {
    const b = D.BEISPIEL;
    expect(spurBrute(b.k)).toEqual(b.s);
    for (const s of b.s) expect(skal(b.k.n, s)).toBe(b.k.d);
    expect(spurpunkteEbene(b.k).map((x) => x.punkt)).toEqual(b.s);
  });
  it('Zeichenlabor: Spurpunkte der drei Ebenen stimmen, die Parameterform führt auf die Koordinatenform (n = u × v, d = n · p)', () => {
    for (const z of D.ZEICHEN) {
      expect(spurBrute(z.k)).toEqual(z.s);
      if (z.param) {
        expect(kreuz(z.param.u, z.param.v)).toEqual(z.k.n);
        expect(skal(z.k.n, z.param.p)).toBe(z.k.d);
        for (let r = -2; r <= 2; r++) for (let s = -2; s <= 2; s++) expect(skal(z.k.n, z.param.p.map((p, i) => p + r * z.param!.u[i]! + s * z.param!.v[i]!))).toBe(z.k.d);
      }
    }
    expect(D.ZEICHEN.some((z) => z.param)).toBe(true);
    expect(D.ZEICHEN.some((z) => z.s.some((s) => s.some((c) => c < 0)))).toBe(true);
  });
  it('Vermutung 4: genau die erwarteten Spurpunkte (zwei bzw. einer), kein Spurpunkt auf der parallelen Achse', () => {
    const p = D.PARALLEL;
    expect(spurBrute(p.achse.k)).toEqual([p.achse.s1, 'keiner', p.achse.s3]);
    expect(spurBrute(p.ebene.k)).toEqual(['keiner', 'keiner', p.ebene.s3]);
  });
  it('Vermutung 5: alle Spurpunkte sind der Ursprung, die Punkte A, B, C liegen in E und je in einer Koordinatenebene, der Ursprung liegt im Dreieck', () => {
    const u = D.URSPRUNG;
    expect(u.k.d).toBe(0);
    expect(spurBrute(u.k)).toEqual([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
    const { s12, s13, s23 } = u.punkte;
    expect([s12[2], s13[1], s23[0]]).toEqual([0, 0, 0]);
    for (const q of [s12, s13, s23]) expect(skal(u.k.n, q)).toBe(0);
    const z = (a: number[], b: number[]) => skal(kreuz(a, b), u.k.n);
    expect(z(s12, s13) * z(s13, s23)).toBeGreaterThan(0);
    expect(z(s13, s23) * z(s23, s12)).toBeGreaterThan(0);
    expect(B.RAUM_URSPRUNG.flaechen![0]!.ecken).toEqual([s12, s13, s23]);
  });
  it('Vermutung 6: die Koordinatenform hat genau diese Spurpunkte, d ist das kleinste gemeinsame Vielfache, das Vielfache mit 12 stimmt', () => {
    const a = D.ABSCHNITT;
    expect(spurBrute(a.k)).toEqual([[3, 0, 0], [0, 2, 0], [0, 0, 4]]);
    expect(a.k.d).toBe(12);
    for (let m = 1; m < 12; m++) expect([3, 2, 4].every((x) => m % x === 0), `${m}`).toBe(false);
    for (let x = -8; x <= 8; x++) for (let y = -8; y <= 8; y++) for (let w = -8; w <= 8; w++) {
      const links = x / 3 + y / 2 + w / 4 === 1;
      expect(skal(a.k.n, [x, y, w]) === a.k.d, `${x} ${y} ${w}`).toBe(links);
    }
  });
});

describe('Labore', () => {
  it('Ebenenlabor und Zeichenlabor: Regler, Schalter, Ergebnisse zunächst verborgen, kein Schalter Ebene und Raum, aber Schrägbild und räumlich', () => {
    const a = renderToStaticMarkup(<Ebenenlabor />);
    expect(a.match(/type="range"/g)).toHaveLength(4);
    expect(a.match(/type="checkbox"/g)).toHaveLength(2);
    expect(a).toContain('aria-label="Darstellung wählen"');
    expect(a).not.toContain('aria-label="Ebene oder Raum wählen"');
    expect(a).not.toContain('formel-fehler');
    expect(a).not.toContain('Auf der');
    expect(a).not.toContain('Spurgerade <');
    const b = renderToStaticMarkup(<Zeichenlabor />);
    expect(b).toContain('aria-label="Darstellung wählen"');
    expect(b).toContain('Schritt 0 von 4');
    expect(b).not.toContain('formel-fehler');
    expect(b).not.toContain('Spurpunkte berechnen');
    expect(b.match(/aria-pressed/g)!.length).toBeGreaterThanOrEqual(3 + 2);
  });
  it('Ebenenlabor: für viele Einstellungen stimmen Fläche, Spurpunkte und Spurgeraden mit der Rasterrechnung überein, alle Linien im Koordinatensystem', () => {
    let n = 0;
    for (const a of [-3, -2, 0, 1, 3]) for (const b of [-3, -1, 0, 2]) for (const c of [-2, 0, 1, 3]) for (const d of [-12, -6, -1, 0, 2, 5, 12]) {
      const k = { n: [a, b, c], d };
      if (nullv(k.n)) continue;
      const { spec } = B.ebenenBild(k, { modus: 'labor', flaeche: 'wuerfel', spurpunkte: true, spurgeraden: true });
      for (const f of spec.flaechen ?? []) for (const e of f.ecken) expect(imKf(k, e), `${k.n} ${d}`).toBe(true);
      for (const l of spec.linien ?? []) {
        for (const x of [...l.von, ...l.bis]) expect(Math.abs(x)).toBeLessThanOrEqual(4 + 1e-9);
        expect(imKf(k, l.von) && imKf(k, l.bis), `${k.n} ${d}`).toBe(true);
      }
      const gezeigt = spec.punkte!.filter((p) => /^S[₁₂₃]$/.test(p.name)).map((p) => p.p);
      // jeder gezeigte Spurpunkt liegt auf genau einer Achse (zwei Koordinaten 0) und in der Ebene
      for (const p of gezeigt) {
        expect(imKf(k, p), `${k.n} ${d}`).toBe(true);
        expect(p.filter((c) => c === 0).length, `${k.n} ${d}`).toBeGreaterThanOrEqual(2);
      }
      // Zahl: alle Achsen mit Koeffizient ungleich 0, deren Schnittpunkt im Bild liegt und nicht der Ursprung ist
      const erwartet = [0, 1, 2].filter((i) => k.n[i] !== 0 && Math.abs(k.d / k.n[i]!) <= 4 && k.d !== 0).length;
      expect(gezeigt.length, `${k.n} ${d}`).toBe(erwartet);
      n++;
    }
    expect(n).toBeGreaterThan(300);
  }, 120000);
  it('Ebenenlabor: Schalter zeigen die Ergebnisse (Start: Spurpunkte aller drei Achsen)', () => {
    const k = { n: D.LABOR_START.n, d: D.LABOR_START.d };
    expect(spurBrute(k)).toEqual([[3, 0, 0], [0, 3, 0], [0, 0, 3]]);
    expect(D.LABOR_GRENZE.n).toBe(3);
  });
});

/* ---------- Aufgaben ---------- */
describe('Aufgaben', () => {
  it('Aufgaben: drei mit Eingabefeldern (1, 5, 10, 11 = vier), drei Auswahlfragen und Zeichenaufgaben, richtig-Position wechselt', () => {
    rendern('ueberpruefen');
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '5', '10', '11']);
    expect(fragen.map((f) => f.nummer)).toEqual(['4', '8']);
    const html = rendern('ueberpruefen');
    for (const nr of ['2', '3', '6', '7', '9', '12']) expect(html, nr).toContain(`Aufgabe ${nr}:`);
    expect(fragen.map((f) => f.optionen.findIndex((o) => o.richtig))[0]).not.toBe(fragen.map((f) => f.optionen.findIndex((o) => o.richtig))[1]);
  });
  it('Aufgabe 1: die Eingaben sind die Spurpunkte, unabhängig mit dem Raster berechnet, die Gleichung stammt aus dem Aufgabentext', () => {
    rendern('ueberpruefen');
    const k = kfIn(aufgaben.find((x) => x.nummer === '1')!.children);
    expect(k).toEqual(D.A1.k);
    const sp = spurBrute(k) as number[][];
    expect([wert('1', 'x1'), wert('1', 'x2'), wert('1', 'x3')]).toEqual([sp[0]![0], sp[1]![1], sp[2]![2]]);
    expect(sp).toEqual(D.A1.s);
  });
  it('Zeichenaufgaben 2, 3, 6, 7, 9: Gleichung im Text, die Kontrollbilder zeigen die richtigen Spurpunkte', () => {
    const html = rendern('ueberpruefen');
    const tex = texteAusHtml(html);
    for (const k of [D.A2.k, D.A6.k, D.A7.k, D.A9.k]) expect(tex.some((x) => x.includes(`E:\\ ${kfText(k)}`)), kfText(k)).toBe(true);
    const sp2 = spurBrute(D.A2.k);
    expect(sp2).toEqual(D.A2.s);
    // Aufgabe 3: Parameterform im Text führt auf die Koordinatenform
    const teil3 = html.split('Aufgabe 3:')[1]!.split('<details')[0]!;
    const [p, u, v] = [...texteAusHtml(teil3).join(' ').matchAll(/\\begin\{pmatrix\}(.*?)\\end\{pmatrix\}/g)].map((m) => m[1]!.split('\\\\').map(zahl));
    expect(kreuz(u!, v!)).toEqual(D.A3.k.n);
    expect(skal(D.A3.k.n, p!)).toBe(D.A3.k.d);
    expect(spurBrute(D.A3.k)).toEqual(D.A3.s);
    // Aufgabe 6, 7: Lage
    expect(spurBrute(D.A6.k)).toEqual([[3, 0, 0], [0, 2, 0], 'keiner']);
    expect(spurBrute(D.A7.k)).toEqual(['keiner', [0, -2, 0], 'keiner']);
    // Aufgabe 9: Ursprung, die drei Punkte aus dem Lösungsweg liegen in E und in je einer Koordinatenebene, der Ursprung liegt im Dreieck
    const a = B.ebenenBild(D.A9.k, { flaeche: 'ausschnitt', spurgeraden: true }).spec.flaechen![0]!.ecken;
    for (const q of a) expect(skal(D.A9.k.n, q)).toBe(0);
    expect([a[0]![2], a[1]![1], a[2]![0]]).toEqual([0, 0, 0]);
    expect(texteAusHtml(html).join(' ')).toContain(`A(${a[0]!.map((c) => String(c)).join('\\,|\\,')})`);
  });
  it('Auswahl 4: genau eine Gleichung gehört zu den Spurpunkten im Bild (Probe mit allen drei), die falschen haben je ihren Fehler, die richtige steht nicht an erster Stelle', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '4')!;
    const s = texte(f.children).join(' ').match(/S_1\(([^)]*)\)/)![1]!.split('\\,|\\,').map(zahl);
    expect(s).toEqual(D.A4.s[0]);
    let n = 0;
    for (const o of f.optionen) {
      const k = kfAus(texte(o.text)[0]!);
      const alle = D.A4.s.every((p) => skal(k.n, p) === k.d);
      expect(alle, o.id).toBe(o.richtig);
      if (alle) n++;
    }
    expect(n).toBe(1);
    expect(f.optionen[0]!.richtig).toBe(false);
    expect(spurBrute(D.A4.richtig)).toEqual(D.A4.s);
    expect(spurBrute(D.A4.dFalsch)).not.toEqual(D.A4.s);
    expect(D.A4.abschnitte.n).toEqual(D.A4.s.map((p) => p.find((c) => c !== 0)));
  });
  it('Aufgabe 5: Anzahl und Koordinaten der Spurpunkte stimmen mit der Rasterrechnung überein', () => {
    rendern('ueberpruefen');
    const k = kfIn(aufgaben.find((x) => x.nummer === '5')!.children);
    expect(k).toEqual(D.A5.k);
    const sp = spurBrute(k);
    expect(sp.filter((x) => Array.isArray(x))).toHaveLength(wert('5', 'anzahl'));
    expect(sp[0]).toBe('keiner');
    expect((sp[1] as number[])[1]).toBe(wert('5', 'x2'));
    expect((sp[2] as number[])[2]).toBe(wert('5', 'x3'));
  });
  it('Auswahl 8: genau eine Aussage stimmt (die x₃-Achse liegt in der Ebene, die Ebene geht durch O), die anderen sind falsch', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '8')!;
    const k = kfIn(f.children);
    expect(k).toEqual(D.A8.k);
    expect(achsenPunkte(k, 2)).toHaveLength(321);
    expect(spurBrute(k)).toEqual([[0, 0, 0], [0, 0, 0], 'achse']);
    expect(f.optionen.filter((o) => o.richtig)).toHaveLength(1);
    expect(texte(f.optionen.find((o) => o.richtig)!.text).join(' ')).toContain('x_3');
    expect(D.A8.k.n[2]).toBe(0);
    expect(D.A8.k.n[0] !== 0 && D.A8.k.n[1] !== 0).toBe(true);
  });
  it('Aufgabe 10: a, b, c, d sind die Koordinatenform zu den Spurpunkten, d ist die kleinste positive Zahl mit ganzen Koeffizienten', () => {
    rendern('ueberpruefen');
    const k = { n: ['a', 'b', 'c'].map((i) => wert('10', i)), d: wert('10', 'd') };
    expect(spurBrute(k)).toEqual([[3, 0, 0], [0, -2, 0], [0, 0, 6]]);
    for (let d = 1; d < k.d; d++) expect([3, -2, 6].every((s) => Number.isInteger(d / s)), `${d}`).toBe(false);
    expect(k).toEqual(D.A10.k);
  });
  it('Aufgabe 11: AB ist S₃ − S₁ mit den Spurpunkten aus der Rasterrechnung, die Gerade liegt in E und in der x₁x₃-Ebene', () => {
    rendern('ueberpruefen');
    const k = kfIn(aufgaben.find((x) => x.nummer === '11')!.children);
    expect(k).toEqual(D.A11.k);
    const sp = spurBrute(k) as number[][];
    const ab = ['1', '2', '3'].map((i) => wert('11', `ab${i}`));
    expect(ab).toEqual(diff(sp[2]!, sp[0]!));
    expect(sp[0]).toEqual(D.A11.A);
    expect(sp[2]).toEqual(D.A11.B);
    for (const t of [-2, -0.5, 0, 1, 3]) {
      const x = D.A11.A.map((a, i) => a + t * ab[i]!);
      expect(skal(k.n, x)).toBe(k.d);
      expect(x[1]).toBe(0);
    }
  });
  it('Aufgabe 12: die drei Gegenbeispiele haben genau einen, zwei Spurpunkte bzw. eine Achse in der Ebene', () => {
    const a = D.A12;
    expect(spurBrute(a.eins).filter((x) => Array.isArray(x))).toHaveLength(1);
    expect(spurBrute(a.zwei).filter((x) => Array.isArray(x))).toHaveLength(2);
    expect(spurBrute(a.achse)).toContain('achse');
    expect(spurBrute(a.achse)).toEqual([[0, 0, 0], [0, 0, 0], 'achse']);
  });
  it('alle Auswahlfragen und Aufgaben: Texte ohne Formelfehler und Gedankenstriche, jede Aufgabe mindestens zwei Hilfen und Lösungsschritte, Werte ganzzahlig', () => {
    rendern('ueberpruefen');
    const knoten: ReactNode[] = [];
    for (const x of fragen) {
      for (const o of x.optionen) knoten.push(o.text, o.rueckmeldung);
      knoten.push(x.erklaerung, x.children);
    }
    for (const x of aufgaben) {
      knoten.push(x.children, ...x.hilfen, ...x.loesung, ...x.felder.map((fl) => fl.beschriftung));
      expect(x.hilfen.length, x.nummer).toBeGreaterThanOrEqual(2);
      expect(x.loesung.length, x.nummer).toBeGreaterThanOrEqual(2);
      for (const fl of x.felder) expect(Number.isInteger(fl.erwartet), `${x.nummer} ${fl.id}`).toBe(true);
    }
    for (const k of knoten) {
      const h = alsText(k);
      expect(h).not.toContain('formel-fehler');
      expect(h).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(h).not.toContain(z);
      expect(h).not.toMatch(/\d\/\d/);
    }
  });
  it('die Zeichenaufgaben sind Zeichenaufgaben (kein Eingabefeld), Teil 2, 3, 6, 7, 9, 12 haben Lösungsweg und Kontrollbild', () => {
    const html = rendern('ueberpruefen');
    expect(html.match(/Lösungsweg anzeigen/g)).toHaveLength(6);
    expect(html.match(/Schaubild einblenden|einblenden/g)!.length).toBeGreaterThanOrEqual(6);
  });
});

function kfText(k: KF): string {
  const t = k.n.map((a, i) => (a === 0 ? '' : `${a < 0 ? '-' : '+'}${Math.abs(a) === 1 ? '' : Math.abs(a)}x_${i + 1}`)).join('');
  return `${t.startsWith('+') ? t.slice(1) : t}=${k.d}`;
}

describe('Zusammenfassung', () => {
  it('das Beispiel ist das der Erklärung, der Text rendert ohne Formelfehler und nennt Achsenabschnittsform und Lage', () => {
    const h = rendern('zusammenfassung');
    expect(h).not.toContain('formel-fehler');
    expect(h).toContain('Achsenabschnittsform');
    expect(h).toContain('Lage an der Gleichung ablesen');
    expect(texteAusHtml(h).join(' ')).toContain('6x_1+4x_2+3x_3=12');
  });
});
