import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';

export function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als ganze Zahl, als Dezimalzahl mit Komma (<code>0,8</code>) oder als Bruch (zum Beispiel <Formel tex="\frac{3}{4}" nach=")" /> ein, ohne Einheit. Bei Lösungen mit Parameter <Formel tex="t" /> sind die Zahlen vor und bei <Formel tex="t" /> gesucht, die Aufgabe sagt, welche Unbekannte der Parameter ist.
    </Hinweis>
  );
}
