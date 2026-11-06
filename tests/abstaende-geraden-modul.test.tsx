import { existsSync, readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/abstaende-geraden/Bilder';
import * as D from '../content/modules/abstaende-geraden/daten';
import Modul from '../content/modules/abstaende-geraden/index';
import { Lotfusslabor, Parallellabor } from '../content/modules/abstaende-geraden/Labor';
import meta from '../content/modules/abstaende-geraden/meta.json';
import { polyTeX } from '../content/modules/abstaende-geraden/rechenhilfen';
import themen from '../content/themen.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { lot, type Gerade } from '../src/lib/gerade';
import { RAUM_BEREICH, RAUM_GRENZE, bildpunkt, normiert, raumLagen, sperrlinienRaum, x1ZahlMitte, type Punkt3, type RaumBildSpec } from '../src/lib/schraegbild';
import { lageAbstand } from '../src/lib/vektorbild';

interface AufgabeAufruf {
  nummer: string;
  children: ReactNode;
  felder: { id: string; erwartet: number; toleranz?: number; beschriftung: ReactNode; name: string }[];
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
const ORDNER = 'content/modules/abstaende-geraden';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const ohneSchmal = (h: string) => h.replace(/<div class="formel-schmal">[\s\S]*?<\/div>/g, '');
const texteAusHtml = (html: string): string[] => [...ohneSchmal(html).matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<'));
const texte = (n: ReactNode): string[] => texteAusHtml(alsText(n));
const zahl = (s: string) => Number(s.replace(/\{,\}/g, '.'));
const spaltenAusTexten = (ts: string[]): number[][] => [...ts.join(' ').matchAll(/\\begin\{pmatrix\*?\}(?:\[r\])?(.*?)\\end\{pmatrix\*?\}/g)].map((m) => m[1]!.split('\\\\').map(zahl)).filter((s) => s.every((x) => Number.isFinite(x)));
const spaltenAus = (n: ReactNode) => spaltenAusTexten(texte(n));
/** Ein Punkt wie Q(2\,|\,−2\,|\,2) aus den Formeln. */
const punktAus = (n: ReactNode, name: string): number[] | null => {
  const m = new RegExp(`${name}\\(([^)]*)\\)`).exec(texte(n).join(' '));
  if (!m) return null;
  const v = m[1]!.split('\\,|\\,').map(zahl);
  return v.every((x) => Number.isFinite(x)) ? v : null;
};
const wert = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!.erwartet;
const frage = (nr: string) => fragen.find((f) => f.nummer === nr)!;
const aufgabe = (nr: string) => aufgaben.find((a) => a.nummer === nr)!;

/* Unabhängige Methoden: Vektorprodukt, Raster mit Verfeinerung und Spatprodukt. */
const kreuz = (a: number[], b: number[]): number[] => [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!].map((x) => x + 0);
const betrag = (v: number[]) => Math.hypot(...v);
const diff = (b: number[], a: number[]) => b.map((x, i) => x - a[i]!);
const plus = (a: number[], b: number[]) => a.map((x, i) => x + b[i]!);
const mal = (k: number, v: number[]) => v.map((x) => x * k + 0);
const pu = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i]!, 0);
const gerade = (p: number[], u: number[]): Gerade => ({ p, u });
const dKreuz = (g: Gerade, q: number[]) => betrag(kreuz(g.u, diff(q, g.p))) / betrag(g.u);
const aufGerade = (g: Gerade, x: number[]) => kreuz(diff(x, g.p), g.u).every((c) => Math.abs(c) < 1e-9);
function dRaster(g: Gerade, q: number[]): number {
  let best = Infinity;
  let bt = 0;
  for (let t = -15; t <= 15; t += 0.002) {
    const d = betrag(diff(plus(g.p, mal(t, g.u)), q));
    if (d < best) {
      best = d;
      bt = t;
    }
  }
  for (let t = bt - 0.004; t <= bt + 0.004; t += 0.00002) best = Math.min(best, betrag(diff(plus(g.p, mal(t, g.u)), q)));
  return best;
}

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Geraden, hat fünf Abschnitte (mit „Drei Wege“), BPE 15.1 und 16.6', () => {
    expect(meta.id).toBe('abstaende-geraden');
    expect(meta.thema).toBe('vektorgeometrie');
    expect(meta.unterbereich).toBe('geraden');
    expect(meta.bpe).toEqual(['15.1', '16.6']);
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['erklaeren', 'entdecken', 'wege', 'ueberpruefen', 'zusammenfassung']);
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
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"abstaende-geraden"');
  });
  it('rendert ohne Formelfehler und ohne Gedankenstriche, mit der Fachsprache der Lehrkraft', () => {
    const html = rendern(null);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(html).not.toContain(z);
    for (const d of readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts'))) {
      const q = readFileSync(`${ORDNER}/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
    }
    for (const wort of ['Lotfußpunkt', 'Abstand', 'laufende Punkt', 'Skalarprodukt', 'Vektorprodukt', 'Stützpunkt', 'Richtungsvektor', 'parallel', 'identisch', 'Parabel', 'Scheitel']) expect(html, wort).toContain(wort);
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).not.toMatch(/\d\/\d/);
    expect(html).not.toMatch(/\bpi\b|Pi\b/);
    expect(html).not.toMatch(/\bλ\b|Lambda/);
    expect(html).not.toMatch(/[A-Z]\(-?\d+(,\d+)? ?\/ ?-?\d/);
  });
  it('nur Abstände: Schnittwinkel, Ebenen, Streckenanteile, Abstand windschiefer Geraden, Schwerpunkt und das Flugzeug und die Drohnen der Arbeitsblätter kommen nicht vor', () => {
    expect(rendern(null)).not.toMatch(/Schnittwinkel|Normalenvektor|Ebenengleichung|Koordinatenform|Hesse|Teilstrecke|Streckenanteil|Schwerpunkt|Seitenhalbierende|Drohne|Flugzeug|Flugroute|windschiefer/);
  });
  it('das Erklären nimmt nichts vorweg: weder „senkrecht“, „Skalarprodukt“, „Vektorprodukt“ noch die Bedingung XQ · u = 0, keine Aussage über parallele Geraden', () => {
    const html = rendern('erklaeren');
    const text = html.replace(/<[^>]*>/g, '');
    for (const wort of ['senkrecht', 'orthogonal', 'Skalarprodukt', 'Vektorprodukt', 'Parallelogramm', 'jeder Punkt', 'denselben Abstand']) expect(text, wort).not.toContain(wort);
    const tex = texteAusHtml(html).join(' ');
    expect(tex.length).toBeGreaterThan(100);
    for (const verboten of ['\\times', '\\cdot\\vec{u}=0', '=0']) expect(tex, verboten).not.toContain(verboten);
  });
  it('verweist auf die Module davor und nutzt sie, statt Betrag, Skalarprodukt und Vektorprodukt zu wiederholen', () => {
    const quelle = readdirSync(ORDNER).filter((x) => x.endsWith('.tsx')).map((d) => readFileSync(`${ORDNER}/${d}`, 'utf8')).join('\n');
    const ids = [...quelle.matchAll(/modul="([a-z0-9-]+)"/g)].map((m) => m[1]!);
    for (const m of ['betrag-abstand-teilung', 'skalarprodukt-orthogonalitaet', 'vektorprodukt', 'gegenseitige-lage-geraden', 'geradengleichung', 'optimierung']) expect(ids, m).toContain(m);
    for (const id of ids) expect(existsSync(`content/modules/${id}/meta.json`), id).toBe(true);
  });
  it('die Zahlen der Arbeitsblätter kommen nicht vor (öffentliches Repository)', () => {
    const html = rendern(null);
    const spalten = spaltenAusTexten(texteAusHtml(html)).map((s) => s.join(','));
    // Blatt Abstand Punkt Gerade: g (0|2|3) + r (−1|−2|−1), Q(3|4|2); Blatt parallele Geraden und Blatt Drohnen: Spalten dieser Blätter
    for (const verboten of ['0,2,3', '-1,-2,-1', '1,0,1', '1,2,0', '2,2,4', '2,4,0', '0,0,0', '3,1,0', '-2,-4,-4', '1,2,2', '3,4,6', '3,6,6', '2,0,2', '4,-2.1,5', '-0.3,-0.2,0.1', '4.5,-2,5.3']) expect(spalten, verboten).not.toContain(verboten);
    const tex = texteAusHtml(html).join(' ');
    expect(tex).not.toContain('Q(3\\,|\\,4\\,|\\,2)');
    expect(tex).not.toContain('P(2\\,|\\,2\\,|\\,4)');
  });
});

describe('Daten, unabhängig nachgerechnet', () => {
  const alle: [string, Gerade, number[], number[], number, number][] = [
    ['BEISPIEL', D.BEISPIEL.g, D.BEISPIEL.Q, D.BEISPIEL.F, D.BEISPIEL.t0, D.BEISPIEL.d2],
    ['PARALLEL', D.PARALLEL.g, D.PARALLEL.h.p, D.PARALLEL.F, D.PARALLEL.t0, D.PARALLEL.d2],
    ['A_WEG1', D.A_WEG1.g, D.A_WEG1.Q, D.A_WEG1.F, D.A_WEG1.t, D.A_WEG1.d2],
    ['A_STUETZ', D.A_STUETZ.g, D.A_STUETZ.Q, plus(D.A_STUETZ.g.p, D.A_STUETZ.g.u), 1, 2],
    ['A_PARALLEL1', D.A_PARALLEL1.g, D.A_PARALLEL1.h.p, D.A_PARALLEL1.F, D.A_PARALLEL1.t, D.A_PARALLEL1.d2],
    ['A_ZEICHNEN', D.A_ZEICHNEN.g, D.A_ZEICHNEN.Q, D.A_ZEICHNEN.F, D.A_ZEICHNEN.t, 2],
    ['A_WEG2', D.A_WEG2.g, D.A_WEG2.Q, plus(D.A_WEG2.g.p, mal(D.A_WEG2.t, D.A_WEG2.g.u)), D.A_WEG2.t, 9],
    ['A_PARALLEL2', D.A_PARALLEL2.g, D.A_PARALLEL2.h.p, [1, 3, 2], D.A_PARALLEL2.t, 9],
  ];
  it('Lotfußpunkt, Parameter und Abstandsquadrat: Raster mit Verfeinerung, Vektorprodukt und Bibliothek stimmen überein, FQ steht senkrecht auf u, F liegt auf g', () => {
    for (const [name, g, q, F, t0, d2] of alle) {
      expect(plus(g.p, mal(t0, g.u)), name).toEqual(F);
      expect(pu(diff(q, F), g.u), `${name} senkrecht`).toBe(0);
      expect(pu(diff(q, F), diff(q, F)), `${name} d²`).toBe(d2);
      expect(dKreuz(g, q) ** 2, `${name} Vektorprodukt`).toBeCloseTo(d2, 9);
      expect(dRaster(g, q), `${name} Raster`).toBeCloseTo(Math.sqrt(d2), 4);
      const l = lot(g, q);
      expect([l.t, l.F, l.d2], name).toEqual([t0, F, d2]);
      expect(aufGerade(g, F)).toBe(true);
    }
  }, 60000);
  it('das Beispiel: D(t) = 3t² − 12t + 18, Scheitel t = 2, Vektorprodukt (−3 | −3 | 0), und X(1) hat den Abstand 3', () => {
    const b = D.BEISPIEL;
    expect(polyTeX(3, -12, 18)).toBe('3t^2-12t+18');
    const pq = diff(b.Q, b.g.p);
    expect(kreuz(b.g.u, pq)).toEqual([-3, -3, 0]);
    expect(betrag(diff(b.Q, b.X))).toBe(3);
    expect(plus(b.g.p, mal(b.tX, b.g.u))).toEqual(b.X);
  });
  it('die Abstände der parallelen Geraden: jeder Punkt von h hat denselben Abstand, der Abstand der Stützpunkte ist größer', () => {
    for (const [g, h] of [[D.PARALLEL.g, D.PARALLEL.h], [D.A_PARALLEL1.g, D.A_PARALLEL1.h], [D.A_PARALLEL2.g, D.A_PARALLEL2.h], [D.A_KABEL.g, D.A_KABEL.h]] as [Gerade, Gerade][]) {
      expect(betrag(kreuz(g.u, h.u))).toBe(0);
      const d = dKreuz(g, h.p);
      for (const s of [-2, -0.5, 1, 3]) expect(dKreuz(g, plus(h.p, mal(s, h.u)))).toBeCloseTo(d, 9);
      expect(betrag(diff(h.p, g.p))).toBeGreaterThan(d - 1e-9);
    }
    const i = D.A_IDENTISCH;
    expect(dKreuz(i.g, i.h.p)).toBeCloseTo(0, 9);
    expect(aufGerade(i.g, i.h.p)).toBe(true);
    expect(betrag(kreuz(i.g.u, i.h.u))).toBe(0);
  });
  it('Aufgabendaten: Fachwerte der Aufgaben 3, 4, 5, 6, 8, 11, 12', () => {
    const w3 = D.A_WEG3;
    expect(kreuz(w3.g.u, diff(w3.Q, w3.g.p))).toEqual(w3.kreuz);
    expect(dKreuz(w3.g, w3.Q)).toBeCloseTo(w3.d, 2);
    const w2 = D.A_WEG2;
    const pq = diff(w2.g.p, w2.Q);
    expect([pu(w2.g.u, w2.g.u), 2 * pu(pq, w2.g.u), pu(pq, pq)]).toEqual(w2.koeff);
    expect(dKreuz(w2.g, w2.Q)).toBe(w2.d);
    const st = D.A_STUETZ;
    expect(dKreuz(st.g, st.Q) ** 2).toBeCloseTo(2, 9);
    expect(pu(diff(st.Q, st.g.p), diff(st.Q, st.g.p))).toBe(11);
    expect(aufGerade(D.A_AUF.g, D.A_AUF.auf)).toBe(true);
    for (const x of D.A_AUF.daneben) expect(aufGerade(D.A_AUF.g, x)).toBe(false);
    expect(dKreuz(D.A_PARALLEL2.g, D.A_PARALLEL2.h.p)).toBeCloseTo(D.A_PARALLEL2.d, 9);
    const ba = D.A_BALLON;
    expect(dKreuz(ba.g, ba.Q) * ba.einheit).toBeCloseTo(ba.dMeter, 2);
    expect(dKreuz(ba.g, ba.Q) * ba.einheit - ba.radius).toBeCloseTo(ba.oberflaeche, 2);
    expect(dKreuz(ba.g, ba.Q) * ba.einheit - ba.radius).toBeLessThan(ba.mindest);
    expect(dKreuz(D.A_KABEL.g, D.A_KABEL.h.p)).toBeCloseTo(D.A_KABEL.d, 2);
  });
});

describe('Bilder', () => {
  const bilder: [string, RaumBildSpec][] = [
    ['BEISPIEL', B.RAUM_BEISPIEL],
    ['WEG3', B.RAUM_WEG3],
    ['PARALLEL', B.RAUM_PARALLEL],
    ['WEG1 Aufgabe', B.aufgWeg1],
    ['PARALLEL Aufgabe', B.aufgParallel],
    ['ZEICHNEN', B.aufgZeichnen],
  ];
  const zahlenX1 = Array.from({ length: 2 * RAUM_GRENZE + 1 }, (_, i) => i - RAUM_GRENZE).filter((k) => k !== 0).map((k) => normiert(x1ZahlMitte(k)));
  const abst = (p: number[], a: number[], b: number[]) => {
    const dx = b[0]! - a[0]!, dy = b[1]! - a[1]!, l2 = dx * dx + dy * dy;
    const u = l2 === 0 ? 0 : Math.max(0, Math.min(1, ((p[0]! - a[0]!) * dx + (p[1]! - a[1]!) * dy) / l2));
    return Math.hypot(p[0]! - a[0]! - u * dx, p[1]! - a[1]! - u * dy);
  };
  it('alle beschrifteten Punkte liegen im Koordinatensystem, keiner im Schrägbild auf einer Achse oder an derselben Bildstelle wie ein anderer, jedes Bild hat eine Textalternative, feine Darstellung', () => {
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
      expect(s.sprech.length, name).toBeGreaterThan(40);
      expect(s.fein, name).toBe(true);
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
  it('die Namen g, h, d stehen dicht an ihrer Linie in deren Farbe, mit Abstand zu allen anderen Linien und Punkten, die Linien sind durchgezogen und im Schrägbild nicht entartet', () => {
    const erwartet: [string, RaumBildSpec, string[]][] = [
      ['BEISPIEL', B.RAUM_BEISPIEL, ['g', 'd']],
      ['WEG3', B.RAUM_WEG3, ['g', 'd']],
      ['PARALLEL', B.RAUM_PARALLEL, ['g', 'h', 'd']],
      ['WEG1 Aufgabe', B.aufgWeg1, ['g', 'd']],
      ['PARALLEL Aufgabe', B.aufgParallel, ['g', 'h', 'd']],
      ['ZEICHNEN', B.aufgZeichnen, ['g', 'd']],
    ];
    for (const [name, spec, namen] of erwartet) {
      const texte2 = spec.punkte!.filter((p) => p.nurText);
      expect(texte2.map((p) => p.name), name).toEqual(namen);
      const linien = spec.linien!.map((l) => [bildpunkt(l.von), bildpunkt(l.bis)] as const);
      for (const l of spec.linien!) {
        expect(l.gestrichelt, `${name} durchgezogen`).toBeFalsy();
        expect(l.farbe, name).not.toBe('#0072B2');
      }
      for (const [a1, b1] of linien) {
        const len = Math.hypot(b1[0] - a1[0], b1[1] - a1[1]);
        expect(len, `${name} Länge`).toBeGreaterThan(1.2);
      }
      for (const tx of texte2) {
        const b = bildpunkt(tx.p);
        expect(Math.abs(b[0]) <= 6 && Math.abs(b[1]) <= 6, `${name} ${tx.name} im Bild`).toBe(true);
        expect(Math.min(...linien.map(([a1, b1]) => abst(b, a1, b1))), `${name} ${tx.name} dicht an der Linie`).toBeLessThanOrEqual(0.4);
        for (const p of spec.punkte!.filter((q) => !q.nurText)) expect(Math.hypot(bildpunkt(p.p)[0] - b[0], bildpunkt(p.p)[1] - b[1]), `${name} ${tx.name} Punkt`).toBeGreaterThan(0.6);
        expect(spec.linien!.map((l) => l.farbe), `${name} ${tx.name}`).toContain(tx.farbe);
      }
    }
  });
  it('die Geraden verlaufen im Schrägbild nicht als Punkt und nicht parallel zu einem Achsenbild (Winkel mindestens 11 Grad)', () => {
    const geraden: [string, Gerade][] = [['BEISPIEL g', D.BEISPIEL.g], ['PARALLEL g', D.PARALLEL.g], ['PARALLEL h', D.PARALLEL.h], ['A_WEG1', D.A_WEG1.g], ['A_PARALLEL1 g', D.A_PARALLEL1.g], ['A_PARALLEL1 h', D.A_PARALLEL1.h], ['A_ZEICHNEN', D.A_ZEICHNEN.g]];
    for (const [name, g] of geraden) {
      const d = [g.u[1]! - g.u[0]! / 2, g.u[2]! - g.u[0]! / 2];
      const len = Math.hypot(d[0]!, d[1]!);
      expect(len, name).toBeGreaterThan(1.2);
      for (const ax of [[-0.5, -0.5], [1, 0], [0, 1]]) expect((Math.acos(Math.min(1, Math.abs(d[0]! * ax[0]! + d[1]! * ax[1]!) / (len * Math.hypot(ax[0]!, ax[1]!)))) * 180) / Math.PI, `${name} Winkel zur Achse`).toBeGreaterThan(11);
    }
  });
  it('die Bilder zeigen, was die Rechnung sagt: F auf g, FQ senkrecht auf u, orange Strecke FQ, rosa Strecke XQ länger, Parallelogramm mit der Höhe d', () => {
    const b = D.BEISPIEL;
    const lin = B.RAUM_BEISPIEL.linien!;
    const lotL = lin.find((l) => l.farbe === D.ORANGE)!;
    expect([lotL.von, lotL.bis]).toEqual([b.F, b.Q]);
    const xq = lin.find((l) => l.farbe === D.ROSA)!;
    expect(betrag(diff(xq.bis, xq.von))).toBeGreaterThan(betrag(diff(lotL.bis, lotL.von)));
    expect(B.RAUM_WEG3.linien!.filter((l) => l.farbe === D.ROSA)).toHaveLength(3);
    const pk = (s: RaumBildSpec, n: string) => s.punkte!.find((p) => p.name === n)!.p;
    expect(pk(B.RAUM_WEG3, 'F')).toEqual(b.F);
    expect(pk(B.RAUM_WEG3, 'P')).toEqual(b.g.p);
    expect(aufGerade(D.PARALLEL.g, pk(B.RAUM_PARALLEL, 'F'))).toBe(true);
    expect(aufGerade(D.PARALLEL.h, pk(B.RAUM_PARALLEL, 'Q'))).toBe(true);
    expect(aufGerade(D.A_PARALLEL1.g, pk(B.aufgParallel, 'F'))).toBe(true);
    expect(aufGerade(D.A_PARALLEL1.h, pk(B.aufgParallel, 'Q'))).toBe(true);
    expect(pk(B.aufgWeg1, 'F')).toEqual(D.A_WEG1.F);
    expect(pk(B.aufgZeichnen, 'F')).toEqual(D.A_ZEICHNEN.F);
  });
});

describe('Labore', () => {
  it('Lotfußlabor: vier Regler, zwei Schalter, Abstand und Lotfußpunkt zunächst verborgen, ohne Schalter Ebene und Raum', () => {
    const html = renderToStaticMarkup(<Lotfusslabor />);
    expect(html.match(/type="range"/g)).toHaveLength(4);
    expect(html.match(/type="checkbox"/g)).toHaveLength(2);
    expect(html).toContain('aria-label="Darstellung wählen"');
    expect(html).not.toContain('aria-label="Ebene oder Raum wählen"');
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('Skalarprodukt');
    expect(html).not.toContain('Lotfußpunkt ist');
    expect(D.LOTLABOR.startQ).toEqual([...D.BEISPIEL.Q]);
  });
  it('Parallellabor: fünf Regler, zwei Schalter, Abstände zunächst verborgen', () => {
    const html = renderToStaticMarkup(<Parallellabor />);
    expect(html.match(/type="range"/g)).toHaveLength(5);
    expect(html.match(/type="checkbox"/g)).toHaveLength(2);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('Abstand der Stützpunkte');
  });
  it('Lotfußlabor, alle 3 773 Einstellungen: Lotfußpunkt und Abstand stimmen mit dem Vektorprodukt überein, alle Linien im Koordinatensystem, Punkte ohne Doppelungen, Lot nur mit Schalter', () => {
    let n = 0;
    const R = [-3, -2, -1, 0, 1, 2, 3];
    const g = D.LOTLABOR.g;
    for (const q1 of R) for (const q2 of R) for (const q3 of R) for (let t = D.LOTLABOR.tMin; t <= D.LOTLABOR.tMax; t += 0.5) {
      const q = [q1, q2, q3];
      const l = lot(g, q);
      expect(l.d, JSON.stringify(q)).toBeCloseTo(dKreuz(g, q), 9);
      expect(pu(diff(q, l.F), g.u)).toBeCloseTo(0, 6);
      const ohne = B.lotLaborBild(g, q, t, false);
      expect(ohne.spec.punkte!.some((p) => p.name === 'F')).toBe(false);
      expect(ohne.spec.linien!.some((x) => x.farbe === D.ORANGE)).toBe(false);
      const mit = B.lotLaborBild(g, q, t, true);
      for (const x of mit.spec.linien!) for (const c of [...x.von, ...x.bis]) expect(Math.abs(c)).toBeLessThanOrEqual(4 + 1e-9);
      const sichtbar = mit.spec.punkte!.filter((p) => !p.ohneText && !p.nurText);
      expect(new Set(mit.spec.punkte!.map((p) => p.p.join(','))).size, 'keine doppelten Raumpunkte').toBe(mit.spec.punkte!.length);
      expect(sichtbar.length).toBeGreaterThan(0);
      expect(mit.spec.sprech.length).toBeGreaterThan(40);
      n++;
    }
    expect(n).toBe(343 * 11);
  }, 120000);
  it('Parallellabor, alle Einstellungen: identisch genau dann, wenn Q auf g liegt, der Abstand von X zu g ist für alle s derselbe (Vektorprodukt), alle Linien im Koordinatensystem', () => {
    const g = D.PARLABOR.g;
    const R = [-3, -2, -1, 0, 1, 2, 3];
    let n = 0;
    for (const q1 of R) for (const q2 of R) for (const q3 of R) for (const k of [-2, -1, 1, 2]) {
      const q = [q1, q2, q3];
      const dq = dKreuz(g, q);
      const h = gerade(q, mal(k, g.u));
      for (let s = D.PARLABOR.sMin; s <= D.PARLABOR.sMax; s += 0.5) {
        const X = plus(h.p, mal(s, h.u));
        expect(dKreuz(g, X)).toBeCloseTo(dq, 9);
        const r = B.parLaborBild(g, q, k, s, true);
        expect(r.identisch, JSON.stringify([q, k, s])).toBe(dq < 1e-9);
        for (const x of r.spec.linien!) for (const c of [...x.von, ...x.bis]) expect(Math.abs(c)).toBeLessThanOrEqual(4 + 1e-9);
        expect(new Set(r.spec.punkte!.map((p) => p.p.join(','))).size).toBe(r.spec.punkte!.length);
        n++;
      }
    }
    expect(n).toBe(343 * 4 * 9);
  }, 120000);
});

describe('Aufgaben', () => {
  it('14 Aufgaben: acht mit Eingabefeldern (2, 3, 4, 7, 8, 10, 11, 12), fünf Auswahlfragen (1, 5, 6, 9, 14) und eine Zeichenaufgabe (13)', () => {
    const html = rendern('ueberpruefen');
    expect(aufgaben.map((a) => a.nummer)).toEqual(['2', '3', '4', '7', '8', '10', '11', '12']);
    expect(fragen.map((f) => f.nummer)).toEqual(['1', '5', '6', '9', '14']);
    expect(html).toContain('Aufgabe 13: Das Lot zeichnen');
  });
  it('Aufgabe 2: t, F und d² stimmen mit der unabhängigen Rechnung überein, FQ steht senkrecht auf u', () => {
    rendern('ueberpruefen');
    const [p, u] = spaltenAus(aufgabe('2').children);
    const Q = punktAus(aufgabe('2').children, 'Q')!;
    const g = gerade(p!, u!);
    expect(wert('2', 't')).toBe(pu(diff(Q, p!), u!) / pu(u!, u!));
    const F = plus(p!, mal(wert('2', 't'), u!));
    expect([wert('2', 'f1'), wert('2', 'f2'), wert('2', 'f3')]).toEqual(F);
    expect(pu(diff(Q, F), u!)).toBe(0);
    expect(wert('2', 'd2')).toBeCloseTo(dKreuz(g, Q) ** 2, 9);
    expect(dRaster(g, Q) ** 2).toBeCloseTo(wert('2', 'd2'), 3);
  });
  it('Aufgabe 3: das Vektorprodukt und der Abstand (auf zwei Nachkommastellen) stimmen', () => {
    rendern('ueberpruefen');
    const [p, u] = spaltenAus(aufgabe('3').children);
    const Q = punktAus(aufgabe('3').children, 'Q')!;
    expect([wert('3', 'k1'), wert('3', 'k2'), wert('3', 'k3')]).toEqual(kreuz(u!, diff(Q, p!)));
    expect(wert('3', 'd')).toBeCloseTo(dKreuz(gerade(p!, u!), Q), 2);
    expect(aufgabe('3').felder.find((f) => f.id === 'd')!.toleranz).toBe(0.01);
  });
  it('Aufgabe 4: D(t) = a t² + b t + c mit den Koeffizienten aus dem Aufgabentext, der Scheitel und der Abstand stimmen', () => {
    rendern('ueberpruefen');
    const [p, u] = spaltenAus(aufgabe('4').children);
    const Q = punktAus(aufgabe('4').children, 'Q')!;
    const pq = diff(p!, Q);
    expect([wert('4', 'a'), wert('4', 'b'), wert('4', 'c')]).toEqual([pu(u!, u!), 2 * pu(pq, u!), pu(pq, pq)]);
    expect(wert('4', 't')).toBe(-wert('4', 'b') / (2 * wert('4', 'a')));
    expect(wert('4', 'd')).toBeCloseTo(dKreuz(gerade(p!, u!), Q), 9);
    // Raster: D(t) hat bei t0 das Minimum
    const D = (t: number) => betrag(diff(plus(p!, mal(t, u!)), Q)) ** 2;
    for (const dt of [-0.5, 0.5, 1]) expect(D(wert('4', 't') + dt)).toBeGreaterThan(D(wert('4', 't')));
  });
  it('Auswahl 5: die richtige Antwort ist der Abstand, die falschen sind Stützpunktabstand, Abstand zu g(3) und Betrag von u (alle unabhängig nachgerechnet)', () => {
    rendern('ueberpruefen');
    const [p, u] = spaltenAus(frage('5').children);
    const Q = punktAus(frage('5').children, 'Q')!;
    const g = gerade(p!, u!);
    const d = dKreuz(g, Q);
    const erwartet = [d, betrag(diff(Q, p!)), betrag(diff(Q, plus(p!, mal(3, u!)))), betrag(u!)];
    const gefunden = frage('5').optionen.map((o) => {
      const h = alsText(o.text);
      return h;
    });
    expect(gefunden).toHaveLength(4);
    const richtig = frage('5').optionen.find((o) => o.richtig)!;
    expect(alsText(richtig.text)).toContain(String(Math.round(d * 100) / 100).replace('.', '{,}'));
    for (const e of erwartet.slice(1)) expect(Math.abs(e - d)).toBeGreaterThan(0.05);
    expect(frage('5').optionen.filter((o) => o.richtig)).toHaveLength(1);
  });
  it('Auswahl 6: genau ein Punkt liegt auf g (Abstand 0), die anderen haben einen Abstand größer als 0, wie in der Rückmeldung genannt', () => {
    rendern('ueberpruefen');
    const [p, u] = spaltenAus(frage('6').children);
    const g = gerade(p!, u!);
    let richtige = 0;
    for (const o of frage('6').optionen) {
      const m = /\((-?\d+)\\,\|\\,(-?\d+)\\,\|\\,(-?\d+)\)/.exec(texte(o.text).join(''))!;
      const X = [Number(m[1]), Number(m[2]), Number(m[3])];
      expect(aufGerade(g, X), o.id).toBe(o.richtig);
      if (aufGerade(g, X)) richtige++;
      else {
        const rueck = texte(o.rueckmeldung).join(' ');
        expect(rueck).toContain(`d\\approx ${String(Math.round(dKreuz(g, X) * 100) / 100).replace('.', '{,}')}`);
      }
    }
    expect(richtige).toBe(1);
  });
  it('Aufgabe 7: die Geraden sind parallel (k), t₀ und d² stimmen, Q liegt nicht auf g', () => {
    rendern('ueberpruefen');
    const [p, u, q, v] = spaltenAus(aufgabe('7').children);
    expect(kreuz(u!, v!)).toEqual([0, 0, 0]);
    expect(mal(wert('7', 'k'), u!)).toEqual(v);
    const g = gerade(p!, u!);
    expect(wert('7', 't')).toBe(pu(diff(q!, p!), u!) / pu(u!, u!));
    expect(wert('7', 'd2')).toBeCloseTo(dKreuz(g, q!) ** 2, 9);
    expect(aufGerade(g, q!)).toBe(false);
  });
  it('Aufgabe 8: parallele Geraden, t₀ und d unabhängig bestätigt', () => {
    rendern('ueberpruefen');
    const [p, u, q, v] = spaltenAus(aufgabe('8').children);
    expect(kreuz(u!, v!)).toEqual([0, 0, 0]);
    expect(wert('8', 't')).toBe(pu(diff(q!, p!), u!) / pu(u!, u!));
    expect(wert('8', 'd')).toBeCloseTo(dKreuz(gerade(p!, u!), q!), 9);
    expect(dRaster(gerade(p!, u!), q!)).toBeCloseTo(wert('8', 'd'), 4);
  });
  it('Auswahl 9: identische Geraden (Vielfache, Q auf g), Abstand 0, der Stützpunktabstand wird als falsche Antwort genannt', () => {
    rendern('ueberpruefen');
    const [p, u, q, v] = spaltenAus(frage('9').children);
    expect(kreuz(u!, v!)).toEqual([0, 0, 0]);
    expect(aufGerade(gerade(p!, u!), q!)).toBe(true);
    expect(frage('9').optionen.find((o) => o.richtig)!.id).toBe('a');
    const stuetz = betrag(diff(q!, p!));
    expect(alsText(frage('9').optionen.find((o) => o.id === 'b')!.text)).toContain(String(Math.round(stuetz * 100) / 100).replace('.', '{,}'));
  });
  it('Aufgabe 10: nur für a = 1 steht FQ senkrecht auf u (Lotfußpunkt g(1))', () => {
    rendern('ueberpruefen');
    const [p, u] = spaltenAus(aufgabe('10').children);
    const g = gerade(p!, u!);
    const F = plus(p!, mal(1, u!));
    const gut: number[] = [];
    for (let a = -30; a <= 30; a++) if (pu(diff([a, 3, 1], F), u!) === 0) gut.push(a);
    expect(gut).toEqual([wert('10', 'a')]);
    expect(lot(g, [wert('10', 'a'), 3, 1]).t).toBe(1);
  });
  it('Aufgabe 11: Abstand des Mittelpunkts und der Oberfläche in Metern (Vektorprodukt, Raster), der Mindestabstand wird unterschritten', () => {
    rendern('ueberpruefen');
    const [p, u] = spaltenAus(aufgabe('11').children);
    const Q = punktAus(aufgabe('11').children, 'Q')!;
    const g = gerade(p!, u!);
    const dm = dKreuz(g, Q) * 10;
    expect(wert('11', 'dm')).toBeCloseTo(dm, 2);
    expect(wert('11', 'ob')).toBeCloseTo(dm - 1.5, 2);
    expect(dRaster(g, Q) * 10).toBeCloseTo(dm, 3);
    expect(dm - 1.5).toBeLessThan(D.A_BALLON.mindest);
    expect(aufgabe('11').felder.every((f) => f.toleranz === 0.01)).toBe(true);
    expect(alsText(aufgabe('11').loesung)).toContain('unterschritten');
  });
  it('Aufgabe 12: parallele Kabel, Abstand in Metern', () => {
    rendern('ueberpruefen');
    const [p, u, q, v] = spaltenAus(aufgabe('12').children);
    expect(kreuz(u!, v!)).toEqual([0, 0, 0]);
    expect(wert('12', 'd')).toBeCloseTo(dKreuz(gerade(p!, u!), q!), 2);
  });
  it('Aufgabe 13: Lotfußpunkt der Zeichenaufgabe stimmt mit dem Kontrollbild überein', () => {
    const html = rendern('ueberpruefen');
    expect(html).toContain('Aufgabe 13: Das Lot zeichnen');
    const l = lot(D.A_ZEICHNEN.g, D.A_ZEICHNEN.Q);
    expect(l.F).toEqual([...D.A_ZEICHNEN.F]);
    expect(texteAusHtml(html).join(' ')).toContain('F(1\\,|\\,-1\\,|\\,2)');
  });
  it('Auswahl 14: genau eine richtige Antwort (Weg 1 und Weg 2, nicht Weg 3)', () => {
    rendern('ueberpruefen');
    expect(frage('14').optionen.find((o) => o.richtig)!.id).toBe('a');
  });
  it('alle Auswahlfragen: genau eine richtige Antwort, die Position wechselt, jede Option hat eine Rückmeldung, alle Texte ohne Formelfehler, Gedankenstriche und Brüche mit Schrägstrich, Hilfen und Lösungsschritte vorhanden', () => {
    rendern('ueberpruefen');
    const a = [...aufgaben];
    const f = [...fragen];
    const positionen = f.map((x) => x.optionen.findIndex((o) => o.richtig));
    expect(new Set(positionen).size).toBeGreaterThan(2);
    const knoten: ReactNode[] = [];
    for (const x of f) {
      expect(x.optionen.filter((o) => o.richtig), x.nummer).toHaveLength(1);
      expect(x.optionen, x.nummer).toHaveLength(4);
      for (const o of x.optionen) knoten.push(o.text, o.rueckmeldung);
      knoten.push(x.erklaerung, x.children);
    }
    for (const x of a) knoten.push(x.children, ...x.hilfen, ...x.loesung, ...x.felder.map((fl) => fl.beschriftung));
    for (const k of knoten) {
      const h = alsText(k);
      expect(h).not.toContain('formel-fehler');
      expect(h).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(h).not.toContain(z);
      expect(h).not.toMatch(/\d\/\d/);
      expect(h.replace(/<[^>]*>/g, '').trim().length).toBeGreaterThan(0);
    }
    for (const x of a) {
      expect(x.hilfen.length, x.nummer).toBeGreaterThanOrEqual(2);
      expect(x.loesung.length, x.nummer).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('Drei Wege und Zusammenfassung', () => {
  it('alle drei Wege führen im Text auf dasselbe Ergebnis: Lotfußpunkt (3 | −3 | 0) und d = √6', () => {
    const html = rendern('wege');
    const tex = texteAusHtml(html).join(' ');
    expect(html).not.toContain('formel-fehler');
    expect(tex).toContain('F(3\\,|\\,-3\\,|\\,0)');
    expect(tex).toContain('\\sqrt{6}');
    expect(tex).toContain('\\sqrt{18}');
    expect(tex).toContain('3t^2-12t+18');
    expect(html).toContain('Weg 1');
    expect(html).toContain('Weg 2');
    expect(html).toContain('Weg 3');
    expect(html).toContain('Achtung');
  });
  it('die Zusammenfassung enthält die Merksätze und das Beispiel ohne Formelfehler', () => {
    const html = rendern('zusammenfassung');
    expect(html).not.toContain('formel-fehler');
    for (const wort of ['Abstand und Lotfußpunkt', 'Die drei Wege', 'Abstand paralleler Geraden', 'Häufige Fehler', 'Kontrolle mit Weg 3']) expect(html, wort).toContain(wort);
  });
});
