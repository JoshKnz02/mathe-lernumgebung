import { useState, type ReactNode } from 'react';
import { Abschnitt } from '@/components/Abschnitt';
import { AufKlick } from '@/components/AufKlick';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage, type Option } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Funktionsgraph } from '@/components/Funktionsgraph';
import { Hinweis } from '@/components/Hinweis';
import { A1, A3, A5, FARBE_F, FARBE_G, FARBE_H } from './daten';
import { Bild } from './Bild';
import { Ordinatenbild } from './Ordinatenbild';
import { Verknuepfungslabor } from './Verknuepfungslabor';

const opt = (id: string, text: ReactNode, richtig: boolean, rueckmeldung: ReactNode): Option => ({ id, text, richtig, rueckmeldung });

/** Klappbare Beobachtung. Das Schaubild wird erst beim Aufklappen erzeugt, weil ein verstecktes Schaubild keine Größe hat. */
function Beobachtung({ children, bild }: { children: ReactNode; bild?: ReactNode }) {
  const [offen, setOffen] = useState(false);
  return (
    <details className="beobachtung" onToggle={(e) => setOffen(e.currentTarget.open)}>
      <summary>Beobachtung vergleichen</summary>
      <div>
        {children}
        {offen && bild}
      </div>
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


const BILDER = {
  v1: <Bild f="quad" g="exp3" art="summe" bereich={[-4, 4, -2, 10]} teilung={2} beschreibung="Schaubilder von x², 3 hoch x und der Summe. Die Summe liegt über beiden Schaubildern und schneidet die x-Achse nie." />,
  v2: <Bild f="lin" g="exp3" art="produkt" bereich={[-5, 2, -2, 8]} teilung={1} beschreibung="Schaubilder von 0,5 x, 3 hoch x und dem Produkt. Das Produkt schneidet die x-Achse nur im Ursprung." />,
  v3: <Bild f="kub" g="cos" art="produkt" bereich={[-4, 4, -8, 8]} teilung={2} beschreibung="Schaubilder von x hoch 3, Kosinus von x und dem Produkt. Das Schaubild des Produkts ist punktsymmetrisch zum Ursprung." />,
  a1: <Bild f="lin" g="cos" art="produkt" bereich={[-5, 5, -4, 4]} teilung={1} beschreibung="Schaubilder von 0,5 x, Kosinus von x und dem Produkt. Das Produkt hat die Nullstellen von 0,5 x und von Kosinus von x." />,
  a2: <Bild f="cos" g="lin" art="summe" spiegel bereich={[-5, 5, -4, 4]} teilung={1} beschreibung="Schaubilder von Kosinus von x, 0,5 x, dem Spiegelbild von 0,5 x an der x-Achse und der Summe. Die Summe hat ihre Nullstelle bei etwa minus 1,03, dort schneiden sich K_f und das Spiegelbild." />,
  a3: <Bild f="sin" g="cos" art="differenz" bereich={[-6, 6, -3, 3]} teilung={2} beschreibung="Schaubilder von Sinus von x, Kosinus von x und der Differenz. Die Differenz hat ihre Nullstellen dort, wo sich Sinus und Kosinus schneiden." />,
  a4punkt: <Bild f="lin" g="kub" art="summe" bereich={[-3, 3, -6, 6]} teilung={1} beschreibung="Schaubilder von 0,5 x, x hoch 3 und der Summe. Alle drei sind punktsymmetrisch zum Ursprung." />,
  a4achse: <Bild f="quad" g="cos" art="summe" bereich={[-3, 3, -2, 8]} teilung={1} beschreibung="Schaubilder von x², Kosinus von x und der Summe. Alle drei sind achsensymmetrisch zur y-Achse." />,
  a4keine: <Bild f="quad" g="kub" art="summe" bereich={[-3, 3, -6, 8]} teilung={1} beschreibung="Schaubilder von x², x hoch 3 und der Summe. Die Summe hat keine Symmetrie." />,
  a5produkt: <Bild f="exp3" g="quad" art="produkt" bereich={[-12, 3, -1, 4]} teilung={2} beschreibung="Schaubilder von 3 hoch x, x² und dem Produkt. Links nähert sich das Produkt der x-Achse." />,
  a5summe: <Bild f="exp3" g="lin" art="summe" bereich={[-8, 3, -5, 5]} teilung={1} beschreibung="Schaubilder von 3 hoch x, 0,5 x und der Summe. Links nähert sich die Summe der Geraden K_g." />,
  a6summe: <Bild f="sin" g="lin" art="summe" bereich={[-12, 12, -8, 8]} teilung={4} beschreibung="Schaubilder von Sinus von x, 0,5 x und der Summe. Die Summe schwingt um die Gerade und steigt insgesamt, sie ist nicht periodisch." />,
  a6produkt: <Bild f="sin" g="lin" art="produkt" spiegel bereich={[-12, 12, -8, 8]} teilung={4} beschreibung="Schaubilder von Sinus von x, 0,5 x, dem Spiegelbild von 0,5 x und dem Produkt. Das Produkt schwingt zwischen der Geraden und ihrem Spiegelbild, die Amplitude wächst." />,
} as const;

export default function Modul() {
  return (
    <>
      <Abschnitt id="erklaeren" titel="Erklären">
        <h3>Aus zwei Funktionen eine neue machen</h3>
        <p>
          Du kennst Potenz- und Polynomfunktionen, Exponentialfunktionen, die Sinus- und Kosinusfunktion und die Wurzelfunktion. Aus zwei dieser Funktionen kannst du durch Addition, Subtraktion oder Multiplikation eine neue Funktion bilden. Das nennt man <strong>Verknüpfen</strong>. In diesem Modul untersuchst du, welche Eigenschaften die neue Funktion von den beiden ursprünglichen erbt und welche verloren gehen.
        </p>

        <h3>Summe, Differenz und Produkt</h3>
        <Hinweis art="merksatz" titel="Verknüpfung von Funktionen">
          <p>
            Sind <Formel tex="f" /> und <Formel tex="g" /> Funktionen, dann ist
          </p>
          <ul className="liste">
            <li>
              die <strong>Summenfunktion</strong> <Formel tex="h(x)=f(x)+g(x)" nach="," />
            </li>
            <li>
              die <strong>Differenzfunktion</strong> <Formel tex="h(x)=f(x)-g(x)" nach="," />
            </li>
            <li>
              die <strong>Produktfunktion</strong> <Formel tex={String.raw`h(x)=f(x)\cdot g(x)`} nach="." />
            </li>
          </ul>
          <p>
            Das Schaubild von <Formel tex="h" /> heißt <Formel tex="K_h" nach="." />
          </p>
        </Hinweis>

        <h3>Den Funktionsterm bilden</h3>
        <p>
          Gegeben sind <Formel tex="f(x)=x^3" /> und <Formel tex="g(x)=x^2+2x" nach="." /> Du setzt die beiden Terme ein:
        </p>
        <ul className="liste">
          <li>
            Summe: <Formel tex="h(x)=x^3+x^2+2x" nach="." />
          </li>
          <li>
            Differenz: <Formel tex="h(x)=x^3-(x^2+2x)=x^3-x^2-2x" nach="." />
          </li>
          <li>
            Produkt: <Formel tex={String.raw`h(x)=x^3\cdot(x^2+2x)=x^5+2x^4`} nach="." />
          </li>
        </ul>
        <Hinweis titel="Klammern setzen">
          Besteht <Formel tex="g(x)" /> aus mehreren Summanden, setzt du den Term in Klammern, sobald du subtrahierst oder multiplizierst. Das Minuszeichen und der Faktor gelten dann für den ganzen Term. Wer die Klammer vergisst, erhält bei der Differenz <Formel tex="x^3-x^2+2x" /> und damit ein falsches Vorzeichen bei <Formel tex="2x" nach="." />
        </Hinweis>

        <h3>Definitionsbereich</h3>
        <p>
          Die Funktion <Formel tex="h" /> kann nur an Stellen berechnet werden, an denen <Formel tex="f" /> und <Formel tex="g" /> beide definiert sind. Der Definitionsbereich von <Formel tex="h" /> ist der <strong>Durchschnitt</strong> der beiden Definitionsbereiche, also die Menge der Stellen, die in beiden liegen:
        </p>
        <Formel anzeige tex={String.raw`D_h=D_f\cap D_g`} />
        <p>
          Beispiel: Für <Formel tex={String.raw`f(x)=\sqrt{x}`} /> ist <Formel tex={String.raw`D_f=[0;\,\infty[`} nach="," /> für <Formel tex={String.raw`g(x)=\cos x`} /> ist <Formel tex={String.raw`D_g=\mathbb{R}`} nach="." /> Jede der drei Verknüpfungen hat dann den Definitionsbereich <Formel tex={String.raw`D_h=[0;\,\infty[`} nach="." />
        </p>

        <h3>Ordinatenaddition</h3>
        <p>
          Das Schaubild einer Summe kannst du Stelle für Stelle konstruieren. Du addierst an jeder Stelle <Formel tex="x" /> die y-Werte (Ordinaten) von <Formel tex="K_f" /> und <Formel tex="K_g" nach="." /> Dieses Verfahren heißt <strong>Ordinatenaddition</strong>. Am Schaubild setzt du dazu die Strecke für <Formel tex="g(x)" /> an das Ende der Strecke für <Formel tex="f(x)" nach="." /> Ist ein Wert negativ, zeigt seine Strecke nach unten. Bei der Differenz zeigt die Strecke für <Formel tex="g(x)" /> in die entgegengesetzte Richtung. Beim Produkt werden die y-Werte multipliziert. Das lässt sich nicht als Strecke anhängen, du rechnest den Wert aus.
        </p>
        <p>
          Verändere die Stelle <Formel tex="x_0" /> und wechsle zwischen Summe, Differenz und Produkt. Zeichne danach das Schaubild von <Formel tex="h" /> bis zur Stelle <Formel tex="x_0" nach="." />
        </p>
        <Ordinatenbild />
      </Abschnitt>

      <Abschnitt id="entdecken" titel="Entdecken">
        <h3>Vermutung</h3>
        <p>Überlege zuerst, bevor du das Labor benutzt. Notiere deine Vermutungen.</p>
        <ol className="auftraege">
          <li>
            <p>
              Die Funktion <Formel tex="f(x)=x^2" /> hat die Nullstelle <Formel tex="0" nach="." /> Hat auch <Formel tex="h(x)=x^2+3^x" /> eine Nullstelle?
            </p>
            <Beobachtung bild={BILDER.v1}>
              <Formel tex="x^2\ge 0" /> und <Formel tex="3^x>0" /> für alle <Formel tex="x" nach="," /> also ist <Formel tex="h(x)>0" nach="." /> Die Funktion <Formel tex="h" /> hat keine Nullstelle, obwohl <Formel tex="f" /> eine hat.
            </Beobachtung>
          </li>
          <li>
            <p>
              Welche Nullstellen hat <Formel tex={String.raw`h(x)=0{,}5x\cdot 3^x`} nach="?" />
            </p>
            <Beobachtung bild={BILDER.v2}>
              Nur <Formel tex="x=0" nach="." /> Die Funktion <Formel tex="3^x" /> wird nie null, der Faktor <Formel tex="0{,}5x" /> ist nur bei <Formel tex="x=0" /> null.
            </Beobachtung>
          </li>
          <li>
            <p>
              <Formel tex="f(x)=x^3" /> ist punktsymmetrisch zum Ursprung, <Formel tex={String.raw`g(x)=\cos x`} /> ist achsensymmetrisch zur y-Achse. Welche Symmetrie hat <Formel tex={String.raw`h(x)=x^3\cdot\cos x`} nach="?" />
            </p>
            <Hinweis titel="Woran du Symmetrie erkennst">
              <ul className="liste">
                <li>
                  <strong>Achsensymmetrisch zur y-Achse:</strong> Es gilt <Formel tex="f(-x)=f(x)" /> für alle <Formel tex="x" nach="." /> Spiegelt man das Schaubild an der y-Achse, erhält man dasselbe Schaubild. Beispiele sind <Formel tex="x^2" /> und <Formel tex={String.raw`\cos x`} nach="." />
                </li>
                <li>
                  <strong>Punktsymmetrisch zum Ursprung:</strong> Es gilt <Formel tex="f(-x)=-f(x)" /> für alle <Formel tex="x" nach="." /> Dreht man das Schaubild um 180° um den Ursprung, erhält man dasselbe Schaubild. Beispiele sind <Formel tex="x^3" /> und <Formel tex={String.raw`\sin x`} nach="." />
                </li>
              </ul>
            </Hinweis>
            <Beobachtung bild={BILDER.v3}>
              Es gilt <Formel tex={String.raw`h(-x)=(-x)^3\cdot\cos(-x)=-x^3\cdot\cos x=-h(x)`} nach="." /> Also ist <Formel tex="K_h" /> punktsymmetrisch zum Ursprung. Du kannst es im Labor prüfen.
            </Beobachtung>
          </li>
        </ol>

        <h3>Labor</h3>
        <p>
          Wähle zwei Funktionen <Formel tex="f" /> und <Formel tex="g" /> und eine Verknüpfung. Das Schaubild von <Formel tex="h" /> ist dick gezeichnet, die Nullstellen von <Formel tex="h" /> sind als Punkte markiert. Die Tabelle unter dem Schaubild nennt Eigenschaften von <Formel tex="f" nach="," /> <Formel tex="g" /> und <Formel tex="h" nach="." /> Mit dem Ausschnitt „groß“ siehst du auch Stellen weiter links und rechts.
        </p>
        <Verknuepfungslabor />

        <h3>Untersuchungsaufträge</h3>
        <p>Beantworte die Fragen zuerst mit dem Labor. Danach kannst du deine Beobachtung vergleichen.</p>
        <ol className="auftraege">
          <li>
            <p>
              <strong>Nullstellen beim Produkt.</strong> Wähle „Produkt“ und probiere mehrere Paare, zum Beispiel <Formel tex={String.raw`f(x)=0{,}5x`} /> und <Formel tex={String.raw`g(x)=\cos x`} nach="," /> <Formel tex="f(x)=x^4+x" /> und <Formel tex={String.raw`g(x)=\sin x`} nach="," /> <Formel tex="f(x)=x^2" /> und <Formel tex="g(x)=3^x" nach="." /> Vergleiche die Nullstellen von <Formel tex="f" /> und <Formel tex="g" /> mit denen von <Formel tex="h" nach="." /> Welche bleiben erhalten? Kommen neue hinzu? Wähle dann <Formel tex={String.raw`g(x)=\sqrt{x}`} /> und <Formel tex="f(x)=x^4+x" nach="." /> Was fällt bei den Nullstellen von <Formel tex="f" /> auf?
            </p>
            <Beobachtung bild={BILDER.a1}>
              Jede Nullstelle von <Formel tex="f" /> und jede von <Formel tex="g" /> ist auch eine Nullstelle von <Formel tex="h" nach="." /> Es kommen keine neuen hinzu. Der Grund: Ein Produkt ist null, wenn mindestens ein Faktor null ist. Die Ausnahme zeigt <Formel tex={String.raw`g(x)=\sqrt{x}`} nach=":" /> Die Nullstelle <Formel tex="x=-1" /> von <Formel tex="f(x)=x^4+x" /> fällt weg, weil <Formel tex="h" /> dort nicht definiert ist. Es zählen nur Nullstellen im gemeinsamen Definitionsbereich.
            </Beobachtung>
          </li>
          <li>
            <p>
              <strong>Nullstellen bei der Summe.</strong> Wähle „Summe“. (a) <Formel tex="f(x)=x^2" /> und <Formel tex="g(x)=3^x" nach="." /> (b) <Formel tex="f(x)=x^2" /> und <Formel tex={String.raw`g(x)=0{,}5x`} nach="." /> (c) <Formel tex={String.raw`f(x)=\cos x`} /> und <Formel tex={String.raw`g(x)=0{,}5x`} nach="," /> dazu das Spiegelbild von <Formel tex="K_g" nach="." /> Bleiben die Nullstellen von <Formel tex="f" /> und <Formel tex="g" /> erhalten? Wo entstehen Nullstellen von <Formel tex="h" nach="?" />
            </p>
            <Beobachtung bild={BILDER.a2}>
              Bei der Summe bleiben Nullstellen im Allgemeinen nicht erhalten. In (a) hat <Formel tex="h" /> gar keine Nullstelle. In (b) bleibt <Formel tex="x=0" /> (beide Summanden sind dort null) und es kommt <Formel tex="x=-0{,}5" /> hinzu. In (c) hat <Formel tex={String.raw`\cos x`} /> unendlich viele Nullstellen, die Summe aber nur eine einzige, bei <Formel tex="x\approx-1{,}03" nach="." /> Nullstellen von <Formel tex="h" /> liegen dort, wo <Formel tex="f(x)=-g(x)" /> gilt, also dort, wo sich <Formel tex="K_f" /> und das Spiegelbild von <Formel tex="K_g" /> an der x-Achse schneiden.
            </Beobachtung>
          </li>
          <li>
            <p>
              <strong>Nullstellen bei der Differenz.</strong> Wähle „Differenz“ und zeige <Formel tex="K_f" /> und <Formel tex="K_g" nach="." /> Probiere <Formel tex="f(x)=x^2" /> und <Formel tex={String.raw`g(x)=0{,}5x`} nach="," /> dann <Formel tex={String.raw`f(x)=\sin x`} /> und <Formel tex={String.raw`g(x)=\cos x`} nach="." /> Wo liegen die Nullstellen von <Formel tex="h" /> im Vergleich zu den Schnittpunkten von <Formel tex="K_f" /> und <Formel tex="K_g" nach="?" />
            </p>
            <Beobachtung bild={BILDER.a3}>
              Die Nullstellen von <Formel tex="h=f-g" /> sind genau die Stellen, an denen sich <Formel tex="K_f" /> und <Formel tex="K_g" /> schneiden. Denn <Formel tex="f(x)-g(x)=0" /> gilt genau dann, wenn <Formel tex="f(x)=g(x)" nach="." /> Bei <Formel tex="x^2" /> und <Formel tex="0{,}5x" /> sind es <Formel tex="x=0" /> und <Formel tex="x=0{,}5" nach="," /> bei Sinus und Kosinus die Stellen <Formel tex={String.raw`x=\tfrac{\pi}{4}+k\cdot\pi`} nach="." />
            </Beobachtung>
          </li>
          <li>
            <p>
              <strong>Symmetrie.</strong> Punktsymmetrisch zum Ursprung sind <Formel tex="0{,}5x" nach="," /> <Formel tex="x^3" /> und <Formel tex={String.raw`\sin x`} nach="." /> Achsensymmetrisch zur y-Achse sind <Formel tex="x^2" /> und <Formel tex={String.raw`\cos x`} nach="." /> Untersuche mit passenden Paaren, welche Symmetrie die Summe und welche das Produkt haben, wenn <Formel tex="f" /> und <Formel tex="g" /> beide punktsymmetrisch sind, beide achsensymmetrisch sind oder eine von jeder Art ist. Halte die Ergebnisse in einer Tabelle fest. Teste danach <Formel tex="g(x)=3^x" /> oder <Formel tex={String.raw`g(x)=\sqrt{x}`} nach="." />
            </p>
            <Beobachtung bild={<><div className="bilder-paar">{BILDER.a4punkt}{BILDER.a4achse}</div>{BILDER.a4keine}</>}>
              <table className="tabelle tabelle-kompakt">
                <thead>
                  <tr>
                    <th scope="col"><Formel tex="f" /> und <Formel tex="g" /></th>
                    <th scope="col">Summe und Differenz</th>
                    <th scope="col">Produkt</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><th scope="row">beide punktsymmetrisch</th><td>punktsymmetrisch</td><td>achsensymmetrisch</td></tr>
                  <tr><th scope="row">beide achsensymmetrisch</th><td>achsensymmetrisch</td><td>achsensymmetrisch</td></tr>
                  <tr><th scope="row">eine von jeder Art</th><td>keine Symmetrie</td><td>punktsymmetrisch</td></tr>
                </tbody>
              </table>
              Hat eine der Funktionen keine Symmetrie (zum Beispiel <Formel tex="3^x" nach=")," /> hat die Verknüpfung in diesen Beispielen auch keine. Allgemein gilt das meistens, aber nicht immer. Bei <Formel tex={String.raw`g(x)=\sqrt{x}`} /> gibt es keine Symmetrie, weil der Definitionsbereich <Formel tex={String.raw`[0;\,\infty[`} /> nicht symmetrisch zum Ursprung liegt.
            </Beobachtung>
          </li>
          <li>
            <p>
              <strong>Asymptote.</strong> Die Funktion <Formel tex="3^x" /> nähert sich für <Formel tex={String.raw`x\to-\infty`} /> der x-Achse. Wähle den Ausschnitt „groß“. (a) Wähle „Produkt“ mit <Formel tex="f(x)=3^x" /> und <Formel tex="g(x)=x^2" /> sowie <Formel tex={String.raw`g(x)=\cos x`} nach="." /> Was passiert mit der Asymptote? (b) Wähle „Summe“ mit denselben Funktionen. (c) Wähle „Summe“ mit <Formel tex="f(x)=3^x" /> und <Formel tex={String.raw`g(x)=0{,}5x`} nach="." /> Wie verläuft <Formel tex="K_h" /> links?
            </p>
            <Hinweis titel="Wie du eine Asymptote bestimmst">
              <ul className="liste">
                <li>
                  Eine <strong>Asymptote</strong> ist eine Gerade, der sich <Formel tex="K_h" /> für sehr große oder sehr kleine <Formel tex="x" /> beliebig nähert. Prüfe deshalb das Verhalten von <Formel tex="h(x)" /> für <Formel tex={String.raw`x\to\infty`} /> (rechts) und für <Formel tex={String.raw`x\to-\infty`} /> (links).
                </li>
                <li>
                  Setze dazu immer größere Beträge von <Formel tex="x" /> ein und beobachte die Werte. Beispiel <Formel tex="3^x" /> für <Formel tex={String.raw`x\to-\infty`} nach=":" />
                  <table className="tabelle tabelle-kompakt">
                    <thead>
                      <tr>
                        <th scope="col"><Formel tex="x" /></th>
                        <th scope="col"><Formel tex="-1" /></th>
                        <th scope="col"><Formel tex="-5" /></th>
                        <th scope="col"><Formel tex="-10" /></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row"><Formel tex="3^x" /></th>
                        <td>0,333</td>
                        <td>0,004</td>
                        <td>0,00002</td>
                      </tr>
                    </tbody>
                  </table>
                  Die Werte nähern sich <Formel tex="0" nach="." /> Also ist die x-Achse (<Formel tex="y=0" nach=")" /> waagerechte Asymptote von <Formel tex="K_f" nach="." /> Nähert sich <Formel tex="h(x)" /> einer anderen Zahl <Formel tex="c" nach="," /> ist <Formel tex="y=c" /> die Asymptote.
                </li>
                <li>
                  Bei Summen und Produkten fragst du: Welcher Teil geht gegen <Formel tex="0" nach="?" /> Geht bei einer Summe <Formel tex="f(x)" /> gegen <Formel tex="0" nach="," /> ist <Formel tex="h(x)" /> fast gleich <Formel tex="g(x)" nach="." /> Dann nähert sich <Formel tex="K_h" /> dem Schaubild von <Formel tex="g" nach="." /> Ist <Formel tex="g" /> eine Gerade, ist sie die Asymptote. Bei einem Produkt geht <Formel tex="h(x)" /> gegen <Formel tex="0" nach="," /> wenn ein Faktor schnell genug gegen <Formel tex="0" /> geht und der andere dabei nicht schneller wächst.
                </li>
              </ul>
            </Hinweis>
            <Beobachtung bild={<div className="bilder-paar">{BILDER.a5produkt}{BILDER.a5summe}</div>}>
              (a) Beim Produkt bleibt die x-Achse Asymptote. Die Funktion <Formel tex="3^x" /> wird für <Formel tex={String.raw`x\to-\infty`} /> schneller klein, als <Formel tex="x^2" /> wächst, und <Formel tex={String.raw`\cos x`} /> bleibt zwischen <Formel tex="-1" /> und <Formel tex="1" nach="." /> (b) Bei der Summe geht die Asymptote verloren, weil der zweite Summand nicht gegen null geht. (c) Weil <Formel tex="3^x" /> gegen null geht, ist <Formel tex="h(x)" /> links fast gleich <Formel tex="g(x)=0{,}5x" nach="." /> Die Gerade <Formel tex={String.raw`y=0{,}5x`} /> ist eine schräge Asymptote von <Formel tex="K_h" nach="." />
            </Beobachtung>
          </li>
          <li>
            <p>
              <strong>Periode.</strong> (a) Wähle „Summe“ und dann „Produkt“ mit <Formel tex={String.raw`f(x)=\sin x`} /> und <Formel tex={String.raw`g(x)=\cos x`} nach="." /> Lies die Periode in der Tabelle ab. (b) Wähle „Summe“ mit <Formel tex={String.raw`f(x)=\sin x`} /> und <Formel tex={String.raw`g(x)=0{,}5x`} nach="." /> Das Schaubild sieht wellig aus. Berechne <Formel tex="h(1)" /> und <Formel tex={String.raw`h(1+2\pi)`} nach="." /> Ist <Formel tex="h" /> periodisch? (c) Wähle „Produkt“ mit denselben Funktionen und zeige das Spiegelbild von <Formel tex="K_g" nach="." /> Was begrenzt die Schwingung, und was bleibt von den Nullstellen von <Formel tex={String.raw`\sin x`} nach="?" />
            </p>
            <Beobachtung bild={<div className="bilder-paar">{BILDER.a6summe}{BILDER.a6produkt}</div>}>
              (a) Die Summe hat die Periode <Formel tex={String.raw`2\pi`} nach="," /> das Produkt die kleinere Periode <Formel tex={String.raw`\pi`} nach="." /> (b) Es gilt <Formel tex={String.raw`h(1+2\pi)=h(1)+\pi`} nach="," /> also ist <Formel tex="h" /> nicht periodisch. Die Wellen sind nur um die Gerade <Formel tex="K_g" /> herum aufgehängt. Eine Summe aus einer periodischen und einer nicht periodischen Funktion ist nicht periodisch. (c) Die Schwingung liegt zwischen <Formel tex="K_g" /> und dem Spiegelbild von <Formel tex="K_g" nach="." /> Die Amplitude wächst mit <Formel tex="x" nach="." /> Die Nullstellen <Formel tex={String.raw`k\cdot\pi`} /> von <Formel tex={String.raw`\sin x`} /> bleiben erhalten, <Formel tex="h" /> selbst ist nicht periodisch.
            </Beobachtung>
          </li>
        </ol>

        <h3>Weiterführend mit GeoGebra</h3>
        <p>
          Die folgende Aktivität gehört zum Einstieg in das Thema. Sie liegt auf geogebra.org. Erst wenn du den Link anklickst, wird die Seite von GeoGebra geladen.
        </p>
        <ul className="liste">
          <li>
            <Extern href="https://www.geogebra.org/m/tc2uqagd">GeoGebra-Aktivität: Schaubilder von Verknüpfungen</Extern>
          </li>
        </ul>
      </Abschnitt>

      <Abschnitt id="ueberpruefen" titel="Überprüfen">
        <p>
          Gib Zahlen als Dezimalzahl (<code>0,87</code>) oder als Bruch (zum Beispiel <Formel tex="\frac{1}{4}" nach=")" /> ein. Bei den Auswahlfragen wird deine Antwort erklärt, nicht nur bewertet.
        </p>

        <Aufgabe
          nummer={1}
          titel="Differenz bilden und auswerten"
          felder={[
            { id: 'h0', beschriftung: <Formel tex="h(0)" />, name: 'h von 0', erwartet: A1.h0 },
            { id: 'h2', beschriftung: <Formel tex="h(2)" />, name: 'h von 2', erwartet: A1.h2 },
            { id: 'h-1', beschriftung: <Formel tex="h(-1)" />, name: 'h von minus 1', erwartet: A1.hMinus1 },
          ]}
          hilfen={[
            <>
              Schreibe zuerst <Formel tex="h(x)=f(x)-g(x)" /> auf und setze für <Formel tex="g(x)" /> eine Klammer.
            </>,
            <>
              <Formel tex="h(x)=2x+1-(x^2-3)" nach="." /> Das Minuszeichen gilt für beide Summanden in der Klammer.
            </>,
            <>
              Setze die Stelle ein, oder berechne <Formel tex="f" /> und <Formel tex="g" /> einzeln und subtrahiere, zum Beispiel <Formel tex="h(2)=f(2)-g(2)" nach="." />
            </>,
          ]}
          loesung={[
            <>
              <Formel tex="h(x)=2x+1-(x^2-3)" nach="." />
            </>,
            <>
              Klammer auflösen: <Formel tex="h(x)=2x+1-x^2+3=-x^2+2x+4" nach="." />
            </>,
            <>
              <Formel tex="h(0)=4" nach="," /> <Formel tex="h(2)=-4+4+4=4" nach="," /> <Formel tex="h(-1)=-1-2+4=1" nach="." /> Zur Probe: <Formel tex="f(2)-g(2)=5-1=4" nach="." />
            <Funktionsgraph bereich={[-3, 4, -6, 6]} xTeilung={1} yTeilung={2} xBeschriftung="zahl" className="brett-3zu2" kurven={[{ f: A1.f, farbe: FARBE_F }, { f: A1.g, farbe: FARBE_G, gestrichelt: true }, { f: (x) => A1.f(x) - A1.g(x), farbe: FARBE_H }]} beschreibung="Schaubilder von f(x) = 2x + 1, g(x) = x² − 3 und der Differenz h. Bei x = 0 ist h gleich 4, bei x = 2 gleich 4 und bei x = −1 gleich 1." />
            </>,
          ]}
        >
          <p>
            Gegeben sind <Formel tex="f(x)=2x+1" /> und <Formel tex="g(x)=x^2-3" nach="." /> Bilde die Differenzfunktion <Formel tex="h=f-g" /> und berechne <Formel tex="h(0)" nach="," /> <Formel tex="h(2)" /> und <Formel tex="h(-1)" nach="." />
          </p>
        </Aufgabe>

        <Auswahlfrage
          nummer="2"
          titel="Term der Differenz"
          optionen={[
            opt('a', <Formel tex="x^3-x^2+2x" />, false, <>Die Klammer fehlt. Das Minuszeichen gilt für den ganzen Term <Formel tex="x^2+2x" nach="," /> also auch für <Formel tex="2x" nach="." /></>),
            opt('b', <Formel tex="x^3+x^2+2x" />, false, <>Das ist die Summe <Formel tex="f+g" nach="," /> nicht die Differenz.</>),
            opt('c', <Formel tex="x^3-(x^2+2x)" />, true, <>Richtig, <Formel tex="g(x)" /> steht in Klammern.</>),
            opt('d', <Formel tex="x^3\cdot(x^2+2x)" />, false, <>Das ist das Produkt <Formel tex="f\cdot g" nach="." /></>),
          ]}
          erklaerung={
            <>
              <Formel tex="h(x)=f(x)-g(x)=x^3-(x^2+2x)=x^3-x^2-2x" nach="." /> Zur Kontrolle bei <Formel tex="x=1" nach=":" /> <Formel tex="f(1)-g(1)=1-3=-2" /> und <Formel tex="1-1-2=-2" nach="." />
            </>
          }
        >
          <p>
            Gegeben sind <Formel tex="f(x)=x^3" /> und <Formel tex="g(x)=x^2+2x" nach="." /> Welcher Term gehört zur Differenzfunktion <Formel tex="h=f-g" nach="?" />
          </p>
        </Auswahlfrage>

        <Aufgabe
          nummer={3}
          titel="Nullstellen eines Produkts"
          felder={[
            { id: 'x1', beschriftung: <Formel tex="x_1" />, name: 'kleinere Nullstelle', erwartet: A3.x1 },
            { id: 'x2', beschriftung: <Formel tex="x_2" />, name: 'größere Nullstelle', erwartet: A3.x2 },
          ]}
          hilfen={[
            <>Ein Produkt ist null, wenn mindestens ein Faktor null ist.</>,
            <>
              Hat <Formel tex="2^x" /> eine Nullstelle? Es gilt <Formel tex="2^x>0" /> für alle <Formel tex="x" nach="." />
            </>,
            <>
              Löse <Formel tex="x^2-9=0" nach="." />
            </>,
          ]}
          loesung={[
            <>
              <Formel tex="h(x)=0" /> gilt, wenn <Formel tex="x^2-9=0" /> oder <Formel tex="2^x=0" nach="." />
            </>,
            <>
              <Formel tex="2^x=0" /> hat keine Lösung. Aus <Formel tex="x^2=9" /> folgt <Formel tex="x=-3" /> oder <Formel tex="x=3" nach="." />
            </>,
            <>
              Beide Stellen liegen im Definitionsbereich <Formel tex={String.raw`\mathbb{R}`} nach="." /> Die Nullstellen sind <Formel tex="x_1=-3" /> und <Formel tex="x_2=3" nach="." />
            <Funktionsgraph bereich={[-5, 4.5, -30, 30]} xTeilung={1} yTeilung={10} xBeschriftung="zahl" className="brett-3zu2" kurven={[{ f: A3.h, farbe: FARBE_H }]} beschreibung="Schaubild von h(x) = (x² − 9) · 2 hoch x. Es schneidet die x-Achse bei x = −3 und x = 3." />
            </>,
          ]}
        >
          <p>
            Bestimme die Nullstellen von <Formel tex={String.raw`h(x)=(x^2-9)\cdot 2^x`} nach="." /> Gib die kleinere Nullstelle als <Formel tex="x_1" /> an.
          </p>
        </Aufgabe>

        <Auswahlfrage
          nummer="4"
          titel="Nullstellen einer Summe"
          optionen={[
            opt('c', <>keine</>, true, <>Richtig.</>),
            opt('a', <>genau eine, nämlich <Formel tex="x=0" nach="," /> weil <Formel tex="x^2" /> dort null ist</>, false, <>Bei einer Summe zählt der Funktionswert der ganzen Summe. Es ist <Formel tex="h(0)=0^2+2^0=1" nach="," /> nicht null.</>),
            opt('b', <>zwei, eine von <Formel tex="x^2" /> und eine von <Formel tex="2^x" /></>, false, <>Nullstellen der Summanden werden bei der Summe nicht übernommen. Außerdem hat <Formel tex="2^x" /> gar keine Nullstelle.</>),
            opt('d', <>unendlich viele</>, false, <>Unendlich viele Nullstellen hätte zum Beispiel eine Sinusfunktion. Hier ist <Formel tex="h(x)" /> immer positiv.</>),
          ]}
          erklaerung={
            <>
              Es ist <Formel tex="x^2\ge 0" /> und <Formel tex="2^x>0" /> für alle <Formel tex="x" nach="." /> Also ist <Formel tex="h(x)=x^2+2^x>0" /> für alle <Formel tex="x" nach="," /> und <Formel tex="K_h" /> schneidet die x-Achse nie.
            <Funktionsgraph bereich={[-4, 3, -2, 10]} xTeilung={1} yTeilung={2} xBeschriftung="zahl" className="brett-3zu2" kurven={[{ f: (x) => x * x, farbe: FARBE_F }, { f: (x) => 2 ** x, farbe: FARBE_G, gestrichelt: true }, { f: (x) => x * x + 2 ** x, farbe: FARBE_H }]} beschreibung="Schaubilder von x², 2 hoch x und der Summe. Die Summe liegt immer oberhalb der x-Achse." />
            </>
          }
        >
          <p>
            Wie viele Nullstellen hat <Formel tex="h(x)=x^2+2^x" nach="?" />
          </p>
        </Auswahlfrage>

        <Aufgabe
          nummer={5}
          titel="Schnittstellen über die Differenz"
          felder={[
            { id: 'x1', beschriftung: <Formel tex="x_1" />, name: 'kleinere Schnittstelle', erwartet: A5.x1 },
            { id: 'x2', beschriftung: <Formel tex="x_2" />, name: 'größere Schnittstelle', erwartet: A5.x2 },
          ]}
          hilfen={[
            <>
              An einer Schnittstelle gilt <Formel tex="f(x)=g(x)" nach="," /> also <Formel tex="f(x)-g(x)=0" nach="." />
            </>,
            <>
              Bilde <Formel tex="h(x)=x^2-(x+2)=x^2-x-2" /> und bestimme die Nullstellen von <Formel tex="h" nach="." />
            </>,
            <>
              Zerlege <Formel tex="x^2-x-2" /> in Faktoren oder verwende die Lösungsformel für quadratische Gleichungen.
            </>,
          ]}
          loesung={[
            <>
              Die Schnittstellen von <Formel tex="K_f" /> und <Formel tex="K_g" /> sind die Nullstellen von <Formel tex="h=f-g" nach="." />
            </>,
            <>
              <Formel tex="h(x)=x^2-(x+2)=x^2-x-2=(x+1)(x-2)" nach="." />
            </>,
            <>
              <Formel tex="h(x)=0" /> für <Formel tex="x_1=-1" /> und <Formel tex="x_2=2" nach="." /> Probe: <Formel tex="f(-1)=1=g(-1)" /> und <Formel tex="f(2)=4=g(2)" nach="." />
            </>,
          ]}
        >
          <p>
            Gegeben sind <Formel tex="f(x)=x^2" /> und <Formel tex="g(x)=x+2" nach="." /> Bestimme die Stellen, an denen sich <Formel tex="K_f" /> und <Formel tex="K_g" /> schneiden, indem du die Nullstellen der Differenzfunktion <Formel tex="h=f-g" /> berechnest.
          </p>
          <AufKlick einblenden="Kontrollschaubild einblenden" ausblenden="Kontrollschaubild ausblenden">
            <Funktionsgraph
              bereich={[-3, 4, -3, 9]}
              xTeilung={1}
              yTeilung={1}
              xBeschriftung="zahl"
              className="brett-3zu2"
              kurven={[
                { f: A5.f, farbe: FARBE_F },
                { f: A5.g, farbe: FARBE_G, gestrichelt: true },
                { f: (x) => A5.f(x) - A5.g(x), farbe: FARBE_H },
              ]}
              beschreibung="Die Parabel K_f von f(x) = x², die Gerade K_g von g(x) = x + 2 und das Schaubild K_h der Differenz. K_f und K_g schneiden sich bei x = −1 und x = 2, dort schneidet K_h die x-Achse."
            />
            <p className="klein">
              Orange: <Formel tex="K_f" nach="," /> schwarz gestrichelt: <Formel tex="K_g" nach="," /> blau: <Formel tex="K_h" nach="." /> Die Nullstellen von <Formel tex="K_h" /> liegen unter den Schnittpunkten.
            </p>
          </AufKlick>
        </Aufgabe>

        <Auswahlfrage
          nummer="6"
          titel="Symmetrie eines Produkts"
          optionen={[
            opt('c', <>punktsymmetrisch zum Ursprung</>, true, <>Richtig.</>),
            opt('b', <>keine Symmetrie</>, false, <>Beide Faktoren sind symmetrisch. Dann hat das Produkt auch eine Symmetrie.</>),
            opt('d', <>sowohl achsen- als auch punktsymmetrisch</>, false, <>Außer der Nullfunktion hat keine Funktion beide Symmetrien.</>),
            opt('a', <>achsensymmetrisch zur y-Achse</>, false, <>Das gilt bei zwei Faktoren gleicher Symmetrieart. Hier hat <Formel tex="x^2" /> eine andere Art als <Formel tex={String.raw`\sin x`} nach="." /></>),
          ]}
          erklaerung={
            <>
              <Formel tex={String.raw`h(-x)=(-x)^2\cdot\sin(-x)=x^2\cdot(-\sin x)=-h(x)`} nach="." /> Achsensymmetrisch mal punktsymmetrisch ergibt punktsymmetrisch.
            <Bild f="quad" g="sin" art="produkt" bereich={[-4, 4, -6, 6]} teilung={2} beschreibung="Schaubilder von x², Sinus von x und dem Produkt. Das Produkt ist punktsymmetrisch zum Ursprung." />
            </>
          }
        >
          <p>
            Welche Symmetrie hat <Formel tex={String.raw`h(x)=x^2\cdot\sin x`} nach="?" />
          </p>
        </Auswahlfrage>

        <Auswahlfrage
          nummer="7"
          titel="Symmetrie einer Summe"
          optionen={[
            opt('a', <>achsensymmetrisch zur y-Achse, weil <Formel tex="x^2" /> es ist</>, false, <>Ein Summand allein entscheidet nicht. Für die Summe musst du <Formel tex="h(-x)" /> mit <Formel tex="h(x)" /> vergleichen.</>),
            opt('c', <>keine Symmetrie</>, true, <>Richtig.</>),
            opt('b', <>punktsymmetrisch zum Ursprung, weil <Formel tex="x^3" /> es ist</>, false, <>Auch hier entscheidet nicht ein Summand. Es ist <Formel tex="h(-1)=0" /> und <Formel tex="-h(1)=-2" nach="." /></>),
            opt('d', <>punktsymmetrisch, weil beide Summanden Potenzfunktionen sind</>, false, <>Potenzfunktionen mit geradem Exponenten sind achsensymmetrisch, mit ungeradem Exponenten punktsymmetrisch. Die Art muss bei beiden Summanden gleich sein.</>),
          ]}
          erklaerung={
            <>
              <Formel tex="x^2" /> ist achsensymmetrisch, <Formel tex="x^3" /> ist punktsymmetrisch. Bei verschiedener Art gibt es bei der Summe keine Symmetrie. Gegenbeispiel: <Formel tex="h(1)=2" /> und <Formel tex="h(-1)=1-1=0" nach="." /> Weder <Formel tex="h(-1)=h(1)" /> noch <Formel tex="h(-1)=-h(1)" /> stimmt.
            {BILDER.a4keine}
            </>
          }
        >
          <p>
            Welche Symmetrie hat <Formel tex="h(x)=x^2+x^3" nach="?" />
          </p>
        </Auswahlfrage>

        <Auswahlfrage
          nummer="8"
          titel="Asymptote eines Produkts"
          optionen={[
            opt('c', <>die x-Achse für <Formel tex={String.raw`x\to\infty`} /></>, true, <>Richtig.</>),
            opt('a', <>keine Asymptote, weil <Formel tex="x^2" /> unbeschränkt wächst</>, false, <>Für <Formel tex={String.raw`x\to\infty`} /> wird <Formel tex="0{,}5^x" /> schneller klein, als <Formel tex="x^2" /> wächst. Das Produkt geht gegen null.</>),
            opt('d', <>die x-Achse auf beiden Seiten</>, false, <>Links geht <Formel tex="h(x)" /> gegen unendlich, dort gibt es keine Asymptote.</>),
            opt('b', <>die x-Achse für <Formel tex={String.raw`x\to-\infty`} /></>, false, <>Links wird <Formel tex="0{,}5^x" /> riesig, nicht klein. Dort wächst <Formel tex="h" nach="." /></>),
          ]}
          erklaerung={
            <>
              Für <Formel tex={String.raw`x\to\infty`} /> geht <Formel tex="0{,}5^x" /> gegen null, und zwar schneller, als <Formel tex="x^2" /> wächst. Rechts nähert sich <Formel tex="K_h" /> der x-Achse. Für <Formel tex={String.raw`x\to-\infty`} /> werden beide Faktoren groß, dort gibt es keine Asymptote. Zur Kontrolle: <Formel tex="h(10)\approx 0{,}098" /> und <Formel tex="h(20)\approx 0{,}0004" nach="." />
            <Bild f="quad" g="exp05" art="produkt" bereich={[-3, 12, -1, 6]} teilung={2} beschreibung="Schaubilder von x², 0,5 hoch x und dem Produkt. Rechts nähert sich das Produkt der x-Achse, links wächst es." />
            </>
          }
        >
          <p>
            Welche waagerechte Asymptote hat <Formel tex="h(x)=x^2\cdot 0{,}5^x" nach="?" />
          </p>
        </Auswahlfrage>

        <Auswahlfrage
          nummer="9"
          titel="Definitionsbereich"
          optionen={[
            opt('c', <Formel tex={String.raw`[0;\,\infty[`} />, true, <>Richtig.</>),
            opt('a', <Formel tex={String.raw`\mathbb{R}`} />, false, <>Die Wurzel <Formel tex={String.raw`\sqrt{x}`} /> ist für negative Zahlen nicht definiert. Das gilt dann auch für die Summe.</>),
            opt('b', <Formel tex={String.raw`]0;\,\infty[`} />, false, <>Bei <Formel tex="x=0" /> ist <Formel tex={String.raw`\sqrt{x}`} /> definiert, nämlich null. Die Stelle <Formel tex="0" /> gehört dazu.</>),
            opt('d', <Formel tex={String.raw`]-\infty;\,0]`} />, false, <>Das sind die negativen Zahlen. Die Wurzel ist dort nicht definiert.</>),
          ]}
          erklaerung={
            <>
              <Formel tex={String.raw`D_f=[0;\,\infty[`} /> für <Formel tex={String.raw`f(x)=\sqrt{x}`} /> und <Formel tex={String.raw`D_g=\mathbb{R}`} /> für <Formel tex="g(x)=x^3" nach="." /> Der Durchschnitt ist <Formel tex={String.raw`D_h=[0;\,\infty[`} nach="." />
            <Bild f="wurzel" g="kub" art="summe" bereich={[-2, 3, -3, 8]} teilung={1} beschreibung="Schaubilder von Wurzel aus x, x hoch 3 und der Summe. Alle drei Schaubilder beginnen im Ursprung und sind nur für x größer oder gleich 0 definiert." />
            </>
          }
        >
          <p>
            Wie lautet der Definitionsbereich von <Formel tex={String.raw`h(x)=\sqrt{x}+x^3`} nach="?" />
          </p>
        </Auswahlfrage>

        <Auswahlfrage
          nummer="10"
          titel="Periodisch oder nicht?"
          optionen={[
            opt('a', <>Ja, mit der Periode <Formel tex={String.raw`2\pi`} nach="," /> weil <Formel tex={String.raw`\sin x`} /> diese Periode hat.</>, false, <>Die Wellen wiederholen sich in der Form, aber die Funktionswerte nicht. Es ist <Formel tex={String.raw`h(x+2\pi)=h(x)+\pi`} nach="." /></>),
            opt('b', <>Nein, weil <Formel tex={String.raw`h(x+2\pi)=h(x)+\pi`} /> ist und nicht <Formel tex="h(x)" nach="." /></>, true, <>Richtig.</>),
            opt('c', <>Nein, weil <Formel tex="h" /> keine Nullstelle hat.</>, false, <>Doch, <Formel tex="h(0)=0" nach="." /> Und ob es Nullstellen gibt, sagt nichts über Periodizität.</>),
            opt('d', <>Ja, aber mit einer größeren Periode.</>, false, <>Die Funktion steigt insgesamt an. Ein Funktionswert kehrt nach keiner Verschiebung nach rechts zurück.</>),
          ]}
          erklaerung={
            <>
              <Formel tex={String.raw`h(x+2\pi)=\sin(x+2\pi)+0{,}5(x+2\pi)=\sin x+0{,}5x+\pi=h(x)+\pi`} nach="." /> Für Periodizität müsste <Formel tex="h(x+p)=h(x)" /> mit einem festen <Formel tex="p>0" /> für alle <Formel tex="x" /> gelten. Das Schaubild sieht wellig aus, steigt aber insgesamt, weil <Formel tex="0{,}5x" /> wächst.
            {BILDER.a6summe}
            </>
          }
        >
          <p>
            Ist <Formel tex={String.raw`h(x)=\sin x+0{,}5x`} /> periodisch?
          </p>
        </Auswahlfrage>
      </Abschnitt>

      <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
        <h3>Verknüpfen und Funktionsterm</h3>
        <Hinweis art="merksatz" titel="Summe, Differenz und Produkt">
          <ul className="liste">
            <li>
              <Formel tex="h(x)=f(x)+g(x)" nach="," /> <Formel tex="h(x)=f(x)-g(x)" nach="," /> <Formel tex={String.raw`h(x)=f(x)\cdot g(x)`} nach="." />
            </li>
            <li>Besteht <Formel tex="g(x)" /> aus mehreren Summanden, steht der Term bei Differenz und Produkt in Klammern.</li>
            <li>
              Definitionsbereich: <Formel tex={String.raw`D_h=D_f\cap D_g`} nach="." />
            </li>
            <li>
              Ordinatenaddition: An jeder Stelle werden die y-Werte von <Formel tex="K_f" /> und <Formel tex="K_g" /> addiert. Bei der Differenz wird <Formel tex="g(x)" /> abgezogen, beim Produkt werden die y-Werte multipliziert.
            </li>
          </ul>
        </Hinweis>

        <h3>Eigenschaften im Überblick</h3>
        <table className="tabelle">
          <caption>Was bleibt von <Formel tex="f" /> und <Formel tex="g" /> erhalten?</caption>
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">Summe und Differenz</th>
              <th scope="col">Produkt</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Nullstellen</th>
              <td>
                Bleiben im Allgemeinen nicht erhalten, es können neue entstehen. <Formel tex="f+g" /> hat Nullstellen dort, wo <Formel tex="f(x)=-g(x)" nach="," /> <Formel tex="f-g" /> dort, wo <Formel tex="f(x)=g(x)" /> gilt (Schnittstellen von <Formel tex="K_f" /> und <Formel tex="K_g" nach=")." />
              </td>
              <td>Alle Nullstellen von <Formel tex="f" /> und <Formel tex="g" /> im gemeinsamen Definitionsbereich bleiben erhalten, neue entstehen nicht (ein Produkt ist null, wenn ein Faktor null ist).</td>
            </tr>
            <tr>
              <th scope="row">Symmetrie</th>
              <td>siehe Tabelle unten</td>
              <td>siehe Tabelle unten</td>
            </tr>
            <tr>
              <th scope="row">Asymptote</th>
              <td>Eine waagerechte Asymptote bleibt nur erhalten, wenn die andere Funktion dort ebenfalls gegen null geht. Geht eine Funktion gegen null, nähert sich <Formel tex="K_h" /> dem Schaubild der anderen.</td>
              <td>Die x-Achse als Asymptote von <Formel tex="3^x" /> bleibt auch beim Produkt mit <Formel tex="x^2" nach="," /> <Formel tex={String.raw`\sin x`} /> oder <Formel tex={String.raw`\cos x`} /> erhalten.</td>
            </tr>
            <tr>
              <th scope="row">Periode</th>
              <td>Periodisch nur, wenn beide Funktionen periodisch sind (zum Beispiel <Formel tex={String.raw`\sin x+\cos x`} nach=")." /> Eine Summe aus Sinus und einer Geraden ist nicht periodisch.</td>
              <td>Periodisch nur, wenn beide periodisch sind. Das Produkt <Formel tex={String.raw`\sin x\cdot\cos x`} /> hat die Periode <Formel tex={String.raw`\pi`} nach="." /> Mit einem nicht periodischen Faktor ist das Produkt nicht periodisch, seine Nullstellen können sich aber regelmäßig wiederholen.</td>
            </tr>
          </tbody>
        </table>

        <h3>Symmetrie von Summe und Produkt</h3>
        <table className="tabelle tabelle-kompakt">
          <caption>Beide Funktionen haben eine Symmetrie</caption>
          <thead>
            <tr>
              <th scope="col"><Formel tex="f" /> und <Formel tex="g" /></th>
              <th scope="col">Summe, Differenz</th>
              <th scope="col">Produkt</th>
            </tr>
          </thead>
          <tbody>
            <tr><th scope="row">beide punktsymmetrisch</th><td>punktsymmetrisch</td><td>achsensymmetrisch</td></tr>
            <tr><th scope="row">beide achsensymmetrisch</th><td>achsensymmetrisch</td><td>achsensymmetrisch</td></tr>
            <tr><th scope="row">eine von jeder Art</th><td>keine Symmetrie</td><td>punktsymmetrisch</td></tr>
          </tbody>
        </table>
        <p>
          Hat eine der beiden Funktionen keine Symmetrie, hat auch die Verknüpfung meistens keine. Ist der Definitionsbereich nicht symmetrisch zum Ursprung (zum Beispiel bei <Formel tex={String.raw`\sqrt{x}`} nach=")," /> gibt es keine Symmetrie.
        </p>
        <Hinweis titel="Begründung der Regeln">
          <p>
            Bei zwei punktsymmetrischen Funktionen gilt <Formel tex="f(-x)=-f(x)" /> und <Formel tex="g(-x)=-g(x)" nach="." /> Für die Summe folgt <Formel tex="h(-x)=-f(x)-g(x)=-h(x)" nach="," /> für das Produkt <Formel tex={String.raw`h(-x)=(-f(x))\cdot(-g(x))=h(x)`} nach="." /> Die anderen Fälle begründest du genauso.
          </p>
        </Hinweis>

        <h3>Vorgehen beim Untersuchen</h3>
        <ol className="liste">
          <li>Definitionsbereich bestimmen: <Formel tex={String.raw`D_h=D_f\cap D_g`} nach="." /></li>
          <li>Symmetrie prüfen, mit den Regeln oder mit <Formel tex="h(-x)" nach="." /></li>
          <li>Nullstellen bestimmen: beim Produkt aus den Nullstellen der Faktoren, bei Summe und Differenz durch <Formel tex="h(x)=0" nach="." /></li>
          <li>Verhalten für sehr große und sehr kleine <Formel tex="x" /> betrachten: Asymptote?</li>
          <li>Einige Punkte per Ordinatenaddition oder Rechnung bestimmen und das Schaubild skizzieren.</li>
        </ol>
      </Abschnitt>
    </>
  );
}
