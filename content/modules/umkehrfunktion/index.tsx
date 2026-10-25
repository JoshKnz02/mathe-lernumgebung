import type { ReactNode } from 'react';
import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage, type Option } from '@/components/Auswahlfrage';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Rechenkette } from '@/components/Rechenkette';
import { A1, A3, A4, A7, A8, A10, FARBE_F, FARBE_GERADE, TEMPERATUR } from './daten';
import { Ablesen, Bild, FunktionsBild, PaarBild, Spiegelpunkte } from './Bilder';
import { Umkehrlabor } from './Umkehrlabor';
import { Umrechner } from './Umrechner';

const opt = (id: string, text: ReactNode, richtig: boolean, rueckmeldung: ReactNode): Option => ({ id, text, richtig, rueckmeldung });
const nan = (bedingung: boolean, wert: number) => (bedingung ? wert : NaN);

function Extern({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children} (öffnet in einem neuen Tab)
    </a>
  );
}

const BILDER = {
  v1: <Bild f="lin" x0={4} beschreibung="Schaubild von f(x) = 0,5 x + 1, die Spiegelachse y gleich x und das Spiegelbild. Der Punkt P(4 | 3) auf K_f wird zum Punkt P Strich (3 | 4) auf dem Spiegelbild." />,
  v2: <Bild f="quad" c={4} beschreibung="Schaubild von f(x) = x² und die waagerechte Gerade y gleich 4. Sie schneidet K_f in zwei Punkten bei x gleich minus 2 und x gleich 2. Das Spiegelbild ist eine nach rechts geöffnete Parabel und kein Schaubild einer Funktion." />,
  v3: <Bild f="exp" beschreibung="Schaubild von f(x) = e hoch x und sein Spiegelbild, der natürliche Logarithmus. K_f liegt oberhalb der x-Achse, das Spiegelbild rechts der y-Achse." />,
  a1: <Bild f="par-rechts" x0={4} beschreibung="Schaubild von f(x) = (x − 2)² − 1 für x größer oder gleich 2 und sein Spiegelbild an der Geraden y gleich x. Der Punkt P(4 | 3) wird zu P Strich (3 | 4). Die Verbindungsstrecke steht senkrecht auf der Spiegelachse." />,
  a2a: <Bild f="quad" c={4} beschreibung="Schaubild von x² auf ganz ℝ mit der Geraden y gleich 4. Sie schneidet zweimal." />,
  a2b: <Bild f="quad-rechts" c={4} beschreibung="Schaubild von x² für x größer oder gleich 0 mit der Geraden y gleich 4. Sie schneidet nur einmal, bei x gleich 2." />,
  a2c: <Bild f="sin" c={0.5} beschreibung="Schaubild des Sinus auf ganz ℝ mit der Geraden y gleich 0,5. Sie schneidet im Ausschnitt viermal." />,
  a2d: <Bild f="sin-eing" c={0.5} beschreibung="Schaubild des Sinus für x zwischen minus π halbe und π halbe mit der Geraden y gleich 0,5. Sie schneidet nur einmal, bei x gleich π sechstel." />,
  a3a: <Bild f="par-rechts" beschreibung="Schaubild von f(x) = (x − 2)² − 1 für x größer oder gleich 2, der rechte Ast, und sein Spiegelbild, der obere Ast einer Wurzelfunktion." />,
  a3b: <Bild f="par-links" beschreibung="Schaubild von f(x) = (x − 2)² − 1 für x kleiner oder gleich 2, der linke Ast, und sein Spiegelbild, der untere Ast einer Wurzelfunktion." />,
  a4: <Bild f="exp-minus" hilfslinien={[{ art: 'y', wert: -1 }, { art: 'x', wert: -1 }]} unter={<>Orange: <Formel tex="K_f" nach="," /> blau: Spiegelbild. Die waagerechte Asymptote <Formel tex="y=-1" /> von <Formel tex="K_f" /> wird zur senkrechten Asymptote <Formel tex="x=-1" /> des Spiegelbilds (beide dünn gestrichelt).</>} beschreibung="Schaubild von f(x) = e hoch x minus 1 mit der waagerechten Asymptote y gleich minus 1 und sein Spiegelbild, der Logarithmus von x plus 1, mit der senkrechten Asymptote x gleich minus 1." />,
  a5a: <Bild f="quad-rechts" x0={2} beschreibung="Schaubild von x² für x größer oder gleich 0 und sein Spiegelbild, die Wurzelfunktion." />,
  a5b: <Bild f="exp" x0={1} beschreibung="Schaubild von e hoch x und sein Spiegelbild, der natürliche Logarithmus." />,
  a5c: <Bild f="sin-eing" x0={1} beschreibung="Schaubild des Sinus für x zwischen minus π halbe und π halbe und sein Spiegelbild, der Arkussinus." />,
} as const;

