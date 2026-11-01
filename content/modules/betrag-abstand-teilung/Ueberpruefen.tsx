import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe, type Feld } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { Figur, KontrollFigur } from '@/components/Raumfigur';
import { spalte } from '@/lib/laborhilfen';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { aufgAbstandE, aufgAbstandR, aufgEndpunktBild, aufgMitteE, aufgMitteRBild, aufgTeilungE, aufgTeilungR } from './Bilder';
import {
  A_ABSTAND_E,
  A_ABSTAND_R,
  A_BETRAG_E,
  A_BETRAG_R,
  A_DROHNE,
  A_EINHEIT_E,
  A_EINHEIT_R,
  A_ENDPUNKT,
  A_LAENGE,
  A_MITTE_E,
  A_MITTE_R,
  A_TEILUNG_E,
  A_TEILUNG_R,
  A_VERHAELTNIS,
  A_VIELFACH,
} from './daten';

/** Eingabefelder für alle Koordinaten eines Vektors oder Punkts. */
const koordFelder = (praefix: string, tex: string, wort: string, v: number[], toleranz?: number): Feld[] =>
  v.map((x, i) => ({ id: `${praefix}${i + 1}`, name: `${i + 1}. Koordinate von ${wort}`, beschriftung: <>{i + 1}. Koordinate von <Formel tex={tex} /></>, erwartet: x, ...(toleranz ? { toleranz } : {}) }));
const sp = (v: number[]) => spalte(v);

