import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';

export function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als Dezimalzahl mit Komma (<code>0,87</code>), als Bruch (zum Beispiel <Formel tex="\frac{3}{4}" nach=")" /> oder als Vielfaches von <Formel tex="\pi" /> (zum Beispiel <Formel tex="\frac{\pi}{3}" /> oder <Formel tex="\frac{5\pi}{3}" nach=")" /> ein, ohne Einheit. Bei Aufgaben mit dem Taschenrechner werden Dezimalzahlen auf zwei Nachkommastellen genau akzeptiert, der Taschenrechner steht auf Bogenmaß.
    </Hinweis>
  );
}
