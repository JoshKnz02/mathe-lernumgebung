import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { BE, Teile } from '@/components/Teilaufgaben';
import { Umbruchformel } from '@/components/Umbruchformel';
import { gl, glSchmal, punktTeX } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { A1, A2, A3, A4, A5, A6 } from './daten';

const sp = (v: number[]) => spalte(v);
const P = (name: string, p: number[]) => punktTeX(name, p);
const Gerade = ({ p, u, name = 'g', par = 't' }: { p: number[]; u: number[]; name?: string; par?: string }) => <Umbruchformel tex={gl({ p, u }, name, par)} schmal={glSchmal({ p, u }, name, par)} />;
const koord = (id: string, wort: string, name: string, index: number, erwartet: number) => ({
  id,
  name: `${wort} Koordinate von ${name}`,
  beschriftung: (
    <>
      Koordinate <Formel tex={`${name.toLowerCase()}_${index}`} /> von <Formel tex={name} />
    </>
  ),
  erwartet,
});

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als ganze Zahl ein, zum Beispiel <code>2</code> oder <code>-1</code>, ohne Einheit. Die Felder prüfen nur Ergebnisse. Nachweise, Begründungen und Erläuterungen schreibst du ins Heft und vergleichst sie danach mit dem Lösungsweg. Die Aufgaben dieses Abschnitts rechnest du ohne Taschenrechner.
    </Hinweis>
  );
}