export function Ueberpruefen() {
  const be = A_BETRAG_E;
  const br = A_BETRAG_R;
  const ae = A_ABSTAND_E;
  const ar = A_ABSTAND_R;
  const ee = A_EINHEIT_E;
  const er = A_EINHEIT_R;
  const dr = A_DROHNE;
  const me = A_MITTE_E;
  const mr = A_MITTE_R;
  const en = A_ENDPUNKT;
  const te = A_TEILUNG_E;
  const tr = A_TEILUNG_R;
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Bearbeite die Aufgaben zuerst im Heft und prüfe dann deine Ergebnisse. Bleibst du stecken, deckst du die Hilfen nacheinander auf. Bei Aufgaben mit Bild kannst du dir das Bild zur Kontrolle einblenden, nachdem du selbst gezeichnet oder gerechnet hast. Die Bilder im Raum lassen sich zwischen Schrägbild und räumlicher Ansicht umschalten.
      </p>
      <Hinweis titel="Eingabe">
        Jede Koordinate eines Vektors oder Punkts trägst du in ein eigenes Feld ein, die obere Koordinate zuerst. Negative Zahlen schreibst du mit Minuszeichen. Dezimalzahlen schreibst du mit Komma. Wo gerundet werden muss, genügen zwei Nachkommastellen. Brüche kannst du mit Schrägstrich eingeben.
      </Hinweis>

      <Aufgabe
        nummer={1}
        titel="Betrag in der Ebene"
        felder={[
          { id: 'a', name: 'Betrag von a', beschriftung: <>Betrag von <Formel tex={t`\vec{a}`} /></>, erwartet: be.betragA },
          { id: 'b', name: 'Betrag von b', beschriftung: <>Betrag von <Formel tex={t`\vec{b}`} /> (zwei Nachkommastellen)</>, erwartet: be.betragB, toleranz: 0.01 },
        ]}
        hilfen={[<>Quadriere jede Koordinate, addiere die Quadrate und ziehe die Wurzel.</>, <>Bei <Formel tex={t`\vec{b}`} /> ist die Summe der Quadrate keine Quadratzahl, du brauchst den Taschenrechner.</>]}
        loesung={[
          <>
            <Formel tex={t`|\vec{a}|=\sqrt{(-5)^2+12^2}=\sqrt{169}=13`} nach="." />
          </>,
          <>
            <Formel tex={t`|\vec{b}|=\sqrt{2^2+5^2}=\sqrt{29}\approx 5{,}39`} nach="." />
          </>,
        ]}
      >
        <p>
          Berechne die Beträge von <Formel tex={t`\vec{a}=${sp(be.a)}`} /> und <Formel tex={t`\vec{b}=${sp(be.b)}`} nach="." />
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={2}
        titel="Betrag im Raum"
        felder={[
          { id: 'a', name: 'Betrag von a', beschriftung: <>Betrag von <Formel tex={t`\vec{a}`} /></>, erwartet: br.betragA },
          { id: 'b', name: 'Betrag von b', beschriftung: <>Betrag von <Formel tex={t`\vec{b}`} /> (zwei Nachkommastellen)</>, erwartet: br.betragB, toleranz: 0.01 },
        ]}
        hilfen={[<>Im Raum kommt die dritte Koordinate dazu: Alle drei Quadrate werden addiert.</>]}
        loesung={[
          <>
            <Formel tex={t`|\vec{a}|=\sqrt{4^2+(-4)^2+2^2}=\sqrt{36}=6`} nach="." />
          </>,
          <>
            <Formel tex={t`|\vec{b}|=\sqrt{2^2+3^2+5^2}=\sqrt{38}\approx 6{,}16`} nach="." />
          </>,
        ]}
      >
        <p>
          Berechne die Beträge von <Formel tex={t`\vec{a}=${sp(br.a)}`} /> und <Formel tex={t`\vec{b}=${sp(br.b)}`} nach="." />
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="3"
        titel="Der Betrag eines Vielfachen"
        optionen={platziere(
          [
            opt('a', <Formel tex="10" />, true, <>Richtig: Der Pfeil von <Formel tex={t`-2\cdot\vec{a}`} /> ist doppelt so lang wie der von <Formel tex={t`\vec{a}`} nach="." /> Das Minuszeichen kehrt nur die Richtung um, die Länge bleibt positiv.</>),
            opt('b', <Formel tex="-10" />, false, <>Ein Betrag ist eine Länge und nie negativ. Das Minuszeichen ändert nur die Richtung des Pfeils.</>),
            opt('c', <Formel tex="3" />, false, <>Das wäre <Formel tex="5-2" nach="." /> Die Zahl <Formel tex="-2" /> wird aber mit dem Vektor multipliziert und verändert dadurch die Länge, nicht der Betrag wird um 2 verringert.</>),
            opt('d', <Formel tex="25" />, false, <>Hier wurde die Zahl <Formel tex="5" /> quadriert. Der Betrag des Vielfachen ist das Zweifache des Betrags, also <Formel tex={t`2\cdot 5`} nach="." /></>),
          ],
          2,
        )}
        erklaerung={<>Für ein Vielfaches gilt: Der Pfeil von <Formel tex={t`r\cdot\vec{a}`} /> ist so oft so lang wie der von <Formel tex={t`\vec{a}`} nach="," /> wie der Betrag von <Formel tex="r" /> angibt. Hier ist das <Formel tex={t`2\cdot 5=10`} nach="." /></>}
      >
        <p>
          Der Vektor <Formel tex={t`\vec{a}`} /> hat den Betrag 5. Welchen Betrag hat <Formel tex={t`-2\cdot\vec{a}`} nach="?" />
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={4}
        titel="Abstand zweier Punkte in der Ebene"
        felder={[...koordFelder('v', t`\overrightarrow{PQ}`, 'P Q', ae.pq), { id: 'd', name: 'Abstand', beschriftung: <>Abstand von <Formel tex="P" /> und <Formel tex="Q" /></>, erwartet: ae.abstand }]}
        hilfen={[<>Der Abstand ist der Betrag des Verbindungsvektors <Formel tex={t`\overrightarrow{PQ}`} nach="." /> Berechne zuerst den Verbindungsvektor, Zielpunkt minus Ausgangspunkt.</>, <>Die Koordinaten sind 6 und minus 8: Das Dreieck hat die Katheten 6 und 8.</>]}
        loesung={[
          <>
            <Formel tex={t`\overrightarrow{PQ}=\begin{pmatrix}4-(-2)\\-7-1\end{pmatrix}=${sp(ae.pq)}`} nach="." />
          </>,
          <>
            <Formel tex={t`|\overrightarrow{PQ}|=\sqrt{6^2+(-8)^2}=\sqrt{100}=10`} nach="." /> Der Abstand der beiden Punkte ist 10 Längeneinheiten.
          </>,
        ]}
      >
        <p>
          Berechne den Abstand der Punkte <Formel tex={t`P(-2\,|\,1)`} /> und <Formel tex={t`Q(4\,|\,-7)`} nach="." /> Gib auch den Verbindungsvektor an.
        </p>
        <Bild daten={aufgAbstandE(false)} unter={<>Die Punkte <Formel tex="P" /> und <Formel tex="Q" nach="." /></>} />
        <Kontrollschaubild>
          <Bild daten={aufgAbstandE(true)} unter={<>Der Pfeil von <Formel tex="P" /> nach <Formel tex="Q" /> und das Hilfsdreieck mit den Katheten 6 und 8.</>} />
        </Kontrollschaubild>
      </Aufgabe>

      <Aufgabe
        nummer={5}
        titel="Abstand zweier Punkte im Raum"
        felder={[...koordFelder('v', t`\overrightarrow{AB}`, 'A B', ar.ab), { id: 'd', name: 'Abstand', beschriftung: <>Abstand von <Formel tex="A" /> und <Formel tex="B" /></>, erwartet: ar.abstand }]}
        hilfen={[<>Berechne zuerst den Verbindungsvektor <Formel tex={t`\overrightarrow{AB}`} nach="." /> Sein Betrag ist der Abstand.</>]}
        loesung={[
          <>
            <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}1-(-3)\\2-(-2)\\1-(-1)\end{pmatrix}=${sp(ar.ab)}`} nach="." />
          </>,
          <>
            <Formel tex={t`|\overrightarrow{AB}|=\sqrt{4^2+4^2+2^2}=\sqrt{36}=6`} nach="." />
          </>,
        ]}
      >
        <p>
          Berechne den Abstand der Punkte <Formel tex={t`A(-3\,|\,-2\,|\,-1)`} /> und <Formel tex={t`B(1\,|\,2\,|\,1)`} nach="." /> Gib auch den Verbindungsvektor an.
        </p>
        <Figur spec={aufgAbstandR(false)} unter={<>Die Punkte <Formel tex="A" /> und <Formel tex="B" nach="." /></>} />
        <KontrollFigur spec={aufgAbstandR(true)} unter={<>Der Pfeil von <Formel tex="A" /> nach <Formel tex="B" /> (orange) und der Weg parallel zu den Achsen in drei Schritten (gestrichelt): 4, 4 und 2 Einheiten.</>} />
      </Aufgabe>

      <Aufgabe
        nummer={6}
        titel="Einheitsvektor in der Ebene"
        felder={koordFelder('e', t`\vec{e}`, 'e', ee.e)}
        hilfen={[<>Berechne zuerst den Betrag von <Formel tex={t`\vec{a}`} nach="." /> Dann teilst du jede Koordinate durch den Betrag.</>]}
        loesung={[
          <>
            <Formel tex={t`|\vec{a}|=\sqrt{(-6)^2+8^2}=\sqrt{100}=10`} nach="." />
          </>,
          <>
            <Formel tex={t`\vec{e}=\frac{1}{10}\cdot\begin{pmatrix}-6\\8\end{pmatrix}=${sp(ee.e)}`} nach="." /> Probe: <Formel tex={t`\sqrt{0{,}36+0{,}64}=1`} nach="." />
          </>,
        ]}
      >
        <p>
          Bestimme den Einheitsvektor <Formel tex={t`\vec{e}`} /> in Richtung von <Formel tex={t`\vec{a}=${sp(ee.a)}`} nach="." />
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={7}
        titel="Einheitsvektor im Raum"
        felder={koordFelder('e', t`\vec{e}`, 'e', er.e, 0.01)}
        hilfen={[<>Der Betrag von <Formel tex={t`\vec{a}`} /> ist eine ganze Zahl. Teile jede Koordinate durch ihn. Du kannst Brüche oder auf zwei Nachkommastellen gerundete Zahlen eingeben.</>]}
        loesung={[
          <>
            <Formel tex={t`|\vec{a}|=\sqrt{2^2+(-1)^2+2^2}=\sqrt{9}=3`} nach="." />
          </>,
          <>
            <Formel tex={t`\vec{e}=\frac{1}{3}\cdot\begin{pmatrix}2\\-1\\2\end{pmatrix}=\begin{pmatrix}\frac{2}{3}\\-\frac{1}{3}\\\frac{2}{3}\end{pmatrix}\approx\begin{pmatrix}0{,}67\\-0{,}33\\0{,}67\end{pmatrix}`} nach="." />
          </>,
        ]}
      >
        <p>
          Bestimme den Einheitsvektor <Formel tex={t`\vec{e}`} /> in Richtung von <Formel tex={t`\vec{a}=${sp(er.a)}`} nach="." />
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={8}
        titel="Vektor mit vorgegebener Länge"
        felder={[...koordFelder('g', t`\vec{u}`, 'u', A_LAENGE.gleich), ...koordFelder('h', t`\vec{w}`, 'w', A_LAENGE.gegen)]}
        hilfen={[<>Bestimme den Einheitsvektor in Richtung von <Formel tex={t`\vec{a}`} nach="." /> Multipliziere ihn dann mit der gewünschten Länge. Für die Gegenrichtung nimmst du den Gegenvektor.</>]}
        loesung={[
          <>
            Der Betrag von <Formel tex={t`\vec{a}`} /> ist <Formel tex={t`\sqrt{3^2+4^2}=5`} nach="." /> Der Einheitsvektor ist <Formel tex={t`\frac{1}{5}\cdot\begin{pmatrix}3\\4\end{pmatrix}=\begin{pmatrix}0{,}6\\0{,}8\end{pmatrix}`} nach="." />
          </>,
          <>
            Der Vektor der Länge 15 ist <Formel tex={t`15\cdot\begin{pmatrix}0{,}6\\0{,}8\end{pmatrix}=${sp(A_LAENGE.gleich)}`} nach="." /> In Gegenrichtung gilt <Formel tex={t`\vec{w}=${sp(A_LAENGE.gegen)}`} nach="." />
          </>,
        ]}
      >
        <p>
          Gesucht ist ein Vektor <Formel tex={t`\vec{u}`} /> der Länge 15, der in dieselbe Richtung zeigt wie <Formel tex={t`\vec{a}=${sp(A_LAENGE.a)}`} nach="." /> Außerdem ein Vektor <Formel tex={t`\vec{w}`} /> der Länge 15 in die Gegenrichtung.
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={9}
        titel="Luftlinie und Flugstrecke"
        felder={[
          { id: 'luft', name: 'Luftlinie in Metern', beschriftung: <>Luftlinie vom Start zum Ziel in m</>, erwartet: dr.luftlinie },
          { id: 'weg', name: 'Flugstrecke in Metern', beschriftung: <>Länge des gesamten Flugs in m (zwei Nachkommastellen)</>, erwartet: dr.weg, toleranz: 0.01 },
        ]}
        hilfen={[
          <>Die Luftlinie ist der Betrag der Summe der drei Flugvektoren. Die Länge des Flugs ist die Summe der drei einzelnen Beträge.</>,
          <>Addiere zuerst die drei Vektoren koordinatenweise und berechne dann den Betrag.</>,
        ]}
        loesung={[
          <>
            Summe: <Formel tex={t`\vec{v}_1+\vec{v}_2+\vec{v}_3=\begin{pmatrix}1-2+3\\-2-3-1\\4+1+4\end{pmatrix}=${sp(dr.summe)}`} nach="." /> Die Luftlinie ist <Formel tex={t`\sqrt{2^2+(-6)^2+9^2}=\sqrt{121}=11`} /> m lang.
          </>,
          <>
            Einzelne Beträge: <Formel tex={t`|\vec{v}_1|=\sqrt{21}\approx 4{,}58`} nach="," /> <Formel tex={t`|\vec{v}_2|=\sqrt{14}\approx 3{,}74`} nach="," /> <Formel tex={t`|\vec{v}_3|=\sqrt{26}\approx 5{,}10`} nach="." /> Die Drohne fliegt insgesamt etwa <Formel tex={t`4{,}58+3{,}74+5{,}10=13{,}42`} /> m. Der Betrag der Summe ist kleiner als die Summe der Beträge, weil die Drohne nicht geradeaus fliegt.
          </>,
        ]}
      >
        <p>
          Eine Drohne fliegt nacheinander <Formel tex={t`\vec{v}_1=${sp(dr.v[0]!)}`} nach="," /> <Formel tex={t`\vec{v}_2=${sp(dr.v[1]!)}`} /> und <Formel tex={t`\vec{v}_3=${sp(dr.v[2]!)}`} /> (alle Angaben in Metern). Wie weit ist sie am Ende vom Start entfernt (Luftlinie)? Wie lang ist die Strecke, die sie insgesamt fliegt?
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={10}
        titel="Mittelpunkt in der Ebene"
        felder={koordFelder('m', 'M', 'M', me.m)}
        hilfen={[<>Der Mittelpunkt hat den Ortsvektor <Formel tex={t`\tfrac{1}{2}(\vec{a}+\vec{b})`} nach="." /> Du kannst auch von <Formel tex="A" /> aus die Hälfte von <Formel tex={t`\overrightarrow{AB}`} /> gehen.</>]}
        loesung={[
          <>
            <Formel tex={t`\overrightarrow{OM}=\tfrac{1}{2}\left(\begin{pmatrix}-3\\5\end{pmatrix}+\begin{pmatrix}7\\-1\end{pmatrix}\right)=\tfrac{1}{2}\begin{pmatrix}4\\4\end{pmatrix}=${sp(me.m)}`} nach="." />
          </>,
          <>
            Zur Kontrolle über den Verbindungsvektor: <Formel tex={t`\overrightarrow{AB}=${sp(me.ab)}`} nach="," /> die Hälfte ist <Formel tex={t`\begin{pmatrix}5\\-3\end{pmatrix}`} nach="," /> also <Formel tex={t`M(-3+5\,|\,5-3)=M(2\,|\,2)`} nach="." />
          </>,
        ]}
      >
        <p>
          Bestimme den Mittelpunkt <Formel tex="M" /> der Strecke von <Formel tex={t`A(-3\,|\,5)`} /> nach <Formel tex={t`B(7\,|\,-1)`} nach="." />
        </p>
        <Bild daten={aufgMitteE(false)} unter={<>Die Punkte <Formel tex="A" /> und <Formel tex="B" nach="." /></>} />
        <Kontrollschaubild>
          <Bild daten={aufgMitteE(true)} unter={<>Der Mittelpunkt <Formel tex="M" nach="." /> Der blaue Pfeil von <Formel tex="A" /> nach <Formel tex="M" /> ist die Hälfte des orangen Pfeils von <Formel tex="A" /> nach <Formel tex="B" nach="." /></>} />
        </Kontrollschaubild>
      </Aufgabe>

      <Aufgabe
        nummer={11}
        titel="Mittelpunkt im Raum"
        felder={koordFelder('m', 'M', 'M', mr.m)}
        hilfen={[<>Addiere die Koordinaten von <Formel tex="A" /> und <Formel tex="B" /> und halbiere die Summe.</>]}
        loesung={[
          <>
            <Formel tex={t`\overrightarrow{OM}=\tfrac{1}{2}\begin{pmatrix}-2+4\\2+0\\1+3\end{pmatrix}=\tfrac{1}{2}\begin{pmatrix}2\\2\\4\end{pmatrix}=${sp(mr.m)}`} nach="." />
          </>,
          <>Im Bild sind die Pfeile von <Formel tex="A" /> nach <Formel tex="M" /> und von <Formel tex="M" /> nach <Formel tex="B" /> gleich lang und gleich gerichtet.</>,
        ]}
      >
        <p>
          Bestimme den Mittelpunkt <Formel tex="M" /> der Strecke von <Formel tex={t`A(-2\,|\,2\,|\,1)`} /> nach <Formel tex={t`B(4\,|\,0\,|\,3)`} nach="." />
        </p>
        <Figur spec={aufgMitteRBild(false)} unter={<>Die Punkte <Formel tex="A" /> und <Formel tex="B" nach="." /></>} />
        <KontrollFigur spec={aufgMitteRBild(true)} unter={<>Der Mittelpunkt <Formel tex="M" nach="." /> Die Pfeile von <Formel tex="A" /> nach <Formel tex="M" /> (orange) und von <Formel tex="M" /> nach <Formel tex="B" /> (blau) sind gleich.</>} />
      </Aufgabe>

      <Aufgabe
        nummer={12}
        titel="Endpunkt einer Strecke bestimmen"
        felder={koordFelder('b', 'B', 'B', en.b)}
        hilfen={[<>Der Mittelpunkt liegt in der Mitte zwischen <Formel tex="A" /> und <Formel tex="B" nach="." /> Von <Formel tex="A" /> nach <Formel tex="M" /> ist es genauso weit wie von <Formel tex="M" /> nach <Formel tex="B" nach="." /></>, <>Es gilt <Formel tex={t`\overrightarrow{MB}=\overrightarrow{AM}`} nach="." /></>]}
        loesung={[
          <>
            <Formel tex={t`\overrightarrow{AM}=\begin{pmatrix}-1-1\\-1-(-4)\\-2-(-3)\end{pmatrix}=\begin{pmatrix}-2\\3\\1\end{pmatrix}`} nach="." />
          </>,
          <>
            <Formel tex={t`B(-1+(-2)\,|\,-1+3\,|\,-2+1)=B(-3\,|\,2\,|\,-1)`} nach="." /> Zur Kontrolle: <Formel tex={t`\tfrac{1}{2}\begin{pmatrix}1+(-3)\\-4+2\\-3+(-1)\end{pmatrix}=\begin{pmatrix}-1\\-1\\-2\end{pmatrix}`} nach="." />
          </>,
        ]}
      >
        <p>
          Der Punkt <Formel tex={t`M(-1\,|\,-1\,|\,-2)`} /> ist der Mittelpunkt der Strecke von <Formel tex={t`A(1\,|\,-4\,|\,-3)`} /> nach <Formel tex="B" nach="." /> Bestimme die Koordinaten von <Formel tex="B" nach="." />
        </p>
        <Figur spec={aufgEndpunktBild(false)} unter={<>Die Punkte <Formel tex="A" /> und <Formel tex="M" nach="." /></>} />
        <KontrollFigur spec={aufgEndpunktBild(true)} unter={<>Der Punkt <Formel tex="B" nach="." /> Die Pfeile von <Formel tex="A" /> nach <Formel tex="M" /> und von <Formel tex="M" /> nach <Formel tex="B" /> sind gleich.</>} />
      </Aufgabe>

      <Auswahlfrage
        nummer="13"
        titel="Der Ortsvektor des Mittelpunkts"
        optionen={platziere(
          [
            opt('a', <Formel tex={t`\tfrac{1}{2}\cdot(\vec{a}+\vec{b})`} />, true, <>Richtig: Jede Koordinate des Mittelpunkts ist der Mittelwert der Koordinaten von <Formel tex="A" /> und <Formel tex="B" nach="." /></>),
            opt('b', <Formel tex={t`\tfrac{1}{2}\cdot(\vec{a}-\vec{b})`} />, false, <>Das ist die Hälfte des Verbindungsvektors von <Formel tex="B" /> nach <Formel tex="A" nach="." /> Er beschreibt eine Verschiebung, nicht die Lage von <Formel tex="M" nach="." /></>),
            opt('c', <Formel tex={t`\vec{a}+\tfrac{1}{2}\cdot\vec{b}`} />, false, <>Hier ist nur <Formel tex={t`\vec{b}`} /> halbiert. Der Mittelpunkt entsteht aus <Formel tex={t`\vec{a}`} /> plus der Hälfte von <Formel tex={t`\vec{b}-\vec{a}`} nach="." /></>),
            opt('d', <Formel tex={t`\tfrac{1}{2}\cdot\overrightarrow{AB}`} />, false, <>Das ist der Vektor von <Formel tex="A" /> nach <Formel tex="M" nach="," /> aber nicht der Ortsvektor von <Formel tex="M" nach="." /> Es fehlt der Weg vom Ursprung nach <Formel tex="A" nach="." /></>),
          ],
          1,
        )}
        erklaerung={<>Der Ortsvektor führt vom Ursprung zu <Formel tex="M" nach="." /> Er ist <Formel tex={t`\overrightarrow{OA}+\tfrac{1}{2}\overrightarrow{AB}=\vec{a}+\tfrac{1}{2}(\vec{b}-\vec{a})=\tfrac{1}{2}(\vec{a}+\vec{b})`} nach="." /></>}
      >
        <p>
          Welcher Ausdruck ist der Ortsvektor des Mittelpunkts <Formel tex="M" /> der Strecke <Formel tex="AB" nach="?" /> Es sind <Formel tex={t`\vec{a}`} /> und <Formel tex={t`\vec{b}`} /> die Ortsvektoren von <Formel tex="A" /> und <Formel tex="B" nach="." />
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={14}
        titel="Teilung einer Strecke in der Ebene"
        felder={koordFelder('t', 'T', 'T', te.t)}
        hilfen={[<>Die Strecke besteht aus <Formel tex="2+3=5" /> Teilen. <Formel tex={t`\overrightarrow{AT}`} /> ist zwei davon lang, also <Formel tex={t`\tfrac{2}{5}`} /> von <Formel tex={t`\overrightarrow{AB}`} nach="." /></>, <>Berechne <Formel tex={t`\overrightarrow{AB}`} nach="," /> multipliziere mit <Formel tex={t`\tfrac{2}{5}`} /> und addiere das Ergebnis zu den Koordinaten von <Formel tex="A" nach="." /></>]}
        loesung={[
          <>
            <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}6-(-4)\\4-(-1)\end{pmatrix}=${sp(te.ab)}`} nach="." />
          </>,
          <>
            <Formel tex={t`\overrightarrow{AT}=\tfrac{2}{5}\cdot\begin{pmatrix}10\\5\end{pmatrix}=\begin{pmatrix}4\\2\end{pmatrix}`} nach="," /> also <Formel tex={t`T(-4+4\,|\,-1+2)=T(0\,|\,1)`} nach="." /> Probe: <Formel tex={t`\overrightarrow{TB}=\begin{pmatrix}6\\3\end{pmatrix}`} /> ist das Anderthalbfache von <Formel tex={t`\overrightarrow{AT}`} nach="." />
          </>,
        ]}
      >
        <p>
          Der Punkt <Formel tex="T" /> teilt die Strecke von <Formel tex={t`A(-4\,|\,-1)`} /> nach <Formel tex={t`B(6\,|\,4)`} /> im Verhältnis <Formel tex="2:3" nach="." /> Bestimme die Koordinaten von <Formel tex="T" nach="." />
        </p>
        <Bild daten={aufgTeilungE(false)} unter={<>Die Punkte <Formel tex="A" /> und <Formel tex="B" nach="." /></>} />
        <Kontrollschaubild>
          <Bild daten={aufgTeilungE(true)} unter={<>Der Teilpunkt <Formel tex="T" nach="." /> Der orange Pfeil von <Formel tex="A" /> nach <Formel tex="T" /> ist zwei Fünftel der Strecke lang, der blaue Pfeil von <Formel tex="T" /> nach <Formel tex="B" /> drei Fünftel.</>} />
        </Kontrollschaubild>
      </Aufgabe>

      <Aufgabe
        nummer={15}
        titel="Teilung einer Strecke im Raum"
        felder={koordFelder('p', 'P', 'P', tr.p)}
        hilfen={[<>Die Strecke besteht aus <Formel tex="1+2=3" /> Teilen. <Formel tex={t`\overrightarrow{AP}`} /> ist ein Teil lang, also <Formel tex={t`\tfrac{1}{3}`} /> von <Formel tex={t`\overrightarrow{AB}`} nach="." /></>]}
        loesung={[
          <>
            <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}-1-2\\3-(-3)\\2-(-4)\end{pmatrix}=${sp(tr.ab)}`} nach="." />
          </>,
          <>
            <Formel tex={t`\overrightarrow{AP}=\tfrac{1}{3}\cdot\begin{pmatrix}-3\\6\\6\end{pmatrix}=\begin{pmatrix}-1\\2\\2\end{pmatrix}`} nach="," /> also <Formel tex={t`P(2+(-1)\,|\,-3+2\,|\,-4+2)=P(1\,|\,-1\,|\,-2)`} nach="." />
          </>,
        ]}
      >
        <p>
          Der Punkt <Formel tex="P" /> teilt die Strecke von <Formel tex={t`A(2\,|\,-3\,|\,-4)`} /> nach <Formel tex={t`B(-1\,|\,3\,|\,2)`} /> im Verhältnis <Formel tex="1:2" nach="." /> Bestimme die Koordinaten von <Formel tex="P" nach="." />
        </p>
        <Figur spec={aufgTeilungR(false)} unter={<>Die Punkte <Formel tex="A" /> und <Formel tex="B" nach="." /></>} />
        <KontrollFigur spec={aufgTeilungR(true)} unter={<>Der Teilpunkt <Formel tex="P" nach="." /> Der orange Pfeil von <Formel tex="A" /> nach <Formel tex="P" /> ist ein Drittel der Strecke lang, der blaue Pfeil von <Formel tex="P" /> nach <Formel tex="B" /> zwei Drittel.</>} />
      </Aufgabe>

      <Auswahlfrage
        nummer="16"
        titel="Das Teilungsverhältnis"
        optionen={platziere(
          [
            opt('a', <Formel tex="3:1" />, true, <>Richtig: <Formel tex={t`\overrightarrow{AT}`} /> ist drei Viertel der Strecke lang, <Formel tex={t`\overrightarrow{TB}`} /> ein Viertel. Die beiden Teilstrecken verhalten sich wie 3 zu 1.</>),
            opt('b', <Formel tex="3:4" />, false, <>Das vergleicht die Teilstrecke <Formel tex="AT" /> mit der ganzen Strecke, nicht mit der anderen Teilstrecke <Formel tex="TB" nach="." /></>),
            opt('c', <Formel tex="1:3" />, false, <>Das Verhältnis ist vertauscht: <Formel tex="AT" /> ist die längere Teilstrecke.</>),
            opt('d', <Formel tex="4:3" />, false, <>Hier wurde die ganze Strecke mit <Formel tex="AT" /> verglichen. Die Teilstrecke <Formel tex="TB" /> ist aber nur ein Viertel lang.</>),
          ],
          3,
        )}
        erklaerung={<>Ist <Formel tex={t`\overrightarrow{AT}=\tfrac{3}{4}\cdot\overrightarrow{AB}`} nach="," /> bleibt für <Formel tex={t`\overrightarrow{TB}`} /> das letzte Viertel. Das Verhältnis <Formel tex="AT:TB" /> ist also <Formel tex={t`\tfrac{3}{4}:\tfrac{1}{4}=3:1`} nach="." /></>}
      >
        <p>
          Der Punkt <Formel tex="T" /> liegt auf der Strecke <Formel tex="AB" /> und es gilt <Formel tex={t`\overrightarrow{AT}=\tfrac{3}{4}\cdot\overrightarrow{AB}`} nach="." /> In welchem Verhältnis <Formel tex="AT:TB" /> teilt <Formel tex="T" /> die Strecke?
        </p>
      </Auswahlfrage>
    </Abschnitt>
  );
}
