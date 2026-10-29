import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ladeInhalte } from '../build/inhalte.ts';
import { AppInhalt } from '../src/app/AppInhalt';
import { alleModule, baueNavigation, modulNummer, nummerierterTitel } from '../src/lib/navigation.ts';
import type { Inhalt } from '../src/lib/typen.ts';
import { inhaltFuerVeroeffentlichung } from '../src/lib/veroeffentlichung.ts';
import { pruefeInhalte } from '../src/lib/validierung.ts';
import { basisRoh } from './hilfen.ts';

const lader = () => Promise.reject(new Error('nicht benötigt'));

describe('Inhalt des öffentlichen Builds', () => {
  const inhalt: Inhalt = {
    themen: [{ id: 'a', titel: 'A' }, { id: 'b', titel: 'B' }],
    module: [
      { id: 'm1', titel: 'M1', thema: 'a', status: 'freigegeben', beschreibung: 'x' },
      { id: 'm2', titel: 'M2', thema: 'a', status: 'freigegeben', beschreibung: 'x' },
      { id: 'm3', titel: 'M3', thema: 'b', status: 'freigegeben', beschreibung: 'x' },
      { id: 'm4', titel: 'M4', thema: 'b', status: 'entwurf', beschreibung: 'x' },
    ],
    kurse: [
      { id: 'echt', titel: 'Echt', themen: ['a'], module: ['m1'], aktuellesModul: null },
      { id: 'demo', titel: 'Demo', themen: ['a', 'b'], module: ['m1', 'm2', 'm3', 'm4'], aktuellesModul: null, nurVorschau: true },
    ],
  };
  const pub = inhaltFuerVeroeffentlichung(inhalt);

  it('entfernt Kurse mit nurVorschau', () => {
    expect(pub.kurse.map((k) => k.id)).toEqual(['echt']);
  });
  it('behält nur freigegebene Module, die in einem veröffentlichten Kurs stehen', () => {
    expect(pub.module.map((m) => m.id)).toEqual(['m1']); // m2 und m3 sind freigegeben, aber in keinem veröffentlichten Kurs
  });
  it('behält nur Themenbereiche mit veröffentlichten Modulen', () => {
    expect(pub.themen.map((t) => t.id)).toEqual(['a']);
  });
});

describe('Validierung: Kurse nur für die Vorschau', () => {
  const roh = () => {
    const r = basisRoh();
    r.kurse[0]!.daten = { id: 'k1', titel: 'K1', themen: ['trig', 'diff'], module: ['m-frei', 'm-entwurf'], aktuellesModul: null };
    return r;
  };
  it('ein veröffentlichter Kurs darf im Produktionsmodus keinen Entwurf nennen', () => {
    expect(pruefeInhalte(roh(), { produktion: true }).fehler.join('\n')).toMatch(/Entwurf/);
  });
  it('ein Kurs mit nurVorschau darf Entwürfe nennen', () => {
    const r = roh();
    (r.kurse[0]!.daten as Record<string, unknown>).nurVorschau = true;
    const e = pruefeInhalte(r, { produktion: true });
    expect(e.fehler).toEqual([]);
    expect(e.inhalt.kurse[0]!.nurVorschau).toBe(true);
  });
  it('nurVorschau muss ein Wahrheitswert sein', () => {
    const r = roh();
    (r.kurse[0]!.daten as Record<string, unknown>).nurVorschau = 'ja';
    expect(pruefeInhalte(r, { produktion: false }).fehler.join('\n')).toMatch(/nurVorschau/);
  });
});

