import { existsSync, readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/gegenseitige-lage-geraden/Bilder';
import * as D from '../content/modules/gegenseitige-lage-geraden/daten';
import Modul from '../content/modules/gegenseitige-lage-geraden/index';
import { Gleichsetzlabor, Lagelabor } from '../content/modules/gegenseitige-lage-geraden/Labor';
import meta from '../content/modules/gegenseitige-lage-geraden/meta.json';
import { linTeX, loesungsweg, summeTeX, zeileTeX } from '../content/modules/gegenseitige-lage-geraden/rechenhilfen';
import themen from '../content/themen.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { lageZweier, type Gerade } from '../src/lib/gerade';
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
const ORDNER = 'content/modules/gegenseitige-lage-geraden';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
/** Die schmale Form einer Umbruchformel enthält dieselben Zahlen noch einmal und wird für das Auslesen der Zahlen weggelassen. */
const ohneSchmal = (h: string) => h.replace(/<div class="formel-schmal">[\s\S]*?<\/div>/g, '');
const texteAusHtml = (html: string): string[] => [...ohneSchmal(html).matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<'));
const texte = (n: ReactNode): string[] => texteAusHtml(alsText(n));
const zahl = (s: string) => Number(s.replace(/\{,\}/g, '.'));
const spaltenAus = (n: ReactNode): number[][] =>
  [...texte(n).join(' ').matchAll(/\\begin\{pmatrix\*?\}(?:\[r\])?(.*?)\\end\{pmatrix\*?\}/g)].map((m) => m[1]!.split('\\\\').map(zahl)).filter((s) => s.every((x) => Number.isFinite(x)));
const wert = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!.erwartet;
const frage = (nr: string) => fragen.find((f) => f.nummer === nr)!;
const aufgabe = (nr: string) => aufgaben.find((a) => a.nummer === nr)!;

/* Unabhängige Methoden: Vektorprodukt und Spatprodukt, nicht das Gleichungssystem der Bibliothek. */
const kreuz = (a: number[], b: number[]): number[] => [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!].map((x) => x + 0);
const punktp = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i]!, 0);
const diff = (b: number[], a: number[]) => b.map((x, i) => x - a[i]!);
const plus = (a: number[], b: number[]) => a.map((x, i) => x + b[i]!);
const mal = (k: number, v: number[]) => v.map((x) => x * k);
const nullv = (v: number[]) => v.every((x) => Math.abs(x) < 1e-9);
const aufGerade = (g: Gerade, x: number[]) => nullv(kreuz(diff(x, g.p), g.u));
const lageSpat = (g: Gerade, h: Gerade): string => {
  if (nullv(kreuz(g.u, h.u))) return nullv(kreuz(diff(h.p, g.p), g.u)) ? 'identisch' : 'parallel';
  return Math.abs(punktp(diff(h.p, g.p), kreuz(g.u, h.u))) < 1e-9 ? 'schneidend' : 'windschief';
};
const gerade = (p: number[], u: number[]): Gerade => ({ p, u });
/** Löst t·u − s·v = q − p mit zwei Gleichungen (Cramer) und prüft die dritte, unabhängig von der Bibliothek. */
function schnittCramer(g: Gerade, h: Gerade): { t: number; s: number; S: number[] } | null {
  const z = [0, 1, 2].map((i) => [g.u[i]!, -h.u[i]!, h.p[i]! - g.p[i]!]);
  for (const [i, j] of [[0, 1], [0, 2], [1, 2]] as const) {
    const det = z[i]![0]! * z[j]![1]! - z[i]![1]! * z[j]![0]!;
    if (det === 0) continue;
    const t = (z[i]![2]! * z[j]![1]! - z[i]![1]! * z[j]![2]!) / det;
    const s = (z[i]![0]! * z[j]![2]! - z[i]![2]! * z[j]![0]!) / det;
    return z.every((r) => Math.abs(r[0]! * t + r[1]! * s - r[2]!) < 1e-9) ? { t, s, S: plus(g.p, mal(t, g.u)) } : null;
  }
  return null;
}

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Geraden, hat vier Abschnitte, BPE 16.2', () => {
    expect(meta.id).toBe('gegenseitige-lage-geraden');
    expect(meta.thema).toBe('vektorgeometrie');
    expect(meta.unterbereich).toBe('geraden');
    expect(meta.bpe).toEqual(['16.2']);
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
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"gegenseitige-lage-geraden"');
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
    for (const wort of ['identisch', 'parallel', 'windschief', 'schneiden sich', 'Schnittpunkt', 'Stützvektor', 'Richtungsvektor', 'Gleichsetzen', 'Vereinbarung', 'Parameter']) expect(html, wort).toContain(wort);
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).not.toMatch(/\d\/\d/);
    expect(html).not.toMatch(/\bpi\b|Pi\b/);
    expect(html).not.toMatch(/\bλ\b|Lambda/);
    expect(html).not.toMatch(/[A-Z]\(-?\d+(,\d+)? ?\/ ?-?\d/);
  });
  it('nur gegenseitige Lage: Winkel, Abstände, Ebenen, Streckenanteile und der Schwerpunkt kommen nicht vor', () => {
    expect(rendern(null)).not.toMatch(/Schnittwinkel|Lotfußpunkt|Normalenvektor|Ebenengleichung|Koordinatenform|Hesse|Teilstrecke|Streckenanteil|Abstand|Skalarprodukt|Winkel|Schwerpunkt|Seitenhalbierende/);
  });
  it('das Erklären nimmt nichts vorweg: keine Kennzeichen der Lage am Richtungsvektor, keine Aussage über die Anzahl der Lösungen, nichts über die Ebene', () => {
    const html = rendern('erklaeren');
    const text = html.replace(/<[^>]*>/g, '');
    for (const wort of ['Vielfache', 'Vielfaches', 'keine Lösung', 'unendlich viele', 'nur im Raum', 'genau dann', 'in der Ebene']) expect(text, wort).not.toContain(wort);
    const tex = texteAusHtml(html).join(' ');
    expect(tex.length).toBeGreaterThan(100);
    for (const verboten of ['\\Leftrightarrow', '\\ne']) expect(tex, verboten).not.toContain(verboten);
  });
  it('verweist auf die Module davor statt Geradengleichung, Punktprobe und Gleichungssysteme zu wiederholen', () => {
    const quelle = readdirSync(ORDNER).filter((x) => x.endsWith('.tsx')).map((d) => readFileSync(`${ORDNER}/${d}`, 'utf8')).join('\n');
    const ids = [...quelle.matchAll(/modul="([a-z0-9-]+)"/g)].map((m) => m[1]!);
    for (const m of ['geradengleichung', 'spurpunkte-besondere-lage', 'loesbarkeit-lgs', 'gauss-algorithmus']) expect(ids, m).toContain(m);
    for (const id of ids) expect(existsSync(`content/modules/${id}/meta.json`), id).toBe(true);
  });
  it('Parameter heißen t für g und s für h, λ kommt nicht vor, Gleichungen der Geraden stehen als x = p + t · u', () => {
    const html = rendern(null);
    expect(texteAusHtml(html).some((x) => x.includes('g:\\ \\vec{x}='))).toBe(true);
    expect(texteAusHtml(html).some((x) => x.includes('h:\\ \\vec{x}=') && x.includes('s\\cdot'))).toBe(true);
  });
});

