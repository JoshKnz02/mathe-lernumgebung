import type { ReactNode } from 'react';
import { Abschnitt } from '@/components/Abschnitt';
import { AufKlick } from '@/components/AufKlick';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage, type Option } from '@/components/Auswahlfrage';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Funktionsgraph } from '@/components/Funktionsgraph';
import { Hinweis } from '@/components/Hinweis';
import { Rechenkette } from '@/components/Rechenkette';
import { A1, A3, A7, A9, A10, FARBE_U, FARBE_UV, FARBE_V, FARBE_VU } from './daten';
import { KetteBild } from './KetteBild';
import { Oelfleck } from './Oelfleck';
import { Verkettungslabor } from './Verkettungslabor';

const opt = (id: string, text: ReactNode, richtig: boolean, rueckmeldung: ReactNode): Option => ({ id, text, richtig, rueckmeldung });

function Extern({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children} (öffnet in einem neuen Tab)
    </a>
  );
}

const BILDER = {
  v1: <KetteBild u="quad" v="lin" umgekehrt bereich={[-3, 3, -3, 9]} teilung={1} beschreibung="Schaubilder von x², 2x minus 1, der Verkettung (2x minus 1) im Quadrat und der Verkettung 2 x² minus 1. Die beiden Verkettungen sind verschieden, bei x gleich 2 ist die erste 9 und die zweite 7." />,
  v2: <KetteBild u="cos" v="quad" bereich={[-3, 3, -3, 3]} teilung={1} beschreibung="Schaubilder von Kosinus von x, x² und der Verkettung Kosinus von x². Die Verkettung ist achsensymmetrisch zur y-Achse." />,
  v3: <KetteBild u="exp" v="cos" bereich={[-6, 6, -2, 4]} teilung={2} beschreibung="Schaubilder von e hoch x, Kosinus von x und der Verkettung e hoch Kosinus von x. Die Verkettung liegt immer oberhalb der x-Achse und hat keine Nullstelle." />,
  a1: <KetteBild u="exp" v="cos" umgekehrt bereich={[-4, 4, -2, 4]} teilung={1} beschreibung="Schaubilder von e hoch x, Kosinus von x, der Verkettung e hoch Kosinus von x und der Verkettung Kosinus von e hoch x. Die zweite schwingt rechts immer schneller und nähert sich links dem Wert 1." />,
  a2: <KetteBild u="sin" v="lin" bereich={[-4, 4, -3, 3]} teilung={1} beschreibung="Schaubilder von Sinus von x, 2x minus 1 und der Verkettung Sinus von 2x minus 1. Die Verkettung ist in x-Richtung gestaucht und um 0,5 nach rechts verschoben, ihre Periode ist π." />,
  a3: <KetteBild u="lin" v="sin" umgekehrt bereich={[-6, 6, -4, 4]} teilung={2} beschreibung="Schaubilder von 2x minus 1, Sinus von x, der Verkettung 2 Sinus von x minus 1 und der Verkettung Sinus von 2x minus 1. Die erste ist in y-Richtung gestreckt und um 1 nach unten verschoben, die zweite in x-Richtung gestaucht." />,
  a4: <KetteBild u="sin" v="quad" bereich={[-4, 4, -3, 3]} teilung={1} beschreibung="Schaubilder von Sinus von x, x² und der Verkettung Sinus von x². Die Nullstellen liegen bei null und bei plus und minus Wurzel aus k mal π. Sie liegen nach außen immer dichter." />,
  a5s1: <KetteBild u="quad" v="sin" bereich={[-6, 6, -2, 2]} teilung={2} beschreibung="Schaubilder von x², Sinus von x und der Verkettung Sinus von x im Quadrat. Die Verkettung ist achsensymmetrisch zur y-Achse." />,
  a5s2: <KetteBild u="sin" v="kub" bereich={[-2, 2, -3, 3]} teilung={1} beschreibung="Schaubilder von Sinus von x, x hoch 3 und der Verkettung Sinus von x hoch 3. Die Verkettung ist punktsymmetrisch zum Ursprung." />,
  a5s3: <KetteBild u="exp" v="sin" bereich={[-6, 6, -2, 4]} teilung={2} beschreibung="Schaubilder von e hoch x, Sinus von x und der Verkettung e hoch Sinus von x. Die Verkettung hat keine Symmetrie." />,
  a6: <KetteBild u="cos" v="sin" bereich={[-7, 7, -2, 2]} teilung={2} beschreibung="Schaubilder von Kosinus von x, Sinus von x und der Verkettung Kosinus von Sinus von x. Die Verkettung wiederholt sich nach π." />,
  a7a: <KetteBild u="wurzel" v="lin" bereich={[-2, 6, -3, 5]} teilung={1} beschreibung="Schaubilder von Wurzel aus x, 2x minus 1 und der Verkettung Wurzel aus 2x minus 1. Die Verkettung beginnt bei x gleich 0,5, dort ist 2x minus 1 gleich 0." />,
  a7b: <KetteBild u="wurzel" v="sin" bereich={[-7, 7, -3, 3]} teilung={2} beschreibung="Schaubilder von Wurzel aus x, Sinus von x und der Verkettung Wurzel aus Sinus von x. Die Verkettung gibt es nur dort, wo Sinus von x nicht negativ ist, also in Stücken." />,
} as const;

