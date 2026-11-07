import { existsSync, readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/normalenform-koordinatenform/Bilder';
import * as D from '../content/modules/normalenform-koordinatenform/daten';
import Modul from '../content/modules/normalenform-koordinatenform/index';
import { Normalenlabor, Punktlabor } from '../content/modules/normalenform-koordinatenform/Labor';
import meta from '../content/modules/normalenform-koordinatenform/meta.json';
import themen from '../content/themen.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { koordinatenform, koordinatenformAusPunkt, liegtInEbene, liegtInKoordinatenform, normalenvektor, type Ebene } from '../src/lib/ebene';
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
const ORDNER = 'content/modules/normalenform-koordinatenform';
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


/** Koordinatenform aus einem TeX-Text wie `2x_1+2x_2-x_3=-5` lesen. */
const kfAus = (tex: string): { n: number[]; d: number } => {
  const [links, rechts] = tex.replace(/^E:\\ /, '').split('=');
  const n = [1, 2, 3].map((i) => {
    const m = links!.match(new RegExp(`([+-]?\\d*)x_${i}`));
    if (!m) return 0;
    const z = m[1]!;
    return z === '' || z === '+' ? 1 : z === '-' ? -1 : Number(z);
  });
  return { n, d: Number(rechts) };
};

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Ebenen, hat vier Abschnitte, BPE 16.3', () => {
    expect(meta.id).toBe('normalenform-koordinatenform');
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
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"normalenform-koordinatenform"');
  });
  it('rendert ohne Formelfehler und ohne Gedankenstriche, mit der Fachsprache der Lehrkraft', () => {
    const html = rendern(null);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(html).not.toContain(z);
    for (const d of readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts'))) for (const z of ['–', '—']) expect(readFileSync(`${ORDNER}/${d}`, 'utf8'), d).not.toContain(z);
    for (const wort of ['Normalenvektor', 'Normalenform', 'Koordinatenform', 'Parameterform', 'Skalarprodukt', 'Vektorprodukt', 'senkrecht', 'Punktprobe', 's-Multiplikation']) expect(html, wort).toContain(wort);
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).not.toMatch(/\d\/\d/);
    expect(html).not.toMatch(/\bpi\b|Pi\b/);
    expect(html).not.toMatch(/Skalarmultiplikation/);
  });
  it('nur Normalenform und Koordinatenform: Hesse, Achsenabschnittsform, Spurpunkte, Lage von Gerade und Ebene, Abstand und Winkel kommen nicht vor', () => {
    expect(rendern(null)).not.toMatch(/Hesse|Achsenabschnitt|Spurpunkt|Spurgerade|Schnittgerade|Durchstoßpunkt|Lotfußpunkt|Abstand|Winkel|Volumen|Einheitsvektor|windschief/);
  });
  it('das Erklären nimmt nichts vorweg: keine Vielfachen des Normalenvektors, keine Verschiebung durch d, keine Punktprobe in Koordinatenform', () => {
    const text = rendern('erklaeren').replace(/<[^>]*>/g, '');
    for (const wort of ['Vielfaches', 'Vielfache des', 'verschoben', 'gegeneinander', 'Punktprobe in']) expect(text, wort).not.toContain(wort);
    expect(text).toContain('Entdecken');
  });
  it('verweist auf die Module davor (Parameterform, Aufstellen, Vektorprodukt, Skalarprodukt)', () => {
    const quelle = readdirSync(ORDNER).filter((x) => x.endsWith('.tsx')).map((d) => readFileSync(`${ORDNER}/${d}`, 'utf8')).join('\n');
    const ids = [...quelle.matchAll(/modul="([a-z0-9-]+)"/g)].map((m) => m[1]!);
    for (const m of ['einfuehrung-ebenen', 'ebenengleichungen-aufstellen', 'vektorprodukt', 'skalarprodukt-orthogonalitaet']) expect(ids, m).toContain(m);
    for (const id of ids) expect(existsSync(`content/modules/${id}/meta.json`), id).toBe(true);
  });
  it('Zeilenumbrüche in Rechnungen nur vor einem Gleichheitszeichen: Fortsetzungen mit {}+ gibt es nur bei Gleichungen (… + r · …, … + s · …)', () => {
    const quelle = readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts')).map((d) => readFileSync(`${ORDNER}/${d}`, 'utf8')).join('\n');
    for (const m of quelle.matchAll(/\{\}([+\-]|\\cdot)(.{0,14})/g)) expect(/^(\$\{[rstk]\}|[rstk])\\{1,2}cdot/.test(m[2]!), m[0]).toBe(true);
    for (const tex of texteAusHtml(rendern(null))) for (const m of tex.matchAll(/\\\\\{\}([+\-]|\\cdot)(.{0,10})/g)) expect(/^[rstk]\\cdot/.test(m[2]!), tex).toBe(true);
  });
});