describe('Echte Inhalte: was veröffentlicht wird', () => {
  const alle = ladeInhalte(process.cwd(), { produktion: true });
  const pub = inhaltFuerVeroeffentlichung(alle);

  const MODULE = ['einheitskreis-sinus-kosinus', 'lage-im-koordinatensystem', 'markante-punkte', 'trigonometrische-gleichungen', 'modellierungsaufgaben', 'ich-kann-liste'];
  const BASIS_MODULE = [...MODULE, 'summe-produkt-funktionen', 'verkettung', 'umkehrfunktion', 'gemischte-aufgaben-zusammengesetzte-funktionen', 'ich-kann-liste-zusammengesetzte-funktionen', 'aenderungsraten', 'ableitungsregeln', 'produkt-kettenregel', 'tangenten', 'grafisches-differenzieren', 'kurvendiskussion', 'ausfuehrliche-kurvendiskussion', 'optimierung', 'funktionsterme-aufstellen', 'uebungsaufgaben-abiturstil', 'ich-kann-liste-differentialrechnung', 'integral-hinfuehrung', 'bestimmtes-integral'];
  it('veröffentlicht werden ausschließlich die Kurse Abitur 2027 (Basiskurs, drei Themen, vierzehn Module) und Abitur 2028 (ein Thema, sechs Module)', () => {
    expect(pub.kurse.map((k) => k.id).sort()).toEqual(['abitur-2027', 'abitur-2028']);
    expect(pub.kurse.find((k) => k.id === 'abitur-2027')!.titel).toBe('Abitur 2027');
    expect(pub.kurse.find((k) => k.id === 'abitur-2027')!.themen).toEqual(['trigonometrische-funktionen', 'zusammengesetzte-funktionen', 'differentialrechnung', 'integralrechnung']);
    expect(pub.kurse.find((k) => k.id === 'abitur-2027')!.module).toEqual(BASIS_MODULE);
    expect(pub.kurse.find((k) => k.id === 'abitur-2028')!.themen).toEqual(['trigonometrische-funktionen']);
    expect(pub.kurse.find((k) => k.id === 'abitur-2028')!.module).toEqual(MODULE);
    expect(pub.kurse.find((k) => k.id === 'abitur-2028')!.titel).toBe('Abitur 2028');
    // Das Modulregister hat keine feste Reihenfolge, die Reihenfolge und Nummerierung im Kurs kommt aus der Kursdatei (siehe nächster Test).
    expect(pub.module.map((m) => m.id).sort()).toEqual([...BASIS_MODULE].sort());
    for (const m of pub.module) expect(m.status).toBe('freigegeben');
    expect(pub.themen.map((t) => t.id)).toEqual(['trigonometrische-funktionen', 'zusammengesetzte-funktionen', 'differentialrechnung', 'integralrechnung']);
  });
  it('die Nummerierung im Kurs folgt der Kursdatei: 4. Trigonometrische Gleichungen, 5. Modellierungs- und Anwendungsaufgaben, 6. Ich-Kann-Liste', () => {
    for (const kurs of ['abitur-2027', 'abitur-2028']) {
      const nav = baueNavigation(pub, kurs, { entwuerfe: false })!;
      const titel = alleModule(nav).map((m) => m.titel);
      expect(titel[3]).toBe('Trigonometrische Gleichungen');
      expect(titel[4]).toBe('Modellierungs- und Anwendungsaufgaben');
      expect(titel[5]).toBe('Ich-Kann-Liste Trigonometrische Funktionen');
      expect(titel).toHaveLength(kurs === 'abitur-2027' ? 24 : 6);
    }
    const basis = alleModule(baueNavigation(pub, 'abitur-2027', { entwuerfe: false })!).map((m) => m.titel);
    expect(basis[6]).toBe('Summe, Differenz und Produkt von Funktionen');
    expect(basis[7]).toBe('Verkettung von Funktionen');
    expect(basis[8]).toBe('Umkehrfunktion');
    expect(basis[9]).toBe('Gemischte Aufgaben zu zusammengesetzten Funktionen');
    expect(basis[10]).toBe('Ich-Kann-Liste Zusammengesetzte Funktionen');
    expect(basis[11]).toBe('Von der mittleren zur momentanen Änderungsrate');
    expect(basis[12]).toBe('Ableitungsregeln');
    expect(basis[13]).toBe('Produktregel und Kettenregel');
  });
  it('Entwürfe und Module ohne veröffentlichten Kurs bleiben unveröffentlicht', () => {
    const veroeffentlicht = new Set(pub.module.map((m) => m.id));
    for (const m of alle.module.filter((x) => x.status === 'entwurf')) expect(veroeffentlicht.has(m.id), m.id).toBe(false);
    for (const m of pub.module) expect(m.status).toBe('freigegeben');
  });

  const seite = (route: Parameters<typeof AppInhalt>[0]['route']) => renderToStaticMarkup(<AppInhalt inhalt={pub} route={route} entwuerfe={false} lader={lader} />);

  it('die Kursseite zeigt nur das Thema und das nummerierte Modul', () => {
    const html = seite({ art: 'kurs', kurs: 'abitur-2028' });
    expect(html).toContain('Abitur 2028');
    expect(html).toContain('Trigonometrische Funktionen');
    expect(html).toContain('1. Vom Einheitskreis zu Sinus- und Kosinusfunktion');
    expect(html).toContain('2. Lage im Koordinatensystem');
    for (const nicht of ['Platzhalter', 'Differentialrechnung', 'Zusammengesetzte', 'Integralrechnung', 'Entwurf', 'Vorschau']) expect(html).not.toContain(nicht);
  });
  it('die Modulseite hat die Nummer in Überschrift und Navigation und zeigt das Untermenü', () => {
    const html = seite({ art: 'modul', kurs: 'abitur-2028', modul: 'einheitskreis-sinus-kosinus' });
    expect(html).toContain('<h1>1. Vom Einheitskreis zu Sinus- und Kosinusfunktion</h1>');
    expect(html).toMatch(/<a [^>]*>1\. Vom Einheitskreis zu Sinus- und Kosinusfunktion<\/a>/);
    for (const a of ['Erklären', 'Entdecken', 'Überprüfen', 'Zusammenfassung']) expect(html).toContain(`>${a}</a>`);
  });
  it('die Kursseite des Basiskurses Abitur 2027 zeigt dieselben Module', () => {
    const html = seite({ art: 'kurs', kurs: 'abitur-2027' });
    expect(html).toContain('Abitur 2027');
    expect(html).toContain('Basiskurs mit allen Modulen.');
    expect(html).toContain('6. Ich-Kann-Liste Trigonometrische Funktionen');
    expect(html).not.toContain('Abitur 2028');
  });
  it('die Startseite nennt keinen Kurs', () => {
    const html = seite({ art: 'start' });
    expect(html).not.toContain('Abitur 2028');
    expect(html).not.toContain('Abitur 2027');
  });
  it('die Modulseite des zweiten Moduls hat die Nummer 2 und die vier Abschnitte', () => {
    const html = seite({ art: 'modul', kurs: 'abitur-2028', modul: 'lage-im-koordinatensystem' });
    expect(html).toContain('<h1>2. Lage im Koordinatensystem</h1>');
    for (const a of ['Erklären', 'Entdecken', 'Überprüfen', 'Zusammenfassung']) expect(html).toContain(`>${a}</a>`);
  });
  it('unbekannte Kurse und Module sind nicht erreichbar', () => {
    expect(seite({ art: 'kurs', kurs: 'gibt-es-nicht' })).toContain('Seite nicht gefunden');
    expect(seite({ art: 'modul', kurs: 'abitur-2028', modul: 'gibt-es-nicht' })).toContain('Seite nicht gefunden');
  });
});