/** Aufgabe 1: Punktprobe und Punkte mit vorgegebenem Abstand auf einer Geraden. */
function Aufgabe1() {
  const d = A1;
  return (
    <Aufgabe
      nummer="1"
      titel="Messseil"
      felder={[
        koord('b1', 'erste', 'B', 1, d.B[0]!),
        koord('b2', 'zweite', 'B', 2, d.B[1]!),
        koord('b3', 'dritte', 'B', 3, d.B[2]!),
        koord('c1', 'erste', 'C', 1, d.C[0]!),
        koord('c2', 'zweite', 'C', 2, d.C[1]!),
        koord('c3', 'dritte', 'C', 3, d.C[2]!),
      ]}
      hilfen={[
        <>
          Ein Punkt liegt auf <Formel tex="g" nach="," /> wenn <em>ein</em> Wert von <Formel tex="t" /> alle drei Koordinatengleichungen erfüllt (<Modulverweis modul="geradengleichung">Geradengleichung</Modulverweis>).
        </>,
        <>
          Berechne die Länge des Richtungsvektors <Formel tex={t`\vec{u}`} nach="." /> Sie sagt dir, um welchen Abstand sich ein Punkt auf <Formel tex="g" /> verschiebt, wenn <Formel tex="t" /> um 1 wächst (<Modulverweis modul="betrag-abstand-teilung">Betrag, Abstand und Teilung von Strecken</Modulverweis>).
        </>,
        <>
          Der Abstand 6 ist ein Vielfaches der Länge von <Formel tex={t`\vec{u}`} nach="." /> Gehe von <Formel tex="A" /> aus mit diesem Vielfachen in beide Richtungen, also zu <Formel tex={t`t_A+k`} /> und <Formel tex={t`t_A-k`} nach="." />
        </>,
      ]}
      loesung={[
        <>
          a: Der Ansatz <Formel tex={t`\begin{pmatrix}1\\-2\\3\end{pmatrix}+t\cdot\begin{pmatrix}2\\1\\2\end{pmatrix}=\begin{pmatrix}7\\1\\9\end{pmatrix}`} /> liefert drei Gleichungen:
          <Umbruchformel
            tex={t`1+2t=7\ \Rightarrow\ t=3,\ \ -2+3=1,\ \ 3+2\cdot 3=9`}
            schmal={t`\begin{gathered}1+2t=7\\t=3\\-2+3=1\\3+2\cdot 3=9\end{gathered}`}
          />
          Alle drei Gleichungen sind für <Formel tex={t`t=3`} /> erfüllt. Also liegt <Formel tex="A" /> auf <Formel tex="g" nach="." />
        </>,
        <>
          b: Es ist <Formel tex={t`|\vec{u}|=\sqrt{4+1+4}=3`} nach="." /> Der Abstand 6 ist das Doppelte, also gehört ein Unterschied von 2 im Parameter zu jedem der gesuchten Punkte. Wegen <Formel tex={t`t_A=3`} /> sind es die Parameter <Formel tex={t`t=1`} /> und <Formel tex={t`t=5`} nach=":" />
          <Umbruchformel
            tex={t`\overrightarrow{OB}=\begin{pmatrix}1\\-2\\3\end{pmatrix}+1\cdot\begin{pmatrix}2\\1\\2\end{pmatrix}=\begin{pmatrix}3\\-1\\5\end{pmatrix}`}
            schmal={t`\begin{gathered}\overrightarrow{OB}\\{}=\begin{pmatrix}1\\-2\\3\end{pmatrix}+1\cdot\begin{pmatrix}2\\1\\2\end{pmatrix}\\{}=\begin{pmatrix}3\\-1\\5\end{pmatrix}\end{gathered}`}
          />
          <Umbruchformel
            tex={t`\overrightarrow{OC}=\begin{pmatrix}1\\-2\\3\end{pmatrix}+5\cdot\begin{pmatrix}2\\1\\2\end{pmatrix}=\begin{pmatrix}11\\3\\13\end{pmatrix}`}
            schmal={t`\begin{gathered}\overrightarrow{OC}\\{}=\begin{pmatrix}1\\-2\\3\end{pmatrix}+5\cdot\begin{pmatrix}2\\1\\2\end{pmatrix}\\{}=\begin{pmatrix}11\\3\\13\end{pmatrix}\end{gathered}`}
          />
        </>,
        <>
          Probe: <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}-4\\-2\\-4\end{pmatrix}`} /> hat die Länge <Formel tex={t`\sqrt{16+4+16}=6`} nach="." /> Die Punkte sind <Formel tex={P('B', d.B)} /> und <Formel tex={P('C', d.C)} nach="." />
        </>,
      ]}
    >
      <p>
        Ein Messseil wird im Koordinatensystem (Längeneinheit 1 m) durch die Gerade
      </p>
      <Gerade p={d.P} u={d.u} />
      <p>
        beschrieben. Der Punkt <Formel tex={P('A', d.A)} /> liegt auf dem Seil, wie die erste Teilaufgabe zeigt.
      </p>
      <Teile>
        <li>
          Weisen Sie nach, dass der Punkt <Formel tex="A" /> auf der Geraden <Formel tex="g" /> liegt. <BE n={2} />
        </li>
        <li>
          Bestimmen Sie die Koordinaten der beiden Punkte auf <Formel tex="g" nach="," /> die vom Punkt <Formel tex="A" /> den Abstand 6 haben. Der Punkt <Formel tex="B" /> ist der mit der kleineren ersten Koordinate. <BE n={3} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

/** Aufgabe 2: besondere Lage und Spurpunkt. */
function Aufgabe2() {
  const d = A2;
  return (
    <Aufgabe
      nummer="2"
      titel="Verlauf eines Kabels"
      felder={[
        { id: 's2', name: 'zweite Koordinate des Spurpunkts', beschriftung: <>Koordinate <Formel tex="s_2" /> von <Formel tex="S_{23}" /></>, erwartet: d.S23[1]! },
        { id: 's3', name: 'dritte Koordinate des Spurpunkts', beschriftung: <>Koordinate <Formel tex="s_3" /> von <Formel tex="S_{23}" /></>, erwartet: d.S23[2]! },
      ]}
      hilfen={[
        <>
          Vergleiche die Koordinaten des Richtungsvektors. Ist eine von ihnen 0, ändert sich die zugehörige Koordinate der Punkte auf der Geraden nie (<Modulverweis modul="spurpunkte-besondere-lage">Spurpunkte und besondere Lage</Modulverweis>).
        </>,
        <>
          Der Spurpunkt mit der <Formel tex={t`x_2x_3`} />-Ebene hat die erste Koordinate 0. Setze die erste Koordinatengleichung der Geraden gleich 0 und löse nach <Formel tex="t" nach="." />
        </>,
        <>
          Setze den gefundenen Wert von <Formel tex="t" /> in die zweite und die dritte Koordinatengleichung ein.
        </>,
      ]}
      loesung={[
        <>
          a: Die zweite Koordinate des Richtungsvektors ist 0. Alle Punkte der Geraden haben deshalb die zweite Koordinate <Formel tex={t`-2`} nach="." /> Die Gerade <Formel tex="g" /> liegt in der Ebene <Formel tex={t`x_2=-2`} nach="," /> sie verläuft parallel zur <Formel tex={t`x_1x_3`} />-Ebene und hat von ihr den Abstand 2. Sie schneidet die <Formel tex={t`x_1x_3`} />-Ebene nicht.
        </>,
        <>
          b: In der <Formel tex={t`x_2x_3`} />-Ebene ist <Formel tex={t`x_1=0`} nach=":" />
          <Umbruchformel tex={t`3-t=0\ \Rightarrow\ t=3`} schmal={t`\begin{gathered}3-t=0\\t=3\end{gathered}`} />
        </>,
        <>
          Mit <Formel tex={t`t=3`} /> folgt
          <Umbruchformel
            tex={t`\overrightarrow{OS_{23}}=\begin{pmatrix}3\\-2\\4\end{pmatrix}+3\cdot\begin{pmatrix}-1\\0\\2\end{pmatrix}=\begin{pmatrix}0\\-2\\10\end{pmatrix}`}
            schmal={t`\begin{gathered}\overrightarrow{OS_{23}}\\{}=\begin{pmatrix}3\\-2\\4\end{pmatrix}+3\cdot\begin{pmatrix}-1\\0\\2\end{pmatrix}\\{}=\begin{pmatrix}0\\-2\\10\end{pmatrix}\end{gathered}`}
          />
          Der Spurpunkt ist <Formel tex={P('S_{23}', d.S23)} nach="." />
        </>,
      ]}
    >
      <p>
        Der Verlauf eines Kabels wird im Koordinatensystem durch die Gerade
      </p>
      <Gerade p={d.P} u={d.u} />
      <p>
        beschrieben.
      </p>
      <Teile>
        <li>
          Erläutern Sie die besondere Lage der Geraden <Formel tex="g" /> im Koordinatensystem. <BE n={2} />
        </li>
        <li>
          Bestimmen Sie die Koordinaten des Spurpunkts <Formel tex="S_{23}" /> von <Formel tex="g" /> mit der <Formel tex={t`x_2x_3`} />-Ebene. Die erste Koordinate ist 0, geben Sie die zweite und die dritte an. <BE n={3} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

/** Aufgabe 3: Geradenschar, Punkt auf allen Geraden, orthogonale Richtungen. */
function Aufgabe3() {
  const d = A3;
  return (
    <Aufgabe
      nummer="3"
      titel="Geradenschar"
      felder={[{ id: 'k', name: 'Wert von k', beschriftung: <>Wert von <Formel tex="k" /></>, erwartet: d.k }]}
      hilfen={[
        <>
          Ein Punkt der Geraden <Formel tex={t`g_k`} /> zu einem bestimmten Parameter <Formel tex="r" /> ist der Stützpunkt. Welcher Wert von <Formel tex="r" /> gehört zu ihm?
        </>,
        <>
          Zwei Geraden haben orthogonale Richtungsvektoren, wenn das Skalarprodukt der Richtungsvektoren 0 ist (<Modulverweis modul="skalarprodukt-orthogonalitaet">Skalarprodukt, Orthogonalität und Winkel</Modulverweis>).
        </>,
        <>
          Das Skalarprodukt <Formel tex={t`\begin{pmatrix}k\\1\\k+1\end{pmatrix}\cdot\begin{pmatrix}2\\1\\-3\end{pmatrix}`} /> hängt linear von <Formel tex="k" /> ab. Setze es gleich 0.
        </>,
      ]}
      loesung={[
        <>
          a: Für <Formel tex={t`r=0`} /> ergibt die Geradengleichung von <Formel tex={t`g_k`} /> den Punkt
          <Umbruchformel
            tex={t`\begin{pmatrix}1\\2\\0\end{pmatrix}+0\cdot\begin{pmatrix}k\\1\\k+1\end{pmatrix}=\begin{pmatrix}1\\2\\0\end{pmatrix}`}
            schmal={t`\begin{gathered}\begin{pmatrix}1\\2\\0\end{pmatrix}+0\cdot\begin{pmatrix}k\\1\\k+1\end{pmatrix}\\{}=\begin{pmatrix}1\\2\\0\end{pmatrix}\end{gathered}`}
          />
          unabhängig von <Formel tex="k" nach="." /> Also liegt <Formel tex={P('Q', d.Q)} /> für jedes <Formel tex="k" /> auf <Formel tex={t`g_k`} nach="." /> Alle Geraden der Schar gehen durch <Formel tex="Q" nach="," /> nur die Richtung ändert sich.
        </>,
        <>
          b: Die Richtungsvektoren sind orthogonal, wenn ihr Skalarprodukt 0 ist. Es ist <Formel tex={t`2k+1-3(k+1)`} nach="," /> ausmultipliziert und zusammengefasst:
          <Umbruchformel
            tex={t`2k+1-3(k+1)=2k+1-3k-3=-k-2`}
            schmal={t`\begin{gathered}2k+1-3k-3\\{}=-k-2\end{gathered}`}
          />
        </>,
        <>
          Aus <Formel tex={t`-k-2=0`} /> folgt <Formel tex={t`k=-2`} nach="." /> Probe: Der Richtungsvektor ist dann <Formel tex={t`\begin{pmatrix}-2\\1\\-1\end{pmatrix}`} /> und <Formel tex={t`-4+1+3=0`} nach="." />
        </>,
      ]}
    >
      <p>
        Für jede reelle Zahl <Formel tex="k" /> ist die Gerade
      </p>
      <Umbruchformel
        tex={t`g_k:\ \vec{x}=\begin{pmatrix}1\\2\\0\end{pmatrix}+r\cdot\begin{pmatrix}k\\1\\k+1\end{pmatrix}`}
        schmal={t`\begin{gathered}g_k:\ \vec{x}=\begin{pmatrix}1\\2\\0\end{pmatrix}\\{}+r\cdot\begin{pmatrix}k\\1\\k+1\end{pmatrix}\end{gathered}`}
      />
      <p>
        mit <Formel tex={t`r\in\mathbb{R}`} /> gegeben. Außerdem ist die Gerade <Formel tex={t`h:\ \vec{x}=\begin{pmatrix}0\\0\\1\end{pmatrix}+s\cdot\begin{pmatrix}2\\1\\-3\end{pmatrix}`} /> gegeben.
      </p>
      <Teile>
        <li>
          Zeigen Sie, dass der Punkt <Formel tex={P('Q', d.Q)} /> für jeden Wert von <Formel tex="k" /> auf <Formel tex={t`g_k`} /> liegt. <BE n={2} />
        </li>
        <li>
          Bestimmen Sie den Wert von <Formel tex="k" nach="," /> für den die Richtungsvektoren von <Formel tex={t`g_k`} /> und <Formel tex="h" /> orthogonal sind. <BE n={3} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

/** Aufgabe 4: gegenseitige Lage mit einem Parameter, Schnittpunkt. */
function Aufgabe4() {
  const d = A4;
  return (
    <Aufgabe
      nummer="4"
      titel="Zwei Geraden mit Parameter"
      felder={[
        { id: 'a', name: 'Wert von a', beschriftung: <>Wert von <Formel tex="a" /></>, erwartet: d.a },
        koord('s1', 'erste', 'S', 1, d.S[0]!),
        koord('s2', 'zweite', 'S', 2, d.S[1]!),
        koord('s3', 'dritte', 'S', 3, d.S[2]!),
      ]}
      hilfen={[
        <>
          Zwei Geraden schneiden sich, wenn es Werte für <Formel tex="t" /> und <Formel tex="s" /> gibt, für die sich dieselben Punkte ergeben (<Modulverweis modul="gegenseitige-lage-geraden">Gegenseitige Lage von Geraden</Modulverweis>). Setze die Geradengleichungen gleich.
        </>,
        <>
          Du erhältst drei Gleichungen mit den Unbekannten <Formel tex="t" nach="," /> <Formel tex="s" /> und <Formel tex="a" nach="." /> Die ersten beiden enthalten nur <Formel tex="t" /> und <Formel tex="s" nach="." /> Löse sie zuerst und setze die Werte in die dritte ein.
        </>,
        <>
          Den Schnittpunkt erhältst du, wenn du <Formel tex={t`t`} /> in die Gleichung von <Formel tex="g" /> einsetzt. Zur Probe setzt du <Formel tex="s" /> in <Formel tex={t`h_a`} /> ein.
        </>,
      ]}
      loesung={[
        <>
          a: Gleichsetzen von <Formel tex="g" /> und <Formel tex={t`h_a`} /> ergibt
          <Umbruchformel
            tex={t`\mathrm{I}:\ 2+t=4+s,\ \ \mathrm{II}:\ t=3+2s,\ \ \mathrm{III}:\ 1+2t=a`}
            schmal={t`\begin{gathered}\mathrm{I}:\ 2+t=4+s\\\mathrm{II}:\ t=3+2s\\\mathrm{III}:\ 1+2t=a\end{gathered}`}
          />
          Einsetzen von II in I liefert <Formel tex={t`5+2s=4+s`} /> und damit <Formel tex={t`s=-1`} nach="." /> Aus II folgt <Formel tex={t`t=1`} nach="." /> Aus III folgt <Formel tex={t`a=1+2\cdot 1=3`} nach="." /> Nur für <Formel tex={t`a=3`} /> schneiden sich die Geraden.
        </>,
        <>
          b: Einsetzen von <Formel tex={t`t=1`} /> in <Formel tex="g" /> ergibt
          <Umbruchformel
            tex={t`\overrightarrow{OS}=\begin{pmatrix}2\\0\\1\end{pmatrix}+1\cdot\begin{pmatrix}1\\1\\2\end{pmatrix}=\begin{pmatrix}3\\1\\3\end{pmatrix}`}
            schmal={t`\begin{gathered}\overrightarrow{OS}\\{}=\begin{pmatrix}2\\0\\1\end{pmatrix}+1\cdot\begin{pmatrix}1\\1\\2\end{pmatrix}\\{}=\begin{pmatrix}3\\1\\3\end{pmatrix}\end{gathered}`}
          />
          Probe mit <Formel tex={t`h_3`} /> und <Formel tex={t`s=-1`} nach=":" /> <Formel tex={t`\begin{pmatrix}4\\3\\3\end{pmatrix}-\begin{pmatrix}1\\2\\0\end{pmatrix}=\begin{pmatrix}3\\1\\3\end{pmatrix}`} nach="." /> Der Schnittpunkt ist <Formel tex={P('S', d.S)} nach="." />
        </>,
      ]}
    >
      <p>
        Gegeben sind die Gerade <Formel tex={t`g:\ \vec{x}=\begin{pmatrix}2\\0\\1\end{pmatrix}+t\cdot\begin{pmatrix}1\\1\\2\end{pmatrix}`} /> und für jede reelle Zahl <Formel tex="a" /> die Gerade
      </p>
      <Umbruchformel
        tex={t`h_a:\ \vec{x}=\begin{pmatrix}4\\3\\a\end{pmatrix}+s\cdot\begin{pmatrix}1\\2\\0\end{pmatrix}`}
        schmal={t`\begin{gathered}h_a:\ \vec{x}=\begin{pmatrix}4\\3\\a\end{pmatrix}\\{}+s\cdot\begin{pmatrix}1\\2\\0\end{pmatrix}\end{gathered}`}
      />
      <Teile>
        <li>
          Bestimmen Sie den Wert von <Formel tex="a" nach="," /> für den sich <Formel tex="g" /> und <Formel tex={t`h_a`} /> schneiden. <BE n={3} />
        </li>
        <li>
          Geben Sie die Koordinaten des Schnittpunkts <Formel tex="S" /> an. <BE n={2} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

/** Aufgabe 5: Lotfußpunkt, Abstand und Spiegelpunkt. */
function Aufgabe5() {
  const d = A5;
  return (
    <Aufgabe
      nummer="5"
      titel="Lot auf eine Gerade"
      felder={[
        koord('f1', 'erste', 'F', 1, d.F[0]!),
        koord('f2', 'zweite', 'F', 2, d.F[1]!),
        koord('f3', 'dritte', 'F', 3, d.F[2]!),
        { id: 'd', name: 'Abstand von Q zu g', beschriftung: <>Abstand von <Formel tex="Q" /> zu <Formel tex="g" /></>, erwartet: d.abstand },
        { id: 'q1', name: 'erste Koordinate von Q Strich', beschriftung: <>Koordinate <Formel tex="q'_1" /> von <Formel tex="Q'" /></>, erwartet: d.Qs[0]! },
        { id: 'q2', name: 'zweite Koordinate von Q Strich', beschriftung: <>Koordinate <Formel tex="q'_2" /> von <Formel tex="Q'" /></>, erwartet: d.Qs[1]! },
        { id: 'q3', name: 'dritte Koordinate von Q Strich', beschriftung: <>Koordinate <Formel tex="q'_3" /> von <Formel tex="Q'" /></>, erwartet: d.Qs[2]! },
      ]}
      hilfen={[
        <>
          Der Lotfußpunkt <Formel tex="F" /> liegt auf <Formel tex="g" /> und die Strecke <Formel tex={t`\overline{QF}`} /> steht senkrecht auf <Formel tex="g" nach="." /> Schreibe <Formel tex="F" /> mit dem Parameter <Formel tex="t" /> und nutze das Skalarprodukt (<Modulverweis modul="abstaende-geraden">Abstand Punkt und Gerade, paralleler Geraden</Modulverweis>).
        </>,
        <>
          Die Bedingung lautet <Formel tex={t`\overrightarrow{QF}\cdot\vec{u}=0`} nach="." /> Sie führt auf eine Gleichung für <Formel tex="t" /> mit einer ganzen Zahl als Lösung.
        </>,
        <>
          Der Abstand von <Formel tex="Q" /> zu <Formel tex="g" /> ist die Länge von <Formel tex={t`\overrightarrow{QF}`} nach="." /> Der Spiegelpunkt <Formel tex="Q'" /> liegt so, dass <Formel tex="F" /> die Mitte der Strecke <Formel tex={t`\overline{QQ'}`} /> ist.
        </>,
      ]}
      loesung={[
        <>
          a: Ein Punkt von <Formel tex="g" /> ist <Formel tex={t`F(-1+2t\,|\,4+3t\,|\,6t)`} nach="." /> Dann ist
          <Umbruchformel
            tex={t`\overrightarrow{QF}=\begin{pmatrix}-5+2t\\3+3t\\6t-8\end{pmatrix}`}
            schmal={t`\begin{gathered}\overrightarrow{QF}\\{}=\begin{pmatrix}-5+2t\\3+3t\\6t-8\end{pmatrix}\end{gathered}`}
          />
          Die Orthogonalität zu <Formel tex={t`\vec{u}=\begin{pmatrix}2\\3\\6\end{pmatrix}`} /> verlangt, dass die Summe der drei Produkte der Koordinaten 0 ist. Ausmultipliziert sind die Produkte <Formel tex={t`-10+4t`} nach="," /> <Formel tex={t`9+9t`} /> und <Formel tex={t`36t-48`} nach="," /> ihre Summe ist
          <Umbruchformel
            tex={t`2(-5+2t)+3(3+3t)+6(6t-8)=49t-49=0`}
            schmal={t`\begin{gathered}49t-49=0\end{gathered}`}
          />
          Also ist <Formel tex={t`t=1`} /> und <Formel tex={P('F', d.F)} nach="." />
        </>,
        <>
          b: Mit <Formel tex={t`t=1`} /> ist <Formel tex={t`\overrightarrow{QF}=\begin{pmatrix}-3\\6\\-2\end{pmatrix}`} /> und
          <Umbruchformel
            tex={t`|\overrightarrow{QF}|=\sqrt{9+36+4}=\sqrt{49}=7`}
            schmal={t`\begin{gathered}|\overrightarrow{QF}|\\{}=\sqrt{9+36+4}\\{}=\sqrt{49}\\{}=7\end{gathered}`}
          />
          Der Abstand von <Formel tex="Q" /> zu <Formel tex="g" /> beträgt 7.
        </>,
        <>
          c: Weil <Formel tex="F" /> die Mitte von <Formel tex={t`\overline{QQ'}`} /> ist, gilt <Formel tex={t`\overrightarrow{OQ'}=2\cdot\overrightarrow{OF}-\overrightarrow{OQ}`} nach=":" />
          <Umbruchformel
            tex={t`\overrightarrow{OQ'}=\begin{pmatrix}2\\14\\12\end{pmatrix}-\begin{pmatrix}4\\1\\8\end{pmatrix}=\begin{pmatrix}-2\\13\\4\end{pmatrix}`}
            schmal={t`\begin{gathered}\overrightarrow{OQ'}\\{}=\begin{pmatrix}2\\14\\12\end{pmatrix}-\begin{pmatrix}4\\1\\8\end{pmatrix}\\{}=\begin{pmatrix}-2\\13\\4\end{pmatrix}\end{gathered}`}
          />
          Der Spiegelpunkt ist <Formel tex={P("Q'", d.Qs)} nach="." />
        </>,
      ]}
    >
      <p>
        Gegeben sind die Gerade <Formel tex={t`g:\ \vec{x}=\begin{pmatrix}-1\\4\\0\end{pmatrix}+t\cdot\begin{pmatrix}2\\3\\6\end{pmatrix}`} /> und der Punkt <Formel tex={P('Q', d.Q)} nach="." /> Der Punkt <Formel tex="Q" /> liegt nicht auf <Formel tex="g" nach="." />
      </p>
      <Teile>
        <li>
          Bestimmen Sie die Koordinaten des Lotfußpunkts <Formel tex="F" /> von <Formel tex="Q" /> auf <Formel tex="g" nach="." /> <BE n={3} />
        </li>
        <li>
          Berechnen Sie den Abstand des Punkts <Formel tex="Q" /> von der Geraden <Formel tex="g" nach="." /> <BE n={1} />
        </li>
        <li>
          Bestimmen Sie die Koordinaten des Punkts <Formel tex="Q'" nach="," /> der entsteht, wenn man <Formel tex="Q" /> an der Geraden <Formel tex="g" /> spiegelt. <BE n={1} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

/** Aufgabe 6: Winkel einer Geraden mit der x₁x₂-Ebene, Punkt mit vorgegebener Höhe. */
function Aufgabe6() {
  const d = A6;
  return (
    <Aufgabe
      nummer="6"
      titel="Neigung einer Geraden"
      felder={[
        koord('x1', 'erste', 'X', 1, d.X[0]!),
        koord('x2', 'zweite', 'X', 2, d.X[1]!),
      ]}
      hilfen={[
        <>
          Der Winkel <Formel tex={t`\alpha`} /> einer Geraden mit der <Formel tex={t`x_1x_2`} />-Ebene folgt aus <Formel tex={t`\sin\alpha=\dfrac{|u_3|}{|\vec{u}|}`} nach="," /> wobei <Formel tex={t`u_3`} /> die dritte Koordinate des Richtungsvektors ist (<Modulverweis modul="schnittwinkel-geraden">Schnittwinkel von Geraden und Winkel zu den Koordinatenebenen</Modulverweis>).
        </>,
        <>
          Berechne <Formel tex={t`|\vec{u}|`} nach="." /> Der Bruch lässt sich vereinfachen, und du erkennst den Sinuswert eines bekannten Winkels.
        </>,
        <>
          Für die zweite Teilaufgabe setzt du die dritte Koordinatengleichung gleich 10, bestimmst <Formel tex="t" /> und berechnest damit die anderen beiden Koordinaten.
        </>,
      ]}
      loesung={[
        <>
          a: Der Richtungsvektor ist <Formel tex={t`\vec{u}=\begin{pmatrix}3\\4\\5\end{pmatrix}`} /> mit
          <Umbruchformel
            tex={t`|\vec{u}|=\sqrt{9+16+25}=\sqrt{50}=5\sqrt{2}`}
            schmal={t`\begin{gathered}|\vec{u}|\\{}=\sqrt{9+16+25}\\{}=\sqrt{50}\\{}=5\sqrt{2}\end{gathered}`}
          />
          Damit gilt
          <Umbruchformel
            tex={t`\sin\alpha=\frac{|u_3|}{|\vec{u}|}=\frac{5}{5\sqrt{2}}=\frac{1}{\sqrt{2}}`}
            schmal={t`\begin{gathered}\sin\alpha\\{}=\frac{5}{5\sqrt{2}}\\{}=\frac{1}{\sqrt{2}}\end{gathered}`}
          />
          Das ist der Sinus von 45°. Also schneidet <Formel tex="g" /> die <Formel tex={t`x_1x_2`} />-Ebene unter einem Winkel von 45°.
        </>,
        <>
          b: Die dritte Koordinate ist <Formel tex={t`-5+5t`} nach="." /> Aus <Formel tex={t`-5+5t=10`} /> folgt <Formel tex={t`t=3`} nach="." /> Damit ist
          <Umbruchformel
            tex={t`\overrightarrow{OX}=\begin{pmatrix}2\\1\\-5\end{pmatrix}+3\cdot\begin{pmatrix}3\\4\\5\end{pmatrix}=\begin{pmatrix}11\\13\\10\end{pmatrix}`}
            schmal={t`\begin{gathered}\overrightarrow{OX}\\{}=\begin{pmatrix}2\\1\\-5\end{pmatrix}+3\cdot\begin{pmatrix}3\\4\\5\end{pmatrix}\\{}=\begin{pmatrix}11\\13\\10\end{pmatrix}\end{gathered}`}
          />
          Der Punkt ist <Formel tex={P('X', d.X)} nach="." />
        </>,
      ]}
    >
      <p>
        Gegeben ist die Gerade <Formel tex={t`g:\ \vec{x}=\begin{pmatrix}2\\1\\-5\end{pmatrix}+t\cdot\begin{pmatrix}3\\4\\5\end{pmatrix}`} nach="." />
      </p>
      <Teile>
        <li>
          Weisen Sie nach, dass <Formel tex="g" /> die <Formel tex={t`x_1x_2`} />-Ebene unter einem Winkel von 45° schneidet. <BE n={3} />
        </li>
        <li>
          Bestimmen Sie die Koordinaten des Punkts <Formel tex="X" /> auf <Formel tex="g" /> mit der dritten Koordinate 10. Geben Sie die erste und die zweite Koordinate an. <BE n={2} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

export function OhneHilfsmittel() {
  return (
    <Abschnitt id="ohne-hilfsmittel" titel="Ohne Hilfsmittel">
      <p>
        Sechs kurze Aufgaben mit je 5 Bewertungseinheiten. Du rechnest ohne Taschenrechner, die Ergebnisse sind ganze Zahlen. Die Teilaufgaben tragen die Bewertungseinheiten (BE), die du für sie in einer Prüfung bekommen könntest.
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
