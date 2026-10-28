import { Formel } from '@/components/Formel';
import { UEBERSETZUNG } from './daten';

/**
 * Liste der Formulierungen „K berührt die x-Achse …“ mit den zugehörigen Bedingungen. Jede Zeile klappt erst auf, wenn die Lernenden
 * die Bedingungen selbst aufgeschrieben haben (Vermutung vor Beobachtung).
 */
export function Uebersetzung() {
  return (
    <ol className="auftraege">
      {UEBERSETZUNG.map((u, i) => (
        <li key={i}>
          <details className="beobachtung">
            <summary>{u.text}</summary>
            <div>
              <p>
                Bedingungen: <Formel tex={u.tex} nach="." />
              </p>
            </div>
          </details>
        </li>
      ))}
    </ol>
  );
}
