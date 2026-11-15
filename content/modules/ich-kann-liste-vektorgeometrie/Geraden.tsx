import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { spalte } from '@/lib/laborhilfen';
import { Eingabehinweis } from './Eingabehinweis';
import { F, P, V, koordFelder } from './hilfen';
import { Kontrolle, Kontrollfrage, Punkt } from './Punkt';
import { K18, K19, K20, K21, K22, K23, K24, K25, K40, TOL1 } from './werte';

/** Gleichung einer Geraden als TeX: name: x = p + par · u. */
const gl = (name: string, p: number[], u: number[], par = 't') => `${name}:\\ \\vec{x}=${spalte(p)}+${par}\\cdot${spalte(u)}`;

/** Bereich Geraden im Raum: Aussagen 18 bis 25 und die ergänzte Aussage 40. */
export function Geraden() {
  return (
    <Abschnitt id="geraden" titel="Geraden im Raum">
      <p>Hier geht es um Geradengleichungen, die Punktprobe, besondere Lagen und Spurpunkte, die gegenseitige Lage, den Abstand von einem Punkt und um Winkel.</p>
      <Eingabehinweis />

      <Punkt id="geradengleichung">
        <Kontrolle
          aussage="geradengleichung"
          nummer="K18"
          titel="Geraden aufstellen"
          felder={[
            ...koordFelder('u', 'Richtungsvektor von g', K18.u, (i) => `u_${i + 1}`),
            { id: 'sa', name: 'Koordinate x1 von S', beschriftung: <Formel tex="a" />, erwartet: K18.S[0]! },
            { id: 'sb', name: 'Koordinate x3 von S', beschriftung: <Formel tex="b" />, erwartet: K18.S[2]! },
          ]}
          hilfen={[
            <>Als Richtungsvektor von <Formel tex="g" /> nimmst du den Verbindungsvektor der beiden Punkte. Die parallele Gerade <Formel tex="h" /> hat denselben Richtungsvektor, aber einen anderen Stützpunkt.</>,
            <>Der Punkt <Formel tex={t`S(a\,|\,5\,|\,b)`} /> liegt auf <Formel tex="h" nach="." /> Bestimme zuerst den Parameter aus der zweiten Zeile, in der <Formel tex={t`x_2=5`} /> bekannt ist.</>,
          ]}
          loesung={[
            <><Formel tex={t`\vec u=\overrightarrow{PQ}=(3\,|\,2\,|\,-4)`} nach="." /> Damit ist <Formel tex={gl('g', K18.P, K18.u)} nach="." /></>,
            <>Die Gerade <Formel tex="h" /> geht durch {P('R', K18.R, '')} mit demselben Richtungsvektor: <Formel tex={gl('h', K18.R, K18.u, 's')} nach="." /></>,
            <>Zweite Zeile für <Formel tex="S" nach=":" /> <Formel tex={t`1+2s=5`} nach="," /> also <Formel tex="s=2" nach="." /> Erste Zeile: <Formel tex={t`a=-2+3\cdot 2=4`} nach="." /> Dritte Zeile: <Formel tex={t`b=5-4\cdot 2=-3`} nach="." /></>,
          ]}
        >
          <p>
            Die Gerade <Formel tex="g" /> verläuft durch die Punkte {P('P', K18.P, '')} und {P('Q', K18.Q, '.')} Die Gerade <Formel tex="h" /> ist parallel zu <Formel tex="g" /> und geht durch {P('R', K18.R, '.')} Bestimme einen Richtungsvektor von <Formel tex="g" /> und die Gleichung von <Formel tex="h" nach="." /> Zur Kontrolle: Der Punkt <Formel tex={t`S(a\,|\,5\,|\,b)`} /> liegt auf <Formel tex="h" nach="." /> Gib <Formel tex="a" /> und <Formel tex="b" /> an.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="punktprobe-gerade">
        <Kontrollfrage
          aussage="punktprobe-gerade"
          teil="a"
          nummer="K19a"
          titel="Punktprobe, Teil a"
          optionen={platziere(
            [
              opt('a', <>{P('A', K19.punkte.a)}</>, true, <>Richtig.</>),
              opt('b', <>{P('B', K19.punkte.b)}</>, false, <>Aus der ersten Zeile folgt <Formel tex="t=2" nach="." /> Dann ist die dritte Zeile <Formel tex={t`5-2\cdot 2=1`} nach="," /> nicht 2. Der Punkt liegt nicht auf der Geraden.</>),
              opt('c', <>{P('C', K19.punkte.c)}</>, false, <>Aus der ersten Zeile folgt <Formel tex="t=-2" nach="." /> Dann ist die dritte Zeile <Formel tex={t`5-2\cdot(-2)=9`} nach="," /> nicht 7. Der Punkt liegt nicht auf der Geraden.</>),
              opt('d', <>{P('D', K19.punkte.d)}</>, false, <>Aus der ersten Zeile folgt <Formel tex="t=1" nach="." /> Dann ist die dritte Zeile <Formel tex={t`5-2\cdot 1=3`} nach="," /> nicht 2. Der Punkt liegt nicht auf der Geraden.</>),
            ],
            3,
          )}
          erklaerung={
            <p>
              Bei der Punktprobe setzt du den Punkt für <Formel tex={t`\vec x`} /> ein und bestimmst <Formel tex="t" /> aus einer Zeile. Dann prüfst du die anderen Zeilen. Für <Formel tex={t`A(5\,|\,8\,|\,-1)`} /> ist <Formel tex="t=3" nach="," /> und alle drei Zeilen stimmen: <Formel tex={t`2+3=5`} nach="," /> <Formel tex={t`-1+9=8`} nach="," /> <Formel tex={t`5-6=-1`} nach="." />
            </p>
          }
        >
          <p>
            Gegeben ist die Gerade <Formel tex={gl('g', K19.p, K19.u)} nach="." /> Welcher der vier Punkte liegt auf <Formel tex="g" nach="?" />
          </p>
        </Kontrollfrage>
        <Kontrolle
          aussage="punktprobe-gerade"
          teil="b"
          nummer="K19b"
          titel="Punktprobe mit Parameter, Teil b"
          felder={[{ id: 'a', name: 'Wert von a', beschriftung: <Formel tex="a" />, erwartet: K19.a }]}
          hilfen={[
            <>Bestimme aus der ersten oder zweiten Zeile den Parameter <Formel tex="t" nach="." /> In diesen Zeilen steht kein <Formel tex="a" nach="." /></>,
            <>Setze den Wert von <Formel tex="t" /> in die dritte Zeile ein. Dort steht <Formel tex="a" nach="." /></>,
          ]}
          loesung={[
            <>Erste Zeile: <Formel tex={t`2+t=4`} nach="," /> also <Formel tex="t=2" nach="." /> Zweite Zeile zur Probe: <Formel tex={t`-1+3\cdot 2=5`} nach="." /></>,
            <>Dritte Zeile: <Formel tex={t`a=5-2\cdot 2=1`} nach="." /> Der Punkt {P('R', K19.R(1), '')} liegt auf <Formel tex="g" nach="." /></>,
          ]}
        >
          <p>
            Für welchen Wert von <Formel tex="a" /> liegt der Punkt <Formel tex={t`R(4\,|\,5\,|\,a)`} /> auf der Geraden <Formel tex="g" /> von oben?
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="besondere-lage-gerade">
        <Kontrollfrage
          aussage="besondere-lage-gerade"
          nummer="K20"
          titel="Besondere Lage einer Geraden"
          optionen={platziere(
            [
              opt('a', <Formel tex={gl('g_1', K20.geraden.a.p, K20.geraden.a.u)} />, true, <>Richtig.</>),
              opt('b', <Formel tex={gl('g_2', K20.geraden.b.p, K20.geraden.b.u)} />, false, <>Hier ist <Formel tex={t`u_1=0`} nach="," /> nicht <Formel tex={t`u_2=0`} nach="." /> Die Gerade verläuft parallel zur <Formel tex="x_2x_3" />-Ebene, nicht zur <Formel tex="x_1x_3" />-Ebene.</>),
              opt('c', <Formel tex={gl('g_3', K20.geraden.c.p, K20.geraden.c.u)} />, false, <>Die Gerade geht durch den Ursprung. Ihr Richtungsvektor hat keine Null, sie liegt zu keiner Koordinatenebene parallel.</>),
              opt('d', <Formel tex={gl('g_4', K20.geraden.d.p, K20.geraden.d.u)} />, false, <>Hier ist <Formel tex={t`u_2=0`} nach="," /> aber auch die zweite Koordinate des Stützpunkts ist 0. Die Gerade liegt in der <Formel tex="x_1x_3" />-Ebene und ist nicht nur parallel zu ihr.</>),
            ],
            0,
          )}
          erklaerung={
            <p>
              Eine Gerade ist parallel zur <Formel tex="x_1x_3" />-Ebene, wenn <Formel tex={t`u_2=0`} /> ist: Dann bleibt <Formel tex="x_2" /> auf der ganzen Geraden gleich. Sie liegt in dieser Ebene, wenn zusätzlich <Formel tex={t`p_2=0`} /> ist. Bei <Formel tex={t`g_1`} /> ist <Formel tex={t`x_2=4`} nach="," /> die Gerade verläuft also im Abstand 4 parallel zur <Formel tex="x_1x_3" />-Ebene.
            </p>
          }
        >
          <p>
            Eine der vier Geraden verläuft parallel zur <Formel tex="x_1x_3" />-Ebene, liegt aber nicht in dieser Ebene. Welche?
          </p>
        </Kontrollfrage>
      </Punkt>

      <Punkt id="spurpunkte-gerade">
        <Kontrolle
          aussage="spurpunkte-gerade"
          nummer="K21"
          titel="Spurpunkte einer Geraden"
          felder={[
            { id: 's12a', name: 'Spurpunkt S12, Koordinate x1', beschriftung: <Formel tex="S_{12}:\ x_1" />, erwartet: K21.s12[0]! },
            { id: 's12b', name: 'Spurpunkt S12, Koordinate x2', beschriftung: <Formel tex="S_{12}:\ x_2" />, erwartet: K21.s12[1]! },
            { id: 's13a', name: 'Spurpunkt S13, Koordinate x1', beschriftung: <Formel tex="S_{13}:\ x_1" />, erwartet: K21.s13[0]! },
            { id: 's13b', name: 'Spurpunkt S13, Koordinate x3', beschriftung: <Formel tex="S_{13}:\ x_3" />, erwartet: K21.s13[2]! },
            { id: 's23a', name: 'Spurpunkt S23, Koordinate x2', beschriftung: <Formel tex="S_{23}:\ x_2" />, erwartet: K21.s23[1]! },
            { id: 's23b', name: 'Spurpunkt S23, Koordinate x3', beschriftung: <Formel tex="S_{23}:\ x_3" />, erwartet: K21.s23[2]! },
          ]}
          hilfen={[
            <>Ein Spurpunkt ist ein Punkt, in dem die Gerade eine Koordinatenebene durchstößt. In der <Formel tex="x_1x_2" />-Ebene ist <Formel tex={t`x_3=0`} nach="," /> in der <Formel tex="x_1x_3" />-Ebene ist <Formel tex={t`x_2=0`} /> und in der <Formel tex="x_2x_3" />-Ebene ist <Formel tex={t`x_1=0`} nach="." /></>,
            <>Setze die passende Zeile der Geradengleichung gleich 0, bestimme <Formel tex="t" /> und berechne dann mit diesem <Formel tex="t" /> die beiden anderen Koordinaten.</>,
          ]}
          loesung={[
            <><Formel tex={t`S_{12}`} nach=":" /> <Formel tex={t`-4+2t=0`} nach="," /> also <Formel tex="t=2" nach="." /> Das ergibt {P('S_{12}', K21.s12, '.')}</>,
            <><Formel tex={t`S_{13}`} nach=":" /> <Formel tex={t`1+2t=0`} nach="," /> also <Formel tex={t`t=-\frac{1}{2}`} nach="." /> Das ergibt {P('S_{13}', K21.s13, '.')}</>,
            <><Formel tex={t`S_{23}`} nach=":" /> <Formel tex={t`2+t=0`} nach="," /> also <Formel tex="t=-2" nach="." /> Das ergibt {P('S_{23}', K21.s23, '.')}</>,
          ]}
        >
          <p>
            Gegeben ist die Gerade <Formel tex={gl('g', K21.p, K21.u)} nach="." /> Bestimme die Spurpunkte von <Formel tex="g" /> mit den drei Koordinatenebenen. Die Koordinate, die 0 ist, musst du nicht eingeben.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="lage-geraden">
        <Kontrollfrage
          aussage="lage-geraden"
          teil="a"
          nummer="K22a"
          titel="Gegenseitige Lage, Teil a"
          optionen={platziere(
            [
              opt('a', <>Die Geraden sind identisch.</>, false, <>Die Richtungsvektoren sind keine Vielfachen voneinander, die Geraden haben also verschiedene Richtungen. Sie können nicht identisch sein.</>),
              opt('b', <>Die Geraden sind parallel.</>, false, <>Die Richtungsvektoren {V(K22.a.g.u)} und {V(K22.a.h.u)} sind keine Vielfachen (in der zweiten Zeile steht 2 und 0). Die Geraden sind nicht parallel.</>),
              opt('c', <>Die Geraden schneiden sich in einem Punkt.</>, false, <>Gleichsetzen ergibt: <Formel tex={t`1+t=2s`} nach="," /> <Formel tex={t`2t=1`} nach="," /> <Formel tex={t`2+t=s`} nach="." /> Aus der zweiten Zeile folgt <Formel tex={t`t=\frac{1}{2}`} nach="," /> aus der ersten <Formel tex={t`s=\frac{3}{4}`} nach="." /> Die dritte Zeile liefert aber <Formel tex={t`s=\frac{5}{2}`} nach="." /> Es gibt keinen Schnittpunkt.</>),
              opt('d', <>Die Geraden sind windschief.</>, true, <>Richtig.</>),
            ],
            1,
          )}
          erklaerung={
            <p>
              Die Richtungsvektoren sind keine Vielfachen, also sind die Geraden nicht parallel. Beim Gleichsetzen widersprechen sich die drei Gleichungen: <Formel tex={t`t=\frac{1}{2}`} /> und <Formel tex={t`s=\frac{3}{4}`} /> erfüllen die ersten beiden, aber nicht die dritte. Nicht parallel und kein Schnittpunkt heißt windschief.
            </p>
          }
        >
          <p>
            Untersuche die gegenseitige Lage der Geraden <Formel tex={gl('g', K22.a.g.p, K22.a.g.u)} /> und <Formel tex={gl('h', K22.a.h.p, K22.a.h.u, 's')} nach="." />
          </p>
        </Kontrollfrage>
        <Kontrolle
          aussage="lage-geraden"
          teil="b"
          nummer="K22b"
          titel="Schnittpunkt, Teil b"
          felder={koordFelder('s', 'Schnittpunkt S', K22.b.S, (i) => `S_${i + 1}`)}
          hilfen={[
            <>Setze die Geradengleichungen gleich. Das ergibt drei Gleichungen für <Formel tex="t" /> und <Formel tex="s" nach="." /> Löse zwei davon und prüfe die dritte.</>,
            <>Wenn alle drei Gleichungen stimmen, schneiden sich die Geraden. Setze den Parameter dann in die Geradengleichung ein.</>,
          ]}
          loesung={[
            <>Gleichsetzen: <Formel tex={t`1+t=1+s`} nach="," /> <Formel tex={t`2+t=8-2s`} nach="," /> <Formel tex={t`2t=2+s`} nach="." /> Aus der ersten folgt <Formel tex="t=s" nach="." /></>,
            <>In die zweite eingesetzt: <Formel tex={t`2+s=8-2s`} nach="," /> also <Formel tex="s=2" /> und <Formel tex="t=2" nach="." /> Die dritte Gleichung stimmt: <Formel tex={t`4=2+2`} nach="." /></>,
            <>Der Schnittpunkt liegt bei <Formel tex="t=2" /> auf <Formel tex="g" nach=":" /> {P('S', K22.b.S, '.')}</>,
          ]}
        >
          <p>
            Die Geraden <Formel tex={gl('g', K22.b.g.p, K22.b.g.u)} /> und <Formel tex={gl('h', K22.b.h.p, K22.b.h.u, 's')} /> schneiden sich. Bestimme den Schnittpunkt <Formel tex="S" nach="." />
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="gerade-gegebene-lage">
        <Kontrolle
          aussage="gerade-gegebene-lage"
          nummer="K40"
          titel="Parallele Geraden mit Parameter"
          felder={[{ id: 'a', name: 'Wert von a', beschriftung: <Formel tex="a" />, erwartet: K40.a }]}
          hilfen={[
            <>Zwei Geraden sind parallel, wenn ihre Richtungsvektoren Vielfache voneinander sind. Bestimme den Faktor aus den Zeilen, in denen keine Unbekannte steht.</>,
            <>Mit diesem Faktor findest du die dritte Zeile. Prüfe zum Schluss, dass die Geraden nicht identisch sind.</>,
          ]}
          loesung={[
            <>Erste Zeile: <Formel tex={t`-4=r\cdot 2`} nach="," /> also <Formel tex="r=-2" nach="." /> Zweite Zeile zur Probe: <Formel tex={t`-2\cdot(-1)=2`} nach="." /></>,
            <>Dritte Zeile: <Formel tex={t`a=-2\cdot 4=-8`} nach="." /> Der Stützpunkt {P('Q', [0, 1, 3], '')} von <Formel tex="h" /> liegt nicht auf <Formel tex="g" nach="," /> denn aus <Formel tex={t`1+2t=0`} /> folgt <Formel tex={t`t=-\frac{1}{2}`} /> und damit <Formel tex={t`x_2=\frac{5}{2}\ne 1`} nach="." /> Die Geraden sind echt parallel.</>,
          ]}
        >
          <p>
            Gegeben sind die Geraden <Formel tex={gl('g', K40.g.p, K40.g.u)} /> und <Formel tex={t`h:\ \vec{x}=${spalte([0, 1, 3])}+s\cdot\begin{pmatrix}-4\\2\\a\end{pmatrix}`} nach="." /> Für welchen Wert von <Formel tex="a" /> ist <Formel tex="h" /> echt parallel zu <Formel tex="g" nach="?" />
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="abstand-punkt-gerade">
        <Kontrolle
          aussage="abstand-punkt-gerade"
          nummer="K23"
          titel="Abstand eines Punktes von einer Geraden"
          felder={[{ id: 'd', name: 'Abstand', beschriftung: <Formel tex="d" />, erwartet: K23.d }]}
          hilfen={[
            <>Der Abstand ist die Länge der kürzesten Verbindung vom Punkt zur Geraden. Sie steht senkrecht auf der Geraden und endet im Lotfußpunkt <Formel tex="F" nach="." /></>,
            <>Ein Punkt <Formel tex={t`F(t)`} /> der Geraden ist Lotfußpunkt, wenn <Formel tex={t`\overrightarrow{FQ}`} /> orthogonal zum Richtungsvektor ist: Das Skalarprodukt ist 0.</>,
          ]}
          loesung={[
            <>Mit <Formel tex={t`\vec w=\overrightarrow{PQ}=(-4\,|\,1\,|\,-1)`} /> und dem Richtungsvektor <Formel tex={t`\vec u=(2\,|\,1\,|\,2)`} /> gilt <Formel tex={t`(\vec w-t\vec u)\cdot\vec u=0`} nach="." /> Das ergibt <Formel tex={t`\vec w\cdot\vec u=-9`} /> und <Formel tex={t`\vec u\cdot\vec u=9`} nach="," /> also <Formel tex="t=-1" nach="." /></>,
            <>Der Lotfußpunkt ist {P('F', K23.F, '.')} Der Vektor <Formel tex={t`\overrightarrow{FQ}`} /> ist {V([-2, 2, 1], '.')}</>,
            <>Die Summe der Quadrate ist <Formel tex={t`4+4+1=9`} nach="." /> Der Abstand ist <Formel tex={t`d=\sqrt{9}=3`} nach="." /></>,
          ]}
        >
          <p>
            Welchen Abstand hat der Punkt {P('Q', K23.Q, '')} von der Geraden <Formel tex={gl('g', K23.p, K23.u)} nach="?" /> Bestimme den Abstand mit der Methode des Lotfußpunkts.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="schnittwinkel-geraden">
        <Kontrolle
          aussage="schnittwinkel-geraden"
          nummer="K24"
          titel="Schnittwinkel zweier Geraden"
          felder={[{ id: 'w', name: 'Schnittwinkel in Grad', beschriftung: <Formel tex={t`\alpha\ \text{in}\ ^\circ`} />, erwartet: K24.grad, toleranz: TOL1 }]}
          hilfen={[
            <>Der Schnittwinkel ist der Winkel zwischen den Richtungsvektoren. Er ist höchstens 90°, du brauchst also den Betrag des Skalarprodukts.</>,
            <><Formel tex={t`\cos\alpha=\frac{|\vec u\cdot\vec v|}{|\vec u|\cdot|\vec v|}`} nach="." /> Der Taschenrechner steht auf Gradmaß.</>,
          ]}
          loesung={[
            <><Formel tex={t`\vec u\cdot\vec v=2+6-12=-4`} nach="," /> <Formel tex={t`|\vec u|=3`} nach="." /> Für <Formel tex={t`\vec v`} nach=":" /> <Formel tex={t`4+9+36=49`} nach="," /> also <Formel tex={t`|\vec v|=7`} nach="." /></>,
            <><Formel tex={t`\cos\alpha=\frac{|-4|}{3\cdot 7}=\frac{4}{21}`} nach="," /> also <Formel tex={t`\alpha\approx 79{,}0^\circ`} nach="." /> Ohne Betrag käme <Formel tex={t`101{,}0^\circ`} /> heraus, das ist der stumpfe Nebenwinkel.</>,
          ]}
        >
          <p>
            Die Geraden <Formel tex={gl('g', K24.g.p, K24.g.u)} /> und <Formel tex={gl('h', K24.h.p, K24.h.u, 's')} /> schneiden sich. Bestimme den Schnittwinkel auf eine Nachkommastelle gerundet.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="winkel-koordinatenebene">
        <Kontrolle
          aussage="winkel-koordinatenebene"
          nummer="K25"
          titel="Winkel zwischen Gerade und Koordinatenebene"
          felder={[
            { id: 'w12', name: 'Winkel mit der x1x2-Ebene', beschriftung: <Formel tex={t`x_1x_2:\ ^\circ`} />, erwartet: K25.e12, toleranz: TOL1 },
            { id: 'w13', name: 'Winkel mit der x1x3-Ebene', beschriftung: <Formel tex={t`x_1x_3:\ ^\circ`} />, erwartet: K25.e13, toleranz: TOL1 },
            { id: 'w23', name: 'Winkel mit der x2x3-Ebene', beschriftung: <Formel tex={t`x_2x_3:\ ^\circ`} />, erwartet: K25.e23, toleranz: TOL1 },
          ]}
          hilfen={[
            <>Der Winkel <Formel tex={t`\alpha`} /> zwischen einer Geraden und einer Ebene lässt sich über einen Vektor berechnen, der auf der Ebene senkrecht steht: <Formel tex={t`\sin\alpha=\frac{|\vec u\cdot\vec n|}{|\vec u|\cdot|\vec n|}`} nach="." /></>,
            <>Auf der <Formel tex="x_1x_2" />-Ebene steht der Vektor <Formel tex={t`(0\,|\,0\,|\,1)`} /> senkrecht, auf der <Formel tex="x_1x_3" />-Ebene <Formel tex={t`(0\,|\,1\,|\,0)`} /> und auf der <Formel tex="x_2x_3" />-Ebene <Formel tex={t`(1\,|\,0\,|\,0)`} nach="." /> Das Skalarprodukt greift die passende Koordinate heraus.</>,
          ]}
          loesung={[
            <>Es ist <Formel tex={t`4+9+36=49`} /> und <Formel tex={t`|\vec u|=7`} nach="." /> Mit der <Formel tex="x_1x_2" />-Ebene: <Formel tex={t`\sin\alpha=\frac{6}{7}`} nach="," /> also <Formel tex={t`\alpha\approx 59{,}0^\circ`} nach="." /></>,
            <>Mit der <Formel tex="x_1x_3" />-Ebene: <Formel tex={t`\sin\alpha=\frac{3}{7}`} nach="," /> also <Formel tex={t`\alpha\approx 25{,}4^\circ`} nach="." /></>,
            <>Mit der <Formel tex="x_2x_3" />-Ebene: <Formel tex={t`\sin\alpha=\frac{2}{7}`} nach="," /> also <Formel tex={t`\alpha\approx 16{,}6^\circ`} nach="." /> Je größer die Koordinate des Richtungsvektors, desto steiler schneidet die Gerade diese Ebene.</>,
          ]}
        >
          <p>
            Die Gerade <Formel tex={gl('g', K25.g.p, K25.g.u)} /> schneidet die drei Koordinatenebenen. Bestimme die drei Schnittwinkel, jeweils auf eine Nachkommastelle gerundet.
          </p>
        </Kontrolle>
      </Punkt>
    </Abschnitt>
  );
}
