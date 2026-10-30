import { useState } from 'react';
import { Formel } from '@/components/Formel';
import { Matrixfolge } from '@/components/Matrixfolge';
import { bruch, bruchTeX, erfuellt, folge, gaussSchritte, gleichungTeX, istStufenform, loeseStufenform, matrixTeX, tupelTeX, umformungsfehler, umformungTeX, wende, type Matrix, type Umformung } from '@/lib/lgs';
import { LABOR_SYSTEME } from './daten';

export type Art = 'ersetze' | 'tausch' | 'mal';

export interface Eingabe {
  art: Art;
  /** Zeilennummern ab 0. */
  i: number;
  j: number;
  a: string;
  b: string;
  k: string;
}

const zahl = (text: string) => (text.trim() === '' ? NaN : Number(text.replace(',', '.').replace('−', '-')));

/** Baut aus den Eingaben des Labors eine Umformung. Nicht ganze Zahlen werden als NaN weitergereicht und von umformungsfehler abgelehnt. */
export function baueUmformung(e: Eingabe): Umformung {
  if (e.art === 'tausch') return { art: 'tausch', i: e.i, j: e.j };
  if (e.art === 'mal') return { art: 'mal', i: e.i, k: zahl(e.k) };
  return { art: 'ersetze', i: e.i, a: zahl(e.a), j: e.j, b: zahl(e.b) };
}

const START: Eingabe = { art: 'ersetze', i: 1, j: 0, a: '1', b: '-1', k: '2' };
const ZEILEN = [0, 1, 2];

