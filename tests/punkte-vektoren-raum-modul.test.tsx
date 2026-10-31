import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/punkte-vektoren-raum/Bilder';
import * as D from '../content/modules/punkte-vektoren-raum/daten';
import Modul from '../content/modules/punkte-vektoren-raum/index';
import meta from '../content/modules/punkte-vektoren-raum/meta.json';
import { Punktlabor, punktlaborSpec } from '../content/modules/punkte-vektoren-raum/Punktlabor';
import { Raumvektorlabor, vektorlaborSpec } from '../content/modules/punkte-vektoren-raum/Raumvektorlabor';
import { Spiegellabor, spiegellaborSpec, type Wahl } from '../content/modules/punkte-vektoren-raum/Spiegellabor';
import themen from '../content/themen.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { bewerte } from '../src/lib/eingabe';
import { RAUM_BEREICH, RAUM_GRENZE, achsenLinienRaum, bildpunkt, normiert, oktant, raumLagen, sperrlinienRaum, x1ZahlMitte, type Punkt3, type RaumBildSpec } from '../src/lib/schraegbild';
import { lageAbstand } from '../src/lib/vektorbild';

interface AufgabeAufruf {
  nummer: string;
  children: ReactNode;
  felder: { id: string; erwartet: number; beschriftung: ReactNode }[];
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
const ORDNER = 'content/modules/punkte-vektoren-raum';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const wert = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!.erwartet;
const koord = (nr: string, praefix: string): number[] => [1, 2, 3].map((i) => wert(nr, `${praefix}${i}`));
const diff = (a: number[], b: number[]) => b.map((x, i) => x - a[i]!);
const gleichBild = (p: Punkt3, q: Punkt3) => bildpunkt(p)[0] === bildpunkt(q)[0] && bildpunkt(p)[1] === bildpunkt(q)[1];

/** Unabhängig: Oktantnummer aus den Vorzeichen (+ = 1, − = 0), Tabelle von Hand. */
const OKTANT_TABELLE: Record<string, number> = { '+++': 1, '-++': 2, '--+': 3, '+-+': 4, '++-': 5, '-+-': 6, '---': 7, '+--': 8 };
/** Die Zahlen an der x₁-Achse stehen schon im Bild, Beschriftungen müssen ihnen ausweichen. */
const zahlenX1 = Array.from({ length: 2 * RAUM_GRENZE + 1 }, (_, i) => i - RAUM_GRENZE).filter((k) => k !== 0).map((k) => normiert(x1ZahlMitte(k)));
const oktantVonHand = (p: number[]) => OKTANT_TABELLE[p.map((x) => (x > 0 ? '+' : '-')).join('')]!;

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Vektoren, hat vier Abschnitte, der Unterbereich existiert', () => {
    expect(meta.id).toBe('punkte-vektoren-raum');
    expect(meta.thema).toBe('vektorgeometrie');
    expect(meta.unterbereich).toBe('vektoren');
    expect(meta.bpe).toEqual(['7.1']);
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
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"punkte-vektoren-raum"');
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
    for (const wort of ['Schrägbild', 'Koordinatenebenen', 'Oktanten', 'Ortsvektor', 'Nullvektor', 'Gegenvektor', 'Zielpunkt', 'Ausgangspunkt', 'entgegen der Richtung']) expect(html, wort).toContain(wort);
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).not.toMatch(/\bpi\b|Pi\b/);
    expect(html).not.toMatch(/\d\/\d/);
  });
  it('das Erklären nimmt nichts vorweg: keine Koordinaten des Ortsvektors, keine Spiegelregel, keine Lage bei Koordinate 0, keine Mehrdeutigkeit', () => {
    const html = rendern('erklaeren');
    expect(html).not.toContain('dieselben Koordinaten');
    expect(html).not.toMatch(/Vorzeichen wechseln|wechselt das Vorzeichen/);
    expect(html).not.toMatch(/Koordinate ist 0|Koordinate 0/);
    expect(html).not.toMatch(/derselben Stelle/);
    expect(html).not.toContain('Fußpunkt');
  });
  it('verweist auf das Modul zur Ebene statt Gegenvektor und Verbindungsvektor zu wiederholen', () => {
    const quelle = readFileSync(`${ORDNER}/Erklaeren.tsx`, 'utf8');
    expect(quelle).toContain('modul="punkte-vektoren-ebene"');
    expect(rendern('erklaeren')).not.toMatch(/Zielpunkt minus Ausgangspunkt/);
  });
  it('das Betragsmodul wird nicht vorweggenommen', () => {
    expect(rendern(null)).not.toMatch(/Betrag|Länge des Vektors|\\sqrt\{4\^2/);
  });
});

