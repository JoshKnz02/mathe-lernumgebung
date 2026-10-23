import { useId, useState, type ReactNode } from 'react';
import { bewerteAuswahl } from '@/lib/winkel';
import { Hinweis } from './Hinweis';

export interface Option {
  id: string;
  text: ReactNode;
  richtig: boolean;
  /** Rückmeldung, wenn diese Option gewählt und geprüft wurde. */
  rueckmeldung: ReactNode;
}

interface AuswahlfrageProps {
  nummer: string;
  titel: string;
  /** Fragestellung, ggf. mit Abbildung. */
  children: ReactNode;
  optionen: Option[];
  /** Erklärung der richtigen Antwort, erst nach Klick sichtbar. */
  erklaerung: ReactNode;
}

/**
 * Frage mit genau einer richtigen Antwort. Die Rückmeldung nennt keine Lösung, sondern erklärt die gewählte Antwort.
 * Eingaben bleiben im Browser.
 */
export function Auswahlfrage({ nummer, titel, children, optionen, erklaerung }: AuswahlfrageProps) {
  const basis = useId();
  const [gewaehlt, setGewaehlt] = useState<string | null>(null);
  const [geprueft, setGeprueft] = useState<string | null>(null);
  const [erklaerungOffen, setErklaerungOffen] = useState(false);
  const urteil = geprueft === gewaehlt ? bewerteAuswahl(optionen, geprueft) : 'offen';
  const option = optionen.find((o) => o.id === geprueft);

  return (
    <section className="aufgabe" aria-labelledby={`${basis}-titel`}>
      <h3 id={`${basis}-titel`}>
        Aufgabe {nummer}: {titel}
      </h3>
      <div className="aufgabe-text">{children}</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (gewaehlt !== null) setGeprueft(gewaehlt);
        }}
      >
        <fieldset className="auswahl">
          <legend className="nur-lesegeraet">Antwortmöglichkeiten</legend>
          {optionen.map((o) => (
            <label key={o.id} className="auswahl-option">
              <input type="radio" name={basis} value={o.id} checked={gewaehlt === o.id} onChange={() => setGewaehlt(o.id)} />
              <span>{o.text}</span>
            </label>
          ))}
        </fieldset>
        <div className="aufgabe-knoepfe">
          <button type="submit" className="knopf" disabled={gewaehlt === null}>
            Prüfen
          </button>
          <span role="status" className={`aufgabe-ergebnis${urteil === 'richtig' ? ' ergebnis-richtig' : ''}`}>
            {urteil === 'richtig' ? 'Richtig.' : urteil === 'falsch' ? 'Noch nicht richtig.' : ''}
          </span>
        </div>
      </form>
      {option && urteil !== 'offen' && <Hinweis titel="Rückmeldung zu deiner Antwort">{option.rueckmeldung}</Hinweis>}
      {erklaerungOffen && (
        <Hinweis art="merksatz" titel="Erklärung">
          {erklaerung}
        </Hinweis>
      )}
      {!erklaerungOffen && (
        <div className="aufgabe-knoepfe">
          <button type="button" className="knopf-zweit" onClick={() => setErklaerungOffen(true)}>
            Erklärung anzeigen
          </button>
        </div>
      )}
    </section>
  );
}
