import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/problemloesen-vektorgeometrie/Bilder';
import * as D from '../content/modules/problemloesen-vektorgeometrie/daten';
import { ebenenansichtLagen } from '../content/modules/problemloesen-vektorgeometrie/Ebenenansicht';
import Modul from '../content/modules/problemloesen-vektorgeometrie/index';
import { Bildpunktlabor, Permutationslabor, bildpunktlaborBild, laborAussagen } from '../content/modules/problemloesen-vektorgeometrie/Labor';
import { zahlenstrahlZeilen } from '../content/modules/problemloesen-vektorgeometrie/Zahlenstrahl';
import meta from '../content/modules/problemloesen-vektorgeometrie/meta.json';
import themen from '../content/themen.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { RAUM_BEREICH, RAUM_GRENZE, bildpunkt, gleichesBild, normiert, raumLagen, sperrlinienRaum, x1ZahlMitte, type Punkt3, type RaumBildSpec } from '../src/lib/schraegbild';
import { lageAbstand } from '../src/lib/vektorbild';

vi.setConfig({ testTimeout: 60000 });

interface FeldAufruf { id: string; erwartet: number; toleranz?: number; beschriftung: ReactNode; name: string }
interface AufgabeAufruf { nummer: string; children: ReactNode; felder: FeldAufruf[]; hilfen: ReactNode[]; loesung: ReactNode[] }
interface FrageAufruf { nummer: string; children: ReactNode; optionen: { id: string; text: ReactNode; richtig: boolean; rueckmeldung: ReactNode }[]; erklaerung: ReactNode }
const aufgaben: AufgabeAufruf[] = [];
const fragen: FrageAufruf[] = [];

vi.mock('../src/components/Aufgabe', () => ({
  Aufgabe: (p: AufgabeAufruf & { nummer: string | number }) => {
    aufgaben.push({ ...p, nummer: String(p.nummer) });
    return (
      <div data-aufgabe={String(p.nummer)}>
        {p.children}
        {p.felder.map((f, i) => <div key={`f${i}`}>{f.beschriftung}</div>)}
        {p.hilfen.map((h, i) => <div key={`h${i}`}>{h}</div>)}
        {p.loesung.map((h, i) => <div key={`l${i}`}>{h}</div>)}
      </div>
    );
  },
}));
vi.mock('../src/components/Auswahlfrage', () => ({
  Auswahlfrage: (p: FrageAufruf & { nummer: string | number }) => {
    fragen.push({ ...p, nummer: String(p.nummer) });
    return (
      <div data-frage={String(p.nummer)}>
        {p.children}
        {p.optionen.map((o, i) => <div key={`o${i}`}>{o.text}{o.rueckmeldung}</div>)}
        {p.erklaerung}
      </div>
    );
  },
}));
vi.mock('../src/components/AufKlick', () => ({ AufKlick: ({ children }: { children: ReactNode }) => <>{children}</> }));

