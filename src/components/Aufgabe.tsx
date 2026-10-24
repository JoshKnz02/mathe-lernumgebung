import { useId, useState, type ReactNode } from 'react';
import { bewerte, type Urteil } from '@/lib/eingabe';
import { Hinweis } from './Hinweis';

export interface Feld {
  id: string;
  beschriftung: ReactNode;
  /** Reiner Text als Name des Felds für Screenreader, z. B. "Parameter a". */
  name: string;
  erwartet: number;
  toleranz?: number;
}

interface AufgabeProps {
  nummer: number | string;
  titel: string;
  /** Aufgabenstellung. */
  children: ReactNode;
  felder: Feld[];
  /** Gestufte Hilfen, von allgemein nach konkret. */
  hilfen: ReactNode[];
  /** Schrittweise Musterlösung. */
  loesung: ReactNode[];
  /** Optional: wird nach jedem Prüfen aufgerufen, true wenn alle Felder richtig sind. */
  beiErgebnis?: (richtig: boolean) => void;
}

const URTEIL_TEXT: Record<Urteil, string> = {
  richtig: 'richtig',
  falsch: 'noch nicht richtig',
  ungueltig: 'keine gültige Zahl',
};

/**
 * Aufgabe mit Eingabefeldern, automatischer Rückmeldung, gestuften Hilfen und schrittweiser Lösung.
 * Eingaben und Ergebnisse bleiben im Browser und werden weder gespeichert noch übertragen.
 */
export function Aufgabe({ nummer, titel, children, felder, hilfen, loesung, beiErgebnis }: AufgabeProps) {
  const basis = useId();
  const [eingaben, setEingaben] = useState<Record<string, string>>({});
  const [urteile, setUrteile] = useState<Record<string, Urteil> | null>(null);
  const [hilfeAnzahl, setHilfeAnzahl] = useState(0);
  const [loesungSchritte, setLoesungSchritte] = useState(0);

  const pruefen = () => {
    const u = bewerte(felder, eingaben);
    setUrteile(u);
    beiErgebnis?.(felder.every((f) => u[f.id] === 'richtig'));
  };
  const aendern = (id: string, text: string) => {
    setEingaben((e) => ({ ...e, [id]: text }));
    setUrteile((u) => (u ? Object.fromEntries(Object.entries(u).filter(([k]) => k !== id)) as Record<string, Urteil> : u));
  };
  const alle = urteile ? felder.filter((f) => urteile[f.id] === 'richtig').length : 0;
  const fertig = urteile && felder.every((f) => urteile[f.id]);

  return (
    <section className="aufgabe" aria-labelledby={`${basis}-titel`}>
      <h3 id={`${basis}-titel`}>
        Aufgabe {nummer}: {titel}
      </h3>
      <div className="aufgabe-text">{children}</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          pruefen();
        }}
      >
        <div className="aufgabe-felder">
          {felder.map((f) => {
            const u = urteile?.[f.id];
            return (
              <div key={f.id} className={`feld${u ? ` feld-${u}` : ''}`}>
                <label htmlFor={`${basis}-${f.id}`}>{f.beschriftung}</label>
                <input
                  id={`${basis}-${f.id}`}
                  type="text"
                  inputMode="text"
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  aria-label={f.name}
                  value={eingaben[f.id] ?? ''}
                  aria-describedby={u ? `${basis}-${f.id}-urteil` : undefined}
                  aria-invalid={u === 'falsch' || u === 'ungueltig' ? true : undefined}
                  onChange={(e) => aendern(f.id, e.target.value)}
                />
                {u && (
                  <span id={`${basis}-${f.id}-urteil`} className="feld-urteil">
                    {URTEIL_TEXT[u]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="aufgabe-knoepfe">
          <button type="submit" className="knopf">
            Prüfen
          </button>
          <span role="status" className="aufgabe-ergebnis">
            {fertig ? (alle === felder.length ? 'Alles richtig.' : `${alle} von ${felder.length} richtig.`) : ''}
          </span>
        </div>
      </form>

      {hilfen.slice(0, hilfeAnzahl).map((h, i) => (
        <Hinweis key={i} titel={`Hilfe ${i + 1} von ${hilfen.length}`}>
          {h}
        </Hinweis>
      ))}
      {loesung.slice(0, loesungSchritte).map((s, i) => (
        <Hinweis key={i} art="merksatz" titel={`Lösungsschritt ${i + 1} von ${loesung.length}`}>
          {s}
        </Hinweis>
      ))}
      <div className="aufgabe-knoepfe">
        {hilfeAnzahl < hilfen.length && (
          <button type="button" className="knopf-zweit" onClick={() => setHilfeAnzahl((n) => n + 1)}>
            {hilfeAnzahl === 0 ? 'Hilfe anzeigen' : 'Weitere Hilfe anzeigen'}
          </button>
        )}
        {loesungSchritte < loesung.length && (
          <button type="button" className="knopf-zweit" onClick={() => setLoesungSchritte((n) => n + 1)}>
            {loesungSchritte === 0 ? 'Lösungsweg anzeigen' : 'Nächsten Lösungsschritt anzeigen'}
          </button>
        )}
      </div>
    </section>
  );
}
