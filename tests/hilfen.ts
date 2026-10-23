import type { RohInhalt } from '../src/lib/typen';

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