describe('Lagen der Beispiele, unabhängig bestimmt', () => {
  const paare: [string, D.Paar, string][] = [
    ['BILD_IDENTISCH', D.BILD_IDENTISCH, 'identisch'],
    ['BILD_PARALLEL', D.BILD_PARALLEL, 'parallel'],
    ['ERKLAEREN', D.ERKLAEREN, 'schneidend'],
    ['PARALLEL', D.PARALLEL, 'parallel'],
    ['IDENTISCH', D.IDENTISCH, 'identisch'],
    ['WINDSCHIEF', D.WINDSCHIEF, 'windschief'],
    ['A_IDENTISCH', D.A_IDENTISCH.paar, 'identisch'],
    ['A_PARALLEL', D.A_PARALLEL, 'parallel'],
    ['A_SCHNITT', D.A_SCHNITT.paar, 'schneidend'],
    ['A_WINDSCHIEF', D.A_WINDSCHIEF, 'windschief'],
    ['A_PUNKT', D.A_PUNKT.paar, 'schneidend'],
    ['ZUSAMMENFASSUNG', D.ZUSAMMENFASSUNG, 'schneidend'],
    ['LABOR_START', { g: D.LABOR_G, h: gerade(D.LABOR_START.q, D.LABOR_START.v) }, 'windschief'],
    ...D.A_VIER.paare.map((p, i): [string, D.Paar, string] => [`A_VIER ${i + 1}`, p, ['identisch', 'parallel', 'schneidend', 'windschief'][D.A_VIER.loesung[i]! - 1]!]),
  ];
  it('jedes Beispiel hat die beschriebene Lage (Spatprodukt) und die Bibliothek stimmt damit überein', () => {
    for (const [name, p, art] of paare) {
      expect(lageSpat(p.g, p.h), name).toBe(art);
      expect(lageZweier(p.g, p.h).art, name).toBe(art);
    }
  });
  it('die Schnittpunkte und Parameter stimmen mit der Cramerschen Regel überein und liegen auf beiden Geraden', () => {
    const mit: [string, D.Paar, number[], number, number][] = [
      ['ERKLAEREN', D.ERKLAEREN, [-2, 3, 1], 2, 1],
      ['A_SCHNITT', D.A_SCHNITT.paar, [1, -1, 3], D.A_SCHNITT.t, D.A_SCHNITT.s],
      ['A_PUNKT', D.A_PUNKT.paar, D.A_PUNKT.S, 1, 2],
      ['ZUSAMMENFASSUNG', D.ZUSAMMENFASSUNG, [-1, 3, 1], -1, 2],
    ];
    for (const [name, p, S, t, s] of mit) {
      const c = schnittCramer(p.g, p.h)!;
      expect(c.S, name).toEqual(S);
      expect([c.t, c.s], name).toEqual([t, s]);
      expect(aufGerade(p.g, S), name).toBe(true);
      expect(aufGerade(p.h, S), name).toBe(true);
    }
  });
  it('die windschiefen Beispiele: die ersten beiden Gleichungen sind lösbar, die dritte ist nicht erfüllt (Fehler "zwei von drei" möglich)', () => {
    for (const p of [D.WINDSCHIEF, D.A_WINDSCHIEF]) {
      const z = [0, 1, 2].map((i) => [p.g.u[i]!, -p.h.u[i]!, p.h.p[i]! - p.g.p[i]!]);
      const det = z[0]![0]! * z[1]![1]! - z[0]![1]! * z[1]![0]!;
      expect(det).not.toBe(0);
      const t = (z[0]![2]! * z[1]![1]! - z[0]![1]! * z[1]![2]!) / det;
      const s = (z[0]![0]! * z[1]![2]! - z[0]![2]! * z[1]![0]!) / det;
      expect(Number.isInteger(t) && Number.isInteger(s)).toBe(true);
      expect(z[2]![0]! * t + z[2]![1]! * s).not.toBe(z[2]![2]);
    }
  });
});