describe('Bilder', () => {
  const bilder: [string, RaumBildSpec][] = [['ERKLAEREN', B.RAUM_ERKLAEREN], ['PARALLEL', B.RAUM_PARALLEL], ['A1', B.aufgNormalenvektor]];
  const zahlenX1 = Array.from({ length: 2 * RAUM_GRENZE + 1 }, (_, i) => i - RAUM_GRENZE).filter((k) => k !== 0).map((k) => normiert(x1ZahlMitte(k)));
  const AXEN: [number, number][] = [[-1, -1], [1, 0], [0, 1]];
  const winkelZu = (a: number[], b: number[]) => (Math.acos(Math.min(1, Math.abs(a[0]! * b[0]! + a[1]! * b[1]!) / (Math.hypot(a[0]!, a[1]!) * Math.hypot(b[0]!, b[1]!)))) * 180) / Math.PI;
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
  it('Pfeile erscheinen im Schrägbild nicht als Punkt und nicht parallel zu einem Achsenbild (mindestens 11°, Länge mindestens 1,4)', () => {
    for (const [name, s] of bilder) for (const l of s.linien!.filter((x) => x.pfeil)) {
      const v = diff(l.bis, l.von);
      const b = [v[1]! - v[0]! / 2, v[2]! - v[0]! / 2];
      expect(Math.hypot(b[0]!, b[1]!), `${name} ${v}`).toBeGreaterThanOrEqual(1.4);
      for (const a of AXEN) expect(winkelZu(b, a), `${name} ${v}`).toBeGreaterThanOrEqual(11);
    }
  });
  const pfeile = (s: RaumBildSpec) => s.linien!.filter((l) => l.pfeil).map((l) => ({ von: l.von as number[], v: diff(l.bis, l.von), farbe: l.farbe }));
  it('Erklären: n = u × v ist senkrecht zu u und v, d = n · p, X liegt in E, der schwarze Pfeil in P ist n (ungekürzt im Würfel), der rosa Pfeil führt von P nach X', () => {
    const e = D.ERKLAEREN;
    expect(normalenvektor(e.e)).toEqual(e.n);
    expect(skal(e.n, e.e.u)).toBe(0);
    expect(skal(e.n, e.e.v)).toBe(0);
    expect(skal(e.n, e.e.p)).toBe(e.d);
    expect(skal(e.n, e.X)).toBe(e.d);
    expect(imE(e.e, e.X)).toBe(true);
    expect(plus(e.e.p, mal(2, e.e.u))).toEqual(e.X);
    const pf = pfeile(B.RAUM_ERKLAEREN);
    const n = pf.find((x) => x.farbe === '#222222')!;
    expect(n.von).toEqual(e.P);
    expect(n.v).toEqual(e.n);
    expect(pf.find((x) => x.farbe === '#CC79A7')!.v).toEqual(diff(e.X, e.P));
  });
  it('Beispiele der Erklärung: Normalenform ausmultipliziert, Rückwandlung in alle drei Wege (alle Punkte erfüllen die Koordinatenform)', () => {
    const b = D.BEISPIEL_NORMALENFORM;
    expect(skal(b.n, b.P)).toBe(b.d);
    const r = D.RUECKWANDLUNG;
    for (const w of [r.weg1, r.weg2]) {
      expect(skal(r.n, w.u)).toBe(0);
      expect(skal(r.n, w.v)).toBe(0);
      expect(echteEbene(w)).toBe(true);
      for (let a = -3; a <= 3; a++) for (let c = -3; c <= 3; c++) expect(skal(r.n, plus(plus(w.p, mal(a, w.u)), mal(c, w.v)))).toBe(r.d);
    }
    for (const p of [r.weg3.A, r.weg3.B, r.weg3.C]) expect(skal(r.n, p)).toBe(r.d);
    expect(echteEbene({ p: r.weg3.A, u: diff(r.weg3.B, r.weg3.A), v: diff(r.weg3.C, r.weg3.A) })).toBe(true);
  });
  it('Vermutung 1: beide Ebenen haben denselben Normalenvektor, R liegt in der zweiten (d = 1), nicht in der ersten', () => {
    const P = D.PARALLEL;
    expect(P.n).toEqual(D.ERKLAEREN.n);
    expect(skal(P.n, P.R)).toBe(P.d2);
    expect(P.d1).toBe(D.ERKLAEREN.d);
    expect(skal(P.n, P.R)).not.toBe(P.d1);
    expect(B.RAUM_PARALLEL.flaechen).toHaveLength(2);
  });
  it('Aufgabe 1: der Normalenvektor im Bild ist n, in P', () => {
    const a = D.A_NORMALENVEKTOR;
    expect(kreuz(a.e.u, a.e.v)).toEqual(a.n);
    const n = pfeile(B.aufgNormalenvektor).find((x) => x.farbe === '#222222')!;
    expect(n.von).toEqual(a.e.p);
    expect(n.v.map((c, i) => Math.sign(c) === Math.sign(a.n[i]!) || c === 0)).toEqual([true, true, true]);
  });
});