export function Zeilenlabor() {
  const [sid, setSid] = useState(LABOR_SYSTEME[0]!.id);
  const [verlauf, setVerlauf] = useState<Umformung[]>([]);
  const [e, setE] = useState<Eingabe>(START);
  const [fehler, setFehler] = useState<string | null>(null);
  const [tipp, setTipp] = useState(false);

  const system = LABOR_SYSTEME.find((s) => s.id === sid)!;
  const zeilen = folge(system.matrix, verlauf);
  const aktuell: Matrix = zeilen[zeilen.length - 1]!.matrix;
  const loesung = system.loesung.map((x) => bruch(x));
  const fertig = istStufenform(aktuell);
  const ergebnis = fertig ? loeseStufenform(aktuell) : null;
  const vorschlag = gaussSchritte(aktuell)[0]?.umformung;

  const wechsle = (id: string) => {
    setSid(id);
    setVerlauf([]);
    setFehler(null);
    setTipp(false);
  };
  const fuehreAus = () => {
    const u = baueUmformung(e);
    const f = umformungsfehler(aktuell, u);
    if (f) {
      setFehler(f);
      return;
    }
    wende(aktuell, u);
    setFehler(null);
    setTipp(false);
    setVerlauf((v) => [...v, u]);
  };
  const feld = <K extends keyof Eingabe>(k: K, wert: Eingabe[K]) => setE((x) => ({ ...x, [k]: wert }));
  const zeilenWahl = (name: string, wert: number, k: 'i' | 'j') => (
    <label>
      {name}
      <select value={wert} onChange={(ev) => feld(k, Number(ev.target.value))}>
        {ZEILEN.map((z) => (
          <option key={z} value={z}>
            Zeile {z + 1}
          </option>
        ))}
      </select>
    </label>
  );
  const zahlFeld = (name: string, wert: string, k: 'a' | 'b' | 'k') => (
    <label>
      {name}
      <input type="text" inputMode="numeric" autoComplete="off" value={wert} onChange={(ev) => feld(k, ev.target.value)} />
    </label>
  );

  return (
    <div className="labor">
      <fieldset className="schalter-gruppe">
        <legend>Gleichungssystem</legend>
        <div className="schnellwahl">
          {LABOR_SYSTEME.map((s) => (
            <button key={s.id} type="button" className="chip" aria-pressed={sid === s.id} onClick={() => wechsle(s.id)}>
              {s.name}
            </button>
          ))}
        </div>
      </fieldset>

      <p>
        Das System hat die Lösung <Formel tex={`(x_1;\\,x_2;\\,x_3)=${tupelTeX(loesung)}`} nach="." /> Du kennst sie hier schon, um bei jedem Schritt zu prüfen, ob sie erhalten bleibt.
      </p>
      <ol className="labor-gleichungen" aria-label="Gleichungen des Ausgangssystems">
        {system.matrix.map((z, r) => (
          <li key={r}>
            <Formel tex={gleichungTeX(z)} />
          </li>
        ))}
      </ol>

      <h4>Aktuelle Matrix</h4>
      <div aria-live="polite">
        <Formel anzeige tex={matrixTeX(aktuell)} />
      </div>

      <fieldset className="schalter-gruppe">
        <legend>Umformung</legend>
        <div className="schnellwahl">
          <button type="button" className="chip" aria-pressed={e.art === 'ersetze'} onClick={() => feld('art', 'ersetze')}>Zeile ersetzen</button>
          <button type="button" className="chip" aria-pressed={e.art === 'tausch'} onClick={() => feld('art', 'tausch')}>Zeilen tauschen</button>
          <button type="button" className="chip" aria-pressed={e.art === 'mal'} onClick={() => feld('art', 'mal')}>Zeile multiplizieren</button>
        </div>
      </fieldset>
      <form
        className="zeilenlabor-form"
        onSubmit={(ev) => {
          ev.preventDefault();
          fuehreAus();
        }}
      >
        {e.art === 'ersetze' && (
          <>
            {zeilenWahl('Ersetzte Zeile', e.i, 'i')}
            {zahlFeld('Faktor a', e.a, 'a')}
            {zeilenWahl('Andere Zeile', e.j, 'j')}
            {zahlFeld('Faktor b', e.b, 'b')}
          </>
        )}
        {e.art === 'tausch' && (
          <>
            {zeilenWahl('Erste Zeile', e.i, 'i')}
            {zeilenWahl('Zweite Zeile', e.j, 'j')}
          </>
        )}
        {e.art === 'mal' && (
          <>
            {zeilenWahl('Zeile', e.i, 'i')}
            {zahlFeld('Faktor k', e.k, 'k')}
          </>
        )}
        <button type="submit" className="knopf">Ausführen</button>
      </form>
      {e.art === 'ersetze' && (
        <p className="klein">
          Die Zeile <Formel tex="Z_i" /> wird durch <Formel tex={String.raw`a\cdot Z_i+b\cdot Z_j`} /> ersetzt. Die andere Zeile bleibt unverändert.
        </p>
      )}
      <p className="zeilenlabor-fehler" role="status">{fehler ?? ''}</p>

      <h4>Probe mit der bekannten Lösung</h4>
      <ul className="zeilenlabor-probe" aria-live="polite">
        {aktuell.map((z, r) => {
          const ok = erfuellt([z], loesung);
          return (
            <li key={r}>
              Zeile {r + 1}: {ok ? 'erfüllt' : 'nicht erfüllt'}
            </li>
          );
        })}
      </ul>

      <h4>Verlauf</h4>
      {verlauf.length === 0 ? (
        <p>Noch keine Umformung.</p>
      ) : (
        <Matrixfolge zeilen={zeilen} beschreibung={`Verlauf der ${verlauf.length} Umformungen mit den Matrizen nach jedem Schritt`} unter={<>Blau: Pivot, orange: erzeugte Null.</>} />
      )}

      <div className="labor-knoepfe">
        <span className="klein">Schritte: {verlauf.length}</span>
        <div className="aufgabe-knoepfe">
          <button type="button" className="knopf-zweit" disabled={verlauf.length === 0} onClick={() => { setVerlauf((v) => v.slice(0, -1)); setFehler(null); }}>
            Letzten Schritt zurücknehmen
          </button>
          <button type="button" className="knopf-zweit" onClick={() => wechsle(sid)}>
            Zurücksetzen
          </button>
          {!fertig && (
            <button type="button" className="knopf-zweit" onClick={() => setTipp(true)}>
              Tipp anzeigen
            </button>
          )}
        </div>
      </div>
      {tipp && vorschlag && (
        <p aria-live="polite">
          Tipp: <Formel tex={umformungTeX(vorschlag)} nach="." />
        </p>
      )}
      {fertig && ergebnis?.art === 'eindeutig' && (
        <p className="zeilenlabor-erfolg" aria-live="polite">
          Stufenform erreicht. Rückwärtseinsetzen ergibt <Formel tex={`x_3=${bruchTeX(ergebnis.x[2]!)}`} nach="," /> <Formel tex={`x_2=${bruchTeX(ergebnis.x[1]!)}`} /> und <Formel tex={`x_1=${bruchTeX(ergebnis.x[0]!)}`} nach="." /> Die Lösungsmenge ist <Formel tex={`L=\\{${tupelTeX(ergebnis.x)}\\}`} nach="." />
        </p>
      )}
    </div>
  );
}