describe('Nummerierung der Module', () => {
  const inhalt: Inhalt = {
    themen: [{ id: 'a', titel: 'A' }, { id: 'b', titel: 'B' }],
    module: [
      { id: 'm1', titel: 'Erstes', thema: 'a', status: 'freigegeben', beschreibung: 'x' },
      { id: 'm2', titel: 'Zweites', thema: 'a', status: 'freigegeben', beschreibung: 'x' },
      { id: 'm3', titel: 'Drittes', thema: 'b', status: 'freigegeben', beschreibung: 'x' },
    ],
    kurse: [{ id: 'k', titel: 'K', themen: ['a', 'b'], module: ['m2', 'm1', 'm3'], aktuellesModul: null }],
  };
  const nav = baueNavigation(inhalt, 'k', { entwuerfe: false })!;
  it('zählt je Themenbereich ab 1 in der Reihenfolge des Kurses', () => {
    expect(modulNummer(nav, 'm2')).toBe(1);
    expect(modulNummer(nav, 'm1')).toBe(2);
    expect(modulNummer(nav, 'm3')).toBe(1);
    expect(modulNummer(nav, 'gibt-es-nicht')).toBeNull();
  });
  it('setzt die Nummer vor den Titel', () => {
    expect(nummerierterTitel(nav, inhalt.module[0]!)).toBe('2. Erstes');
    expect(nummerierterTitel(nav, inhalt.module[2]!)).toBe('1. Drittes');
  });
});