function rendern(abschnitt: string | null = null): string {
  aufgaben.length = 0;
  fragen.length = 0;
  return renderToStaticMarkup(
    <AbschnittAnbieter value={abschnitt}>
      <Modul />
    </AbschnittAnbieter>,
  );
}
const ORDNER = 'content/modules/problemloesen-vektorgeometrie';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const texteAusHtml = (html: string): string[] => [...html.matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&#x27;/g, "'"));
const wert = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!.erwartet;

/* Unabhängig von der Bibliothek. */
const dist = (a: number[], b: number[]) => Math.hypot(...a.map((x, i) => x - b[i]!));
const nah = (x: number, y: number, eps = 1e-9) => Math.abs(x - y) < eps;
const alleVertauschungen = (p: number[]): number[][] => {
  const r = new Map<string, number[]>();
  const rek = (rest: number[], akt: number[]) => {
    if (!rest.length) r.set(akt.join(), akt);
    rest.forEach((x, i) => rek([...rest.slice(0, i), ...rest.slice(i + 1)], [...akt, x]));
  };
  rek(p, []);
  return [...r.values()];
};
const bild = (p: number[]) => [p[1]! - p[0]! / 2, p[2]! - p[0]! / 2];

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Ebenen, BPE 8.1, vier Abschnitte, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('problemloesen-vektorgeometrie');
    expect(meta.thema).toBe('vektorgeometrie');
    expect(meta.unterbereich).toBe('ebenen');
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.bpe).toEqual(['8.1']);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['vorgehen', 'punkte-vertauschen', 'bildpunkt', 'zusammenfassung']);
    const thema = themen.themen.find((x) => x.id === meta.thema) as { unterbereiche?: { id: string }[] };
    expect(thema.unterbereiche?.map((u) => u.id)).toContain(meta.unterbereich);
    for (const a of meta.abschnitte) {
      const h = rendern(a.id);
      expect(h).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(h).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('solange es ein Entwurf ist, steht es in keinem Kurs', () => {
    if (meta.status !== 'entwurf') return;
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"problemloesen-vektorgeometrie"');
  });
  it('rendert ohne Formelfehler, ohne Gedankenstriche, Schrägstrich-Brüche und ausgeschriebenes Pi, mit der Fachsprache der Lehrkraft', () => {
    const h = rendern(null);
    expect(h).not.toContain('formel-fehler');
    expect(h).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(h).not.toContain(z);
    for (const d of readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts'))) for (const z of ['–', '—']) expect(readFileSync(`${ORDNER}/${d}`, 'utf8'), d).not.toContain(z);
    for (const wort of ['Permutation', 'Koordinatensumme', 'Raumdiagonale', 'Mittelpunkt', 'Innenwinkel', 'Normalenvektor', 'Problemlöseschema', 'Schrägbild']) expect(h, wort).toContain(wort);
    expect(h).not.toMatch(/\d\/\d/);
    expect(h).not.toMatch(/\bpi\b|Pi\b/);
    expect(h).not.toMatch(/Graph(?!ik)/);
    expect(h).not.toMatch(/graphisch/);
    expect(h).not.toMatch(/Vektorprodukt/);
  });
  it('nichts aus den Unterlagen der Lehrkraft: weder die Zahlen noch die Wortwahl der Vorlagen', () => {
    const html = rendern(null);
    const h = texteAusHtml(html).join(' ') + ' ' + html;
    for (const p of ['2\\,|\\,4\\,|\\,6', '3\\,|\\,6\\,|\\,9', '2\\,|\\,3\\,|\\,4', '1\\,|\\,4\\,|\\,5', '1\\,|\\,0\\,|\\,-1', '4\\,|\\,2\\,|\\,6', '5\\,|\\,1\\,|\\,4']) expect(h, p).not.toContain(p);
    for (const w of ['Annahme', 'Permutation eines beliebigen', 'Bewertungseinheiten']) expect(html, w).not.toContain(w);
  });
  it('alle verwiesenen Module gibt es, und die Titel der Verweise stimmen', () => {
    const vorhanden = readdirSync('content/modules');
    for (const f of readdirSync(ORDNER).filter((x) => x.endsWith('.tsx'))) for (const m of readFileSync(`${ORDNER}/${f}`, 'utf8').matchAll(/modul="([a-z-]+)"/g)) expect(vorhanden, m[1]).toContain(m[1]);
    const tit = (id: string) => (JSON.parse(readFileSync(`content/modules/${id}/meta.json`, 'utf8')) as { titel: string }).titel;
    const h = rendern(null);
    for (const id of ['punkte-vektoren-raum', 'betrag-abstand-teilung', 'skalarprodukt-orthogonalitaet', 'normalenform-koordinatenform', 'geradengleichung', 'uebungsaufgaben-geraden', 'uebungsaufgaben-ebenen']) expect(h, id).toContain(tit(id));
  });
});