describe('Darstellung: Schrägbild (2D) oder räumlich (3D)', () => {
  it('über jedem Raumbild gibt es den Schalter, die Startdarstellung ist das Schrägbild', () => {
    const html = rendern(null);
    const schalter = html.match(/class="darstellungswahl"/g) ?? [];
    const bilder = html.match(/class="raumbild"/g) ?? [];
    expect(bilder.length).toBeGreaterThan(7);
    expect(schalter.length).toBe(bilder.length);
    expect(html).toContain('Schrägbild (2D)');
    expect(html).toContain('Räumlich (3D)');
    expect(html).toMatch(/aria-pressed="true"[^>]*aria-label="Schrägbild in der Ebene/);
    expect(html).not.toContain('raumansicht-flaeche');
  });
  it('die Erklärung nennt beide Darstellungen und den Winkel von 45° mit dem Hinweis auf 135°', () => {
    const html = rendern('erklaeren');
    expect(html).toContain('Schrägbild oder räumliche Ansicht');
    expect(html).toContain('im Winkel von 45°');
    expect(html).toContain('135°');
  });
});

describe('Aufgaben und Auswahlfragen, unabhängig gerechnet', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('die Nummern: Aufgaben 1, 6 bis 12, Auswahlfragen 3, 4, 5, 13, 14, 15 (Aufgabe 2 ist eine Zeichenaufgabe)', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '6', '7', '8', '9', '10', '11', '12']);
    expect(fragen.map((q) => q.nummer)).toEqual(['3', '4', '5', '13', '14', '15']);
  });
  it('Aufgabe 1: Koordinaten aus dem Schrägbild, die Bildposition des Punkts passt zum gezeichneten Weg', () => {
    const p = [wert('1', 'p1'), wert('1', 'p2'), wert('1', 'p3')] as Punkt3;
    expect(p).toEqual(D.A_ABLESEN.p);
    const kontrolle = B.aufgAblesen(true);
    // Der Weg im Bild: entlang x₁ zur Fußecke, dann parallel zu x₂ und x₃. Die Bildkoordinaten stimmen mit X = p₂ − p₁/2, Y = p₃ − p₁/2 überein.
    const ende = kontrolle.linien![kontrolle.linien!.length - 1]!.bis;
    expect(ende).toEqual(p);
    expect(bildpunkt(p)).toEqual([p[1] - p[0] / 2, p[2] - p[0] / 2]);
    // Einheiten zählen: 2 Einheiten entgegen x₁, 2 in x₂-Richtung, 3 in x₃-Richtung
    expect([-p[0], p[1], p[2]]).toEqual([2, 2, 3]);
  });
  it('Aufgabe 2 (Zeichnen): Das Kontrollbild zeigt Q mit dem Weg 2 in x₁, 3 gegen x₂, 2 gegen x₃', () => {
    const q = D.A_ZEICHNEN.q;
    const k = B.aufgZeichnen;
    expect(k.punkte!.find((x) => x.name === 'Q')!.p).toEqual(q);
    expect(k.linien!.map((l) => diff(l.von, l.bis))).toEqual([[2, 0, 0], [0, -3, 0], [0, 0, -2]]);
  });
  it('Aufgabe 3: der richtige Punkt hat dasselbe Bild wie A, die drei falschen nicht', () => {
    const q = fragen.find((x) => x.nummer === '3')!;
    const a = D.A_GLEICHES_BILD;
    expect(gleichBild(a.a, a.richtig)).toBe(true);
    for (const f of a.falsch) expect(gleichBild(a.a, f), f.join(',')).toBe(false);
    expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
    const text = (id: string) => alsText(q.optionen.find((o) => o.id === id)!.text);
    expect(text('a')).toContain('3\\,|\\,2\\,|\\,2');
    // alle gelisteten Punkte im richtigen Fall: auch das Gegenstück s = −1 wäre (−1 | 0 | 0), kommt aber nicht als Antwort vor
    for (const o of q.optionen) expect(text(o.id)).not.toContain('-1\\,|\\,0\\,|\\,0');
  });
  it('Aufgabe 4: der Oktant aus den Vorzeichen, die falschen Antworten sind die genannten typischen Fehler', () => {
    const q = fragen.find((x) => x.nummer === '4')!;
    expect(oktantVonHand(D.A_OKTANT.p)).toBe(D.A_OKTANT.nr);
    expect(oktant(D.A_OKTANT.p)).toBe(D.A_OKTANT.nr);
    expect(alsText(q.optionen.find((o) => o.richtig)!.text)).toContain('Oktant VI');
    // II: dieselben Vorzeichen bei p₁ und p₂, aber p₃ positiv; VII: alle negativ; VIII: p₁ und p₂ vertauscht
    expect(oktantVonHand([-2, 3, 1])).toBe(2);
    expect(oktantVonHand([-2, -3, -1])).toBe(7);
    expect(oktantVonHand([2, -3, -1])).toBe(8);
  });
  it('Aufgabe 5: Punkte der x₁x₃-Ebene haben x₂ = 0, jede falsche Antwort beschreibt etwas anderes', () => {
    const q = fragen.find((x) => x.nummer === '5')!;
    expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
    expect(alsText(q.optionen.find((o) => o.richtig)!.text)).toContain('x_2');
    expect(alsText(q.optionen.find((o) => o.richtig)!.text)).toContain('0');
  });
  it('Aufgabe 6: Spiegelpunkte mit Diagonalmatrizen gerechnet', () => {
    const p = D.A_SPIEGELN.p;
    expect(koord('6', 'eA')).toEqual([p[0] * 1, p[1] * 1, p[2] * -1]);
    expect(koord('6', 'aB')).toEqual([p[0] * -1, p[1] * 1, p[2] * -1]);
  });
  it('Aufgabe 7: Fußpunkte, über die Normalenkomponente gerechnet', () => {
    const q = D.A_PROJEKTION.q;
    expect(koord('7', 'fF')).toEqual([q[0], q[1] - q[1], q[2]]);
    expect(koord('7', 'gG')).toEqual([q[0], q[1], q[2] - q[2]]);
  });
  it('Aufgabe 8: Zurückspiegeln ergibt P, und P liegt im Oktanten, aus dem gespiegelt wurde', () => {
    const p = koord('8', 'P');
    const s = D.A_UMKEHR.spiegel;
    expect([p[0], -p[1]!, p[2]]).toEqual(s);
  });
  it('Aufgabe 9: Quader mit allen Ecken aus den Maxima und Minima der Koordinaten, Kanten paarweise senkrecht', () => {
    const q = D.A_QUADER;
    const ecken = [[0, 0, 0], q.a, q.b, q.c, q.d, q.e, q.f, q.g];
    const maxima = [Math.max(...ecken.map((e) => e[0]!)), Math.max(...ecken.map((e) => e[1]!)), Math.max(...ecken.map((e) => e[2]!))];
    expect(koord('9', 'fF')).toEqual(maxima);
    // Jede Ecke hat nur die Koordinaten 0 oder das Maximum, und es sind genau 8 verschiedene
    expect(new Set(ecken.map((e) => e.join(','))).size).toBe(8);
    for (const e of ecken) e.forEach((x, i) => expect([0, maxima[i]]).toContain(x));
    expect(koord('9', 'gG')).toEqual([0, maxima[1], maxima[2]]);
    // Kanten von O: OA, OC, OD sind paarweise senkrecht (Skalarprodukt 0), und F − O = OA + OC + OD
    const oa = q.a, oc = q.c, od = q.d;
    const sp = (u: number[], v: number[]) => u[0]! * v[0]! + u[1]! * v[1]! + u[2]! * v[2]!;
    expect([sp(oa, oc), sp(oa, od), sp(oc, od)]).toEqual([0, 0, 0]);
    expect(q.f).toEqual([oa[0] + oc[0] + od[0], oa[1] + oc[1] + od[1], oa[2] + oc[2] + od[2]]);
  });
  it('Aufgaben 10 bis 12: Vektor, Zielpunkt, Ausgangspunkt mit Probe', () => {
    const v = D.A_VEKTOR;
    expect(koord('10', 'ab')).toEqual(diff(v.a, v.b));
    const z = D.A_ZIEL;
    const b = koord('11', 'B');
    expect(b).toEqual(z.a.map((x, i) => x + z.v[i]!));
    expect(diff(z.a, b)).toEqual(z.v);
    const s = D.A_START;
    const a = koord('12', 'A');
    expect(a).toEqual(s.b.map((x, i) => x - s.v[i]!));
    expect(diff(a, s.b)).toEqual(s.v);
  });
  it('Auswahlfragen 13 bis 15: Ortsvektor, Nullvektor, Gegenvektor', () => {
    const q13 = fragen.find((x) => x.nummer === '13')!;
    expect(alsText(q13.optionen.find((o) => o.richtig)!.text)).toContain(`${D.A_ORT.p[0]}\\\\${D.A_ORT.p[1]}\\\\${D.A_ORT.p[2]}`);
    const q15 = fragen.find((x) => x.nummer === '15')!;
    expect(D.A_GEGEN.gegen).toEqual(D.A_GEGEN.v.map((x) => -x));
    expect(alsText(q15.optionen.find((o) => o.richtig)!.text)).toContain('-7\\\\-3\\\\2');
    const q14 = fragen.find((x) => x.nummer === '14')!;
    expect(q14.optionen.filter((o) => o.richtig)).toHaveLength(1);
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
  it('jeder erwartete Wert wird richtig bewertet, ein falscher nicht', () => {
    for (const a of aufgaben)
      for (const f of a.felder) {
        const eingabe = String(f.erwartet).replace('-', '−');
        expect(bewerte([{ id: f.id, erwartet: f.erwartet }], { [f.id]: eingabe })[f.id], `${a.nummer} ${f.id}`).toBe('richtig');
        expect(bewerte([{ id: f.id, erwartet: f.erwartet }], { [f.id]: String(f.erwartet + 1) })[f.id], `${a.nummer} ${f.id}`).toBe('falsch');
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

describe('Schaubilder: alles im Bild, Beschriftungen auf freien Seiten, Textalternativen', () => {
  const [xmin, xmax, ymin, ymax] = RAUM_BEREICH;
  const bilder: [string, RaumBildSpec][] = [
    ['Erklärt', B.BILD_ERKLAERT],
    ['Ebenen', B.BILD_EBENEN],
    ['Oktanten', B.BILD_OKTANTEN],
    ['Gleich E', B.BILD_GLEICH_E],
    ['Gleich', B.BILD_GLEICH],
    ['Ablesen', B.aufgAblesen(false)],
    ['Ablesen Kontrolle', B.aufgAblesen(true)],
    ['Zeichnen', B.aufgZeichnen],
    ['Quader', B.aufgQuader(false)],
    ['Quader Kontrolle', B.aufgQuader(true)],
    ['Spiegel E', B.BILD_SPIEGEL_E],
    ['Spiegel Zusammenfassung', B.spiegelBild(D.ZUSAMMENFASSUNG.p, D.ZUSAMMENFASSUNG.e12, D.ZUSAMMENFASSUNG.a1, D.ZUSAMMENFASSUNG.o)],
  ];
  it('jedes Schaubild hat eine Textalternative, jeder Punkt und jede Linie liegt im Bildbereich', () => {
    for (const [name, s] of bilder) {
      expect(s.sprech.length, name).toBeGreaterThan(40);
      expect(s.sprech, name).not.toMatch(/[–—]/);
      for (const p of s.punkte ?? []) {
        const [x, y] = bildpunkt(p.p);
        expect(x >= xmin && x <= xmax && y >= ymin && y <= ymax, `${name} ${p.name}`).toBe(true);
      }
      for (const l of s.linien ?? []) for (const e of [l.von, l.bis]) {
        const [x, y] = bildpunkt(e);
        expect(x >= xmin && x <= xmax && y >= ymin && y <= ymax, `${name} Linie`).toBe(true);
      }
    }
  });
  it('jede Beschriftung hat Abstand zu allen Linien, Achsen, Achsenzahlen und anderen Beschriftungen (Stichprobe der festen Bilder)', () => {
    for (const [name, s] of bilder) {
      const lagen = raumLagen(s);
      for (const l of lagen) {
        const pt = s.punkte!.find((p) => p.name === l.name)!;
        const andere = [...zahlenX1, ...lagen.filter((x) => x !== l).map((x) => normiert(x.mitte))];
        const d = lageAbstand(l.lage, bildpunkt(pt.p), { bereich: RAUM_BEREICH, teilung: 1, linien: sperrlinienRaum(s.linien), belegt: andere });
        expect(d, `${name} ${l.name}`).toBeGreaterThanOrEqual(0.015);
      }
    }
  });
  it('die Nummern der Oktanten stehen mit Abstand zu den Achsen im Bild', () => {
    const achsen = achsenLinienRaum();
    for (const p of B.BILD_OKTANTEN.punkte!) {
      const [x, y] = bildpunkt(p.p);
      for (const a of achsen) {
        const [dx, dy] = [a.bis[0] - a.von[0], a.bis[1] - a.von[1]];
        const abstand = Math.abs(dx * (a.von[1] - y) - dy * (a.von[0] - x)) / Math.hypot(dx, dy);
        expect(abstand, p.name).toBeGreaterThan(0.8);
      }
    }
    expect(B.BILD_OKTANTEN.punkte!.map((p) => p.name)).toEqual(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']);
    B.BILD_OKTANTEN.punkte!.forEach((p, i) => expect(oktant(p.p)).toBe(i + 1));
  });
  it('die Bildpunkte der Mehrdeutigkeits-Bilder fallen zusammen', () => {
    for (const s of [B.BILD_GLEICH, B.BILD_GLEICH_E]) {
      const [a, b] = s.punkte!;
      expect(gleichBild(a!.p, b!.p)).toBe(true);
      expect(a!.p).not.toEqual(b!.p);
    }
  });
  it('die Spiegelbilder zeigen die Spiegelpunkte der Rechnung', () => {
    const s = B.BILD_SPIEGEL_E;
    expect(s.punkte!.map((p) => p.p)).toEqual([[3, -2, 4], [3, -2, -4], [3, 2, -4], [-3, 2, -4]]);
    expect(s.ebenen).toEqual(['e12']);
  });
});

describe('Labore', () => {
  it('rendern mit Textalternative und Schaltern, ohne Formelfehler und Gedankenstriche', () => {
    for (const html of [renderToStaticMarkup(<Punktlabor />), renderToStaticMarkup(<Spiegellabor />), renderToStaticMarkup(<Raumvektorlabor />)]) {
      expect(html).not.toContain('formel-fehler');
      expect(html).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(html).not.toContain(z);
      expect(html).toContain('type="range"');
    }
    expect(renderToStaticMarkup(<Punktlabor />)).toContain('Gleiche Stelle im Schrägbild');
    expect(renderToStaticMarkup(<Raumvektorlabor />)).toContain('Rechnung einblenden');
    expect(renderToStaticMarkup(<Spiegellabor />)).toContain('aria-pressed');
  });
  it('Startwerte: Punktlabor zeigt die Lage, Vektorlabor die Koordinaten von AB und BA', () => {
    const html = renderToStaticMarkup(<Raumvektorlabor />);
    const ab = diff(D.VEKTORLABOR_START.a, D.VEKTORLABOR_START.b);
    expect(html).toContain(`\\overrightarrow{AB}=\\begin{pmatrix}${ab[0]}\\\\${ab[1]}\\\\${ab[2]}\\end{pmatrix}`);
    expect(html).toContain(`\\overrightarrow{BA}=\\begin{pmatrix}${-ab[0]!}\\\\${-ab[1]!}\\\\${-ab[2]!}\\end{pmatrix}`);
    expect(renderToStaticMarkup(<Punktlabor />)).toContain('Der Punkt liegt im Oktanten');
  });
  it('die Bilder der Labore: Punktlabor mit allen Optionen, Spiegellabor mit allen Wahlen, Vektorlabor mit allen Schaltern', () => {
    const p: Punkt3 = [3, 2, -1];
    const s = punktlaborSpec(p, true, true, true);
    expect(s.punkte![0]!.p).toEqual(p);
    expect(s.linien).toHaveLength(3);
    expect(s.ebenen).toEqual(['e12', 'e13', 'e23']);
    for (const q of s.punkte!.slice(1)) expect(gleichBild(p, q.p as Punkt3)).toBe(true);
    const wahlen: Wahl[] = [...(['e12', 'e13', 'e23', 'a1', 'a2', 'a3', 'o'] as const).map((an): Wahl => ({ art: 'spiegeln', an })), ...(['e12', 'e13', 'e23'] as const).map((auf): Wahl => ({ art: 'projizieren', auf }))];
    for (const w of wahlen) {
      const sp = spiegellaborSpec([3, -2, 4], w);
      expect(sp.sprech.length).toBeGreaterThan(30);
      expect(sp.punkte![0]!.p).toEqual([3, -2, 4]);
    }
    const v = vektorlaborSpec([1, -2, 1], [3, 1, -2], true, true);
    expect(v.linien).toHaveLength(5);
    expect(v.punkte!.map((x) => x.name)).toEqual(['A', 'B', 'O']);
    // der Weg in drei Schritten endet in B und verläuft nacheinander parallel zu x₁, x₂, x₃
    const weg = v.linien!.slice(0, 3);
    expect(weg.map((l) => diff(l.von, l.bis).map((x) => (x === 0 ? 0 : 1)))).toEqual([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
    expect(weg[2]!.bis).toEqual([3, 1, -2]);
  });
  it('die Beschriftungen der Labore haben für viele Einstellungen genügend Abstand', () => {
    let kleinster = Infinity;
    for (let a = -4; a <= 4; a += 2) for (let b = -4; b <= 4; b += 2) for (let c = -4; c <= 4; c += 2) {
      const s = punktlaborSpec([a, b, c], true, false, false);
      const lagen = raumLagen(s);
      for (const l of lagen) {
        const andere = [...zahlenX1, ...lagen.filter((x) => x !== l).map((x) => normiert(x.mitte))];
        const d = lageAbstand(l.lage, bildpunkt([a, b, c]), { bereich: RAUM_BEREICH, teilung: 1, linien: sperrlinienRaum(s.linien), belegt: andere });
        kleinster = Math.min(kleinster, d);
      }
    }
    // Punkte auf einer Achse (zum Beispiel der Ursprung) lassen keine Seite mit vollem Abstand zu, der Mindestabstand bleibt trotzdem deutlich über 0
    expect(kleinster).toBeGreaterThan(0.015);
  });
});