describe('Rechenhilfen', () => {
  it('Terme und Zeilen: Koeffizient 1 ohne Zahl, Nullen weggelassen', () => {
    expect(linTeX(2, 1, 't')).toBe('2+t');
    expect(linTeX(-3, -1, 's')).toBe('-3-s');
    expect(linTeX(0, -2, 's')).toBe('-2s');
    expect(linTeX(5, 0, 's')).toBe('5');
    expect(summeTeX(1, -2)).toBe('t-2s');
    expect(summeTeX(-1, -1)).toBe('-t-s');
    expect(summeTeX(0, 3)).toBe('3s');
    expect(summeTeX(0, 0)).toBe('0');
    expect(zeileTeX({ a: 2, b: 1, c: 0 })).toBe('2t+s=0');
  });
  it('der Lösungsweg der Beispiele ist ganzzahlig und stimmt mit der Cramerschen Regel überein', () => {
    const alle: [Gerade, Gerade][] = [
      [D.ERKLAEREN.g, D.ERKLAEREN.h],
      [D.WINDSCHIEF.g, D.WINDSCHIEF.h],
      [D.A_SCHNITT.paar.g, D.A_SCHNITT.paar.h],
      [D.A_WINDSCHIEF.g, D.A_WINDSCHIEF.h],
      [D.ZUSAMMENFASSUNG.g, D.ZUSAMMENFASSUNG.h],
      [D.A_VIER.paare[0]!.g, D.A_VIER.paare[0]!.h],
      [D.A_VIER.paare[2]!.g, D.A_VIER.paare[2]!.h],
      [D.A_ACHSE.g, D.A_ACHSE.achse],
      [D.A_PARAM_SCHNITT.g, gerade(D.A_PARAM_SCHNITT.h.p, [1, 1, D.A_PARAM_SCHNITT.a])],
      [D.A_ANGEBEN.g, gerade(D.A_ANGEBEN.X, D.A_ANGEBEN.w)],
    ];
    for (const [g, h] of alle) {
      const w = loesungsweg(g, h);
      expect(Number.isInteger(w.t) && Number.isInteger(w.s)).toBe(true);
      // t und s lösen die ersten beiden Gleichungen
      for (const i of [0, 1]) expect(g.p[i]! + w.t * g.u[i]!, `${JSON.stringify([g, h])} ${i}`).toBe(h.p[i]! + w.s * h.u[i]!);
      expect(w.probe.ok).toBe(lageSpat(g, h) === 'schneidend');
      expect(w.zeilen).toHaveLength(3);
    }
  });
});