export default function Modul() {
  return (
    <>
      <Abschnitt id="erklaeren" titel="Erklären">
        <h3>Funktionen hintereinander ausführen</h3>
        <p>
          Bisher hast du Funktionen durch Addition, Subtraktion und Multiplikation verknüpft. Manche Funktionen entstehen so nicht. Zum Beispiel lässt sich <Formel tex={String.raw`f(x)=e^{\cos x}`} /> nicht als Summe, Differenz oder Produkt von <Formel tex="e^x" /> und <Formel tex={String.raw`\cos x`} /> schreiben. Hier rechnest du zuerst <Formel tex={String.raw`\cos x`} /> aus und setzt das Ergebnis in <Formel tex="e^x" /> ein. Du führst zwei Funktionen <strong>hintereinander</strong> aus. Das nennt man <strong>Verkettung</strong>.
        </p>
        <p>
          Auch im Alltag kommt das vor: Eine gesuchte Größe wird nicht in einem Schritt aus der Eingabe berechnet, sondern über ein Zwischenergebnis. Beispiel Ölfleck: Ein Ölfleck ist kreisförmig. Sein Radius hängt von der Zeit ab, seine Fläche hängt vom Radius ab. Verändere die Zeit <Formel tex="t" /> und beobachte das Zwischenergebnis <Formel tex="r" nach="." />
        </p>
        <Oelfleck />
        <p>
          Du kannst die beiden Schritte zu einem zusammenfassen und die Fläche direkt aus <Formel tex="t" /> berechnen. Dazu setzt du den Term von <Formel tex="r(t)" /> in den von <Formel tex="A(r)" /> ein:
        </p>
        <Formel anzeige tex={String.raw`A(r(t))=\pi\,\bigl(2+0{,}5\,t\bigr)^2`} />
        <p>
          Das Zwischenergebnis ist dann im Term nicht mehr zu sehen. Kontrolle für <Formel tex="t=4" nach=":" /> <Formel tex="r(4)=4" nach="," /> <Formel tex={String.raw`A=\pi\cdot 4^2=16\pi\approx 50{,}27`} nach="." />
        </p>

        <h3>Schreibweise</h3>
        <Hinweis art="merksatz" titel="Verkettung von Funktionen">
          <p>
            Sind <Formel tex="v" /> und <Formel tex="u" /> Funktionen, dann heißt die Funktion <Formel tex={String.raw`u\circ v`} /> mit
          </p>
          <Formel anzeige tex={String.raw`(u\circ v)(x)=u\bigl(v(x)\bigr)`} />
          <p>
            die <strong>Verkettung</strong> von <Formel tex="u" /> und <Formel tex="v" nach="." /> Man liest „<Formel tex="u" /> nach <Formel tex="v" nach="“." /> Die zuerst angewendete Funktion <Formel tex="v" /> heißt <strong>innere Funktion</strong>, die danach angewendete Funktion <Formel tex="u" /> heißt <strong>äußere Funktion</strong>.
          </p>
        </Hinweis>
        <Rechenkette
          eingabe={<Formel tex="x" />}
          schritte={[
            { name: <>innere Funktion <Formel tex="v" /></>, vorschrift: <Formel tex="v(x)" />, ergebnis: <Formel tex="v(x)" /> },
            { name: <>äußere Funktion <Formel tex="u" /></>, vorschrift: <Formel tex="u(v(x))" />, ergebnis: <Formel tex="u(v(x))" /> },
          ]}
          beschreibung="Die Eingabe x wird zuerst in die innere Funktion v eingesetzt. Das Ergebnis v von x wird in die äußere Funktion u eingesetzt. Ergebnis ist u von v von x."
        />
        <p>
          Beispiel: Für <Formel tex={String.raw`f(x)=e^{\cos x}`} /> ist <Formel tex={String.raw`v(x)=\cos x`} /> die innere und <Formel tex="u(x)=e^x" /> die äußere Funktion, also <Formel tex={String.raw`f=u\circ v`} nach="." />
        </p>
        <p>
          Du kannst auch die Reihenfolge tauschen. Dann steht <Formel tex="u" /> innen: <Formel tex={String.raw`(v\circ u)(x)=v\bigl(u(x)\bigr)=\cos\bigl(e^x\bigr)`} nach="." />
        </p>

        <h3>Funktionsterm bilden</h3>
        <p>
          Für <Formel tex="u(x)=2x^2+1" /> und <Formel tex="v(x)=x-3" /> bildest du den Term von <Formel tex={String.raw`u\circ v`} nach="," /> indem du in <Formel tex="u" /> für <Formel tex="x" /> den Term von <Formel tex="v" /> einsetzt. Der eingesetzte Term steht in Klammern:
        </p>
        <ul className="liste">
          <li>
            <Formel tex={String.raw`(u\circ v)(x)=u\bigl(v(x)\bigr)=2\,(x-3)^2+1`} nach="," />
          </li>
          <li>
            <Formel tex={String.raw`(v\circ u)(x)=v\bigl(u(x)\bigr)=(2x^2+1)-3=2x^2-2`} nach="." />
          </li>
        </ul>
        <p>
          Einen Funktionswert berechnest du von innen nach außen. Für <Formel tex={String.raw`(u\circ v)(5)`} nach=":" />
        </p>
        <Rechenkette
          eingabe={<Formel tex="x=5" />}
          schritte={[
            { name: <Formel tex="v" />, vorschrift: <Formel tex="v(5)=5-3" />, ergebnis: <Formel tex="2" /> },
            { name: <Formel tex="u" />, vorschrift: <Formel tex="u(2)=2\cdot 2^2+1" />, ergebnis: <Formel tex="9" /> },
          ]}
          beschreibung="Die Zahl 5 wird in v eingesetzt, das ergibt 2. Die Zahl 2 wird in u eingesetzt, das ergibt 9."
        />

        <h3>Innere und äußere Funktion erkennen</h3>
        <p>
          Frage dich: Was wird zuerst ausgerechnet? Das ist die innere Funktion. Was geschieht danach mit dem Ergebnis? Das ist die äußere Funktion. Beispiel <Formel tex="f(x)=(3x+1)^4" nach=":" />
        </p>
        <Rechenkette
          eingabe={<Formel tex="x" />}
          schritte={[
            { name: <>innen</>, vorschrift: <Formel tex="v(x)=3x+1" />, ergebnis: <Formel tex="3x+1" /> },
            { name: <>außen</>, vorschrift: <Formel tex="u(v)=v^4" />, ergebnis: <Formel tex="(3x+1)^4" /> },
          ]}
          beschreibung="Zuerst wird 3x plus 1 berechnet, das ist die innere Funktion. Danach wird das Ergebnis mit 4 potenziert, das ist die äußere Funktion."
        />
        <p>
          Entsprechend gilt für <Formel tex="f(x)=e^{2x-1}" nach=":" /> innen <Formel tex="v(x)=2x-1" nach="," /> außen <Formel tex="u(v)=e^v" nach="." />
        </p>

        <h3>Definitionsbereich</h3>
        <p>
          Die Verkettung <Formel tex={String.raw`u\circ v`} /> kann an einer Stelle <Formel tex="x" /> nur berechnet werden, wenn <Formel tex="x" /> zum Definitionsbereich von <Formel tex="v" /> gehört und das Zwischenergebnis <Formel tex="v(x)" /> zum Definitionsbereich von <Formel tex="u" nach="." /> Beispiel <Formel tex={String.raw`f(x)=\sqrt{x-2}`} nach=":" /> Die Wurzel ist nur für nicht negative Zahlen definiert, also muss <Formel tex="x-2\ge 0" /> gelten. Der Definitionsbereich ist <Formel tex={String.raw`[2;\,\infty[`} nach="." />
        </p>
        <Funktionsgraph
          bereich={[-1, 8, -3, 4]}
          xTeilung={1}
          yTeilung={1}
          xBeschriftung="zahl"
          className="brett-3zu2"
          kurven={[
            { f: (x) => x - 2, farbe: FARBE_V, gestrichelt: true },
            { f: (x) => (x >= 2 ? Math.sqrt(x - 2) : NaN), farbe: FARBE_UV },
          ]}
          beschreibung="Schaubild der Funktion Wurzel aus x minus 2 und, gestrichelt, die Gerade x minus 2. Das Schaubild beginnt bei x gleich 2, dort ist x minus 2 gleich 0."
        />
        <p className="klein">
          Schwarz gestrichelt: der Term <Formel tex="v(x)=x-2" nach="," /> blau: <Formel tex={String.raw`f(x)=\sqrt{x-2}`} nach="." /> Das Schaubild von <Formel tex="f" /> beginnt dort, wo <Formel tex="v(x)" /> null wird.
        </p>
      </Abschnitt>

      <Abschnitt id="entdecken" titel="Entdecken">
        <h3>Vermutung</h3>
        <p>Überlege zuerst, bevor du das Labor benutzt. Notiere deine Vermutungen.</p>
        <ol className="auftraege">
          <li>
            <p>
              Gegeben sind <Formel tex="u(x)=x^2" /> und <Formel tex="v(x)=2x-1" nach="." /> Berechne <Formel tex="u(v(2))" /> und <Formel tex="v(u(2))" nach="." /> Ist es gleichgültig, in welcher Reihenfolge man die Funktionen verkettet?
            </p>
            <Beobachtung bild={BILDER.v1}>
              <Formel tex="v(2)=3" /> und <Formel tex="u(3)=9" nach="," /> also <Formel tex="u(v(2))=9" nach="." /> Dagegen ist <Formel tex="u(2)=4" /> und <Formel tex="v(4)=7" nach="," /> also <Formel tex="v(u(2))=7" nach="." /> Die Reihenfolge ist wichtig: <Formel tex={String.raw`u\circ v`} /> und <Formel tex={String.raw`v\circ u`} /> sind im Allgemeinen verschiedene Funktionen.
            </Beobachtung>
          </li>
          <li>
            <p>
              <Formel tex="v(x)=x^2" /> ist achsensymmetrisch zur y-Achse. Welche Symmetrie hat <Formel tex={String.raw`f(x)=\cos(x^2)`} nach="?" />
            </p>
            <Hinweis titel="Woran du Symmetrie erkennst">
              <ul className="liste">
                <li>
                  <strong>Achsensymmetrisch zur y-Achse:</strong> Es gilt <Formel tex="f(-x)=f(x)" /> für alle <Formel tex="x" nach="." /> Spiegelt man das Schaubild an der y-Achse, erhält man dasselbe Schaubild.
                </li>
                <li>
                  <strong>Punktsymmetrisch zum Ursprung:</strong> Es gilt <Formel tex="f(-x)=-f(x)" /> für alle <Formel tex="x" nach="." /> Dreht man das Schaubild um 180° um den Ursprung, erhält man dasselbe Schaubild.
                </li>
              </ul>
            </Hinweis>
            <Beobachtung bild={BILDER.v2}>
              <Formel tex={String.raw`f(-x)=\cos\bigl((-x)^2\bigr)=\cos(x^2)=f(x)`} nach="." /> Also ist <Formel tex="K_f" /> achsensymmetrisch zur y-Achse.
            </Beobachtung>
          </li>
          <li>
            <p>
              Hat <Formel tex={String.raw`f(x)=e^{\cos x}`} /> Nullstellen?
            </p>
            <Beobachtung bild={BILDER.v3}>
              Nein. Es gilt <Formel tex="e^z>0" /> für jede Zahl <Formel tex="z" nach="," /> also auch für <Formel tex={String.raw`z=\cos x`} nach="." /> Die äußere Funktion hat keine Nullstelle, deshalb hat auch die Verkettung keine.
            </Beobachtung>
          </li>
        </ol>

        <h3>Labor</h3>
        <p>
          Wähle die äußere Funktion <Formel tex="u" /> und die innere Funktion <Formel tex="v" nach="." /> Das Schaubild der Verkettung <Formel tex={String.raw`u\circ v`} /> ist dick blau gezeichnet, die Nullstellen sind als Punkte markiert. Mit dem Schalter zeigst du auch <Formel tex={String.raw`v\circ u`} /> in Rosa, also dieselben Funktionen in umgekehrter Reihenfolge. Die Tabelle nennt Eigenschaften der Funktionen und der Verkettungen.
        </p>
        <Verkettungslabor />

        <h3>Untersuchungsaufträge</h3>
        <p>Beantworte die Fragen zuerst mit dem Labor. Danach kannst du deine Beobachtung vergleichen.</p>
        <ol className="auftraege">
          <li>
            <p>
              <strong>Reihenfolge.</strong> Wähle <Formel tex="u(x)=e^x" /> und <Formel tex={String.raw`v(x)=\cos x`} /> und zeige <Formel tex={String.raw`v\circ u`} nach="." /> Vergleiche die beiden Verkettungen: Wie verlaufen sie, wo liegen ihre Werte, welche Nullstellen haben sie? Probiere eine zweite Funktionenpaarung.
            </p>
            <Beobachtung bild={BILDER.a1}>
              <Formel tex={String.raw`e^{\cos x}`} /> bleibt immer zwischen <Formel tex="e^{-1}\approx 0{,}37" /> und <Formel tex="e\approx 2{,}72" nach="," /> hat keine Nullstelle und wiederholt sich nach <Formel tex={String.raw`2\pi`} nach="." /> <Formel tex={String.raw`\cos\bigl(e^x\bigr)`} /> schwingt zwischen <Formel tex="-1" /> und <Formel tex="1" nach="," /> rechts immer schneller, weil <Formel tex="e^x" /> schnell wächst, und nähert sich links dem Wert <Formel tex="1" nach="," /> weil <Formel tex="e^x" /> dort gegen 0 geht und <Formel tex={String.raw`\cos 0=1`} nach="." /> Die Nullstellen liegen bei <Formel tex={String.raw`e^x=\tfrac{\pi}{2}+k\pi`} nach="," /> also erst ab <Formel tex={String.raw`x=\ln\tfrac{\pi}{2}\approx 0{,}45`} nach="." /> Die Reihenfolge verändert die Funktion grundlegend.
            </Beobachtung>
          </li>
          <li>
            <p>
              <strong>Lineare Funktion innen.</strong> Wähle <Formel tex={String.raw`u(x)=\sin x`} /> und <Formel tex="v(x)=2x-1" nach="." /> Was geschieht mit dem Schaubild von <Formel tex={String.raw`\sin x`} nach="?" /> Welche Periode liest du in der Tabelle ab? Erinnere dich an die Parameter <Formel tex="b" /> und <Formel tex="c" /> der allgemeinen Sinusfunktion.
            </p>
            <Beobachtung bild={BILDER.a2}>
              Das Schaubild ist in x-Richtung gestaucht und nach rechts verschoben. Es gilt <Formel tex={String.raw`\sin(2x-1)=\sin\bigl(2\,(x-0{,}5)\bigr)`} nach="," /> also <Formel tex="b=2" /> und <Formel tex="c=0{,}5" nach="." /> Die Periode ist <Formel tex={String.raw`\tfrac{2\pi}{2}=\pi`} nach="." /> Eine lineare innere Funktion wirkt auf die x-Werte (x-Richtung).
            </Beobachtung>
          </li>
          <li>
            <p>
              <strong>Lineare Funktion außen.</strong> Wähle <Formel tex="u(x)=2x-1" /> und <Formel tex={String.raw`v(x)=\sin x`} /> und zeige <Formel tex={String.raw`v\circ u`} nach="." /> Vergleiche mit dem Auftrag davor. Was bewirkt eine lineare äußere Funktion?
            </p>
            <Beobachtung bild={BILDER.a3}>
              <Formel tex={String.raw`(u\circ v)(x)=2\sin x-1`} nach=":" /> Das Schaubild von <Formel tex={String.raw`\sin x`} /> ist in y-Richtung mit <Formel tex="a=2" /> gestreckt und um <Formel tex="d=-1" /> in y-Richtung verschoben. Die Periode bleibt <Formel tex={String.raw`2\pi`} nach="." /> Eine lineare äußere Funktion wirkt auf die y-Werte (y-Richtung). <Formel tex={String.raw`(v\circ u)(x)=\sin(2x-1)`} /> ist dagegen die Funktion aus dem Auftrag davor. Die Reihenfolge entscheidet, ob in x- oder in y-Richtung verändert wird.
            </Beobachtung>
          </li>
          <li>
            <p>
              <strong>Nullstellen.</strong> Wähle <Formel tex={String.raw`u(x)=\sin x`} /> und <Formel tex="v(x)=x^2" nach="." /> Wo liegen die Nullstellen von <Formel tex={String.raw`u\circ v`} nach="?" /> Wie hängen sie mit den Nullstellen von <Formel tex="u" /> zusammen? Probiere auch <Formel tex={String.raw`u(x)=\cos x`} /> mit <Formel tex="v(x)=2x-1" /> und <Formel tex="u(x)=e^x" /> mit einer beliebigen inneren Funktion.
            </p>
            <Beobachtung bild={BILDER.a4}>
              Die Verkettung <Formel tex={String.raw`u\circ v`} /> ist null, wenn <Formel tex="v(x)" /> eine Nullstelle von <Formel tex="u" /> ist. Bei <Formel tex={String.raw`\sin(x^2)`} /> muss <Formel tex={String.raw`x^2=k\pi`} /> gelten, also <Formel tex="x=0" /> und <Formel tex={String.raw`x=\pm\sqrt{k\pi}`} nach="." /> Die Nullstellen liegen nach außen immer dichter. Bei <Formel tex={String.raw`\cos(2x-1)`} /> gilt <Formel tex={String.raw`2x-1=\tfrac{\pi}{2}+k\pi`} nach="." /> Hat die äußere Funktion keine Nullstelle (wie <Formel tex="e^x" nach=")," /> hat die Verkettung auch keine.
            </Beobachtung>
          </li>
          <li>
            <p>
              <strong>Symmetrie.</strong> Untersuche mit geeigneten Paaren: Welche Symmetrie hat <Formel tex={String.raw`u\circ v`} nach="," /> wenn <Formel tex="v" /> achsensymmetrisch ist (<Formel tex="x^2" nach="," /> <Formel tex={String.raw`\cos x`} nach=")?" /> Wenn <Formel tex="v" /> punktsymmetrisch ist (<Formel tex="x^3" nach="," /> <Formel tex={String.raw`\sin x`} nach=")?" /> Was kommt es dabei auf <Formel tex="u" /> an?
            </p>
            <Beobachtung
              bild={
                <>
                  <div className="bilder-paar">
                    {BILDER.a4}
                    {BILDER.a5s1}
                  </div>
                  <div className="bilder-paar">
                    {BILDER.a5s2}
                    {BILDER.a5s3}
                  </div>
                </>
              }
            >
              <table className="tabelle tabelle-kompakt">
                <thead>
                  <tr>
                    <th scope="col">innere Funktion <Formel tex="v" /></th>
                    <th scope="col">äußere Funktion <Formel tex="u" /></th>
                    <th scope="col">Verkettung <Formel tex={String.raw`u\circ v`} /></th>
                  </tr>
                </thead>
                <tbody>
                  <tr><th scope="row">achsensymmetrisch</th><td>beliebig</td><td>achsensymmetrisch</td></tr>
                  <tr><th scope="row">punktsymmetrisch</th><td>achsensymmetrisch</td><td>achsensymmetrisch</td></tr>
                  <tr><th scope="row">punktsymmetrisch</th><td>punktsymmetrisch</td><td>punktsymmetrisch</td></tr>
                  <tr><th scope="row">punktsymmetrisch</th><td>keine Symmetrie</td><td>keine Symmetrie</td></tr>
                  <tr><th scope="row">keine Symmetrie</th><td>beliebig</td><td>keine Symmetrie</td></tr>
                </tbody>
              </table>
              Der Grund bei achsensymmetrischem <Formel tex="v" nach=":" /> Weil <Formel tex="v(-x)=v(x)" /> gilt, ist auch <Formel tex="u(v(-x))=u(v(x))" nach="." /> Bei punktsymmetrischem <Formel tex="v" /> ist <Formel tex="v(-x)=-v(x)" nach="," /> es kommt auf <Formel tex="u" /> an: <Formel tex="u(-z)=u(z)" /> ergibt Achsensymmetrie, <Formel tex="u(-z)=-u(z)" /> ergibt Punktsymmetrie. Bei <Formel tex={String.raw`v(x)=\sqrt{x}`} /> gibt es keine Symmetrie, weil der Definitionsbereich nicht symmetrisch zum Ursprung liegt.
            </Beobachtung>
          </li>
          <li>
            <p>
              <strong>Periode.</strong> Wähle <Formel tex={String.raw`u(x)=\cos x`} /> und <Formel tex={String.raw`v(x)=\sin x`} nach="," /> dann <Formel tex={String.raw`u(x)=\sin x`} /> und <Formel tex="v(x)=x^2" nach="." /> Bei welcher Verkettung steht in der Tabelle eine Periode? Das Schaubild von <Formel tex={String.raw`\sin(x^2)`} /> sieht wellig aus. Ist es periodisch?
            </p>
            <Beobachtung
              bild={
                <div className="bilder-paar">
                  {BILDER.a6}
                  {BILDER.a4}
                </div>
              }
            >
              Ist die innere Funktion periodisch, ist die Verkettung periodisch, denn nach einer Periode von <Formel tex="v" /> kehrt <Formel tex="v(x)" /> zurück und damit auch <Formel tex="u(v(x))" nach="." /> Bei <Formel tex={String.raw`\cos(\sin x)`} /> ist die Periode sogar nur <Formel tex={String.raw`\pi`} nach="," /> weil <Formel tex={String.raw`\sin(x+\pi)=-\sin x`} /> ist und der Kosinus das Vorzeichen nicht bemerkt. <Formel tex={String.raw`\sin(x^2)`} /> ist nicht periodisch: Die Nullstellen <Formel tex={String.raw`\pm\sqrt{k\pi}`} /> haben keinen gleichen Abstand, die Wellen werden nach außen enger.
            </Beobachtung>
          </li>
          <li>
            <p>
              <strong>Definitionsbereich.</strong> Wähle <Formel tex={String.raw`u(x)=\sqrt{x}`} /> und <Formel tex="v(x)=2x-1" nach="," /> dann <Formel tex={String.raw`v(x)=\sin x`} nach="." /> Lies den Definitionsbereich in der Tabelle ab und vergleiche ihn mit dem Schaubild.
            </p>
            <Beobachtung
              bild={
                <div className="bilder-paar">
                  {BILDER.a7a}
                  {BILDER.a7b}
                </div>
              }
            >
              Die Wurzel verlangt ein nicht negatives Zwischenergebnis. Bei <Formel tex={String.raw`\sqrt{2x-1}`} /> muss <Formel tex="2x-1\ge 0" /> gelten, also <Formel tex="x\ge 0{,}5" nach="." /> Bei <Formel tex={String.raw`\sqrt{\sin x}`} /> muss <Formel tex={String.raw`\sin x\ge 0`} /> gelten. Das Schaubild besteht aus einzelnen Stücken über <Formel tex={String.raw`[0;\,\pi]`} nach="," /> <Formel tex={String.raw`[2\pi;\,3\pi]`} /> und so weiter, außerdem links davon.
            </Beobachtung>
          </li>
        </ol>

        <h3>Weiterführend mit GeoGebra</h3>
        <p>
          Die folgende Aktivität gehört zum Einstieg in das Thema. Sie liegt auf geogebra.org. Erst wenn du den Link anklickst, wird die Seite von GeoGebra geladen.
        </p>
        <ul className="liste">
          <li>
            <Extern href="https://www.geogebra.org/m/yharbbas">GeoGebra-Aktivität: Schaubilder von Verkettungen</Extern>
          </li>
        </ul>
      </Abschnitt>

      <Abschnitt id="ueberpruefen" titel="Überprüfen">
        <p>
          Gib Zahlen als Dezimalzahl (<code>0,87</code>) oder als Bruch (zum Beispiel <Formel tex="\frac{1}{4}" nach=")" /> ein. Bei den Auswahlfragen wird deine Antwort erklärt, nicht nur bewertet.
        </p>

        <Aufgabe
          nummer={1}
          titel="Funktionswerte von Verkettungen"
          felder={[
            { id: 'a', beschriftung: <Formel tex="u(v(2))" />, name: 'u von v von 2', erwartet: A1.uvon2 },
            { id: 'b', beschriftung: <Formel tex="v(u(2))" />, name: 'v von u von 2', erwartet: A1.vuvon2 },
            { id: 'c', beschriftung: <Formel tex={String.raw`(v\circ u)(4)`} />, name: 'v nach u an der Stelle 4', erwartet: A1.vuvon4 },
            { id: 'd', beschriftung: <Formel tex={String.raw`(u\circ u)(5)`} />, name: 'u nach u an der Stelle 5', erwartet: A1.uuvon5 },
          ]}
          hilfen={[
            <>Rechne von innen nach außen. Bei <Formel tex="u(v(2))" /> berechnest du zuerst <Formel tex="v(2)" nach="." /></>,
            <>
              Bei <Formel tex={String.raw`(v\circ u)(4)`} /> ist <Formel tex="u" /> die innere Funktion: zuerst <Formel tex="u(4)" nach="," /> dann das Ergebnis in <Formel tex="v" /> einsetzen.
            </>,
            <>
              Bei <Formel tex={String.raw`(u\circ u)(5)`} /> wird zweimal dieselbe Funktion angewendet.
            </>,
          ]}
          loesung={[
            <>
              <Formel tex="v(2)=2^2+1=5" /> und <Formel tex="u(5)=2\cdot 5-3=7" nach="." /> Also <Formel tex="u(v(2))=7" nach="." />
            </>,
            <>
              <Formel tex="u(2)=1" /> und <Formel tex="v(1)=1^2+1=2" nach="," /> also <Formel tex="v(u(2))=2" nach="." /> Die Reihenfolge ändert das Ergebnis.
            </>,
            <>
              <Formel tex="u(4)=5" /> und <Formel tex="v(5)=26" nach="," /> also <Formel tex={String.raw`(v\circ u)(4)=26`} nach="." /> Für <Formel tex={String.raw`(u\circ u)(5)`} nach=":" /> <Formel tex="u(5)=7" /> und <Formel tex="u(7)=11" nach="." />
              <Rechenkette
                eingabe={<Formel tex="5" />}
                schritte={[
                  { name: <Formel tex="u" />, vorschrift: <Formel tex="u(5)=2\cdot 5-3" />, ergebnis: <Formel tex="7" /> },
                  { name: <Formel tex="u" />, vorschrift: <Formel tex="u(7)=2\cdot 7-3" />, ergebnis: <Formel tex="11" /> },
                ]}
                beschreibung="Die Zahl 5 wird in u eingesetzt, das ergibt 7. Die Zahl 7 wird wieder in u eingesetzt, das ergibt 11."
              />
            </>,
          ]}
        >
          <p>
            Gegeben sind <Formel tex="u(x)=2x-3" /> und <Formel tex="v(x)=x^2+1" nach="." /> Berechne die Funktionswerte.
          </p>
        </Aufgabe>

        <Auswahlfrage
          nummer="2"
          titel="Funktionsterm der Verkettung"
          optionen={[
            opt('a', <Formel tex={String.raw`3-\sqrt{x}`} />, false, <>Das ist <Formel tex="v(u(x))" nach="." /> Hier wurde zuerst die Wurzel gezogen und dann von 3 abgezogen. Gefragt ist aber <Formel tex="u(v(x))" nach="," /> zuerst wird <Formel tex="v" /> angewendet.</>),
            opt('b', <Formel tex={String.raw`\sqrt{x}-3`} />, false, <>Hier wurde <Formel tex="v" /> falsch aufgefasst. Für <Formel tex="v(x)=3-x" /> stünde bei <Formel tex="v(u(x))" /> der Term <Formel tex={String.raw`3-\sqrt{x}`} nach="," /> nicht <Formel tex={String.raw`\sqrt{x}-3`} nach="." /></>),
            opt('c', <Formel tex={String.raw`\sqrt{3-x}`} />, true, <>Richtig, in <Formel tex={String.raw`\sqrt{x}`} /> steht für <Formel tex="x" /> der Term <Formel tex="3-x" nach="." /></>),
            opt('d', <Formel tex={String.raw`\sqrt{x}\cdot(3-x)`} />, false, <>Das ist das Produkt <Formel tex="u\cdot v" nach="," /> keine Verkettung. Bei der Verkettung wird der Term von <Formel tex="v" /> in <Formel tex="u" /> eingesetzt.</>),
          ]}
          erklaerung={
            <>
              <Formel tex="u(v(x))" nach=":" /> Zuerst wird <Formel tex="v(x)=3-x" /> berechnet, dieses Ergebnis kommt unter die Wurzel.
              <Rechenkette
                eingabe={<Formel tex="x" />}
                schritte={[
                  { name: <Formel tex="v" />, vorschrift: <Formel tex="v(x)=3-x" />, ergebnis: <Formel tex="3-x" /> },
                  { name: <Formel tex="u" />, vorschrift: <Formel tex={String.raw`u(z)=\sqrt{z}`} />, ergebnis: <Formel tex={String.raw`\sqrt{3-x}`} /> },
                ]}
                beschreibung="Zuerst wird 3 minus x berechnet, dann daraus die Wurzel gezogen."
              />
            </>
          }
        >
          <p>
            Gegeben sind <Formel tex={String.raw`u(x)=\sqrt{x}`} /> und <Formel tex="v(x)=3-x" nach="." /> Wie lautet der Term von <Formel tex={String.raw`u\circ v`} nach="?" />
          </p>
        </Auswahlfrage>

        <Aufgabe
          nummer={3}
          titel="Reihenfolge der Verkettung"
          felder={[
            { id: 'f', beschriftung: <Formel tex="f(3)" />, name: 'f von 3', erwartet: A3.fvon3 },
            { id: 'g', beschriftung: <Formel tex="g(3)" />, name: 'g von 3', erwartet: A3.gvon3 },
          ]}
          hilfen={[
            <>
              Bilde zuerst die Terme. Bei <Formel tex={String.raw`f=u\circ v`} /> setzt du den Term von <Formel tex="v" /> in <Formel tex="u" /> ein, bei <Formel tex={String.raw`g=v\circ u`} /> umgekehrt.
            </>,
            <>
              <Formel tex="f(x)=(2x+1)^2" /> und <Formel tex="g(x)=2x^2+1" nach="." />
            </>,
          ]}
          loesung={[
            <>
              <Formel tex={String.raw`f(x)=u\bigl(v(x)\bigr)=(2x+1)^2`} nach="." /> Für <Formel tex="x=3" nach=":" /> <Formel tex="v(3)=7" /> und <Formel tex="u(7)=49" nach="." />
            </>,
            <>
              <Formel tex={String.raw`g(x)=v\bigl(u(x)\bigr)=2x^2+1`} nach="." /> Für <Formel tex="x=3" nach=":" /> <Formel tex="u(3)=9" /> und <Formel tex="v(9)=19" nach="." />
            </>,
            <>
              Die beiden Schaubilder sind verschieden: <Formel tex="K_f" /> ist eine nach links verschobene Parabel, <Formel tex="K_g" /> eine in y-Richtung gestreckte Parabel um <Formel tex="(0\,|\,1)" nach="." />
              <Funktionsgraph
                bereich={[-4, 4, -2, 12]}
                xTeilung={1}
                yTeilung={2}
                xBeschriftung="zahl"
                className="brett-3zu2"
                kurven={[
                  { f: (x) => A3.u(A3.v(x)), farbe: FARBE_UV },
                  { f: (x) => A3.v(A3.u(x)), farbe: FARBE_VU },
                ]}
                beschreibung="Schaubild K_f von f(x) = (2x + 1)², eine Parabel mit Scheitel bei x = −0,5, und Schaubild K_g von g(x) = 2x² + 1, eine Parabel mit Scheitel bei (0 | 1). Bei x = 3 hat K_f den Wert 49 und K_g den Wert 19."
              />
              <p className="klein">
                Blau: <Formel tex="K_f" nach="," /> rosa: <Formel tex="K_g" nach="." />
              </p>
            </>,
          ]}
        >
          <p>
            Gegeben sind <Formel tex="u(x)=x^2" /> und <Formel tex="v(x)=2x+1" nach="." /> Es sei <Formel tex={String.raw`f=u\circ v`} /> und <Formel tex={String.raw`g=v\circ u`} nach="." /> Berechne <Formel tex="f(3)" /> und <Formel tex="g(3)" nach="." />
          </p>
        </Aufgabe>

        <Auswahlfrage
          nummer="4"
          titel="Innere und äußere Funktion"
          optionen={[
            opt('a', <>innere Funktion <Formel tex="v(x)=x^3" nach="," /> äußere Funktion <Formel tex="u(v)=5-2v" /></>, false, <>Das wäre <Formel tex="5-2x^3" nach="." /> Bei <Formel tex="(5-2x)^3" /> steht das Potenzieren am Ende, es ist der letzte Schritt.</>),
            opt('b', <>Es liegt keine Verkettung vor, weil nur ein Term vorkommt.</>, false, <>Es werden zwei Schritte nacheinander ausgeführt: erst <Formel tex="5-2x" nach="," /> dann hoch 3. Das ist eine Verkettung.</>),
            opt('c', <>innere Funktion <Formel tex="v(x)=5-2x" nach="," /> äußere Funktion <Formel tex="u(v)=v^3" /></>, true, <>Richtig.</>),
          ]}
          erklaerung={
            <>
              Zuerst wird <Formel tex="5-2x" /> berechnet, danach wird das Ergebnis mit 3 potenziert. Der erste Schritt ist die innere, der letzte die äußere Funktion.
              <Rechenkette
                eingabe={<Formel tex="x" />}
                schritte={[
                  { name: <>innen</>, vorschrift: <Formel tex="v(x)=5-2x" />, ergebnis: <Formel tex="5-2x" /> },
                  { name: <>außen</>, vorschrift: <Formel tex="u(v)=v^3" />, ergebnis: <Formel tex="(5-2x)^3" /> },
                ]}
                beschreibung="Zuerst wird 5 minus 2x berechnet, danach wird das Ergebnis hoch 3 genommen."
              />
            </>
          }
        >
          <p>
            Was sind die innere und die äußere Funktion von <Formel tex="f(x)=(5-2x)^3" nach="?" />
          </p>
        </Auswahlfrage>

        <Auswahlfrage
          nummer="5"
          titel="Wurzel als äußere Funktion"
          optionen={[
            opt('a', <>innere Funktion <Formel tex="v(x)=x^2+4" nach="," /> äußere Funktion <Formel tex={String.raw`u(v)=\sqrt{v}`} /></>, true, <>Richtig.</>),
            opt('b', <>innere Funktion <Formel tex={String.raw`v(x)=\sqrt{x}`} nach="," /> äußere Funktion <Formel tex="u(v)=v^2+4" /></>, false, <>Das ergäbe <Formel tex={String.raw`(\sqrt{x})^2+4=x+4`} nach="." /> Bei <Formel tex={String.raw`\sqrt{x^2+4}`} /> wird die Wurzel zuletzt gezogen.</>),
            opt('c', <>innere Funktion <Formel tex="v(x)=x^2+4" nach="," /> äußere Funktion <Formel tex="u(v)=v^2" /></>, false, <>Das ergäbe <Formel tex="(x^2+4)^2" nach="." /> Die äußere Funktion ist die Wurzel, nicht das Quadrat.</>),
          ]}
          erklaerung={
            <>
              Von innen nach außen: Zuerst <Formel tex="x^2+4" nach="," /> dann die Wurzel daraus.
              <Rechenkette
                eingabe={<Formel tex="x" />}
                schritte={[
                  { name: <>innen</>, vorschrift: <Formel tex="v(x)=x^2+4" />, ergebnis: <Formel tex="x^2+4" /> },
                  { name: <>außen</>, vorschrift: <Formel tex={String.raw`u(v)=\sqrt{v}`} />, ergebnis: <Formel tex={String.raw`\sqrt{x^2+4}`} /> },
                ]}
                beschreibung="Zuerst wird x im Quadrat plus 4 berechnet, danach wird daraus die Wurzel gezogen."
              />
            </>
          }
        >
          <p>
            Was sind die innere und die äußere Funktion von <Formel tex={String.raw`f(x)=\sqrt{x^2+4}`} nach="?" />
          </p>
        </Auswahlfrage>

        <Auswahlfrage
          nummer="6"
          titel="sin(x²) oder sin²(x)"
          optionen={[
            opt('a', <>Die Funktion <Formel tex={String.raw`\sin x`} /> wird zuerst angewendet, danach wird quadriert.</>, false, <>So entsteht <Formel tex={String.raw`(\sin x)^2`} nach="." /> Bei <Formel tex={String.raw`\sin(x^2)`} /> steht das Quadrat im Argument des Sinus.</>),
            opt('b', <>Die Funktion <Formel tex="x^2" /> wird zuerst angewendet, danach der Sinus.</>, true, <>Richtig.</>),
            opt('c', <>Beide Funktionen werden gleichzeitig angewendet.</>, false, <>Eine Verkettung hat immer eine Reihenfolge: Das Ergebnis des ersten Schritts wird in den zweiten eingesetzt.</>),
          ]}
          erklaerung={
            <>
              Bei <Formel tex={String.raw`\sin(x^2)`} /> ist <Formel tex="v(x)=x^2" /> innen und <Formel tex={String.raw`u(v)=\sin v`} /> außen. Bei <Formel tex={String.raw`\sin^2 x=(\sin x)^2`} /> ist es umgekehrt. Beide Funktionen sehen sehr verschieden aus.
              <Rechenkette
                eingabe={<Formel tex="x" />}
                schritte={[
                  { name: <>innen</>, vorschrift: <Formel tex="x^2" />, ergebnis: <Formel tex="x^2" /> },
                  { name: <>außen</>, vorschrift: <Formel tex={String.raw`\sin`} />, ergebnis: <Formel tex={String.raw`\sin(x^2)`} /> },
                ]}
                beschreibung="Bei Sinus von x im Quadrat wird zuerst x quadriert und dann der Sinus gebildet."
              />
              <Rechenkette
                eingabe={<Formel tex="x" />}
                schritte={[
                  { name: <>innen</>, vorschrift: <Formel tex={String.raw`\sin`} />, ergebnis: <Formel tex={String.raw`\sin x`} /> },
                  { name: <>außen</>, vorschrift: <Formel tex="(\,\cdot\,)^2" />, ergebnis: <Formel tex={String.raw`(\sin x)^2`} /> },
                ]}
                beschreibung="Bei Sinus im Quadrat wird zuerst der Sinus von x gebildet und dann quadriert."
              />
              <div className="bilder-paar">
                <KetteBild u="sin" v="quad" nurKette bereich={[-4, 4, -2, 2]} teilung={1} beschreibung="Schaubild von Sinus von x im Quadrat. Die Wellen werden nach außen enger." />
                <KetteBild u="quad" v="sin" nurKette bereich={[-4, 4, -2, 2]} teilung={1} beschreibung="Schaubild von Sinus von x, dann quadriert. Es verläuft zwischen 0 und 1 und wiederholt sich nach π." />
              </div>
            </>
          }
        >
          <p>
            Welche Funktion wird bei <Formel tex={String.raw`f(x)=\sin(x^2)`} /> zuerst angewendet?
          </p>
        </Auswahlfrage>

        <Aufgabe
          nummer={7}
          titel="Definitionsbereich einer Verkettung"
          felder={[
            { id: 'x1', beschriftung: <Formel tex="x_1" />, name: 'linke Grenze', erwartet: A7.x1 },
            { id: 'x2', beschriftung: <Formel tex="x_2" />, name: 'rechte Grenze', erwartet: A7.x2 },
          ]}
          hilfen={[
            <>
              Die Wurzel ist nur für nicht negative Zahlen definiert. Der Term unter der Wurzel, <Formel tex="v(x)=9-x^2" nach="," /> muss also mindestens 0 sein.
            </>,
            <>
              Löse <Formel tex="9-x^2\ge 0" nach="." /> Wo ist <Formel tex="x^2\le 9" nach="?" />
            </>,
          ]}
          loesung={[
            <>
              Innere Funktion <Formel tex="v(x)=9-x^2" nach="," /> äußere Funktion <Formel tex={String.raw`u(v)=\sqrt{v}`} nach="." /> Es muss <Formel tex="v(x)\ge 0" /> gelten.
            </>,
            <>
              <Formel tex="9-x^2\ge 0" /> bedeutet <Formel tex="x^2\le 9" nach="," /> also <Formel tex="-3\le x\le 3" nach="." /> Der Definitionsbereich ist <Formel tex="[-3;\,3]" nach="." />
            </>,
            <>
              Das Schaubild zeigt es: Die Parabel <Formel tex="K_v" /> liegt zwischen <Formel tex="-3" /> und <Formel tex="3" /> oberhalb der x-Achse, nur dort gibt es <Formel tex="K_f" nach="." />
              <Funktionsgraph
                bereich={[-4, 4, -3, 10]}
                xTeilung={1}
                yTeilung={1}
                xBeschriftung="zahl"
                className="brett-3zu2"
                kurven={[
                  { f: (x) => 9 - x * x, farbe: FARBE_V, gestrichelt: true },
                  { f: (x) => (Math.abs(x) <= 3 ? A7.f(x) : NaN), farbe: FARBE_UV },
                ]}
                beschreibung="Die Parabel v(x) = 9 − x², gestrichelt, und das Schaubild von f(x) = Wurzel aus 9 − x², ein Halbkreis mit Radius 3 über der x-Achse. Es gibt f nur zwischen x = −3 und x = 3."
              />
              <p className="klein">
                Schwarz gestrichelt: <Formel tex="K_v" nach="," /> blau: <Formel tex="K_f" nach="." />
              </p>
            </>,
          ]}
        >
          <p>
            Bestimme den Definitionsbereich von <Formel tex={String.raw`f(x)=\sqrt{9-x^2}`} nach="." /> Gib die Grenzen <Formel tex="x_1" /> und <Formel tex="x_2" /> mit <Formel tex="x_1<x_2" /> an, zwischen denen <Formel tex="f" /> definiert ist.
          </p>
        </Aufgabe>

        <Auswahlfrage
          nummer="8"
          titel="Symmetrie einer Verkettung"
          optionen={[
            opt('a', <>punktsymmetrisch zum Ursprung</>, false, <>Die innere Funktion <Formel tex="x^2+1" /> ist achsensymmetrisch. Dann ist die Verkettung nicht punktsymmetrisch.</>),
            opt('b', <>keine Symmetrie</>, false, <>Ist die innere Funktion achsensymmetrisch, ist es auch die Verkettung, gleich welche äußere Funktion verwendet wird.</>),
            opt('c', <>achsensymmetrisch zur y-Achse</>, true, <>Richtig.</>),
          ]}
          erklaerung={
            <>
              Die innere Funktion <Formel tex="v(x)=x^2+1" /> ist achsensymmetrisch: <Formel tex="v(-x)=v(x)" nach="." /> Also ist <Formel tex={String.raw`f(-x)=\cos\bigl(v(-x)\bigr)=\cos\bigl(v(x)\bigr)=f(x)`} nach="." />
              <Funktionsgraph
                bereich={[-3, 3, -2, 2]}
                xTeilung={1}
                yTeilung={1}
                xBeschriftung="zahl"
                className="brett-3zu2"
                kurven={[{ f: (x) => Math.cos(x * x + 1), farbe: FARBE_UV }]}
                beschreibung="Schaubild von f(x) = Kosinus von x² + 1. Es ist achsensymmetrisch zur y-Achse."
              />
            </>
          }
        >
          <p>
            Welche Symmetrie hat <Formel tex={String.raw`f(x)=\cos(x^2+1)`} nach="?" />
          </p>
        </Auswahlfrage>

        <Aufgabe
          nummer={9}
          titel="Verkettung in der Anwendung"
          felder={[
            { id: 'v', beschriftung: <>Verbrauch in Litern</>, name: 'Verbrauch in Litern', erwartet: A9.verbrauch },
            { id: 'k', beschriftung: <>Kosten in Euro</>, name: 'Kosten in Euro', erwartet: A9.kosten },
            { id: 'a', beschriftung: <>Faktor <Formel tex="a" /> in <Formel tex="K(V(s))=a\cdot s" /></>, name: 'Faktor a', erwartet: A9.faktor },
          ]}
          hilfen={[
            <>Das Zwischenergebnis ist der Verbrauch <Formel tex="V(s)" nach="." /> Berechne ihn zuerst und setze ihn in <Formel tex="K(V)" /> ein.</>,
            <>
              Für den Faktor setzt du den Term von <Formel tex="V(s)" /> in <Formel tex="K(V)" /> ein: <Formel tex={String.raw`K(V(s))=1{,}8\cdot(0{,}06\,s)`} nach="." />
            </>,
          ]}
          loesung={[
            <>
              Verbrauch auf 250 km: <Formel tex={String.raw`V(250)=0{,}06\cdot 250=15`} nach="." />
            </>,
            <>
              Kosten: <Formel tex={String.raw`K(15)=1{,}8\cdot 15=27`} nach="." />
              <Rechenkette
                eingabe={<Formel tex="s=250" />}
                schritte={[
                  { name: <Formel tex="V" />, vorschrift: <Formel tex={String.raw`V(s)=0{,}06\,s`} />, ergebnis: <>15 l</> },
                  { name: <Formel tex="K" />, vorschrift: <Formel tex={String.raw`K(V)=1{,}8\,V`} />, ergebnis: <>27 €</> },
                ]}
                beschreibung="Bei 250 Kilometern beträgt der Verbrauch 15 Liter. Die Kosten dafür sind 27 Euro."
              />
            </>,
            <>
              Direkt: <Formel tex={String.raw`K(V(s))=1{,}8\cdot 0{,}06\,s=0{,}108\,s`} nach="." /> Probe: <Formel tex={String.raw`0{,}108\cdot 250=27`} nach="." />
            </>,
          ]}
        >
          <p>
            Ein Auto verbraucht auf einer Strecke von <Formel tex="s" /> Kilometern <Formel tex={String.raw`V(s)=0{,}06\,s`} /> Liter Kraftstoff. Ein Liter kostet 1,80 €, die Kosten für <Formel tex="V" /> Liter betragen also <Formel tex={String.raw`K(V)=1{,}8\,V`} /> Euro. Berechne für <Formel tex="s=250" /> den Verbrauch und die Kosten. Gib dann die Kosten direkt als <Formel tex="K(V(s))=a\cdot s" /> an.
          </p>
        </Aufgabe>

        <Auswahlfrage
          nummer="10"
          titel="Nullstellen einer Verkettung"
          optionen={[
            opt('a', <>Ja, bei <Formel tex="x=2" /> und <Formel tex="x=-2" nach="," /> weil dort der Exponent null ist.</>, false, <>Bei <Formel tex="x=\pm 2" /> ist der Exponent <Formel tex="0" nach="," /> der Funktionswert aber <Formel tex="e^0=1" nach="." /> Eine Nullstelle der inneren Funktion ist keine Nullstelle der Verkettung.</>),
            opt('b', <>Nein, denn <Formel tex="e^z>0" /> für jede Zahl <Formel tex="z" nach="." /></>, true, <>Richtig.</>),
            opt('c', <>Ja, bei <Formel tex="x=0" nach="," /> weil dort <Formel tex="x^2" /> null ist.</>, false, <>Bei <Formel tex="x=0" /> ist <Formel tex="f(0)=e^{-4}\approx 0{,}018" nach="." /> Das ist klein, aber nicht null.</>),
          ]}
          erklaerung={
            <>
              Eine Verkettung <Formel tex={String.raw`u\circ v`} /> ist null, wenn <Formel tex="v(x)" /> eine Nullstelle der äußeren Funktion <Formel tex="u" /> ist. Die Funktion <Formel tex="u(z)=e^z" /> hat keine Nullstelle, deshalb hat <Formel tex="f" /> keine.
              <Funktionsgraph
                bereich={[-4, 4, -1, 6]}
                xTeilung={1}
                yTeilung={1}
                xBeschriftung="zahl"
                className="brett-3zu2"
                kurven={[{ f: (x) => Math.min(A10.f(x), 100), farbe: FARBE_UV }]}
                beschreibung="Schaubild von f(x) = e hoch (x² − 4). Es liegt immer oberhalb der x-Achse, der kleinste Wert ist e hoch −4, etwa 0,018 bei x = 0."
              />
            </>
          }
        >
          <p>
            Hat <Formel tex="f(x)=e^{x^2-4}" /> Nullstellen?
          </p>
        </Auswahlfrage>
      </Abschnitt>

      <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
        <h3>Verkettung</h3>
        <Hinweis art="merksatz" titel="Innere und äußere Funktion">
          <ul className="liste">
            <li>
              <Formel tex={String.raw`(u\circ v)(x)=u\bigl(v(x)\bigr)`} nach="." /> Zuerst wird die innere Funktion <Formel tex="v" /> angewendet, danach die äußere Funktion <Formel tex="u" nach="." />
            </li>
            <li>
              Den Term bildest du, indem du in <Formel tex="u" /> für <Formel tex="x" /> den Term von <Formel tex="v" /> einsetzt (in Klammern). Einen Wert rechnest du von innen nach außen.
            </li>
            <li>
              Erkennen: Was wird zuerst ausgerechnet? Das ist <Formel tex="v" nach="." /> Was geschieht mit dem Ergebnis? Das ist <Formel tex="u" nach="." />
            </li>
            <li>
              Die Reihenfolge ist wichtig: <Formel tex={String.raw`u\circ v`} /> und <Formel tex={String.raw`v\circ u`} /> sind im Allgemeinen verschieden.
            </li>
          </ul>
        </Hinweis>
        <Rechenkette
          eingabe={<Formel tex="x" />}
          schritte={[
            { name: <>innere Funktion <Formel tex="v" /></>, vorschrift: <Formel tex="v(x)" />, ergebnis: <Formel tex="v(x)" /> },
            { name: <>äußere Funktion <Formel tex="u" /></>, vorschrift: <Formel tex="u(v(x))" />, ergebnis: <Formel tex="u(v(x))" /> },
          ]}
          beschreibung="Die Eingabe x wird zuerst in die innere Funktion v eingesetzt. Das Ergebnis wird in die äußere Funktion u eingesetzt."
        />

        <h3>Eigenschaften der Verkettung</h3>
        <table className="tabelle">
          <caption>Was erbt <Formel tex={String.raw`u\circ v`} /> von <Formel tex="u" /> und <Formel tex="v" nach="?" /></caption>
          <thead>
            <tr>
              <th scope="col">Eigenschaft</th>
              <th scope="col">Regel</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Definitionsbereich</th>
              <td><Formel tex="x" /> muss zu <Formel tex="D_v" /> gehören und <Formel tex="v(x)" /> zu <Formel tex="D_u" nach="." /> Beispiel: <Formel tex={String.raw`\sqrt{2x-1}`} /> ist nur für <Formel tex="x\ge 0{,}5" /> definiert.</td>
            </tr>
            <tr>
              <th scope="row">Nullstellen</th>
              <td><Formel tex="x" /> ist Nullstelle von <Formel tex={String.raw`u\circ v`} nach="," /> wenn <Formel tex="v(x)" /> eine Nullstelle von <Formel tex="u" /> ist. Hat <Formel tex="u" /> keine Nullstelle (zum Beispiel <Formel tex="e^x" nach=")," /> hat die Verkettung keine.</td>
            </tr>
            <tr>
              <th scope="row">Symmetrie</th>
              <td>
                <Formel tex="v" /> achsensymmetrisch: <Formel tex={String.raw`u\circ v`} /> achsensymmetrisch. <Formel tex="v" /> punktsymmetrisch: <Formel tex="u" /> achsensymmetrisch ergibt achsensymmetrisch, <Formel tex="u" /> punktsymmetrisch ergibt punktsymmetrisch, <Formel tex="u" /> ohne Symmetrie ergibt keine Symmetrie. <Formel tex="v" /> ohne Symmetrie: keine Symmetrie.
              </td>
            </tr>
            <tr>
              <th scope="row">Periode</th>
              <td>Ist <Formel tex="v" /> periodisch, ist <Formel tex={String.raw`u\circ v`} /> periodisch, die Periode kann kleiner werden (<Formel tex={String.raw`\cos(\sin x)`} /> hat die Periode <Formel tex={String.raw`\pi`} nach=")." /> Ist nur <Formel tex="u" /> periodisch, ist die Verkettung meist nicht periodisch (<Formel tex={String.raw`\sin(x^2)`} nach=")." /></td>
            </tr>
            <tr>
              <th scope="row">Lineare Funktion innen oder außen</th>
              <td>Eine lineare innere Funktion wirkt in x-Richtung (<Formel tex={String.raw`\sin(2x-1)`} nach=")," /> eine lineare äußere Funktion in y-Richtung (<Formel tex={String.raw`2\sin x-1`} nach=")." /></td>
            </tr>
          </tbody>
        </table>
        <div className="bilder-paar">
          {BILDER.a2}
          {BILDER.a3}
        </div>
      </Abschnitt>
    </>
  );
}
