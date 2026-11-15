import { Formel } from '@/components/Formel';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { spalte } from '@/lib/laborhilfen';
import { F, KF, P, V, koordFelder } from './hilfen';
import { Kontrolle, Kontrollfrage, Punkt } from './Punkt';
import { K39, K45, K46, K47, TOL2 } from './werte';

/** Zweiter Teil des Bereichs Ebenen: Abstand paralleler Ebenen, Volumen, Spatprodukt, Problemlösen und die Aussage „!“. */
export function EbenenZwei() {
  return (
    <>
      <Punkt id="abstand-parallel">
        <Kontrolle
          aussage="abstand-parallel"
          teil="a"
          nummer="K45a"
          titel="Abstand paralleler Ebenen, Teil a"
          felder={[{ id: 'd', name: 'Abstand der Ebenen', beschriftung: <Formel tex="d" />, erwartet: K45.a.abstand }]}
          hilfen={[
            <>Die Normalenvektoren sind Vielfache voneinander, die Ebenen sind also parallel. Der Abstand ist der Abstand eines beliebigen Punktes der einen Ebene von der anderen Ebene.</>,
            <>Schreibe <Formel tex="E_2" /> so um, dass sie denselben Normalenvektor wie <Formel tex="E_1" /> hat (durch 2 teilen). Dann ist der Abstand der Betrag des Unterschieds der rechten Seiten geteilt durch <Formel tex={t`|\vec n|`} nach="." /></>,
          ]}
          loesung={[
            <>Teilt man die Gleichung von <Formel tex="E_2" /> durch 2, entsteht <Formel tex={t`2x_1-x_2+2x_3=-9`} nach="." /> Die Normalenvektoren stimmen überein, die rechten Seiten sind verschieden: Die Ebenen sind echt parallel.</>,
            <>Der Betrag des Normalenvektors ist <Formel tex={t`\sqrt{4+1+4}=3`} nach="." /> Der Abstand ist <Formel tex={t`d=\frac{|3-(-9)|}{3}=\frac{12}{3}=4`} nach="." /></>,
          ]}
        >
          <p>
            Die Ebenen {KF(K45.a.e1.n, K45.a.e1.d, 'E_1', '')} und {KF(K45.a.e2.n, K45.a.e2.d, 'E_2', '')} sind parallel. Berechne ihren Abstand.
          </p>
        </Kontrolle>
        <Kontrolle
          aussage="abstand-parallel"
          teil="b"
          nummer="K45b"
          titel="Abstand einer Geraden von einer Ebene, Teil b"
          felder={[{ id: 'd', name: 'Abstand von Gerade und Ebene', beschriftung: <Formel tex="d" />, erwartet: K45.b.abstand }]}
          hilfen={[
            <>Eine Gerade, die parallel zu einer Ebene verläuft, hat zu allen ihren Punkten denselben Abstand von der Ebene. Prüfe zuerst mit dem Skalarprodukt, ob sie wirklich parallel ist.</>,
            <>Berechne dann den Abstand des Stützpunkts der Geraden von der Ebene.</>,
          ]}
          loesung={[
            <><Formel tex={t`\vec n\cdot\vec u=1\cdot 2+2\cdot(-1)+2\cdot 0=0`} nach="." /> Die Gerade ist parallel zur Ebene.</>,
            <>Abstand des Stützpunkts {P('P', K45.b.g.p, '')} von der Ebene: <Formel tex={t`d=\frac{|1+4+6-5|}{3}=\frac{6}{3}=2`} nach="." /></>,
          ]}
        >
          <p>
            Die Gerade <Formel tex={t`g:\ \vec x=${spalte(K45.b.g.p)}+t\cdot${spalte(K45.b.g.u)}`} /> verläuft parallel zur Ebene {KF(K45.b.k.n, K45.b.k.d, 'E', '.')} Berechne den Abstand von <Formel tex="g" /> und <Formel tex="E" nach="." />
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="volumen">
        <p>
          Die Punkte {P('A', K39.A, '')} {P('B', K39.B, '')} und {P('D', K39.D, '')} sind Ecken des Rechtecks <Formel tex="ABCD" nach="," /> das in der Ebene {KF(K39.n, K39.d, 'E', '')} liegt. Der Punkt {P('S', K39.S, '')} ist die Spitze einer Pyramide mit der Grundfläche <Formel tex="ABCD" nach="." />
        </p>
        <Kontrolle
          aussage="volumen"
          teil="a"
          nummer="K39a"
          titel="Volumen eines Quaders, Teil a"
          felder={[{ id: 'v', name: 'Volumen des Quaders', beschriftung: <Formel tex="V" />, erwartet: K39.quader }]}
          hilfen={[
            <>Das Volumen eines Quaders ist Grundfläche mal Höhe. Die Grundfläche ist das Rechteck <Formel tex="ABCD" nach="." /> Die Höhe ist der Abstand von <Formel tex="S" /> von der Ebene <Formel tex="E" nach="." /></>,
            <>Die Seitenlängen des Rechtecks sind die Beträge von <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AD}`} nach="." /></>,
          ]}
          loesung={[
            <><Formel tex={t`\overrightarrow{AB}=(4\,|\,2\,|\,4)`} /> mit <Formel tex={t`|\overrightarrow{AB}|=6`} nach="," /> <Formel tex={t`\overrightarrow{AD}=(-2\,|\,2\,|\,1)`} /> mit <Formel tex={t`|\overrightarrow{AD}|=3`} nach="." /> Die Grundfläche ist <Formel tex={t`G=6\cdot 3=18`} nach="." /></>,
            <>Höhe: <Formel tex={t`h=\frac{|3+6+2+1|}{3}=\frac{12}{3}=4`} nach="." /> Das Volumen des Quaders ist <Formel tex={t`V=G\cdot h=18\cdot 4=72`} nach="." /></>,
          ]}
        >
          <p>
            Berechne das Volumen des Quaders, dessen Grundfläche das Rechteck <Formel tex="ABCD" /> ist und dessen Höhe dem Abstand des Punktes <Formel tex="S" /> von der Ebene <Formel tex="E" /> entspricht.
          </p>
        </Kontrolle>
        <Kontrolle
          aussage="volumen"
          teil="b"
          nummer="K39b"
          titel="Volumen der Pyramide, Teil b"
          felder={[{ id: 'v', name: 'Volumen der Pyramide', beschriftung: <Formel tex="V" />, erwartet: K39.pyramide }]}
          hilfen={[
            <>Eine Pyramide hat ein Drittel des Volumens des Quaders mit derselben Grundfläche und derselben Höhe.</>,
            <>Du kannst den Wert aus Teil a verwenden oder Grundfläche und Höhe erneut ausrechnen.</>,
          ]}
          loesung={[
            <>Grundfläche und Höhe sind dieselben wie beim Quader: <Formel tex={t`G=18`} /> und <Formel tex={t`h=4`} nach="." /></>,
            <><Formel tex={t`V=\frac{1}{3}\cdot G\cdot h=\frac{1}{3}\cdot 18\cdot 4=24`} nach="." /></>,
          ]}
        >
          <p>
            Berechne das Volumen der Pyramide <Formel tex="ABCDS" nach="." />
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="spatprodukt">
        <Kontrolle
          aussage="spatprodukt"
          nummer="K46"
          titel="Spatprodukt"
          felder={[
            { id: 'spat', name: 'Volumen des Spats', beschriftung: <Formel tex="V_{\text{Spat}}" />, erwartet: K46.spat },
            { id: 'pyr', name: 'Volumen der Pyramide', beschriftung: <Formel tex="V_{\text{Pyramide}}" />, erwartet: K46.pyramide, toleranz: TOL2 },
          ]}
          hilfen={[
            <>Das Volumen eines Spats, den drei Vektoren aufspannen, ist der Betrag des Spatprodukts <Formel tex={t`(\vec u\times\vec v)\cdot\vec w`} nach="." /> Zuerst bildest du das Vektorprodukt (Kreuzprodukt), dann das Skalarprodukt mit dem dritten Vektor.</>,
            <>Eine Pyramide mit derselben Grundfläche (dem Parallelogramm aus <Formel tex={t`\vec u`} /> und <Formel tex={t`\vec v`} nach=")" /> und derselben Höhe hat ein Drittel des Volumens. Runde auf zwei Nachkommastellen.</>,
          ]}
          loesung={[
            <><Formel tex={t`\vec u\times\vec v=(0\cdot 0-1\cdot 3\,|\,1\cdot 1-2\cdot 0\,|\,2\cdot 3-0\cdot 1)=(-3\,|\,1\,|\,6)`} nach="." /></>,
            <>Das Skalarprodukt mit <Formel tex={t`\vec w`} nach=":" /> <Formel tex={t`(-3)\cdot 0+1\cdot 1+6\cdot 2=13`} nach="." /> Der Spat hat das Volumen <Formel tex={t`V=13`} nach="." /></>,
            <>Die Pyramide hat ein Drittel davon: <Formel tex={t`V=\frac{13}{3}\approx 4{,}33`} nach="." /></>,
          ]}
        >
          <p>
            Die Vektoren {V(K46.u, '')} {V(K46.v, '')} und {V(K46.w, '')} spannen einen Spat auf. Berechne sein Volumen mit dem Spatprodukt. Berechne außerdem das Volumen der Pyramide, deren Grundfläche das Parallelogramm aus <Formel tex={t`\vec u`} /> und <Formel tex={t`\vec v`} /> ist und deren Spitze am Ende des Vektors <Formel tex={t`\vec w`} /> liegt (alle drei Vektoren gehen von derselben Ecke aus). Das Spatprodukt gehört nicht zum Bildungsplan, es ist eine Vertiefung.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="problemloesen">
        <Kontrolle
          aussage="problemloesen"
          teil="a"
          nummer="K47a"
          titel="Eine Vermutung an einem Beispiel prüfen, Teil a"
          felder={koordFelder('m', 'Mittelpunkt M', K47.M, (i) => `M_${i + 1}`)}
          hilfen={[
            <>Nutze die Fragen des Problemlöseschemas: Was ist gegeben, was ist gesucht? Hier prüfst du zwei Dinge: Liegt die Mitte der Strecke <Formel tex={t`QQ'`} /> in der Ebene, und steht die Strecke senkrecht auf ihr?</>,
            <>Der Mittelpunkt hat als Koordinaten die Mittelwerte der beiden Punkte. Die Ebene <Formel tex={t`x_1=x_2`} /> hat den Normalenvektor <Formel tex={t`(1\,|\,-1\,|\,0)`} nach="." /></>,
          ]}
          loesung={[
            <>Der Mittelpunkt ist {P('M', K47.M, '.')} Er liegt in der Ebene, denn <Formel tex={t`x_1=x_2=3`} nach="." /></>,
            <>Der Vektor <Formel tex={t`\overrightarrow{QQ'}=(4\,|\,-4\,|\,0)`} /> ist das Vierfache des Normalenvektors. Die Strecke steht also senkrecht auf der Ebene und wird von ihr halbiert: Für diesen Punkt stimmt die Vermutung.</>,
          ]}
        >
          <p>
            Eine Schülerin vermutet: Vertauscht man die Koordinaten <Formel tex="x_1" /> und <Formel tex="x_2" /> eines Punktes, entsteht der Spiegelpunkt an der Ebene <Formel tex={t`E:\ x_1=x_2`} nach="." /> Teste das an einem Beispiel: Der Punkt {P('Q', K47.Q, '')} wird zu {P("Q'", K47.Q2, '.')} Bestimme den Mittelpunkt <Formel tex="M" /> der Strecke <Formel tex={t`QQ'`} /> und prüfe, ob er in <Formel tex="E" /> liegt.
          </p>
        </Kontrolle>
        <Kontrollfrage
          aussage="problemloesen"
          teil="b"
          nummer="K47b"
          titel="Wie geht es weiter? Teil b"
          optionen={platziere(
            [
              opt('a', <>Die Vermutung ist bewiesen, weil sie für das Beispiel stimmt.</>, false, <>Ein einzelnes Beispiel kann eine Vermutung nur stützen oder widerlegen, aber nicht beweisen. Du musst allgemein zeigen, dass sie für jeden Punkt gilt.</>),
              opt('b', <>Das Beispiel stützt die Vermutung. Ich untersuche als Nächstes einen allgemeinen Punkt <Formel tex={t`Q(a\,|\,b\,|\,c)`} /> und Sonderfälle wie <Formel tex="a=b" nach="." /></>, true, <>Richtig.</>),
              opt('c', <>Die Vermutung ist widerlegt, weil <Formel tex="Q" /> und <Formel tex={t`Q'`} /> verschiedene Koordinaten haben.</>, false, <>Dass sich die Koordinaten ändern, ist bei jeder Spiegelung so. Die Vermutung wird nicht widerlegt, im Beispiel stimmen sogar Mittelpunkt und Richtung der Strecke.</>),
              opt('d', <>Ich rechne ein zweites Beispiel. Stimmt es auch, ist die Vermutung bewiesen.</>, false, <>Auch zwei oder zehn Beispiele beweisen nichts. Gut ist, mehrere und verschiedene Beispiele zu prüfen, sie ersetzen den allgemeinen Nachweis aber nicht.</>),
            ],
            1,
          )}
          erklaerung={
            <p>
              Zum Problemlösen gehört, Vermutungen an Beispielen zu testen und dann zu fragen, ob sie immer gelten. Dazu untersuchst du einen allgemeinen Punkt <Formel tex={t`Q(a\,|\,b\,|\,c)`} /> und Sonderfälle: Für <Formel tex="a=b" /> liegt <Formel tex="Q" /> selbst in der Ebene, und <Formel tex={t`Q'=Q`} /> ist sein eigener Spiegelpunkt. Die Vermutung trägt auch dort. Allgemein ist <Formel tex={t`\overrightarrow{QQ'}=(b-a\,|\,a-b\,|\,0)`} /> ein Vielfaches des Normalenvektors, und der Mittelpunkt hat gleiche erste und zweite Koordinate. Beides zusammen beweist die Vermutung.
            </p>
          }
        >
          <p>
            Das Beispiel hat die Vermutung bestätigt. Wie gehst du weiter vor?
          </p>
        </Kontrollfrage>
      </Punkt>

      <Punkt id="transfer" />
    </>
  );
}
