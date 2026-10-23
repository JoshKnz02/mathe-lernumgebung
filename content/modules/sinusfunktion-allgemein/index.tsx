import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Formel } from '@/components/Formel';
import { Funktionsgraph } from '@/components/Funktionsgraph';
import { Hinweis } from '@/components/Hinweis';
import { kennwerte, termSinus, wert } from '@/lib/sinus';
import { piTex, zahlTex } from '@/lib/zahlen';
import { AUFGABE_1, AUFGABE_2, AUFGABE_3, AUFGABE_3_PERIODE } from './daten';
import { Sinuslabor } from './Sinuslabor';

const PI = Math.PI;
const k1 = kennwerte(AUFGABE_1);
const k2 = kennwerte(AUFGABE_2);

function Beobachtung({ children }: { children: React.ReactNode }) {
  return (
    <details className="beobachtung">
      <summary>Beobachtung vergleichen</summary>
      <div>{children}</div>
    </details>
  );
}

export default function Modul() {
  return (
    <>
      <Abschnitt id="erklaeren" titel="Erklären">
        <p>
          Die Sinusfunktion <Formel tex="x\mapsto\sin x" /> hat die Periode <Formel tex="2\pi" />, die Amplitude 1 und die Mittellinie <Formel tex="y=0" />. Das Argument <Formel tex="x" /> wird im Bogenmaß angegeben. Vier Parameter verändern diesen Graphen:
        </p>
        <Hinweis art="merksatz" titel="Allgemeine Sinusfunktion">
          <Formel anzeige tex={String.raw`f(x)=a\cdot\sin\bigl(b\cdot(x-c)\bigr)+d\qquad(a,b\neq 0)`} />
        </Hinweis>
        <Hinweis titel="Reihenfolge der Transformationen">
          Der Graph von <Formel tex="f" /> entsteht aus dem Graphen von <Formel tex="\sin x" /> in dieser Reihenfolge: Streckung in x-Richtung (<Formel tex="b" />), Verschiebung in x-Richtung (<Formel tex="c" />), Streckung in y-Richtung (<Formel tex="a" />), Verschiebung in y-Richtung (<Formel tex="d" />). Die Reihenfolge ist wichtig: Wird zuerst verschoben und dann gestreckt, ändert sich der Betrag der Verschiebung. Ein negatives <Formel tex="b" /> entspricht zusätzlich einer Spiegelung an der y-Achse.
        </Hinweis>
        <table className="tabelle">
          <caption>Wirkung der Parameter auf den Graphen von sin x</caption>
          <thead>
            <tr>
              <th scope="col">Parameter</th>
              <th scope="col">Wirkung</th>
              <th scope="col">Ablesbar als</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"><Formel tex="a" /></th>
              <td>Streckung in y-Richtung mit dem Faktor <Formel tex="|a|" />. Für <Formel tex="a<0" /> zusätzlich Spiegelung an der x-Achse.</td>
              <td>Amplitude <Formel tex="|a|" /></td>
            </tr>
            <tr>
              <th scope="row"><Formel tex="b" /></th>
              <td>Streckung in x-Richtung mit dem Faktor <Formel tex="\tfrac{1}{|b|}" />.</td>
              <td>Periode <Formel tex="\tfrac{2\pi}{|b|}" /></td>
            </tr>
            <tr>
              <th scope="row"><Formel tex="c" /></th>
              <td>Verschiebung in x-Richtung um <Formel tex="c" />, für <Formel tex="c>0" /> nach rechts.</td>
              <td>Verschiebung <Formel tex="c" /></td>
            </tr>
            <tr>
              <th scope="row"><Formel tex="d" /></th>
              <td>Verschiebung in y-Richtung um <Formel tex="d" />, für <Formel tex="d>0" /> nach oben.</td>
              <td>Mittellinie <Formel tex="y=d" />, Extrempunkte: Hochpunkte bei <Formel tex="y=d+|a|" />, Tiefpunkte bei <Formel tex="y=d-|a|" />, Wertebereich <Formel tex="[d-|a|;\,d+|a|]" /></td>
            </tr>
          </tbody>
        </table>
      </Abschnitt>

      <Abschnitt id="entdecken" titel="Entdecken">
        <p>Verändere die Parameter mit den Reglern und beobachte Graph, Gleichung und Kennwerte. Der gestrichelte Graph zeigt zum Vergleich <Formel tex="\sin x" />.</p>
        <Sinuslabor />
        <h3>Untersuchungsaufträge</h3>
        <p>Beantworte die Fragen zuerst mit dem Graphen. Danach kannst du deine Beobachtung mit der Lösung vergleichen.</p>
        <ol className="auftraege">
          <li>
            <p>Verändere nur <Formel tex="a" />. Was verändert sich am Graphen, was bleibt gleich? Was passiert bei negativem <Formel tex="a" />, was bei <Formel tex="a=0" />?</p>
            <Beobachtung>
              Der Graph wird in y-Richtung gestreckt (<Formel tex="|a|>1" />) oder gestaucht (<Formel tex="|a|<1" />). Periode und Nullstellen bleiben gleich. Für <Formel tex="a<0" /> wird der Graph an der x-Achse gespiegelt. Für <Formel tex="a=0" /> ist der Graph die waagerechte Gerade <Formel tex="y=d" />.
            </Beobachtung>
          </li>
          <li>
            <p>Verändere nur <Formel tex="d" />. Welche waagerechte Gerade liegt immer in der Mitte zwischen Hoch- und Tiefpunkten?</p>
            <Beobachtung>
              Der Graph wird um <Formel tex="d" /> in y-Richtung verschoben. Die Mittellinie ist die Gerade <Formel tex="y=d" />. Form und Periode bleiben gleich.
            </Beobachtung>
          </li>
          <li>
            <p>Verändere nur <Formel tex="b" /> und lies die Periode ab. Wie viele volle Schwingungen liegen zwischen <Formel tex="0" /> und <Formel tex="2\pi" />? Welcher Zusammenhang besteht zwischen <Formel tex="b" /> und der Periode?</p>
            <Beobachtung>
              Die Periode ist <Formel tex="\tfrac{2\pi}{b}" />. Für <Formel tex="b=2" /> liegen zwei Schwingungen zwischen <Formel tex="0" /> und <Formel tex="2\pi" />, der Graph ist in x-Richtung gestaucht. Für <Formel tex="b<1" /> ist er gestreckt. Amplitude und Mittellinie bleiben gleich.
            </Beobachtung>
          </li>
          <li>
            <p>Verändere nur <Formel tex="c" />. In welche Richtung verschiebt sich der Graph für positives <Formel tex="c" />? Warum steht in der Klammer <Formel tex="x-c" /> und nicht <Formel tex="x+c" />?</p>
            <Beobachtung>
              Für positives <Formel tex="c" /> wird der Graph nach rechts verschoben. Das Argument des Sinus ist <Formel tex="b\cdot(x-c)" />. An der Stelle <Formel tex="x=c" /> ist es 0. Der Verlauf, der bei <Formel tex="\sin x" /> an der Stelle 0 beginnt, beginnt jetzt bei <Formel tex="x=c" /> und liegt damit um <Formel tex="c" /> weiter rechts.
            </Beobachtung>
          </li>
          <li>
            <p>Setze die Regler zurück und stelle dann <Formel tex="b=2" /> und <Formel tex="c=\tfrac{\pi}{4}" /> ein. Wo schneidet der Graph die Mittellinie zum ersten Mal von unten nach oben (rechts von 0)? Um wie viel ist der Graph also verschoben?</p>
            <Beobachtung>
              Der erste Schnittpunkt mit der Mittellinie von unten nach oben liegt bei <Formel tex="x=\tfrac{\pi}{4}" />. Der Graph ist damit um <Formel tex="c=\tfrac{\pi}{4}" /> nach rechts verschoben, unabhängig von <Formel tex="b" />. Die Form <Formel tex="b\cdot(x-c)" /> zeigt die Verschiebung direkt. Multipliziert man aus, ergibt sich <Formel tex="\sin\bigl(2x-\tfrac{\pi}{2}\bigr)" />, und hier wäre die Verschiebung nicht ohne Rechnung ablesbar.
            </Beobachtung>
          </li>
          <li>
            <p>Finde zwei verschiedene Parametersätze <Formel tex="(a,b,c,d)" />, die denselben Graphen ergeben.</p>
            <Beobachtung>
              Zum Beispiel <Formel tex="\sin x" /> mit <Formel tex="a=1,\ c=0" /> und <Formel tex="a=-1,\ c=\pi" />, denn <Formel tex="-\sin(x-\pi)=\sin x" />. Allgemein: Eine Verschiebung <Formel tex="c" /> um eine ganze Periode ändert den Graphen nicht, ebenso <Formel tex="a\to -a" /> zusammen mit einer Verschiebung um eine halbe Periode.
            </Beobachtung>
          </li>
        </ol>
      </Abschnitt>

      <Abschnitt id="ueberpruefen" titel="Überprüfen">
        <p>
          Gib Zahlen als Dezimalzahl (<code>1,5</code>), als Bruch (<code>1/2</code>) oder als Vielfaches von <Formel tex="\pi" /> (<code>pi/4</code> oder <code>π/4</code>) ein. Dezimalwerte für <Formel tex="\pi" />-Vielfache werden auf zwei Nachkommastellen genau akzeptiert.
        </p>

        <Aufgabe
          nummer={1}
          titel="Parameter ablesen"
          felder={[
            { id: 'a', name: 'Parameter a', beschriftung: <Formel tex="a" />, erwartet: AUFGABE_1.a },
            { id: 'b', name: 'Parameter b', beschriftung: <Formel tex="b" />, erwartet: AUFGABE_1.b },
            { id: 'c', name: 'Parameter c', beschriftung: <Formel tex="c" />, erwartet: AUFGABE_1.c, toleranz: 0.01 },
            { id: 'd', name: 'Parameter d', beschriftung: <Formel tex="d" />, erwartet: AUFGABE_1.d },
          ]}
          hilfen={[
            <>Die Mittellinie liegt in der Mitte zwischen Hochpunkt und Tiefpunkt. Sie liefert <Formel tex="d" />. Der Abstand von der Mittellinie zum Hochpunkt ist <Formel tex="a" />.</>,
            <>Eine volle Schwingung hat die Länge der Periode. Lies sie von Hochpunkt zu Hochpunkt ab und verwende <Formel tex="T=\tfrac{2\pi}{b}" />.</>,
            <><Formel tex="c" /> ist die Stelle, an der der Graph die Mittellinie zum ersten Mal von unten nach oben schneidet (rechts von 0 gesucht).</>,
          ]}
          loesung={[
            <>Hochpunkt bei <Formel tex={`y=${zahlTex(k1.maximum)}`} />, Tiefpunkt bei <Formel tex={`y=${zahlTex(k1.minimum)}`} />. Mittellinie: <Formel tex={`d=\\frac{${zahlTex(k1.maximum)}+(${zahlTex(k1.minimum)})}{2}=${zahlTex(AUFGABE_1.d)}`} />.</>,
            <>Amplitude: <Formel tex={`a=${zahlTex(k1.maximum)}-${zahlTex(AUFGABE_1.d)}=${zahlTex(AUFGABE_1.a)}`} />.</>,
            <>Die Hochpunkte liegen bei <Formel tex="x=\tfrac{\pi}{2}" /> und <Formel tex="x=\tfrac{3\pi}{2}" />. Die Periode ist <Formel tex="T=\pi" />, also <Formel tex={`b=\\frac{2\\pi}{\\pi}=${zahlTex(AUFGABE_1.b)}`} />.</>,
            <>Der Graph schneidet die Mittellinie zum ersten Mal von unten nach oben bei <Formel tex={`x=${piTex(AUFGABE_1.c)}`} />, also <Formel tex={`c=${piTex(AUFGABE_1.c)}`} />. Ergebnis: <Formel tex={termSinus(AUFGABE_1, 'h')} />.</>,
          ]}
        >
          <p>
            Der Graph gehört zu einer Funktion <Formel tex="h(x)=a\cdot\sin\bigl(b\cdot(x-c)\bigr)+d" /> mit <Formel tex="a>0" />, <Formel tex="b>0" /> und <Formel tex="0\le c<T" /> (<Formel tex="T" />: Periode). Bestimme <Formel tex="a" />, <Formel tex="b" />, <Formel tex="c" /> und <Formel tex="d" />.
          </p>
          <Funktionsgraph
            bereich={[-PI / 2, 2 * PI, -2, 4]}
            xTeilung={PI / 4}
            beschreibung="Graph einer Sinusfunktion mit Hochpunkt bei y = 3 und Tiefpunkt bei y = −1. Die Hochpunkte liegen bei x = π/2 und x = 3π/2. Der Graph steigt bei x = π/4 durch die Mittellinie."
            kurven={[{ f: (x) => wert(AUFGABE_1, x) }]}
          />
        </Aufgabe>

        <Aufgabe
          nummer={2}
          titel="Kennwerte bestimmen"
          felder={[
            { id: 'amplitude', name: 'Amplitude', beschriftung: 'Amplitude', erwartet: k2.amplitude },
            { id: 'periode', name: 'Periode', beschriftung: 'Periode', erwartet: k2.periode!, toleranz: 0.01 },
            { id: 'max', name: 'Größter Funktionswert', beschriftung: 'Größter Funktionswert', erwartet: k2.maximum },
            { id: 'min', name: 'Kleinster Funktionswert', beschriftung: 'Kleinster Funktionswert', erwartet: k2.minimum },
          ]}
          hilfen={[
            <>Lies die Parameter <Formel tex="a" />, <Formel tex="b" />, <Formel tex="c" /> und <Formel tex="d" /> aus der Gleichung ab. Die Amplitude ist immer positiv.</>,
            <>Die Periode ist <Formel tex="\tfrac{2\pi}{|b|}" />. Der Sinus schwankt zwischen <Formel tex="-1" /> und <Formel tex="1" />, die Funktion also zwischen <Formel tex="d-|a|" /> und <Formel tex="d+|a|" />.</>,
          ]}
          loesung={[
            <>Aus <Formel tex={termSinus(AUFGABE_2)} /> folgt <Formel tex={`a=${zahlTex(AUFGABE_2.a)},\\ b=${zahlTex(AUFGABE_2.b)},\\ c=${piTex(AUFGABE_2.c)},\\ d=${zahlTex(AUFGABE_2.d)}`} />.</>,
            <>Amplitude: <Formel tex={`|a|=${zahlTex(k2.amplitude)}`} />. Das negative Vorzeichen spiegelt den Graphen, ändert die Amplitude aber nicht.</>,
            <>Periode: <Formel tex={`\\frac{2\\pi}{|b|}=\\frac{2\\pi}{${zahlTex(AUFGABE_2.b)}}=${piTex(k2.periode!)}`} />.</>,
            <>Größter Wert: <Formel tex={`d+|a|=${zahlTex(AUFGABE_2.d)}+${zahlTex(k2.amplitude)}=${zahlTex(k2.maximum)}`} />. Kleinster Wert: <Formel tex={`d-|a|=${zahlTex(AUFGABE_2.d)}-${zahlTex(k2.amplitude)}=${zahlTex(k2.minimum)}`} />.</>,
          ]}
        >
          <p>
            Gegeben ist <Formel tex={termSinus(AUFGABE_2)} />. Bestimme die Amplitude, die Periode sowie den größten und den kleinsten Funktionswert.
          </p>
        </Aufgabe>

        <Aufgabe
          nummer={3}
          titel="Gleichung aufstellen"
          felder={[
            { id: 'a', name: 'Parameter a', beschriftung: <Formel tex="a" />, erwartet: AUFGABE_3.a },
            { id: 'b', name: 'Parameter b', beschriftung: <Formel tex="b" />, erwartet: AUFGABE_3.b },
            { id: 'c', name: 'Parameter c', beschriftung: <Formel tex="c" />, erwartet: AUFGABE_3.c, toleranz: 0.01 },
            { id: 'd', name: 'Parameter d', beschriftung: <Formel tex="d" />, erwartet: AUFGABE_3.d },
          ]}
          hilfen={[
            <>Gehe die Beschreibung Schritt für Schritt durch und ordne jede Veränderung einem Parameter zu: Streckung in y-Richtung, Streckung in x-Richtung, Verschiebung in x-Richtung, Verschiebung in y-Richtung.</>,
            <>Die Periode von <Formel tex="\sin x" /> ist <Formel tex="2\pi" />. Für die neue Periode <Formel tex="T" /> gilt <Formel tex="T=\tfrac{2\pi}{b}" />, also <Formel tex="b=\tfrac{2\pi}{T}" />.</>,
          ]}
          loesung={[
            <>Streckung mit Faktor 3 in y-Richtung: <Formel tex={`a=${zahlTex(AUFGABE_3.a)}`} />.</>,
            <>Periode <Formel tex="4\pi" />: <Formel tex={`b=\\frac{2\\pi}{4\\pi}=${zahlTex(AUFGABE_3.b)}`} />.</>,
            <>Verschiebung um <Formel tex="\tfrac{\pi}{2}" /> nach rechts: <Formel tex={`c=${piTex(AUFGABE_3.c)}`} />. Verschiebung um 1 nach unten: <Formel tex={`d=${zahlTex(AUFGABE_3.d)}`} />.</>,
            <>Ergebnis: <Formel tex={termSinus(AUFGABE_3, 'g')} />.</>,
          ]}
        >
          <p>
            Der Graph von <Formel tex="\sin x" /> wird in y-Richtung mit dem Faktor 3 gestreckt, in x-Richtung so verändert, dass die Periode <Formel tex="4\pi" /> beträgt, um <Formel tex="\tfrac{\pi}{2}" /> nach rechts und um 1 nach unten verschoben. Er gehört zu <Formel tex="g(x)=a\cdot\sin\bigl(b\cdot(x-c)\bigr)+d" />. Bestimme <Formel tex="a" />, <Formel tex="b" />, <Formel tex="c" /> und <Formel tex="d" />.
          </p>
        </Aufgabe>
      </Abschnitt>
    </>
  );
}
