import { createContext, useContext, useId, useState, type ReactNode } from 'react';
import { Abzeichen } from '@/components/Abzeichen';
import { Modulverweis } from '@/components/Modulverweis';
import { ABSCHNITT_TITEL, MODULE, aussage } from './daten';
import { WAHL_REIHENFOLGE, WAHL_TEXT, WAHL_ZEICHEN } from './auswertung';
import { useIchKann } from './Zustand';

/** Verweise auf die passenden Abschnitte der Module, als Link, wenn der Kurs das Modul enthält. */
export function Verweise({ id }: { id: string }) {
  const a = aussage(id);
  return (
    <ul className="ik-verweise">
      {a.verweise.map((v) => (
        <li key={`${v.modul}/${v.abschnitt}`}>
          <Modulverweis modul={v.modul} abschnitt={v.abschnitt}>
            {MODULE[v.modul]}, {ABSCHNITT_TITEL[v.abschnitt]}
          </Modulverweis>
        </li>
      ))}
    </ul>
  );
}

/** Nur für Tests: Wenn true, sind alle Kontrollaufgaben von Anfang an geöffnet. */
export const KontrollenOffenKontext = createContext(false);

interface PunktProps {
  /** ID einer Aussage aus daten.ts. */
  id: string;
  /** Kontrollaufgabe(n). Ohne Kinder gibt es keine Kontrollaufgabe. */
  children?: ReactNode;
}

/**
 * Eine Aussage der Ich-Kann-Liste: Nummer, Aussage, Selbsteinschätzung (++, 00, −−), Verweise auf die Module
 * und die Kontrollaufgabe, die erst nach Klick erscheint.
 */
export function Punkt({ id, children }: PunktProps) {
  const a = aussage(id);
  const basis = useId();
  const { wahl, setzeWahl } = useIchKann();
  const [offen, setOffen] = useState(useContext(KontrollenOffenKontext));
  const aktuell = wahl[id];
  return (
    <section className="ik-punkt" data-wahl={aktuell ?? 'offen'} aria-labelledby={`${basis}-titel`}>
      <h3 id={`${basis}-titel`}>
        <span className="ik-nr">{a.nr}</span> Ich kann {a.text}
      </h3>
      <div className="abzeichen-zeile">
        <Abzeichen>Bildungsplan {a.bpe.join(', ')}</Abzeichen>
        {a.ergaenzt && <Abzeichen art="akzent">Ergänzt nach dem Bildungsplan</Abzeichen>}
      </div>
      <fieldset className="auswahl auswahl-reihe">
        <legend>Meine Einschätzung</legend>
        {WAHL_REIHENFOLGE.map((w) => (
          <label key={w} className="auswahl-option">
            <input type="radio" name={`${basis}-wahl`} value={w} checked={aktuell === w} onChange={() => setzeWahl(id, w)} />
            <span>
              <strong>{WAHL_ZEICHEN[w]}</strong> {WAHL_TEXT[w]}
            </span>
          </label>
        ))}
      </fieldset>
      <p className="ik-verweis-zeile">
        <strong>Dazu passt:</strong>
      </p>
      <Verweise id={id} />
      {children && (
        <>
          <div className="aufgabe-knoepfe">
            <button type="button" className="knopf-zweit" aria-expanded={offen} aria-controls={`${basis}-kontrolle`} onClick={() => setOffen((o) => !o)}>
              {offen ? 'Kontrollaufgabe ausblenden' : 'Kontrollaufgabe anzeigen'}
            </button>
          </div>
          <div id={`${basis}-kontrolle`}>{offen && children}</div>
        </>
      )}
    </section>
  );
}