describe('Aufgaben und Fragen', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('die Nummern 1 bis 14 kommen genau einmal vor (Aufgaben mit Feldern, Auswahlfragen, Zeichenaufgaben)', () => {
    const h = rendern(null);
    const nummern = [...aufgaben.map((a) => a.nummer), ...fragen.map((f) => f.nummer), ...[...h.matchAll(/Aufgabe (\d+): /g)].map((m) => m[1]!).filter((n) => n === '2' || n === '9')];
    expect([...new Set(nummern)].sort((a, b) => Number(a) - Number(b))).toEqual(Array.from({ length: 14 }, (_, i) => String(i + 1)));
    expect(nummern.length).toBe(14);
    expect(aufgaben.map((a) => a.nummer).sort()).toEqual(['1', '10', '12', '14', '8']);
    expect(fragen.map((f) => f.nummer)).toEqual(['3', '4', '5', '6', '7', '11', '13']);
  });
  it('alle Aufgaben haben Hilfen und Lösungsschritte, jede Auswahlfrage genau eine richtige Antwort, die Lage der richtigen Antwort wechselt', () => {
    for (const a of aufgaben) {
      expect(a.felder.length, a.nummer).toBeGreaterThan(0);
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(2);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(2);
      for (const f of a.felder) expect(f.name.length, `${a.nummer} ${f.id}`).toBeGreaterThan(5);
    }
    const lagen = new Set<number>();
    for (const f of fragen) {
      expect(f.optionen.filter((o) => o.richtig).length, f.nummer).toBe(1);
      lagen.add(f.optionen.findIndex((o) => o.richtig));
      for (const o of f.optionen) expect(alsText(o.rueckmeldung).length, `${f.nummer} ${o.id}`).toBeGreaterThan(30);
    }
    expect(lagen.size).toBeGreaterThanOrEqual(3);
  });
  it('die Vermutungen: richtig sind immer, immer, manchmal, immer, nie (unabhängig durch Suche über alle Punkte von −4 bis 4 geprüft)', () => {
    const richtig = (nr: string) => fragen.find((f) => f.nummer === nr)!.optionen.find((o) => o.richtig)!.id;
    expect(['3', '4', '5', '6', '7'].map(richtig)).toEqual(['a', 'a', 'b', 'a', 'c']);
    let ebene = true, abstand = true, parallel = true, rechter = false;
    let regel = 0, nichtRegel = 0;
    for (let a = -4; a <= 4; a++) for (let b = a + 1; b <= 4; b++) for (let c = b + 1; c <= 4; c++) {
      const u = alleVertauschungen([a, b, c]);
      ebene &&= u.every((q) => q[0]! + q[1]! + q[2]! === a + b + c);
      const m = (a + b + c) / 3;
      abstand &&= u.every((q) => nah(dist(q, [m, m, m]), dist(u[0]!, [m, m, m])));
      // sechs Punkte nach Winkel ordnen, Seitenlängen vergleichen, Winkel prüfen, Parallelität
      const e1 = [1, -1, 0].map((x) => x / Math.SQRT2), e2 = [1, 1, -2].map((x) => x / Math.sqrt(6));
      const w = (q: number[]) => Math.atan2(q.reduce((s, x, i) => s + (x - m) * e2[i]!, 0), q.reduce((s, x, i) => s + (x - m) * e1[i]!, 0));
      const o = [...u].sort((x, y) => w(x) - w(y));
      const seiten = o.map((q, i) => q.map((x, k) => o[(i + 1) % 6]![k]! - x));
      for (let i = 0; i < 3; i++) {
        const x = seiten[i]!, y = seiten[i + 3]!;
        parallel &&= [x[1]! * y[2]! - x[2]! * y[1]!, x[2]! * y[0]! - x[0]! * y[2]!, x[0]! * y[1]! - x[1]! * y[0]!].every((v) => v === 0);
      }
      for (let i = 0; i < 6; i++) {
        const x = o[(i + 5) % 6]!.map((v, k) => v - o[i]![k]!), y = o[(i + 1) % 6]!.map((v, k) => v - o[i]![k]!);
        const cos = x.reduce((s, v, k) => s + v * y[k]!, 0) / (Math.hypot(...x) * Math.hypot(...y));
        if (nah(cos, 0, 1e-9)) rechter = true;
      }
      const l = seiten.map((s) => Math.hypot(...s));
      if (l.every((v) => nah(v, l[0]!))) regel++; else nichtRegel++;
    }
    expect([ebene, abstand, parallel, rechter]).toEqual([true, true, true, false]);
    expect(regel).toBeGreaterThan(0);
    expect(nichtRegel).toBeGreaterThan(0);
  });
  it('Aufgabe 1: Anzahlen aus allen Vertauschungen', () => {
    expect(wert('1', 'n1')).toBe(alleVertauschungen([...D.P]).length);
    expect(wert('1', 'n2')).toBe(alleVertauschungen([...D.ZAEHLEN_GLEICH]).length);
  });
  it('Aufgabe 8: Summe, Abstand, Seiten und Winkel am Punkt P, unabhängig gerechnet', () => {
    const p = [...D.P];
    const sechs = alleVertauschungen(p);
    const m = [1, 1, 1];
    expect(wert('8', 's')).toBe(3);
    expect(sechs.every((q) => q[0]! + q[1]! + q[2]! === 3)).toBe(true);
    expect(nah(wert('8', 'd'), dist(p, m))).toBe(true);
    const P1 = [-1, 0, 4], P2 = [0, -1, 4], P3 = [4, -1, 0], P6 = [-1, 4, 0];
    for (const q of [P1, P2, P3, P6]) expect(sechs.some((x) => x.join() === q.join())).toBe(true);
    expect(nah(wert('8', 'l12'), dist(P1, P2))).toBe(true);
    expect(nah(wert('8', 'l23'), dist(P2, P3))).toBe(true);
    const x = P2.map((v, i) => v - P1[i]!), y = P6.map((v, i) => v - P1[i]!);
    expect(nah(wert('8', 'w'), (Math.acos(x.reduce((s, v, i) => s + v * y[i]!, 0) / (Math.hypot(...x) * Math.hypot(...y))) * 180) / Math.PI, 1e-9)).toBe(true);
    // die Ecken in der Aufgabe stehen genau so im Text
    const h = rendern(null);
    for (const q of [P1, P2, P3, [4, 0, -1], [0, 4, -1], P6]) expect(h.replace(/&amp;/g, '&')).toContain(q.join('\\,|\\,'));
  });
  it('Aufgabe 10: z ist genau dann regelmäßig, wenn z ∈ {−1, 7/2, 8} (Raster mit Schrittweite 1/50)', () => {
    const treffer: number[] = [];
    for (let i = -500; i <= 900; i++) {
      const z = i / 50;
      const [a, b, c] = [2, 5, z].sort((x, y) => x - y) as [number, number, number];
      if (a < b && b < c && nah(b - a, c - b, 1e-9)) treffer.push(z);
    }
    expect([wert('10', 'z1'), wert('10', 'z2'), wert('10', 'z3')]).toEqual(treffer);
    expect(zahlenstrahlZeilen(D.REFLEXION.a, D.REFLEXION.b, D.REFLEXION.z).map((z) => [z.luecke1, z.luecke2])).toEqual([[3, 3], [1.5, 1.5], [3, 3]]);
  });
  it('Aufgabe 12 und 14: Bildpunkt, weitere Punkte und Richtungsvektor stimmen mit der Schrägbild-Formel überein', () => {
    expect(bild([...D.BILD_P])).toEqual([D.BILD_PUNKT.X, D.BILD_PUNKT.Y]);
    const q1 = [6, wert('12', 'b2'), wert('12', 'b3')], q2 = [-2, wert('12', 'c2'), wert('12', 'c3')];
    for (const q of [q1, q2]) {
      expect(bild(q)).toEqual([D.BILD_PUNKT.X, D.BILD_PUNKT.Y]);
      for (const c of q) expect(Math.abs(c)).toBeLessThanOrEqual(RAUM_GRENZE + 2);
    }
    const u = [2, wert('14', 'u2'), wert('14', 'u3')];
    // Richtungsvektor: Verschiebung ändert das Bild nicht
    expect(bild([...D.BILD_P].map((c, i) => c + u[i]!))).toEqual(bild([...D.BILD_P]));
    // und es ist der einzige Richtungsvektor mit erster Koordinate 2: für jedes (u2,u3) in einem Raster ändert sich das Bild nur dann nicht
    const gleich: number[][] = [];
    for (let a = -8; a <= 8; a += 0.5) for (let b = -8; b <= 8; b += 0.5) if (nah(a - 1, 0) && nah(b - 1, 0)) gleich.push([a, b]);
    expect(gleich).toEqual([[1, 1]]);
    for (let s = -4; s <= 4; s++) expect(bild([...D.BILD_P].map((c, i) => c + s * u[i]!))).toEqual([D.BILD_PUNKT.X, D.BILD_PUNKT.Y]);
    for (let t = -4; t <= 4; t += 0.5) expect(bild(D.bildGerade(t))).toEqual([D.BILD_PUNKT.X, D.BILD_PUNKT.Y]);
    expect(D.bildGerade(2)).toEqual([2, -1, 3]);
    for (const t of [-4, 4]) for (const c of D.bildGerade(t)) expect(Math.abs(c)).toBeLessThanOrEqual(RAUM_GRENZE);
    // gleichesBild liefert genau Punkte dieser Geraden
    for (const q of gleichesBild([...D.BILD_P] as Punkt3)) expect(bild(q)).toEqual([D.BILD_PUNKT.X, D.BILD_PUNKT.Y]);
  });
  it('die Lösungswege nennen die gerechneten Werte', () => {
    const l = (nr: string) => alsText(aufgaben.find((a) => a.nummer === nr)!.loesung);
    expect(l('8')).toContain('\\sqrt{14}');
    expect(l('8')).toContain('3{,}74');
    expect(l('8')).toContain('1{,}41');
    expect(l('8')).toContain('5{,}66');
    expect(l('8')).toContain('120^{\\circ}');
    expect(l('10')).toContain('z=-1');
    expect(l('10')).toContain('z=8');
    expect(l('10')).toContain('\\frac{7}{2}');
    expect(l('12')).toContain('Q_1(6\\,|\\,1\\,|\\,5)');
    expect(l('12')).toContain('Q_2(-2\\,|\\,-3\\,|\\,1)');
  });
});

