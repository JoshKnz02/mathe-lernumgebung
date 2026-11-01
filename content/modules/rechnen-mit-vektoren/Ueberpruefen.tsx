import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe, type Feld } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { opt, platziere, t, zt } from '@/lib/modulhilfen';
import { aufgDrohne, aufgGerade, aufgParallelogramm, aufgRoboter, aufgViereck, aufgZeichnen } from './Bilder';
import {
  A_DROHNE,
  A_EBENE,
  A_GERADE,
  A_GESCHLOSSEN,
  A_KOLLINEAR,
  A_KRAEFTE,
  A_LINKOMB,
  A_PARALLELOGRAMM,
  A_PARAMETER_E,
  A_PARAMETER_R,
  A_PREISE,
  A_RAUM,
  A_ROBOTER,
  A_VIELFACH,
} from './daten';
import { Figur, KontrollFigur, Zeichenaufgabe } from './Figuren';
import { spalte } from './Labor';

const Sp = ({ v, nach }: { v: number[]; nach?: string }) => (nach ? <Formel tex={spalte(v)} nach={nach} /> : <Formel tex={spalte(v)} />);
const kl = (x: number) => (x < 0 ? `(${zt(x)})` : zt(x));
/** Eingabefelder für alle Koordinaten eines Vektors, die Namen in den Feldern lauten „1. Koordinate von …“. */
const koordFelder = (praefix: string, tex: string, wort: string, v: number[]): Feld[] =>
  v.map((x, i) => ({ id: `${praefix}${i + 1}`, name: `${i + 1}. Koordinate von ${wort}`, beschriftung: <>{i + 1}. Koordinate von <Formel tex={tex} /></>, erwartet: x }));
/** Zeile einer Rechnung mit Koordinatenweise, zum Beispiel (3 + (−2) | −5 + 8). */
const zeilen = (u: number[], op: string, w: number[]) => u.map((x, i) => `${kl(x)}${op}${kl(w[i]!)}`).join('\\\\');

