import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_BEGRIFFE } from './Bilder';

export function Erklaeren() {
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <h3>Von <Formel tex="K_f" /> zu <Formel tex="K_{f'}" /></h3>
      <p>
        Beim <strong>grafischen Differenzieren</strong> zeichnest du das Schaubild der Ableitungsfunktion, ohne einen Funktionsterm zu benutzen. Du gehst Stelle für Stelle vor: Zu jedem <Formel tex="x" /> bestimmst du die Steigung der Tangente an <Formel tex="K_f" nach="." /> Diese Steigung trägst du an derselben Stelle als Höhe ein. Aus dem Punkt <Formel tex={t`(x\,|\,f(x))`} /> von <Formel tex="K_f" /> wird der Punkt <Formel tex={t`(x\,|\,f'(x))`} /> von <Formel tex="K_{f'}" nach="." />
      </p>
      <Formel anzeige tex={t`(x\,|\,f(x))\ \longrightarrow\ (x\,|\,f'(x))`} />
      <p>
        Die Tangentensteigung als momentane Änderungsrate kennst du aus dem Modul <Modulverweis modul="aenderungsraten">Von der mittleren zur momentanen Änderungsrate</Modulverweis>. Das Schaubild <Formel tex="K_{f'}" /> im Punkt-für-Punkt-Verfahren hast du im Modul <Modulverweis modul="ableitungsregeln">Ableitungsregeln</Modulverweis> schon einmal entstehen sehen. Hier geht es darum, welche Eigenschaften von <Formel tex="K_f" /> sich in <Formel tex="K_{f'}" /> wiederfinden.
      </p>

      <h3>Begriffe am Schaubild <Formel tex="K_f" /></h3>
      <p>Diese Begriffe brauchst du, um die Eigenschaften zu beschreiben:</p>
      <ul className="liste">
        <li>
          <strong>Hochpunkt</strong> <Formel tex="H" /> und <strong>Tiefpunkt</strong> <Formel tex="T" nach=":" /> ein Punkt, der in seiner Umgebung am höchsten bzw. am tiefsten liegt. Zusammen heißen sie <strong>Extrempunkte</strong>, ihre Stellen <strong>Extremstellen</strong>.
        </li>
        <li>
          <strong>Wendestelle</strong> <Formel tex="W" nach=":" /> eine Stelle, an der <Formel tex="K_f" /> von einer Rechtskurve in eine Linkskurve wechselt oder umgekehrt. In einer Linkskurve biegt sich das Schaubild nach links, in einer Rechtskurve nach rechts.
        </li>
        <li>
          <strong>Sattelstelle</strong> <Formel tex="S" nach=":" /> eine Wendestelle mit waagerechter Tangente. Das Schaubild hat dort keinen Extrempunkt. Bei einer <strong>aufsteigenden</strong> Sattelstelle steigt <Formel tex="K_f" /> davor und danach, bei einer <strong>absteigenden</strong> fällt es davor und danach.
        </li>
        <li>
          <strong>Monotonie</strong>: <Formel tex="K_f" /> ist auf dem Intervall <Formel tex="[a;\,b]" /> <strong>monoton steigend</strong>, wenn für alle <Formel tex="x_1<x_2" /> aus dem Intervall <Formel tex={t`f(x_1)\le f(x_2)`} /> gilt, und <strong>monoton fallend</strong>, wenn <Formel tex={t`f(x_1)\ge f(x_2)`} /> gilt. Gilt sogar <Formel tex="f(x_1)<f(x_2)" /> bzw. <Formel tex="f(x_1)>f(x_2)" nach="," /> heißt <Formel tex="K_f" /> <strong>streng</strong> monoton.
        </li>
      </ul>
      <Bild
        daten={BILD_BEGRIFFE}
        unter={
          <>
            Ein Schaubild <Formel tex="K_f" /> mit Tiefpunkt <Formel tex="T" nach="," /> Hochpunkt <Formel tex="H" nach="," /> zwei Wendestellen <Formel tex="W" /> und einer absteigenden Sattelstelle <Formel tex="S" nach="." />
          </>
        }
      />
      <Hinweis titel="Hinweis zur Schreibweise">
        Mit <Formel tex="K_{f'}" /> ist das Schaubild der Ableitungsfunktion <Formel tex="f'" /> gemeint. Es liegt im selben Koordinatensystem wie <Formel tex="K_f" /> oder, wie in den Abbildungen hier, darunter mit demselben x-Bereich.
      </Hinweis>
      <p>Welche dieser Eigenschaften von <Formel tex="K_f" /> du in <Formel tex="K_{f'}" /> wiederfindest, entdeckst du im nächsten Abschnitt.</p>
    </Abschnitt>
  );
}