describe('Bilder im Raum', () => {
  const zahlenX1 = Array.from({ length: 2 * RAUM_GRENZE + 1 }, (_, i) => i - RAUM_GRENZE).filter((k) => k !== 0).map((k) => normiert(x1ZahlMitte(k)));
  const bilder: [string, RaumBildSpec][] = [
    ['Punkte', B.permutationBild(D.P)], ['Sechseck', B.permutationBild(D.P, { figur: true })], ['Ebene', B.permutationBild(D.P, { figur: true, ebene: true })],
    ['Mittelpunkt', B.permutationBild(D.P, { figur: true, mittelpunkt: true })], ['Gegenseiten', B.permutationBild(D.P, { figur: true, gegenseiten: true })],
    ['Alles', B.permutationBild(D.P, { figur: true, ebene: true, mittelpunkt: true, gegenseiten: true })],
    ['Regelmäßig', B.permutationBild(D.Q, { figur: true })], ['Dreieck', B.permutationBild(D.T, { figur: true, ebene: true })],
    ['Bildpunkt', B.bildpunktBild(D.BILD_P, false, true)], ['Bildpunkt mit Gerade', B.bildpunktBild(D.BILD_P, true, true)],
  ];
  it('alle Punkte liegen im Koordinatensystem, jedes Bild hat eine Textalternative und die feine Darstellung', () => {
    for (const [name, s] of bilder) {
      for (const p of s.punkte!) for (const x of p.p) expect(Math.abs(x), `${name} ${p.name}`).toBeLessThanOrEqual(RAUM_GRENZE);
      expect(s.sprech.length, name).toBeGreaterThan(40);
      expect(s.sprech, name).not.toMatch(/-\d/);
      expect(s.fein, name).toBe(true);
      for (const l of s.linien ?? []) for (const c of [...l.von, ...l.bis]) expect(Math.abs(c), `${name} Linie`).toBeLessThanOrEqual(RAUM_GRENZE + 1e-9);
      for (const f of s.flaechen ?? []) for (const e of f.ecken) for (const c of e) expect(Math.abs(c), `${name} Fläche`).toBeLessThanOrEqual(RAUM_GRENZE + 1e-9);
    }
  });
  it('die Punkte der Permutationsbilder fallen im Schrägbild nicht zusammen und liegen auf keiner Achse des Bilds', () => {
    for (const [name, s] of bilder.filter(([n]) => !n.startsWith('Bildpunkt'))) {
      const bp = s.punkte!.filter((p) => p.name !== 'M').map((p) => bildpunkt(p.p));
      expect(new Set(bp.map(String)).size, name).toBe(bp.length);
      for (const [x, y] of bp) {
        expect(x, `${name} x`).not.toBe(0);
        expect(y, `${name} y`).not.toBe(0);
        // Bei zwei gleichen Koordinaten liegt immer ein Punkt (a | b | b) auf dem Bild der x₁-Achse, das ist beim Dreieck nicht zu vermeiden
        if (name !== 'Dreieck') expect(x, `${name} x=y`).not.toBe(y);
      }
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
  it('die Bilder zeigen, was die Rechnung sagt: sechs Punkte in der Ebene mit Summe 3, M(1|1|1), Gegenseiten parallel in gleicher Farbe', () => {
    const s = B.permutationBild(D.P, { figur: true, ebene: true, mittelpunkt: true, gegenseiten: true });
    const pk = s.punkte!.filter((p) => p.name.startsWith('P'));
    expect(pk.map((p) => p.name)).toEqual(['P1', 'P2', 'P3', 'P4', 'P5', 'P6']);
    expect(pk[0]!.p).toEqual([...D.P]);
    for (const p of pk) expect(p.p[0] + p.p[1] + p.p[2]).toBe(3);
    expect(s.punkte!.find((p) => p.name === 'M')!.p).toEqual([1, 1, 1]);
    for (const f of s.flaechen!) for (const e of f.ecken) expect(nah(e[0] + e[1] + e[2], 3, 1e-9)).toBe(true);
    const seiten = s.linien!.filter((l) => !l.gestrichelt && l.breite === 3);
    expect(seiten.length).toBe(6);
    for (let i = 0; i < 3; i++) {
      const a = seiten[i]!, b = seiten[i + 3]!;
      expect(a.farbe).toBe(b.farbe);
      const x = a.bis.map((v, k) => v - a.von[k]!), y = b.bis.map((v, k) => v - b.von[k]!);
      expect([x[1]! * y[2]! - x[2]! * y[1]!, x[2]! * y[0]! - x[0]! * y[2]!, x[0]! * y[1]! - x[1]! * y[0]!].every((v) => v === 0)).toBe(true);
    }
    expect(new Set(seiten.map((l) => l.farbe)).size).toBe(3);
    const radien = s.linien!.filter((l) => l.gestrichelt);
    expect(radien.length).toBe(6);
    expect(new Set(radien.map((l) => Math.round(Math.hypot(...l.bis.map((v, k) => v - l.von[k]!)) * 1e6))).size).toBe(1);
    expect(B.permutationBild(D.T, { figur: true }).punkte!.length).toBe(3);
    expect(B.permutationBild([2, 2, 2]).punkte!.length).toBe(1);
  });
  it('Bildpunkt-Bild: alle Punkte haben dasselbe Bild, die Gerade endet im Koordinatensystem und fehlt nur im Schrägbild', () => {
    const s = B.bildpunktBild(D.BILD_P, true, true);
    const bp = s.punkte!.map((p) => bildpunkt(p.p));
    for (const b of bp) expect(b).toEqual([D.BILD_PUNKT.X, D.BILD_PUNKT.Y]);
    expect(s.punkte!.length).toBeGreaterThanOrEqual(4);
    expect(s.linien!.length).toBe(1);
    expect(B.bildpunktBild(D.BILD_P, false, true).linien).toEqual([]);
    for (let t = -4; t <= 4; t += 0.5) {
      const l = bildpunktlaborBild(t, true);
      expect(bildpunkt(l.punkte![0]!.p)).toEqual([D.BILD_PUNKT.X, D.BILD_PUNKT.Y]);
      expect(l.sprech).not.toMatch(/-\d/);
    }
  });
  it('Ebenenansicht: Beschriftungen stehen außerhalb des Kreises und weit von allen Seiten, die Zeichnung ist längentreu', () => {
    for (const p of [D.P, D.Q, [0, 2, 7] as Punkt3, [-3, 1, 3] as Punkt3]) {
      const { punkte, text, radius } = ebenenansichtLagen(p);
      expect(punkte.length).toBe(6);
      for (const q of punkte) expect(nah(Math.hypot(q.x, q.y), radius, 1e-6)).toBe(true);
      const abstandStrecke = (c: { x: number; y: number }, a: { x: number; y: number }, b: { x: number; y: number }) => {
        const dx = b.x - a.x, dy = b.y - a.y;
        const u = Math.max(0, Math.min(1, ((c.x - a.x) * dx + (c.y - a.y) * dy) / (dx * dx + dy * dy)));
        return Math.hypot(c.x - a.x - u * dx, c.y - a.y - u * dy);
      };
      text.forEach((c, i) => {
        expect(Math.hypot(c.x, c.y) - radius, `Kreis ${p.join()}`).toBeGreaterThan(20);
        for (let k = 0; k < 6; k++) expect(abstandStrecke(c, punkte[k]!, punkte[(k + 1) % 6]!), `Seite ${p.join()} ${i}`).toBeGreaterThan(18);
      });
      // Verhältnis der Seitenlängen im Bild wie im Raum
      const seite = (k: number) => Math.hypot(punkte[k]!.x - punkte[(k + 1) % 6]!.x, punkte[k]!.y - punkte[(k + 1) % 6]!.y);
      const o = alleVertauschungen([...p]);
      expect(o.length).toBe(6);
      const s = [...p].sort((a, b) => a - b);
      const r = (s[1]! - s[0]!) / (s[2]! - s[1]!);
      expect(nah(seite(0) / seite(1), r, 1e-6) || nah(seite(0) / seite(1), 1 / r, 1e-6)).toBe(true);
    }
  });
});

describe('Labore', () => {
  it('Aussagen des Permutationslabors stimmen für alle Koordinaten von −4 bis 4 mit der unabhängigen Rechnung überein', () => {
    for (let a = -4; a <= 4; a++) for (let b = -4; b <= 4; b++) for (let c = -4; c <= 4; c++) {
      const au = laborAussagen([a, b, c]);
      const n = alleVertauschungen([a, b, c]).length;
      expect(au.n, `${a},${b},${c}`).toBe(n);
      expect(au.s).toBe(a + b + c);
      expect(nah(au.d, dist([a, b, c], [(a + b + c) / 3, (a + b + c) / 3, (a + b + c) / 3]))).toBe(true);
      const [lo, mid, hi] = [a, b, c].sort((x, y) => x - y);
      expect(au.regelmaessig).toBe(n === 6 && mid! - lo! === hi! - mid!);
    }
  });
  it('beide Labore rendern in jeder Anfangsstellung ohne Formelfehler', () => {
    for (const Labor of [Permutationslabor, Bildpunktlabor]) {
      const h = renderToStaticMarkup(<Labor />);
      expect(h).not.toContain('formel-fehler');
      expect(h).toContain('aria-label');
      for (const z of ['–', '—']) expect(h).not.toContain(z);
    }
  });
});