export function Ueberpruefen() {
  const e = A_EBENE;
  const r = A_RAUM;
  const ro = A_ROBOTER;
  const kr = A_KRAEFTE;
  const pr = A_PREISE;
  const vf = A_VIELFACH;
  const lk = A_LINKOMB;
  const dr = A_DROHNE;
  const pg = A_PARALLELOGRAMM;
  const pe = A_PARAMETER_E;
  const pRaum = A_PARAMETER_R;
  const ge = A_GERADE;
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Bearbeite die Aufgaben zuerst im Heft und prüfe dann deine Ergebnisse. Bleibst du stecken, deckst du die Hilfen nacheinander auf. Bei Aufgaben mit Bild kannst du dir das Bild zur Kontrolle einblenden, nachdem du selbst gezeichnet oder gerechnet hast. Die Bilder im Raum lassen sich zwischen Schrägbild und räumlicher Ansicht umschalten.
      </p>
      <Hinweis titel="Eingabe">
        Jede Koordinate eines Vektors trägst du in ein eigenes Feld ein, die obere Koordinate zuerst. Negative Zahlen schreibst du mit Minuszeichen, zum Beispiel −3, Dezimalzahlen mit Komma, zum Beispiel 2,5. Brüche kannst du mit Schrägstrich eingeben.
      </Hinweis>

      <Aufgabe
        nummer={1}
        titel="Summe und Differenz in der Ebene"
        felder={[...koordFelder('s', t`\vec{a}+\vec{b}`, 'a plus b', e.summe), ...koordFelder('d', t`\vec{a}-\vec{b}`, 'a minus b', e.differenz)]}
        hilfen={[
          <>Du rechnest bei jeder Koordinate einzeln: oben mit oben, unten mit unten.</>,
          <>Bei der Differenz gilt <Formel tex={t`\vec{a}-\vec{b}=\vec{a}+(-\vec{b})`} nach="." /> Setze negative Zahlen in Klammern, zum Beispiel <Formel tex="3-(-2)" nach="." /></>,
        ]}
        loesung={[
          <>
            Summe: <Formel tex={t`\vec{a}+\vec{b}=\begin{pmatrix}${zeilen(e.a, '+', e.b)}\end{pmatrix}=${spalte(e.summe)}`} nach="." />
          </>,
          <>
            Differenz: <Formel tex={t`\vec{a}-\vec{b}=\begin{pmatrix}${zeilen(e.a, '-', e.b)}\end{pmatrix}=${spalte(e.differenz)}`} nach="." />
          </>,
        ]}
      >
        <p>
          Gegeben sind <Formel tex={t`\vec{a}=${spalte(e.a)}`} /> und <Formel tex={t`\vec{b}=${spalte(e.b)}`} nach="." /> Berechne <Formel tex={t`\vec{a}+\vec{b}`} /> und <Formel tex={t`\vec{a}-\vec{b}`} nach="." />
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={2}
        titel="Summe und Differenz im Raum"
        felder={[...koordFelder('s', t`\vec{a}+\vec{b}`, 'a plus b', r.summe), ...koordFelder('d', t`\vec{a}-\vec{b}`, 'a minus b', r.differenz)]}
        hilfen={[<>Im Raum rechnest du genauso, nur mit drei Koordinaten. Jede Koordinate wird einzeln berechnet.</>]}
        loesung={[
          <>
            <Formel tex={t`\vec{a}+\vec{b}=\begin{pmatrix}${zeilen(r.a, '+', r.b)}\end{pmatrix}=${spalte(r.summe)}`} nach="," />
          </>,
          <>
            <Formel tex={t`\vec{a}-\vec{b}=\begin{pmatrix}${zeilen(r.a, '-', r.b)}\end{pmatrix}=${spalte(r.differenz)}`} nach="." />
          </>,
        ]}
      >
        <p>
          Gegeben sind <Formel tex={t`\vec{a}=${spalte(r.a)}`} /> und <Formel tex={t`\vec{b}=${spalte(r.b)}`} nach="." /> Berechne <Formel tex={t`\vec{a}+\vec{b}`} /> und <Formel tex={t`\vec{a}-\vec{b}`} nach="." />
        </p>
      </Aufgabe>

      <Zeichenaufgabe
        nummer="3"
        titel="Summe zeichnen"
        hilfe={
          <>
            <p>
              Die Koordinaten der Summe sind <Formel tex={t`\vec{a}+\vec{b}=\begin{pmatrix}3+(-1)\\1+3\end{pmatrix}=\begin{pmatrix}2\\4\end{pmatrix}`} nach="." /> Du zeichnest <Formel tex={t`\vec{a}`} /> vom Ursprung aus (3 Einheiten in Richtung der <Formel tex="x_1" />-Achse, 1 Einheit in Richtung der <Formel tex="x_2" />-Achse) und setzt <Formel tex={t`\vec{b}`} /> an die Spitze (1 Einheit entgegen der Richtung der <Formel tex="x_1" />-Achse, 3 Einheiten in Richtung der <Formel tex="x_2" />-Achse). Der Pfeil vom Ursprung zur Spitze von <Formel tex={t`\vec{b}`} /> ist die Summe.
            </p>
            <p>
              In der anderen Reihenfolge zeichnest du erst <Formel tex={t`\vec{b}`} /> und dann <Formel tex={t`\vec{a}`} nach="." /> Du landest im selben Punkt. Die vier Pfeile bilden ein Parallelogramm, die Summe ist seine Diagonale.
            </p>
          </>
        }
        kontrolle={
          <Kontrollschaubild>
            <Bild daten={aufgZeichnen} unter={<>Orange: <Formel tex={t`\vec{a}`} nach="," /> blau: <Formel tex={t`\vec{b}`} nach="," /> rosa: die Summe. Gestrichelt: die andere Reihenfolge.</>} />
          </Kontrollschaubild>
        }
      >
        <p>
          Zeichne in ein Koordinatensystem im Heft (<Formel tex="x_1" /> von −2 bis 6, <Formel tex="x_2" /> von −1 bis 7) den Vektor <Formel tex={t`\vec{a}=\begin{pmatrix}3\\1\end{pmatrix}`} /> vom Ursprung aus. Setze an seine Spitze den Vektor <Formel tex={t`\vec{b}=\begin{pmatrix}-1\\3\end{pmatrix}`} /> und zeichne die Summe <Formel tex={t`\vec{a}+\vec{b}`} nach="." /> Zeichne dann beide Vektoren in der anderen Reihenfolge. Was fällt dir auf? Bestimme die Koordinaten der Summe.
        </p>
      </Zeichenaufgabe>

      <Auswahlfrage
        nummer="4"
        titel="Der geschlossene Weg"
        optionen={platziere(
          [
            opt('a', <Formel tex={t`\vec{0}=${spalte(A_GESCHLOSSEN.nullvektor)}`} />, true, <>Richtig: <Formel tex={t`\overrightarrow{AB}+\overrightarrow{BC}=\overrightarrow{AC}`} nach="," /> und <Formel tex={t`\overrightarrow{AC}+\overrightarrow{CA}=\vec{0}`} nach="," /> weil <Formel tex={t`\overrightarrow{CA}`} /> der Gegenvektor von <Formel tex={t`\overrightarrow{AC}`} /> ist. Wer zum Ausgangspunkt zurückkommt, hat sich insgesamt nicht verschoben.</>),
            opt('b', <Formel tex={t`\overrightarrow{AC}`} />, false, <>Das ist nur <Formel tex={t`\overrightarrow{AB}+\overrightarrow{BC}`} nach="." /> Die dritte Fahrt <Formel tex={t`\overrightarrow{CA}`} /> führt zurück nach <Formel tex="A" nach="," /> sie hebt <Formel tex={t`\overrightarrow{AC}`} /> auf.</>),
            opt('c', <Formel tex={t`2\cdot\overrightarrow{AC}`} />, false, <>Dann wäre <Formel tex={t`\overrightarrow{CA}`} /> gleich <Formel tex={t`\overrightarrow{AC}`} nach="." /> <Formel tex={t`\overrightarrow{CA}`} /> zeigt aber in die Gegenrichtung von <Formel tex={t`\overrightarrow{AC}`} nach="." /></>),
            opt('d', <Formel tex={t`\overrightarrow{CA}`} />, false, <>Dann müsste <Formel tex={t`\overrightarrow{AB}+\overrightarrow{BC}`} /> der Nullvektor sein. Das ist es nur, wenn <Formel tex="A" /> und <Formel tex="C" /> zusammenfallen.</>),
          ],
          0,
        )}
        erklaerung={
          <>
            Die drei Fahrten bilden einen geschlossenen Weg über die Punkte <Formel tex="A" nach="," /> <Formel tex="B" nach="," /> <Formel tex="C" /> und zurück nach <Formel tex="A" nach="." /> Die Summe ist der Nullvektor, denn der Weg beginnt und endet im selben Punkt.
          </>
        }
      >
        <p>
          Die Punkte <Formel tex="A" nach="," /> <Formel tex="B" /> und <Formel tex="C" /> bilden ein Dreieck. Welcher Vektor ist <Formel tex={t`\overrightarrow{AB}+\overrightarrow{BC}+\overrightarrow{CA}`} nach="?" />
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={5}
        titel="Die Fahrt des Lagerroboters"
        felder={[...koordFelder('g', t`\vec{g}`, 'g', ro.summe), ...koordFelder('z', t`Z`, 'Z', ro.ziel).map((f, i) => ({ ...f, beschriftung: <>{i + 1}. Koordinate von <Formel tex="Z" /></> }))]}
        hilfen={[
          <>Die Gesamtfahrt <Formel tex={t`\vec{g}`} /> ist die Summe der drei Fahrten. Addiere die Koordinaten einzeln.</>,
          <>Den Zielpunkt erhältst du, indem du die Gesamtfahrt zum Ausgangspunkt <Formel tex={t`A(-2\,|\,1)`} /> addierst.</>,
        ]}
        loesung={[
          <>
            <Formel tex={t`\vec{g}=\begin{pmatrix}4\\3\end{pmatrix}+\begin{pmatrix}-1\\-5\end{pmatrix}+\begin{pmatrix}3\\2\end{pmatrix}=\begin{pmatrix}4+(-1)+3\\3+(-5)+2\end{pmatrix}=${spalte(ro.summe)}`} nach="." />
          </>,
          <>
            <Formel tex={t`Z(-2+6\,|\,1+0)=Z(4\,|\,1)`} nach="." /> Zur Kontrolle: Nach der ersten Fahrt steht der Roboter in <Formel tex={t`B(2\,|\,4)`} nach="," /> nach der zweiten in <Formel tex={t`C(1\,|\,-1)`} nach="," /> nach der dritten in <Formel tex={t`Z(4\,|\,1)`} nach="." />
          </>,
        ]}
      >
        <p>
          Ein Lagerroboter startet in <Formel tex={t`A(-2\,|\,1)`} /> und fährt nacheinander <Formel tex={t`\vec{v}_1=\begin{pmatrix}4\\3\end{pmatrix}`} nach="," /> <Formel tex={t`\vec{v}_2=\begin{pmatrix}-1\\-5\end{pmatrix}`} /> und <Formel tex={t`\vec{v}_3=\begin{pmatrix}3\\2\end{pmatrix}`} nach="." /> Bestimme den Vektor <Formel tex={t`\vec{g}`} nach="," /> der die gesamte Fahrt in einem Schritt beschreibt, und den Zielpunkt <Formel tex="Z" nach="." />
        </p>
        <Bild daten={aufgRoboter(false)} unter={<>Der Startpunkt <Formel tex="A" nach="." /></>} />
        <Kontrollschaubild>
          <Bild daten={aufgRoboter(true)} unter={<>Die drei Fahrten nacheinander und die Gesamtfahrt von <Formel tex="A" /> nach <Formel tex="Z" /> (rosa).</>} />
        </Kontrollschaubild>
      </Aufgabe>

      <Aufgabe
        nummer={6}
        titel="Kräfte addieren"
        felder={[...koordFelder('f', t`\vec{F}`, 'F', kr.summe), ...koordFelder('g', t`\vec{F}_3`, 'F 3', kr.gegen)]}
        hilfen={[
          <>Kräfte werden wie Vektoren addiert, jede Koordinate einzeln. Die Einheit ist Newton, du kannst sie beim Rechnen weglassen.</>,
          <>Der Schlitten bleibt in Ruhe, wenn die Summe aller Kräfte der Nullvektor ist. Was musst du zu <Formel tex={t`\vec{F}`} /> addieren, um <Formel tex={t`\vec{0}`} /> zu erhalten?</>,
        ]}
        loesung={[
          <>
            <Formel tex={t`\vec{F}=\vec{F}_1+\vec{F}_2=\begin{pmatrix}120+(-40)\\50+90\end{pmatrix}=${spalte(kr.summe)}`} nach="." /> Die Gesamtkraft beträgt also 80 N in Richtung der <Formel tex="x_1" />-Achse und 140 N in Richtung der <Formel tex="x_2" />-Achse.
          </>,
          <>
            Gesucht ist <Formel tex={t`\vec{F}_3`} /> mit <Formel tex={t`\vec{F}+\vec{F}_3=\vec{0}`} nach="." /> Das ist der Gegenvektor: <Formel tex={t`\vec{F}_3=-\vec{F}=${spalte(kr.gegen)}`} nach="." />
          </>,
        ]}
      >
        <p>
          Zwei Personen ziehen an einem Schlitten. Die Kräfte (in Newton) sind <Formel tex={t`\vec{F}_1=\begin{pmatrix}120\\50\end{pmatrix}`} /> und <Formel tex={t`\vec{F}_2=\begin{pmatrix}-40\\90\end{pmatrix}`} nach="." /> Die <Formel tex="x_1" />-Achse zeigt in Fahrtrichtung, die <Formel tex="x_2" />-Achse nach links. Berechne die Gesamtkraft <Formel tex={t`\vec{F}=\vec{F}_1+\vec{F}_2`} nach="." /> Eine dritte Person soll den Schlitten festhalten. Welche Kraft <Formel tex={t`\vec{F}_3`} /> muss sie aufbringen, damit der Schlitten in Ruhe bleibt?
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={7}
        titel="Preisvektoren"
        felder={[...koordFelder('e', t`1{,}1\cdot\vec{p}`, '1,1 mal p', pr.erhoeht), ...koordFelder('u', t`\vec{q}-\vec{p}`, 'q minus p', pr.unterschied)]}
        hilfen={[
          <>Eine Preiserhöhung um 10 % bedeutet, dass jeder Preis mit 1,1 multipliziert wird. Das entspricht dem Vielfachen <Formel tex={t`1{,}1\cdot\vec{p}`} nach="." /></>,
          <>Bei <Formel tex={t`\vec{q}-\vec{p}`} /> subtrahierst du jede Koordinate einzeln. Eine negative Zahl zeigt, dass der Preis in Markt B niedriger ist.</>,
        ]}
        loesung={[
          <>
            <Formel tex={t`1{,}1\cdot\vec{p}=\begin{pmatrix}1{,}1\cdot 2{,}40\\1{,}1\cdot 1{,}10\\1{,}1\cdot 3{,}50\end{pmatrix}=${spalte(pr.erhoeht)}`} nach="." />
          </>,
          <>
            <Formel tex={t`\vec{q}-\vec{p}=\begin{pmatrix}2{,}60-2{,}40\\0{,}90-1{,}10\\3{,}40-3{,}50\end{pmatrix}=\begin{pmatrix}0{,}2\\-0{,}2\\-0{,}1\end{pmatrix}`} nach="." /> Brot ist in Markt B um 0,20 € teurer, Milch um 0,20 € und Käse um 0,10 € billiger.
          </>,
        ]}
      >
        <p>
          Der Preisvektor <Formel tex={t`\vec{p}=\begin{pmatrix}2{,}40\\1{,}10\\3{,}50\end{pmatrix}`} /> gibt die Preise in Euro für Brot, Milch und Käse in Markt A an. a) Alle Preise steigen um 10 %. Wie lautet der neue Preisvektor <Formel tex={t`1{,}1\cdot\vec{p}`} nach="?" /> b) Markt B hat den Preisvektor <Formel tex={t`\vec{q}=\begin{pmatrix}2{,}60\\0{,}90\\3{,}40\end{pmatrix}`} nach="." /> Berechne <Formel tex={t`\vec{q}-\vec{p}`} /> und deute das Ergebnis.
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={8}
        titel="Vielfache in der Ebene"
        felder={[...koordFelder('a', t`2{,}5\cdot\vec{v}`, '2,5 mal v', vf.v1), ...koordFelder('b', t`(-0{,}5)\cdot\vec{v}`, 'minus 0,5 mal v', vf.v2)]}
        hilfen={[<>Multipliziere jede Koordinate mit der Zahl. Achte auf das Vorzeichen: minus mal minus ergibt plus.</>]}
        loesung={[
          <>
            <Formel tex={t`2{,}5\cdot\vec{v}=\begin{pmatrix}2{,}5\cdot(-4)\\2{,}5\cdot 6\end{pmatrix}=${spalte(vf.v1)}`} nach="." />
          </>,
          <>
            <Formel tex={t`(-0{,}5)\cdot\vec{v}=\begin{pmatrix}(-0{,}5)\cdot(-4)\\(-0{,}5)\cdot 6\end{pmatrix}=${spalte(vf.v2)}`} nach="." /> Dieser Pfeil ist halb so lang wie <Formel tex={t`\vec{v}`} /> und zeigt in die Gegenrichtung.
          </>,
        ]}
      >
        <p>
          Gegeben ist <Formel tex={t`\vec{v}=${spalte(vf.v)}`} nach="." /> Berechne <Formel tex={t`2{,}5\cdot\vec{v}`} /> und <Formel tex={t`(-0{,}5)\cdot\vec{v}`} nach="." />
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={9}
        titel="Linearkombination im Raum"
        felder={koordFelder('k', t`2\cdot\vec{a}-3\cdot\vec{b}`, '2 a minus 3 b', lk.ergebnis)}
        hilfen={[
          <>Berechne zuerst die beiden Vielfachen <Formel tex={t`2\cdot\vec{a}`} /> und <Formel tex={t`3\cdot\vec{b}`} nach="." /> Subtrahiere dann koordinatenweise.</>,
        ]}
        loesung={[
          <>
            <Formel tex={t`2\cdot\vec{a}=\begin{pmatrix}2\\4\\-2\end{pmatrix}`} nach="," /> <Formel tex={t`3\cdot\vec{b}=\begin{pmatrix}0\\-9\\12\end{pmatrix}`} nach="." />
          </>,
          <>
            <Formel tex={t`2\cdot\vec{a}-3\cdot\vec{b}=\begin{pmatrix}2-0\\4-(-9)\\-2-12\end{pmatrix}=${spalte(lk.ergebnis)}`} nach="." />
          </>,
        ]}
      >
        <p>
          Gegeben sind <Formel tex={t`\vec{a}=${spalte(lk.a)}`} /> und <Formel tex={t`\vec{b}=${spalte(lk.b)}`} nach="." /> Berechne die Linearkombination <Formel tex={t`2\cdot\vec{a}-3\cdot\vec{b}`} nach="." />
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={10}
        titel="Der Flug der Drohne"
        felder={[...koordFelder('g', t`\vec{g}`, 'g', dr.summe), ...koordFelder('z', t`Z`, 'Z', dr.ziel as unknown as number[]).map((f, i) => ({ ...f, beschriftung: <>{i + 1}. Koordinate von <Formel tex="Z" /></> }))]}
        hilfen={[
          <>Die Gesamtbewegung ist die Summe der beiden Flugvektoren. Den Zielpunkt erhältst du, indem du diese Summe zum Startpunkt addierst.</>,
          <>Du kannst auch in zwei Schritten rechnen und zuerst die Zwischenstation <Formel tex="B" /> bestimmen.</>,
        ]}
        loesung={[
          <>
            <Formel tex={t`\vec{g}=\begin{pmatrix}3\\-2\\1\end{pmatrix}+\begin{pmatrix}1\\3\\2\end{pmatrix}=${spalte(dr.summe)}`} nach="." />
          </>,
          <>
            <Formel tex={t`Z(-2+4\,|\,1+1\,|\,0+3)=Z(2\,|\,2\,|\,3)`} nach="." /> Die Zwischenstation ist <Formel tex={t`B(-2+3\,|\,1+(-2)\,|\,0+1)=B(1\,|\,-1\,|\,1)`} nach="." />
          </>,
        ]}
      >
        <p>
          Eine Drohne startet in <Formel tex={t`A(-2\,|\,1\,|\,0)`} /> und fliegt nacheinander <Formel tex={t`\vec{v}_1=\begin{pmatrix}3\\-2\\1\end{pmatrix}`} /> und <Formel tex={t`\vec{v}_2=\begin{pmatrix}1\\3\\2\end{pmatrix}`} nach="." /> Bestimme den Vektor <Formel tex={t`\vec{g}`} nach="," /> der den ganzen Flug in einem Schritt beschreibt, und den Zielpunkt <Formel tex="Z" nach="." />
        </p>
        <Figur spec={aufgDrohne(false)} unter={<>Der Startpunkt <Formel tex="A" nach="." /></>} />
        <KontrollFigur spec={aufgDrohne(true)} unter={<>Der Flug über die Zwischenstation <Formel tex="B" /> zum Ziel <Formel tex="Z" /> (orange und blau) und der direkte Weg von <Formel tex="A" /> nach <Formel tex="Z" /> (rosa).</>} />
      </Aufgabe>

      <Aufgabe
        nummer={11}
        titel="Parallelogramm ergänzen"
        felder={[...koordFelder('b', t`\overrightarrow{BC}`, 'B C', pg.bc), ...koordFelder('d', t`D`, 'D', [pg.d[0], pg.d[1]]).map((f, i) => ({ ...f, beschriftung: <>{i + 1}. Koordinate von <Formel tex="D" /></> }))]}
        hilfen={[
          <>In einem Parallelogramm <Formel tex="ABCD" /> sind die gegenüberliegenden Seiten gleich lang, parallel und gleich gerichtet. Es gilt <Formel tex={t`\overrightarrow{AD}=\overrightarrow{BC}`} nach="." /></>,
          <>Den Punkt <Formel tex="D" /> erreichst du von <Formel tex="A" /> aus mit dem Vektor <Formel tex={t`\overrightarrow{BC}`} nach="." /></>,
        ]}
        loesung={[
          <>
            <Formel tex={t`\overrightarrow{BC}=\begin{pmatrix}6-4\\5-2\end{pmatrix}=${spalte(pg.bc)}`} nach="." />
          </>,
          <>
            Weil <Formel tex={t`\overrightarrow{AD}=\overrightarrow{BC}`} /> gilt, ist <Formel tex={t`D(-1+2\,|\,1+3)=D(1\,|\,4)`} nach="." /> Zur Kontrolle: <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}5\\1\end{pmatrix}`} /> und <Formel tex={t`\overrightarrow{DC}=\begin{pmatrix}6-1\\5-4\end{pmatrix}=\begin{pmatrix}5\\1\end{pmatrix}`} nach="." />
          </>,
        ]}
      >
        <p>
          Gegeben sind die Punkte <Formel tex={t`A(-1\,|\,1)`} nach="," /> <Formel tex={t`B(4\,|\,2)`} /> und <Formel tex={t`C(6\,|\,5)`} nach="." /> Sie sind drei Ecken eines Parallelogramms <Formel tex="ABCD" nach="." /> Berechne <Formel tex={t`\overrightarrow{BC}`} /> und bestimme damit die Koordinaten von <Formel tex="D" nach="." />
        </p>
        <Bild daten={aufgParallelogramm(false)} unter={<>Die drei Punkte <Formel tex="A" nach="," /> <Formel tex="B" /> und <Formel tex="C" nach="." /></>} />
        <Kontrollschaubild>
          <Bild daten={aufgParallelogramm(true)} unter={<>Das Parallelogramm mit <Formel tex="D" nach="." /> Gleichfarbige Pfeile gehören zum selben Vektor.</>} />
        </Kontrollschaubild>
      </Aufgabe>

      <Auswahlfrage
        nummer="12"
        titel="Welcher Vektor ist kollinear?"
        optionen={platziere(
          [
            opt('a', <Sp v={A_KOLLINEAR.richtig} />, true, <>Richtig: <Formel tex={t`\begin{pmatrix}-1\\2\\-3\end{pmatrix}=-\tfrac{1}{3}\cdot\begin{pmatrix}3\\-6\\9\end{pmatrix}`} nach="." /> Alle drei Koordinaten haben denselben Faktor <Formel tex={t`-\tfrac{1}{3}`} nach="." /></>),
            opt('b', <Sp v={A_KOLLINEAR.falsch[0]!} />, false, <>Bei der ersten Koordinate wäre der Faktor <Formel tex={t`\tfrac{1}{3}`} nach="," /> bei der zweiten <Formel tex={t`-\tfrac{1}{3}`} nach="." /> Die Faktoren sind verschieden, es gibt keinen gemeinsamen.</>),
            opt('c', <Sp v={A_KOLLINEAR.falsch[1]!} />, false, <>Die ersten beiden Koordinaten passen mit dem Faktor <Formel tex={t`\tfrac{1}{3}`} nach="." /> Bei der dritten wäre es aber <Formel tex={t`\tfrac{1}{3}\cdot 9=3`} nach="," /> nicht 4.</>),
            opt('d', <Sp v={A_KOLLINEAR.falsch[2]!} />, false, <>Die ersten beiden Koordinaten passen mit dem Faktor 2. Bei der dritten wäre es aber <Formel tex={t`2\cdot 9=18`} nach="," /> nicht 8.</>),
          ],
          2,
        )}
        erklaerung={<>Zwei Vektoren sind kollinear, wenn sich alle Koordinaten mit demselben Faktor ineinander umrechnen lassen. Du prüfst Koordinate für Koordinate, ob derselbe Faktor herauskommt.</>}
      >
        <p>
          Welcher der Vektoren ist kollinear zu <Formel tex={t`\vec{u}=${spalte(A_KOLLINEAR.u)}`} nach="?" />
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={13}
        titel="Parameter bestimmen in der Ebene"
        felder={[
          { id: 'r', name: 'Faktor r', beschriftung: <Formel tex="r" />, erwartet: pe.r },
          { id: 'k', name: 'Zahl k', beschriftung: <Formel tex="k" />, erwartet: pe.k },
        ]}
        hilfen={[
          <>Wenn die Vektoren kollinear sind, gibt es eine Zahl <Formel tex="r" /> mit <Formel tex={t`\vec{b}=r\cdot\vec{a}`} nach="." /> Die erste Koordinate liefert dir <Formel tex="r" nach="." /></>,
          <>Mit diesem <Formel tex="r" /> berechnest du die zweite Koordinate.</>,
        ]}
        loesung={[
          <>
            Aus der ersten Koordinate folgt <Formel tex="9=r\cdot 6" nach="," /> also <Formel tex="r=1{,}5" nach="." />
          </>,
          <>
            Dann gilt <Formel tex={t`k=1{,}5\cdot(-4)=-6`} nach="." /> Probe: <Formel tex={t`1{,}5\cdot\begin{pmatrix}6\\-4\end{pmatrix}=\begin{pmatrix}9\\-6\end{pmatrix}`} nach="." />
          </>,
        ]}
      >
        <p>
          Für welche Zahl <Formel tex="k" /> sind die Vektoren <Formel tex={t`\vec{a}=\begin{pmatrix}6\\-4\end{pmatrix}`} /> und <Formel tex={t`\vec{b}=\begin{pmatrix}9\\k\end{pmatrix}`} /> kollinear? Gib auch den Faktor <Formel tex="r" /> mit <Formel tex={t`\vec{b}=r\cdot\vec{a}`} /> an.
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={14}
        titel="Parameter bestimmen im Raum"
        felder={[
          { id: 'r', name: 'Faktor r', beschriftung: <Formel tex="r" />, erwartet: pRaum.r },
          { id: 'k', name: 'Zahl k', beschriftung: <Formel tex="k" />, erwartet: pRaum.k },
          { id: 'm', name: 'Zahl m', beschriftung: <Formel tex="m" />, erwartet: pRaum.m },
        ]}
        hilfen={[<>Die erste Koordinate liefert den Faktor <Formel tex="r" nach="." /> Mit ihm berechnest du <Formel tex="k" /> und <Formel tex="m" nach="." /></>]}
        loesung={[
          <>
            <Formel tex={t`-4=r\cdot 2`} /> ergibt <Formel tex="r=-2" nach="." />
          </>,
          <>
            <Formel tex={t`k=(-2)\cdot(-3)=6`} /> und <Formel tex={t`m=(-2)\cdot 5=-10`} nach="." />
          </>,
        ]}
      >
        <p>
          Für welche Zahlen <Formel tex="k" /> und <Formel tex="m" /> sind <Formel tex={t`\vec{u}=\begin{pmatrix}2\\-3\\5\end{pmatrix}`} /> und <Formel tex={t`\vec{v}=\begin{pmatrix}-4\\k\\m\end{pmatrix}`} /> kollinear? Gib auch den Faktor <Formel tex="r" /> mit <Formel tex={t`\vec{v}=r\cdot\vec{u}`} /> an.
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={15}
        titel="Liegen drei Punkte auf einer Geraden?"
        felder={[...koordFelder('ab', t`\overrightarrow{AB}`, 'A B', ge.ab), ...koordFelder('ac', t`\overrightarrow{AC}`, 'A C', ge.ac), { id: 'r', name: 'Faktor r mit A C gleich r mal A B', beschriftung: <>Faktor <Formel tex="r" /> mit <Formel tex={t`\overrightarrow{AC}=r\cdot\overrightarrow{AB}`} /></>, erwartet: ge.r }]}
        hilfen={[
          <>Berechne <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} nach="." /> Beide Pfeile beginnen in <Formel tex="A" nach="." /></>,
          <>Liegen die Punkte auf einer Geraden, sind <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} /> kollinear. Suche den Faktor <Formel tex="r" nach="." /></>,
        ]}
        loesung={[
          <>
            <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}0-(-2)\\1-2\\2-1\end{pmatrix}=${spalte(ge.ab)}`} nach="," /> <Formel tex={t`\overrightarrow{AC}=\begin{pmatrix}2-(-2)\\0-2\\3-1\end{pmatrix}=${spalte(ge.ac)}`} nach="." />
          </>,
          <>
            Es gilt <Formel tex={t`\overrightarrow{AC}=2\cdot\overrightarrow{AB}`} nach="," /> alle drei Koordinaten haben den Faktor 2. Die Vektoren sind kollinear und beginnen beide in <Formel tex="A" nach="." /> Also liegen <Formel tex="A" nach="," /> <Formel tex="B" /> und <Formel tex="C" /> auf einer Geraden, und <Formel tex="B" /> liegt in der Mitte zwischen <Formel tex="A" /> und <Formel tex="C" nach="." />
          </>,
        ]}
      >
        <p>
          Zeige mit Vektoren, dass die Punkte <Formel tex={t`A(-2\,|\,2\,|\,1)`} nach="," /> <Formel tex={t`B(0\,|\,1\,|\,2)`} /> und <Formel tex={t`C(2\,|\,0\,|\,3)`} /> auf einer Geraden liegen. Berechne dazu <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} /> und bestimme den Faktor <Formel tex="r" nach="." />
        </p>
        <KontrollFigur spec={aufgGerade} unter={<>Die Punkte <Formel tex="A" nach="," /> <Formel tex="B" /> und <Formel tex="C" /> auf einer Geraden. Der blaue Pfeil <Formel tex={t`\overrightarrow{AC}`} /> ist doppelt so lang wie der orange Pfeil <Formel tex={t`\overrightarrow{AB}`} nach="." /></>} />
      </Aufgabe>

      <Auswahlfrage
        nummer="16"
        titel="Parallele Seiten im Viereck"
        optionen={platziere(
          [
            opt('a', <>Nur <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{DC}`} /> sind parallel</>, true, <>Richtig: <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}6\\2\end{pmatrix}=2\cdot\begin{pmatrix}3\\1\end{pmatrix}=2\cdot\overrightarrow{DC}`} nach="." /> Die Vektoren <Formel tex={t`\overrightarrow{BC}=\begin{pmatrix}-1\\3\end{pmatrix}`} /> und <Formel tex={t`\overrightarrow{AD}=\begin{pmatrix}2\\4\end{pmatrix}`} /> sind nicht kollinear. Das Viereck ist ein Trapez.</>),
            opt('b', <>Nur <Formel tex={t`\overrightarrow{BC}`} /> und <Formel tex={t`\overrightarrow{AD}`} /> sind parallel</>, false, <>Für <Formel tex={t`\overrightarrow{BC}=\begin{pmatrix}-1\\3\end{pmatrix}`} /> und <Formel tex={t`\overrightarrow{AD}=\begin{pmatrix}2\\4\end{pmatrix}`} /> wäre der Faktor einmal <Formel tex="-2" /> und einmal <Formel tex={t`\tfrac{4}{3}`} nach="." /> Sie sind nicht kollinear.</>),
            opt('c', <>Beide Paare gegenüberliegender Seiten sind parallel</>, false, <>Dann wäre das Viereck ein Parallelogramm. Das zweite Paar <Formel tex={t`\overrightarrow{BC}`} /> und <Formel tex={t`\overrightarrow{AD}`} /> ist aber nicht kollinear.</>),
            opt('d', <>Kein Paar ist parallel</>, false, <>Doch: <Formel tex={t`\overrightarrow{AB}=2\cdot\overrightarrow{DC}`} nach="." /></>),
          ],
          1,
        )}
        erklaerung={<>Gegenüberliegende Seiten sind parallel, wenn ihre Vektoren kollinear sind. Beim Prüfen musst du die Pfeile so lesen, dass beide Vektoren in dieselbe Richtung durch das Viereck laufen. Das Vorzeichen des Faktors ändert an der Parallelität nichts.</>}
      >
        <p>
          Das Viereck <Formel tex="ABCD" /> hat die Ecken <Formel tex={t`A(-2\,|\,-1)`} nach="," /> <Formel tex={t`B(4\,|\,1)`} nach="," /> <Formel tex={t`C(3\,|\,4)`} /> und <Formel tex={t`D(0\,|\,3)`} nach="." /> Welche Seiten sind parallel?
        </p>
        <Bild daten={aufgViereck} unter={<>Das Viereck <Formel tex="ABCD" nach="." /> Jede Seite hat eine eigene Farbe.</>} />
      </Auswahlfrage>
    </Abschnitt>
  );
}