describe('Bilder', () => {
  const bilder: [string, RaumBildSpec][] = [
    ['LAGE_IDENTISCH', B.RAUM_LAGE_IDENTISCH],
    ['LAGE_PARALLEL', B.RAUM_LAGE_PARALLEL],
    ['LAGE_SCHNEIDEND', B.RAUM_LAGE_SCHNEIDEND],
    ['LAGE_WINDSCHIEF', B.RAUM_LAGE_WINDSCHIEF],
    ['ERKLAEREN', B.RAUM_ERKLAEREN],
    ['PARALLEL', B.RAUM_PARALLEL],
    ['WINDSCHIEF', B.RAUM_WINDSCHIEF],
    ['SCHNITT', B.aufgSchnitt],
    ['ANGEBEN', B.aufgAngeben],
    ['WINDSCHIEF Aufgabe', B.aufgWindschief],
    ['ACHSE', B.aufgAchse],
    ['ZUSAMMENFASSUNG', B.RAUM_ZUSAMMENFASSUNG],
  ];
  const zahlenX1 = Array.from({ length: 2 * RAUM_GRENZE + 1 }, (_, i) => i - RAUM_GRENZE).filter((k) => k !== 0).map((k) => normiert(x1ZahlMitte(k)));
  it('alle beschrifteten Punkte liegen im Koordinatensystem, keiner im Schrägbild auf einer Achse oder an derselben Bildstelle wie ein anderer, jedes Bild hat eine Textalternative', () => {
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
      expect(new Set(s.punkte!.map((p) => bildpunkt(p.p).join(','))).size, name).toBe(s.punkte!.length);
      expect(new Set(bp.map(String)).size, name).toBe(bp.length);
      expect(s.sprech.length, name).toBeGreaterThan(40);
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
  it('die Punkte der Bilder liegen auf den Geraden, die sie beschreiben (S auf beiden, P auf g, Q auf h)', () => {
    const pk = (s: RaumBildSpec, n: string) => s.punkte!.find((p) => p.name === n)!.p;
    const E = D.ERKLAEREN;
    expect(aufGerade(E.g, pk(B.RAUM_ERKLAEREN, 'P'))).toBe(true);
    expect(aufGerade(E.h, pk(B.RAUM_ERKLAEREN, 'Q'))).toBe(true);
    expect(aufGerade(E.g, pk(B.RAUM_ERKLAEREN, 'S')) && aufGerade(E.h, pk(B.RAUM_ERKLAEREN, 'S'))).toBe(true);
    expect(aufGerade(E.g, pk(B.RAUM_LAGE_SCHNEIDEND, 'S')) && aufGerade(E.h, pk(B.RAUM_LAGE_SCHNEIDEND, 'S'))).toBe(true);
    const A = D.A_SCHNITT;
    expect(aufGerade(A.paar.g, pk(B.aufgSchnitt, 'S')) && aufGerade(A.paar.h, pk(B.aufgSchnitt, 'S'))).toBe(true);
    expect(aufGerade(A.paar.g, pk(B.aufgSchnitt, 'P')) && aufGerade(A.paar.h, pk(B.aufgSchnitt, 'Q'))).toBe(true);
    const Z = D.ZUSAMMENFASSUNG;
    expect(aufGerade(Z.g, pk(B.RAUM_ZUSAMMENFASSUNG, 'S')) && aufGerade(Z.h, pk(B.RAUM_ZUSAMMENFASSUNG, 'S'))).toBe(true);
    for (const [s, p] of [[B.RAUM_PARALLEL, D.PARALLEL], [B.RAUM_WINDSCHIEF, D.WINDSCHIEF]] as const) {
      expect(aufGerade(p.g, pk(s, 'P'))).toBe(true);
      expect(aufGerade(p.h, pk(s, 'Q'))).toBe(true);
    }
    const N = D.A_ANGEBEN;
    expect(aufGerade(N.g, pk(B.aufgAngeben, 'S'))).toBe(true);
    expect(aufGerade(N.g, pk(B.aufgAngeben, 'R'))).toBe(false);
    expect(aufGerade(N.g, pk(B.aufgWindschief, 'P'))).toBe(true);
    expect(aufGerade(gerade(N.X, N.w), pk(B.aufgWindschief, 'Q'))).toBe(true);
    expect(aufGerade(D.A_ACHSE.g, D.A_ACHSE.S)).toBe(true);
    expect(D.A_ACHSE.S[0] === 0 && D.A_ACHSE.S[2] === 0).toBe(true);
  });
  it('Lagen der Bilder: zwei Linien in zwei Farben, bei identischen Geraden liegt h dick darunter, die Kontrollbilder passen zu den Aufgaben', () => {
    expect(B.RAUM_LAGE_IDENTISCH.linien!.some((l) => l.breite && !l.gestrichelt)).toBe(true);
    expect(B.RAUM_LAGE_PARALLEL.linien!).toHaveLength(2);
    expect(B.aufgAngeben.linien!).toHaveLength(3);
    expect(new Set(B.aufgAngeben.linien!.map((l) => l.farbe)).size).toBe(3);
    // Bei Aufgabe 12 ist die blaue Linie parallel zu g (gleiche Richtung) und die rosa schneidet g in S
    const [lg, lb, lr] = B.aufgAngeben.linien!;
    const rich = (l: { von: number[]; bis: number[] }) => diff(l.bis, l.von);
    expect(nullv(kreuz(rich(lg!), rich(lb!)))).toBe(true);
    expect(nullv(kreuz(rich(lg!), rich(lr!)))).toBe(false);
  });
  it('jede Gerade trägt ihren Namen (g, h) als Text in der Farbe der Linie, mit Abstand zu allen Linien, Achsen und Punkten, die Linien sind durchgezogen und nicht blau', () => {
    const abst = (p: number[], a: number[], b: number[]) => {
      const dx = b[0]! - a[0]!, dy = b[1]! - a[1]!, l2 = dx * dx + dy * dy;
      const u = l2 === 0 ? 0 : Math.max(0, Math.min(1, ((p[0]! - a[0]!) * dx + (p[1]! - a[1]!) * dy) / l2));
      return Math.hypot(p[0]! - a[0]! - u * dx, p[1]! - a[1]! - u * dy);
    };
    const erwartet: [string, RaumBildSpec, string[]][] = [
      ['LAGE_IDENTISCH', B.RAUM_LAGE_IDENTISCH, ['g, h']], ['LAGE_PARALLEL', B.RAUM_LAGE_PARALLEL, ['g', 'h']], ['LAGE_SCHNEIDEND', B.RAUM_LAGE_SCHNEIDEND, ['g', 'h']], ['LAGE_WINDSCHIEF', B.RAUM_LAGE_WINDSCHIEF, ['g', 'h']],
      ['ERKLAEREN', B.RAUM_ERKLAEREN, ['g', 'h']], ['PARALLEL', B.RAUM_PARALLEL, ['g', 'h']], ['WINDSCHIEF', B.RAUM_WINDSCHIEF, ['g', 'h']], ['SCHNITT', B.aufgSchnitt, ['g', 'h']],
      ['ANGEBEN', B.aufgAngeben, ['g', 'h₁', 'h₂']], ['WINDSCHIEF Aufgabe', B.aufgWindschief, ['g', 'h']], ['ACHSE', B.aufgAchse, ['g']], ['ZUSAMMENFASSUNG', B.RAUM_ZUSAMMENFASSUNG, ['g', 'h']],
    ];
    for (const [name, spec, namen] of erwartet) {
      const texte2 = spec.punkte!.filter((p) => p.nurText);
      expect(texte2.map((p) => p.name), name).toEqual(namen);
      const linien = spec.linien!.map((l) => [bildpunkt(l.von), bildpunkt(l.bis)] as const);
      for (const [a1, b1] of linien) {
        // keine Gerade verläuft im Schrägbild als Punkt oder parallel zu einem Achsenbild (sonst ist sie schwer zu erkennen)
        const d = [b1[0] - a1[0], b1[1] - a1[1]];
        const len = Math.hypot(d[0]!, d[1]!);
        expect(len, `${name} Länge`).toBeGreaterThan(1.5);
        for (const ax of [[-0.5, -0.5], [1, 0], [0, 1]]) expect((Math.acos(Math.min(1, Math.abs(d[0]! * ax[0]! + d[1]! * ax[1]!) / (len * Math.hypot(ax[0]!, ax[1]!)))) * 180) / Math.PI, `${name} Winkel zur Achse`).toBeGreaterThan(11);
      }
      for (const l of spec.linien!) {
        expect(l.gestrichelt, `${name} durchgezogen`).toBeFalsy();
        expect(l.farbe, name).not.toBe('#0072B2');
      }
      const ohneLabel = spec.punkte!.filter((p) => !p.nurText);
      for (const tx of texte2) {
        const b = bildpunkt(tx.p);
        expect(Math.abs(b[0]) <= 6 && Math.abs(b[1]) <= 6, `${name} ${tx.name} im Bild`).toBe(true);
        for (const [a1, b1] of linien) expect(abst(b, a1, b1), `${name} ${tx.name} Linie`).toBeGreaterThan(0.35);
        for (const p of ohneLabel) expect(Math.hypot(bildpunkt(p.p)[0] - b[0], bildpunkt(p.p)[1] - b[1]), `${name} ${tx.name} Punkt`).toBeGreaterThan(0.8);
        for (const a of [[1, 0, 0], [0, 1, 0], [0, 0, 1]]) expect(abst(b, bildpunkt(a.map((c) => -4 * c) as Punkt3), bildpunkt(a.map((c) => 4 * c) as Punkt3)), `${name} ${tx.name} Achse`).toBeGreaterThan(0.3);
      }
      // Farbe des Textes ist die Farbe seiner Linie
      const farben = spec.linien!.map((l) => l.farbe);
      for (const tx of texte2) expect(farben, `${name} ${tx.name}`).toContain(tx.farbe);
    }
  });
  it('Der Schnittpunkt der Aufgabe 14 liegt auf der x₂-Achse und bleibt deshalb ohne Beschriftung', () => {
    expect(B.aufgAchse.punkte!.filter((p) => !p.nurText).every((p) => p.ohneText)).toBe(true);
  });
});

describe('Labore', () => {
  it('Lagelabor: sechs Regler, zwei Schalter, Lage und Vergleich zunächst verborgen, ohne Schalter Ebene und Raum', () => {
    const html = renderToStaticMarkup(<Lagelabor />);
    expect(html.match(/type="range"/g)).toHaveLength(6);
    expect(html.match(/type="checkbox"/g)).toHaveLength(2);
    expect(html).toContain('aria-label="Darstellung wählen"');
    expect(html).not.toContain('aria-label="Ebene oder Raum wählen"');
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('Die Geraden sind windschief');
    expect(html).not.toContain('Vielfaches');
  });
  it('Gleichsetzlabor: sechs Regler, zwei Schalter, das Gleichungssystem steht da, die Lösungen sind zunächst verborgen', () => {
    const html = renderToStaticMarkup(<Gleichsetzlabor />);
    expect(html.match(/type="range"/g)).toHaveLength(6);
    expect(html.match(/type="checkbox"/g)).toHaveLength(2);
    expect(html).not.toContain('formel-fehler');
    expect(html).toContain('Gleichungssystem');
    expect(html).not.toContain('genau eine Lösung');
    expect(html).not.toContain('keine Lösung');
    expect(D.LABOR_START).toEqual({ q: [2, -1, 2], v: [1, 1, 1] });
  });
  it('für alle 42 875 Einstellungen: Lage stimmt unabhängig, Schnittpunkt nur mit Lage und im Koordinatensystem gezeichnet, alle Linien im Koordinatensystem, Punkte ohne Doppelungen', () => {
    let n = 0;
    const zaehler: Record<string, number> = { identisch: 0, parallel: 0, schneidend: 0, windschief: 0 };
    const Rq = [-3, -2, -1, 0, 1, 2, 3];
    const Rv = [-2, -1, 0, 1, 2];
    for (const q1 of Rq) for (const q2 of Rq) for (const q3 of Rq) for (const v1 of Rv) for (const v2 of Rv) for (const v3 of Rv) {
      const h = gerade([q1, q2, q3], [v1, v2, v3]);
      if (v1 === 0 && v2 === 0 && v3 === 0) continue;
      const art = lageSpat(D.LABOR_G, h);
      expect(lageZweier(D.LABOR_G, h).art).toBe(art);
      zaehler[art]!++;
      const ohne = B.laborBild(D.LABOR_G, h, false);
      expect(ohne.spec.punkte!.some((p) => p.name === 'S')).toBe(false);
      const mit = B.laborBild(D.LABOR_G, h, true);
      const S = mit.spec.punkte!.find((p) => p.name === 'S');
      if (art !== 'schneidend') expect(S).toBeUndefined();
      else {
        const c = schnittCramer(D.LABOR_G, h)!;
        const imKs = c.S.every((x) => Math.abs(x) <= 4 + 1e-9);
        expect(!!S).toBe(imKs);
        expect(mit.schnittAusserhalb).toBe(!imKs);
        if (S) S.p.forEach((x, i) => expect(x).toBeCloseTo(c.S[i]!, 6));
      }
      const sichtbar = mit.spec.punkte!.filter((p) => !p.ohneText && !p.nurText);
      expect(new Set(sichtbar.map((p) => bildpunkt(p.p).join(','))).size, 'beschriftete Punkte an verschiedenen Bildstellen').toBe(sichtbar.length);
      expect(new Set(mit.spec.punkte!.map((p) => p.p.join(','))).size, 'keine doppelten Raumpunkte').toBe(mit.spec.punkte!.length);
      for (const l of mit.spec.linien ?? []) for (const c of [...l.von, ...l.bis]) expect(Math.abs(c)).toBeLessThanOrEqual(4 + 1e-9);
      expect(mit.spec.sprech.length).toBeGreaterThan(40);
      n++;
    }
    expect(n).toBe(343 * 125 - 343);
    for (const k of Object.keys(zaehler)) expect(zaehler[k], k).toBeGreaterThan(0);
  }, 120000);
  it('ohne gültige Gerade h (Nullvektor) gibt es nur g und die Punkte P und Q', () => {
    const s = B.laborBildOhneH(D.LABOR_G, [1, 2, 3]);
    expect(s.linien).toHaveLength(1);
    expect(s.punkte!.filter((p) => !p.nurText).map((p) => p.name)).toEqual(['P', 'Q']);
  });
});

describe('Aufgaben', () => {
  it('14 Aufgaben: sieben mit Eingabefeldern (2, 4, 5, 7, 9, 11, 14), fünf Auswahlfragen (1, 3, 6, 8, 10) und zwei Aufgaben ohne Feld (12, 13)', () => {
    const html = rendern('ueberpruefen');
    expect(aufgaben.map((a) => a.nummer)).toEqual(['2', '4', '5', '7', '9', '11', '14']);
    expect(fragen.map((f) => f.nummer)).toEqual(['1', '3', '6', '8', '10']);
    expect(html).toContain('Aufgabe 12: Geraden mit vorgegebener Lage angeben');
    expect(html).toContain('Aufgabe 13: Eine windschiefe Gerade angeben');
  });
  it('Auswahl 1: u und v sind Vielfache, richtig ist "parallel oder identisch"', () => {
    rendern('ueberpruefen');
    const [u, v] = spaltenAus(frage('1').children);
    expect(nullv(kreuz(u!, v!))).toBe(true);
    expect(alsText(frage('1').optionen.find((o) => o.richtig)!.text)).toContain('parallel oder identisch');
    expect(frage('1').optionen.filter((o) => o.richtig)).toHaveLength(1);
  });
  it('Aufgabe 2: k und t stimmen, die Geraden sind identisch', () => {
    rendern('ueberpruefen');
    const [p, u, q, v] = spaltenAus(aufgabe('2').children);
    expect(v).toEqual(mal(wert('2', 'k'), u!));
    expect(plus(p!, mal(wert('2', 't'), u!))).toEqual(q);
    expect(lageSpat(gerade(p!, u!), gerade(q!, v!))).toBe('identisch');
  });
  it('Auswahl 3: parallel, zwei Koordinaten von Q passen zu t = 2, die dritte nicht', () => {
    rendern('ueberpruefen');
    const [p, u, q, v] = spaltenAus(frage('3').children);
    expect(lageSpat(gerade(p!, u!), gerade(q!, v!))).toBe('parallel');
    const g = plus(p!, mal(2, u!));
    expect([g[0] === q![0], g[1] === q![1], g[2] === q![2]]).toEqual([true, true, false]);
    expect(alsText(frage('3').optionen.find((o) => o.richtig)!.text)).toContain('Parallel');
  });
  it('Aufgabe 4: die sechs Zahlen sind die Gleichungen II und III in der Form a·t + b·s = c', () => {
    rendern('ueberpruefen');
    const [p, u, q, v] = spaltenAus(aufgabe('4').children);
    for (const [i, nr] of [[1, '2'], [2, '3']] as const) {
      expect(wert('4', `a${nr}`)).toBe(u![i]);
      expect(wert('4', `b${nr}`)).toBe(-v![i]!);
      expect(wert('4', `c${nr}`)).toBe(q![i]! - p![i]!);
    }
  });
  it('Aufgabe 5: t, s und S stimmen mit der unabhängigen Rechnung überein, S liegt auf beiden Geraden', () => {
    rendern('ueberpruefen');
    const [p, u, q, v] = spaltenAus(aufgabe('5').children);
    const c = schnittCramer(gerade(p!, u!), gerade(q!, v!))!;
    expect(wert('5', 't')).toBe(c.t);
    expect(wert('5', 's')).toBe(c.s);
    expect([wert('5', 'x1'), wert('5', 'x2'), wert('5', 'x3')]).toEqual(c.S);
    expect(plus(q!, mal(c.s, v!))).toEqual(c.S);
  });
  it('Auswahl 6: windschief, die Lösung der ersten beiden Gleichungen stimmt, die dritte nicht, genau eine richtige Antwort', () => {
    rendern('ueberpruefen');
    const [p, u, q, v] = spaltenAus(frage('6').children);
    const g = gerade(p!, u!);
    const h = gerade(q!, v!);
    expect(lageSpat(g, h)).toBe('windschief');
    const nums = texte(frage('6').children).join(' ');
    const tt = Number(/t=(-?\d+)/.exec(nums)![1]);
    const ss = Number(/s=(-?\d+)/.exec(nums)![1]);
    for (const i of [0, 1]) expect(p![i]! + tt * u![i]!).toBe(q![i]! + ss * v![i]!);
    expect(p![2]! + tt * u![2]!).not.toBe(q![2]! + ss * v![2]!);
    expect(frage('6').optionen.filter((o) => o.richtig)).toHaveLength(1);
    expect(alsText(frage('6').optionen.find((o) => o.richtig)!.text)).toContain('windschief');
  });
  it('Aufgabe 7: die Lage jedes Paares (unabhängig aus dem Aufgabentext bestimmt) passt zu den Feldern, jede Lage kommt genau einmal vor', () => {
    rendern('ueberpruefen');
    const s = spaltenAus(aufgabe('7').children);
    expect(s).toHaveLength(16);
    const namen = ['identisch', 'parallel', 'schneidend', 'windschief'];
    const erwartet = [0, 1, 2, 3].map((i) => namen.indexOf(lageSpat(gerade(s[4 * i]!, s[4 * i + 1]!), gerade(s[4 * i + 2]!, s[4 * i + 3]!))) + 1);
    expect(['p1', 'p2', 'p3', 'p4'].map((id) => wert('7', id))).toEqual(erwartet);
    expect(new Set(erwartet).size).toBe(4);
    expect(erwartet).toEqual(D.A_VIER.loesung);
  });
  it('Aufgabe 7: die Spalten des Aufgabentexts sind die Paare der Daten', () => {
    rendern('ueberpruefen');
    const s = spaltenAus(aufgabe('7').children);
    D.A_VIER.paare.forEach((pp, i) => expect(s.slice(4 * i, 4 * i + 4)).toEqual([pp.g.p, pp.g.u, pp.h.p, pp.h.u]));
  });
  it('Auswahl 8: genau ein Punkt liegt auf beiden Geraden, die falschen liegen nur auf einer oder auf keiner', () => {
    rendern('ueberpruefen');
    const [p, u, q, v] = spaltenAus(frage('8').children);
    const g = gerade(p!, u!);
    const h = gerade(q!, v!);
    let richtige = 0;
    for (const o of frage('8').optionen) {
      const t = texte(o.text).join('');
      const m = /\((-?\d+)\\,\|\\,(-?\d+)\\,\|\\,(-?\d+)\)/.exec(t)!;
      const X = [Number(m[1]), Number(m[2]), Number(m[3])];
      const beide = aufGerade(g, X) && aufGerade(h, X);
      expect(beide, o.id).toBe(o.richtig);
      if (beide) richtige++;
      else expect(aufGerade(g, X) && aufGerade(h, X)).toBe(false);
    }
    expect(richtige).toBe(1);
    expect(aufGerade(g, D.A_PUNKT.gS)).toBe(true);
    expect(aufGerade(h, D.A_PUNKT.gS)).toBe(false);
    expect(aufGerade(h, D.A_PUNKT.hT)).toBe(true);
    expect(aufGerade(g, D.A_PUNKT.hT)).toBe(false);
  });
  it('Aufgabe 9: nur für a = −4 sind die Geraden parallel, dann nicht identisch', () => {
    rendern('ueberpruefen');
    const s = spaltenAus(aufgabe('9').children);
    const [p, q, v] = [s[0]!, s[1]!, s[2]!];
    const gut: number[] = [];
    for (let a = -20; a <= 20; a++) if (lageSpat(gerade(p, [a, 6, -2]), gerade(q, v)) === 'parallel') gut.push(a);
    expect(gut).toEqual([wert('9', 'a')]);
    expect(lageSpat(gerade(p, [wert('9', 'a'), 6, -2]), gerade(q, v))).not.toBe('identisch');
  });
  it('Auswahl 10: für kein a echt parallel, für a = 1 identisch, sonst schneiden sich die Geraden', () => {
    rendern('ueberpruefen');
    const s = spaltenAus(frage('10').children);
    const [p, q, v] = [s[0]!, s[1]!, s[2]!];
    for (let a = -20; a <= 20; a++) {
      const art = lageSpat(gerade(p, [a, 3, -1]), gerade(q, v));
      expect(art, `a=${a}`).not.toBe('parallel');
      expect(art, `a=${a}`).toBe(a === D.A_PARAM_IDENTISCH.a ? 'identisch' : 'schneidend');
    }
    expect(frage('10').optionen.filter((o) => o.richtig)).toHaveLength(1);
    expect(alsText(frage('10').optionen.find((o) => o.richtig)!.text)).toContain('Für kein');
  });
  it('Aufgabe 11: nur für a = 2 schneiden sich die Geraden, sonst windschief', () => {
    rendern('ueberpruefen');
    const s = spaltenAus(aufgabe('11').children);
    const [p, u, q] = [s[0]!, s[1]!, s[2]!];
    const gut: number[] = [];
    for (let a = -20; a <= 20; a++) {
      const art = lageSpat(gerade(p, u), gerade(q, [1, 1, a]));
      if (art === 'schneidend') gut.push(a);
      else expect(art, `a=${a}`).toBe('windschief');
    }
    expect(gut).toEqual([wert('11', 'a')]);
  });
  it('Aufgabe 12 und 13: R liegt nicht auf g, S liegt auf g, die Beispiellösungen haben die verlangten Lagen (unabhängig), die Gleichungen stehen im Lösungsweg', () => {
    const html = rendern('ueberpruefen');
    const N = D.A_ANGEBEN;
    expect(aufGerade(N.g, N.R)).toBe(false);
    expect(aufGerade(N.g, N.S)).toBe(true);
    expect(lageSpat(N.g, gerade(N.R, N.g.u))).toBe('parallel');
    const h2 = gerade(N.S, N.w);
    expect(lageSpat(N.g, h2)).toBe('schneidend');
    expect(schnittCramer(N.g, h2)!.S).toEqual(N.S);
    expect(lageSpat(N.g, gerade(N.X, N.w))).toBe('windschief');
    const tex = texteAusHtml(html).join(' ');
    for (const g of [gerade(N.R, N.g.u), h2, gerade(N.X, N.w)]) expect(tex).toContain(`\\vec{x}=\\begin{pmatrix}${g.p.join('\\\\')}\\end{pmatrix}+s`);
  });
  it('Aufgabe 14: die Gerade schneidet die x₂-Achse in (0 | 3 | 0), das Feld ist die x₂-Koordinate', () => {
    rendern('ueberpruefen');
    const [p, u] = spaltenAus(aufgabe('14').children);
    const achse = gerade([0, 0, 0], [0, 1, 0]);
    expect(lageSpat(gerade(p!, u!), achse)).toBe('schneidend');
    const S = schnittCramer(gerade(p!, u!), achse)!.S;
    expect(S[0]).toBe(0);
    expect(S[2]).toBe(0);
    expect(wert('14', 'y')).toBe(S[1]);
  });
  it('alle Auswahlfragen: genau eine richtige Antwort, die Position wechselt, jede Option hat eine Rückmeldung, alle Texte ohne Formelfehler und Gedankenstriche, Hilfen und Lösungsschritte vorhanden', () => {
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
  it('die Rückmeldungen der falschen Antworten nennen den Unterschied (enthalten "ist", "hat", "liegt", "gehört", "sind" oder "genügt")', () => {
    rendern('ueberpruefen');
    for (const x of fragen) for (const o of x.optionen.filter((y) => !y.richtig)) expect(alsText(o.rueckmeldung), `${x.nummer} ${o.id}`).toMatch(/ist |hat |liegt |gehört |sind |genügt|heißt|wurde|gilt/);
  });
});

describe('Zusammenfassung', () => {
  it('das Beispiel stimmt: keine Vielfachen, S(−1 | 3 | 1), ohne Formelfehler', () => {
    const z = D.ZUSAMMENFASSUNG;
    expect(nullv(kreuz(z.g.u, z.h.u))).toBe(false);
    expect(schnittCramer(z.g, z.h)!.S).toEqual([-1, 3, 1]);
    const html = rendern('zusammenfassung');
    expect(html).not.toContain('formel-fehler');
    for (const wort of ['So bestimmst du die Lage', 'Häufige Fehler', 'Ein Parameter a in einer Geraden', 'Gerade mit vorgegebener Lage angeben']) expect(html, wort).toContain(wort);
  });
});
