import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';

/** Platzhaltermodul zum Test der Plattform. Enthält keine Lerninhalte. */
export default function Modul() {
  return (
    <>
      <Hinweis titel="Platzhalter">
        Dieses Modul dient nur dem Test der Lernumgebung (Navigation, Freigaben, Formeldarstellung). Es enthält keine Lerninhalte.
      </Hinweis>
      <p>ENTWURFS-MARKE-7f3a9c Testformel:</p>
      <Formel anzeige tex={String.raw`\int x^{n}\,\mathrm{d}x=\frac{x^{n+1}}{n+1}+C \quad (n\neq -1)`} />
    </>
  );
}
