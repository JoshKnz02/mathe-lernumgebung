import type { ReactNode } from 'react';
import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage, type Option } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Funktionsgraph } from '@/components/Funktionsgraph';
import { Hinweis } from '@/components/Hinweis';
import { FARBEN } from '@/components/Zeichenbrett';
import { kennwerte, termSinus, wertTrig } from '@/lib/sinus';
import { piTex, zahlTex } from '@/lib/zahlen';
import { A12, A2_ERWARTET, A34, A3_ERWARTET, A4_ERWARTET, A5, A6 } from './daten';
import { Parameterlabor } from './Parameterlabor';
import { SchaubildAufKlick } from './SchaubildAufKlick';

const PI = Math.PI;
const ECKIG = { klammer: 'eckig', immerKlammer: true } as const;
const neg = (s: string) => (s.startsWith('-') ? `{${s}}` : s);

function Beobachtung({ children }: { children: ReactNode }) {
  return (
    <details className="beobachtung">
      <summary>Beobachtung vergleichen</summary>
      <div>{children}</div>
    </details>
  );
}

function Extern({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children} (öffnet in einem neuen Tab)
    </a>
  );
}

/** Eine Option mit Rückmeldung, kurz geschrieben. */
const opt = (id: string, text: ReactNode, richtig: boolean, rueckmeldung: ReactNode): Option => ({ id, text, richtig, rueckmeldung });

const kw = {
  f: kennwerte(A34),
  s5: kennwerte(A5.sinus),
};