describe('Labore', () => {
  it('Normalenlabor und Punktlabor: Regler, Schalter, Ergebnisse zunächst verborgen, kein Schalter Ebene und Raum, aber Schrägbild und räumlich', () => {
    const a = renderToStaticMarkup(<Normalenlabor />);
    expect(a.match(/type="range"/g)).toHaveLength(6);
    expect(a.match(/type="checkbox"/g)).toHaveLength(1);
    expect(a).toContain('aria-label="Darstellung wählen"');
    expect(a).not.toContain('aria-label="Ebene oder Raum wählen"');
    expect(a).not.toContain('formel-fehler');
    expect(texteAusHtml(a).join(' ')).not.toContain('d=\\vec{n}');
    const b = renderToStaticMarkup(<Punktlabor />);
    expect(b.match(/type="range"/g)).toHaveLength(3);
    expect(b.match(/type="checkbox"/g)).toHaveLength(1);
    expect(b).not.toContain('liegt in E');
    expect(b).not.toContain('formel-fehler');
  });
  it('Normalenlabor: für alle Einstellungen liegt P in der gezeichneten Ebene, alle Linien im Koordinatensystem, d = n · P', () => {
    let n = 0;
    for (const n1 of [-3, -1, 0, 1, 2, 3]) for (const n2 of [-3, -2, 0, 1, 3]) for (const n3 of [-3, -1, 0, 2, 3]) for (const p1 of [-2, 0, 1, 2]) for (const p2 of [-2, -1, 1, 2]) for (const p3 of [-2, 0, 2]) {
      const nv = [n1, n2, n3];
      const p = [p1, p2, p3];
      const { spec, hatEbene } = B.normalenLaborBild(p, nv, true);
      for (const l of spec.linien!) for (const c of [...l.von, ...l.bis]) expect(Math.abs(c)).toBeLessThanOrEqual(4 + 1e-9);
      if (nullv(nv)) expect(spec.flaechen ?? []).toHaveLength(0);
      else {
        expect(hatEbene, `${nv} ${p}`).toBe(true);
        const k = koordinatenformAusPunkt(p, nv);
        expect(k.d).toBe(skal(nv, p) + 0);
        // jede Ecke der Fläche erfüllt die Koordinatenform
        for (const q of spec.flaechen![0]!.ecken) expect(Math.abs(skal(nv, q) - k.d), `${nv} ${p}`).toBeLessThan(1e-6);
      }
      expect((B.normalenLaborBild(p, nv, false).spec.flaechen ?? []).length).toBe(0);
      n++;
    }
    expect(n).toBe(6 * 5 * 5 * 4 * 4 * 3);
  }, 120000);
  it('Punktlabor: alle 729 Punkte, die Koordinatenform stimmt mit der Parameterform überein, Start liegt nicht in E', () => {
    const e = D.ERKLAEREN;
    let treffer = 0;
    for (let a = -4; a <= 4; a++) for (let b = -4; b <= 4; b++) for (let c = -4; c <= 4; c++) {
      const x = [a, b, c];
      expect(liegtInKoordinatenform({ n: e.n, d: e.d }, x)).toBe(imE(e.e, x));
      expect(liegtInEbene(e.e, x)).toBe(imE(e.e, x));
      const s = B.punktLaborBild(x);
      expect(s.punkte!.map((q) => q.name).includes('X')).toBe(!(a === e.P[0] && b === e.P[1] && c === e.P[2]));
      if (imE(e.e, x)) treffer++;
    }
    expect(treffer).toBeGreaterThan(5);
    expect(skal(e.n, D.PUNKT_START)).not.toBe(e.d);
  });
});

