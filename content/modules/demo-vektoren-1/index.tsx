import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';

export default function Modul() {
  return (
    <>
      <Abschnitt id="erklaeren" titel="Erklären"><p>Platzhalter mit dem Vektor <Formel tex="\vec{a}" nach="." /></p></Abschnitt>
      <Abschnitt id="entdecken" titel="Entdecken"><p>Platzhalter.</p></Abschnitt>
    </>
  );
}
