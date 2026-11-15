import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';

export function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als ganze Zahl, als Dezimalzahl mit Komma (<code>1,5</code>) oder als Bruch (zum Beispiel <Formel tex="\frac{2}{3}" nach=")" /> ein, ohne Einheit. Wurzeln gibst du nicht ein: Die Aufgaben haben ganze Ergebnisse, Brüche oder sind auf die genannte Stelle gerundet. Bei Punkten trägst du die Koordinaten einzeln ein, bei Vektoren die Zeilen von oben nach unten.
    </Hinweis>
  );
}
