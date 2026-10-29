import { useState } from 'react';
import { Formel } from '@/components/Formel';
import { ORANGE, SCHWARZ } from '@/components/Messbild';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { messeSteigung } from '@/lib/ableitung';
import { zahlTeX } from '@/lib/flaeche';
import { PROBE_FUNKTIONEN, stimmt, type Kandidat, type ProbeFunktion } from './daten';

const find = (id: ProbeFunktion['id']) => PROBE_FUNKTIONEN.find((f) => f.id === id)!;

/** Ableitung eines Vorschlags F an der Stelle x, numerisch (so wie man eine Tangentensteigung misst). */
export const ableitungVon = (c: Kandidat, x: number) => messeSteigung(c.F, x, 1e-5);

/** Alle Formeln der Anzeige (der Test rendert sie für alle Funktionen und Vorschläge). */
export function probeFormeln(p: ProbeFunktion, c: Kandidat) {
  return {
    f: `f(x)=${p.tex}`,
    F: `F(x)=${c.tex}`,
    zeilen: p.stellen.map((x) => ({ x: zahlTeX(x, 2), f: zahlTeX(p.f(x), 3), dF: zahlTeX(ableitungVon(c, x), 3) })),
  };
}

interface Zustand {
  p: ProbeFunktion;
  c: Kandidat;
}

function Zeichnung({ zustand, beschreibung }: { zustand: Zustand; beschreibung: string }) {
  const p = zustand.p;
  return (
    <Zeichenbrett
      bereich={p.bereich}
      xTeilung={p.teilung}
      yTeilung={p.yTeilung}
      xBeschriftung="zahl"
      xTitel="x"
      yTitel="y"
      className="brett-3zu2"
      beschreibung={beschreibung}
      zustand={zustand}
      aufbau={(b, lies) => {
        const stil = { highlight: false, fixed: true };
        b.create('functiongraph', [(x: number) => lies().p.f(x), p.von, p.bis], { ...stil, strokeColor: ORANGE, strokeWidth: 4 });
        b.create('functiongraph', [(x: number) => ableitungVon(lies().c, x), p.von, p.bis], { ...stil, strokeColor: SCHWARZ, strokeWidth: 2, dash: 3 });
      }}
    />
  );
}

/**
 * Probelabor: Zu einer Funktion f stehen mehrere Vorschläge für eine Stammfunktion F. Das Schaubild zeigt f (orange) und die Ableitung des Vorschlags
 * (schwarz gestrichelt). Liegen beide aufeinander, ist F eine Stammfunktion. Die Tabelle vergleicht die Werte. Bei falschen Vorschlägen steht der typische Fehler.
 */
export function Probelabor() {
  const [fId, setFId] = useState<ProbeFunktion['id']>('p1');
  const p = find(fId);
  const [kId, setKId] = useState(p.kandidaten[0]!.id);
  const c = p.kandidaten.find((x) => x.id === kId) ?? p.kandidaten[0]!;
  const ok = stimmt(p, c);
  const F = probeFormeln(p, c);
  const beschreibung = `Schaubild von f(x) gleich ${p.sprech} (orange) und der Ableitung des Vorschlags F (schwarz gestrichelt). ${ok ? 'Beide Kurven liegen aufeinander, F ist eine Stammfunktion von f.' : 'Die Kurven liegen nicht aufeinander, F ist keine Stammfunktion von f.'}`;

  const wechsle = (id: ProbeFunktion['id']) => {
    setFId(id);
    setKId(find(id).kandidaten[0]!.id);
  };

  return (
    <div className="labor">
      <Zeichnung zustand={{ p, c }} beschreibung={beschreibung} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> <Formel tex="K_f" /></li>
        <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> Ableitung des Vorschlags <Formel tex="F" /> (gestrichelt)</li>
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={F.f} />
        <Formel anzeige tex={F.F} />
        <p className={ok ? 'ergebnis-richtig' : undefined}>
          {ok ? <strong>Die Probe stimmt: F′ = f, der Vorschlag ist eine Stammfunktion.</strong> : <strong>Die Probe stimmt nicht: F′ weicht von f ab.</strong>} {c.grund}
        </p>
        <table className="tabelle tabelle-kompakt tabelle-breit">
          <caption>Vergleich der Werte</caption>
          <thead>
            <tr>
              <th scope="col"><Formel tex="x" /></th>
              <th scope="col"><Formel tex="f(x)" /></th>
              <th scope="col"><Formel tex="F'(x)" /></th>
            </tr>
          </thead>
          <tbody>
            {F.zeilen.map((z) => (
              <tr key={z.x}>
                <th scope="row"><Formel tex={z.x} /></th>
                <td><Formel tex={z.f} /></td>
                <td><Formel tex={z.dF} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="klein">Die Ableitung von <Formel tex="F" /> bestimmt das Labor numerisch aus sehr kleinen Schritten, die Werte sind auf drei Stellen gerundet.</p>
      </div>

      <div className="labor-bedienung">
        <fieldset className="schalter-gruppe">
          <legend>Funktion <Formel tex="f" /></legend>
          <div className="schnellwahl">
            {PROBE_FUNKTIONEN.map((x) => (
              <button key={x.id} type="button" className="chip" aria-pressed={fId === x.id} aria-label={x.sprech} onClick={() => wechsle(x.id)}>
                <Formel tex={x.tex} />
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="schalter-gruppe">
          <legend>Vorschlag für <Formel tex="F" /></legend>
          <div className="schnellwahl">
            {p.kandidaten.map((x) => (
              <button key={x.id} type="button" className="chip" aria-pressed={kId === x.id} onClick={() => setKId(x.id)}>
                <Formel tex={x.tex} />
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
}
