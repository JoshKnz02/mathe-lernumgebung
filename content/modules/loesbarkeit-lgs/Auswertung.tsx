import { Formel } from '@/components/Formel';
import { auswerte, gaussSchritte, loesungsmenge, loesungsmengeTeX, parameterNamen, type Matrix } from '@/lib/lgs';

/** Stufenform nach dem Gauß-Algorithmus (bei einer Matrix, die schon in Stufenform ist, die Matrix selbst). */
export function stufenform(m: Matrix): Matrix {
  const s = gaussSchritte(m);
  return s.length ? s[s.length - 1]!.danach : m;
}

/** Auswertung einer Matrix in Stufenform in Worten und mit der Lösungsmenge. */
export function Auswertung({ stufe }: { stufe: Matrix }) {
  const a = auswerte(stufe);
  const l = loesungsmenge(stufe);
  const n = stufe[0]!.length - 1;
  const mitKoeff = a.pivots.length;
  const leer = a.leer.length > 0 ? (
    <>
      {' '}Die Nullzeile{a.leer.length > 1 ? 'n' : ''} <Formel tex="0=0" /> stellt keine Bedingung.
    </>
  ) : null;
  if (l.art === 'unloesbar') {
    const z = a.widerspruch[0]! + 1;
    const c = stufe[a.widerspruch[0]!]![n];
    return (
      <>
        <p>
          Zeile {z} lautet <Formel tex={`0=${c}`} nach="." /> Das ist ein Widerspruch, denn 0 ist nicht gleich {c}. Das System ist <strong>nicht lösbar</strong>.
        </p>
        <Formel anzeige tex={loesungsmengeTeX(l)} nach="." />
      </>
    );
  }
  if (l.art === 'eindeutig') {
    return (
      <>
        <p>
          Es gibt keine Widerspruchszeile. Es bleiben {mitKoeff} Zeilen mit Koeffizienten für {n} Unbekannte, und jede Unbekannte hat ein Pivot. Keine Unbekannte bleibt frei, das System ist <strong>eindeutig lösbar</strong>.{leer}
        </p>
        <Formel anzeige tex={loesungsmengeTeX(l)} nach="." />
      </>
    );
  }
  const namen = parameterNamen(l.frei.length);
  return (
    <>
      <p>
        Es gibt keine Widerspruchszeile. Es bleiben {mitKoeff} Zeilen mit Koeffizienten für {n} Unbekannte, also {l.frei.length === 1 ? 'bleibt eine Unbekannte' : `bleiben ${l.frei.length} Unbekannte`} frei: {l.frei.map((c, k) => (
          <span key={c}>
            {k > 0 && ' und '}
            <Formel tex={`x_${c + 1}=${namen[k]}`} />
          </span>
        ))}
        . Das System ist <strong>mehrdeutig lösbar</strong>, es hat unendlich viele Lösungen.{leer}
      </p>
      <Formel anzeige tex={loesungsmengeTeX(l, 'tupel')} nach="." />
      <Formel anzeige tex={loesungsmengeTeX(l, 'summe')} nach="." />
    </>
  );
}
