import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { aufgAblesen, aufgParallelogramm, aufgPfeile, beispielBild } from './Bilder';
import {
  AUFG_ABLESEN,
  AUFG_AUSWAHL,
  AUFG_DREI,
  AUFG_GEGEN,
  AUFG_PARALLELOGRAMM,
  AUFG_START,
  AUFG_VEKTOR,
  AUFG_ZIEL,
  BEISPIEL_VEKTOREN,
} from './daten';

const spalte = (v: number[]) => t`\begin{pmatrix}${v[0]}\\${v[1]}\end{pmatrix}`;
const Spalte = ({ v, nach }: { v: number[]; nach?: string }) => (nach ? <Formel tex={spalte(v)} nach={nach} /> : <Formel tex={spalte(v)} />);

export function Ueberpruefen() {
  const s = AUFG_ABLESEN;
  const v = AUFG_VEKTOR;
  const z = AUFG_ZIEL;
  const st = AUFG_START;
  const d = AUFG_DREI;
  const pg = AUFG_PARALLELOGRAMM;
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Bearbeite die Aufgaben zuerst im Heft und prüfe dann deine Ergebnisse. Bleibst du stecken, deckst du die Hilfen nacheinander auf. Bei Aufgaben mit Schaubild kannst du dir das Schaubild zur Kontrolle einblenden, nachdem du selbst gezeichnet oder gerechnet hast.
      </p>
      <Hinweis titel="Eingabe">
        Jede Koordinate eines Vektors trägst du in ein eigenes Feld ein, die obere Koordinate zuerst. Negative Zahlen schreibst du mit Minuszeichen, zum Beispiel −3.
      </Hinweis>

      <Aufgabe
        nummer={1}
        titel="Vektor am Schaubild ablesen"
        felder={[
          { id: 'sx', name: 'x-Koordinate des Vektors von S nach Z', beschriftung: <>x-Koordinate von <Formel tex={t`\overrightarrow{SZ}`} /></>, erwartet: s.vektor[0]! },
          { id: 'sy', name: 'y-Koordinate des Vektors von S nach Z', beschriftung: <>y-Koordinate von <Formel tex={t`\overrightarrow{SZ}`} /></>, erwartet: s.vektor[1]! },
          { id: 'gx', name: 'x-Koordinate des Gegenvektors von S nach Z', beschriftung: <>x-Koordinate von <Formel tex={t`\overrightarrow{ZS}`} /></>, erwartet: s.gegen[0]! },
          { id: 'gy', name: 'y-Koordinate des Gegenvektors von S nach Z', beschriftung: <>y-Koordinate von <Formel tex={t`\overrightarrow{ZS}`} /></>, erwartet: s.gegen[1]! },
        ]}
        hilfen={[
          <>Gehe in Gedanken von <Formel tex="S" /> nach <Formel tex="Z" nach="." /> Wie viele Einheiten gehst du in Richtung der x-Achse oder entgegen ihrer Richtung?</>,
          <>Danach gehst du in y-Richtung. Achte auf das Vorzeichen: Entgegen der Richtung der Achse bedeutet minus.</>,
          <>Der Gegenvektor beschreibt den Rückweg von <Formel tex="Z" /> nach <Formel tex="S" nach="." /> Alle Vorzeichen sind umgekehrt.</>,
        ]}
        loesung={[
          <>
            Von <Formel tex="S" /> nach <Formel tex="Z" /> gehst du 7 Einheiten in Richtung der x-Achse (von <Formel tex="-3" /> bis <Formel tex="4" nach=")" /> und 3 Einheiten entgegen der Richtung der y-Achse (von <Formel tex="2" /> bis <Formel tex="-1" nach=")." />
          </>,
          <>
            Also gilt <Formel tex={t`\overrightarrow{SZ}=${spalte(s.vektor)}`} nach="." /> Zur Kontrolle: <Formel tex={t`\overrightarrow{SZ}=\begin{pmatrix}4-(-3)\\-1-2\end{pmatrix}`} nach="." />
          </>,
          <>
            Der Gegenvektor hat die entgegengesetzten Vorzeichen: <Formel tex={t`\overrightarrow{ZS}=${spalte(s.gegen)}`} nach="." />
          </>,
        ]}
      >
        <p>
          Im Koordinatensystem liegen die Punkte <Formel tex="S" /> und <Formel tex="Z" nach="." /> Lies die Koordinaten des Vektors <Formel tex={t`\overrightarrow{SZ}`} /> und seines Gegenvektors <Formel tex={t`\overrightarrow{ZS}`} /> am Schaubild ab.
        </p>
        <Bild daten={aufgAblesen(false)} unter={<>Die Punkte <Formel tex="S" /> und <Formel tex="Z" nach="." /></>} />
        <Kontrollschaubild>
          <Bild daten={aufgAblesen(true)} unter={<>Der Weg von <Formel tex="S" /> nach <Formel tex="Z" /> (schwarz gestrichelt) und der Pfeil des Vektors <Formel tex={t`\overrightarrow{SZ}`} nach="." /></>} />
        </Kontrollschaubild>
      </Aufgabe>

      <Aufgabe
        nummer={2}
        titel="Vektor aus zwei Punkten berechnen"
        felder={[
          { id: 'abx', name: 'x-Koordinate des Vektors von A nach B', beschriftung: <>x-Koordinate von <Formel tex={t`\overrightarrow{AB}`} /></>, erwartet: v.ab[0]! },
          { id: 'aby', name: 'y-Koordinate des Vektors von A nach B', beschriftung: <>y-Koordinate von <Formel tex={t`\overrightarrow{AB}`} /></>, erwartet: v.ab[1]! },
          { id: 'bax', name: 'x-Koordinate des Vektors von B nach A', beschriftung: <>x-Koordinate von <Formel tex={t`\overrightarrow{BA}`} /></>, erwartet: v.ba[0]! },
          { id: 'bay', name: 'y-Koordinate des Vektors von B nach A', beschriftung: <>y-Koordinate von <Formel tex={t`\overrightarrow{BA}`} /></>, erwartet: v.ba[1]! },
        ]}
        hilfen={[
          <>Du brauchst kein Schaubild. Bei jeder Koordinate rechnest du Zielpunkt minus Ausgangspunkt.</>,
          <>
            Für <Formel tex={t`\overrightarrow{AB}`} /> ist <Formel tex="B" /> der Zielpunkt und <Formel tex="A" /> der Ausgangspunkt. Für <Formel tex={t`\overrightarrow{BA}`} /> ist es umgekehrt.
          </>,
        ]}
        loesung={[
          <>
            Für <Formel tex={t`\overrightarrow{AB}`} /> rechnest du Koordinaten von <Formel tex="B" /> minus Koordinaten von <Formel tex="A" nach=":" /> <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}-1-5\\7-(-2)\end{pmatrix}=${spalte(v.ab)}`} nach="." />
          </>,
          <>
            Für <Formel tex={t`\overrightarrow{BA}`} /> rechnest du Koordinaten von <Formel tex="A" /> minus Koordinaten von <Formel tex="B" nach=":" /> <Formel tex={t`\overrightarrow{BA}=\begin{pmatrix}5-(-1)\\-2-7\end{pmatrix}=${spalte(v.ba)}`} nach="." /> Das ist der Gegenvektor von <Formel tex={t`\overrightarrow{AB}`} nach="." />
          </>,
        ]}
      >
        <p>
          Gegeben sind die Punkte <Formel tex={t`A(5\,|\,-2)`} /> und <Formel tex={t`B(-1\,|\,7)`} nach="." /> Berechne die Koordinaten der Vektoren <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{BA}`} nach="." />
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="3"
        titel="Welcher Vektor ist AB?"
        optionen={platziere(
          [
            opt('a', <Spalte v={AUFG_AUSWAHL.ab} />, true, <>Richtig: Zielpunkt minus Ausgangspunkt ergibt <Formel tex={t`\begin{pmatrix}7-2\\1-5\end{pmatrix}=\begin{pmatrix}5\\-4\end{pmatrix}`} nach="." /></>),
            opt('b', <Spalte v={[-5, 4]} />, false, <>Das ist der Gegenvektor <Formel tex={t`\overrightarrow{BA}`} nach="." /> Du hast Ausgangspunkt minus Zielpunkt gerechnet. Für <Formel tex={t`\overrightarrow{AB}`} /> kommt der Zielpunkt <Formel tex="B" /> zuerst.</>),
            opt('c', <Spalte v={[9, 6]} />, false, <>Hier sind die Koordinaten addiert. Ein Vektor beschreibt den Unterschied zwischen Zielpunkt und Ausgangspunkt, deshalb wird subtrahiert.</>),
            opt('d', <Spalte v={[5, 4]} />, false, <>Die x-Koordinate stimmt. Bei y gilt aber <Formel tex="1-5=-4" nach="," /> denn <Formel tex="B" /> liegt unterhalb von <Formel tex="A" nach="." /> Achte auf das Vorzeichen.</>),
          ],
          1,
        )}
        erklaerung={
          <>
            Von <Formel tex={t`A(2\,|\,5)`} /> nach <Formel tex={t`B(7\,|\,1)`} /> gehst du 5 Einheiten in Richtung der x-Achse und 4 Einheiten entgegen der Richtung der y-Achse. Deshalb ist <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}5\\-4\end{pmatrix}`} nach="." />
          </>
        }
      >
        <p>
          Gegeben sind <Formel tex={t`A(2\,|\,5)`} /> und <Formel tex={t`B(7\,|\,1)`} nach="." /> Welcher Vektor ist <Formel tex={t`\overrightarrow{AB}`} nach="?" />
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer="4a"
        titel="Vektoren im Koordinatensystem bestimmen"
        felder={[
          { id: 'abx', name: 'x-Koordinate des Vektors von A nach B', beschriftung: <>x-Koordinate von <Formel tex={t`\overrightarrow{AB}`} /></>, erwartet: BEISPIEL_VEKTOREN.AB[0]! },
          { id: 'aby', name: 'y-Koordinate des Vektors von A nach B', beschriftung: <>y-Koordinate von <Formel tex={t`\overrightarrow{AB}`} /></>, erwartet: BEISPIEL_VEKTOREN.AB[1]! },
          { id: 'bcx', name: 'x-Koordinate des Vektors von B nach C', beschriftung: <>x-Koordinate von <Formel tex={t`\overrightarrow{BC}`} /></>, erwartet: BEISPIEL_VEKTOREN.BC[0]! },
          { id: 'bcy', name: 'y-Koordinate des Vektors von B nach C', beschriftung: <>y-Koordinate von <Formel tex={t`\overrightarrow{BC}`} /></>, erwartet: BEISPIEL_VEKTOREN.BC[1]! },
          { id: 'cdx', name: 'x-Koordinate des Vektors von C nach D', beschriftung: <>x-Koordinate von <Formel tex={t`\overrightarrow{CD}`} /></>, erwartet: BEISPIEL_VEKTOREN.CD[0]! },
          { id: 'cdy', name: 'y-Koordinate des Vektors von C nach D', beschriftung: <>y-Koordinate von <Formel tex={t`\overrightarrow{CD}`} /></>, erwartet: BEISPIEL_VEKTOREN.CD[1]! },
        ]}
        hilfen={[
          <>Lies zuerst die Koordinaten der Punkte <Formel tex="A" nach="," /> <Formel tex="B" nach="," /> <Formel tex="C" /> und <Formel tex="D" /> am Schaubild ab. Dann rechnest du bei jedem Vektor Zielpunkt minus Ausgangspunkt.</>,
          <>Du kannst auch Kästchen zählen: Wie viele Einheiten in Richtung der x-Achse oder entgegen, wie viele in Richtung der y-Achse oder entgegen?</>,
        ]}
        loesung={[
          <>
            Aus dem Schaubild liest du ab: <Formel tex={t`A(-4\,|\,3)`} nach="," /> <Formel tex={t`B(-1\,|\,4)`} nach="," /> <Formel tex={t`C(1\,|\,1)`} /> und <Formel tex={t`D(-2\,|\,1)`} nach="." />
          </>,
          <>
            <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}-1-(-4)\\4-3\end{pmatrix}=${spalte(BEISPIEL_VEKTOREN.AB)}`} nach="," /> <Formel tex={t`\overrightarrow{BC}=\begin{pmatrix}1-(-1)\\1-4\end{pmatrix}=${spalte(BEISPIEL_VEKTOREN.BC)}`} nach="," /> <Formel tex={t`\overrightarrow{CD}=\begin{pmatrix}-2-1\\1-1\end{pmatrix}=${spalte(BEISPIEL_VEKTOREN.CD)}`} nach="." />
          </>,
        ]}
      >
        <p>
          Im Koordinatensystem sind acht Punkte eingezeichnet. Bestimme die Koordinaten der Vektoren <Formel tex={t`\overrightarrow{AB}`} nach="," /> <Formel tex={t`\overrightarrow{BC}`} /> und <Formel tex={t`\overrightarrow{CD}`} nach="." />
        </p>
        <Bild daten={beispielBild('punkte')} unter={<>Die Punkte <Formel tex="A" /> bis <Formel tex="H" nach="." /></>} />
        <Kontrollschaubild>
          <Bild daten={beispielBild('vektoren')} unter={<>Orange: <Formel tex={t`\overrightarrow{AB}`} nach="," /> blau: <Formel tex={t`\overrightarrow{BC}`} nach="," /> rosa: <Formel tex={t`\overrightarrow{CD}`} nach="." /></>} />
        </Kontrollschaubild>
      </Aufgabe>

      <Auswahlfrage
        nummer="4b"
        titel="Gleiche Vektoren erkennen"
        optionen={platziere(
          [
            opt('a', <>Der Vektor <Formel tex={t`\overrightarrow{AB}`} /> führt auch von <Formel tex="E" /> nach <Formel tex="F" nach="," /> <Formel tex={t`\overrightarrow{BC}`} /> auch von <Formel tex="F" /> nach <Formel tex="H" /> und <Formel tex={t`\overrightarrow{CD}`} /> auch von <Formel tex="G" /> nach <Formel tex="H" nach="." /></>, true, <>Richtig. Die Koordinaten stimmen: <Formel tex={t`\overrightarrow{EF}=\begin{pmatrix}3\\1\end{pmatrix}`} nach="," /> <Formel tex={t`\overrightarrow{FH}=\begin{pmatrix}2\\-3\end{pmatrix}`} /> und <Formel tex={t`\overrightarrow{GH}=\begin{pmatrix}-3\\0\end{pmatrix}`} nach="." /></>),
            opt('b', <>Der Vektor <Formel tex={t`\overrightarrow{AB}`} /> führt auch von <Formel tex="F" /> nach <Formel tex="E" nach="," /> <Formel tex={t`\overrightarrow{BC}`} /> auch von <Formel tex="H" /> nach <Formel tex="F" /> und <Formel tex={t`\overrightarrow{CD}`} /> auch von <Formel tex="H" /> nach <Formel tex="G" nach="." /></>, false, <>Die Punktpaare stimmen, aber die Richtung ist vertauscht. Von <Formel tex="F" /> nach <Formel tex="E" /> führt der Gegenvektor <Formel tex={t`\overrightarrow{FE}=\begin{pmatrix}-3\\-1\end{pmatrix}`} nach="," /> nicht <Formel tex={t`\overrightarrow{AB}`} nach="." /> Beim Vektor kommt es auf Ausgangs- und Zielpunkt an.</>),
            opt('c', <>Nur der Vektor <Formel tex={t`\overrightarrow{AB}`} /> führt noch von einem anderen Punkt zu einem anderen Punkt, nämlich von <Formel tex="E" /> nach <Formel tex="F" nach="." /></>, false, <>Auch <Formel tex={t`\overrightarrow{BC}`} /> und <Formel tex={t`\overrightarrow{CD}`} /> haben je ein zweites Punktpaar. Prüfe zum Beispiel <Formel tex={t`\overrightarrow{GH}`} nach="." /> Er hat dieselben Koordinaten wie <Formel tex={t`\overrightarrow{CD}`} nach="." /></>),
            opt('d', <>Keiner der drei Vektoren führt noch von einem anderen Punkt zu einem anderen Punkt.</>, false, <>Die Pfeile liegen an ganz anderen Stellen des Koordinatensystems. Sie können trotzdem zum selben Vektor gehören, wenn sie gleich lang, parallel und gleich gerichtet sind. Das ist hier dreimal der Fall.</>),
          ],
          2,
        )}
        erklaerung={
          <>
            Gesucht sind Punktpaare mit denselben Koordinaten des Vektors. <Formel tex={t`\overrightarrow{EF}=\overrightarrow{AB}`} nach="," /> <Formel tex={t`\overrightarrow{FH}=\overrightarrow{BC}`} /> und <Formel tex={t`\overrightarrow{GH}=\overrightarrow{CD}`} nach="." /> Die Pfeile gehören zur selben Pfeilklasse.
            <Bild daten={beispielBild('partner')} unter={<>Gleichfarbige Pfeile gehören zum selben Vektor, die gestrichelten sind die weiteren Pfeile.</>} />
          </>
        }
      >
        <p>
          Bilden die Vektoren <Formel tex={t`\overrightarrow{AB}`} nach="," /> <Formel tex={t`\overrightarrow{BC}`} /> und <Formel tex={t`\overrightarrow{CD}`} /> aus Aufgabe 4a noch andere der gegebenen Punkte aufeinander ab? Welche Aussage stimmt?
        </p>
        <Bild daten={beispielBild('punkte')} unter={<>Die Punkte <Formel tex="A" /> bis <Formel tex="H" nach="." /></>} />
      </Auswahlfrage>

      <Aufgabe
        nummer={5}
        titel="Zielpunkt bestimmen"
        felder={[
          { id: 'qx', name: 'x-Koordinate des Zielpunkts Q', beschriftung: <>x-Koordinate von <Formel tex="Q" /></>, erwartet: z.q[0]! },
          { id: 'qy', name: 'y-Koordinate des Zielpunkts Q', beschriftung: <>y-Koordinate von <Formel tex="Q" /></>, erwartet: z.q[1]! },
        ]}
        hilfen={[
          <>Du gehst von <Formel tex="P" /> aus die Verschiebung des Vektors. Wie ändern sich dadurch die x-Koordinate und die y-Koordinate?</>,
          <>Addiere die Koordinaten des Vektors zu den Koordinaten von <Formel tex="P" nach="." /> Bei negativen Zahlen helfen Klammern.</>,
        ]}
        loesung={[
          <>
            Der Zielpunkt entsteht, wenn du die Koordinaten des Vektors zu denen des Ausgangspunkts addierst: <Formel tex={t`Q(-2+4\,|\,3+(-5))=Q(2\,|\,-2)`} nach="." />
          </>,
          <>
            Probe: <Formel tex={t`\overrightarrow{PQ}=\begin{pmatrix}2-(-2)\\-2-3\end{pmatrix}=${spalte(z.v)}`} nach="." /> Das ist der gegebene Vektor.
          </>,
        ]}
      >
        <p>
          Gegeben sind <Formel tex={t`P(-2\,|\,3)`} /> und der Vektor <Formel tex={t`\vec{v}=${spalte(z.v)}`} nach="." /> Der Punkt <Formel tex="Q" /> ist der Zielpunkt, den man von <Formel tex="P" /> aus mit <Formel tex={t`\vec{v}`} /> erreicht, also gilt <Formel tex={t`\overrightarrow{PQ}=\vec{v}`} nach="." /> Bestimme die Koordinaten von <Formel tex="Q" nach="." />
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={6}
        titel="Ausgangspunkt bestimmen"
        felder={[
          { id: 'ax', name: 'x-Koordinate des Ausgangspunkts A', beschriftung: <>x-Koordinate von <Formel tex="A" /></>, erwartet: st.a[0]! },
          { id: 'ay', name: 'y-Koordinate des Ausgangspunkts A', beschriftung: <>y-Koordinate von <Formel tex="A" /></>, erwartet: st.a[1]! },
        ]}
        hilfen={[
          <>Jetzt ist der Zielpunkt bekannt und der Ausgangspunkt gesucht. Du gehst den Weg rückwärts.</>,
          <>Subtrahiere die Koordinaten des Vektors von den Koordinaten von <Formel tex="B" nach="." /></>,
        ]}
        loesung={[
          <>
            Der Ausgangspunkt entsteht, wenn du die Koordinaten des Vektors von denen des Zielpunkts abziehst: <Formel tex={t`A(1-(-3)\,|\,-4-2)=A(4\,|\,-6)`} nach="." />
          </>,
          <>
            Probe: <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}1-4\\-4-(-6)\end{pmatrix}=${spalte(st.v)}`} nach="." /> Das ist der gegebene Vektor.
          </>,
        ]}
      >
        <p>
          Gegeben sind <Formel tex={t`B(1\,|\,-4)`} /> und <Formel tex={t`\overrightarrow{AB}=${spalte(st.v)}`} nach="." /> Bestimme die Koordinaten des Ausgangspunkts <Formel tex="A" nach="." />
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={7}
        titel="Vektoren aus drei Punkten"
        felder={[
          { id: 'ijx', name: 'x-Koordinate des Vektors von I nach J', beschriftung: <>x-Koordinate von <Formel tex={t`\overrightarrow{IJ}`} /></>, erwartet: d.ij[0]! },
          { id: 'ijy', name: 'y-Koordinate des Vektors von I nach J', beschriftung: <>y-Koordinate von <Formel tex={t`\overrightarrow{IJ}`} /></>, erwartet: d.ij[1]! },
          { id: 'jkx', name: 'x-Koordinate des Vektors von J nach K', beschriftung: <>x-Koordinate von <Formel tex={t`\overrightarrow{JK}`} /></>, erwartet: d.jk[0]! },
          { id: 'jky', name: 'y-Koordinate des Vektors von J nach K', beschriftung: <>y-Koordinate von <Formel tex={t`\overrightarrow{JK}`} /></>, erwartet: d.jk[1]! },
        ]}
        hilfen={[
          <>Die Punkte sind nicht eingezeichnet, du rechnest nur mit den Koordinaten. Zielpunkt minus Ausgangspunkt, bei jeder Koordinate einzeln.</>,
          <>Bei <Formel tex={t`\overrightarrow{JK}`} /> ist <Formel tex="J" /> der Ausgangspunkt und <Formel tex="K" /> der Zielpunkt. Setze negative Zahlen in Klammern.</>,
        ]}
        loesung={[
          <>
            <Formel tex={t`\overrightarrow{IJ}=\begin{pmatrix}5-(-3)\\-2-4\end{pmatrix}=${spalte(d.ij)}`} nach="." />
          </>,
          <>
            <Formel tex={t`\overrightarrow{JK}=\begin{pmatrix}-6-5\\-1-(-2)\end{pmatrix}=${spalte(d.jk)}`} nach="." />
          </>,
        ]}
      >
        <p>
          Gegeben sind die Punkte <Formel tex={t`I(-3\,|\,4)`} nach="," /> <Formel tex={t`J(5\,|\,-2)`} /> und <Formel tex={t`K(-6\,|\,-1)`} nach="." /> Bestimme die Koordinaten der Vektoren <Formel tex={t`\overrightarrow{IJ}`} /> und <Formel tex={t`\overrightarrow{JK}`} /> ohne Zeichnung.
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="8"
        titel="Der Gegenvektor"
        optionen={platziere(
          [
            opt('a', <Spalte v={AUFG_GEGEN.gegen} />, true, <>Richtig: Beim Gegenvektor wechseln beide Koordinaten das Vorzeichen.</>),
            opt('b', <Spalte v={[-3, -2]} />, false, <>Hier hat nur die x-Koordinate das Vorzeichen gewechselt. Der Rückweg kehrt aber beide Richtungen um.</>),
            opt('c', <Spalte v={[3, 2]} />, false, <>Hier hat nur die y-Koordinate das Vorzeichen gewechselt. Beim Rückweg wird auch die x-Richtung umgekehrt.</>),
            opt('d', <Spalte v={[2, -3]} />, false, <>Die Koordinaten sind vertauscht. Das ist ein anderer Vektor, der in eine ganz andere Richtung zeigt. Beim Gegenvektor bleiben die Zahlen an ihrer Stelle, nur die Vorzeichen wechseln.</>),
          ],
          0,
        )}
        erklaerung={
          <>
            Der Rückweg macht jede Bewegung rückgängig: 3 Einheiten in Richtung der x-Achse werden zu 3 Einheiten entgegen der Richtung, und 2 Einheiten entgegen der y-Richtung zu 2 Einheiten in y-Richtung. Also ist der Gegenvektor <Formel tex={t`-\vec{a}=\begin{pmatrix}-3\\2\end{pmatrix}`} nach="." />
          </>
        }
      >
        <p>
          Der Vektor <Formel tex={t`\vec{a}=\begin{pmatrix}3\\-2\end{pmatrix}`} /> beschreibt eine Verschiebung. Welcher Vektor beschreibt die Verschiebung zurück?
        </p>
      </Auswahlfrage>

      <Auswahlfrage
        nummer="9"
        titel="Pfeile eines Vektors erkennen"
        optionen={platziere(
          [
            opt('a', <>Pfeil 1 und Pfeil 2</>, true, <>Richtig. Beide haben die Koordinaten <Formel tex={t`\begin{pmatrix}2\\-1\end{pmatrix}`} nach="." /> Sie sind gleich lang, parallel und gleich gerichtet.</>),
            opt('b', <>Pfeil 1, Pfeil 2 und Pfeil 3</>, false, <>Pfeil 3 führt von <Formel tex={t`(1\,|\,-2)`} /> nach <Formel tex={t`(-1\,|\,-1)`} /> und hat die Koordinaten <Formel tex={t`\begin{pmatrix}-2\\1\end{pmatrix}`} nach="." /> Er ist parallel zu den anderen, zeigt aber in die entgegengesetzte Richtung. Das ist der Gegenvektor.</>),
            opt('c', <>Pfeil 2 und Pfeil 4</>, false, <>Pfeil 4 führt von <Formel tex={t`(-2\,|\,-3)`} /> nach <Formel tex={t`(0\,|\,-5)`} /> und hat die Koordinaten <Formel tex={t`\begin{pmatrix}2\\-2\end{pmatrix}`} nach="." /> Er zeigt in eine andere Richtung. Zum selben Vektor gehören nur Pfeile mit denselben Koordinaten.</>),
            opt('d', <>Nur Pfeil 1, weil nur er im zweiten Quadranten beginnt</>, false, <>Wo ein Pfeil beginnt, spielt keine Rolle. Pfeil 2 beginnt an einer anderen Stelle, hat aber dieselben Koordinaten und gehört deshalb zum selben Vektor.</>),
          ],
          3,
        )}
        erklaerung={
          <>
            Du prüfst bei jedem Pfeil Zielpunkt minus Ausgangspunkt: Pfeil 1 liefert <Formel tex={t`\begin{pmatrix}-1-(-3)\\1-2\end{pmatrix}=\begin{pmatrix}2\\-1\end{pmatrix}`} nach="," /> Pfeil 2 liefert <Formel tex={t`\begin{pmatrix}2-0\\2-3\end{pmatrix}=\begin{pmatrix}2\\-1\end{pmatrix}`} nach="." /> Bei Pfeil 3 und Pfeil 4 kommt etwas anderes heraus.
          </>
        }
      >
        <p>
          Welche Pfeile gehören zum Vektor <Formel tex={t`\begin{pmatrix}2\\-1\end{pmatrix}`} nach="?" />
        </p>
        <Bild daten={aufgPfeile()} unter={<>Vier Pfeile, die Zahlen im Bild nummerieren sie.</>} />
      </Auswahlfrage>

      <Aufgabe
        nummer={10}
        titel="Parallelogramm ergänzen"
        felder={[
          { id: 'dx', name: 'x-Koordinate des Punkts D', beschriftung: <>x-Koordinate von <Formel tex="D" /></>, erwartet: pg.d[0]! },
          { id: 'dy', name: 'y-Koordinate des Punkts D', beschriftung: <>y-Koordinate von <Formel tex="D" /></>, erwartet: pg.d[1]! },
        ]}
        hilfen={[
          <>In einem Parallelogramm <Formel tex="ABCD" /> sind die Seiten <Formel tex="AB" /> und <Formel tex="DC" /> gleich lang, parallel und gleich gerichtet. Also gilt <Formel tex={t`\overrightarrow{AB}=\overrightarrow{DC}`} nach="." /></>,
          <>Bestimme zuerst <Formel tex={t`\overrightarrow{AB}`} nach="." /> Von <Formel tex="D" /> kommst du mit diesem Vektor nach <Formel tex="C" nach="." /> Rechne also von <Formel tex="C" /> aus rückwärts.</>,
        ]}
        loesung={[
          <>
            <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}2-(-3)\\0-(-1)\end{pmatrix}=${spalte(pg.ab)}`} nach="." />
          </>,
          <>
            Wegen <Formel tex={t`\overrightarrow{DC}=\overrightarrow{AB}`} /> ist <Formel tex="D" /> der Ausgangspunkt eines Vektors, der in <Formel tex="C" /> endet: <Formel tex={t`D(4-5\,|\,4-1)=D(-1\,|\,3)`} nach="." />
          </>,
          <>
            Probe mit der zweiten Seite: <Formel tex={t`\overrightarrow{AD}=\begin{pmatrix}-1-(-3)\\3-(-1)\end{pmatrix}=\begin{pmatrix}2\\4\end{pmatrix}`} /> und <Formel tex={t`\overrightarrow{BC}=\begin{pmatrix}4-2\\4-0\end{pmatrix}=\begin{pmatrix}2\\4\end{pmatrix}`} nach="." /> Auch diese beiden Seiten gehören zum selben Vektor.
          </>,
        ]}
      >
        <p>
          Die Punkte <Formel tex={t`A(-3\,|\,-1)`} nach="," /> <Formel tex={t`B(2\,|\,0)`} /> und <Formel tex={t`C(4\,|\,4)`} /> sind drei Eckpunkte eines Parallelogramms <Formel tex="ABCD" nach="." /> Bestimme die Koordinaten des vierten Eckpunkts <Formel tex="D" nach="." />
        </p>
        <Bild daten={aufgParallelogramm(false)} unter={<>Die Punkte <Formel tex="A" nach="," /> <Formel tex="B" /> und <Formel tex="C" nach="." /> Der Pfeil von <Formel tex="A" /> nach <Formel tex="B" /> ist eingezeichnet.</>} />
        <Kontrollschaubild>
          <Bild daten={aufgParallelogramm(true)} unter={<>Das Parallelogramm <Formel tex="ABCD" nach="." /> Orange: <Formel tex={t`\overrightarrow{AB}=\overrightarrow{DC}`} nach="," /> blau: <Formel tex={t`\overrightarrow{AD}=\overrightarrow{BC}`} nach="." /></>} />
        </Kontrollschaubild>
      </Aufgabe>
    </Abschnitt>
  );
}
