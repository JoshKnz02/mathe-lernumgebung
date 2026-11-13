import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur, KontrollFigur, Zeichenaufgabe } from '@/components/Raumfigur';
import { BE, Teile } from '@/components/Teilaufgaben';
import { Umbruchformel } from '@/components/Umbruchformel';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { punktTeX } from '@/lib/vektor';
import { BILD_A3, raumQuader } from './Bilder';
import { A1, A2, A3, A4, A5, A6 } from './daten';

const sp = (v: number[]) => spalte(v);
const P = (name: string, p: number[]) => punktTeX(name, p);

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als ganze Zahl, als Dezimalzahl mit Komma oder als Bruch ein, zum Beispiel <code>2</code>, <code>-1,5</code> oder <Formel tex="\frac{3}{4}" nach="," /> ohne Einheit. Ein Verhältnis gibst du mit zwei Zahlen an, die keinen gemeinsamen Teiler haben. Die Felder prüfen nur Ergebnisse. Nachweise, Begründungen, Zeichnungen und Rechenwege schreibst du in dein Heft, den Lösungsweg vergleichst du danach.
    </Hinweis>
  );
}

/** Aufgabe 1: Parallelogramm nachweisen, Teilverhältnis über einen rechten Winkel. */
function Aufgabe1() {
  const d = A1;
  return (
    <Aufgabe
      nummer="1"
      titel="Parallelogramm und rechter Winkel"
      felder={[
        { id: 'm', name: 'erste Zahl des Verhältnisses BT zu TD', beschriftung: <>Verhältnis <Formel tex={t`\overline{BT}:\overline{TD}`} nach="," /> erste Zahl</>, erwartet: d.m },
        { id: 'n', name: 'zweite Zahl des Verhältnisses BT zu TD', beschriftung: <>Verhältnis <Formel tex={t`\overline{BT}:\overline{TD}`} nach="," /> zweite Zahl</>, erwartet: d.n },
      ]}
      hilfen={[
        <>Weil T auf der Strecke BD liegt, gilt <Formel tex={t`\overrightarrow{BT}=\lambda\cdot\overrightarrow{BD}`} /> mit <Formel tex={t`0<\lambda<1`} nach="." /> Das Verhältnis folgt aus <Formel tex={t`\lambda`} /> und <Formel tex={t`1-\lambda`} nach="," /> siehe <Modulverweis modul="betrag-abstand-teilung">Betrag, Abstand und Teilung von Strecken</Modulverweis>.</>,
        <>Ein rechter Winkel bei T bedeutet, dass <Formel tex={t`\overrightarrow{TA}`} /> und <Formel tex={t`\overrightarrow{TB}`} /> orthogonal sind (<Modulverweis modul="skalarprodukt-orthogonalitaet">Skalarprodukt, Orthogonalität und Winkel</Modulverweis>). Da <Formel tex={t`\overrightarrow{TB}`} /> ein Vielfaches von <Formel tex={t`\overrightarrow{BD}`} /> ist, genügt <Formel tex={t`\overrightarrow{TA}\cdot\overrightarrow{BD}=0`} nach="." /></>,
        <>Schreibe <Formel tex={t`\overrightarrow{TA}=-\overrightarrow{AB}-\lambda\cdot\overrightarrow{BD}`} /> und setze in die Gleichung ein. Du erhältst eine Gleichung für <Formel tex={t`\lambda`} nach="." /></>,
      ]}
      loesung={[
        <>
          a: Es ist <Formel tex={t`\overrightarrow{AB}=${sp(d.ab)}`} /> und <Formel tex={t`\overrightarrow{DC}=${sp(d.ab)}`} nach="." /> Aus <Formel tex={t`\overrightarrow{AB}=\overrightarrow{DC}`} /> folgt, dass <Formel tex="ABCD" /> ein Parallelogramm ist (siehe <Modulverweis modul="dreieck-vierecke-skalarprodukt">Dreieck und Vierecke mit Vektoren</Modulverweis>).
        </>,
        <>
          b: Es sei <Formel tex={t`\overrightarrow{BT}=\lambda\cdot\overrightarrow{BD}`} /> mit <Formel tex={t`\overrightarrow{BD}=${sp(d.bd)}`} nach="." /> Der rechte Winkel bei T verlangt <Formel tex={t`\overrightarrow{TA}\cdot\overrightarrow{TB}=0`} nach="." /> Mit <Formel tex={t`\overrightarrow{TB}=-\lambda\cdot\overrightarrow{BD}`} /> und <Formel tex={t`\lambda\neq 0`} /> folgt
          <Umbruchformel
            tex={t`\overrightarrow{TA}\cdot\overrightarrow{BD}=\left(-\overrightarrow{AB}-\lambda\overrightarrow{BD}\right)\cdot\overrightarrow{BD}=0`}
            schmal={t`\begin{gathered}\overrightarrow{TA}\cdot\overrightarrow{BD}\\{}=(-\overrightarrow{AB}-\lambda\overrightarrow{BD})\cdot\overrightarrow{BD}\\{}=0\end{gathered}`}
          />
        </>,
        <>
          Mit <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{BD}=-6+0-4=-10`} /> und <Formel tex={t`\overrightarrow{BD}\cdot\overrightarrow{BD}=9+0+16=25`} /> ist <Formel tex={t`10-25\lambda=0`} nach="," /> also <Formel tex={t`\lambda=\frac{2}{5}`} nach="." /> Damit ist <Formel tex={t`\overline{BT}:\overline{TD}=\lambda:(1-\lambda)=\frac{2}{5}:\frac{3}{5}=2:3`} nach="." />
        </>,
      ]}
    >
      <p>
        Die Punkte <Formel tex={P('A', d.A)} nach="," /> <Formel tex={P('B', d.B)} nach="," /> <Formel tex={P('C', d.C)} /> und <Formel tex={P('D', d.D)} /> sind Eckpunkte eines Vierecks <Formel tex="ABCD" nach="." />
      </p>
      <Teile>
        <li>
          Weisen Sie nach, dass <Formel tex="ABCD" /> ein Parallelogramm ist. <BE n={1} />
        </li>
        <li>
          Der Punkt <Formel tex="T" /> liegt auf der Diagonalen <Formel tex={t`\overline{BD}`} nach="," /> und das Dreieck <Formel tex="ABT" /> hat bei <Formel tex="T" /> einen rechten Winkel. Bestimmen Sie das Verhältnis der Länge der Strecke <Formel tex={t`\overline{BT}`} /> zur Länge der Strecke <Formel tex={t`\overline{TD}`} nach="." /> <BE n={4} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

/** Aufgabe 2: gerader Kreiszylinder, Punkt im Inneren der Grundfläche, nächster und fernster Randpunkt der Deckfläche. */
function Aufgabe2() {
  const d = A2;
  return (
    <Aufgabe
      nummer="2"
      titel="Wassertank"
      felder={[
        { id: 's1', name: 'erste Koordinate von S', beschriftung: <>Koordinate <Formel tex={t`s_1`} /> von <Formel tex="S" /></>, erwartet: d.S[0]! },
        { id: 's2', name: 'zweite Koordinate von S', beschriftung: <>Koordinate <Formel tex={t`s_2`} /> von <Formel tex="S" /></>, erwartet: d.S[1]! },
        { id: 's3', name: 'dritte Koordinate von S', beschriftung: <>Koordinate <Formel tex={t`s_3`} /> von <Formel tex="S" /></>, erwartet: d.S[2]! },
        { id: 't1', name: 'erste Koordinate von T', beschriftung: <>Koordinate <Formel tex={t`t_1`} /> von <Formel tex="T" /></>, erwartet: d.T[0]! },
        { id: 't2', name: 'zweite Koordinate von T', beschriftung: <>Koordinate <Formel tex={t`t_2`} /> von <Formel tex="T" /></>, erwartet: d.T[1]! },
        { id: 't3', name: 'dritte Koordinate von T', beschriftung: <>Koordinate <Formel tex={t`t_3`} /> von <Formel tex="T" /></>, erwartet: d.T[2]! },
      ]}
      hilfen={[
        <>Lege den Mittelpunkt <Formel tex="N" /> der Grundfläche fest. Er liegt senkrecht unter <Formel tex="M" nach="." /> Der Abstand von <Formel tex="P" /> zu <Formel tex="N" /> sagt dir, ob <Formel tex="P" /> im Inneren liegt.</>,
        <>Betrachte die Deckfläche von oben: Der Punkt <Formel tex="P" /> liegt senkrecht unter dem Punkt <Formel tex="P^*" /> der Deckfläche. Der nächste Randpunkt liegt auf dem Strahl von <Formel tex="M" /> durch <Formel tex={t`P^*`} nach="," /> der fernste auf dem Gegenstrahl.</>,
        <>Ein Vektor der Länge 1 in Richtung von <Formel tex={t`\overrightarrow{NP}`} /> ist <Formel tex={t`\frac{1}{10}\cdot\overrightarrow{NP}`} nach="." /> Multipliziere ihn mit dem Radius 15 und gehe von <Formel tex="M" /> aus in diese bzw. die entgegengesetzte Richtung (<Modulverweis modul="betrag-abstand-teilung">Einheitsvektor</Modulverweis>).</>,
      ]}
      loesung={[
        <>
          a: Der Mittelpunkt der Grundfläche liegt unter <Formel tex="M" nach=":" /> <Formel tex={P('N', d.N)} nach="." /> Es ist <Formel tex={t`\overrightarrow{NP}=${sp(d.np)}`} /> und
          <Umbruchformel
            tex={t`|\overrightarrow{NP}|=\sqrt{36+64+0}=10<15`}
            schmal={t`\begin{gathered}|\overrightarrow{NP}|\\{}=\sqrt{36+64+0}\\{}=10<15\end{gathered}`}
          />
          Der Abstand von <Formel tex="P" /> zum Mittelpunkt ist kleiner als der Radius, also liegt <Formel tex="P" /> im Inneren der Grundfläche.
        </>,
        <>
          b: Der Punkt <Formel tex="P^*(-2\,|\,5\,|\,8)" /> liegt senkrecht über <Formel tex="P" /> in der Deckfläche und hat von <Formel tex="M" /> den Abstand 10. Der Randpunkt mit dem kleinsten Abstand von <Formel tex="P" /> liegt auf dem Strahl von <Formel tex="M" /> durch <Formel tex="P^*" nach="," /> der Randpunkt mit dem größten Abstand auf dem Gegenstrahl (Abstände 5 und 25 in der Deckfläche).
        </>,
        <>
          Der Vektor <Formel tex={t`\frac{1}{10}\cdot\overrightarrow{NP}=\begin{pmatrix}-0{,}6\\0{,}8\\0\end{pmatrix}`} /> hat die Länge 1. Also ist
          <Umbruchformel
            tex={t`\overrightarrow{OS}=\overrightarrow{OM}+15\cdot\begin{pmatrix}-0{,}6\\0{,}8\\0\end{pmatrix}=\begin{pmatrix}-5\\9\\8\end{pmatrix}`}
            schmal={t`\begin{gathered}\overrightarrow{OS}\\{}=\overrightarrow{OM}+15\cdot\begin{pmatrix}-0{,}6\\0{,}8\\0\end{pmatrix}\\{}=\begin{pmatrix}-5\\9\\8\end{pmatrix}\end{gathered}`}
          />
          und entsprechend <Formel tex={t`\overrightarrow{OT}=\overrightarrow{OM}-15\cdot\begin{pmatrix}-0{,}6\\0{,}8\\0\end{pmatrix}=\begin{pmatrix}13\\-15\\8\end{pmatrix}`} nach="," /> also <Formel tex={t`S(-5\,|\,9\,|\,8)`} /> und <Formel tex={t`T(13\,|\,-15\,|\,8)`} nach="." />
        </>,
      ]}
    >
      <p>
        Ein Wassertank hat die Form eines geraden Kreiszylinders mit dem Radius 15 und der Höhe 8 (Längeneinheit 1 m). Seine Grundfläche liegt in der <Formel tex={t`x_1x_2`} />-Ebene, der Mittelpunkt der Deckfläche ist <Formel tex={P('M', d.M)} nach="." /> Der Punkt <Formel tex={P('P', d.P)} /> liegt in der <Formel tex={t`x_1x_2`} />-Ebene.
      </p>
      <Teile>
        <li>
          Zeigen Sie, dass <Formel tex="P" /> im Inneren der Grundfläche des Tanks liegt. <BE n={2} />
        </li>
        <li>
          Unter allen Punkten auf dem Rand der Deckfläche hat der Punkt <Formel tex="S" /> den kleinsten Abstand von <Formel tex="P" /> und der Punkt <Formel tex="T" /> den größten. Bestimmen Sie die Koordinaten von <Formel tex="S" /> und <Formel tex="T" nach="." /> <BE n={3} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

/** Aufgabe 3: Rechteck im Raum, Eckpunkt C, senkrechte Projektion. */
function Aufgabe3() {
  const d = A3;
  return (
    <Aufgabe
      nummer="3"
      titel="Rechteck und Projektion"
      felder={[
        { id: 'c1', name: 'erste Koordinate von C', beschriftung: <>Koordinate <Formel tex={t`c_1`} /> von <Formel tex="C" /></>, erwartet: d.C[0]! },
        { id: 'c2', name: 'zweite Koordinate von C', beschriftung: <>Koordinate <Formel tex={t`c_2`} /> von <Formel tex="C" /></>, erwartet: d.C[1]! },
        { id: 'c3', name: 'dritte Koordinate von C', beschriftung: <>Koordinate <Formel tex={t`c_3`} /> von <Formel tex="C" /></>, erwartet: d.C[2]! },
      ]}
      hilfen={[
        <>Bei einem Parallelogramm gilt <Formel tex={t`\overrightarrow{AB}=\overrightarrow{DC}`} nach="." /> Löse nach <Formel tex={t`\overrightarrow{OC}`} /> auf: Der Zielpunkt ist Ausgangspunkt plus Vektor.</>,
        <>Ein Parallelogramm ist ein Rechteck, wenn zwei Seiten, die sich in einer Ecke treffen, senkrecht aufeinander stehen: <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AD}=0`} nach="." /></>,
        <>Bei der senkrechten Projektion in die <Formel tex={t`x_1x_2`} />-Ebene wird die dritte Koordinate 0, siehe <Modulverweis modul="punkte-vektoren-raum">Punkte und Vektoren im Raum</Modulverweis>. Den Punkt <Formel tex="M" /> erhältst du als Mittelpunkt von <Formel tex={t`\overline{AC}`} nach="." /></>,
      ]}
      loesung={[
        <>
          a: Aus <Formel tex={t`\overrightarrow{AB}=\overrightarrow{DC}`} /> folgt <Formel tex={t`\overrightarrow{OC}=\overrightarrow{OB}+\overrightarrow{OD}-\overrightarrow{OA}`} nach="," /> also
          <Umbruchformel
            tex={t`\overrightarrow{OC}=${sp(d.B)}+${sp(d.D)}-${sp(d.A)}=${sp(d.C)}`}
            schmal={t`\begin{gathered}\overrightarrow{OC}\\{}=${sp(d.B)}+${sp(d.D)}-${sp(d.A)}\\{}=${sp(d.C)}\end{gathered}`}
          />
        </>,
        <>
          b: Es ist <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}-1\\2\\-1\end{pmatrix}`} /> und <Formel tex={t`\overrightarrow{AD}=\begin{pmatrix}-3\\-2\\-1\end{pmatrix}`} nach="." /> Das Skalarprodukt ist
          <Umbruchformel
            tex={t`\overrightarrow{AB}\cdot\overrightarrow{AD}=3-4+1=0`}
            schmal={t`\begin{gathered}\overrightarrow{AB}\cdot\overrightarrow{AD}\\{}=3-4+1\\{}=0\end{gathered}`}
          />
          Die Vektoren stehen senkrecht aufeinander, das Parallelogramm hat bei <Formel tex="A" /> einen rechten Winkel und ist ein Rechteck.
        </>,
        <>
          c: Der Mittelpunkt von <Formel tex={t`\overline{AC}`} /> ist <Formel tex={P('M', d.M)} nach="." /> Die Projektion lässt die dritte Koordinate weg: <Formel tex={t`A'(3\,|\,1)`} nach="," /> <Formel tex={t`B'(2\,|\,3)`} nach="," /> <Formel tex={t`C'(-1\,|\,1)`} nach="," /> <Formel tex={t`D'(0\,|\,-1)`} /> und <Formel tex={t`M'(1\,|\,1)`} nach="." /> Es ist <Formel tex={t`\overrightarrow{A'B'}=\begin{pmatrix}-1\\2\end{pmatrix}`} /> und <Formel tex={t`\overrightarrow{A'D'}=\begin{pmatrix}-3\\-2\end{pmatrix}`} nach="," /> das Skalarprodukt ist <Formel tex={t`3-4=-1\neq 0`} nach="." /> Das Bild ist ein Parallelogramm, aber kein Rechteck: Die Projektion erhält Parallelität, nicht aber rechte Winkel, weil das Rechteck nicht parallel zur <Formel tex={t`x_1x_2`} />-Ebene liegt.
        </>,
      ]}
    >
      <p>
        Die Punkte <Formel tex={P('A', d.A)} nach="," /> <Formel tex={P('B', d.B)} /> und <Formel tex={P('D', d.D)} /> sind Eckpunkte eines Parallelogramms <Formel tex="ABCD" nach="." /> Seine Diagonalen schneiden sich im Punkt <Formel tex="M" nach="." />
      </p>
      <Teile>
        <li>
          Bestimmen Sie die Koordinaten von <Formel tex="C" nach="." /> <BE n={1} />
        </li>
        <li>
          Zeigen Sie, dass das Parallelogramm <Formel tex="ABCD" /> ein Rechteck ist. <BE n={2} />
        </li>
        <li>
          Das Viereck wird senkrecht auf die <Formel tex={t`x_1x_2`} />-Ebene projiziert. Dabei entstehen die Bildpunkte <Formel tex={t`A'`} nach="," /> <Formel tex={t`B'`} nach="," /> <Formel tex={t`C'`} nach="," /> <Formel tex={t`D'`} /> und <Formel tex={t`M'`} nach="." /> Zeichnen Sie <Formel tex={t`A'B'C'D'`} /> und <Formel tex={t`M'`} /> in ein Koordinatensystem und entscheiden Sie, ob <Formel tex={t`A'B'C'D'`} /> ein Rechteck ist. <BE n={2} />
        </li>
      </Teile>
      <Kontrollschaubild>
        <Bild daten={BILD_A3} unter={<>Die Projektion: Parallelogramm <Formel tex={t`A'B'C'D'`} /> mit den Diagonalen und dem Schnittpunkt <Formel tex={t`M'`} nach="." /> Es ist kein Rechteck.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 4: Dreieck mit Parameter, rechter Winkel für alle t, Flächeninhalt. */
function Aufgabe4() {
  const d = A4;
  return (
    <Aufgabe
      nummer="4"
      titel="Dreiecke mit einem Parameter"
      felder={[
        { id: 't1', name: 'kleinerer Wert von t', beschriftung: <>Kleinerer Wert von <Formel tex="t" /></>, erwartet: d.t[0]! },
        { id: 't2', name: 'größerer Wert von t', beschriftung: <>Größerer Wert von <Formel tex="t" /></>, erwartet: d.t[1]! },
      ]}
      hilfen={[
        <>Berechne <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC_t}`} nach="." /> Der rechte Winkel bei <Formel tex="A" /> gehört zum Skalarprodukt 0.</>,
        <>Im rechtwinkligen Dreieck ist der Flächeninhalt das halbe Produkt der Katheten <Formel tex={t`|\overrightarrow{AB}|`} /> und <Formel tex={t`|\overrightarrow{AC_t}|`} nach="." /></>,
        <>Es ist <Formel tex={t`|\overrightarrow{AB}|=5`} nach="." /> Setze <Formel tex={t`\frac{1}{2}\cdot 5\cdot|\overrightarrow{AC_t}|=32{,}5`} /> an und löse nach <Formel tex="t" /> auf.</>,
      ]}
      loesung={[
        <>
          a: Es ist <Formel tex={t`\overrightarrow{AB}=${sp([3, 0, -4])}`} /> und <Formel tex={t`\overrightarrow{AC_t}=\begin{pmatrix}4t\\12\\3t\end{pmatrix}`} nach="." /> Das Skalarprodukt ist
          <Umbruchformel
            tex={t`\overrightarrow{AB}\cdot\overrightarrow{AC_t}=12t+0-12t=0`}
            schmal={t`\begin{gathered}\overrightarrow{AB}\cdot\overrightarrow{AC_t}\\{}=12t+0-12t\\{}=0\end{gathered}`}
          />
          Für jedes <Formel tex="t" /> stehen die Vektoren senkrecht aufeinander, das Dreieck hat bei <Formel tex="A" /> einen rechten Winkel.
        </>,
        <>
          b: Es ist <Formel tex={t`|\overrightarrow{AB}|=\sqrt{9+0+16}=5`} nach="," /> und
          <Umbruchformel
            tex={t`|\overrightarrow{AC_t}|^2=16t^2+144+9t^2=25t^2+144`}
            schmal={t`\begin{gathered}|\overrightarrow{AC_t}|^2\\{}=16t^2+144+9t^2\\{}=25t^2+144\end{gathered}`}
          />
          also <Formel tex={t`|\overrightarrow{AC_t}|=\sqrt{25t^2+144}`} nach="." /> Der Flächeninhalt ist
          <Umbruchformel
            tex={t`\frac{1}{2}\cdot 5\cdot\sqrt{25t^2+144}=32{,}5\ \Leftrightarrow\ \sqrt{25t^2+144}=13`}
            schmal={t`\begin{gathered}\frac{5}{2}\cdot\sqrt{25t^2+144}\\{}=32{,}5\\\Leftrightarrow\ \sqrt{25t^2+144}\\{}=13\end{gathered}`}
          />
          Quadrieren gibt <Formel tex={t`25t^2+144=169`} nach="," /> also <Formel tex={t`t^2=1`} nach="." /> Die Lösungen sind <Formel tex="t=-1" /> und <Formel tex="t=1" nach="." />
        </>,
      ]}
    >
      <p>
        Für jede reelle Zahl <Formel tex="t" /> bilden die Punkte <Formel tex={P('A', d.A)} nach="," /> <Formel tex={P('B', d.B)} /> und <Formel tex={t`C_t(1+4t\,|\,14\,|\,3+3t)`} /> ein Dreieck.
      </p>
      <Teile>
        <li>
          Zeigen Sie, dass jedes dieser Dreiecke bei <Formel tex="A" /> einen rechten Winkel hat. <BE n={2} />
        </li>
        <li>
          Bestimmen Sie alle Werte von <Formel tex="t" nach="," /> für die das Dreieck <Formel tex={t`ABC_t`} /> den Flächeninhalt 32,5 hat. <BE n={3} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

/** Aufgabe 5: Abstand und rechter Winkel mit einem Parameter in der dritten Koordinate. */
function Aufgabe5() {
  const d = A5;
  return (
    <Aufgabe
      nummer="5"
      titel="Abstand und rechter Winkel mit Parameter"
      felder={[
        { id: 'a1', name: 'kleinerer Wert von a für den Abstand 13', beschriftung: <>Kleinerer Wert von <Formel tex="a" /> in a</>, erwartet: d.a[0]! },
        { id: 'a2', name: 'größerer Wert von a für den Abstand 13', beschriftung: <>Größerer Wert von <Formel tex="a" /> in a</>, erwartet: d.a[1]! },
        { id: 'b', name: 'Wert von a für den rechten Winkel bei O', beschriftung: <>Wert von <Formel tex="a" /> in b</>, erwartet: d.rechtwinklig },
      ]}
      hilfen={[
        <>Berechne <Formel tex={t`\overrightarrow{PQ}`} /> und setze <Formel tex={t`|\overrightarrow{PQ}|=13`} /> an. Quadriere beide Seiten, dann bleibt eine quadratische Gleichung in <Formel tex="a" nach="." /> Sie hat zwei Lösungen.</>,
        <>Ein rechter Winkel bei <Formel tex="O" /> bedeutet <Formel tex={t`\overrightarrow{OP}\cdot\overrightarrow{OQ}=0`} nach="." /> Diese Gleichung ist linear in <Formel tex="a" nach="." /></>,
      ]}
      loesung={[
        <>
          a: Es ist <Formel tex={t`\overrightarrow{PQ}=\begin{pmatrix}4\\-3\\-2-a\end{pmatrix}`} nach="." /> Aus <Formel tex={t`|\overrightarrow{PQ}|=13`} /> folgt
          <Umbruchformel
            tex={t`16+9+(a+2)^2=169\ \Leftrightarrow\ (a+2)^2=144`}
            schmal={t`\begin{gathered}16+9+(a+2)^2\\{}=169\\\Leftrightarrow\\(a+2)^2=144\end{gathered}`}
          />
          also <Formel tex={t`a+2=12`} /> oder <Formel tex={t`a+2=-12`} nach="," /> das heißt <Formel tex="a=10" /> oder <Formel tex="a=-14" nach="." />
        </>,
        <>
          b: Es ist <Formel tex={t`\overrightarrow{OP}=\begin{pmatrix}2\\4\\a\end{pmatrix}`} /> und <Formel tex={t`\overrightarrow{OQ}=\begin{pmatrix}6\\1\\-2\end{pmatrix}`} nach="." /> Aus
          <Umbruchformel
            tex={t`\overrightarrow{OP}\cdot\overrightarrow{OQ}=12+4-2a=0`}
            schmal={t`\begin{gathered}\overrightarrow{OP}\cdot\overrightarrow{OQ}\\{}=12+4-2a\\{}=0\end{gathered}`}
          />
          folgt <Formel tex="a=8" nach="." />
        </>,
      ]}
    >
      <p>
        Gegeben sind die Punkte <Formel tex={t`P(2\,|\,4\,|\,a)`} /> und <Formel tex={P('Q', d.Q)} /> mit <Formel tex={t`a\in\mathbb{R}`} nach="." /> Der Koordinatenursprung wird mit <Formel tex="O" /> bezeichnet.
      </p>
      <Teile>
        <li>
          Bestimmen Sie alle Werte von <Formel tex="a" nach="," /> für die <Formel tex="P" /> und <Formel tex="Q" /> den Abstand 13 haben. <BE n={3} />
        </li>
        <li>
          Ermitteln Sie den Wert von <Formel tex="a" nach="," /> für den das Dreieck <Formel tex="OPQ" /> bei <Formel tex="O" /> rechtwinklig ist. <BE n={2} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

/** Aufgabe 6: Quader mit Vektoren, Lage beschreiben, Punkt zeichnen, Quadrat über die Diagonalen. */
function Aufgabe6() {
  return (
    <Zeichenaufgabe
      nummer="6"
      titel="Quader und Vektoren"
      hilfe={
        <>
          <p>
            a: Es ist <Formel tex={t`\overrightarrow{AX}=\frac{1}{2}\cdot(\vec{a}+\vec{c})+\vec{d}`} nach="." /> Der Vektor <Formel tex={t`\frac{1}{2}\cdot(\vec{a}+\vec{c})=\frac{1}{2}\cdot\overrightarrow{AC}`} /> führt von <Formel tex="A" /> zum Mittelpunkt der Diagonalen <Formel tex={t`\overline{AC}`} nach="," /> und <Formel tex={t`\vec{d}`} /> hebt ihn auf die Höhe der Deckfläche. Der Punkt <Formel tex="X" /> ist der Mittelpunkt der Deckfläche <Formel tex="EFGH" nach="." />
          </p>
          <p>
            b: Es ist <Formel tex={t`\overrightarrow{AY}=\vec{a}+\frac{1}{2}\cdot\vec{c}=\overrightarrow{AB}+\frac{1}{2}\cdot\overrightarrow{BC}`} nach="." /> Von <Formel tex="A" /> geht man bis <Formel tex="B" /> und dann die Hälfte der Kante <Formel tex={t`\overline{BC}`} nach="." /> Der Punkt <Formel tex="Y" /> ist der Mittelpunkt der Kante <Formel tex={t`\overline{BC}`} nach="." />
          </p>
          <p>
            c: Es ist <Formel tex={t`\overrightarrow{AC}=\vec{a}+\vec{c}`} /> und <Formel tex={t`\overrightarrow{BD}=\vec{c}-\vec{a}`} nach="." /> Weil die Grundfläche ein Rechteck ist, gilt <Formel tex={t`\vec{a}\cdot\vec{c}=0`} nach="." /> Damit ist
          </p>
          <Umbruchformel
            tex={t`\overrightarrow{AC}\cdot\overrightarrow{BD}=(\vec{a}+\vec{c})\cdot(\vec{c}-\vec{a})=|\vec{c}|^2-|\vec{a}|^2`}
            schmal={t`\begin{gathered}\overrightarrow{AC}\cdot\overrightarrow{BD}\\{}=(\vec{a}+\vec{c})\\\quad\cdot(\vec{c}-\vec{a})\\{}=|\vec{c}|^2-|\vec{a}|^2\end{gathered}`}
          />
          <p>
            Die Diagonalen sind genau dann orthogonal, wenn <Formel tex={t`|\vec{c}|^2-|\vec{a}|^2=0`} /> ist, also <Formel tex={t`|\vec{a}|=|\vec{c}|`} nach="." /> Ein Rechteck mit zwei gleich langen Nachbarseiten ist ein Quadrat. Also sind die Diagonalen genau dann orthogonal, wenn die Grundfläche ein Quadrat ist.
          </p>
        </>
      }
      kontrolle={
        <KontrollFigur
          spec={raumQuader(true)}
          unter={
            <>
              Der Punkt <Formel tex="X" /> ist der Mittelpunkt der Deckfläche, der Punkt <Formel tex="Y" /> der Mittelpunkt der Kante <Formel tex={t`\overline{BC}`} nach="." />
            </>
          }
        />
      }
    >
      <p>
        Die Abbildung zeigt einen Quader <Formel tex="ABCDEFGH" /> mit rechteckiger Grundfläche <Formel tex="ABCD" nach="." /> Die Vektoren <Formel tex={t`\vec{a}=\overrightarrow{AB}`} nach="," /> <Formel tex={t`\vec{c}=\overrightarrow{AD}`} /> und <Formel tex={t`\vec{d}=\overrightarrow{AE}`} /> sind eingezeichnet, <Formel tex={t`\vec{a}`} /> orange, <Formel tex={t`\vec{c}`} /> blau und <Formel tex={t`\vec{d}`} /> rosa.
      </p>
      <Figur spec={raumQuader(false)} unter={<>Der Quader mit den Vektoren <Formel tex={t`\vec{a}`} nach="," /> <Formel tex={t`\vec{c}`} /> und <Formel tex={t`\vec{d}`} nach="." /> Über dem Bild kannst du zwischen Schrägbild und räumlicher Ansicht umschalten.</>} />
      <Teile>
        <li>
          Beschreiben Sie die Lage des Punkts <Formel tex="X" nach="," /> für den <Formel tex={t`\overrightarrow{AX}=\frac{1}{2}\cdot(\vec{a}+\vec{c})+\vec{d}`} /> gilt. <BE n={1} />
        </li>
        <li>
          Zeichnen Sie den Punkt <Formel tex="Y" /> mit <Formel tex={t`\overrightarrow{AY}=\vec{a}+\frac{1}{2}\cdot\vec{c}`} /> in die Abbildung ein. <BE n={1} />
        </li>
        <li>
          Begründen Sie, dass die Diagonalen <Formel tex={t`\overline{AC}`} /> und <Formel tex={t`\overline{BD}`} /> der Grundfläche genau dann orthogonal zueinander sind, wenn die Grundfläche ein Quadrat ist. <BE n={3} />
        </li>
      </Teile>
    </Zeichenaufgabe>
  );
}

export function OhneHilfsmittel() {
  return (
    <Abschnitt id="ohne-hilfsmittel" titel="Ohne Hilfsmittel">
      <p>
        Sechs Aufgaben mit je 5 BE, ohne Taschenrechner. Die Ergebnisse sind ganze Zahlen oder einfache Brüche. Eine Wurzel lässt sich in diesen Aufgaben vermeiden oder kürzt sich.
      </p>
      <Eingabehinweis />
      <Aufgabe1 />
      <Aufgabe2 />
      <Aufgabe3 />
      <Aufgabe4 />
      <Aufgabe5 />
      <Aufgabe6 />
    </Abschnitt>
  );
}
