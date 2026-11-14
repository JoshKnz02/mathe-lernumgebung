import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { BE, Teile } from '@/components/Teilaufgaben';
import { Umbruchformel } from '@/components/Umbruchformel';
import { t } from '@/lib/modulhilfen';
import { A1, A2, A3, A4, A5, A6 } from './daten';
import { GeradeFormel, Kette, Liste, P, feld, koord, sp, spur } from './hilfen';

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als ganze Zahl ein, zum Beispiel <code>2</code> oder <code>-1</code>, ohne Einheit. Die Felder prüfen nur Ergebnisse. Nachweise, Begründungen und Beschreibungen schreibst du ins Heft und vergleichst sie danach mit dem Lösungsweg. Die Aufgaben dieses Abschnitts rechnest du ohne Taschenrechner.
    </Hinweis>
  );
}

/** Aufgabe 1: Koordinatengleichung einer Ebene aus drei Punkten und ein Punkt mit Parameter in der Ebene. */
function Aufgabe1() {
  const d = A1;
  const [n1, n2, n3] = d.n as [number, number, number];
  return (
    <Aufgabe
      nummer="1"
      titel="Ebene durch drei Punkte"
      felder={[
        feld('n1', 'Koeffizient von x1', <>Koeffizient von <Formel tex="x_1" /></>, n1),
        feld('n2', 'Koeffizient von x2', <>Koeffizient von <Formel tex="x_2" /></>, n2),
        feld('n3', 'Koeffizient von x3', <>Koeffizient von <Formel tex="x_3" /></>, n3),
        feld('b', 'rechte Seite der Gleichung', <>rechte Seite <Formel tex="b" /></>, d.d),
        feld('a', 'Wert von a', <>Wert von <Formel tex="a" /></>, d.a),
      ]}
      hilfen={[
        <>
          Zwei Spannvektoren der Ebene sind <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} nach="." /> Ein Normalenvektor steht senkrecht auf beiden (<Modulverweis modul="normalenform-koordinatenform">Normalenform und Koordinatenform</Modulverweis>).
        </>,
        <>
          Den Normalenvektor erhältst du mit dem Vektorprodukt (Kreuzprodukt) der beiden Spannvektoren (<Modulverweis modul="vektorprodukt">Das Vektorprodukt (Kreuzprodukt)</Modulverweis>). Kürze ihn auf teilerfremde ganze Zahlen mit positiver erster Koordinate. Seine Koordinaten sind die Koeffizienten von <Formel tex={t`x_1`} nach="," /> <Formel tex={t`x_2`} /> und <Formel tex={t`x_3`} nach="." />
        </>,
        <>
          Die rechte Seite erhältst du, wenn du die Koordinaten eines der drei Punkte einsetzt. Für die zweite Teilaufgabe setzt du die Koordinaten von <Formel tex="Q" /> in die Gleichung ein und löst nach <Formel tex="a" nach="." />
        </>,
      ]}
      loesung={[
        <>
          a: Die Spannvektoren sind
          <Liste z={[t`\overrightarrow{AB}=${sp([0, 3, -1])}`, t`\overrightarrow{AC}=${sp([-2, 0, 2])}`]} />
          Das Vektorprodukt (Kreuzprodukt) ist
          <Umbruchformel
            tex={t`\overrightarrow{AB}\times\overrightarrow{AC}=${sp(d.kreuz)}=2\cdot${sp(d.n)}`}
            schmal={t`\begin{gathered}\overrightarrow{AB}\times\overrightarrow{AC}\\{}=${sp(d.kreuz)}\\{}=2\cdot${sp(d.n)}\end{gathered}`}
          />
          Also ist <Formel tex={t`\vec{n}=${sp(d.n)}`} /> ein Normalenvektor und die Gleichung beginnt mit <Formel tex={t`3x_1+x_2+3x_3=b`} nach="." />
        </>,
        <>
          Einsetzen der Koordinaten von <Formel tex={P('A', d.A)} /> in <Formel tex={t`3x_1+x_2+3x_3`} /> liefert
          <Kette z={[t`b`, t`6+0+3`, t`9`]} />
          Die Koordinatengleichung ist <Formel tex={t`E:\ 3x_1+x_2+3x_3=9`} nach="." /> Probe mit <Formel tex={P('B', d.B)} nach=":" /> <Formel tex={t`6+3+0=9`} nach="." /> Probe mit <Formel tex={P('C', d.C)} nach=":" /> <Formel tex={t`0+0+9=9`} nach="."/>
        </>,
        <>
          b: Einsetzen von <Formel tex={t`Q(a\,|\,-3\,|\,a)`} /> ergibt
          <Kette z={[t`3a+(-3)+3a`, t`6a-3`, t`9`]} />
          Aus <Formel tex={t`6a-3=9`} /> folgt <Formel tex={t`6a=12`} /> und <Formel tex={t`a=2`} nach="." /> Probe: <Formel tex={t`Q(2\,|\,-3\,|\,2)`} nach=":" /> <Formel tex={t`6-3+6=9`} nach="." />
        </>,
      ]}
    >
      <p>
        Die Punkte <Formel tex={P('A', d.A)} nach="," /> <Formel tex={P('B', d.B)} /> und <Formel tex={P('C', d.C)} /> liegen in einer Ebene <Formel tex="E" nach="." /> Für jede reelle Zahl <Formel tex="a" /> ist <Formel tex={t`Q(a\,|\,-3\,|\,a)`} /> ein Punkt im Raum.
      </p>
      <Teile>
        <li>
          Bestimmen Sie eine Koordinatengleichung von <Formel tex="E" nach="." /> Die Koeffizienten sollen teilerfremde ganze Zahlen sein, der Koeffizient von <Formel tex="x_1" /> positiv. <BE n={3} />
        </li>
        <li>
          Bestimmen Sie den Wert von <Formel tex="a" nach="," /> für den <Formel tex="Q" /> in <Formel tex="E" /> liegt. <BE n={2} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

/** Aufgabe 2: Spurpunkte und besondere Lage. */
function Aufgabe2() {
  const d = A2;
  return (
    <Aufgabe
      nummer="2"
      titel="Spurpunkte"
      felder={[
        spur('s1', 1, d.S1[0]!),
        spur('s2', 2, d.S2[1]!),
        spur('s3', 3, d.S3[2]!),
      ]}
      hilfen={[
        <>
          Ein Spurpunkt ist ein Schnittpunkt der Ebene mit einer Koordinatenachse (<Modulverweis modul="zeichnerische-darstellung-ebenen">Zeichnerische Darstellung von Ebenen</Modulverweis>). Auf der <Formel tex={t`x_1`} />-Achse sind die beiden anderen Koordinaten 0.
        </>,
        <>
          Setze in der Gleichung von <Formel tex="E" /> zwei Koordinaten gleich 0 und löse nach der dritten. Das machst du dreimal.
        </>,
        <>
          Für die zweite Teilaufgabe: Welche Koordinate kommt in der Gleichung von <Formel tex="F" /> nicht vor? Was bedeutet das für die Punkte der Ebene und für die Achse dieser Koordinate?
        </>,
      ]}
      loesung={[
        <>
          a: Spurpunkt mit der <Formel tex={t`x_1`} />-Achse: <Formel tex={t`x_2=x_3=0`} nach="," /> also <Formel tex={t`3x_1=12`} /> und <Formel tex={t`x_1=4`} nach="." /> Mit der <Formel tex={t`x_2`} />-Achse: <Formel tex={t`2x_2=12`} /> und <Formel tex={t`x_2=6`} nach="." /> Mit der <Formel tex={t`x_3`} />-Achse: <Formel tex={t`6x_3=12`} /> und <Formel tex={t`x_3=2`} nach="."/>
        </>,
        <>
          Die Spurpunkte sind
          <Liste z={[P('S_1', d.S1), P('S_2', d.S2), P('S_3', d.S3)]} />
        </>,
        <>
          b: In <Formel tex={t`F:\ 3x_1+2x_2=12`} /> fehlt <Formel tex={t`x_3`} nach="." /> Die Gleichung stellt für jeden Wert von <Formel tex={t`x_3`} /> dieselbe Bedingung an <Formel tex={t`x_1`} /> und <Formel tex={t`x_2`} nach="." /> Mit jedem Punkt liegt daher die ganze Parallele zur <Formel tex={t`x_3`} />-Achse durch diesen Punkt in <Formel tex="F" nach="." /> Die Ebene <Formel tex="F" /> ist parallel zur <Formel tex={t`x_3`} />-Achse. Sie schneidet diese Achse nicht, denn für <Formel tex={t`x_1=x_2=0`} /> ergibt die Gleichung die falsche Aussage <Formel tex={t`0=12`} nach="." /> <Formel tex="F" /> hat deshalb nur die beiden Spurpunkte <Formel tex={P('S_1', [4, 0, 0])} /> und <Formel tex={P('S_2', [0, 6, 0])} nach="." />
        </>,
      ]}
    >
      <p>
        Gegeben sind die Ebenen <Formel tex={t`E:\ 3x_1+2x_2+6x_3=12`} /> und <Formel tex={t`F:\ 3x_1+2x_2=12`} nach="." />
      </p>
      <Teile>
        <li>
          Bestimmen Sie die Koordinaten der drei Spurpunkte <Formel tex={t`S_1`} nach="," /> <Formel tex={t`S_2`} /> und <Formel tex={t`S_3`} /> von <Formel tex="E" nach="." /> Geben Sie von jedem Spurpunkt die Koordinate an, die nicht 0 ist. <BE n={3} />
        </li>
        <li>
          Beschreiben Sie die besondere Lage von <Formel tex="F" /> im Koordinatensystem und begründen Sie, wie viele Spurpunkte <Formel tex="F" /> hat. <BE n={2} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

/** Aufgabe 3: Gerade und Ebene, Lage und Durchstoßpunkt. */
function Aufgabe3() {
  const d = A3;
  return (
    <Aufgabe
      nummer="3"
      titel="Gerade und Ebene"
      felder={[koord('s1', 'S', 1, d.S[0]!), koord('s2', 'S', 2, d.S[1]!), koord('s3', 'S', 3, d.S[2]!)]}
      hilfen={[
        <>
          Die Geradenprobe setzt die Koordinaten des Geradenpunkts in die Koordinatengleichung der Ebene ein und löst nach <Formel tex="t" /> (<Modulverweis modul="gerade-und-ebene">Gerade und Ebene: gegenseitige Lage</Modulverweis>).
        </>,
        <>
          Das Skalarprodukt <Formel tex={t`\vec{n}\cdot\vec{u}`} /> aus Normalenvektor der Ebene und Richtungsvektor der Geraden sagt dir sofort, ob sich die Gerade und die Ebene in genau einem Punkt schneiden können.
        </>,
        <>
          Der Durchstoßpunkt gehört zu dem Wert von <Formel tex="t" nach="," /> den du bei der Geradenprobe gefunden hast. Setze ihn in die Geradengleichung ein.
        </>,
      ]}
      loesung={[
        <>
          a: Der Normalenvektor von <Formel tex="E" /> ist <Formel tex={t`\vec{n}=${sp(d.n)}`} nach="." /> Damit gilt
          <Kette z={[t`\vec{n}\cdot\vec{u}`, t`2+2-1`, t`3`]} />
          Das Skalarprodukt ist nicht 0, also ist <Formel tex="g" /> nicht parallel zu <Formel tex="E" nach="." /> Die Gerade schneidet die Ebene in genau einem Punkt.
        </>,
        <>
          b: Geradenprobe: Die Koordinaten <Formel tex={t`(1+t\,|\,t\,|\,1-t)`} /> kommen in die Gleichung von <Formel tex="E" nach=":" />
          <Kette z={[t`2(1+t)`, t`2+2t`]} />
          Zusammen mit <Formel tex={t`2t`} /> und <Formel tex={t`1-t`} /> ergibt sich
          <Kette z={[t`3t+3`, t`9`]} />
          Aus <Formel tex={t`3t+3=9`} /> folgt <Formel tex={t`t=2`} nach="." />
        </>,
        <>
          Einsetzen in die Geradengleichung ergibt
          <Umbruchformel
            tex={t`\overrightarrow{OS}=${sp(d.P)}+2\cdot${sp(d.u)}=${sp(d.S)}`}
            schmal={t`\begin{gathered}\overrightarrow{OS}\\{}=${sp(d.P)}+2\cdot${sp(d.u)}\\{}=${sp(d.S)}\end{gathered}`}
          />
          Der Durchstoßpunkt ist <Formel tex={P('S', d.S)} nach="." /> Probe in <Formel tex="E" nach=":" /> <Formel tex={t`6+4-1=9`} nach="." />
        </>,
      ]}
    >
      <p>
        Gegeben sind die Ebene <Formel tex={t`E:\ 2x_1+2x_2+x_3=9`} /> und die Gerade
      </p>
      <GeradeFormel p={d.P} u={d.u} />
      <Teile>
        <li>
          Zeigen Sie, dass <Formel tex="g" /> die Ebene <Formel tex="E" /> in genau einem Punkt schneidet. <BE n={2} />
        </li>
        <li>
          Bestimmen Sie die Koordinaten des Durchstoßpunkts <Formel tex="S" nach="." /> <BE n={3} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

/** Aufgabe 4: zwei Ebenen, Schnittgerade. */
function Aufgabe4() {
  const d = A4;
  return (
    <Aufgabe
      nummer="4"
      titel="Zwei Ebenen"
      felder={[
        koord('p1', 'P', 1, d.S0[0]!),
        koord('p2', 'P', 2, d.S0[1]!),
        koord('q1', 'Q', 1, d.S2[0]!),
        koord('q2', 'Q', 2, d.S2[1]!),
      ]}
      hilfen={[
        <>
          Zwei Ebenen sind parallel oder identisch, wenn ihre Normalenvektoren Vielfache voneinander sind. Sonst schneiden sie sich in einer Geraden (<Modulverweis modul="zwei-ebenen">Zwei Ebenen: gegenseitige Lage</Modulverweis>).
        </>,
        <>
          Die Punkte der Schnittgeraden erfüllen beide Gleichungen. Addiere die beiden Gleichungen. Welche Variable fällt weg?
        </>,
        <>
          Wähle für <Formel tex={t`x_3`} /> einen Wert, zum Beispiel 0, und berechne <Formel tex={t`x_1`} /> und <Formel tex={t`x_2`} /> aus den beiden Gleichungen. Dasselbe machst du mit <Formel tex={t`x_3=2`} nach="." />
        </>,
      ]}
      loesung={[
        <>
          a: Die Normalenvektoren sind <Formel tex={t`\vec{n}_E=${sp(d.nE)}`} /> und <Formel tex={t`\vec{n}_F=${sp(d.nF)}`} nach="." /> Es gibt keine Zahl <Formel tex="k" /> mit <Formel tex={t`\vec{n}_F=k\cdot\vec{n}_E`} nach="," /> denn die erste Koordinate verlangt <Formel tex={t`k=1`} /> und die zweite <Formel tex={t`k=-1`} nach="." /> Die Normalenvektoren sind keine Vielfachen, die Ebenen sind weder parallel noch identisch. Sie schneiden sich in einer Geraden.
        </>,
        <>
          b: Addieren der Gleichungen von <Formel tex="E" /> und <Formel tex="F" /> ergibt
          <Umbruchformel
            tex={t`2x_1=6\ \Rightarrow\ x_1=3`}
            schmal={t`\begin{gathered}2x_1=6\\x_1=3\end{gathered}`}
          />
          Einsetzen in <Formel tex="E" /> liefert <Formel tex={t`3-x_2+x_3=2`} nach="," /> also <Formel tex={t`x_2=x_3+1`} nach="." />
        </>,
        <>
          Für <Formel tex={t`x_3=0`} /> ist <Formel tex={t`x_2=1`} nach="," /> also <Formel tex={P('P', d.S0)} nach="." /> Für <Formel tex={t`x_3=2`} /> ist <Formel tex={t`x_2=3`} nach="," /> also <Formel tex={P('Q', d.S2)} nach="." /> Probe von <Formel tex="Q" /> in <Formel tex="F" nach=":" /> <Formel tex={t`3+3-2=4`} nach="." />
        </>,
      ]}
    >
      <p>
        Gegeben sind die Ebenen <Formel tex={t`E:\ x_1-x_2+x_3=2`} /> und <Formel tex={t`F:\ x_1+x_2-x_3=4`} nach="." />
      </p>
      <Teile>
        <li>
          Begründen Sie, dass sich <Formel tex="E" /> und <Formel tex="F" /> in einer Geraden schneiden. <BE n={2} />
        </li>
        <li>
          Bestimmen Sie die Koordinaten des Punkts <Formel tex="P" /> der Schnittgeraden mit <Formel tex={t`x_3=0`} /> und des Punkts <Formel tex="Q" /> der Schnittgeraden mit <Formel tex={t`x_3=2`} nach="." /> Geben Sie von beiden die ersten zwei Koordinaten an. <BE n={3} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

/** Aufgabe 5: Abstand Punkt und Ebene, Spiegelpunkt. */
function Aufgabe5() {
  const d = A5;
  return (
    <Aufgabe
      nummer="5"
      titel="Abstand und Spiegelpunkt"
      felder={[
        feld('d', 'Abstand von Q zu E', <>Abstand von <Formel tex="Q" /> zu <Formel tex="E" /></>, d.abstand),
        koord('q1', "Q'", 1, d.Qs[0]!),
        koord('q2', "Q'", 2, d.Qs[1]!),
        koord('q3', "Q'", 3, d.Qs[2]!),
      ]}
      hilfen={[
        <>
          Der Abstand eines Punkts von einer Ebene ist die Länge des Lots auf die Ebene. Die Lotgerade durch <Formel tex="Q" /> hat den Normalenvektor der Ebene als Richtungsvektor (<Modulverweis modul="abstaende-ebenen">Abstände zu Ebenen</Modulverweis>).
        </>,
        <>
          Mit der Abstandsformel erhältst du <Formel tex={t`d=\dfrac{|\vec{n}\cdot\vec{q}-b|}{|\vec{n}|}`} nach="." /> Der Betrag des Normalenvektors ist hier eine ganze Zahl.
        </>,
        <>
          Der Spiegelpunkt <Formel tex={t`Q'`} /> liegt auf der Lotgeraden, auf der anderen Seite der Ebene, im gleichen Abstand. Der Lotfußpunkt <Formel tex="F" /> ist die Mitte von <Formel tex={t`\overline{QQ'}`} nach="." />
        </>,
      ]}
      loesung={[
        <>
          a: Es ist <Formel tex={t`|\vec{n}|=\sqrt{4+1+4}=3`} nach="." /> Mit <Formel tex={t`\vec{n}\cdot\vec{q}=2+4+6=12`} /> folgt
          <Kette z={[t`d`, t`\dfrac{|12-3|}{3}`, t`3`]} />
        </>,
        <>
          b: Die Lotgerade durch <Formel tex="Q" /> ist <Formel tex={t`\vec{x}=${sp(d.Q)}+t\cdot${sp(d.n)}`} nach="." /> Die Geradenprobe liefert
          <Kette z={[t`2(1+2t)`, t`2+4t`]} />
          <Kette z={[t`-2(-3-2t)`, t`6+4t`]} />
          Zusammen mit <Formel tex={t`4+t`} /> ergibt sich
          <Kette z={[t`9t+12`, t`3`]} />
          Aus <Formel tex={t`9t+12=3`} /> folgt <Formel tex={t`t=-1`} nach="." /> Der Lotfußpunkt ist
          <Umbruchformel
            tex={t`\overrightarrow{OF}=${sp(d.Q)}-1\cdot${sp(d.n)}=${sp(d.F)}`}
            schmal={t`\begin{gathered}\overrightarrow{OF}\\{}=${sp(d.Q)}-1\cdot${sp(d.n)}\\{}=${sp(d.F)}\end{gathered}`}
          />
        </>,
        <>
          Der Spiegelpunkt ist doppelt so weit von <Formel tex="Q" /> entfernt wie <Formel tex="F" nach=":" />
          <Umbruchformel
            tex={t`\overrightarrow{OQ'}=2\cdot${sp(d.F)}-${sp(d.Q)}=${sp(d.Qs)}`}
            schmal={t`\begin{gathered}\overrightarrow{OQ'}\\{}=2\cdot${sp(d.F)}-${sp(d.Q)}\\{}=${sp(d.Qs)}\end{gathered}`}
          />
          Probe: <Formel tex={t`\overrightarrow{QQ'}=${sp([-4, -2, 4])}`} /> hat die Länge <Formel tex={t`\sqrt{16+4+16}=6=2\cdot 3`} nach="." />
        </>,
      ]}
    >
      <p>
        Gegeben sind die Ebene <Formel tex={t`E:\ 2x_1+x_2-2x_3=3`} /> und der Punkt <Formel tex={P('Q', d.Q)} nach="." />
      </p>
      <Teile>
        <li>
          Berechnen Sie den Abstand des Punkts <Formel tex="Q" /> von der Ebene <Formel tex="E" nach="." /> <BE n={2} />
        </li>
        <li>
          Bestimmen Sie die Koordinaten des Punkts <Formel tex={t`Q'`} nach="," /> der durch Spiegelung von <Formel tex="Q" /> an <Formel tex="E" /> entsteht. <BE n={3} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

/** Aufgabe 6: Parallelität zur Ebene mit Parameter. */
function Aufgabe6() {
  const d = A6;
  return (
    <Aufgabe
      nummer="6"
      titel="Gerade parallel zur Ebene"
      felder={[feld('a', 'Wert von a', <>Wert von <Formel tex="a" /></>, d.a), feld('q', 'Wert von q', <>Wert von <Formel tex="q" /></>, d.q)]}
      hilfen={[
        <>
          Eine Gerade ist parallel zu einer Ebene (oder liegt in ihr), wenn ihr Richtungsvektor senkrecht auf dem Normalenvektor der Ebene steht, also <Formel tex={t`\vec{n}\cdot\vec{u}=0`} nach="." />
        </>,
        <>
          Das Skalarprodukt hängt für die erste Teilaufgabe nur von <Formel tex="a" /> ab. Setze es gleich 0 und löse nach <Formel tex="a" nach="." />
        </>,
        <>
          Liegt die Gerade in der Ebene, so liegt auch ihr Stützpunkt in der Ebene. Setze <Formel tex={t`(0\,|\,q\,|\,1)`} /> in die Gleichung von <Formel tex="E" /> ein (<Modulverweis modul="gerade-und-ebene">Gerade und Ebene: gegenseitige Lage</Modulverweis>).
        </>,
      ]}
      loesung={[
        <>
          a: Der Normalenvektor ist <Formel tex={t`\vec{n}=${sp(d.n)}`} nach="." /> Damit gilt
          <Kette z={[t`\vec{n}\cdot\vec{u}`, t`2a-2+4`, t`2a+2`]} />
          Aus <Formel tex={t`2a+2=0`} /> folgt <Formel tex={t`a=-1`} nach="." /> Für diesen Wert ist <Formel tex={t`g_a`} /> parallel zu <Formel tex="E" /> oder liegt in <Formel tex="E" nach="." />
        </>,
        <>
          b: Für <Formel tex={t`a=-1`} /> und den Stützpunkt <Formel tex={P('P', d.P)} /> ist <Formel tex={t`2\cdot 0-1+4\cdot 1=3\neq 7`} nach="," /> die Gerade ist also echt parallel zu <Formel tex="E" nach="." /> Mit dem Stützpunkt <Formel tex={t`(0\,|\,q\,|\,1)`} /> gilt
          <Kette z={[t`2\cdot 0-q+4\cdot 1`, t`-q+4`, t`7`]} />
        </>,
        <>
          Aus <Formel tex={t`-q+4=7`} /> folgt <Formel tex={t`q=-3`} nach="." /> Probe: Der Punkt <Formel tex={t`(0\,|\,-3\,|\,1)`} /> liefert <Formel tex={t`0+3+4=7`} nach="." /> Er liegt in <Formel tex="E" nach="," /> und die Richtung ist senkrecht zum Normalenvektor, also liegt die ganze Gerade in <Formel tex="E" nach="." />
        </>,
      ]}
    >
      <p>
        Gegeben sind die Ebene <Formel tex={t`E:\ 2x_1-x_2+4x_3=7`} /> und für jede reelle Zahl <Formel tex="a" /> die Gerade
      </p>
      <Umbruchformel
        tex={t`g_a:\ \vec{x}=${sp(d.P)}+t\cdot\begin{pmatrix}a\\2\\1\end{pmatrix}`}
        schmal={t`\begin{gathered}g_a:\ \vec{x}=${sp(d.P)}\\{}+t\cdot\begin{pmatrix}a\\2\\1\end{pmatrix}\end{gathered}`}
      />
      <Teile>
        <li>
          Bestimmen Sie den Wert von <Formel tex="a" nach="," /> für den <Formel tex={t`g_a`} /> parallel zu <Formel tex="E" /> ist oder in <Formel tex="E" /> liegt. <BE n={2} />
        </li>
        <li>
          Der Stützpunkt der Geraden wird zu <Formel tex={t`(0\,|\,q\,|\,1)`} /> verschoben, <Formel tex="a" /> hat den Wert aus der ersten Teilaufgabe. Bestimmen Sie den Wert von <Formel tex="q" nach="," /> für den die Gerade in <Formel tex="E" /> liegt. <BE n={3} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

export function OhneHilfsmittel() {
  return (
    <Abschnitt id="ohne-hilfsmittel" titel="Ohne Hilfsmittel">
      <p>
        Sechs kurze Aufgaben im Stil der Pflichtaufgaben (Prüfungsteil A) mit je zwei Teilaufgaben und zusammen 5 Bewertungseinheiten. Du rechnest ohne Taschenrechner, die Ergebnisse sind ganze Zahlen.
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
