import type { ReactNode } from 'react';
import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Funktionsgraph } from '@/components/Funktionsgraph';
import { Hinweis } from '@/components/Hinweis';
import { FARBEN } from '@/components/Zeichenbrett';
import { gradZuBogen } from '@/lib/winkel';
import { piTex, piText, zahlTex } from '@/lib/zahlen';
import { A1, A2, A3, A4, A6 } from './daten';
import { Einheitskreislabor } from './Einheitskreislabor';

const PI = Math.PI;
const UMRECHNUNG_GRAD = [0, 30, 45, 60, 90, 180, 270, 360];

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

const sinCosName = (f: 'sin' | 'cos', x: number) => `\\${f}\\left(${piTex(x)}\\right)`;

export default function Modul() {
  return (
    <>
      <Abschnitt id="erklaeren" titel="Erklären">

        <h3>Winkel im Bogenmaß</h3>
        <p>
          Die Größe eines Winkels <Formel tex="\alpha" /> lässt sich im Gradmaß angeben, zum Beispiel <Formel tex="90^\circ" />, oder im Bogenmaß. Das Bogenmaß <Formel tex="x" /> ist die Länge des zugehörigen Bogens am Einheitskreis, also am Kreis um den Ursprung mit Radius 1. So wird jedem Winkel eindeutig eine reelle Zahl <Formel tex="x" /> zugeordnet.
        </p>
        <p>
          Der Einheitskreis hat den Umfang <Formel tex="2\pi" />. Ein Vollwinkel von <Formel tex="360^\circ" /> hat deshalb das Bogenmaß <Formel tex="2\pi" />. Winkel und Bogenlänge sind zueinander proportional:
        </p>
        <Hinweis art="merksatz" titel="Umrechnung zwischen Gradmaß und Bogenmaß">
          <Formel anzeige tex={String.raw`\frac{\alpha}{360^\circ}=\frac{x}{2\pi}\qquad\text{also}\qquad x=\alpha\cdot\frac{\pi}{180^\circ},\quad \alpha=x\cdot\frac{180^\circ}{\pi}`} />
        </Hinweis>
        <table className="tabelle tabelle-breit">
          <caption>Häufig verwendete Winkel</caption>
          <tbody>
            <tr>
              <th scope="row">Gradmaß <Formel tex="\alpha" /></th>
              {UMRECHNUNG_GRAD.map((g) => (
                <td key={g}>
                  <Formel tex={`${g}^\\circ`} />
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">Bogenmaß <Formel tex="x" /></th>
              {UMRECHNUNG_GRAD.map((g) => (
                <td key={g}>
                  <Formel tex={piTex(gradZuBogen(g))} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <Hinweis titel="Taschenrechner">
          Ist der Winkel im Gradmaß gegeben, rechnest du im Modus <strong>DEG</strong>. Ist er im Bogenmaß gegeben, rechnest du im Modus <strong>RAD</strong>.
        </Hinweis>

        <h3>Sinus und Kosinus am Einheitskreis</h3>
        <p>
          Zu jedem Bogenmaß <Formel tex="x" /> gehört ein Punkt <Formel tex="P" /> auf dem Einheitskreis. Man erreicht ihn, wenn man vom Punkt <Formel tex="(1\,|\,0)" /> aus am Kreis entlangläuft. Die Zahl <Formel tex="x" /> sagt, wie weit und in welche Richtung: Bei positivem <Formel tex="x" /> läuft man gegen den Uhrzeigersinn, bei negativem <Formel tex="x" /> im Uhrzeigersinn. Für <Formel tex="x>2\pi" /> läuft man mehr als einmal herum.
        </p>
        <Hinweis art="merksatz" titel="Sinus und Kosinus">
          Der Punkt <Formel tex="P" /> zum Bogenmaß <Formel tex="x" /> hat die Koordinaten <Formel tex="P(\cos x\,|\,\sin x)" />. Der Kosinus von <Formel tex="x" /> ist die <Formel tex="x" />-Koordinate von <Formel tex="P" />, der Sinus von <Formel tex="x" /> ist die <Formel tex="y" />-Koordinate von <Formel tex="P" />.
        </Hinweis>

        <h3>Sinus- und Kosinusfunktion</h3>
        <p>
          Jeder reellen Zahl <Formel tex="x" /> ist so ein Sinuswert und ein Kosinuswert zugeordnet. Die Funktion <Formel tex="f" /> mit <Formel tex="f(x)=\sin x" />, <Formel tex="x\in\mathbb{R}" />, heißt <strong>Sinusfunktion</strong>, ihr Graph heißt <strong>Sinuskurve</strong>. Die Funktion <Formel tex="g" /> mit <Formel tex="g(x)=\cos x" />, <Formel tex="x\in\mathbb{R}" />, heißt <strong>Kosinusfunktion</strong>, ihr Graph heißt <strong>Kosinuskurve</strong>. Beide Funktionen heißen trigonometrische Funktionen. Der Definitionsbereich ist jeweils <Formel tex="\mathbb{R}" />, weil zu jedem <Formel tex="x" /> ein Punkt <Formel tex="P" /> gehört.
        </p>
      </Abschnitt>

      <Abschnitt id="entdecken" titel="Entdecken">
        <p>
          Drehe den Punkt <Formel tex="P" /> am Einheitskreis und beobachte, wie aus seinen Koordinaten die beiden Kurven entstehen. Links siehst du den Einheitskreis, rechts die Graphen mit dem Bogenmaß <Formel tex="x" /> auf der waagerechten Achse. Der Kreis zeigt für <Formel tex="x>2\pi" /> oder <Formel tex="x<0" /> denselben Punkt wie für den entsprechenden Winkel zwischen <Formel tex="0" /> und <Formel tex="2\pi" />.
        </p>
        <Einheitskreislabor />

        <h3>Untersuchungsaufträge</h3>
        <p>Beantworte die Fragen zuerst mit dem Labor. Danach kannst du deine Beobachtung vergleichen.</p>
        <ol className="auftraege">
          <li>
            <p>
              Stelle nacheinander <Formel tex="0^\circ" />, <Formel tex="90^\circ" />, <Formel tex="180^\circ" />, <Formel tex="270^\circ" /> und <Formel tex="360^\circ" /> ein. Notiere jeweils die Koordinaten von <Formel tex="P" />, also die Werte von <Formel tex="\cos x" /> und <Formel tex="\sin x" />.
            </p>
            <Beobachtung>
              <Formel tex="P(1\,|\,0)" />, <Formel tex="P(0\,|\,1)" />, <Formel tex="P(-1\,|\,0)" />, <Formel tex="P(0\,|\,{-1})" />, <Formel tex="P(1\,|\,0)" />. Der Kosinus nimmt also die Werte <Formel tex="1,\,0,\,-1,\,0,\,1" /> an, der Sinus die Werte <Formel tex="0,\,1,\,0,\,-1,\,0" />.
            </Beobachtung>
          </li>
          <li>
            <p>
              Wann ist <Formel tex="\sin x" /> positiv, wann negativ? Wann ist <Formel tex="\cos x" /> positiv, wann negativ? Beschreibe es mit der Lage von <Formel tex="P" /> im Koordinatensystem.
            </p>
            <Beobachtung>
              <Formel tex="\sin x" /> ist positiv, wenn <Formel tex="P" /> oberhalb der x-Achse liegt (für <Formel tex="0<x<\pi" />), und negativ unterhalb (für <Formel tex="\pi<x<2\pi" />). <Formel tex="\cos x" /> ist positiv, wenn <Formel tex="P" /> rechts von der y-Achse liegt (für <Formel tex="0\le x<\tfrac{\pi}{2}" /> und <Formel tex="\tfrac{3\pi}{2}<x\le 2\pi" />), und negativ links davon.
            </Beobachtung>
          </li>
          <li>
            <p>
              Welche größten und kleinsten Werte nehmen <Formel tex="\sin x" /> und <Formel tex="\cos x" /> an? Bei welchen Winkeln zwischen <Formel tex="0^\circ" /> und <Formel tex="360^\circ" /> geschieht das?
            </p>
            <Beobachtung>
              Beide Werte liegen immer zwischen <Formel tex="-1" /> und <Formel tex="1" />, weil <Formel tex="P" /> auf dem Einheitskreis bleibt. <Formel tex="\sin x" /> ist am größten bei <Formel tex="90^\circ" /> (Wert 1) und am kleinsten bei <Formel tex="270^\circ" /> (Wert <Formel tex="-1" />). <Formel tex="\cos x" /> ist am größten bei <Formel tex="0^\circ" /> und <Formel tex="360^\circ" /> (Wert 1) und am kleinsten bei <Formel tex="180^\circ" /> (Wert <Formel tex="-1" />).
            </Beobachtung>
          </li>
          <li>
            <p>
              Vergleiche <Formel tex="30^\circ" /> mit <Formel tex="390^\circ" /> sowie <Formel tex="-150^\circ" /> mit <Formel tex="210^\circ" />. Was fällt am Punkt <Formel tex="P" /> und an den Werten von Sinus und Kosinus auf? Was bedeutet das für die Kurven?
            </p>
            <Beobachtung>
              Die beiden Winkel eines Paars führen zum selben Punkt <Formel tex="P" />, sie unterscheiden sich um <Formel tex="360^\circ" />. Eine volle Umdrehung entspricht dem Bogenmaß <Formel tex="2\pi" />. Es gilt also <Formel tex="\sin(x+2\pi)=\sin x" /> und <Formel tex="\cos(x+2\pi)=\cos x" />. Die Kurven wiederholen sich nach jeweils <Formel tex="2\pi" />. Man sagt, die Funktionen sind periodisch mit der Periode <Formel tex="2\pi" />.
            </Beobachtung>
          </li>
          <li>
            <p>
              Stelle <Formel tex="60^\circ" /> und dann <Formel tex="-60^\circ" /> ein, ebenso <Formel tex="120^\circ" /> und <Formel tex="-120^\circ" />. Wie hängen <Formel tex="\sin(-x)" /> und <Formel tex="\sin x" /> zusammen, wie <Formel tex="\cos(-x)" /> und <Formel tex="\cos x" />? Welche Symmetrie der Kurven folgt daraus?
            </p>
            <Beobachtung>
              Der Punkt für <Formel tex="-x" /> entsteht durch Spiegelung des Punkts für <Formel tex="x" /> an der x-Achse. Die x-Koordinate bleibt gleich, die y-Koordinate wechselt das Vorzeichen: <Formel tex="\cos(-x)=\cos x" /> und <Formel tex="\sin(-x)=-\sin x" />. Die Kosinuskurve ist deshalb symmetrisch zur y-Achse, die Sinuskurve symmetrisch zum Ursprung.
            </Beobachtung>
          </li>
          <li>
            <p>
              Betrachte beide Kurven nebeneinander. Wie müsste man die Sinuskurve verschieben, damit sie auf der Kosinuskurve liegt?
            </p>
            <Beobachtung>
              Die Kosinuskurve entsteht, wenn man die Sinuskurve um <Formel tex="\tfrac{\pi}{2}" /> nach links verschiebt. Der Hochpunkt der Sinuskurve bei <Formel tex="x=\tfrac{\pi}{2}" /> liegt dann bei <Formel tex="x=0" />. Es gilt <Formel tex="\cos x=\sin\!\left(x+\tfrac{\pi}{2}\right)" />.
            </Beobachtung>
          </li>
        </ol>
      </Abschnitt>

      <Abschnitt id="ueberpruefen" titel="Überprüfen">
        <p>
          Gib Zahlen als Dezimalzahl (<code>0,87</code>), als Bruch (<code>1/2</code>) oder als Vielfaches von <Formel tex="\pi" /> (<code>pi/3</code> oder <code>π/3</code>) ein. Dezimalzahlen werden auf zwei Nachkommastellen genau akzeptiert.
        </p>

        <Aufgabe
          nummer={1}
          titel="Gradmaß und Bogenmaß umrechnen"
          felder={[
            { id: 'a', name: 'Bogenmaß von 60 Grad', beschriftung: <>Bogenmaß von <Formel tex="60^\circ" /></>, erwartet: A1.grad60, toleranz: 0.01 },
            { id: 'b', name: 'Bogenmaß von 135 Grad', beschriftung: <>Bogenmaß von <Formel tex="135^\circ" /></>, erwartet: A1.grad135, toleranz: 0.01 },
            { id: 'c', name: 'Gradmaß von 5π durch 6, in Grad', beschriftung: <>Gradmaß von <Formel tex="x=\tfrac{5\pi}{6}" /> (in Grad)</>, erwartet: A1.bogen5pi6, toleranz: 0.05 },
            { id: 'd', name: 'Gradmaß von x gleich 2, in Grad', beschriftung: <>Gradmaß von <Formel tex="x=2" /> (in Grad)</>, erwartet: A1.bogen2, toleranz: 0.05 },
          ]}
          hilfen={[
            <>Stelle die Verhältnisgleichung <Formel tex={String.raw`\frac{\alpha}{360^\circ}=\frac{x}{2\pi}`} /> nach der gesuchten Größe um: <Formel tex={String.raw`x=\alpha\cdot\frac{\pi}{180^\circ}`} /> beziehungsweise <Formel tex={String.raw`\alpha=x\cdot\frac{180^\circ}{\pi}`} />.</>,
            <>Beispiel: <Formel tex={String.raw`90^\circ\cdot\frac{\pi}{180^\circ}=\frac{\pi}{2}`} />. Kürze den Bruch, wenn möglich.</>,
          ]}
          loesung={[
            <><Formel tex={String.raw`x=60\cdot\frac{\pi}{180}=\frac{\pi}{3}\approx ${zahlTex(A1.grad60)}`} /></>,
            <><Formel tex={String.raw`x=135\cdot\frac{\pi}{180}=\frac{3\pi}{4}\approx ${zahlTex(A1.grad135)}`} /></>,
            <><Formel tex={String.raw`\alpha=\frac{5\pi}{6}\cdot\frac{180^\circ}{\pi}=150^\circ`} /></>,
            <><Formel tex={String.raw`\alpha=2\cdot\frac{180^\circ}{\pi}\approx ${zahlTex(A1.bogen2)}^\circ`} /></>,
          ]}
        >
          <p>Rechne um. Gib die Bogenmaße als Vielfaches von <Formel tex="\pi" /> oder als Dezimalzahl an, die Gradmaße in Grad.</p>
        </Aufgabe>

        <Aufgabe
          nummer={2}
          titel="Werte am Einheitskreis ablesen"
          felder={A2.map((e) => ({
            id: e.id,
            name: `${e.funktion === 'sin' ? 'Sinus' : 'Kosinus'} von ${piText(e.x)}`,
            beschriftung: <Formel tex={sinCosName(e.funktion, e.x)} />,
            erwartet: e.erwartet,
          }))}
          hilfen={[
            <>Markiere den Punkt <Formel tex="P" /> zum Bogenmaß <Formel tex="x" /> am Einheitskreis. Positive Werte laufen gegen den Uhrzeigersinn, negative im Uhrzeigersinn. Du kannst die Stelle im Labor einstellen.</>,
            <><Formel tex="\pi" /> ist eine halbe Umdrehung, <Formel tex="\tfrac{3\pi}{2}" /> drei Viertel einer Umdrehung, <Formel tex="2\pi" /> eine ganze Umdrehung. <Formel tex="-\tfrac{\pi}{2}" /> ist eine Vierteldrehung im Uhrzeigersinn.</>,
            <>Der Kosinus ist die <Formel tex="x" />-Koordinate von <Formel tex="P" />, der Sinus die <Formel tex="y" />-Koordinate.</>,
          ]}
          loesung={[
            <>Bei <Formel tex="x=\pi" /> liegt <Formel tex="P(-1\,|\,0)" />. Also <Formel tex="\sin(\pi)=0" /> und <Formel tex="\cos(\pi)=-1" />.</>,
            <>Bei <Formel tex="x=\tfrac{3\pi}{2}" /> liegt <Formel tex="P(0\,|\,{-1})" />. Also <Formel tex="\sin\left(\tfrac{3\pi}{2}\right)=-1" /> und <Formel tex="\cos\left(\tfrac{3\pi}{2}\right)=0" />.</>,
            <>Bei <Formel tex="x=-\tfrac{\pi}{2}" /> liegt ebenfalls <Formel tex="P(0\,|\,{-1})" />. Also <Formel tex="\sin\!\left(-\tfrac{\pi}{2}\right)=-1" />.</>,
            <>Bei <Formel tex="x=2\pi" /> liegt <Formel tex="P(1\,|\,0)" />. Also <Formel tex="\cos(2\pi)=1" />.</>,
          ]}
        >
          <p>Bestimme ohne Taschenrechner mithilfe des Einheitskreises.</p>
        </Aufgabe>

        <Aufgabe
          nummer={3}
          titel="Mit dem Taschenrechner arbeiten"
          felder={[
            { id: 'sin1', name: 'Sinus von 1 im Bogenmaß', beschriftung: <><Formel tex="\sin(1)" /> (Modus RAD)</>, erwartet: A3.sinRad1, toleranz: 0.01 },
            { id: 'cos2', name: 'Kosinus von 2 im Bogenmaß', beschriftung: <><Formel tex="\cos(2)" /> (Modus RAD)</>, erwartet: A3.cosRad2, toleranz: 0.01 },
            { id: 'cos75', name: 'Kosinus von 75 Grad', beschriftung: <><Formel tex="\cos(75^\circ)" /> (Modus DEG)</>, erwartet: A3.cosDeg75, toleranz: 0.01 },
          ]}
          hilfen={[
            <>Stelle zuerst den Modus deines Taschenrechners richtig ein: <strong>RAD</strong> für Bogenmaß, <strong>DEG</strong> für Grad.</>,
          ]}
          loesung={[
            <><Formel tex={`\\sin(1)\\approx ${zahlTex(A3.sinRad1)}`} /> (Modus RAD)</>,
            <><Formel tex={`\\cos(2)\\approx ${zahlTex(A3.cosRad2)}`} /> (Modus RAD)</>,
            <><Formel tex={`\\cos(75)^\\circ\\approx ${zahlTex(A3.cosDeg75)}`} /> (Modus DEG)</>,
          ]}
        >
          <p>Berechne auf zwei Nachkommastellen genau. Achte auf den richtigen Modus.</p>
        </Aufgabe>

        <Auswahlfrage
          nummer="3b"
          titel="Fehler beim Taschenrechner finden"
          optionen={[
            {
              id: 'deg',
              text: 'Im Modus DEG.',
              richtig: false,
              rueckmeldung: <>Im Modus DEG rechnet der Taschenrechner mit Grad und liefert <Formel tex="\sin(30^\circ)=0{,}5" />. Der Wert <Formel tex={`${zahlTex(A3.sin30Rad)}`} /> passt dazu nicht.</>,
            },
            {
              id: 'rad',
              text: 'Im Modus RAD.',
              richtig: true,
              rueckmeldung: <>Richtig. Der Rechner hat 30 als Bogenmaß gelesen, also 30 Längeneinheiten auf dem Einheitskreis. Das sind viele Umdrehungen.</>,
            },
            {
              id: 'egal',
              text: 'Das Ergebnis hängt nicht vom Modus ab.',
              richtig: false,
              rueckmeldung: <>Doch: Die Zahl 30 bedeutet im Gradmaß etwas ganz anderes als im Bogenmaß. Deshalb muss der Modus zur Angabe passen.</>,
            },
          ]}
          erklaerung={
            <>
              Für <Formel tex="30^\circ" /> muss der Rechner im Modus DEG stehen, dann gilt <Formel tex="\sin(30^\circ)=0{,}5" />. Im Modus RAD wird 30 als Bogenmaß gelesen. Dann ergibt sich <Formel tex={`\\sin(30)\\approx ${zahlTex(A3.sin30Rad)}`} />.
            </>
          }
        >
          <p>
            Du tippst <Formel tex="\sin(30)" /> in den Taschenrechner ein und erhältst ungefähr <Formel tex={`${zahlTex(A3.sin30Rad)}`} />. Du wolltest den Sinus von <Formel tex="30^\circ" /> berechnen. In welchem Modus stand der Taschenrechner?
          </p>
        </Auswahlfrage>

        <Aufgabe
          nummer={4}
          titel="Wertetabelle zum Zeichnen der Kurven"
          felder={A4.map((e) => ({
            id: e.id,
            name: `${e.funktion === 'sin' ? 'Sinus' : 'Kosinus'} von ${piText(e.x)}`,
            beschriftung: <Formel tex={sinCosName(e.funktion, e.x)} />,
            erwartet: e.erwartet,
            toleranz: 0.01,
          }))}
          hilfen={[
            <>Du kannst die Werte mit dem Taschenrechner im Modus RAD berechnen. Alternativ liest du sie am Einheitskreis ab.</>,
            <>Bei <Formel tex="\tfrac{\pi}{6}" />, <Formel tex="\tfrac{\pi}{4}" /> und <Formel tex="\tfrac{\pi}{3}" /> kommen als Werte nur <Formel tex="0{,}5" />, <Formel tex="0{,}71" /> und <Formel tex="0{,}87" /> vor. Bei <Formel tex="\tfrac{3\pi}{4}" /> liegt <Formel tex="P" /> im zweiten Quadranten, dort ist der Kosinus negativ.</>,
          ]}
          loesung={A4.map((e) => (
            <>
              <Formel tex={`${sinCosName(e.funktion, e.x)}\\approx ${zahlTex(e.erwartet)}`} />
            </>
          ))}
        >
          <p>
            Berechne die Funktionswerte auf zwei Nachkommastellen genau. Übertrage danach die Wertepaare in das Koordinatensystem auf deinem Arbeitsblatt, ergänze sie mithilfe des Einheitskreises und zeichne die Sinuskurve und die Kosinuskurve.
          </p>
        </Aufgabe>

        <Auswahlfrage
          nummer="5a"
          titel="Kurve erkennen"
          optionen={[
            {
              id: 'sin',
              text: <Formel tex="f(x)=\sin x" />,
              richtig: false,
              rueckmeldung: <>Die Sinuskurve geht durch den Ursprung, denn <Formel tex="\sin(0)=0" />. Die abgebildete Kurve schneidet die y-Achse aber bei <Formel tex="y=1" />.</>,
            },
            {
              id: 'cos',
              text: <Formel tex="f(x)=\cos x" />,
              richtig: true,
              rueckmeldung: <>Richtig. Bei <Formel tex="x=0" /> liegt <Formel tex="P(1\,|\,0)" />, also <Formel tex="\cos(0)=1" />.</>,
            },
          ]}
          erklaerung={
            <>
              Am Kurvenverlauf bei <Formel tex="x=0" /> erkennst du die Funktion: Die Sinuskurve beginnt im Ursprung, die Kosinuskurve beginnt bei <Formel tex="y=1" />. Außerdem hat die Kosinuskurve bei <Formel tex="x=0" /> einen Hochpunkt.
            </>
          }
        >
          <p>Welche Funktion gehört zu der abgebildeten Kurve?</p>
          <Funktionsgraph
            bereich={[-PI, 3 * PI, -1.5, 1.5]}
            xTeilung={PI / 2}
            yTeilung={0.5}
            className="brett-3zu2"
            beschreibung="Graph einer periodischen Kurve mit Hochpunkt bei x = 0 und y = 1, Tiefpunkt bei x = π und y = −1, Nullstelle bei x = π/2."
            kurven={[{ f: Math.cos, farbe: '#111827' }]}
          />
        </Auswahlfrage>

        <Auswahlfrage
          nummer="5b"
          titel="Funktion aus Wertepaaren erkennen"
          optionen={[
            {
              id: 'sin',
              text: <Formel tex="f(x)=\sin x" />,
              richtig: true,
              rueckmeldung: <>Richtig. Bei <Formel tex="x=0" /> ist der Sinus 0, bei <Formel tex="\tfrac{\pi}{2}" /> ist <Formel tex="P(0\,|\,1)" />, bei <Formel tex="\pi" /> ist <Formel tex="P(-1\,|\,0)" /> und bei <Formel tex="\tfrac{3\pi}{2}" /> ist <Formel tex="P(0\,|\,{-1})" />.</>,
            },
            {
              id: 'cos',
              text: <Formel tex="f(x)=\cos x" />,
              richtig: false,
              rueckmeldung: <>Für den Kosinus gilt <Formel tex="\cos(0)=1" />, in der Tabelle steht bei <Formel tex="x=0" /> aber der Wert 0.</>,
            },
          ]}
          erklaerung={
            <>
              Die Werte sind genau die <Formel tex="y" />-Koordinaten von <Formel tex="P" /> bei den Viertelumdrehungen: <Formel tex="0,\,1,\,0,\,-1" />. Das sind die Sinuswerte.
            </>
          }
        >
          <p>Eine trigonometrische Funktion <Formel tex="f" /> hat diese Wertetabelle. Welche Funktion ist es?</p>
          <table className="tabelle tabelle-breit">
            <caption>Wertetabelle</caption>
            <tbody>
              <tr>
                <th scope="row"><Formel tex="x" /></th>
                <td><Formel tex="0" /></td>
                <td><Formel tex="\tfrac{\pi}{2}" /></td>
                <td><Formel tex="\pi" /></td>
                <td><Formel tex="\tfrac{3\pi}{2}" /></td>
              </tr>
              <tr>
                <th scope="row"><Formel tex="f(x)" /></th>
                <td><Formel tex="0" /></td>
                <td><Formel tex="1" /></td>
                <td><Formel tex="0" /></td>
                <td><Formel tex="-1" /></td>
              </tr>
            </tbody>
          </table>
        </Auswahlfrage>

        <Aufgabe
          nummer={6}
          titel="Eigenschaften: Extrempunkte"
          felder={[
            { id: 'sinHoch', name: 'Hochpunkt der Sinusfunktion', beschriftung: <>Hochpunkt von <Formel tex="\sin x" /></>, erwartet: A6.sinHoch, toleranz: 0.01 },
            { id: 'sinTief', name: 'Tiefpunkt der Sinusfunktion', beschriftung: <>Tiefpunkt von <Formel tex="\sin x" /></>, erwartet: A6.sinTief, toleranz: 0.01 },
            { id: 'cosHoch', name: 'Hochpunkt der Kosinusfunktion', beschriftung: <>Hochpunkt von <Formel tex="\cos x" /></>, erwartet: A6.cosHoch, toleranz: 0.01 },
            { id: 'cosTief', name: 'Tiefpunkt der Kosinusfunktion', beschriftung: <>Tiefpunkt von <Formel tex="\cos x" /></>, erwartet: A6.cosTief, toleranz: 0.01 },
          ]}
          hilfen={[
            <>Ein Hochpunkt liegt dort, wo die Funktion den Wert <Formel tex="1" /> annimmt, ein Tiefpunkt dort, wo sie den Wert <Formel tex="-1" /> annimmt. Am Einheitskreis ist das der Fall, wenn <Formel tex="P" /> ganz oben, unten, rechts oder links liegt.</>,
          ]}
          loesung={[
            <>Sinus: <Formel tex="P" /> liegt bei <Formel tex="x=\tfrac{\pi}{2}" /> ganz oben, <Formel tex="\sin x=1" />. Bei <Formel tex="x=\tfrac{3\pi}{2}" /> liegt <Formel tex="P" /> ganz unten, <Formel tex="\sin x=-1" />.</>,
            <>Kosinus: Bei <Formel tex="x=0" /> liegt <Formel tex="P(1\,|\,0)" />, <Formel tex="\cos x=1" />. Bei <Formel tex="x=\pi" /> liegt <Formel tex="P(-1\,|\,0)" />, <Formel tex="\cos x=-1" />.</>,
          ]}
        >
          <p>
            Gib jeweils die kleinste Stelle <Formel tex="x\ge 0" /> an, an der die Funktion einen Hochpunkt beziehungsweise Tiefpunkt hat.
          </p>
        </Aufgabe>

        <Auswahlfrage
          nummer="6b"
          titel="Nullstellen der Sinusfunktion"
          optionen={[
            { id: 'a', text: <Formel tex="x=k\cdot\pi,\ k\in\mathbb{Z}" />, richtig: true, rueckmeldung: <>Richtig. Bei jeder halben Umdrehung liegt <Formel tex="P" /> auf der x-Achse, dort ist der Sinus 0.</> },
            { id: 'b', text: <Formel tex="x=\tfrac{\pi}{2}+k\cdot\pi,\ k\in\mathbb{Z}" />, richtig: false, rueckmeldung: <>Das sind die Nullstellen der Kosinusfunktion. Dort liegt <Formel tex="P" /> auf der y-Achse.</> },
            { id: 'c', text: <Formel tex="x=k\cdot 2\pi,\ k\in\mathbb{Z}" />, richtig: false, rueckmeldung: <>Das sind nur die vollen Umdrehungen. Auch bei <Formel tex="x=\pi" /> liegt <Formel tex="P" /> auf der x-Achse, und dort ist <Formel tex="\sin(\pi)=0" />.</> },
            { id: 'd', text: <Formel tex="x=\tfrac{\pi}{2}+k\cdot 2\pi,\ k\in\mathbb{Z}" />, richtig: false, rueckmeldung: <>Dort liegt <Formel tex="P" /> ganz oben, der Sinus hat den Wert 1.</> },
          ]}
          erklaerung={<>Der Sinus ist die <Formel tex="y" />-Koordinate von <Formel tex="P" />. Sie ist 0, wenn <Formel tex="P" /> auf der x-Achse liegt, also bei <Formel tex="x=0,\ \pi,\ 2\pi,\ \dots" /> und bei <Formel tex="-\pi,\ -2\pi,\ \dots" />. Zusammengefasst: <Formel tex="x=k\cdot\pi" /> mit <Formel tex="k\in\mathbb{Z}" />.</>}
        >
          <p>Welche Gleichung beschreibt alle Nullstellen der Sinusfunktion?</p>
        </Auswahlfrage>

        <Auswahlfrage
          nummer="6c"
          titel="Nullstellen der Kosinusfunktion"
          optionen={[
            { id: 'a', text: <Formel tex="x=k\cdot\pi,\ k\in\mathbb{Z}" />, richtig: false, rueckmeldung: <>Das sind die Nullstellen der Sinusfunktion. Dort liegt <Formel tex="P" /> auf der x-Achse und der Kosinus hat den Wert <Formel tex="\pm 1" />.</> },
            { id: 'b', text: <Formel tex="x=\tfrac{\pi}{2}+k\cdot\pi,\ k\in\mathbb{Z}" />, richtig: true, rueckmeldung: <>Richtig. Bei <Formel tex="x=\tfrac{\pi}{2}" /> liegt <Formel tex="P" /> auf der y-Achse, dort ist die x-Koordinate 0. Das wiederholt sich nach jeder halben Umdrehung.</> },
            { id: 'c', text: <Formel tex="x=\tfrac{\pi}{2}+k\cdot 2\pi,\ k\in\mathbb{Z}" />, richtig: false, rueckmeldung: <>Das erfasst nur jede zweite Nullstelle. Auch bei <Formel tex="x=\tfrac{3\pi}{2}" /> liegt <Formel tex="P" /> auf der y-Achse.</> },
            { id: 'd', text: <Formel tex="x=k\cdot 2\pi,\ k\in\mathbb{Z}" />, richtig: false, rueckmeldung: <>Dort liegt <Formel tex="P(1\,|\,0)" />, der Kosinus hat den Wert 1.</> },
          ]}
          erklaerung={<>Der Kosinus ist die <Formel tex="x" />-Koordinate von <Formel tex="P" />. Sie ist 0, wenn <Formel tex="P" /> auf der y-Achse liegt, also bei <Formel tex="x=\tfrac{\pi}{2},\ \tfrac{3\pi}{2},\ \dots" /> und bei <Formel tex="-\tfrac{\pi}{2},\ \dots" />. Zusammengefasst: <Formel tex="x=\tfrac{\pi}{2}+k\cdot\pi" /> mit <Formel tex="k\in\mathbb{Z}" />.</>}
        >
          <p>Welche Gleichung beschreibt alle Nullstellen der Kosinusfunktion?</p>
        </Auswahlfrage>

        <Auswahlfrage
          nummer="6d"
          titel="Wendepunkte"
          optionen={[
            { id: 'a', text: 'An den Hochpunkten und Tiefpunkten.', richtig: false, rueckmeldung: <>An den Extrempunkten ändert die Kurve ihre Steigungsrichtung, nicht ihre Krümmungsrichtung. Die Kurve ist dort gleichmäßig gebogen.</> },
            { id: 'b', text: 'An den Nullstellen, also dort, wo die Kurve die x-Achse schneidet.', richtig: true, rueckmeldung: <>Richtig. Dort wechselt die Kurve von einer Linkskurve in eine Rechtskurve oder umgekehrt.</> },
            { id: 'c', text: 'Nur bei x = 0.', richtig: false, rueckmeldung: <>Die Kurven wiederholen sich periodisch, daher gibt es unendlich viele Wendepunkte.</> },
            { id: 'd', text: 'Es gibt keine Wendepunkte.', richtig: false, rueckmeldung: <>Betrachte den Verlauf an der x-Achse: Die Krümmung der Kurve wechselt dort.</> },
          ]}
          erklaerung={<>An den Nullstellen verläuft die Kurve am steilsten und wechselt ihre Krümmung. Die Sinuskurve hat Wendepunkte bei <Formel tex="(k\pi\,|\,0)" />, die Kosinuskurve bei <Formel tex="(\tfrac{\pi}{2}+k\pi\,|\,0)" /> mit <Formel tex="k\in\mathbb{Z}" />.</>}
        >
          <p>Wo liegen die Wendepunkte der Sinuskurve und der Kosinuskurve?</p>
        </Auswahlfrage>

        <Auswahlfrage
          nummer="6e"
          titel="Symmetrie"
          optionen={[
            { id: 'a', text: 'Sinus: punktsymmetrisch zum Ursprung. Kosinus: achsensymmetrisch zur y-Achse.', richtig: true, rueckmeldung: <>Richtig. Es gilt <Formel tex="\sin(-x)=-\sin x" /> und <Formel tex="\cos(-x)=\cos x" />.</> },
            { id: 'b', text: 'Sinus: achsensymmetrisch zur y-Achse. Kosinus: punktsymmetrisch zum Ursprung.', richtig: false, rueckmeldung: <>Das ist vertauscht. Die Kosinuskurve ist bei <Formel tex="x=0" /> ein Hochpunkt und liegt symmetrisch zur y-Achse.</> },
            { id: 'c', text: 'Beide sind achsensymmetrisch zur y-Achse.', richtig: false, rueckmeldung: <>Das gilt nur für den Kosinus. Der Sinus wechselt bei <Formel tex="-x" /> das Vorzeichen: <Formel tex="\sin(-x)=-\sin x" />.</> },
            { id: 'd', text: 'Beide sind punktsymmetrisch zum Ursprung.', richtig: false, rueckmeldung: <>Das gilt nur für den Sinus. Beim Kosinus bleibt der Wert bei <Formel tex="-x" /> gleich: <Formel tex="\cos(-x)=\cos x" />.</> },
          ]}
          erklaerung={<>Der Punkt für <Formel tex="-x" /> ist der an der x-Achse gespiegelte Punkt für <Formel tex="x" />. Die x-Koordinate bleibt gleich, die y-Koordinate ändert das Vorzeichen. Daraus folgt <Formel tex="\cos(-x)=\cos x" /> (Achsensymmetrie zur y-Achse) und <Formel tex="\sin(-x)=-\sin x" /> (Punktsymmetrie zum Ursprung).</>}
        >
          <p>Welche Symmetrie haben die Sinuskurve und die Kosinuskurve?</p>
        </Auswahlfrage>
      </Abschnitt>

      <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
        <p>Vergleiche mit deinen eigenen Eintragungen zu den Eigenschaften.</p>
        <table className="tabelle">
          <caption>Eigenschaften der Sinus- und der Kosinusfunktion (<Formel tex="k\in\mathbb{Z}" />)</caption>
          <thead>
            <tr>
              <th scope="col">Eigenschaft</th>
              <th scope="col">Sinusfunktion <Formel tex="f(x)=\sin x" /></th>
              <th scope="col">Kosinusfunktion <Formel tex="g(x)=\cos x" /></th>
            </tr>
          </thead>
          <tbody>
            <tr><th scope="row">Definitionsbereich</th><td><Formel tex="\mathbb{R}" /></td><td><Formel tex="\mathbb{R}" /></td></tr>
            <tr><th scope="row">Wertebereich</th><td><Formel tex="[-1;\,1]" /></td><td><Formel tex="[-1;\,1]" /></td></tr>
            <tr><th scope="row">Periode</th><td><Formel tex="2\pi" /></td><td><Formel tex="2\pi" /></td></tr>
            <tr><th scope="row">Nullstellen</th><td><Formel tex="x=k\cdot\pi" /></td><td><Formel tex="x=\tfrac{\pi}{2}+k\cdot\pi" /></td></tr>
            <tr><th scope="row">Hochpunkte</th><td><Formel tex="\left(\tfrac{\pi}{2}+2k\pi\,\middle|\,1\right)" /></td><td><Formel tex="\left(2k\pi\,\middle|\,1\right)" /></td></tr>
            <tr><th scope="row">Tiefpunkte</th><td><Formel tex="\left(\tfrac{3\pi}{2}+2k\pi\,\middle|\,{-1}\right)" /></td><td><Formel tex="\left(\pi+2k\pi\,\middle|\,{-1}\right)" /></td></tr>
            <tr><th scope="row">Wendepunkte</th><td><Formel tex="(k\pi\,|\,0)" /></td><td><Formel tex="\left(\tfrac{\pi}{2}+k\pi\,\middle|\,0\right)" /></td></tr>
            <tr><th scope="row">Symmetrie</th><td>punktsymmetrisch zum Ursprung, <Formel tex="\sin(-x)=-\sin x" /></td><td>achsensymmetrisch zur y-Achse, <Formel tex="\cos(-x)=\cos x" /></td></tr>
          </tbody>
        </table>

        <h3>Weiterführend mit GeoGebra</h3>
        <p>
          Die folgenden Aktivitäten gehören zum Arbeitsblatt. Sie liegen auf geogebra.org. Erst wenn du einen Link anklickst, wird die Seite von GeoGebra geladen.
        </p>
        <ul className="liste">
          <li>
            <Extern href="https://www.geogebra.org/m/rrgay2th">GeoGebra-Aktivität zur Hinführung: Seitenverhältnisse im rechtwinkligen Dreieck und Einheitskreis</Extern>
          </li>
          <li>
            <Extern href="https://www.geogebra.org/m/gamvkbjd">GeoGebra-Aktivität zum Zeichnen der Sinus- und Kosinuskurve</Extern>
          </li>
        </ul>
      </Abschnitt>
    </>
  );
}
