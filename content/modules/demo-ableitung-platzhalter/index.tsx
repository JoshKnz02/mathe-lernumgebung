import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';

/** Platzhaltermodul zum Test der Plattform. Enthält keine Lerninhalte. */
export default function Modul() {
  return (
    <>
      <Hinweis titel="Platzhalter">
        Dieses Modul dient nur dem Test der Lernumgebung (Navigation, Freigaben, Formeldarstellung). Es enthält keine Lerninhalte.
      </Hinweis>
      <p>Testformel:</p>
      <Formel anzeige tex={String.raw`\frac{\mathrm{d}}{\mathrm{d}x}\,x^{n}=n\,x^{n-1}`} />
    </>
  );
}
