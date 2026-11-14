import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur, KontrollFigur } from '@/components/Raumfigur';
import { BE, Teile } from '@/components/Teilaufgaben';
import { Umbruchformel } from '@/components/Umbruchformel';
import { t } from '@/lib/modulhilfen';
import { PYRAMIDE, raumPyramide } from './Bilder';
import { A9 } from './daten';
import { GeradeFormel, Kette, Liste, P, feld, koord, sp } from './hilfen';

/** Aufgabe 9: Glaspyramide mit Schacht: Ebene einer Seitenfläche, Durchstoßpunkt, Lage im Dreieck, Abstand. */
function Aufgabe9() {
  const d = A9;
  return (
    <Aufgabe
      nummer="9"
      titel="Glaspyramide mit Kabelschacht"
      felder={[
        feld('n1', 'Koeffizient von x1', <>Koeffizient von <Formel tex="x_1" /></>, d.n[0]!),
        feld('n2', 'Koeffizient von x2', <>Koeffizient von <Formel tex="x_2" /></>, d.n[1]!),
        feld('n3', 'Koeffizient von x3', <>Koeffizient von <Formel tex="x_3" /></>, d.n[2]!),
        feld('b', 'rechte Seite der Gleichung', <>rechte Seite <Formel tex="b" /></>, d.d),
        koord('x1', 'X', 1, d.X[0]),
        koord('x2', 'X', 2, d.X[1]),
        koord('x3', 'X', 3, d.X[2]),
        feld('a', 'Abstand in Metern', <>Abstand von <Formel tex="K" /> zur Ebene in Metern</>, d.abstand, 0.01),
      ]}
      hilfen={[
        <>
          Die Seitenfläche <Formel tex={t`BCS`} /> liegt in einer Ebene, die durch die drei Eckpunkte festgelegt ist. Zwei Spannvektoren und ihr Vektorprodukt (Kreuzprodukt) liefern einen Normalenvektor (<Modulverweis modul="normalenform-koordinatenform">Normalenform und Koordinatenform</Modulverweis>).
        </>,
        <>
          Der Schacht ist eine Gerade. Wo sie die Seitenfläche durchstößt, bestimmst du mit der Geradenprobe in der Koordinatengleichung der Ebene (<Modulverweis modul="gerade-und-ebene">Gerade und Ebene: gegenseitige Lage</Modulverweis>).
        </>,
        <>
          Ein Punkt liegt im Dreieck <Formel tex={t`BCS`} nach="," /> wenn er sich als <Formel tex={t`\overrightarrow{OB}+r\cdot\overrightarrow{BC}+s\cdot\overrightarrow{BS}`} /> schreiben lässt mit <Formel tex={t`r\ge 0`} nach="," /> <Formel tex={t`s\ge 0`} /> und <Formel tex={t`r+s\le 1`} nach="." /> Zwei der drei Koordinatengleichungen legen <Formel tex="r" /> und <Formel tex="s" /> fest, die dritte ist die Probe.
        </>,
        <>
          Der kürzeste Weg von <Formel tex="K" /> zur Ebene ist das Lot. Der Abstand folgt aus der Abstandsformel (<Modulverweis modul="abstaende-ebenen">Abstände zu Ebenen</Modulverweis>).
        </>,
      ]}
      loesung={[
        <>
          a: Die Spannvektoren der Seitenfläche sind
          <Liste z={[t`\overrightarrow{BC}=${sp([0, 4, 0])}`, t`\overrightarrow{BS}=${sp([-2, 2, 4])}`]} />
          Das Vektorprodukt (Kreuzprodukt) ist
          <Umbruchformel
            tex={t`\overrightarrow{BC}\times\overrightarrow{BS}=${sp(d.kreuz)}=8\cdot${sp(d.n)}`}
            schmal={t`\begin{gathered}\overrightarrow{BC}\times\overrightarrow{BS}\\{}=${sp(d.kreuz)}\\{}=8\cdot${sp(d.n)}\end{gathered}`}
          />
          Mit <Formel tex={t`\vec{n}=${sp(d.n)}`} /> und dem Punkt <Formel tex={P('B', d.B)} /> ist
          <Kette z={[t`b`, t`2\cdot 1+0\cdot(-3)+1\cdot 0`, t`2`]} />
          Die Ebene der Seitenfläche ist <Formel tex={t`E:\ 2x_1+x_3=2`} nach="." /> Probe mit <Formel tex={P('C', d.C)} nach=":" /> <Formel tex={t`2+0=2`} nach="." /> Probe mit <Formel tex={P('S', d.S)} nach=":" /> <Formel tex={t`-2+4=2`} nach="."/>
        </>,
        <>
          b: Die Koordinaten der Geraden sind <Formel tex={t`(-1+2t\,|\,-3t\,|\,1+2t)`} nach="." /> Die Geradenprobe in <Formel tex="E" /> liefert
          <Kette z={[t`2(-1+2t)+(1+2t)`, t`-2+4t+1+2t`, t`-1+6t`, t`2`]} />
          Aus <Formel tex={t`-1+6t=2`} /> folgt <Formel tex={t`t=\frac{1}{2}`} nach="." />
          <Umbruchformel
            tex={t`\overrightarrow{OX}=${sp(d.K)}+\frac{1}{2}\cdot${sp(d.u)}=\begin{pmatrix}0\\-\frac{3}{2}\\2\end{pmatrix}`}
            schmal={t`\begin{gathered}\overrightarrow{OX}\\{}=${sp(d.K)}+\frac{1}{2}\cdot${sp(d.u)}\\{}=\begin{pmatrix}0\\-\frac{3}{2}\\2\end{pmatrix}\end{gathered}`}
          />
          Der Schacht durchstößt die Seitenfläche im Punkt <Formel tex={t`X(0\,|\,-1{,}5\,|\,2)`} nach="." />
        </>,
        <>
          c: Es ist <Formel tex={t`\overrightarrow{BX}=${sp([-1, 1.5, 2])}`} nach="." /> Der Ansatz <Formel tex={t`\overrightarrow{BX}=r\cdot\overrightarrow{BC}+s\cdot\overrightarrow{BS}`} /> ergibt
          <Liste z={[t`\mathrm{I}:\ -2s=-1`, t`\mathrm{II}:\ 4r+2s=1{,}5`, t`\mathrm{III}:\ 4s=2`]} />
          Aus I folgt <Formel tex={t`s=\frac{1}{2}`} nach="." /> Gleichung III ist mit diesem Wert erfüllt. Aus II folgt <Formel tex={t`4r=0{,}5`} /> und <Formel tex={t`r=\frac{1}{8}`} nach="." /> Es gilt <Formel tex={t`r\ge 0`} nach="," /> <Formel tex={t`s\ge 0`} /> und <Formel tex={t`r+s=\frac{5}{8}\le 1`} nach="." /> Also liegt <Formel tex="X" /> im Dreieck <Formel tex={t`BCS`} nach="," /> der Schacht tritt durch die Glasfläche aus.
        </>,
        <>
          d: Es ist <Formel tex={t`|\vec{n}|=\sqrt{4+0+1}=\sqrt{5}`} /> und <Formel tex={t`\vec{n}\cdot\vec{k}=-2+1=-1`} nach="." /> Damit gilt
          <Umbruchformel
            tex={t`d=\frac{|-1-2|}{\sqrt{5}}=\frac{3}{\sqrt{5}}\approx 1{,}34`}
            schmal={t`\begin{gathered}d=\frac{|-1-2|}{\sqrt{5}}\\{}=\frac{3}{\sqrt{5}}\\{}\approx 1{,}34\end{gathered}`}
          />
          Der Sensor ist etwa 1,34 m von der Seitenfläche entfernt. Der Schacht von <Formel tex="K" /> bis <Formel tex="X" /> ist mit der Länge <Formel tex={t`\frac{1}{2}\cdot|\vec{u}|=\frac{1}{2}\sqrt{17}\approx 2{,}06`} /> m länger, weil er nicht senkrecht zur Fläche verläuft.
        </>,
      ]}
    >
      <p>
        Ein Glasdach hat die Form einer Pyramide mit der quadratischen Grundfläche <Formel tex={t`ABCD`} /> in der <Formel tex={t`x_1x_2`} />-Ebene und der Spitze <Formel tex="S" nach="." /> Eine Längeneinheit entspricht 1 m. Die Eckpunkte sind <Formel tex={P('A', d.A)} nach="," /> <Formel tex={P('B', d.B)} nach="," /> <Formel tex={P('C', d.C)} nach="," /> <Formel tex={P('D', d.D)} /> und <Formel tex={P('S', d.S)} nach="." />
      </p>
      <p>
        Im Innern befindet sich im Punkt <Formel tex={P('K', d.K)} /> ein Sensor. Von ihm führt ein gerader Kabelschacht
      </p>
      <GeradeFormel p={d.K} u={d.u} />
      <p>
        nach außen durch die Seitenfläche <Formel tex={t`BCS`} nach="." />
      </p>
      <Figur spec={raumPyramide(false, PYRAMIDE)} unter={<>Die Pyramide <Formel tex={t`ABCDS`} /> mit der Seitenfläche <Formel tex={t`BCS`} /> (grün), dem Sensor <Formel tex="K" /> und dem Schacht (orange), über die Seitenfläche hinaus gezeichnet.</>} />
      <Teile>
        <li>
          Bestimmen Sie eine Koordinatengleichung der Ebene <Formel tex="E" nach="," /> in der die Seitenfläche <Formel tex={t`BCS`} /> liegt. Die Koeffizienten sollen teilerfremde ganze Zahlen sein, der Koeffizient von <Formel tex="x_1" /> positiv. <BE n={3} />
        </li>
        <li>
          Bestimmen Sie die Koordinaten des Punkts <Formel tex="X" nach="," /> in dem der Schacht die Ebene <Formel tex="E" /> durchstößt. <BE n={3} />
        </li>
        <li>
          Zeigen Sie, dass der Punkt <Formel tex="X" /> im Dreieck <Formel tex={t`BCS`} /> liegt. <BE n={2} />
        </li>
        <li>
          Berechnen Sie den kürzesten Abstand des Sensors <Formel tex="K" /> von der Seitenfläche <Formel tex={t`BCS`} /> in Metern. <BE n={2} />
        </li>
      </Teile>
      <KontrollFigur spec={raumPyramide(true, PYRAMIDE)} unter={<>Der Schacht durchstößt die Seitenfläche im Punkt <Formel tex="X" nach="." /> Die rosa Strecke ist das Lot von <Formel tex="K" /> auf die Ebene <Formel tex="E" nach="," /> ihre Länge ist der Abstand aus Teilaufgabe d.</>} />
    </Aufgabe>
  );
}

export function Problemloesen() {
  return (
    <Abschnitt id="problemloesen" titel="Pyramide mit Schacht">
      <p>
        Eine Aufgabe mit Taschenrechner und 10 Bewertungseinheiten, die mehrere Verfahren der Ebenen verbindet: Ebene aus drei Punkten, Durchstoßpunkt einer Geraden, Lage in einem Dreieck und Abstand. Sie folgt dem Aufbau der Prüfungsaufgaben mit einer Pyramide, in die ein Schacht führt.
      </p>
      <Hinweis titel="Eingabe">
        Gib Zahlen als Dezimalzahl mit Komma ein, ohne Einheit. Brüche wie <Formel tex={t`\frac{3}{2}`} /> sind erlaubt. Bei der Rundung genügen zwei Nachkommastellen.
      </Hinweis>
      <Aufgabe9 />
    </Abschnitt>
  );
}