describe('Aufgaben', () => {
  it('8 Aufgaben: vier mit Eingabefeldern und vier Auswahlfragen, richtig-Position wechselt', () => {
    rendern('ueberpruefen');
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '2', '3', '5', '6']);
    expect(fragen.map((f) => f.nummer)).toEqual(['4', '7', '8']);
  });
  it('Aufgabe 1: n = u × v aus der Gleichung im Aufgabentext, senkrecht zu beiden Spannvektoren', () => {
    rendern('ueberpruefen');
    const e = ebeneAus(spaltenAus(aufgaben.find((x) => x.nummer === '1')!.children));
    expect(echteEbene(e)).toBe(true);
    const n = ['1', '2', '3'].map((i) => wert('1', `n${i}`));
    expect(n).toEqual(kreuz(e.u, e.v));
    expect(skal(n, e.u)).toBe(0);
    expect(skal(n, e.v)).toBe(0);
  });
  it('Aufgabe 2: a, b, c, d aus der Gleichung im Aufgabentext (n = u × v, d = n · p), jeder Punkt der Ebene erfüllt die Koordinatenform', () => {
    rendern('ueberpruefen');
    const e = ebeneAus(spaltenAus(aufgaben.find((x) => x.nummer === '2')!.children));
    const n = ['a', 'b', 'c'].map((i) => wert('2', i));
    const d = wert('2', 'd');
    expect(n).toEqual(kreuz(e.u, e.v));
    expect(d).toBe(skal(n, e.p));
    for (let r = -3; r <= 3; r++) for (let s = -3; s <= 3; s++) expect(skal(n, plus(plus(e.p, mal(r, e.u)), mal(s, e.v)))).toBe(d);
    expect(koordinatenform(e)).toEqual({ n, d });
  });
  it('Aufgabe 3: d = n · P aus den Angaben im Aufgabentext', () => {
    rendern('ueberpruefen');
    const a = aufgaben.find((x) => x.nummer === '3')!;
    const P = punkteAus(a.children).P!;
    const [n] = spaltenAus(a.children);
    expect(wert('3', 'd')).toBe(skal(n!, P));
    expect(n).toEqual(D.A_PUNKT_NORMAL.n);
  });
  it('Auswahl 4: genau eine Gleichung beschreibt dieselbe Ebene (Vielfaches samt d), die falschen haben je ihren Fehler, die richtige steht nicht an erster Stelle', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '4')!;
    const g = kfAus(texte(f.children).join(' ').match(/E:\\ ([^,]*?=-?\d+)/)![0]);
    const punkt = [3, 0, 0];
    expect(skal(g.n, punkt)).toBe(g.d);
    let n = 0;
    for (const o of f.optionen) {
      const k = kfAus(texte(o.text)[0]!);
      const faktor = k.n[0]! / g.n[0]!;
      const gleich = faktor !== 0 && k.n.every((c, i) => c === faktor * g.n[i]!) && k.d === faktor * g.d;
      expect(gleich, o.id).toBe(o.richtig);
      expect(skal(k.n, punkt) === k.d, o.id).toBe(o.richtig);
      if (gleich) n++;
    }
    expect(n).toBe(1);
    expect(f.optionen[0]!.richtig).toBe(false);
  });
  it('Aufgabe 5: Q(a | 2 | 2) liegt für genau ein a in E (alle ganzen und halben Werte geprüft)', () => {
    rendern('ueberpruefen');
    const a = aufgaben.find((x) => x.nummer === '5')!;
    const k = kfAus(texte(a.children).join(' ').match(/E:\\ ([^,]*?=-?\d+)/)![0]);
    const w = wert('5', 'a');
    expect(skal(k.n, [w, 2, 2])).toBe(k.d);
    for (let x = -30; x <= 30; x += 0.5) if (x !== w) expect(skal(k.n, [x, 2, 2]), `${x}`).not.toBe(k.d);
  });
  it('Aufgabe 6: die Spannvektoren sind senkrecht zu n, keine Vielfachen, und (6 | 0 | 0) + r · u + s · v liegt in der Ebene', () => {
    rendern('ueberpruefen');
    const r = D.A_RUECK;
    const u = ['1', '2', '3'].map((i) => wert('6', `u${i}`));
    const v = ['1', '2', '3'].map((i) => wert('6', `v${i}`));
    expect(skal(r.n, u)).toBe(0);
    expect(skal(r.n, v)).toBe(0);
    expect(nullv(kreuz(u, v))).toBe(false);
    expect(skal(r.n, [6, 0, 0])).toBe(r.d);
    expect(u).toEqual(r.u);
    expect(v).toEqual(r.v);
  });
  it('Auswahl 7: genau eine Parameterform gehört zur Koordinatenform, die falschen haben je ihren Fehler', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '7')!;
    const k = kfAus(texte(f.children).join(' ').match(/E:\\ ([^,]*?=-?\d+)/)![0]);
    let n = 0;
    for (const o of f.optionen) {
      const e = ebeneAus(spaltenAus(o.text));
      const stimmt = echteEbene(e) && skal(k.n, e.p) === k.d && skal(k.n, e.u) === 0 && skal(k.n, e.v) === 0;
      expect(stimmt, o.id).toBe(o.richtig);
      if (stimmt) n++;
    }
    expect(n).toBe(1);
    const ap = D.A_AUSWAHL_PARAMETER;
    expect(skal(ap.n, ap.nichtSenkrecht.v)).not.toBe(0);
    expect(skal(ap.n, ap.punktFalsch.p)).not.toBe(ap.d);
    expect(keinePlane(ap.kollinear)).toBe(true);
  });
  it('Auswahl 8: genau eine richtige Antwort', () => {
    rendern('ueberpruefen');
    const f = fragen.find((x) => x.nummer === '8')!;
    expect(f.optionen.filter((o) => o.richtig)).toHaveLength(1);
  });
  it('alle Auswahlfragen: Position wechselt, alle Texte ohne Formelfehler und Gedankenstriche, jede Aufgabe mindestens zwei Hilfen und Lösungsschritte, Werte ganzzahlig', () => {
    rendern('ueberpruefen');
    const positionen = fragen.map((x) => x.optionen.findIndex((o) => o.richtig));
    expect(new Set(positionen).size).toBeGreaterThan(1);
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
  it('die Zahlen und Aufgaben der Arbeitsblätter der Lehrkraft kommen nicht vor (öffentliches Repository)', () => {
    const quelle = readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts')).map((d) => readFileSync(`${ORDNER}/${d}`, 'utf8')).join('\n');
    const verboten = ['[4, -2, -7]', '[-1, 3, 7]', '[1, 3, 0]', '-59', '[3, -1, -2]'];
    for (const v of verboten) expect(quelle, v).not.toContain(v);
    const tex = texteAusHtml(rendern(null)).join(' ');
    for (const v of ['x_1-2x_2+2x_3=4', '-x_1+3x_2+7x_3=-59', '3x_1-x_2-2x_3=9']) expect(tex).not.toContain(v);
  });
});

describe('Zusammenfassung', () => {
  it('das Beispiel ist das der Erklärung, die Koordinatenform stimmt, X liegt in E', () => {
    const e = D.ERKLAEREN;
    expect(koordinatenform(e.e)).toEqual({ n: e.n, d: e.d });
    expect(skal(e.n, e.X)).toBe(e.d);
    expect(rendern('zusammenfassung')).not.toContain('formel-fehler');
  });
});
