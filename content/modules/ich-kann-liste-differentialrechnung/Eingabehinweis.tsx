import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';

export function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als Dezimalzahl mit Komma (<code>0,87</code>), als Bruch (<code>3/4</code>) oder als Vielfaches von <Formel tex="\pi" /> (zum Beispiel <code>pi/3</code> oder <code>5pi/3</code>) ein, ohne Einheit. Bei Aufgaben mit dem Taschenrechner werden Dezimalzahlen auf zwei Nachkommastellen genau akzeptiert, der Taschenrechner steht auf Bogenmaß.
    </Hinweis>
  );
}
