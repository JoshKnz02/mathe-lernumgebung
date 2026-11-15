import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { KontrollFigur } from '@/components/Raumfigur';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { BILD_K1, BILD_K3 } from './Bilder';
import { Eingabehinweis } from './Eingabehinweis';
import { F, P, V, koordFelder } from './hilfen';
import { Kontrolle, Kontrollfrage, Punkt } from './Punkt';
import { K1, K10, K11, K12, K13, K14, K15, K16, K17, K2, K3, K4, K5, K6, K7, K8, K9, TOL1 } from './werte';

/** Bereich Vektoren: Aussagen 1 bis 17. */
export function Vektoren() {
  return (
    <Abschnitt id="vektoren" titel="Vektoren">
      <p>Hier geht es um Punkte und Vektoren im Raum, das Rechnen mit Vektoren, Betrag und Abstand, das Skalarprodukt (Orthogonalität und Winkel), das Vektorprodukt (Kreuzprodukt) und um Dreiecke und Vierecke.</p>
      <Eingabehinweis />

      <Punkt id="raumpunkte">
        <Kontrolle
          aussage="raumpunkte"
          nummer="K1"
          titel="Ein Quader im Koordinatensystem"
          felder={[...koordFelder('f', 'Ecke F', K1.F, (i) => `F_${i + 1}`), ...koordFelder('v', 'Vektor FB', K1.FB, (i) => `v_${i + 1}`)]}
          hilfen={[
            <>Die Kanten des Quaders liegen auf den Achsen. Die Ecke <Formel tex="G" /> verrät dir die Länge der drei Kanten: {F(t`2`)} in Richtung <Formel tex="x_1" nach="," /> {F(t`3`)} in Richtung <Formel tex="x_2" /> und {F(t`4`)} in Richtung <Formel tex="x_3" nach="." /></>,
            <>Die Ecke <Formel tex="F" /> liegt in der <Formel tex="x_1x_3" />-Ebene, ihre zweite Koordinate ist also {F('0', '.')} Den Vektor <Formel tex={t`\overrightarrow{FB}`} /> berechnest du als Differenz: Koordinaten von <Formel tex="B" /> minus Koordinaten von <Formel tex="F" nach="." /></>,
          ]}
          loesung={[
            <>
              Die Kanten haben die Längen 2, 3 und 4. Die Ecke <Formel tex="F" /> liegt auf der Kante in Richtung <Formel tex="x_1" /> und der Kante in Richtung <Formel tex="x_3" nach="," /> aber nicht in Richtung <Formel tex="x_2" nach=":" /> {P('F', K1.F, '.')}
            </>,
            <>
              Die Ecke <Formel tex="B" /> liegt auf der <Formel tex="x_2" />-Achse: {P('B', K1.B, '.')} Dann ist <Formel tex={t`\overrightarrow{FB}=\overrightarrow{OB}-\overrightarrow{OF}`} nach="," /> also {V(K1.FB, '.')}
            </>,
            <>Der Pfeil geht von <Formel tex="F" /> nach <Formel tex="B" nach=":" /> zwei Einheiten gegen die <Formel tex="x_1" />-Richtung, drei in die <Formel tex="x_2" />-Richtung und vier gegen die <Formel tex="x_3" />-Richtung.</>,
          ]}
        >
          <p>
            Ein Quader hat eine Ecke im Ursprung <Formel tex="O" nach="." /> Seine Kanten liegen auf den Koordinatenachsen, die gegenüberliegende Ecke ist {P('G', K1.G, '.')} Die Ecke <Formel tex="F" /> liegt in der <Formel tex="x_1x_3" />-Ebene und nicht auf einer Achse, die Ecke <Formel tex="B" /> liegt auf der <Formel tex="x_2" />-Achse. Gib die Koordinaten von <Formel tex="F" /> an und bestimme den Vektor <Formel tex={t`\vec v=\overrightarrow{FB}`} nach="." />
          </p>
          <KontrollFigur spec={BILD_K1} unter={<>Der Quader mit den Ecken <Formel tex="O" nach="," /> <Formel tex="F" nach="," /> <Formel tex="B" /> und <Formel tex="G" nach="." /> Der orange Pfeil ist der Vektor <Formel tex={t`\overrightarrow{FB}`} nach="." /></>} />
        </Kontrolle>
      </Punkt>

      <Punkt id="spiegeln-achsen">
        <Kontrolle
          aussage="spiegeln-achsen"
          nummer="K2"
          titel="Spiegeln an Ursprung, Achse und Ebene"
          felder={[
            ...koordFelder('u', 'Spiegelung am Ursprung', K2.ursprung, (i) => `U_${i + 1}`),
            ...koordFelder('a', 'Spiegelung an der x1-Achse', K2.achse1, (i) => `A_${i + 1}`),
            ...koordFelder('e', 'Spiegelung an der x2x3-Ebene', K2.ebene23, (i) => `E_${i + 1}`),
          ]}
          hilfen={[
            <>Überlege bei jeder Spiegelung, welche Koordinaten ihr Vorzeichen wechseln und welche gleich bleiben.</>,
            <>Am Ursprung wechseln alle drei Vorzeichen. An einer Achse bleibt nur die Koordinate dieser Achse gleich. An einer Koordinatenebene wechselt nur die Koordinate, die in der Gleichung der Ebene vorkommt (zum Beispiel <Formel tex="x_1" /> bei <Formel tex="x_1=0" nach=")." /></>,
          ]}
          loesung={[
            <>Am Ursprung: alle Vorzeichen wechseln, {P('U', K2.ursprung, '.')}</>,
            <>An der <Formel tex="x_1" />-Achse: nur <Formel tex="x_1" /> bleibt gleich, {P('A', K2.achse1, '.')}</>,
            <>An der <Formel tex="x_2x_3" />-Ebene (das ist die Ebene <Formel tex="x_1=0" nach=")" />: nur <Formel tex="x_1" /> wechselt das Vorzeichen, {P('E', K2.ebene23, '.')}</>,
          ]}
        >
          <p>
            Spiegle den Punkt {P('P', K2.P, '')} am Ursprung (<Formel tex="U" nach=")," /> an der <Formel tex="x_1" />-Achse (<Formel tex="A" nach=")" /> und an der <Formel tex="x_2x_3" />-Ebene (<Formel tex="E" nach=")." /> Gib die Koordinaten der drei Bildpunkte an.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="linearkombination">
        <Kontrolle
          aussage="linearkombination"
          nummer="K3"
          titel="Linearkombination im Koordinatensystem"
          felder={[
            { id: 'c1', name: 'Vektor c Zeile 1', beschriftung: <Formel tex="c_1" />, erwartet: K3.c[0]! },
            { id: 'c2', name: 'Vektor c Zeile 2', beschriftung: <Formel tex="c_2" />, erwartet: K3.c[1]! },
          ]}
          hilfen={[
            <>Berechne zuerst das Doppelte von <Formel tex={t`\vec a`} nach=":" /> Jede Zeile wird mit 2 multipliziert.</>,
            <>Subtrahiere dann <Formel tex={t`\vec b`} nach=":" /> Von jeder Zeile des Doppelten wird die entsprechende Zeile von <Formel tex={t`\vec b`} /> abgezogen.</>,
          ]}
          loesung={[
            <>Zuerst <Formel tex={t`2\vec a`} nach=":" /> {V([4, 2], '.')}</>,
            <>Dann <Formel tex={t`\vec c=2\vec a-\vec b`} nach=":" /> erste Zeile <Formel tex="4-(-1)=5" nach="," /> zweite Zeile <Formel tex="2-3=-1" nach="." /> Also {V(K3.c, '.')}</>,
            <>Im Bild: Vom Ursprung aus fährst du mit dem Pfeil <Formel tex={t`2\vec a`} nach="," /> an dessen Spitze hängst du den Gegenpfeil von <Formel tex={t`\vec b`} /> an. Der Pfeil vom Ursprung zur neuen Spitze ist <Formel tex={t`\vec c`} nach="." /></>,
          ]}
        >
          <p>
            Gegeben sind die Vektoren {V(K3.a, '')} und {V(K3.b, '.')} Bestimme <Formel tex={t`\vec c=2\vec a-\vec b`} /> und veranschauliche die Linearkombination. Trage die Zeilen von <Formel tex={t`\vec c`} /> ein.
          </p>
          <Kontrollschaubild>
            <Bild daten={BILD_K3} unter={<>Zuerst der blaue Pfeil <Formel tex={t`2\vec a`} nach="," /> dann der orange Pfeil <Formel tex={t`-\vec b`} nach="." /> Der schwarze Pfeil ist <Formel tex={t`\vec c`} nach="." /></>} />
          </Kontrollschaubild>
        </Kontrolle>
      </Punkt>

      <Punkt id="mittelpunkt">
        <Kontrolle
          aussage="mittelpunkt"
          nummer="K4"
          titel="Mittelpunkt einer Strecke"
          felder={koordFelder('m', 'Mittelpunkt M', K4.M, (i) => `M_${i + 1}`)}
          hilfen={[
            <>Der Mittelpunkt ist der Punkt, der genau auf halber Strecke von <Formel tex="A" /> nach <Formel tex="B" /> liegt.</>,
            <>Du kannst für jede Koordinate den Mittelwert der beiden Koordinaten bilden, oder <Formel tex={t`\overrightarrow{OM}=\overrightarrow{OA}+\frac{1}{2}\overrightarrow{AB}`} /> rechnen.</>,
          ]}
          loesung={[
            <>Mittelwert jeder Koordinate: <Formel tex={t`\frac{3+(-1)}{2}=1`} nach="," /> <Formel tex={t`\frac{-2+6}{2}=2`} nach="," /> <Formel tex={t`\frac{7+(-3)}{2}=2`} nach="." /></>,
            <>Der Mittelpunkt ist {P('M', K4.M, '.')} Probe: <Formel tex={t`\overrightarrow{AM}=\overrightarrow{MB}=\begin{pmatrix}-2\\4\\-5\end{pmatrix}`} nach="." /></>,
          ]}
        >
          <p>
            Gegeben sind die Punkte {P('A', K4.A, '')} und {P('B', K4.B, '.')} Bestimme den Mittelpunkt <Formel tex="M" /> der Strecke <Formel tex="AB" nach="." />
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="teilung">
        <Kontrolle
          aussage="teilung"
          nummer="K5"
          titel="Eine Strecke teilen"
          felder={koordFelder('t', 'Teilpunkt T', K5.T, (i) => `T_${i + 1}`)}
          hilfen={[
            <>Teilt <Formel tex="T" /> die Strecke im Verhältnis {F(t`3:2`, ',')} dann ist die Strecke in 3 plus 2 gleiche Teile geteilt. Wie viele dieser Teile liegen zwischen <Formel tex="P" /> und <Formel tex="T" nach="?" /></>,
            <>Von <Formel tex="P" /> aus gehst du <Formel tex={t`\frac{3}{5}`} /> des Vektors <Formel tex={t`\overrightarrow{PQ}`} nach=":" /> <Formel tex={t`\overrightarrow{OT}=\overrightarrow{OP}+\frac{3}{5}\overrightarrow{PQ}`} nach="." /></>,
          ]}
          loesung={[
            <>Der Verbindungsvektor ist {V([10, -5, 5], '.')} Er ist in 5 Teile geteilt, bis <Formel tex="T" /> sind es 3 Teile, also <Formel tex={t`\frac{3}{5}`} nach=":" /> {V([6, -3, 3], '.')}</>,
            <>Der Ortsvektor von <Formel tex="T" /> ist {V(K5.P, '')} plus {V([6, -3, 3], '')} gleich {V(K5.T, '.')} Der Punkt ist {P('T', K5.T, '.')}</>,
          ]}
        >
          <p>
            Der Punkt <Formel tex="T" /> teilt die Strecke von {P('P', K5.P, '')} nach {P('Q', K5.Q, '')} im Verhältnis {F(t`3:2`, '.')} Das heißt: Die Strecke <Formel tex="PT" /> ist anderthalbmal so lang wie die Strecke <Formel tex="TQ" nach="." /> Bestimme den Punkt <Formel tex="T" nach="." />
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="punktspiegelung">
        <Kontrolle
          aussage="punktspiegelung"
          nummer="K6"
          titel="Spiegeln an einem Punkt"
          felder={koordFelder('s', "Spiegelpunkt A'", K6.A2, (i) => `A'_${i + 1}`)}
          hilfen={[
            <>Bei der Spiegelung von <Formel tex="A" /> an <Formel tex="B" /> ist <Formel tex="B" /> der Mittelpunkt der Strecke von <Formel tex="A" /> zum Bildpunkt <Formel tex={t`A'`} nach="." /></>,
            <>Du gehst also von <Formel tex="A" /> aus zweimal den Vektor <Formel tex={t`\overrightarrow{AB}`} nach=":" /> <Formel tex={t`\overrightarrow{OA'}=\overrightarrow{OA}+2\cdot\overrightarrow{AB}`} nach="." /></>,
          ]}
          loesung={[
            <>Der Verbindungsvektor ist {V([3, -3, 5], '.')} Das Doppelte davon ist {V([6, -6, 10], '.')}</>,
            <>{V(K6.A, '')} plus {V([6, -6, 10], '')} ergibt {V(K6.A2, '.')} Der Spiegelpunkt ist {P("A'", K6.A2, '.')} Probe: Der Mittelpunkt von <Formel tex="A" /> und <Formel tex={t`A'`} /> ist {P('B', K6.B, '.')}</>,
          ]}
        >
          <p>
            Spiegle den Punkt {P('A', K6.A, '')} am Punkt {P('B', K6.B, '.')} Bestimme den Bildpunkt <Formel tex={t`A'`} nach="." />
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="betrag">
        <Kontrolle
          aussage="betrag"
          nummer="K7"
          titel="Länge von Vektoren"
          felder={[
            { id: 'u', name: 'Länge von u', beschriftung: <Formel tex={t`|\vec u|`} />, erwartet: K7.lu },
            { id: 'v', name: 'Länge von v', beschriftung: <Formel tex={t`|\vec v|`} />, erwartet: K7.lv },
            { id: 'pq', name: 'Länge der Strecke PQ', beschriftung: <Formel tex={t`|\overrightarrow{PQ}|`} />, erwartet: K7.lPQ },
          ]}
          hilfen={[
            <>Die Länge eines Vektors ist die Wurzel aus der Summe der Quadrate seiner Koordinaten. Die Ergebnisse dieser Aufgabe sind ganze Zahlen.</>,
            <>Für <Formel tex={t`\overrightarrow{PQ}`} /> brauchst du zuerst den Verbindungsvektor: Koordinaten von <Formel tex="Q" /> minus Koordinaten von <Formel tex="P" nach="." /></>,
          ]}
          loesung={[
            <>Summe der Quadrate: <Formel tex={t`4+9+36=49`} nach="." /> Länge: <Formel tex={t`|\vec u|=\sqrt{49}=7`} nach="." /></>,
            <>Summe der Quadrate: <Formel tex={t`16+16+49=81`} nach="." /> Länge: <Formel tex={t`|\vec v|=\sqrt{81}=9`} nach="." /></>,
            <>Verbindungsvektor: <Formel tex={t`\overrightarrow{PQ}=(4\,|\,4\,|\,2)`} nach="." /> Summe der Quadrate: <Formel tex={t`16+16+4=36`} nach="." /> Länge: <Formel tex={t`\sqrt{36}=6`} nach="." /></>,
          ]}
        >
          <p>
            Gegeben sind die Vektoren {V(K7.u, '')} und {V(K7.v, '')} sowie die Punkte {P('P', K7.P, '')} und {P('Q', K7.Q, '.')} Berechne die Länge von <Formel tex={t`\vec u`} nach="," /> von <Formel tex={t`\vec v`} /> und der Strecke <Formel tex="PQ" nach="." />
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="einheitsvektor">
        <Kontrolle
          aussage="einheitsvektor"
          nummer="K8"
          titel="Einheitsvektor"
          felder={koordFelder('e', 'Einheitsvektor', K8.e, (i) => `e_${i + 1}`)}
          hilfen={[
            <>Ein Einheitsvektor hat die Länge 1 und zeigt in dieselbe Richtung wie der gegebene Vektor. Berechne zuerst die Länge von <Formel tex={t`\vec v`} nach="." /></>,
            <>Teile jede Koordinate durch die Länge, das ist die Multiplikation mit <Formel tex={t`\frac{1}{|\vec v|}`} nach="." /> Brüche kannst du als Bruch eingeben, zum Beispiel <Formel tex={t`\frac{2}{7}`} nach="." /></>,
          ]}
          loesung={[
            <>Summe der Quadrate: <Formel tex={t`36+9+4=49`} nach="." /> Länge: <Formel tex={t`|\vec v|=\sqrt{49}=7`} nach="." /></>,
            <>Der Einheitsvektor ist <Formel tex={t`\vec e=\frac{1}{7}\cdot\vec v=\begin{pmatrix}\frac{6}{7}\\-\frac{3}{7}\\\frac{2}{7}\end{pmatrix}`} nach="." /> Probe: <Formel tex={t`\frac{36}{49}+\frac{9}{49}+\frac{4}{49}=1`} nach="." /></>,
          ]}
        >
          <p>
            Bestimme den Einheitsvektor von {V(K8.v, '.')} Gib die drei Zeilen als Bruch ein.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="punkt-auf-strecke">
        <Kontrolle
          aussage="punkt-auf-strecke"
          nummer="K9"
          titel="Ein Punkt mit gegebenem Abstand"
          felder={koordFelder('d', 'Punkt D', K9.D, (i) => `D_${i + 1}`)}
          hilfen={[
            <>Berechne zuerst die Länge der Strecke <Formel tex="AB" nach="." /> Welcher Bruchteil der Strecke ist die Entfernung {F(t`14`, '?')}</>,
            <>Von <Formel tex="A" /> aus gehst du diesen Bruchteil des Vektors <Formel tex={t`\overrightarrow{AB}`} nach="." /></>,
          ]}
          loesung={[
            <>Es ist <Formel tex={t`\overrightarrow{AB}=(6\,|\,9\,|\,18)`} /> und die Summe der Quadrate ist <Formel tex={t`36+81+324=441`} nach="." /> Die Länge ist <Formel tex={t`|\overrightarrow{AB}|=\sqrt{441}=21`} nach="." /></>,
            <>Der Punkt <Formel tex="D" /> liegt im Abstand 14 von <Formel tex="A" nach="," /> das sind <Formel tex={t`\frac{14}{21}=\frac{2}{3}`} /> der Strecke: <Formel tex={t`\overrightarrow{OD}=\overrightarrow{OA}+\frac{2}{3}\overrightarrow{AB}`} nach="." /></>,
            <>Das ergibt {V(K9.A, '')} plus {V([4, 6, 12], '')} gleich {V(K9.D, '.')} Der Punkt ist {P('D', K9.D, '.')}</>,
          ]}
        >
          <p>
            Gegeben sind die Punkte {P('A', K9.A, '')} und {P('B', K9.B, '.')} Der Punkt <Formel tex="D" /> liegt auf der Strecke <Formel tex="AB" /> und hat von <Formel tex="A" /> den Abstand {F(t`14`, '.')} Bestimme die Koordinaten von <Formel tex="D" nach="." />
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="skalarprodukt">
        <Kontrolle
          aussage="skalarprodukt"
          nummer="K10"
          titel="Skalarprodukt"
          felder={[{ id: 'sp', name: 'Skalarprodukt', beschriftung: <Formel tex={t`\vec u\cdot\vec v`} />, erwartet: K10.wert }]}
          hilfen={[<>Multipliziere die entsprechenden Koordinaten und addiere die drei Produkte. Das Ergebnis ist eine Zahl, kein Vektor.</>, <>Achte auf die Vorzeichen: <Formel tex="(-1)\cdot 3" /> ist negativ.</>]}
          loesung={[
            <><Formel tex={t`\vec u\cdot\vec v=2\cdot 4+(-1)\cdot 3+5\cdot(-2)`} nach="." /></>,
            <>Die Produkte sind <Formel tex="8" nach="," /> <Formel tex="-3" /> und <Formel tex="-10" nach="." /> Die Summe ist <Formel tex={t`8-3-10=-5`} nach="." /></>,
          ]}
        >
          <p>
            Berechne das Skalarprodukt der Vektoren {V(K10.u, '')} und {V(K10.v, '.')}
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="winkel">
        <Kontrolle
          aussage="winkel"
          nummer="K11"
          titel="Winkel zwischen zwei Vektoren"
          felder={[{ id: 'w', name: 'Winkel in Grad', beschriftung: <Formel tex={t`\alpha\ \text{in}\ ^\circ`} />, erwartet: K11.grad, toleranz: TOL1 }]}
          hilfen={[
            <>Du brauchst das Skalarprodukt und die beiden Längen. Der Taschenrechner steht auf Gradmaß (DEG).</>,
            <>Es gilt <Formel tex={t`\cos\alpha=\frac{\vec u\cdot\vec v}{|\vec u|\cdot|\vec v|}`} nach="." /> Den Winkel erhältst du mit <Formel tex={t`\cos^{-1}`} nach="." /></>,
          ]}
          loesung={[
            <><Formel tex={t`\vec u\cdot\vec v=1\cdot 2+2\cdot(-3)+2\cdot 6=8`} nach="," /> <Formel tex={t`|\vec u|=3`} nach="," /> <Formel tex={t`|\vec v|=\sqrt{4+9+36}=7`} nach="." /></>,
            <><Formel tex={t`\cos\alpha=\frac{8}{3\cdot 7}=\frac{8}{21}`} nach="." /> Mit <Formel tex={t`\cos^{-1}`} /> folgt <Formel tex={t`\alpha\approx 67{,}6^\circ`} nach="." /></>,
          ]}
        >
          <p>
            Berechne die Größe des Winkels <Formel tex={t`\alpha`} /> zwischen den Vektoren {V(K11.u, '')} und {V(K11.v, '.')} Runde auf eine Nachkommastelle.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="kollinear-orthogonal">
        <Kontrolle
          aussage="kollinear-orthogonal"
          teil="a"
          nummer="K12a"
          titel="Kollinear, Teil a"
          felder={[{ id: 'r', name: 'Faktor r', beschriftung: <Formel tex="r" />, erwartet: K12.r }]}
          hilfen={[
            <>Zwei Vektoren sind kollinear, wenn der eine ein Vielfaches des anderen ist: <Formel tex={t`\vec b=r\cdot\vec a`} nach="." /></>,
            <>Teile eine Koordinate von <Formel tex={t`\vec b`} /> durch die entsprechende von <Formel tex={t`\vec a`} nach="," /> und prüfe, ob bei den anderen Zeilen derselbe Faktor entsteht.</>,
          ]}
          loesung={[
            <>Erste Zeile: <Formel tex={t`-6=r\cdot 4`} nach="," /> also <Formel tex={t`r=-\frac{3}{2}`} nach="." /></>,
            <>Zweite Zeile: <Formel tex={t`-\frac{3}{2}\cdot(-6)=9`} nach="." /> Dritte Zeile: <Formel tex={t`-\frac{3}{2}\cdot 2=-3`} nach="." /> Alle drei Zeilen passen, die Vektoren sind kollinear.</>,
          ]}
        >
          <p>
            Zeige, dass die Vektoren {V(K12.a, '')} und {V(K12.b, '')} kollinear sind. Bestimme dazu den Faktor <Formel tex="r" /> mit <Formel tex={t`\vec b=r\cdot\vec a`} nach="." />
          </p>
        </Kontrolle>
        <Kontrollfrage
          aussage="kollinear-orthogonal"
          teil="b"
          nummer="K12b"
          titel="Orthogonal, Teil b"
          optionen={platziere(
            [
              opt('a', <>{V(K12.kandidaten.a)}</>, false, <>Das Skalarprodukt mit <Formel tex={t`\vec c`} /> ist <Formel tex={t`6-1-2=3`} nach="." /> Es ist nicht 0, die Vektoren sind nicht orthogonal.</>),
              opt('b', <>{V(K12.kandidaten.b)}</>, false, <>Das Skalarprodukt mit <Formel tex={t`\vec c`} /> ist <Formel tex={t`3+2-2=3`} nach="." /> Nur bei dem Wert 0 stehen die Vektoren senkrecht aufeinander.</>),
              opt('c', <>{V(K12.kandidaten.c)}</>, true, <>Richtig.</>),
              opt('d', <>{V(K12.kandidaten.d)}</>, false, <>Das Skalarprodukt mit <Formel tex={t`\vec c`} /> ist <Formel tex={t`-3+3-4=-4`} nach="." /> Es ist nicht 0, die Vektoren sind nicht orthogonal.</>),
            ],
            2,
          )}
          erklaerung={
            <p>
              Zwei Vektoren sind orthogonal, wenn ihr Skalarprodukt 0 ist. Für <Formel tex={t`\vec c=(3\,|\,1\,|\,-2)`} /> gilt nur beim dritten Vektor <Formel tex={t`3\cdot 1+1\cdot 1+(-2)\cdot 2=3+1-4=0`} nach="." />
            </p>
          }
        >
          <p>
            Welcher der vier Vektoren ist orthogonal zu dem Vektor {V(K12.c, '?')}
          </p>
        </Kontrollfrage>
      </Punkt>

      <Punkt id="orthogonaler-vektor">
        <Kontrolle
          aussage="orthogonaler-vektor"
          nummer="K13"
          titel="Einen orthogonalen Vektor bestimmen"
          felder={[{ id: 'a', name: 'Wert von a', beschriftung: <Formel tex="a" />, erwartet: K13.a }]}
          hilfen={[
            <>Zwei Vektoren sind orthogonal, wenn ihr Skalarprodukt 0 ist. Setze das Skalarprodukt von <Formel tex={t`\vec w`} /> und <Formel tex={t`\vec v`} /> gleich 0.</>,
            <>Du erhältst eine Gleichung mit der Unbekannten <Formel tex="a" nach="." /> Zu einem Vektor gibt es unendlich viele orthogonale Vektoren: Du wählst zwei Koordinaten frei und bestimmst die dritte so, dass das Skalarprodukt 0 ist.</>,
          ]}
          loesung={[
            <><Formel tex={t`\vec w\cdot\vec v=a\cdot 2+2\cdot(-3)+(-1)\cdot 4=2a-10=0`} nach="." /></>,
            <>Also ist <Formel tex={t`a=5`} nach="." /> Probe: <Formel tex={t`10-6-4=0`} nach="." /> Der Vektor {V([5, 2, -1])} ist orthogonal zu {V(K13.v, '.')}</>,
          ]}
        >
          <p>
            Gegeben ist der Vektor {V(K13.v, '.')} Ein orthogonaler Vektor hat die Form <Formel tex={t`\begin{pmatrix}a\\2\\-1\end{pmatrix}`} nach="." /> Bestimme <Formel tex="a" nach="." />
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="senkrechter-vektor">
        <Kontrolle
          aussage="senkrechter-vektor"
          nummer="K14"
          titel="Orthogonal zu zwei Vektoren"
          felder={koordFelder('n', 'Vektor n', K14.n, (i) => `n_${i + 1}`)}
          hilfen={[
            <>Ein Vektor, der zu zwei Vektoren orthogonal ist, ergibt sich als Vektorprodukt (Kreuzprodukt) <Formel tex={t`\vec u\times\vec v`} nach="." /></>,
            <>Rechne mit dem Rechenschema: erste Zeile <Formel tex="u_2v_3-u_3v_2" nach="," /> zweite Zeile <Formel tex="u_3v_1-u_1v_3" nach="," /> dritte Zeile <Formel tex="u_1v_2-u_2v_1" nach="." /></>,
          ]}
          loesung={[
            <>Erste Zeile: <Formel tex={t`2\cdot 2-(-1)\cdot(-1)=3`} nach="." /> Zweite Zeile: <Formel tex={t`(-1)\cdot 3-1\cdot 2=-5`} nach="." /> Dritte Zeile: <Formel tex={t`1\cdot(-1)-2\cdot 3=-7`} nach="." /></>,
            <>Also {V(K14.n, '.')} Probe mit beiden Skalarprodukten: <Formel tex={t`3-10+7=0`} /> und <Formel tex={t`9+5-14=0`} nach="." /></>,
          ]}
        >
          <p>
            Bestimme einen Vektor, der zu {V(K14.u, '')} und zu {V(K14.v, '')} orthogonal ist. Gib ihn so an, dass die Koordinaten ganze Zahlen ohne gemeinsamen Teiler sind und die erste Koordinate positiv ist.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="vielecke">
        <Kontrolle
          aussage="vielecke"
          teil="a"
          nummer="K15a"
          titel="Gleichschenkliges Dreieck, Teil a"
          felder={[
            { id: 'ab', name: 'Länge von AB', beschriftung: <Formel tex={t`|\overrightarrow{AB}|`} />, erwartet: K15.ab },
            { id: 'ac', name: 'Länge von AC', beschriftung: <Formel tex={t`|\overrightarrow{AC}|`} />, erwartet: K15.ac },
            { id: 'bc', name: 'Länge von BC', beschriftung: <Formel tex={t`|\overrightarrow{BC}|`} />, erwartet: K15.bc },
          ]}
          hilfen={[
            <>Ein Dreieck ist gleichschenklig, wenn zwei Seiten gleich lang sind. Berechne die drei Seitenlängen über die Verbindungsvektoren.</>,
            <>Die Verbindungsvektoren sind Koordinaten des Endpunkts minus Koordinaten des Anfangspunkts. Die Längen sind hier ganze Zahlen.</>,
          ]}
          loesung={[
            <><Formel tex={t`\overrightarrow{AB}=(2\,|\,1\,|\,2)`} nach="," /> also <Formel tex={t`|\overrightarrow{AB}|=\sqrt{4+1+4}=3`} nach="." /> Ebenso <Formel tex={t`\overrightarrow{AC}=(2\,|\,1\,|\,-2)`} nach="," /> also <Formel tex={t`|\overrightarrow{AC}|=3`} nach="." /></>,
            <><Formel tex={t`\overrightarrow{BC}=(0\,|\,0\,|\,-4)`} nach="," /> also <Formel tex={t`|\overrightarrow{BC}|=4`} nach="." /> Wegen <Formel tex={t`|\overrightarrow{AB}|=|\overrightarrow{AC}|`} /> ist das Dreieck gleichschenklig mit der Spitze <Formel tex="A" nach="." /></>,
          ]}
        >
          <p>
            Gegeben sind die Punkte {P('A', K15.A, '')} {P('B', K15.B, '')} und {P('C', K15.C, '.')} Weise rechnerisch nach, dass das Dreieck <Formel tex="ABC" /> gleichschenklig ist. Trage dazu die drei Seitenlängen ein.
          </p>
        </Kontrolle>
        <Kontrollfrage
          aussage="vielecke"
          teil="b"
          nummer="K15b"
          titel="Viereck nachweisen, Teil b"
          optionen={platziere(
            [
              opt('a', <>Es gilt <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AD}=0`} nach="." /></>, false, <>Das zeigt nur einen rechten Winkel bei <Formel tex="A" nach="." /> Damit weißt du weder, ob gegenüberliegende Seiten parallel sind, noch ob benachbarte Seiten gleich lang sind. Auch ein Rechteck hat diesen rechten Winkel.</>),
              opt('b', <>Es gilt <Formel tex={t`\overrightarrow{AB}=\overrightarrow{DC}`} /> und <Formel tex={t`|\overrightarrow{AB}|=|\overrightarrow{AD}|`} nach="." /></>, true, <>Richtig.</>),
              opt('c', <>Es gilt <Formel tex={t`\overrightarrow{AC}\perp\overrightarrow{BD}`} nach="." /></>, false, <>Senkrechte Diagonalen haben Raute und Drachenviereck. Weil das Viereck dabei kein Parallelogramm sein muss, reicht das nicht für eine Raute.</>),
              opt('d', <>Es gilt <Formel tex={t`|\overrightarrow{AB}|=|\overrightarrow{CD}|`} /> und <Formel tex={t`|\overrightarrow{BC}|=|\overrightarrow{DA}|`} nach="." /></>, false, <>Gleich lange Gegenseiten gibt es auch bei einem Viereck, das kein Parallelogramm ist (im Raum zum Beispiel bei einem nicht ebenen Viereck). Außerdem fehlt die Bedingung, dass benachbarte Seiten gleich lang sind.</>),
            ],
            1,
          )}
          erklaerung={
            <p>
              Eine Raute ist ein Parallelogramm mit vier gleich langen Seiten. Das Parallelogramm weist du mit <Formel tex={t`\overrightarrow{AB}=\overrightarrow{DC}`} /> nach. Dann sind gegenüberliegende Seiten gleich lang. Es genügt, zusätzlich zwei benachbarte Seiten zu vergleichen: <Formel tex={t`|\overrightarrow{AB}|=|\overrightarrow{AD}|`} nach="." />
            </p>
          }
        >
          <p>
            Welche Bedingungen genügen, um zu zeigen, dass das Viereck <Formel tex="ABCD" /> eine Raute ist?
          </p>
        </Kontrollfrage>
      </Punkt>

      <Punkt id="eckpunkt">
        <Kontrolle
          aussage="eckpunkt"
          nummer="K16"
          titel="Den vierten Eckpunkt bestimmen"
          felder={koordFelder('d', 'Punkt D', K16.D, (i) => `D_${i + 1}`)}
          hilfen={[
            <>In einem Parallelogramm <Formel tex="ABCD" /> sind die Seiten <Formel tex="AB" /> und <Formel tex="DC" /> gleich lang und parallel: <Formel tex={t`\overrightarrow{AB}=\overrightarrow{DC}`} nach="." /></>,
            <>Ebenso gilt <Formel tex={t`\overrightarrow{AD}=\overrightarrow{BC}`} nach="." /> Du erreichst <Formel tex="D" /> also von <Formel tex="A" /> aus mit dem Vektor <Formel tex={t`\overrightarrow{BC}`} nach="." /></>,
          ]}
          loesung={[
            <><Formel tex={t`\overrightarrow{BC}=(2\,|\,3\,|\,3)`} nach="." /></>,
            <><Formel tex={t`\overrightarrow{OD}=\overrightarrow{OA}+\overrightarrow{BC}=(1\,|\,0\,|\,2)+(2\,|\,3\,|\,3)=(3\,|\,3\,|\,5)`} nach="." /> Der vierte Eckpunkt ist {P('D', K16.D, '.')}</>,
          ]}
        >
          <p>
            Gegeben sind die Punkte {P('A', K16.A, '')} {P('B', K16.B, '')} und {P('C', K16.C, '.')} Bestimme die Koordinaten des Punktes <Formel tex="D" nach="," /> sodass das Viereck <Formel tex="ABCD" /> ein Parallelogramm ist.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="flaeche-kreuzprodukt">
        <Kontrolle
          aussage="flaeche-kreuzprodukt"
          nummer="K17"
          titel="Flächeninhalt mit dem Vektorprodukt (Kreuzprodukt)"
          felder={[
            { id: 'dreieck', name: 'Flächeninhalt des Dreiecks', beschriftung: <Formel tex="A_{\Delta}" />, erwartet: K17.dreieck },
            { id: 'para', name: 'Flächeninhalt des Parallelogramms', beschriftung: <Formel tex="A_{\square}" />, erwartet: K17.parallelogramm },
          ]}
          hilfen={[
            <>Der Betrag des Vektorprodukts (Kreuzprodukt) <Formel tex={t`\overrightarrow{AB}\times\overrightarrow{AC}`} /> ist der Flächeninhalt des Parallelogramms, das die beiden Vektoren aufspannen.</>,
            <>Das Dreieck hat davon die Hälfte. Bestimme zuerst die Verbindungsvektoren <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} nach="." /></>,
          ]}
          loesung={[
            <><Formel tex={t`\overrightarrow{AB}=(2\,|\,2\,|\,1)`} /> und <Formel tex={t`\overrightarrow{AC}=(2\,|\,-1\,|\,-2)`} nach="." /> Das Vektorprodukt (Kreuzprodukt) ist {V(K17.kreuz, '.')}</>,
            <>Die Summe der Quadrate ist <Formel tex={t`9+36+36=81`} nach="," /> der Betrag also <Formel tex={t`\sqrt{81}=9`} nach="." /> Das ist der Flächeninhalt des Parallelogramms: <Formel tex={t`A_{\square}=9`} nach="." /></>,
            <>Das Dreieck hat die Hälfte: <Formel tex={t`A_{\Delta}=\frac{9}{2}=4{,}5`} nach="." /></>,
          ]}
        >
          <p>
            Gegeben sind die Punkte {P('A', K17.A, '')} {P('B', K17.B, '')} und {P('C', K17.C, '.')} Berechne den Flächeninhalt des Dreiecks <Formel tex="ABC" /> und des Parallelogramms, das von <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} /> aufgespannt wird.
          </p>
        </Kontrolle>
      </Punkt>
    </Abschnitt>
  );
}
