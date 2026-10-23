import { describe, expect, it } from 'vitest';
import { ladeInhalte } from '../build/inhalte';
import { pruefeInhalte, pruefeOderWirf, InhaltsFehler } from '../src/lib/validierung';
import { basisRoh } from './hilfen';

const fehlerVon = (roh = basisRoh(), produktion = true) => pruefeInhalte(roh, { produktion }).fehler;

describe('Validierung', () => {
  it('akzeptiert einen gültigen Datensatz', () => {
    expect(fehlerVon()).toEqual([]);
  });

  it('akzeptiert die echten Inhalte des Repositorys im Produktionsmodus', () => {
    const inhalt = ladeInhalte(process.cwd(), { produktion: true });
    expect(inhalt.kurse.map((k) => k.id)).toEqual(expect.arrayContaining(['demo-a', 'demo-b']));
    expect(inhalt.module.some((m) => m.status === 'entwurf')).toBe(true);
  });

  it('meldet einen Kurs, der auf einen Entwurf verweist, im Produktionsmodus als Fehler', () => {
    const roh = basisRoh();
    roh.kurse[0]!.daten = { id: 'k1', titel: 'K1', themen: ['trig', 'diff'], module: ['m-frei', 'm-entwurf'], aktuellesModul: null };
    expect(fehlerVon(roh, true).join('\n')).toMatch(/m-entwurf.*Entwurf/);
    expect(() => pruefeOderWirf(roh, { produktion: true })).toThrow(InhaltsFehler);
  });

  it('erlaubt denselben Verweis auf einen Entwurf in der Vorschau', () => {
    const roh = basisRoh();
    roh.kurse[0]!.daten = { id: 'k1', titel: 'K1', themen: ['trig', 'diff'], module: ['m-frei', 'm-entwurf'], aktuellesModul: null };
    expect(fehlerVon(roh, false)).toEqual([]);
  });

  it('meldet unbekannte Module und Themen im Kurs', () => {
    const roh = basisRoh();
    roh.kurse[0]!.daten = { id: 'k1', titel: 'K1', themen: ['trig', 'gibt-es-nicht'], module: ['m-frei', 'fehlt'], aktuellesModul: null };
    const f = fehlerVon(roh).join('\n');
    expect(f).toMatch(/Thema "gibt-es-nicht" existiert nicht/);
    expect(f).toMatch(/Modul "fehlt" existiert nicht/);
  });

  it('meldet ein Modul, dessen Thema im Kurs nicht sichtbar ist', () => {
    const roh = basisRoh();
    roh.kurse[0]!.daten = { id: 'k1', titel: 'K1', themen: ['diff'], module: ['m-frei'], aktuellesModul: null };
    expect(fehlerVon(roh).join('\n')).toMatch(/nicht sichtbar/);
  });

  it('meldet ein sichtbares Thema ohne Modul', () => {
    const roh = basisRoh();
    roh.kurse[0]!.daten = { id: 'k1', titel: 'K1', themen: ['trig', 'diff'], module: ['m-frei'], aktuellesModul: null };
    expect(fehlerVon(roh).join('\n')).toMatch(/Thema "diff" ist sichtbar, enthält aber kein/);
  });

  it('meldet ein aktuelles Modul außerhalb der Kursmodule', () => {
    const roh = basisRoh();
    roh.kurse[0]!.daten = { id: 'k1', titel: 'K1', themen: ['trig'], module: ['m-frei'], aktuellesModul: 'm-entwurf' };
    expect(fehlerVon(roh).join('\n')).toMatch(/aktuellesModul/);
  });

  it('meldet doppelte IDs und Abweichungen zwischen ID und Ordner- bzw. Dateiname', () => {
    const roh = basisRoh();
    roh.module.push({ ...roh.module[0]!, ordner: 'anderer-ordner' });
    roh.kurse[0]!.datei = 'courses/anders.json';
    const f = fehlerVon(roh).join('\n');
    expect(f).toMatch(/Modul-ID "m-frei" kommt mehrfach vor/);
    expect(f).toMatch(/muss dem Ordnernamen/);
    expect(f).toMatch(/muss dem Dateinamen/);
  });

  it('meldet ungültigen Status, fehlende index.tsx und ungültige IDs', () => {
    const roh = basisRoh();
    roh.module[0]!.hatIndex = false;
    (roh.module[0]!.daten as Record<string, unknown>).status = 'veröffentlicht';
    roh.themen.daten = { themen: [{ id: 'Ungültig ID', titel: 'x' }] };
    const f = fehlerVon(roh).join('\n');
    expect(f).toMatch(/index\.tsx fehlt/);
    expect(f).toMatch(/"status" muss/);
    expect(f).toMatch(/"id" fehlt oder ist ungültig/);
  });

  it('prüft Abschnitte eines Moduls', () => {
    const mit = (abschnitte: unknown) => {
      const roh = basisRoh();
      (roh.module[0]!.daten as Record<string, unknown>).abschnitte = abschnitte;
      return pruefeInhalte(roh, { produktion: true });
    };
    const gut = mit([{ id: 'erklaeren', titel: 'Erklären' }, { id: 'ueben', titel: 'Üben' }]);
    expect(gut.fehler).toEqual([]);
    expect(gut.inhalt.module[0]!.abschnitte).toEqual([{ id: 'erklaeren', titel: 'Erklären' }, { id: 'ueben', titel: 'Üben' }]);
    expect(mit([]).fehler.join('\n')).toMatch(/nicht leere Liste/);
    expect(mit('x').fehler.join('\n')).toMatch(/nicht leere Liste/);
    expect(mit([{ id: 'Ungültig', titel: 'x' }]).fehler.join('\n')).toMatch(/Abschnitt 1 braucht/);
    expect(mit([{ id: 'a', titel: '' }]).fehler.join('\n')).toMatch(/Abschnitt 1 braucht/);
    expect(mit([{ id: 'a', titel: 'A' }, { id: 'a', titel: 'B' }]).fehler.join('\n')).toMatch(/Abschnitts-ID "a" kommt mehrfach vor/);
  });
});