export default function Modul() {
  return (
    <>
      <Abschnitt id="erklaeren" titel="Erklären">
        <h3>Rückwärts rechnen</h3>
        <p>
          Eine Funktion ordnet jedem <Formel tex="x" /> genau ein <Formel tex="y" /> zu. Oft möchtest du den Weg zurückgehen: Du kennst das Ergebnis und suchst die Eingabe. Beispiel Temperaturskalen: Aus Grad Celsius wird Fahrenheit, indem du mit 1,8 multiplizierst und 32 addierst. Zurück rechnest du dieselben Schritte rückwärts, jeweils mit der Gegenoperation. Verändere die Temperatur und verfolge den Hinweg und den Rückweg.
        </p>
        <Umrechner />
        <p>
          Die Funktion, die den Weg zurück beschreibt, heißt <strong>Umkehrfunktion</strong>.
        </p>

        <h3>Schreibweise</h3>
        <Hinweis art="merksatz" titel="Umkehrfunktion">
          <p>
            Die Umkehrfunktion von <Formel tex="f" /> wird mit <Formel tex={String.raw`f^{-1}`} /> bezeichnet. Sie macht <Formel tex="f" /> rückgängig:
          </p>
          <Formel anzeige tex={String.raw`f^{-1}\bigl(f(x)\bigr)=x\qquad\text{und}\qquad f\bigl(f^{-1}(y)\bigr)=y`} />
          <p>
            Man liest „<Formel tex="f" /> hoch minus eins“. Die Schreibweise <Formel tex={String.raw`f^{-1}`} /> bedeutet <strong>nicht</strong> den Kehrwert <Formel tex="\tfrac{1}{f}" nach="." />
          </p>
        </Hinweis>
        <p>
          Nicht jede Funktion hat eine Umkehrfunktion. Wann das der Fall ist, untersuchst du im Entdecken.
        </p>

        <h3>Den Term der Umkehrfunktion bestimmen</h3>
        <p>
          So gehst du vor, wenn <Formel tex="f" /> eine Umkehrfunktion hat:
        </p>
        <ol className="liste">
          <li>
            Schreibe <Formel tex="y=f(x)" nach="." />
          </li>
          <li>
            Löse die Gleichung nach <Formel tex="x" /> auf.
          </li>
          <li>
            Vertausche <Formel tex="x" /> und <Formel tex="y" nach="." /> Dann steht <Formel tex="y=f^{-1}(x)" nach="." /> Das Vertauschen ist nötig, weil man die Eingabe einer Funktion üblicherweise <Formel tex="x" /> nennt.
          </li>
        </ol>
        <p>
          Beispiel <Formel tex="f(x)=3x-6" nach=":" />
        </p>
        <Formel anzeige tex={String.raw`y=3x-6\;\Rightarrow\;3x=y+6\;\Rightarrow\;x=\tfrac{y+6}{3}\;\Rightarrow\;f^{-1}(x)=\tfrac{x+6}{3}=\tfrac{1}{3}x+2`} />
        <p>
          Das ist dasselbe wie das Rückwärtsrechnen: <Formel tex="f" /> multipliziert mit 3 und subtrahiert 6, <Formel tex={String.raw`f^{-1}`} /> addiert 6 und teilt durch 3, in umgekehrter Reihenfolge.
        </p>
        <Rechenkette
          eingabe={<Formel tex="x=4" />}
          schritte={[
            { name: <>mal 3</>, vorschrift: <Formel tex={String.raw`\cdot 3`} />, ergebnis: <Formel tex="12" /> },
            { name: <>minus 6</>, vorschrift: <Formel tex="-6" />, ergebnis: <Formel tex="f(4)=6" /> },
          ]}
          beschreibung="Die Zahl 4 mal 3 ergibt 12, minus 6 ergibt 6. Das ist f von 4."
        />
        <Rechenkette
          eingabe={<Formel tex="y=6" />}
          schritte={[
            { name: <>plus 6</>, vorschrift: <Formel tex="+6" />, ergebnis: <Formel tex="12" /> },
            { name: <>geteilt durch 3</>, vorschrift: <Formel tex=":3" />, ergebnis: <Formel tex={String.raw`f^{-1}(6)=4`} /> },
          ]}
          beschreibung="Die Zahl 6 plus 6 ergibt 12, geteilt durch 3 ergibt 4. Das ist f hoch minus 1 von 6."
        />
        <p>
          Probe: <Formel tex={String.raw`f^{-1}\bigl(f(4)\bigr)=f^{-1}(6)=4`} nach="." />
        </p>

        <h3>Der natürliche Logarithmus</h3>
        <p>
          Die Funktion <Formel tex="e^x" /> hat eine Umkehrfunktion. Sie bekommt einen eigenen Namen: <strong>natürlicher Logarithmus</strong>, geschrieben <Formel tex={String.raw`\ln x`} nach="." /> Es gilt <Formel tex={String.raw`\ln\bigl(e^x\bigr)=x`} /> und <Formel tex={String.raw`e^{\ln x}=x`} nach="." /> Beispiel: <Formel tex="e^2\approx 7{,}389" nach="," /> also <Formel tex={String.raw`\ln(7{,}389)\approx 2`} nach="." />
        </p>
        <Rechenkette
          eingabe={<Formel tex="x=2" />}
          schritte={[
            { name: <Formel tex="e^x" />, vorschrift: <Formel tex="e^2" />, ergebnis: <Formel tex="7{,}389" /> },
            { name: <Formel tex={String.raw`\ln x`} />, vorschrift: <Formel tex={String.raw`\ln 7{,}389`} />, ergebnis: <Formel tex="2" /> },
          ]}
          beschreibung="Die Zahl 2 wird in e hoch x eingesetzt, das ergibt etwa 7,389. Der natürliche Logarithmus von 7,389 ergibt wieder 2."
        />
      </Abschnitt>

      <Abschnitt id="entdecken" titel="Entdecken">
        <h3>Vermutung</h3>
        <p>Überlege zuerst, bevor du das Labor benutzt. Notiere deine Vermutungen.</p>
        <ol className="auftraege">
          <li>
            <p>
              Der Punkt <Formel tex="P(4\,|\,3)" /> liegt auf dem Schaubild von <Formel tex="f(x)=0{,}5x+1" nach="." /> Welchen Punkt kennst du dann vom Schaubild von <Formel tex={String.raw`f^{-1}`} nach="?" /> Wie könnte man das Schaubild von <Formel tex={String.raw`f^{-1}`} /> aus dem von <Formel tex="f" /> zeichnen?
            </p>
            <Beobachtung bild={BILDER.v1}>
              Aus <Formel tex="f(4)=3" /> folgt <Formel tex={String.raw`f^{-1}(3)=4`} nach="." /> Der Punkt <Formel tex="P'(3\,|\,4)" /> liegt auf dem Schaubild von <Formel tex={String.raw`f^{-1}`} nach="." /> Die Koordinaten sind vertauscht. Das gilt für jeden Punkt, das Schaubild entsteht durch Spiegelung an der Geraden <Formel tex="y=x" nach="." />
            </Beobachtung>
          </li>
          <li>
            <p>
              Für <Formel tex="f(x)=x^2" /> gilt <Formel tex="f(2)=4" /> und <Formel tex="f(-2)=4" nach="." /> Welchen Wert sollte <Formel tex={String.raw`f^{-1}(4)`} /> haben?
            </p>
            <Beobachtung bild={BILDER.v2}>
              Es gäbe zwei Möglichkeiten, <Formel tex="2" /> und <Formel tex="-2" nach="." /> Eine Funktion ordnet aber jeder Zahl genau eine Zahl zu. Deshalb hat <Formel tex="x^2" /> auf ganz <Formel tex="\mathbb{R}" /> keine Umkehrfunktion. Das Spiegelbild ist dort kein Schaubild einer Funktion.
            </Beobachtung>
          </li>
          <li>
            <p>
              Die Funktion <Formel tex="f(x)=e^x" /> nimmt nur Werte oberhalb von 0 an. Welchen Definitionsbereich hat dann ihre Umkehrfunktion?
            </p>
            <Beobachtung bild={BILDER.v3}>
              Die Umkehrfunktion kann nur dort definiert sein, wo <Formel tex="f" /> Werte annimmt. Der Wertebereich <Formel tex="W_f=]0;\,\infty[" /> wird zum Definitionsbereich von <Formel tex={String.raw`f^{-1}`} nach="." /> Das ist der natürliche Logarithmus <Formel tex={String.raw`\ln x`} nach="." />
            </Beobachtung>
          </li>
        </ol>

        <h3>Labor</h3>
        <p>
          Wähle eine Funktion <Formel tex="f" nach="." /> Das Schaubild von <Formel tex="f" /> ist orange, sein Spiegelbild an der Geraden <Formel tex="y=x" /> blau. Mit <Formel tex="x_0" /> verfolgst du einen Punkt <Formel tex="P" /> und seinen Spiegelpunkt <Formel tex="P'" nach="." /> Mit der waagerechten Geraden <Formel tex="y=c" /> prüfst du, wie oft ein Funktionswert vorkommt. Die Tabelle nennt Definitionsbereich, Wertebereich und, falls vorhanden, die Umkehrfunktion.
        </p>
        <Umkehrlabor />

        <h3>Untersuchungsaufträge</h3>
        <p>Beantworte die Fragen zuerst mit dem Labor. Danach kannst du deine Beobachtung vergleichen.</p>
        <ol className="auftraege">
          <li>
            <p>
              <strong>Graphisch zum Schaubild der Umkehrfunktion.</strong> Wähle <Formel tex="f(x)=(x-2)^2-1" /> für <Formel tex="x\ge 2" /> und verändere <Formel tex="x_0" nach="." /> Wie hängen <Formel tex="P" /> und <Formel tex="P'" /> zusammen? Wie liegt die Verbindungsstrecke zur Geraden <Formel tex="y=x" nach="?" /> Wie zeichnest du also das Schaubild von <Formel tex={String.raw`f^{-1}`} nach="?"/>
            </p>
            <Beobachtung bild={BILDER.a1}>
              Die Koordinaten von <Formel tex="P" /> und <Formel tex="P'" /> sind vertauscht: <Formel tex="P(a\,|\,b)" /> wird zu <Formel tex="P'(b\,|\,a)" nach="." /> Die Verbindungsstrecke steht senkrecht auf der Geraden <Formel tex="y=x" /> und wird von ihr halbiert. Das Schaubild von <Formel tex={String.raw`f^{-1}`} /> entsteht also durch <strong>Spiegelung von <Formel tex="K_f" /> an der Geraden <Formel tex="y=x" /></strong> (der ersten Winkelhalbierenden). Hier ist <Formel tex="f(4)=3" /> und <Formel tex={String.raw`f^{-1}(3)=4`} nach="." />
            </Beobachtung>
          </li>
          <li>
            <p>
              <strong>Voraussetzung für die Umkehrfunktion.</strong> Zeige die waagerechte Gerade <Formel tex="y=c" /> und verschiebe sie. Probiere <Formel tex="f(x)=x^2" /> auf <Formel tex="\mathbb{R}" nach="," /> dann <Formel tex="x^2" /> für <Formel tex="x\ge 0" nach="," /> dann <Formel tex={String.raw`\sin x`} /> auf <Formel tex="\mathbb{R}" /> und <Formel tex={String.raw`\sin x`} /> für <Formel tex={String.raw`-\tfrac{\pi}{2}\le x\le\tfrac{\pi}{2}`} nach="." /> Wie oft schneidet die Gerade <Formel tex="K_f" nach="?" /> Lies in der Tabelle ab, ob die Funktion umkehrbar ist. Welcher Zusammenhang besteht?
            </p>
            <Beobachtung
              bild={
                <>
                  <div className="bilder-paar">
                    {BILDER.a2a}
                    {BILDER.a2b}
                  </div>
                  <div className="bilder-paar">
                    {BILDER.a2c}
                    {BILDER.a2d}
                  </div>
                </>
              }
            >
              Eine Funktion ist <strong>umkehrbar</strong>, wenn jeder Funktionswert nur <strong>einmal</strong> angenommen wird. Am Schaubild: Jede waagerechte Gerade schneidet <Formel tex="K_f" /> höchstens einmal. Bei <Formel tex="x^2" /> auf <Formel tex="\mathbb{R}" /> schneidet die Gerade <Formel tex="y=4" /> zweimal, beim Sinus auf <Formel tex="\mathbb{R}" /> schneidet <Formel tex="y=0{,}5" /> mehrfach. Nach der Einschränkung auf <Formel tex="x\ge 0" /> bzw. auf <Formel tex={String.raw`\left[-\tfrac{\pi}{2};\,\tfrac{\pi}{2}\right]`} /> wird jeder Wert nur einmal angenommen. Dort ist die Funktion streng monoton: Sie steigt immer oder fällt immer. Eine streng monotone Funktion ist deshalb umkehrbar.
            </Beobachtung>
          </li>
          <li>
            <p>
              <strong>Einschränken des Definitionsbereichs.</strong> Wähle <Formel tex="f(x)=(x-2)^2-1" /> für <Formel tex="x\ge 2" /> und für <Formel tex="x\le 2" nach="." /> Wie lauten die beiden Umkehrfunktionen? Wo trennen sich die beiden Äste?
            </p>
            <Beobachtung
              bild={
                <div className="bilder-paar">
                  {BILDER.a3a}
                  {BILDER.a3b}
                </div>
              }
            >
              Eine nicht umkehrbare Funktion wird umkehrbar, wenn man den Definitionsbereich auf einen Bereich einschränkt, in dem sie streng monoton ist. Bei der Parabel trennt der Scheitel <Formel tex="S(2\,|\,-1)" /> die beiden Äste. Für den rechten Ast ist <Formel tex={String.raw`f^{-1}(x)=2+\sqrt{x+1}`} nach="," /> für den linken <Formel tex={String.raw`f^{-1}(x)=2-\sqrt{x+1}`} nach="." /> Welche Umkehrfunktion man erhält, hängt von der Wahl des Astes ab.
            </Beobachtung>
          </li>
          <li>
            <p>
              <strong>Definitions- und Wertebereich.</strong> Lies in der Tabelle <Formel tex="D_f" nach="," /> <Formel tex="W_f" nach="," /> <Formel tex={String.raw`D_{f^{-1}}`} /> und <Formel tex={String.raw`W_{f^{-1}}`} /> für mehrere Funktionen ab, auch für <Formel tex="e^x-1" nach="." /> Was fällt auf? Was geschieht mit der waagerechten Asymptote von <Formel tex="e^x-1" nach="?"/>
            </p>
            <Beobachtung bild={BILDER.a4}>
              Definitions- und Wertebereich werden <strong>vertauscht</strong>: <Formel tex={String.raw`D_{f^{-1}}=W_f`} /> und <Formel tex={String.raw`W_{f^{-1}}=D_f`} nach="." /> Bei <Formel tex="f(x)=e^x-1" /> ist <Formel tex="W_f=]-1;\,\infty[" nach="," /> also ist <Formel tex={String.raw`D_{f^{-1}}=]-1;\,\infty[`} /> und <Formel tex={String.raw`f^{-1}(x)=\ln(x+1)`} nach="." /> Die waagerechte Asymptote <Formel tex="y=-1" /> von <Formel tex="K_f" /> wird beim Spiegeln zur senkrechten Asymptote <Formel tex="x=-1" /> der Umkehrfunktion.
            </Beobachtung>
          </li>
          <li>
            <p>
              <strong>Bekannte Funktionen als Umkehrfunktionen.</strong> Welche Funktion ist die Umkehrfunktion von <Formel tex="x^2" /> für <Formel tex="x\ge 0" nach="?" /> Von <Formel tex="e^x" nach="?" /> Von <Formel tex={String.raw`\sin x`} /> für <Formel tex={String.raw`-\tfrac{\pi}{2}\le x\le\tfrac{\pi}{2}`} nach="?" /> Wähle auch <Formel tex={String.raw`\sqrt{x}`} /> und <Formel tex={String.raw`\ln x`} /> als <Formel tex="f" nach="." />
            </p>
            <Beobachtung
              bild={
                <>
                  <div className="bilder-paar">
                    {BILDER.a5a}
                    {BILDER.a5b}
                  </div>
                  {BILDER.a5c}
                </>
              }
            >
              <table className="tabelle tabelle-kompakt">
                <thead>
                  <tr>
                    <th scope="col"><Formel tex="f" /></th>
                    <th scope="col"><Formel tex={String.raw`f^{-1}`} /></th>
                    <th scope="col">Name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><Formel tex="x^2" /> für <Formel tex="x\ge 0" /></td><td><Formel tex={String.raw`\sqrt{x}`} /></td><td>Wurzelfunktion</td></tr>
                  <tr><td><Formel tex="e^x" /></td><td><Formel tex={String.raw`\ln x`} /></td><td>natürlicher Logarithmus</td></tr>
                  <tr><td><Formel tex={String.raw`\sin x`} /> für <Formel tex={String.raw`-\tfrac{\pi}{2}\le x\le\tfrac{\pi}{2}`} /></td><td><Formel tex={String.raw`\sin^{-1}x`} /></td><td>Arkussinus (Taschenrechnertaste <Formel tex={String.raw`\sin^{-1}`} nach=")" /></td></tr>
                </tbody>
              </table>
              Die Umkehrung gilt in beide Richtungen: <Formel tex={String.raw`\sqrt{x}`} /> und <Formel tex="x^2" /> (für <Formel tex="x\ge 0" nach=")" /> sowie <Formel tex={String.raw`\ln x`} /> und <Formel tex="e^x" /> sind Umkehrfunktionen voneinander. Den Arkussinus kennst du aus dem Modul zu den trigonometrischen Gleichungen.
            </Beobachtung>
          </li>
        </ol>

        <h3>Weiterführend mit GeoGebra</h3>
        <p>
          Die folgende Aktivität gehört zum Einstieg in das Thema. Sie liegt auf geogebra.org. Erst wenn du den Link anklickst, wird die Seite von GeoGebra geladen.
        </p>
        <ul className="liste">
          <li>
            <Extern href="https://www.geogebra.org/m/srjsn2n5">GeoGebra-Aktivität: Umkehrfunktion</Extern>
          </li>
        </ul>
      </Abschnitt>

      <Abschnitt id="ueberpruefen" titel="Überprüfen">
        <p>
          Gib Zahlen als Dezimalzahl (<code>0,87</code>) oder als Bruch (<code>1/4</code>) ein. Bei den Auswahlfragen wird deine Antwort erklärt, nicht nur bewertet.
        </p>

        <Aufgabe
          nummer={1}
          titel="Umkehrfunktion bestimmen und auswerten"
          felder={[
            { id: 'a', beschriftung: <Formel tex={String.raw`f^{-1}(10)`} />, name: 'f hoch minus 1 von 10', erwartet: A1.von10 },
            { id: 'b', beschriftung: <Formel tex={String.raw`f^{-1}(-2)`} />, name: 'f hoch minus 1 von minus 2', erwartet: A1.vonMinus2 },
            { id: 'c', beschriftung: <Formel tex={String.raw`f^{-1}(0)`} />, name: 'f hoch minus 1 von 0', erwartet: A1.von0 },
          ]}
          hilfen={[
            <>
              Löse <Formel tex="y=4x-2" /> nach <Formel tex="x" /> auf und vertausche dann <Formel tex="x" /> und <Formel tex="y" nach="." />
            </>,
            <>
              <Formel tex="x=\tfrac{y+2}{4}" nach="," /> also <Formel tex={String.raw`f^{-1}(x)=\tfrac{x+2}{4}`} nach="." />
            </>,
          ]}
          loesung={[
            <>
              <Formel tex="y=4x-2\;\Rightarrow\;4x=y+2\;\Rightarrow\;x=\tfrac{y+2}{4}" nach="." />
            </>,
            <>
              Vertauschen: <Formel tex={String.raw`f^{-1}(x)=\tfrac{x+2}{4}`} nach="." /> Damit <Formel tex={String.raw`f^{-1}(10)=3`} nach="," /> <Formel tex={String.raw`f^{-1}(-2)=0`} nach="," /> <Formel tex={String.raw`f^{-1}(0)=\tfrac{1}{2}`} nach="." />
            </>,
            <>
              Probe: <Formel tex="f(3)=10" nach="," /> <Formel tex="f(0)=-2" nach="," /> <Formel tex={String.raw`f\bigl(\tfrac{1}{2}\bigr)=0`} nach="." /> Das Schaubild von <Formel tex={String.raw`f^{-1}`} /> liegt spiegelbildlich zu dem von <Formel tex="f" nach="." />
              <PaarBild f={A1.f} finv={A1.finv} bereich={[-4, 6, -4, 6]} teilung={2} beschreibung="Die Gerade K_f von f(x) = 4x − 2, ihr Spiegelbild K_f hoch minus 1 von f hoch minus 1 (x) = (x + 2) / 4 und die Spiegelachse y gleich x. Die Punkte (3 | 10) und (10 | 3) liegen spiegelbildlich." />
            </>,
          ]}
        >
          <p>
            Gegeben ist <Formel tex="f(x)=4x-2" nach="." /> Bestimme die Umkehrfunktion und berechne <Formel tex={String.raw`f^{-1}(10)`} nach="," /> <Formel tex={String.raw`f^{-1}(-2)`} /> und <Formel tex={String.raw`f^{-1}(0)`} nach="." />
          </p>
        </Aufgabe>

        <Auswahlfrage
          nummer="2"
          titel="Umkehrbar auf welchem Bereich?"
          optionen={[
            opt('a', <>auf ganz <Formel tex="\mathbb{R}" /></>, false, <>Auf ganz <Formel tex="\mathbb{R}" /> nimmt <Formel tex="f" /> viele Werte zweimal an, zum Beispiel <Formel tex="f(0)=f(2)=3" nach="." /></>),
            opt('b', <>auf <Formel tex="[0;\,3]" /></>, false, <>In <Formel tex="[0;\,3]" /> liegt der Scheitel <Formel tex="S(1\,|\,2)" nach="." /> Links davon fällt <Formel tex="f" nach="," /> rechts davon steigt <Formel tex="f" nach="," /> also kommen Werte doppelt vor, zum Beispiel <Formel tex="f(0)=f(2)" nach="." /></>),
            opt('c', <>auf <Formel tex="[1;\,\infty[" /></>, true, <>Richtig.</>),
            opt('d', <>auf <Formel tex="]-\infty;\,2]" /></>, false, <>Auch hier liegt der Scheitel bei <Formel tex="x=1" /> im Bereich. Links von 1 fällt <Formel tex="f" nach="," /> rechts steigt <Formel tex="f" nach="." /></>),
          ]}
          erklaerung={
            <>
              Der Scheitel liegt bei <Formel tex="S(1\,|\,2)" nach="." /> Rechts davon (<Formel tex="x\ge 1" nach=")" /> steigt <Formel tex="f" /> streng monoton, jeder Wert kommt nur einmal vor. Die Gerade <Formel tex="y=3" /> schneidet <Formel tex="K_f" /> auf ganz <Formel tex="\mathbb{R}" /> zweimal, bei <Formel tex="x=0" /> und <Formel tex="x=2" nach="," /> auf <Formel tex="[1;\,\infty[" /> nur bei <Formel tex="x=2" nach="." />
              <FunktionsBild
                kurven={[
                  { f: (x) => (x - 1) ** 2 + 2, farbe: FARBE_F },
                  { f: () => 3, farbe: FARBE_GERADE, gestrichelt: true },
                ]}
                bereich={[-3, 5, -1, 9]}
                teilung={1}
                beschreibung="Schaubild von f(x) = (x − 1)² + 2, eine Parabel mit Scheitel (1 | 2), und die waagerechte Gerade y gleich 3. Sie schneidet die Parabel bei x gleich 0 und bei x gleich 2."
                unter={<>Orange: <Formel tex="K_f" nach="," /> schwarz gestrichelt: <Formel tex="y=3" nach="." /> Zwei Schnittpunkte auf ganz <Formel tex="\mathbb{R}" nach="," /> einer rechts vom Scheitel.</>}
              />
            </>
          }
        >
          <p>
            Auf welchem Bereich ist <Formel tex="f(x)=(x-1)^2+2" /> umkehrbar?
          </p>
        </Auswahlfrage>

        <Aufgabe
          nummer={3}
          titel="Umkehrfunktion bei eingeschränktem Definitionsbereich"
          felder={[
            { id: 'a', beschriftung: <Formel tex={String.raw`f^{-1}(0)`} />, name: 'f hoch minus 1 von 0', erwartet: A3.von0 },
            { id: 'b', beschriftung: <Formel tex={String.raw`f^{-1}(5)`} />, name: 'f hoch minus 1 von 5', erwartet: A3.von5 },
            { id: 'c', beschriftung: <>kleinste Zahl in <Formel tex={String.raw`D_{f^{-1}}`} /></>, name: 'kleinste Zahl im Definitionsbereich der Umkehrfunktion', erwartet: A3.kleinster },
          ]}
          hilfen={[
            <>
              Löse <Formel tex="y=(x+1)^2-4" /> nach <Formel tex="x" /> auf. Wegen <Formel tex="x\ge -1" /> ist <Formel tex="x+1\ge 0" nach="," /> du brauchst also die positive Wurzel.
            </>,
            <>
              Der Definitionsbereich von <Formel tex={String.raw`f^{-1}`} /> ist der Wertebereich von <Formel tex="f" nach="." /> Der Scheitel von <Formel tex="K_f" /> liegt bei <Formel tex="S(-1\,|\,-4)" nach="." />
            </>,
          ]}
          loesung={[
            <>
              <Formel tex="y=(x+1)^2-4\;\Rightarrow\;y+4=(x+1)^2" nach="." /> Wegen <Formel tex="x+1\ge 0" /> gilt <Formel tex={String.raw`x+1=\sqrt{y+4}`} nach="," /> also <Formel tex={String.raw`x=-1+\sqrt{y+4}`} nach="."/>
            </>,
            <>
              Vertauschen: <Formel tex={String.raw`f^{-1}(x)=-1+\sqrt{x+4}`} nach="." /> Damit <Formel tex={String.raw`f^{-1}(0)=-1+2=1`} /> und <Formel tex={String.raw`f^{-1}(5)=-1+3=2`} nach="." />
            </>,
            <>
              Der Wertebereich von <Formel tex="f" /> ist <Formel tex="[-4;\,\infty[" nach="," /> also ist <Formel tex={String.raw`D_{f^{-1}}=[-4;\,\infty[`} nach="." /> Die kleinste Zahl ist <Formel tex="-4" nach="." />
              <PaarBild
                f={(x) => nan(x >= -1, A3.f(x))}
                finv={(x) => nan(x >= -4, A3.finv(x))}
                bereich={[-6, 6, -6, 6]}
                teilung={2}
                beschreibung="Schaubild von f(x) = (x + 1)² − 4 für x größer oder gleich minus 1, ein Parabelast mit Scheitel (−1 | −4), sein Spiegelbild, die Wurzelfunktion minus 1 plus Wurzel aus x plus 4 ab x gleich minus 4, und die Spiegelachse y gleich x."
              />
            </>,
          ]}
        >
          <p>
            Gegeben ist <Formel tex="f(x)=(x+1)^2-4" /> mit dem Definitionsbereich <Formel tex="D_f=[-1;\,\infty[" nach="." /> Bestimme die Umkehrfunktion. Berechne <Formel tex={String.raw`f^{-1}(0)`} /> und <Formel tex={String.raw`f^{-1}(5)`} nach="," /> und gib die kleinste Zahl im Definitionsbereich von <Formel tex={String.raw`f^{-1}`} /> an.
          </p>
        </Aufgabe>

        <Aufgabe
          nummer={4}
          titel="Umkehrfunktion mit natürlichem Logarithmus"
          felder={[
            { id: 'g', beschriftung: <>untere Grenze von <Formel tex={String.raw`D_{f^{-1}}`} /></>, name: 'untere Grenze des Definitionsbereichs der Umkehrfunktion', erwartet: A4.grenze },
            { id: 'a', beschriftung: <Formel tex={String.raw`f^{-1}(4)`} />, name: 'f hoch minus 1 von 4', erwartet: A4.von4 },
            { id: 'b', beschriftung: <><Formel tex={String.raw`f^{-1}(13)`} /> (auf zwei Stellen gerundet)</>, name: 'f hoch minus 1 von 13', erwartet: A4.von13, toleranz: 0.01 },
          ]}
          hilfen={[
            <>
              Löse <Formel tex="y=e^x+3" /> nach <Formel tex="x" /> auf: erst 3 abziehen, dann den natürlichen Logarithmus anwenden.
            </>,
            <>
              Der Wertebereich von <Formel tex="f" /> ist <Formel tex="]3;\,\infty[" nach="," /> denn <Formel tex="e^x>0" nach="." /> Er ist der Definitionsbereich von <Formel tex={String.raw`f^{-1}`} nach="." />
            </>,
          ]}
          loesung={[
            <>
              <Formel tex="y=e^x+3\;\Rightarrow\;y-3=e^x\;\Rightarrow\;x=\ln(y-3)" nach="." /> Vertauschen: <Formel tex={String.raw`f^{-1}(x)=\ln(x-3)`} nach="." />
            </>,
            <>
              Es ist <Formel tex="e^x>0" nach="," /> also <Formel tex="W_f=]3;\,\infty[" nach="." /> Daher gilt <Formel tex={String.raw`D_{f^{-1}}=]3;\,\infty[`} nach="." /> Die Grenze 3 gehört nicht dazu. Die Funktion <Formel tex="f" /> hat die waagerechte Asymptote <Formel tex="y=3" nach="," /> die Umkehrfunktion die senkrechte Asymptote <Formel tex="x=3" nach="."/>
            </>,
            <>
              <Formel tex={String.raw`f^{-1}(4)=\ln 1=0`} nach="," /> <Formel tex={String.raw`f^{-1}(13)=\ln 10\approx 2{,}30`} nach="." />
              <PaarBild
                f={A4.f}
                finv={(x) => nan(x > 3, A4.finv(x))}
                bereich={[-3, 9, -3, 9]}
                teilung={2}
                beschreibung="Schaubild von f(x) = e hoch x plus 3 mit der waagerechten Asymptote y gleich 3, sein Spiegelbild, der Logarithmus von x minus 3 mit der senkrechten Asymptote x gleich 3, und die Spiegelachse y gleich x."
              />
            </>,
          ]}
        >
          <p>
            Gegeben ist <Formel tex="f(x)=e^x+3" nach="." /> Bestimme die Umkehrfunktion und ihren Definitionsbereich. Gib die untere Grenze des Definitionsbereichs an und berechne <Formel tex={String.raw`f^{-1}(4)`} /> und <Formel tex={String.raw`f^{-1}(13)`} nach="." />
          </p>
        </Aufgabe>

        <Auswahlfrage
          nummer="5"
          titel="Definitionsbereich der Umkehrfunktion"
          optionen={[
            opt('a', <Formel tex="[0;\,\infty[" />, false, <>Das ist der Definitionsbereich von <Formel tex="f" nach="." /> Für <Formel tex={String.raw`f^{-1}`} /> kommt es auf den Wertebereich von <Formel tex="f" /> an.</>),
            opt('b', <Formel tex="[1;\,\infty[" />, true, <>Richtig.</>),
            opt('c', <Formel tex="\mathbb{R}" />, false, <>Die Funktion <Formel tex={String.raw`f(x)=\sqrt{x}+1`} /> nimmt nur Werte ab 1 an. Für kleinere Zahlen kann <Formel tex={String.raw`f^{-1}`} /> nicht definiert sein.</>),
            opt('d', <Formel tex="]-\infty;\,1]" />, false, <>Das sind die falschen Zahlen. <Formel tex="f" /> nimmt Werte oberhalb von 1 an, nicht unterhalb.</>),
          ]}
          erklaerung={
            <>
              Es ist <Formel tex={String.raw`\sqrt{x}\ge 0`} nach="," /> also <Formel tex={String.raw`f(x)\ge 1`} nach="." /> Der Wertebereich ist <Formel tex="W_f=[1;\,\infty[" nach="," /> er wird zum Definitionsbereich von <Formel tex={String.raw`f^{-1}`} nach="." /> Die Umkehrfunktion ist <Formel tex={String.raw`f^{-1}(x)=(x-1)^2`} /> für <Formel tex="x\ge 1" nach="."/>
              <PaarBild
                f={(x) => nan(x >= 0, Math.sqrt(x) + 1)}
                finv={(x) => nan(x >= 1, (x - 1) ** 2)}
                bereich={[-1, 7, -1, 7]}
                teilung={1}
                beschreibung="Schaubild von f(x) = Wurzel aus x plus 1, das bei (0 | 1) beginnt, sein Spiegelbild, die Parabel (x − 1)² ab x gleich 1, und die Spiegelachse y gleich x. Der Definitionsbereich der Umkehrfunktion beginnt bei 1."
              />
            </>
          }
        >
          <p>
            Wie lautet der Definitionsbereich der Umkehrfunktion von <Formel tex={String.raw`f(x)=\sqrt{x}+1`} nach="?" />
          </p>
        </Auswahlfrage>

        <Auswahlfrage
          nummer="6"
          titel="Aussagen über Funktion und Umkehrfunktion"
          optionen={[
            opt('a', <><Formel tex={String.raw`D_{f^{-1}}=W_f`} /> und <Formel tex={String.raw`W_{f^{-1}}=D_f`} /></>, true, <>Richtig.</>),
            opt('b', <><Formel tex={String.raw`f^{-1}(x)`} /> ist dasselbe wie <Formel tex="\tfrac{1}{f(x)}" /></>, false, <>Die Schreibweise <Formel tex={String.raw`f^{-1}`} /> bezeichnet die Umkehrfunktion, nicht den Kehrwert. Beispiel <Formel tex="f(x)=2x" nach=":" /> <Formel tex={String.raw`f^{-1}(x)=\tfrac{x}{2}`} nach="," /> aber <Formel tex="\tfrac{1}{f(x)}=\tfrac{1}{2x}" nach="." /></>),
            opt('c', <>Das Schaubild von <Formel tex={String.raw`f^{-1}`} /> entsteht durch Spiegelung von <Formel tex="K_f" /> an der x-Achse.</>, false, <>Bei einer Spiegelung an der x-Achse wechselt nur das Vorzeichen von <Formel tex="y" nach="." /> Bei der Umkehrfunktion werden <Formel tex="x" /> und <Formel tex="y" /> vertauscht, das ist die Spiegelung an <Formel tex="y=x" nach="." /></>),
            opt('d', <>Jede Funktion hat eine Umkehrfunktion.</>, false, <>Nur Funktionen, die jeden Wert einmal annehmen. Die Funktion <Formel tex="x^2" /> auf <Formel tex="\mathbb{R}" /> hat keine.</>),
          ]}
          erklaerung={
            <>
              Die Umkehrfunktion macht <Formel tex="f" /> rückgängig: Was <Formel tex="f" /> als Ergebnis liefern kann (<Formel tex="W_f" nach=")," /> ist das, was <Formel tex={String.raw`f^{-1}`} /> als Eingabe annehmen kann. Beim Spiegeln an <Formel tex="y=x" /> werden die Achsen vertauscht und mit ihnen die Bereiche.
              <Bild f="par-rechts" x0={3} unter={<>Hier ist <Formel tex="D_f=[2;\,\infty[" nach="," /> <Formel tex="W_f=[-1;\,\infty[" nach="." /> Beim Spiegelbild liegt <Formel tex="[-1;\,\infty[" /> auf der x-Achse und <Formel tex="[2;\,\infty[" /> auf der y-Achse.</>} beschreibung="Schaubild von f(x) = (x − 2)² − 1 für x größer oder gleich 2 und sein Spiegelbild. Der Definitionsbereich von f beginnt bei 2 auf der x-Achse, der Wertebereich bei minus 1 auf der y-Achse. Beim Spiegelbild ist es umgekehrt." />
            </>
          }
        >
          <p>
            Welche Aussage über eine umkehrbare Funktion <Formel tex="f" /> und ihre Umkehrfunktion stimmt?
          </p>
        </Auswahlfrage>

        <Aufgabe
          nummer={7}
          titel="Temperaturen umrechnen"
          felder={[
            { id: 'a', beschriftung: <>Celsius bei 50 °F</>, name: 'Grad Celsius bei 50 Grad Fahrenheit', erwartet: A7.c50 },
            { id: 'b', beschriftung: <>Celsius bei 95 °F</>, name: 'Grad Celsius bei 95 Grad Fahrenheit', erwartet: A7.c95 },
            { id: 'c', beschriftung: <>Temperatur mit gleicher Zahl in beiden Skalen</>, name: 'Temperatur mit gleicher Zahl in Celsius und Fahrenheit', erwartet: A7.gleich },
          ]}
          hilfen={[
            <>
              Es gilt <Formel tex="F=1{,}8\,C+32" nach="." /> Rechne rückwärts: erst 32 abziehen, dann durch 1,8 teilen.
            </>,
            <>
              Für die gleiche Zahl muss <Formel tex="F=C" /> gelten, also <Formel tex="C=1{,}8\,C+32" nach="." /> Das ist der Schnittpunkt von <Formel tex="K_f" /> mit der Geraden <Formel tex="y=x" nach="." />
            </>,
          ]}
          loesung={[
            <>
              Umkehrfunktion: <Formel tex="F=1{,}8\,C+32\;\Rightarrow\;C=\tfrac{F-32}{1{,}8}" nach="." />
            </>,
            <>
              <Formel tex="C(50)=\tfrac{18}{1{,}8}=10" /> und <Formel tex="C(95)=\tfrac{63}{1{,}8}=35" nach="." />
            </>,
            <>
              Gleiche Zahl: <Formel tex="C=1{,}8\,C+32\;\Rightarrow\;-0{,}8\,C=32\;\Rightarrow\;C=-40" nach="." /> Bei <Formel tex={String.raw`-40\,^\circ\text{C}`} /> sind es auch <Formel tex={String.raw`-40\,^\circ\text{F}`} nach="." /> Dort schneiden sich <Formel tex="K_f" /> und <Formel tex={String.raw`K_{f^{-1}}`} /> auf der Spiegelachse.
              <PaarBild
                f={TEMPERATUR.F}
                finv={TEMPERATUR.C}
                bereich={[-60, 100, -60, 100]}
                teilung={20}
                beschreibung="Schaubild der Umrechnung von Celsius in Fahrenheit, F gleich 1,8 C plus 32, das Schaubild der Umrechnung zurück und die Spiegelachse y gleich x. Alle drei Geraden schneiden sich im Punkt (−40 | −40)."
                unter={<>Orange: Celsius nach Fahrenheit, blau: Fahrenheit nach Celsius, hellgrau gestrichelt: <Formel tex="y=x" nach="." /> Alle drei Geraden schneiden sich bei <Formel tex="-40" nach="." /></>}
              />
            </>,
          ]}
        >
          <p>
            Die Umrechnung von Grad Celsius in Grad Fahrenheit lautet <Formel tex="F(C)=1{,}8\,C+32" nach="." /> Bestimme die Temperatur in Grad Celsius, die zu 50 °F und zu 95 °F gehört. Bei welcher Temperatur zeigen beide Skalen dieselbe Zahl?
          </p>
        </Aufgabe>

        <Aufgabe
          nummer={8}
          titel="Bremsweg und Geschwindigkeit"
          felder={[
            { id: 'a', beschriftung: <>Geschwindigkeit bei 20 m (km/h)</>, name: 'Geschwindigkeit bei 20 Metern Bremsweg', erwartet: A8.von20, toleranz: 0.01 },
            { id: 'b', beschriftung: <>Geschwindigkeit bei 45 m (km/h)</>, name: 'Geschwindigkeit bei 45 Metern Bremsweg', erwartet: A8.von45, toleranz: 0.01 },
            { id: 'c', beschriftung: <>Geschwindigkeit bei 100 m (km/h)</>, name: 'Geschwindigkeit bei 100 Metern Bremsweg', erwartet: A8.von100, toleranz: 0.01 },
          ]}
          hilfen={[
            <>
              Löse <Formel tex="s=0{,}01\,v^2" /> nach <Formel tex="v" /> auf. Beachte <Formel tex="v\ge 0" nach="." />
            </>,
            <>
              <Formel tex="v^2=100\,s" nach="," /> also <Formel tex={String.raw`v=\sqrt{100\,s}=10\sqrt{s}`} nach="." />
            </>,
          ]}
          loesung={[
            <>
              Der Bremsweg ist <Formel tex="s(v)=0{,}01\,v^2" /> für <Formel tex="v\ge 0" nach="." /> Auf diesem Bereich steigt <Formel tex="s" /> streng monoton, also ist <Formel tex="s" /> umkehrbar. <Formel tex="s=0{,}01\,v^2\;\Rightarrow\;v^2=100\,s\;\Rightarrow\;v=10\sqrt{s}" nach="." />
            </>,
            <>
              <Formel tex={String.raw`v(20)=10\sqrt{20}\approx 44{,}72`} nach="," /> <Formel tex={String.raw`v(45)=10\sqrt{45}\approx 67{,}08`} nach="," /> <Formel tex={String.raw`v(100)=10\cdot 10=100`} nach="." />
            </>,
            <>
              Am Schaubild: Von 45 m geht man waagerecht zur Kurve und dann senkrecht zur Geschwindigkeitsachse.
              <Ablesen
                f={A8.s}
                y0={45}
                x0={A8.von45}
                bereich={[-10, 110, -10, 110]}
                teilung={20}
                beschreibung="Schaubild des Bremswegs s in Metern über der Geschwindigkeit v in Kilometern pro Stunde, s gleich 0,01 v². Von s gleich 45 geht es waagerecht zur Kurve und senkrecht zur Achse bei v gleich 67,08."
                unter={<>Orange: <Formel tex="s(v)" nach="." /> Schwarz gestrichelt: von 45 m waagerecht zur Kurve, blau gestrichelt: senkrecht zu <Formel tex="v\approx 67{,}08" nach="." /></>}
              />
            </>,
          ]}
        >
          <p>
            Als Faustregel gilt für den Bremsweg <Formel tex="s(v)=0{,}01\,v^2" /> (<Formel tex="v" /> in km/h, <Formel tex="s" /> in m, <Formel tex="v\ge 0" nach=")." /> Aus einer Bremsspur soll auf die Geschwindigkeit geschlossen werden. Bestimme die Umkehrfunktion und berechne die Geschwindigkeit bei einem Bremsweg von 20 m, 45 m und 100 m. Runde auf zwei Stellen.
          </p>
        </Aufgabe>

        <Auswahlfrage
          nummer="9"
          titel="Ist die Funktion umkehrbar?"
          optionen={[
            opt('a', <>Ja, weil sie eine Polynomfunktion ist.</>, false, <>Auch Polynomfunktionen können Werte mehrfach annehmen, zum Beispiel <Formel tex="x^2" nach="." /></>),
            opt('b', <>Ja, weil sie punktsymmetrisch zum Ursprung ist.</>, false, <>Die Symmetrie entscheidet nicht. Auch <Formel tex={String.raw`\sin x`} /> ist punktsymmetrisch und auf <Formel tex="\mathbb{R}" /> nicht umkehrbar.</>),
            opt('c', <>Ja, weil sie streng monoton wächst.</>, false, <>Sie wächst nicht überall. Bei <Formel tex="x=-1" /> hat <Formel tex="f" /> einen Hochpunkt, bei <Formel tex="x=1" /> einen Tiefpunkt.</>),
            opt('d', <>Nein, weil zum Beispiel <Formel tex="f(0)=0" /> und <Formel tex={String.raw`f(\sqrt{3})=0`} /> ist, ein Funktionswert also mehrfach vorkommt.</>, true, <>Richtig.</>),
          ]}
          erklaerung={
            <>
              <Formel tex="f(x)=x(x^2-3)" /> hat die Nullstellen <Formel tex={String.raw`-\sqrt{3}`} nach="," /> <Formel tex="0" /> und <Formel tex={String.raw`\sqrt{3}`} nach="." /> Der Wert 0 wird dreimal angenommen. Eine waagerechte Gerade schneidet <Formel tex="K_f" /> dreimal, deshalb ist <Formel tex="f" /> auf <Formel tex="\mathbb{R}" /> nicht umkehrbar. Auf den Bereichen <Formel tex="]-\infty;\,-1]" nach="," /> <Formel tex="[-1;\,1]" /> und <Formel tex="[1;\,\infty[" /> ist <Formel tex="f" /> jeweils streng monoton und dort umkehrbar.
              <FunktionsBild
                kurven={[
                  { f: (x) => x ** 3 - 3 * x, farbe: FARBE_F },
                  { f: () => 1, farbe: FARBE_GERADE, gestrichelt: true },
                ]}
                bereich={[-3, 3, -4, 4]}
                teilung={1}
                beschreibung="Schaubild von f(x) = x³ − 3x mit Hochpunkt bei x gleich minus 1 und Tiefpunkt bei x gleich 1. Die waagerechte Gerade y gleich 1 schneidet das Schaubild dreimal."
                unter={<>Orange: <Formel tex="K_f" nach="," /> schwarz gestrichelt: <Formel tex="y=1" nach="." /> Drei Schnittpunkte.</>}
              />
            </>
          }
        >
          <p>
            Hat <Formel tex="f(x)=x^3-3x" /> auf ganz <Formel tex="\mathbb{R}" /> eine Umkehrfunktion?
          </p>
        </Auswahlfrage>

        <Aufgabe
          nummer={10}
          titel="Spiegelpunkt bestimmen"
          felder={[
            { id: 'x', beschriftung: <>x-Koordinate von <Formel tex="P'" /></>, name: 'x-Koordinate des Spiegelpunkts', erwartet: A10.y },
            { id: 'y', beschriftung: <>y-Koordinate von <Formel tex="P'" /></>, name: 'y-Koordinate des Spiegelpunkts', erwartet: A10.x },
          ]}
          hilfen={[<>Spiegeln an <Formel tex="y=x" /> vertauscht die Koordinaten.</>, <>Aus <Formel tex="f(2)=7" /> folgt <Formel tex={String.raw`f^{-1}(7)=2`} nach="." /></>]}
          loesung={[
            <>
              Aus <Formel tex="f(2)=7" /> folgt <Formel tex={String.raw`f^{-1}(7)=2`} nach="." />
            </>,
            <>
              Der Punkt <Formel tex="P'(7\,|\,2)" /> liegt auf dem Schaubild von <Formel tex={String.raw`f^{-1}`} nach="." />
              <Spiegelpunkte x={A10.x} y={A10.y} bereich={[-1, 9, -1, 9]} teilung={1} beschreibung="Der Punkt P(2 | 7), sein Spiegelpunkt P Strich (7 | 2) und die Spiegelachse y gleich x. Die Verbindungsstrecke steht senkrecht auf der Spiegelachse." unter={<>Orange: <Formel tex="P(2\,|\,7)" nach="," /> blau: <Formel tex="P'(7\,|\,2)" nach="," /> hellgrau gestrichelt: <Formel tex="y=x" nach="." /></>} />
            </>,
          ]}
        >
          <p>
            Der Punkt <Formel tex="P(2\,|\,7)" /> liegt auf dem Schaubild einer umkehrbaren Funktion <Formel tex="f" nach="." /> Gib die Koordinaten eines Punktes <Formel tex="P'" /> auf dem Schaubild von <Formel tex={String.raw`f^{-1}`} /> an.
          </p>
        </Aufgabe>
      </Abschnitt>

      <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
        <h3>Umkehrfunktion im Überblick</h3>
        <Hinweis art="merksatz" titel="Umkehrfunktion">
          <ul className="liste">
            <li>
              <strong>Voraussetzung:</strong> <Formel tex="f" /> ist umkehrbar, wenn jeder Funktionswert nur einmal angenommen wird. Am Schaubild: Jede waagerechte Gerade schneidet <Formel tex="K_f" /> höchstens einmal. Eine streng monotone Funktion ist umkehrbar.
            </li>
            <li>
              <strong>Einschränken:</strong> Eine nicht umkehrbare Funktion wird umkehrbar, wenn man den Definitionsbereich auf einen Bereich einschränkt, in dem sie streng monoton ist (zum Beispiel einen Parabelast). Die Wahl des Bereichs bestimmt die Umkehrfunktion.
            </li>
            <li>
              <strong>Graphisch:</strong> <Formel tex="K_{f^{-1}}" /> entsteht durch Spiegelung von <Formel tex="K_f" /> an der Geraden <Formel tex="y=x" nach="." /> Aus <Formel tex="P(a\,|\,b)" /> wird <Formel tex="P'(b\,|\,a)" nach="." /> Eine waagerechte Asymptote wird zur senkrechten.
            </li>
            <li>
              <strong>Rechnerisch:</strong> <Formel tex="y=f(x)" /> nach <Formel tex="x" /> auflösen, dann <Formel tex="x" /> und <Formel tex="y" /> vertauschen.
            </li>
            <li>
              <strong>Bereiche:</strong> <Formel tex={String.raw`D_{f^{-1}}=W_f`} /> und <Formel tex={String.raw`W_{f^{-1}}=D_f`} nach="." />
            </li>
            <li>
              <strong>Schreibweise:</strong> <Formel tex={String.raw`f^{-1}\bigl(f(x)\bigr)=x`} nach="." /> <Formel tex={String.raw`f^{-1}`} /> ist nicht <Formel tex="\tfrac{1}{f}" nach="." />
            </li>
          </ul>
        </Hinweis>
        <Bild f="par-rechts" x0={4} unter={<>Beispiel <Formel tex="f(x)=(x-2)^2-1" /> für <Formel tex="x\ge 2" nach=":" /> Spiegelung an <Formel tex="y=x" nach="," /> <Formel tex="P(4\,|\,3)" /> wird zu <Formel tex="P'(3\,|\,4)" nach="." /> Orange: <Formel tex="K_f" nach="," /> blau: <Formel tex={String.raw`K_{f^{-1}}`} nach="." /></>} beschreibung="Schaubild von f(x) = (x − 2)² − 1 für x größer oder gleich 2 und sein Spiegelbild an der Geraden y gleich x. P(4 | 3) wird zu P Strich (3 | 4)." />

        <h3>Wichtige Paare von Funktion und Umkehrfunktion</h3>
        <table className="tabelle">
          <caption>Bekannte Umkehrfunktionen</caption>
          <thead>
            <tr>
              <th scope="col"><Formel tex="f" /></th>
              <th scope="col"><Formel tex="D_f" /></th>
              <th scope="col"><Formel tex="W_f" /></th>
              <th scope="col"><Formel tex={String.raw`f^{-1}`} /></th>
              <th scope="col"><Formel tex={String.raw`D_{f^{-1}}`} /></th>
            </tr>
          </thead>
          <tbody>
            <tr><td><Formel tex="x^2" /></td><td><Formel tex="[0;\,\infty[" /></td><td><Formel tex="[0;\,\infty[" /></td><td><Formel tex={String.raw`\sqrt{x}`} /> (Wurzelfunktion)</td><td><Formel tex="[0;\,\infty[" /></td></tr>
            <tr><td><Formel tex="e^x" /></td><td><Formel tex="\mathbb{R}" /></td><td><Formel tex="]0;\,\infty[" /></td><td><Formel tex={String.raw`\ln x`} /> (natürlicher Logarithmus)</td><td><Formel tex="]0;\,\infty[" /></td></tr>
            <tr><td><Formel tex={String.raw`\sin x`} /></td><td><Formel tex={String.raw`\left[-\tfrac{\pi}{2};\,\tfrac{\pi}{2}\right]`} /></td><td><Formel tex="[-1;\,1]" /></td><td><Formel tex={String.raw`\sin^{-1}x`} /> (Arkussinus)</td><td><Formel tex="[-1;\,1]" /></td></tr>
          </tbody>
        </table>
        <p>
          Die Paare gelten in beide Richtungen: <Formel tex={String.raw`\ln x`} /> ist die Umkehrfunktion von <Formel tex="e^x" nach="," /> und <Formel tex="e^x" /> die von <Formel tex={String.raw`\ln x`} nach="." /> Typische Anwendungen sind Umrechnungen wie Celsius und Fahrenheit oder der Rückschluss von einer Bremsspur auf die Geschwindigkeit.
        </p>
      </Abschnitt>
    </>
  );
}