export default function Modul() {
  return (
    <>
      <Abschnitt id="erklaeren" titel="Erklären">
        <h3>Ausgangspunkt und allgemeine Form</h3>
        <p>
          Ausgangspunkt ist die Sinusfunktion <Formel tex="f" /> mit <Formel tex="f(x)=\sin(x)" nach="," /> <Formel tex="x\in\mathbb{R}" nach="." /> Ihr Schaubild heißt <Formel tex="K_f" nach="." /> Aus <Formel tex="K_f" /> entstehen die Schaubilder <Formel tex="K_g" /> allgemeiner Sinusfunktionen <Formel tex="g" nach=":" />
        </p>
        <Hinweis art="merksatz" titel="Allgemeine Sinusfunktion">
          <Formel anzeige tex={String.raw`g(x)=a\cdot\sin\left[b\cdot(x-c)\right]+d\qquad(a\neq 0,\ b\neq 0)`} />
        </Hinweis>
        <p>
          Entsprechend entsteht aus dem Schaubild der Kosinusfunktion das Schaubild einer allgemeinen Kosinusfunktion <Formel tex="g(x)=a\cdot\cos\left[b\cdot(x-c)\right]+d" nach="." /> Was die vier Parameter bewirken, steht in der folgenden Tabelle. Im nächsten Abschnitt prüfst du es mit dem Labor.
        </p>

        <h3>Lageveränderungen beschreiben</h3>
        <p>
          Wie <Formel tex="K_g" /> aus <Formel tex="K_f" /> entsteht, nennt man die Art der Lageveränderung. Jeder Parameter von <Formel tex="g(x)=a\cdot\sin\left[b\cdot(x-c)\right]+d" /> bewirkt eine bestimmte Lageveränderung:
        </p>
        <table className="tabelle">
          <caption>Lageveränderungen und ihre Parameter</caption>
          <thead>
            <tr>
              <th scope="col">Parameter</th>
              <th scope="col">Lageveränderung von <Formel tex="K_f" /></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"><Formel tex="a" /></th>
              <td>
                Streckung in y-Richtung mit dem Faktor <Formel tex="|a|" nach=":" /> Jede y-Koordinate wird mit <Formel tex="|a|" /> multipliziert. Für <Formel tex="|a|>1" /> ist es eine Streckung, für <Formel tex="0<|a|<1" /> eine Stauchung. Für <Formel tex="a<0" /> kommt eine Spiegelung an der x-Achse hinzu.
              </td>
            </tr>
            <tr>
              <th scope="row"><Formel tex="b" /></th>
              <td>
                Streckung in x-Richtung mit dem Faktor <Formel tex="\tfrac{1}{|b|}" nach=":" /> Jede x-Koordinate wird mit <Formel tex="\tfrac{1}{|b|}" /> multipliziert. Das ist genau umgekehrt wie bei <Formel tex="a" nach=":" /> Für <Formel tex="|b|>1" /> ist es eine Stauchung, für <Formel tex="0<|b|<1" /> eine Streckung. Zum Beispiel wird für <Formel tex="b=3" /> mit dem Faktor <Formel tex="\tfrac{1}{3}" /> gestreckt, also auf ein Drittel gestaucht. Für <Formel tex="b<0" /> kommt eine Spiegelung an der y-Achse hinzu.
              </td>
            </tr>
            <tr>
              <th scope="row"><Formel tex="c" /></th>
              <td>
                Verschiebung in x-Richtung um <Formel tex="c" nach="." /> In der Klammer steht <Formel tex="x-c" nach=":" /> Für <Formel tex="x-3" /> (also <Formel tex="c=3" nach=")" /> wird um 3 nach rechts verschoben, für <Formel tex="x+3" /> (also <Formel tex="c=-3" nach=")" /> um 3 nach links.
              </td>
            </tr>
            <tr>
              <th scope="row"><Formel tex="d" /></th>
              <td>
                Verschiebung in y-Richtung um <Formel tex="d" nach=":" /> für <Formel tex="d>0" /> nach oben, für <Formel tex="d<0" /> nach unten.
              </td>
            </tr>
          </tbody>
        </table>
        <Hinweis titel="Denkhinweis: In x-Richtung ist es umgekehrt">
          Bei allem, was in x-Richtung geschieht, verhält es sich anders, als man zunächst vermutet. Bei <Formel tex="x-3" /> wird nach rechts verschoben und nicht nach links. Bei <Formel tex="b=3" /> wird mit dem Faktor <Formel tex="\tfrac{1}{3}" /> gestreckt und nicht mit dem Faktor 3. Der Grund: <Formel tex="a" /> und <Formel tex="d" /> verändern die Funktionswerte, <Formel tex="b" /> und <Formel tex="c" /> verändern das Argument <Formel tex="x" nach="," /> und das wirkt auf das Schaubild genau entgegengesetzt.
        </Hinweis>

        <h3>Kennwerte des Schaubilds</h3>
        <ul className="liste">
          <li>
            Die <strong>Ruhelage</strong> ist die waagerechte Gerade in der Mitte zwischen dem größten und dem kleinsten Funktionswert.
          </li>
          <li>
            Die <strong>Amplitude</strong> ist der Abstand der Ruhelage zum größten (oder zum kleinsten) Funktionswert.
          </li>
          <li>
            Die <strong>Periode</strong> <Formel tex="p" /> ist die kleinste positive Zahl, nach der sich das Schaubild wiederholt, also <Formel tex="g(x+p)=g(x)" /> für alle <Formel tex="x" nach="." /> Die Sinusfunktion <Formel tex="f" /> hat die Periode <Formel tex="2\pi" nach="." />
          </li>
        </ul>
      </Abschnitt>

      <Abschnitt id="entdecken" titel="Entdecken">
        <h3>Vermutung</h3>
        <p>
          Wende die Tabelle aus dem Erklären an, bevor du das Labor benutzt. Sage voraus und notiere:
        </p>
        <ul className="liste">
          <li>
            Wie sieht das Schaubild von <Formel tex="g(x)=\sin(3x)" /> aus? Welche Periode hat es? Tipp: Die Periode von <Formel tex="\sin(x)" /> ist <Formel tex="2\pi" nach="." /> Überlege, was die Streckung in x-Richtung mit der Periode macht.
          </li>
          <li>Wie sieht das Schaubild von <Formel tex="g(x)=-2\sin(x)" /> aus? Welche Amplitude hat es?</li>
          <li>Wohin wird das Schaubild von <Formel tex="g(x)=\sin(x-3)" /> verschoben?</li>
        </ul>
        <p>Prüfe deine Vorhersagen anschließend im Labor.</p>
        <Beobachtung>
          <Formel tex="\sin(3x)" nach=":" /> Stauchung in x-Richtung mit dem Faktor <Formel tex="\tfrac{1}{3}" nach="," /> die Periode ist <Formel tex="\tfrac{2\pi}{3}" nach="." /> <Formel tex="-2\sin(x)" nach=":" /> Streckung in y-Richtung mit dem Faktor 2 und Spiegelung an der x-Achse, die Amplitude ist 2. <Formel tex="\sin(x-3)" nach=":" /> Verschiebung um 3 nach rechts.
        </Beobachtung>

        <h3>Labor</h3>
        <p>
          Verändere die Parameter mit den Reglern. Das gestrichelte Schaubild gehört zu <Formel tex="f" nach="," /> das blaue zu <Formel tex="g" nach="." /> Mit den Schaltflächen unten stellst du die Beispiele a) bis d) und zwei Beispiele zum Skizzieren ein. Du kannst auch zwischen Sinus und Kosinus als Grundfunktion wechseln.
        </p>
        <Parameterlabor />

        <h3>Untersuchungsaufträge</h3>
        <p>Beantworte die Fragen zuerst mit dem Labor. Danach kannst du deine Beobachtung vergleichen.</p>
        <ol className="auftraege">
          <li>
            <p>
              Wähle das Beispiel a) <Formel tex="g(x)=\sin(x)+2" nach="." /> Beschreibe, wie <Formel tex="K_g" /> aus <Formel tex="K_f" /> entsteht. Was geschieht mit Ruhelage, Wertebereich, Amplitude und Periode?
            </p>
            <Beobachtung>
              <Formel tex="K_g" /> entsteht durch Verschiebung um 2 in y-Richtung nach oben. Die Ruhelage ist jetzt <Formel tex="y=2" nach="," /> der Wertebereich <Formel tex="[1;\,3]" nach="." /> Amplitude 1 und Periode <Formel tex="2\pi" /> bleiben unverändert.
            </Beobachtung>
          </li>
          <li>
            <p>
              Wähle das Beispiel b) <Formel tex="g(x)=\sin(2x)" /> und stelle danach <Formel tex="b=0{,}5" /> ein. Beschreibe jeweils die Lageveränderung. Wie viele volle Schwingungen liegen zwischen <Formel tex="0" /> und <Formel tex="2\pi" nach="?" /> Welche Periode hat <Formel tex="K_g" nach="?" />
            </p>
            <Beobachtung>
              Für <Formel tex="b=2" /> wird <Formel tex="K_f" /> in x-Richtung mit dem Faktor <Formel tex="\tfrac{1}{2}" /> gestaucht, es liegen zwei Schwingungen zwischen <Formel tex="0" /> und <Formel tex="2\pi" nach="," /> die Periode ist <Formel tex="\pi" nach="." /> Für <Formel tex="b=0{,}5" /> wird in x-Richtung mit dem Faktor <Formel tex="2" /> gestreckt, die Periode ist <Formel tex="4\pi" nach="." /> Allgemein gilt <Formel tex="p=\tfrac{2\pi}{|b|}" nach="." /> Die Amplitude bleibt 1.
            </Beobachtung>
          </li>
          <li>
            <p>
              Wähle das Beispiel c) <Formel tex="g(x)=-3\sin(x)" nach="." /> Beschreibe die Lageveränderung. Welche Amplitude und welchen Wertebereich hat <Formel tex="K_g" nach="?" /> Wie ist es bei <Formel tex="a=-1" nach="?" />
            </p>
            <Beobachtung>
              <Formel tex="K_f" /> wird in y-Richtung mit dem Faktor 3 gestreckt und an der x-Achse gespiegelt. Die Amplitude ist <Formel tex="|a|=3" nach="," /> nicht <Formel tex="-3" nach="," /> der Wertebereich ist <Formel tex="[-3;\,3]" nach="." /> Die Periode bleibt <Formel tex="2\pi" nach="." /> Für <Formel tex="a=-1" /> wird nur gespiegelt.
            </Beobachtung>
          </li>
          <li>
            <p>
              Wähle das Beispiel d) <Formel tex="g(x)=\sin\left(x-\tfrac{\pi}{2}\right)" nach="." /> Beschreibe die Lageveränderung. Warum geht es nach rechts, obwohl in der Klammer ein Minus steht? Welche Kennwerte ändern sich nicht?
            </p>
            <Beobachtung>
              <Formel tex="K_f" /> wird um <Formel tex="\tfrac{\pi}{2}" /> in x-Richtung nach rechts verschoben. Das Argument <Formel tex="x-\tfrac{\pi}{2}" /> ist genau bei <Formel tex="x=\tfrac{\pi}{2}" /> gleich 0. Dort beginnt jetzt der Verlauf, der bei <Formel tex="\sin(x)" /> an der Stelle 0 beginnt. Amplitude, Periode, Ruhelage und Wertebereich bleiben gleich.
            </Beobachtung>
          </li>
          <li>
            <p>
              Stelle <Formel tex="b=-1" /> ein (alle anderen Parameter wie am Anfang) und vergleiche mit <Formel tex="a=-1" nach="." /> Was fällt auf? Wechsle dann zum Kosinus als Grundfunktion. Welche Periode hat <Formel tex="K_g" /> bei negativem <Formel tex="b" nach="?" />
            </p>
            <Beobachtung>
              Ein negatives <Formel tex="b" /> bewirkt zusätzlich eine Spiegelung an der y-Achse. Beim Sinus liegt das Schaubild für <Formel tex="b=-1" /> auf dem Schaubild für <Formel tex="a=-1" nach="," /> denn <Formel tex="\sin(-x)=-\sin(x)" nach="." /> Beim Kosinus ändert sich nichts, denn die Kosinuskurve ist symmetrisch zur y-Achse. Die Periode <Formel tex="\tfrac{2\pi}{|b|}" /> ist auch bei negativem <Formel tex="b" /> positiv.
            </Beobachtung>
          </li>
          <li>
            <p>
              Schalte „Hilfen zum Skizzieren anzeigen“ ein und wähle „Beispiel f (Sinus)“. Lies Ruhelage, Wertebereich, Referenzpunkt und Periode ab. Wie lassen sie sich aus <Formel tex="a" nach="," /> <Formel tex="b" nach="," /> <Formel tex="c" /> und <Formel tex="d" /> berechnen? Was ändert sich, wenn du auf „Beispiel g (Kosinus)“ wechselst?
            </p>
            <Beobachtung>
              Ruhelage <Formel tex="y=d" nach="." /> Wertebereich von <Formel tex="d-|a|" /> bis <Formel tex="d+|a|" nach="." /> Periode <Formel tex="\tfrac{2\pi}{|b|}" nach="." /> Beim Sinus ist der Referenzpunkt der Wendepunkt <Formel tex="(c\,|\,d)" nach="," /> für <Formel tex="a\cdot b<0" /> absteigend. Beim Kosinus ist der Referenzpunkt ein Extrempunkt <Formel tex="(c\,|\,d+a)" nach="," /> für <Formel tex="a<0" /> ein Tiefpunkt. Ruhelage, Wertebereich und Periode sind bei Sinus und Kosinus gleich.
            </Beobachtung>
          </li>
        </ol>
      </Abschnitt>

      <Abschnitt id="ueberpruefen" titel="Überprüfen">
        <p>
          Gib Zahlen als Dezimalzahl (<code>1,5</code>), als Bruch (<code>1/2</code>) oder als Vielfaches von <Formel tex="\pi" /> (<code>pi/4</code> oder <code>π/4</code>) ein. Dezimalzahlen werden auf zwei Nachkommastellen genau akzeptiert.
        </p>

        <h3>Lageveränderung, Periode und Amplitude</h3>
        <p>
          Das Schaubild <Formel tex="K_g" /> der Funktion <Formel tex="g" /> soll aus <Formel tex="K_f" /> mit <Formel tex="f(x)=\sin(x)" /> entstehen. Beschreibe jeweils, wie das geschieht (Aufgabe 1), und gib dann Amplitude und Periode an (Aufgabe 2).
        </p>

        <Auswahlfrage
          nummer="1a"
          titel="Art der Lageveränderung"
          optionen={[
            opt('a', <>Verschiebung in y-Richtung um 2 nach oben</>, true, <>Richtig. Zu jedem Funktionswert von <Formel tex="\sin(x)" /> wird 2 addiert, das ist der Parameter <Formel tex="d" nach="." /></>),
            opt('b', <>Verschiebung in x-Richtung um 2 nach links</>, false, <>Eine Verschiebung in x-Richtung steht in der Klammer beim <Formel tex="x" nach="," /> zum Beispiel <Formel tex="\sin(x+2)" nach="." /> Hier steht die 2 außerhalb.</>),
            opt('c', <>Streckung in y-Richtung mit dem Faktor 2</>, false, <>Eine Streckung entsteht durch Multiplikation, also <Formel tex="2\cdot\sin(x)" nach="." /> Hier wird addiert.</>),
            opt('d', <>Streckung in x-Richtung mit dem Faktor 2</>, false, <>Eine Streckung in x-Richtung würde man am Faktor vor dem <Formel tex="x" /> in der Klammer erkennen. Hier steht keiner.</>),
          ]}
          erklaerung={<>Der Summand 2 steht hinter dem Sinus. Er wird zu jedem y-Wert addiert, deshalb ist es eine Verschiebung in y-Richtung (Parameter <Formel tex="d=2" nach=")." /></>}
        >
          <p>
            a) <Formel tex="g(x)=\sin(x)+2" />
          </p>
        </Auswahlfrage>

        <Auswahlfrage
          nummer="1b"
          titel="Art der Lageveränderung"
          optionen={[
            opt('a', <>Streckung in x-Richtung mit dem Faktor 2</>, false, <>Das ist das Gegenteil. Eine 2 beim <Formel tex="x" /> halbiert die Periode, das Schaubild wird in x-Richtung gestaucht.</>),
            opt('b', <>Streckung in x-Richtung mit dem Faktor <Formel tex="\tfrac{1}{2}" /> (Stauchung)</>, true, <>Richtig. Jede x-Koordinate wird halbiert. Die Periode ist <Formel tex="\pi" /> statt <Formel tex="2\pi" nach="." /></>),
            opt('c', <>Streckung in y-Richtung mit dem Faktor 2</>, false, <>Das wäre <Formel tex="2\cdot\sin(x)" nach="." /> Hier steht die 2 in der Klammer beim <Formel tex="x" nach="." /></>),
            opt('d', <>Verschiebung in x-Richtung um 2 nach links</>, false, <>Eine Verschiebung würde als <Formel tex="\sin(x+2)" /> geschrieben. Hier wird <Formel tex="x" /> multipliziert, nicht addiert.</>),
          ]}
          erklaerung={<>Der Faktor 2 beim <Formel tex="x" /> bewirkt, dass <Formel tex="\sin(2x)" /> doppelt so schnell durchlaufen wird. Die Werte, die <Formel tex="\sin(x)" /> bei <Formel tex="x" /> annimmt, nimmt <Formel tex="\sin(2x)" /> schon bei <Formel tex="\tfrac{x}{2}" /> an. Das Schaubild wird in x-Richtung mit dem Faktor <Formel tex="\tfrac{1}{2}" /> gestaucht (<Formel tex="b=2" nach=")." /></>}
        >
          <p>
            b) <Formel tex="g(x)=\sin(2x)" />
          </p>
        </Auswahlfrage>

        <Auswahlfrage
          nummer="1c"
          titel="Art der Lageveränderung"
          optionen={[
            opt('a', <>Streckung in y-Richtung mit dem Faktor 3 und Spiegelung an der x-Achse</>, true, <>Richtig. Der Betrag 3 streckt in y-Richtung, das Minuszeichen spiegelt an der x-Achse.</>),
            opt('b', <>Streckung in y-Richtung mit dem Faktor 3, ohne Spiegelung</>, false, <>Das Minuszeichen vor der 3 bewirkt eine Spiegelung an der x-Achse: Aus Hochpunkten werden Tiefpunkte.</>),
            opt('c', <>Stauchung in y-Richtung mit dem Faktor <Formel tex="\tfrac{1}{3}" /> und Spiegelung an der x-Achse</>, false, <>Der Faktor 3 ist größer als 1. Das ist eine Streckung, keine Stauchung.</>),
            opt('d', <>Verschiebung in y-Richtung um 3 nach unten</>, false, <>Eine Verschiebung wäre <Formel tex="\sin(x)-3" nach="." /> Hier wird mit <Formel tex="-3" /> multipliziert.</>),
          ]}
          erklaerung={<>Der Faktor <Formel tex="a=-3" /> steht vor dem Sinus. Sein Betrag 3 ist der Streckfaktor in y-Richtung, sein negatives Vorzeichen bewirkt eine Spiegelung an der x-Achse.</>}
        >
          <p>
            c) <Formel tex="g(x)=-3\sin(x)" />
          </p>
        </Auswahlfrage>

        <Auswahlfrage
          nummer="1d"
          titel="Art der Lageveränderung"
          optionen={[
            opt('a', <>Verschiebung in x-Richtung um <Formel tex="\tfrac{\pi}{2}" /> nach rechts</>, true, <>Richtig. Für <Formel tex="c>0" /> wird nach rechts verschoben.</>),
            opt('b', <>Verschiebung in x-Richtung um <Formel tex="\tfrac{\pi}{2}" /> nach links</>, false, <>Ein häufiger Irrtum. Das Argument <Formel tex="x-\tfrac{\pi}{2}" /> ist erst bei <Formel tex="x=\tfrac{\pi}{2}" /> gleich 0. Der Verlauf beginnt also weiter rechts.</>),
            opt('c', <>Verschiebung in y-Richtung um <Formel tex="\tfrac{\pi}{2}" /> nach unten</>, false, <>Die Zahl steht in der Klammer beim <Formel tex="x" nach="," /> das ist eine Verschiebung in x-Richtung.</>),
            opt('d', <>Streckung in x-Richtung mit dem Faktor <Formel tex="\tfrac{\pi}{2}" /></>, false, <>Eine Streckung in x-Richtung erkennt man an einem Faktor vor dem <Formel tex="x" nach="," /> nicht an einer Zahl, die abgezogen wird.</>),
          ]}
          erklaerung={<>In der Form <Formel tex="\sin\left[b\cdot(x-c)\right]" /> ist <Formel tex="c=\tfrac{\pi}{2}" nach="." /> Das Schaubild wird um <Formel tex="c" /> in x-Richtung verschoben, für positives <Formel tex="c" /> nach rechts.</>}
        >
          <p>
            d) <Formel tex="g(x)=\sin\left(x-\tfrac{\pi}{2}\right)" />
          </p>
        </Auswahlfrage>

        <Aufgabe
          nummer={2}
          titel="Amplitude und Periode"
          felder={[
            ...(['a', 'b', 'c', 'd'] as const).flatMap((k) => [
              { id: `${k}-periode`, name: `Periode von g in ${k}`, beschriftung: <>{k}) Periode</>, erwartet: A2_ERWARTET.find((e) => e.id === `${k}-periode`)!.erwartet, toleranz: 0.01 },
              { id: `${k}-amplitude`, name: `Amplitude von g in ${k}`, beschriftung: <>{k}) Amplitude</>, erwartet: A2_ERWARTET.find((e) => e.id === `${k}-amplitude`)!.erwartet, toleranz: 0.01 },
            ]),
          ]}
          hilfen={[
            <>Die Amplitude ist der Betrag von <Formel tex="a" nach="," /> die Periode ist <Formel tex={String.raw`\frac{2\pi}{|b|}`} nach="." /> Verschiebungen ändern beides nicht.</>,
            <>Schreibe jede Funktion in der Form <Formel tex="g(x)=a\cdot\sin\left[b\cdot(x-c)\right]+d" /> und lies <Formel tex="a" /> und <Formel tex="b" /> ab, zum Beispiel <Formel tex="\sin(2x)" /> mit <Formel tex="a=1" /> und <Formel tex="b=2" nach="." /></>,
          ]}
          loesung={[
            <>a) <Formel tex={`${termSinus(A12.a, 'g', ECKIG)}`} nach=":" /> <Formel tex="a=1,\ b=1" nach="," /> also Amplitude 1 und Periode <Formel tex="2\pi" nach="." /></>,
            <>b) <Formel tex={`${termSinus(A12.b, 'g', ECKIG)}`} nach=":" /> <Formel tex="a=1,\ b=2" nach="," /> also Amplitude 1 und Periode <Formel tex={String.raw`\frac{2\pi}{2}=\pi`} nach="." /></>,
            <>c) <Formel tex={`${termSinus(A12.c, 'g', ECKIG)}`} nach=":" /> <Formel tex="a=-3,\ b=1" nach="," /> also Amplitude <Formel tex="|{-3}|=3" /> und Periode <Formel tex="2\pi" nach="." /></>,
            <>d) <Formel tex={`${termSinus(A12.d, 'g', ECKIG)}`} nach=":" /> <Formel tex="a=1,\ b=1" nach="," /> also Amplitude 1 und Periode <Formel tex="2\pi" nach="." /></>,
          ]}
        >
          <p>Gib zu den Funktionen a) bis d) aus Aufgabe 1 die Amplitude und die Periode von <Formel tex="g" /> an.</p>
        </Aufgabe>

        <h3>Schaubilder skizzieren</h3>
        <p>
          Ein Schaubild skizzierst du in vier Schritten: Ruhelage, Wertebereich, Referenzpunkt und Periode. Beim Sinus ist der Referenzpunkt ein Wendepunkt, beim Kosinus ein Extrempunkt.
        </p>

        <Aufgabe
          nummer={3}
          titel="Skizzieren mit dem Sinus"
          felder={[
            { id: 'ruhelage', name: 'Ruhelage, y-Wert', beschriftung: <>Ruhelage <Formel tex="y=" /></>, erwartet: A3_ERWARTET.ruhelage },
            { id: 'ymin', name: 'Kleinster y-Wert', beschriftung: <><Formel tex="y_{\min}" /></>, erwartet: A3_ERWARTET.ymin },
            { id: 'ymax', name: 'Größter y-Wert', beschriftung: <><Formel tex="y_{\max}" /></>, erwartet: A3_ERWARTET.ymax },
            { id: 'refX', name: 'x-Koordinate des Referenzpunkts', beschriftung: <>Referenzpunkt, <Formel tex="x" />-Koordinate</>, erwartet: A3_ERWARTET.refX, toleranz: 0.01 },
            { id: 'refY', name: 'y-Koordinate des Referenzpunkts', beschriftung: <>Referenzpunkt, <Formel tex="y" />-Koordinate</>, erwartet: A3_ERWARTET.refY },
            { id: 'periode', name: 'Periode', beschriftung: <>Periode <Formel tex="p" /></>, erwartet: A3_ERWARTET.periode, toleranz: 0.01 },
          ]}
          hilfen={[
            <>Die Ruhelage ist <Formel tex="y=d" nach="." /> Der Wertebereich reicht von <Formel tex="y_{\min}=d-|a|" /> bis <Formel tex="y_{\max}=d+|a|" nach="." /></>,
            <>Beim Sinus ist der Referenzpunkt der Wendepunkt <Formel tex="(c\,|\,d)" nach="." /> Weil <Formel tex="a<0" /> gilt, verläuft das Schaubild dort absteigend.</>,
            <>Die Periode ist <Formel tex={String.raw`p=\frac{2\pi}{|b|}`} nach="." /> Setze <Formel tex={String.raw`b=\frac{\pi}{4}`} /> ein.</>,
          ]}
          loesung={[
            <>Ruhelage: <Formel tex={`y=d=${zahlTex(A34.d)}`} nach="." /></>,
            <>Wertebereich: <Formel tex={`y_{\\min}=d-|a|=${zahlTex(A34.d)}-${zahlTex(Math.abs(A34.a))}=${neg(zahlTex(A3_ERWARTET.ymin))}`} /> und <Formel tex={`y_{\\max}=d+|a|=${zahlTex(A34.d)}+${zahlTex(Math.abs(A34.a))}=${zahlTex(A3_ERWARTET.ymax)}`} nach="." /></>,
            <>Referenzpunkt (Wendepunkt, absteigend wegen <Formel tex="a<0" nach="):" /> <Formel tex={`(c\\,|\\,d)=(${zahlTex(A34.c)}\\,|\\,${zahlTex(A34.d)})`} nach="." /></>,
            <>Periode: <Formel tex={String.raw`p=\frac{2\pi}{\pi/4}=${zahlTex(A3_ERWARTET.periode)}`} nach="." /> Zeichne das Schaubild vom Referenzpunkt aus: absteigend bis <Formel tex={`y_{\\min}`} nach="," /> dann wieder aufsteigend, und wiederhole es nach jeder Periode.</>,
          ]}
        >
          <p>
            Skizziere das Schaubild von <Formel tex={termSinus(A34, 'f', ECKIG)} /> auf deinem Arbeitsblatt. Bestimme dazu zuerst die vier Angaben.
          </p>
          <SchaubildAufKlick
            bereich={[-1, 17, -3.5, 5]}
            xTeilung={1}
            yTeilung={1}
            xBeschriftung="zahl"
            className="brett-3zu2"
            beschreibung="Schaubild der Funktion f mit Ruhelage y gleich 1, größtem Wert 4 und kleinstem Wert minus 2. Bei x gleich 1 liegt ein absteigender Wendepunkt, die Periode ist 8."
            kurven={[{ f: (x) => wertTrig(A34, x, 'sin'), farbe: FARBEN.akzent }]}
          />
        </Aufgabe>

        <Aufgabe
          nummer={4}
          titel="Skizzieren mit dem Kosinus"
          felder={[
            { id: 'refX', name: 'x-Koordinate des Referenzpunkts', beschriftung: <>Referenzpunkt, <Formel tex="x" />-Koordinate</>, erwartet: A4_ERWARTET.refX, toleranz: 0.01 },
            { id: 'refY', name: 'y-Koordinate des Referenzpunkts', beschriftung: <>Referenzpunkt, <Formel tex="y" />-Koordinate</>, erwartet: A4_ERWARTET.refY },
            { id: 'periode', name: 'Periode', beschriftung: <>Periode <Formel tex="p" /></>, erwartet: A4_ERWARTET.periode, toleranz: 0.01 },
          ]}
          hilfen={[
            <>Ruhelage, Wertebereich und Periode sind dieselben wie bei <Formel tex="f" nach="." /> Nur der Referenzpunkt ist ein anderer.</>,
            <>Beim Kosinus ist der Referenzpunkt ein Extrempunkt: ein Hochpunkt für <Formel tex="a>0" nach="," /> ein Tiefpunkt für <Formel tex="a<0" nach="." /> Seine x-Koordinate ist <Formel tex="c" nach="," /> seine y-Koordinate ist <Formel tex="d+a" nach="." /></>,
          ]}
          loesung={[
            <>Wegen <Formel tex="a=-3<0" /> ist der Referenzpunkt ein Tiefpunkt.</>,
            <>Seine Koordinaten sind <Formel tex={`(c\\,|\\,d+a)=(${zahlTex(A34.c)}\\,|\\,${zahlTex(A34.d)}+(${zahlTex(A34.a)}))=(${zahlTex(A4_ERWARTET.refX)}\\,|\\,${neg(zahlTex(A4_ERWARTET.refY))})`} nach="." /></>,
            <>Die Periode ist wie bei <Formel tex="f" /> gleich <Formel tex={`p=${zahlTex(A4_ERWARTET.periode)}`} nach="." /></>,
          ]}
        >
          <p>
            Skizziere nun das Schaubild von <Formel tex={termSinus(A34, 'g', { funktion: 'cos', ...ECKIG })} nach="." /> Bestimme Referenzpunkt und Periode. Ruhelage und Wertebereich kennst du schon aus Aufgabe 3.
          </p>
          <SchaubildAufKlick
            bereich={[-1, 17, -3.5, 5]}
            xTeilung={1}
            yTeilung={1}
            xBeschriftung="zahl"
            className="brett-3zu2"
            beschreibung="Schaubild der Funktion g mit Ruhelage y gleich 1, größtem Wert 4 und kleinstem Wert minus 2. Bei x gleich 1 liegt ein Tiefpunkt, die Periode ist 8."
            kurven={[{ f: (x) => wertTrig(A34, x, 'cos'), farbe: FARBEN.akzent }]}
          />
        </Aufgabe>

        <h3>Funktionsterm aus dem Schaubild</h3>
        <p>
          Umgekehrt lässt sich aus einem Schaubild ein Funktionsterm herleiten. Wegen der Periodizität und der gleichen Form von Sinus- und Kosinuskurve gibt es unendlich viele Möglichkeiten.
        </p>

        <Aufgabe
          nummer={5}
          titel="Funktionsterm herleiten"
          felder={[
            { id: 'd', name: 'Parameter d', beschriftung: <Formel tex="d" />, erwartet: A5.sinus.d },
            { id: 'a', name: 'Parameter a', beschriftung: <><Formel tex="a" /> (mit <Formel tex="a>0" nach=")" /></>, erwartet: A5.sinus.a },
            { id: 'p', name: 'Periode', beschriftung: <>Periode <Formel tex="p" /></>, erwartet: kw.s5.periode! },
            { id: 'b', name: 'Parameter b', beschriftung: <Formel tex="b" />, erwartet: A5.sinus.b, toleranz: 0.01 },
            { id: 'c1', name: 'Parameter c1 beim Sinus', beschriftung: <><Formel tex="c_1" /> beim Sinus</>, erwartet: A5.sinus.c },
            { id: 'c2', name: 'Parameter c2 beim Kosinus', beschriftung: <><Formel tex="c_2" /> beim Kosinus</>, erwartet: A5.kosinus.c },
          ]}
          hilfen={[
            <><Formel tex="d" /> ist die Ruhelage in der Mitte zwischen Hochpunkt und Tiefpunkt. <Formel tex="a" /> ist der Abstand der Ruhelage zum Hochpunkt.</>,
            <>Die Periode ist der Abstand zweier benachbarter Hochpunkte. Mit <Formel tex={String.raw`p=\frac{2\pi}{b}`} /> folgt <Formel tex={String.raw`b=\frac{2\pi}{p}`} nach="." /></>,
            <>Beim Sinus ist <Formel tex="c_1" /> die x-Koordinate eines aufsteigenden Wendepunkts, beim Kosinus ist <Formel tex="c_2" /> die x-Koordinate eines Hochpunkts. Nimm jeweils die kleinste Zahl <Formel tex="\geq 0" nach="." /></>,
          ]}
          loesung={[
            <>Hochpunkt bei <Formel tex="y=5{,}5" nach="," /> Tiefpunkt bei <Formel tex="y=2{,}5" nach="." /> Ruhelage: <Formel tex={String.raw`d=\frac{5{,}5+2{,}5}{2}=4`} nach="." /> Amplitude: <Formel tex="a=5{,}5-4=1{,}5" nach="." /></>,
            <>Benachbarte Hochpunkte liegen bei <Formel tex="x=2{,}5" /> und <Formel tex="x=6{,}5" nach="." /> Also ist <Formel tex="p=4" /> und <Formel tex={String.raw`b=\frac{2\pi}{4}=\frac{\pi}{2}`} nach="." /></>,
            <>Der erste aufsteigende Wendepunkt rechts von 0 liegt bei <Formel tex="(1{,}5\,|\,4)" nach="," /> also <Formel tex="c_1=1{,}5" nach="." /> Der erste Hochpunkt liegt bei <Formel tex="x=2{,}5" nach="," /> also <Formel tex="c_2=2{,}5" nach="." /></>,
            <>Ergebnis: <Formel tex={termSinus(A5.sinus, 'f_1', ECKIG)} /> und <Formel tex={termSinus(A5.kosinus, 'g_1', { funktion: 'cos', ...ECKIG })} nach="." /></>,
          ]}
        >
          <p>
            Das Schaubild gehört zu einer Funktion <Formel tex="f(x)=a\cdot\sin\left[b\cdot(x-c_1)\right]+d" /> und zu einer Funktion <Formel tex="g(x)=a\cdot\cos\left[b\cdot(x-c_2)\right]+d" nach="." /> Bestimme <Formel tex="a" nach="," /> <Formel tex="b" nach="," /> <Formel tex="c_1" nach="," /> <Formel tex="c_2" /> und <Formel tex="d" nach="." /> Wähle <Formel tex="a>0" /> und jeweils das kleinste <Formel tex="c\geq 0" nach="." />
          </p>
          <Funktionsgraph
            bereich={[-2.5, 7.5, -1, 7]}
            xTeilung={0.5}
            yTeilung={0.5}
            xBeschriftung="zahl"
            className="brett-3zu2"
            beschreibung="Schaubild einer periodischen Kurve. Hochpunkte bei x gleich minus 1,5, 2,5 und 6,5 mit y gleich 5,5. Tiefpunkte bei x gleich 0,5 und 4,5 mit y gleich 2,5. Aufsteigende Wendepunkte bei x gleich 1,5 und 5,5 auf der Höhe y gleich 4."
            kurven={[{ f: (x) => wertTrig(A5.sinus, x, 'sin'), farbe: '#111827' }]}
          />
        </Aufgabe>

        <Auswahlfrage
          nummer="5b"
          titel="Noch ein passender Term"
          optionen={[
            opt('a', <Formel tex={termSinus(A5.falschHochpunkt, 'f', ECKIG)} />, false, <>Bei <Formel tex="x=2{,}5" /> liegt ein Hochpunkt, kein Wendepunkt. Für den Sinus muss <Formel tex="c" /> die x-Koordinate eines Wendepunkts sein.</>),
            opt('b', <Formel tex={termSinus(A5.alternativRichtig, 'f', ECKIG)} />, true, <>Richtig. Bei <Formel tex="x=3{,}5" /> liegt ein absteigender Wendepunkt. Mit <Formel tex="a<0" /> wird aus dem absteigenden Verlauf ein aufsteigender, sodass das Schaubild dasselbe ist.</>),
            opt('c', <Formel tex={termSinus(A5.falschVerschoben, 'f', ECKIG)} />, false, <>Bei <Formel tex="x=-1{,}5" /> liegt ein Hochpunkt. Ein aufsteigender Wendepunkt liegt dort nicht.</>),
            opt('d', <Formel tex={termSinus(A5.falschPeriode, 'f', ECKIG)} />, false, <>Mit <Formel tex={String.raw`b=\frac{\pi}{4}`} /> wäre die Periode 8. Das Schaubild hat aber die Periode 4.</>),
          ]}
          erklaerung={<>Wegen der Periodizität gibt es unendlich viele Terme. Man kann <Formel tex="c" /> um ganze Perioden verschieben oder <Formel tex="a" /> durch <Formel tex="-a" /> ersetzen und <Formel tex="c" /> um die halbe Periode verschieben. Probe: Setze die Stellen <Formel tex="x=1{,}5" /> und <Formel tex="x=2{,}5" /> ein.</>}
        >
          <p>
            Welcher dieser Terme gehört ebenfalls zum Schaubild aus Aufgabe 5, also zur Sinusfunktion <Formel tex="f" nach="?" />
          </p>
        </Auswahlfrage>

        <Aufgabe
          nummer={6}
          titel="Funktionsterm aus einer Beschreibung"
          felder={[
            { id: 'a', name: 'Parameter a', beschriftung: <Formel tex="a" />, erwartet: A6.a },
            { id: 'b', name: 'Parameter b', beschriftung: <Formel tex="b" />, erwartet: A6.b },
            { id: 'c', name: 'Parameter c', beschriftung: <Formel tex="c" />, erwartet: A6.c, toleranz: 0.01 },
            { id: 'd', name: 'Parameter d', beschriftung: <Formel tex="d" />, erwartet: A6.d },
          ]}
          hilfen={[
            <>Ordne jede Lageveränderung einem Parameter zu: Streckung in y-Richtung und Spiegelung an der x-Achse gehören zu <Formel tex="a" nach="," /> die Streckung in x-Richtung zu <Formel tex="b" nach="," /> die Verschiebungen zu <Formel tex="c" /> und <Formel tex="d" nach="." /></>,
            <>Für die neue Periode <Formel tex="p" /> gilt <Formel tex={String.raw`b=\frac{2\pi}{p}`} nach="." /> Das Minuszeichen der Spiegelung gehört zu <Formel tex="a" nach="." /></>,
          ]}
          loesung={[
            <>Streckung in y-Richtung mit Faktor 2 und Spiegelung an der x-Achse: <Formel tex={`a=${neg(zahlTex(A6.a))}`} nach="." /></>,
            <>Periode <Formel tex="\pi" nach=":" /> <Formel tex={String.raw`b=\frac{2\pi}{\pi}=2`} nach="." /></>,
            <>Verschiebung um <Formel tex="\tfrac{\pi}{3}" /> nach rechts: <Formel tex={`c=${piTex(A6.c)}`} nach="." /> Verschiebung um 1 nach unten: <Formel tex={`d=${neg(zahlTex(A6.d))}`} nach="." /></>,
            <>Ergebnis: <Formel tex={termSinus(A6, 'g', ECKIG)} nach="." /></>,
          ]}
        >
          <p>
            Das Schaubild von <Formel tex="f(x)=\sin(x)" /> wird in y-Richtung mit dem Faktor 2 gestreckt und an der x-Achse gespiegelt, in x-Richtung so verändert, dass die Periode <Formel tex="\pi" /> beträgt, danach um <Formel tex="\tfrac{\pi}{3}" /> nach rechts und um 1 nach unten verschoben. Es gehört zu <Formel tex="g(x)=a\cdot\sin\left[b\cdot(x-c)\right]+d" nach="." /> Bestimme <Formel tex="a" nach="," /> <Formel tex="b" nach="," /> <Formel tex="c" /> und <Formel tex="d" nach="." />
          </p>
        </Aufgabe>
      </Abschnitt>

      <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
        <h3>Wie <Formel tex="K_g" /> aus <Formel tex="K_f" /> entsteht</h3>
        <Hinweis art="merksatz" titel="Merke">
          Das Schaubild von <Formel tex="g(x)=a\cdot\sin\left[b\cdot(x-c)\right]+d" /> entsteht aus <Formel tex="K_f" /> mit <Formel tex="f(x)=\sin(x)" /> in dieser Reihenfolge durch
          <ol className="liste">
            <li>
              Streckung in y-Richtung mit dem Faktor <Formel tex="|a|" /> und Streckung in x-Richtung mit dem Faktor <Formel tex="\tfrac{1}{|b|}" nach="." /> Für <Formel tex="a<0" /> kommt eine Spiegelung an der x-Achse hinzu, für <Formel tex="b<0" /> eine Spiegelung an der y-Achse.
            </li>
            <li>
              Verschiebung um <Formel tex="c" /> in x-Richtung (für <Formel tex="c>0" /> nach rechts) und um <Formel tex="d" /> in y-Richtung (für <Formel tex="d>0" /> nach oben).
            </li>
          </ol>
          <Formel anzeige tex={String.raw`\text{Periode } p=\frac{2\pi}{|b|}\qquad \text{Amplitude } |a|`} />
        </Hinweis>

        <h3>Schaubild skizzieren</h3>
        <table className="tabelle">
          <caption>Vier Schritte beim Skizzieren</caption>
          <thead>
            <tr>
              <th scope="col">Schritt</th>
              <th scope="col">Vorgehen</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Ruhelage</th>
              <td>Die Gerade <Formel tex="y=d" nach="." /> Ihr y-Wert ist der y-Wert der Wendepunkte.</td>
            </tr>
            <tr>
              <th scope="row">Wertebereich</th>
              <td><Formel tex="y_{\min}=d-|a|" /> und <Formel tex="y_{\max}=d+|a|" nach="." /> Er legt fest, wie die y-Achse skaliert wird.</td>
            </tr>
            <tr>
              <th scope="row">Referenzpunkt</th>
              <td>
                Er legt fest, wie die x-Achse skaliert wird und wo das Schaubild beginnt. Sinus: Wendepunkt <Formel tex="(c\,|\,d)" nach="," /> aufsteigend für <Formel tex="a>0" nach="," /> absteigend für <Formel tex="a<0" /> (für <Formel tex="b>0" nach=")." /> Kosinus: Extrempunkt <Formel tex="(c\,|\,d+a)" nach="," /> Hochpunkt für <Formel tex="a>0" nach="," /> Tiefpunkt für <Formel tex="a<0" nach="." />
              </td>
            </tr>
            <tr>
              <th scope="row">Periode</th>
              <td><Formel tex={String.raw`p=\frac{2\pi}{|b|}`} nach="." /> Sie gibt den Abstand an, nach dem sich das Schaubild wiederholt.</td>
            </tr>
          </tbody>
        </table>

        <h3>Funktionsterm aus dem Schaubild</h3>
        <ol className="liste">
          <li><Formel tex="d" /> ist die Ruhelage in der Mitte zwischen Hochpunkt und Tiefpunkt.</li>
          <li><Formel tex="|a|" /> ist der Abstand der Ruhelage zum Hochpunkt, das Vorzeichen von <Formel tex="a" /> folgt aus dem Verlauf am Referenzpunkt.</li>
          <li>Die Periode <Formel tex="p" /> liefert <Formel tex={String.raw`b=\frac{2\pi}{p}`} nach="." /></li>
          <li><Formel tex="c" /> ist die x-Koordinate des Referenzpunkts.</li>
        </ol>
        <p>
          Es gibt unendlich viele Terme zum selben Schaubild, denn man kann <Formel tex="c" /> um ganze Perioden verschieben, zwischen Sinus und Kosinus wechseln und <Formel tex="a" /> durch <Formel tex="-a" /> ersetzen, wenn man <Formel tex="c" /> um die halbe Periode verschiebt.
        </p>

        <h3>Weiterführend mit GeoGebra</h3>
        <p>Die folgende Aktivität gehört zum Arbeitsblatt. Sie liegt auf geogebra.org. Erst wenn du den Link anklickst, wird die Seite von GeoGebra geladen.</p>
        <ul className="liste">
          <li>
            <Extern href="https://www.geogebra.org/m/nxydvncr">GeoGebra-Aktivität zur Lage im Koordinatensystem</Extern>
          </li>
        </ul>
      </Abschnitt>
    </>
  );
}
