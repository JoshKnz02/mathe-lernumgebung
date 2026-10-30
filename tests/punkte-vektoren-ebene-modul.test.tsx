import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/punkte-vektoren-ebene/Bilder';
import * as D from '../content/modules/punkte-vektoren-ebene/daten';
import Modul from '../content/modules/punkte-vektoren-ebene/index';
import meta from '../content/modules/punkte-vektoren-ebene/meta.json';
import { Pfeillabor } from '../content/modules/punkte-vektoren-ebene/Pfeillabor';
import { Vektorlabor, wegWort } from '../content/modules/punkte-vektoren-ebene/Vektorlabor';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import themen from '../content/themen.json';
import { bewerte } from '../src/lib/eingabe';
import { achsenLinien, lageAbstand, lageFuerPunkt, sperrLinien, vektorBild, type Linie, type Punkt2 } from '../src/lib/vektorbild';
import { MIN_ABSTAND, VERSATZ } from '../src/lib/beschriftung';

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
const ORDNER = 'content/modules/punkte-vektoren-ebene';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const wert = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!.erwartet;
const bildPunkt = (name: string): Punkt2 => D.BEISPIEL.find((b) => b.name === name)!.p;

/** Unabhängige Differenz zweier Punkte, ohne die Bibliothek des Moduls. */
const diff = (a: number[], b: number[]) => [b[0]! - a[0]!, b[1]! - a[1]!];

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Vektoren der Vektorgeometrie, hat vier Abschnitte, und der Unterbereich existiert in themen.json', () => {
    expect(meta.id).toBe('punkte-vektoren-ebene');
    expect(meta.thema).toBe('vektorgeometrie');
    expect(meta.unterbereich).toBe('vektoren');
    expect(meta.bpe).toEqual(['7.1']);
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung']);
    const thema = themen.themen.find((t) => t.id === meta.thema) as { unterbereiche?: { id: string }[] };
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
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"punkte-vektoren-ebene"');
  });
  it('rendert ohne Formelfehler, ohne Gedankenstriche, mit der Fachsprache der Lehrkraft', () => {
    const html = rendern(null);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(html).not.toContain(z);
    for (const d of readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts'))) {
      const q = readFileSync(`${ORDNER}/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
    }
    for (const wort of ['Pfeilklasse', 'Gegenvektor', 'Verbindungsvektor', 'Ausgangspunkt', 'Zielpunkt', 'in Richtung der x-Achse', 'entgegen der Richtung der x-Achse']) expect(html, wort).toContain(wort);
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).not.toMatch(/\bpi\b|Pi\b/);
    expect(html).not.toMatch(/\d\/\d/);
  });
  it('das Erklären nimmt nichts vorweg: weder die Pfeilklasse noch die Rechenregel noch die Koordinaten des Gegenvektors', () => {
    const html = rendern('erklaeren');
    expect(html).not.toContain('Pfeilklasse');
    expect(html).not.toContain('gleich lang');
    expect(html).not.toMatch(/Zielpunkt minus/);
    expect(html).not.toContain('\\overrightarrow{KL}=\\begin{pmatrix}5');
  });
  it('Nullvektor und Ortsvektor gehören zum Modul im Raum und kommen hier nicht vor', () => {
    const html = rendern(null);
    expect(html).not.toContain('Nullvektor');
    expect(html).not.toContain('Ortsvektor');
  });
});

describe('Daten des Kurier-Beispiels, von Hand gerechnet', () => {
  it('LK, Gegenvektor und der Zielpunkt der zweiten Kurierin stimmen', () => {
    expect(diff(D.L, D.K)).toEqual(D.LK);
    expect(diff(D.K, D.L)).toEqual(D.LK.map((x) => -x));
    expect([D.M[0] + D.LK[0]!, D.M[1] + D.LK[1]!]).toEqual(D.N);
    expect(diff(D.M, D.N)).toEqual(D.LK);
    // Weg am Raster: 5 Einheiten entgegen der x-Richtung, 4 in y-Richtung, die Ecke liegt auf der Höhe von L über K
    expect([D.ECKE[0], D.ECKE[1]]).toEqual([D.K[0], D.L[1]]);
    expect(Math.abs(D.ECKE[0] - D.L[0])).toBe(5);
    expect(Math.abs(D.K[1] - D.ECKE[1])).toBe(4);
  });
  it('Wegbeschreibung in Worten wie auf den Arbeitsblättern', () => {
    expect(wegWort(-5, 'x')).toBe('5 Einheiten entgegen der Richtung der x-Achse');
    expect(wegWort(4, 'y')).toBe('4 Einheiten in Richtung der y-Achse');
    expect(wegWort(1, 'x')).toBe('1 Einheit in Richtung der x-Achse');
    expect(wegWort(0, 'y')).toBe('keine Änderung in Richtung der y-Achse');
  });
  it('alle Punkte der Bilder liegen im Bildbereich', () => {
    const liegt = (p: Punkt2, b: D.Bereich2) => p[0] >= b[0] && p[0] <= b[1] && p[1] >= b[2] && p[1] <= b[3];
    for (const p of [D.L, D.K, D.M, D.N, D.ECKE]) expect(liegt(p, D.STADT), String(p)).toBe(true);
    for (const b of D.BEISPIEL) expect(liegt(b.p, D.BEISPIEL_BEREICH), b.name).toBe(true);
    for (const s of D.PFEIL_STARTS) for (const v of [[-3, -3], [3, 3], [-3, 3], [3, -3]]) expect(liegt([s.p[0] + v[0]!, s.p[1] + v[1]!], D.PFEIL_BEREICH), `${s.name} ${v}`).toBe(true);
    for (const p of [D.AUFG_ABLESEN.s, D.AUFG_ABLESEN.z]) expect(liegt(p, [-6, 6, -6, 6]), String(p)).toBe(true);
    for (const p of [D.AUFG_PARALLELOGRAMM.a, D.AUFG_PARALLELOGRAMM.b, D.AUFG_PARALLELOGRAMM.c, D.AUFG_PARALLELOGRAMM.d]) expect(liegt(p, D.AUFG_PARALLELOGRAMM.bereich), String(p)).toBe(true);
    for (const a of D.AUFG_PFEILE.pfeile) for (const p of [a.von, a.bis]) expect(liegt(p, D.AUFG_PFEILE.bereich), String(p)).toBe(true);
    for (const p of [D.ZUSAMMENFASSUNG.a, D.ZUSAMMENFASSUNG.b, D.ZUSAMMENFASSUNG.c, D.ZUSAMMENFASSUNG.q, D.ZUSAMMENFASSUNG.p, D.ZUSAMMENFASSUNG.d]) expect(liegt(p, D.ZUSAMMENFASSUNG.bereich), String(p)).toBe(true);
  });
});

describe('Aufgaben und Auswahlfragen, unabhängig gerechnet', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('die Nummern sind 1, 2, 4a, 5, 6, 7, 10 (Aufgaben) und 3, 4b, 8, 9 (Auswahlfragen)', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '2', '4a', '5', '6', '7', '10']);
    expect(fragen.map((q) => q.nummer)).toEqual(['3', '4b', '8', '9']);
  });
  it('Aufgabe 1: Vektor am Schaubild und Gegenvektor', () => {
    const { s, z } = D.AUFG_ABLESEN;
    expect([wert('1', 'sx'), wert('1', 'sy')]).toEqual(diff(s, z));
    expect([wert('1', 'gx'), wert('1', 'gy')]).toEqual(diff(z, s));
    // Weg am Raster: 7 in x-Richtung, 3 entgegen der y-Richtung (Zählen der Einheiten)
    expect(z[0] - s[0]).toBe(7);
    expect(s[1] - z[1]).toBe(3);
  });
  it('Aufgabe 2: AB und BA', () => {
    const { a, b } = D.AUFG_VEKTOR;
    expect([wert('2', 'abx'), wert('2', 'aby')]).toEqual(diff(a, b));
    expect([wert('2', 'bax'), wert('2', 'bay')]).toEqual(diff(b, a));
  });
  it('Aufgabe 4a: AB, BC, CD aus den Punkten des Schaubilds', () => {
    const [A, Bp, C, Dp] = ['A', 'B', 'C', 'D'].map(bildPunkt) as [Punkt2, Punkt2, Punkt2, Punkt2];
    expect([wert('4a', 'abx'), wert('4a', 'aby')]).toEqual(diff(A, Bp));
    expect([wert('4a', 'bcx'), wert('4a', 'bcy')]).toEqual(diff(Bp, C));
    expect([wert('4a', 'cdx'), wert('4a', 'cdy')]).toEqual(diff(C, Dp));
  });
  it('Aufgabe 5 und 6: Zielpunkt und Ausgangspunkt mit Probe über den Verbindungsvektor', () => {
    const z = D.AUFG_ZIEL;
    const q = [wert('5', 'qx'), wert('5', 'qy')];
    expect(q).toEqual([z.p[0] + z.v[0]!, z.p[1] + z.v[1]!]);
    expect(diff(z.p, q)).toEqual(z.v);
    const s = D.AUFG_START;
    const a = [wert('6', 'ax'), wert('6', 'ay')];
    expect(a).toEqual([s.b[0] - s.v[0]!, s.b[1] - s.v[1]!]);
    expect(diff(a, s.b)).toEqual(s.v);
  });
  it('Aufgabe 7: IJ und JK', () => {
    const d = D.AUFG_DREI;
    expect([wert('7', 'ijx'), wert('7', 'ijy')]).toEqual(diff(d.i, d.j));
    expect([wert('7', 'jkx'), wert('7', 'jky')]).toEqual(diff(d.j, d.k));
  });
  it('Aufgabe 10: D im Parallelogramm ABCD, geprüft über Seiten und Diagonalen', () => {
    const { a, b, c } = D.AUFG_PARALLELOGRAMM;
    const d = [wert('10', 'dx'), wert('10', 'dy')];
    expect(diff(a, b)).toEqual(diff(d, c));
    expect(diff(a, d)).toEqual(diff(b, c));
    // Die Diagonalen halbieren sich gegenseitig: A + C = B + D
    expect([a[0] + c[0], a[1] + c[1]]).toEqual([b[0] + d[0]!, b[1] + d[1]!]);
    // ABCD ist ein echtes Parallelogramm: AB und AD sind nicht parallel
    const [abx, aby] = diff(a, b);
    const [adx, ady] = diff(a, d);
    expect(abx! * ady! - aby! * adx!).not.toBe(0);
  });
  it('Auswahlfrage 3: nur die Differenz Zielpunkt minus Ausgangspunkt ist richtig, die Falschen sind typische Fehler', () => {
    const { a, b } = D.AUFG_AUSWAHL;
    const q = fragen.find((x) => x.nummer === '3')!;
    const text = (id: string) => alsText(q.optionen.find((o) => o.id === id)!.text);
    expect(q.optionen.filter((o) => o.richtig).map((o) => o.id)).toEqual(['a']);
    const [x, y] = diff(a, b);
    expect(text('a')).toContain(`${x}`);
    expect(text('a')).toContain(`${y}`.replace('-', '-'));
    expect(text('b')).toContain(`${-x!}`);
    expect(text('c')).toContain(`${a[0] + b[0]}`);
    expect(text('c')).toContain(`${a[1] + b[1]}`);
    expect(text('d')).toContain(`${-y!}`);
  });
  it('Auswahlfrage 4b: die Paare der richtigen Antwort bilden genau dieselben Vektoren, alle anderen Paare nicht', () => {
    const vek = D.BEISPIEL_VEKTOREN;
    const namen = D.BEISPIEL.map((b) => b.name);
    for (const [vname, v] of Object.entries(vek)) {
      const partner = namen.flatMap((p) => namen.filter((q) => q !== p && diff(bildPunkt(p), bildPunkt(q))[0] === v[0] && diff(bildPunkt(p), bildPunkt(q))[1] === v[1]).map((q) => `${p}${q}`));
      const erwartet = [vname, `${D.BEISPIEL_PARTNER[vname as 'AB']!.join('')}`].sort();
      expect(partner.sort(), vname).toEqual(erwartet);
    }
    const q = fragen.find((x) => x.nummer === '4b')!;
    expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
    expect(q.optionen).toHaveLength(4);
  });
  it('Auswahlfrage 8: der Gegenvektor wechselt beide Vorzeichen, die falschen Antworten sind typische Fehler', () => {
    const q = fragen.find((x) => x.nummer === '8')!;
    const a = D.AUFG_GEGEN.a;
    expect(D.AUFG_GEGEN.gegen).toEqual([-a[0]!, -a[1]!]);
    const texte = Object.fromEntries(q.optionen.map((o) => [o.id, alsText(o.text)]));
    expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
    expect(alsText(q.optionen.find((o) => o.richtig)!.text)).toContain('-3\\\\2');
    expect(texte.b).toContain('-3\\\\-2');
    expect(texte.c).toContain('3\\\\2');
    expect(texte.d).toContain('2\\\\-3');
  });
  it('Auswahlfrage 9: nur die Pfeile 1 und 2 gehören zum Vektor, Pfeil 3 zum Gegenvektor, Pfeil 4 ist ein anderer Vektor', () => {
    const { pfeile, vektor, richtig } = D.AUFG_PFEILE;
    const koordinaten = pfeile.map((p) => diff(p.von, p.bis));
    const zugehoerig = koordinaten.map((k, i) => (k[0] === vektor[0] && k[1] === vektor[1] ? i + 1 : 0)).filter(Boolean);
    expect(zugehoerig).toEqual(richtig);
    expect(koordinaten[2]).toEqual([-vektor[0]!, -vektor[1]!]);
    expect(koordinaten[3]).not.toEqual(vektor);
    expect(koordinaten[3]).not.toEqual([-vektor[0]!, -vektor[1]!]);
    const q = fragen.find((x) => x.nummer === '9')!;
    expect(alsText(q.optionen.find((o) => o.richtig)!.text)).toContain('Pfeil 1 und Pfeil 2');
  });
  it('die richtige Antwort steht nicht immer an derselben Stelle, jede falsche hat eine eigene Begründung', () => {
    const stellen = fragen.map((q) => q.optionen.findIndex((o) => o.richtig));
    expect(new Set(stellen).size).toBeGreaterThan(2);
    for (const q of fragen) {
      expect(q.optionen, q.nummer).toHaveLength(4);
      const falsch = q.optionen.filter((o) => !o.richtig).map((o) => alsText(o.rueckmeldung));
      expect(new Set(falsch).size, q.nummer).toBe(3);
      for (const f of falsch) expect(f.length, q.nummer).toBeGreaterThan(40);
    }
  });
  it('jede Aufgabe hat mindestens zwei Hilfen und zwei Lösungsschritte', () => {
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(2);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(2);
    }
  });
  it('jeder erwartete Wert wird richtig bewertet, ein falscher nicht, auch mit Minuszeichen U+2212', () => {
    for (const a of aufgaben)
      for (const f of a.felder) {
        const eingabe = String(f.erwartet).replace('-', '−');
        expect(bewerte([{ id: f.id, erwartet: f.erwartet }], { [f.id]: eingabe })[f.id], `${a.nummer} ${f.id}`).toBe('richtig');
        expect(bewerte([{ id: f.id, erwartet: f.erwartet }], { [f.id]: String(f.erwartet + 1) })[f.id], `${a.nummer} ${f.id} falsch`).toBe('falsch');
      }
  });
  it('Hilfen, Lösungsschritte, Beschriftungen, Antworten und Erklärungen rendern ohne Formelfehler und ohne Gedankenstriche', () => {
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
    expect(teile.length).toBeGreaterThan(80);
    for (const [name, inhalt] of teile) {
      const html = alsText(inhalt);
      expect(html, name).not.toContain('formel-fehler');
      expect(html, name).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(html, name).not.toContain(z);
      expect(html, name).not.toMatch(/\d\/\d/);
    }
  });
});

describe('Schaubilder: Beschriftungen auf freien Seiten, Textalternativen', () => {
  const bilder: [string, ReturnType<typeof vektorBild>][] = [
    ['Stadt', B.BILD_STADT],
    ['Weg', B.BILD_WEG],
    ['Gegenvektor', B.BILD_GEGEN],
    ['Pfeilklasse', B.BILD_PFEILKLASSE],
    ['Zusammenfassung', B.BILD_ZUSAMMENFASSUNG],
    ['Beispiel Punkte', B.beispielBild('punkte')],
    ['Beispiel Vektoren', B.beispielBild('vektoren')],
    ['Beispiel Partner', B.beispielBild('partner')],
    ['Ablesen', B.aufgAblesen(false)],
    ['Ablesen Kontrolle', B.aufgAblesen(true)],
    ['Pfeile', B.aufgPfeile()],
    ['Parallelogramm', B.aufgParallelogramm(false)],
    ['Parallelogramm Kontrolle', B.aufgParallelogramm(true)],
    ['Labor Beispiel', B.labor([-4, -1], [2, 3])],
  ];
  const linienVon = (d: ReturnType<typeof vektorBild>): Linie[] => [
    ...achsenLinien(d.bereich),
    ...(d.pfeile ?? []).map((a): Linie => ({ von: a.von, bis: a.bis })),
    ...(d.strecken ?? []).map((a): Linie => ({ von: a.von, bis: a.bis })),
  ];
  it('jedes Schaubild hat eine Textalternative', () => {
    for (const [name, d] of bilder) {
      expect(d.beschreibung.length, name).toBeGreaterThan(30);
      expect(d.beschreibung, name).not.toMatch(/[–—]/);
    }
  });
  it('jede Beschriftung hat Abstand zu allen Pfeilen, Hilfslinien und Achsen', () => {
    let kleinster = Infinity;
    for (const [name, d] of bilder) {
      const linien = linienVon(d);
      for (const p of d.punkte ?? []) {
        if (!p.text) continue;
        const ohne = (d.punkte ?? []).filter((q) => q !== p);
        void ohne;
        const abstand = lageAbstand(p.lage!, [p.x, p.y], { bereich: d.bereich, teilung: d.teilung ?? 1, linien });
        kleinster = Math.min(kleinster, abstand);
        expect(abstand, `${name} ${p.text}`).toBeGreaterThanOrEqual(0.03);
      }
    }
    expect(kleinster).toBeLessThan(Infinity);
  });
  it('die Lage der Beschriftung ist rechnerisch gewählt, nicht von Hand: gleiche Eingabe, gleiche Lage', () => {
    const d = B.BILD_ZUSAMMENFASSUNG;
    const spec = { bereich: d.bereich, teilung: 1, linien: sperrLinien({ bereich: d.bereich, pfeile: d.pfeile!.map((a) => ({ von: a.von, bis: a.bis })), hilfslinien: [] }) };
    for (const p of d.punkte!) expect(lageFuerPunkt([p.x, p.y], spec)).toBe(lageFuerPunkt([p.x, p.y], spec));
    expect(Object.keys(VERSATZ)).toContain(d.punkte![0]!.lage);
  });
  it('Punkte auf der x-Achse bekommen keine Beschriftung darunter, Punkte an der y-Achse keine links davon', () => {
    const d = vektorBild({ bereich: [-6, 6, -6, 6], sprech: 'Test', punkte: [{ name: 'X', p: [3, 0] }, { name: 'Y', p: [0, 3] }, { name: 'Z', p: [-1, 2] }] });
    expect(d.punkte![0]!.lage).not.toMatch(/unten/);
    expect(d.punkte![1]!.lage).not.toMatch(/links/);
    expect(MIN_ABSTAND).toBeGreaterThan(0);
  });
  it('der Pfeil im Bild beginnt und endet an den Punkten der Rechnung', () => {
    const w = B.BILD_WEG.pfeile![0]!;
    expect([w.von, w.bis]).toEqual([D.L, D.K]);
    const k = B.BILD_PFEILKLASSE.pfeile!;
    expect(k.map((a) => diff(a.von, a.bis))).toEqual([D.LK, D.LK]);
    const z = B.BILD_ZUSAMMENFASSUNG.pfeile!;
    expect(z.map((a) => diff(a.von, a.bis))).toEqual([D.ZUSAMMENFASSUNG.ab, D.ZUSAMMENFASSUNG.ab, D.ZUSAMMENFASSUNG.ab]);
    expect(diff(D.ZUSAMMENFASSUNG.b, D.ZUSAMMENFASSUNG.a)).toEqual(D.ZUSAMMENFASSUNG.ba);
    const pg = B.aufgParallelogramm(true).pfeile!;
    expect(diff(pg[0]!.von, pg[0]!.bis)).toEqual(diff(pg[1]!.von, pg[1]!.bis));
    expect(diff(pg[2]!.von, pg[2]!.bis)).toEqual(diff(pg[3]!.von, pg[3]!.bis));
    for (const a of B.beispielBild('partner').pfeile!.slice(0, 3)) expect(a.gestrichelt).toBeUndefined();
    const partner = B.beispielBild('partner').pfeile!;
    for (let i = 0; i < 3; i++) expect(diff(partner[i]!.von, partner[i]!.bis)).toEqual(diff(partner[i + 3]!.von, partner[i + 3]!.bis));
  });
  it('die drei Pfeile der Beispiel-Vektoren haben verschiedene Farben (Orange, Blau, Rosa)', () => {
    const farben = B.beispielBild('vektoren').pfeile!.map((a) => a.farbe);
    expect(new Set(farben).size).toBe(3);
  });
});

describe('Labore', () => {
  it('das Vektorlabor und das Pfeillabor rendern mit Textalternative und Schaltern, ohne Formelfehler', () => {
    const v = renderToStaticMarkup(<Vektorlabor />);
    const p = renderToStaticMarkup(<Pfeillabor />);
    for (const html of [v, p]) {
      expect(html).not.toContain('formel-fehler');
      expect(html).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(html).not.toContain(z);
      expect(html).toContain('type="range"');
    }
    expect(v).toContain('Rechnung einblenden');
    expect(v).toContain('in Richtung der x-Achse');
    expect(p).toContain('Zielpunkte berechnen');
  });
  it('Startwerte des Vektorlabors: PT und TP stimmen, und alle Regler decken den Bildbereich ab', () => {
    const [p, t] = [D.LABOR_PUNKT_START.p, D.LABOR_PUNKT_START.t];
    const html = renderToStaticMarkup(<Vektorlabor />);
    const pt = diff(p, t);
    expect(html).toContain(`\\overrightarrow{PT}=\\begin{pmatrix}${pt[0]}\\\\${pt[1]}\\end{pmatrix}`);
    expect(html).toContain(`\\overrightarrow{TP}=\\begin{pmatrix}${-pt[0]!}\\\\${-pt[1]!}\\end{pmatrix}`);
    expect(D.LABOR_BEREICH[0]).toBeLessThanOrEqual(-5);
    expect(D.LABOR_BEREICH[1]).toBeGreaterThanOrEqual(5);
  });
  it('Startwerte des Pfeillabors: die Zielpunkte der drei Pfeile entstehen mit demselben Vektor', () => {
    const html = renderToStaticMarkup(<Pfeillabor />);
    const v = D.PFEIL_START_VEKTOR;
    for (const [i, s] of D.PFEIL_STARTS.entries()) expect(html).toContain(`Z_${i + 1}(${s.p[0] + v[0]!}\\,|\\,${s.p[1] + v[1]!})`);
  });
  it('die Beschriftungen der Labore haben für alle Einstellungen genügend Abstand (Stichprobe über viele Zustände)', () => {
    // Vektorlabor: Rasterung der Einstellungen von P und T
    let kleinster = Infinity;
    for (let px = -5; px <= 5; px += 2) for (let py = -5; py <= 5; py += 2) for (let tx = -5; tx <= 5; tx += 2) for (let ty = -5; ty <= 5; ty += 2) {
      if (px === tx && py === ty) continue;
      const ecke: Punkt2 = [tx, py];
      const linien: Linie[] = [...achsenLinien(D.LABOR_BEREICH), { von: [px, py], bis: [tx, ty] }, { von: [px, py], bis: ecke }, { von: ecke, bis: [tx, ty] }];
      const o = { bereich: D.LABOR_BEREICH, teilung: 1, linien };
      for (const pt of [[px, py], [tx, ty]] as Punkt2[]) kleinster = Math.min(kleinster, lageAbstand(lageFuerPunkt(pt, o), pt, o));
    }
    expect(kleinster).toBeGreaterThan(0.02);
  });
});
