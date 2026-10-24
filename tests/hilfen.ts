import type { Inhalt, RohInhalt } from '../src/lib/typen';

/** Kleiner gültiger Datensatz für Validierungstests. */
export function basisRoh(): RohInhalt {
  return {
    themen: { datei: 'content/themen.json', daten: { themen: [{ id: 'trig', titel: 'Trigonometrie' }, { id: 'diff', titel: 'Differential' }] } },
    module: [
      { ordner: 'm-frei', datei: 'content/modules/m-frei/meta.json', hatIndex: true, daten: { id: 'm-frei', titel: 'Frei', thema: 'trig', status: 'freigegeben', beschreibung: 'x' } },
      { ordner: 'm-entwurf', datei: 'content/modules/m-entwurf/meta.json', hatIndex: true, daten: { id: 'm-entwurf', titel: 'Entwurf', thema: 'diff', status: 'entwurf', beschreibung: 'x' } },
    ],
    kurse: [
      { datei: 'courses/k1.json', daten: { id: 'k1', titel: 'K1', themen: ['trig'], module: ['m-frei'], aktuellesModul: 'm-frei' } },
    ],
  };
}


/**
 * Eigener Testdatensatz, unabhängig von den echten Inhalten: zwei Kurse mit unterschiedlichen Freigaben,
 * ein gemeinsam genutztes Modul (m1), ein Entwurf mit Abschnitten (m4) und Module ohne Abschnitte.
 */
export function beispielInhalt(): Inhalt {
  const modul = (id: string, titel: string, thema: string, status: 'freigegeben' | 'entwurf' = 'freigegeben') => ({ id, titel, thema, status, beschreibung: `Beschreibung ${titel}` });
  return {
    themen: [{ id: 'ta', titel: 'Thema A' }, { id: 'tb', titel: 'Thema B' }, { id: 'tc', titel: 'Thema C' }],
    module: [
      modul('m1', 'Modul Eins', 'ta'),
      modul('m2', 'Modul Zwei', 'ta'),
      modul('m3', 'Modul Drei', 'tb'),
      { ...modul('m4', 'Modul Vier', 'tc', 'entwurf'), abschnitte: [{ id: 'erklaeren', titel: 'Erklären' }, { id: 'ueben', titel: 'Üben' }] },
    ],
    kurse: [
      { id: 'k1', titel: 'Kurs Eins', themen: ['ta', 'tb'], module: ['m1', 'm2', 'm3'], aktuellesModul: 'm3' },
      { id: 'k2', titel: 'Kurs Zwei', themen: ['tb', 'ta'], module: ['m3', 'm1'], aktuellesModul: 'm1' },
    ],
  };
}
